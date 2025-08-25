import * as VTable from '@visactor/vtable';
import type { MasterDetailPluginOptions, DetailGridOptions } from './types';
import { getInternalProps, getRecordByRowIndex, getOriginalRowHeight } from './utils';
import { ConfigManager } from './config';
import { EventManager } from './events';
import { SubTableManager } from './subtable';
import { TableAPIExtensions } from './table-api-extensions';

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
    VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT,
    VTable.TABLE_EVENT_TYPE.BEFORE_CREATE_PROGRESS_BAR
  ];

  pluginOptions: MasterDetailPluginOptions;
  table: VTable.ListTable;
  // 模块管理器
  private configManager: ConfigManager;
  private eventManager: EventManager;
  private subTableManager: SubTableManager;
  private tableAPIExtensions: TableAPIExtensions;
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
    } else if (runTime === VTable.TABLE_EVENT_TYPE.BEFORE_CREATE_PROGRESS_BAR) {
      // progressbar 创建前处理：如果是展开行，修改高度为原始高度
      this.handleBeforeCreateProgressBar(eventArgs as any);
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
      onUpdateSubTablePositionsForRow: () => this.subTableManager.updateSubTablePositionsForRowResize(),
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
    // 创建 TableAPIExtensions 实例
    this.tableAPIExtensions = new TableAPIExtensions(
      this.table,
      this.configManager,
      this.eventManager,
      this.pluginOptions,
      {
        addUnderlineToCell: (cellGroup: any, originalHeight: number) =>
          this.addUnderlineToCell(cellGroup, originalHeight),
        applyMinimalHeightStrategy: (
          startRow: number,
          endRow: number,
          totalHeight: number,
          expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
          scenegraph: any
        ) => this.applyMinimalHeightStrategy(startRow, endRow, totalHeight, expandedRowsInfo, scenegraph),
        updateOriginalHeightsAfterAdaptive: (
          expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
        ) => this.updateOriginalHeightsAfterAdaptive(expandedRowsInfo),
        collapseRowToNoRealRecordIndex: (rowIndex: number) => this.collapseRowToNoRealRecordIndex(rowIndex),
        restoreExpandedStatesAfter: () => this.restoreExpandedStatesAfter(),
        collapseRow: (rowIndex: number) => this.collapseRow(rowIndex)
      }
    );

    // 执行API扩展
    this.tableAPIExtensions.extendTableAPI();
  }

  /**
   * 处理 progressbar 创建前的事件
   */
  private handleBeforeCreateProgressBar(eventArgs: {
    col: number;
    row: number;
    width: number;
    height: number;
    table: any;
    range?: any;
    modifiedHeight: number;
  }): void {
    const { row } = eventArgs;
    const isExpandedRow = this.eventManager.isRowExpanded(row);
    
    if (isExpandedRow) {
      // 如果是展开行，使用原始高度
      const bodyRowIndex = row - this.table.columnHeaderLevelCount;
      const originalHeight = getOriginalRowHeight(this.table, bodyRowIndex);
      
      if (originalHeight > 0) {
        // 修改事件参数中的高度
        eventArgs.modifiedHeight = originalHeight;
      }
    }
  }

  /**
   * 空间不足时的最小高度分配策略
   */
  private applyMinimalHeightStrategy(
    startRow: number,
    endRow: number,
    totalHeight: number,
    expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scenegraph: any
  ): void {
    // 计算非虚拟行中的普通行数量
    let normalRowCount = 0;
    
    for (let row = startRow; row < endRow; row++) {
      if (!this.configManager.isVirtualRow(row) && !expandedRowsInfo.has(row)) {
        normalRowCount++;
      }
    }
    
    // 给普通行预留最小空间
    const minNormalRowHeight = 20;
    const minNormalRowsTotalHeight = normalRowCount * minNormalRowHeight;
    
    // 剩余高度分配给展开行
    const remainingHeight = Math.max(100, totalHeight - minNormalRowsTotalHeight);
    const avgExpandedRowHeight = expandedRowsInfo.size > 0 ? Math.floor(remainingHeight / expandedRowsInfo.size) : 0;

    for (let row = startRow; row < endRow; row++) {
      if (this.configManager.isVirtualRow(row)) {
        // 虚拟行高度永远为 0
        scenegraph.setRowHeight(row, 0);
        continue;
      }

      if (expandedRowsInfo.has(row)) {
        // 展开行：尽量保证子表可见，但可能需要压缩
        const finalHeight = Math.max(avgExpandedRowHeight, 60);
        scenegraph.setRowHeight(row, finalHeight);
        
        // 更新展开行信息，计算新的基础高度
        const info = expandedRowsInfo.get(row);
        if (info) {
          expandedRowsInfo.set(row, {
            baseHeight: Math.max(finalHeight - info.detailHeight, 20),
            detailHeight: info.detailHeight
          });
        }
      } else {
        // 普通行：使用最小高度
        scenegraph.setRowHeight(row, minNormalRowHeight);
      }
    }
  }

  /**
   * 在 adaptive 处理后更新原始高度缓存
   */
  private updateOriginalHeightsAfterAdaptive(
    expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
  ): void {
    const internalProps = getInternalProps(this.table);
    
    // 更新展开行的原始高度缓存
    for (const [rowIndex, info] of expandedRowsInfo) {
      const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
      if (internalProps.originalRowHeights) {
        // 将新的基础高度设置为原始高度
        internalProps.originalRowHeights.set(bodyRowIndex, info.baseHeight);
      }
    }
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
    const currentPagerData = this.table.dataSource._currentPagerIndexedData;
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

  // private restoreExpandedStatesAfterFilter(): void {
  //   const internalProps = getInternalProps(this.table);
  //   if (!internalProps.expandedRecordIndices || internalProps.expandedRecordIndices.length === 0) {
  //     return;
  //   }
  //   const originalDataSource = this.table.dataSource.dataSourceObj?.records || this.table.dataSource.records;
  //   if (!originalDataSource) {
  //     return;
  //   }
  //   internalProps.expandedRecordIndices.forEach(recordIndex => {
  //     try {
  //       // 获取需要展开的记录对象
  //       const targetRecord = originalDataSource[recordIndex];
  //       if (!targetRecord) {
  //         return;
  //       }
  //       for (
  //         let rowIndex = this.table.columnHeaderLevelCount;
  //         rowIndex < this.table.rowCount - this.table.bottomFrozenRowCount;
  //         rowIndex++
  //       ) {
  //         const record = this.table.getCellRawRecord(0, rowIndex);
  //         if (record === targetRecord) {
  //           // 找到了对应的行，展开它
  //           this.expandRowToNoRealRecordIndex(rowIndex);
  //           break; // 找到就跳出内层循环
  //         }
  //       }
  //     } catch (error) {
  //       console.warn(`处理记录索引 ${recordIndex} 时出错:`, error);
  //     }
  //   });
  // }

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
    const height = detailConfig?.style?.height || 300;

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
    if (this.table.heightMode === 'adaptive') {
      this.table.scenegraph.dealHeightMode();
    }
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
    if (this.table.heightMode === 'adaptive') {
      this.table.scenegraph.dealHeightMode();
    }
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
    if (this.table.heightMode === 'adaptive') {
      this.table.scenegraph.dealHeightMode();
    }
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
    if (this.table.heightMode === 'adaptive') {
      this.table.scenegraph.dealHeightMode();
    }
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
    // 清理表格 API 扩展
    if (this.tableAPIExtensions) {
      this.tableAPIExtensions.cleanup();
    }
  }
}
