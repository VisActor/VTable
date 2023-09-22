/* eslint-disable sort-imports */
import { cloneDeep, isValid, transpose } from '../tools/util';
import type {
  CellAddress,
  CellRange,
  ICustomRender,
  IPivotTableCellHeaderPaths,
  LayoutObjectId,
  ShowColumnRowType,
  ColumnIconOption,
  CellInfo,
  CellLocation,
  IHeaderTreeDefine,
  IDimension,
  IIndicator,
  ITitleDefine,
  ICornerDefine,
  IDimensionInfo,
  IExtensionRowDefine
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
import { NumberMap } from '../tools/NumberMap';
import type { Either } from '../tools/helper';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
import { diffCellAddress } from '../tools/diff-cell';
import type { ILinkDimension } from '../ts-types/pivot-table/dimension/link-dimension';
import type { IImageDimension } from '../ts-types/pivot-table/dimension/image-dimension';
import { getChartDataId, getRawChartSpec } from './chart-helper/get-chart-spec';
interface IPivotLayoutBaseHeadNode {
  id: number;
  // dimensionKey: string;
  // // title: string;
  // indicatorKey?: string;
  value: string;
  children: IPivotLayoutHeadNode[] | undefined;
  level: number;
  startIndex: number;
  size: number; //对应到colSpan或者rowSpan
  // parsing?:  'img' | 'link' | 'video' | 'templateLink';
  startInTotal: number;
  // headerStyle:HeaderStyleOption| null;
  customRender?: ICustomRender;

  hierarchyState: HierarchyState;
  headerIcon?: (string | ColumnIconOption)[] | ((args: CellInfo) => (string | ColumnIconOption)[]);
}
interface IPivotLayoutDimensionHeadNode extends IPivotLayoutBaseHeadNode {
  dimensionKey: string;
}
interface IPivotLayoutIndicatorHeadNode extends IPivotLayoutBaseHeadNode {
  indicatorKey: string;
}
type IPivotLayoutHeadNode = Either<IPivotLayoutDimensionHeadNode, IPivotLayoutIndicatorHeadNode>;
class DimensionTree {
  // 每一个值对应的序号 结果缓存
  // cache: {
  //   [propName: string]: any;
  // };
  //树形展示 会将非叶子节点单独展示一行 所以size会增加非叶子节点的个数
  sizeIncludeParent = false;
  rowExpandLevel: number;
  hierarchyType: 'grid' | 'tree';
  tree: IPivotLayoutHeadNode = {
    id: 0,
    dimensionKey: '',
    // title: '',
    value: '',
    children: [],
    level: -1,
    startIndex: 0,
    size: 0,
    startInTotal: 0,
    hierarchyState: undefined
  };

  totalLevel = 0;

  // blockLevel: number = 0;

  // blockStartIndexMap: Map<number, boolean> = new Map();
  // blockEndIndexMap: Map<number, boolean> = new Map();
  dimensionKeys: NumberMap<string> = new NumberMap<string>();
  // dimensions: IDimension[] | undefined;//目前用不到这个
  constructor(
    tree: IPivotLayoutHeadNode[],
    hierarchyType: 'grid' | 'tree' = 'grid',
    rowExpandLevel: number = undefined
  ) {
    this.sizeIncludeParent = rowExpandLevel !== null && rowExpandLevel !== undefined;
    this.rowExpandLevel = rowExpandLevel;
    this.hierarchyType = hierarchyType;
    this.reset(tree);
  }

  reset(tree: IPivotLayoutHeadNode[], updateTreeNode = false) {
    // 清空缓存的计算
    // this.cache = {};
    // this.dimensions = dimensions;
    this.dimensionKeys = new NumberMap<string>();
    this.tree.children = tree as IPivotLayoutHeadNode[];
    // const re = { totalLevel: 0 };
    // if (updateTreeNode) this.updateTreeNode(this.tree, 0, re, this.tree);
    // else
    this.setTreeNode(this.tree, 0, this.tree);
    this.totalLevel = this.dimensionKeys.count();
  }
  setTreeNode(node: IPivotLayoutHeadNode, startIndex: number, parent: IPivotLayoutHeadNode): number {
    node.startIndex = startIndex;
    node.startInTotal = (parent.startInTotal ?? 0) + node.startIndex;
    // if (node.dimensionKey) {
    //   !this.dimensionKeys.contain(node.dimensionKey) &&
    //     this.dimensionKeys.put(node.level, node.dimensionKey);
    //   if (!node.id) node.id = ++seqId;
    // }
    if (node.dimensionKey ?? node.indicatorKey) {
      !this.dimensionKeys.contain(node.indicatorKey ? IndicatorDimensionKeyPlaceholder : node.dimensionKey) &&
        this.dimensionKeys.put(node.level, node.indicatorKey ? IndicatorDimensionKeyPlaceholder : node.dimensionKey);
      if (!node.id) {
        node.id = ++seqId;
      }
    }
    let size = node.dimensionKey ? (this.sizeIncludeParent ? 1 : 0) : 0;
    //平铺展示 分析所有层级
    if (this.hierarchyType === 'grid') {
      if (node.children) {
        node.children.forEach(n => {
          n.level = (node.level ?? 0) + 1;
          size += this.setTreeNode(n, size, node);
        });
      } else {
        size = 1;
        // re.totalLevel = Math.max(re.totalLevel, (node.level ?? -1) + 1);
      }
    } else if (node.hierarchyState === HierarchyState.expand && node.children) {
      //树形展示 有子节点 且下一层需要展开
      node.children.forEach(n => {
        n.level = (node.level ?? 0) + 1;
        size += this.setTreeNode(n, size, node);
      });
    } else if (node.hierarchyState === HierarchyState.collapse && node.children) {
      //树形展示 有子节点 且下一层不需要展开
      node.children.forEach(n => {
        n.level = (node.level ?? 0) + 1;
        this.setTreeNode(n, size, node);
      });
    } else if (!node.hierarchyState && node.level + 1 < this.rowExpandLevel && node.children) {
      //树形展示 有子节点 且下一层需要展开
      node.hierarchyState = HierarchyState.expand;
      node.children.forEach(n => {
        n.level = (node.level ?? 0) + 1;
        size += this.setTreeNode(n, size, node);
      });
    } else if (node.children) {
      //树形展示 有子节点 且下一层不需要展开
      node.hierarchyState = HierarchyState.collapse;
      node.children.forEach(n => {
        n.level = (node.level ?? 0) + 1;
        this.setTreeNode(n, size, node);
      });
    } else {
      //树形展示 无children子节点。但不能确定是最后一层的叶子节点 totalLevel还不能确定是计算完整棵树的整体深度
      node.hierarchyState = HierarchyState.none;
      size = 1;
      // re.totalLevel = Math.max(re.totalLevel, (node.level ?? -1) + 1);
    }

    node.size = size;
    // startInTotal = parent.startIndex + prevStartIndex
    return size;
  }
  getTreePath(index: number, maxDeep = 30): Array<IPivotLayoutHeadNode> {
    const path: any[] = [];
    this.searchPath(index, this.tree, path, maxDeep);
    path.shift();
    return path;
  }

  getTreePathByCellIds(ids: LayoutObjectId[]): Array<IPivotLayoutHeadNode> {
    const path: any[] = [];
    let nodes = this.tree.children;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const pathNode = this.findNodeById(nodes, id);
      if (pathNode) {
        path.push(pathNode);
        nodes = pathNode.children;
      } else {
        break;
      }
    }
    // path.shift();
    return path;
  }
  findNodeById(nodes: IPivotLayoutHeadNode[], id: LayoutObjectId) {
    return nodes.find(node => {
      return node.id === id;
    });
  }
  searchPath(index: number, node: IPivotLayoutHeadNode, path: Array<IPivotLayoutHeadNode>, maxDeep: number) {
    if (!node) {
      return false;
    }
    if (index < node.startIndex || index >= node.startIndex + node.size) {
      return false;
    }
    path.push(node);
    if (!node.children || node.children.length === 0) {
      return true;
    }
    if (node.level >= maxDeep) {
      return true;
    }
    // 这里按照 数据填充时，序号时同级序号 还是全局序号
    const cIndex = index - node.startIndex;
    node.children.some(n => this.searchPath(cIndex, n, path, maxDeep));
    return true;
  }
  /**
   * 将该树中 层级为level 的sourceIndex处的节点移动到targetIndex位置
   * @param level
   * @param sourceIndex
   * @param targetIndex
   */
  movePosition(level: number, sourceIndex: number, targetIndex: number) {
    // let sourceNode: IPivotLayoutHeadNode;
    let parNode: IPivotLayoutHeadNode;
    let sourceSubIndex: number;
    let targetSubIndex: number;
    /**
     * 对parNode的子节点第subIndex处的node节点 进行判断是否为sourceIndex或者targetIndex
     * 如果是 则记录下subIndex 以对parNode中个节点位置进行移位
     * @param node
     * @param subIndex
     * @returns
     */
    const findTargetNode = (node: IPivotLayoutHeadNode, subIndex: number) => {
      if (sourceSubIndex !== undefined && targetSubIndex !== undefined) {
        return;
      }
      if (node.level === level) {
        if (node.startInTotal === sourceIndex) {
          // sourceNode = node;
          sourceSubIndex = subIndex;
        }
        // if (node.startInTotal === targetIndex) targetSubIndex = subIndex;
        // 判断targetIndex是否在node的范围内 将当前node的subIndex记为targetSubIndex
        if (node.startInTotal <= targetIndex && targetIndex <= node.startInTotal + node.size - 1) {
          targetSubIndex = subIndex;
        }
      }

      if (node.children && node.level < level) {
        parNode = node;
        for (let i = 0; i < node.children.length; i++) {
          if (
            (sourceIndex >= node.children[i].startInTotal &&
              sourceIndex <= node.children[i].startInTotal + node.children[i].size) ||
            (targetIndex >= node.children[i].startInTotal &&
              targetIndex <= node.children[i].startInTotal + node.children[i].size)
          ) {
            findTargetNode(node.children[i], i);
          }
        }
      }
    };
    findTargetNode(this.tree, 0);

    //对parNode子节点位置进行移位【根据sourceSubIndex和targetSubIndex】
    const sourceColumns = parNode.children.splice(sourceSubIndex, 1);
    sourceColumns.unshift(targetSubIndex as any, 0 as any);
    Array.prototype.splice.apply(parNode.children, sourceColumns);
  }
}

