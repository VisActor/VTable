import type { Dataset } from '../dataset/dataset';
import { transpose } from '../tools/util';
import type { HeaderData, IndicatorData, LayoutMapAPI, WidthData } from '../ts-types/list-table/layout-map/api';
// import { EmptyDataCache } from './utils';
import type {
  CellAddress,
  CellRange,
  CellType,
  ICornerDefine,
  IDataConfig,
  IDimension,
  IIndicator,
  IPivotTableCellHeaderPaths,
  LayoutObjectId,
  ShowColumnRowType
} from '../ts-types';
import type { PivotTable } from '../PivotTable';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
/**
 * 简化配置，包含数据处理的 布局辅助计算类
 */
export class PivoLayoutMap implements LayoutMapAPI {
  private _headerObjects: HeaderData[] = [];
  private _headerObjectMap: { [key: LayoutObjectId]: HeaderData } = {};
  // private _emptyDataCache = new EmptyDataCache();
  private _indicatorObjects: IndicatorData[] = [];

  rowsDefine: (IDimension | string)[];
  columnsDefine: (IDimension | string)[];
  indicatorsDefine: (IIndicator | string)[];

  indicators: string[];

  _showRowHeader = true;
  _showColumnHeader = true;
  // transpose: boolean = false;
  /**
   * 通过indicatorsAsCol和hideIndicatorName判断指标值显示在column还是row 还是根本不显示
   */
  private _indicatorShowType: ShowColumnRowType = 'column';
  indicatorsAsCol = true;
  hideIndicatorName = false;
  indicatorDimensionKey: string;
  indicatorTitle: string;
  /**
   * 对应dataset中的rowKeys，行表头的每行表头键值，包含小计总计
   */
  private rowKeysPath: string[][];
  /**
   * 对应dataset中的colKeys，列表头的每列表头键值，包含小计总计
   */
  private colKeysPath: string[][];
  /**
   * 通过colKeys的二维数组，转置得到。这样就对应单元格横向结构
   */
  private convertColKeys: string[][];

  /**
   * 对应dataset中的rowAttrs，行表头对应的维度名
   */
  rows: string[];
  /**
   * 对应dataset中的colAttrs，列表头对应的维度名
   */
  columns: string[];
  /**
   * rowAttrs和指标显示的结合，如果指标显示在行表头，这里会比rowAttrs多一个值
   */
  private rowShowAttrs: string[];
  /**
   * rowAttrs和指标显示的结合，如果指标显示在列表头，这里会比colAttrs多一个值
   */
  private colShowAttrs: string[];
  /**
   * 对应dataset中的tree，body每一个单元格对应的计算结果
   */
  tree: any;

  dataset: Dataset;
  dataConfig: IDataConfig;

  _rowCount: number;
  _colCount: number;
  _bodyRowCount: number;

  // dimensions: IDimension[];
  cornerSetting: ICornerDefine;
  _table: PivotTable;
  constructor(table: PivotTable, dataset: Dataset) {
    this._table = table;
    this.rowsDefine = table.options.rows ?? [];
    this.columnsDefine = table.options.columns ?? [];
    this.indicatorsDefine = table.options.indicators ?? [];
    this.indicatorTitle = table.options.indicatorTitle;
    this.dataset = dataset;
    this.dataConfig = dataset.dataConfig;
    this.indicators = dataset.indicators;
    this.indicatorsAsCol = table.options.indicatorsAsCol ?? true;
    this.hideIndicatorName = table.options.hideIndicatorName ?? false;
    this.indicatorDimensionKey = IndicatorDimensionKeyPlaceholder;
    // this.dimensions = [];
    this.cornerSetting = table.options.corner ?? { titleOnDimension: 'column' };

    this.columns = dataset.columns;
    this.rows = dataset.rows;
    this.rowKeysPath = dataset.rowKeysPath;
    this.colKeysPath = dataset.colKeysPath;
    this.convertColKeys = transpose(this.colKeysPath);
    this.tree = dataset.tree;
    this.initState();
  }
  /**
   * 初始化该类的计算变量
   */
  private initState() {
    if (this.indicatorsAsCol && !this.hideIndicatorName) {
      this._indicatorShowType = 'column';
    } else if (!this.indicatorsAsCol && !this.hideIndicatorName) {
      this._indicatorShowType = 'row';
    } else {
      this._indicatorShowType = 'none';
    }

    this.colShowAttrs =
      this._indicatorShowType === 'column' ? this.columns.concat(this.indicatorDimensionKey) : this.columns;
    this.rowShowAttrs = this._indicatorShowType === 'row' ? this.rows.concat(this.indicatorDimensionKey) : this.rows;

    this._colCount =
      (this.colKeysPath.length === 0 ? 1 : this.colKeysPath.length) *
        (this.indicatorsAsCol ? this.indicators.length : 1) +
      this.rowHeaderLevelCount;
    this._rowCount =
      (this.rowKeysPath.length === 0 ? 1 : this.rowKeysPath.length) *
        (!this.indicatorsAsCol ? this.indicators.length : 1) +
      this.columnHeaderLevelCount;

    this._bodyRowCount = this.rowKeysPath.length * (!this.indicatorsAsCol ? this.indicators.length : 1);
    this.initHeaderObjects();
    this.initIndicatorObjects();
  }
  private getDimensionInfo(dimensionKey: string) {
    const dimensionInfo: IDimension =
      (this.rowsDefine?.find(dimension =>
        typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
      ) as IDimension) ??
      (this.columnsDefine?.find(dimension =>
        typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
      ) as IDimension);
    return dimensionInfo;
  }

