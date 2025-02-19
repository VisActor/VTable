/* eslint-disable sort-imports */
import { isValid, merge } from '@visactor/vutils';
import type { ListTable } from '../ListTable';
import { DefaultSparklineSpec } from '../tools/global';
import type {
  CellAddress,
  CellRange,
  CellLocation,
  IListTableCellHeaderPaths,
  LayoutObjectId,
  AggregationType,
  Aggregation,
  IRowSeriesNumber
} from '../ts-types';
import type { ChartColumnDefine, ColumnsDefine } from '../ts-types/list-table/define';
import type {
  ColumnData,
  ColumnDefine,
  HeaderData,
  LayoutMapAPI,
  SeriesNumberColumnData,
  WidthData
} from '../ts-types/list-table/layout-map/api';
import { checkHasChart, getChartDataId } from './chart-helper/get-chart-spec';
import {
  checkHasAggregation,
  checkHasAggregationOnBottom,
  checkHasAggregationOnTop,
  checkHasTreeDefine
} from './layout-helper';
import type { Aggregator } from '../ts-types/dataset/aggregation';
import { DimensionTree } from './tree-helper';
import { getCellRange } from './cell-range/simple-cell-range';
// import { EmptyDataCache } from './utils';

// let seqId = 0;
export class SimpleHeaderLayoutMap implements LayoutMapAPI {
  private seqId: number = 0;
  private _headerObjects: HeaderData[];
  private _headerObjectMap: { [key in LayoutObjectId]: HeaderData };
  private _headerObjectsIncludeHided: HeaderData[];
  // private _headerObjectMapIncludeHided: { [key in LayoutObjectId]: HeaderData };
  // private _headerObjectFieldKey: { [key in string]: HeaderData };
  private _headerCellIds: number[][];
  private _columns: ColumnData[];
  private _columnsIncludeHided: ColumnData[];
  rowSeriesNumberColumn: SeriesNumberColumnData[];
  leftRowSeriesNumberColumn: SeriesNumberColumnData[];
  rightRowSeriesNumberColumn: SeriesNumberColumnData[];
  leftRowSeriesNumberColumnCount: number = 0;
  rightRowSeriesNumberColumnCount: number = 0;
  /** 后期加的 对应pivot-header-layout 中的columnDimensionTree 为了排序后获取到排序后的columns */
  columnTree: DimensionTree;
  readonly bodyRowSpanCount: number = 1;
  //透视表中树形结构使用 这里为了table逻辑不报错
  // rowHierarchyIndent?: number = 0;
  hierarchyIndent?: number; // 树形展示缩进值
  hierarchyTextStartAlignment?: boolean;
  // private _emptyDataCache = new EmptyDataCache();
  _transpose = false;
  _showHeader = true;
  _recordsCount = 0;
  _table: ListTable;
  _hasAggregation: boolean = false;
  _hasAggregationOnTopCount: number = 0;
  _hasAggregationOnBottomCount: number = 0;
  /**层级维度结构显示形式 */
  rowHierarchyType?: 'grid' | 'tree';
  // 缓存行号列号对应的cellRange 需要注意当表头位置拖拽后 这个缓存的行列号已不准确 进行重置
  _cellRangeMap: Map<string, CellRange>; //存储单元格的行列号范围 针对解决是否为合并单元格情况
  constructor(table: ListTable, columns: ColumnsDefine, showHeader: boolean, hierarchyIndent: number) {
    this._cellRangeMap = new Map();
    this._showHeader = showHeader;
    this._table = table;
    this._columns = [];
    this._columnsIncludeHided = [];
    this._headerCellIds = [];
    this.hierarchyIndent = hierarchyIndent ?? 20;
    this.hierarchyTextStartAlignment = table.options.hierarchyTextStartAlignment;
    this.columnTree = new DimensionTree(columns as any, { seqId: 0 }, null); //seqId这里没有利用上 所有顺便传了0
    this._headerObjectsIncludeHided = this._addHeaders(0, columns, []);
    // this._headerObjectMapIncludeHided = this._headerObjectsIncludeHided.reduce((o, e) => {
    //   o[e.id as number] = e;
    //   return o;
    // }, {} as { [key in LayoutObjectId]: HeaderData });

    this._headerObjects = this._headerObjectsIncludeHided.filter(col => {
      return col.define.hide !== true;
    });
    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key in LayoutObjectId]: HeaderData });
    this.rowHierarchyType = checkHasTreeDefine(this) ? 'tree' : 'grid';
    this._hasAggregation = checkHasAggregation(this);
    this._hasAggregationOnBottomCount = checkHasAggregationOnBottom(this);
    this._hasAggregationOnTopCount = checkHasAggregationOnTop(this);
    // this._headerObjectFieldKey = this._headerObjects.reduce((o, e) => {
    //   o[e.fieldKey] = e;
    //   return o;
    // }, {} as { [key in string]: HeaderData });
    this.handleRowSeriesNumber(table.internalProps.rowSeriesNumber);
  }
  handleRowSeriesNumber(rowSeriesNumber: IRowSeriesNumber) {
    if (rowSeriesNumber) {
      if (Array.isArray(rowSeriesNumber)) {
        this.rowSeriesNumberColumn = rowSeriesNumber.map((seriesNumber, index) => {
          return {
            id: this.seqId++,
            title: seriesNumber.title,
            define: merge({ field: '_vtable_rowSeries_number_' + index }, seriesNumber),
            cellType: seriesNumber.cellType ?? 'text',
            headerType: rowSeriesNumber.cellType ?? 'text',
            style: seriesNumber.style,
            width: seriesNumber.width,
            format: seriesNumber.format,
            field: seriesNumber.field ?? '_vtable_rowSeries_number_' + index,
            icon: seriesNumber.icon,
            headerIcon: seriesNumber.headerIcon,
            isChildNode: false
          };
        });
      } else {
        this.rowSeriesNumberColumn = [
          {
            id: this.seqId++,
            title: rowSeriesNumber.title,
            define: merge({ field: '_vtable_rowSeries_number' }, rowSeriesNumber),
            cellType: rowSeriesNumber.cellType ?? 'text',
            headerType: rowSeriesNumber.cellType ?? 'text',
            style: rowSeriesNumber.style,
            width: rowSeriesNumber.width,
            format: rowSeriesNumber.format,
            field: '_vtable_rowSeries_number', //rowSeriesNumber.field,
            icon: rowSeriesNumber.icon,
            headerIcon: rowSeriesNumber.headerIcon,
            isChildNode: false
          }
        ];
      }
      this.leftRowSeriesNumberColumn = this.rowSeriesNumberColumn.filter(rowSeriesNumberItem => {
        // if (rowSeriesNumberItem.define.align === 'left' || !isValid(rowSeriesNumberItem.define.align)) {
        //   return true;
        // }
        return true;
      });
      this.rightRowSeriesNumberColumn = this.rowSeriesNumberColumn.filter(rowSeriesNumberItem => {
        // if (rowSeriesNumberItem.define.align === 'right') {
        //   return true;
        // }
        return false;
      });
      this.leftRowSeriesNumberColumnCount = this.leftRowSeriesNumberColumn.length;
      this.rightRowSeriesNumberColumnCount = this.rightRowSeriesNumberColumn.length;
    }
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
  isSeriesNumberInHeader(col: number, row: number): boolean {
    if (this.leftRowSeriesNumberColumnCount > 0 && col >= 0 && row >= 0 && col < this.leftRowSeriesNumberColumnCount) {
      if (this.transpose) {
        return false;
      } else if (row < this.headerLevelCount) {
        return true;
      }
    }
    if (
      this.rightRowSeriesNumberColumnCount > 0 &&
      row >= 0 &&
      col >= this.colCount - this.rightRowSeriesNumberColumnCount
    ) {
      if (this.transpose) {
        return false;
      } else if (row < this.headerLevelCount) {
        return true;
      }
    }
    return false;
  }
  isSeriesNumberInBody(col: number, row: number): boolean {
    if (this.leftRowSeriesNumberColumnCount > 0 && col >= 0 && col < this.leftRowSeriesNumberColumnCount) {
      if (this.transpose) {
        return true;
      }
      if (row >= this.headerLevelCount) {
        return true;
      }
    }
    if (this.rightRowSeriesNumberColumnCount > 0 && col >= this.colCount - this.rightRowSeriesNumberColumnCount) {
      if (this.transpose) {
        return true;
      }
      if (row >= this.headerLevelCount) {
        return true;
      }
    }
    return false;
  }
  isSeriesNumber(col: number, row: number): boolean {
    if (isValid(col) && isValid(row)) {
      if (
        this.leftRowSeriesNumberColumnCount > 0 &&
        col >= 0 &&
        row >= 0 &&
        col < this.leftRowSeriesNumberColumnCount
      ) {
        return true;
      }
      if (
        this.rightRowSeriesNumberColumnCount > 0 &&
        row >= 0 &&
        col >= this.colCount - this.rightRowSeriesNumberColumnCount
      ) {
        return true;
      }
    }
    return false;
  }
  getSeriesNumberHeader(col: number, row: number) {
    if (this.leftRowSeriesNumberColumnCount > 0 && col >= 0 && col < this.leftRowSeriesNumberColumnCount) {
      if (this.transpose) {
        return undefined;
      }
      if (row < this.headerLevelCount) {
        return Object.assign({}, this.leftRowSeriesNumberColumn[col], {
          style: Object.assign(
            {},
            this._table.transpose
              ? this._table.internalProps.theme.rowHeaderStyle
              : this._table.internalProps.theme.headerStyle,
            this._table.internalProps.rowSeriesNumber.headerStyle
          )
        });
      }
    }
    if (
      this.rightRowSeriesNumberColumnCount > 0 &&
      col >= this.colCount - this.rightRowSeriesNumberColumnCount &&
      row < this.headerLevelCount
    ) {
      if (this.transpose) {
        return undefined;
      }
      if (row < this.headerLevelCount) {
        return this.rightRowSeriesNumberColumn[col - (this.colCount - this.rightRowSeriesNumberColumnCount)];
      }
    }
    return undefined;
  }
  getSeriesNumberBody(col: number, row: number) {
    if (this.leftRowSeriesNumberColumnCount > 0 && col >= 0 && col < this.leftRowSeriesNumberColumnCount) {
      if (this.transpose) {
        return this.leftRowSeriesNumberColumn[col];
      }
      if (row >= this.headerLevelCount) {
        return this.leftRowSeriesNumberColumn[col];
      }
    }
    if (this.rightRowSeriesNumberColumnCount > 0 && col >= this.colCount - this.rightRowSeriesNumberColumnCount) {
      if (this.transpose) {
        return this.rightRowSeriesNumberColumn[col - (this.colCount - this.rightRowSeriesNumberColumnCount)];
      }
      if (row >= this.headerLevelCount) {
        return this.rightRowSeriesNumberColumn[col - (this.colCount - this.rightRowSeriesNumberColumnCount)];
      }
    }
    return undefined;
  }
  isHeader(col: number, row: number): boolean {
    if (
      this.transpose &&
      col >= this.leftRowSeriesNumberColumnCount &&
      col < this.headerLevelCount + this.leftRowSeriesNumberColumnCount
    ) {
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

  getAggregatorsByCell(col: number, row: number) {
    const column = this.getColumnDefine(col, row);
    const aggregators = (column as any).vtable_aggregator;
    return aggregators;
  }

  getAggregatorsByCellRange(startCol: number, startRow: number, endCol: number, endRow: number) {
    let aggregators: Aggregator[] = [];
    if (this.transpose) {
      for (let i = startRow; i <= endRow; i++) {
        const column = this.getColumnDefine(startCol, i) as any;
        if (column.vtable_aggregator) {
          aggregators = aggregators.concat(
            Array.isArray(column.vtable_aggregator) ? column.vtable_aggregator : [column.vtable_aggregator]
          );
        }
      }
    } else {
      for (let i = startCol; i <= endCol; i++) {
        const column = this.getColumnDefine(i, startRow) as any;
        if (column.vtable_aggregator) {
          aggregators = aggregators.concat(
            Array.isArray(column.vtable_aggregator) ? column.vtable_aggregator : [column.vtable_aggregator]
          );
        }
      }
      return aggregators;
    }
    return [];
  }
  getAggregatorOnTop(col: number, row: number) {
    const column = this.getColumnDefine(col, row);
    const aggregators = (column as any).vtable_aggregator;
    const aggregation = (column as ColumnDefine).aggregation;
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
    const column = this.getColumnDefine(col, row);
    const aggregators = (column as any).vtable_aggregator;
    const aggregation = (column as ColumnDefine).aggregation;
    if (Array.isArray(aggregation)) {
      const bottomAggregationIndexs = aggregation.reduce((indexs, agg, index) => {
        if (!agg.showOnTop) {
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
      return !(aggregation as Aggregation)?.showOnTop ? (aggregators as Aggregator) : null;
    } else if (!this.transpose && row - (this.rowCount - this.hasAggregationOnBottomCount) === 0) {
      return !(aggregation as Aggregation)?.showOnTop ? (aggregators as Aggregator) : null;
    }
    return null;
  }
  /**
   * 获取单元格所在行或者列中的聚合值的单元格地址
   * @param col
   * @param row
   * @returns
   */
  getAggregatorCellAddress(startCol: number, startRow: number, endCol: number, endRow: number) {
    const cellAddrs = [];
    const topCount = this.hasAggregationOnTopCount;
    const bottomCount = this.hasAggregationOnBottomCount;
    if (this.transpose) {
      for (let row = startRow; row <= endRow; row++) {
        const column = this.getColumnDefine(startCol, row) as any;
        if (column.vtable_aggregator) {
          for (let i = 0; i < topCount; i++) {
            cellAddrs.push({ col: this.headerLevelCount + i, row });
          }
          for (let i = 0; i < bottomCount; i++) {
            cellAddrs.push({ col: this.rowCount - bottomCount + i, row });
          }
        }
      }
    } else {
      for (let col = startCol; col <= endCol; col++) {
        const column = this.getColumnDefine(col, startRow) as any;
        if (column.vtable_aggregator) {
          for (let i = 0; i < topCount; i++) {
            cellAddrs.push({ col, row: this.headerLevelCount + i });
          }
          for (let i = 0; i < bottomCount; i++) {
            cellAddrs.push({ col, row: this.rowCount - bottomCount + i });
          }
        }
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
    if (
      this.transpose &&
      col >= this.leftRowSeriesNumberColumnCount &&
      col < this.headerLevelCount + this.leftRowSeriesNumberColumnCount
    ) {
      return true;
    }
    return false;
  }
  isColumnHeader(col: number, row: number): boolean {
    if (
      !this.transpose &&
      row >= 0 &&
      row <= this.headerLevelCount - 1 &&
      col >= this.leftRowSeriesNumberColumnCount &&
      col < this.colCount - this.rightRowSeriesNumberColumnCount
    ) {
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
  isLeftTopCorner(col: number, row: number): boolean {
    if (col >= 0 && col < this.frozenColCount && row >= 0 && row < this.frozenRowCount) {
      return true;
    }
    return false;
  }
  isLeftBottomCorner(col: number, row: number): boolean {
    if (col >= 0 && col < this.frozenColCount && row >= this.rowCount - this.bottomFrozenRowCount) {
      return true;
    }
    return false;
  }
  isRightTopCorner(col: number, row: number): boolean {
    if (col >= this.colCount - this.rightFrozenColCount && row >= 0 && row < this.frozenRowCount) {
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
    return this.transpose
      ? this.headerLevelCount +
          this.recordsCount +
          this.leftRowSeriesNumberColumnCount +
          this.rightRowSeriesNumberColumnCount
      : this._columns.length + this.leftRowSeriesNumberColumnCount + this.rightRowSeriesNumberColumnCount;
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
  get headerObjectsIncludeHided(): HeaderData[] {
    return this._headerObjectsIncludeHided;
  }
  //对比multi-layout 那个里面有columWidths对象，保持结构一致
  get columnWidths(): WidthData[] {
    if (this.leftRowSeriesNumberColumnCount) {
      const widths = this.leftRowSeriesNumberColumn.map(item => {
        return {
          width: item.width,
          minWidth: item.minWidth,
          maxWidth: item.maxWidth
        };
      });
      widths.push(
        ...this._columns.map(item => {
          return {
            width: item.width,
            minWidth: item.minWidth,
            maxWidth: item.maxWidth
          };
        })
      );
      return widths;
    }

    return this._columns.map(item => {
      return {
        width: item.width,
        minWidth: item.minWidth,
        maxWidth: item.maxWidth
      };
    });
  }

  getColumnWidthDefined(col: number): WidthData {
    if (col >= 0) {
      if (col < this.leftRowSeriesNumberColumnCount) {
        return this.leftRowSeriesNumberColumn[col];
      }
      if (this.transpose) {
        let width: string | number = 0;
        let maxWidth: string | number;
        let minWidth: string | number;
        if (col >= this.rowHeaderLevelCount + this.leftRowSeriesNumberColumnCount) {
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

      return this._columns[col - this.leftRowSeriesNumberColumnCount];
    }
    return undefined;
  }
  getCellId(col: number, row: number): LayoutObjectId {
    if (this.transpose) {
      if (col >= this.headerLevelCount + this.leftRowSeriesNumberColumnCount) {
        return this._columns[row]?.id;
      }
      if (this.isSeriesNumber(col, row)) {
        return row + '_series_number';
      }
      //in header
      return this._headerCellIds[col - this.leftRowSeriesNumberColumnCount]?.[row];
    }
    if (this.isSeriesNumber(col, row)) {
      return this.rowSeriesNumberColumn[col].id;
    }
    if (this.headerLevelCount <= row) {
      return this._columns[col - this.leftRowSeriesNumberColumnCount]?.id;
    }
    //in header
    return this._headerCellIds[row]?.[col - this.leftRowSeriesNumberColumnCount];
  }
  getHeader(col: number, row: number): HeaderData | SeriesNumberColumnData {
    if (this.isSeriesNumberInHeader(col, row)) {
      return this.getSeriesNumberHeader(col, row);
    }
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number]!;
  }
  getHeaderField(col: number, row: number) {
    if (this.isSeriesNumberInHeader(col, row)) {
      return this.getSeriesNumberHeader(col, row)?.field;
    } else if (this.isSeriesNumberInBody(col, row)) {
      return this.getSeriesNumberBody(col, row)?.field;
    }
    const id = this.getCellId(col, row);
    return (
      this._headerObjectMap[id as number]?.field ||
      (this.transpose
        ? this._columns[row] && this._columns[row].field
        : this._columns[col - this.leftRowSeriesNumberColumnCount] &&
          this._columns[col - this.leftRowSeriesNumberColumnCount].field)
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
          return { col: j + this.leftRowSeriesNumberColumnCount, row: i };
        }
      }
    }
    return undefined;
  }
  /** 根据field获取表头cell位置 */
  getHeaderCellAddressByField(field: string): CellAddress | undefined {
    const hd = this.headerObjects.find((col: any) => col && col.field === field);
    return hd && this.getHeaderCellAdressById(hd.id as number);
  }
  getBody(col: number, _row: number): ColumnData | SeriesNumberColumnData {
    if (this.isSeriesNumber(col, _row)) {
      return this.getSeriesNumberBody(col, _row);
    }
    return this.transpose ? this._columns[_row] : this._columns[col - this.leftRowSeriesNumberColumnCount];
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
      for (let col = this.leftRowSeriesNumberColumnCount; col < (this.colCount ?? 0); col++) {
        if (id === this._columns[col - this.leftRowSeriesNumberColumnCount].id) {
          return {
            start: { col, row: 0 },
            end: { col, row: 0 }
          };
        }
      }
    }
    return {
      start: { col: -1, row: -1 },
      end: { col: -1, row: -1 }
    };
    // throw new Error(`can not found body layout @id=${id as number}`);
  }
  getCellRange(col: number, row: number): CellRange {
    return getCellRange(col, row, this);
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
        const isAllHided = hd.columns.every((c: any) => c.hide);
        !isAllHided &&
          this._addHeaders(
            row + 1,
            hd.columns,
            [...roots, id],
            hd.hideColumnsSubHeader || hideColumnsSubHeader
          ).forEach(c => results.push(c));
      } else {
        const colDef = {
          id: this.seqId++,
          field: hd.field,
          // fieldKey: colDef.fieldKey,
          fieldFormat: hd.fieldFormat,
          width: hd.width,
          minWidth: hd.minWidth,
          maxWidth: hd.maxWidth,
          icon: hd.icon,
          cellType: hd.cellType ?? (hd as any).columnType ?? 'text',
          chartModule: 'chartModule' in hd ? hd.chartModule : null, // todo: 放到对应的column对象中
          chartSpec: 'chartSpec' in hd ? hd.chartSpec : null, // todo: 放到对应的column对象中
          sparklineSpec: 'sparklineSpec' in hd ? hd.sparklineSpec : DefaultSparklineSpec, // todo: 放到对应的column对象中
          style: hd.style,
          define: hd,
          columnWidthComputeMode: hd.columnWidthComputeMode,
          disableColumnResize: hd?.disableColumnResize,
          aggregation: hd.aggregation, //getAggregationForColumn(hd, col, this._table),
          isChildNode: row >= 1
        };
        this._columnsIncludeHided.push(colDef);
        if (hd.hide !== true) {
          this._columns.push(colDef);

          for (let r = row + 1; r < this._headerCellIds.length; r++) {
            this._headerCellIds[r][col] = id;
          }
        }
      }
    });
    return results;
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
    if (this.isSeriesNumber(col, row)) {
      return undefined;
    }
    let colPath: IListTableCellHeaderPaths['colHeaderPaths'] = [];
    let rowPath: IListTableCellHeaderPaths['rowHeaderPaths'] = [];
    if (!this.transpose) {
      colPath = [
        {
          field: this._columns[col - this.leftRowSeriesNumberColumnCount].field
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
      if (this.isSeriesNumberInBody(col - 1, row)) {
        return undefined;
      }
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
    if (this.isSeriesNumberInHeader(target.col, target.row) || this.isSeriesNumberInHeader(source.col, source.row)) {
      return false;
    } else if (
      !this.transpose &&
      this.isSeriesNumberInBody(target.col, target.row) &&
      this.isSeriesNumberInBody(source.col, source.row)
    ) {
      // return true;
      const sourceIndex = this.getRecordShowIndexByCell(0, source.row);
      const targetIndex = this.getRecordShowIndexByCell(0, target.row);
      const canMove = this._table.dataSource.canChangeOrder(sourceIndex, targetIndex);
      return canMove;
    } else if (
      this.transpose &&
      this.isSeriesNumberInBody(target.col, target.row) &&
      this.isSeriesNumberInBody(source.col, source.row)
    ) {
      // 如果是子节点之间相互换位置  则匹配表头最后一级
      if (
        this.getBody(source.col + this.leftRowSeriesNumberColumnCount, source.row).isChildNode &&
        this.getBody(target.col + this.leftRowSeriesNumberColumnCount, target.row).isChildNode
      ) {
        source.col = source.col + this.leftRowSeriesNumberColumnCount + this.rowHeaderLevelCount - 1;
        target.col = target.col + this.leftRowSeriesNumberColumnCount + this.rowHeaderLevelCount - 1;
      } else {
        // 为适应下面的判断逻辑 将col加至表格第一级
        source.col = source.col + this.leftRowSeriesNumberColumnCount;
        target.col = target.col + this.leftRowSeriesNumberColumnCount;
      }
    }
    if (source.col < 0 || source.row < 0 || target.col < 0 || target.row < 0) {
      return false;
    }
    if (this._table.internalProps.frozenColDragHeaderMode === 'disabled') {
      if (this._table.isFrozenColumn(target.col)) {
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
  moveHeaderPosition(
    source: CellAddress,
    target: CellAddress
  ): {
    sourceIndex: number;
    targetIndex: number;
    sourceSize: number;
    targetSize: number;
    moveType: 'column' | 'row';
  } {
    // 判断从source地址是否可以移动到target地址
    if (this.canMoveHeaderPosition(source, target)) {
      let sourceCellRange = this.getCellRange(source.col, source.row);
      // 对移动列表头 行表头 分别处理
      if (this.isColumnHeader(source.col, source.row)) {
        // source单元格包含的列数
        const sourceSize = sourceCellRange.end.col - sourceCellRange.start.col + 1;
        // 插入目标地址的列index
        let targetIndex;
        const targetCellRange = this.getCellRange(target.col, sourceCellRange.start.row);
        if (target.col >= source.col) {
          targetIndex = targetCellRange.end.col - sourceSize + 1;
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
          const sourceIds = this._headerCellIds[row].splice(
            sourceCellRange.start.col - this.leftRowSeriesNumberColumnCount,
            sourceSize
          );
          // 将source ids插入到目标地址targetCol处
          // 把sourceIds变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入sourceIds数组
          sourceIds.unshift(targetIndex - this.leftRowSeriesNumberColumnCount, 0);
          Array.prototype.splice.apply(this._headerCellIds[row], sourceIds);
        }
        //将_columns的列定义调整位置 同调整_headerCellIds逻辑
        const sourceColumns = this._columns.splice(
          sourceCellRange.start.col - this.leftRowSeriesNumberColumnCount,
          sourceSize
        );
        sourceColumns.unshift((targetIndex - this.leftRowSeriesNumberColumnCount) as any, 0 as any);
        Array.prototype.splice.apply(this._columns, sourceColumns);

        // 对表头columnTree调整节点位置
        this.columnTree.movePosition(
          sourceCellRange.start.row,
          sourceCellRange.start.col - this.leftRowSeriesNumberColumnCount,
          targetIndex - this.leftRowSeriesNumberColumnCount
        );
        this.columnTree.reset(this.columnTree.tree.children);
        this._cellRangeMap = new Map();
        return {
          sourceIndex: sourceCellRange.start.col,
          targetIndex,
          sourceSize,
          targetSize: targetCellRange.end.col - targetCellRange.start.col + 1,
          moveType: 'column'
        };
      } else if (
        this.isRowHeader(source.col, source.row) ||
        (this.isSeriesNumberInBody(source.col, source.row) && this.transpose)
      ) {
        if (this.isSeriesNumberInBody(source.col, source.row)) {
          sourceCellRange = this.getCellRange(source.col + this.leftRowSeriesNumberColumnCount, source.row); // 把拖拽转移到拖拽表头节点
        }
        // source单元格包含的列数
        const sourceSize = sourceCellRange.end.row - sourceCellRange.start.row + 1;
        // 插入目标地址的列index
        let targetIndex;
        const targetCellRange = this.getCellRange(sourceCellRange.start.col, target.row);
        if (target.row >= source.row) {
          targetIndex = targetCellRange.end.row - sourceSize + 1;
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
          const sourceIds = this._headerCellIds[row].splice(sourceCellRange.start.row, sourceSize);
          // 将source ids插入到目标地址targetCol处
          // 把sourceIds变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入sourceIds数组
          sourceIds.unshift(targetIndex, 0);
          Array.prototype.splice.apply(this._headerCellIds[row], sourceIds);
        }
        //将_columns的列定义调整位置 同调整_headerCellIds逻辑
        const sourceColumns = this._columns.splice(sourceCellRange.start.row, sourceSize);
        sourceColumns.unshift(targetIndex as any, 0 as any);
        Array.prototype.splice.apply(this._columns, sourceColumns);

        // 对表头columnTree调整节点位置
        this.columnTree.movePosition(
          sourceCellRange.start.col - this.leftRowSeriesNumberColumnCount,
          sourceCellRange.start.row,
          targetIndex + (target.row > source.row ? sourceCellRange.end.row - sourceCellRange.start.row : 0)
        );
        this.columnTree.reset(this.columnTree.tree.children);
        this._cellRangeMap = new Map();
        return {
          sourceIndex: sourceCellRange.start.row,
          targetIndex,
          sourceSize,
          targetSize: targetCellRange.end.row - targetCellRange.start.row + 1,
          moveType: 'row'
        };
      } else if (this.isSeriesNumberInBody(source.col, source.row)) {
        return {
          sourceIndex: source.row,
          targetIndex: target.row,
          sourceSize: 1,
          targetSize: 1,
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
    // const addCellPositions: any[] = [];
    // diffDataIndices.add.forEach(index => {
    //   if (
    //     this._table.frozenRowCount + index >= this._table.scenegraph.proxy.rowStart &&
    //     this._table.frozenRowCount + index <=
    //       Math.max(
    //         this._table.scenegraph.proxy.rowEnd,
    //         this._table.scenegraph.proxy.rowStart + this._table.scenegraph.proxy.rowLimit
    //       )
    //   ) {
    //     addCellPositions.push({ col: 0, row: this._table.frozenRowCount + index });
    //   }
    // });
    // const removeCellPositions: any[] = [];
    // diffDataIndices.remove.forEach(index => {
    //   if (
    //     this._table.frozenRowCount + index >= this._table.scenegraph.proxy.rowStart &&
    //     this._table.frozenRowCount + index <= this._table.scenegraph.proxy.rowEnd
    //   ) {
    //     removeCellPositions.push({ col: 0, row: this._table.frozenRowCount + index });
    //   }
    // });
    const addCellPositions = diffDataIndices.add.map(index => {
      return { col: 0, row: this._table.columnHeaderLevelCount + index };
    });
    const removeCellPositions = diffDataIndices.remove.map(index => {
      return { col: 0, row: this._table.columnHeaderLevelCount + index };
    });
    return {
      addCellPositions,
      removeCellPositions
    };
  }
  setChartInstance(_col: number, _row: number, chartInstance: any) {
    const columnObj = this.transpose ? this._columns[_row] : this._columns[_col - this.leftRowSeriesNumberColumnCount];
    if (typeof columnObj.chartSpec === 'function') {
      return;
    }
    columnObj.chartInstance = chartInstance;
  }

  getChartInstance(_col: number, _row: number) {
    const columnObj = this.transpose ? this._columns[_row] : this._columns[_col - this.leftRowSeriesNumberColumnCount];
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
    const chartSpec = (body as ColumnData)?.chartSpec;
    if (typeof chartSpec === 'function') {
      return false;
    }
    return true;
  }
  /** 是否当chart没有数据时 图表单元格不绘制chart的任何内容 如网格线 */
  isNoChartDataRenderNothing(col: number, row: number): boolean {
    const body = this.getBody(col, row);
    const noDataRenderNothing = ((body as ColumnData)?.define as ChartColumnDefine).noDataRenderNothing;
    return noDataRenderNothing;
  }
  getChartSpec(col: number, row: number) {
    return this.getRawChartSpec(col, row);
  }
  getRawChartSpec(col: number, row: number): any {
    const body = this.getBody(col, row);
    const chartSpec = (body as ColumnData)?.chartSpec;
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

  getColumnByKey(key: string): {
    col: number;
    columnDefine: ColumnData;
  } {
    let col;
    const result = this.columnObjects?.find((columnData: ColumnData, index) => {
      if (columnData.define?.key === key) {
        col = index;
        return true;
      }
      return false;
    });
    return {
      columnDefine: result,
      col
    };
  }

  getColumnDefine(col: number, row: number) {
    if (col >= 0) {
      if (col < this.leftRowSeriesNumberColumnCount) {
        return this.leftRowSeriesNumberColumn[col].define;
      }
      if (this.transpose) {
        return this._columns[row].define;
      }

      return this._columns[col - this.leftRowSeriesNumberColumnCount].define;
    }
    return undefined;
  }
}
