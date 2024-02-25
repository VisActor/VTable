/* eslint-disable sort-imports */
import { transpose } from '../tools/util';
import type {
  CellAddress,
  CellRange,
  IPivotTableCellHeaderPaths,
  LayoutObjectId,
  ShowColumnRowType,
  CellLocation,
  IHeaderTreeDefine,
  IDimension,
  IIndicator,
  ITitleDefine,
  ICornerDefine,
  IDimensionInfo,
  IExtensionRowDefine,
  IPagination,
  IColumnDimension,
  IRowDimension,
  FieldData,
  IChartIndicator
} from '../ts-types';
import { HierarchyState } from '../ts-types';
import type {
  HeaderData,
  IndicatorData,
  LayoutMapAPI,
  // PivotTableLayoutDefine,
  WidthData
} from '../ts-types/list-table/layout-map/api';
// import { EmptyDataCache } from './utils';
import type { PivotTable } from '../PivotTable';
import type { PivotChart } from '../PivotChart';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
import { diffCellAddress } from '../tools/diff-cell';
import type { ILinkDimension } from '../ts-types/pivot-table/dimension/link-dimension';
import type { IImageDimension } from '../ts-types/pivot-table/dimension/image-dimension';
import {
  checkHasCartesianChart,
  checkHasChart,
  getChartAxes,
  getChartDataId,
  getChartSpec,
  getRawChartSpec,
  isCartesianChart,
  isHasCartesianChartInline,
  isShareChartSpec
} from './chart-helper/get-chart-spec';
import type { ITreeLayoutHeadNode, LayouTreeNode } from './tree-helper';
import { DimensionTree, countLayoutTree, dealHeader, dealHeaderForTreeMode, generateLayoutTree } from './tree-helper';
import type { Dataset } from '../dataset/dataset';
import { cloneDeep, isArray, isValid } from '@visactor/vutils';
import type { TextStyle } from '../body-helper/style';
import type { ITableAxisOption } from '../ts-types/component/axis';
import { getQuadProps } from '../scenegraph/utils/padding';
import { getAxisConfigInPivotChart } from './chart-helper/get-axis-config';

// export const sharedVar = { seqId: 0 };
// let colIndex = 0;

const defaultDimension = { startInTotal: 0, level: 0 };
export class PivotHeaderLayoutMap implements LayoutMapAPI {
  sharedVar: { seqId: number };
  colIndex = 0;
  _showHeader = true;
  rowDimensionTree: DimensionTree;
  columnDimensionTree: DimensionTree;
  rowTree: IHeaderTreeDefine[];
  columnTree: IHeaderTreeDefine[];
  cornerHeaderObjs: HeaderData[];
  columnHeaderObjs: HeaderData[] = [];
  rowHeaderObjs: HeaderData[] = [];
  private _cornerHeaderCellIds: number[][] = [];
  private _columnHeaderCellIds: number[][] = [];
  private _rowHeaderCellIds: number[][] = [];
  private _rowHeaderCellIds_FULL: number[][] = [];
  private _columnWidths: WidthData[] = [];
  private _columnHeaderLevelCount: number;
  private _rowHeaderLevelCount: number;
  rowsDefine: (IRowDimension | string)[];
  columnsDefine: (IColumnDimension | string)[];
  indicatorsDefine: (IIndicator | IChartIndicator | string)[];
  columnPaths: number[][] = [];
  _headerObjects: HeaderData[] = [];
  private _headerObjectMap: { [key: LayoutObjectId]: HeaderData } = {};
  // private _emptyDataCache = new EmptyDataCache();
  _indicators: IndicatorData[] = [];
  indicatorTitle: string;
  indicatorsAsCol = true;
  hideIndicatorName = false;
  _showRowHeader = true;
  _showColumnHeader = true;
  _rowHeaderTitle: ITitleDefine;
  _columnHeaderTitle: ITitleDefine;
  cornerSetting: ICornerDefine;
  private _indicatorShowType: ShowColumnRowType = 'column';
  /**层级维度结构显示形式 */
  rowHierarchyType?: 'grid' | 'tree';
  rowExpandLevel?: number;
  rowHierarchyIndent?: number;
  /**
   * 行表头对应的维度key集合
   */
  rowDimensionKeys: string[] = [];
  /**
   * 列表头对应的维度key集合
   */
  colDimensionKeys: string[] = [];
  indicatorKeys: string[] = [];
  indicatorDimensionKey: string = IndicatorDimensionKeyPlaceholder;
  // 缓存行号列号对应的cellRange 需要注意当表头位置拖拽后 这个缓存的行列号已不准确 进行重置
  // private _cellRangeMap: Map<string, CellRange>; //存储单元格的行列号范围 针对解决是否为合并单元格情况
  private _largeCellRangeCache: CellRange[];
  // 缓存行号列号对应的headerPath,注意树形结构展开需要清除！ 需要注意当表头位置拖拽后 这个缓存的行列号已不准确 进行重置
  private _CellHeaderPathMap: Map<string, IPivotTableCellHeaderPaths>;
  _table: PivotTable | PivotChart;
  extensionRows: IExtensionRowDefine[];
  _rowHeaderExtensionTree: any = {};

  /**
   * 扩展行表头对应的维度key集合
   */
  _extensionRowDimensionKeys: string[][] = [];
  fullRowDimensionKeys: string[] = [];

  dataset: Dataset;
  /**
   * 分页配置
   */
  pagination: IPagination;
  currentPageStartIndex: number;
  currentPageEndIndex: number;
  // _extensionRowHeaderCellIds
  //#region pivotChart专有
  hasTwoIndicatorAxes: boolean;
  /** 图表spec中barWidth的收集 */
  _chartItemSpanSize: number;
  _chartPaddingInner: number;
  _chartPaddingOuter: number;
  _chartItemBandSize: number;
  _chartPadding?: number | number[];

