import type { Dataset } from '../dataset/dataset';
import { isValid, transpose } from '../tools/util';
import type { HeaderData, IndicatorData, LayoutMapAPI, WidthData } from '../ts-types/list-table/layout-map/api';
// import { EmptyDataCache } from './utils';
import type {
  CellAddress,
  CellRange,
  CellType,
  ICornerDefine,
  IDataConfig,
  IDimension,
  IDimensionInfo,
  IHeaderTreeDefine,
  IIndicator,
  IPivotTableCellHeaderPaths,
  ITitleDefine,
  LayoutObjectId,
  ShowColumnRowType
} from '../ts-types';
import type { PivotTable } from '../PivotTable';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
import type { PivotChart } from '../PivotChart';
import { cloneDeep } from '@visactor/vutils';
import { getAxisConfigInPivotChart } from './chart-helper/get-axis-config';
import { getChartAxes, getChartDataId, getChartSpec, getRawChartSpec } from './chart-helper/get-chart-spec';
import type { ITableAxisOption } from '../ts-types/component/axis';
/**
 * 简化配置，包含数据处理的 布局辅助计算类
 */

const EMPTY_HEADER: HeaderData = {
  isEmpty: true,
  id: undefined,
  field: undefined,
  headerType: undefined,
  define: undefined
};
export class PivotLayoutMap implements LayoutMapAPI {
  private _headerObjects: HeaderData[] = [];
  private _headerObjectMap: { [key: LayoutObjectId]: HeaderData } = {};
  // private _emptyDataCache = new EmptyDataCache();
  private _indicatorObjects: IndicatorData[] = [];
  private _columnWidths: WidthData[] = [];
  rowTree: IHeaderTreeDefine[];
  columnTree: IHeaderTreeDefine[];
  rowsDefine: (IDimension | string)[];
  columnsDefine: (IDimension | string)[];
  indicatorsDefine: (IIndicator | string)[];

  indicatorKeys: string[];

  _showRowHeader = true;
  _showColumnHeader = true;
  _rowHeaderTitle: ITitleDefine;
  _columnHeaderTitle: ITitleDefine;
  // transpose: boolean = false;
  /**
   * 通过indicatorsAsCol和hideIndicatorName判断指标值显示在column还是row 还是根本不显示
   */
  private _indicatorShowType: ShowColumnRowType = 'column';
  indicatorsAsCol = true;
  hideIndicatorName = false;
  indicatorDimensionKey: string = IndicatorDimensionKeyPlaceholder;
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
  _table: PivotTable | PivotChart;

