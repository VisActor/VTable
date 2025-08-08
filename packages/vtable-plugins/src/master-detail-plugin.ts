import * as VTable from '@visactor/vtable';

/** 子表配置接口 */
export interface DetailGridOptions {
  /** 子表类型 */
  type: 'ListTable' | 'PivotTable';
  /** 子表列定义 */
  columnDefs: VTable.TYPES.ColumnsDefine;
  /** 子表样式配置 */
  style?: {
    margin?: number;
    height?: number;
  };
  /** 子表其他配置项 */
  [key: string]: unknown;
}

/**
 * 主从表插件配置选项
 */
export interface MasterDetailPluginOptions {
  id?: string;
  /** 是否启用主从表功能 */
  enabled?: boolean;
  /** 默认展开的行索引 */
  expandedRows?: number[];
  /** 静态子表配置 */
  detailGridOptions?: DetailGridOptions;
  /** 动态子表配置函数 */
  getDetailGridOptions?: (params: { data: unknown; tableRowIndex: number }) => DetailGridOptions;
  /** 是否启用层级文本对齐 */
  hierarchyTextStartAlignment?: boolean;
}

/**
 * 主从表插件 - 完全从 ListTable 抽取的主从表功能
 * 将 ListTable 的主从表功能完全抽取为独立插件
 */
export class MasterDetailPlugin implements VTable.plugins.IVTablePlugin {
  id = `master-detail-${Date.now()}`;
  name = 'Master Detail Plugin';
  runTime = [
    VTable.TABLE_EVENT_TYPE.BEFORE_INIT, 
    VTable.TABLE_EVENT_TYPE.INITIALIZED,
    VTable.TABLE_EVENT_TYPE.SORT_CLICK,
    VTable.TABLE_EVENT_TYPE.AFTER_SORT,
    VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_CELL_CONTENT_WIDTH
  ];

  pluginOptions: MasterDetailPluginOptions;
  table: VTable.ListTable;
  // 保护展开行的CellGroup高度
  private protectedCellHeights: Map<string, number> = new Map();
  // 原始updateCellContent方法的引用
  private originalUpdateCellContent?: Function;
  // 展开状态管理
  private expandedRowsMap: Map<number, boolean> = new Map();
  // 容器大小监听器
  private resizeObserver?: ResizeObserver;

  constructor(pluginOptions: MasterDetailPluginOptions = {}) {
    this.id = pluginOptions.id ?? this.id;
    this.pluginOptions = Object.assign(
      {
        enabled: true,
        expandedRows: [],
        hierarchyTextStartAlignment: true
      },
      pluginOptions
    );
  }

  run(...args: unknown[]): boolean | void {
    const eventArgs = args[0];
    const runTime = args[1];
    const table = args[2] as VTable.ListTable;

    if (!this.pluginOptions.enabled) {
      return;
    }

    if (runTime === VTable.TABLE_EVENT_TYPE.BEFORE_INIT) {
      this.table = table;
      this.injectMasterDetailOptions((eventArgs as { options: VTable.ListTableConstructorOptions }).options);
    } else if (runTime === VTable.TABLE_EVENT_TYPE.INITIALIZED) {
      // 在INITIALIZED阶段替换handleIconClick方法，确保表格已经完全初始化
      this.replaceHandleIconClick();
      this.setupMasterDetailFeatures();
    } else if (runTime === VTable.TABLE_EVENT_TYPE.SORT_CLICK) {
      // 排序前处理：保存展开状态并收起所有行
      this.executeMasterDetailBeforeSort();
      // 不阻止默认排序
      return true;
    } else if (runTime === VTable.TABLE_EVENT_TYPE.AFTER_SORT) {
      // 排序后处理：恢复展开状态
      this.executeMasterDetailAfterSort();
    } else if (runTime === VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_CELL_CONTENT_WIDTH) {
      // 单元格内容宽度更新后处理
      this.handleAfterUpdateCellContentWidth(eventArgs as any);
    }
  }

