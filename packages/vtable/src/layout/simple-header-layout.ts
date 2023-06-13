/* eslint-disable sort-imports */
import type { ListTable } from '../ListTable';
import type { CellAddress, CellRange, CellType, IListTableCellHeaderPaths, LayoutObjectId } from '../ts-types';
import type { ColumnsDefine, TextColumnDefine } from '../ts-types/list-table/define';
import type {
  ColumnData,
  ColumnDefine,
  HeaderData,
  LayoutMapAPI,
  WidthData
} from '../ts-types/list-table/layout-map/api';
// import { EmptyDataCache } from './utils';

let seqId = 0;
export class SimpleHeaderLayoutMap implements LayoutMapAPI {
  private _headerObjects: HeaderData[];
  private _headerObjectMap: { [key in LayoutObjectId]: HeaderData };
  // private _headerObjectFieldKey: { [key in string]: HeaderData };
  private _headerCellIds: number[][];
  private _columns: ColumnData[];
  readonly bodyRowCount: number = 1;
  //透视表中树形结构使用 这里为了table逻辑不报错
  // rowHierarchyIndent?: number = 0;
  hierarchyIndent?: number; // 树形展示缩进值
  // private _emptyDataCache = new EmptyDataCache();
  _transpose = false;
  _showHeader = true;
  _recordsCount = 0;
  _table: ListTable;
  // 缓存行号列号对应的cellRange 需要注意当表头位置拖拽后 这个缓存的行列号已不准确 进行重置
  private _cellRangeMap: Map<string, CellRange>; //存储单元格的行列号范围 针对解决是否为合并单元格情况
  constructor(table: ListTable, columns: ColumnsDefine, showHeader: boolean, hierarchyIndent: number) {
    this._cellRangeMap = new Map();
    this._showHeader = showHeader;
    this._table = table;
    this._columns = [];
    this._headerCellIds = [];
    this.hierarchyIndent = hierarchyIndent ?? 20;
    this._headerObjects = this._addHeaders(0, columns, []);
    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key in LayoutObjectId]: HeaderData });
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
    if (this.transpose && col < this.headerLevelCount) {
      return true;
    }
    if (!this.transpose && row < this.headerLevelCount) {
      return true;
    }
    return false;
  }
  getCellType(col: number, row: number): CellType {
    if (this.isHeader(col, row)) {
      if (this.transpose) {
        return 'rowHeader';
      }
      return 'columnHeader';
    }
    return 'body';
  }
  isColumnHeader(col: number, row: number): boolean {
    if (!this.transpose && row < this.headerLevelCount) {
      return true;
    }
    return false;
  }

  isCornerHeader(col: number, row: number): boolean {
    return false;
  }
  isRowHeader(col: number, row: number): boolean {
    if (this.transpose && col < this.headerLevelCount) {
      return true;
    }
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
  get colCount(): number | undefined {
    //标准表格 列数是由表头定义的field决定的；如果是转置表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this.transpose ? this.headerLevelCount + this.recordsCount : this._columns.length;
  }
  get rowCount(): number | undefined {
    //转置表格 行数是由表头定义的field决定的；如果是标准表格，这个值么有地方用到，而且是由数据量决定的，在listTable中有定义这个值
    return this.transpose ? this._columns.length : this.headerLevelCount + this.recordsCount;
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
  getHeaderFieldKey(col: number, row: number) {
    const id = this.getCellId(col, row);
    return (
      this._headerObjectMap[id as number]?.fieldKey ||
      (this.transpose ? this._columns[row]?.fieldKey : this._columns[col]?.fieldKey)
    );
  }
  getHeaderField(col: number, row: number) {
    const id = this.getCellId(col, row);
    return (
      this._headerObjectMap[id as number]?.field ||
      (this.transpose ? this._columns[row] && this._columns[row].field : this._columns[col] && this._columns[col].field)
    );
  }
  getHeaderCellAdress(id: number): CellAddress | undefined {
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
    return this.getHeaderCellAdress(hd.id as number);
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
            if (value !== this.getBodyCellValue(col, r)) {
              break;
            }
            cellRange.start.row = r;
          }
          for (let r = row + 1; r < this.rowCount; r++) {
            if (value !== this.getBodyCellValue(col, r)) {
              break;
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
      if (this.headerLevelCount <= col && (this.columnObjects[row]?.define as TextColumnDefine)?.mergeCell) {
        const value = this.getBodyCellValue(col, row);
        for (let c = col - 1; c >= this.headerLevelCount; c--) {
          if (value !== this.getBodyCellValue(c, row)) {
            break;
          }
          result.start.col = c;
        }
        for (let c = col + 1; c < (this.colCount ?? 0); c++) {
          if (value !== this.getBodyCellValue(c, row)) {
            break;
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
  getRecordIndexByRow(col: number, row: number): number {
    if (this.transpose) {
      if (col < this.headerLevelCount) {
        return -1;
      }
      return col - this.headerLevelCount;
    }
    if (row < this.headerLevelCount) {
      return -1;
    }
    return row - this.headerLevelCount;
  }
  getRecordStartRowByRecordIndex(index: number): number {
    return this.headerLevelCount + index;
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
      const id = seqId++;
      const { captionIcon } = hd;
      const cell: HeaderData = {
        id,
        caption: hd.caption,
        captionIcon,
        headerIcon: hd.headerIcon,
        field: (hd as ColumnDefine).field,
        fieldKey: (hd as ColumnDefine)?.fieldKey,
        fieldFormat: (hd as ColumnDefine).fieldFormat,
        style: hd.headerStyle,
        headerType: hd.headerType ?? 'text',
        dropDownMenu: hd.dropDownMenu,
        define: hd,
        columnWidthComputeMode: hd.columnWidthComputeMode
        // iconPositionList:[]
      };
      results[id] = cell;
      for (let r = row - 1; r >= 0; r--) {
        this._headerCellIds[r][col] = roots[r];
      }
      if (!hideColumnsSubHeader) {
        rowCells[col] = id;
      } else {
        rowCells[col] = this._headerCellIds[row - 1][col];
      }
      if (hd.columns) {
        this._addHeaders(row + 1, hd.columns, [...roots, id], hd.hideColumnsSubHeader).forEach(c => results.push(c));
      } else {
        const colDef = hd;
        this._columns.push({
          id: seqId++,
          field: colDef.field,
          fieldKey: colDef.fieldKey,
          fieldFormat: colDef.fieldFormat,
          width: colDef.width,
          minWidth: colDef.minWidth,
          maxWidth: colDef.maxWidth,
          icon: colDef.icon,
          columnType: colDef.columnType ?? 'text',
          chartType: 'chartType' in colDef ? colDef.chartType : null, // todo: 放到对应的column对象中
          chartSpec: 'chartSpec' in colDef ? colDef.chartSpec : null, // todo: 放到对应的column对象中
          sparklineSpec: 'sparklineSpec' in colDef ? colDef.sparklineSpec : null, // todo: 放到对应的column对象中
          style: colDef.style,
          define: colDef,
          columnWidthComputeMode: colDef.columnWidthComputeMode,
          disableColumnResize: colDef?.disableColumnResize
        });
        for (let r = row + 1; r < this._headerCellIds.length; r++) {
          this._headerCellIds[r][col] = id;
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
      rowHeaderPaths: rowPath
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
   * @param col
   * @param row
   */
  toggleHierarchyState(col: number, row: number) {
    // do nothing
  }
}
