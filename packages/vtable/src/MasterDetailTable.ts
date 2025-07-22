import type {
  CellAddress,
  ColumnsDefine,
  DropDownMenuEventInfo,
  FieldData,
  FieldDef,
  FieldFormat,
  FieldKeyDef,
  FilterRules,
  IPagination,
  MasterDetailTableAPI,
  MasterDetailTableConstructorOptions,
  MaybePromiseOrUndefined,
  SortState
} from './ts-types';
import { HierarchyState, IconFuncTypeEnum } from './ts-types';
import { MasterDetailLayoutMap } from './layout/master-detail-layout';
import { isValid } from '@visactor/vutils';
import { BaseTable } from './core';
import type { BaseTableAPI, MasterDetailTableProtected } from './ts-types/base-table';
import { TABLE_EVENT_TYPE } from './core/TABLE_EVENT_TYPE';
import type { ITitleComponent } from './components/title/title';
import { Env } from './tools/env';
import * as editors from './edit/editors';
import { EditManager } from './edit/edit-manager';
import { defaultOrderFn } from './tools/util';
import type { IEditor } from '@visactor/vtable-editors';
import type { ColumnData, ColumnDefine } from './ts-types/list-table/layout-map/api';
import { cloneDeepSpec } from '@visactor/vutils-extension';
import type { IEmptyTipComponent } from './components/empty-tip/empty-tip';
import { Factory } from './core/factory';
import { getGroupByDataConfig } from './core/group-helper';
import { CachedDataSource } from './data';
import { MasterDetailRowManager } from './core/master-detail-row-manager';

export class MasterDetailTable extends BaseTable implements MasterDetailTableAPI {
  declare internalProps: MasterDetailTableProtected;
  /**
   * 用户配置的options 只读 勿直接修改
   */
  declare options: MasterDetailTableConstructorOptions;
  showHeader = true;
  
  /** 行管理器，负责正确的展开/收起行操作 */
  private rowManager: MasterDetailRowManager;

  /** 子表实例映射 */
  private subTableInstances: Map<number, MasterDetailTable> = new Map();

  /** 存储每行展开前的原始高度 */
  private originalRowHeights: Map<number, number> = new Map();

  /** 存储子表的初始ViewBox位置（用于translate计算） */
  private subTableInitialViewBox: Map<number, { x1: number; y1: number; x2: number; y2: number }> = new Map();

  // eslint-disable-next-line default-param-last
  constructor(options: MasterDetailTableConstructorOptions);
  constructor(container: HTMLElement, options: MasterDetailTableConstructorOptions);
  constructor(
    container?: HTMLElement | MasterDetailTableConstructorOptions,
    options?: MasterDetailTableConstructorOptions
  ) {
    super(container as HTMLElement, options);
    options = this.options;
    const internalProps = this.internalProps;
    
    // 只在构造时加一次空白行
    if (
      options.records &&
      Array.isArray(options.records) &&
      options.columns &&
      Array.isArray(options.columns) &&
      options.columns.length > 0 &&
      typeof options.columns[0] === 'object'
    ) {
      // 检查最后一行是否已经是空白行，避免重复添加
      const last = options.records[options.records.length - 1];
      let isBlank = false;
      if (last) {
        isBlank = options.columns.every(
          col => typeof col === 'object' && 'field' in col && last[col.field] === ''
        );
      }
      if (!isBlank) {
        options.records = [
          ...options.records,
          MasterDetailTable._generateBlankRow(options.columns as any[])
        ];
      }
    }
    
    internalProps.frozenColDragHeaderMode = options.dragOrder?.frozenColDragHeaderMode;
    //分页配置
    this.pagination = options.pagination;
    internalProps.sortState = options.sortState;
    internalProps.multipleSort = !!options.multipleSort;
    internalProps.dataConfig = options.groupBy ? getGroupByDataConfig(options.groupBy) : {};
    internalProps.columns = options.columns
      ? cloneDeepSpec(options.columns, ['children'])
      : options.header
      ? cloneDeepSpec(options.header, ['children'])
      : [];
    // TODO: 实现聚合功能
    // generateAggregationForColumn(this);

    internalProps.enableTreeNodeMerge = options.enableTreeNodeMerge ?? isValid(options.groupBy) ?? false;

    this.internalProps.headerHelper.setTableColumnsEditor();
    this.showHeader = options.showHeader ?? true;

    this.internalProps.columnWidthConfig = options.columnWidthConfig;

    // 主从表格特有的初始化
    this.internalProps.expandedRowsSet = new Set(options.expandedRows || []);
    // 初始化行管理器
    this.rowManager = new MasterDetailRowManager(this);

    // 为了保证文本对齐，默认启用hierarchyTextStartAlignment
    if (options.hierarchyTextStartAlignment === undefined) {
      options.hierarchyTextStartAlignment = true;
    }

    this.transpose = options.transpose ?? false;
    if (Env.mode !== 'node') {
      this.editorManager = new EditManager(this);
    }
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;

    if (options.dataSource) {
      this.internalProps.dataSource = options.dataSource;
    } else if (options.records) {
      this.setRecords(options.records);
    } else {
      this.setRecords([]);
    }
    
    if (options.title) {
      const Title = Factory.getComponent('title') as ITitleComponent;
      internalProps.title = new Title(options.title, this);
      this.scenegraph.resize();
    }
    
    if (this.options.emptyTip) {
      if (this.internalProps.emptyTip) {
        this.internalProps.emptyTip?.resetVisible();
      } else {
        const EmptyTip = Factory.getComponent('emptyTip') as IEmptyTipComponent;
        this.internalProps.emptyTip = new EmptyTip(this.options.emptyTip, this);
        this.internalProps.emptyTip?.resetVisible();
      }
    }

    //为了确保用户监听得到这个事件 这里做了异步 确保vtable实例已经初始化完成
    setTimeout(() => {
      this.fireListeners(TABLE_EVENT_TYPE.INITIALIZED, null);
    }, 0);

    // 构造完成后，将最后一行高度设为0（如果有行）
    if (this.rowCount > 0) {
      this.setRowHeight(this.rowCount - 1, 0);
    }

    // 监听图标点击事件，处理展开收起操作
    this.on(TABLE_EVENT_TYPE.ICON_CLICK, iconInfo => {
      const { col, row, funcType } = iconInfo;
      if (funcType === IconFuncTypeEnum.expand || funcType === IconFuncTypeEnum.collapse) {
        const dataRowIndex = this.getRecordShowIndexByCell(col, row);
        if (dataRowIndex >= 0) {
          this.toggleRowExpand(dataRowIndex);
        }
      }
    });

    // 监听滚动事件，更新子表位置
    this.on(TABLE_EVENT_TYPE.SCROLL, (scrollInfo: any) => {
      // 计算滚动偏移量
      const deltaX = scrollInfo.scrollLeft || 0;
      const deltaY = scrollInfo.scrollTop || 0;
      
      // 更新所有子表位置
      this.updateAllSubTablePositions(-deltaX, -deltaY);
    });
  }

