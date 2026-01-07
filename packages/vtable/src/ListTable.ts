import type {
  AggregationType,
  CellAddress,
  CellRange,
  ColumnsDefine,
  DropDownMenuEventInfo,
  FieldData,
  FieldDef,
  FieldFormat,
  FieldKeyDef,
  FilterRules,
  IPagination,
  ListTableAPI,
  ListTableConstructorOptions,
  MaybePromiseOrUndefined,
  SortOrder,
  SortState
} from './ts-types';
import { HierarchyState } from './ts-types';
import { SimpleHeaderLayoutMap } from './layout';
import { isArray, isValid } from '@visactor/vutils';
import {
  _setDataSource,
  _setRecords,
  checkHasAggregationOnColumnDefine,
  generateAggregationForColumn
} from './core/tableHelper';
import { BaseTable } from './core';
import type { BaseTableAPI, ListTableProtected } from './ts-types/base-table';
import { TABLE_EVENT_TYPE } from './core/TABLE_EVENT_TYPE';
import type { ITitleComponent } from './components/title/title';
import { Env } from './tools/env';
import * as editors from './edit/editors';
import { EditManager } from './edit/edit-manager';
import { computeColWidth } from './scenegraph/layout/compute-col-width';
import { computeRowHeight } from './scenegraph/layout/compute-row-height';
import { defaultOrderFn } from './tools/util';
import type { IEditor } from '@visactor/vtable-editors';
import type { ColumnData, ColumnDefine, HeaderData } from './ts-types/list-table/layout-map/api';
import { getCellRadioState, setCellRadioState } from './state/radio/radio';
import { cloneDeepSpec } from '@visactor/vutils-extension';
import { getGroupCheckboxState, setCellCheckboxState } from './state/checkbox/checkbox';
import type { IEmptyTipComponent } from './components/empty-tip/empty-tip';
import { Factory } from './core/factory';
import { getGroupByDataConfig } from './core/group-helper';
import { DataSource, type CachedDataSource } from './data';
import { getValueFromDeepArray } from './data/DataSource';
import {
  listTableAddRecord,
  listTableAddRecords,
  listTableChangeCellValue,
  listTableChangeCellValues,
  listTableChangeCellValuesByIds,
  listTableDeleteRecords,
  listTableUpdateRecords,
  sortRecords
} from './core/record-helper';
import type { IListTreeStickCellPlugin, ListTreeStickCellPlugin } from './plugins/list-tree-stick-cell';
import { fixUpdateRowRange } from './tools/update-row';
import { clearChartRenderQueue } from './scenegraph/graphic/contributions/chart-render-helper';
import { getCustomMergeCellFunc } from './core/utils/get-custom-merge-cell-func';
import {
  adjustHeightResizedRowMap,
  adjustHeightResizedRowMapWithAddRecordIndex,
  adjustHeightResizedRowMapWithDeleteRecordIndex,
  adjustWidthResizedColMap
} from './state/cell-move/adjust-header';
// import {
//   registerAxis,
//   registerEmptyTip,
//   registerLegend,
//   registerMenu,
//   registerTitle,
//   registerTooltip
// } from './components';
// import {
//   registerChartCell,
//   registerCheckboxCell,
//   registerImageCell,
//   registerProgressBarCell,
//   registerRadioCell,
//   registerSparkLineCell,
//   registerTextCell,
//   registerVideoCell
// } from './scenegraph/group-creater/cell-type';

// registerAxis();
// registerEmptyTip();
// registerLegend();
// registerMenu();
// registerTitle();
// registerTooltip();

// registerChartCell();
// registerCheckboxCell();
// registerImageCell();
// registerProgressBarCell();
// registerRadioCell();
// registerSparkLineCell();
// registerTextCell();
// registerVideoCell();

export class ListTable extends BaseTable implements ListTableAPI {
  declare internalProps: ListTableProtected;
  /**
   * 用户配置的options 只读 勿直接修改
   */
  declare options: ListTableConstructorOptions;
  showHeader = true;
  listTreeStickCellPlugin?: ListTreeStickCellPlugin;

