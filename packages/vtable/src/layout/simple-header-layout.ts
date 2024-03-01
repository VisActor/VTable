/* eslint-disable sort-imports */
import { isValid } from '@visactor/vutils';
import type { ListTable } from '../ListTable';
import { DefaultSparklineSpec } from '../tools/global';
import type {
  CellAddress,
  CellRange,
  CellLocation,
  IListTableCellHeaderPaths,
  LayoutObjectId,
  AggregationType,
  Aggregation
} from '../ts-types';
import type { ColumnsDefine, TextColumnDefine } from '../ts-types/list-table/define';
import type {
  ColumnData,
  ColumnDefine,
  HeaderData,
  LayoutMapAPI,
  WidthData
} from '../ts-types/list-table/layout-map/api';
import { checkHasChart, getChartDataId } from './chart-helper/get-chart-spec';
import { checkHasAggregation, checkHasAggregationOnBottom, checkHasAggregationOnTop } from './layout-helper';
import type { Aggregator } from '../dataset/statistics-helper';
import { DimensionTree } from './tree-helper';
// import { EmptyDataCache } from './utils';

// let seqId = 0;
export class SimpleHeaderLayoutMap implements LayoutMapAPI {
  private seqId: number = 0;
  private _headerObjects: HeaderData[];
  private _headerObjectMap: { [key in LayoutObjectId]: HeaderData };
  // private _headerObjectFieldKey: { [key in string]: HeaderData };
  private _headerCellIds: number[][];
  private _columns: ColumnData[];
  /** 后期加的 对应pivot-header-layout 中的columnDimensionTree 为了排序后获取到排序后的columns */
  columnTree: DimensionTree;
  readonly bodyRowSpanCount: number = 1;
  //透视表中树形结构使用 这里为了table逻辑不报错
  // rowHierarchyIndent?: number = 0;
  hierarchyIndent?: number; // 树形展示缩进值
  // private _emptyDataCache = new EmptyDataCache();
  _transpose = false;
  _showHeader = true;
  _recordsCount = 0;
  _table: ListTable;
  _hasAggregation: boolean = false;
  _hasAggregationOnTopCount: number = 0;
  _hasAggregationOnBottomCount: number = 0;
  // 缓存行号列号对应的cellRange 需要注意当表头位置拖拽后 这个缓存的行列号已不准确 进行重置
  private _cellRangeMap: Map<string, CellRange>; //存储单元格的行列号范围 针对解决是否为合并单元格情况
  constructor(table: ListTable, columns: ColumnsDefine, showHeader: boolean, hierarchyIndent: number) {
    this._cellRangeMap = new Map();
    this._showHeader = showHeader;
    this._table = table;
    this._columns = [];
    this._headerCellIds = [];
    this.hierarchyIndent = hierarchyIndent ?? 20;
    this.columnTree = new DimensionTree(columns as any, { seqId: 0 }); //seqId这里没有利用上 所有顺便传了0
    this._headerObjects = this._addHeaders(0, columns, []);
    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key in LayoutObjectId]: HeaderData });
    this._hasAggregation = checkHasAggregation(this);
    this._hasAggregationOnBottomCount = checkHasAggregationOnBottom(this);
    this._hasAggregationOnTopCount = checkHasAggregationOnTop(this);
    // this._headerObjectFieldKey = this._headerObjects.reduce((o, e) => {
    //   o[e.fieldKey] = e;
    //   return o;
    // }, {} as { [key in string]: HeaderData });
  }
  // get columnWidths(): ColumnData[] {
  //   return this._columns;
  // }
  get transpose(): boolean {
    return this._transpose;
  }
  set transpose(_transpose: boolean) {
    this._transpose = _transpose;
  }
  get showHeader(): boolean {
    return this._showHeader;
  }
  set showHeader(_showHeader: boolean) {
    this._showHeader = _showHeader;
  }
  isHeader(col: number, row: number): boolean {
    if (this.transpose && col >= 0 && col < this.headerLevelCount) {
      return true;
    }
    if (!this.transpose && row >= 0 && row < this.headerLevelCount) {
      return true;
    }
    return false;
  }
  isAggregation(col: number, row: number): boolean {
    // const column = this.getBody(col, row);
    // const aggregation = column.aggregation;
    if (this.hasAggregation) {
      if (this.hasAggregationOnBottomCount) {
        if (this.transpose) {
          if (col >= this.colCount - this.hasAggregationOnBottomCount) {
            return true;
          }
        } else {
          if (row >= this.rowCount - this.hasAggregationOnBottomCount) {
            return true;
          }
        }
      }
      if (this.hasAggregationOnTopCount) {
        if (this.transpose) {
          if (col >= this.rowHeaderLevelCount && col < this.rowHeaderLevelCount + this.hasAggregationOnTopCount) {
            return true;
          }
        } else {
          if (row >= this.columnHeaderLevelCount && row < this.columnHeaderLevelCount + this.hasAggregationOnTopCount) {
            return true;
          }
        }
      }
    }
    return false;
  }
  isTopAggregation(col: number, row: number): boolean {
    if (this.hasAggregationOnTopCount) {
      if (this.transpose) {
        if (col >= this.rowHeaderLevelCount && col < this.rowHeaderLevelCount + this.hasAggregationOnTopCount) {
          return true;
        }
      } else {
        if (row >= this.columnHeaderLevelCount && row < this.columnHeaderLevelCount + this.hasAggregationOnTopCount) {
          return true;
        }
      }
    }
    return false;
  }
  isBottomAggregation(col: number, row: number): boolean {
    if (this.hasAggregationOnBottomCount) {
      if (this.transpose) {
        if (col >= this.colCount - this.hasAggregationOnBottomCount) {
          return true;
        }
      } else {
        if (row >= this.rowCount - this.hasAggregationOnBottomCount) {
          return true;
        }
      }
    }
    return false;
  }
  get hasAggregation() {
    return this._hasAggregation;
  }

  get hasAggregationOnTopCount() {
    return this._hasAggregationOnTopCount;
  }

  get hasAggregationOnBottomCount() {
    return this._hasAggregationOnBottomCount;
  }

  getAggregators(col: number, row: number) {
    const column = this.getBody(col, row);
    const aggregators = column.aggregator;
    return aggregators;
  }
  getAggregatorOnTop(col: number, row: number) {
    const column = this.getBody(col, row);
    const aggregators = column.aggregator;
    const aggregation = column.aggregation;
    if (Array.isArray(aggregation)) {
      const topAggregationIndexs = aggregation.reduce((indexs, agg, index) => {
        if (agg.showOnTop) {
          indexs.push(index);
        }
        return indexs;
      }, []);
      const topAggregators = topAggregationIndexs.map(index => aggregators[index]);
      if (this.transpose) {
        return (topAggregators as Aggregator[])[col - this.rowHeaderLevelCount];
      }
      return (topAggregators as Aggregator[])[row - this.columnHeaderLevelCount];
    }
    if (this.transpose && col - this.rowHeaderLevelCount === 0) {
      return (aggregation as Aggregation)?.showOnTop ? (aggregators as Aggregator) : null;
    } else if (!this.transpose && row - this.columnHeaderLevelCount === 0) {
      return (aggregation as Aggregation)?.showOnTop ? (aggregators as Aggregator) : null;
    }
    return null;
  }

  getAggregatorOnBottom(col: number, row: number) {
    const column = this.getBody(col, row);
    const aggregators = column.aggregator;
    const aggregation = column.aggregation;
    if (Array.isArray(aggregation)) {
      const bottomAggregationIndexs = aggregation.reduce((indexs, agg, index) => {
        if (agg.showOnTop === false) {
          indexs.push(index);
        }
        return indexs;
      }, []);
      const bottomAggregators = bottomAggregationIndexs.map(index => aggregators[index]);
      if (this.transpose) {
        return (bottomAggregators as Aggregator[])[col - (this.colCount - this.hasAggregationOnBottomCount)];
      }
      return (bottomAggregators as Aggregator[])[row - (this.rowCount - this.hasAggregationOnBottomCount)];
    }
    if (this.transpose && col - (this.colCount - this.hasAggregationOnBottomCount) === 0) {
      return (aggregation as Aggregation)?.showOnTop === false ? (aggregators as Aggregator) : null;
    } else if (!this.transpose && row - (this.rowCount - this.hasAggregationOnBottomCount) === 0) {
      return (aggregation as Aggregation)?.showOnTop === false ? (aggregators as Aggregator) : null;
    }
    return null;
  }
  /**
   * 获取单元格所在行或者列中的聚合值的单元格地址
   * @param col
   * @param row
   * @returns
   */
  getCellAddressHasAggregator(col: number, row: number) {
    const cellAddrs = [];
    if (this.transpose) {
      const topCount = this.hasAggregationOnTopCount;
      for (let i = 0; i < topCount; i++) {
        cellAddrs.push({ col: this.headerLevelCount + i, row });
      }

      const bottomCount = this.hasAggregationOnBottomCount;
      for (let i = 0; i < bottomCount; i++) {
        cellAddrs.push({ col: this.rowCount - bottomCount + i, row });
      }
    } else {
      const topCount = this.hasAggregationOnTopCount;
      for (let i = 0; i < topCount; i++) {
        cellAddrs.push({ col, row: this.headerLevelCount + i });
      }

      const bottomCount = this.hasAggregationOnBottomCount;
      for (let i = 0; i < bottomCount; i++) {
        cellAddrs.push({ col, row: this.rowCount - bottomCount + i });
      }
    }
    return cellAddrs;
  }
  getCellLocation(col: number, row: number): CellLocation {
    if (this.isHeader(col, row)) {
      if (this.transpose) {
        return 'rowHeader';
      }
      return 'columnHeader';
    }
    return 'body';
  }
  isRowHeader(col: number, row: number): boolean {
    if (this.transpose && col >= 0 && col <= this.headerLevelCount - 1) {
      return true;
    }
    return false;
  }
  isColumnHeader(col: number, row: number): boolean {
    if (!this.transpose && row >= 0 && row <= this.headerLevelCount - 1) {
      return true;
    }
    return false;
  }
  /**
   * 是否属于冻结左侧列
   * @param col
   * @param row 不传的话 只需要判断col，传入row的话非冻结角头部分的才返回true
   * @returns
   */
  isFrozenColumn(col: number, row?: number): boolean {
    if (isValid(row)) {
      if (
        col >= 0 &&
        col < this.frozenColCount &&
        row >= this.frozenRowCount &&
        row < this.rowCount - this.bottomFrozenRowCount
      ) {
        return true;
      }
    } else {
      if (this.frozenColCount > 0 && col >= 0 && col < this.frozenColCount) {
        return true;
      }
    }
    return false;
  }
  /**
   * 是否属于右侧冻结列
   * @param col
   * @param row 不传的话 只需要判断col，传入row的话非冻结角头部分的才返回true
   * @returns
   */
  isRightFrozenColumn(col: number, row?: number): boolean {
    if (isValid(row)) {
      if (
        col >= this.colCount - this.rightFrozenColCount &&
        row >= this.frozenRowCount &&
        row < this.rowCount - this.bottomFrozenRowCount
      ) {
        return true;
      }
    } else {
      if (this.rightFrozenColCount > 0 && col >= this.colCount - this.rightFrozenColCount) {
        return true;
      }
    }
    return false;
  }
  /**
   * 是否属于冻结顶部行
   * @param col 只传入col一个值的话 会被当做row
   * @param row 不传的话只需要判断col（其实会当做row）；传入两个值的话非冻结角头部分的才返回true
   * @returns
   */
  isFrozenRow(col: number, row?: number): boolean {
    if (isValid(row)) {
      if (
        row >= 0 &&
        row < this.frozenRowCount &&
        col >= this.frozenColCount &&
        col < this.colCount - this.rightFrozenColCount
      ) {
        return true;
      }
    } else {
      row = col;
      if (this.frozenRowCount > 0 && row >= 0 && row < this.frozenRowCount) {
        return true;
      }
    }
    return false;
  }
  /**
   * 是否属于冻结底部行
   * @param col 只传入col一个值的话 会被当做row
   * @param row 不传的话只需要判断col（其实会当做row）；传入两个值的话非冻结角头部分的才返回true
   * @returns
   */
  isBottomFrozenRow(col: number, row?: number): boolean {
    if (isValid(row)) {
      if (
        row >= this.rowCount - this.bottomFrozenRowCount &&
        col >= this.frozenColCount &&
        col < this.colCount - this.rightFrozenColCount
      ) {
        return true;
      }
    } else {
      row = col;
      if (this.bottomFrozenRowCount > 0 && row >= this.rowCount - this.bottomFrozenRowCount) {
        return true;
      }
    }
    return false;
  }
  isLeftBottomCorner(col: number, row: number): boolean {
    if (col >= 0 && col < this.rowHeaderLevelCount && row >= this.rowCount - this.bottomFrozenRowCount) {
      return true;
    }
    return false;
  }
  isRightTopCorner(col: number, row: number): boolean {
    if (col >= this.colCount - this.rightFrozenColCount && row >= 0 && row < this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  isRightBottomCorner(col: number, row: number): boolean {
    if (col >= this.colCount - this.rightFrozenColCount && row >= this.rowCount - this.bottomFrozenRowCount) {
      return true;
    }
    return false;
  }
  isCornerHeader(col: number, row: number): boolean {
    return false;
  }

  getColumnHeaderRange(): CellRange {
    if (this.transpose) {
      return {
        start: { col: 0, row: 0 },
        end: { col: this._headerCellIds.length - 1, row: (this.rowCount ?? 0) - 1 }
      };
    }
    return {
      start: { col: 0, row: 0 },
      end: { col: (this.colCount ?? 0) - 1, row: this._headerCellIds.length - 1 }
    };
  }
  //目前和getColumnHeaderRange 逻辑一致 因为基本表格只有一侧有表头
  getRowHeaderRange(): CellRange | undefined {
    if (this.transpose) {
      return {
        start: { col: 0, row: 0 },
        end: { col: this._headerCellIds.length - 1, row: (this.rowCount ?? 0) - 1 }
      };
    }
    return {
      start: { col: 0, row: 0 },
      end: { col: (this.colCount ?? 0) - 1, row: this._headerCellIds.length - 1 }
    };
  }
  getCornerHeaderRange(): CellRange | undefined {
    return undefined;
  }
  getBodyRange(): CellRange {
    if (this.transpose) {
      return {
        start: { col: this.headerLevelCount, row: 0 },
        end: { col: (this.colCount ?? 0) - 1, row: (this.rowCount ?? 0) - 1 }
      };
    }
    return {
      start: { col: 0, row: this.headerLevelCount },
      end: { col: (this.colCount ?? 0) - 1, row: (this.rowCount ?? 0) - 1 }
    };
  }
  /**
   * 是否为最底层表头
   * @param col
   * @param row
   * @returns
   */
  // isHeaderNode(col: number, row: number): boolean {
  //   const header = this.getHeader(col, row);
  //   if (
  //     header &&
  //     header.define &&
  //     (!(<any>header.define).columns || (<any>header.define).hideColumnsSubHeader)
  //   )
  //     return true;
  //   return false;
  // }
  get headerLevelCount(): number {
    return this.showHeader ? this._headerCellIds.length : 0;
  }
  get columnHeaderLevelCount(): number {
    return this.transpose ? 0 : this.headerLevelCount;
  }
  get rowHeaderLevelCount(): number {
    return this.transpose ? this.headerLevelCount : 0;
  }
  get frozenColCount(): number {
    if (this._table.internalProps.frozenColCount) {
      if (this.colCount > this._table.internalProps.frozenColCount) {
        return this._table.internalProps.frozenColCount;
      }
      return this.colCount;
    }
    return 0;
  }
  get frozenRowCount(): number {
    // return this._table.internalProps.frozenRowCount ?? 0;
    if (this._table.internalProps.frozenRowCount) {
      if (this.rowCount >= this._table.internalProps.frozenRowCount) {
        return this._table.internalProps.frozenRowCount;
      }
      return this.rowCount;
    }
    return 0;
  }
  get bottomFrozenRowCount(): number {
    if (this._table.internalProps.bottomFrozenRowCount) {
      if (this.rowCount - this.headerLevelCount >= this._table.internalProps.bottomFrozenRowCount) {
        return this._table.internalProps.bottomFrozenRowCount;
      }
      return this.rowCount - this.headerLevelCount;
    }
    return 0;
  }
  get rightFrozenColCount(): number {
    if (this._table.internalProps.rightFrozenColCount) {
      if (this.colCount - this.frozenColCount >= this._table.internalProps.rightFrozenColCount) {
        return this._table.internalProps.rightFrozenColCount;
      }
      return Math.max(0, this.colCount - this.frozenColCount);
    }
    return 0;
  }
  get colCount(): number {
    //标准表格 列数是由表头定义的field决定的；如果是转置表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this.transpose ? this.headerLevelCount + this.recordsCount : this._columns.length;
  }
  get rowCount(): number {
    //转置表格 行数是由表头定义的field决定的；如果是标准表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this.transpose ? this._columns.length : this.headerLevelCount + this.recordsCount;
  }
  /** 不包括冻结的行 */
  get bodyRowCount(): number {
    //转置表格 行数是由表头定义的field决定的；如果是标准表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this.transpose ? this._columns.length : this.rowCount - this.bottomFrozenRowCount - this.headerLevelCount;
  }
  /** 不包括冻结的列 */
  get bodyColCount(): number {
    //转置表格 行数是由表头定义的field决定的；如果是标准表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this.transpose ? this.colCount - this.rightFrozenColCount - this.rowHeaderLevelCount : this._columns.length;
  }
  get recordsCount() {
    //标准表格 列数是由表头定义的field决定的；如果是转置表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this._recordsCount;
  }
  set recordsCount(recordsCount: number) {
    //标准表格 列数是由表头定义的field决定的；如果是转置表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    this._recordsCount = recordsCount;
  }
  get headerObjects(): HeaderData[] {
    return this._headerObjects;
  }
  get columnObjects(): ColumnData[] {
    return this._columns;
  }
  //对比multi-layout 那个里面有columWidths对象，保持结构一致
  get columnWidths(): WidthData[] {
    return this._columns;
  }

  getColumnWidthDefined(col: number): WidthData {
    if (this.transpose) {
      let width: string | number = 0;
      let maxWidth: string | number;
      let minWidth: string | number;
      if (col >= this.rowHeaderLevelCount) {
        let isAuto;
        this.columnObjects.forEach((obj, index) => {
          if (typeof obj.width === 'number') {
            width = Math.max(obj.width, <number>width);
          } else if (obj.width === 'auto') {
            isAuto = true;
          }
          if (typeof obj.minWidth === 'number') {
            minWidth = Math.max(obj.minWidth, <number>minWidth);
          }
          if (typeof obj.maxWidth === 'number') {
            maxWidth = Math.max(obj.maxWidth, <number>maxWidth);
          }
        });
        width = width > 0 ? width : isAuto ? 'auto' : undefined;
        return { width, minWidth, maxWidth };
      }
      if (this.isRowHeader(col, 0)) {
        const defaultWidth = Array.isArray(this._table.defaultHeaderColWidth)
          ? this._table.defaultHeaderColWidth[col] ?? this._table.defaultColWidth
          : this._table.defaultHeaderColWidth;
        if (defaultWidth === 'auto') {
          return { width: 'auto' };
        }
        return { width: defaultWidth };
      }
    }
    return this._columns[col];
  }
  getCellId(col: number, row: number): LayoutObjectId {
    if (this.transpose) {
      if (this.headerLevelCount <= col) {
        return this._columns[row]?.id;
      }
      //in header
      return this._headerCellIds[col]?.[row];
    }
    if (this.headerLevelCount <= row) {
      return this._columns[col]?.id;
    }
    //in header
    return this._headerCellIds[row]?.[col];
  }
  getHeader(col: number, row: number): HeaderData {
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number]!;
  }
  getHeaderField(col: number, row: number) {
    const id = this.getCellId(col, row);
    return (
      this._headerObjectMap[id as number]?.field ||
      (this.transpose ? this._columns[row] && this._columns[row].field : this._columns[col] && this._columns[col].field)
    );
  }
  getHeaderCellAdressById(id: number): CellAddress | undefined {
    for (let i = 0; i < this._headerCellIds.length; i++) {
      const row = this._headerCellIds[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === id) {
          if (this.transpose) {
            return { col: i, row: j };
          }
          return { col: j, row: i };
        }
      }
    }
    return undefined;
  }
  /** 根据field获取表头cell位置 */
  getHeaderCellAddressByField(field: string): CellAddress | undefined {
    const hd = this.headerObjects.find((col: any) => col && col.field === field);
    return this.getHeaderCellAdressById(hd.id as number);
  }
  getBody(col: number, _row: number): ColumnData {
    return this.transpose ? this._columns[_row] : this._columns[col];
  }
  getBodyLayoutRangeById(id: LayoutObjectId): CellRange {
    if (this.transpose) {
      for (let row = 0; row < (this.rowCount ?? 0); row++) {
        if (id === this._columns[row].id) {
          return {
            start: { col: 0, row },
            end: { col: 0, row }
          };
        }
      }
    } else {
      for (let col = 0; col < (this.colCount ?? 0); col++) {
        if (id === this._columns[col].id) {
          return {
            start: { col, row: 0 },
            end: { col, row: 0 }
          };
        }
      }
    }
    throw new Error(`can not found body layout @id=${id as number}`);
  }
  /**
   * 获取body部分cell的内容
   * @param col
   * @param row
   * @returns
   */
  getBodyCellValue(col: number, row: number) {
    if (this.isHeader(col, row)) {
      return null;
    }
    const { field, fieldFormat } = this.getBody(col, row);
    return this._table.getFieldData(fieldFormat || field, col, row);
  }
  getCellRange(col: number, row: number): CellRange {
    if (col === -1 || row === -1) {
      return {
        start: { col, row },
        end: { col, row }
      };
    }
    if (this._cellRangeMap.has(`$${col}$${row}`)) {
      return this._cellRangeMap.get(`$${col}$${row}`);
    }
    let cellRange: CellRange = { start: { col, row }, end: { col, row } };
    if (this.transpose) {
      cellRange = this.getCellRangeTranspose(col, row);
    } else {
      // hover相关的单元格位置是-1,-1，getCellRange计算有误，先进行判断
      if (this.headerLevelCount <= row) {
        //如果是body部分 设置了需要合并单元格 这里判断上下是否内容相同 相同的话 将cellRange范围扩大
        if (this.headerLevelCount <= row && (this.columnObjects[col]?.define as TextColumnDefine)?.mergeCell) {
          const value = this.getBodyCellValue(col, row);
          for (let r = row - 1; r >= this.headerLevelCount; r--) {
            const last_Value = this.getBodyCellValue(col, r);
            if (typeof this.columnObjects[col].define.mergeCell === 'boolean') {
              if (value !== last_Value) {
                break;
              }
            } else {
              if (!(this.columnObjects[col].define.mergeCell as Function)(value, last_Value)) {
                break;
              }
            }
            cellRange.start.row = r;
          }
          for (let r = row + 1; r < this.rowCount; r++) {
            const next_Value = this.getBodyCellValue(col, r);
            if (typeof this.columnObjects[col].define.mergeCell === 'boolean') {
              if (value !== next_Value) {
                break;
              }
            } else {
              if (!(this.columnObjects[col].define.mergeCell as Function)(value, next_Value)) {
                break;
              }
            }
            cellRange.end.row = r;
          }
        }
        // return cellRange;
      } else {
        //in header
        const id = this.getCellId(col, row);
        for (let c = col - 1; c >= 0; c--) {
          if (id !== this.getCellId(c, row)) {
            break;
          }
          cellRange.start.col = c;
        }
        for (let c = col + 1; c < (this.colCount ?? 0); c++) {
          if (id !== this.getCellId(c, row)) {
            break;
          }
          cellRange.end.col = c;
        }
        for (let r = row - 1; r >= 0; r--) {
          if (id !== this.getCellId(col, r)) {
            break;
          }
          cellRange.start.row = r;
        }
        for (let r = row + 1; r < this.headerLevelCount; r++) {
          if (id !== this.getCellId(col, r)) {
            break;
          }
          cellRange.end.row = r;
        }
        // return cellRange;
      }
    }
    this._cellRangeMap.set(`$${col}$${row}`, cellRange);
    return cellRange;
  }
  private getCellRangeTranspose(col: number, row: number): CellRange {
    const result: CellRange = { start: { col, row }, end: { col, row } };
    // hover相关的单元格位置是-1,-1，getCellRange计算有误，先进行判断
    if (this.headerLevelCount <= col || (col === -1 && row === -1)) {
      //如果是body部分 设置了需要合并单元格 这里判断左右是否内容相同 相同的话 将cellRange范围扩大
      if (this.headerLevelCount <= col && this.columnObjects[row]?.define?.mergeCell) {
        const value = this.getBodyCellValue(col, row);
        for (let c = col - 1; c >= this.headerLevelCount; c--) {
          const last_Value = this.getBodyCellValue(c, row);
          if (typeof this.columnObjects[row].define.mergeCell === 'boolean') {
            if (value !== last_Value) {
              break;
            }
          } else {
            if (!(this.columnObjects[row].define.mergeCell as Function)(value, last_Value)) {
              break;
            }
          }
          result.start.col = c;
        }
        for (let c = col + 1; c < (this.colCount ?? 0); c++) {
          const next_Value = this.getBodyCellValue(c, row);
          if (typeof this.columnObjects[row].define.mergeCell === 'boolean') {
            if (value !== next_Value) {
              break;
            }
          } else {
            if (!(this.columnObjects[row].define.mergeCell as Function)(value, next_Value)) {
              break;
            }
          }
          result.end.col = c;
        }
      }
      return result;
    }
    //in header
    const id = this.getCellId(col, row);
    for (let r = row - 1; r >= 0; r--) {
      if (id !== this.getCellId(col, r)) {
        break;
      }
      result.start.row = r;
    }
    for (let r = row + 1; r < (this.rowCount ?? 0); r++) {
      if (id !== this.getCellId(col, r)) {
        break;
      }
      result.end.row = r;
    }
    for (let c = col - 1; c >= 0; c--) {
      if (id !== this.getCellId(c, row)) {
        break;
      }
      result.start.col = c;
    }
    for (let c = col + 1; c < this.headerLevelCount; c++) {
      if (id !== this.getCellId(c, row)) {
        break;
      }
      result.end.col = c;
    }
    return result;
  }
  isCellRangeEqual(col: number, row: number, targetCol: number, targetRow: number): boolean {
    const range1 = this.getCellRange(col, row);
    const range2 = this.getCellRange(targetCol, targetRow);
    return (
      range1.start.col === range2.start.col &&
      range1.end.col === range2.end.col &&
      range1.start.row === range2.start.row &&
      range1.end.row === range2.end.row
    );
  }
  getRecordShowIndexByCell(col: number, row: number): number {
    const skipRowCount = this.hasAggregationOnTopCount ? this.headerLevelCount + 1 : this.headerLevelCount;
    if (this.transpose) {
      if (col < skipRowCount) {
        return -1;
      }
      return col - skipRowCount;
    }

    if (row < skipRowCount) {
      return -1;
    }
    return row - skipRowCount;
  }
  getRecordStartRowByRecordIndex(index: number): number {
    const skipRowCount = this.hasAggregationOnTopCount ? this.headerLevelCount + 1 : this.headerLevelCount;
    return skipRowCount + index;
  }
  private _addHeaders(
    row: number,
    column: ColumnsDefine,
    roots: number[],
    hideColumnsSubHeader?: boolean
  ): HeaderData[] {
    const results: HeaderData[] = [];
    const rowCells = this._newRow(row, hideColumnsSubHeader); // !hideColumnsSubHeader ? this._headerCellIds[row] || this._newRow(row) : [];
    column.forEach((hd: ColumnDefine) => {
      const col = this._columns.length;
      const id = this.seqId++;
      const cell: HeaderData = {
        id,
        title: hd.title ?? (hd as any).caption,
        // captionIcon,
        headerIcon: hd.headerIcon,
        field: (hd as ColumnDefine).field,
        // fieldFormat: (hd as ColumnDefine).fieldFormat,
        style: hd.headerStyle,
        headerType: hd.headerType ?? 'text',
        dropDownMenu: hd.dropDownMenu,
        define: hd,
        columnWidthComputeMode: hd.columnWidthComputeMode
        // iconPositionList:[]
      };

      results[id] = cell;
      for (let r = row - 1; r >= 0; r--) {
        this._headerCellIds[r] && (this._headerCellIds[r][col] = roots[r]);
      }
      if (!hideColumnsSubHeader) {
        rowCells[col] = id;
      } else if (this._headerCellIds[row - 1]) {
        rowCells[col] = this._headerCellIds[row - 1][col];
      }
      if (hd.columns) {
        this._addHeaders(row + 1, hd.columns, [...roots, id], hd.hideColumnsSubHeader || hideColumnsSubHeader).forEach(
          c => results.push(c)
        );
      } else {
        const colDef = hd;
        this._columns.push({
          id: this.seqId++,
          field: colDef.field,
          // fieldKey: colDef.fieldKey,
          fieldFormat: colDef.fieldFormat,
          width: colDef.width,
          minWidth: colDef.minWidth,
          maxWidth: colDef.maxWidth,
          icon: colDef.icon,
          cellType: colDef.cellType ?? (colDef as any).columnType ?? 'text',
          chartModule: 'chartModule' in colDef ? colDef.chartModule : null, // todo: 放到对应的column对象中
          chartSpec: 'chartSpec' in colDef ? colDef.chartSpec : null, // todo: 放到对应的column对象中
          sparklineSpec: 'sparklineSpec' in colDef ? colDef.sparklineSpec : DefaultSparklineSpec, // todo: 放到对应的column对象中
          style: colDef.style,
          define: colDef,
          columnWidthComputeMode: colDef.columnWidthComputeMode,
          disableColumnResize: colDef?.disableColumnResize,
          aggregation: this._getAggregationForColumn(colDef, col)
        });
        for (let r = row + 1; r < this._headerCellIds.length; r++) {
          this._headerCellIds[r][col] = id;
        }
      }
    });
    return results;
  }
  private _getAggregationForColumn(colDef: ColumnDefine, col: number) {
    let aggregation;
    if (colDef.aggregation) {
      aggregation = colDef.aggregation;
    } else if (this._table.options.aggregation) {
      if (typeof this._table.options.aggregation === 'function') {
        aggregation = this._table.options.aggregation({
          col: col,
          field: colDef.field as string
        });
      } else {
        aggregation = this._table.options.aggregation;
      }
    }
    if (aggregation) {
      if (Array.isArray(aggregation)) {
        return aggregation.map(item => {
          if (!isValid(item.showOnTop)) {
            item.showOnTop = false;
          }
          return item;
        });
      }
      return Object.assign({ showOnTop: false }, aggregation);
    }
    return null;
  }
  private _newRow(row: number, hideColumnsSubHeader = false): number[] {
    //如果当前行已经有数组对象 将上一行的id内容补全到当前行上
    if (this._headerCellIds[row]) {
      const prev = this._headerCellIds[row - 1];
      if (prev.length > this._headerCellIds[row].length) {
        for (let col = this._headerCellIds[row].length; col < prev.length; col++) {
          this._headerCellIds[row][col] = prev[col];
        }
      }
      return this._headerCellIds[row];
    }
    // 隐藏子标题的情况 吐出一个新的数组
    if (hideColumnsSubHeader) {
      return [];
    }
    // 其他情况 不隐藏子标题 同步上一行的id
    const newRow: number[] = (this._headerCellIds[row] = []);
    if (!this._columns.length) {
      return newRow;
    }
    const prev = this._headerCellIds[row - 1];
    for (let col = 0; col < prev.length; col++) {
      newRow[col] = prev[col];
    }
    return newRow;
  }
  getCellHeaderPaths(col: number, row: number): IListTableCellHeaderPaths {
    let colPath: IListTableCellHeaderPaths['colHeaderPaths'] = [];
    let rowPath: IListTableCellHeaderPaths['rowHeaderPaths'] = [];
    if (!this.transpose) {
      colPath = [
        {
          field: this._columns[col].field
        }
      ];
    } else {
      rowPath = [
        {
          field: this._columns[row].field
        }
      ];
    }
    return {
      colHeaderPaths: colPath,
      rowHeaderPaths: rowPath,
      cellLocation: this.getCellLocation(col, row)
    };
  }
  private getParentCellId(col: number, row: number) {
    if (row === 0) {
      return undefined;
    }
    if (this.isColumnHeader(col, row)) {
      return this.getCellId(col, row - 1);
    } else if (this.isRowHeader(col, row)) {
      return this.getCellId(col - 1, row);
    }
    return undefined;
  }
  /**
   * 判断从source地址是否可以移动到target地址
   * @param source
   * @param target
   * @returns boolean 是否可以移动
   */
  canMoveHeaderPosition(source: CellAddress, target: CellAddress): boolean {
    if (source.col < 0 || source.row < 0 || target.col < 0 || target.row < 0) {
      return false;
    }
    if (this._table.internalProps.frozenColDragHeaderMode === 'disabled') {
      if (this._table.isFrozenColumn(target.col) || this._table.isRightFrozenColumn(target.col)) {
        return false;
      }
    }

    // 获取操作单元格的range范围
    const sourceCellRange = this.getCellRange(source.col, source.row);
    // 获取source和target对应sourceCellRange.start.row的headerId
    if (this.isColumnHeader(source.col, source.row)) {
      const sourceTopId = this.getParentCellId(source.col, sourceCellRange.start.row);
      const targetTopId = this.getParentCellId(target.col, sourceCellRange.start.row);
      return sourceTopId === targetTopId;
    } else if (this.isRowHeader(source.col, source.row)) {
      const sourceTopId = this.getParentCellId(sourceCellRange.start.col, source.row);
      const targetTopId = this.getParentCellId(sourceCellRange.start.col, target.row);
      return sourceTopId === targetTopId;
    }
    return false;
  }
  /**
   * 拖拽换位置 从source地址换到target地址
   * @param source
   * @param target
   * @returns
   */
  moveHeaderPosition(source: CellAddress, target: CellAddress) {
    // 判断从source地址是否可以移动到target地址
    if (this.canMoveHeaderPosition(source, target)) {
      const sourceCellRange = this.getCellRange(source.col, source.row);
      // 对移动列表头 行表头 分别处理
      if (this.isColumnHeader(source.col, source.row)) {
        // source单元格包含的列数
        const moveSize = sourceCellRange.end.col - sourceCellRange.start.col + 1;
        // 插入目标地址的列index
        let targetIndex;
        const targetCellRange = this.getCellRange(target.col, sourceCellRange.start.row);
        if (target.col >= source.col) {
          targetIndex = targetCellRange.end.col - moveSize + 1;
        } else {
          targetIndex = targetCellRange.start.col;
        }
        //如果操作列和目标地址col一样 则不执行其他逻辑
        if (targetIndex === sourceCellRange.start.col) {
          return null;
        }
        // 逐行将每一行的source id 移动到目标地址targetCol处
        for (let row = 0; row < this._headerCellIds.length; row++) {
          // 从header id的二维数组中取出需要操作的source ids
          const sourceIds = this._headerCellIds[row].splice(sourceCellRange.start.col, moveSize);
          // 将source ids插入到目标地址targetCol处
          // 把sourceIds变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入sourceIds数组
          sourceIds.unshift(targetIndex, 0);
          Array.prototype.splice.apply(this._headerCellIds[row], sourceIds);
        }
        //将_columns的列定义调整位置 同调整_headerCellIds逻辑
        const sourceColumns = this._columns.splice(sourceCellRange.start.col, moveSize);
        sourceColumns.unshift(targetIndex as any, 0 as any);
        Array.prototype.splice.apply(this._columns, sourceColumns);

        // 对表头columnTree调整节点位置
        this.columnTree.movePosition(sourceCellRange.start.row, sourceCellRange.start.col, targetIndex);

        this._cellRangeMap = new Map();
        return {
          sourceIndex: sourceCellRange.start.col,
          targetIndex,
          moveSize,
          moveType: 'column'
        };
      } else if (this.isRowHeader(source.col, source.row)) {
        // source单元格包含的列数
        const moveSize = sourceCellRange.end.row - sourceCellRange.start.row + 1;
        // 插入目标地址的列index
        let targetIndex;
        const targetCellRange = this.getCellRange(sourceCellRange.start.col, target.row);
        if (target.row >= source.row) {
          targetIndex = targetCellRange.end.row - moveSize + 1;
        } else {
          targetIndex = targetCellRange.start.row;
        }
        //如果操作列和目标地址col一样 则不执行其他逻辑
        if (targetIndex === sourceCellRange.start.row) {
          return null;
        }
        // 逐行将每一行的source id 移动到目标地址targetCol处
        for (let row = 0; row < this._headerCellIds.length; row++) {
          // 从header id的二维数组中取出需要操作的source ids
          const sourceIds = this._headerCellIds[row].splice(sourceCellRange.start.row, moveSize);
          // 将source ids插入到目标地址targetCol处
          // 把sourceIds变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入sourceIds数组
          sourceIds.unshift(targetIndex, 0);
          Array.prototype.splice.apply(this._headerCellIds[row], sourceIds);
        }
        //将_columns的列定义调整位置 同调整_headerCellIds逻辑
        const sourceColumns = this._columns.splice(sourceCellRange.start.row, moveSize);
        sourceColumns.unshift(targetIndex as any, 0 as any);
        Array.prototype.splice.apply(this._columns, sourceColumns);

        // 对表头columnTree调整节点位置
        this.columnTree.movePosition(sourceCellRange.start.col, sourceCellRange.start.row, targetIndex);

        this._cellRangeMap = new Map();
        return {
          sourceIndex: sourceCellRange.start.row,
          targetIndex,
          moveSize,
          moveType: 'row'
        };
      }
    }
    return null;
  }
  /**
   * 点击某个单元格的展开折叠按钮 改变该节点的状态 维度树重置
   */
  toggleHierarchyState(diffDataIndices: { add: number[]; remove: number[] }) {
    const addCellPositions = diffDataIndices.add.map(index => {
      return { col: 0, row: this._table.frozenRowCount + index };
    });
    const removeCellPositions = diffDataIndices.remove.map(index => {
      return { col: 0, row: this._table.frozenRowCount + index };
    });
    return {
      addCellPositions,
      removeCellPositions
    };
  }
  setChartInstance(_col: number, _row: number, chartInstance: any) {
    const columnObj = this.transpose ? this._columns[_row] : this._columns[_col];
    if (typeof columnObj.chartSpec === 'function') {
      return;
    }
    columnObj.chartInstance = chartInstance;
  }

  getChartInstance(_col: number, _row: number) {
    const columnObj = this.transpose ? this._columns[_row] : this._columns[_col];
    return columnObj.chartInstance;
  }
  checkHasChart() {
    return checkHasChart(this);
  }

  getAxisConfigInPivotChart(col: number, row: number): any {
    return undefined;
  }
  isEmpty(col: number, row: number) {
    return false;
  }
  isAxisCell(col: number, row: number) {
    return false;
  }
  getChartAxes(col: number, row: number): any[] {
    return [];
  }
  /** 共享chartSpec 非函数 */
  isShareChartSpec(col: number, row: number): boolean {
    const body = this.getBody(col, row);
    const chartSpec = body?.chartSpec;
    if (typeof chartSpec === 'function') {
      return false;
    }
    return true;
  }
  getChartSpec(col: number, row: number) {
    return this.getRawChartSpec(col, row);
  }
  getRawChartSpec(col: number, row: number): any {
    const body = this.getBody(col, row);
    const chartSpec = body?.chartSpec;
    if (typeof chartSpec === 'function') {
      // 动态组织spec
      const arg = {
        col,
        row,
        dataValue: this._table.getCellOriginValue(col, row) || '',
        value: this._table.getCellValue(col, row) || '',
        rect: this._table.getCellRangeRelativeRect(this._table.getCellRange(col, row)),
        table: this._table
      };
      return chartSpec(arg);
    }
    return chartSpec;
  }
  getChartDataId(col: number, row: number): any {
    return getChartDataId(col, row, this);
  }
  release() {
    const activeChartInstance = this._table._getActiveChartInstance();
    activeChartInstance?.release();
    this.columnObjects.forEach(indicatorObject => {
      indicatorObject.chartInstance?.release();
    });
  }

  clearCellRangeMap() {
    this._cellRangeMap.clear();
  }

  updateColumnTitle(col: number, row: number, title: string) {
    const define = this._table.internalProps.layoutMap.getHeader(col, row);
    define.title = title;
    define.define.title = title;
  }

  getColumnByField(field: string | number): {
    col: number;
    columnDefine: ColumnData;
  }[] {
    const result = this.columnObjects?.reduce((pre: { col: number; columnDefine: ColumnData }[], cur, index) => {
      if (cur.field === field) {
        pre.push({ col: index, columnDefine: cur });
      }
      return pre;
    }, []);
    return result;
  }
}