  private getIndicatorInfo(indicatorKey: string, indicatorValue = '') {
    const indicatorInfo = this.indicatorsDefine?.find(indicator => {
      if (typeof indicator === 'string') {
        return false;
      }
      if (indicatorKey) {
        return indicator.indicatorKey === indicatorKey;
      }
      if (indicatorValue) {
        return indicator.caption === indicatorValue;
      }
      return false;
    }) as IIndicator;
    return indicatorInfo;
  }
  /**
   * 初始化_headerObjects
   */
  private initHeaderObjects() {
    /**行表头headerObject */
    for (let i = 0, len = this.rowKeysPath.length; i <= len - 1; i++) {
      const rowKey = this.rowKeysPath[i];
      for (let j = 0, len2 = rowKey.length; j <= len2 - 1; j++) {
        if (!this._headerObjectMap[rowKey[j]]) {
          const ids = rowKey[j].split(this.dataset.stringJoinChar);
          const dimensionInfo = this.getDimensionInfo(this.rows[ids.length - 1]);
          this._headerObjectMap[rowKey[j]] = {
            id: rowKey[j],
            field: <string>dimensionInfo?.dimensionKey ?? this.rows[ids.length - 1],
            caption: <string>ids[ids.length - 1],
            style: dimensionInfo?.headerStyle,
            define: {
              field: <string>dimensionInfo?.dimensionKey ?? this.rows[ids.length - 1],
              headerType: dimensionInfo?.headerType ?? 'text',
              columnType: 'text'
            }, //TODO 需要将define的用处 梳理清楚
            fieldFormat: dimensionInfo?.headerFormat,
            dropDownMenu: dimensionInfo?.dropDownMenu,
            headerType: dimensionInfo?.headerType ?? 'text',
            width: dimensionInfo?.width
          };
          this._headerObjects.push(this._headerObjectMap[rowKey[j]]);
        }
      }
    }
    /**列表头headerObject */
    for (let i = 0, len = this.colKeysPath.length; i <= len - 1; i++) {
      const colKey = this.colKeysPath[i];
      for (let j = 0, len2 = colKey.length; j <= len2 - 1; j++) {
        if (!this._headerObjectMap[colKey[j]]) {
          const ids = colKey[j].split(this.dataset.stringJoinChar);
          const dimensionInfo = this.getDimensionInfo(this.columns[ids.length - 1]);
          this._headerObjectMap[colKey[j]] = {
            id: colKey[j],
            field: <string>dimensionInfo?.dimensionKey ?? this.columns[ids.length - 1],
            caption: <string>ids[ids.length - 1],
            style: dimensionInfo?.headerStyle,
            define: {
              field: <string>dimensionInfo?.dimensionKey ?? this.columns[ids.length - 1],
              headerType: dimensionInfo?.headerType ?? 'text',
              columnType: 'text'
            },
            fieldFormat: dimensionInfo?.headerFormat,
            dropDownMenu: dimensionInfo?.dropDownMenu,
            headerType: dimensionInfo?.headerType ?? 'text',
            width: dimensionInfo?.width
          };
          this._headerObjects.push(this._headerObjectMap[colKey[j]]);
        }
      }
    }
    /**指标表头headerObject */
    // const indicatorDimensionInfo = this.getIndicatorInfo(this.indicatorDimensionKey);
    this.indicatorsDefine.forEach(indicator => {
      const indicatorKey = typeof indicator === 'string' ? indicator : indicator.indicatorKey;
      const indicatorInfo = typeof indicator === 'string' ? undefined : indicator;
      if (!this._headerObjectMap[indicatorKey]) {
        this._headerObjectMap[indicatorKey] = {
          id: indicatorKey,
          field: this.indicatorDimensionKey,
          caption: indicatorKey,
          style: indicatorInfo?.headerStyle, //?? indicatorDimensionInfo?.headerStyle,
          define: {
            field: this.indicatorDimensionKey,
            headerType: indicatorInfo?.headerType ?? 'text',
            columnType: 'text'
          },
          // fieldFormat: indicatorDimensionInfo?.headerFormat,
          dropDownMenu: indicatorInfo?.dropDownMenu,
          headerType: indicatorInfo?.headerType ?? 'text',
          width: indicatorInfo?.width
        };
        this._headerObjects.push(this._headerObjectMap[indicatorKey]);
      }
    });
    /**角表headerObject */
    let cornerAttrs;
    if (this.cornerSetting.titleOnDimension === 'column') {
      cornerAttrs = this.colShowAttrs;
    } else if (this.cornerSetting.titleOnDimension === 'row') {
      cornerAttrs = this.rowShowAttrs;
    }
    cornerAttrs.forEach(cornerAttrStr => {
      if (!this._headerObjectMap[cornerAttrStr]) {
        const dimensionInfo = this.getDimensionInfo(cornerAttrStr);
        this._headerObjectMap[cornerAttrStr] = {
          id: cornerAttrStr,
          field: cornerAttrStr,
          caption:
            cornerAttrStr === this.indicatorDimensionKey
              ? this.indicatorTitle
              : dimensionInfo?.dimensionTitle ?? cornerAttrStr,
          style: this.cornerSetting?.headerStyle,
          define: {
            field: cornerAttrStr,
            headerType: this.cornerSetting?.headerType ?? 'text',
            columnType: 'text'
          },
          dropDownMenu: dimensionInfo?.dropDownMenu,
          headerType: this.cornerSetting?.headerType ?? 'text',
          width: dimensionInfo?.width
        };
        this._headerObjects.push(this._headerObjectMap[cornerAttrStr]);
      }
    });
  }
  /**
   * 初始化_indicatorObjects
   */
  private initIndicatorObjects() {
    // const indicatorDimensionInfo = this.dimensions?.find(
    //   (dimension) => dimension.dimensionKey === this.indicatorDimensionKey
    // );
    this.indicators.forEach(indicatorStr => {
      const indicatorInfo = this.indicatorsDefine?.find(indicator => {
        if (typeof indicator === 'string') {
          return false;
        }
        return indicator.caption === indicatorStr;
      }) as IIndicator;
      this._indicatorObjects.push({
        id: indicatorStr,
        indicatorKey: indicatorStr,
        field: indicatorStr,
        define: { field: indicatorStr, headerType: 'text', columnType: indicatorInfo?.columnType ?? 'text' },
        fieldFormat: indicatorInfo?.format,
        columnType: indicatorInfo?.columnType ?? 'text',
        style: indicatorInfo?.style
      });
    });
  }
  get columnWidths(): WidthData[] {
    const returnWidths: WidthData[] = [];
    for (let i = 0; i < this.rowHeaderLevelCount; i++) {
      const dimension = this.getDimensionInfo(this.rowShowAttrs[i]) ?? this.getIndicatorInfo(this.rowShowAttrs[i]);
      returnWidths.push({ width: dimension?.width });
    }
    for (let j = 0; j < this.colCount - this.rowHeaderLevelCount; j++) {
      const indicator = this._indicatorObjects[j % this._indicatorObjects.length];
      returnWidths.push({ width: indicator?.width });
    }
    return returnWidths;
  }

