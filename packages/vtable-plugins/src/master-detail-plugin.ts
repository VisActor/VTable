import * as VTable from '@visactor/vtable';

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
  /** 静态子表配置 */
  detailGridOptions?: DetailGridOptions;
  /** 动态子表配置函数 */
  getDetailGridOptions?: (params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions;
}

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
        expandedRows: []
      },
      pluginOptions
    );
  }

  run(...args: unknown[]): boolean | void {
    const eventArgs = args[0];
    const runTime = args[1];
    const table = args[2] as VTable.ListTable;

    if (runTime === VTable.TABLE_EVENT_TYPE.BEFORE_INIT) {
      this.table = table;
      this.injectMasterDetailOptions((eventArgs as { options: VTable.ListTableConstructorOptions }).options);
      queueMicrotask(() => {
        this.setupVirtualRecordRowHeight();
      });
    } else if (runTime === VTable.TABLE_EVENT_TYPE.INITIALIZED) {
      this.setupMasterDetailFeatures();
    } else if (runTime === VTable.TABLE_EVENT_TYPE.SORT_CLICK) {
      // 排序前处理：保存展开状态并收起所有行
      this.executeMasterDetailBeforeSort();
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
    let effectiveCellHeight = cellHeight;
    if (cellGroup.col !== undefined && cellGroup.row !== undefined) {
      try {
        const recordIndex = this.table.getRecordShowIndexByCell(cellGroup.col, cellGroup.row);
        if (recordIndex !== undefined) {
          const originalHeight = this.getOriginalRowHeight(recordIndex);
          if (originalHeight > 0) {
            effectiveCellHeight = originalHeight;
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
        if (selectComp.fillhandle) {
          const currentY = selectComp.rect.attribute.y;
          selectComp.fillhandle.setAttributes({
            y: currentY + originalHeight
          });
        }
      }
    }
    // 其他情况（拖拽选择多行、表头选择等）使用默认的currentHeight，不做任何修改
  }

  update() {
    if (this.table) {
      this.recalculateAllSubTablePositions();
    }
  }

  release() {
    this.cleanupMasterDetailFeatures();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
    this.expandedRows.length = 0;
    this.table = null as any;
  }
  // ==================== 配置注入 ====================
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

  private setupVirtualRecordRowHeight(): void {
    // 计算正确的行索引
    const firstDataRowIndex = this.table.columnHeaderLevelCount;
    const lastDataRowIndex = this.table.rowCount - this.table.bottomFrozenRowCount - 1;
    try {
      if (typeof this.table.setRowHeight === 'function') {
        const visibleRange = this.table.getBodyVisibleRowRange();
        this.table.setRowHeight(firstDataRowIndex, 0);
        if (visibleRange && lastDataRowIndex >= visibleRange.rowStart && lastDataRowIndex <= visibleRange.rowEnd) {
          this.table.setRowHeight(lastDataRowIndex, 0);
        } else {
          this.table._setRowHeight(lastDataRowIndex, 0, true);
        }
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

    // 给第一列添加图标
    this.injectHierarchyIcons(options);

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
  }

  /**
   * 给第一列添加层级图标
   */
  private injectHierarchyIcons(options: VTable.ListTableConstructorOptions): void {
    if (!options.columns || options.columns.length === 0) {
      return;
    }

    // 获取第一列
    const firstColumn = options.columns[0] as any;

    // 直接监听 ICON_CLICK 事件
    this.table.on(VTable.TABLE_EVENT_TYPE.ICON_CLICK, (iconInfo: any) => {
      const { col, row, funcType, name } = iconInfo;
      // 检查是否是我们的层级图标
      if (
        (name === 'hierarchy-expand' || name === 'hierarchy-collapse') &&
        (funcType === VTable.TYPES.IconFuncTypeEnum.expand || funcType === VTable.TYPES.IconFuncTypeEnum.collapse)
      ) {
        this.toggleRowExpand(row);
      }
    });

    // 创建图标函数
    const iconFunction = (params: {
      col: number;
      row: number;
      dataValue: unknown;
      cellValue: unknown;
    }): VTable.TYPES.SvgIcon[] => {
      const { col, row } = params;
      // 获取记录
      let record: unknown;
      try {
        const recordIndex = this.table.getRecordShowIndexByCell(col, row);
        if (recordIndex !== undefined) {
          record = this.table.getRecordByCell(col, row);
        }
      } catch (error) {
        return [];
      }
      // 检查是否有children
      if (!record || !Array.isArray((record as any).children) || (record as any).children.length === 0) {
        return [
          {
            type: 'svg',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <!-- 透明占位图标，用于保持对齐 -->
            </svg>`,
            width: 16,
            height: 16,
            name: 'hierarchy-placeholder',
            positionType: VTable.TYPES.IconPosition.contentLeft,
            marginLeft: 0,
            marginRight: 4,
            cursor: 'default'
          } as VTable.TYPES.SvgIcon
        ];
      }

      // 检查展开状态 - 直接使用行索引
      const isExpanded = this.expandedRows.includes(row);

      // 返回对应的图标配置
      if (isExpanded) {
        return [
          {
            type: 'svg',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opacity="1"/>
          </svg>`,
            width: 16,
            height: 16,
            name: 'hierarchy-collapse',
            positionType: VTable.TYPES.IconPosition.contentLeft,
            marginLeft: 0,
            marginRight: 4,
            funcType: VTable.TYPES.IconFuncTypeEnum.collapse,
            cursor: 'pointer',
            hover: {
              width: 20,
              height: 20,
              bgColor: 'rgba(101, 117, 168, 0.1)'
            }
          } as VTable.TYPES.SvgIcon
        ];
      }
      return [
        {
          type: 'svg',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opacity="1"/>
        </svg>`,
          width: 16,
          height: 16,
          name: 'hierarchy-expand',
          positionType: VTable.TYPES.IconPosition.contentLeft,
          marginLeft: 0,
          marginRight: 4,
          funcType: VTable.TYPES.IconFuncTypeEnum.expand,
          cursor: 'pointer',
          hover: {
            width: 20,
            height: 20,
            bgColor: 'rgba(101, 117, 168, 0.1)'
          }
        } as VTable.TYPES.SvgIcon
      ];
    };

    // 设置第一列的图标
    firstColumn.icon = iconFunction;
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
   * 初始化内部属性
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

  private bindEventHandlers(): void {
    this.table.on(VTable.TABLE_EVENT_TYPE.SCROLL, () => this.updateSubTablePositionsForScroll());
    this.wrapTableResizeMethod();
  }
  private wrapTableResizeMethod(): void {
    const originalResize = this.table.resize.bind(this.table);
    this.table.resize = () => {
      // 调用原始的resize方法
      originalResize();
      this.updateSubTablePositionsForResize();
    };
  }

  /**
   * 扩展表格 API
   */
  private extendTableAPI(): void {
    const table = this.table as any;
    this.originalUpdateCellContent = table.scenegraph.updateCellContent.bind(table.scenegraph);
    table.scenegraph.updateCellContent = this.protectedUpdateCellContent.bind(this);
  }

  private protectedUpdateCellContent(col: number, row: number, forceFastUpdate: boolean = false): any {
    // 调用原始的updateCellContent方法
    const result = this.originalUpdateCellContent?.(col, row, forceFastUpdate);
    // 检查是否是展开行，如果是则恢复原始高度并绘制下划线
    const isExpandedRow = this.expandedRows.includes(row);
    if (isExpandedRow) {
      const bodyRowIndex = row - this.table.columnHeaderLevelCount;
      const originalHeight = this.getOriginalRowHeight(bodyRowIndex);
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

  // ==================== 主从表 API 方法 ====================

  /**
   * 展开行
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

    const deltaHeight = height - originalHeight;
    this.updateRowHeightForExpand(rowIndex, deltaHeight);
    this.table.scenegraph.updateContainerHeight(rowIndex, deltaHeight);
    internalProps._heightResizedRowMap.add(rowIndex);

    this.renderSubTable(bodyRowIndex);
    this.recalculateAllSubTablePositions(bodyRowIndex + 1);
    this.addUnderlineToExpandedRow(rowIndex, originalHeight);
    this.refreshRowIcon(rowIndex);
  }

  /**
   * 收起行
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

    const currentHeight = this.table.getRowHeight(rowIndex);
    const originalHeight = this.getOriginalRowHeight(bodyRowIndex);
    const deltaHeight = currentHeight - originalHeight;
    this.updateRowHeightForExpand(rowIndex, -deltaHeight);
    internalProps._heightResizedRowMap.delete(rowIndex);
    this.table.scenegraph.updateContainerHeight(rowIndex, -deltaHeight);
    if (internalProps.originalRowHeights) {
      internalProps.originalRowHeights.delete(bodyRowIndex);
    }

    this.removeUnderlineFromRow(rowIndex);
    this.recalculateAllSubTablePositions(bodyRowIndex + 1);
    this.refreshRowIcon(rowIndex);
  }

  /**
   * 切换行展开状态
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
      return [10, 10, 10, 10];
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
   * 排序前的操作
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
          this.collapseRow(rowIndex);
        } catch (e) {
          // 收起失败
          console.warn(`Failed to collapse row ${rowIndex} before sort:`, e);
        }
      });
    }
  }

  /**
   * 排序后的操作
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
   * 获取详情配置
   */
  private getDetailConfigForRecord(record: unknown, bodyRowIndex: number): DetailGridOptions | null {
    return (
      this.pluginOptions.getDetailGridOptions?.({ data: record, bodyRowIndex: bodyRowIndex }) ||
      this.pluginOptions.detailGridOptions ||
      null
    );
  }

  /**
   * 根据行索引获取记录
   */
  private getRecordByRowIndex(bodyRowIndex: number): Record<string, unknown> {
    return this.table.dataSource.getRaw(bodyRowIndex) as Record<string, unknown>;
  }

  /**
   * 获取原始行高
   */
  private getOriginalRowHeight(bodyRowIndex: number): number {
    const internalProps = this.getInternalProps();
    return internalProps.originalRowHeights?.get(bodyRowIndex) || 0;
  }

  // ==================== 子表管理 ====================

  /**
   * 渲染子表
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

    this.setupScrollEventIsolation(subTable);
    this.setupUnifiedSelectionManagement(bodyRowIndex, subTable);
    this.setupSubTableCanvasClipping(subTable);
    subTable.render();
  }

  /**
   * 计算子表的viewBox区域
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
   * 移除子表
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
        __clipInterval?: number;
      };
      const scrollHandler = extendedSubTable.__scrollHandler;
      if (scrollHandler) {
        this.table.off('can_scroll', scrollHandler);
      }
      const wheelHandler = extendedSubTable.__wheelHandler;
      if (wheelHandler) {
        subTable.canvas.removeEventListener('wheel', wheelHandler);
      }
      // 清理clip interval
      const clipInterval = extendedSubTable.__clipInterval;
      if (clipInterval) {
        clearInterval(clipInterval);
      }
      if (typeof subTable.release === 'function') {
        subTable.release();
      }
      internalProps.subTableInstances?.delete(bodyRowIndex);
    }
  }

  // ==================== 滚动和选择管理 ====================

  /**
   * 设置滚动事件隔离
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
   * 设置统一选中状态管理
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
   * 清除所有子表的可见选中状态
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
   * 清除除指定子表外的所有选中状态
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
   * 滚动时更新所有子表位置
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
   * 父表尺寸变化时更新所有子表位置和宽度
   */
  private updateSubTablePositionsForResize(): void {
    const internalProps = this.getInternalProps();
    if (!internalProps.subTableInstances) {
      return;
    }
    internalProps.subTableInstances.forEach((subTable, bodyRowIndex) => {
      const record = this.getRecordByRowIndex(bodyRowIndex);
      const detailConfig = record ? this.getDetailConfigForRecord(record, bodyRowIndex) : null;
      const newViewBox = this.calculateSubTableViewBox(bodyRowIndex, detailConfig);
      if (newViewBox) {
        const newContainerWidth = newViewBox.x2 - newViewBox.x1;
        const newContainerHeight = newViewBox.y2 - newViewBox.y1;
        (subTable as { options: { viewBox?: { x1: number; y1: number; x2: number; y2: number } } }).options.viewBox =
          newViewBox;
        const subTableOptions = subTable.options as any;
        if (subTableOptions.canvasWidth !== newContainerWidth || subTableOptions.canvasHeight !== newContainerHeight) {
          subTableOptions.canvasWidth = newContainerWidth;
          subTableOptions.canvasHeight = newContainerHeight;
          subTable.resize();
        }
        if (subTable.scenegraph?.stage) {
          (subTable.scenegraph.stage as { setViewBox: (viewBox: unknown, flag: boolean) => void }).setViewBox(
            newViewBox,
            false
          );
        }
        subTable.render();
      }
    });
    this.redrawAllUnderlines();
  }

  /**
   * 重新计算子表位置
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
   * 清理主从表格功能
   */
  private cleanupMasterDetailFeatures(): void {
    if (!this.table || !this.table.internalProps) {
      return;
    }

    try {
      const internalProps = this.getInternalProps();
      if (internalProps.subTableInstances) {
        internalProps.subTableInstances.forEach(subTable => {
          if (subTable && typeof subTable.release === 'function') {
            try {
              subTable.release();
            } catch (error) {
              console.warn('Failed to release sub table:', error);
            }
          }
        });
        internalProps.subTableInstances.clear();
      }
      if (internalProps.expandedRecordIndices) {
        internalProps.expandedRecordIndices.length = 0;
      }
      if (internalProps.originalRowHeights) {
        internalProps.originalRowHeights.clear();
      }
    } catch (error) {
      console.warn('Failed to cleanup master detail features:', error);
    }
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
    // 计算裁剪区域的函数
    const calculateClipRegion = () => {
      try {
        const frozenRowsHeight = this.table.getFrozenRowsHeight();
        const frozenColsWidth = this.table.getFrozenColsWidth();
        const rightFrozenColsWidth = this.table.getRightFrozenColsWidth();
        const bottomFrozenRowsHeight = this.table.getBottomFrozenRowsHeight();
        const tableWidth = this.table.tableNoFrameWidth;
        const tableHeight = this.table.tableNoFrameHeight;
        const clipX = frozenColsWidth;
        const clipY = frozenRowsHeight;
        const clipWidth = tableWidth - frozenColsWidth - rightFrozenColsWidth;
        const clipHeight = tableHeight - frozenRowsHeight - bottomFrozenRowsHeight;
        return { clipX, clipY, clipWidth, clipHeight };
      } catch (error) {
        return null;
      }
    };

    // 获取canvas context
    const window = stage.window;
    if (!window || typeof window.getContext !== 'function') {
      return;
    }
    const context = window.getContext();
    if (!context) {
      return;
    }

    const wrapRenderMethod = (obj: any, methodName: string) => {
      const originalMethod = obj[methodName];
      if (typeof originalMethod === 'function') {
        obj[methodName] = function (...args: any[]) {
          context.save();
          try {
            const clipRegion = calculateClipRegion();
            if (clipRegion && clipRegion.clipWidth > 0 && clipRegion.clipHeight > 0) {
              const dpr = (window as any).dpr || (window as any).devicePixelRatio || 1;
              context.beginPath();
              context.rect(
                clipRegion.clipX * dpr,
                clipRegion.clipY * dpr,
                clipRegion.clipWidth * dpr,
                clipRegion.clipHeight * dpr
              );
              context.clip();
            }
            return originalMethod.apply(this, args);
          } finally {
            context.restore();
          }
        };
      }
    };
    if (stage.defaultLayer) {
      wrapRenderMethod(stage.defaultLayer, 'render');
      wrapRenderMethod(stage.defaultLayer, 'draw');
    }
  }

  /**
   * 添加展开行的下划线
   */
  private addUnderlineToExpandedRow(rowIndex: number, originalHeight: number): void {
    // 直接获取行的所有cell并绘制下划线
    setTimeout(() => {
      this.drawUnderlineForRow(rowIndex, originalHeight);
    }, 0);
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
    // 每次都重新计算和应用下划线样式，不依赖标记
    // 这样在CellGroup重绘时也能正确绘制下划线
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
    // 检查是否已经是增强的下划线（避免重复增强）
    const isAlreadyEnhanced = cellGroup._hasUnderline;
    if (!isAlreadyEnhanced) {
      // 第一次添加下划线，存储原始样式
      cellGroup._originalStrokeArrayWidth = [...currentStrokeArrayWidth];
      cellGroup._originalStrokeArrayColor = [...currentStrokeArrayColor];
      cellGroup._hasUnderline = true;
    }
    // 使用原始样式计算增强的下划线
    const originalStrokeArrayWidth = cellGroup._originalStrokeArrayWidth || currentStrokeArrayWidth;
    const originalStrokeArrayColor = cellGroup._originalStrokeArrayColor || currentStrokeArrayColor;
    const enhancedStrokeArrayWidth = [...originalStrokeArrayWidth];
    const enhancedStrokeArrayColor = [...originalStrokeArrayColor];
    const originalBottomWidth = originalStrokeArrayWidth[2] || 1;
    const dpr = (this.table as any).internalProps?.pixelRatio || window.devicePixelRatio || 1;
    // 要还原本来的下划线的效果，那么我们应该要 * 1.5因为我记得原本的线是叠层的
    const enhancedWidth = originalBottomWidth * 1.5 * dpr;
    enhancedStrokeArrayWidth[2] = Math.max(enhancedWidth, 1.5 * dpr);
    if (originalStrokeArrayColor[2] === 'transparent' || !originalStrokeArrayColor[2]) {
      const theme = (this.table as any).theme;
      enhancedStrokeArrayColor[2] = theme?.bodyStyle?.borderColor || '#e1e4e8';
    } else {
      enhancedStrokeArrayColor[2] = originalStrokeArrayColor[2];
    }
    // 应用增强的下划线样式
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

  /**
   * 刷新指定行的图标状态
   */
  private refreshRowIcon(rowIndex: number): void {
    try {
      const firstColumnIndex = 0;
      const sceneGraph = (this.table as any).scenegraph;
      if (sceneGraph && sceneGraph.updateCellContent) {
        sceneGraph.updateCellContent(firstColumnIndex, rowIndex);
        sceneGraph.updateNextFrame();
      }
    } catch (error) {
      console.warn('刷新图标状态失败:', error);
    }
  }
}
