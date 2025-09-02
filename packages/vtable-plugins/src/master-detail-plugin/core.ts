import * as VTable from '@visactor/vtable';
import type { MasterDetailPluginOptions } from './types';
import { includesRecordIndex, findRecordIndexPosition } from './types';
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
    VTable.TABLE_EVENT_TYPE.BEFORE_CREATE_PROGRESS_BAR,
    VTable.TABLE_EVENT_TYPE.BEFORE_SET_RECORDS
  ];

  pluginOptions: MasterDetailPluginOptions;
  table: VTable.ListTable;
  private configManager: ConfigManager;
  private eventManager: EventManager;
  private subTableManager: SubTableManager;
  private tableAPIExtensions: TableAPIExtensions;
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
    } else if (runTime === VTable.TABLE_EVENT_TYPE.BEFORE_SET_RECORDS) {
      // 设置数据源前处理：将 rowHierarchyType 设置为 'grid'
      this.handleBeforeSetRecords(eventArgs as any);
    }
  }

  /**
   * 初始化管理器
   */
  private initializeManagers(): void {
    this.configManager = new ConfigManager(this.pluginOptions, this.table);
    this.eventManager = new EventManager(this.table);
    this.subTableManager = new SubTableManager(this.table, this.configManager);

    // 设置配置管理器的行展开状态检查函数
    this.configManager.setRowExpandedChecker((row: number) => this.eventManager.isRowExpanded(row));

    // 设置事件管理器的回调函数
    this.eventManager.setCallbacks({
      onUpdateSubTablePositions: () => this.subTableManager.updateSubTablePositionsForResize(),
      onUpdateSubTablePositionsForRow: () => this.subTableManager.updateSubTablePositionsForRowResize(),
      onExpandRow: (rowIndex: number, colIndex?: number) => this.expandRow(rowIndex, colIndex),
      onCollapseRow: (rowIndex: number, colIndex?: number) => this.collapseRow(rowIndex, colIndex),
      onToggleRowExpand: (rowIndex: number, colIndex?: number) => this.toggleRowExpand(rowIndex, colIndex),
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
    this.tableAPIExtensions = new TableAPIExtensions(this.table, this.configManager, this.eventManager, {
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
      expandRow: (rowIndex: number) => this.expandRow(rowIndex),
      restoreExpandedStatesAfter: () => this.restoreExpandedStatesAfter(),
      collapseRow: (rowIndex: number) => this.collapseRow(rowIndex),
      updateSubTablePositions: () => this.subTableManager.updateSubTablePositionsForResize(),
      updateRowHeightForExpand: (rowIndex: number, deltaHeight: number) =>
        this.updateRowHeightForExpand(rowIndex, deltaHeight)
    });

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
   * 处理设置数据源前的事件
   */
  private handleBeforeSetRecords(eventArgs: {
    records: unknown[];
    table: VTable.ListTable;
    rowHierarchyType?: 'grid' | 'tree';
    rowHierarchyTypeMust?: 'grid' | 'tree';
  }): void {
    // 主从表插件需要将 rowHierarchyType 设置为 'grid'
    eventArgs.rowHierarchyTypeMust = 'grid';
  }

  /**
   * 空间不足时的最小高度分配策略
   */
  private applyMinimalHeightStrategy(
    startRow: number,
    endRow: number,
    totalHeight: number,
    expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>,
    scenegraph: any
  ): void {
    let normalRowCount = 0;
    for (let row = startRow; row < endRow; row++) {
      if (!this.configManager.isVirtualRow(row) && !expandedRowsInfo.has(row)) {
        normalRowCount++;
      }
    }
    const tableInternalProps = this.table.internalProps;
    const minNormalRowHeight = tableInternalProps?.limitMinHeight || 10;
    const minNormalRowsTotalHeight = normalRowCount * minNormalRowHeight;
    // 剩余高度分配给展开行
    const remainingHeight = totalHeight - minNormalRowsTotalHeight;
    const avgExpandedRowHeight = expandedRowsInfo.size > 0 ? Math.floor(remainingHeight / expandedRowsInfo.size) : 0;

    for (let row = startRow; row < endRow; row++) {
      if (this.configManager.isVirtualRow(row)) {
        // 虚拟行高度永远为 0
        scenegraph.setRowHeight(row, 0);
        continue;
      }

      if (expandedRowsInfo.has(row)) {
        const finalHeight = avgExpandedRowHeight;
        scenegraph.setRowHeight(row, finalHeight);
        const info = expandedRowsInfo.get(row);
        if (info) {
          expandedRowsInfo.set(row, {
            baseHeight: Math.max(finalHeight - info.detailHeight, minNormalRowHeight),
            detailHeight: info.detailHeight
          });
        }
      } else {
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
    const currentPagerData = this.table.dataSource._currentPagerIndexedData;
    if (!currentPagerData) {
      return;
    }
    internalProps.expandedRecordIndices.forEach(recordIndex => {
      try {
        const bodyRowIndex = this.table.getBodyRowIndexByRecordIndex(recordIndex);
        if (bodyRowIndex >= 0) {
          const targetRowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
          this.expandRow(targetRowIndex);
        }
      } catch (error) {
        console.warn(`处理记录索引 ${recordIndex} 时出错:`, error);
      }
    });
  }

  /**
   * 展开行
   * @param rowIndex 行索引
   * @param colIndex 列索引
   */
  expandRow(rowIndex: number, colIndex?: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = getInternalProps(this.table);
    if (this.eventManager.isRowExpanded(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    if (realRecordIndex === undefined || realRecordIndex === null) {
      return;
    }
    if (internalProps.expandedRecordIndices) {
      if (!includesRecordIndex(internalProps.expandedRecordIndices, realRecordIndex)) {
        internalProps.expandedRecordIndices.push(realRecordIndex);
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
    this.refreshRowIcon(rowIndex, colIndex);
    if (this.table.heightMode === 'adaptive') {
      this.table.scenegraph.dealHeightMode();
    }
  }

  /**
   * 收起行
   * @param rowIndex 行索引
   * @param colIndex 列索引
   */
  collapseRow(rowIndex: number, colIndex?: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = getInternalProps(this.table);

    if (!this.eventManager.isRowExpanded(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    if (realRecordIndex === undefined || realRecordIndex === null) {
      return;
    }
    this.subTableManager.removeSubTable(bodyRowIndex);
    if (internalProps.expandedRecordIndices) {
      const index = findRecordIndexPosition(internalProps.expandedRecordIndices, realRecordIndex);
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
    this.refreshRowIcon(rowIndex, colIndex);
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
   * @param rowIndex 行索引
   * @param colIndex 列索引
   */
  toggleRowExpand(rowIndex: number, colIndex?: number): void {
    if (this.eventManager.isRowExpanded(rowIndex)) {
      this.collapseRow(rowIndex, colIndex);
    } else {
      this.expandRow(rowIndex, colIndex);
    }
  }

  /**
   * 更新行高用于展开
   */
  private updateRowHeightForExpand(rowIndex: number, deltaHeight: number): void {
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
    const sceneGraph = this.table.scenegraph;
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
    const cells: any[] = [];
    for (let col = 0; col < this.table.colCount; col++) {
      const cellGroup = this.table.scenegraph.getCell(col, rowIndex);
      if (cellGroup && cellGroup.role === 'cell') {
        cells.push(cellGroup);
      }
    }
    return cells;
  }

  /**
   * 为cell添加下划线
   */
  private addUnderlineToCell(cellGroup: any, originalHeight: number): void {
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
      cellGroup._originalStrokeArrayWidth = [...currentStrokeArrayWidth];
      cellGroup._originalStrokeArrayColor = [...currentStrokeArrayColor];
      cellGroup._hasUnderline = true;
    }
    const originalStrokeArrayWidth = cellGroup._originalStrokeArrayWidth || currentStrokeArrayWidth;
    const originalStrokeArrayColor = cellGroup._originalStrokeArrayColor || currentStrokeArrayColor;
    const enhancedStrokeArrayWidth = [...originalStrokeArrayWidth];
    const enhancedStrokeArrayColor = [...originalStrokeArrayColor];
    const dpr = this.table.internalProps?.pixelRatio || window.devicePixelRatio || 1;
    // 要还原本来的下划线的效果，那么我们应该要加上下一行的上划线的因为我记得原本的线是叠层的
    const enhancedWidth = ((originalStrokeArrayWidth[2] || 1) * 0.75 + (originalStrokeArrayWidth[0] || 1) * 0.75) * dpr;
    enhancedStrokeArrayWidth[2] = enhancedWidth;
    if (originalStrokeArrayColor[2] === 'transparent' || !originalStrokeArrayColor[2]) {
      const theme = this.table.theme;
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
    const rowCells = this.getRowCells(rowIndex);
    rowCells.forEach((cellGroup: any, index: number) => {
      if (cellGroup && cellGroup._hasUnderline) {
        this.removeUnderlineFromCell(cellGroup);
      }
    });
    this.table.scenegraph.updateNextFrame();
  }

  /**
   * 从cell中删除下划线
   */
  private removeUnderlineFromCell(cellGroup: any): void {
    if (cellGroup._hasUnderline) {
      // 恢复原始的strokeArray样式
      if (cellGroup._originalStrokeArrayWidth && cellGroup._originalStrokeArrayColor) {
        cellGroup.setAttributes({
          strokeArrayWidth: cellGroup._originalStrokeArrayWidth,
          strokeArrayColor: cellGroup._originalStrokeArrayColor
        });
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
        this.removeUnderlineFromRow(rowIndex);
        this.drawUnderlineForRow(rowIndex, originalHeight);
      }
    });
  }

  /**
   * 刷新行图标
   * @param rowIndex 行索引
   * @param colIndex 列索引
   */
  private refreshRowIcon(rowIndex: number, colIndex?: number): void {
    let targetColumnIndex: number;
    if (typeof colIndex === 'number') {
      targetColumnIndex = colIndex;
    } else {
      const hasRowSeriesNumber = !!this.table.options.rowSeriesNumber;
      targetColumnIndex = hasRowSeriesNumber ? 1 : 0;
    }
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