  /**
   * 处理单元格内容宽度更新后的事件
   */
  private handleAfterUpdateCellContentWidth(eventData: {
    col: number;
    row: number;
    distWidth: number;
    cellHeight: number;
    detaX: number;
    autoRowHeight: boolean;
    needUpdateRowHeight: boolean;
    cellGroup: any;
    padding: [number, number, number, number];
    textAlign: CanvasTextAlign;
    textBaseline: CanvasTextBaseline;
  }): void {
    const { cellGroup, cellHeight, padding, textAlign, textBaseline, autoRowHeight } = eventData;
    // 在masterDetail模式下，使用原始高度而不是逻辑行高来重新定位单元格内容
    let effectiveCellHeight = cellHeight;
    if (cellGroup.col !== undefined && cellGroup.row !== undefined) {
      try {
        const recordIndex = this.table.getRecordShowIndexByCell(cellGroup.col, cellGroup.row);
        if (recordIndex !== undefined && 'getOriginalRowHeight' in this.table) {
          const originalHeight = (
            this.table as unknown as { getOriginalRowHeight: (index: number) => number }
          ).getOriginalRowHeight(recordIndex);
          if (originalHeight > 0) {
            effectiveCellHeight = originalHeight; // 使用原始视觉高度
            // 重新调整单元格内容的纵向位置，使用原始高度
            const newHeight = effectiveCellHeight - (padding[0] + padding[2]);
            cellGroup.forEachChildren((child: any) => {
              if (child.type === 'rect' || child.type === 'chart' || child.name === 'custom-container') {
                return;
              }
              if (child.name === 'mark') {
                child.setAttribute('y', 0);
              } else if (textBaseline === 'middle') {
                child.setAttribute('y', padding[0] + (newHeight - child.AABBBounds.height()) / 2);
              } else if (textBaseline === 'bottom') {
                child.setAttribute('y', padding[0] + newHeight - child.AABBBounds.height());
              } else {
                child.setAttribute('y', padding[0]);
              }
            });
          }
        }
      } catch (error) {
        // 如果获取失败，继续使用逻辑高度
        console.warn(
          'Failed to get original row height in masterDetail mode (handleAfterUpdateCellContentWidth):',
          error
        );
      }
    }
    // 如果是展开的行，可能需要重新调整子表位置
    const internalProps = this.getInternalProps();
    const tableRowIndex = eventData.row - this.table.columnHeaderLevelCount;
    if (internalProps.subTableInstances?.has(tableRowIndex)) {
      // 延迟执行，确保单元格更新完成
      setTimeout(() => {
        this.recalculateAllSubTablePositions();
      }, 0);
    }
  }

  update() {
    if (this.table && this.pluginOptions.enabled) {
      this.recalculateAllSubTablePositions();
    }
  }

  release() {
    this.cleanupMasterDetailFeatures();
    // 清理容器大小监听器
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    // 清理状态
    this.expandedRowsMap.clear();
  }

  // ==================== 调试辅助方法 ====================

  /**
   * 获取最后一行第一个单元格的高度（调试用）
   */
  getLastRowFirstCellHeight(): number | null {
    if (!this.table) {
      return null;
    }
    try {
      const lastRowIndex = this.table.rowCount - 1;
      const cell = this.table.scenegraph.highPerformanceGetCell(0, lastRowIndex);
      return cell?.attribute?.height || null;
    } catch (e) {
      console.error('获取最后一行单元格高度失败:', e);
      return null;
    }
  }

  /**
   * 获取指定行列的单元格高度（调试用）
   */
  getCellHeight(col: number, row: number): number | null {
    if (!this.table) {
      return null;
    }
    try {
      const cell = this.table.scenegraph.highPerformanceGetCell(col, row);
      return cell?.attribute?.height || null;
    } catch (e) {
      console.error(`获取单元格 (${col}, ${row}) 高度失败:`, e);
      return null;
    }
  }

  // ==================== 配置注入 ====================

  /**
   * 替换ListTable的handleIconClick方法
   */
  private replaceHandleIconClick(): void {
    const originalHandleIconClick = (this.table as any).handleIconClick;
    if (originalHandleIconClick) {
      (this.table as any)._originalHandleIconClick = originalHandleIconClick;
    }
    (this.table as any).handleIconClick = this.handleIconClick.bind(this);
  }