let seqId = 0;
let colIndex = 0;

export class PivotHeaderLayoutMap implements LayoutMapAPI {
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
  private _columnWidths: WidthData[] = [];
  rowsDefine: (IDimension | string)[];
  columnsDefine: (IDimension | string)[];
  indicatorsDefine: (IIndicator | string)[];
  columnPaths: number[][] = [];
  private _headerObjects: HeaderData[] = [];
  private _headerObjectMap: { [key: LayoutObjectId]: HeaderData } = {};
  // private _emptyDataCache = new EmptyDataCache();
  private _indicators: IndicatorData[] = [];
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
  private _cellRangeMap: Map<string, CellRange>; //存储单元格的行列号范围 针对解决是否为合并单元格情况
  // 缓存行号列号对应的headerPath,注意树形结构展开需要清除！ 需要注意当表头位置拖拽后 这个缓存的行列号已不准确 进行重置
  private _CellHeaderPathMap: Map<string, IPivotTableCellHeaderPaths>;
  _table: PivotTable;
  extensionRows: IExtensionRowDefine[];
  _rowHeaderExtensionTree: any = {};

  /**
   * 行表头对应的维度key集合
   */
  _extensionRowDimensionKeys: string[][] = [];

  // _extensionRowHeaderCellIds
  constructor(table: PivotTable) {
    this._table = table;
    if (table.options.rowHierarchyType === 'tree') {
      this.extensionRows = table.options.extensionRows;
    }
    this._cellRangeMap = new Map();
    this._CellHeaderPathMap = new Map();
    // this.showHeader = showHeader;
    // this.pivotLayout = pivotLayoutObj;
    this.rowTree = table.options.rowTree;
    this.columnTree = table.options.columnTree;
    this.rowsDefine = table.options.rows ?? [];
    this.columnsDefine = table.options.columns ?? [];
    this.indicatorsDefine = table.options.indicators ?? [];
    this.indicatorTitle = table.options.indicatorTitle;
    // this.indicatorsAsCol = table.options.indicatorsAsCol ?? true;
    this.hideIndicatorName = table.options.hideIndicatorName ?? false;
    this.showRowHeader = table.options.showRowHeader ?? true;
    this.showColumnHeader = table.options.showColumnHeader ?? true;
    this.rowHeaderTitle = table.options.rowHeaderTitle;
    this.columnHeaderTitle = table.options.columnHeaderTitle;
    this.rowHierarchyType = table.options.rowHierarchyType ?? 'grid';
    this.rowExpandLevel = table.options.rowExpandLevel ?? 1;
    this.rowHierarchyIndent = table.options.rowHierarchyIndent ?? 20;
    this.cornerSetting = table.options.corner ?? { titleOnDimension: 'column' };
    // 收集指标所有key
    this.indicatorsDefine?.forEach(indicator => {
      // this.indicatorKeys[indicator.indicatorKey] = indicator.value;
      if (typeof indicator === 'string') {
        this.indicatorKeys.push(indicator);
      } else {
        this.indicatorKeys.push(indicator.indicatorKey);
      }
    });
    this.columnDimensionTree = new DimensionTree((this.columnTree as IPivotLayoutHeadNode[]) ?? []);
    this.rowDimensionTree = new DimensionTree(
      (this.rowTree as IPivotLayoutHeadNode[]) ?? [],
      this.rowHierarchyType,
      this.rowHierarchyType === 'tree' ? this.rowExpandLevel : undefined
    );
    this.colDimensionKeys = this.columnDimensionTree.dimensionKeys.valueArr();
    this.rowDimensionKeys = this.rowDimensionTree.dimensionKeys.valueArr();

    this.cornerHeaderObjs =
      this.cornerSetting.titleOnDimension === 'column'
        ? this._addCornerHeaders(
            this.columnHeaderTitle ? [''].concat(this.colDimensionKeys as any) : this.colDimensionKeys
          )
        : this.cornerSetting.titleOnDimension === 'row'
        ? this._addCornerHeaders(
            this.rowHeaderTitle ? [''].concat(this.rowDimensionKeys as any) : this.rowDimensionKeys
          )
        : this._addCornerHeaders(null);
    //生成列表头单元格
    if (this.columnDimensionTree.tree.children) {
      this.columnHeaderObjs = this._addHeaders(
        this._columnHeaderCellIds,
        0,
        this.columnDimensionTree.tree.children,
        []
      );
      // if (typeof this.showColumnHeader !== 'boolean') {
      if (this.columnHeaderTitle) {
        const id = ++seqId;
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
            id
          }
        };
        this.columnHeaderObjs.push(cell);
        this._headerObjects[id] = cell;
      }
      // }
    }
    colIndex = 0;
    //生成行表头单元格
    if (this.rowDimensionTree.tree.children) {
      this.rowHeaderObjs =
        this.rowHierarchyType === 'tree'
          ? this._addHeadersForTreeMode(
              this._rowHeaderCellIds,
              0,
              this.rowDimensionTree.tree.children,
              [],
              this.rowDimensionTree.totalLevel,
              true,
              this.rowsDefine
            )
          : this._addHeaders(this._rowHeaderCellIds, 0, this.rowDimensionTree.tree.children, []);
    }
    // if (typeof this.showRowHeader !== 'boolean') {
    if (this.rowHeaderTitle) {
      const id = ++seqId;
      const firstColIds = Array(this.rowCount - this.columnHeaderLevelCount).fill(id);
      this._rowHeaderCellIds.unshift(firstColIds);
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
          id
        }
      };
      this.rowHeaderObjs.push(cell);
      this._headerObjects[id] = cell;
    }
    // }

    this.indicatorsAsCol = !isValid(this.rowDimensionKeys.find(key => key === this.indicatorDimensionKey));
    //  this.colAttrs[this.colAttrs.length-1]===this.indicatorDimensionKey&&this.colAttrs.pop();
    //  this.rowAttrs[this.rowAttrs.length-1]===this.indicatorDimensionKey&&this.rowAttrs.pop();

    this._rowHeaderCellIds = transpose(this._rowHeaderCellIds);
    if (table.options.rowHierarchyType === 'tree' && this.extensionRows?.length >= 1) {
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
      });
    }
    colIndex = 0;
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

    this.setColumnWidths();
  }

  private _addHeaders(
    _headerCellIds: number[][],
    row: number,
    header: IPivotLayoutHeadNode[],
    roots: number[]
  ): HeaderData[] {
    function _newRow(row: number): number[] {
      const newRow: number[] = (_headerCellIds[row] = []);
      if (colIndex === 0) {
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
    header.forEach(hd => {
      // const col = this._columns.length;
      const id = hd.id;
      const dimensionInfo: IDimension =
        (this.rowsDefine?.find(dimension =>
          typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
        ) as IDimension) ??
        (this.columnsDefine?.find(dimension =>
          typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
        ) as IDimension);
      const indicatorInfo = this.indicatorsDefine?.find(indicator => {
        if (typeof indicator === 'string') {
          return false;
        }
        if (hd.indicatorKey) {
          return indicator.indicatorKey === hd.indicatorKey;
        }
        return indicator.title === hd.value;
      }) as IIndicator;
      const cell: HeaderData = {
        id,
        title: hd.value ?? indicatorInfo.title,
        field: hd.dimensionKey,
        style:
          typeof (indicatorInfo ?? dimensionInfo)?.headerStyle === 'function'
            ? (indicatorInfo ?? dimensionInfo)?.headerStyle
            : Object.assign({}, (indicatorInfo ?? dimensionInfo)?.headerStyle),
        headerType: indicatorInfo?.headerType ?? dimensionInfo?.headerType ?? 'text',
        headerIcon: indicatorInfo?.headerIcon ?? dimensionInfo?.headerIcon,
        // define: <any>hd,
        define: Object.assign({}, <any>hd, indicatorInfo ?? dimensionInfo),
        fieldFormat: indicatorInfo?.headerFormat ?? dimensionInfo?.headerFormat,
        // iconPositionList:[]
        dropDownMenu: indicatorInfo?.dropDownMenu ?? dimensionInfo?.dropDownMenu,
        pivotInfo: {
          value: hd.value,
          dimensionKey: hd.dimensionKey,
          isPivotCorner: false
          // customInfo: dimensionInfo?.customInfo
        },
        width: dimensionInfo?.width,
        minWidth: dimensionInfo?.minWidth,
        maxWidth: dimensionInfo?.maxWidth,
        showSort: indicatorInfo?.showSort ?? dimensionInfo?.showSort,
        description: dimensionInfo?.description
      };

      if (indicatorInfo) {
        //收集indicatorDimensionKey  提到了构造函数中
        // this.indicatorDimensionKey = dimensionInfo.dimensionKey;
        if (indicatorInfo.customRender) {
          hd.customRender = indicatorInfo.customRender;
        }
        if (!isValid(this._indicators?.find(indicator => indicator.indicatorKey === indicatorInfo.indicatorKey))) {
          this._indicators?.push({
            id: ++seqId,
            indicatorKey: indicatorInfo.indicatorKey,
            field: indicatorInfo.indicatorKey,
            fieldFormat: indicatorInfo?.format,
            cellType: indicatorInfo?.cellType ?? (indicatorInfo as any)?.columnType ?? 'text',
            chartModule: 'chartModule' in indicatorInfo ? indicatorInfo.chartModule : null,
            chartSpec: 'chartSpec' in indicatorInfo ? indicatorInfo.chartSpec : null,
            sparklineSpec: 'sparklineSpec' in indicatorInfo ? indicatorInfo.sparklineSpec : null,
            style: indicatorInfo?.style,
            icon: indicatorInfo?.icon,
            define: Object.assign({}, <any>hd, indicatorInfo, {
              dragHeader: dimensionInfo?.dragHeader
            }),
            width: indicatorInfo?.width,
            minWidth: indicatorInfo?.minWidth,
            maxWidth: indicatorInfo?.maxWidth,
            disableColumnResize: indicatorInfo?.disableColumnResize
          });
        }
      } else if (hd.indicatorKey) {
        //兼容当某个指标没有设置在dimension.indicators中
        if (!isValid(this._indicators?.find(indicator => indicator.indicatorKey === hd.indicatorKey))) {
          this._indicators?.push({
            id: ++seqId,
            indicatorKey: hd.indicatorKey,
            field: hd.indicatorKey,
            cellType: 'text',
            define: Object.assign({}, <any>hd)
          });
        }
      }
      // if (dimensionInfo.indicators) {
      //   this.hideIndicatorName = dimensionInfo.hideIndicatorName ?? false;
      //   this.indicatorsAsCol = dimensionInfo.indicatorsAsCol ?? true;
      // }
      results[id] = cell;
      this._headerObjects[id] = cell;
      _headerCellIds[row][colIndex] = id;
      for (let r = row - 1; r >= 0; r--) {
        _headerCellIds[r][colIndex] = roots[r];
      }
      if ((hd as IPivotLayoutHeadNode).children) {
        this._addHeaders(_headerCellIds, row + 1, (hd as IPivotLayoutHeadNode).children ?? [], [...roots, id]).forEach(
          c => results.push(c)
        );
      } else {
        // columns.push([""])//代码一个路径
        for (let r = row + 1; r < _headerCellIds.length; r++) {
          _headerCellIds[r][colIndex] = id;
        }
        colIndex++;
      }
    });
    return results;
  }
  private _addHeadersForTreeMode(
    _headerCellIds: number[][],
    row: number,
    header: IPivotLayoutHeadNode[],
    roots: number[],
    totalLevel: number,
    show: boolean,
    dimensions: (IDimension | string)[]
  ): HeaderData[] {
    function _newRow(row: number): number[] {
      const newRow: number[] = (_headerCellIds[row] = []);
      if (colIndex === 0) {
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
    header.forEach(hd => {
      const id = hd.id;
      // const dimensionInfo: IDimension =
      //   (this.rowsDefine?.find(dimension =>
      //     typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
      //   ) as IDimension) ??
      //   (this.columnsDefine?.find(dimension =>
      //     typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
      //   ) as IDimension);
      const dimensionInfo: IDimension = dimensions.find(dimension =>
        typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
      ) as IDimension;

      const cell: HeaderData = {
        id,
        title: hd.value,
        field: hd.dimensionKey,
        //如果不是整棵树的叶子节点，都靠左显示
        style:
          hd.level + 1 === totalLevel || typeof dimensionInfo?.headerStyle === 'function'
            ? dimensionInfo?.headerStyle
            : Object.assign({}, dimensionInfo?.headerStyle, { textAlign: 'left' }),
        headerType: dimensionInfo?.headerType ?? 'text',
        headerIcon: dimensionInfo?.headerIcon,
        define: Object.assign(<any>hd, {
          linkJump: (dimensionInfo as ILinkDimension)?.linkJump,
          linkDetect: (dimensionInfo as ILinkDimension)?.linkDetect,
          templateLink: (dimensionInfo as ILinkDimension)?.templateLink,

          // image相关 to be fixed
          keepAspectRatio: (dimensionInfo as IImageDimension)?.keepAspectRatio ?? false,
          imageAutoSizing: (dimensionInfo as IImageDimension)?.imageAutoSizing,

          headerCustomRender: dimensionInfo?.headerCustomRender,
          headerCustomLayout: dimensionInfo?.headerCustomLayout,
          dragHeader: dimensionInfo?.dragHeader
        }), //这里不能新建对象，要用hd保持引用关系
        fieldFormat: dimensionInfo?.headerFormat,
        // iconPositionList:[]
        dropDownMenu: dimensionInfo?.dropDownMenu,
        pivotInfo: {
          value: hd.value,
          dimensionKey: hd.dimensionKey,
          isPivotCorner: false
          // customInfo: dimensionInfo?.customInfo
        },
        hierarchyLevel: hd.level,
        dimensionTotalLevel: totalLevel,
        hierarchyState: hd.level + 1 === totalLevel ? undefined : hd.hierarchyState,
        width: dimensionInfo?.width,
        minWidth: dimensionInfo?.minWidth,
        maxWidth: dimensionInfo?.maxWidth,
        parentCellId: roots[roots.length - 1]
      };

      results[id] = cell;
      // this._cellIdDiemnsionMap.set(id, {
      //   dimensionKey: hd.dimensionKey,
      //   value: hd.value
      // });
      this._headerObjects[id] = cell;
      _headerCellIds[row][colIndex] = id;
      for (let r = row - 1; r >= 0; r--) {
        _headerCellIds[r][colIndex] = roots[r];
      }
      if (hd.hierarchyState === HierarchyState.expand && (hd as IPivotLayoutHeadNode).children) {
        //row传值 colIndex++和_addHeaders有区别
        show && colIndex++;
        this._addHeadersForTreeMode(
          _headerCellIds,
          row,
          (hd as IPivotLayoutHeadNode).children ?? [],
          [...roots, id],
          totalLevel,
          show && hd.hierarchyState === HierarchyState.expand, //当前节点show 且当前节点状态为展开 则传给子节点为show：true
          dimensions
        ).forEach(c => results.push(c));
      } else {
        // columns.push([""])//代码一个路径
        show && colIndex++;
        for (let r = row + 1; r < _headerCellIds.length; r++) {
          _headerCellIds[r][colIndex] = id;
        }
      }
    });
    return results;
  }
  private _addCornerHeaders(dimensionKeys: (string | number)[] | null) {
    const results: HeaderData[] = [];
    if (dimensionKeys) {
      dimensionKeys.forEach((dimensionKey: string, key: number) => {
        const id = ++seqId;
        const dimensionInfo: IDimension =
          (this.rowsDefine?.find(dimension =>
            typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
          ) as IDimension) ??
          (this.columnsDefine?.find(dimension =>
            typeof dimension === 'string' ? false : dimension.dimensionKey === dimensionKey
          ) as IDimension);

        const cell: HeaderData = {
          id,
          title: dimensionKey === this.indicatorDimensionKey ? this.indicatorTitle : dimensionInfo?.title ?? '',
          field: '维度名称',
          style: this.cornerSetting.headerStyle,
          headerType: this.cornerSetting.headerType ?? 'text',
          define: <any>{
            dimensionKey: '维度名称',
            id,
            value: dimensionKey
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
      const id = ++seqId;
      const cell: HeaderData = {
        id,
        title: '',
        field: '维度名称',
        style: this.cornerSetting.headerStyle,
        headerType: this.cornerSetting.headerType ?? 'text',
        define: <any>{
          dimensionKey: '维度名称',
          id,
          value: ''
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
      const old_rowHeaderCellIds = this._rowHeaderCellIds;
      this._rowHeaderCellIds = [];
      old_rowHeaderCellIds.forEach((row_ids: number[], index) => {
        const key = row_ids[row_ids.length - 1];
        colIndex = 0;
        let tree;
        if (typeof extensionRow.rowTree === 'function') {
          tree = (extensionRow.rowTree as Function)([
            { dimensionKey: this._headerObjects[key].field, value: this._headerObjects[key].title }
          ]);
        } else {
          // 需要clone一份 否则跟DimensionTree有引用关系
          tree = cloneDeep(extensionRow.rowTree);
        }
        let rowExtensionDimensionTree;
        if (this._rowHeaderExtensionTree[key]) {
          this._rowHeaderExtensionTree[key].reset(this._rowHeaderExtensionTree[key].tree.children, true);
          rowExtensionDimensionTree = this._rowHeaderExtensionTree[key];
        } else {
          rowExtensionDimensionTree = new DimensionTree(tree ?? [], this.rowHierarchyType, undefined);
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
          this._rowHeaderCellIds.push(row_ids.concat(extensionRowTreeHeaderIds[0][i]));
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
      this.rowDimensionKeys.forEach((objKey, index) => {
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
  isRowHeader(col: number, row: number): boolean {
    if (col < this.rowHeaderLevelCount && row >= this.columnHeaderLevelCount) {
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
  isLeftBottomCorner(col: number, row: number): boolean {
    if (col < this.rowHeaderLevelCount && row >= this.rowCount - this.bottomFrozenRowCount) {
      return true;
    }
    return false;
  }
  isRightTopCorner(col: number, row: number): boolean {
    if (col >= this.colCount - this.rightFrozenColCount && row < this.columnHeaderLevelCount) {
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
  get headerLevelCount(): number {
    return this.columnHeaderLevelCount;
  }
  get columnHeaderLevelCount(): number {
    if (this.showHeader && this.showColumnHeader) {
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
      return count;
    }
    return 0;
  }
  get rowHeaderLevelCount(): number {
    if (this.showHeader && this.showRowHeader) {
      if (this.rowHierarchyType === 'tree') {
        const extensionRowCount = this.extensionRows?.length ?? 0;
        if (this.rowHeaderTitle) {
          return 2 + extensionRowCount;
        }
        return 1 + extensionRowCount;
      }
      let count = this.indicatorsAsCol
        ? this.rowDimensionTree.totalLevel
        : this.hideIndicatorName //设置隐藏表头，且表头最下面一级就是指标维度 则-1
        ? this.rowDimensionKeys[this.rowDimensionKeys.length - 1] === this.indicatorDimensionKey
          ? this.rowDimensionTree.totalLevel - 1
          : this.rowDimensionTree.totalLevel
        : this.rowDimensionTree.totalLevel;
      if (this.rowHeaderTitle) {
        count += 1;
      }
      return count;
    }
    return 0;
  }
  get colCount(): number {
    return this.columnDimensionTree.tree.size + this.rowHeaderLevelCount + this.rightFrozenColCount;
  }
  get rowCount(): number {
    // return this.rowDimensionTree.tree.size + this.columnHeaderLevelCount + this.bottomFrozenRowCount;
    return this._rowHeaderCellIds.length + this.columnHeaderLevelCount + this.bottomFrozenRowCount;
  }
  get bodyRowCount() {
    return this.rowDimensionTree.tree.size;
  }
  get bottomFrozenRowCount(): number {
    // return 0;
    if (this.showHeader && this.showColumnHeader) {
      if (this.indicatorsAsCol && !this.hideIndicatorName) {
        // 查询指标是否有multiIndicator
        return this.indicatorsDefine.find(indicator => {
          return (indicator as any)?.multiIndicator;
        })
          ? 1
          : 0;
      }
    }
    return 0;
  }
  get rightFrozenColCount(): number {
    // return 0;
    if (this.showHeader && this.showColumnHeader) {
      if (!this.indicatorsAsCol && !this.hideIndicatorName) {
        // 查询指标是否有multiIndicator
        return this.indicatorsDefine.find(indicator => {
          return (indicator as any)?.multiIndicator;
        })
          ? 1
          : 0;
      }
    }
    return 0;
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
      const indicatorKey = paths.colHeaderPaths.find(colPath => colPath.indicatorKey)?.indicatorKey;
      return (
        this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey) ??
        this._indicators[0] ?? {
          id: '',
          field: undefined,
          indicatorKey: undefined,
          cellType: undefined,
          define: undefined
        }
      );
    }
    const indicatorKey = paths.rowHeaderPaths.find(rowPath => rowPath.indicatorKey)?.indicatorKey;
    return (
      this._indicators?.find(indicator => indicator.indicatorKey === indicatorKey) ??
      this._indicators[0] ?? {
        id: '',
        field: undefined,
        indicatorKey: undefined,
        cellType: undefined,
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
    if (col === -1 || row === -1) {
      return {
        start: { col, row },
        end: { col, row }
      };
    }
    // if (this._cellRangeMap.has(`$${col}$${row}`)) return this._cellRangeMap.get(`$${col}$${row}`);
    if (this._cellRangeMap.has(`${col}-${row}`)) {
      return this._cellRangeMap.get(`${col}-${row}`);
    }
    const result: CellRange = { start: { col, row }, end: { col, row } };
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
          id !== this.getCellId(col, r) ||
          (col >= 1 && this.getCellId(col - 1, row) !== this.getCellId(col - 1, r))
        ) {
          break;
        }
        result.start.row = r;
      }
      for (let r = row + 1; r < (this.rowCount ?? 0); r++) {
        if (
          id !== this.getCellId(col, r) ||
          (col >= 1 && this.getCellId(col - 1, row) !== this.getCellId(col - 1, r))
        ) {
          break;
        }
        result.end.row = r;
      }
    }
    this._cellRangeMap.set(`${col}-${row}`, result);
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

  getRecordIndexByRow(row: number): number {
    if (row < this.columnHeaderLevelCount) {
      return -1;
    } else if (row >= this.rowCount - this.bottomFrozenRowCount) {
      return -1;
    }
    return row - this.columnHeaderLevelCount;
  }
  getRecordIndexByCol(col: number): number {
    if (col < this.rowHeaderLevelCount) {
      return -1;
    } else if (col >= this.colCount - this.rightFrozenColCount) {
      return -1;
    }
    return col - this.rowHeaderLevelCount;
  }
  getRecordStartRowByRecordIndex(index: number): number {
    return this.columnHeaderLevelCount + index;
  }

  // getCellRangeTranspose(): CellRange {
  //   return { start: { col: 0, row: 0 }, end: { col: 0, row: 0 } };
  // }

  getCellHeaderPathsWidthTreeNode(
    col: number,
    row: number
  ): {
    /** 列表头各级path表头信息 */
    readonly colHeaderPaths?: any[];
    /** 行表头各级path表头信息 */
    readonly rowHeaderPaths?: any[];
  } {
    // if (this._CellHeaderPathMap.has(`$${col}$${row}`))
    if (this._CellHeaderPathMap.has(`${col}-${row}`)) {
      return this._CellHeaderPathMap.get(`${col}-${row}`);
    }
    const recordCol = this.getRecordIndexByCol(col);
    const recordRow = this.getRecordIndexByRow(row);
    let colPath;
    let rowPath: IPivotLayoutHeadNode[];
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
        rowPath = [];
        const row_pathIds = this._rowHeaderCellIds[recordRow]; //获取当前行的cellId 但这个cellId不是各级维度都有的  下面逻辑就是找全路径然后再去各个树找path的过程
        let findTree = this.rowDimensionTree; //第一棵寻找的树是第一列的维度树 主树
        let level = 0; //level和col对应，代表一层层树找的过程
        while (findTree) {
          const pathIds = []; // pathIds记录寻找当前树需要匹配的cellId
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
    const p = { colHeaderPaths: colPath, rowHeaderPaths: rowPath };
    this._CellHeaderPathMap.set(`${col}-${row}`, p);
    return p;
  }
  getCellHeaderPaths(col: number, row: number): IPivotTableCellHeaderPaths {
    const headerPathsWidthNode = this.getCellHeaderPathsWidthTreeNode(col, row);
    const headerPaths: IPivotTableCellHeaderPaths = {
      colHeaderPaths: [],
      rowHeaderPaths: []
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
      const rowHeaderPath: {
        dimensionKey?: string;
        indicatorKey?: string;
        value?: string;
      } = {};
      rowHeaderPath.dimensionKey = rowHeader.dimensionKey;
      rowHeaderPath.indicatorKey = rowHeader.indicatorKey;
      rowHeaderPath.value = rowHeader.value ?? this.getIndicatorInfoByIndicatorKey(rowHeader.indicatorKey)?.title ?? '';
      headerPaths.rowHeaderPaths.push(rowHeaderPath);
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
    const oldRowHeaderCellIds = this._rowHeaderCellIds.slice(0);
    const oldRowHeaderCellPositons = oldRowHeaderCellIds.map((id, row) => {
      return { col, row: row + this.columnHeaderLevelCount };
    });
    const hd = this.getHeader(col, row);
    (<any>hd.define).hierarchyState =
      (<any>hd.define).hierarchyState === HierarchyState.collapse ? HierarchyState.expand : HierarchyState.collapse;
    //过程类似构造函数处理过程
    this.rowDimensionTree.reset(this.rowDimensionTree.tree.children, true);
    this._rowHeaderCellIds = [];
    this.rowHeaderObjs = this._addHeadersForTreeMode(
      this._rowHeaderCellIds,
      0,
      this.rowDimensionTree.tree.children,
      [],
      this.rowDimensionTree.totalLevel,
      true,
      this.rowsDefine
    );

    if (this.rowHeaderTitle) {
      const id = ++seqId;
      const firstColIds = Array(this.rowCount - this.columnHeaderLevelCount).fill(id);
      this._rowHeaderCellIds.unshift(firstColIds);
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
          cellType: 'text'
        }
      };
      this.rowHeaderObjs.push(cell);
      this._headerObjects[id] = cell;
    }
    this._rowHeaderCellIds = transpose(this._rowHeaderCellIds);
    if (this.rowHierarchyType === 'tree') {
      this.generateExtensionRowTree();
    }
    colIndex = 0;
    this._headerObjectMap = this._headerObjects.reduce((o, e) => {
      o[e.id as number] = e;
      return o;
    }, {} as { [key: LayoutObjectId]: HeaderData });
    this._CellHeaderPathMap = new Map();
    this._cellRangeMap = new Map();
    const diffCell: {
      addCellPositions: CellAddress[];
      removeCellPositions: CellAddress[];
      updateCellPositions?: CellAddress[];
    } = diffCellAddress(
      col,
      row,
      oldRowHeaderCellIds.map(oldCellId => oldCellId[col]),
      this._rowHeaderCellIds.map(newCellId => newCellId[col]),
      oldRowHeaderCellPositons,
      this
    );

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
      const { startInTotal, level } = rowDimension as IPivotLayoutHeadNode;
      row += startInTotal;
      if (this.rowHierarchyType === 'grid') {
        col = this.rowHeaderTitle ? level + 1 : level;
      } else {
        col = 0;
      } //树形展示的情况下 肯定是在第0列
      return { col, row };
    } else if (colDimension) {
      col = this.rowHeaderLevelCount;
      const { startInTotal, level } = colDimension as IPivotLayoutHeadNode;
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
        if (targetIndex === sourceCellRange.end.col) {
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
          source.row,
          sourceCellRange.start.col - this.rowHeaderLevelCount,
          targetIndex - this.rowHeaderLevelCount
        );
        this.columnDimensionTree.reset(this.columnDimensionTree.tree.children, true);
        this._CellHeaderPathMap = new Map();
        this._cellRangeMap = new Map();
        return {
          sourceIndex: sourceCellRange.start.col,
          targetIndex,
          moveSize,
          moveType: 'column'
        };
      } else if (this.isRowHeader(source.col, source.row)) {
        // 插入目标地址的列index
        let targetIndex;
        const sourceRowHeaderPaths = this.getCellHeaderPathsWidthTreeNode(source.col, source.row).rowHeaderPaths;
        const targetRowHeaderPaths = this.getCellHeaderPathsWidthTreeNode(target.col, target.row).rowHeaderPaths;
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
        if (targetIndex === source.row || targetIndex === sourceCellRange.end.row) {
          return null;
        }

        // 表头id _rowHeaderCellIds进行调整
        // 从header id的二维数组中取出需要操作的source ids
        const sourceIds = this._rowHeaderCellIds.splice(
          sourceCellRange.start.row - this.columnHeaderLevelCount,
          moveSize
        );
        sourceIds.unshift(targetIndex as any, 0 as any);
        Array.prototype.splice.apply(this._rowHeaderCellIds, sourceIds);

        // 对维度树结构调整节点位置
        this.rowDimensionTree.movePosition(
          this.getCellHeaderPathsWidthTreeNode(source.col, source.row).rowHeaderPaths.length - 1,
          sourceCellRange.start.row - this.columnHeaderLevelCount,
          targetIndex + (target.row > source.row ? sourceRowHeaderNode.size - 1 : 0)
        );
        this.rowDimensionTree.reset(this.rowDimensionTree.tree.children, true);
        this._CellHeaderPathMap = new Map();
        this._cellRangeMap = new Map();
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
    let rowHeaderPaths;
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
        this.rowDimensionKeys.indexOf(a.dimensionKey ?? this.indicatorDimensionKey) -
        this.rowDimensionKeys.indexOf(b.dimensionKey ?? this.indicatorDimensionKey)
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
    if (rowHeaderPaths) {
      for (let i = 0; i < rowHeaderPaths.length; i++) {
        const rowDimension = rowHeaderPaths[i];
        // 判断级别，找到distDimension
        // let isCol = false;
        for (let j = 0; j < rowArr.length; j++) {
          const dimension = rowArr[j];
          if (
            ((!isValid(rowDimension.indicatorKey) &&
              dimension.dimensionKey === rowDimension.dimensionKey &&
              dimension.value === rowDimension.value) ||
              (isValid(rowDimension.indicatorKey) && dimension.indicatorKey === rowDimension.indicatorKey)) &&
            dimension.value === rowDimension.value
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
    // 如果是body单元格 需要找到行列对应的维度值节点
    if (needLowestLevel) {
      if (!rowDimensionFinded || !colDimensionFinded) {
        return undefined;
      }
    }
    // 通过dimension获取col和row
    if (rowDimensionFinded) {
      row = this.columnHeaderLevelCount;
      const { startInTotal, level } = rowDimensionFinded as IPivotLayoutHeadNode;
      row += startInTotal;
      if (this.rowHierarchyType === 'grid') {
        defaultCol = this.rowHeaderTitle ? level + 1 : level;
      } else {
        defaultCol = 0;
      } //树形展示的情况下 肯定是在第0列
    }
    if (colDimensionFinded) {
      col = this.rowHeaderLevelCount;
      const { startInTotal, level } = colDimensionFinded as IPivotLayoutHeadNode;
      col += startInTotal;
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
    return undefined;
  }
  isEmpty(col: number, row: number) {
    return false;
  }
  getChartAxes(col: number, row: number): any[] {
    return [];
  }
  getRawChartSpec(col: number, row: number): any {
    return getRawChartSpec(col, row, this);
  }
  getChartDataId(col: number, row: number): any {
    return getChartDataId(col, row, this);
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
    this._cellRangeMap.clear();
  }
}
