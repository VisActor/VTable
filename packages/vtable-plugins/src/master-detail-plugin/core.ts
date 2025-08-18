import * as VTable from '@visactor/vtable';
import type { MasterDetailPluginOptions, DetailGridOptions } from './types';
import { getInternalProps, getRecordByRowIndex, getOriginalRowHeight } from './utils';
import { ConfigManager } from './config';
import { EventManager } from './events';
import { SubTableManager } from './subtable';

/**
 * 主从表插件核心类
 */
export class MasterDetailPlugin implements VTable.plugins.IVTablePlugin {
  id = `master-detail-${Date.now()}`;
  name = 'Master Detail Plugin';
  runTime = [
    VTable.TABLE_EVENT_TYPE.BEFORE_INIT,
    VTable.TABLE_EVENT_TYPE.INITIALIZED,
    VTable.TABLE_EVENT_TYPE.SORT_CLICK,
    VTable.TABLE_EVENT_TYPE.AFTER_SORT,
    VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_CELL_CONTENT_WIDTH,
    VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT
  ];

  pluginOptions: MasterDetailPluginOptions;
  table: VTable.ListTable;
  // 模块管理器
  private configManager: ConfigManager;
  private eventManager: EventManager;
  private subTableManager: SubTableManager;
  // 原始updateCellContent方法的引用
  private originalUpdateCellContent?: Function;
  // 容器大小监听器
  private resizeObserver?: ResizeObserver;

  constructor(pluginOptions: MasterDetailPluginOptions = {}) {
    this.id = pluginOptions.id ?? this.id;
    this.pluginOptions = pluginOptions;
  }

  run(...args: unknown[]): boolean | void {
    const eventArgs = args[0];
    const runTime = args[1];
    const table = args[2] as VTable.ListTable;

    if (runTime === VTable.TABLE_EVENT_TYPE.BEFORE_INIT) {
      this.table = table;
      this.initializeManagers();
      this.configManager.injectMasterDetailOptions(
        (eventArgs as { options: VTable.ListTableConstructorOptions }).options
      );
    } else if (runTime === VTable.TABLE_EVENT_TYPE.INITIALIZED) {
      this.setupMasterDetailFeatures();
    } else if (runTime === VTable.TABLE_EVENT_TYPE.SORT_CLICK) {
      // 排序前处理：保存展开状态并收起所有行
      this.eventManager.executeMasterDetailBeforeSort();
      return true;
    } else if (runTime === VTable.TABLE_EVENT_TYPE.AFTER_SORT) {
      // 排序后处理：恢复展开状态
      this.eventManager.executeMasterDetailAfterSort();
    } else if (runTime === VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_CELL_CONTENT_WIDTH) {
      // 单元格内容处理
      this.eventManager.handleAfterUpdateCellContentWidth(eventArgs as any);
    } else if (runTime === VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT) {
      // 高亮处理
      this.eventManager.handleAfterUpdateSelectBorderHeight(eventArgs as any);
    }
  }

  /**
   * 初始化管理器
   */
  private initializeManagers(): void {
    this.configManager = new ConfigManager(this.pluginOptions, this.table);
    this.eventManager = new EventManager(this.table);
    this.subTableManager = new SubTableManager(this.table);

    // 设置配置管理器的行展开状态检查函数
    this.configManager.setRowExpandedChecker((row: number) => this.eventManager.isRowExpanded(row));

    // 设置事件管理器的回调函数
    this.eventManager.setCallbacks({
      onUpdateSubTablePositions: () => this.subTableManager.updateSubTablePositionsForResize(),
      onExpandRow: (rowIndex: number) => this.expandRow(rowIndex),
      onCollapseRow: (rowIndex: number) => this.collapseRow(rowIndex),
      onToggleRowExpand: (rowIndex: number) => this.toggleRowExpand(rowIndex),
      getOriginalRowHeight: (bodyRowIndex: number) => getOriginalRowHeight(this.table, bodyRowIndex)
    });

    // 设置子表管理器的回调函数
    this.subTableManager.setCallbacks({
      getDetailConfigForRecord: (record, bodyRowIndex) =>
        this.configManager.getDetailConfigForRecord(record, bodyRowIndex),
      redrawAllUnderlines: () => this.redrawAllUnderlines()
    });
  }