  /**
   * 注入主从表配置到表格选项中
   */
  private injectMasterDetailOptions(options: VTable.ListTableConstructorOptions): void {
    // 启用主从表基础设施
    (options as VTable.ListTableConstructorOptions & { masterDetail: boolean }).masterDetail = true;

    // 注入子表配置
    if (this.pluginOptions.detailGridOptions) {
      const detailOptions = this.pluginOptions.detailGridOptions;
      (options as VTable.ListTableConstructorOptions & { detailGridOptions: DetailGridOptions }).detailGridOptions =
        detailOptions;
    }

    if (this.pluginOptions.getDetailGridOptions) {
      const getDetailOptions = this.pluginOptions.getDetailGridOptions;
      (
        options as VTable.ListTableConstructorOptions & {
          getDetailGridOptions: (params: { data: unknown; tableRowIndex: number }) => DetailGridOptions;
        }
      ).getDetailGridOptions = getDetailOptions;
    }

    // 设置层级文本对齐
    if (this.pluginOptions.hierarchyTextStartAlignment !== undefined) {
      options.hierarchyTextStartAlignment = this.pluginOptions.hierarchyTextStartAlignment;
    }

    // 设置默认展开行
    if (this.pluginOptions.expandedRows && this.pluginOptions.expandedRows.length > 0) {
      (options as VTable.ListTableConstructorOptions & { expandedRows: number[] }).expandedRows =
        this.pluginOptions.expandedRows;
    }
  }

  // ==================== 主从表功能设置 ====================

  /**
   * 设置主从表功能 - 从 ListTable.initMasterDetailFeatures 抽取
   */
  private setupMasterDetailFeatures(): void {
    // 初始化内部属性
    this.initInternalProps();

    // 绑定事件处理器
    this.bindEventHandlers();

    // 扩展表格 API
    this.extendTableAPI();

  }

  /**
   * 初始化内部属性 - 从 ListTable.initMasterDetailFeatures 抽取
   */
  private initInternalProps(): void {
    const internalProps = this.table.internalProps as VTable.ListTable['internalProps'] & {
      expandedRecordIndices?: Set<number>;
      subTableInstances?: Map<number, VTable.ListTable>;
      originalRowHeights?: Map<number, number>;
    };

    internalProps.expandedRecordIndices = new Set(this.pluginOptions.expandedRows || []);
    internalProps.subTableInstances = new Map();
    internalProps.originalRowHeights = new Map();
  }