  // 新增：生成空白行的静态方法
  private static _generateBlankRow(columns: any[] = []): Record<string, unknown> {
    const blank: Record<string, unknown> = {};
    columns.forEach(col => {
      if (col && typeof col === 'object' && 'field' in col) {
        blank[col.field] = '';
      }
    });
    return blank;
  }

  isMasterDetailTable(): true {
    return true;
  }
  isListTable(): false {
    return false;
  }
  isPivotTable(): false {
    return false;
  }
  isPivotChart(): false {
    return false;
  }

  /**
   * Get the sort state.
   */
  get sortState(): SortState | SortState[] {
    return this.internalProps.sortState;
  }

  get records() {
    return this.internalProps.dataSource?.records ?? this.internalProps.records;
  }

  get dataSource() {
    return this.internalProps.dataSource;
  }

  get recordsCount() {
    return this.records?.length ?? 0;
  }

  get columns(): ColumnsDefine {
    return this.internalProps.layoutMap.columnTree.getCopiedTree(); //调整顺序后的columns
  }

  /**
   * Get the transpose.
   */
  get transpose(): boolean {
    return this.internalProps.transpose ?? false;
  }

  /**
   * Set the transpose from given
   */
  set transpose(transpose: boolean) {
    if (this.internalProps.transpose === transpose) {
      return;
    }
    this.internalProps.transpose = transpose;
    if (this.internalProps.layoutMap) {
      this.internalProps.layoutMap.transpose = transpose;
      this.refreshRowColCount();
      this._resetFrozenColCount();
      this.renderAsync();
    }
  }