  /**
   * 设置主从表功能
   */
  private setupMasterDetailFeatures(): void {
    // 初始化内部属性
    this.initInternalProps();
    // 绑定事件处理器
    this.eventManager.bindEventHandlers();
    // 扩展表格 API
    this.extendTableAPI();
  }

  /**
   * 初始化内部属性
   */
  private initInternalProps(): void {
    const internalProps = getInternalProps(this.table);
    internalProps.expandedRecordIndices = [];
    internalProps.subTableInstances = new Map();
    internalProps.originalRowHeights = new Map();
  }

  /**
   * 扩展表格 API
   */
  private extendTableAPI(): void {
    const table = this.table as any;
    this.originalUpdateCellContent = table.scenegraph.updateCellContent.bind(table.scenegraph);
    table.scenegraph.updateCellContent = this.protectedUpdateCellContent.bind(this);

    // 拦截 updatePagination 方法，在分页切换时收起所有展开的行
    const originalUpdatePagination = table.updatePagination.bind(table);
    table.updatePagination = (pagination: VTable.TYPES.IPagination) => {
      const internalProps = getInternalProps(this.table);
      const currentExpandedRows = [...this.eventManager.getExpandedRows()];
      currentExpandedRows.forEach(rowIndex => {
        const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
        const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
        if (internalProps.expandedRecordIndices && !internalProps.expandedRecordIndices.includes(recordIndex)) {
          internalProps.expandedRecordIndices.push(recordIndex);
        }
      });
      currentExpandedRows.forEach(rowIndex => {
        this.collapseRowToNoRealRecordIndex(rowIndex);
      });
      const result = originalUpdatePagination(pagination);
      setTimeout(() => {
        this.restoreExpandedStatesAfter();
      }, 0);

      return result;
    };

    // 拦截 toggleHierarchyState 方法，仅在表头分组折叠/展开时保持展开状态
    const originalToggleHierarchyState = table.toggleHierarchyState.bind(table);
    table.toggleHierarchyState = (col: number, row: number, recalculateColWidths: boolean = true) => {
      // 只有当操作的是表头时，才进行状态保存和恢复
      if (this.table.isHeader(col, row)) {
        const internalProps = getInternalProps(this.table);
        const currentExpandedRows = [...this.eventManager.getExpandedRows()];
        currentExpandedRows.forEach(rowIndex => {
          const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
          if (realRecordIndex === undefined || realRecordIndex === null) {
            return;
          }
          const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
          if (internalProps.expandedRecordIndices && !internalProps.expandedRecordIndices.includes(recordIndex)) {
            internalProps.expandedRecordIndices.push(recordIndex);
          }
        });
        currentExpandedRows.forEach(rowIndex => {
          this.collapseRowToNoRealRecordIndex(rowIndex);
        });
        const result = originalToggleHierarchyState(col, row, recalculateColWidths);
        setTimeout(() => {
          this.restoreExpandedStatesAfter();
        }, 0);

        return result;
      }
      return originalToggleHierarchyState(col, row, recalculateColWidths);
    };

    // 拦截 updateFilterRules 方法，在过滤时保持展开状态
    const originalUpdateFilterRules = table.updateFilterRules.bind(table);
    table.updateFilterRules = (filterRules: VTable.TYPES.FilterRules) => {
      const internalProps = getInternalProps(this.table);
      // 保存当前展开的记录索引
      const currentExpandedRows = [...this.eventManager.getExpandedRows()];
      currentExpandedRows.forEach(rowIndex => {
        const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
        if (realRecordIndex === undefined || realRecordIndex === null) {
          return;
        }
        const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
        if (internalProps.expandedRecordIndices && !internalProps.expandedRecordIndices.includes(recordIndex)) {
          internalProps.expandedRecordIndices.push(recordIndex);
        }
      });
      currentExpandedRows.forEach(rowIndex => {
        this.collapseRowToNoRealRecordIndex(rowIndex);
      });
      const result = originalUpdateFilterRules(filterRules);
      setTimeout(() => {
        this.restoreExpandedStatesAfterFilter();
      }, 0);

      return result;
    };
  }