  /**
   * 绑定事件处理器 - 从 ListTable.initMasterDetailFeatures 抽取
   */
  private bindEventHandlers(): void {
    // handleIconClick已经在BEFORE_INIT阶段替换了，这里只需要绑定滚动事件
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => this.updateSubTablePositionsForScroll());
  }

  /**
   * 扩展表格 API - 添加主从表方法
   */
  private extendTableAPI(): void {
    const table = this.table as any;
    this.originalUpdateCellContent = table.scenegraph.updateCellContent.bind(table.scenegraph);
    table.scenegraph.updateCellContent = this.protectedUpdateCellContent.bind(this);
    // 添加主从表 API 方法
    table.expandRow = this.expandRow.bind(this);
    table.collapseRow = this.collapseRow.bind(this);
    table.toggleRowExpand = this.toggleRowExpand.bind(this);
    table.getDetailConfigForRecord = this.getDetailConfigForRecord.bind(this);
    table.getRecordByRowIndex = this.getRecordByRowIndex.bind(this);
    table.getOriginalRowHeight = this.getOriginalRowHeight.bind(this);
  }

  private protectedUpdateCellContent(col: number, row: number, forceFastUpdate: boolean = false): any {
    const cellKey = `${col}-${row}`;
    const isExpandedRow = this.expandedRowsMap.get(row);
    // 如果是展开行，先保存CellGroup的原始高度
    if (isExpandedRow) {
      const cellGroup = this.table.scenegraph.getCell(col, row);
      if (cellGroup && cellGroup.attribute && cellGroup.attribute.height) {
        this.protectedCellHeights.set(cellKey, cellGroup.attribute.height);
      }
    }
    // 调用原始的updateCellContent方法
    const result = this.originalUpdateCellContent!(col, row, forceFastUpdate);
    // 如果是展开行，恢复CellGroup的正确高度
    if (isExpandedRow && this.protectedCellHeights.has(cellKey)) {
      const cellGroup = this.table.scenegraph.getCell(col, row);
      if (cellGroup) {
        const protectedHeight = this.protectedCellHeights.get(cellKey)!;
        cellGroup.setAttributes({
          height: protectedHeight
        });
      }
    }

    // 手动调用handleAfterUpdateCellContentWidth来调整内容高度
    const cellGroup = this.table.scenegraph.getCell(col, row);
    if (cellGroup) {
      this.handleAfterUpdateCellContentWidth({
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

  // ==================== 事件处理 ====================

  /**
   * 处理图标点击事件 - 从 ListTable.handleIconClick 抽取
   * 这个方法会替换ListTable的handleIconClick方法
   */
  private handleIconClick(iconInfo: {
    col: number;
    row: number;
    funcType: VTable.TYPES.IconFuncTypeEnum | string;
  }): void {
    // 检查是否是主从表功能相关的图标点击
    const { row, funcType } = iconInfo;

    if (
      funcType === VTable.TYPES.IconFuncTypeEnum.expand ||
      funcType === VTable.TYPES.IconFuncTypeEnum.collapse ||
      funcType === 'expand' ||
      funcType === 'collapse'
    ) {
      this.toggleRowExpand(row);
      return;
    }

    // 如果不是主从表相关的点击，调用原始的处理器（如果存在）
    const originalHandler = (this.table as any)._originalHandleIconClick;
    if (originalHandler) {
      originalHandler.call(this.table, iconInfo);
    }
  }

  // ==================== 主从表 API 方法 ====================

  /**
   * 展开行 - 从 ListTable.expandRow 抽取
   */
  expandRow(rowIndex: number): void {
    const tableRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = this.getInternalProps();

    if (internalProps._heightResizedRowMap.has(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
    if (internalProps.expandedRecordIndices) {
      internalProps.expandedRecordIndices.add(recordIndex);
    }

    // 更新展开状态映射
    this.expandedRowsMap.set(rowIndex, true);

    const originalHeight = this.table.getRowHeight(rowIndex);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.set(tableRowIndex, originalHeight);
    }
    const record = this.getRecordByRowIndex(tableRowIndex);
    const detailConfig = this.getDetailConfigForRecord(record, tableRowIndex);
    const height = detailConfig?.style?.height || 200;

    if (record) {
      (record as { hierarchyState?: VTable.TYPES.HierarchyState }).hierarchyState = VTable.TYPES.HierarchyState.expand;
    }

    const deltaHeight = height - originalHeight;
    this.updateRowHeightForExpand(rowIndex, deltaHeight);
    this.table.scenegraph.updateContainerHeight(rowIndex, deltaHeight);
    internalProps._heightResizedRowMap.add(rowIndex);

    this.updateIconsForRow(rowIndex);
    this.renderSubTable(tableRowIndex);
    this.recalculateAllSubTablePositions();
  }

  /**
   * 收起行 - 从 ListTable.collapseRow 抽取
   */
  collapseRow(rowIndex: number): void {
    const tableRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = this.getInternalProps();

    if (!internalProps._heightResizedRowMap.has(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
    this.removeSubTable(tableRowIndex);
    if (internalProps.expandedRecordIndices) {
      internalProps.expandedRecordIndices.delete(recordIndex);
    }

    // 更新展开状态映射
    this.expandedRowsMap.delete(rowIndex);

    const record = this.getRecordByRowIndex(tableRowIndex);
    if (record) {
      (record as { hierarchyState?: VTable.TYPES.HierarchyState }).hierarchyState =
        VTable.TYPES.HierarchyState.collapse;
    }

    const currentHeight = this.table.getRowHeight(rowIndex);
    const originalHeight = this.getOriginalRowHeight(tableRowIndex);
    const deltaHeight = currentHeight - originalHeight;
    this.updateRowHeightForExpand(rowIndex, -deltaHeight);
    internalProps._heightResizedRowMap.delete(rowIndex);
    this.table.scenegraph.updateContainerHeight(rowIndex, -deltaHeight);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.delete(tableRowIndex);
    }

    this.updateIconsForRow(rowIndex);
    this.recalculateAllSubTablePositions();
  }

  /**
   * 切换行展开状态 - 从 ListTable.toggleRowExpand 抽取
   */
  toggleRowExpand(rowIndex: number): void {
    const internalProps = this.getInternalProps();
    if (internalProps._heightResizedRowMap.has(rowIndex)) {
      this.collapseRow(rowIndex);
    } else {
      this.expandRow(rowIndex);
    }
  }

  // ==================== 辅助方法 ====================
  /**
   * masterDetail模式下排序前的操作
   */
  private executeMasterDetailBeforeSort(): void {
    const table = this.table as any;
    if (table.internalProps.expandedRecordIndices && table.internalProps.expandedRecordIndices.size > 0) {
      table.internalProps._tempExpandedRecordIndices = new Set(table.internalProps.expandedRecordIndices);
    }
    if (table.internalProps._heightResizedRowMap) {
      table.internalProps._heightResizedRowMap.forEach((value: any, rowIndex: number) => {
        try {
          table.collapseRow(rowIndex);
        } catch (e) {
          // 收起失败
        }
      });
    }
  }

  /**
   * masterDetail模式下排序后的操作
   */
  private executeMasterDetailAfterSort(): void {
    const table = this.table as any;
    const tempExpandedRecordIndices = table.internalProps._tempExpandedRecordIndices;
    if (tempExpandedRecordIndices && tempExpandedRecordIndices.size > 0) {
      const recordIndicesArray = Array.from(tempExpandedRecordIndices) as number[];
      recordIndicesArray.forEach(recordIndex => {
        const currentPagerData = table.dataSource._currentPagerIndexedData;
        if (currentPagerData) {
          const tableRowIndex = currentPagerData.indexOf(recordIndex);
          if (tableRowIndex >= 0) {
            try {
              table.expandRow(tableRowIndex + table.columnHeaderLevelCount);
            } catch (e) {
              // 展开失败
            }
          }
        }
      });
      // 清理临时变量
      delete table.internalProps._tempExpandedRecordIndices;
    }
  }

  /**
   * 获取内部属性 - 类型安全的访问器
   */
  private getInternalProps() {
    return this.table.internalProps as VTable.ListTable['internalProps'] & {
      expandedRecordIndices: Set<number>;
      subTableInstances: Map<number, VTable.ListTable>;
      originalRowHeights: Map<number, number>;
      _heightResizedRowMap: Set<number>;
    };
  }

  /**
   * 更新行高用于展开 - 从 updateRowHeightForExpand 抽取
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
   * 更新行图标 - 从 ListTable.updateIconsForRow 抽取
   */
  private updateIconsForRow(rowIndex: number): void {
    this.table.scenegraph.updateHierarchyIcon(0, rowIndex);
    for (let col = 0; col < this.table.colCount; col++) {
      const columnDefine = this.table.getBodyColumnDefine(col, rowIndex);
      if (columnDefine && (columnDefine as VTable.TYPES.ColumnDefine & { master?: boolean }).master) {
        this.table.scenegraph.updateHierarchyIcon(col, rowIndex);
      }
    }
    this.table.scenegraph.updateNextFrame();
  }

  /**
   * 获取详情配置 - 从 ListTable.getDetailConfigForRecord 抽取
   */
  private getDetailConfigForRecord(record: unknown, tableRowIndex: number): DetailGridOptions | null {
    return (
      this.pluginOptions.getDetailGridOptions?.({ data: record, tableRowIndex }) ||
      this.pluginOptions.detailGridOptions ||
      null
    );
  }

  /**
   * 根据行索引获取记录 - 从 ListTable.getRecordByRowIndex 抽取
   */
  private getRecordByRowIndex(tableRowIndex: number): Record<string, unknown> {
    return this.table.dataSource.getRaw(tableRowIndex) as Record<string, unknown>;
  }

  /**
   * 获取原始行高 - 从 ListTable.getOriginalRowHeight 抽取
   */
  private getOriginalRowHeight(tableRowIndex: number): number {
    const internalProps = this.getInternalProps();
    return internalProps.originalRowHeights?.get(tableRowIndex) || 0;
  }

  // ==================== 子表管理 ====================

  /**
   * 渲染子表 - 从 ListTable.renderSubTable 抽取
   */
  private renderSubTable(tableRowIndex: number): void {
    const internalProps = this.getInternalProps();
    const record = this.getRecordByRowIndex(tableRowIndex);
    if (!record || !record.children) {
      return;
    }
    const detailConfig = this.getDetailConfigForRecord(record, tableRowIndex);
    const childViewBox = this.calculateSubTableViewBox(tableRowIndex, detailConfig);
    if (!childViewBox) {
      return;
    }
    const childrenData = Array.isArray(record.children) ? record.children : [];
    const containerWidth = childViewBox.x2 - childViewBox.x1;
    const containerHeight = childViewBox.y2 - childViewBox.y1;
    const subTableOptions = {
      viewBox: childViewBox,
      canvas: this.table.canvas,
      records: childrenData,
      columns: detailConfig?.columnDefs || [],
      widthMode: 'adaptive' as const,
      showHeader: true,
      canvasWidth: containerWidth,
      canvasHeight: containerHeight,
      // 继承父表的重要属性
      theme: (this.table as { options: VTable.ListTableConstructorOptions }).options.theme,
      ...(detailConfig || {})
    };
    const subTable = new VTable.ListTable(this.table.container, subTableOptions);
    internalProps.subTableInstances.set(tableRowIndex, subTable);

    // 确保子表内容在父表重绘后保持在上层
    const afterRenderHandler = () => {
      if (internalProps.subTableInstances && internalProps.subTableInstances.has(tableRowIndex)) {
        subTable.render();
      }
    };
    this.table.on('after_render', afterRenderHandler);
    (subTable as VTable.ListTable & { __afterRenderHandler: () => void }).__afterRenderHandler = afterRenderHandler;

    // 设置滚动事件隔离
    this.setupScrollEventIsolation(subTable);
    // 设置统一选中状态管理
    this.setupUnifiedSelectionManagement(tableRowIndex, subTable);
    // 设置子表canvas裁剪，实现真正的clip效果
    this.setupSubTableCanvasClipping(subTable);
    // 初始渲染
    subTable.render();
  }

  /**
   * 计算子表的viewBox区域 - 从 ListTable.calculateSubTableViewBox 抽取
   */
  private calculateSubTableViewBox(
    tableRowIndex: number,
    detailConfig?: DetailGridOptions | null
  ): { x1: number; y1: number; x2: number; y2: number } | null {
    const rowIndex = tableRowIndex + this.table.columnHeaderLevelCount;
    const detailRowRect = this.table.getCellRangeRelativeRect({ col: 0, row: rowIndex });
    if (!detailRowRect) {
      return null;
    }

    const internalProps = this.getInternalProps();
    const originalHeight = internalProps.originalRowHeights?.get(tableRowIndex) || 0;
    const firstColRect = this.table.getCellRangeRelativeRect({ col: 0, row: rowIndex });
    const lastColRect = this.table.getCellRangeRelativeRect({ col: this.table.colCount - 1, row: rowIndex });
    if (!firstColRect || !lastColRect) {
      return null;
    }

    const margin = detailConfig?.style?.margin || 10;
    const configHeight = detailConfig?.style?.height || 300;
    const viewBox = {
      x1: firstColRect.left + margin,
      y1: detailRowRect.top + originalHeight + margin,
      x2: lastColRect.right - margin,
      y2: detailRowRect.top - margin + configHeight
    };
    // 确保viewBox有效
    if (viewBox.x2 <= viewBox.x1 || viewBox.y2 <= viewBox.y1) {
      return null;
    }
    return viewBox;
  }

  /**
   * 移除子表 - 从 ListTable.removeSubTable 抽取
   */
  private removeSubTable(tableRowIndex: number): void {
    const internalProps = this.getInternalProps();
    const subTable = internalProps.subTableInstances?.get(tableRowIndex);
    if (subTable) {
      const afterRenderHandler = (subTable as VTable.ListTable & { __afterRenderHandler?: () => void })
        .__afterRenderHandler;
      if (afterRenderHandler) {
        this.table.off('after_render', afterRenderHandler);
      }
      const selectionHandler = (subTable as VTable.ListTable & { __selectionHandler?: () => void }).__selectionHandler;
      if (selectionHandler) {
        subTable.off('click_cell', selectionHandler);
      }
      const extendedSubTable = subTable as VTable.ListTable & {
        __scrollHandler?: (args: unknown) => boolean;
        __wheelHandler?: (e: WheelEvent) => void;
      };
      const scrollHandler = extendedSubTable.__scrollHandler;
      if (scrollHandler) {
        this.table.off('can_scroll', scrollHandler);
      }
      const wheelHandler = extendedSubTable.__wheelHandler;
      if (wheelHandler) {
        subTable.canvas.removeEventListener('wheel', wheelHandler);
      }
      if (typeof subTable.release === 'function') {
        subTable.release();
      }
      internalProps.subTableInstances?.delete(tableRowIndex);
    }
  }

  // ==================== 滚动和选择管理 ====================

  /**
   * 设置滚动事件隔离 - 从 ListTable.setupScrollEventIsolation 抽取
   */
  private setupScrollEventIsolation(subTable: VTable.ListTable): void {
    // 判断鼠标是否在子表区域内
    const isMouseInChildTableArea = (event: MouseEvent) => {
      const rect = this.table.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const currentViewBox = (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } })
        .options.viewBox;
      if (!currentViewBox) {
        return false;
      }
      const isInArea =
        x >= currentViewBox.x1 && x <= currentViewBox.x2 && y >= currentViewBox.y1 && y <= currentViewBox.y2;
      return isInArea;
    };

    // 判断是否滚动到底部或者顶部
    const isSubTableAtBottom = () => {
      const totalContentHeight = subTable.getAllRowsHeight();
      const viewportHeight = subTable.scenegraph.height;
      const scrollTop = subTable.scrollTop;
      if (totalContentHeight <= viewportHeight) {
        return true;
      }
      const maxScrollTop = totalContentHeight - viewportHeight;
      const isAtBottom = Math.abs(scrollTop - maxScrollTop) <= 0;
      return isAtBottom;
    };

    const handleParentScroll = (parentArgs: unknown) => {
      const args = parentArgs as { event?: MouseEvent };
      if (args.event && isMouseInChildTableArea(args.event)) {
        return false;
      }
      return true;
    };

    this.table.on('can_scroll', handleParentScroll);

    const handleSubTableWheel = (e: WheelEvent) => {
      if (!isMouseInChildTableArea(e)) {
        return;
      }

      const deltaY = e.deltaY;
      const isScrollingDown = deltaY > 0;
      const isScrollingUp = deltaY < 0;

      if (isScrollingDown && isSubTableAtBottom()) {
        e.preventDefault();
        const currentParentScrollTop = this.table.stateManager.scroll.verticalBarPos;
        const newParentScrollTop = currentParentScrollTop + deltaY;
        const maxParentScrollTop = this.table.getAllRowsHeight() - this.table.scenegraph.height;
        if (newParentScrollTop <= maxParentScrollTop) {
          this.table.stateManager.setScrollTop(newParentScrollTop);
        }
        return;
      }

      if (isScrollingUp && subTable.scrollTop <= 0) {
        e.preventDefault();
        const currentParentScrollTop = this.table.stateManager.scroll.verticalBarPos;
        const newParentScrollTop = currentParentScrollTop + deltaY;
        if (newParentScrollTop >= 0) {
          this.table.stateManager.setScrollTop(newParentScrollTop);
        }
        return;
      }
    };

    subTable.canvas.addEventListener('wheel', handleSubTableWheel, { passive: false });

    const extendedSubTable = subTable as VTable.ListTable & {
      __scrollHandler?: (args: unknown) => boolean;
      __wheelHandler?: (e: WheelEvent) => void;
    };
    extendedSubTable.__scrollHandler = handleParentScroll;
    extendedSubTable.__wheelHandler = handleSubTableWheel;
  }

  /**
   * 设置统一选中状态管理 - 从 ListTable.setupUnifiedSelectionManagement 抽取
   */
  private setupUnifiedSelectionManagement(tableRowIndex: number, subTable: VTable.ListTable): void {
    this.table.on('click_cell', () => {
      this.clearAllSubTableVisibleSelections();
    });
    subTable.on('click_cell', () => {
      this.clearAllSelectionsExcept(tableRowIndex);
    });
    (subTable as VTable.ListTable & { __selectionHandler: () => void }).__selectionHandler = () => {
      this.clearAllSelectionsExcept(tableRowIndex);
    };
  }

  /**
   * 清除所有子表的可见选中状态 - 从 ListTable.clearAllSubTableVisibleSelections 抽取
   */
  private clearAllSubTableVisibleSelections(): void {
    const internalProps = this.getInternalProps();
    internalProps.subTableInstances?.forEach(subTable => {
      if (subTable && typeof (subTable as { clearSelected?: () => void }).clearSelected === 'function') {
        (subTable as { clearSelected: () => void }).clearSelected();
      }
    });
  }

  /**
   * 清除除指定子表外的所有选中状态 - 从 ListTable.clearAllSelectionsExcept 抽取
   */
  private clearAllSelectionsExcept(exceptRecordIndex: number): void {
    // 清除父表选中状态
    if (typeof (this.table as { clearSelected?: () => void }).clearSelected === 'function') {
      (this.table as { clearSelected: () => void }).clearSelected();
    }

    // 清除其他子表的选中状态
    const internalProps = this.getInternalProps();
    internalProps.subTableInstances?.forEach((subTable, rowIndex) => {
      if (
        rowIndex !== exceptRecordIndex &&
        subTable &&
        typeof (subTable as { clearSelected?: () => void }).clearSelected === 'function'
      ) {
        (subTable as { clearSelected: () => void }).clearSelected();
      }
    });
  }

  /**
   * 滚动时更新所有子表位置 - 从 ListTable.updateSubTablePositionsForScroll 抽取
   */
  private updateSubTablePositionsForScroll(): void {
    const internalProps = this.getInternalProps();
    internalProps.subTableInstances?.forEach((subTable, tableRowIndex) => {
      const record = this.getRecordByRowIndex(tableRowIndex);
      const detailConfig = record ? this.getDetailConfigForRecord(record, tableRowIndex) : null;
      const newViewBox = this.calculateSubTableViewBox(tableRowIndex, detailConfig);
      if (newViewBox) {
        (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } }).options.viewBox =
          newViewBox;
        if (subTable.scenegraph?.stage) {
          (subTable.scenegraph.stage as { setViewBox: (viewBox: unknown, flag: boolean) => void }).setViewBox(
            newViewBox,
            false
          );
        }
        subTable.render();
      }
    });
  }

  /**
   * 重新计算所有子表位置 - 从 ListTable.recalculateAllSubTablePositions 抽取
   */
  private recalculateAllSubTablePositions(): void {
    const internalProps = this.getInternalProps();
    const recordsToRecreate: number[] = [];
    internalProps.subTableInstances?.forEach((subTable, tableRowIndex) => {
      recordsToRecreate.push(tableRowIndex);
    });
    // 需要recordsToRecreate，因为我这个removeSubTable和renderSubTable这个都会修改subTableInstances如果直接用的话会导致混乱
    // 基于索引快照进行操作
    recordsToRecreate.forEach(tableRowIndex => {
      this.removeSubTable(tableRowIndex);
      this.renderSubTable(tableRowIndex);
    });
  }
  // ==================== 清理 ====================

  /**
   * 清理主从表格功能 - 从 ListTable.cleanupMasterDetailFeatures 抽取
   */
  private cleanupMasterDetailFeatures(): void {
    const internalProps = this.getInternalProps();

    internalProps.subTableInstances?.forEach(subTable => {
      if (typeof subTable.release === 'function') {
        subTable.release();
      }
    });
    internalProps.expandedRecordIndices?.clear();
    internalProps.subTableInstances?.clear();
    internalProps.originalRowHeights?.clear();
  }

  /**
   * 设置子表canvas裁剪，实现真正的clip截断效果
   * 让子表看起来被冻结区域"截断"
   */
  private setupSubTableCanvasClipping(subTable: VTable.ListTable): void {
    // 获取子表的stage
    if (!subTable.scenegraph?.stage) {
      return;
    }

    const stage = subTable.scenegraph.stage;
    
    // 拦截stage的渲染方法，在渲染前应用裁剪
    const originalRender = stage.render;
    if (typeof originalRender === 'function') {
      stage.render = () => {
        const window = stage.window;
        if (window && typeof window.getContext === 'function') {
          const context = window.getContext();
          if (context) {
            // 保存canvas状态
            context.save();
            try {
              // 计算裁剪区域 - 避开父表的冻结区域
              const frozenRowsHeight = this.table.getFrozenRowsHeight();
              const frozenColsWidth = this.table.getFrozenColsWidth();
              const rightFrozenColsWidth = this.table.getRightFrozenColsWidth();
              const bottomFrozenRowsHeight = this.table.getBottomFrozenRowsHeight();
              // 获取父表的可视区域
              const tableWidth = this.table.tableNoFrameWidth;
              const tableHeight = this.table.tableNoFrameHeight;
              // 设置裁剪区域：从冻结区域后开始，到右侧和底部冻结区域前结束
              const clipX = frozenColsWidth;
              const clipY = frozenRowsHeight;
              const clipWidth = tableWidth - frozenColsWidth - rightFrozenColsWidth;
              const clipHeight = tableHeight - frozenRowsHeight - bottomFrozenRowsHeight;
              // 确保裁剪区域有效
              if (clipWidth > 0 && clipHeight > 0) {
                // 应用裁剪 - 需要根据设备像素比转换坐标系统
                const dpr = this.table.internalProps.pixelRatio || 1;
                context.beginPath();
                // 转换为VRender内部坐标系统（dpr倍数）
                context.rect(clipX * dpr, clipY * dpr, clipWidth * dpr, clipHeight * dpr);
                context.clip();
              }
              originalRender.call(stage);
            } finally {
              context.restore();
            }
          } else {
            originalRender.call(stage);
          }
        } else {
          originalRender.call(stage);
        }
      };
    }
  }
}
