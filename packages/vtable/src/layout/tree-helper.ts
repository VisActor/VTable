import { cloneDeep, isValid } from '@visactor/vutils';
import { NumberMap } from '../tools/NumberMap';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
import type { Either } from '../tools/helper';
import type {
  CellInfo,
  ColumnIconOption,
  FieldData,
  HeaderData,
  ICustomRender,
  IDimension,
  IHeaderTreeDefine,
  IIndicator,
  IRowDimension,
  LayoutObjectId
} from '../ts-types';
import { HierarchyState } from '../ts-types';
import type { PivotHeaderLayoutMap } from './pivot-header-layout';
import type { ILinkDimension } from '../ts-types/pivot-table/dimension/link-dimension';
import type { IImageDimension } from '../ts-types/pivot-table/dimension/image-dimension';
// import { sharedVar } from './pivot-header-layout';

interface ITreeLayoutBaseHeadNode {
  id: number;
  // dimensionKey: string;
  // // title: string;
  // indicatorKey?: string;
  value: string;
  children: ITreeLayoutHeadNode[] | undefined;
  columns?: any; //兼容ListTable情况 simple-header-layout中增加了columnTree
  level: number;
  /** 节点跨占层数 如汇总节点跨几层维度 */
  levelSpan: number;
  startIndex: number;
  size: number; //对应到colSpan或者rowSpan
  // parsing?:  'img' | 'link' | 'video' | 'templateLink';
  startInTotal: number;
  // headerStyle:HeaderStyleOption| null;
  customRender?: ICustomRender;

  hierarchyState: HierarchyState;
  headerIcon?: (string | ColumnIconOption)[] | ((args: CellInfo) => (string | ColumnIconOption)[]);
}