  /**
   * 分页后恢复展开状态
   */
  private restoreExpandedStatesAfter(): void {
    const internalProps = getInternalProps(this.table);
    if (!internalProps.expandedRecordIndices || internalProps.expandedRecordIndices.length === 0) {
      return;
    }
    // 获取当前分页的索引数据
    const currentPagerData = (this.table.dataSource as any)._currentPagerIndexedData;
    if (!currentPagerData) {
      return;
    }
    internalProps.expandedRecordIndices.forEach(recordIndex => {
      try {
        const bodyRowIndex = currentPagerData.indexOf(recordIndex);
        if (bodyRowIndex >= 0) {
          const targetRowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
          this.expandRowToNoRealRecordIndex(targetRowIndex);
        }
      } catch (error) {
        console.warn(`处理记录索引 ${recordIndex} 时出错:`, error);
      }
    });
  }

  private restoreExpandedStatesAfterFilter(): void {
    const internalProps = getInternalProps(this.table);
    if (!internalProps.expandedRecordIndices || internalProps.expandedRecordIndices.length === 0) {
      return;
    }
    const originalDataSource = this.table.dataSource.dataSourceObj?.records || this.table.dataSource.records;
    if (!originalDataSource) {
      return;
    }
    internalProps.expandedRecordIndices.forEach(recordIndex => {
      try {
        // 获取需要展开的记录对象
        const targetRecord = originalDataSource[recordIndex];
        if (!targetRecord) {
          return;
        }
        for (
          let rowIndex = this.table.columnHeaderLevelCount;
          rowIndex < this.table.rowCount - this.table.bottomFrozenRowCount;
          rowIndex++
        ) {
          const record = this.table.getCellRawRecord(0, rowIndex);
          if (record === targetRecord) {
            // 找到了对应的行，展开它
            this.expandRowToNoRealRecordIndex(rowIndex);
            break; // 找到就跳出内层循环
          }
        }
      } catch (error) {
        console.warn(`处理记录索引 ${recordIndex} 时出错:`, error);
      }
    });
  }
  /**
   * 保护的updateCellContent方法
   */
  private protectedUpdateCellContent(col: number, row: number, forceFastUpdate: boolean = false): any {
    // 调用原始的updateCellContent方法
    const result = this.originalUpdateCellContent?.(col, row, forceFastUpdate);
    // 检查是否是展开行，如果是则恢复原始高度并绘制下划线
    const isExpandedRow = this.eventManager.isRowExpanded(row);
    if (isExpandedRow) {
      const bodyRowIndex = row - this.table.columnHeaderLevelCount;
      const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
      if (originalHeight > 0) {
        const cellGroup = this.table.scenegraph.getCell(col, row);
        if (cellGroup) {
          // 直接设置为原始高度
          cellGroup.setAttributes({
            height: originalHeight
          });
          // 在CellGroup重绘时自动绘制下划线
          this.addUnderlineToCell(cellGroup, originalHeight);
        }
      }
    }
    // 处理单元格内容的垂直对齐
    const cellGroup = this.table.scenegraph.getCell(col, row);
    if (cellGroup) {
      this.eventManager.handleAfterUpdateCellContentWidth({
        col,
        row,
        distWidth: 0,
        cellHeight: cellGroup.attribute?.height || 0,
        detaX: 0,
        autoRowHeight: false,
        needUpdateRowHeight: false,
        cellGroup,
        padding: [0, 0, 0, 0],
        textAlign: 'left' as CanvasTextAlign,
        textBaseline: 'middle' as CanvasTextBaseline
      });
    }
    return result;
  }