  _lastCellCol: number;
  _lastCellRow: number;
  _lastCellHeaderPath: IPivotTableCellHeaderPaths;
  //#endregion
  constructor(table: PivotTable | PivotChart, dataset: Dataset) {
    this.sharedVar = { seqId: 0 };
    this._table = table;
    if ((table as PivotTable).options.rowHierarchyType === 'tree') {
      this.extensionRows = (table as PivotTable).options.extensionRows;
    }
    this.dataset = dataset;
    // this._cellRangeMap = new Map();
    this._largeCellRangeCache = [];
    this._CellHeaderPathMap = new Map();
    // this.showHeader = showHeader;
    // this.pivotLayout = pivotLayoutObj;
    this.rowTree = table.internalProps.rowTree;
    this.columnTree = table.internalProps.columnTree;
    this.rowsDefine = table.internalProps.rows ?? [];
    this.columnsDefine = table.internalProps.columns ?? [];
    this.indicatorsDefine = table.internalProps.indicators ?? [];
    this.indicatorTitle = table.options.indicatorTitle;
    this.indicatorsAsCol = table.options.indicatorsAsCol ?? true;
    this.hideIndicatorName = table.options.hideIndicatorName ?? false;
    this.showRowHeader = table.options.showRowHeader ?? true;
    this.showColumnHeader = table.options.showColumnHeader ?? true;
    this.rowHeaderTitle = table.options.rowHeaderTitle;
    this.columnHeaderTitle = table.options.columnHeaderTitle;
    this.rowHierarchyType = (table as PivotTable).options.rowHierarchyType ?? 'grid';
    this.rowExpandLevel = (table as PivotTable).options.rowExpandLevel ?? 1;
    this.rowHierarchyIndent = (table as PivotTable).options.rowHierarchyIndent ?? 20;
    this.cornerSetting = table.options.corner ?? { titleOnDimension: 'column' };

    if (dataset) {
      this.rowTree = dataset.rowHeaderTree;
      this.columnTree = dataset.colHeaderTree;
      if (this.indicatorsAsCol && this._table.isPivotChart() && checkHasCartesianChart(this)) {
        const supplyAxisNode = (nodes: IHeaderTreeDefine[]) => {
          nodes.forEach((node: IHeaderTreeDefine) => {
            if (node.children?.length) {
              supplyAxisNode(node.children);
            } else {
              node.children = [
                {
                  dimensionKey: 'axis',
                  value: ''
                }
              ];
            }
          });
        };
        if (this.rowTree?.length) {
          supplyAxisNode(this.rowTree);
        } else {
          this.rowTree = [
            {
              dimensionKey: 'axis',
              value: ''
            }
          ];
        }
      }
    }
    // 收集指标所有key
    this.indicatorsDefine?.forEach(indicator => {
      // this.indicatorKeys[indicator.indicatorKey] = indicator.value;
      if (typeof indicator === 'string') {
        this.indicatorKeys.push(indicator);
      } else {
        this.indicatorKeys.push(indicator.indicatorKey);
      }
    });
    this.columnDimensionTree = new DimensionTree((this.columnTree as ITreeLayoutHeadNode[]) ?? [], this.sharedVar);
    this.rowDimensionTree = new DimensionTree(
      (this.rowTree as ITreeLayoutHeadNode[]) ?? [],
      this.sharedVar,
      this.rowHierarchyType,
      this.rowHierarchyType === 'tree' ? this.rowExpandLevel : undefined
    );
    this.colDimensionKeys = this.columnDimensionTree.dimensionKeys.valueArr();
    this.rowDimensionKeys = this.rowDimensionTree.dimensionKeys.valueArr();
    this.fullRowDimensionKeys = this.fullRowDimensionKeys.concat(this.rowDimensionKeys);

    this.resetRowHeaderLevelCount();

    //生成列表头单元格
    this._generateColHeaderIds();

    this.colIndex = 0;
    //生成行表头单元格
    this._generateRowHeaderIds();

    if (this._table.isPivotChart()) {
      this.hasTwoIndicatorAxes = this._indicators.some(indicatorObject => {
        if (
          indicatorObject.chartSpec &&
          indicatorObject.chartSpec.series &&
          indicatorObject.chartSpec.series.length > 1
        ) {
          return true;
        }
        return false;
      });
    }
    this.resetColumnHeaderLevelCount();

    // this.indicatorsAsCol = !isValid(this.rowDimensionKeys.find(key => key === this.indicatorDimensionKey));
    //  this.colAttrs[this.colAttrs.length-1]===this.indicatorDimensionKey&&this.colAttrs.pop();
    //  this.rowAttrs[this.rowAttrs.length-1]===this.indicatorDimensionKey&&this.rowAttrs.pop();

    this._rowHeaderCellIds_FULL = transpose(this._rowHeaderCellIds_FULL);
    if ((table as PivotTable).options.rowHierarchyType === 'tree' && this.extensionRows?.length >= 1) {
      this.generateExtensionRowTree();

      this.extensionRows.forEach(extensionRow => {
        const rowKeys: string[] = [];
        extensionRow.rows.forEach(row => {
          if (typeof row === 'string') {
            rowKeys.push(row);
          } else {
            rowKeys.push(row.dimensionKey);
          }
        });
        this._extensionRowDimensionKeys.push(rowKeys);
        this.fullRowDimensionKeys = this.fullRowDimensionKeys.concat(rowKeys);
      });
    }

    this.sharedVar.seqId = Math.max(this.sharedVar.seqId, this._headerObjects.length);
    //生成cornerHeaderObjs及_cornerHeaderCellIds
    if (this.cornerSetting.titleOnDimension === 'column') {
      this.cornerHeaderObjs = this._addCornerHeaders(
        this.columnHeaderTitle ? [''].concat(this.colDimensionKeys as any) : this.colDimensionKeys,
        this.columnsDefine
      );
    } else if (this.cornerSetting.titleOnDimension === 'row') {
      if (this.rowHierarchyType === 'tree' && this.extensionRows?.length >= 1) {
        // 如果是有扩展行维度
        const rowTreeFirstKey = [];
        rowTreeFirstKey.push(this.rowDimensionKeys[0]);
        this._extensionRowDimensionKeys.forEach(extensionRowKeys => {
          rowTreeFirstKey.push(extensionRowKeys[0]);
        });
        const extensionRowDimensions = this.extensionRows.reduce((dimensions, cur) => {
          return dimensions.concat(cur.rows);
        }, []);
        this.cornerHeaderObjs = this._addCornerHeaders(
          this.rowHeaderTitle ? [''].concat(rowTreeFirstKey as any) : rowTreeFirstKey,
          this.rowsDefine.concat(extensionRowDimensions)
        );
      } else {
        this.cornerHeaderObjs = this._addCornerHeaders(
          this.rowHeaderTitle ? [''].concat(this.rowDimensionKeys as any) : this.rowDimensionKeys,
          this.rowsDefine
        );
      }
    } else {
      this.cornerHeaderObjs = this._addCornerHeaders(null, undefined);
    }
    this.colIndex = 0;
    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key: LayoutObjectId]: HeaderData });

    if (this.indicatorsAsCol && !this.hideIndicatorName) {
      this._indicatorShowType = 'column';
    } else if (!this.indicatorsAsCol && !this.hideIndicatorName) {
      this._indicatorShowType = 'row';
    } else {
      this._indicatorShowType = 'none';
    }
    this.setPagination((table as PivotTable).options.pagination);

    if (this._table.isPivotChart()) {
      this._chartItemSpanSize = 0;
      this._chartItemBandSize = 0;
      // this._chartPadding ;
      this._indicators.find(indicatorObject => {
        if ((indicatorObject?.style as TextStyle)?.padding) {
          this._chartPadding = (indicatorObject.style as TextStyle).padding as number;
        }
        if (indicatorObject.chartSpec?.barWidth && typeof indicatorObject.chartSpec.barWidth === 'number') {
          this._chartItemSpanSize = indicatorObject.chartSpec?.barWidth;
        }
        const bandAxisConfig = indicatorObject.chartSpec?.axes?.find((axis: any) => {
          return axis.type === 'band';
        });
        if (bandAxisConfig?.bandSize) {
          this._chartItemBandSize = bandAxisConfig?.bandSize;
          this._chartPaddingInner =
            (isArray(bandAxisConfig.paddingInner) ? bandAxisConfig.paddingInner[0] : bandAxisConfig.paddingInner) ?? 0;
          this._chartPaddingOuter =
            (isArray(bandAxisConfig.paddingOuter) ? bandAxisConfig.paddingOuter[0] : bandAxisConfig.paddingOuter) ?? 0;
        }
        if (this._chartItemSpanSize > 0) {
          return true;
        }
        indicatorObject.chartSpec.series?.find((seriesObject: any) => {
          if (seriesObject.barWidth && typeof seriesObject.barWidth === 'number') {
            this._chartItemSpanSize = seriesObject.barWidth;
          }
          if (this._chartItemSpanSize > 0) {
            return true;
          }
          return false;
        });
        // if (this._chartItemSpanSize > 0) {
        //   return true;
        // }
        return false;
      });

      // if (this.indicatorsAsCol) {
      //   const cell_id = 'rowHeaderEmpty';
      //   this._headerObjectMap[cell_id] = {
      //     id: cell_id,
      //     title: '',
      //     field: cell_id,
      //     headerType: this.cornerSetting.headerType ?? 'text',
      //     style: this.cornerSetting.headerStyle,
      //     define: <any>{
      //       // id:
      //     }
      //   };
      //   this._headerObjects.push(this._headerObjectMap[cell_id]);
      //   // this.rowShowAttrs.push(cell_id);

      //   // deal with sub indicator axis

      //   if (!this.hasTwoIndicatorAxes) {
      //     // this.colShowAttrs.pop();
      //   }
      // } else {
      //   const axisOption = ((this._table as PivotChart).pivotChartAxes as ITableAxisOption[]).find(axisOption => {
      //     return axisOption.orient === 'left';
      //   });
      //   if (axisOption?.visible === false) {
      //     // this.rowShowAttrs.pop();
      //   }
      // }
    }

    this.setColumnWidths();
  }
  _generateColHeaderIds() {
    if (this.columnDimensionTree.tree.children?.length >= 1) {
      this.columnHeaderObjs = this._addHeaders(
        this._columnHeaderCellIds,
        0,
        this.columnDimensionTree.tree.children,
        []
      );
    }
    // if (typeof this.showColumnHeader !== 'boolean') {
    if (this.columnHeaderTitle) {
      this.sharedVar.seqId = Math.max(this.sharedVar.seqId, this._headerObjects.length);
      const id = ++this.sharedVar.seqId;
      const firstRowIds = Array(this.colCount - this.rowHeaderLevelCount).fill(id);
      this._columnHeaderCellIds.unshift(firstRowIds);
      const cell: HeaderData = {
        id,
        title:
          typeof this.columnHeaderTitle.title === 'string'
            ? this.columnHeaderTitle.title
            : (this.columnsDefine.reduce((title: string, value) => {
                if (typeof value === 'string') {
                  return title;
                }
                return title + (title ? `/${value.title}` : `${value.title}`);
              }, '') as string),
        field: undefined,
        headerType: this.columnHeaderTitle.headerType ?? 'text',
        style: this.columnHeaderTitle.headerStyle,
        define: <any>{
          id,
          disableHeaderHover: !!this.columnHeaderTitle.disableHeaderHover,
          disableHeaderSelect: !!this.columnHeaderTitle.disableHeaderSelect
        }
      };
      this.columnHeaderObjs.push(cell);
      this._headerObjects[id] = cell;
    }
  }
  _generateRowHeaderIds() {
    if (this.rowDimensionTree.tree.children?.length >= 1) {
      this.rowHeaderObjs =
        this.rowHierarchyType === 'tree'
          ? this._addHeadersForTreeMode(
              this._rowHeaderCellIds_FULL,
              0,
              this.rowDimensionTree.tree.children,
              [],
              this.rowDimensionTree.totalLevel,
              true,
              this.rowsDefine
            )
          : this._addHeaders(this._rowHeaderCellIds_FULL, 0, this.rowDimensionTree.tree.children, []);
    }
    // if (typeof this.showRowHeader !== 'boolean') {
    if (this.rowHeaderTitle) {
      this.sharedVar.seqId = Math.max(this.sharedVar.seqId, this._headerObjects.length);
      const id = ++this.sharedVar.seqId;
      const firstColIds = Array(this._rowHeaderCellIds_FULL[0]?.length ?? this.rowDimensionTree.tree.size).fill(id);
      this._rowHeaderCellIds_FULL.unshift(firstColIds);
      const cell: HeaderData = {
        id,
        title:
          typeof this.rowHeaderTitle.title === 'string'
            ? this.rowHeaderTitle.title
            : (this.rowsDefine.reduce((title: string, value) => {
                if (typeof value === 'string') {
                  return title;
                }
                return title + (title ? `/${value.title}` : `${value.title}`);
              }, '') as string),
        field: undefined,
        headerType: this.rowHeaderTitle.headerType ?? 'text',
        style: this.rowHeaderTitle.headerStyle,
        define: <any>{
          id,
          disableHeaderHover: !!this.columnHeaderTitle.disableHeaderHover,
          disableHeaderSelect: !!this.columnHeaderTitle.disableHeaderSelect
        }
      };
      this.rowHeaderObjs.push(cell);
      this._headerObjects[id] = cell;
    }
  }
  _addHeaders(_headerCellIds: number[][], row: number, header: ITreeLayoutHeadNode[], roots: number[]): HeaderData[] {
    const _this = this;
    function _newRow(row: number): number[] {
      const newRow: number[] = (_headerCellIds[row] = []);
      if (_this.colIndex === 0) {
        return newRow;
      }
      const prev = _headerCellIds[row - 1];
      for (let col = 0; col < prev?.length; col++) {
        newRow[col] = prev[col];
      }
      return newRow;
    }
    const results: HeaderData[] = [];
    if (!_headerCellIds[row]) {
      _newRow(row);
    }

    for (let i = 0; i < header.length; i++) {
      const hd = header[i];
      dealHeader(hd, _headerCellIds, results, roots, row, this);
    }
    return results;
  }
  _addHeadersForTreeMode(
    _headerCellIds: number[][],
    row: number,
    header: ITreeLayoutHeadNode[],
    roots: number[],
    totalLevel: number,
    show: boolean,
    dimensions: (IDimension | string)[]
  ): HeaderData[] {
    const _this = this;
    function _newRow(row: number): number[] {
      const newRow: number[] = (_headerCellIds[row] = []);
      if (_this.colIndex === 0) {
        return newRow;
      }
      const prev = _headerCellIds[row - 1];
      for (let col = 0; col < prev?.length; col++) {
        newRow[col] = prev[col];
      }
      return newRow;
    }
    const results: HeaderData[] = [];
    if (!_headerCellIds[row]) {
      _newRow(row);
    }

    for (let i = 0; i < header.length; i++) {
      const hd = header[i];
      dealHeaderForTreeMode(hd, _headerCellIds, results, roots, row, totalLevel, show, dimensions, this);
    }
    return results;
  }
  private _addCornerHeaders(dimensionKeys: (string | number)[] | null, dimensions: (string | IDimension)[]) {
    const results: HeaderData[] = [];
    if (dimensionKeys) {
      dimensionKeys.forEach((dimensionKey: string | number, key: number) => {
        const id = ++this.sharedVar.seqId;
        // const dimensionInfo: IDimension =
        //   (this.rowsDefine?.find(dimension =>
        //     typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
        //   ) as IDimension) ??
        //   (this.columnsDefine?.find(dimension =>
        //     typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
        //   ) as IDimension);
        const dimensionInfo: IDimension = dimensions.find(dimension =>
          typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
        ) as IDimension;
        const cell: HeaderData = {
          id,
          title:
            dimensionKey === this.indicatorDimensionKey
              ? this.indicatorTitle
              : dimensionInfo
              ? dimensionInfo.title
              : dimensionKey === 'axis'
              ? ''
              : (dimensionKey as string),
          field: '维度名称',
          style: this.cornerSetting.headerStyle,
          headerType: this.cornerSetting.headerType ?? 'text',
          define: <any>{
            dimensionKey: '维度名称',
            id,
            value: dimensionKey,
            disableHeaderHover: !!this.cornerSetting.disableHeaderHover,
            disableHeaderSelect: !!this.cornerSetting.disableHeaderSelect
          },
          dropDownMenu: dimensionInfo?.cornerDropDownMenu,
          pivotInfo: {
            value: dimensionInfo?.title ?? '',
            dimensionKey,
            isPivotCorner: true
            // customInfo: dimensionInfo?.customInfo
          },
          description: dimensionInfo?.cornerDescription
        };
        results[id] = cell;
        this._headerObjects[id] = cell;
        if (this.cornerSetting.titleOnDimension === 'column') {
          if (!this._cornerHeaderCellIds[key]) {
            this._cornerHeaderCellIds[key] = [];
          }
          for (let r = 0; r < this.rowHeaderLevelCount; r++) {
            this._cornerHeaderCellIds[key][r] = id;
          }
        } else if (this.cornerSetting.titleOnDimension === 'row') {
          for (let r = 0; r < this.columnHeaderLevelCount; r++) {
            if (!this._cornerHeaderCellIds[r]) {
              this._cornerHeaderCellIds[r] = [];
            }
            this._cornerHeaderCellIds[r][key] = id;
          }
        }
      });
    } else {
      const id = ++this.sharedVar.seqId;
      const cell: HeaderData = {
        id,
        title: '',
        field: '维度名称',
        style: this.cornerSetting.headerStyle,
        headerType: this.cornerSetting.headerType ?? 'text',
        define: <any>{
          dimensionKey: '维度名称',
          id,
          value: '',
          disableHeaderHover: !!this.cornerSetting.disableHeaderHover,
          disableHeaderSelect: !!this.cornerSetting.disableHeaderSelect
        }
      };
      results[id] = cell;
      this._headerObjects[id] = cell;
      for (let r = 0; r < this.columnHeaderLevelCount; r++) {
        for (let j = 0; j < this.rowHeaderLevelCount; j++) {
          if (!this._cornerHeaderCellIds[r]) {
            this._cornerHeaderCellIds[r] = [];
          }
          this._cornerHeaderCellIds[r][j] = id;
        }
      }
    }
    return results;
  }
  private generateExtensionRowTree() {
    this.extensionRows.forEach((extensionRow, indexP) => {
      const old_rowHeaderCellIds = this._rowHeaderCellIds_FULL;
      this._rowHeaderCellIds_FULL = [];
      old_rowHeaderCellIds.forEach((row_ids: number[], index) => {
        const key = row_ids[row_ids.length - 1];
        this.colIndex = 0;
        let tree;
        if (typeof extensionRow.rowTree === 'function') {
          const fullCellIds = this.findFullCellIds(row_ids);
          tree = (extensionRow.rowTree as Function)(
            fullCellIds.map(id => {
              return { dimensionKey: this._headerObjects[id].field, value: this._headerObjects[id].title };
            })
          );
        } else {
          // 需要clone一份 否则跟DimensionTree有引用关系
          tree = cloneDeep(extensionRow.rowTree);
        }
        let rowExtensionDimensionTree;
        if (this._rowHeaderExtensionTree[key]) {
          this._rowHeaderExtensionTree[key].reset(this._rowHeaderExtensionTree[key].tree.children, true);
          rowExtensionDimensionTree = this._rowHeaderExtensionTree[key];
        } else {
          rowExtensionDimensionTree = new DimensionTree(tree ?? [], this.sharedVar, this.rowHierarchyType, undefined);
          this._rowHeaderExtensionTree[key] = rowExtensionDimensionTree;
        }

        const extensionRowTreeHeaderIds: number[][] = [];
        this._addHeadersForTreeMode(
          extensionRowTreeHeaderIds,
          0,
          rowExtensionDimensionTree.tree.children,
          [],
          rowExtensionDimensionTree.totalLevel,
          true,
          extensionRow.rows
        );
        for (let i = 0; i < extensionRowTreeHeaderIds[0].length; i++) {
          this._rowHeaderCellIds_FULL.push(row_ids.concat(extensionRowTreeHeaderIds[0][i]));
        }
      });
    });
  }
  private setColumnWidths() {
    const returnWidths: WidthData[] = new Array(this.colCount).fill(undefined);
    if (this.showHeader && this.showRowHeader) {
      if (this.rowHeaderTitle) {
        returnWidths[0] = {};
      }
      if (this.rowHierarchyType === 'tree') {
        const mainDimensionFirstRowKey = this.rowDimensionKeys[0];
        if (mainDimensionFirstRowKey) {
          const dimension = this.rowsDefine?.find(dimension =>
            typeof dimension === 'string' ? false : dimension.dimensionKey === mainDimensionFirstRowKey
          ) as IRowDimension;
          dimension &&
            (returnWidths[0 + (this.rowHeaderTitle ? 1 : 0)] = {
              width: dimension.width,
              minWidth: dimension.minWidth,
              maxWidth: dimension.maxWidth
            });
        }
        this._extensionRowDimensionKeys?.forEach((extensionRowDimensionKeys, index) => {
          const curDimensionFirstRowKey = extensionRowDimensionKeys[0];
          if (curDimensionFirstRowKey) {
            const dimension = this.extensionRows[index].rows?.find((dimension: string | IRowDimension) =>
              typeof dimension === 'string' ? false : dimension.dimensionKey === curDimensionFirstRowKey
            ) as IRowDimension;
            dimension &&
              (returnWidths[index + 1 + (this.rowHeaderTitle ? 1 : 0)] = {
                width: dimension.width,
                minWidth: dimension.minWidth,
                maxWidth: dimension.maxWidth
              });
          }
        });
        // const _headerCellIds = this._rowHeaderCellIds[0];
        // _headerCellIds.forEach((cellId, index) => {
        //   const headerDefine = this._headerObjectMap[cellId];
        //   headerDefine &&
        //     (returnWidths[index + (this.rowHeaderTitle ? 1 : 0)] = {
        //       width: headerDefine.width,
        //       minWidth: headerDefine.minWidth,
        //       maxWidth: headerDefine.maxWidth
        //     });
        // });
      } else {
        this.rowDimensionKeys.forEach((objKey, index) => {
          const dimension = this.rowsDefine?.find(dimension =>
            typeof dimension === 'string' ? false : dimension.dimensionKey === objKey
          ) as IRowDimension;
          dimension &&
            (returnWidths[index + (this.rowHeaderTitle ? 1 : 0)] = {
              width: dimension.width,
              minWidth: dimension.minWidth,
              maxWidth: dimension.maxWidth
            });
        });
      }
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
      let width: string | number | undefined = 0;
      let maxWidth: string | number | undefined;
      let minWidth: string | number | undefined;
      let isAuto;
      this._indicators?.forEach((obj, index) => {
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
      returnWidths.fill(
        { width, minWidth, maxWidth },
        this.rowHeaderLevelCount,
        this.colCount - this.rightFrozenColCount
      );
    }
    this._columnWidths = returnWidths;
  }

  get columnWidths(): WidthData[] {
    return this._columnWidths;
  }
  getColumnWidthDefined(col: number): WidthData {
    return this._columnWidths[col];
  }
  get showHeader(): boolean {
    return this._showHeader;
  }
  set showHeader(_showHeader: boolean) {
    this._showHeader = _showHeader;
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
  getHeaderFieldKey(col: number, row: number): undefined {
    return undefined;
  }
  getCellLocation(col: number, row: number): CellLocation {
    if (this.isCornerHeader(col, row)) {
      return 'cornerHeader';
    } else if (this.isColumnHeader(col, row)) {
      return 'columnHeader';
    } else if (this.isRowHeader(col, row)) {
      return 'rowHeader';
    }
    return 'body';
  }
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

  isHeader(col: number, row: number): boolean {
    if (col >= 0 && col < this.rowHeaderLevelCount) {
      return true;
    }
    if (row >= 0 && row < this.columnHeaderLevelCount) {
      return true;
    }
    if (col >= this.colCount - this.rightHeaderColCount) {
      return true;
    }
    if (row >= this.rowCount - this.bottomHeaderRowCount) {
      return true;
    }
    return false;
  }
  isCornerHeader(col: number, row: number): boolean {
    if (col >= 0 && col < this.rowHeaderLevelCount && row >= 0 && row < this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  isColumnHeader(col: number, row: number): boolean {
    if (col >= this.rowHeaderLevelCount && row >= 0 && row < this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }
  isRowHeader(col: number, row: number): boolean {
    if (col >= 0 && col < this.rowHeaderLevelCount && row >= this.columnHeaderLevelCount) {
      return true;
    }
    return false;
  }

  isFrozen(col: number, row: number): boolean {
    return (
      this.isFrozenColumn(col) || this.isRightFrozenColumn(col) || this.isBottomFrozenRow(row) || this.isFrozenRow(row)
    );
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
    if (this._table.internalProps.frozenRowCount) {
      if (this.rowCount >= this._table.internalProps.frozenRowCount) {
        return this._table.internalProps.frozenRowCount;
      }
      return this.rowCount;
    }
    return 0;
  }
  get headerLevelCount(): number {
    return this.columnHeaderLevelCount;
  }
  resetColumnHeaderLevelCount() {
    if (this.showHeader && this.showColumnHeader) {
      if (
        this._table.isPivotChart() &&
        this.indicatorsAsCol &&
        !this.dataset?.colKeys?.length &&
        !this.hasTwoIndicatorAxes
      ) {
        this.columnHeaderLevelCount = 0;
        return;
      }
      let count = this.indicatorsAsCol
        ? this.hideIndicatorName //设置隐藏表头，且表头最下面一级就是指标维度 则-1
          ? this.colDimensionKeys[this.colDimensionKeys.length - 1] === this.indicatorDimensionKey
            ? this.columnDimensionTree.totalLevel - 1
            : this.columnDimensionTree.totalLevel
          : this.columnDimensionTree.totalLevel
        : this.columnDimensionTree.totalLevel;
      if (this.columnHeaderTitle) {
        count += 1;
      }
      if (
        this._table.isPivotChart() &&
        this.indicatorsAsCol &&
        !this.hasTwoIndicatorAxes &&
        checkHasCartesianChart(this)
      ) {
        count -= 1;
      }
      this.columnHeaderLevelCount = count;
      return;
    }
    this.columnHeaderLevelCount = 0;
    return;
  }
  resetRowHeaderLevelCount() {
    if (this.showHeader && this.showRowHeader) {
      if (this.rowHierarchyType === 'tree') {
        const extensionRowCount = this.extensionRows?.length ?? 0;
        if (this.rowHeaderTitle) {
          this.rowHeaderLevelCount = 2 + extensionRowCount;
          return;
        }
        this.rowHeaderLevelCount = 1 + extensionRowCount;
        return;
      }
      const rowLevelCount = this.rowDimensionKeys.length;
      // let count = this.indicatorsAsCol
      //   ? rowLevelCount
      //   : this.hideIndicatorName //设置隐藏表头，且表头最下面一级就是指标维度 则-1
      //   ? this.rowDimensionKeys[this.rowDimensionKeys.length - 1] === this.indicatorDimensionKey
      //     ? rowLevelCount - 1
      //     : rowLevelCount
      //   : rowLevelCount;

      let count = rowLevelCount;
      if (this.indicatorsAsCol) {
        // count = rowLevelCount;
      } else if (
        this.hideIndicatorName &&
        this.rowDimensionKeys[this.rowDimensionKeys.length - 1] === this.indicatorDimensionKey
      ) {
        count = rowLevelCount - 1;
      }

      if (this.rowHeaderTitle) {
        count += 1;
      }
      // if (this._table.isPivotChart()&&this.indicatorsAsCol) {
      //   count+=1;
      // }
      this.rowHeaderLevelCount = count;
      return;
    }
    // return 0;
    this.rowHeaderLevelCount = this.indicatorsAsCol ? 0 : this.hideIndicatorName ? 0 : 1;
    return;
  }
  get columnHeaderLevelCount(): number {
    return this._columnHeaderLevelCount;
  }
  set columnHeaderLevelCount(count: number) {
    this._columnHeaderLevelCount = count;
  }
  get rowHeaderLevelCount(): number {
    return this._rowHeaderLevelCount;
  }
  set rowHeaderLevelCount(count: number) {
    this._rowHeaderLevelCount = count;
  }
  get colCount(): number {
    return (
      this.columnDimensionTree.tree.size + this.rowHeaderLevelCount + this.rightHeaderColCount // 小心rightFrozenColCount和colCount的循环引用 造成调用栈溢出
    );
  }
  get rowCount(): number {
    return (
      ((Array.isArray(this._table.records) ? this._table.records.length > 0 : true) &&
      this._indicators?.length > 0 && // 前两个判断条件来判断  有展示的body值的情况 需要展示body row
      !this._rowHeaderCellIds?.length // 需要展示body值 但 _rowHeaderCellIds的长度维度为0  无rows 行表头为空
        ? 1 //兼容bugserver: https://bugserver.cn.goofy.app/case?product=VTable&fileid=65364a57173c354c242a7c4f
        : this._rowHeaderCellIds?.length ?? 0) + //兼容 bugserver：https://bugserver.cn.goofy.app/case?product=VTable&fileid=6527ac0695c0cdbd788cf17d
      this.columnHeaderLevelCount +
      this.bottomHeaderRowCount // 小心bottomFrozenRowCount和rowCount的循环引用 造成调用栈溢出
    );
    // return (this._rowHeaderCellIds?.length ?? 0) + this.columnHeaderLevelCount + this.bottomFrozenRowCount;
  }
  get bodyRowSpanCount() {
    return this.rowDimensionTree.tree.size;
  }
  get bottomFrozenRowCount(): number {
    //下面是pivot-layout中逻辑
    if (!this._table.isPivotChart()) {
      if (this._table.internalProps.bottomFrozenRowCount) {
        if (this.rowCount - this.headerLevelCount >= this._table.internalProps.bottomFrozenRowCount) {
          return this._table.internalProps.bottomFrozenRowCount;
        }
        return this.rowCount - this.headerLevelCount;
      }
      return 0;
    }
    if (this.indicatorKeys.length >= 1 && checkHasCartesianChart(this)) {
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
    return 0;
  }
  get rightFrozenColCount(): number {
    // // return 0;
    // if (this.showHeader && this.showColumnHeader) {
    //   if (!this.indicatorsAsCol && !this.hideIndicatorName) {
    //     // 查询指标是否有multiIndicator
    //     return this.indicatorsDefine.find(indicator => {
    //       return (indicator as any)?.multiIndicator;
    //     })
    //       ? 1
    //       : 0;
    //   }
    // }
    // return 0;
    //上面是原有逻辑
    //下面是pivot-layout中逻辑
    if (!this._table.isPivotChart()) {
      if (this._table.internalProps.rightFrozenColCount) {
        if (this.colCount - this.rowHeaderLevelCount >= this._table.internalProps.rightFrozenColCount) {
          return this._table.internalProps.rightFrozenColCount;
        }
        return this.colCount - this.rowHeaderLevelCount;
      }
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

  /** 不包括冻结的行 还是不确定应不应该包括*/
  get bodyRowCount(): number | undefined {
    return this.rowCount - this.bottomFrozenRowCount - this.headerLevelCount;
  }
  /** 不包括冻结的列 */
  get bodyColCount(): number | undefined {
    return this.colCount - this.rightFrozenColCount - this.rowHeaderLevelCount;
  }
  get headerObjects(): HeaderData[] {
    return this._headerObjects;
  }
  get columnObjects(): IndicatorData[] {
    return this._indicators;
  }
  getCellId(col: number, row: number): LayoutObjectId {
    if (row >= 0 && col >= 0) {
      if (this.isCornerHeader(col, row)) {
        return this._cornerHeaderCellIds[row][col];
      } else if (this.isColumnHeader(col, row)) {
        return this._columnHeaderCellIds[row][col - this.rowHeaderLevelCount];
      } else if (this.isRowHeader(col, row)) {
        return this._rowHeaderCellIds[row - this.columnHeaderLevelCount]?.[col];
      } else if (this.isRightFrozenColumn(col, row)) {
        return this._rowHeaderCellIds[row - this.columnHeaderLevelCount][this.rowHeaderLevelCount - 1];
      } else if (this.isBottomFrozenRow(col, row)) {
        return this._columnHeaderCellIds[this.columnHeaderLevelCount - 1]?.[col - this.rowHeaderLevelCount];
      }
    }
    return undefined;
  }
  // getCellIdOnHeader(col: number, row: number): LayoutObjectId {
  //   if (row >= 0 && col >= 0) {
  //     if (this.isCornerHeader(col, row)) return this._cornerHeaderCellIds[row][col];
  //     else if (this.isColumnHeader(col, row))
  //       return this._columnHeaderCellIds[row][col - this.rowHeaderLevelCount];
  //     else if (this.isRowHeader(col, row))
  //       return this._rowHeaderCellIds[row - this.columnHeaderLevelCount]?.[col];
  //     return this.getCellIdOnHeader(
  //       col >= this.rowHeaderLevelCount ? this.rowHeaderLevelCount - 1 : col,
  //       row >= this.columnHeaderLevelCount ? this.columnHeaderLevelCount - 1 : row
  //     );
  //   }
  //   return 0;
  // }
  getHeader(col: number, row: number): HeaderData {
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number] ?? { id: undefined, field: '', headerType: 'text', define: undefined };
  }
  getHeaderField(col: number, row: number) {
    const id = this.getCellId(col, row);
    return this._headerObjectMap[id as number]?.field || this.getBody(col, row)?.field;
  }
  getHeaderCellAdressById(id: number): CellAddress | undefined {
    for (let i = 0; i < this._columnHeaderCellIds.length; i++) {
      const row = this._columnHeaderCellIds[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === id) {
          return { col: j + this._table.frozenColCount, row: i };
        }
      }
    }
    for (let i = 0; i < this._rowHeaderCellIds.length; i++) {
      const row = this._rowHeaderCellIds[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === id) {
          return { col: j, row: i + this._table.frozenRowCount };
        }
      }
    }
    for (let i = 0; i < this._cornerHeaderCellIds.length; i++) {
      const row = this._cornerHeaderCellIds[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] === id) {
          return { col: j, row: i };
        }
      }
    }
    return undefined;
  }
  /** 透视表中此函数有问题 应该传入paths */
  getHeaderCellAddressByField(field: string) {
    const hd = this.headerObjects.find((col: any) => col && col.field === field);
    return this.getHeaderCellAdressById(hd.id as number);
  }
  //TODO 这里的indicators是否可以改为和真正指标值一样数量 但目前也不会造成太多内存浪费 对象较简单 引用对象
  getBody(_col: number, _row: number): IndicatorData {
    // let indicatorData;
    //正常情况下 通过行号或者列号可以取到Indicator的配置信息 但如果指标在前维度在后的情况下（如风神：列配置【指标名称，地区】） indicators中的数量是和真正指标值一样数量
    // if (this.indicatorsAsCol) indicatorData = this.indicators[_col - this.rowHeaderLevelCount];
    // else indicatorData = this.indicators[_row - this.columnHeaderLevelCount];
    // if (indicatorData) return indicatorData;
    const paths = this.getCellHeaderPaths(_col, _row);
    if (this.indicatorsAsCol) {
      const indicatorKey = paths.colHeaderPaths?.find(colPath => colPath.indicatorKey)?.indicatorKey;
      return (
        this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey) ??
        this._indicators[0] ?? {
          id: '',
          field: undefined,
          indicatorKey: undefined,
          cellType: 'text',
          define: undefined
        }
      );
    }
    const indicatorKey = paths.rowHeaderPaths?.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    return (
      this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey) ??
      this._indicators[0] ?? {
        id: '',
        field: undefined,
        indicatorKey: undefined,
        cellType: 'text',
        define: undefined
      }
    );
  }
  // getBodyLayoutRangeById(id: LayoutObjectId): CellRange {
  //   for (let col = 0; col < (this.colCount ?? 0); col++) {
  //     if (id === this.columnObjects[col].id) {
  //       return {
  //         start: { col, row: 0 },
  //         end: { col, row: 0 }
  //       };
  //     }
  //   }

  //   throw new Error(`can not found body layout @id=${id as number}`);
  // }
  getCellRange(col: number, row: number): CellRange {
    const result: CellRange = { start: { col, row }, end: { col, row } };
    if (!this.isHeader(col, row) || col === -1 || row === -1) {
      // || this.isIndicatorHeader(col, row)// 为什么加想不想来了 但是如果加上指标属于合并单元格的情况就会有问题了
      return result;
    }

    if (this.isRightFrozenColumn(col, row) || this.isBottomFrozenRow(col, row)) {
      return result;
    }

    if (this._table.isPivotChart()) {
      if (this.isLeftBottomCorner(col, row)) {
        return {
          start: {
            col: 0,
            row: this.rowCount - this.bottomFrozenRowCount
          },
          end: {
            col: this.frozenColCount - 1,
            row: this.rowCount - 1
          }
        };
      } else if (this.isRightTopCorner(col, row)) {
        return {
          start: {
            col: this.colCount - this.rightFrozenColCount,
            row: 0
          },
          end: {
            col: this.colCount - 1,
            row: this.frozenRowCount - 1
          }
        };
      } else if (this.isRightBottomCorner(col, row)) {
        return {
          start: {
            col: this.colCount - this.rightFrozenColCount,
            row: this.rowCount - this.bottomFrozenRowCount
          },
          end: {
            col: this.colCount - 1,
            row: this.rowCount - 1
          }
        };
      }
    }

    // if (this._cellRangeMap.has(`$${col}$${row}`)) {
    //   return this._cellRangeMap.get(`$${col}$${row}`);
    // }
    for (let i = 0; i < this._largeCellRangeCache.length; i++) {
      const range = this._largeCellRangeCache[i];
      if (col >= range.start.col && col <= range.end.col && row >= range.start.row && row <= range.end.row) {
        return range;
      }
    }
    if (this.isHeader(col, row) && col !== -1 && row !== -1) {
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
        if (
          id !== this.getCellId(col, r)
          //  ||
          // (col >= 1 && this.getCellId(col - 1, row) !== this.getCellId(col - 1, r))
        ) {
          break;
        }
        result.start.row = r;
      }
      for (let r = row + 1; r < (this.rowCount ?? 0); r++) {
        if (
          id !== this.getCellId(col, r)
          // ||
          // (col >= 1 && this.getCellId(col - 1, row) !== this.getCellId(col - 1, r))
        ) {
          break;
        }
        result.end.row = r;
      }
    }
    // this._cellRangeMap.set(`${col}-${row}`, result);
    if (result.end.col - result.start.col > 100 || result.end.row - result.start.row > 100) {
      // only cache large range to avoid long col&row search
      this._largeCellRangeCache.push(result);
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

  getBodyIndexByRow(row: number): number {
    if (row < this.columnHeaderLevelCount) {
      return -1;
    } else if (row >= this.rowCount - this.bottomHeaderRowCount) {
      return -1;
    }
    return row - this.columnHeaderLevelCount;
    // return this.indicatorsAsCol
    //   ? row - this.columnHeaderLevelCount
    //   : Math.floor((row - this.columnHeaderLevelCount) / this.indicatorKeys.length);
  }
  get bottomHeaderRowCount() {
    if (this._table.isPivotChart()) {
      return this.bottomFrozenRowCount;
    }
    return 0;
  }

  get rightHeaderColCount() {
    if (this._table.isPivotChart()) {
      return this.rightFrozenColCount;
    }
    return 0;
  }
  getBodyIndexByCol(col: number): number {
    if (col < this.rowHeaderLevelCount) {
      return -1;
    } else if (col >= this.colCount - this.rightHeaderColCount) {
      return -1;
    }
    return col - this.rowHeaderLevelCount;
  }
  getRecordStartRowByRecordIndex(index: number): number {
    return this.columnHeaderLevelCount + index;
  }
  getRecordShowIndexByCell(col: number, row: number): number {
    return undefined;
  }
  // getCellRangeTranspose(): CellRange {
  //   return { start: { col: 0, row: 0 }, end: { col: 0, row: 0 } };
  // }

  getCellHeaderPathsWidthTreeNode(col: number, row: number): IPivotTableCellHeaderPaths {
    // if (this._CellHeaderPathMap.has(`$${col}$${row}`))
    // if (this._CellHeaderPathMap.has(`${col}-${row}`)) {
    //   return this._CellHeaderPathMap.get(`${col}-${row}`);
    // }
    if (col === this._lastCellCol && row === this._lastCellRow) {
      return this._lastCellHeaderPath;
    }
    let _largeCellRangeCacheIndex = -1;
    for (let i = 0; i < this._largeCellRangeCache.length; i++) {
      const range = this._largeCellRangeCache[i];
      if (col >= range.start.col && col <= range.end.col && row >= range.start.row && row <= range.end.row) {
        _largeCellRangeCacheIndex = i;
        break;
      }
    }
    // if (_largeCellRangeCacheIndex !== -1) {
    //   const range = this._largeCellRangeCache[_largeCellRangeCacheIndex];
    //   if (this._CellHeaderPathMap.has(`${range.start.col}-${range.start.row}`)) {
    //     return this._CellHeaderPathMap.get(`${range.start.col}-${range.start.row}`);
    //   }
    // }
    // console.log(`${col}-${row}`);
    const recordCol = this.getBodyIndexByCol(col);
    const recordRow = this.getBodyIndexByRow(row) + this.currentPageStartIndex;
    let colPath: ITreeLayoutHeadNode[] = [];
    let rowPath: ITreeLayoutHeadNode[] = [];
    if (row >= 0 && recordCol >= 0) {
      colPath = this.columnDimensionTree.getTreePath(
        recordCol,
        this.showHeader && this.showColumnHeader
          ? row - (this.columnHeaderTitle ? 1 : 0)
          : this.columnDimensionTree.totalLevel
      );
    }
    if (col >= 0 && recordRow >= 0) {
      if (this.rowHierarchyType === 'tree') {
        // 注释了原有逻辑
        // if (col >= this.rowHeaderLevelCount) {
        //   //body单元格 col代表寻找的深度 这里需要加上行表头的整体深度
        //   rowPath = this.rowDimensionTree.getTreePath(recordRow, col + this.rowDimensionTree.totalLevel);
        // } else {
        //   //header单元格 col代表寻找的深度 这里需要加上当前单元格行表头的深度
        //   const hd = this.getHeader(col, row);
        //   rowPath = this.rowDimensionTree.getTreePath(recordRow, col + hd.hierarchyLevel);
        // }
        // 考虑多层级的ExtensionRowTree
        const row_pathIds = this._rowHeaderCellIds[recordRow]; //获取当前行的cellId 但这个cellId不是各级维度都有的  下面逻辑就是找全路径然后再去各个树找path的过程
        let findTree = this.rowDimensionTree; //第一棵寻找的树是第一列的维度树 主树
        let level = 0; //level和col对应，代表一层层树找的过程
        while (findTree) {
          const pathIds: (number | string)[] = []; // pathIds记录寻找当前树需要匹配的cellId
          let cellId: LayoutObjectId = row_pathIds[level]; //row_pathIds中每个值对应了pathIds的一个节点cellId
          pathIds.push(cellId);
          while (true) {
            const hd: HeaderData = this._headerObjectMap[cellId];
            if (hd?.parentCellId) {
              // 将parentCellId加入pathIds
              pathIds.unshift(hd.parentCellId);
              cellId = hd.parentCellId;
            } else {
              break;
            }
          }
          // 组装好pathIds后从树中找出具体路径paths
          const findedRowPath = findTree.getTreePathByCellIds(pathIds);
          rowPath = rowPath.concat(findedRowPath);
          findTree = this._rowHeaderExtensionTree[row_pathIds[level]];
          level++;
        }
      } else {
        rowPath = this.rowDimensionTree.getTreePath(
          recordRow,
          this.showHeader && this.showRowHeader ? col - (this.rowHeaderTitle ? 1 : 0) : this.rowDimensionTree.totalLevel
        );
      }
    }
    const p = { colHeaderPaths: colPath, rowHeaderPaths: rowPath, cellLocation: this.getCellLocation(col, row) };
    // this._CellHeaderPathMap.set(`${col}-${row}`, p);
    this._lastCellHeaderPath = p;
    this._lastCellCol = col;
    this._lastCellRow = row;
    return p;
  }
  getCellHeaderPaths(col: number, row: number): IPivotTableCellHeaderPaths {
    const headerPathsWidthNode = this.getCellHeaderPathsWidthTreeNode(col, row);
    const headerPaths: IPivotTableCellHeaderPaths = {
      colHeaderPaths: [],
      rowHeaderPaths: [],
      cellLocation: headerPathsWidthNode.cellLocation
    };
    headerPathsWidthNode.colHeaderPaths?.forEach((colHeader: any) => {
      const colHeaderPath: {
        dimensionKey?: string;
        indicatorKey?: string;
        value?: string;
      } = {};
      colHeaderPath.dimensionKey = colHeader.dimensionKey;
      colHeaderPath.indicatorKey = colHeader.indicatorKey;
      colHeaderPath.value = colHeader.value ?? this.getIndicatorInfoByIndicatorKey(colHeader.indicatorKey)?.title ?? '';
      headerPaths.colHeaderPaths.push(colHeaderPath);
    });

    headerPathsWidthNode.rowHeaderPaths?.forEach((rowHeader: any) => {
      if (rowHeader.dimensionKey !== 'axis') {
        const rowHeaderPath: {
          dimensionKey?: string;
          indicatorKey?: string;
          value?: string;
        } = {};
        rowHeaderPath.dimensionKey = rowHeader.dimensionKey;
        rowHeaderPath.indicatorKey = rowHeader.indicatorKey;
        rowHeaderPath.value =
          rowHeader.value ?? this.getIndicatorInfoByIndicatorKey(rowHeader.indicatorKey)?.title ?? '';
        headerPaths.rowHeaderPaths.push(rowHeaderPath);
      }
    });
    return headerPaths;
  }
  private getIndicatorInfoByIndicatorKey(indicatorKey: string) {
    const indicatorInfo = this.indicatorsDefine?.find(indicator => {
      if (typeof indicator === 'string') {
        return false;
      }
      if (indicatorKey) {
        return indicator.indicatorKey === indicatorKey;
      }
      return false;
    }) as IIndicator;
    return indicatorInfo;
  }
  /**
   *
   * @param row_pathIds 当前_rowHeaderCellIds 可能只存储了一列id如：
   * [
   *   [47],
   *   [50]
   * ]
   * 但实际可能是有两三层或更多，所以全路径dimensionPath的话应该对应更多
   * [
   *   [47, 48, 49]
   *   [50, 51, 52]
   * ]
   * @returns 返回对应每一层维度对应的headerId, [47]为参数的话 返回 [47, 48, 49]
   */
  private findFullCellIds(row_pathIds: LayoutObjectId[]) {
    const pathIds = []; // pathIds记录寻找当前树需要匹配的cellId
    for (let level = 0; level < row_pathIds.length; level++) {
      let cellId: LayoutObjectId = row_pathIds[level]; //row_pathIds中每个值对应了pathIds的一个节点cellId
      pathIds.push(cellId);
      while (true) {
        const hd: HeaderData = this._headerObjectMap[cellId];
        if (hd?.parentCellId) {
          // 将parentCellId加入pathIds
          pathIds.unshift(hd.parentCellId);
          cellId = hd.parentCellId;
        } else {
          break;
        }
      }
    }
    return pathIds;
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

  /**
   * 点击某个单元格的展开折叠按钮 改变该节点的状态 维度树重置
   * @param col
   * @param row
   */
  toggleHierarchyState(col: number, row: number) {
    const oldRowHeaderCellIds = this._rowHeaderCellIds_FULL.slice(0);
    const oldRowHeaderCellPositons = oldRowHeaderCellIds.map((id, row) => {
      return { col, row: row + this.columnHeaderLevelCount };
    });
    const hd = this.getHeader(col, row);
    (<any>hd.define).hierarchyState =
      (<any>hd.define).hierarchyState === HierarchyState.collapse ? HierarchyState.expand : HierarchyState.collapse;
    //过程类似构造函数处理过程
    this.rowDimensionTree.reset(this.rowDimensionTree.tree.children, true);
    this._rowHeaderCellIds_FULL = [];
    this.rowHeaderObjs = this._addHeadersForTreeMode(
      this._rowHeaderCellIds_FULL,
      0,
      this.rowDimensionTree.tree.children,
      [],
      this.rowDimensionTree.totalLevel,
      true,
      this.rowsDefine
    );

    if (this.rowHeaderTitle) {
      const id = ++this.sharedVar.seqId;
      const firstColIds = Array(this.rowCount - this.columnHeaderLevelCount).fill(id);
      this._rowHeaderCellIds_FULL.unshift(firstColIds);
      const cell: HeaderData = {
        id,
        title:
          typeof this.rowHeaderTitle.title === 'string'
            ? this.rowHeaderTitle.title
            : (this.rowsDefine.reduce((title: string, value) => {
                if (typeof value === 'string') {
                  return title;
                }
                return title + (title ? `/${value.title}` : `${value.title}`);
              }, '') as string),
        field: undefined,
        headerType: this.rowHeaderTitle.headerType ?? 'text',
        style: this.rowHeaderTitle.headerStyle,
        define: {
          field: '',
          headerType: 'text',
          cellType: 'text',
          disableHeaderHover: !!this.columnHeaderTitle.disableHeaderHover,
          disableHeaderSelect: !!this.columnHeaderTitle.disableHeaderSelect
        }
      };
      this.rowHeaderObjs.push(cell);
      this._headerObjects[id] = cell;
    }
    this._rowHeaderCellIds_FULL = transpose(this._rowHeaderCellIds_FULL);
    if (this.rowHierarchyType === 'tree' && this.extensionRows?.length >= 1) {
      this.generateExtensionRowTree();
    }
    this.colIndex = 0;
    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key: LayoutObjectId]: HeaderData });
    this._CellHeaderPathMap = new Map();
    // this._cellRangeMap = new Map();
    this._largeCellRangeCache.length = 0;
    const diffCell: {
      addCellPositions: CellAddress[];
      removeCellPositions: CellAddress[];
      updateCellPositions?: CellAddress[];
    } = diffCellAddress(
      col,
      row,
      oldRowHeaderCellIds.map(oldCellId => oldCellId[col]),
      this._rowHeaderCellIds_FULL.map(newCellId => newCellId[col]),
      oldRowHeaderCellPositons,
      this
    );
    this._rowHeaderCellIds = this._rowHeaderCellIds_FULL;

    return diffCell;
  }
  // 为列宽计算专用，兼容列表
  isHeaderForColWidth(col: number, row: number): boolean {
    return this.isHeader(col, row);
  }
  getHeaderForColWidth(col: number, row: number): HeaderData {
    return this.getHeader(col, row);
  }
  /**
   * 通过dimensionPath获取到对应的表头地址col row
   * TODO 这个函数在有extensionRows的时候会有问题 数的startIndex等已经不对应了
   * @param dimensions
   * @returns
   */
  getPivotCellAdress(dimensions: IDimensionInfo[]): CellAddress | undefined {
    if (!Array.isArray(dimensions)) {
      return undefined;
    }
    let rowArr = this.rowTree;
    let rowDimension;
    let colArr = this.columnTree;
    let colDimension;
    for (let i = 0; i < dimensions.length; i++) {
      const highlightDimension = dimensions[i];
      if (
        (highlightDimension.isPivotCorner || !highlightDimension.value) && //判断角头： isPivotCorner或者 没有维度值
        i === dimensions.length - 1
      ) {
        // 判断角表头位置
        if (this?.cornerSetting?.titleOnDimension === 'row') {
          let col = 0; //树形展示的情况下 肯定是在第0列
          if (this.rowHierarchyType === 'grid') {
            col = (this.rowDimensionKeys as Array<string | number>).indexOf(highlightDimension.dimensionKey);
          }
          return col === -1 ? undefined : { col: this.rowHeaderTitle ? col + 1 : col, row: 0 };
        }

        const row = (this.colDimensionKeys as Array<string | number>).indexOf(highlightDimension.dimensionKey);
        return row === -1 ? undefined : { col: 0, row: this.columnHeaderTitle ? row + 1 : row };
      }
      // 判断级别，找到distDimension
      let isCol = false;
      for (let j = 0; j < colArr.length; j++) {
        const dimension = colArr[j];
        if (
          ((isValid(highlightDimension.dimensionKey) && dimension.dimensionKey === highlightDimension.dimensionKey) ||
            (isValid(highlightDimension.indicatorKey) && dimension.indicatorKey === highlightDimension.indicatorKey)) &&
          dimension.value === highlightDimension.value
        ) {
          colArr = dimension.children;
          colDimension = dimension;
          isCol = true;
          break;
        }
      }
      if (isCol) {
        continue;
      }
      for (let k = 0; k < rowArr.length; k++) {
        const dimension = rowArr[k];
        if (
          ((isValid(highlightDimension.dimensionKey) && dimension.dimensionKey === highlightDimension.dimensionKey) ||
            (isValid(highlightDimension.indicatorKey) && dimension.indicatorKey === highlightDimension.indicatorKey)) &&
          dimension.value === highlightDimension.value
        ) {
          rowArr = dimension.children;
          rowDimension = dimension;
          break;
        }
      }
    }

    // 通过dimension获取col和row
    let col = 0;
    let row = 0;
    if (rowDimension) {
      row = this.columnHeaderLevelCount;
      const { startInTotal, level } = rowDimension as ITreeLayoutHeadNode;
      row += startInTotal;
      if (this.rowHierarchyType === 'grid') {
        col = this.rowHeaderTitle ? level + 1 : level;
      } else {
        col = 0;
      } //树形展示的情况下 肯定是在第0列
      return { col, row };
    } else if (colDimension) {
      col = this.rowHeaderLevelCount;
      const { startInTotal, level } = colDimension as ITreeLayoutHeadNode;
      col += startInTotal;
      row = this.columnHeaderTitle ? level + 1 : level;
      return { col, row };
    }
    return undefined;
  }
  getPivotDimensionInfo(col: number, row: number): IDimensionInfo[] {
    const { colHeaderPaths, rowHeaderPaths } = this.getCellHeaderPaths(col, row);
    const pivotInfo: IDimensionInfo[] = [];
    if (colHeaderPaths.length) {
      // 列表头
      colHeaderPaths.forEach((path, i) => {
        pivotInfo.push({
          dimensionKey: path.dimensionKey,
          value: path.value,
          isPivotCorner: false,
          indicatorKey: path.indicatorKey
          // i === colHeaderPaths.length - 1 ? this.getIndicatorKey(col, row) : undefined,
        });
      });
    } else if (rowHeaderPaths.length) {
      // 行表头
      rowHeaderPaths.forEach((path, i) => {
        pivotInfo.push({
          dimensionKey: path.dimensionKey,
          value: path.value,
          isPivotCorner: false,
          indicatorKey: path.indicatorKey
          // i === rowHeaderPaths.length - 1 ? this.getIndicatorKey(col, row) : undefined,
        });
      });
    } else if (this.isCornerHeader(col, row)) {
      // 角表头
      if (this?.cornerSetting?.titleOnDimension === 'row') {
        // for (let i = 0; i <= col; i++) {
        pivotInfo.push({
          dimensionKey: this.rowDimensionKeys[this.rowHeaderTitle ? col - 1 : col],
          isPivotCorner: true
        });
        // }
      } else {
        // for (let i = 0; i <= row; i++) {
        pivotInfo.push({
          dimensionKey: this.colDimensionKeys[this.columnHeaderTitle ? row - 1 : row],
          isPivotCorner: true
        });
        // }
      }
    }

    return pivotInfo;
  }

  getIndicatorKey(col: number, row: number) {
    // let indicator;
    // if (this._indicators?.length === 1) indicator = this._indicators[0];
    // else if (this.indicatorsAsCol) {
    //   const bodyCol = col - this.rowHeaderLevelCount;
    //   indicator = this._indicators[bodyCol % this._indicators?.length];
    // } else {
    //   const bodyRow = row - this.columnHeaderLevelCount;
    //   indicator = this._indicators[bodyRow % this._indicators?.length];
    // }

    // return indicator?.indicatorKey;
    return this.getBody(col, row)?.indicatorKey;
  }
  getParentCellId(col: number, row: number) {
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
  getRowHeaderCellAddressByCellId(cellId: LayoutObjectId) {
    let col;
    let row;
    this._rowHeaderCellIds.find((cellIds, rowIndex) => {
      const finded = cellIds.find((id, colIndex) => {
        if (id === cellId) {
          col = colIndex;
          return true;
        }
        return false;
      });
      if (finded) {
        row = rowIndex;
        return true;
      }
      return false;
    });
    if (isValid(col) && isValid(row)) {
      return { col, row: (row as number) + this.columnHeaderLevelCount };
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
    // 获取操作单元格的range范围
    const sourceCellRange = this.getCellRange(source.col, source.row);
    // 获取source和target对应sourceCellRange.start.row的headerId
    if (this.isColumnHeader(source.col, source.row)) {
      const sourceTopId = this.getParentCellId(source.col, sourceCellRange.start.row);
      const targetTopId = this.getParentCellId(target.col, sourceCellRange.start.row);
      return sourceTopId === targetTopId;
    } else if (this.isRowHeader(source.col, source.row)) {
      if (this.rowHierarchyType === 'tree') {
        const sourceRowHeaderPaths = cloneDeep(
          this.getCellHeaderPathsWidthTreeNode(source.col, source.row).rowHeaderPaths
        );
        const targetRowHeaderPaths = cloneDeep(
          this.getCellHeaderPathsWidthTreeNode(target.col, target.row).rowHeaderPaths
        );
        sourceRowHeaderPaths.pop(); // 如果用了缓存_CellHeaderPathMap的话 这里pop会影响缓存的值 所以上面使用clone
        targetRowHeaderPaths.pop();
        if (sourceRowHeaderPaths.length <= targetRowHeaderPaths.length) {
          if (sourceRowHeaderPaths.length === targetRowHeaderPaths.length) {
            return !sourceRowHeaderPaths.find(
              (item: any, i: number) =>
                item.dimensionKey !== targetRowHeaderPaths[i].dimensionKey ||
                item.value !== targetRowHeaderPaths[i].value
            );
          }
          return true;
        }
      } else {
        const sourceTopId = this.getParentCellId(sourceCellRange.start.col, source.row);
        const targetTopId = this.getParentCellId(sourceCellRange.start.col, target.row);
        return sourceTopId === targetTopId;
      }
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
    if (
      this.canMoveHeaderPosition(source, target) &&
      !this.isCellRangeEqual(source.col, source.row, target.col, target.row)
    ) {
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
        if (targetIndex === sourceCellRange.end.col - this.rowHeaderLevelCount) {
          return null;
        }
        // 逐行将每一行的source id 移动到目标地址targetCol处
        for (let row = 0; row < this._columnHeaderCellIds.length; row++) {
          // 从header id的二维数组中取出需要操作的source ids
          const sourceIds = this._columnHeaderCellIds[row].splice(
            sourceCellRange.start.col - this.rowHeaderLevelCount,
            moveSize
          );
          // 将source ids插入到目标地址targetCol处
          // 把sourceIds变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入sourceIds数组
          sourceIds.unshift(targetIndex - this.rowHeaderLevelCount, 0);
          Array.prototype.splice.apply(this._columnHeaderCellIds[row], sourceIds);
        }

        //将_columns的列定义调整位置 同调整_headerCellIds逻辑
        const sourceColumns = this._columnWidths.splice(sourceCellRange.start.col, moveSize);
        sourceColumns.unshift(targetIndex as any, 0 as any);
        Array.prototype.splice.apply(this._columnWidths, sourceColumns);

        // 对维度树结构调整节点位置
        this.columnDimensionTree.movePosition(
          this.getCellHeaderPathsWidthTreeNode(source.col, source.row).colHeaderPaths.length - 1,
          sourceCellRange.start.col - this.rowHeaderLevelCount,
          targetIndex - this.rowHeaderLevelCount
        );
        this.columnDimensionTree.reset(this.columnDimensionTree.tree.children, true);
        this._CellHeaderPathMap = new Map();
        // this._cellRangeMap = new Map();
        this._largeCellRangeCache.length = 0;
        return {
          sourceIndex: sourceCellRange.start.col,
          targetIndex,
          moveSize,
          moveType: 'column'
        };
      } else if (this.isRowHeader(source.col, source.row)) {
        // 插入目标地址的列index
        let targetIndex;
        const sourceRowHeaderPaths = this.getCellHeaderPathsWidthTreeNode(source.col, source.row).rowHeaderPaths as any;
        const targetRowHeaderPaths = this.getCellHeaderPathsWidthTreeNode(target.col, target.row).rowHeaderPaths as any;
        const sourceRowHeaderNode = sourceRowHeaderPaths[sourceRowHeaderPaths.length - 1];
        const targetRowHeaderNode = targetRowHeaderPaths[sourceRowHeaderPaths.length - 1];
        //整体移动的列数
        const moveSize = sourceRowHeaderNode.size;
        if (target.row >= source.row) {
          targetIndex = targetRowHeaderNode.startInTotal + targetRowHeaderNode.size - moveSize;
        } else {
          targetIndex = targetRowHeaderNode.startInTotal;
        }

        //如果操作列和目标地址col一样 则不执行其他逻辑
        if (
          targetIndex === source.row - this.columnHeaderLevelCount ||
          targetIndex === sourceCellRange.end.row - this.columnHeaderLevelCount
        ) {
          return null;
        }

        // 表头id _rowHeaderCellIds进行调整
        // 从header id的二维数组中取出需要操作的source ids
        const sourceIds = this._rowHeaderCellIds.splice(
          sourceCellRange.start.row - this.columnHeaderLevelCount,
          moveSize
        );
        sourceIds.unshift((targetIndex - this.currentPageStartIndex) as any, 0 as any);
        Array.prototype.splice.apply(this._rowHeaderCellIds, sourceIds);
        // 表头id _rowHeaderCellIds_FULL进行调整
        // 从header id的二维数组中取出需要操作的source ids
        const sourceIds_FULL = this._rowHeaderCellIds_FULL.splice(
          sourceCellRange.start.row + this.currentPageStartIndex,
          moveSize
        );
        sourceIds_FULL.unshift(targetIndex as any, 0 as any);
        Array.prototype.splice.apply(this._rowHeaderCellIds_FULL, sourceIds_FULL);
        // 对维度树结构调整节点位置
        this.rowDimensionTree.movePosition(
          this.getCellHeaderPathsWidthTreeNode(source.col, source.row).rowHeaderPaths.length - 1,
          sourceCellRange.start.row - this.columnHeaderLevelCount,
          targetIndex + (target.row > source.row ? sourceRowHeaderNode.size - 1 : 0)
        );
        this.rowDimensionTree.reset(this.rowDimensionTree.tree.children, true);
        this._CellHeaderPathMap = new Map();
        // this._cellRangeMap = new Map();
        this._largeCellRangeCache.length = 0;
        return {
          sourceIndex: sourceCellRange.start.row,
          targetIndex: targetIndex + this.columnHeaderLevelCount,
          moveSize,
          moveType: 'row'
        };
      }
    }
    return null;
  }

  /**
   * 通过dimensionPath获取到对应的表头地址col row, dimensionPath不要求必须按照表头层级顺序传递
   * @param dimensions
   * @returns
   */
  getCellAdressByHeaderPath(
    dimensionPaths: // | {
    //     colHeaderPaths: IDimensionInfo[];
    //     rowHeaderPaths: IDimensionInfo[];
    //   }
    IPivotTableCellHeaderPaths | IDimensionInfo[]
  ): CellAddress | undefined {
    let colHeaderPaths;
    let rowHeaderPaths: {
      dimensionKey?: string;
      indicatorKey?: string;
      value?: string;
    }[];
    let forceBody = false;
    if (Array.isArray(dimensionPaths)) {
      if (dimensionPaths.length > this.rowDimensionKeys.length + this.colDimensionKeys.length) {
        //如果传入的path长度比行列维度层级多的话 无法匹配
        return undefined;
      }
      // 如果传入的是整体的path 按照行列维度区分开
      colHeaderPaths = dimensionPaths.filter(
        (path: IDimensionInfo) => this.colDimensionKeys.indexOf(path.dimensionKey) >= 0
      );
      rowHeaderPaths = dimensionPaths.filter(
        (path: IDimensionInfo) => this.rowDimensionKeys.indexOf(path.dimensionKey) >= 0
      );
    } else {
      colHeaderPaths = dimensionPaths.colHeaderPaths;
      rowHeaderPaths = dimensionPaths.rowHeaderPaths;
      if (dimensionPaths?.cellLocation === 'body' && this._table.isPivotTable()) {
        forceBody = true;
      }
    }

    if (!Array.isArray(colHeaderPaths) && !Array.isArray(rowHeaderPaths)) {
      return undefined;
    }
    // 行列维度path根据key排序
    colHeaderPaths?.sort((a, b) => {
      return (
        this.colDimensionKeys.indexOf(a.dimensionKey ?? this.indicatorDimensionKey) -
        this.colDimensionKeys.indexOf(b.dimensionKey ?? this.indicatorDimensionKey)
      );
    });
    rowHeaderPaths?.sort((a, b) => {
      return (
        this.fullRowDimensionKeys.indexOf(a.dimensionKey ?? this.indicatorDimensionKey) -
        this.fullRowDimensionKeys.indexOf(b.dimensionKey ?? this.indicatorDimensionKey)
      );
    });
    let needLowestLevel = false; // needLowestLevel来标记是否需要 提供到最底层的维度层级信息
    // 如果行列维度都有值 说明是匹配body单元格 那这个时候 维度层级应该是满的
    if (colHeaderPaths?.length >= 1 && rowHeaderPaths?.length >= 1) {
      needLowestLevel = true;
    }
    let col;
    let row;
    let defaultCol;
    let defaultRow;
    let rowArr = this.rowTree;
    let rowDimensionFinded;
    let colArr = this.columnTree;
    let colDimensionFinded;
    // 按照colHeaderPaths维度层级寻找到底层维度值节点
    if (colHeaderPaths) {
      for (let i = 0; i < colHeaderPaths.length; i++) {
        const colDimension = colHeaderPaths[i];
        for (let j = 0; j < colArr.length; j++) {
          const dimension = colArr[j];
          if (
            (!isValid(colDimension.indicatorKey) &&
              dimension.dimensionKey === colDimension.dimensionKey &&
              dimension.value === colDimension.value) ||
            (isValid(colDimension.indicatorKey) && dimension.indicatorKey === colDimension.indicatorKey)
          ) {
            colArr = dimension.children;
            if (needLowestLevel && !colArr) {
              colDimensionFinded = dimension;
            } else if (!needLowestLevel) {
              colDimensionFinded = dimension;
            }
            break;
          }
        }
      }
    }
    // 按照rowHeaderPaths维度层级寻找到底层维度值节点
    if (rowHeaderPaths?.length >= 1) {
      if (this.rowHierarchyType === 'tree') {
        // 先根据最后一个path获取到所有匹配该维度的pathCellIds
        const rowDimension = rowHeaderPaths[rowHeaderPaths.length - 1];
        const cellIDs: LayoutObjectId[] = this.headerObjects
          .filter((hd: HeaderData) => {
            return (
              (hd?.field === rowDimension.dimensionKey || hd?.field === rowDimension.indicatorKey) &&
              hd?.title === rowDimension.value
            );
          })
          .map((hd: HeaderData) => {
            return hd.id;
          });

        const findedCellIdPaths = this._rowHeaderCellIds.filter(rowHdCellIDs => {
          return cellIDs.indexOf(rowHdCellIDs[rowHdCellIDs.length - 1]) >= 0;
        });
        // 从上述过程中找到的pathCellIds中找到正确匹配完整路径rowHeaderPaths的一个  然后计算row行号
        const findedCellIdPath = findedCellIdPaths.find(pathIds => {
          const fullCellIds = this.findFullCellIds(pathIds);
          return (
            fullCellIds.length === rowHeaderPaths.length &&
            fullCellIds.every(id => {
              const curHd = this._headerObjectMap[id];
              return rowHeaderPaths.find(rowDimensionPath => {
                return rowDimensionPath.dimensionKey === curHd.field && rowDimensionPath.value === curHd.title;
              });
            })
          );
        });
        row = this._rowHeaderCellIds.indexOf(findedCellIdPath) + this.columnHeaderLevelCount;
      } else {
        for (let i = 0; i < rowHeaderPaths.length; i++) {
          const rowDimension = rowHeaderPaths[i];
          // 判断级别，找到distDimension
          // let isCol = false;
          for (let j = 0; j < rowArr.length; j++) {
            const dimension = rowArr[j];
            if (
              (!isValid(rowDimension.indicatorKey) &&
                dimension.dimensionKey === rowDimension.dimensionKey &&
                dimension.value === rowDimension.value) ||
              (isValid(rowDimension.indicatorKey) &&
                dimension.indicatorKey === rowDimension.indicatorKey &&
                (!rowDimension.value || dimension.value === rowDimension.value))
            ) {
              rowArr = dimension.children;
              if (needLowestLevel && !rowArr) {
                rowDimensionFinded = dimension;
              } else if (!needLowestLevel) {
                rowDimensionFinded = dimension;
              }
              break;
            }
          }
        }
      }
    }
    // 如果是body单元格 需要找到行列对应的维度值节点
    if (!forceBody && needLowestLevel) {
      if ((!rowDimensionFinded && !isValid(row)) || !colDimensionFinded) {
        return undefined;
      }
    }
    // 通过dimension获取col和row
    if (rowDimensionFinded || forceBody) {
      row = this.columnHeaderLevelCount;
      const { startInTotal, level } = (rowDimensionFinded as ITreeLayoutHeadNode) ?? defaultDimension;
      row += startInTotal ?? 0;
      if (this.rowHierarchyType === 'grid') {
        defaultCol = this.rowHeaderTitle ? level + 1 : level;
      } else {
        defaultCol = 0;
      } //树形展示的情况下 肯定是在第0列
    }
    if (colDimensionFinded || forceBody) {
      col = this.rowHeaderLevelCount;
      const { startInTotal, level } = (colDimensionFinded as ITreeLayoutHeadNode) ?? defaultDimension;
      col += startInTotal ?? 0;
      defaultRow = this.columnHeaderTitle ? level + 1 : level;
    }
    if (isValid(col) || isValid(row)) {
      return { col: col ?? defaultCol, row: row ?? defaultRow };
    }
    return undefined;
  }

  setChartInstance(_col: number, _row: number, chartInstance: any) {
    const paths = this.getCellHeaderPaths(_col, _row);
    let indicatorObj;
    if (this.indicatorsAsCol) {
      const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey);
    } else {
      const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey);
    }
    if (typeof indicatorObj?.chartSpec === 'function') {
      return;
    }
    indicatorObj && (indicatorObj.chartInstance = chartInstance);
  }

  getChartInstance(_col: number, _row: number) {
    const paths = this.getCellHeaderPaths(_col, _row);
    let indicatorObj;
    if (this.indicatorsAsCol) {
      const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey);
    } else {
      const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
      indicatorObj = this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey);
    }
    return indicatorObj?.chartInstance;
  }
  checkHasChart() {
    return checkHasChart(this);
  }

  getDimension(dimensionKey: string, type: 'column' | 'row'): any {
    if (type === 'column') {
      return this.columnsDefine?.find(dimension =>
        typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
      );
    } else if (type === 'row') {
      return this.rowsDefine?.find(dimension =>
        typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
      );
    }
  }

  getAxisConfigInPivotChart(col: number, row: number): any {
    if (
      ((this.isFrozenColumn(col, row) || this.isRightFrozenColumn(col, row)) &&
        isHasCartesianChartInline(col, row, 'row', this)) ||
      ((this.isFrozenRow(col, row) || this.isBottomFrozenRow(col, row)) &&
        isHasCartesianChartInline(col, row, 'col', this))
    ) {
      return getAxisConfigInPivotChart(col, row, this);
    }
    return undefined;
  }
  isEmpty(col: number, row: number) {
    if (!this._table.isPivotChart()) {
      return false;
    }
    if (this.isLeftBottomCorner(col, row)) {
      return true;
    }
    if (this.isRightBottomCorner(col, row)) {
      return true;
    }
    if (this.isRightTopCorner(col, row)) {
      return true;
    }
    return false;
  }
  isAxisCell(col: number, row: number) {
    if (!this._table.isPivotChart()) {
      return false;
    }
    if (this.indicatorKeys.length >= 1 && checkHasCartesianChart(this)) {
      if (
        (this.isBottomFrozenRow(col, row) && isHasCartesianChartInline(col, row, 'col', this)) ||
        (this.isRightFrozenColumn(col, row) && isHasCartesianChartInline(col, row, 'row', this))
      ) {
        return true;
      }
      if (
        this.isRowHeader(col, row) &&
        col === this.rowHeaderLevelCount - 1 &&
        isHasCartesianChartInline(col, row, 'row', this)
      ) {
        return true;
      }
      if (
        this.hasTwoIndicatorAxes &&
        this.indicatorsAsCol &&
        row === this.columnHeaderLevelCount - 1 &&
        isHasCartesianChartInline(col, row, 'col', this)
      ) {
        return true;
      }
    }
    return false;
  }
  getChartAxes(col: number, row: number): any[] {
    if (isCartesianChart(col, row, this) || this.isAxisCell(col, row)) {
      return getChartAxes(col, row, this);
    }
    return undefined;
  }
  getRawChartSpec(col: number, row: number): any {
    return getRawChartSpec(col, row, this);
  }

  getChartSpec(col: number, row: number): any {
    return getChartSpec(col, row, this);
  }
  isShareChartSpec(col: number, row: number): any {
    return isShareChartSpec(col, row, this);
  }
  getChartDataId(col: number, row: number): any {
    return getChartDataId(col, row, this);
  }

  setPagination(pagination: IPagination): void {
    this.clearCellRangeMap();
    this.pagination = pagination;

    if (
      this.rowHierarchyType === 'grid' &&
      isValid(this.pagination?.perPageCount) &&
      isValid(this.pagination?.currentPage)
    ) {
      //调整perPageCount的数量 需要是indicatorKeys.length的整数倍
      if (this.indicatorsAsCol === false) {
        this.pagination.perPageCount =
          Math.ceil(this.pagination.perPageCount / this.indicatorKeys.length) * this.indicatorKeys.length;
      }
      const { perPageCount, currentPage } = this.pagination;
      // const startIndex = Math.ceil((perPageCount * (currentPage || 0)) / this.indicatorKeys.length);
      // const endIndex = startIndex + Math.ceil(perPageCount / this.indicatorKeys.length);
      this.currentPageStartIndex = perPageCount * (currentPage || 0);
      this.currentPageEndIndex = this.currentPageStartIndex + perPageCount;
      this._rowHeaderCellIds = this._rowHeaderCellIds_FULL?.slice(this.currentPageStartIndex, this.currentPageEndIndex);
    } else {
      this.currentPageStartIndex = 0;
      this.currentPageEndIndex = this._rowHeaderCellIds_FULL.length;
      this._rowHeaderCellIds = this._rowHeaderCellIds_FULL?.slice(this.currentPageStartIndex, this.currentPageEndIndex);
    }
    this.pagination && (this.pagination.totalCount = this._rowHeaderCellIds_FULL?.length);
  }
  release() {
    const activeChartInstance = (this._table as PivotTable)._getActiveChartInstance();
    activeChartInstance?.release();
    this._indicators?.forEach(indicatorObject => {
      indicatorObject.chartInstance?.release();
    });
  }

  getHeadNode(dimensions: IDimensionInfo[]) {
    if (!Array.isArray(dimensions)) {
      return undefined;
    }
    let rowArr = this.rowTree;
    let rowDimension;
    let colArr = this.columnTree;
    let colDimension;
    for (let i = 0; i < dimensions.length; i++) {
      const highlightDimension = dimensions[i];
      if (
        (highlightDimension.isPivotCorner || !highlightDimension.value) && //判断角头： isPivotCorner或者 没有维度值
        i === dimensions.length - 1
      ) {
        // 判断角表头位置
        return undefined;
      }
      // 判断级别，找到distDimension
      let isCol = false;
      for (let j = 0; j < colArr.length; j++) {
        const dimension = colArr[j];
        if (
          ((isValid(highlightDimension.dimensionKey) && dimension.dimensionKey === highlightDimension.dimensionKey) ||
            (isValid(highlightDimension.indicatorKey) && dimension.indicatorKey === highlightDimension.indicatorKey)) &&
          dimension.value === highlightDimension.value
        ) {
          colArr = dimension.children;
          colDimension = dimension;
          isCol = true;
          break;
        }
      }
      if (isCol) {
        continue;
      }
      for (let k = 0; k < rowArr.length; k++) {
        const dimension = rowArr[k];
        if (
          ((isValid(highlightDimension.dimensionKey) && dimension.dimensionKey === highlightDimension.dimensionKey) ||
            (isValid(highlightDimension.indicatorKey) && dimension.indicatorKey === highlightDimension.indicatorKey)) &&
          dimension.value === highlightDimension.value
        ) {
          rowArr = dimension.children;
          rowDimension = dimension;
          break;
        }
      }
    }

    // 通过dimension获取col和row
    if (rowDimension) {
      return rowDimension;
    } else if (colDimension) {
      return colDimension;
    }
    return undefined;
  }

  clearCellRangeMap() {
    // this._cellRangeMap.clear();
    this._largeCellRangeCache.length = 0;
    this._CellHeaderPathMap = new Map();
  }

  /**
   *  获取图表对应的维度key非指标
   * */
  getDimensionKeyInChartSpec(_col: number, _row: number) {
    let dimensionKey: string;
    if (this.indicatorsAsCol === false) {
      //考虑pie和bar 同时配置的情况 series?.[0]?.xField;没有的情况
      for (let i = 0; i < this.indicatorsDefine.length; i++) {
        const chartSpec = (this.indicatorsDefine[i] as IChartIndicator).chartSpec;
        if (chartSpec) {
          dimensionKey = chartSpec.xField ?? chartSpec?.series?.[0]?.xField;
          if (dimensionKey) {
            return dimensionKey;
          }
        }
      }
    } else {
      //考虑pie和bar 同时配置的情况 series?.[0]?.xField;没有的情况
      for (let i = 0; i < this.indicatorsDefine.length; i++) {
        const chartSpec = (this.indicatorsDefine[i] as IChartIndicator).chartSpec;
        if (chartSpec) {
          dimensionKey = chartSpec.yField ?? chartSpec?.series?.[0]?.yField;
          if (dimensionKey) {
            return dimensionKey;
          }
        }
      }
    }
    return null;
  }

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
          } else if ((this._table as PivotChart)._selectedDimensionInChart?.length) {
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
          } else if ((this._table as PivotChart)._selectedDimensionInChart?.length) {
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
    this._indicators.forEach((_indicatorObject: IndicatorData) => {
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
      if (chartSpec.series || chartSpec.xField || chartSpec.yField) {
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
      } else if (chartSpec.valueField) {
        indicatorKeys.push(chartSpec.valueField);
      }
      if (indicatorKeys.length >= 1) {
        return indicatorKeys;
      }
    }
    return null;
  }
  /** 获取某一图表列的最优高度，计算逻辑是根据图表的yField的维度值个数 * barWidth */
  getOptimunHeightForChart(row: number) {
    const path = this.getCellHeaderPaths(this.rowHeaderLevelCount, row).rowHeaderPaths;
    let collectedValues: any;
    for (const key in this.dataset.collectValuesBy) {
      if (this.dataset.collectValuesBy[key].type === 'yField' && !this.dataset.collectValuesBy[key].range) {
        collectedValues =
          this.dataset.collectedValues[key]?.[
            path
              .map(pathObj => {
                return pathObj.value;
              })
              .join(this.dataset.stringJoinChar)
          ];
        break;
      }
    }
    let height;
    if (this._chartItemBandSize) {
      // height = (collectedValues?.length ?? 0) * this._chartItemBandSize;
      height = scaleWholeRangeSize(
        collectedValues?.length ?? 0,
        this._chartItemBandSize,
        this._chartPaddingInner,
        this._chartPaddingOuter
      );
    } else {
      const barWidth = this._chartItemSpanSize || 25;
      height = (collectedValues?.length ?? 0) * (barWidth + barWidth / 3);
    }
    const padding = getQuadProps(this._chartPadding ?? (this._table.theme.bodyStyle.padding as number) ?? 0);
    return height + padding[0] + padding[2];
  }
  /** 获取某一图表列的最优宽度，计算逻辑是根据图表的xField的维度值个数 * barWidth */
  getOptimunWidthForChart(col: number) {
    const path = this.getCellHeaderPaths(col, this.columnHeaderLevelCount).colHeaderPaths;
    let collectedValues: any;
    for (const key in this.dataset.collectValuesBy) {
      if (this.dataset.collectValuesBy[key].type === 'xField' && !this.dataset.collectValuesBy[key].range) {
        collectedValues =
          this.dataset.collectedValues[key]?.[
            path
              .map(pathObj => {
                return pathObj.value;
              })
              .join(this.dataset.stringJoinChar)
          ];
        break;
      }
    }
    let width;
    if (this._chartItemBandSize) {
      // width = (collectedValues?.length ?? 0) * this._chartItemBandSize;
      width = scaleWholeRangeSize(
        collectedValues?.length ?? 0,
        this._chartItemBandSize,
        this._chartPaddingInner,
        this._chartPaddingOuter
      );
    } else {
      const barWidth = this._chartItemSpanSize || 25;
      width = (collectedValues?.length ?? 0) * (barWidth + barWidth / 3);
    }

    const padding = getQuadProps(this._chartPadding ?? (this._table.theme.bodyStyle.padding as number) ?? 0);
    return width + padding[1] + padding[3];
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
  getColKeysPath(col: number, row: number) {
    // const index = !this.indicatorsAsCol
    //   ? col - this.rowHeaderLevelCount
    //   : Math.floor((col - this.rowHeaderLevelCount) / this.indicatorKeys.length);
    // const colKey = this.dataset.colKeys[index];
    const path = this.getCellHeaderPaths(col, row);
    const colKey: string[] = [];
    if (path.colHeaderPaths.length) {
      path.colHeaderPaths.forEach(path => {
        if (path.dimensionKey) {
          colKey.push(path.value);
        }
      });
    }
    return colKey?.join(this.dataset.stringJoinChar);
  }
  getRowKeysPath(col: number, row: number) {
    // const index = this.indicatorsAsCol
    //   ? row - this.columnHeaderLevelCount
    //   : Math.floor((row - this.columnHeaderLevelCount) / this.indicatorKeys.length);
    // const rowKey = this.dataset.rowKeys[index];
    const path = this.getCellHeaderPaths(col, row);
    const rowKey: string[] = [];
    if (path.rowHeaderPaths.length) {
      path.rowHeaderPaths.forEach(path => {
        if (path.dimensionKey) {
          rowKey.push(path.value);
        }
      });
    }
    return rowKey?.join(this.dataset.stringJoinChar);
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
        return indicator.title === indicatorValue;
      }
      return false;
    }) as IIndicator;
    return indicatorInfo;
  }
  /** 获取行头树结构 */
  getLayoutColumnTree() {
    const tree: LayouTreeNode[] = [];
    const children = this.columnDimensionTree.tree.children;
    generateLayoutTree(tree, children);
    return tree;
  }
  /** 获取行头树结构 */
  getLayoutRowTree() {
    const tree: LayouTreeNode[] = [];
    const children = this.rowDimensionTree.tree.children;
    generateLayoutTree(tree, children);
    return tree;
  }
  /** 获取列头总共的行数（全部展开情况下） */
  getLayoutColumnTreeCount() {
    const children = this.columnDimensionTree.tree.children;
    const mainTreeCount = countLayoutTree(children, this.rowHierarchyType === 'tree');
    return mainTreeCount;
  }
  /** 获取行头总共的行数（全部展开情况下） */
  getLayoutRowTreeCount() {
    const children = this.rowDimensionTree.tree.children;
    const mainTreeCount = countLayoutTree(children, this.rowHierarchyType === 'tree');
    let totalCount = mainTreeCount;
    this.extensionRows?.forEach(extensionRow => {
      if (typeof extensionRow.rowTree !== 'function') {
        //如果是自定义函数的扩展树结构 忽略这个计算 因为太复杂 需要将每个函数需要的参数都构造好才行
        const thisTreeCount = countLayoutTree(extensionRow.rowTree as { children: any }[], true);
        totalCount *= thisTreeCount;
      }
    });
    return totalCount;
  }
  resetHeaderTree() {
    //和初始化代码逻辑一致 但未考虑透视图类型
    this._rowHeaderCellIds_FULL = [];
    this._columnHeaderCellIds = [];
    const dataset = this.dataset;
    // if (dataset) {
    this.rowTree = dataset.rowHeaderTree;
    this.columnTree = dataset.colHeaderTree;

    this.columnDimensionTree = new DimensionTree((this.columnTree as ITreeLayoutHeadNode[]) ?? [], this.sharedVar);
    this.rowDimensionTree = new DimensionTree(
      (this.rowTree as ITreeLayoutHeadNode[]) ?? [],
      this.sharedVar,
      this.rowHierarchyType,
      this.rowHierarchyType === 'tree' ? this.rowExpandLevel : undefined
    );
    //生成列表头单元格
    this._generateColHeaderIds();

    this.colIndex = 0;
    //生成行表头单元格
    this._generateRowHeaderIds();

    this.resetColumnHeaderLevelCount();
    this._rowHeaderCellIds_FULL = transpose(this._rowHeaderCellIds_FULL);

    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key: LayoutObjectId]: HeaderData });
    this.setPagination(this.pagination);
  }
}
/** 计算 scale 的实际 range 长度 */
function scaleWholeRangeSize(count: number, bandwidth: number, paddingInner: number, paddingOuter: number) {
  if (paddingInner === 1) {
    paddingInner = 0; // 保护
    // FIXME: vscale 同样需要加保护，目前这里加了保护以后，在 paddingInner为 1 的情况还是会崩溃
  }
  const space = bandSpace(count, paddingInner, paddingOuter);
  const step = bandwidth / (1 - paddingInner);
  const wholeSize = Math.ceil(space * step);
  return wholeSize;
}

function bandSpace(count: number, paddingInner: number, paddingOuter: number): number {
  let space;
  // count 等于 1 时需要特殊处理，否则 step 会超出 range 范围
  // 计算公式: step = paddingOuter * step * 2 + paddingInner * step + bandwidth
  if (count === 1) {
    space = count + paddingOuter * 2;
  } else {
    space = count - paddingInner + paddingOuter * 2;
  }
  return count ? (space > 0 ? space : 1) : 0;
}