  // eslint-disable-next-line default-param-last
  constructor(options: ListTableConstructorOptions);
  constructor(container: HTMLElement, options: ListTableConstructorOptions);
  constructor(container?: HTMLElement | ListTableConstructorOptions, options?: ListTableConstructorOptions) {
    super(container as HTMLElement, options);
    options = this.options;
    const internalProps = this.internalProps;
    internalProps.frozenColDragHeaderMode =
      options.dragOrder?.frozenColDragHeaderMode ?? options.frozenColDragHeaderMode;
    //分页配置
    this.pagination = options.pagination;
    internalProps.sortState = options.sortState;
    internalProps.multipleSort = !!options.multipleSort;
    internalProps.dataConfig = this.internalProps.groupBy
      ? getGroupByDataConfig(this.internalProps.groupBy, options.addRecordRule)
      : { addRecordRule: options.addRecordRule }; //cloneDeep(options.dataConfig ?? {});
    internalProps.columns = options.columns
      ? cloneDeepSpec(options.columns, ['children']) // children for react
      : options.header
      ? cloneDeepSpec(options.header, ['children'])
      : [];
    generateAggregationForColumn(this);
    // options.columns?.forEach((colDefine, index) => {
    //   //如果editor 是一个IEditor的实例  需要这样重新赋值 否则clone后变质了
    //   if (colDefine.editor) {
    //     internalProps.columns[index].editor = colDefine.editor;
    //   }
    // });

    internalProps.enableTreeNodeMerge =
      options.enableTreeNodeMerge ?? isValid((this.internalProps as ListTableProtected).groupBy) ?? false;

    this.internalProps.headerHelper.setTableColumnsEditor();
    this.showHeader = options.showHeader ?? true;

    this.internalProps.columnWidthConfig = options.columnWidthConfig;
    this.internalProps.rowHeightConfig = options.rowHeightConfig;

    this.transpose = options.transpose ?? false;
    if (Env.mode !== 'node') {
      this.editorManager = new EditManager(this);
    }
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;

    if (options.dataSource) {
      // _setDataSource(this, options.dataSource)
      this.dataSource = options.dataSource;
    } else if (options.records) {
      this.setRecords(options.records as any, { sortState: internalProps.sortState });
    } else {
      this.setRecords([]);
    }
    if (options.title) {
      const Title = Factory.getComponent('title') as ITitleComponent;
      internalProps.title = new Title(options.title, this);
      // this.scenegraph.resize();//下面有个resize了 所以这个可以去掉
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

    if ((this.internalProps as ListTableProtected).enableTreeStickCell) {
      const ListTreeStickCellPlugin = Factory.getComponent('listTreeStickCellPlugin') as IListTreeStickCellPlugin;
      this.listTreeStickCellPlugin = new ListTreeStickCellPlugin(this);
    }
    //为了确保用户监听得到这个事件 这里做了异步 确保vtable实例已经初始化完成
    setTimeout(() => {
      if (this.isReleased) {
        return;
      }
      this.resize();
      this.fireListeners(TABLE_EVENT_TYPE.INITIALIZED, null);
    }, 0);
  }
  isListTable(): true {
    return true;
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
    return this.dataSource?.records;
  }

  get recordsCount() {
    return this.dataSource.records.length;
  }

  // /**
  //  * Gets the define of the header.
  //  */
  // get columns(): ColumnsDefine {
  //   return this.internalProps.columns;
  // }
  // /**
  //  * Sets the define of the column.
  //  */
  // set columns(columns: ColumnsDefine) {
  //   this.internalProps.columns = columns;
  //   this.options.columns = columns;
  // }
  /**
   * Sets the define of the column.
   */
  updateColumns(
    columns: ColumnsDefine,
    options: { clearColWidthCache?: boolean; clearRowHeightCache?: boolean } = {
      clearColWidthCache: false,
      clearRowHeightCache: true
    }
  ) {
    this.scenegraph.clearCells(); //将该代码提前 逻辑中有设置this.clear=true。refreshHeader逻辑中有判断clear这个值的地方
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.internalProps.columns = cloneDeepSpec(columns, ['children']);
    generateAggregationForColumn(this);
    // columns.forEach((colDefine, index) => {
    //   if (colDefine.editor) {
    //     this.internalProps.columns[index].editor = colDefine.editor;
    //   }
    // });
    if (options?.clearColWidthCache) {
      this.internalProps._widthResizedColMap.clear();
    }
    this.options.columns = columns;
    this.internalProps.headerHelper.setTableColumnsEditor();
    this._hasAutoImageColumn = undefined;
    this.refreshHeader();
    this.dataSource.updateColumns?.(this.internalProps.columns);
    if (this.records && checkHasAggregationOnColumnDefine(this.internalProps.columns)) {
      this.dataSource.processRecords(this.dataSource.dataSourceObj?.records ?? this.dataSource.dataSourceObj);
    }
    this.internalProps.useOneRowHeightFillAll = false;

    this.headerStyleCache = new Map();
    this.bodyStyleCache = new Map();
    this.bodyBottomStyleCache = new Map();
    this.scenegraph.createSceneGraph(!!!options?.clearRowHeightCache);
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    this.renderAsync();
    this.eventManager.updateEventBinder();
  }

  /**
   * 作为 `updateColumns` 的轻量级替代方案，用于仅需重新创建场景图而无需重新定义列的场景，
   * 例如展开/折叠树形节点。此方法避免了 `updateColumns` 中开销较大的 `cloneDeepSpec` 深拷贝操作。
   *
   * 注意：此方法与 `updateColumns` 共享部分逻辑。如果将来修改了 `updateColumns`，
   * 请务必检查此方法，以确保逻辑一致性，防止出现“逻辑漂移”。
   */
  private _recreateSceneForStateChange(): void {
    this.scenegraph.clearCells();
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };

    this._hasAutoImageColumn = undefined;
    this.refreshHeader();
    if (this.records && checkHasAggregationOnColumnDefine(this.internalProps.columns)) {
      this.dataSource.processRecords(this.dataSource.dataSourceObj?.records ?? this.dataSource.dataSourceObj);
    }
    this.internalProps.useOneRowHeightFillAll = false;

    this.headerStyleCache = new Map();
    this.bodyStyleCache = new Map();
    this.bodyBottomStyleCache = new Map();
    this._updateSize();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    this.renderAsync();
    this.eventManager.updateEventBinder();
  }
  /**
   * 添加列 TODO: 需要优化 这个方法目前直接调用了updateColumns 可以避免调用 做优化性能
   * @param column
   */
  addColumns(toAddColumns: ColumnDefine[], colIndex?: number, isMaintainArrayData: boolean = true) {
    const columns = this.options.columns;
    if (colIndex === undefined) {
      colIndex = columns.length;
      columns.push(...toAddColumns);
    } else {
      columns.splice(colIndex, 0, ...toAddColumns);
    }
    for (let i = 0; i < toAddColumns.length; i++) {
      this.colWidthsMap.addAndReorder(colIndex + i, toAddColumns[i].width ?? this.internalProps.defaultColWidth);
    }
    //#region 修正colWidthsMap中的列宽缓存
    this.internalProps._colRangeWidthsMap.clear();
    //_widthResizedColMap修养修正，里面的列号需要修正，保证删除某些列后 其他列号做对应调整
    const resizedColIndexs = Array.from(this.internalProps._widthResizedColMap.keys());
    for (let i = 0; i < resizedColIndexs.length; i++) {
      if ((resizedColIndexs[i] as number) >= (colIndex as number)) {
        this.internalProps._widthResizedColMap.delete(resizedColIndexs[i] as number);
        this.internalProps._widthResizedColMap.add((resizedColIndexs[i] as number) + toAddColumns.length);
      }
    }
    //#endregion

    if (isMaintainArrayData) {
      //重新整理column中的field值
      for (let i = 0; i < columns.length; i++) {
        columns[i].field = i;
      }

      //如果isMaintainArrayData为true 则需要维护其中是数组类型的数据
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (Array.isArray(record)) {
          record.splice(colIndex, 0, ...Array(toAddColumns.length).fill(undefined));
        }
      }
    }
    this.updateColumns(columns, { clearRowHeightCache: false });
    this.fireListeners(TABLE_EVENT_TYPE.ADD_COLUMN, {
      columnIndex: colIndex,
      columnCount: toAddColumns.length,
      columns
    });
  }
  /**
   * 删除列 TODO: 需要优化 这个方法目前直接调用了updateColumns 可以避免调用 做优化性能
   * @param colIndex
   */
  deleteColumns(deleteColIndexs: number[], isMaintainArrayData: boolean = true) {
    const columns = this.options.columns;
    deleteColIndexs.sort((a, b) => b - a);
    for (let i = 0; i < deleteColIndexs.length; i++) {
      columns.splice(deleteColIndexs[i], 1);
      //#region 修正colWidthsMap中的列宽缓存
      this.colWidthsMap.delAndReorder(deleteColIndexs[i]);
      this.internalProps._widthResizedColMap.delete(deleteColIndexs[i]);
      //#endregion
      if (isMaintainArrayData) {
        //如果isMaintainArrayData为true 则需要维护其中是数组类型的数据
        for (let j = 0; j < this.records.length; j++) {
          const record = this.records[j];
          if (Array.isArray(record)) {
            record.splice(deleteColIndexs[i], 1);
          }
        }
      }
    }
    //#region 修正colWidthsMap中的列宽缓存
    this.internalProps._colRangeWidthsMap.clear();
    //_widthResizedColMap修养修正，里面的列号需要修正，保证删除某些列后 其他列号做对应调整
    const resizedColIndexs = Array.from(this.internalProps._widthResizedColMap.keys());
    for (let i = 0; i < resizedColIndexs.length; i++) {
      for (let j = 0; j < deleteColIndexs.length; j++) {
        if ((resizedColIndexs[i] as number) > (deleteColIndexs[j] as number)) {
          this.internalProps._widthResizedColMap.delete(resizedColIndexs[i] as number);
          this.internalProps._widthResizedColMap.add((resizedColIndexs[i] as number) - (deleteColIndexs.length - j));
          break;
        }
      }
    }
    //#endregion
    if (isMaintainArrayData) {
      //重新整理column中的field值
      for (let i = 0; i < columns.length; i++) {
        columns[i].field = i;
      }
    }
    this.updateColumns(columns, { clearRowHeightCache: false });
    this.fireListeners(TABLE_EVENT_TYPE.DELETE_COLUMN, {
      deleteColIndexs: deleteColIndexs,
      columns
    });
  }

  get columns(): ColumnsDefine {
    // return this.internalProps.columns;
    return this.internalProps.layoutMap.columnTree.getCopiedTree(); //调整顺序后的columns
  }
  /**
   *@deprecated 请使用columns
   */
  get header(): ColumnsDefine {
    return this.internalProps.columns;
  }
  /**
   * @deprecated 请使用columns
   */
  set header(header: ColumnsDefine) {
    this.internalProps.columns = header;
    generateAggregationForColumn(this);
    this.options.header = header;
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;
    //需要异步等待其他事情都完成后再绘制
    this.renderAsync();
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
    // this.options.transpose = transpose; // cause extr update in react
    if (this.internalProps.layoutMap) {
      //后面如果修改是否转置
      this.internalProps.layoutMap.transpose = transpose;
      this.refreshRowColCount();

      // 转置后为行布局，列宽只支持依据该列所有内容自适应宽度
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
      if ((this.internalProps as ListTableProtected).groupBy) {
        const record = table.getCellRawRecord(col, row);
        if (record?.vtableMerge) {
          return '';
        }
        if (!table.internalProps.layoutMap.isAggregation(col, row)) {
          value = (this.dataSource as CachedDataSource).getGroupSeriesNumber(row - this.columnHeaderLevelCount);
        }
        // const indexs = this.dataSource.currentIndexedData[row - this.columnHeaderLevelCount] as number[];
        // value = indexs[indexs.length - 1] + 1;
      } else {
        const define = table.getBodyColumnDefine(col, row);
        const checkboxSeriesNumberStyle = (table as ListTable).getFieldData(define.field, col, row);
        if (['number', 'string'].includes(typeof checkboxSeriesNumberStyle)) {
          value = checkboxSeriesNumberStyle;
        } else if (checkboxSeriesNumberStyle?.text) {
          value = checkboxSeriesNumberStyle.text ?? '';
        } else {
          value = row - this.columnHeaderLevelCount + 1;
        }
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
  /** 获取当前单元格在body部分的展示索引 即(row / col)-headerLevelCount。注：ListTable特有接口 */
  getRecordShowIndexByCell(col: number, row: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getRecordShowIndexByCell(col, row);
  }

  /** 获取当前单元格的数据是数据源中的第几条。
   * 如果是树形模式的表格，将返回数组，如[1,2] 数据源中第2条数据中children中的第3条
   * 注：ListTable特有接口 */
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
    const colObj = this.internalProps.layoutMap.columnObjects.find((col: any) => col.field === field);
    if (!colObj) {
      return -1;
    }
    const layoutRange = this.internalProps.layoutMap.getBodyLayoutRangeById(colObj.id);
    if (this.transpose) {
      return layoutRange.start.row;
    }
    return layoutRange.start.col;
  }
  /**
   * 根据数据源中的index和field获取单元格行列号
   * @param field
   * @param recordIndex
   * @returns
   */
  getCellAddrByFieldRecord(field: FieldDef, recordIndex: number | number[]): CellAddress {
    if (this.transpose) {
      return { col: this.getTableIndexByRecordIndex(recordIndex), row: this.getTableIndexByField(field) };
    }
    return { col: this.getTableIndexByField(field), row: this.getTableIndexByRecordIndex(recordIndex) };
  }
  /**
   *
   * @param field 获取整体数据记录。可编辑单元格的话 对应编辑后format前
   * @param col
   * @param row
   */
  getCellOriginRecord(col: number, row: number): MaybePromiseOrUndefined {
    const table = this;
    const index = table.getRecordShowIndexByCell(col, row);
    if (index > -1) {
      return table.dataSource.get(index);
    }
    return undefined;
  }
  /**
   *
   * @param field 获取整体数据记录。可编辑的话 对应编辑前
   * @param col
   * @param row
   */
  getCellRawRecord(col: number, row: number): MaybePromiseOrUndefined {
    const table = this;
    const index = table.getRecordShowIndexByCell(col, row);
    if (index > -1) {
      return table.dataSource.getRaw(index);
    }
    return undefined;
  }
  /**
   * 该列是否可调整列宽
   * @param col
   * @returns
   */
  _canResizeColumn(col: number, row: number): boolean {
    const ifCan = super._canResizeColumn(col, row);
    if (ifCan) {
      if (!this.transpose) {
        // 列上是否配置了禁止拖拽列宽的配置项disableColumnResize
        const cellDefine = this.internalProps.layoutMap.getBody(col, this.columnHeaderLevelCount);
        const isSeriesNumber = this.internalProps.layoutMap.isSeriesNumber(col, row);
        if ((cellDefine as ColumnData)?.disableColumnResize) {
          return false;
        } else if (isSeriesNumber && this.internalProps.rowSeriesNumber.disableColumnResize === true) {
          return false;
        }
      }
    }
    return ifCan;
  }
  updateOption(
    options: ListTableConstructorOptions,
    updateConfig: { clearColWidthCache?: boolean; clearRowHeightCache?: boolean } = {
      clearColWidthCache: true,
      clearRowHeightCache: true
    }
  ) {
    const internalProps = this.internalProps;

    this.pluginManager.removeOrAddPlugins(options.plugins);
    super.updateOption(options, updateConfig);
    internalProps.frozenColDragHeaderMode =
      options.dragOrder?.frozenColDragHeaderMode ?? options.frozenColDragHeaderMode;
    //分页配置
    this.pagination = options.pagination;
    internalProps.sortState = options.sortState;
    // internalProps.dataConfig = {}; // cloneDeep(options.dataConfig ?? {});
    internalProps.dataConfig = (this.internalProps as ListTableProtected).groupBy
      ? getGroupByDataConfig((this.internalProps as ListTableProtected).groupBy, options.addRecordRule)
      : { addRecordRule: options.addRecordRule }; //cloneDeep(options.dataConfig ?? {});
    //更新protectedSpace
    this.showHeader = options.showHeader ?? true;
    internalProps.columns = options.columns
      ? cloneDeepSpec(options.columns, ['children'])
      : options.header
      ? cloneDeepSpec(options.header, ['children'])
      : [];
    generateAggregationForColumn(this);
    // options.columns.forEach((colDefine, index) => {
    //   if (colDefine.editor) {
    //     internalProps.columns[index].editor = colDefine.editor;
    //   }
    // });
    internalProps.enableTreeNodeMerge =
      options.enableTreeNodeMerge ?? isValid((this.internalProps as ListTableProtected).groupBy) ?? false;

    this.internalProps.headerHelper.setTableColumnsEditor();
    // 处理转置
    this.transpose = options.transpose ?? false;
    // 更新表头
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;

    this.internalProps.columnWidthConfig = options.columnWidthConfig;
    this.internalProps.rowHeightConfig = options.rowHeightConfig;

    // this.hasMedia = null; // 避免重复绑定
    // 清空目前数据
    if (internalProps.releaseList) {
      for (let i = internalProps.releaseList.length - 1; i >= 0; i--) {
        const releaseObj = internalProps.releaseList[i];
        if (releaseObj instanceof DataSource) {
          releaseObj.updateColumns(this.internalProps.columns);
        } else {
          releaseObj?.release?.();
          internalProps.releaseList.splice(i, 1);
        }
      }
    }
    // // 恢复selection状态
    // internalProps.selection.range = range;
    // this._updateSize();
    // 传入新数据
    if (options.dataSource && this.dataSource !== options.dataSource) {
      // _setDataSource(this, options.dataSource);
      this.dataSource = options.dataSource;
    } else if (options.records) {
      this.setRecords(options.records as any, {
        sortState: options.sortState
      });
    } else {
      this.refreshRowColCount();
      this._resetFrozenColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.render();
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
    this.pluginManager.updatePlugins(options.plugins);
    setTimeout(() => {
      this.fireListeners(TABLE_EVENT_TYPE.UPDATED, null);
    }, 0);
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }
  /**
   * 更新页码
   * @param pagination 修改页码
   */
  updatePagination(pagination: IPagination): void {
    if (this.pagination) {
      typeof pagination.currentPage === 'number' &&
        pagination.currentPage >= 0 &&
        (this.pagination.currentPage = pagination.currentPage);
      pagination.perPageCount &&
        (this.pagination.perPageCount = pagination.perPageCount || this.pagination.perPageCount);
      this.internalProps.layoutMap.clearCellRangeMap();
      this.internalProps.useOneRowHeightFillAll = false;
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      this.dataSource.updatePagination(this.pagination);
      this.refreshRowColCount();
      this.stateManager.initCheckedState(this.records);
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.renderAsync();
    }
  }
  /** @private */
  refreshHeader(): void {
    const table = this;
    const internalProps = table.internalProps;
    const transpose = table.transpose;
    const showHeader = table.showHeader;
    const layoutMap = (internalProps.layoutMap = new SimpleHeaderLayoutMap(
      this,
      internalProps.columns ?? [],
      showHeader,
      table.options.hierarchyIndent
    ));

    layoutMap.transpose = transpose;

    if (!transpose) {
      //设置列宽  这里需要优化，考虑转置表格的情况 transpose，转置表格不需要设置colWidth  TODO
      this.setMinMaxLimitWidth(true);
    }
    //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
    this.refreshRowColCount();
  }

  refreshRowColCount(): void {
    const table = this;
    const { layoutMap } = table.internalProps;
    if (!layoutMap) {
      return;
    }

    const dataCount = table.internalProps.dataSource?.length ?? 0;
    layoutMap.recordsCount =
      dataCount +
      (dataCount > 0 || !!this.options.showAggregationWhenEmpty
        ? layoutMap.hasAggregationOnTopCount + layoutMap.hasAggregationOnBottomCount
        : 0);

    if (table.transpose) {
      table.rowCount = layoutMap.rowCount ?? 0;
      table.colCount = layoutMap.colCount ?? 0;
      // table.frozenRowCount = 0;
      // table.frozenColCount = layoutMap.headerLevelCount; //这里不要这样写 这个setter会检查扁头宽度 可能将frozenColCount置为0
      this.internalProps.frozenColCount = Math.max(
        (layoutMap.headerLevelCount ?? 0) + layoutMap.leftRowSeriesNumberColumnCount,
        this.options.frozenColCount ?? 0
      );
      this.internalProps.frozenRowCount = this.options.frozenRowCount ?? 0;
      if (table.bottomFrozenRowCount !== (this.options.bottomFrozenRowCount ?? 0)) {
        table.bottomFrozenRowCount = this.options.bottomFrozenRowCount ?? 0;
      }
      if (table.rightFrozenColCount !== (this.options.rightFrozenColCount ?? 0)) {
        table.rightFrozenColCount = this.options.rightFrozenColCount ?? 0;
      }
    } else {
      table.colCount = layoutMap.colCount ?? 0;
      table.rowCount = layoutMap.recordsCount * layoutMap.bodyRowSpanCount + layoutMap.headerLevelCount;
      // table.frozenColCount = table.options.frozenColCount ?? 0; //这里不要这样写 这个setter会检查扁头宽度 可能将frozenColCount置为0
      this.internalProps.frozenColCount = this.options.frozenColCount ?? 0;
      // 当冻结列数大于等于列数时，则冻结列数置为0，可以查看demo中的list-groupBy.ts来调试这个问题
      if (this.options.frozenColCount >= this.colCount) {
        this.internalProps.frozenColCount = 0;
      }
      // 不能使用frozenRowCount setter 因为会把options.frozenRowCount赋值
      table._setFrozenRowCount(Math.max(layoutMap.headerLevelCount, this.options.frozenRowCount ?? 0));

      if (table.bottomFrozenRowCount !== (this.options.bottomFrozenRowCount ?? 0)) {
        table.bottomFrozenRowCount = this.options.bottomFrozenRowCount ?? 0;
      }
      if (table.rightFrozenColCount !== (this.options.rightFrozenColCount ?? 0)) {
        table.rightFrozenColCount = this.options.rightFrozenColCount ?? 0;
      }
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
    // this.scenegraph.proxy?.refreshRowColCount();
  }
  /**
   * 获取records数据源中 字段对应的value 值是format之后的
   * @param field
   * @param col
   * @param row
   * @returns
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
    return table.internalProps.dataSource.getField(index, field, col, row, this);
  }
  /**
   * 获取records数据源中 字段对应的value 值是数据源中原始值
   * @param field
   * @param col
   * @param row
   * @returns
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
    return table.internalProps.dataSource.getRawField(index, field, col, row, this);
  }
  /**
   * 拖拽移动表头位置
   * @param source 移动源位置
   * @param target 移动目标位置
   */
  _moveHeaderPosition(source: CellAddress, target: CellAddress) {
    const sourceCellRange = this.getCellRange(source.col, source.row);
    const targetCellRange = this.getCellRange(target.col, target.row);
    // 调用布局类 布局数据结构调整为移动位置后的
    const moveContext = this.internalProps.layoutMap.moveHeaderPosition(source, target);
    if (moveContext) {
      if (moveContext.moveType === 'column') {
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        // this.colWidthsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.sourceSize);
        this.colWidthsMap.exchangeOrder(
          sourceCellRange.start.col,
          sourceCellRange.end.col - sourceCellRange.start.col + 1,
          targetCellRange.start.col,
          targetCellRange.end.col - targetCellRange.start.col + 1,
          moveContext.targetIndex
        );
        adjustWidthResizedColMap(moveContext, this);

        if (!this.transpose) {
          //下面代码取自refreshHeader列宽设置逻辑
          //设置列宽极限值 TODO 目前是有问题的 最大最小宽度限制 移动列位置后不正确
          this.colWidthsLimit = {}; //需要先清空
          this.setMinMaxLimitWidth();
        }
        // // 清空相关缓存
        // const colStart = Math.min(moveContext.sourceIndex, moveContext.targetIndex);
        // const colEnd = Math.max(moveContext.sourceIndex, moveContext.targetIndex);
        // for (let col = colStart; col <= colEnd; col++) {
        //   this._clearColRangeWidthsMap(col);
        // }
      } else {
        // // 清空相关缓存
        // const rowStart = Math.min(moveContext.sourceIndex, moveContext.targetIndex);
        // const rowEnd = Math.max(moveContext.sourceIndex, moveContext.targetIndex);
        // for (let row = rowStart; row <= rowEnd; row++) {
        //   this._clearRowRangeHeightsMap(row);
        // }
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        // this.rowHeightsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.moveSize);
        if (moveContext.targetIndex > moveContext.sourceIndex) {
          this.rowHeightsMap.exchangeOrder(
            moveContext.sourceIndex,
            moveContext.sourceSize,
            moveContext.targetIndex + moveContext.sourceSize - moveContext.targetSize,
            moveContext.targetSize,
            moveContext.targetIndex
          );
        } else {
          this.rowHeightsMap.exchangeOrder(
            moveContext.sourceIndex,
            moveContext.sourceSize,
            moveContext.targetIndex,
            moveContext.targetSize,
            moveContext.targetIndex
          );
        }
        adjustHeightResizedRowMap(moveContext, this);
      }
      return moveContext;
    }
    return null;
  }
  changeRecordOrder(sourceIndex: number, targetIndex: number) {
    if (this.transpose) {
      sourceIndex = this.getRecordShowIndexByCell(sourceIndex, 0);
      targetIndex = this.getRecordShowIndexByCell(targetIndex, 0);
    } else {
      sourceIndex = this.getRecordShowIndexByCell(0, sourceIndex);
      targetIndex = this.getRecordShowIndexByCell(0, targetIndex);
    }
    this.dataSource.changeOrder(sourceIndex, targetIndex);
  }
  /**
   * 方法适用于获取body中某条数据的行列号
   * @param findTargetRecord 通过数据对象或者指定函数来计算数据条目index
   * @param field
   * @returns
   */
  getCellAddress(findTargetRecord: any | ((record: any) => boolean), field: FieldDef): CellAddress {
    let targetRecordIndex: number;

    for (let i = 0; i < this.internalProps.records.length; i++) {
      const record = this.internalProps.records[i];
      if (typeof findTargetRecord === 'function') {
        if ((<Function>findTargetRecord)(record)) {
          targetRecordIndex = i;
        }
      } else {
        let isAllRight = true;
        for (const prop in findTargetRecord) {
          if (record[prop] !== findTargetRecord[prop]) {
            isAllRight = false;
            break;
          }
        }
        if (isAllRight) {
          targetRecordIndex = i;
        }
      }
      if (isValid(targetRecordIndex)) {
        break;
      }
    }
    const cellRange = this.getCellRangeByField(field, targetRecordIndex);
    if (cellRange) {
      return { row: cellRange.start.row, col: cellRange.start.col };
    }
    return undefined;
  }
  /**
   * 获取指定field及指定数据条index的单元格位置
   * @param  {*} field
   * @param  {number} index 要获取的第几条数据
   * @return {number} 返回单元格的坐标范围 TODO 转置表有问题bug
   */
  getCellRangeByField(field: FieldDef, index: number): CellRange | null {
    const { layoutMap } = this.internalProps;
    const colObj = layoutMap.columnObjects.find((col: any) => col.field === field);
    if (colObj) {
      const layoutRange = layoutMap.getBodyLayoutRangeById(colObj.id);
      let startRow;
      if (isValid(index)) {
        startRow = layoutMap.getRecordStartRowByRecordIndex(index);
      }
      if (this.transpose) {
        return {
          start: {
            row: layoutRange.start.row,
            col: isValid(startRow) ? startRow + layoutRange.start.col : undefined
          },
          end: {
            row: layoutRange.end.row,
            col: isValid(startRow) ? startRow + layoutRange.end.col : undefined
          }
        };
      }
      return {
        start: {
          col: layoutRange.start.col,
          row: isValid(startRow) ? startRow + layoutRange.start.row : undefined // layoutRange.start.row这里是0  所以无意义
        },
        end: {
          col: layoutRange.end.col,
          row: isValid(startRow) ? startRow + layoutRange.end.row : undefined // layoutRange.start.row这里是0  所以无意义
        }
      };
    }
    return null;
  }
  /**
   * 获取层级节点收起展开的状态
   * @param col
   * @param row
   * @returns
   */
  getHierarchyState(col: number, row: number) {
    if (this.isHeader(col, row)) {
      return (this._getHeaderLayoutMap(col, row) as HeaderData)?.hierarchyState;
    }
    if (
      !(this.internalProps as ListTableProtected).groupBy ||
      (isArray((this.internalProps as ListTableProtected).groupBy) &&
        ((this.internalProps as ListTableProtected).groupBy as string[]).length === 0)
    ) {
      const define = this.getBodyColumnDefine(col, row) as ColumnDefine;
      if (!define.tree) {
        return HierarchyState.none;
      }
    }
    const index = this.getRecordShowIndexByCell(col, row);
    return this.dataSource.getHierarchyState(index);
  }
  /**
   * 获取单元格所在数据源的层级节点收起展开的状态
   * @param col
   * @param row
   * @returns
   */
  getRecordHierarchyState(col: number, row: number) {
    let recordIndex;
    if (this.transpose) {
      this.getRecordShowIndexByCell(col, 0);
    } else {
      recordIndex = this.getRecordShowIndexByCell(0, row);
    }
    return this.dataSource.getHierarchyState(recordIndex);
  }
  /**
   * 表头切换层级状态
   * @param col
   * @param row
   * @param recalculateColWidths  是否重新计算列宽 默认为true.（设置width:auto或者 autoWidth 情况下才有必要考虑该参数）
   */
  toggleHierarchyState(col: number, row: number, recalculateColWidths: boolean = true) {
    this.stateManager.updateHoverIcon(col, row, undefined, undefined);
    const hierarchyState = this.getHierarchyState(col, row);
    if (this.isHeader(col, row)) {
      // 表头的展开和收起
      const headerTreeNode = this.internalProps.layoutMap.getHeader(col, row) as any;
      const { hierarchyState: rawHierarchyState, define: columnDefine } = headerTreeNode;
      if (![HierarchyState.collapse, HierarchyState.expand].includes(rawHierarchyState) || !columnDefine) {
        return;
      }
      const children = columnDefine.columns;
      // 有子节点才需要自动展开和折叠
      if (!!Array.isArray(children) && children.length > 0) {
        const hierarchyState =
          rawHierarchyState === HierarchyState.expand ? HierarchyState.collapse : HierarchyState.expand;
        headerTreeNode.hierarchyState = hierarchyState;
        headerTreeNode.define.hierarchyState = hierarchyState;
        // 全量更新
        this.updateColumns(this.internalProps.columns);
      }

      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col,
        row,
        hierarchyState,
        originData: headerTreeNode,
        cellLocation: this.getCellLocation(col, row)
      });
      return;
    }

    if (hierarchyState === HierarchyState.expand) {
      this._refreshHierarchyState(col, row, recalculateColWidths);
      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.collapse
      });
    } else if (hierarchyState === HierarchyState.collapse) {
      const record = this.getCellOriginRecord(col, row);
      if (Array.isArray(record.children)) {
        //children 是数组 表示已经有子树节点信息
        this._refreshHierarchyState(col, row, recalculateColWidths);
      }
      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.expand,
        originData: record
      });
    }
  }
  /**
   * 开启层级节点展开的loading动画状态，在设置数据调用setRecordChildren后会自动关闭loading
   * @param col
   * @param row
   */
  setLoadingHierarchyState(col: number, row: number) {
    this.scenegraph.setLoadingHierarchyState(col, row);
  }

  /** 刷新当前节点收起展开状态，如手动更改过 */
  _refreshHierarchyState(col: number, row: number, recalculateColWidths: boolean = true) {
    let notFillWidth = false;
    let notFillHeight = false;
    const checkHasChart = this.internalProps.layoutMap.checkHasChart();
    // 检查当前状态总宽高未撑满autoFill是否在起作用
    if (checkHasChart) {
      if (this.autoFillWidth) {
        notFillWidth = this.getAllColsWidth() <= this.tableNoFrameWidth;
      }
      if (this.autoFillHeight) {
        notFillHeight = this.getAllRowsHeight() <= this.tableNoFrameHeight;
      }
    }
    const index = this.getRecordShowIndexByCell(col, row);
    const diffDataIndices = this.dataSource.toggleHierarchyState(
      index,
      this.scenegraph.proxy.rowStart - this.columnHeaderLevelCount,
      Math.max(
        this.scenegraph.proxy.rowEnd - this.columnHeaderLevelCount,
        this.scenegraph.proxy.rowStart - this.columnHeaderLevelCount + this.scenegraph.proxy.rowLimit - 1
      )
    );
    const diffPositions = this.internalProps.layoutMap.toggleHierarchyState(diffDataIndices);
    //影响行数
    this.refreshRowColCount();

    // for bottom frozen row height map
    for (let row = this.rowCount - this.bottomFrozenRowCount; row < this.rowCount; row++) {
      const newHeight = computeRowHeight(row, 0, this.colCount - 1, this);
      this._setRowHeight(row, newHeight);
    }

    this.clearCellStyleCache();
    this.internalProps.layoutMap.clearCellRangeMap();
    this.internalProps.useOneRowHeightFillAll = false;
    // ts-ignore
    // this.scenegraph.updateHierarchyIcon(col, row);// 添加了updateCells:[{ col, row }] 就不需要单独更新图标了（只更新图标针对有自定义元素的情况 会有更新不到问题）'
    // const updateCells = [{ col, row }];
    // // 如果需要移出的节点超过了当前加载部分最后一行  则转变成更新对应的行
    // if (
    //   diffPositions.removeCellPositions?.length > 0 &&
    //   diffPositions.removeCellPositions[diffPositions.removeCellPositions.length - 1].row >=
    //     this.scenegraph.proxy.rowEnd
    // ) {
    //   for (let i = 0; i <= diffPositions.removeCellPositions.length - 1; i++) {
    //     if (diffPositions.removeCellPositions[i].row <= this.scenegraph.proxy.rowEnd) {
    //       updateCells.push({
    //         col: diffPositions.removeCellPositions[i].col,
    //         row: diffPositions.removeCellPositions[i].row
    //       });
    //     }
    //   }
    //   diffPositions.removeCellPositions = [];

    //   // reset proxy row config
    //   this.scenegraph.proxy.refreshRowCount();
    // }

    const { updateCells, addCells, removeCells } = fixUpdateRowRange(diffPositions, col, row, this);
    this.reactCustomLayout?.clearCache();
    this.scenegraph.updateRow(
      // diffPositions.removeCellPositions,
      // diffPositions.addCellPositions,
      removeCells,
      addCells,
      updateCells,
      recalculateColWidths,
      true
    );
    this.reactCustomLayout?.updateAllCustomCell();

    if (checkHasChart) {
      // 检查更新节点状态后总宽高未撑满autoFill是否在起作用
      if (this.autoFillWidth && !notFillWidth) {
        notFillWidth = this.getAllColsWidth() <= this.tableNoFrameWidth;
      }
      if (this.autoFillHeight && !notFillHeight) {
        notFillHeight = this.getAllRowsHeight() <= this.tableNoFrameHeight;
      }
      if (this.widthMode === 'adaptive' || notFillWidth || this.heightMode === 'adaptive' || notFillHeight) {
        this.scenegraph.updateChartSizeForResizeColWidth(-1); // 如果收起展开有性能问题 可以排查下这个防范
      }
    }
  }

  _hasHierarchyTreeHeader() {
    return (this.options.columns ?? this.options.header)?.some((column, i) => column.tree);
  }

  getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo {
    const result: DropDownMenuEventInfo = {
      field: this.getHeaderField(col, row),
      value: this.getCellValue(col, row),
      cellLocation: this.getCellLocation(col, row),
      event: undefined
    };
    return result;
  }
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
  /**
   * 更新排序状态
   * @param sortState 要设置的排序状态
   * @param executeSort 是否执行内部排序逻辑，设置false将只更新图标状态
   */
  updateSortState(sortState: SortState[] | SortState | null, executeSort: boolean = true) {
    if (!sortState) {
      // 解除排序状态
      if (this.internalProps.sortState) {
        if (Array.isArray(this.internalProps.sortState)) {
          for (let i = 0; i < (<SortState[]>this.internalProps.sortState).length; i++) {
            sortState = this.internalProps.sortState?.[i];
            sortState && (sortState.order = 'normal');
          }
        } else {
          (<SortState>this.internalProps.sortState).order = 'normal';
          sortState = this.internalProps.sortState;
        }
      }
    } else {
      this.internalProps.sortState = sortState;
      // 这里的sortState需要有field属性
      // this.stateManager.setSortState(sortState as SortState);
    }

    sortState = Array.isArray(sortState) ? sortState : [sortState];

    if (sortState.some((item: any) => item.field) && executeSort) {
      if (this.internalProps.layoutMap.headerObjects.some(item => item.define.sort !== false)) {
        this.dataSource.sort(
          sortState.map((item: any) => {
            const sortFunc = this._getSortFuncFromHeaderOption(this.internalProps.columns, item.field);
            const hd = this.internalProps.layoutMap.headerObjects.find((col: any) => col && col.field === item.field);
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
    if (sortState.length) {
      this.stateManager.updateSortState(sortState);
    }
  }
  updateFilterRules(
    filterRules: FilterRules,
    options: {
      clearRowHeightCache?: boolean;
      onFilterRecordsEnd?: (records: any[]) => any[];
    } = { clearRowHeightCache: true }
  ) {
    this.scenegraph.clearCells();
    if (this.sortState) {
      this.dataSource.updateFilterRulesForSorted(filterRules);
      sortRecords(this);
    } else {
      this.dataSource.updateFilterRules(filterRules, options?.onFilterRecordsEnd);
    }
    this.refreshRowColCount();
    this.stateManager.initCheckedState(this.records);
    this.scenegraph.createSceneGraph(!!!options?.clearRowHeightCache);
    this.internalProps.emptyTip?.resetVisible();
    this.resize();
  }
  /** 获取过滤后的数据 */
  getFilteredRecords() {
    return this.dataSource.records;
  }
  /** 获取某个字段下checkbox 全部数据的选中状态 顺序对应原始传入数据records 不是对应表格展示row的状态值 */
  getCheckboxState(field?: string | number) {
    if (this.stateManager.checkedState.size < this.rowCount - this.columnHeaderLevelCount) {
      this.stateManager.initLeftRecordsCheckState(this.records);
    }
    if (isValid(field)) {
      // let stateArr = this.stateManager.checkedState.values() as any;
      // map按照key(dataIndex)的升序输出value
      // const keys = Array.from(this.stateManager.checkedState.keys()).sort(
      //   (a: string, b: string) => Number(a) - Number(b)
      // );
      const keys = Array.from(this.stateManager.checkedState.keys()).sort((a: string, b: string) => {
        // number or number[]
        const aArr = (a as string).split(',');
        const bArr = (b as string).split(',');
        const maxLength = Math.max(aArr.length, bArr.length);

        // judge from first to last
        for (let i = 0; i < maxLength; i++) {
          const a = Number(aArr[i]) ?? 0;
          const b = Number(bArr[i]) ?? 0;
          if (a !== b) {
            return a - b;
          }
        }
        return 0;
      });
      let stateArr = keys.map(key => this.stateManager.checkedState.get(key));

      if (this.options.groupBy) {
        stateArr = getGroupCheckboxState(this) as any;
      }
      return Array.from(stateArr, (state: any) => {
        return state && state[field];
      });
    }
    return [...this.stateManager.checkedState.values()];
  }
  /** 获取某个单元格checkbox的状态 */
  getCellCheckboxState(col: number, row: number) {
    const define = this.getBodyColumnDefine(col, row) as ColumnDefine;
    const field = define?.field;
    const cellType = this.getCellType(col, row);
    if (isValid(field) && (cellType === 'checkbox' || cellType === 'switch')) {
      const dataIndex = this.dataSource.getIndexKey(this.getRecordShowIndexByCell(col, row)).toString();
      return this.stateManager.checkedState.get(dataIndex)?.[field as string | number];
    }
    return undefined;
  }
  /** 获取某个字段下checkbox 全部数据的选中状态 顺序对应原始传入数据records 不是对应表格展示row的状态值 */
  getRadioState(field?: string | number) {
    if (isValid(field)) {
      return this.stateManager.radioState[field];
    }
    return this.stateManager.radioState;
  }
  /** 获取某个单元格checkbox的状态 */
  getCellRadioState(col: number, row: number): boolean | number {
    return getCellRadioState(col, row, this);
  }
  setCellCheckboxState(col: number, row: number, checked: boolean | 'indeterminate') {
    setCellCheckboxState(col, row, checked, this);
  }
  setCellRadioState(col: number, row: number, index?: number) {
    setCellRadioState(col, row, index, this);
  }

  // switch 开关类型，状态管理同checkbox
  getSwitchState(field?: string | number) {
    return this.getCheckboxState(field);
  }
  getCellSwitchState(col: number, row: number) {
    return this.getCellCheckboxState(col, row);
  }
  setCellSwitchState(col: number, row: number, checked: boolean | 'indeterminate') {
    this.setCellCheckboxState(col, row, checked);
  }

  /**
   * 设置表格数据 及排序状态
   * @param records
   * @param option 附近参数，其中的sortState为排序状态，如果设置null 将清除目前的排序状态
   */
  setRecords(records: Array<any>, option?: { sortState?: SortState | SortState[] | null }): void {
    clearChartRenderQueue();
    // 释放事件 及 对象
    this.internalProps.dataSource?.release();
    // 过滤掉dataSource的引用
    this.internalProps.releaseList = this.internalProps.releaseList?.filter((item: any) => !item.dataSourceObj);
    this.internalProps.dataSource = null;
    let sort: SortState | SortState[];
    if (Array.isArray(option) || (option as any)?.order) {
      //兼容之前第二个参数为sort的情况
      sort = <any>option;
    } else if (option) {
      sort = option.sortState;
    } else if (option === null) {
      //兼容之前第二个参数为null来清除sort排序状态的逻辑
      sort = null;
    }
    const time = typeof window !== 'undefined' ? window.performance.now() : 0;
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    // 清空单元格内容
    this.scenegraph.clearCells();

    //重复逻辑抽取updateWidthHeight
    if (sort !== undefined) {
      if (sort === null || (!Array.isArray(sort) && isValid(sort.field)) || Array.isArray(sort)) {
        this.internalProps.sortState = this.internalProps.multipleSort ? (Array.isArray(sort) ? sort : [sort]) : sort;
        this.stateManager.setSortState((this as any).sortState as SortState);
      }
    }
    if (records) {
      _setRecords(this, records);
      if ((this as any).sortState) {
        const sortState = Array.isArray((this as any).sortState) ? (this as any).sortState : [(this as any).sortState];

        // 根据sort规则进行排序
        if (sortState.some((item: any) => item.order && item.field && item.order !== 'normal')) {
          // hd?.define?.sort && //如果这里也判断 那想要利用sortState来排序 但不显示排序图标就实现不了
          if (this.internalProps.layoutMap.headerObjectsIncludeHided.some(item => item.define.sort !== false)) {
            this.dataSource.sort(
              sortState.map((item: any) => {
                const sortFunc = this._getSortFuncFromHeaderOption(undefined, item.field);
                // 如果sort传入的信息不能生成正确的sortFunc，直接更新表格，避免首次加载无法正常显示内容
                const hd = this.internalProps.layoutMap.headerObjectsIncludeHided.find(
                  (col: any) => col && col.field === item.field
                );
                return {
                  field: item.field,
                  order: item.order || 'asc',
                  orderFn: sortFunc ?? defaultOrderFn
                };
              })
            );
          }
        }
      }
      this.refreshRowColCount();
    } else {
      _setRecords(this, records);
    }

    this.stateManager.initCheckedState(records);
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.clearCellStyleCache();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);

    this._updateSize();
    if (this.internalProps.title && !this.internalProps.title.isReleased) {
      this.internalProps.title.resize();
    }
    this.scenegraph.resize();

    if (this.options.emptyTip) {
      if (this.internalProps.emptyTip) {
        this.internalProps.emptyTip?.resetVisible();
      } else {
        const EmptyTip = Factory.getComponent('emptyTip') as IEmptyTipComponent;
        this.internalProps.emptyTip = new EmptyTip(this.options.emptyTip, this);
        this.internalProps.emptyTip?.resetVisible();
      }
    }

    this.render();
    if (isValid(oldHoverState.col) && isValid(oldHoverState.row) && oldHoverState.col >= 0 && oldHoverState.row >= 0) {
      setTimeout(() => {
        this.internalProps?.tooltipHandler.showTooltip(oldHoverState.col, oldHoverState.row);
      }, 0);
    }
    console.log('setRecords cost time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time);
  }
  /**
   * 基本表格树形展示场景下，如果需要动态插入子节点的数据可以配合使用该接口，其他情况不适用
   * @param records 设置到单元格其子节点的数据
   * @param col 需要设置子节点的单元格地址
   * @param row  需要设置子节点的单元格地址
   * @param recalculateColWidths  是否重新计算列宽 默认为true.（设置width:auto或者 autoWidth 情况下才有必要考虑该参数）
   */
  setRecordChildren(records: any[], col: number, row: number, recalculateColWidths: boolean = true) {
    const record = this.getCellOriginRecord(col, row);
    record.children = records;
    const index = this.getRecordShowIndexByCell(col, row);
    this.dataSource.setRecord(record, index);
    this._refreshHierarchyState(col, row, recalculateColWidths);
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
  /** 结束编辑 */
  completeEditCell() {
    this.editorManager.completeEdit();
  }
  /** 获取单元格对应的编辑器 */
  getEditor(col: number, row: number) {
    const lastSelectedCellEditor = this.editorManager.cacheLastSelectedCellEditor[`${col}-${row}`];
    if (lastSelectedCellEditor) {
      return lastSelectedCellEditor;
    }
    Object.values(this.editorManager.cacheLastSelectedCellEditor).forEach((editor: IEditor) => editor?.onEnd?.());
    this.editorManager.cacheLastSelectedCellEditor = {};
    const define = this.getBodyColumnDefine(col, row);
    let editor = this.isHeader(col, row)
      ? (define as ColumnDefine)?.headerEditor ?? this.options.headerEditor
      : (define as ColumnDefine)?.editor ?? this.options.editor;

    if (typeof editor === 'function') {
      const arg = {
        col,
        row,
        dataValue: this.getCellOriginValue(col, row),
        value: this.getCellValue(col, row) || '',
        table: this
      };
      editor = (editor as Function)(arg);
    }
    if (typeof editor === 'string') {
      editor = editors.get(editor);
    }
    if (editor) {
      this.editorManager.cacheLastSelectedCellEditor[`${col}-${row}`] = editor as IEditor;
    }
    return editor as IEditor;
  }
  /** 检查单元格是否定义过编辑器 不管编辑器是否有效 只要有定义就返回true */
  isHasEditorDefine(col: number, row: number) {
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
      editorDefine = (editorDefine as Function)(arg);
    }
    return isValid(editorDefine);
  }

  /**
   * 更改单元格数据 会触发change_cell_value事件
   * @param col
   * @param row
   * @param value 更改后的值
   * @param workOnEditableCell 限制只能更改配置了编辑器的单元格值。快捷键paste这里配置的true，限制只能修改可编辑单元格值
   * @param triggerEvent 是否在值发生改变的时候触发change_cell_value事件
   */
  changeCellValue(
    col: number,
    row: number,
    value: string | number | null,
    workOnEditableCell = false,
    triggerEvent = true,
    silentChangeCellValuesEvent?: boolean
  ) {
    return listTableChangeCellValue(
      col,
      row,
      value,
      workOnEditableCell,
      triggerEvent,
      this,
      silentChangeCellValuesEvent
    );
  }
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   * @param workOnEditableCell 是否仅更改可编辑单元格
   * @param triggerEvent 是否在值发生改变的时候触发change_cell_value事件
   */
  changeCellValues(
    startCol: number,
    startRow: number,
    values: (string | number)[][],
    workOnEditableCell = false,
    triggerEvent = true,
    silentChangeCellValuesEvent?: boolean
  ) {
    return listTableChangeCellValues(
      startCol,
      startRow,
      values,
      workOnEditableCell,
      triggerEvent,
      this,
      silentChangeCellValuesEvent
    );
  }

  changeCellValuesByIds(
    ranges: CellRange[],
    value: string | number | null,
    workOnEditableCell = false,
    triggerEvent = true,
    silentChangeCellValuesEvent?: boolean
  ) {
    // @ts-ignore
    return listTableChangeCellValuesByIds(
      ranges,
      value,
      workOnEditableCell,
      triggerEvent,
      this,
      silentChangeCellValuesEvent
    );
  }

  changeSourceCellValue(recordIndex: number | number[], field: FieldDef, value: string | number | null) {
    const tableIndex = this.getTableIndexByRecordIndex(recordIndex);
    const cellAddr = this.getCellAddrByFieldRecord(field, recordIndex);
    if (tableIndex < 0 || cellAddr.col < 0 || cellAddr.row < 0) {
      return;
    }
    this.dataSource.changeFieldValue(value, tableIndex, field, cellAddr.col, cellAddr.row, this);
    const beforeChangeValue = this.getCellRawValue(cellAddr.col, cellAddr.row);
    const oldValue = this.getCellOriginValue(cellAddr.col, cellAddr.row);
    const changedValue = this.getCellOriginValue(cellAddr.col, cellAddr.row);
    if (oldValue !== changedValue) {
      const changeValue = {
        col: cellAddr.col,
        row: cellAddr.row,
        recordIndex,
        field,
        rawValue: beforeChangeValue,
        currentValue: oldValue,
        changedValue
      };
      this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, changeValue);
      this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUES, { values: [changeValue] });
    }
  }

  changeCellValueByRecord(
    recordIndex: number | number[],
    field: FieldDef,
    value: string | number | null,
    options?: {
      triggerEvent?: boolean;
      silentChangeCellValuesEvent?: boolean;
      autoRefresh?: boolean;
    }
  ) {
    const triggerEvent = options?.triggerEvent ?? true;
    const silentChangeCellValuesEvent = options?.silentChangeCellValuesEvent;
    const autoRefresh = options?.autoRefresh ?? true;

    const records = (this.dataSource as DataSource).dataSourceObj?.records as any[] | undefined;
    let record: any;
    let oldValue: any;
    if (Array.isArray(records) && (typeof field === 'string' || typeof field === 'number')) {
      record = Array.isArray(recordIndex) ? getValueFromDeepArray(records, recordIndex) : records[recordIndex];
      oldValue = record?.[field as any];
    }

    this.dataSource.changeFieldValueByRecordIndex(value, recordIndex, field, this);

    if (!triggerEvent) {
      return;
    }

    const changedValue =
      record && (typeof field === 'string' || typeof field === 'number') ? record?.[field as any] : (value as any);

    if (oldValue !== changedValue) {
      const cellAddr = this.getCellAddrByFieldRecord(field, recordIndex);
      const changeValue = {
        col: cellAddr?.col ?? -1,
        row: cellAddr?.row ?? -1,
        recordIndex,
        field,
        rawValue: oldValue,
        currentValue: oldValue,
        changedValue
      };
      this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, changeValue);
      if (!silentChangeCellValuesEvent) {
        this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUES, { values: [changeValue] });
      }
    }

    if (autoRefresh) {
      this.refreshAfterSourceChange();
    }
  }

  changeCellValueBySource(
    recordIndex: number | number[],
    field: FieldDef,
    value: string | number | null,
    triggerEvent = true,
    silentChangeCellValuesEvent?: boolean
  ) {
    return this.changeCellValueByRecord(recordIndex, field, value, {
      triggerEvent,
      silentChangeCellValuesEvent,
      autoRefresh: true
    });
  }

  changeCellValuesByRecords(
    changeValues: {
      recordIndex: number | number[];
      field: FieldDef;
      value: string | number | null;
    }[],
    options?: {
      triggerEvent?: boolean;
      silentChangeCellValuesEvent?: boolean;
      autoRefresh?: boolean;
    }
  ) {
    const triggerEvent = options?.triggerEvent ?? true;
    const silentChangeCellValuesEvent = options?.silentChangeCellValuesEvent;
    const autoRefresh = options?.autoRefresh ?? true;

    const resultChangeValues: {
      col: number;
      row: number;
      recordIndex?: number | number[];
      field?: any;
      rawValue: string | number;
      currentValue: string | number;
      changedValue: string | number;
    }[] = [];

    for (let i = 0; i < changeValues.length; i++) {
      const { recordIndex, field, value } = changeValues[i];

      const records = (this.dataSource as DataSource).dataSourceObj?.records as any[] | undefined;
      let record: any;
      let oldValue: any;
      if (Array.isArray(records) && (typeof field === 'string' || typeof field === 'number')) {
        record = Array.isArray(recordIndex) ? getValueFromDeepArray(records, recordIndex) : records[recordIndex];
        oldValue = record?.[field as any];
      }

      this.dataSource.changeFieldValueByRecordIndex(value, recordIndex, field, this);

      if (triggerEvent) {
        const changedValue =
          record && (typeof field === 'string' || typeof field === 'number') ? record?.[field as any] : (value as any);
        if (oldValue !== changedValue) {
          const changeValue = {
            col: (this.getCellAddrByFieldRecord(field, recordIndex)?.col ?? -1) as number,
            row: (this.getCellAddrByFieldRecord(field, recordIndex)?.row ?? -1) as number,
            recordIndex,
            field,
            rawValue: oldValue,
            currentValue: oldValue,
            changedValue
          };
          this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, changeValue);
          resultChangeValues.push(changeValue);
        }
      }
    }

    if (!silentChangeCellValuesEvent && resultChangeValues.length && triggerEvent) {
      this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUES, { values: resultChangeValues });
    }

    if (autoRefresh) {
      this.refreshAfterSourceChange();
    }
  }

  changeCellValuesBySource(
    changeValues: {
      recordIndex: number | number[];
      field: FieldDef;
      value: string | number | null;
    }[],
    triggerEvent = true,
    silentChangeCellValuesEvent?: boolean
  ) {
    return this.changeCellValuesByRecords(changeValues, {
      triggerEvent,
      silentChangeCellValuesEvent,
      autoRefresh: true
    });
  }

  refreshAfterSourceChange(options?: {
    reapplyFilter?: boolean;
    reapplySort?: boolean;
    clearRowHeightCache?: boolean;
  }) {
    const reapplyFilter = options?.reapplyFilter ?? true;
    const reapplySort = options?.reapplySort ?? true;
    const clearRowHeightCache = options?.clearRowHeightCache ?? true;

    this.scenegraph.clearCells();

    if (this.sortState && reapplySort) {
      (this.dataSource as any).clearSortedIndexMap?.();
      (this.dataSource as any).sortedIndexMap?.clear?.();
    }

    if (reapplyFilter) {
      if (this.sortState && reapplySort) {
        this.dataSource.updateFilterRulesForSorted(this.dataSource.dataConfig?.filterRules);
        sortRecords(this);
      } else {
        this.dataSource.updateFilterRules(this.dataSource.dataConfig?.filterRules);
      }
    } else if (this.sortState && reapplySort) {
      sortRecords(this);
    }

    const traverseColumns = (columns: ColumnsDefine) => {
      for (let i = 0; i < (columns?.length ?? 0); i++) {
        const column: any = columns[i];
        const aggregators = column?.vtable_aggregator;
        if (aggregators) {
          if (Array.isArray(aggregators)) {
            for (let j = 0; j < aggregators.length; j++) {
              aggregators[j]?.recalculate?.();
            }
          } else {
            aggregators?.recalculate?.();
          }
        }
        if (column?.columns) {
          traverseColumns(column.columns);
        }
      }
    };
    traverseColumns(this.internalProps.columns);

    this.refreshRowColCount();
    this.internalProps.layoutMap.clearCellRangeMap();
    this.internalProps.useOneRowHeightFillAll = false;
    this.stateManager.initCheckedState(this.records);
    this.scenegraph.createSceneGraph(!clearRowHeightCache);
    this.internalProps.emptyTip?.resetVisible();
    this.resize();
  }
  /**
   * 添加数据 单条数据
   * @param record 数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecord(record: any, recordIndex?: number | number[], triggerEvent = true) {
    const success = listTableAddRecord(record, recordIndex, this);
    adjustHeightResizedRowMapWithAddRecordIndex(this as ListTable, recordIndex as number, [record]);
    this.internalProps.emptyTip?.resetVisible();
    // 只在成功添加时触发事件
    if (triggerEvent && success) {
      this.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, {
        records: [record],
        recordIndex,
        recordCount: 1
      });
    }
  }

  /**
   * 添加数据 支持多条数据
   * @param records 多条数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecords(records: any[], recordIndex?: number | number[], triggerEvent = true) {
    const success = listTableAddRecords(records, recordIndex, this);
    //_heightResizedRowMap修正，里面的行号需要修正，保证添加数据后 其他行号做对应调整
    if (typeof recordIndex === 'number') {
      adjustHeightResizedRowMapWithAddRecordIndex(this as ListTable, recordIndex as number, records);
    }
    this.internalProps.emptyTip?.resetVisible();

    // 只在成功添加时触发事件
    if (triggerEvent && success) {
      this.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, {
        records,
        recordIndex,
        recordCount: records.length
      });
    }
  }

  /**
   * 删除数据 支持多条数据
   * @param recordIndexs 要删除数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
   */
  deleteRecords(recordIndexs: number[] | number[][], triggerEvent = true) {
    const deletedRecords: any[] = [];
    // 收集被删除的记录
    if (recordIndexs?.length > 0) {
      recordIndexs.forEach(index => {
        let record = null;
        if (typeof index === 'number') {
          record = this.dataSource.get(index);
        } else {
          // 目前无法正确处理嵌套情况
          record = [];
        }

        deletedRecords.push(record);
      });
    }

    listTableDeleteRecords(recordIndexs, this);
    adjustHeightResizedRowMapWithDeleteRecordIndex(this as ListTable, recordIndexs as number[]);
    this.internalProps.emptyTip?.resetVisible();
    const rowIndexs = [];
    for (let i = 0; i < recordIndexs.length; i++) {
      rowIndexs.push(this.getBodyRowIndexByRecordIndex(recordIndexs[i]) + this.columnHeaderLevelCount);
    }
    // 触发删除数据记录事件 - 假设操作成功
    if (triggerEvent) {
      this.fireListeners(TABLE_EVENT_TYPE.DELETE_RECORD, {
        recordIndexs,
        records: deletedRecords,
        rowIndexs,
        deletedCount: Array.isArray(recordIndexs[0])
          ? (recordIndexs as number[][]).length
          : (recordIndexs as number[]).length
      });
    }
  }

  /**
   * 修改数据 支持多条数据
   * @param records 修改数据条目
   * @param recordIndexs 对应修改数据的索引
   * 基本表格中显示在body中的索引，即要修改的是body部分的第几行数据；
   * 如果是树形结构的话 recordIndexs 为数组，数组中每个元素为data的原始数据索引；
   */
  updateRecords(records: any[], recordIndexs: (number | number[])[], triggerEvent = true) {
    listTableUpdateRecords(records, recordIndexs, this);

    // 触发更新数据记录事件 - 假设操作成功
    if (triggerEvent) {
      this.fireListeners(TABLE_EVENT_TYPE.UPDATE_RECORD, {
        records,
        recordIndexs,
        updateCount: records.length
      });
    }
  }

  _hasCustomRenderOrLayout() {
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
  /**
   * 根据字段获取聚合值
   * @param field 字段名
   * 返回数组，包括列号和每一列的聚合值数组
   */
  getAggregateValuesByField(field: string | number): {
    col: number;
    aggregateValue: { aggregationType: AggregationType; value: number | string }[];
  }[] {
    const columns = this.internalProps.layoutMap.getColumnByField(field);
    const results: {
      col: number;
      aggregateValue: { aggregationType: AggregationType; value: number | string }[];
    }[] = [];
    for (let i = 0; i < columns.length; i++) {
      const aggregator = columns[i].columnDefine.aggregator;
      delete columns[i].columnDefine;
      if (aggregator) {
        const columnAggregateValue: {
          col: number;
          aggregateValue: { aggregationType: AggregationType; value: number | string }[];
        } = {
          col: columns[i].col,
          aggregateValue: null
        };
        columnAggregateValue.aggregateValue = [];
        if (Array.isArray(aggregator)) {
          for (let j = 0; j < aggregator.length; j++) {
            columnAggregateValue.aggregateValue.push({
              aggregationType: aggregator[j].type as AggregationType,
              value: aggregator[j].value()
            });
          }
        } else {
          columnAggregateValue.aggregateValue.push({
            aggregationType: aggregator.type as AggregationType,
            value: aggregator.value()
          });
        }

        results.push(columnAggregateValue);
      }
    }
    return results;
  }
  /** 是否为聚合值单元格 */
  isAggregation(col: number, row: number): boolean {
    return this.internalProps.layoutMap.isAggregation(col, row);
  }

  getGroupTitleLevel(col: number, row: number): number | undefined {
    if (!(this.internalProps as ListTableProtected).groupBy) {
      return undefined;
    }
    const indexArr = this.dataSource.getIndexKey(this.getRecordShowIndexByCell(col, row));
    const groupLength = (this.dataSource as CachedDataSource).getGroupLength() ?? 0;
    let indexArrLngth = isArray(indexArr) ? indexArr.length - 1 : 0;
    if (groupLength > 0 && indexArrLngth === groupLength) {
      indexArrLngth = undefined;
    }
    return indexArrLngth;
  }
  /**
   * 根据数据的索引获取应该显示在body的第几行
   * @param  {number} index The record index.
   */
  getBodyRowIndexByRecordIndex(index: number | number[]): number {
    if (Array.isArray(index) && index.length === 1) {
      index = index[0];
    }
    return this.dataSource.getTableIndex(index);
  }

  release() {
    this.editorManager?.release();
    super.release();
  }

  /**
   * 展开所有树形节点
   */
  expandAllTreeNode(): void {
    if (!this._hasHierarchyTreeHeader()) {
      return;
    }

    let stateChanged = false;

    // 展开所有数据行节点
    if (this.dataSource && typeof (this.dataSource as any).expandAllNodes === 'function') {
      (this.dataSource as any).expandAllNodes();
      stateChanged = true;
    }

    // 刷新视图
    if (stateChanged) {
      // 使用轻量级的更新管道，而非重量级的 `updateColumns`。
      // 这个新方法会处理表头刷新、场景创建和渲染。
      this._recreateSceneForStateChange();

      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: -1, // 表示非特定单元格操作
        row: -1,
        hierarchyState: HierarchyState.expand,
        originData: { children: this.records }
      });
    }
  }

  /**
   * 折叠所有树形节点
   */
  collapseAllTreeNode(): void {
    if (!this._hasHierarchyTreeHeader()) {
      return;
    }

    let stateChanged = false;

    // 折叠所有数据行节点
    if (this.dataSource && typeof (this.dataSource as any).collapseAllNodes === 'function') {
      (this.dataSource as any).collapseAllNodes();
      stateChanged = true;
    }

    // 刷新视图
    if (stateChanged) {
      // 使用轻量级的更新管道，而非重量级的 `updateColumns`。
      // 这个新方法会处理表头刷新、场景创建和渲染。
      this._recreateSceneForStateChange();

      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: -1,
        row: -1,
        hierarchyState: HierarchyState.collapse,
        originData: { children: this.records }
      });
    }
  }
  /** 获取某个单元格checkbox的状态 */

  /**
   * 合并单元格 对外接口 。会自动刷新渲染节点
   * 注意：如果之前options有customMergeCell的函数配置，将失效重置为空数组
   */
  mergeCells(startCol: number, startRow: number, endCol: number, endRow: number) {
    // 先检查一遍这个区域是否有合并情况 有的话 不能再次合并
    for (let i = startCol; i <= endCol; i++) {
      for (let j = startRow; j <= endRow; j++) {
        const cellRange = this.getCellRange(i, j);
        if (cellRange.start.col !== cellRange.end.col || cellRange.start.row !== cellRange.end.row) {
          return;
        }
      }
    }
    if (!this.options.customMergeCell) {
      this.options.customMergeCell = [];
    } else if (typeof this.options.customMergeCell === 'function') {
      this.options.customMergeCell = [];
    }
    this.options.customMergeCell.push({
      text: this.getCellValue(startCol, startRow),
      range: {
        start: {
          col: startCol,
          row: startRow
        },
        end: {
          col: endCol,
          row: endRow
        }
      }
    });
    this.internalProps.customMergeCell = getCustomMergeCellFunc(this.options.customMergeCell);
    for (let i = startCol; i <= endCol; i++) {
      for (let j = startRow; j <= endRow; j++) {
        this.scenegraph.updateCellContent(i, j);
      }
    }
    this.scenegraph.updateNextFrame();
  }
  /** 取消合并单元格 对外接口 。会自动刷新渲染节点
   * 注意：如果之前options有customMergeCell的函数配置，将失效重置为空数组
   */
  unmergeCells(startCol: number, startRow: number, endCol: number, endRow: number) {
    if (!this.options.customMergeCell) {
      this.options.customMergeCell = [];
    } else if (typeof this.options.customMergeCell === 'function') {
      this.options.customMergeCell = [];
    }
    this.options.customMergeCell = this.options.customMergeCell.filter(item => {
      const { start, end } = item.range;
      return !(start.col === startCol && start.row === startRow && end.col === endCol && end.row === endRow);
    });
    this.internalProps.customMergeCell = getCustomMergeCellFunc(this.options.customMergeCell);
    for (let i = startCol; i <= endCol; i++) {
      for (let j = startRow; j <= endRow; j++) {
        this.scenegraph.updateCellContent(i, j);
      }
    }
    this.scenegraph.updateNextFrame();
  }
}