  /**
   * 展开行
   */
  expandRow(rowIndex: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = getInternalProps(this.table);
    if (this.eventManager.isRowExpanded(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    if (realRecordIndex === undefined || realRecordIndex === null) {
      return;
    }
    const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
    if (internalProps.expandedRecordIndices) {
      if (!internalProps.expandedRecordIndices.includes(recordIndex)) {
        internalProps.expandedRecordIndices.push(recordIndex);
      }
    }

    // 更新展开状态数组
    this.eventManager.addExpandedRow(rowIndex);

    const originalHeight = this.table.getRowHeight(rowIndex);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.set(bodyRowIndex, originalHeight);
    }
    const record = getRecordByRowIndex(this.table, bodyRowIndex);
    const detailConfig = this.configManager.getDetailConfigForRecord(record, bodyRowIndex);
    const height = detailConfig?.style?.height || 200;

    const deltaHeight = height;
    this.updateRowHeightForExpand(rowIndex, deltaHeight);
    this.table.scenegraph.updateContainerHeight(rowIndex, deltaHeight);
    internalProps._heightResizedRowMap.add(rowIndex);

    this.subTableManager.renderSubTable(bodyRowIndex, (record, bodyRowIndex) =>
      this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.subTableManager.recalculateAllSubTablePositions(
      bodyRowIndex + 1,
      undefined,
      (record: unknown, bodyRowIndex: number) => this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.drawUnderlineForRow(rowIndex, originalHeight);
    this.refreshRowIcon(rowIndex);
  }

  /**
   * 收起行
   */
  collapseRow(rowIndex: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = getInternalProps(this.table);

    if (!this.eventManager.isRowExpanded(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    if (realRecordIndex === undefined || realRecordIndex === null) {
      return;
    }
    const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
    this.subTableManager.removeSubTable(bodyRowIndex);
    if (internalProps.expandedRecordIndices) {
      const index = internalProps.expandedRecordIndices.indexOf(recordIndex);
      if (index > -1) {
        internalProps.expandedRecordIndices.splice(index, 1);
      }
    }

    // 更新展开状态数组
    this.eventManager.removeExpandedRow(rowIndex);

    const currentHeight = this.table.getRowHeight(rowIndex);
    const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
    const deltaHeight = currentHeight - originalHeight;
    this.updateRowHeightForExpand(rowIndex, -deltaHeight);
    internalProps._heightResizedRowMap.delete(rowIndex);
    this.table.scenegraph.updateContainerHeight(rowIndex, -deltaHeight);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.delete(bodyRowIndex);
    }

    this.removeUnderlineFromRow(rowIndex);
    this.subTableManager.recalculateAllSubTablePositions(
      bodyRowIndex + 1,
      undefined,
      (record: unknown, bodyRowIndex: number) => this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.refreshRowIcon(rowIndex);
  }

  /**
   * 展开行（不修改expandedRecordIndices）
   */
  private expandRowToNoRealRecordIndex(rowIndex: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = getInternalProps(this.table);
    if (this.eventManager.isRowExpanded(rowIndex)) {
      return;
    }
    this.eventManager.addExpandedRow(rowIndex);
    const originalHeight = this.table.getRowHeight(rowIndex);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.set(bodyRowIndex, originalHeight);
    }
    const record = getRecordByRowIndex(this.table, bodyRowIndex);
    const detailConfig = this.configManager.getDetailConfigForRecord(record, bodyRowIndex);
    const height = detailConfig?.style?.height || 200;

    const deltaHeight = height;
    this.updateRowHeightForExpand(rowIndex, deltaHeight);
    this.table.scenegraph.updateContainerHeight(rowIndex, deltaHeight);
    internalProps._heightResizedRowMap.add(rowIndex);

    this.subTableManager.renderSubTable(bodyRowIndex, (record, bodyRowIndex) =>
      this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.subTableManager.recalculateAllSubTablePositions(
      bodyRowIndex + 1,
      undefined,
      (record: unknown, bodyRowIndex: number) => this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.drawUnderlineForRow(rowIndex, originalHeight);
    this.refreshRowIcon(rowIndex);
  }

  /**
   * 收起行（不修改expandedRecordIndices）
   */
  private collapseRowToNoRealRecordIndex(rowIndex: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = getInternalProps(this.table);

    if (!this.eventManager.isRowExpanded(rowIndex)) {
      return;
    }
    this.subTableManager.removeSubTable(bodyRowIndex);
    this.eventManager.removeExpandedRow(rowIndex);
    const currentHeight = this.table.getRowHeight(rowIndex);
    const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
    const deltaHeight = currentHeight - originalHeight;
    this.updateRowHeightForExpand(rowIndex, -deltaHeight);
    internalProps._heightResizedRowMap.delete(rowIndex);
    this.table.scenegraph.updateContainerHeight(rowIndex, -deltaHeight);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.delete(bodyRowIndex);
    }

    this.removeUnderlineFromRow(rowIndex);
    this.subTableManager.recalculateAllSubTablePositions(
      bodyRowIndex + 1,
      undefined,
      (record: unknown, bodyRowIndex: number) => this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.refreshRowIcon(rowIndex);
  }

  /**
   * 切换行展开状态
   */
  toggleRowExpand(rowIndex: number): void {
    if (this.eventManager.isRowExpanded(rowIndex)) {
      this.collapseRow(rowIndex);
    } else {
      this.expandRow(rowIndex);
    }
  }

  /**
   * 更新行高用于展开
   */
  private updateRowHeightForExpand(rowIndex: number, deltaHeight: number): void {
    // 使用 VTable 的内部方法更新行高
    this.table._setRowHeight(rowIndex, this.table.getRowHeight(rowIndex) + deltaHeight, true);

    // 更新以下行的位置
    const rowStart = rowIndex + 1;
    let rowEnd = 0;

    if (rowIndex < this.table.frozenRowCount) {
      rowEnd = this.table.frozenRowCount - 1;
    } else if (rowIndex >= this.table.rowCount - this.table.bottomFrozenRowCount) {
      rowEnd = this.table.rowCount - 1;
    } else {
      rowEnd = Math.min(
        (this.table.scenegraph as { proxy: { rowEnd: number } }).proxy.rowEnd,
        this.table.rowCount - this.table.bottomFrozenRowCount - 1
      );
    }

    // 更新以下行位置
    for (let colIndex = 0; colIndex < this.table.colCount; colIndex++) {
      for (let rowIdx = rowStart; rowIdx <= rowEnd; rowIdx++) {
        const cellGroup = this.table.scenegraph.highPerformanceGetCell(colIndex, rowIdx);
        if (cellGroup.role === 'cell') {
          cellGroup.setAttribute('y', cellGroup.attribute.y + deltaHeight);
        }
      }
    }
  }

  /**
   * 为指定行绘制下划线
   */
  private drawUnderlineForRow(rowIndex: number, originalHeight: number): void {
    const sceneGraph = (this.table as any).scenegraph;
    if (!sceneGraph) {
      return;
    }
    // 获取指定行的所有cell
    const rowCells = this.getRowCells(rowIndex);
    if (rowCells.length === 0) {
      return;
    }
    rowCells.forEach((cellGroup: any, index: number) => {
      if (cellGroup && cellGroup.attribute) {
        // 为这个cell添加下划线渲染逻辑
        this.addUnderlineToCell(cellGroup, originalHeight);
      }
    });
    // 触发重新渲染
    this.table.scenegraph.updateNextFrame();
  }

  /**
   * 获取指定行的所有cell元素
   */
  private getRowCells(rowIndex: number): any[] {
    const sceneGraph = (this.table as any).scenegraph;
    const cells: any[] = [];
    // 遍历所有组找到指定行的cell
    const traverse = (group: any) => {
      if (group.role === 'cell' && group.row === rowIndex) {
        cells.push(group);
      }
      if (group.children) {
        group.children.forEach((child: any) => traverse(child));
      }
    };
    if (sceneGraph.stage) {
      traverse(sceneGraph.stage);
    }
    return cells;
  }

  /**
   * 为cell添加下划线
   */
  private addUnderlineToCell(cellGroup: any, originalHeight: number): void {
    // 在CellGroup重绘时正确绘制下划线
    const currentAttr = cellGroup.attribute;
    const currentStrokeArrayWidth =
      currentAttr.strokeArrayWidth ||
      (currentAttr.lineWidth
        ? [currentAttr.lineWidth, currentAttr.lineWidth, currentAttr.lineWidth, currentAttr.lineWidth]
        : [1, 1, 1, 1]);
    const currentStrokeArrayColor =
      currentAttr.strokeArrayColor ||
      (currentAttr.stroke
        ? [currentAttr.stroke, currentAttr.stroke, currentAttr.stroke, currentAttr.stroke]
        : ['transparent', 'transparent', 'transparent', 'transparent']);
    const isAlreadyEnhanced = cellGroup._hasUnderline;
    if (!isAlreadyEnhanced) {
      // 第一次添加下划线，存储原始样式
      cellGroup._originalStrokeArrayWidth = [...currentStrokeArrayWidth];
      cellGroup._originalStrokeArrayColor = [...currentStrokeArrayColor];
      cellGroup._hasUnderline = true;
    }
    const originalStrokeArrayWidth = cellGroup._originalStrokeArrayWidth || currentStrokeArrayWidth;
    const originalStrokeArrayColor = cellGroup._originalStrokeArrayColor || currentStrokeArrayColor;
    const enhancedStrokeArrayWidth = [...originalStrokeArrayWidth];
    const enhancedStrokeArrayColor = [...originalStrokeArrayColor];
    const dpr = (this.table as any).internalProps?.pixelRatio || window.devicePixelRatio || 1;
    // 要还原本来的下划线的效果，那么我们应该要加上下一行的上划线的因为我记得原本的线是叠层的
    const enhancedWidth = ((originalStrokeArrayWidth[2] || 1) * 0.75 + (originalStrokeArrayWidth[0] || 1) * 0.75) * dpr;
    enhancedStrokeArrayWidth[2] = enhancedWidth;
    if (originalStrokeArrayColor[2] === 'transparent' || !originalStrokeArrayColor[2]) {
      const theme = (this.table as any).theme;
      enhancedStrokeArrayColor[2] = theme?.bodyStyle?.borderColor || '#e1e4e8';
    } else {
      enhancedStrokeArrayColor[2] = originalStrokeArrayColor[2];
    }
    cellGroup.setAttributes({
      strokeArrayWidth: enhancedStrokeArrayWidth,
      strokeArrayColor: enhancedStrokeArrayColor,
      stroke: true
    });
  }

  /**
   * 删除展开行的下划线
   */
  private removeUnderlineFromRow(rowIndex: number): void {
    // 获取指定行的所有cell
    const rowCells = this.getRowCells(rowIndex);
    rowCells.forEach((cellGroup: any, index: number) => {
      if (cellGroup && cellGroup._hasUnderline) {
        this.removeUnderlineFromCell(cellGroup);
      }
    });
    // 触发重新渲染
    this.table.scenegraph.updateNextFrame();
  }

  /**
   * 从cell中删除下划线，恢复原始strokeArray样式
   */
  private removeUnderlineFromCell(cellGroup: any): void {
    if (cellGroup._hasUnderline) {
      // 恢复原始的strokeArray样式
      if (cellGroup._originalStrokeArrayWidth && cellGroup._originalStrokeArrayColor) {
        cellGroup.setAttributes({
          strokeArrayWidth: cellGroup._originalStrokeArrayWidth,
          strokeArrayColor: cellGroup._originalStrokeArrayColor
        });
        // 清理存储的原始样式
        delete cellGroup._originalStrokeArrayWidth;
        delete cellGroup._originalStrokeArrayColor;
      }
      // 清除下划线标记
      cellGroup._hasUnderline = false;
    }
  }

  /**
   * 重绘所有展开行的下划线
   */
  private redrawAllUnderlines(): void {
    this.eventManager.getExpandedRows().forEach(rowIndex => {
      const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
      const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
      if (originalHeight > 0) {
        // 先删除旧的下划线
        this.removeUnderlineFromRow(rowIndex);
        // 重新绘制下划线
        this.drawUnderlineForRow(rowIndex, originalHeight);
      }
    });
  }

  /**
   * 刷新行图标
   */
  private refreshRowIcon(rowIndex: number): void {
    // 检测是否有序号列，如果有则使用第二列，否则使用第一列
    const hasRowSeriesNumber = !!(this.table.options as any).rowSeriesNumber;
    const targetColumnIndex = hasRowSeriesNumber ? 1 : 0;
    // 触发目标列的重绘以更新图标状态
    const cellGroup = this.table.scenegraph.getCell(targetColumnIndex, rowIndex);
    if (cellGroup) {
      this.table.scenegraph.updateCellContent(targetColumnIndex, rowIndex);
    }
  }

  update(): void {
    if (this.table) {
      this.subTableManager.recalculateAllSubTablePositions(0, undefined, (record: unknown, bodyRowIndex: number) =>
        this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
      );
    }
  }

  release(): void {
    this.cleanupMasterDetailFeatures();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    this.eventManager?.cleanup();
    this.subTableManager?.cleanup();
    this.table = null as any;
  }

  /**
   * 清理主从表功能
   */
  private cleanupMasterDetailFeatures(): void {
    // 恢复原始的updateCellContent方法
    if (this.originalUpdateCellContent && this.table) {
      const table = this.table as any;
      // 检查 scenegraph 是否存在，避免在表格已经销毁时出错
      if (table.scenegraph) {
        table.scenegraph.updateCellContent = this.originalUpdateCellContent;
      }
      this.originalUpdateCellContent = undefined;
    }
  }
}