  /** 获取单元格展示值 */
  getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData {
    if (col === -1 || row === -1) {
      return null;
    }
    
    if (!skipCustomMerge) {
      const customMergeText = this.getCustomMergeValue(col, row);
      if (customMergeText) {
        return customMergeText;
      }
    }
    const table = this;
    if (table.internalProps.layoutMap.isSeriesNumber(col, row)) {
      if (table.internalProps.layoutMap.isSeriesNumberInHeader(col, row)) {
        const { title } = table.internalProps.layoutMap.getSeriesNumberHeader(col, row);
        return title;
      }
      let value;
      if ((this.options as MasterDetailTableConstructorOptions).groupBy) {
        const record = table.getCellRawRecord(col, row);
        if (record?.vtableMerge) {
          return '';
        }
        if (!table.internalProps.layoutMap.isAggregation(col, row)) {
          value = row - this.columnHeaderLevelCount;
        }
      } else {
        value = row - this.columnHeaderLevelCount + 1;
      }
      const { format } = table.internalProps.layoutMap.getSeriesNumberBody(col, row);
      return typeof format === 'function' ? format(col, row, this, value) : value;
    } else if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    } else if (table.internalProps.layoutMap.isAggregation(col, row)) {
      if (table.internalProps.layoutMap.isTopAggregation(col, row)) {
        const aggregator = table.internalProps.layoutMap.getAggregatorOnTop(col, row);
        return aggregator?.formatValue ? aggregator.formatValue(col, row, this as BaseTableAPI) : '';
      } else if (table.internalProps.layoutMap.isBottomAggregation(col, row)) {
        const aggregator = table.internalProps.layoutMap.getAggregatorOnBottom(col, row);
        return aggregator?.formatValue ? aggregator.formatValue(col, row, this as BaseTableAPI) : '';
      }
    }
    const { field, fieldFormat } = table.internalProps.layoutMap.getBody(col, row) as ColumnData;
    return table.getFieldData(fieldFormat || field, col, row);
  }

  /** 获取单元格展示数据的format前的值 */
  getCellOriginValue(col: number, row: number): FieldData {
    if (col === -1 || row === -1) {
      return null;
    }
    const table = this;
    if (table.internalProps.layoutMap.isSeriesNumber(col, row)) {
      if (table.internalProps.layoutMap.isSeriesNumberInHeader(col, row)) {
        const { title } = table.internalProps.layoutMap.getSeriesNumberHeader(col, row);
        return title;
      }
      const { format } = table.internalProps.layoutMap.getSeriesNumberBody(col, row);
      return typeof format === 'function' ? format(col, row, this) : row - this.columnHeaderLevelCount;
    } else if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    } else if (table.internalProps.layoutMap.isAggregation(col, row)) {
      if (table.internalProps.layoutMap.isTopAggregation(col, row)) {
        const aggregator = table.internalProps.layoutMap.getAggregatorOnTop(col, row);
        return aggregator?.value();
      } else if (table.internalProps.layoutMap.isBottomAggregation(col, row)) {
        const aggregator = table.internalProps.layoutMap.getAggregatorOnBottom(col, row);
        return aggregator?.value();
      }
    }
    const { field } = table.internalProps.layoutMap.getBody(col, row);
    return table.getFieldData(field, col, row);
  }

  /** 获取单元格展示数据源最原始值 */
  getCellRawValue(col: number, row: number): FieldData {
    if (col === -1 || row === -1) {
      return null;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    }
    const { field } = table.internalProps.layoutMap.getBody(col, row);
    return table.getRawFieldData(field, col, row);
  }

  /** 获取当前单元格在body部分的展示索引 即(row / col)-headerLevelCount。注：MasterDetailTable特有接口 */
  getRecordShowIndexByCell(col: number, row: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getRecordShowIndexByCell(col, row);
  }

  /** 获取当前单元格的数据是数据源中的第几条。 */
  getRecordIndexByCell(col: number, row: number): number | number[] {
    const { layoutMap } = this.internalProps;
    const recordShowIndex = layoutMap.getRecordShowIndexByCell(col, row);
    return this.dataSource.getRecordIndexPaths(recordShowIndex);
  }

  getTableIndexByRecordIndex(recordIndex: number | number[]) {
    if (this.transpose) {
      return this.dataSource.getTableIndex(recordIndex) + this.rowHeaderLevelCount;
    }
    return this.dataSource.getTableIndex(recordIndex) + this.columnHeaderLevelCount;
  }

  getTableIndexByField(field: FieldDef) {
    const colObj = this.internalProps.layoutMap.columnObjects.find((col: ColumnData) => col.field === field);
    if (!colObj) {
      return -1;
    }
    const layoutRange = this.internalProps.layoutMap.getBodyLayoutRangeById(colObj.id);
    if (this.transpose) {
      return layoutRange.start.row;
    }
    return layoutRange.start.col;
  }

  getCellAddrByFieldRecord(field: FieldDef, recordIndex: number): CellAddress {
    if (this.transpose) {
      return { col: this.getTableIndexByRecordIndex(recordIndex), row: this.getTableIndexByField(field) };
    }
    return { col: this.getTableIndexByField(field), row: this.getTableIndexByRecordIndex(recordIndex) };
  }

  getCellOriginRecord(col: number, row: number): MaybePromiseOrUndefined {
    const table = this;
    const index = table.getRecordShowIndexByCell(col, row);
    if (index > -1) {
      return table.dataSource.get(index);
    }
    return undefined;
  }

  getCellRawRecord(col: number, row: number): MaybePromiseOrUndefined {
    const table = this;
    const index = table.getRecordShowIndexByCell(col, row);
    if (index > -1) {
      return table.dataSource.getRaw(index);
    }
    return undefined;
  }

  /**
   * 获取层级节点收起展开的状态
   * @param col
   * @param row
   * @returns
   */
  getHierarchyState(col: number, row: number): HierarchyState {
    if (this.isHeader(col, row)) {
      return (this._getHeaderLayoutMap(col, row) as any)?.hierarchyState;
    }
    
    // 检查是否是树形列
    const define = this.getBodyColumnDefine(col, row) as ColumnDefine;
    if (!define?.tree) {
      return HierarchyState.none;
    }
    
    // 获取记录数据
    const record = this.getCellRawRecord(col, row);
    if (!record) {
      return HierarchyState.none;
    }
    
    // 获取记录索引
    const recordIndex = this.getRecordShowIndexByCell(col, row);
    if (recordIndex < 0) {
      return HierarchyState.none;
    }
    
    // 检查是否有children数据
    const hasChildren = record.children && Array.isArray(record.children) && record.children.length > 0;
    
    if (hasChildren) {
      // 有children数据，根据expandedRowsSet状态显示展开/收起图标
      return this.internalProps.expandedRowsSet.has(recordIndex) ? HierarchyState.expand : HierarchyState.collapse;
    }
    
    // 没有children数据，返回none（不显示图标，但通过hierarchyTextStartAlignment保持对齐）
    return HierarchyState.none;
  }

  /**
   * 根据记录数据获取详情配置
   * @param record 记录数据
   * @param rowIndex 行索引
   * @returns 详情配置或null
   */
  private getDetailConfigForRecord(record: any, rowIndex: number): any | null {
    // 1. 优先使用 getDetailGridOptions 函数
    if (this.options.getDetailGridOptions) {
      return this.options.getDetailGridOptions({ data: record, rowIndex });
    }
    
    // 2. 使用默认的 detailGridOptions
    if (this.options.detailGridOptions) {
      return this.options.detailGridOptions;
    }
    
    // 3. 没有配置则返回 null
    return null;
  }

  /** @private */
  refreshHeader(): void {
    const table = this;
    const internalProps = table.internalProps;
    const transpose = table.transpose;
    const showHeader = table.showHeader;
    const layoutMap = (internalProps.layoutMap = new MasterDetailLayoutMap(
      this,
      internalProps.columns ?? [],
      showHeader,
      table.options.hierarchyIndent
    ));

    layoutMap.transpose = transpose;

    if (!transpose) {
      this.setMinMaxLimitWidth(true);
    }
    this.refreshRowColCount();

    // 添加adaptive模式支持：在头部刷新后，重新计算列宽
    // 无论是adaptive还是autoFillWidth模式，都需要重新计算，具体逻辑在compute-col-width.ts中处理
    if (this.widthMode === 'adaptive' || this.autoFillWidth) {
      setTimeout(() => {
        this.handleAdaptiveMode();
      }, 0);
    }
  }

  refreshRowColCount(): void {
    const table = this;
    const { layoutMap } = table.internalProps;
    if (!layoutMap) {
      return;
    }

    const dataCount = table.internalProps.records?.length ?? 0;
    layoutMap.recordsCount = dataCount;

    if (table.transpose) {
      table.rowCount = layoutMap.rowCount ?? 0;
      table.colCount = layoutMap.colCount ?? 0;
      this.internalProps.frozenColCount = Math.max(
        (layoutMap.headerLevelCount ?? 0) + layoutMap.leftRowSeriesNumberColumnCount,
        this.options.frozenColCount ?? 0
      );
      this.internalProps.frozenRowCount = this.options.frozenRowCount ?? 0;
    } else {
      table.colCount = layoutMap.colCount ?? 0;
      // 使用 layoutMap 的 rowCount，它已经包含了展开行的计算
      table.rowCount = layoutMap.rowCount ?? 0;
      this.internalProps.frozenColCount = this.options.frozenColCount ?? 0;
      table.frozenRowCount = Math.max(layoutMap.headerLevelCount, this.options.frozenRowCount ?? 0);
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);

    // 添加adaptive模式支持：在行列数更新后，重新计算列宽
    if (this.widthMode === 'adaptive' || this.autoFillWidth) {
      // 延迟执行列宽计算，确保布局已完成
      setTimeout(() => {
        this.handleAdaptiveMode();
      }, 0);
    }
  }

  /**
   * 获取records数据源中 字段对应的value 值是format之后的
   */
  getFieldData(field: FieldDef | FieldFormat | undefined, col: number, row: number): FieldData {
    if (field === null) {
      return null;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return null;
    }
    const index = table.getRecordShowIndexByCell(
      table.transpose ? col - table.internalProps.layoutMap.leftRowSeriesNumberColumnCount : col,
      row
    );
    // 简化实现：直接从 records 中获取数据
    const records = this.internalProps.records;
    if (records && index >= 0 && index < records.length) {
      return records[index][field as string] ?? null;
    }
    return null;
  }

  /**
   * 获取records数据源中 字段对应的value 值是数据源中原始值
   */
  getRawFieldData(field: FieldDef | FieldFormat | undefined, col: number, row: number): FieldData {
    if (field === null) {
      return null;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return null;
    }
    const index = table.getRecordShowIndexByCell(col, row);
    // 简化实现：直接从 records 中获取数据
    const records = this.internalProps.records;
    if (records && index >= 0 && index < records.length) {
      return records[index][field as string] ?? null;
    }
    return null;
  }

  /**
   * 设置表格数据 及排序状态
   */
  setRecords(records: Record<string, unknown>[]): void {
    // 释放旧的 dataSource
    this.internalProps.dataSource?.release();
    this.internalProps.dataSource = null;
    
    // 设置新的 records
    this.internalProps.records = records;
    
    // 创建新的 dataSource
    const newDataSource = CachedDataSource.ofArray(
      records,
      this.internalProps.dataConfig,
      this.pagination,
      this.internalProps.columns,
      this.internalProps.layoutMap?.rowHierarchyType,
      this._hasHierarchyTreeHeader?.() ? 1 : undefined
    );
    
    this.internalProps.dataSource = newDataSource;
    this.addReleaseObj(newDataSource);
    
    this.refreshRowColCount();
    this.scenegraph.createSceneGraph();
    this.render();
  }

  // 下面是一些必须实现的方法，仿照 ListTable 的实现
  _getSortFuncFromHeaderOption(
    columns: ColumnsDefine | undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): SortState['orderFn'] | undefined {
    if (!columns) {
      columns = this.internalProps.columns;
    }
    if (field && columns && columns.length > 0) {
      for (let i = 0; i < columns.length; i++) {
        const header = columns[i];
        if (
          ((fieldKey && fieldKey === header.fieldKey) || (!fieldKey && header.field === field)) &&
          header.sort &&
          typeof header.sort === 'function'
        ) {
          return header.sort;
        } else if (header.columns) {
          const sort = this._getSortFuncFromHeaderOption(header.columns, field, fieldKey);
          if (sort) {
            return sort;
          }
        }
      }
    }
    return undefined;
  }

  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true) {
    if (!sortState) {
      // 解除排序状态
      if (this.internalProps.sortState) {
        if (Array.isArray(this.internalProps.sortState)) {
          for (let i = 0; i < (this.internalProps.sortState as SortState[]).length; i++) {
            const s = this.internalProps.sortState[i];
            s && (s.order = 'normal');
          }
        } else {
          (this.internalProps.sortState as SortState).order = 'normal';
        }
      }
    } else {
      this.internalProps.sortState = sortState;
    }

    const sortArr = Array.isArray(sortState) ? sortState : [sortState];

    if (sortArr.some((item: SortState) => item.field) && executeSort) {
      if (this.internalProps.layoutMap.headerObjects.some(item => item.define.sort !== false)) {
        this.dataSource.sort(
          sortArr.map((item: SortState) => {
            const sortFunc = this._getSortFuncFromHeaderOption(undefined, item.field);
            return {
              field: item.field,
              order: item.order,
              orderFn: sortFunc ?? defaultOrderFn
            };
          })
        );

        // clear cell range cache
        this.internalProps.layoutMap.clearCellRangeMap();
        this.internalProps.useOneRowHeightFillAll = false;
        this.scenegraph.sortCell();
      }
    }
    if (sortArr.length) {
      this.stateManager.updateSortState(sortArr);
    }
  }

  // 实现其他必要的接口方法
  updateFilterRules(filterRules: FilterRules) {
    this.scenegraph.clearCells();
    // 简化实现，暂时不支持过滤
    this.refreshRowColCount();
    this.stateManager.initCheckedState(this.records);
    this.scenegraph.createSceneGraph();
  }

  startEditCell(col?: number, row?: number, value?: string | number) {
    if (isValid(col) && isValid(row)) {
      this.eventManager.isDraging = false;
      this.selectCell(col, row);
      this.editorManager.startEditCell(col, row, value);
    } else if (this.stateManager.select?.cellPos) {
      const { col, row } = this.stateManager.select.cellPos;
      if (isValid(col) && isValid(row)) {
        this.editorManager.startEditCell(col, row, value);
      }
    }
  }

  completeEditCell() {
    this.editorManager.completeEdit();
  }

  getEditor(col: number, row: number) {
    const define = this.getBodyColumnDefine(col, row);
    let editorDefine = this.isHeader(col, row)
      ? (define as ColumnDefine)?.headerEditor ?? this.options.headerEditor
      : (define as ColumnDefine)?.editor ?? this.options.editor;

    if (typeof editorDefine === 'function') {
      const arg = {
        col,
        row,
        dataValue: this.getCellOriginValue(col, row),
        value: this.getCellValue(col, row) || '',
        table: this
      };
      editorDefine = (editorDefine as (arg: {
        col: number;
        row: number;
        dataValue: unknown;
        value: unknown;
        table: BaseTableAPI;
      }) => string | IEditor<any, any>)(arg);
    }
    if (typeof editorDefine === 'string') {
      return editors.get(editorDefine);
    }
    return editorDefine as IEditor;
  }

  changeCellValue(
    col: number,
    row: number,
    value: string | number | null,
    workOnEditableCell = false,
    triggerEvent = true
  ) {
    // 简化实现：直接修改数据
    const index = this.getRecordShowIndexByCell(col, row);
    const { field } = this.internalProps.layoutMap.getBody(col, row);
    const records = this.internalProps.records;
    if (records && index >= 0 && index < records.length) {
      records[index][field as string] = value;
      this.scenegraph.updateCellContent(col, row);
      if (triggerEvent) {
        this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
          col,
          row,
          rawValue: value,
          currentValue: value,
          changedValue: value
        });
      }
      return true;
    }
    return false;
  }

  changeCellValues(
    col: number,
    row: number,
    values: (string | number)[][],
    workOnEditableCell = false
  ): boolean[][] {
    // 简化实现：循环调用 changeCellValue
    const results: boolean[][] = [];
    for (let i = 0; i < values.length; i++) {
      results[i] = [];
      for (let j = 0; j < values[i].length; j++) {
        results[i][j] = this.changeCellValue(col + j, row + i, values[i][j], workOnEditableCell, true);
      }
    }
    return results;
  }

  addRecord(record: Record<string, unknown>, recordIndex?: number | number[]) {
    if (!this.internalProps.records) {
      this.internalProps.records = [];
    }
    const index = typeof recordIndex === 'number' ? recordIndex : this.internalProps.records.length;
    this.internalProps.records.splice(index, 0, record);
    this.refreshRowColCount();
    this.scenegraph.createSceneGraph();
    this.internalProps.emptyTip?.resetVisible();

    // 添加adaptive模式支持
    if (this.widthMode === 'adaptive' || this.autoFillWidth) {
      setTimeout(() => {
        this.handleAdaptiveMode();
      }, 0);
    }
  }

  addRecords(records: Record<string, unknown>[], recordIndex?: number | number[]) {
    if (!this.internalProps.records) {
      this.internalProps.records = [];
    }
    const index = typeof recordIndex === 'number' ? recordIndex : this.internalProps.records.length;
    this.internalProps.records.splice(index, 0, ...records);
    this.refreshRowColCount();
    this.scenegraph.createSceneGraph();
    this.internalProps.emptyTip?.resetVisible();

    // 添加adaptive模式支持
    if (this.widthMode === 'adaptive' || this.autoFillWidth) {
      setTimeout(() => {
        this.handleAdaptiveMode();
      }, 0);
    }
  }

  deleteRecords(recordIndexs: number[] | number[][]) {
    if (!this.internalProps.records) {
      return;
    }
    // 简化处理：假设都是 number[]
    const indexArray = Array.isArray(recordIndexs[0])
      ? (recordIndexs as number[][]).flat()
      : (recordIndexs as number[]);
    indexArray.sort((a, b) => b - a).forEach(index => {
      this.internalProps.records.splice(index, 1);
    });
    this.refreshRowColCount();
    this.scenegraph.createSceneGraph();
    this.internalProps.emptyTip?.resetVisible();

    // 添加adaptive模式支持
    if (this.widthMode === 'adaptive' || this.autoFillWidth) {
      setTimeout(() => {
        this.handleAdaptiveMode();
      }, 0);
    }
  }

  updateRecords(records: Record<string, unknown>[], recordIndexs: (number | number[])[]) {
    if (!this.internalProps.records) {
      return;
    }
    records.forEach((record, i) => {
      const index =
        typeof recordIndexs[i] === 'number' ? (recordIndexs[i] as number) : (recordIndexs[i] as number[])[0];
      if (index >= 0 && index < this.internalProps.records.length) {
        this.internalProps.records[index] = { ...this.internalProps.records[index], ...record };
      }
    });
    this.scenegraph.createSceneGraph();

    // 添加adaptive模式支持
    if (this.widthMode === 'adaptive' || this.autoFillWidth) {
      setTimeout(() => {
        this.handleAdaptiveMode();
      }, 0);
    }
  }

  getBodyRowIndexByRecordIndex(index: number | number[]): number {
    if (Array.isArray(index) && index.length === 1) {
      index = index[0];
    }
    return this.dataSource.getTableIndex(index);
  }

  _parseColumnWidthConfig(columnWidthConfig: { key: string; width: number }[]) {
    for (let i = 0; i < columnWidthConfig?.length; i++) {
      const item = columnWidthConfig[i];
      const key = item.key;
      const width = item.width;
      const columnData = this.internalProps.layoutMap.getColumnByKey(key);
      if (columnData.columnDefine) {
        const { col } = columnData;
        if (!this.internalProps._widthResizedColMap.has(col)) {
          this._setColWidth(col, width);
          this.internalProps._widthResizedColMap.add(col); // add resize tag
        }
      }
    }
  }

  _hasHierarchyTreeHeader() {
    return (this.options.columns ?? this.options.header)?.some((column, i) => column.tree);
  }

  release() {
    this.editorManager.release();
    super.release();
  }

  /**
   * 处理自适应宽度模式
   * 仿照ListTable的逻辑：
   * - widthMode: 'adaptive' 强制启用自适应，无条件重新分配列宽
   * - autoFillWidth: true 智能模式，只有当总宽度小于容器宽度时才启用自适应
   */
  private handleAdaptiveMode(): void {
    if (this.scenegraph) {
      // 重新计算列宽 - 这会触发compute-col-width.ts中的逻辑
      // 在那里会根据widthMode和autoFillWidth的不同进行不同的处理
      this.scenegraph.recalculateColWidths();
      
      // 如果有图表需要更新，也进行更新
      if (this.scenegraph.updateChartSizeForResizeColWidth) {
        this.scenegraph.updateChartSizeForResizeColWidth(-1);
      }
    }
  }

  // ==================== 抽象方法实现 ====================
  
  /**
   * 表头切换层级状态
   * @param col
   * @param row
   * @param recalculateColWidths 是否重新计算列宽
   */
  toggleHierarchyState(col: number, row: number, recalculateColWidths: boolean = true): void {
    // 基本实现，主从表格暂时不支持层级状态切换
    // TODO: 后续实现层级状态切换功能
  }

  /**
   * 获取菜单信息
   * @param col
   * @param row
   * @param type
   * @returns
   */
  getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo {
    const result: DropDownMenuEventInfo = {
      field: this.getHeaderField(col, row),
      value: this.getCellValue(col, row),
      cellLocation: this.getCellLocation(col, row),
      event: undefined
    };
    return result;
  }

  /**
   * 拖拽移动表头位置
   * @param source 移动源位置
   * @param target 移动目标位置
   */
  _moveHeaderPosition(
    source: CellAddress,
    target: CellAddress
  ): {
    sourceIndex: number;
    targetIndex: number;
    sourceSize: number;
    targetSize: number;
    moveType: 'column' | 'row';
  } | null {
    // 基本实现，暂时不支持拖拽移动
    return null;
  }

  /**
   * 更新分页配置
   * @param pagination 分页配置
   */
  updatePagination(pagination: IPagination): void {
    // 基本实现，暂时不支持分页
    // TODO: 后续实现分页功能
  }

  /**
   * 检查是否有自定义渲染或布局
   * @returns 是否有自定义渲染或布局
   */
  _hasCustomRenderOrLayout(): boolean {
    // 基本实现
    const { headerObjects } = this.internalProps.layoutMap;
    if (this.options.customRender) {
      return true;
    }

    for (let i = 0; i < headerObjects.length; i++) {
      const headerObject = headerObjects[i];
      if (
        headerObject?.define?.customLayout ||
        headerObject?.define?.headerCustomLayout ||
        headerObject?.define?.customRender ||
        headerObject?.define?.headerCustomRender
      ) {
        return true;
      }
    }
    return false;
  }

  // ==================== 主从表格特有方法的占位实现 ====================
  /**
   * 获取展开行列表
   */
  getExpandedRows?(): number[] {
    // TODO: 后续实现获取展开行列表
    return Array.from(this.internalProps.expandedRowsSet);
  }

  /**
   * 获取记录的原始行高度
   * @param recordIndex 记录索引
   * @returns 原始行高度
   */
  getOriginalRowHeight(recordIndex: number): number {
    return this.originalRowHeights.get(recordIndex) || 0;
  }

  /**
   * 重写 getRowsHeight 方法，用于选中渲染时使用原始高度
   * 确保选中高亮只覆盖原始 cell 内容，而不是展开后的高度
   */
  getRowsHeight(startRow: number, endRow: number): number {
    if (startRow > endRow || this.rowCount === 0) {
      return 0;
    }
    startRow = Math.max(startRow, 0);
    endRow = Math.min(endRow, (this.rowCount ?? Infinity) - 1);

    let h = 0;
    
    // 遍历指定行范围，使用原始高度计算总高度
    for (let row = startRow; row <= endRow; row++) {
      // 检查这一行是否是展开的详情行
      const recordIndex = row - 1; // 详情行索引 = 记录索引 + 1，所以记录索引 = 行索引 - 1
      
      if (recordIndex >= 0 && this.internalProps.expandedRowsSet.has(recordIndex) && row === recordIndex + 1) {
        // 这是一个展开的详情行，使用原始高度
        const originalHeight = this.originalRowHeights.get(recordIndex);
        if (originalHeight !== undefined) {
          h += originalHeight;
        } else {
          // 如果没有记录原始高度，回退到默认计算
          h += super.getRowHeight(row);
        }
      } else {
        // 普通行，使用正常的行高计算
        h += this.getRowHeight(row);
      }
    }
    
    return Math.round(h);
  }

  /**
   * 判断行是否展开
   * @param rowIndex
   * @returns
   */
  isRowExpanded?(rowIndex: number): boolean {
    // TODO: 后续实现状态检查
    return this.internalProps.expandedRowsSet.has(rowIndex);
  }

  /**
   * 切换行的展开状态
   * @param rowIndex
   */
  toggleRowExpand?(rowIndex: number): void {
    if (this.internalProps.expandedRowsSet.has(rowIndex)) {
      this.collapseRow(rowIndex);
    } else {
      this.expandRow(rowIndex);
    }
  }

  /**
   * 展开行 - 在指定数据行后插入一个详情行
   * @param recordIndex 数据记录索引
   * @param height 详情行高度（可选，默认使用 detailRowHeight）
   */
  expandRow?(recordIndex: number, height?: number): void {
    // 在展开之前，先记录原始行高度
    const tableRowIndex = recordIndex + 1;
    if (tableRowIndex >= 0) {
      const originalHeight = this.getRowHeight(tableRowIndex);
      this.originalRowHeights.set(recordIndex, originalHeight);
    }

    // 如果没有传递height，从动态配置中获取
    if (!height) {
      const record = this.getRecordByRowIndex(recordIndex);
      const detailConfig = this.getDetailConfigForRecord(record, recordIndex);
      height = detailConfig?.style?.height || 200; // 默认200
    }

    this.rowManager.expandRecord(recordIndex, height);
    // 更新图标状态
    // console.log(recordIndex)
    // console.log(tableRowIndex)
    if (tableRowIndex >= 0) {
      this.scenegraph.updateHierarchyIcon(0, tableRowIndex);
      this.scenegraph.updateNextFrame();
    }

    // 渲染子表
    this.renderSubTable(recordIndex);
    
    // 重新计算所有子表位置（因为展开操作会影响其他子表的相对位置）
    this.recalculateAllSubTablePositions();
  }

  /**
   * 收起行 - 移除指定数据行后的详情行
   * @param recordIndex 数据记录索引
   */
  collapseRow?(recordIndex: number): void {
    // 先移除子表
    this.removeSubTable(recordIndex);

    this.rowManager.collapseRecord(recordIndex);
    // 清理原始高度记录
    this.originalRowHeights.delete(recordIndex);
    // 更新图标状态
    const tableRowIndex = recordIndex + 1;
    if (tableRowIndex >= 0) {
      this.scenegraph.updateHierarchyIcon(0, tableRowIndex);
      this.scenegraph.updateNextFrame();
    }
    
    // 重新计算所有子表位置（因为收起操作会影响其他子表的相对位置）
    this.recalculateAllSubTablePositions();
  }

  /**
   * 渲染子表（支持动态配置）
   * @param recordIndex 数据记录索引
   */
  private renderSubTable(recordIndex: number): void {
    // 获取记录数据
    const record = this.getRecordByRowIndex(recordIndex);
    if (!record || !record.children) {
      return;
    }

    // 获取子表配置
    const detailConfig = this.getDetailConfigForRecord(record, recordIndex);
    if (!detailConfig) {
      console.warn('No detail config found for record at index:', recordIndex);
      return;
    }

    // 动态计算子表的viewBox区域
    const childViewBox = this.calculateSubTableViewBox(recordIndex, detailConfig);
    if (!childViewBox) {
      return; // 如果无法计算viewBox，则不渲染子表
    }

    // 保存初始ViewBox位置
    this.subTableInitialViewBox.set(recordIndex, {
      x1: childViewBox.x1,
      y1: childViewBox.y1,
      x2: childViewBox.x2,
      y2: childViewBox.y2
    });

    // 准备子表数据
    const childrenData = Array.isArray(record.children) ? record.children : [];

    // 创建子表配置
    const subTableOptions = {
      viewBox: childViewBox,
      canvas: this.canvas,
      records: childrenData, // 使用记录的children数据
      columns: detailConfig.columnDefs, // 使用配置的列定义
      widthMode: 'adaptive' as const, // 使用自适应模式，列宽自动平分占满整个子表宽度
      showHeader: true,
      // 继承一些父表的配置
      theme: this.options.theme,
      ...detailConfig // 应用其他详情配置
    };

    // 目前只支持MasterDetailTable类型，未来可以扩展其他类型
    const subTable = new MasterDetailTable(this.container, subTableOptions);
    this.subTableInstances.set(recordIndex, subTable);

    // 关键：每次父表重绘后，手动让子表重绘，保证子表内容在上层
    const afterRenderHandler = () => {
      if (this.subTableInstances.has(recordIndex)) {
        subTable.render();
      }
    };
    
    this.on('after_render', afterRenderHandler);
    
    // 存储处理器引用以便清理
    (subTable as MasterDetailTable & { __afterRenderHandler?: () => void }).__afterRenderHandler = afterRenderHandler;

    // 设置滚动事件隔离
    this.setupScrollEventIsolation(recordIndex, subTable, childViewBox);

    // 初始渲染
    subTable.render();
    
    // 延迟设置第一个数据单元格为选中状态
    setTimeout(() => {
      this.selectSubTableFirstCell(subTable);
    }, 200);
  }

  /**
   * 设置子表第一个数据单元格为选中状态
   * @param subTable 子表实例
   */
  private selectSubTableFirstCell(subTable: MasterDetailTable): void {
    // 如果子表没有数据，直接返回
    if (!subTable.records || subTable.records.length === 0) {
      return;
    }

    // 计算第一个数据单元格的位置
    // 行：跳过表头行，选择第一个数据行
    const firstDataRow = subTable.columnHeaderLevelCount; // 表头行数
    // 列：选择第一个数据列（通常是第0列）
    const firstDataCol = 0;

    // 使用VTable的selectCell方法直接设置选中状态
    if (firstDataRow < subTable.rowCount && firstDataCol < subTable.colCount) {
      subTable.selectCell(firstDataCol, firstDataRow);
    }
  }

  /**
   * 获取指定行索引的记录数据
   * @param rowIndex 行索引
   * @returns 记录数据
   */
  private getRecordByRowIndex(rowIndex: number): Record<string, unknown> {
    return this.records[rowIndex];
  }

  /**
   * 计算子表的viewBox区域
   * @param recordIndex 数据记录索引
   * @param detailConfig 详情配置
   * @returns viewBox区域或null
   */
  private calculateSubTableViewBox(
    recordIndex: number,
    detailConfig?: Record<string, unknown>
  ): { x1: number; y1: number; x2: number; y2: number } | null {
    // 获取展开行的详情行索引（数据行的下一行）
    const detailRowIndex = recordIndex + 1;
    
    // 获取详情行的位置和大小
    const detailRowRect = this.getCellRangeRelativeRect({ col: 0, row: detailRowIndex });
    if (!detailRowRect) {
      return null;
    }

    // 获取原始行高度
    const originalHeight = this.originalRowHeights.get(recordIndex) || 0;
    
    // 获取表格的完整宽度范围 - 从第一列到最后一列
    const firstColRect = this.getCellRangeRelativeRect({ col: 0, row: detailRowIndex });
    const lastColRect = this.getCellRangeRelativeRect({ col: this.colCount - 1, row: detailRowIndex });
    
    if (!firstColRect || !lastColRect) {
      return null;
    }
    
    // 从配置中获取边距和高度，提供默认值
    const margin = detailConfig?.style?.margin || 10;
    const configHeight = detailConfig?.style?.height || 300;
    
    // 计算子表的viewBox
    const viewBox = {
      x1: firstColRect.left + margin,
      y1: detailRowRect.top + originalHeight + margin, // 从原始高度之后开始
      x2: lastColRect.right - margin, // 使用最后一列的右边界
      y2: detailRowRect.top - margin + configHeight // 使用配置的高度
    };

    // 确保viewBox有效
    if (viewBox.x2 <= viewBox.x1 || viewBox.y2 <= viewBox.y1) {
      return null;
    }

    return viewBox;
  }

  /**
   * 设置滚动事件隔离（基于test.ts的逻辑）
   * @param recordIndex 数据记录索引
   * @param subTable 子表实例
   * @param childViewBox 子表显示区域
   */
  private setupScrollEventIsolation(
    recordIndex: number,
    subTable: MasterDetailTable,
    childViewBox: { x1: number; y1: number; x2: number; y2: number }
  ): void {
    // 检测鼠标是否在子表区域内
    const isMouseInChildTableArea = (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // 获取子表的当前 ViewBox 位置（实时更新）
      const currentViewBox = subTable.options.viewBox;
      if (!currentViewBox) {
        return false;
      }
      
      // 检查是否在子表的当前viewBox区域内
      const isInArea =
        x >= currentViewBox.x1 && x <= currentViewBox.x2 && y >= currentViewBox.y1 && y <= currentViewBox.y2;
      return isInArea;
    };

    // 父表滚动控制函数
    const handleParentScroll = (parentArgs: { event?: MouseEvent }) => {
      // 检查鼠标是否在子表区域内
      if (parentArgs.event && isMouseInChildTableArea(parentArgs.event)) {
        // console.log('鼠标在子表区域内，阻止父表滚动');
        return false; // 阻止父表滚动
      }
      return true; // 允许父表滚动
    };
    
    // 监听父表滚动事件
    this.on('can_scroll', handleParentScroll);
    
    // 监听子表滚动事件
    subTable.on('scroll', (args: unknown) => {
      // console.log('子表滚动事件:', args);
    });

    // 存储处理器引用以便清理
    (subTable as MasterDetailTable & { 
      __scrollHandler?: (args: { event?: MouseEvent }) => boolean 
    }).__scrollHandler = handleParentScroll;
  }

  /**
   * 移除子表
   * @param recordIndex 数据记录索引
   */
  private removeSubTable(recordIndex: number): void {
    const subTable = this.subTableInstances.get(recordIndex);
    if (subTable) {
      // 移除after_render监听器
      const afterRenderHandler = (
        subTable as MasterDetailTable & {
          __afterRenderHandler?: () => void;
        }
      ).__afterRenderHandler;
      if (afterRenderHandler) {
        this.off('after_render', afterRenderHandler);
      }

      // 移除滚动事件监听器
      const scrollHandler = (
        subTable as MasterDetailTable & {
          __scrollHandler?: (args: { event?: MouseEvent }) => boolean;
        }
      ).__scrollHandler;
      if (scrollHandler) {
        this.off('can_scroll', scrollHandler);
      }

      // 销毁子表实例
      if (typeof subTable.release === 'function') {
        subTable.release();
      }

      // 清理映射
      this.subTableInstances.delete(recordIndex);
      this.subTableInitialViewBox.delete(recordIndex);
    }
  }

  /**
   * 为子表添加setTranslate方法，用于改变ViewBox坐标
   * @param deltaX X轴位移量
   * @param deltaY Y轴位移量
   */
  setTranslate(deltaX: number, deltaY: number): void {
    if (this.options.viewBox) {
      // 计算新的ViewBox位置
      const currentViewBox = this.options.viewBox;
      const newViewBox = {
        x1: currentViewBox.x1 + deltaX,
        y1: currentViewBox.y1 + deltaY,
        x2: currentViewBox.x2 + deltaX,
        y2: currentViewBox.y2 + deltaY
      };
      
      // 更新ViewBox配置
      this.options.viewBox = newViewBox;
      
      // 通知VRender Stage更新ViewBox
      if (this.scenegraph?.stage) {
        (
          this.scenegraph.stage as {
            setViewBox: (viewBox: { x1: number; y1: number; x2: number; y2: number }, flag: boolean) => void;
          }
        ).setViewBox(newViewBox, false);
      }
      
      // 重新渲染子表
      this.render();
    }
  }

  /**
   * 更新子表位置（translate方法）
   * @param recordIndex 数据记录索引
   * @param deltaX X轴位移量
   * @param deltaY Y轴位移量
   */
  private updateSubTablePosition(recordIndex: number, deltaX: number, deltaY: number): void {
    const subTable = this.subTableInstances.get(recordIndex);
    if (!subTable) {
      return;
    }

    // 获取初始ViewBox位置
    const initialViewBox = this.subTableInitialViewBox.get(recordIndex);
    if (!initialViewBox) {
      return;
    }

    // 计算新的ViewBox位置
    const newViewBox = {
      x1: initialViewBox.x1 + deltaX,
      y1: initialViewBox.y1 + deltaY,
      x2: initialViewBox.x2 + deltaX,
      y2: initialViewBox.y2 + deltaY
    };

    // 更新子表的ViewBox
    subTable.options.viewBox = newViewBox;
    
    // 通知VRender Stage更新ViewBox
    if (subTable.scenegraph?.stage) {
      (
        subTable.scenegraph.stage as {
          setViewBox: (viewBox: { x1: number; y1: number; x2: number; y2: number }, flag: boolean) => void;
        }
      ).setViewBox(newViewBox, false);
    }

    // 重新渲染子表
    subTable.render();
  }

  /**
   * 更新所有子表位置
   * @param deltaX X轴位移量
   * @param deltaY Y轴位移量
   */
  private updateAllSubTablePositions(deltaX: number, deltaY: number): void {
    this.subTableInstances.forEach((subTable, recordIndex) => {
      this.updateSubTablePosition(recordIndex, deltaX, deltaY);
    });
  }

  /**
   * 在表格状态变化时更新子表位置
   * 可以在外部调用这个方法来手动更新子表位置
   * @param deltaX X轴位移量
   * @param deltaY Y轴位移量
   */
  updateSubTableTranslation(deltaX: number = 0, deltaY: number = 0): void {
    this.updateAllSubTablePositions(deltaX, deltaY);
  }

  /**
   * 重新计算所有子表位置（用于展开收起后重新定位）
   */
  private recalculateAllSubTablePositions(): void {
    this.subTableInstances.forEach((subTable, recordIndex) => {
      // 获取记录数据和配置
      const record = this.getRecordByRowIndex(recordIndex);
      const detailConfig = record ? this.getDetailConfigForRecord(record, recordIndex) : null;
      
      // 重新计算子表的ViewBox区域
      const newViewBox = this.calculateSubTableViewBox(recordIndex, detailConfig);
      if (newViewBox) {
        // 更新初始ViewBox位置
        this.subTableInitialViewBox.set(recordIndex, {
          x1: newViewBox.x1,
          y1: newViewBox.y1,
          x2: newViewBox.x2,
          y2: newViewBox.y2
        });
        
        // 更新子表的ViewBox
        subTable.options.viewBox = newViewBox;
        
        // 通知VRender Stage更新ViewBox
        if (subTable.scenegraph?.stage) {
          (
            subTable.scenegraph.stage as {
              setViewBox: (viewBox: { x1: number; y1: number; x2: number; y2: number }, flag: boolean) => void;
            }
          ).setViewBox(newViewBox, false);
        }
        
        // 重新渲染子表
        subTable.render();
      }
    });
  }
}
