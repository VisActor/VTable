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
import { isValid } from '@visactor/vutils';
import { _setDataSource, _setRecords, sortRecords } from './core/tableHelper';
import { BaseTable } from './core';
import type { BaseTableAPI, ListTableProtected } from './ts-types/base-table';
import { TABLE_EVENT_TYPE } from './core/TABLE_EVENT_TYPE';
import { Title } from './components/title/title';
import { cloneDeep } from '@visactor/vutils';
import { Env } from './tools/env';
import { editor } from './register';
import * as editors from './edit/editors';
import { EditManeger } from './edit/edit-manager';
import { computeColWidth } from './scenegraph/layout/compute-col-width';
import { computeRowHeight } from './scenegraph/layout/compute-row-height';
import { defaultOrderFn } from './tools/util';
import type { IEditor } from '@visactor/vtable-editors';
import type { ColumnData } from './ts-types/list-table/layout-map/api';

export class ListTable extends BaseTable implements ListTableAPI {
  declare internalProps: ListTableProtected;
  /**
   * 用户配置的options 只读 勿直接修改
   */
  declare options: ListTableConstructorOptions;
  showHeader = true;
  editorManager: EditManeger;
  // eslint-disable-next-line default-param-last
  constructor(options: ListTableConstructorOptions);
  constructor(container: HTMLElement, options: ListTableConstructorOptions);
  constructor(container?: HTMLElement | ListTableConstructorOptions, options?: ListTableConstructorOptions) {
    if (Env.mode === 'node') {
      options = container as ListTableConstructorOptions;
      container = null;
    } else if (!(container instanceof HTMLElement)) {
      options = container as ListTableConstructorOptions;
      if ((container as ListTableConstructorOptions).container) {
        container = (container as ListTableConstructorOptions).container;
      } else {
        container = null;
      }
    }
    super(container as HTMLElement, options);

    const internalProps = this.internalProps;
    internalProps.frozenColDragHeaderMode = options.frozenColDragHeaderMode;
    //分页配置
    this.pagination = options.pagination;
    internalProps.sortState = options.sortState;
    internalProps.dataConfig = {}; //cloneDeep(options.dataConfig ?? {});
    internalProps.columns = options.columns
      ? cloneDeep(options.columns)
      : options.header
      ? cloneDeep(options.header)
      : [];
    options.columns?.forEach((colDefine, index) => {
      //如果editor 是一个IEditor的实例  需要这样重新赋值 否则clone后变质了
      if (colDefine.editor) {
        internalProps.columns[index].editor = colDefine.editor;
      }
    });

    this.showHeader = options.showHeader ?? true;

    this.transpose = options.transpose ?? false;
    if (Env.mode !== 'node') {
      this.editorManager = new EditManeger(this);
    }
    this.refreshHeader();

    if (options.dataSource) {
      _setDataSource(this, options.dataSource);
    } else if (options.records) {
      this.setRecords(options.records as any, { sortState: internalProps.sortState });
    } else {
      this.setRecords([]);
    }
    if (options.title) {
      internalProps.title = new Title(options.title, this);
      this.scenegraph.resize();
    }
    //为了确保用户监听得到这个事件 这里做了异步 确保vtable实例已经初始化完成
    setTimeout(() => {
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
    return this.dataSource?.source;
  }

  get recordsCount() {
    return this.dataSource.source.length;
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
  updateColumns(columns: ColumnsDefine) {
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.internalProps.columns = cloneDeep(columns);
    columns.forEach((colDefine, index) => {
      if (colDefine.editor) {
        this.internalProps.columns[index].editor = colDefine.editor;
      }
    });
    this.options.columns = columns;
    this.refreshHeader();
    this.scenegraph.clearCells();
    this.headerStyleCache = new Map();
    this.bodyStyleCache = new Map();
    this.bodyBottomStyleCache = new Map();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    this.renderAsync();
    this.eventManager.updateEventBinder();
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
    this.options.header = header;
    this.refreshHeader();
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
    this.options.transpose = transpose;
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
  getCellValue(col: number, row: number): FieldData {
    if (col === -1 || row === -1) {
      return null;
    }
    const customMergeText = this.getCustomMergeValue(col, row);
    if (customMergeText) {
      return customMergeText;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
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
    const { field, fieldFormat } = table.internalProps.layoutMap.getBody(col, row);
    return table.getFieldData(fieldFormat || field, col, row);
  }
  /** 获取单元格展示数据的format前的值 */
  getCellOriginValue(col: number, row: number): FieldData {
    if (col === -1 || row === -1) {
      return null;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
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
    return this.dataSource.currentPagerIndexedData[recordShowIndex];
  }

  getTableIndexByRecordIndex(recordIndex: number | number[]) {
    if (this.transpose) {
      return this.dataSource.getTableIndex(recordIndex) + this.rowHeaderLevelCount;
    }
    return this.dataSource.getTableIndex(recordIndex) + this.columnHeaderLevelCount;
  }
  getTableIndexByField(field: FieldDef) {
    const colObj = this.internalProps.layoutMap.columnObjects.find((col: any) => col.field === field);
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
  getCellAddrByFieldRecord(field: FieldDef, recordIndex: number): CellAddress {
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
        if (cellDefine?.disableColumnResize) {
          return false;
        }
      }
    }
    return ifCan;
  }
  updateOption(options: ListTableConstructorOptions & { restoreHierarchyState?: boolean }) {
    const internalProps = this.internalProps;
    super.updateOption(options);
    internalProps.frozenColDragHeaderMode = options.frozenColDragHeaderMode;
    //分页配置
    this.pagination = options.pagination;
    internalProps.dataConfig = {}; // cloneDeep(options.dataConfig ?? {});
    //更新protectedSpace
    this.showHeader = options.showHeader ?? true;
    internalProps.columns = options.columns
      ? cloneDeep(options.columns)
      : options.header
      ? cloneDeep(options.header)
      : [];
    options.columns.forEach((colDefine, index) => {
      if (colDefine.editor) {
        internalProps.columns[index].editor = colDefine.editor;
      }
    });
    // 处理转置
    this.transpose = options.transpose ?? false;
    // 更新表头
    this.refreshHeader();

    // this.hasMedia = null; // 避免重复绑定
    // 清空目前数据
    if (internalProps.releaseList) {
      internalProps.releaseList.forEach(releaseObj => releaseObj?.release?.());
      internalProps.releaseList = null;
    }
    // // 恢复selection状态
    // internalProps.selection.range = range;
    // this._updateSize();
    // 传入新数据
    if (options.dataSource) {
      _setDataSource(this, options.dataSource);
    } else if (options.records) {
      this.setRecords(options.records as any, {
        restoreHierarchyState: options.restoreHierarchyState,
        sortState: options.sortState
      });
    } else {
      this._resetFrozenColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.render();
    }
    if (options.title) {
      internalProps.title = new Title(options.title, this);
      this.scenegraph.resize();
    }
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
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      this.dataSource.updatePagination(this.pagination);
      this.refreshRowColCount();
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
      for (let col = 0; col < layoutMap.columnWidths.length; col++) {
        const { width, minWidth, maxWidth } = layoutMap.columnWidths?.[col] ?? {};
        // width 为 "auto" 时先不存储ColWidth
        if (width && ((typeof width === 'string' && width !== 'auto') || (typeof width === 'number' && width > 0))) {
          table._setColWidth(col, width);
        }
        if (minWidth && ((typeof minWidth === 'number' && minWidth > 0) || typeof minWidth === 'string')) {
          table.setMinColWidth(col, minWidth);
        }
        if (maxWidth && ((typeof maxWidth === 'number' && maxWidth > 0) || typeof maxWidth === 'string')) {
          table.setMaxColWidth(col, maxWidth);
        }
      }
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
    layoutMap.recordsCount =
      (table.internalProps.dataSource?.length ?? 0) +
      layoutMap.hasAggregationOnTopCount +
      layoutMap.hasAggregationOnBottomCount;

    if (table.transpose) {
      table.rowCount = layoutMap.rowCount ?? 0;
      table.colCount = layoutMap.recordsCount * layoutMap.bodyRowSpanCount + layoutMap.headerLevelCount;
      table.frozenRowCount = 0;
      // table.frozenColCount = layoutMap.headerLevelCount; //这里不要这样写 这个setter会检查扁头宽度 可能将frozenColCount置为0
      this.internalProps.frozenColCount = layoutMap.headerLevelCount ?? 0;
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
      table.frozenRowCount = layoutMap.headerLevelCount;

      if (table.bottomFrozenRowCount !== (this.options.bottomFrozenRowCount ?? 0)) {
        table.bottomFrozenRowCount = this.options.bottomFrozenRowCount ?? 0;
      }
      if (table.rightFrozenColCount !== (this.options.rightFrozenColCount ?? 0)) {
        table.rightFrozenColCount = this.options.rightFrozenColCount ?? 0;
      }
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
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
    const index = table.getRecordShowIndexByCell(col, row);
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
  moveHeaderPosition(source: CellAddress, target: CellAddress) {
    // 调用布局类 布局数据结构调整为移动位置后的
    const moveContext = this.internalProps.layoutMap.moveHeaderPosition(source, target);
    if (moveContext) {
      if (moveContext.moveType === 'column') {
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        this.colWidthsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.moveSize);
        if (!this.transpose) {
          //下面代码取自refreshHeader列宽设置逻辑
          //设置列宽极限值 TODO 目前是有问题的 最大最小宽度限制 移动列位置后不正确
          this.colWidthsLimit = {}; //需要先清空
          for (let col = 0; col < this.internalProps.layoutMap.columnWidths.length; col++) {
            const { minWidth, maxWidth } = this.internalProps.layoutMap.columnWidths?.[col] ?? {};
            if (minWidth && ((typeof minWidth === 'number' && minWidth > 0) || typeof minWidth === 'string')) {
              this.setMinColWidth(col, minWidth);
            }
            if (maxWidth && ((typeof maxWidth === 'number' && maxWidth > 0) || typeof maxWidth === 'string')) {
              this.setMaxColWidth(col, maxWidth);
            }
          }
        }
        // 清空相关缓存
        const colStart = Math.min(moveContext.sourceIndex, moveContext.targetIndex);
        const colEnd = Math.max(moveContext.sourceIndex, moveContext.targetIndex);
        for (let col = colStart; col <= colEnd; col++) {
          this._clearColRangeWidthsMap(col);
        }
      } else {
        // 清空相关缓存
        const rowStart = Math.min(moveContext.sourceIndex, moveContext.targetIndex);
        const rowEnd = Math.max(moveContext.sourceIndex, moveContext.targetIndex);
        for (let row = rowStart; row <= rowEnd; row++) {
          this._clearRowRangeHeightsMap(row);
        }
      }
      return true;
    }
    return false;
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
    const define = this.getBodyColumnDefine(col, row);
    if (!define.tree) {
      return HierarchyState.none;
    }
    const index = this.getRecordShowIndexByCell(col, row);
    return this.dataSource.getHierarchyState(index);
  }
  /**
   * 表头切换层级状态
   * @param col
   * @param row
   */
  toggleHierarchyState(col: number, row: number) {
    const hierarchyState = this.getHierarchyState(col, row);
    if (hierarchyState === HierarchyState.expand) {
      this._refreshHierarchyState(col, row);
      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.collapse
      });
    } else if (hierarchyState === HierarchyState.collapse) {
      const record = this.getCellOriginRecord(col, row);
      if (Array.isArray(record.children)) {
        //children 是数组 表示已经有子树节点信息
        this._refreshHierarchyState(col, row);
      }
      this.fireListeners(TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.expand,
        originData: record
      });
    }
  }
  /** 刷新当前节点收起展开状态，如手动更改过 */
  _refreshHierarchyState(col: number, row: number) {
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
    const diffDataIndices = this.dataSource.toggleHierarchyState(index);
    const diffPositions = this.internalProps.layoutMap.toggleHierarchyState(diffDataIndices);
    //影响行数
    this.refreshRowColCount();

    this.clearCellStyleCache();
    this.internalProps.layoutMap.clearCellRangeMap();
    this.scenegraph.updateHierarchyIcon(col, row);
    this.scenegraph.updateRow(diffPositions.removeCellPositions, diffPositions.addCellPositions);
    if (checkHasChart) {
      // 检查更新节点状态后总宽高未撑满autoFill是否在起作用
      if (this.autoFillWidth && !notFillWidth) {
        notFillWidth = this.getAllColsWidth() <= this.tableNoFrameWidth;
      }
      if (this.autoFillHeight && !notFillHeight) {
        notFillHeight = this.getAllRowsHeight() <= this.tableNoFrameHeight;
      }
      if (this.widthMode === 'adaptive' || notFillWidth || this.heightMode === 'adaptive' || notFillHeight) {
        this.scenegraph.updateChartSize(0); // 如果收起展开有性能问题 可以排查下这个防范
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
  ): ((v1: any, v2: any, order: SortOrder) => 0 | 1 | -1) | undefined {
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
            const sortState: SortState = this.internalProps.sortState[i];
            sortState.order = 'normal';
          }
        } else {
          (<SortState>this.internalProps.sortState).order = 'normal';
        }
      }
    } else {
      this.internalProps.sortState = sortState;
      // 这里的sortState需要有field属性
      // this.stateManager.setSortState(sortState as SortState);
    }
    let order: any;
    let field: any;
    if (Array.isArray(this.internalProps.sortState)) {
      ({ order, field } = this.internalProps.sortState?.[0]);
    } else {
      ({ order, field } = this.internalProps.sortState as SortState);
    }
    if (field && executeSort) {
      const sortFunc = this._getSortFuncFromHeaderOption(this.internalProps.columns, field);
      const hd = this.internalProps.layoutMap.headerObjects.find((col: any) => col && col.field === field);

      if (hd.define.sort !== false) {
        this.dataSource.sort(hd.field, order, sortFunc);

        // clear cell range cache
        this.internalProps.layoutMap.clearCellRangeMap();
        this.scenegraph.sortCell();
      }
    }
    this.stateManager.updateSortState(sortState as SortState);
  }
  updateFilterRules(filterRules: FilterRules) {
    this.scenegraph.clearCells();
    this.internalProps.dataConfig.filterRules = filterRules;
    if (this.sortState) {
      this.dataSource.updateFilterRulesForSorted(filterRules);
      sortRecords(this);
    } else {
      this.dataSource.updateFilterRules(filterRules);
    }
    this.refreshRowColCount();
    this.scenegraph.createSceneGraph();
  }
  /** 获取某个字段下checkbox 全部数据的选中状态 顺序对应原始传入数据records 不是对应表格展示row的状态值 */
  getCheckboxState(field?: string | number) {
    if (this.stateManager.checkedState.length < this.rowCount - this.columnHeaderLevelCount) {
      this.stateManager.initLeftRecordsCheckState(this.records);
    }
    if (isValid(field)) {
      return this.stateManager.checkedState.map(state => {
        return state[field];
      });
    }
    return this.stateManager.checkedState;
  }
  /** 获取某个单元格checkbox的状态 */
  getCellCheckboxState(col: number, row: number) {
    const define = this.getBodyColumnDefine(col, row);
    const field = define?.field;
    const cellType = this.getCellType(col, row);
    if (isValid(field) && cellType === 'checkbox') {
      const dataIndex = this.dataSource.getIndexKey(this.getRecordShowIndexByCell(col, row));
      return this.stateManager.checkedState[dataIndex as number][field as string | number];
    }
    return undefined;
  }
  /**
   * 设置表格数据 及排序状态
   * @param records
   * @param sort
   */
  setRecords(
    records: Array<any>,
    option?: { restoreHierarchyState?: boolean; sortState?: SortState | SortState[] }
  ): void {
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
      this.internalProps.sortState = sort;
      this.stateManager.setSortState((this as any).sortState as SortState);
    }
    // restoreHierarchyState逻辑，保留树形结构展开收起的状态
    const currentPagerIndexedData = this.dataSource?._currentPagerIndexedData;
    const currentIndexedData = this.dataSource?.currentIndexedData;
    const treeDataHierarchyState = this.dataSource?.treeDataHierarchyState;
    const oldRecordLength = this.records?.length ?? 0;
    if (records) {
      _setRecords(this, records);
      if ((this as any).sortState) {
        let order: any;
        let field: any;
        if (Array.isArray((this as any).sortState)) {
          if ((this as any).sortState.length !== 0) {
            ({ order, field } = (this as any).sortState?.[0]);
          }
        } else {
          ({ order, field } = (this as any).sortState as SortState);
        }
        // 根据sort规则进行排序
        if (order && field && order !== 'normal') {
          const sortFunc = this._getSortFuncFromHeaderOption(undefined, field);
          // 如果sort传入的信息不能生成正确的sortFunc，直接更新表格，避免首次加载无法正常显示内容
          const hd = this.internalProps.layoutMap.headerObjects.find((col: any) => col && col.field === field);
          // hd?.define?.sort && //如果这里也判断 那想要利用sortState来排序 但不显示排序图标就实现不了
          if (hd.define.sort !== false) {
            this.dataSource.sort(hd.field, order, sortFunc ?? defaultOrderFn);
          }
        }
      }
      if (option?.restoreHierarchyState && oldRecordLength === this.records?.length) {
        // restoreHierarchyState逻辑，保留树形结构展开收起的状态
        this.dataSource._currentPagerIndexedData = currentPagerIndexedData;
        this.dataSource.currentIndexedData = currentIndexedData;
        this.dataSource.treeDataHierarchyState = treeDataHierarchyState;
      }
      this.refreshRowColCount();
    } else {
      _setRecords(this, records);
      if (option?.restoreHierarchyState && oldRecordLength === this.records?.length) {
        // restoreHierarchyState逻辑，保留树形结构展开收起的状态
        this.dataSource._currentPagerIndexedData = currentPagerIndexedData;
        this.dataSource.currentIndexedData = currentIndexedData;
        this.dataSource.treeDataHierarchyState = treeDataHierarchyState;
      }
    }

    this.stateManager.initCheckedState(records);
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.clearCellStyleCache();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    if (this.internalProps.title && !this.internalProps.title.isReleased) {
      this._updateSize();
      this.internalProps.title.resize();
      this.scenegraph.resize();
    }

    this.render();
    console.log('setRecords cost time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time);
  }
  /**
   * 基本表格树形展示场景下，如果需要动态插入子节点的数据可以配合使用该接口，其他情况不适用
   * @param col col position of the record, it is optional
   * @param row row position of the record, it is optional
   */
  setRecordChildren(records: any[], col: number, row: number) {
    const record = this.getCellOriginRecord(col, row);
    record.children = records;
    const index = this.getRecordShowIndexByCell(col, row);
    this.dataSource.setRecord(record, index);
    this._refreshHierarchyState(col, row);
  }
  /** 开启单元格编辑 */
  startEditCell(col?: number, row?: number) {
    if (isValid(col) && isValid(row)) {
      this.selectCell(col, row);
      this.editorManager.startEditCell(col, row);
    } else if (this.stateManager.select?.cellPos) {
      const { col, row } = this.stateManager.select.cellPos;
      if (isValid(col) && isValid(row)) {
        this.editorManager.startEditCell(col, row);
      }
    }
  }
  /** 结束编辑 */
  completeEditCell() {
    this.editorManager.completeEdit();
  }
  /** 获取单元格对应的编辑器 */
  getEditor(col: number, row: number) {
    const define = this.getBodyColumnDefine(col, row);
    let editorDefine = this.isHeader(col, row)
      ? define?.headerEditor ?? this.options.headerEditor
      : define?.editor ?? this.options.editor;

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
    if (typeof editorDefine === 'string') {
      return editors.get(editorDefine);
    }
    return editorDefine as IEditor;
  }
  /** 更改单元格数据 会触发change_cell_value事件*/
  changeCellValue(col: number, row: number, value: string | number | null) {
    const recordIndex = this.getRecordShowIndexByCell(col, row);
    const { field } = this.internalProps.layoutMap.getBody(col, row);
    const beforeChangeValue = this.getCellRawValue(col, row);
    if (this.isHeader(col, row)) {
      this.internalProps.layoutMap.updateColumnTitle(col, row, value as string);
    } else {
      this.dataSource.changeFieldValue(value, recordIndex, field, col, row, this);
    }
    //改变单元格的值后 聚合值做重新计算
    const aggregators = this.internalProps.layoutMap.getAggregators(col, row);
    if (aggregators) {
      if (Array.isArray(aggregators)) {
        for (let i = 0; i < aggregators?.length; i++) {
          aggregators[i].recalculate();
        }
      } else {
        aggregators.recalculate();
      }
      const aggregatorCells = this.internalProps.layoutMap.getCellAddressHasAggregator(col, row);
      for (let i = 0; i < aggregatorCells.length; i++) {
        const range = this.getCellRange(aggregatorCells[i].col, aggregatorCells[i].row);
        for (let sCol = range.start.col; sCol <= range.end.col; sCol++) {
          for (let sRow = range.start.row; sRow <= range.end.row; sRow++) {
            this.scenegraph.updateCellContent(sCol, sRow);
          }
        }
      }
    }

    // const cell_value = this.getCellValue(col, row);
    const range = this.getCellRange(col, row);
    for (let sCol = range.start.col; sCol <= range.end.col; sCol++) {
      for (let sRow = range.start.row; sRow <= range.end.row; sRow++) {
        this.scenegraph.updateCellContent(sCol, sRow);
      }
    }
    if (this.widthMode === 'adaptive' || (this.autoFillWidth && this.getAllColsWidth() <= this.tableNoFrameWidth)) {
      if (this.internalProps._widthResizedColMap.size === 0) {
        //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
        this.scenegraph.recalculateColWidths();
      }
    } else if (!this.internalProps._widthResizedColMap.has(col)) {
      const oldWidth = this.getColWidth(col);
      const newWidth = computeColWidth(col, 0, this.rowCount - 1, this, false);
      if (newWidth !== oldWidth) {
        this.scenegraph.updateColWidth(col, newWidth - oldWidth);
      }
    }
    if (this.heightMode === 'adaptive' || (this.autoFillHeight && this.getAllRowsHeight() <= this.tableNoFrameHeight)) {
      this.scenegraph.recalculateRowHeights();
    } else if (this.heightMode === 'autoHeight') {
      const oldHeight = this.getRowHeight(row);
      const newHeight = computeRowHeight(row, 0, this.colCount - 1, this);
      this.scenegraph.updateRowHeight(row, newHeight - oldHeight);
    }
    this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
      col,
      row,
      rawValue: beforeChangeValue,
      changedValue: this.getCellOriginValue(col, row)
    });
    this.scenegraph.updateNextFrame();
  }
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   */
  changeCellValues(startCol: number, startRow: number, values: (string | number)[][]) {
    let pasteColEnd = startCol;
    let pasteRowEnd = startRow;
    // const rowCount = values.length;
    for (let i = 0; i < values.length; i++) {
      if (startRow + i > this.rowCount - 1) {
        break;
      }
      pasteRowEnd = startRow + i;
      const rowValues = values[i];
      let thisRowPasteColEnd = startCol;
      for (let j = 0; j < rowValues.length; j++) {
        if (startCol + j > this.colCount - 1) {
          break;
        }
        thisRowPasteColEnd = startCol + j;
        const value = rowValues[j];
        const recordIndex = this.getRecordShowIndexByCell(startCol + j, startRow + i);
        const { field } = this.internalProps.layoutMap.getBody(startCol + j, startRow + i);
        const beforeChangeValue = this.getCellRawValue(startCol + j, startRow + i);
        if (this.isHeader(startCol + j, startRow + i)) {
          this.internalProps.layoutMap.updateColumnTitle(startCol + j, startRow + i, value as string);
        } else {
          this.dataSource.changeFieldValue(value, recordIndex, field, startCol + j, startRow + i, this);
        }
        this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
          col: startCol + j,
          row: startRow + i,
          rawValue: beforeChangeValue,
          changedValue: this.getCellOriginValue(startCol + j, startRow + i)
        });
      }
      pasteColEnd = Math.max(pasteColEnd, thisRowPasteColEnd);
    }
    // const cell_value = this.getCellValue(col, row);
    const startRange = this.getCellRange(startCol, startRow);
    const range = this.getCellRange(pasteColEnd, pasteRowEnd);
    for (let sCol = startRange.start.col; sCol <= range.end.col; sCol++) {
      for (let sRow = startRange.start.row; sRow <= range.end.row; sRow++) {
        this.scenegraph.updateCellContent(sCol, sRow);
      }
    }
    if (this.widthMode === 'adaptive' || (this.autoFillWidth && this.getAllColsWidth() <= this.tableNoFrameWidth)) {
      if (this.internalProps._widthResizedColMap.size === 0) {
        //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
        this.scenegraph.recalculateColWidths();
      }
    } else {
      for (let sCol = startCol; sCol <= range.end.col; sCol++) {
        if (!this.internalProps._widthResizedColMap.has(sCol)) {
          const oldWidth = this.getColWidth(sCol);
          const newWidth = computeColWidth(sCol, 0, this.rowCount - 1, this, false);
          if (newWidth !== oldWidth) {
            this.scenegraph.updateColWidth(sCol, newWidth - oldWidth);
          }
        }
      }
    }
    if (this.heightMode === 'adaptive' || (this.autoFillHeight && this.getAllRowsHeight() <= this.tableNoFrameHeight)) {
      this.scenegraph.recalculateRowHeights();
    } else if (this.heightMode === 'autoHeight') {
      const rows: number[] = [];
      const deltaYs: number[] = [];
      for (let sRow = startRow; sRow <= range.end.row; sRow++) {
        if (this.rowHeightsMap.get(sRow)) {
          // 已经计算过行高的才走更新逻辑
          const oldHeight = this.getRowHeight(sRow);
          const newHeight = computeRowHeight(sRow, 0, this.colCount - 1, this);
          rows.push(sRow);
          deltaYs.push(newHeight - oldHeight);
        }
      }
      this.scenegraph.updateRowsHeight(rows, deltaYs);
    }

    this.scenegraph.updateNextFrame();
  }
  /**
   * 添加数据 单条数据
   * @param record 数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecord(record: any, recordIndex?: number) {
    if (this.sortState) {
      this.dataSource.addRecordForSorted(record);
      sortRecords(this);
      this.refreshRowColCount();
      // 更新整个场景树
      this.scenegraph.clearCells();
      this.scenegraph.createSceneGraph();
    } else {
      if (recordIndex === undefined || recordIndex > this.dataSource.sourceLength) {
        recordIndex = this.dataSource.sourceLength;
      }
      const headerCount = this.transpose ? this.rowHeaderLevelCount : this.columnHeaderLevelCount;
      this.dataSource.addRecord(record, recordIndex);
      const oldRowCount = this.rowCount;
      this.refreshRowColCount();
      if (this.scenegraph.proxy.totalActualBodyRowCount === 0) {
        this.scenegraph.clearCells();
        this.scenegraph.createSceneGraph();
        return;
      }
      const newRowCount = this.transpose ? this.colCount : this.rowCount;
      if (this.pagination) {
        const { perPageCount, currentPage } = this.pagination;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        if (recordIndex < endIndex) {
          //插入当前页或者前面的数据才需要更新 如果是插入的是当前页后面的数据不需要更新场景树
          if (recordIndex < endIndex - perPageCount) {
            // 如果是当页之前的数据 则整个场景树都更新
            this.scenegraph.clearCells();
            this.scenegraph.createSceneGraph();
          } else {
            //如果是插入当前页数据
            const rowNum = recordIndex - (endIndex - perPageCount) + headerCount;
            if (oldRowCount - headerCount === this.pagination.perPageCount) {
              //如果当页数据是满的 则更新插入的部分行
              const updateRows = [];
              for (let row = rowNum; row < newRowCount; row++) {
                if (this.transpose) {
                  updateRows.push({ col: row, row: 0 });
                } else {
                  updateRows.push({ col: 0, row });
                }
              }
              this.transpose
                ? this.scenegraph.updateCol([], [], updateRows)
                : this.scenegraph.updateRow([], [], updateRows);
            } else {
              //如果当页数据不是满的 则插入新数据
              const addRows = [];
              for (let row = rowNum; row < Math.min(newRowCount, rowNum + 1); row++) {
                if (this.transpose) {
                  addRows.push({ col: row, row: 0 });
                } else {
                  addRows.push({ col: 0, row });
                }
              }
              this.transpose ? this.scenegraph.updateCol([], addRows, []) : this.scenegraph.updateRow([], addRows, []);
            }
          }
        }
      } else {
        const addRows = [];
        for (let row = recordIndex + headerCount; row < recordIndex + headerCount + 1; row++) {
          if (this.transpose) {
            addRows.push({ col: row, row: 0 });
          } else {
            addRows.push({ col: 0, row });
          }
        }
        this.transpose ? this.scenegraph.updateCol([], addRows, []) : this.scenegraph.updateRow([], addRows, []);
      }
    }
    // this.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
  }

  /**
   * 添加数据 支持多条数据
   * @param records 多条数据
   * @param recordIndex 向数据源中要插入的位置，从0开始。不设置recordIndex的话 默认追加到最后。
   * 如果设置了排序规则recordIndex无效，会自动适应排序逻辑确定插入顺序。
   * recordIndex 可以通过接口getRecordShowIndexByCell获取
   */
  addRecords(records: any[], recordIndex?: number) {
    if (this.sortState) {
      this.dataSource.addRecordsForSorted(records);
      sortRecords(this);
      this.refreshRowColCount();
      // 更新整个场景树
      this.scenegraph.clearCells();
      this.scenegraph.createSceneGraph();
    } else {
      if (recordIndex === undefined || recordIndex > this.dataSource.sourceLength) {
        recordIndex = this.dataSource.sourceLength;
      } else if (recordIndex < 0) {
        recordIndex = 0;
      }
      const headerCount = this.transpose ? this.rowHeaderLevelCount : this.columnHeaderLevelCount;
      this.dataSource.addRecords(records, recordIndex);
      const oldRowCount = this.transpose ? this.colCount : this.rowCount;
      this.refreshRowColCount();
      if (this.scenegraph.proxy.totalActualBodyRowCount === 0) {
        this.scenegraph.clearCells();
        this.scenegraph.createSceneGraph();
        return;
      }
      const newRowCount = this.transpose ? this.colCount : this.rowCount;
      if (this.pagination) {
        const { perPageCount, currentPage } = this.pagination;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        if (recordIndex < endIndex) {
          //插入当前页或者前面的数据才需要更新 如果是插入的是当前页后面的数据不需要更新场景树
          if (recordIndex < endIndex - perPageCount) {
            // 如果是当页之前的数据 则整个场景树都更新
            this.scenegraph.clearCells();
            this.scenegraph.createSceneGraph();
          } else {
            //如果是插入当前页数据

            const rowNum = recordIndex - (endIndex - perPageCount) + headerCount;
            if (oldRowCount - headerCount === this.pagination.perPageCount) {
              //如果当页数据是满的 则更新插入的部分行
              const updateRows = [];
              for (let row = rowNum; row < newRowCount; row++) {
                if (this.transpose) {
                  updateRows.push({ col: row, row: 0 });
                } else {
                  updateRows.push({ col: 0, row });
                }
              }
              this.transpose
                ? this.scenegraph.updateCol([], [], updateRows)
                : this.scenegraph.updateRow([], [], updateRows);
            } else {
              //如果当页数据不是满的 则插入新数据
              const addRows = [];
              for (
                let row = rowNum;
                row < Math.min(newRowCount, rowNum + (Array.isArray(records) ? records.length : 1));
                row++
              ) {
                if (this.transpose) {
                  addRows.push({ col: row, row: 0 });
                } else {
                  addRows.push({ col: 0, row });
                }
              }
              this.transpose ? this.scenegraph.updateCol([], addRows, []) : this.scenegraph.updateRow([], addRows, []);
            }
          }
        }
      } else {
        const addRows = [];
        for (
          let row = recordIndex + headerCount;
          row < recordIndex + headerCount + (Array.isArray(records) ? records.length : 1);
          row++
        ) {
          if (this.transpose) {
            addRows.push({ col: row, row: 0 });
          } else {
            addRows.push({ col: 0, row });
          }
        }
        this.transpose ? this.scenegraph.updateCol([], addRows, []) : this.scenegraph.updateRow([], addRows, []);
      }
    }
    // this.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
  }

  /**
   * 删除数据 支持多条数据
   * @param recordIndexs 要删除数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
   */
  deleteRecords(recordIndexs: number[]) {
    if (recordIndexs?.length > 0) {
      if (this.sortState) {
        this.dataSource.deleteRecordsForSorted(recordIndexs);
        sortRecords(this);
        this.refreshRowColCount();
        // 更新整个场景树
        this.scenegraph.clearCells();
        this.scenegraph.createSceneGraph();
      } else {
        const deletedRecordIndexs = this.dataSource.deleteRecords(recordIndexs);
        if (deletedRecordIndexs.length === 0) {
          return;
        }
        const oldRowCount = this.transpose ? this.colCount : this.rowCount;
        this.refreshRowColCount();
        const newRowCount = this.transpose ? this.colCount : this.rowCount;
        const recordIndexsMinToMax = deletedRecordIndexs.sort((a, b) => a - b);
        const minRecordIndex = recordIndexsMinToMax[0];
        if (this.pagination) {
          const { perPageCount, currentPage } = this.pagination;
          const startIndex = perPageCount * (currentPage || 0);
          const endIndex = startIndex + perPageCount;
          if (minRecordIndex < endIndex) {
            //删除当前页或者前面的数据才需要更新 如果是删除的是当前页后面的数据不需要更新场景树
            if (minRecordIndex < endIndex - perPageCount) {
              // 如果删除包含当页之前的数据 则整个场景树都更新
              this.scenegraph.clearCells();
              this.scenegraph.createSceneGraph();
            } else {
              //如果是仅删除当前页数据
              const minRowNum =
                minRecordIndex -
                (endIndex - perPageCount) +
                (this.transpose ? this.rowHeaderLevelCount : this.columnHeaderLevelCount);
              //如果当页数据是满的 则更新影响的部分行
              const updateRows = [];
              const delRows = [];

              for (let row = minRowNum; row < newRowCount; row++) {
                if (this.transpose) {
                  updateRows.push({ col: row, row: 0 });
                } else {
                  updateRows.push({ col: 0, row });
                }
              }
              if (newRowCount < oldRowCount) {
                //如果如果删除后不满 需要有删除数据
                for (let row = newRowCount; row < oldRowCount; row++) {
                  if (this.transpose) {
                    delRows.push({ col: row, row: 0 });
                  } else {
                    delRows.push({ col: 0, row });
                  }
                }
              }
              this.transpose
                ? this.scenegraph.updateCol(delRows, [], updateRows)
                : this.scenegraph.updateRow(delRows, [], updateRows);
            }
          }
        } else {
          const delRows = [];

          for (let index = 0; index < recordIndexsMinToMax.length; index++) {
            const recordIndex = recordIndexsMinToMax[index];
            const rowNum = recordIndex + (this.transpose ? this.rowHeaderLevelCount : this.columnHeaderLevelCount);
            if (this.transpose) {
              delRows.push({ col: rowNum, row: 0 });
            } else {
              delRows.push({ col: 0, row: rowNum });
            }
          }
          this.transpose ? this.scenegraph.updateCol(delRows, [], []) : this.scenegraph.updateRow(delRows, [], []);
        }
      }
      // this.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
    }
  }

  /**
   * 修改数据 支持多条数据
   * @param records 修改数据条目
   * @param recordIndexs 对应修改数据的索引（显示在body中的索引，即要修改的是body部分的第几行数据）
   */
  updateRecords(records: any[], recordIndexs: number[]) {
    if (recordIndexs?.length > 0) {
      if (this.sortState) {
        this.dataSource.updateRecordsForSorted(records, recordIndexs);
        sortRecords(this);
        this.refreshRowColCount();
        // 更新整个场景树
        this.scenegraph.clearCells();
        this.scenegraph.createSceneGraph();
      } else {
        const updateRecordIndexs = this.dataSource.updateRecords(records, recordIndexs);
        if (updateRecordIndexs.length === 0) {
          return;
        }

        const recordIndexsMinToMax = updateRecordIndexs.sort((a, b) => a - b);
        if (this.pagination) {
          const { perPageCount, currentPage } = this.pagination;
          const startIndex = perPageCount * (currentPage || 0);
          const endIndex = startIndex + perPageCount;
          const updateRows = [];
          for (let index = 0; index < recordIndexsMinToMax.length; index++) {
            const recordIndex = recordIndexsMinToMax[index];
            if (recordIndex < endIndex && recordIndex >= endIndex - perPageCount) {
              const rowNum =
                recordIndex -
                (endIndex - perPageCount) +
                (this.transpose ? this.rowHeaderLevelCount : this.columnHeaderLevelCount);
              updateRows.push(rowNum);
            }
          }
          if (updateRows.length >= 1) {
            const updateRowCells = [];
            for (let index = 0; index < updateRows.length; index++) {
              const updateRow = updateRows[index];
              if (this.transpose) {
                updateRowCells.push({ col: updateRow, row: 0 });
              } else {
                updateRowCells.push({ col: 0, row: updateRow });
              }
            }
            this.transpose
              ? this.scenegraph.updateCol([], [], updateRowCells)
              : this.scenegraph.updateRow([], [], updateRowCells);
          }
        } else {
          const updateRows = [];
          for (let index = 0; index < recordIndexsMinToMax.length; index++) {
            const recordIndex = recordIndexsMinToMax[index];
            const rowNum = recordIndex + (this.transpose ? this.rowHeaderLevelCount : this.columnHeaderLevelCount);
            if (this.transpose) {
              updateRows.push({ col: rowNum, row: 0 });
            } else {
              updateRows.push({ col: 0, row: rowNum });
            }
          }
          this.transpose
            ? this.scenegraph.updateCol([], [], updateRows)
            : this.scenegraph.updateRow([], [], updateRows);
        }
      }
      // this.fireListeners(TABLE_EVENT_TYPE.ADD_RECORD, { row });
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
}
