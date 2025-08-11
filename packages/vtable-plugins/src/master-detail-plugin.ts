import * as VTable from '@visactor/vtable';
import { createLine, createRect } from '@visactor/vtable/es/vrender';

/** 子表配置接口 - 继承 ListTableConstructorOptions */
export interface DetailGridOptions extends Partial<VTable.ListTableConstructorOptions> {
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}

/**
 * 主从表插件配置选项
 */
export interface MasterDetailPluginOptions {
  id?: string;
  /** 是否启用主从表功能 */
  enabled?: boolean;
  /** 静态子表配置 */
  detailGridOptions?: DetailGridOptions;
  /** 动态子表配置函数 */
  getDetailGridOptions?: (params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions;
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
    VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_CELL_CONTENT_WIDTH,
    VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT
  ];

  pluginOptions: MasterDetailPluginOptions;
  table: VTable.ListTable;
  // 保护展开行的CellGroup高度
  private protectedCellHeights: Map<string, number> = new Map();
  // 原始updateCellContent方法的引用
  private originalUpdateCellContent?: Function;
  // 展开状态管理 - 存储展开的行索引
  private expandedRows: number[] = [];
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
      // 使用 queueMicrotask 确保在当前执行栈完成后立即执行
      // 这样可以在表格构造完成但还没开始渲染时设置虚拟记录高度
      queueMicrotask(() => {
        this.setupVirtualRecordRowHeight();
      });
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
    } else if (runTime === VTable.TABLE_EVENT_TYPE.AFTER_UPDATE_SELECT_BORDER_HEIGHT) {
      this.handleAfterUpdateSelectBorderHeight(eventArgs as any);
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
    const { cellGroup, cellHeight, padding, textBaseline } = eventData;
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
  }

  /**
   * 处理选择边框高度更新后的事件
   */
  private handleAfterUpdateSelectBorderHeight(eventData: {
    startRow: number;
    endRow: number;
    currentHeight: number;
    selectComp: { rect: any; fillhandle?: any; role: string };
  }): void {
    const { startRow, endRow, selectComp } = eventData;
    // 判断是否为单选一个单元格或者为一行的（只有这种情况才使用原始高度）
    const isSingleCellSelection = startRow === endRow;
    if (isSingleCellSelection) {
      // 单选一个CellGroup，使用原始高度
      const headerCount = this.table.columnHeaderLevelCount || 0;
      const bodyRowIndex = startRow - headerCount;
      const originalHeight = this.getOriginalRowHeight(bodyRowIndex);
      if (originalHeight > 0 && originalHeight !== eventData.currentHeight) {
        selectComp.rect.setAttributes({
          height: originalHeight
        });
        // 如果有填充柄，也需要调整位置 ? 这是什么？？
        if (selectComp.fillhandle) {
          const currentY = selectComp.rect.attribute.y;
          selectComp.fillhandle.setAttributes({
            y: currentY + originalHeight - 6 // 6是填充柄的一半高度
          });
        }
      }
    }
    // 其他情况（拖拽选择多行、表头选择等）使用默认的currentHeight，不做任何修改
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
    this.expandedRows.length = 0;
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
   * 插入虚拟记录来解决视口限制问题
   */
  private injectVirtualRecords(options: VTable.ListTableConstructorOptions): void {
    if (!options.records || !Array.isArray(options.records)) {
      return;
    }

    const originalRecords = options.records;
    if (originalRecords.length === 0) {
      return;
    }

    // 创建最小虚拟记录（所有字段为空或最小值）
    const minRecord = this.createVirtualRecord(originalRecords, 'min');

    // 创建最大虚拟记录（所有字段为空或最大值）
    const maxRecord = this.createVirtualRecord(originalRecords, 'max');

    // 插入虚拟记录：最小记录在开头，最大记录在末尾
    options.records = [minRecord, ...originalRecords, maxRecord];
  }

  /**
   * 创建虚拟记录
   */
  private createVirtualRecord(
    originalRecords: Record<string, unknown>[],
    type: 'min' | 'max'
  ): Record<string, unknown> {
    const record: Record<string, unknown> = {};
    // 分析原始记录的字段类型
    const fieldAnalysis = this.analyzeRecordFields(originalRecords);
    // 根据字段类型填充虚拟值
    for (const [fieldName, fieldInfo] of Object.entries(fieldAnalysis)) {
      if (type === 'min') {
        record[fieldName] = this.getMinValueForField(fieldInfo);
      } else {
        record[fieldName] = this.getMaxValueForField(fieldInfo);
      }
    }

    // 确保虚拟记录不会显示展开图标
    record.hierarchyState = VTable.TYPES.HierarchyState.none;
    record.children = undefined;
    return record;
  }

  /**
   * 分析记录字段的类型和范围
   */
  private analyzeRecordFields(records: Record<string, unknown>[]): Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
      minValue?: number;
      maxValue?: number;
      hasNull: boolean;
    }
  > {
    const analysis: Record<
      string,
      {
        type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
        minValue?: number;
        maxValue?: number;
        hasNull: boolean;
      }
    > = {};

    // 收集所有字段名
    const allFields = new Set<string>();
    records.forEach(record => {
      Object.keys(record).forEach(key => allFields.add(key));
    });

    // 分析每个字段
    allFields.forEach(fieldName => {
      const values = records.map(record => record[fieldName]).filter(value => value !== null && value !== undefined);
      if (values.length === 0) {
        analysis[fieldName] = { type: 'unknown', hasNull: true };
        return;
      }

      const firstValue = values[0];
      let type: 'string' | 'number' | 'boolean' | 'date' | 'unknown' = 'unknown';
      let minValue: number | undefined;
      let maxValue: number | undefined;
      if (typeof firstValue === 'string') {
        type = 'string';
      } else if (typeof firstValue === 'number') {
        type = 'number';
        const numberValues = values.filter(v => typeof v === 'number') as number[];
        minValue = Math.min(...numberValues);
        maxValue = Math.max(...numberValues);
      } else if (typeof firstValue === 'boolean') {
        type = 'boolean';
      } else if (firstValue instanceof Date) {
        type = 'date';
      }

      analysis[fieldName] = {
        type,
        minValue,
        maxValue,
        hasNull: records.some(record => record[fieldName] === null || record[fieldName] === undefined)
      };
    });

    return analysis;
  }

  /**
   * 获取字段的最小值
   */
  private getMinValueForField(fieldInfo: { type: string; minValue?: number }): unknown {
    switch (fieldInfo.type) {
      case 'string':
        return '';
      case 'number':
        return fieldInfo.minValue !== undefined ? fieldInfo.minValue - 1 : Number.MIN_SAFE_INTEGER;
      case 'boolean':
        return false;
      case 'date':
        return new Date(0);
      default:
        return null;
    }
  }

  /**
   * 获取字段的最大值
   */
  private getMaxValueForField(fieldInfo: { type: string; maxValue?: number }): unknown {
    switch (fieldInfo.type) {
      case 'string':
        return '\uFFFF'; // Unicode 最大字符
      case 'number':
        return fieldInfo.maxValue !== undefined ? fieldInfo.maxValue + 1 : Number.MAX_SAFE_INTEGER;
      case 'boolean':
        return true;
      case 'date':
        return new Date(2099, 11, 31);
      default:
        return null;
    }
  }

  /**
   * 设置虚拟记录的零高度（在表格初始化完成后调用）
   */
  private setupVirtualRecordRowHeight(): void {
    // 计算正确的行索引
    const headerRowCount = this.table.columnHeaderLevelCount;
    const firstDataRowIndex = headerRowCount;
    const lastDataRowIndex = this.table.rowCount - this.table.bottomFrozenRowCount - 1; // 最后一个数据行（虚拟最大记录）
    try {
      // 尝试多种方法设置最后一行高度为 0
      if (typeof this.table.setRowHeight === 'function') {
        this.table.setRowHeight(firstDataRowIndex, 0);
        this.table._setRowHeight(lastDataRowIndex, 0, true);
      }
    } catch (error) {
      // 设置失败时静默处理
      console.warn('Failed to set virtual record row height:', error);
    }
  }
  /**
   * 注入主从表配置到表格选项中
   */
  private injectMasterDetailOptions(options: VTable.ListTableConstructorOptions): void {
    // 启用主从表基础设施
    (options as VTable.ListTableConstructorOptions & { masterDetail: boolean }).masterDetail = true;

    // 插入虚拟记录来处理视口限制问题
    this.injectVirtualRecords(options);

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
          getDetailGridOptions: (params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions;
        }
      ).getDetailGridOptions = getDetailOptions;
    }

    // 设置层级文本对齐
    if (this.pluginOptions.hierarchyTextStartAlignment !== undefined) {
      options.hierarchyTextStartAlignment = this.pluginOptions.hierarchyTextStartAlignment;
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
      expandedRecordIndices?: number[];
      subTableInstances?: Map<number, VTable.ListTable>;
      originalRowHeights?: Map<number, number>;
    };
    internalProps.expandedRecordIndices = []; // 初始化为空数组
    internalProps.subTableInstances = new Map();
    internalProps.originalRowHeights = new Map();
  }

  /**
   * 绑定事件处理器 - 从 ListTable.initMasterDetailFeatures 抽取
   */
  private bindEventHandlers(): void {
    // handleIconClick已经在BEFORE_INIT阶段替换了，这里只需要绑定滚动事件
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => this.updateSubTablePositionsForScroll());
    
    // 重写父表的resize方法，在表格尺寸变化时重新计算子表位置和宽度
    this.wrapTableResizeMethod();
  }

  /**
   * 重写父表的resize方法 - 基于您的ListTable实现
   */
  private wrapTableResizeMethod(): void {
    const originalResize = this.table.resize.bind(this.table);
    this.table.resize = () => {
      // 调用原始的resize方法
      originalResize();
      this.updateSubTablePositionsForResize();
    };
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
    const isExpandedRow = this.expandedRows.includes(row);
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
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = this.getInternalProps();
    if (internalProps._heightResizedRowMap.has(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
    if (internalProps.expandedRecordIndices) {
      if (!internalProps.expandedRecordIndices.includes(recordIndex)) {
        internalProps.expandedRecordIndices.push(recordIndex);
      }
    }

    // 更新展开状态数组
    if (!this.expandedRows.includes(rowIndex)) {
      this.expandedRows.push(rowIndex);
    }

    const originalHeight = this.table.getRowHeight(rowIndex);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.set(bodyRowIndex, originalHeight);
    }
    const record = this.getRecordByRowIndex(bodyRowIndex);
    const detailConfig = this.getDetailConfigForRecord(record, bodyRowIndex);
    const height = detailConfig?.style?.height || 200;

    if (record) {
      (record as { hierarchyState?: VTable.TYPES.HierarchyState }).hierarchyState = VTable.TYPES.HierarchyState.expand;
    }

    const deltaHeight = height - originalHeight;
    this.updateRowHeightForExpand(rowIndex, deltaHeight);
    this.table.scenegraph.updateContainerHeight(rowIndex, deltaHeight);
    internalProps._heightResizedRowMap.add(rowIndex);

    this.updateIconsForRow(rowIndex);
    this.renderSubTable(bodyRowIndex);
    // 只重新计算当前行之后的子表位置，提高性能
    this.recalculateAllSubTablePositions(bodyRowIndex + 1);
    this.addUnderlineToExpandedRow(rowIndex, originalHeight);
  }

  /**
   * 收起行 - 从 ListTable.collapseRow 抽取
   */
  collapseRow(rowIndex: number): void {
    const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
    const internalProps = this.getInternalProps();

    if (!internalProps._heightResizedRowMap.has(rowIndex)) {
      return;
    }

    const realRecordIndex = this.table.getRecordIndexByCell(0, rowIndex);
    const recordIndex = typeof realRecordIndex === 'number' ? realRecordIndex : realRecordIndex[0];
    this.removeSubTable(bodyRowIndex);
    if (internalProps.expandedRecordIndices) {
      const index = internalProps.expandedRecordIndices.indexOf(recordIndex);
      if (index > -1) {
        internalProps.expandedRecordIndices.splice(index, 1);
      }
    }

    // 更新展开状态数组
    const expandedIndex = this.expandedRows.indexOf(rowIndex);
    if (expandedIndex > -1) {
      this.expandedRows.splice(expandedIndex, 1);
    }

    const record = this.getRecordByRowIndex(bodyRowIndex);
    if (record) {
      (record as { hierarchyState?: VTable.TYPES.HierarchyState }).hierarchyState =
        VTable.TYPES.HierarchyState.collapse;
    }

    const currentHeight = this.table.getRowHeight(rowIndex);
    const originalHeight = this.getOriginalRowHeight(bodyRowIndex);
    const deltaHeight = currentHeight - originalHeight;
    this.updateRowHeightForExpand(rowIndex, -deltaHeight);
    internalProps._heightResizedRowMap.delete(rowIndex);
    this.table.scenegraph.updateContainerHeight(rowIndex, -deltaHeight);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.delete(bodyRowIndex);
    }

    this.updateIconsForRow(rowIndex);
    // 删除展开行的下划线
    this.removeUnderlineFromRow(rowIndex);
    // 只重新计算当前行之后的子表位置，提高性能
    this.recalculateAllSubTablePositions(bodyRowIndex + 1);
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
   * 解析 margin 配置，返回 [上, 右, 下, 左] 格式
   */
  private parseMargin(
    margin?: number | [number, number] | [number, number, number, number]
  ): [number, number, number, number] {
    if (margin === undefined || margin === null) {
      return [10, 10, 10, 10]; // 默认值
    }
    if (typeof margin === 'number') {
      return [margin, margin, margin, margin];
    }
    if (Array.isArray(margin)) {
      if (margin.length === 2) {
        // [上下, 左右]
        const [vertical, horizontal] = margin;
        return [vertical, horizontal, vertical, horizontal];
      } else if (margin.length === 4) {
        // [上, 右, 下, 左]
        return margin;
      }
    }
    return [10, 10, 10, 10];
  }

  /**
   * masterDetail模式下排序前的操作
   */
  private executeMasterDetailBeforeSort(): void {
    const table = this.table as any;
    if (table.internalProps.expandedRecordIndices && table.internalProps.expandedRecordIndices.length > 0) {
      table.internalProps._tempExpandedRecordIndices = [...table.internalProps.expandedRecordIndices];
    }
    // 改为使用expandedRows来处理排序前的收起操作
    if (this.expandedRows.length > 0) {
      // 保存当前展开的行索引
      const expandedRowIndices = [...this.expandedRows];
      expandedRowIndices.forEach(rowIndex => {
        try {
          table.collapseRow(rowIndex);
        } catch (e) {
          // 收起失败
          console.warn(`Failed to collapse row ${rowIndex} before sort:`, e);
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
    if (tempExpandedRecordIndices && tempExpandedRecordIndices.length > 0) {
      const recordIndicesArray = [...tempExpandedRecordIndices];
      recordIndicesArray.forEach(recordIndex => {
        const currentPagerData = table.dataSource._currentPagerIndexedData;
        if (currentPagerData) {
          const bodyRowIndex = currentPagerData.indexOf(recordIndex);
          if (bodyRowIndex >= 0) {
            try {
              // 使用插件的expandRow方法，而不是table的原生方法
              const targetRowIndex = bodyRowIndex + table.columnHeaderLevelCount;
              this.expandRow(targetRowIndex);
            } catch (e) {
              // 展开失败
              console.warn(`Failed to expand row ${bodyRowIndex + table.columnHeaderLevelCount} after sort:`, e);
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
      expandedRecordIndices: number[];
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
        // 情况就是如果他的一开始的this.table.scenegraph.proxy.rowEnd不是和这个this.table.rowCount相同的情况下
        // 如果这个this.table.scenegraph.proxy.rowEnd和this.table.rowCount这个相同的话就会有问题，这是为什么？是分开渲染的结果？
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
  private getDetailConfigForRecord(record: unknown, bodyRowIndex: number): DetailGridOptions | null {
    return (
      this.pluginOptions.getDetailGridOptions?.({ data: record, bodyRowIndex: bodyRowIndex }) ||
      this.pluginOptions.detailGridOptions ||
      null
    );
  }

  /**
   * 根据行索引获取记录 - 从 ListTable.getRecordByRowIndex 抽取
   */
  private getRecordByRowIndex(bodyRowIndex: number): Record<string, unknown> {
    return this.table.dataSource.getRaw(bodyRowIndex) as Record<string, unknown>;
  }

  /**
   * 获取原始行高 - 从 ListTable.getOriginalRowHeight 抽取
   */
  private getOriginalRowHeight(bodyRowIndex: number): number {
    const internalProps = this.getInternalProps();
    return internalProps.originalRowHeights?.get(bodyRowIndex) || 0;
  }

  // ==================== 子表管理 ====================

  /**
   * 渲染子表 - 从 ListTable.renderSubTable 抽取
   */
  private renderSubTable(bodyRowIndex: number): void {
    const internalProps = this.getInternalProps();
    const record = this.getRecordByRowIndex(bodyRowIndex);
    if (!record || !record.children) {
      return;
    }
    const detailConfig = this.getDetailConfigForRecord(record, bodyRowIndex);
    const childViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
    if (!childViewBox) {
      return;
    }
    const childrenData = Array.isArray(record.children) ? record.children : [];
    const containerWidth = childViewBox.x2 - childViewBox.x1;
    const containerHeight = childViewBox.y2 - childViewBox.y1;
    // 创建子表配置，首先使用父表的重要属性作为基础
    const parentOptions = (this.table as { options: VTable.ListTableConstructorOptions }).options;
    const baseSubTableOptions: VTable.ListTableConstructorOptions = {
      viewBox: childViewBox,
      canvas: this.table.canvas,
      records: childrenData,
      columns: detailConfig?.columns || [],
      widthMode: 'adaptive' as const,
      showHeader: true,
      canvasWidth: containerWidth,
      canvasHeight: containerHeight,
      // 继承父表的重要属性
      theme: parentOptions.theme,
      // 可以继承更多父表属性
      defaultRowHeight: parentOptions.defaultRowHeight,
      defaultHeaderRowHeight: parentOptions.defaultHeaderRowHeight,
      defaultColWidth: parentOptions.defaultColWidth,
      keyboardOptions: parentOptions.keyboardOptions
    };
    // 用户自定义配置覆盖默认配置（排除 style 属性，因为它不是 ListTableConstructorOptions 的一部分）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { style: _style, ...userDetailConfig } = detailConfig || {};
    const subTableOptions = {
      ...baseSubTableOptions,
      ...userDetailConfig
    };
    const subTable = new VTable.ListTable(this.table.container, subTableOptions);
    internalProps.subTableInstances.set(bodyRowIndex, subTable);

    // 确保子表内容在父表重绘后保持在上层
    const afterRenderHandler = () => {
      if (internalProps.subTableInstances && internalProps.subTableInstances.has(bodyRowIndex)) {
        subTable.render();
      }
    };
    this.table.on('after_render', afterRenderHandler);
    (subTable as VTable.ListTable & { __afterRenderHandler: () => void }).__afterRenderHandler = afterRenderHandler;

    // 设置滚动事件隔离
    this.setupScrollEventIsolation(subTable);
    // 设置统一选中状态管理
    this.setupUnifiedSelectionManagement(bodyRowIndex, subTable);
    // 设置子表canvas裁剪，实现真正的clip效果
    this.setupSubTableCanvasClipping(subTable);
    // 初始渲染
    subTable.render();
  }

  /**
   * 计算子表的viewBox区域 - 从 ListTable.calculateSubTableViewBox 抽取
   */
  private calculateSubTableViewBox(
    bodyRowIndex: number,
    detailConfig?: DetailGridOptions | null
  ): { x1: number; y1: number; x2: number; y2: number } | null {
    const rowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
    const detailRowRect = this.table.getCellRangeRelativeRect({ col: 0, row: rowIndex });
    if (!detailRowRect) {
      return null;
    }

    const internalProps = this.getInternalProps();
    const originalHeight = internalProps.originalRowHeights?.get(bodyRowIndex) || 0;
    const firstColRect = this.table.getCellRangeRelativeRect({ col: 0, row: rowIndex });
    const lastColRect = this.table.getCellRangeRelativeRect({ col: this.table.colCount - 1, row: rowIndex });
    if (!firstColRect || !lastColRect) {
      return null;
    }

    // 解析margin配置 [上, 右, 下, 左]
    const [marginTop, marginRight, marginBottom, marginLeft] = this.parseMargin(detailConfig?.style?.margin);
    const configHeight = detailConfig?.style?.height || 300;
    const viewBox = {
      x1: firstColRect.left + marginLeft,
      y1: detailRowRect.top + originalHeight + marginTop,
      x2: lastColRect.right - marginRight,
      y2: detailRowRect.top - marginBottom + configHeight
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
  private removeSubTable(bodyRowIndex: number): void {
    const internalProps = this.getInternalProps();
    const subTable = internalProps.subTableInstances?.get(bodyRowIndex);
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
      internalProps.subTableInstances?.delete(bodyRowIndex);
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
  private setupUnifiedSelectionManagement(bodyRowIndex: number, subTable: VTable.ListTable): void {
    this.table.on('click_cell', () => {
      this.clearAllSubTableVisibleSelections();
    });
    subTable.on('click_cell', () => {
      this.clearAllSelectionsExcept(bodyRowIndex);
    });
    (subTable as VTable.ListTable & { __selectionHandler: () => void }).__selectionHandler = () => {
      this.clearAllSelectionsExcept(bodyRowIndex);
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
    internalProps.subTableInstances?.forEach((subTable, bodyRowIndex) => {
      const record = this.getRecordByRowIndex(bodyRowIndex);
      const detailConfig = record ? this.getDetailConfigForRecord(record, bodyRowIndex) : null;
      const newViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
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
   * 父表尺寸变化时更新所有子表位置和宽度 - 基于您的 recalculateAllSubTablePositions 实现
   */
  private updateSubTablePositionsForResize(): void {
    const internalProps = this.getInternalProps();
    if (!internalProps.subTableInstances) {
      return;
    }
    internalProps.subTableInstances.forEach((subTable, bodyRowIndex) => {
      // 获取记录数据和配置
      const record = this.getRecordByRowIndex(bodyRowIndex);
      const detailConfig = record ? this.getDetailConfigForRecord(record, bodyRowIndex) : null;
      // 重新计算子表的ViewBox区域
      const newViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
      if (newViewBox) {
        const newContainerWidth = newViewBox.x2 - newViewBox.x1;
        const newContainerHeight = newViewBox.y2 - newViewBox.y1;
        // 更新子表的ViewBox
        (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } }).options.viewBox =
          newViewBox;
        // 更新子表的容器尺寸，触发内部布局重计算
        const subTableOptions = subTable.options as any;
        if (subTableOptions.canvasWidth !== newContainerWidth || subTableOptions.canvasHeight !== newContainerHeight) {
          subTableOptions.canvasWidth = newContainerWidth;
          subTableOptions.canvasHeight = newContainerHeight;
          // 通知子表尺寸已变化，需要重新布局
          subTable.resize();
        }
        // 通知VRender Stage更新ViewBox
        if (subTable.scenegraph?.stage) {
          (subTable.scenegraph.stage as { setViewBox: (viewBox: unknown, flag: boolean) => void }).setViewBox(
            newViewBox,
            false
          );
        }
        // 重新渲染子表
        subTable.render();
      }
    });
    // resize后重绘所有展开行的下划线，因为cell位置和尺寸可能已改变
    this.redrawAllUnderlines();
  }

  /**
   * 重新计算子表位置 - 从 ListTable.recalculateAllSubTablePositions 抽取
   * @param start 开始的bodyRowIndex，默认为最小值
   * @param end 结束的bodyRowIndex，默认为最大值
   */
  private recalculateAllSubTablePositions(start?: number, end?: number): void {
    const internalProps = this.getInternalProps();
    const recordsToRecreate: number[] = [];
    internalProps.subTableInstances?.forEach((subTable, bodyRowIndex) => {
      // 如果指定了范围，只处理范围内的子表
      if (start !== undefined && bodyRowIndex < start) {
        return;
      }
      if (end !== undefined && bodyRowIndex > end) {
        return;
      }
      recordsToRecreate.push(bodyRowIndex);
    });
    // 需要recordsToRecreate，因为我这个removeSubTable和renderSubTable这个都会修改subTableInstances如果直接用的话会导致混乱
    // 基于索引快照进行操作
    recordsToRecreate.forEach(bodyRowIndex => {
      this.removeSubTable(bodyRowIndex);
      this.renderSubTable(bodyRowIndex);
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
    internalProps.expandedRecordIndices.length = 0;
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

  /**
   * 添加展开行的下划线 - 使用VTable内部的渲染机制
   */
  private addUnderlineToExpandedRow(rowIndex: number, originalHeight: number): void {
    // 检查行是否在当前渲染范围内
    const sceneGraph = (this.table as any).scenegraph;
    const proxy = sceneGraph?.proxy;
    if (proxy && (rowIndex < proxy.rowStart || rowIndex > proxy.rowEnd)) {
      // 行不在当前渲染范围内，延迟处理
      this.scheduleUnderlineDrawing(rowIndex, originalHeight);
      return;
    }
    // 等待下一个渲染帧，确保DOM已更新
    setTimeout(() => {
      this.drawUnderlineForRow(rowIndex, originalHeight);
    }, 0);
  }

  /**
   * 调度下划线绘制任务 - 当行进入视口时执行
   */
  private scheduleUnderlineDrawing(rowIndex: number, originalHeight: number): void {
    // 监听滚动事件，当目标行进入视口时绘制下划线
    const handleScroll = () => {
      const sceneGraph = (this.table as any).scenegraph;
      const proxy = sceneGraph?.proxy;
      if (proxy && rowIndex >= proxy.rowStart && rowIndex <= proxy.rowEnd) {
        // 行现在在视口内，可以绘制下划线
        this.table.off(VTable.TABLE_EVENT_TYPE.SCROLL, handleScroll);
        setTimeout(() => {
          this.drawUnderlineForRow(rowIndex, originalHeight);
        }, 50);
      }
    };
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, handleScroll);
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
   * 为cell添加下划线 - 使用CellGroup原本的边线样式
   */
  private addUnderlineToCell(cellGroup: any, originalHeight: number): void {
    // 检查是否已经添加了下划线标记
    if (cellGroup._hasUnderline) {
      return;
    }
    // 标记这个cell已添加下划线
    cellGroup._hasUnderline = true;
    // 获取CellGroup的边线样式
    const borderStyle = this.getCellBorderStyle(cellGroup);
    // 临时解决方案：如果获取到的lineWidth是1，尝试使用更粗的线条
    const adjustedWidth = borderStyle.width * 2;
    // 创建下划线Line元素 - 使用原本的边线样式
    const underline = createLine({
      x: 0,
      y: originalHeight, // Line元素的起始Y位置
      points: [
        { x: 0, y: 0 }, // 相对于Line元素的起始点
        { x: cellGroup.attribute.width, y: 0 } // 相对于Line元素的结束点
      ],
      stroke: borderStyle.color,
      lineWidth: adjustedWidth,
      lineDash: borderStyle.lineDash,
      visible: true,
      opacity: borderStyle.opacity
    });

    underline.name = 'detail-underline';
    // 将下划线添加到cell中
    cellGroup.appendChild(underline);
  }

  /**
   * 获取CellGroup的边线样式
   */
  private getCellBorderStyle(cellGroup: any): {
    color: string;
    width: number;
    lineDash?: number[];
    opacity: number;
  } {
    // 默认样式
    const defaultStyle = {
      color: '#e1e4e8',
      width: 1,
      opacity: 1
    };

    try {
      // 优先从cellGroup的strokeArrayWidth获取底部边框宽度
      if (cellGroup.attribute?.strokeArrayWidth) {
        const strokeArrayWidth = cellGroup.attribute.strokeArrayWidth;
        // strokeArrayWidth是[top, right, bottom, left]格式
        const bottomBorderWidth = strokeArrayWidth[2] || strokeArrayWidth[0] || 1;
        const style = {
          color: cellGroup.attribute.stroke || cellGroup.attribute.strokeArrayColor?.[2] || '#e1e4e8',
          width: bottomBorderWidth,
          lineDash: cellGroup.attribute.lineDash,
          opacity: cellGroup.attribute.opacity || 1
        };
        return style;
      }
      // 尝试从cellGroup的属性中获取边线样式
      const cellAttribute = cellGroup.attribute;
      // 检查是否有边框样式定义
      if (cellAttribute?.stroke) {
        const style = {
          color: cellAttribute.stroke,
          width: cellAttribute.lineWidth || 1,
          lineDash: cellAttribute.lineDash,
          opacity: cellAttribute.opacity || 1
        };
        return style;
      }

      // 尝试从表格主题获取边线样式
      const table = this.table as any;
      if (table.theme?.bodyStyle?.borderColor) {
        // 检查是否有borderLineWidth数组
        let borderWidth = 1;
        if (table.theme.bodyStyle.borderLineWidth) {
          if (Array.isArray(table.theme.bodyStyle.borderLineWidth)) {
            // borderLineWidth是[top, right, bottom, left]格式，取底部边框
            borderWidth = table.theme.bodyStyle.borderLineWidth[2] || table.theme.bodyStyle.borderLineWidth[0] || 1;
          } else {
            borderWidth = table.theme.bodyStyle.borderLineWidth;
          }
        }
        const style = {
          color: table.theme.bodyStyle.borderColor,
          width: borderWidth,
          lineDash: table.theme.bodyStyle.borderLineDash,
          opacity: 1
        };
        return style;
      }

      // 尝试从scenegraph中查找边框元素的样式
      if (cellGroup.children) {
        for (let i = 0; i < cellGroup.children.length; i++) {
          const child = cellGroup.children[i];
          // 查找边框相关的元素
          if (child.name && (child.name.includes('border') || child.name.includes('frame'))) {
            if (child.attribute?.stroke) {
              const style = {
                color: child.attribute.stroke,
                width: child.attribute.lineWidth || 1,
                lineDash: child.attribute.lineDash,
                opacity: child.attribute.opacity || 1
              };
              return style;
            }
          }
          // 查找具有stroke属性的子元素
          if (child.attribute?.stroke && child.attribute.stroke !== 'transparent') {
            const style = {
              color: child.attribute.stroke,
              width: child.attribute.lineWidth || 1,
              lineDash: child.attribute.lineDash,
              opacity: child.attribute.opacity || 1
            };
            return style;
          }
        }
      }
      return defaultStyle;
    } catch (error) {
      console.warn('Failed to get cell border style, using default:', error);
      return defaultStyle;
    }
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
   * 从cell中删除下划线
   */
  private removeUnderlineFromCell(cellGroup: any): void {
    // 查找并删除下划线元素
    if (cellGroup.children) {
      const underlineIndex = cellGroup.children.findIndex((child: any) => child.name === 'detail-underline');
      if (underlineIndex !== -1) {
        const underline = cellGroup.children[underlineIndex];
        cellGroup.removeChild(underline);
      }
    }
    // 清除下划线标记
    cellGroup._hasUnderline = false;
  }

  /**
   * 重绘所有展开行的下划线 - 用于resize后重新定位
   */
  private redrawAllUnderlines(): void {
    this.expandedRows.forEach(rowIndex => {
      const bodyRowIndex = rowIndex - this.table.columnHeaderLevelCount;
      const originalHeight = this.getOriginalRowHeight(bodyRowIndex);
      if (originalHeight > 0) {
        // 先删除旧的下划线
        this.removeUnderlineFromRow(rowIndex);
        // 重新绘制下划线
        this.addUnderlineToExpandedRow(rowIndex, originalHeight);
      }
    });
  }
}
