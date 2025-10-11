import * as VTable from '@visactor/vtable';
import type { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
import type { MasterDetailPluginOptions } from './types';
import { includesRecordIndex, findRecordIndexPosition } from './types';
import { getInternalProps, getRecordByRowIndex, getOriginalRowHeight } from './utils';
import { ConfigManager } from './config';
import { EventManager } from './events';
import { SubTableManager } from './subtable';
import { TableAPIExtensions } from './table-api-extensions';
import { bindMasterDetailCheckboxChange } from './checkbox';

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
  private configManager: ConfigManager;
  private eventManager: EventManager;
  private subTableManager: SubTableManager;
  private tableAPIExtensions: TableAPIExtensions;
  private resizeObserver?: ResizeObserver;
  private checkboxCascadeCleanup: () => void;

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
    const enableCheckboxCascade = this.pluginOptions.enableCheckboxCascade ?? true;
    this.subTableManager = new SubTableManager(this.table, enableCheckboxCascade);

    // 设置配置管理器的行展开状态检查函数
    this.configManager.setRowExpandedChecker((row: number) => this.eventManager.isRowExpanded(row));

    // 设置事件管理器的回调函数
    this.eventManager.setCallbacks({
      onUpdateSubTablePositions: () => this.subTableManager.recalculateAllSubTablePositions(),
      onUpdateSubTablePositionsForRow: () => this.subTableManager.updateSubTablePositionsForRowResize(),
      onExpandRow: (rowIndex: number, colIndex?: number) => this.expandRow(rowIndex, colIndex),
      onCollapseRow: (rowIndex: number, colIndex?: number) => this.collapseRow(rowIndex, colIndex),
      onCollapseRowToNoRealRecordIndex: (rowIndex: number) => this.collapseRowToNoRealRecordIndex(rowIndex),
      onToggleRowExpand: (rowIndex: number, colIndex?: number) => this.toggleRowExpand(rowIndex, colIndex),
      getOriginalRowHeight: (bodyRowIndex: number) => getOriginalRowHeight(this.table, bodyRowIndex)
    });

    // 设置子表管理器的回调函数
    this.subTableManager.setCallbacks({
      getDetailConfigForRecord: (record, bodyRowIndex) =>
        this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
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
    // 设置统一选择状态管理
    this.setupUnifiedSelectionManagement();
    // 扩展表格 API
    this.extendTableAPI();
    // 初始化checkbox联动功能
    this.initCheckboxCascade();
  }

  // 主表点击事件处理器引用
  private mainTableClickHandler?: () => void;

  /**
   * 设置统一选中状态管理
   */
  private setupUnifiedSelectionManagement(): void {
    // 绑定主表的点击事件，清除所有子表选中状态
    this.mainTableClickHandler = () => {
      this.clearAllSubTableVisibleSelections();
    };
    this.table.on('click_cell', this.mainTableClickHandler);
  }

  /**
   * 初始化checkbox联动功能
   * 设置主从表之间的复选框状态同步，并保存清理函数以便后续释放资源
   */
  private initCheckboxCascade(): void {
    // 检查是否启用checkbox级联功能，默认为 true
    const enableCheckboxCascade = this.pluginOptions.enableCheckboxCascade ?? true;
    if (enableCheckboxCascade) {
      // 设置checkbox联动并保存清理函数
      this.checkboxCascadeCleanup = bindMasterDetailCheckboxChange(this.table, this.eventManager);
    }
  }

  /**
   * 初始化内部属性
   */
  private initInternalProps(): void {
    const internalProps = getInternalProps(this.table);
    internalProps.expandedRecordIndices = [];
    internalProps.subTableInstances = new Map();
    internalProps.originalRowHeights = new Map();
    internalProps.subTableCheckboxStates = new Map();
  }

  /**
   * 扩展表格 API
   */
  private extendTableAPI(): void {
    // 创建 TableAPIExtensions 实例
    this.tableAPIExtensions = new TableAPIExtensions(this.table, this.configManager, this.eventManager, {
      addUnderlineToCell: (cellGroup: Group) => this.addUnderlineToCell(cellGroup),
      updateOriginalHeightsAfterAdaptive: (
        expandedRowsInfo: Map<number, { baseHeight: number; detailHeight: number }>
      ) => this.updateOriginalHeightsAfterAdaptive(expandedRowsInfo),
      collapseRowToNoRealRecordIndex: (rowIndex: number) => this.collapseRowToNoRealRecordIndex(rowIndex),
      expandRow: (rowIndex: number) => this.expandRow(rowIndex),
      restoreExpandedStatesAfter: () => this.restoreExpandedStatesAfter(),
      collapseRow: (rowIndex: number) => this.collapseRow(rowIndex),
      updateSubTablePositions: () => this.subTableManager.recalculateAllSubTablePositions(),
      updateRowHeightForExpand: (rowIndex: number, deltaHeight: number) =>
        this.updateRowHeightForExpand(rowIndex, deltaHeight)
    });

    // 执行API扩展
    this.tableAPIExtensions.extendTableAPI();
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
    // 更新展开行的数据源
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

    const childrenData = Array.isArray(record.children) ? record.children : [];

    const deltaHeight = height;
    this.updateRowHeightForExpand(rowIndex, deltaHeight);
    this.table.scenegraph.updateContainerHeight(rowIndex, deltaHeight);
    internalProps._heightResizedRowMap.add(rowIndex);
    this.subTableManager.renderSubTable(bodyRowIndex, childrenData, (record, bodyRowIndex) =>
      this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    this.subTableManager.recalculateAllSubTablePositions(
      bodyRowIndex + 1,
      undefined,
      (record: unknown, bodyRowIndex: number) => this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
    );
    if (rowIndex !== this.table.rowCount - 1) {
      this.drawUnderlineForRow(rowIndex);
    }
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
    // 更新展开行的数据源
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
    if (rowIndex !== this.table.rowCount - 1) {
      this.removeUnderlineFromRow(rowIndex);
    }
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

    if (rowIndex !== this.table.rowCount - 1) {
      this.removeUnderlineFromRow(rowIndex);
    }
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
  private drawUnderlineForRow(rowIndex: number): void {
    const sceneGraph = this.table.scenegraph;
    if (!sceneGraph) {
      return;
    }
    // 获取指定行的所有cell
    const rowCells = this.getRowCells(rowIndex);
    if (rowCells.length === 0) {
      return;
    }
    rowCells.forEach((cellGroup: Group, index: number) => {
      if (cellGroup && cellGroup.attribute) {
        this.addUnderlineToCell(cellGroup);
      }
    });
    // 触发重新渲染
    this.table.scenegraph.updateNextFrame();
  }

  /**
   * 获取指定行的所有cell元素
   */
  private getRowCells(rowIndex: number): Group[] {
    const cells: Group[] = [];
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
  private addUnderlineToCell(cellGroup: any): void {
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
    const enhancedWidth = ((originalStrokeArrayWidth[2] || 1) * 0.75 + (originalStrokeArrayWidth[0] || 1) * 0.75) * 2;
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

    const record = this.table.getCellOriginRecord(targetColumnIndex, rowIndex);
    if (record && typeof record === 'object') {
      const recordObj = record as Record<string, unknown>;
      const HierarchyState = VTable.TYPES.HierarchyState;
      const isExpanded = this.eventManager.isRowExpanded(rowIndex);
      recordObj.hierarchyState = isExpanded ? HierarchyState.expand : HierarchyState.collapse;
      this.table.scenegraph.updateHierarchyIcon(targetColumnIndex, rowIndex);
    }
  }

  update(): void {
    if (this.table) {
      this.subTableManager.recalculateAllSubTablePositions(0, undefined, (record: unknown, bodyRowIndex: number) =>
        this.configManager.getDetailConfigForRecord(record, bodyRowIndex)
      );
    }
  }

  /**
   * 设置记录的子数据并展开
   */
  setRecordChildren(children: unknown[], col: number, row: number): void {
    // 获取原始记录数据
    const recordIndex = this.table.getRecordIndexByCell(col, row);
    if (recordIndex === undefined || recordIndex === null) {
      console.warn('Invalid row, cannot get record index');
      return;
    }

    const realRecordIndex = typeof recordIndex === 'number' ? recordIndex : recordIndex[0];
    const record = this.table.dataSource.get(realRecordIndex);
    if (!record) {
      console.warn('Cannot find record for index:', realRecordIndex);
      return;
    }

    // 直接修改原始记录的 children 属性
    (record as Record<string, unknown>).children = children;
    this.expandRow(row, col);
    this.table.scenegraph.updateCellContent(col, row);
  }

  release(): void {
    // 首先释放所有子表资源
    this.releaseAllSubTables();
    // 清理主从表功能
    this.cleanupMasterDetailFeatures();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    this.eventManager?.cleanup();
    this.subTableManager?.cleanup();
    this.configManager?.release();
    // 清理checkbox联动功能
    this.checkboxCascadeCleanup?.();
    // 清理内部属性
    if (this.table) {
      const internalProps = getInternalProps(this.table);
      if (internalProps) {
        // 清理Map和Set，防止内存泄露
        internalProps.expandedRecordIndices?.splice(0);
        internalProps.subTableInstances?.clear();
        internalProps.originalRowHeights?.clear();
        internalProps.subTableCheckboxStates?.clear();
        internalProps._heightResizedRowMap?.clear();
      }
    }
    // 清理引用，避免循环引用
    (this as unknown as { configManager: unknown }).configManager = null;
    (this as unknown as { eventManager: unknown }).eventManager = null;
    (this as unknown as { subTableManager: unknown }).subTableManager = null;
    (this as unknown as { tableAPIExtensions: unknown }).tableAPIExtensions = null;
    (this as unknown as { table: unknown }).table = null;
  }

  /**
   * 清除所有子表的可见选中状态
   */
  private clearAllSubTableVisibleSelections(): void {
    const internalProps = getInternalProps(this.table);
    internalProps.subTableInstances?.forEach(subTable => {
      if (subTable && typeof (subTable as { clearSelected?: () => void }).clearSelected === 'function') {
        (subTable as { clearSelected: () => void }).clearSelected();
      }
    });
  }

  /**
   * 获取所有子表实例
   * @returns 子表实例的Map，键为bodyRowIndex，值为VTable实例
   */
  getAllSubTableInstances(): Map<number, VTable.ListTable> | null {
    return this.subTableManager.getAllSubTableInstances();
  }

  /**
   * 根据主表行号获取子表实例
   * @param rowIndex 主表行索引（包含表头）
   * @returns 子表实例，如果不存在则返回null
   */
  getSubTableByRowIndex(rowIndex: number): VTable.ListTable | null {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    return this.subTableManager.getSubTableInstance(bodyRowIndex);
  }

  /**
   * 根据主表body行号获取子表实例
   * @param bodyRowIndex 主表body行索引（不包含表头）
   * @returns 子表实例，如果不存在则返回null
   */
  getSubTableByBodyRowIndex(bodyRowIndex: number): VTable.ListTable | null {
    return this.subTableManager.getSubTableInstance(bodyRowIndex);
  }

  /**
   * 根据条件筛选子表实例
   * @param predicate 筛选条件函数
   * @returns 符合条件的子表实例数组
   */
  filterSubTables(
    predicate: (bodyRowIndex: number, subTable: VTable.ListTable, record?: unknown) => boolean
  ): Array<{ bodyRowIndex: number; subTable: VTable.ListTable; record?: unknown }> {
    const result: Array<{ bodyRowIndex: number; subTable: VTable.ListTable; record?: unknown }> = [];
    const allSubTables = this.subTableManager.getAllSubTableInstances();
    if (!allSubTables) {
      return result;
    }

    for (const [bodyRowIndex, subTable] of allSubTables) {
      try {
        const record = getRecordByRowIndex(this.table, bodyRowIndex);
        if (predicate(bodyRowIndex, subTable, record)) {
          result.push({ bodyRowIndex, subTable, record });
        }
      } catch (error) {
        console.warn(`筛选子表时出错:`, error);
      }
    }
    return result;
  }

  /**
   * 根据指定单元格的值获取子表实例
   * @param cellValue 要查找的单元格值
   * @param searchOptions 搜索选项
   * @returns 匹配的子表实例数组
   */
  getSubTableByCellValue(
    cellValue: unknown,
    searchOptions?: {
      fieldName?: string; // 指定字段名，如果不指定则搜索所有字段
      rowIndex?: number; // 指定行索引，如果不指定则搜索所有行
      exactMatch?: boolean; // 是否精确匹配，默认为true
    }
  ): Array<{ bodyRowIndex: number; subTable: VTable.ListTable; record: unknown; matchedField?: string }> {
    const result: Array<{
      bodyRowIndex: number;
      subTable: VTable.ListTable;
      record: unknown;
      matchedField?: string;
    }> = [];
    const allSubTables = this.subTableManager.getAllSubTableInstances();
    if (!allSubTables) {
      return result;
    }

    const options = {
      exactMatch: true,
      ...searchOptions
    };

    for (const [bodyRowIndex, subTable] of allSubTables) {
      try {
        // 如果指定了行索引，只检查该行
        if (options.rowIndex !== undefined && bodyRowIndex !== options.rowIndex) {
          continue;
        }

        const record = getRecordByRowIndex(this.table, bodyRowIndex);
        if (!record || typeof record !== 'object') {
          continue;
        }

        let matchedField: string | undefined;
        let isMatch = false;

        if (options.fieldName) {
          // 搜索指定字段
          const fieldValue = (record as Record<string, unknown>)[options.fieldName];
          if (options.exactMatch) {
            isMatch = fieldValue === cellValue;
          } else {
            isMatch = String(fieldValue).includes(String(cellValue));
          }
          if (isMatch) {
            matchedField = options.fieldName;
          }
        } else {
          // 搜索所有字段
          for (const [key, value] of Object.entries(record)) {
            if (options.exactMatch) {
              if (value === cellValue) {
                isMatch = true;
                matchedField = key;
                break;
              }
            } else {
              if (String(value).includes(String(cellValue))) {
                isMatch = true;
                matchedField = key;
                break;
              }
            }
          }
        }

        if (isMatch) {
          result.push({ bodyRowIndex, subTable, record, matchedField });
        }
      } catch (error) {
        console.warn(`搜索子表时出错:`, error);
      }
    }

    return result;
  }

  /**
   * 根据指定单元格的值获取第一个匹配的子表实例
   * @param cellValue 要查找的单元格值
   * @param searchOptions 搜索选项
   * @returns 第一个匹配的子表实例，如果不存在则返回null
   */
  getFirstSubTableByCellValue(
    cellValue: unknown,
    searchOptions?: {
      fieldName?: string;
      rowIndex?: number;
      exactMatch?: boolean;
    }
  ): VTable.ListTable | null {
    const results = this.getSubTableByCellValue(cellValue, searchOptions);
    return results.length > 0 ? results[0].subTable : null;
  }

  /**
   * 释放所有子表资源
   */
  private releaseAllSubTables(): void {
    const subTableInstances = this.subTableManager.getAllSubTableInstances();
    if (subTableInstances) {
      subTableInstances.forEach((subTable, bodyRowIndex) => {
        try {
          // 直接调用子表实例的 release 方法
          if (subTable && typeof subTable.release === 'function') {
            subTable.release();
          }
        } catch (error) {
          console.warn(`释放子表 ${bodyRowIndex} 时出错:`, error);
        }
      });
      // 清空子表实例映射
      subTableInstances.clear();
    }
  }
  /**
   * 清理主从表功能
   */
  private cleanupMasterDetailFeatures(): void {
    // 清理主表事件处理器
    if (this.mainTableClickHandler) {
      this.table.off('click_cell', this.mainTableClickHandler);
      this.mainTableClickHandler = undefined;
    }
    // 清理表格 API 扩展
    if (this.tableAPIExtensions) {
      this.tableAPIExtensions.cleanup();
    }
  }
}