  hasTwoIndicatorAxes: boolean;
  constructor(table: PivotTable | PivotChart, dataset: Dataset) {
    this._table = table;
    this.rowTree = table.options.rowTree;
    this.columnTree = table.options.columnTree;
    this.rowsDefine = table.options.rows ?? [];
    this.columnsDefine = table.options.columns ?? [];
    this.indicatorsDefine = table.options.indicators ?? [];
    this.indicatorTitle = table.options.indicatorTitle;
    this.dataset = dataset;
    this.dataConfig = dataset.dataConfig;
    this.indicatorKeys = dataset.indicatorKeys;
    this.indicatorsAsCol = table.options.indicatorsAsCol ?? true;
    this.hideIndicatorName = table.options.hideIndicatorName ?? false;
    this.showRowHeader = table.options.showRowHeader ?? true;
    this.showColumnHeader = table.options.showColumnHeader ?? true;
    this.rowHeaderTitle = table.options.rowHeaderTitle;
    this.columnHeaderTitle = table.options.columnHeaderTitle;
    // this.dimensions = [];
    this.cornerSetting = table.options.corner ?? { titleOnDimension: 'column' };

    this.columns = dataset.columns;
    this.rows = dataset.rows;
    this.rowKeysPath = dataset.rowKeysPath;
    this.colKeysPath = dataset.colKeysPath;

    this.tree = dataset.tree;
    this.initState();
    this.convertColKeys = transpose(this.colKeysPath);
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
      this._indicatorShowType === 'column' ? this.columns.concat(this.indicatorDimensionKey) : Array.from(this.columns);
    this.rowShowAttrs =
      this._indicatorShowType === 'row' ? this.rows.concat(this.indicatorDimensionKey) : Array.from(this.rows);

    this._bodyRowCount = this.rowKeysPath.length * (!this.indicatorsAsCol ? this.indicatorKeys.length : 1);
    this.initHeaderObjects();
    this.initIndicatorObjects();
    //#region 处理headerTitle
    if (this.rowHeaderTitle) {
      const cell_id = 'rowHeaderTitle';
      const caption =
        typeof this.rowHeaderTitle.title === 'string'
          ? this.rowHeaderTitle.title
          : (this.rowsDefine.reduce((title: string, value) => {
              if (typeof value === 'string') {
                return title;
              }
              return title + (title ? `/${value.dimensionTitle}` : `${value.dimensionTitle}`);
            }, '') as string);
      this._headerObjectMap[caption] = {
        id: caption,
        caption,
        field: cell_id,
        headerType: this.rowHeaderTitle.headerType ?? 'text',
        style: this.rowHeaderTitle.headerStyle,
        define: <any>{
          // id:
        }
      };
      this._headerObjectMap[cell_id] = {
        id: cell_id,
        caption: '',
        field: cell_id,
        headerType: this.cornerSetting.headerType ?? 'text',
        style: this.cornerSetting.headerStyle,
        define: <any>{
          // id:
        }
      };
      this._headerObjects.push(this._headerObjectMap[caption]);
      this._headerObjects.push(this._headerObjectMap[cell_id]);
      this.rowShowAttrs.unshift(cell_id);
      this.rowKeysPath.forEach((rowKey, index) => {
        rowKey.unshift(caption);
      });
    }
    if (this.columnHeaderTitle) {
      const cell_id = 'columnHeaderTitleCell';
      const caption =
        typeof this.columnHeaderTitle.title === 'string'
          ? this.columnHeaderTitle.title
          : (this.columnsDefine.reduce((title: string, value) => {
              if (typeof value === 'string') {
                return title;
              }
              return title + (title ? `/${value.dimensionTitle}` : `${value.dimensionTitle}`);
            }, '') as string);
      this._headerObjectMap[caption] = {
        id: caption,
        caption,
        field: cell_id,
        headerType: this.columnHeaderTitle.headerType ?? 'text',
        style: this.columnHeaderTitle.headerStyle,
        define: <any>{
          // id:
        }
      };
      this._headerObjectMap[cell_id] = {
        id: cell_id,
        caption: '',
        field: cell_id,
        headerType: this.cornerSetting.headerType ?? 'text',
        style: this.cornerSetting.headerStyle,
        define: <any>{
          // id:
        }
      };
      this._headerObjects.push(this._headerObjectMap[caption]);
      this._headerObjects.push(this._headerObjectMap[cell_id]);
      this.colShowAttrs.unshift(cell_id);
      this.colKeysPath.forEach((columnKey, index) => {
        columnKey.unshift(caption);
      });
    }

    if (this._table.isPivotChart()) {
      this.hasTwoIndicatorAxes = this._indicatorObjects.some(indicatorObject => {
        if (
          indicatorObject.chartSpec &&
          indicatorObject.chartSpec.series &&
          indicatorObject.chartSpec.series.length > 1
        ) {
          return true;
        }
        return false;
      });

      if (this.indicatorsAsCol) {
        const cell_id = 'rowHeaderEmpty';
        this._headerObjectMap[cell_id] = {
          id: cell_id,
          caption: '',
          field: cell_id,
          headerType: this.cornerSetting.headerType ?? 'text',
          style: this.cornerSetting.headerStyle,
          define: <any>{
            // id:
          }
        };
        this._headerObjects.push(this._headerObjectMap[cell_id]);
        this.rowShowAttrs.push(cell_id);

        // deal with sub indicator axis

        if (!this.hasTwoIndicatorAxes) {
          this.colShowAttrs.pop();
        }
      } else {
        const axisOption = ((this._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
          return axisOption.orient === 'left';
        });
        if (axisOption?.visible === false) {
          this.rowShowAttrs.pop();
        }
      }
    }

    //#endregion
    this._colCount =
      (this.colKeysPath.length === 0 ? 1 : this.colKeysPath.length) *
        (this.indicatorsAsCol ? this.indicatorKeys.length : 1) +
      this.rowHeaderLevelCount +
      this.rightFrozenColCount;
    this._rowCount =
      (this.rowKeysPath.length === 0 ? 1 : this.rowKeysPath.length) *
        (!this.indicatorsAsCol ? this.indicatorKeys.length : 1) +
      this.columnHeaderLevelCount +
      this.bottomFrozenRowCount;
    this.setColumnWidths();
  }
  private setColumnWidths() {
    const returnWidths: WidthData[] = new Array(this.colCount).fill(undefined);
    if (this.showRowHeader) {
      if (this.rowHeaderTitle) {
        returnWidths[0] = {};
      }
      this.rowShowAttrs.forEach((objKey, index) => {
        const dimension = this.rowsDefine?.find(dimension =>
          typeof dimension === 'string' ? false : dimension.dimensionKey === objKey
        ) as IDimension;
        dimension &&
          (returnWidths[index + (this.rowHeaderTitle ? 1 : 0)] = {
            width: dimension.width,
            minWidth: dimension.minWidth,
            maxWidth: dimension.maxWidth
          });
      });
    }
    if (this.indicatorsAsCol) {
      for (let i = this.rowHeaderLevelCount; i < this.colCount; i++) {
        const cellDefine = this.getBody(i, this.columnHeaderLevelCount);
        returnWidths[i] = {
          width: cellDefine?.width,
          minWidth: cellDefine?.minWidth,
          maxWidth: cellDefine?.maxWidth
        };
      }
    } else {
      let width: string | number = 0;
      let maxWidth: string | number;
      let minWidth: string | number;
      let isAuto;
      this._indicatorObjects.forEach((obj, index) => {
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
      returnWidths.fill({ width, minWidth, maxWidth }, this.rowHeaderLevelCount, this.colCount);
    }
    this._columnWidths = returnWidths;
  }
  get columnWidths(): WidthData[] {
    return this._columnWidths;
  }
  getColumnWidthDefined(col: number): WidthData {
    return this._columnWidths[col];
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

  getIndicatorInfo(indicatorKey: string, indicatorValue = '') {
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

  getColKeysPath() {
    return this.colKeysPath;
  }
  getRowKeysPath() {
    return this.rowKeysPath;
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
          caption: indicatorInfo.caption ?? indicatorKey,
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
    this.indicatorKeys.forEach(indicatorKey => {
      const indicatorInfo = this.indicatorsDefine?.find(indicator => {
        if (typeof indicator === 'string') {
          return false;
        }
        return indicator.indicatorKey === indicatorKey;
      }) as IIndicator;
      this._indicatorObjects.push({
        id: indicatorKey,
        indicatorKey: indicatorKey,
        field: indicatorKey,
        define: Object.assign(
          { field: indicatorKey, headerType: 'text', columnType: indicatorInfo?.columnType ?? 'text' },
          indicatorInfo as any
        ),
        fieldFormat: indicatorInfo?.format,
        columnType: indicatorInfo?.columnType ?? 'text',
        chartType: indicatorInfo && ('chartType' in indicatorInfo ? indicatorInfo.chartType : null),
        chartSpec: indicatorInfo && ('chartSpec' in indicatorInfo ? indicatorInfo.chartSpec : null),
        sparklineSpec: 'sparklineSpec' in indicatorInfo ? indicatorInfo.sparklineSpec : null,
        style: indicatorInfo?.style,
        icon: indicatorInfo?.icon,
        width: indicatorInfo?.width,
        minWidth: indicatorInfo?.minWidth,
        maxWidth: indicatorInfo?.maxWidth,
        disableColumnResize: indicatorInfo?.disableColumnResize
      });
    });
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
  get columnHeaderTitle(): ITitleDefine {
    return this._columnHeaderTitle;
  }
  set columnHeaderTitle(_columnHeaderTitle: ITitleDefine) {
    this._columnHeaderTitle = _columnHeaderTitle;
  }
  get rowHeaderTitle(): ITitleDefine {
    return this._rowHeaderTitle;
  }
  set rowHeaderTitle(_rowHeaderTitle: ITitleDefine) {
    this._rowHeaderTitle = _rowHeaderTitle;
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
    if (col >= this.colCount - this.rightFrozenColCount) {
      return true;
    }
    if (row >= this.rowCount - this.bottomFrozenRowCount) {
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
  isRightFrozenColumn(col: number, row: number): boolean {
    if (
      col >= this.colCount - this.rightFrozenColCount &&
      row >= this.columnHeaderLevelCount &&
      row < this.rowCount - this.bottomFrozenRowCount
    ) {
      return true;
    }
    return false;
  }
  isBottomFrozenRow(col: number, row: number): boolean {
    if (
      col >= this.rowHeaderLevelCount &&
      row >= this.rowCount - this.bottomFrozenRowCount &&
      col < this.colCount - this.rightFrozenColCount
    ) {
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
      const count = !this.indicatorsAsCol
        ? colLevelCount
        : this.hideIndicatorName //设置隐藏表头，且表头最下面一级就是指标维度 则-1
        ? this.colShowAttrs[this.colShowAttrs.length - 1] === this.indicatorDimensionKey
          ? colLevelCount - 1
          : colLevelCount
        : colLevelCount;

      // if (this.indicatorsAsCol && this._table.isPivotChart()) {
      //   // 指标在列上，指标及其对应坐标轴显示在底部，下侧冻结行数为1；
      //   // 如果指标对应两个轴，则第二个轴显示在上部，columnHeaderLevelCount不变，否则columnHeader不显示指标，columnHeaderLevelCount - 1
      //   // count -= 1;
      // } else if (this._table.isPivotChart()) {
      //   // 指标在行上，维度对应坐标轴显示在底部，下侧冻结行数为1，上侧不变
      // }

      return count;
    }
    return 0;
  }
  get rowHeaderLevelCount(): number {
    const rowLevelCount = this.rowShowAttrs.length;
    if (this.showRowHeader) {
      const count = this.indicatorsAsCol
        ? rowLevelCount
        : this.hideIndicatorName //设置隐藏表头，且表头最下面一级就是指标维度 则-1
        ? this.rowShowAttrs[this.rowShowAttrs.length - 1] === this.indicatorDimensionKey
          ? rowLevelCount - 1
          : rowLevelCount
        : rowLevelCount;

      // if (this.indicatorsAsCol && this._table.isPivotChart()) {
      //   // 指标在列上，维度对应坐标轴显示在左侧，rowHeaderLevelCount + 1；
      //   count += 1;
      // } else if (this._table.isPivotChart()) {
      //   // 指标在行上，指标对应坐标轴显示在左侧指标单元格，rowHeaderLevelCount不变
      // }

      return count;
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
  get bottomFrozenRowCount(): number {
    if (!this._table.isPivotChart()) {
      return 0;
    }
    const axisOption = ((this._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      return axisOption.orient === 'bottom';
    });
    if (axisOption?.visible === false) {
      return 0;
    }
    if (this.indicatorsAsCol) {
      // 指标在列上，指标及其对应坐标轴显示在底部，下侧冻结行数为1
      return 1;
    }
    return 1; // 指标在行上，维度对应坐标轴显示在底部，下侧冻结行数为1
  }
  get rightFrozenColCount(): number {
    if (!this._table.isPivotChart()) {
      return 0;
    }
    const axisOption = ((this._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      return axisOption.orient === 'right';
    });
    if (axisOption?.visible === false) {
      return 0;
    }

    if (this.indicatorsAsCol) {
      return 0; // 指标在列上，没有图表需要显示右轴
    } else if (this.hasTwoIndicatorAxes) {
      // 查找指标，判断是否有双轴情况，如果有，则右侧冻结列数为1
      return 1;
    }
    return 0;
  }
  get leftAxesCount(): number {
    if (!this._table.isPivotChart()) {
      return 0;
    }
    const axisOption = ((this._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      return axisOption.orient === 'left';
    });
    if (axisOption?.visible === false) {
      return 0;
    }
    if (this.indicatorsAsCol) {
      return 1; // 左侧维度轴
    }
    return 1; // 左侧主指标轴
  }
  get topAxesCount(): number {
    if (!this._table.isPivotChart()) {
      return 0;
    }
    const axisOption = ((this._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      return axisOption.orient === 'top';
    });
    if (axisOption?.visible === false) {
      return 0;
    }
    if (this.indicatorsAsCol && this.hasTwoIndicatorAxes) {
      return 1; // 顶部副指标
    }
    return 0; // 顶部无轴
  }
  get rightAxesCount(): number {
    return this.rightFrozenColCount;
  }
  get bottomAxesCount(): number {
    return this.bottomFrozenRowCount;
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
    if (
      (col < this.rowHeaderLevelCount && row >= this.rowCount - this.bottomFrozenRowCount) ||
      (row < this.columnHeaderLevelCount && col >= this.colCount - this.rightFrozenColCount)
    ) {
      return 0;
    }
    if (row >= 0 && col >= 0) {
      if (this.isCornerHeader(col, row)) {
        if (this.cornerSetting.titleOnDimension === 'column') {
          return this.colShowAttrs[row];
        } else if (this.cornerSetting.titleOnDimension === 'row') {
          return this.rowShowAttrs[col];
        }
      } else if (this.isColumnHeader(col, row)) {
        if (row < this.columns.length + (this.columnHeaderTitle ? 1 : 0)) {
          return this.convertColKeys[row][
            this.indicatorsAsCol
              ? Math.floor((col - this.rowHeaderLevelCount) / this.indicatorKeys.length)
              : col - this.rowHeaderLevelCount
          ];
        }
        return this.indicatorKeys[(col - this.rowHeaderLevelCount) % this.indicatorKeys.length];
      } else if (this.isRowHeader(col, row)) {
        if (col < this.rows.length + (this.rowHeaderTitle ? 1 : 0)) {
          return this.rowKeysPath[
            !this.indicatorsAsCol
              ? Math.floor((row - this.columnHeaderLevelCount) / this.indicatorKeys.length)
              : row - this.columnHeaderLevelCount
          ][col];
        }
        return this.indicatorKeys[(row - this.columnHeaderLevelCount) % this.indicatorKeys.length];
      } else if (this.isRightFrozenColumn(col, row)) {
        if (!this.indicatorsAsCol) {
          return this.indicatorKeys[(row - this.columnHeaderLevelCount) % this.indicatorKeys.length];
        }
        return this.rowKeysPath[row - this.columnHeaderLevelCount][this.rowHeaderLevelCount - 1];
      } else if (this.isBottomFrozenRow(col, row)) {
        if (this.indicatorsAsCol) {
          return this.indicatorKeys[(col - this.rowHeaderLevelCount) % this.indicatorKeys.length];
        }
        return this.convertColKeys[this.columnHeaderLevelCount - 1][
          Math.floor((col - this.rowHeaderLevelCount) / this.indicatorKeys.length)
        ];
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
  getIndicatorKey(col: number, row: number) {
    if (this.isHeader(col, row)) {
      return '';
    }
    if (this.indicatorsAsCol) {
      const bodyCol = col - this.rowHeaderLevelCount;
      return this.indicatorKeys[bodyCol % this.indicatorKeys.length];
    }
    const bodyRow = row - this.columnHeaderLevelCount;
    return this.indicatorKeys[bodyRow % this.indicatorKeys.length];
  }
  getHeader(col: number, row: number): HeaderData {
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number]! ?? EMPTY_HEADER;
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
  // getBody(_col: number, _row: number): IndicatorData {
  //   // const dimensionInfo = this.dimensions?.find((dimension: IDimension) => {
  //   //   return dimension.indicators?.length! > 0;
  //   // });
  //   // if (this.indicatorsAsCol)
  //   //   return this.indicators[
  //   //     (_col - this.rowHeaderLevelCount) % (dimensionInfo?.indicators?.length ?? 0)
  //   //   ];
  //   // return this.indicators[
  //   //   (_row - this.columnHeaderLevelCount) % (dimensionInfo?.indicators?.length ?? 0)
  //   // ];
  //   // const dimensionInfo = this.dimensions?.[this.indicatorDimensionKey];
  //   let indicatorInfo;
  //   if (this.indicatorsAsCol) {
  //     indicatorInfo = this.getIndicatorInfo(
  //       this?.indicators?.[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)]
  //     );
  //   } else {
  //     indicatorInfo = this.getIndicatorInfo(
  //       this?.indicators?.[(_row - this.columnHeaderLevelCount) % (this.indicators?.length ?? 0)]
  //     );
  //   }
  //   return {
  //     id: 0,
  //     indicatorKey: this.indicators[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)],
  //     field: this.indicators[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)],
  //     columnType: indicatorInfo?.columnType ?? 'text',
  //     style: indicatorInfo?.style,
  //     define: {
  //       field: this.indicators[(_col - this.rowHeaderLevelCount) % (this.indicators?.length ?? 0)],
  //       headerType: 'text',
  //       columnType: indicatorInfo?.columnType ?? 'text'
  //     }
  //   };
  // }
  getBody(_col: number, _row: number): IndicatorData {
    // let indicatorData;
    //正常情况下 通过行号或者列号可以取到Indicator的配置信息 但如果指标在前维度在后的情况下（如风神：列配置【指标名称，地区】） indicators中的数量是和真正指标值一样数量
    // if (this.indicatorsAsCol) indicatorData = this.indicators[_col - this.rowHeaderLevelCount];
    // else indicatorData = this.indicators[_row - this.columnHeaderLevelCount];
    // if (indicatorData) return indicatorData;
    const paths = this.getCellHeaderPaths(_col, _row);
    if (this.indicatorsAsCol) {
      const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
      return (
        this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey) ??
        this._indicatorObjects[0] ?? {
          id: '',
          field: undefined,
          indicatorKey: undefined,
          columnType: undefined,
          define: undefined
        }
      );
    }
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    return (
      this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey) ??
      this._indicatorObjects[0] ?? {
        id: '',
        field: undefined,
        indicatorKey: undefined,
        columnType: undefined,
        define: undefined
      }
    );
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
      : Math.floor((row - this.columnHeaderLevelCount) / this.indicatorKeys.length);
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
      : Math.floor((col - this.rowHeaderLevelCount) / this.indicatorKeys.length);
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
    if (colHeaderPaths && this.indicatorsAsCol && col >= this.rowHeaderLevelCount) {
      colHeaderPaths.push(this.indicatorKeys[(col - this.rowHeaderLevelCount) % this.indicatorKeys.length]);
    } else if (rowHeaderPaths && row >= this.columnHeaderLevelCount) {
      rowHeaderPaths.push(this.indicatorKeys[(row - this.columnHeaderLevelCount) % this.indicatorKeys.length]);
    }
    return {
      colHeaderPaths:
        colHeaderPaths?.map((key: string, index: number) => {
          const indicatorObject = this._indicatorObjects.find(indicator => indicator.indicatorKey === key);
          return {
            dimensionKey: !indicatorObject ? this.colShowAttrs[index] : undefined,
            indicatorKey: indicatorObject ? key : undefined,
            value: !indicatorObject ? key : (indicatorObject.define.caption as string)
          };
        }) ?? [],
      rowHeaderPaths:
        rowHeaderPaths?.map((key: string, index: number) => {
          const indicatorObject = this._indicatorObjects.find(indicator => indicator.indicatorKey === key);
          return {
            dimensionKey: !indicatorObject ? this.rowShowAttrs[index] : undefined,
            indicatorKey: indicatorObject ? key : undefined,
            value: !indicatorObject ? key : (indicatorObject.define.caption as string)
          };
        }) ?? []
    };
  }
  /**
   * 通过dimensionPath获取到对应的表头地址col row, dimensionPath不要求必须按照表头层级顺序传递
   * @param dimensions
   * @returns
   */
  getCellAdressByHeaderPath(
    dimensionPaths:
      | {
          colHeaderPaths: IDimensionInfo[];
          rowHeaderPaths: IDimensionInfo[];
        }
      | IDimensionInfo[]
  ): CellAddress | undefined {
    let colHeaderPaths;
    let rowHeaderPaths;
    if (Array.isArray(dimensionPaths)) {
      if (dimensionPaths.length > this.rowShowAttrs.length + this.colShowAttrs.length) {
        //如果传入的path长度比行列维度层级多的话 无法匹配
        return undefined;
      }
      // 如果传入的是整体的path 按照行列维度区分开
      colHeaderPaths = dimensionPaths.filter(
        (path: IDimensionInfo) => this.colShowAttrs.indexOf(path.dimensionKey) >= 0
      );
      rowHeaderPaths = dimensionPaths.filter(
        (path: IDimensionInfo) => this.rowShowAttrs.indexOf(path.dimensionKey) >= 0
      );
    } else {
      colHeaderPaths = dimensionPaths.colHeaderPaths;
      rowHeaderPaths = dimensionPaths.rowHeaderPaths;
    }

    if (!Array.isArray(colHeaderPaths) && !Array.isArray(rowHeaderPaths)) {
      return undefined;
    }
    // 行列维度path根据key排序
    colHeaderPaths?.sort((a, b) => {
      return (
        this.colShowAttrs.indexOf(a.dimensionKey ?? this.indicatorDimensionKey) -
        this.colShowAttrs.indexOf(b.dimensionKey ?? this.indicatorDimensionKey)
      );
    });
    rowHeaderPaths?.sort((a, b) => {
      return (
        this.rowShowAttrs.indexOf(a.dimensionKey ?? this.indicatorDimensionKey) -
        this.rowShowAttrs.indexOf(b.dimensionKey ?? this.indicatorDimensionKey)
      );
    });
    let needLowestLevel = false; // needLowestLevel来标记是否需要 提供到最底层的维度层级信息
    // 如果行列维度都有值 说明是匹配body单元格 那这个时候 维度层级应该是满的
    if (colHeaderPaths?.length >= 1 && rowHeaderPaths?.length >= 1) {
      needLowestLevel = true;
    }
    //这里相当于默认了行列号为0
    let col = 0;
    let row = 0;
    let defaultCol;
    let defaultRow;
    let rowTree = this.rowTree;
    let columnTree = this.columnTree;
    let toFindIndicator;
    // 按照colHeaderPaths维度层级寻找到底层维度值节点
    if (colHeaderPaths) {
      for (let i = 0; i < colHeaderPaths.length; i++) {
        const colDimension = colHeaderPaths[i];
        if (colDimension.indicatorKey) {
          toFindIndicator = colDimension.indicatorKey;
          break;
        }
        for (let j = 0; j < columnTree.length; j++) {
          const dimension = columnTree[j];
          if (
            !isValid(colDimension.indicatorKey) &&
            dimension.dimensionKey === colDimension.dimensionKey &&
            dimension.value === colDimension.value
          ) {
            columnTree = dimension.children;
            if (!columnTree || columnTree.length === 0 || columnTree?.[0]?.indicatorKey) {
              col += j;
            }
            break;
          }
          col += dimension.children?.[0]?.indicatorKey ? 0 : dimension.children?.length ?? 0;
        }
      }
    }
    // 按照rowHeaderPaths维度层级寻找到底层维度值节点
    if (rowHeaderPaths) {
      for (let i = 0; i < rowHeaderPaths.length; i++) {
        const rowDimension = rowHeaderPaths[i];
        if (rowDimension.indicatorKey) {
          toFindIndicator = rowDimension.indicatorKey;
          break;
        }
        // 判断级别，找到distDimension
        // let isCol = false;
        for (let j = 0; j < rowTree.length; j++) {
          const dimension = rowTree[j];
          if (
            !isValid(rowDimension.indicatorKey) &&
            dimension.dimensionKey === rowDimension.dimensionKey &&
            dimension.value === rowDimension.value
          ) {
            rowTree = dimension.children;
            if (!rowTree || rowTree.length === 0 || rowTree?.[0]?.indicatorKey) {
              row += j;
            }
            break;
          }
          row += dimension.children?.[0]?.indicatorKey ? 0 : dimension.children?.length ?? 0;
        }
      }
    }
    col =
      (this.indicatorsAsCol ? col * this.indicatorKeys.length + this.indicatorKeys.indexOf(toFindIndicator) : col) +
      this.rowHeaderLevelCount;

    row =
      (!this.indicatorsAsCol ? row * this.indicatorKeys.length + this.indicatorKeys.indexOf(toFindIndicator) : row) +
      this.columnHeaderLevelCount;
    if (isValid(col) || isValid(row)) {
      return { col: col ?? defaultCol, row: row ?? defaultRow };
    }
    return undefined;
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
    this.tree = dataset.tree;
    this._indicatorObjects = [];
    this._headerObjects = [];
    this._headerObjectMap = {};
    this.initState();
    this.convertColKeys = transpose(this.colKeysPath);
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

  //#region pivot chart 区别于 pivot table 的特有方法
  /** 将_selectedDataItemsInChart保存的数据状态同步到各个图表实例中 */
  _generateChartState() {
    const state = {
      vtable_selected: {
        filter: (datum: any) => {
          if ((this._table as PivotChart)._selectedDataItemsInChart.length >= 1) {
            const match = (this._table as PivotChart)._selectedDataItemsInChart.find(item => {
              for (const itemKey in item) {
                if (item[itemKey] !== datum[itemKey]) {
                  return false;
                }
              }
              return true;
            });
            return !!match;
          } else if ((this._table as PivotChart)._selectedDimensionInChart.length) {
            // 判断维度点击
            const match = (this._table as PivotChart)._selectedDimensionInChart.every(item => {
              if (datum[item.key] !== item.value) {
                return false;
              }
              return true;
            });
            return !!match;
          }
          return false;
        }
      },
      vtable_selected_reverse: {
        filter: (datum: any) => {
          if ((this._table as PivotChart)._selectedDataItemsInChart.length >= 1) {
            const match = (this._table as PivotChart)._selectedDataItemsInChart.find(item => {
              for (const itemKey in item) {
                if (item[itemKey] !== datum[itemKey]) {
                  return false;
                }
              }
              return true;
            });
            return !match;
          } else if ((this._table as PivotChart)._selectedDimensionInChart.length) {
            // 判断维度点击
            const match = (this._table as PivotChart)._selectedDimensionInChart.every(item => {
              if (datum[item.key] !== item.value) {
                return false;
              }
              return true;
            });
            return !match;
          }
          return false;
        }
      }
    };
    return state;
  }
  updateDataStateToChartInstance(activeChartInstance?: any): void {
    if (!activeChartInstance) {
      activeChartInstance = (this._table as PivotChart)._getActiveChartInstance();
    }
    const state = this._generateChartState();
    this._indicatorObjects.forEach((_indicatorObject: IndicatorData) => {
      const chartInstance = _indicatorObject.chartInstance;
      chartInstance.updateState(state);
    });
    activeChartInstance?.updateState(state);
  }
  updateDataStateToActiveChartInstance(activeChartInstance?: any): void {
    if (!activeChartInstance) {
      activeChartInstance = (this._table as PivotChart)._getActiveChartInstance();
    }
    const state = this._generateChartState();
    activeChartInstance?.updateState(state);
  }
  /** 获取某一图表列的最优宽度，计算逻辑是根据图表的xField的维度值个数 * barWidth */
  getOptimunWidthForChart(col: number) {
    const path = this.getCellHeaderPaths(col, this.columnHeaderLevelCount).colHeaderPaths;
    let collectedValues: any;
    for (const key in this.dataset.collectValuesBy) {
      if (this.dataset.collectValuesBy[key].type === 'xField' && !this.dataset.collectValuesBy[key].range) {
        collectedValues =
          this.dataset.collectedValues[key][
            path
              .map(pathObj => {
                return pathObj.value;
              })
              .join(this.dataset.stringJoinChar)
          ];
        break;
      }
    }
    return (collectedValues?.size ?? 0) * 50;
  }
  /**
   *  获取图表对应的指标值
   * */
  getIndicatorKeyInChartSpec(_col: number, _row: number) {
    // const paths = this.getCellHeaderPaths(_col, _row);
    // let indicatorObj;
    // if (this.indicatorsAsCol) {
    //   const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    //   indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    // } else {
    //   const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    //   indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    // }
    // const chartSpec = indicatorObj?.chartSpec;
    const chartSpec = this.getRawChartSpec(_col, _row);
    const indicatorKeys: string[] = [];
    if (chartSpec) {
      if (this.indicatorsAsCol === false) {
        if (chartSpec.series) {
          chartSpec.series.forEach((chartSeries: any) => {
            const yField = chartSeries.yField;
            indicatorKeys.push(yField);
          });
        } else {
          indicatorKeys.push(chartSpec.yField);
        }
      } else {
        if (chartSpec.series) {
          chartSpec.series.forEach((chartSeries: any) => {
            const xField = chartSeries.xField;
            indicatorKeys.push(xField);
          });
        } else {
          indicatorKeys.push(chartSpec.xField);
        }
      }
      return indicatorKeys;
    }
    return null;
  }

  /**
   *  获取图表对应的指标值
   * */
  getDimensionKeyInChartSpec(_col: number, _row: number) {
    // const paths = this.getCellHeaderPaths(_col, _row);
    // let indicatorObj;
    // if (this.indicatorsAsCol) {
    //   const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
    //   indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    // } else {
    //   const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    //   indicatorObj = this._indicatorObjects.find(indicator => indicator.indicatorKey === indicatorKey);
    // }
    // const chartSpec = indicatorObj?.chartSpec;
    const chartSpec = this.getRawChartSpec(_col, _row);
    const dimensionKeys: string[] = [];
    if (chartSpec) {
      if (this.indicatorsAsCol === false) {
        dimensionKeys.push(chartSpec.xField);
      } else {
        dimensionKeys.push(chartSpec.yField);
      }
      return dimensionKeys;
    }
    return null;
  }

  getAxisConfigInPivotChart(col: number, row: number): any {
    return getAxisConfigInPivotChart(col, row, this);
  }
  getRawChartSpec(col: number, row: number): any {
    return getRawChartSpec(col, row, this);
  }
  getChartSpec(col: number, row: number): any {
    return getChartSpec(col, row, this);
  }
  getChartAxes(col: number, row: number): any {
    return getChartAxes(col, row, this);
  }
  getChartDataId(col: number, row: number): any {
    return getChartDataId(col, row, this);
  }
  isEmpty(col: number, row: number): boolean {
    if (!this._table.isPivotChart()) {
      return false;
    }
    if (col > this.colCount - this.rightFrozenColCount - 1 || row > this.rowCount - this.bottomFrozenRowCount - 1) {
      return true;
    }
    if (this.hasTwoIndicatorAxes && this.indicatorsAsCol && row === this.columnHeaderLevelCount - 1) {
      return true;
    }
    return false;
  }
  //#endregion
}
