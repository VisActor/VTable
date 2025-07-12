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
    this.internalProps.detailRowHeight = options.detailRowHeight || 100;
    this.internalProps.detailRenderer = options.detailRenderer;
    // 存储每个展开行的自定义高度
    this.internalProps.expandedRowHeights = new Map<number, number>();
    
    // 初始化行管理器
    this.rowManager = new MasterDetailRowManager(this);

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
    
    // 检查是否是展开后插入的空白行
    const layoutMap = this.internalProps.layoutMap as MasterDetailLayoutMap;
    if (layoutMap.isDetailRow(row)) {
      // 这是展开后插入的空白行，返回空内容
      return '';
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
  }

  updateRecords(records: Record<string, unknown>[], recordIndexs: (number | number[])[]) {
    if (!this.internalProps.records) {
      return;
    }
    records.forEach((record, i) => {
      const index = typeof recordIndexs[i] === 'number' ? recordIndexs[i] as number : (recordIndexs[i] as number[])[0];
      if (index >= 0 && index < this.internalProps.records.length) {
        this.internalProps.records[index] = { ...this.internalProps.records[index], ...record };
      }
    });
    this.scenegraph.createSceneGraph();
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

  // ==================== 抽象方法实现 ====================
  
  /**
   * 获取层级节点收起展开的状态
   * @param col
   * @param row
   * @returns
   */
  getHierarchyState(col: number, row: number): HierarchyState | null {
    // 检查是否为第一列（展开按钮列）
    if (col !== 0 || this.isHeader(col, row)) {
      return HierarchyState.none;
    }

    // 获取数据行索引
    const dataRowIndex = this.getRecordShowIndexByCell(col, row);
    if (dataRowIndex < 0) {
      return HierarchyState.none;
    }

    // 检查是否已展开
    if (this.internalProps.expandedRowsSet.has(dataRowIndex)) {
      return HierarchyState.expand;
    }
    return HierarchyState.collapse;
  }

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
    this.rowManager.toggleRecord(rowIndex);
  }

  /**
   * 收起行 - 移除指定数据行后的详情行
   * @param recordIndex 数据记录索引
   */
  collapseRow?(recordIndex: number): void {
    this.rowManager.collapseRecord(recordIndex);
  }

  /**
   * 展开行 - 在指定数据行后插入一个详情行
   * @param recordIndex 数据记录索引
   * @param height 详情行高度（可选，默认使用 detailRowHeight）
   */
  expandRow?(recordIndex: number, height?: number): void {
    this.rowManager.expandRecord(recordIndex, height);
  }

  /**
   * 重写 getRowHeight 方法，为展开的详情行提供自定义高度
   */
  getRowHeight(row: number): number {
    // 检查是否是展开后插入的详情行
    if (this.rowManager.isDetailRow(row)) {
      // 这是展开后插入的详情行，从 rowHeightsMap 获取高度
      const customHeight = this.rowHeightsMap.get(row);
      if (customHeight !== undefined) {
        return customHeight;
      }
      // 如果没有设置自定义高度，使用默认详情行高度
      return this.internalProps.detailRowHeight || 100;
    }
    
    // 对于普通行，调用父类方法
    return super.getRowHeight(row);
  }

  /**
   * 检查指定行是否是详情行
   * @param row 行索引
   * @returns 是否是详情行
   */
  isDetailRow(row: number): boolean {
    return this.rowManager.isDetailRow(row);
  }

  /**
   * 根据行索引获取对应的记录索引（仅对数据行有效）
   * @param row 行索引
   * @returns 记录索引，如果是详情行则返回 -1
   */
  getRecordIndexByRow(row: number): number {
    return this.rowManager.getRecordIndexByRow(row);
  }
}