interface ITreeLayoutDimensionHeadNode extends ITreeLayoutBaseHeadNode {
  dimensionKey: string;
  virtual?: boolean;
}
interface ITreeLayoutIndicatorHeadNode extends ITreeLayoutBaseHeadNode {
  indicatorKey: string;
}
export type ITreeLayoutHeadNode = Either<ITreeLayoutDimensionHeadNode, ITreeLayoutIndicatorHeadNode>;
export class DimensionTree {
  sharedVar: { seqId: number };
  // 每一个值对应的序号 结果缓存
  // cache: {
  //   [propName: string]: any;
  // };
  //树形展示 会将非叶子节点单独展示一行 所以size会增加非叶子节点的个数
  sizeIncludeParent = false;
  rowExpandLevel: number;
  hierarchyType: 'grid' | 'tree';
  tree: ITreeLayoutHeadNode = {
    id: 0,
    dimensionKey: '',
    // title: '',
    value: '',
    children: [],
    level: -1,
    levelSpan: 1,
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
  dimensionKeysIncludeVirtual: NumberMap<string> = new NumberMap<string>();
  // dimensions: IDimension[] | undefined;//目前用不到这个
  cache: Map<number, any> = new Map();
  constructor(
    tree: ITreeLayoutHeadNode[],
    sharedVar: { seqId: number },
    hierarchyType: 'grid' | 'tree' = 'grid',
    rowExpandLevel: number = undefined
  ) {
    this.sizeIncludeParent = rowExpandLevel !== null && rowExpandLevel !== undefined;
    this.rowExpandLevel = rowExpandLevel;
    this.hierarchyType = hierarchyType;
    this.sharedVar = sharedVar;
    this.reset(tree);
  }

  reset(tree: ITreeLayoutHeadNode[], updateTreeNode = false) {
    // 清空缓存的计算
    // this.cache = {};
    // this.dimensions = dimensions;
    this.cache.clear();
    this.dimensionKeys = new NumberMap<string>();
    this.dimensionKeysIncludeVirtual = new NumberMap<string>();
    this.tree.children = tree as ITreeLayoutHeadNode[];
    // const re = { totalLevel: 0 };
    // if (updateTreeNode) this.updateTreeNode(this.tree, 0, re, this.tree);
    // else
    this.setTreeNode(this.tree, 0, this.tree);
    // this.totalLevel = this.dimensionKeys.count();
  }
  setTreeNode(node: ITreeLayoutHeadNode, startIndex: number, parent: ITreeLayoutHeadNode): number {
    node.startIndex = startIndex;
    node.startInTotal = (parent.startInTotal ?? 0) + node.startIndex;
    // if (node.dimensionKey) {
    //   !this.dimensionKeys.contain(node.dimensionKey) &&
    //     this.dimensionKeys.put(node.level, node.dimensionKey);
    //   if (!node.id) node.id = ++seqId;
    // }
    if (node.dimensionKey ?? node.indicatorKey) {
      if (
        !node.virtual &&
        !this.dimensionKeys.contain(node.indicatorKey ? IndicatorDimensionKeyPlaceholder : node.dimensionKey)
      ) {
        this.dimensionKeys.put(node.level, node.indicatorKey ? IndicatorDimensionKeyPlaceholder : node.dimensionKey);
      }
      if (
        !this.dimensionKeysIncludeVirtual.contain(
          node.indicatorKey ? IndicatorDimensionKeyPlaceholder : node.dimensionKey
        )
      ) {
        this.dimensionKeysIncludeVirtual.put(
          node.level,
          node.indicatorKey ? IndicatorDimensionKeyPlaceholder : node.dimensionKey
        );
      }
      if (!node.id) {
        node.id = ++this.sharedVar.seqId;
      }
    }
    let size = node.dimensionKey ? (this.sizeIncludeParent ? 1 : 0) : 0;
    const children = node.children || node.columns;
    //平铺展示 分析所有层级
    if (this.hierarchyType === 'grid') {
      if (children?.length >= 1) {
        children.forEach((n: any) => {
          n.level = (node.level ?? 0) + 1;
          this.totalLevel = Math.max(this.totalLevel, n.level + 1);
          size += this.setTreeNode(n, size, node);
        });
      } else {
        size = 1;
        // re.totalLevel = Math.max(re.totalLevel, (node.level ?? -1) + 1);
      }
    } else if (node.hierarchyState === HierarchyState.expand && children?.length >= 1) {
      //树形展示 有子节点 且下一层需要展开
      children.forEach((n: any) => {
        n.level = (node.level ?? 0) + 1;
        this.totalLevel = Math.max(this.totalLevel, n.level + 1);
        size += this.setTreeNode(n, size, node);
      });
    } else if (node.hierarchyState === HierarchyState.collapse && children?.length >= 1) {
      //树形展示 有子节点 且下一层不需要展开
      children.forEach((n: any) => {
        n.level = (node.level ?? 0) + 1;
        this.totalLevel = Math.max(this.totalLevel, n.level + 1);
        this.setTreeNode(n, size, node);
      });
    } else if (
      !node.hierarchyState &&
      node.level + 1 < this.rowExpandLevel &&
      (children?.length >= 1 || children === true)
    ) {
      //树形展示 有子节点 且下一层需要展开
      node.hierarchyState = HierarchyState.expand;
      children?.length >= 1 &&
        children.forEach((n: any) => {
          n.level = (node.level ?? 0) + 1;
          this.totalLevel = Math.max(this.totalLevel, n.level + 1);
          size += this.setTreeNode(n, size, node);
        });
    } else if (children?.length >= 1 || children === true) {
      //树形展示 有子节点 且下一层不需要展开
      node.hierarchyState = HierarchyState.collapse;
      children?.length >= 1 &&
        children.forEach((n: any) => {
          n.level = (node.level ?? 0) + 1;
          this.totalLevel = Math.max(this.totalLevel, n.level + 1);
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
  getTreePath(index: number, maxDeep = 30): Array<ITreeLayoutHeadNode> {
    const path: any[] = [];
    this.searchPath(index, this.tree, path, maxDeep);
    path.shift();
    return path;
  }

  getTreePathByCellIds(ids: LayoutObjectId[]): Array<ITreeLayoutHeadNode> {
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
  findNodeById(nodes: ITreeLayoutHeadNode[], id: LayoutObjectId) {
    return nodes.find(node => {
      return node.id === id;
    });
  }
  searchPath(index: number, node: ITreeLayoutHeadNode, path: Array<ITreeLayoutHeadNode>, maxDeep: number) {
    if (!node) {
      return;
    }
    if (index < node.startIndex || index >= node.startIndex + node.size) {
      return;
    }
    path.push(node);
    if (!node.children || node.children.length === 0 || node.level >= maxDeep) {
      return;
    }

    // const cIndex = index - node.startIndex;
    // for (let i = 0; i < node.children.length; i++) {
    //   const element = node.children[i];
    //   if (cIndex >= element.startIndex && cIndex < element.startIndex + element.size) {
    //     this.searchPath(cIndex, element, path, maxDeep);
    //     break;
    //   }
    // }

    // use dichotomy to optimize search performance
    const cIndex = index - node.startIndex;

    if (this.cache.has(node.level + 1)) {
      const cacheNode = this.cache.get(node.level + 1);
      if (cIndex >= cacheNode.startIndex && cIndex < cacheNode.startIndex + cacheNode.size) {
        this.searchPath(cIndex, cacheNode, path, maxDeep);
        return;
      }
    }

    let left = 0;
    let right = node.children.length - 1;

    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      const element = node.children[middle];

      if (cIndex >= element.startIndex && cIndex < element.startIndex + element.size) {
        this.cache.set(element.level, element);
        const deleteLevels: number[] = [];
        this.cache.forEach((node, key) => {
          if (key > element.level) {
            deleteLevels.push(key);
          }
        });
        deleteLevels.forEach(key => {
          this.cache.delete(key);
        });
        this.searchPath(cIndex, element, path, maxDeep);
        break;
      } else if (cIndex < element.startIndex) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    }
    return;
  }
  /**
   * 将该树中 层级为level 的sourceIndex处的节点移动到targetIndex位置
   * @param level
   * @param sourceIndex
   * @param targetIndex
   */
  movePosition(level: number, sourceIndex: number, targetIndex: number) {
    // let sourceNode: IPivotLayoutHeadNode;
    let parNode: ITreeLayoutHeadNode;
    let sourceSubIndex: number;
    let targetSubIndex: number;
    /**
     * 对parNode的子节点第subIndex处的node节点 进行判断是否为sourceIndex或者targetIndex
     * 如果是 则记录下subIndex 以对parNode中个节点位置进行移位
     * @param node
     * @param subIndex
     * @returns
     */
    const findTargetNode = (node: ITreeLayoutHeadNode, subIndex: number) => {
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
      const children = node.children || node.columns;
      if (children && node.level < level) {
        parNode = node;
        for (let i = 0; i < children.length; i++) {
          if (
            (sourceIndex >= children[i].startInTotal && sourceIndex <= children[i].startInTotal + children[i].size) ||
            (targetIndex >= children[i].startInTotal && targetIndex <= children[i].startInTotal + children[i].size)
          ) {
            findTargetNode(children[i], i);
          }
        }
      }
    };
    findTargetNode(this.tree, 0);

    //对parNode子节点位置进行移位【根据sourceSubIndex和targetSubIndex】
    const children = parNode.children || parNode.columns;
    const sourceColumns = children.splice(sourceSubIndex, 1);
    sourceColumns.unshift(targetSubIndex as any, 0 as any);
    Array.prototype.splice.apply(children, sourceColumns);
  }
  /** 获取纯净树结构 没有level size index这些属性 */
  getCopiedTree() {
    const children = cloneDeep(this.tree.children);
    clearNode(children);
    return children;
  }
}

//#region 为方法getLayoutRowTree提供的类型和工具方法
export type LayouTreeNode = {
  dimensionKey?: string;
  indicatorKey?: string;
  value: string;
  hierarchyState: HierarchyState;
  children?: LayouTreeNode[];
};

export function generateLayoutTree(tree: LayouTreeNode[], children: ITreeLayoutHeadNode[]) {
  children?.forEach((node: ITreeLayoutHeadNode) => {
    const diemnsonNode: {
      dimensionKey?: string;
      indicatorKey?: string;
      value: string;
      virtual?: boolean;
      hierarchyState: HierarchyState;
      children: any;
    } = {
      dimensionKey: node.dimensionKey,
      indicatorKey: node.indicatorKey,
      value: node.value,
      hierarchyState: node.hierarchyState,
      children: undefined,
      virtual: node.virtual ?? false
    };
    tree.push(diemnsonNode);
    if (node.children) {
      diemnsonNode.children = [];
      generateLayoutTree(diemnsonNode.children, node.children);
    }
  });
}
//#endregion

//#region   为方法getLayoutRowTreeCount提的工具方法
export function countLayoutTree(children: { children?: any }[], countParentNode: boolean) {
  let count = 0;
  children?.forEach((node: ITreeLayoutHeadNode) => {
    if (countParentNode) {
      count++;
    } else {
      if (!node.children || node.children.length === 0) {
        count++;
      }
    }
    if (node.children) {
      count += countLayoutTree(node.children, countParentNode);
    }
  });
  return count;
}
//#endregion

export function dealHeader(
  hd: ITreeLayoutHeadNode,
  _headerCellIds: number[][],
  results: HeaderData[],
  roots: number[],
  row: number,
  layoutMap: PivotHeaderLayoutMap
  // totalLevel: number,
  // indicatorKeys: string[]
) {
  // const col = this._columns.length;
  const id = hd.id;
  const dimensionInfo: IDimension =
    (layoutMap.rowsDefine?.find(dimension =>
      typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
    ) as IDimension) ??
    (layoutMap.columnsDefine?.find(dimension =>
      typeof dimension === 'string' ? false : dimension.dimensionKey === hd.dimensionKey
    ) as IDimension);
  const indicatorInfo = layoutMap.indicatorsDefine?.find(indicator => {
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
    title: hd.value ?? indicatorInfo?.title,
    field: hd.dimensionKey,
    style:
      typeof (indicatorInfo ?? dimensionInfo)?.headerStyle === 'function'
        ? (indicatorInfo ?? dimensionInfo)?.headerStyle
        : Object.assign({}, (indicatorInfo ?? dimensionInfo)?.headerStyle),
    headerType: indicatorInfo?.headerType ?? dimensionInfo?.headerType ?? 'text',
    headerIcon: indicatorInfo?.headerIcon ?? dimensionInfo?.headerIcon,
    // define: <any>hd,
    define: Object.assign({}, <any>hd, indicatorInfo ?? Object.assign({}, dimensionInfo, { sort: undefined })),
    fieldFormat: indicatorInfo?.headerFormat ?? dimensionInfo?.headerFormat,
    // iconPositionList:[]
    dropDownMenu: indicatorInfo?.dropDownMenu ?? dimensionInfo?.dropDownMenu,
    pivotInfo: {
      value: hd.value,
      dimensionKey: hd.dimensionKey,
      isPivotCorner: false
      // customInfo: dimensionInfo?.customInfo
    },
    width: (dimensionInfo as IRowDimension)?.width,
    minWidth: (dimensionInfo as IRowDimension)?.minWidth,
    maxWidth: (dimensionInfo as IRowDimension)?.maxWidth,
    showSort: indicatorInfo?.showSort ?? dimensionInfo?.showSort,
    sort: indicatorInfo?.sort,
    description: dimensionInfo?.description
  };

  if (indicatorInfo) {
    //收集indicatorDimensionKey  提到了构造函数中
    // this.indicatorDimensionKey = dimensionInfo.dimensionKey;
    if (indicatorInfo.customRender) {
      hd.customRender = indicatorInfo.customRender;
    }
    if (!isValid(layoutMap._indicators?.find(indicator => indicator.indicatorKey === indicatorInfo.indicatorKey))) {
      layoutMap._indicators?.push({
        id: ++layoutMap.sharedVar.seqId,
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
    if (!isValid(layoutMap._indicators?.find(indicator => indicator.indicatorKey === hd.indicatorKey))) {
      layoutMap._indicators?.push({
        id: ++layoutMap.sharedVar.seqId,
        indicatorKey: hd.indicatorKey,
        field: hd.indicatorKey,
        cellType: 'text',
        define: Object.assign({}, <any>hd)
      });
    }
  }
  // if (dimensionInfo.indicators) {
  //   layoutMap.hideIndicatorName = dimensionInfo.hideIndicatorName ?? false;
  //   layoutMap.indicatorsAsCol = dimensionInfo.indicatorsAsCol ?? true;
  // }
  results[id] = cell;
  layoutMap._headerObjects[id] = cell;
  // //这个if判断处理上层维度和指标之间跨级的情况。即表头可能总共有5层，但是有的节点从跟到指标只有三级，那么合并单元格之前是指标单元格跨了三个单元格，现在处理成最后一个维度单元格跨三个单元格
  // if (
  //   ((hd as any).levelSpan ?? 0) <= 1 &&
  //   row < totalLevel - 1 &&
  //   hd.indicatorKey &&
  //   indicatorKeys.includes(hd.indicatorKey) &&
  //   (hd.children?.length ?? 0) === 0
  // ) {
  //   const newRoots = [...roots];
  //   const lastId = newRoots[row - 1] ?? id;
  //   for (; row < totalLevel - 1; row++) {
  //     if (!_headerCellIds[row]) {
  //       _headerCellIds[row] = [];
  //     }
  //     _headerCellIds[row][layoutMap.colIndex] = lastId;
  //     newRoots[row] = lastId;
  //   }
  //   for (let r = row - 1; r >= 0; r--) {
  //     _headerCellIds[r][layoutMap.colIndex] = newRoots[r];
  //   }
  //   if (!_headerCellIds[row]) {
  //     _headerCellIds[row] = [];
  //   }
  // } else {
  for (let r = row - 1; r >= 0; r--) {
    _headerCellIds[r][layoutMap.colIndex] = roots[r];
  }
  // }
  _headerCellIds[row][layoutMap.colIndex] = id;

  // 处理汇总小计跨维度层级的情况
  if ((hd as any).levelSpan > 1) {
    for (let i = 1; i < (hd as any).levelSpan; i++) {
      if (!_headerCellIds[row + i]) {
        _headerCellIds[row + i] = [];
      }
      _headerCellIds[row + i][layoutMap.colIndex] = id;
    }
  }

  if ((hd as ITreeLayoutHeadNode).children?.length >= 1) {
    layoutMap._addHeaders(
      _headerCellIds,
      row + ((hd as any).levelSpan ?? 1),
      (hd as ITreeLayoutHeadNode).children ?? [],
      [...roots, ...Array((hd as any).levelSpan ?? 1).fill(id)],
      results
      // totalLevel,
      // indicatorKeys
    );
    // .forEach(c => results.push(c));
  } else {
    // columns.push([""])//代码一个路径
    for (let r = row + 1; r < _headerCellIds.length; r++) {
      _headerCellIds[r][layoutMap.colIndex] = id;

      // if ((hd as any).levelSpan > 1) {
      //   for (let i = 1; i < (hd as any).levelSpan; i++) {
      //     _headerCellIds[r + i][layoutMap.colIndex] = id;
      //   }
      // }
    }
    layoutMap.colIndex++;
  }
}

export function dealHeaderForTreeMode(
  hd: ITreeLayoutHeadNode,
  _headerCellIds: number[][],
  results: HeaderData[],
  roots: number[],
  row: number,
  totalLevel: number,
  show: boolean,
  dimensions: (IDimension | string)[],
  layoutMap: PivotHeaderLayoutMap
) {
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
    field: hd.dimensionKey as FieldData,
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
      dragHeader: dimensionInfo?.dragHeader,
      disableHeaderHover: !!dimensionInfo?.disableHeaderHover,
      disableHeaderSelect: !!dimensionInfo?.disableHeaderSelect
    }), //这里不能新建对象，要用hd保持引用关系
    fieldFormat: dimensionInfo?.headerFormat,
    // iconPositionList:[]
    dropDownMenu: dimensionInfo?.dropDownMenu,
    pivotInfo: {
      value: hd.value,
      dimensionKey: hd.dimensionKey as string,
      isPivotCorner: false
      // customInfo: dimensionInfo?.customInfo
    },
    hierarchyLevel: hd.level,
    dimensionTotalLevel: totalLevel,
    hierarchyState: hd.hierarchyState, //hd.level + 1 === totalLevel ? undefined : hd.hierarchyState,
    width: (dimensionInfo as IRowDimension)?.width,
    minWidth: (dimensionInfo as IRowDimension)?.minWidth,
    maxWidth: (dimensionInfo as IRowDimension)?.maxWidth,
    parentCellId: roots[roots.length - 1]
  };

  results[id] = cell;
  // this._cellIdDiemnsionMap.set(id, {
  //   dimensionKey: hd.dimensionKey,
  //   value: hd.value
  // });
  layoutMap._headerObjects[id] = cell;
  _headerCellIds[row][layoutMap.colIndex] = id;
  for (let r = row - 1; r >= 0; r--) {
    _headerCellIds[r][layoutMap.colIndex] = roots[r];
  }
  if (hd.hierarchyState === HierarchyState.expand && (hd as ITreeLayoutHeadNode).children?.length >= 1) {
    //row传值 colIndex++和_addHeaders有区别
    show && layoutMap.colIndex++;
    layoutMap._addHeadersForTreeMode(
      _headerCellIds,
      row,
      (hd as ITreeLayoutHeadNode).children ?? [],
      [...roots, id],
      totalLevel,
      show && hd.hierarchyState === HierarchyState.expand, //当前节点show 且当前节点状态为展开 则传给子节点为show：true
      dimensions,
      results
    );
    // .forEach(c => results.push(c));
  } else {
    // columns.push([""])//代码一个路径
    show && layoutMap.colIndex++;
    for (let r = row + 1; r < _headerCellIds.length; r++) {
      _headerCellIds[r][layoutMap.colIndex] = id;
    }
  }
}

function clearNode(children: any) {
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    delete node.level;
    delete node.startIndex;
    delete node.id;
    delete node.levelSpan;
    delete node.size;
    delete node.startInTotal;
    const childrenNew = node.children || node.columns;
    if (childrenNew) {
      clearNode(childrenNew);
    }
  }
}