  get showColumnHeader(): boolean {
    return this._showColumnHeader;
  }
  set showColumnHeader(_showColumnHeader: boolean) {
    this._showColumnHeader = _showColumnHeader;
  }
  get showRowHeader(): boolean {
    return this._showRowHeader;
  }
  set showRowHeader(_showRowHeader: boolean) {
    this._showRowHeader = _showRowHeader;
  }
  getCellType(col: number, row: number): CellType {
    if (this.isCornerHeader(col, row)) {
      return 'cornerHeader';
    } else if (this.isColumnHeader(col, row)) {
      return 'columnHeader';
    } else if (this.isRowHeader(col, row)) {
      return 'rowHeader';
    }
    return 'body';
  }

  isHeader(col: number, row: number): boolean {
    if (col < this.rowHeaderLevelCount) {
      return true;
    }
    if (row < this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  isCornerHeader(col: number, row: number): boolean {
    if (col < this.rowHeaderLevelCount && row < this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  isColumnHeader(col: number, row: number): boolean {
    if (col >= this.rowHeaderLevelCount && row < this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  /**
   * 是否为行表头，不包含角头
   * @param col
   * @param row
   * @returns
   */
  isRowHeader(col: number, row: number): boolean {
    if (col < this.rowHeaderLevelCount && row >= this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  /**
   * 判读是否为指标名称单元格。非角头部分，行表头或者列表头显示的指标名
   * @param col
   * @param row
   * @returns
   */
  isColumnIndicatorHeader(col: number, row: number): boolean {
    if (
      this._indicatorShowType === 'column' &&
      row === this.columnHeaderLevelCount - 1 &&
      col >= this.rowHeaderLevelCount
    ) {
      return true;
    }
    return false;
  }
  /**
   * 判读是否为指标名称单元格。非角头部分，行表头或者列表头显示的指标名
   * @param col
   * @param row
   * @returns
   */
  isRowIndicatorHeader(col: number, row: number): boolean {
    if (
      this._indicatorShowType === 'row' &&
      col === this.rowHeaderLevelCount - 1 &&
      row >= this.columnHeaderLevelCount
    ) {
      return true;
    }
    return false;
  }
  /**
   * 判读是否为指标名称单元格。非角头部分，行表头或者列表头显示的指标名
   * @param col
   * @param row
   * @returns
   */
  isIndicatorHeader(col: number, row: number): boolean {
    return this.isColumnIndicatorHeader(col, row) || this.isRowIndicatorHeader(col, row);
  }

  getColumnHeaderRange(): CellRange {
    return {
      start: { col: this.rowHeaderLevelCount, row: 0 },
      end: { col: this.colCount - 1, row: this.columnHeaderLevelCount - 1 }
    };
  }
  getRowHeaderRange(): CellRange {
    return {
      start: { col: 0, row: this.columnHeaderLevelCount },
      end: { col: this.rowHeaderLevelCount - 1, row: this.rowCount - 1 }
    };
  }
  getCornerHeaderRange(): CellRange {
    return {
      start: { col: 0, row: 0 },
      end: { col: this.rowHeaderLevelCount - 1, row: this.columnHeaderLevelCount - 1 }
    };
  }
  getBodyRange(): CellRange {
    return {
      start: { col: this.rowHeaderLevelCount, row: this.columnHeaderLevelCount },
      end: { col: this.colCount - 1, row: this.rowCount - 1 }
    };
  }
  resetCellIds() {
    // for (let row = 0; row < this.columnHeaderLevelCount; row++) {}
  }
  get headerLevelCount(): number {
    return this.columnHeaderLevelCount;
  }
  get columnHeaderLevelCount(): number {
    const colLevelCount = this.colShowAttrs.length;
    if (this.showColumnHeader) {
      return colLevelCount;
    }
    return 0;
  }
  get rowHeaderLevelCount(): number {
    const rowLevelCount = this.rowShowAttrs.length;
    if (this.showRowHeader) {
      return rowLevelCount;
    }
    return 0;
  }
  get colCount(): number {
    return this._colCount;
  }
  get rowCount(): number {
    return this._rowCount;
  }
  get bodyRowCount() {
    return this._bodyRowCount;
  }
  get headerObjects(): HeaderData[] {
    return this._headerObjects;
  }
  get columnObjects(): IndicatorData[] {
    return this._indicatorObjects;
  }
  /**
   * 其他layout文件这个函数返回的是id值，这里其实是返回的维度成员名
   * @param col
   * @param row
   * @returns
   */
  getCellId(col: number, row: number): LayoutObjectId {
    if (row >= 0 && col >= 0) {
      if (this.isCornerHeader(col, row)) {
        if (this.cornerSetting.titleOnDimension === 'column') {
          return this.colShowAttrs[row];
        } else if (this.cornerSetting.titleOnDimension === 'row') {
          return this.rowShowAttrs[col];
        }
      } else if (this.isColumnHeader(col, row)) {
        if (row < this.columns.length) {
          return this.convertColKeys[row][
            this.indicatorsAsCol
              ? Math.floor((col - this.rowHeaderLevelCount) / this.indicators.length)
              : col - this.rowHeaderLevelCount
          ];
        }
        return this.indicators[(col - this.rowHeaderLevelCount) % this.indicators.length];
      } else if (this.isRowHeader(col, row)) {
        if (col < this.rows.length) {
          return this.rowKeysPath[
            !this.indicatorsAsCol
              ? Math.floor((row - this.columnHeaderLevelCount) / this.indicators.length)
              : row - this.columnHeaderLevelCount
          ][col];
        }
        return this.indicators[(row - this.columnHeaderLevelCount) % this.indicators.length];
      }
    }
    return 0;
  }
  /**
   * 获取单元格所代表的指标名称
   * @param col
   * @param row
   * @returns
   */
  getIndicatorName(col: number, row: number) {
    if (this.isHeader(col, row)) {
      return '';
    }
    if (this.indicatorsAsCol) {
      const bodyCol = col - this.rowHeaderLevelCount;
      return this.indicators[bodyCol % this.indicators.length];
    }
    const bodyRow = row - this.columnHeaderLevelCount;
    return this.indicators[bodyRow % this.indicators.length];
  }
  getHeader(col: number, row: number): HeaderData {
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number]!;
  }
  getHeaderField(col: number, row: number) {
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number]?.field || this.getBody(col, row)?.field;
  }
  getHeaderFieldKey(col: number, row: number): undefined {
    return undefined;
  }
  getHeaderCellAdress(id: number): CellAddress | undefined {
    return undefined;
  }
  getHeaderCellAddressByField(field: string): CellAddress | undefined {
    throw new Error(`Method not implemented.${field}`);
  }
  getBody(_col: number, _row: number): IndicatorData {
    // const dimensionInfo = this.dimensions?.find((dimension: IDimension) => {
    //   return dimension.indicators?.length! > 0;
    // });
    // if (this.indicatorsAsCol)
    //   return this.indicators[
    //     (_col - this.rowHeaderLevelCount) % (dimensionInfo?.indicators?.length ?? 0)
    //   ];
    // return this.indicators[
    //   (_row - this.columnHeaderLevelCount) % (dimensionInfo?.indicators?.length ?? 0)
    // ];
    // const dimensionInfo = this.dimensions?.[this.indicatorDimensionKey];
    let indicatorInfo;
    if (this.indicatorsAsCol) {
      indicatorInfo = this.getIndicatorInfo(
        this?.indicators?.[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)]
      );
    } else {
      indicatorInfo = this.getIndicatorInfo(
        this?.indicators?.[(_row - this.columnHeaderLevelCount) % (this.indicators?.length ?? 0)]
      );
    }
    return {
      id: 0,
      indicatorKey: this.indicators[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)],
      field: this.indicators[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)],
      columnType: indicatorInfo?.columnType ?? 'text',
      style: indicatorInfo?.style,
      define: {
        field: this.indicators[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)],
        headerType: 'text',
        columnType: indicatorInfo?.columnType ?? 'text'
      }
    };
  }
  getBodyLayoutRangeById(id: LayoutObjectId): CellRange {
    for (let col = 0; col < (this.colCount ?? 0); col++) {
      if (id === this.columnObjects[col].id) {
        return {
          start: { col, row: 0 },
          end: { col, row: 0 }
        };
      }
    }

    throw new Error(`can not found body layout @id=${id as number}`);
  }
  /**
   * 这个结果直接影响合并单元格
   * 目前body部分 都按不合并
   * 指标名称isIndicator 不合并
   * 列表头部分，合并情况只考虑横向合并
   * 行表头部分，合并情况只考虑纵向合并
   * @param col
   * @param row
   * @returns
   */
  getCellRange(col: number, row: number): CellRange {
    const result: CellRange = { start: { col, row }, end: { col, row } };
    if (!this.isHeader(col, row) || col === -1 || row === -1 || this.isIndicatorHeader(col, row)) {
      return result;
    }

    //in header
    const id = this.getCellId(col, row);
    for (let c = col - 1; c >= 0; c--) {
      if (id !== this.getCellId(c, row)) {
        break;
      }
      result.start.col = c;
    }
    for (let c = col + 1; c < (this.colCount ?? 0); c++) {
      if (id !== this.getCellId(c, row)) {
        break;
      }
      result.end.col = c;
    }
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
  /**
   * 根据行号，得出body部分也就是数据部分 是第几条
   * @param row
   * @returns
   */
  getRecordIndexByRow(row: number): number {
    if (row < this.columnHeaderLevelCount) {
      return -1;
    }
    return this.indicatorsAsCol
      ? row - this.columnHeaderLevelCount
      : Math.floor((row - this.columnHeaderLevelCount) / this.indicators.length);
  }
  /**
   * 根据列号，得出body部分也就是数据部分 是第几条
   * @param col
   * @returns
   */
  getRecordIndexByCol(col: number): number {
    if (col < this.rowHeaderLevelCount) {
      return -1;
    }
    // return col - this.rowHeaderLevelCount;
    return !this.indicatorsAsCol
      ? col - this.rowHeaderLevelCount
      : Math.floor((col - this.rowHeaderLevelCount) / this.indicators.length);
  }
  getRecordStartRowByRecordIndex(index: number): number {
    return this.columnHeaderLevelCount + index;
  }

  // getCellRangeTranspose(): CellRange {
  //   return { start: { col: 0, row: 0 }, end: { col: 0, row: 0 } };
  // }
  /**
   * 计算一个单元格 行列维度信息
   * @param col
   * @param row
   * @returns
   */
  getCellHeaderPaths(col: number, row: number): IPivotTableCellHeaderPaths {
    const recordCol = this.getRecordIndexByCol(col);
    const recordRow = this.getRecordIndexByRow(row);
    let colPath;
    let rowPath;
    let colHeaderPaths;
    let rowHeaderPaths;
    if (recordCol >= 0) {
      colPath = this.colKeysPath[recordCol];
      colHeaderPaths = colPath?.[colPath.length - 1]?.split(this.dataset.stringJoinChar);
      if (row < this.columns.length - 1) {
        colHeaderPaths = colHeaderPaths.slice(0, row + 1);
      }
    }
    if (recordRow >= 0) {
      rowPath = this.rowKeysPath[recordRow];
      rowHeaderPaths = rowPath?.[rowPath.length - 1]?.split(this.dataset.stringJoinChar);
      if (col < this.rows.length - 1) {
        rowHeaderPaths = rowHeaderPaths.slice(0, col + 1);
      }
    }
    return {
      colHeaderPaths:
        colHeaderPaths.map((key: string) => {
          const isIndicatorKey = this._indicatorObjects.find(indicator => {
            indicator.indicatorKey === key;
          });
          return {
            dimensionKey: !isIndicatorKey ? key : undefined,
            indicatorKey: isIndicatorKey ? key : undefined,
            value: key
          };
        }) ?? [],
      rowHeaderPaths:
        rowHeaderPaths.map((key: string) => {
          const isIndicatorKey = this._indicatorObjects.find(indicator => {
            indicator.indicatorKey === key;
          });
          return {
            dimensionKey: !isIndicatorKey ? key : undefined,
            indicatorKey: isIndicatorKey ? key : undefined,
            value: key
          };
        }) ?? []
    };
  }
  getHeaderDimension(col: number, row: number): IDimension | undefined {
    if (this.isHeader(col, row)) {
      const header = this.getHeader(col, row);
      const dimension =
        this.rowsDefine?.find(dimension => typeof dimension !== 'string' && dimension.dimensionKey === header.field) ??
        this.columnsDefine?.find(dimension => typeof dimension !== 'string' && dimension.dimensionKey === header.field);
      return dimension as IDimension;
    }
    return undefined;
  }
  updateDataset(dataset: Dataset) {
    this.dataset = dataset;
    this.dataConfig = dataset.dataConfig;
    this.rowKeysPath = dataset.rowKeysPath;
    this.colKeysPath = dataset.colKeysPath;
    this.convertColKeys = transpose(this.colKeysPath);
    this.tree = dataset.tree;
    this.initState();
  }

  // 为列宽计算专用，兼容列表 对齐pivot-header-layout文件
  isHeaderForColWidth(col: number, row: number): boolean {
    return this.isHeader(col, row);
  }
  getHeaderForColWidth(col: number, row: number): HeaderData {
    return this.getHeader(col, row);
  }

  // TODO: 补充Header Move

  setChartInstance(_col: number, _row: number, chartInstance: any) {
    const paths = this.getCellHeaderPaths(_col, _row);
    let indicatorObj;
    if (this.indicatorsAsCol) {
      const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    } else {
      const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    }
    indicatorObj && (indicatorObj.chartInstance = chartInstance);
  }

  getChartInstance(_col: number, _row: number) {
    const paths = this.getCellHeaderPaths(_col, _row);
    let indicatorObj;
    if (this.indicatorsAsCol) {
      const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    } else {
      const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    }
    return indicatorObj?.chartInstance;
  }
}
