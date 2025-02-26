import type {
  FieldData,
  FieldDef,
  FieldFormat,
  PivotTableAPI,
  SortRules,
  PivotSortState,
  CellAddress,
  ICellHeaderPaths,
  DropDownMenuEventInfo,
  FieldKeyDef,
  PivotTableConstructorOptions,
  IHeaderTreeDefine,
  IDimensionInfo,
  SortOrder,
  IPagination,
  CellLocation,
  IIndicator,
  ColumnDefine,
  SortByIndicatorRule,
  SortTypeRule,
  SortRule,
  FilterRules
} from './ts-types';
import { HierarchyState, SortType } from './ts-types';
import { PivotHeaderLayoutMap } from './layout/pivot-header-layout';
import { FlatDataToObjects } from './dataset/flatDataToObject';
import { PIVOT_TABLE_EVENT_TYPE } from './ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import { cellInRange, emptyFn } from './tools/helper';
import { Dataset } from './dataset/dataset';
import { BaseTable } from './core/BaseTable';
import type { BaseTableAPI, HeaderData, PivotTableProtected } from './ts-types/base-table';
import type { ITitleComponent } from './components/title/title';
import { cloneDeep, isNumber, isValid } from '@visactor/vutils';
import { Env } from './tools/env';
import type { ITreeLayoutHeadNode } from './layout/tree-helper';
import { DimensionTree, type LayouTreeNode } from './layout/tree-helper';
import { TABLE_EVENT_TYPE } from './core/TABLE_EVENT_TYPE';
import { EditManager } from './edit/edit-manager';
import * as editors from './edit/editors';
import type { IEditor } from '@visactor/vtable-editors';
import { computeColWidth } from './scenegraph/layout/compute-col-width';
import { computeRowHeight } from './scenegraph/layout/compute-row-height';
import { isAllDigits } from './tools/util';
import type { IndicatorData } from './ts-types/list-table/layout-map/api';
import { cloneDeepSpec } from '@visactor/vutils-extension';
import {
  deleteHideIndicatorNode,
  parseColKeyRowKeyForPivotTable,
  supplementIndicatorNodesForCustomTree
} from './layout/layout-helper';
import type { IEmptyTipComponent } from './components/empty-tip/empty-tip';
import { Factory } from './core/factory';
import { callUpdateColOnScenegraph, callUpdateRowOnScenegraph } from './tools/diff-cell';

export class PivotTable extends BaseTable implements PivotTableAPI {
  layoutNodeId: { seqId: number } = { seqId: 0 };
  declare internalProps: PivotTableProtected;
  declare options: PivotTableConstructorOptions;
  pivotSortState: {
    dimensions: IDimensionInfo[];
    order: SortOrder;
  }[];
  dataset?: Dataset; //数据处理对象  开启数据透视分析的表
  flatDataToObjects?: FlatDataToObjects; //数据处理对象 聚合后的flat数据 转成便于查询的行列二维数组
  // drillMenu: Menu; //上卷下钻的按钮
  // eslint-disable-next-line default-param-last
  constructor(options: PivotTableConstructorOptions);
  constructor(container: HTMLElement, options: PivotTableConstructorOptions);
  constructor(container?: HTMLElement | PivotTableConstructorOptions, options?: PivotTableConstructorOptions) {
    if (Env.mode === 'node') {
      options = container as PivotTableConstructorOptions;
      container = null;
    } else if (!(container instanceof HTMLElement)) {
      options = container as PivotTableConstructorOptions;
      if ((container as PivotTableConstructorOptions).container) {
        container = (container as PivotTableConstructorOptions).container;
      } else {
        container = null;
      }
    }
    super(container as HTMLElement, options);
    if (options) {
      if (!options.rowHierarchyType) {
        options.rowHierarchyType = 'grid';
      }
      if (!options.columnHierarchyType) {
        options.columnHierarchyType = 'grid';
      }
      if ((options as any).layout) {
        //TODO hack处理之前的demo都是定义到layout上的 所以这里直接并到options中
        Object.assign(options, (options as any).layout);
      }
      this.internalProps.columns = cloneDeep(options.columns);
      this.internalProps.rows = cloneDeep(options.rows);
      this.internalProps.indicators = cloneDeepSpec(options.indicators);
      options.indicators?.forEach((indicatorDefine, index) => {
        //如果editor 是一个IEditor的实例  需要这样重新赋值 否则clone后变质了
        if (typeof indicatorDefine === 'object' && indicatorDefine?.editor) {
          (this.internalProps.indicators![index] as IIndicator).editor = indicatorDefine.editor;
        }
      });
      this.internalProps.columnTree =
        options.indicatorsAsCol && !options.columns?.length && !options.columnTree ? [] : cloneDeep(options.columnTree);
      this.internalProps.rowTree =
        !options.indicatorsAsCol && !options.rows?.length && !options.rowTree ? [] : cloneDeep(options.rowTree);
      this.internalProps.records = options.records;

      //分页配置
      this.pagination = options.pagination;
      this.internalProps.columnResizeType = options.resize?.columnResizeType ?? options.columnResizeType ?? 'column';
      this.internalProps.rowResizeType = options.resize?.rowResizeType ?? options.rowResizeType ?? 'row';
      this.internalProps.dataConfig = cloneDeep(options.dataConfig);
      this.internalProps.columnWidthConfig = options.columnWidthConfig;
      this.internalProps.columnWidthConfigForRowHeader = options.columnWidthConfigForRowHeader;

      const records = this.internalProps.records;
      this.internalProps.recordsIsTwoDimensionalArray = false;
      if (records?.[0]?.constructor === Array) {
        this.internalProps.recordsIsTwoDimensionalArray = true;
      }
      if (options.customConfig?.enableDataAnalysis === false) {
        // let columnDimensionTree;
        // let rowDimensionTree;
        // if (options.columnTree) {
        const columnDimensionTree = new DimensionTree(
          (this.internalProps.columnTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.columnHierarchyType,
          this.options.columnHierarchyType !== 'grid' ? this.options.columnExpandLevel ?? 1 : undefined
        );
        // }
        // if (options.rowTree) {
        const rowDimensionTree = new DimensionTree(
          (this.internalProps.rowTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.rowHierarchyType,
          this.options.rowHierarchyType !== 'grid' ? this.options.rowExpandLevel ?? 1 : undefined
        );
        // }
        this.internalProps.layoutMap = new PivotHeaderLayoutMap(this, null, columnDimensionTree, rowDimensionTree);
        //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
        //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
        if (this.internalProps.recordsIsTwoDimensionalArray === false) {
          this.flatDataToObjects = new FlatDataToObjects(
            {
              rows: this.internalProps.layoutMap.fullRowDimensionKeys,
              columns: this.internalProps.layoutMap.colDimensionKeys,
              indicators: this.internalProps.layoutMap.indicatorKeys,
              indicatorsAsCol: this.internalProps.layoutMap.indicatorsAsCol,
              indicatorDimensionKey: this.internalProps.layoutMap.indicatorDimensionKey
            },
            records
          );
        }
      } else {
        const keysResults = parseColKeyRowKeyForPivotTable(this, options);
        const { rowKeys, columnKeys, indicatorKeys } = keysResults;
        let { columnDimensionTree, rowDimensionTree } = keysResults;
        this.dataset = new Dataset(
          this.internalProps.dataConfig,
          // this.pagination,
          rowKeys,
          columnKeys,
          // options.indicatorsAsCol === false ? rowKeys.concat(IndicatorDimensionKeyPlaceholder) : rowKeys,
          // options.indicatorsAsCol !== false ? columnKeys.concat(IndicatorDimensionKeyPlaceholder) : columnKeys,
          indicatorKeys,
          this.internalProps.indicators,
          options.indicatorsAsCol ?? true,
          options.records,
          options.rowHierarchyType,
          options.columnHierarchyType,
          this.internalProps.columnTree, //传递自定义树形结构会在dataset中补充指标节点children
          this.internalProps.rowTree,
          false,
          !!options.extensionRows,
          !!options.parseCustomTreeToMatchRecords
        );
        if (!options.columnTree) {
          if (options.indicatorsAsCol !== false) {
            this.dataset.colHeaderTree = supplementIndicatorNodesForCustomTree(
              this.dataset.colHeaderTree,
              options.indicators
            );
          }
          options.indicatorsAsCol !== false &&
            options.indicators &&
            this.dataset.colHeaderTree &&
            deleteHideIndicatorNode(this.dataset.colHeaderTree, options.indicators, false, this);
          columnDimensionTree = new DimensionTree(
            (this.dataset.colHeaderTree as ITreeLayoutHeadNode[]) ?? [],
            this.layoutNodeId,
            this.options.columnHierarchyType,
            this.options.columnHierarchyType !== 'grid' ? this.options.columnExpandLevel ?? 1 : undefined
          );
        } else {
          if (columnDimensionTree.hasHideNode) {
            deleteHideIndicatorNode(columnDimensionTree.tree.children, options.indicators, true, this);
            columnDimensionTree.reset(columnDimensionTree.tree.children);
          }
        }
        if (!options.rowTree) {
          if (options.indicatorsAsCol === false) {
            this.dataset.rowHeaderTree = supplementIndicatorNodesForCustomTree(
              this.dataset.rowHeaderTree,
              options.indicators
            );
          }
          options.indicatorsAsCol === false &&
            this.dataset.rowHeaderTree &&
            options.indicators &&
            deleteHideIndicatorNode(this.dataset.rowHeaderTree, options.indicators, false, this);
          rowDimensionTree = new DimensionTree(
            (this.dataset.rowHeaderTree as ITreeLayoutHeadNode[]) ?? [],
            this.layoutNodeId,
            this.options.rowHierarchyType,
            this.options.rowHierarchyType !== 'grid' ? this.options.rowExpandLevel ?? 1 : undefined
          );
        } else {
          if (rowDimensionTree.hasHideNode) {
            deleteHideIndicatorNode(rowDimensionTree.tree.children, options.indicators, true, this);
            rowDimensionTree.reset(rowDimensionTree.tree.children);
          }
        }
        this.internalProps.layoutMap = new PivotHeaderLayoutMap(
          this,
          this.dataset,
          columnDimensionTree,
          rowDimensionTree
        );
      }
      this._changePivotSortStateBySortRules();
      if ((options.pivotSortState?.length ?? 0) > 0) {
        this.pivotSortState = [];
        this.pivotSortState = options.pivotSortState;
        // this.updatePivotSortState(options.pivotSortState);
      }
      if (Env.mode !== 'node') {
        this.editorManager = new EditManager(this);
      }

      this.refreshHeader();
      this.internalProps.useOneRowHeightFillAll = false;
      this.stateManager.initCheckedState(records);
      // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;

      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      // this.render();

      if (options.title) {
        const Title = Factory.getComponent('title') as ITitleComponent;
        this.internalProps.title = new Title(options.title, this);
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
      //为了确保用户监听得到这个事件 这里做了异步 确保vtable实例已经初始化完成
      setTimeout(() => {
        this.fireListeners(TABLE_EVENT_TYPE.INITIALIZED, null);
      }, 0);
    }
  }
  static get EVENT_TYPE(): typeof PIVOT_TABLE_EVENT_TYPE {
    return PIVOT_TABLE_EVENT_TYPE;
  }
  isListTable(): false {
    return false;
  }
  isPivotTable(): true {
    return true;
  }
  isPivotChart(): false {
    return false;
  }
  get recordsCount() {
    return this.records?.length;
  }
  _canResizeColumn(col: number, row: number): boolean {
    const ifCan = super._canResizeColumn(col, row);
    if (ifCan) {
      const isSeriesNumber = this.internalProps.layoutMap.isSeriesNumber(col, row);
      if (isSeriesNumber && this.internalProps.rowSeriesNumber.disableColumnResize === true) {
        return false;
      } else if (!this.internalProps.layoutMap.indicatorsAsCol) {
        // 列上是否配置了禁止拖拽列宽的配置项disableColumnResize
        const cellDefine = this.internalProps.layoutMap.getBody(col, this.columnHeaderLevelCount);
        if ((cellDefine as IndicatorData)?.disableColumnResize) {
          return false;
        }
      }
    }
    return ifCan;
  }
  updateOption(options: PivotTableConstructorOptions) {
    const internalProps = this.internalProps;
    //维护选中状态
    // const range = internalProps.selection.range; //保留原有单元格选中状态
    super.updateOption(options);
    if (!options.rowHierarchyType) {
      options.rowHierarchyType = 'grid';
    }
    if (!options.columnHierarchyType) {
      options.columnHierarchyType = 'grid';
    }
    this.layoutNodeId = { seqId: 0 };
    this.internalProps.columns = cloneDeep(options.columns);
    this.internalProps.rows = cloneDeep(options.rows);
    this.internalProps.indicators = !options.indicators?.length ? [] : cloneDeepSpec(options.indicators);
    options.indicators?.forEach((indicatorDefine, index) => {
      if (typeof indicatorDefine === 'object' && indicatorDefine?.editor) {
        (this.internalProps.indicators[index] as IIndicator).editor = indicatorDefine.editor;
      }
    });
    this.internalProps.columnTree =
      options.indicatorsAsCol && !options.columns?.length && !options.columnTree ? [] : cloneDeep(options.columnTree);
    this.internalProps.rowTree =
      !options.indicatorsAsCol && !options.rows?.length && !options.rowTree ? [] : cloneDeep(options.rowTree);
    options.records && (this.internalProps.records = options.records);
    this.stateManager.initCheckedState(this.internalProps.records);
    this.stateManager.updateDrillState(undefined, undefined, false, false, -1, -1);
    //分页配置
    this.pagination = options.pagination;
    // 更新protectedSpace
    internalProps.columnResizeType = options.resize?.columnResizeType ?? options.columnResizeType ?? 'column';
    internalProps.rowResizeType = options.resize?.rowResizeType ?? options.rowResizeType ?? 'row';
    internalProps.dataConfig = cloneDeep(options.dataConfig);
    this.internalProps.columnWidthConfig = options.columnWidthConfig;
    this.internalProps.columnWidthConfigForRowHeader = options.columnWidthConfigForRowHeader;

    //维护tree树形结构的展开状态
    if (
      options?.rowHierarchyType !== 'grid' &&
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType !== 'grid' &&
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowExpandLevel === options?.rowExpandLevel
    ) {
      const beforeRowDimensions = (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowDimensionTree.tree.children;
      this.internalProps.rowTree?.forEach((node: IHeaderTreeDefine, index: number) => {
        const beforeRowDimension = beforeRowDimensions.find(
          item => item.dimensionKey === node.dimensionKey && item.value === node.value
        );
        if (beforeRowDimension) {
          this._syncHierarchyState(beforeRowDimension, node);
        }
      });
    }
    const records = this.internalProps.records;
    this.internalProps.recordsIsTwoDimensionalArray = false;
    if (records?.[0]?.constructor === Array) {
      this.internalProps.recordsIsTwoDimensionalArray = true;
    }

    //TODO 这里需要加上判断 dataConfig是否有配置变化
    if (options.customConfig?.enableDataAnalysis === false) {
      let columnDimensionTree;
      let rowDimensionTree;
      if (options.columnTree) {
        columnDimensionTree = new DimensionTree(
          (this.internalProps.columnTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.columnHierarchyType,
          this.options.columnHierarchyType !== 'grid' ? this.options.columnExpandLevel ?? 1 : undefined
        );
      }
      if (options.rowTree) {
        rowDimensionTree = new DimensionTree(
          (this.internalProps.rowTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.rowHierarchyType,
          this.options.rowHierarchyType !== 'grid' ? this.options.rowExpandLevel ?? 1 : undefined
        );
      }
      internalProps.layoutMap = new PivotHeaderLayoutMap(this, null, columnDimensionTree, rowDimensionTree);
      //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
      //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
      if (this.internalProps.recordsIsTwoDimensionalArray === false) {
        this.flatDataToObjects = new FlatDataToObjects(
          {
            rows: internalProps.layoutMap.fullRowDimensionKeys,
            columns: internalProps.layoutMap.colDimensionKeys,
            indicators: internalProps.layoutMap.indicatorKeys,
            indicatorsAsCol: internalProps.layoutMap.indicatorsAsCol,
            indicatorDimensionKey: internalProps.layoutMap.indicatorDimensionKey
          },
          records
        );
      }
    } else {
      const keysResults = parseColKeyRowKeyForPivotTable(this, options);
      const { rowKeys, columnKeys, indicatorKeys } = keysResults;
      let { columnDimensionTree, rowDimensionTree } = keysResults;
      this.dataset = new Dataset(
        internalProps.dataConfig,
        // this.pagination,
        rowKeys,
        columnKeys,
        indicatorKeys,
        this.internalProps.indicators,
        options.indicatorsAsCol ?? true,
        records,
        options.rowHierarchyType,
        options.columnHierarchyType,
        this.internalProps.columnTree, //传递自定义树形结构会在dataset中补充指标节点children
        this.internalProps.rowTree,
        false,
        !!options.extensionRows,
        !!options.parseCustomTreeToMatchRecords
      );
      if (!options.columnTree) {
        if (options.indicatorsAsCol !== false) {
          this.dataset.colHeaderTree = supplementIndicatorNodesForCustomTree(
            this.dataset.colHeaderTree,
            options.indicators
          );
        }
        options.indicatorsAsCol !== false &&
          options.indicators &&
          this.dataset.colHeaderTree &&
          deleteHideIndicatorNode(this.dataset.colHeaderTree, options.indicators, false, this);
        columnDimensionTree = new DimensionTree(
          (this.dataset.colHeaderTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.columnHierarchyType,
          this.options.columnHierarchyType !== 'grid' ? this.options.columnExpandLevel ?? 1 : undefined
        );
      } else {
        if (columnDimensionTree.hasHideNode) {
          deleteHideIndicatorNode(columnDimensionTree.tree.children, options.indicators, true, this);
          columnDimensionTree.reset(columnDimensionTree.tree.children);
        }
      }
      if (!options.rowTree) {
        if (options.indicatorsAsCol === false) {
          this.dataset.rowHeaderTree = supplementIndicatorNodesForCustomTree(
            this.dataset.rowHeaderTree,
            options.indicators
          );
        }
        options.indicatorsAsCol === false &&
          this.dataset.rowHeaderTree &&
          options.indicators &&
          deleteHideIndicatorNode(this.dataset.rowHeaderTree, options.indicators, false, this);
        rowDimensionTree = new DimensionTree(
          (this.dataset.rowHeaderTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.rowHierarchyType,
          this.options.rowHierarchyType !== 'grid' ? this.options.rowExpandLevel ?? 1 : undefined
        );
      } else {
        if (rowDimensionTree.hasHideNode) {
          deleteHideIndicatorNode(rowDimensionTree.tree.children, options.indicators, true, this);
          rowDimensionTree.reset(rowDimensionTree.tree.children);
        }
      }
      internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset, columnDimensionTree, rowDimensionTree);
    }
    this._changePivotSortStateBySortRules();

    if ((options.pivotSortState?.length ?? 0) > 0) {
      this.pivotSortState = [];
      this.pivotSortState = options.pivotSortState;
      // this.updatePivotSortState(options.pivotSortState);
    }

    // 更新表头
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;

    // this.hasMedia = null; // 避免重复绑定
    // 清空目前数据
    if (internalProps.releaseList) {
      internalProps.releaseList.forEach(releaseObj => releaseObj?.release?.());
      internalProps.releaseList = null;
    }
    // // 恢复selection状态
    // internalProps.selection.range = range;
    // this._updateSize();

    // 清空单元格内容
    this.scenegraph.clearCells();
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();

    // if (this.internalProps.title && !this.internalProps.title.isReleased) {
    //   this._updateSize();
    //   this.internalProps.title.resize();
    //   this.scenegraph.resize();
    // }
    if (options.title) {
      const Title = Factory.getComponent('title') as ITitleComponent;
      this.internalProps.title = new Title(options.title, this);
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
    // this.render();
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  /**
   * 更新页码
   * @param pagination 修改页码
   */
  updatePagination(pagination?: IPagination): void {
    if (pagination) {
      if (!this.pagination) {
        this.pagination = { currentPage: 0, perPageCount: 0 };
      }
      typeof pagination.currentPage === 'number' &&
        pagination.currentPage >= 0 &&
        (this.pagination.currentPage = pagination.currentPage);
      pagination.perPageCount &&
        (this.pagination.perPageCount = pagination.perPageCount || this.pagination.perPageCount);
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).setPagination(this.pagination);
      // this.refreshHeader();
      //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
      this.refreshRowColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.render();
    } else if (this.pagination) {
      // 原来有分页 现在更新成不分页
      this.pagination = undefined;
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).setPagination(undefined);
      // this.refreshHeader();
      //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
      this.refreshRowColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.render();
    }
  }

  refreshHeader(): void {
    //设置列宽
    this.setMinMaxLimitWidth(true);
    //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
    this.refreshRowColCount();
  }

  refreshRowColCount(): void {
    const table = this;
    const { layoutMap } = table.internalProps;
    if (!layoutMap) {
      return;
    }
    table.colCount = layoutMap.colCount ?? 0;
    table.rowCount = layoutMap.rowCount ?? 0;

    this.internalProps.frozenColCount = this.options.frozenColCount
      ? this.options.frozenColCount
      : (layoutMap.rowHeaderLevelCount ?? 0) + layoutMap.leftRowSeriesNumberColumnCount;
    //   this.internalProps.frozenColCount= Math.max(
    //   (layoutMap.rowHeaderLevelCount ?? 0) + layoutMap.leftRowSeriesNumberColumnCount,
    //   this.options.frozenColCount ?? 0
    // );
    table.frozenRowCount = Math.max(layoutMap.headerLevelCount, this.options.frozenRowCount ?? 0);

    if (table.bottomFrozenRowCount !== (this.options.bottomFrozenRowCount ?? 0)) {
      table.bottomFrozenRowCount = this.options.bottomFrozenRowCount ?? 0;
    }
    if (table.rightFrozenColCount !== (this.options.rightFrozenColCount ?? 0)) {
      table.rightFrozenColCount = this.options.rightFrozenColCount ?? 0;
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
    this.stateManager.setFrozenRow(this.frozenRowCount);
  }
  protected _getSortFuncFromHeaderOption(
    columns: undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): ((v1: any, v2: any, order: SortOrder) => 0 | 1 | -1) | undefined {
    return undefined;
  }
  /**
   * Get rowHierarchyType of pivotTable
   */
  get rowHierarchyType(): 'grid' | 'tree' | 'grid-tree' {
    return (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType;
  }
  /**
   * Get columnHierarchyType of pivotTable
   */
  get columnHierarchyType(): 'grid' | 'grid-tree' {
    return (this.internalProps.layoutMap as PivotHeaderLayoutMap).columnHierarchyType;
  }
  /**
   * 将现有tree中的的hierarchyState同步到rows透视树中
   * @param sourceNode
   * @param targetNode
   */
  _syncHierarchyState(sourceNode: any, targetNode: IHeaderTreeDefine) {
    if (sourceNode.value === targetNode.value && sourceNode.dimensionKey === targetNode.dimensionKey) {
      targetNode.hierarchyState =
        targetNode.hierarchyState ?? (targetNode?.children ? sourceNode.hierarchyState : undefined);
      (targetNode?.children as IHeaderTreeDefine[])?.forEach((targetChildNode: IHeaderTreeDefine, index: number) => {
        if (sourceNode?.children?.[index] && targetChildNode) {
          const beforeRowDimension = sourceNode.children.find(
            (item: any) => item.dimensionKey === targetChildNode.dimensionKey && item.value === targetChildNode.value
          );
          if (beforeRowDimension) {
            this._syncHierarchyState(beforeRowDimension, targetChildNode);
          }
        }
      });
    }
  }
  getRecordShowIndexByCell(col: number, row: number): number {
    return undefined;
  }
  getTableIndexByRecordIndex(recordIndex: number): number {
    return undefined;
  }
  getTableIndexByField(field: FieldDef): number {
    return undefined;
  }
  getCellAddrByFieldRecord(field: FieldDef, recordIndex: number): CellAddress {
    return undefined;
  }
  getBodyIndexByRow(row: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getBodyIndexByRow(row);
  }
  getBodyIndexByCol(col: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getBodyIndexByCol(col);
  }
  getFieldData(field: string, col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      return this.records[rowIndex]?.[colIndex];
    } else if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      if (cellDimensionPath) {
        let indicatorPosition: { position: 'col' | 'row'; index?: number };
        const colKeys = cellDimensionPath.colHeaderPaths
          ?.filter((path: any) => {
            return !path.virtual;
          })
          .map((colPath: any, index: number) => {
            if (colPath.indicatorKey) {
              indicatorPosition = {
                position: 'col',
                index
              };
            }
            return colPath.indicatorKey ?? colPath.value;
          });
        const rowKeys = cellDimensionPath.rowHeaderPaths
          ?.filter((path: any) => {
            return !path.virtual;
          })
          .map((rowPath: any, index: number) => {
            if (rowPath.indicatorKey) {
              indicatorPosition = {
                position: 'row',
                index
              };
            }
            return rowPath.indicatorKey ?? rowPath.value;
          });
        const aggregator = this.dataset.getAggregator(
          // !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
          // this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
          rowKeys,
          colKeys,
          (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
          true,
          indicatorPosition
        );
        if (aggregator.records && aggregator.records.length >= 1) {
          return aggregator.records[0][field];
        }
        // return ''
      }
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey,
        false
      );
      if (treeNode?.record) {
        return treeNode?.record[field];
      }
    }
  }
  getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData {
    if (!skipCustomMerge) {
      const customMergeText = this.getCustomMergeValue(col, row);
      if (customMergeText) {
        return customMergeText;
      }
    }
    if (this.internalProps.layoutMap.isSeriesNumber(col, row)) {
      if (this.internalProps.layoutMap.isSeriesNumberInHeader(col, row)) {
        const { title } = this.internalProps.layoutMap.getSeriesNumberHeader(col, row);
        return title;
      }
      const { format } = this.internalProps.layoutMap.getSeriesNumberBody(col, row);
      return typeof format === 'function' ? format(col, row, this) : row - this.columnHeaderLevelCount + 1;
    } else if (this.internalProps.layoutMap.isHeader(col, row)) {
      const { title, fieldFormat } = this.internalProps.layoutMap.getHeader(col, row) as HeaderData;
      return typeof fieldFormat === 'function' ? fieldFormat(title, col, row, this as BaseTableAPI) : title;
    }
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const { fieldFormat } = this.internalProps.layoutMap.getBody(col, row) as IndicatorData;
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      const dataValue = this.records[rowIndex]?.[colIndex];
      // const cellHeaderPaths = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      if (typeof fieldFormat === 'function') {
        const fieldResult = fieldFormat(dataValue, col, row, this as BaseTableAPI);
        return fieldResult;
      }
      return dataValue;
    } else if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const colKeys = cellDimensionPath.colHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        ?.map((colPath: any, index: number) => {
          if (colPath.indicatorKey) {
            indicatorPosition = {
              position: 'col',
              index
            };
          }
          return colPath.indicatorKey ?? colPath.value;
        });
      const rowKeys = cellDimensionPath.rowHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        ?.map((rowPath: any, index: number) => {
          if (rowPath.indicatorKey) {
            indicatorPosition = {
              position: 'row',
              index
            };
          }
          return rowPath.indicatorKey ?? rowPath.value;
        });
      const aggregator = this.dataset.getAggregator(
        // !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        // this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        true,
        indicatorPosition
      );
      const { fieldFormat } = this.internalProps.layoutMap.getBody(col, row) as IndicatorData;
      // return typeof fieldFormat === 'function'
      //   ? fieldFormat(valueNode?.value, col, row, this as BaseTableAPI)
      //   : valueNode?.value ?? '';
      return aggregator.formatValue
        ? aggregator.formatValue(col, row, this as BaseTableAPI)
        : typeof fieldFormat === 'function'
        ? fieldFormat(aggregator?.value(), col, row, this as BaseTableAPI)
        : aggregator?.value() ?? '';
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const valueNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey
      );
      const { fieldFormat } = this.internalProps.layoutMap.getBody(col, row) as IndicatorData;
      return typeof fieldFormat === 'function'
        ? fieldFormat(valueNode?.value, col, row, this as BaseTableAPI)
        : valueNode?.value ?? '';
    }
    // return this.getFieldData(fieldFormat || field, col, row);
  }

  getCellOriginValue(col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    }
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      const dataValue = this.records[rowIndex]?.[colIndex];
      return dataValue;
    } else if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((colPath: any, index: number) => {
          if (colPath.indicatorKey) {
            indicatorPosition = {
              position: 'col',
              index
            };
          }
          return colPath.indicatorKey ?? colPath.value;
        });
      const rowKeys = cellDimensionPath.rowHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((rowPath: any, index: number) => {
          if (rowPath.indicatorKey) {
            indicatorPosition = {
              position: 'row',
              index
            };
          }
          return rowPath.indicatorKey ?? rowPath.value;
        });
      const aggregator = this.dataset.getAggregator(
        // !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        // this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        true,
        indicatorPosition
      );
      return aggregator.value ? aggregator.value() : undefined;
      // return ''
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey
      );
      return treeNode?.value;
    }

    // const { field } = table.internalProps.layoutMap.getBody(col, row);
    // return table.getFieldData(field, col, row);
  }

  /** 获取单元格展示数据源最原始值 */
  getCellRawValue(col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    }
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      const dataValue = this.records[rowIndex]?.[colIndex];
      return dataValue;
    } else if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((colPath: any, index: number) => {
          if (colPath.indicatorKey) {
            indicatorPosition = {
              position: 'col',
              index
            };
          }
          return colPath.indicatorKey ?? colPath.value;
        });
      const rowKeys = cellDimensionPath.rowHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((rowPath: any, index: number) => {
          if (rowPath.indicatorKey) {
            indicatorPosition = {
              position: 'row',
              index
            };
          }
          return rowPath.indicatorKey ?? rowPath.value;
        });
      const aggregator = this.dataset.getAggregator(
        // !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        // this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        false,
        indicatorPosition
      );
      return aggregator.value ? aggregator.value() : undefined;
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey,
        false
      );
      return treeNode?.value;
    }
  }

  // 获取原始数据
  getCellOriginRecord(col: number, row: number) {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      const dataValue = this.records[rowIndex]?.[colIndex];
      return dataValue;
    } else if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((colPath: any, index: number) => {
          if (colPath.indicatorKey) {
            indicatorPosition = {
              position: 'col',
              index
            };
          }
          return colPath.indicatorKey ?? colPath.value;
        });
      const rowKeys = cellDimensionPath.rowHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((rowPath: any, index: number) => {
          if (rowPath.indicatorKey) {
            indicatorPosition = {
              position: 'row',
              index
            };
          }
          return rowPath.indicatorKey ?? rowPath.value;
        });
      const aggregator = this.dataset.getAggregator(
        // !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        // this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        true,
        indicatorPosition
      );
      return aggregator.records;
      // return ''
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey
      );
      return treeNode?.record;
    }
  }

  getCellRawRecord(col: number, row: number) {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      const dataValue = this.records[rowIndex]?.[colIndex];
      return dataValue;
    } else if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((colPath: any, index: number) => {
          if (colPath.indicatorKey) {
            indicatorPosition = {
              position: 'col',
              index
            };
          }
          return colPath.indicatorKey ?? colPath.value;
        });
      const rowKeys = cellDimensionPath.rowHeaderPaths
        ?.filter((path: any) => {
          return !path.virtual;
        })
        .map((rowPath: any, index: number) => {
          if (rowPath.indicatorKey) {
            indicatorPosition = {
              position: 'row',
              index
            };
          }
          return rowPath.indicatorKey ?? rowPath.value;
        });
      const aggregator = this.dataset.getAggregator(
        // !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        // this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        false,
        indicatorPosition
      );
      return aggregator.records;
      // return ''
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey,
        false
      );
      return treeNode?.record;
    }
  }
  /**
   * 全量更新排序规则
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules, col?: number, row?: number) {
    if (this.internalProps.dataConfig) {
      this.internalProps.dataConfig.sortRules = sortRules;
    } else {
      this.internalProps.dataConfig = { sortRules };
    }
    this.dataset.updateSortRules(sortRules);
    this._changePivotSortStateBySortRules();
    const { layoutMap } = this.internalProps;
    layoutMap.resetHeaderTree();
    // 清空单元格内容
    this.scenegraph.clearCells();
    if (isNumber(col) && isNumber(row)) {
      if (this.isRowHeader(col, row)) {
        this.setMinMaxLimitWidth(true);
        this.internalProps._widthResizedColMap.clear();
      } else if (this.isCornerHeader(col, row)) {
        if (layoutMap.cornerSetting.titleOnDimension === 'column') {
          this.setMinMaxLimitWidth(true);
          this.internalProps._widthResizedColMap.clear();
        } else if (layoutMap.cornerSetting.titleOnDimension === 'row') {
          this.internalProps._heightResizedRowMap.clear();
        }
      } else if (this.isColumnHeader(col, row)) {
        this.internalProps._heightResizedRowMap.clear();
      }
      this.refreshRowColCount();
    } else {
      this.refreshHeader();
    }
    this.internalProps.useOneRowHeightFillAll = false;
    // 生成单元格场景树
    this.scenegraph.createSceneGraph(true);
    this.render();
  }
  _changePivotSortStateBySortRules() {
    this.pivotSortState = [];
    const sortRules = this.internalProps.dataConfig?.sortRules ?? [];
    for (let i = 0; i < sortRules.length; i++) {
      const sortRule = sortRules[i];
      // if ((sortRule as SortByIndicatorRule).sortType) {
      const dimensions: IDimensionInfo[] = [];
      if (
        (sortRule as SortByIndicatorRule).sortByIndicator &&
        (sortRule as SortByIndicatorRule).sortField ===
          (this.dataset.indicatorsAsCol
            ? this.dataset.rows[this.dataset.rows.length - 1]
            : this.dataset.columns[this.dataset.columns.length - 1])
      ) {
        for (let j = 0; j < (sortRule as SortByIndicatorRule).query.length; j++) {
          dimensions.push({
            dimensionKey: this.dataset.indicatorsAsCol ? this.dataset.columns[j] : this.dataset.rows[j],
            value: (sortRule as SortByIndicatorRule).query[j]
          });
        }
        dimensions.push({
          indicatorKey: (sortRule as SortByIndicatorRule).sortByIndicator,
          value:
            this.internalProps.layoutMap.getIndicatorInfo((sortRule as SortByIndicatorRule).sortByIndicator)?.title ??
            (sortRule as SortByIndicatorRule).sortByIndicator
        });
      } else {
        dimensions.push({
          dimensionKey: (sortRule as SortTypeRule).sortField,
          isPivotCorner: true,
          value: (sortRule as SortTypeRule).sortField
        });
      }
      const sortType = sortRule.sortType ? (sortRule.sortType.toUpperCase() as 'ASC' | 'DESC' | 'NORMAL') : 'ASC';
      this.pivotSortState.push({
        dimensions,
        order: SortType[sortType]
      });
      // }
    }
  }
  /** 解析配置columnWidthConfig传入的列宽配置 */
  _parseColumnWidthConfig(columnWidthConfig: { dimensions: IDimensionInfo[]; width: number }[]) {
    for (let i = 0; i < columnWidthConfig?.length; i++) {
      const item = columnWidthConfig[i];
      const dimensions = item.dimensions;
      const width = item.width;
      const cell = this.getCellAddressByHeaderPaths(dimensions);
      if (cell && cell.col >= this.rowHeaderLevelCount) {
        const cellPath = this.getCellHeaderPaths(cell.col, this.columnHeaderLevelCount); //如单指标隐藏指标情况，从body行去取headerPath才会包括指标维度
        if (cellPath.colHeaderPaths.length === dimensions.length) {
          let match = true;
          for (let i = 0; i < dimensions.length; i++) {
            const dimension = dimensions[i];
            const finded = (cellPath.colHeaderPaths as IDimensionInfo[]).findIndex((colPath: IDimensionInfo, index) => {
              if (colPath.indicatorKey === dimension.indicatorKey) {
                return true;
              }
              if (colPath.dimensionKey === dimension.dimensionKey && colPath.value === dimension.value) {
                return true;
              }
              return false;
            });
            if (finded < 0) {
              match = false;
              break;
            }
          }
          if (match && !this.internalProps._widthResizedColMap.has(cell.col)) {
            this._setColWidth(cell.col, width);
            this.internalProps._widthResizedColMap.add(cell.col); // add resize tag
          }
        }
      } else if (cell && cell.col < this.rowHeaderLevelCount) {
        if (!this.internalProps._widthResizedColMap.has(cell.col)) {
          this._setColWidth(cell.col, width);
          this.internalProps._widthResizedColMap.add(cell.col); // add resize tag
        }
      }
    }
  }

  // particularly for row header in react-vtable keepColumnWidthChange config
  _parseColumnWidthConfigForRowHeader(columnWidthConfig: { dimensions: IDimensionInfo[]; width: number }[]) {
    for (let i = 0; i < columnWidthConfig?.length; i++) {
      const item = columnWidthConfig[i];
      const dimensions = item.dimensions;
      const width = item.width;
      const cell = this.getCellAddressByHeaderPaths(dimensions);
      if (cell && cell.col < this.rowHeaderLevelCount) {
        if (!this.internalProps._widthResizedColMap.has(cell.col)) {
          this._setColWidth(cell.col, width);
          this.internalProps._widthResizedColMap.add(cell.col); // add resize tag
        }
      }
    }
  }

  /**
   * 更新排序状态
   * @param pivotSortStateConfig.dimensions 排序状态维度对应关系；pivotSortStateConfig.order 排序状态
   */
  updatePivotSortState(
    pivotSortStateConfig: {
      dimensions: IDimensionInfo[];
      order: SortOrder;
    }[]
  ) {
    this.pivotSortState = pivotSortStateConfig;
  }
  // changePivotSortState(pivotSortState: { dimensions: IDimensionInfo[]; order: SortOrder }) {
  //   let isExist = false;
  //   for (let i = 0; i < this.pivotSortState.length; i++) {
  //     const pivotSortStateItem = this.pivotSortState[i];
  //     const dimensions = pivotSortStateItem.dimensions;
  //     const isEqual = dimensions.every(
  //       (item, index) =>
  //         (item.dimensionKey === pivotSortState.dimensions[index].dimensionKey ||
  //           item.indicatorKey === pivotSortState.dimensions[index].indicatorKey) &&
  //         item.value === pivotSortState.dimensions[index].value &&
  //         ((isValid(item.isPivotCorner ?? pivotSortState.dimensions[index].isPivotCorner) &&
  //           item.isPivotCorner === pivotSortState.dimensions[index].isPivotCorner) ||
  //           (!isValid(item.isPivotCorner) && !isValid(pivotSortState.dimensions[index].isPivotCorner)))
  //     );
  //     if (isEqual) {
  //       isExist = true;
  //       pivotSortStateItem.order = pivotSortState.order;
  //       break;
  //     }
  //   }
  //   if (!isExist) {
  //     this.pivotSortState.push(pivotSortState);
  //   }
  // }
  /** 如果单元格所在维度或者指标配置了sort自动 可以通过该接口进行排序 */
  sort(col: number, row: number, order: SortOrder) {
    let dimensions: IDimensionInfo[];
    if ((this as PivotTable).isCornerHeader(col, row)) {
      const dimensionInfo = (this as PivotTable).getHeaderDefine(col, row) as any;
      dimensions = [];
      const dimension: IDimensionInfo = {
        isPivotCorner: true,
        dimensionKey: dimensionInfo.value,
        value: dimensionInfo.value
      };
      dimensions.push(dimension);
    } else if ((this as PivotTable).isColumnHeader(col, row)) {
      dimensions = (this as PivotTable).getCellHeaderPaths(col, row).colHeaderPaths as IDimensionInfo[];
    } else {
      dimensions = (this as PivotTable).getCellHeaderPaths(col, row).rowHeaderPaths as IDimensionInfo[];
    }

    const sortIndicator = dimensions[dimensions.length - 1].indicatorKey;

    const headerDefine = this.getHeaderDefine(col, row) as any;
    if (headerDefine.sort) {
      if ((this as PivotTable).dataset.sortRules) {
        const cacheOldDimensionSortRule: Record<string, SortRule> = {};
        for (let i = (this as PivotTable).dataset.sortRules.length - 1; i >= 0; i--) {
          const sortRule = (this as PivotTable).dataset.sortRules[i];
          if (headerDefine.dimensionKey && sortRule.sortField === headerDefine.dimensionKey) {
            cacheOldDimensionSortRule[sortRule.sortField] = sortRule;
            (this as PivotTable).dataset.sortRules.splice(i, 1);
          } else if (
            sortIndicator &&
            // headerDefine.indicatorKey === sortIndicator &&
            // sortIndicator === (sortRule as SortByIndicatorRule).sortByIndicator &&
            sortRule.sortField ===
              (this.dataset.indicatorsAsCol
                ? this.dataset.rows[this.dataset.rows.length - 1]
                : this.dataset.columns[this.dataset.columns.length - 1])
          ) {
            (this as PivotTable).dataset.sortRules.splice(i, 1);
          }
        }
        if (sortIndicator) {
          (this as PivotTable).dataset.sortRules.push({
            sortField: this.dataset.indicatorsAsCol
              ? this.dataset.rows[this.dataset.rows.length - 1]
              : this.dataset.columns[this.dataset.columns.length - 1],
            sortType: SortType[order],
            sortByIndicator: sortIndicator,
            query: dimensions.reduce((arr, dimension) => {
              if (dimension.dimensionKey) {
                arr.push(dimension.value);
              }
              return arr;
            }, [])
          });
        } else {
          (this as PivotTable).dataset.sortRules.push(
            Object.assign(cacheOldDimensionSortRule[headerDefine.dimensionKey] ?? {}, {
              sortField: headerDefine.dimensionKey,
              sortType: SortType[order as 'ASC' | 'DESC']
            })
          );
        }
      } else {
        if (sortIndicator) {
          (this as PivotTable).dataset.sortRules = [
            {
              sortField: this.dataset.indicatorsAsCol
                ? this.dataset.rows[this.dataset.rows.length - 1]
                : this.dataset.columns[this.dataset.columns.length - 1],
              sortType: SortType[order as 'ASC' | 'DESC'],
              sortByIndicator: sortIndicator,
              query: dimensions.reduce((arr, dimension) => {
                if (dimension.dimensionKey) {
                  arr.push(dimension.value);
                }
                return arr;
              }, [])
            }
          ];
        } else {
          (this as PivotTable).dataset.sortRules = [
            {
              sortField: headerDefine.dimensionKey,
              sortType: SortType[order as 'ASC' | 'DESC']
            }
          ];
        }
      }

      (this as PivotTable).updateSortRules((this as PivotTable).dataset.sortRules, col, row);
    }
  }

  getPivotSortState(col: number, row: number): SortOrder {
    if (!this.pivotSortState) {
      return undefined;
    }
    const cellRange = this.getCellRange(col, row);
    for (let i = 0; i < this.pivotSortState.length; i++) {
      const pivotState = this.pivotSortState[i];
      const dimensions = pivotState.dimensions;
      const cell = this.getCellAddressByHeaderPaths(dimensions);
      // const { col: sortCol, row: sortRow, order } = this.pivotSortState[i];
      const order = pivotState.order;

      if (cell && cellInRange(cellRange, cell.col, cell.row)) {
        return order;
      }
    }
    return undefined;
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
    const moveContext = (this.internalProps.layoutMap as PivotHeaderLayoutMap).moveHeaderPosition(source, target);
    if (moveContext) {
      if (moveContext.moveType === 'column') {
        // 是扁平数据结构 需要将二维数组this.records进行调整
        if (this.internalProps.recordsIsTwoDimensionalArray) {
          for (let row = 0; row < this.internalProps.records.length; row++) {
            const sourceColumns = (this.internalProps.records[row] as unknown as number[]).splice(
              moveContext.sourceIndex - this.rowHeaderLevelCount,
              moveContext.sourceSize
            );
            sourceColumns.unshift((moveContext.targetIndex as any) - this.rowHeaderLevelCount, 0 as any);
            Array.prototype.splice.apply(this.internalProps.records[row] as unknown as number[], sourceColumns);
          }
        }
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        // this.colWidthsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.moveSize);
        this.colWidthsMap.exchangeOrder(
          sourceCellRange.start.col,
          sourceCellRange.end.col - sourceCellRange.start.col + 1,
          targetCellRange.start.col,
          targetCellRange.end.col - targetCellRange.start.col + 1,
          moveContext.targetIndex
        );
        //下面代码取自refreshHeader列宽设置逻辑
        //设置列宽极限值 TODO 目前是有问题的 最大最小宽度限制 移动列位置后不正确
        this.setMinMaxLimitWidth();
      } else if (moveContext.moveType === 'row') {
        // 是扁平数据结构 需要将二维数组this.records进行调整
        if (this.internalProps.recordsIsTwoDimensionalArray) {
          const sourceRows = (this.internalProps.records as unknown as number[]).splice(
            moveContext.sourceIndex - this.columnHeaderLevelCount,
            moveContext.sourceSize
          );
          sourceRows.unshift((moveContext.targetIndex as any) - this.columnHeaderLevelCount, 0 as any);
          Array.prototype.splice.apply(this.internalProps.records, sourceRows);
        }
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
      }
      return moveContext;
    }
    return null;
  }
  /**
   * 表头切换层级状态
   * @param col
   * @param row
   * @param recalculateColWidths  是否重新计算列宽 默认为true.（设置width:auto或者 autoWidth 情况下才有必要考虑该参数）
   */
  toggleHierarchyState(col: number, row: number, recalculateColWidths: boolean = true) {
    const hierarchyState = this.getHierarchyState(col, row);
    if (hierarchyState === HierarchyState.expand) {
      this._refreshHierarchyState(col, row, recalculateColWidths);
      this.fireListeners(PIVOT_TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.collapse
      });
    } else if (hierarchyState === HierarchyState.collapse) {
      // const headerPaths = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const headerTreeNode = this.internalProps.layoutMap.getHeadNode(
        // headerPaths.rowHeaderPaths.slice(0, headerPaths.rowHeaderPaths.length),
        col,
        row
      );
      if (Array.isArray(headerTreeNode.children)) {
        //children 是数组 表示已经有子树节点信息
        this._refreshHierarchyState(col, row, recalculateColWidths);
      }
      this.fireListeners(PIVOT_TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.expand,
        originData: headerTreeNode
      });
    }
  }

  // beforeUpdateCell主要用于setTreeNodeChildren方法
  _refreshHierarchyState(col: number, row: number, recalculateColWidths: boolean = true, beforeUpdateCell?: Function) {
    const oldFrozenColCount = this.frozenColCount;
    const oldFrozenRowCount = this.frozenRowCount;
    const visibleStartRow = this.getBodyVisibleRowRange().rowStart;
    this.internalProps._oldRowCount = this.rowCount;
    this.internalProps._oldColCount = this.colCount;
    let notFillWidth = false;
    let notFillHeight = false;
    this.stateManager.updateHoverIcon(col, row, undefined, undefined);
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
    const isChangeRowTree = this.internalProps.layoutMap.isRowHeader(col, row);
    const result: {
      addCellPositionsRowDirection?: CellAddress[];
      removeCellPositionsRowDirection?: CellAddress[];
      updateCellPositionsRowDirection?: CellAddress[];
      addCellPositionsColumnDirection?: CellAddress[];
      removeCellPositionsColumnDirection?: CellAddress[];
      updateCellPositionsColumnDirection?: CellAddress[];
    } = isChangeRowTree
      ? (this.internalProps.layoutMap as PivotHeaderLayoutMap).toggleHierarchyState(col, row)
      : (this.internalProps.layoutMap as PivotHeaderLayoutMap).toggleHierarchyStateForColumnTree(col, row);
    beforeUpdateCell && beforeUpdateCell();
    //影响行数
    this.refreshRowColCount(); //逻辑中有setFrozenCol处理 影响了原本bodyGroup的列数
    const newFrozenColCount = this.frozenColCount;
    const newFrozenRowCount = this.frozenRowCount;
    this.clearCellStyleCache();
    if (this.rowHierarchyType === 'tree') {
      //'grid-tree'模式下不用特意更新，updateRow会更新掉和`tree`模式不一样
      this.scenegraph.updateHierarchyIcon(col, row);
    }
    this.reactCustomLayout?.clearCache();
    if (this.rowHierarchyType !== 'grid-tree' && this.columnHierarchyType !== 'grid-tree') {
      //增加'grid-tree'之前的逻辑是这样子的
      this.scenegraph.updateRow(
        result.removeCellPositionsRowDirection,
        result.addCellPositionsRowDirection,
        result.updateCellPositionsRowDirection,
        recalculateColWidths
      );
    } else {
      // bug 太多了 直接先全部生成吧!! TODO 性能优化
      // if (
      //   this.columnHierarchyType === 'grid-tree' &&
      //   this.isColumnHeader(col, row) &&
      //   oldFrozenRowCount > this.frozenRowCount //p判断这个
      // ) {
      //   callUpdateRowOnScenegraph(result, recalculateColWidths, newFrozenRowCount, oldFrozenRowCount, this.scenegraph);
      //   callUpdateColOnScenegraph(result, newFrozenColCount, oldFrozenColCount, this.scenegraph);
      // } else {
      //   callUpdateColOnScenegraph(result, newFrozenColCount, oldFrozenColCount, this.scenegraph);
      //   callUpdateRowOnScenegraph(result, recalculateColWidths, newFrozenRowCount, oldFrozenRowCount, this.scenegraph);
      // }

      // if (this.rowHierarchyType === 'grid-tree' || this.columnHierarchyType === 'grid-tree') {
      //   this.scenegraph.updateCornerHeaderCells();
      //   // if (newFrozenColCount !== oldFrozenColCount) {
      //   this.scenegraph.updateRowHeaderCells();
      //   // }
      //   // if (newFrozenRowCount !== oldFrozenRowCount) {
      //   this.scenegraph.updateColumnHeaderCells();
      //   // }
      // }
      this.internalProps.stick.changedCells.clear();
      this.scenegraph.clearCells();
      this.clearCellStyleCache();
      this.scenegraph.createSceneGraph();
      this.scrollToRow(visibleStartRow);
      // this.renderWithRecreateCells();
    }
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
    this.internalProps._oldRowCount = undefined;
    this.internalProps._oldColCount = undefined;
  }
  /**
   * 通过表头的维度值路径来计算单元格位置  getCellAddressByHeaderPaths接口更强大一些 不限表头 不限参数格式
   * @param dimensionPaths
   * @returns
   */
  getHeaderCellAddressByPath(dimensionPaths: IDimensionInfo[]): CellAddress {
    const cellAddress = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotCellAdress(dimensionPaths);
    return cellAddress;
  }
  /**
   * 通过表头的维度值路径来计算单元格位置
   * @param dimensionPaths
   * @returns
   */
  getCellAddressByHeaderPaths(
    dimensionPaths:
      | {
          colHeaderPaths: IDimensionInfo[];
          rowHeaderPaths: IDimensionInfo[];
          cellLocation: CellLocation;
        }
      | IDimensionInfo[]
  ): CellAddress {
    const cellAddress = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getCellAdressByHeaderPath(
      dimensionPaths
    );
    return cellAddress;
  }

  /**
   * 通过传入的坐标 获取该位置当前单元格的维度路径；
   * @param coordinate 从body左上角为原点 coordinate为偏移距离 去计算单元格的headerPath；
   * 如不传coordinate坐标则按取body中左上角第一个单元格的维度路径
   * @returns
   */
  getHeaderPathByXY(coordinate?: { x: number; y: number }): ICellHeaderPaths {
    let cellAddr;
    if (coordinate) {
      cellAddr = this.getCellAt(
        coordinate.x + this.getFrozenColsWidth() + this.scrollLeft + 1,
        coordinate.y + this.getFrozenRowsHeight() + this.scrollTop + 1
      );
    } else {
      cellAddr = this.getCellAt(
        this.getFrozenColsWidth() + this.scrollLeft + 1,
        this.getFrozenRowsHeight() + this.scrollTop + 1
      );
    }
    const cellHeaderPaths = this.internalProps.layoutMap.getCellHeaderPaths(cellAddr.col, cellAddr.row);
    return cellHeaderPaths;
  }
  getHierarchyState(col: number, row: number): HierarchyState {
    return (this._getHeaderLayoutMap(col, row) as HeaderData)?.hierarchyState;
  }
  /** 获取列头树结构 */
  getLayoutColumnTree(): LayouTreeNode[] {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutColumnTree();
  }
  /** 获取表格列头树形结构的占位的总节点数 */
  getLayoutColumnTreeCount(): number {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutColumnTreeCount();
  }
  /** 获取行头树结构 */
  getLayoutRowTree(): LayouTreeNode[] {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutRowTree();
  }
  /** 获取表格行头树形结构的占位的总节点数 */
  getLayoutRowTreeCount(): number {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutRowTreeCount();
  }
  /**
   * 根据行列号获取表头tree节点，包含了用户在自定义树rowTree及columnTree树上的自定义属性（也是内部布局树的节点，获取后请不要随意修改）
   * @param col
   * @param row
   * @returns
   */
  getCellHeaderTreeNodes(col: number, row: number): ICellHeaderPaths {
    const layoutMap = this.internalProps.layoutMap;
    const headerNodes = layoutMap.getCellHeaderPathsWithTreeNode(col, row);
    return headerNodes;
  }

  getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo {
    const dimensionInfos = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row);
    const result: DropDownMenuEventInfo = {
      dimensionKey: dimensionInfos[dimensionInfos.length - 1].dimensionKey,
      value: this.getCellValue(col, row),
      cellLocation: this.getCellLocation(col, row),
      isPivotCorner: this.isCornerHeader(col, row),
      event: undefined
    };
    return result;
  }

  /**
   * 设置表格数据 及排序状态
   * @param records
   * @param sort
   */
  setRecords(records: Array<any>): void {
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.options.records = this.internalProps.records = records;
    this.internalProps.recordsIsTwoDimensionalArray = false;
    if (records?.[0]?.constructor === Array) {
      this.internalProps.recordsIsTwoDimensionalArray = true;
    }
    const options = this.options;
    const internalProps = this.internalProps;
    if (this.options.customConfig?.enableDataAnalysis === false) {
      //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
      //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
      if (this.internalProps.recordsIsTwoDimensionalArray === false) {
        this.flatDataToObjects = new FlatDataToObjects(
          {
            rows: internalProps.layoutMap.fullRowDimensionKeys,
            columns: internalProps.layoutMap.colDimensionKeys,
            indicators: internalProps.layoutMap.indicatorKeys,
            indicatorsAsCol: internalProps.layoutMap.indicatorsAsCol,
            indicatorDimensionKey: internalProps.layoutMap.indicatorDimensionKey
          },
          records
        );
      }
    } else {
      this.dataset.setRecords(records);
      let columnDimensionTree;
      let rowDimensionTree;
      if (options.columnTree) {
        columnDimensionTree = internalProps.layoutMap.columnDimensionTree;
      } else {
        options.indicatorsAsCol !== false &&
          options.indicators &&
          this.dataset.colHeaderTree &&
          deleteHideIndicatorNode(this.dataset.colHeaderTree, options.indicators, false, this);
        columnDimensionTree = new DimensionTree(
          (this.dataset.colHeaderTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.columnHierarchyType,
          this.options.columnHierarchyType !== 'grid' ? this.options.columnExpandLevel ?? 1 : undefined
        );
      }
      if (options.rowTree) {
        rowDimensionTree = internalProps.layoutMap.rowDimensionTree;
      } else {
        options.indicatorsAsCol === false &&
          this.dataset.rowHeaderTree &&
          options.indicators &&
          deleteHideIndicatorNode(this.dataset.rowHeaderTree, options.indicators, false, this);
        rowDimensionTree = new DimensionTree(
          (this.dataset.rowHeaderTree as ITreeLayoutHeadNode[]) ?? [],
          this.layoutNodeId,
          this.options.rowHierarchyType,
          this.options.rowHierarchyType !== 'grid' ? this.options.rowExpandLevel ?? 1 : undefined
        );
      }
      internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset, columnDimensionTree, rowDimensionTree);
      this.pivotSortState = [];
      if (options.pivotSortState) {
        this.pivotSortState = options.pivotSortState;
        // this.updatePivotSortState(options.pivotSortState);
      }
    }

    // 更新表头
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;

    // 清空单元格内容
    this.scenegraph.clearCells();
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
    this.eventManager.updateEventBinder();
    if (this.options.emptyTip) {
      if (this.internalProps.emptyTip) {
        this.internalProps.emptyTip?.resetVisible();
      } else {
        const EmptyTip = Factory.getComponent('emptyTip') as IEmptyTipComponent;
        this.internalProps.emptyTip = new EmptyTip(this.options.emptyTip, this);
        this.internalProps.emptyTip?.resetVisible();
      }
    }
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
    let editorDefine;
    if (this.isCornerHeader(col, row)) {
      const define = this.getHeaderDefine(col, row);
      editorDefine = (define as ColumnDefine)?.headerEditor ?? this.options.headerEditor;
    } else if (this.isHeader(col, row)) {
      const define = this.getHeaderDefine(col, row);
      editorDefine = (define as ColumnDefine)?.headerEditor ?? this.options.headerEditor;
    } else {
      const define = this.getBodyColumnDefine(col, row);
      editorDefine = (define as ColumnDefine)?.editor ?? this.options.editor;
    }
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
  /** 检查单元格是否定义过编辑器 不管编辑器是否有效 只要有定义就返回true */
  isHasEditorDefine(col: number, row: number) {
    const define = this.getBodyColumnDefine(col, row);
    let editorDefine = (define as ColumnDefine)?.editor ?? this.options.editor;

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
  /** 更改单元格数据 会触发change_cell_value事件*/
  changeCellValue(col: number, row: number, value: string | undefined, workOnEditableCell = false) {
    if ((workOnEditableCell && this.isHasEditorDefine(col, row)) || workOnEditableCell === false) {
      let newValue: any = value;
      const oldValue = this.getCellOriginValue(col, row);
      const rawValue = this.getCellRawValue(col, row);
      if (typeof rawValue === 'number' && isAllDigits(value)) {
        newValue = parseFloat(value);
      }
      this._changeCellValueToDataSet(col, row, oldValue, newValue);
      // this.scenegraph.updateCellContent(col, row);
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
      if (
        this.heightMode === 'adaptive' ||
        (this.autoFillHeight && this.getAllRowsHeight() <= this.tableNoFrameHeight)
      ) {
        if (this.internalProps._heightResizedRowMap.size === 0) {
          this.scenegraph.recalculateRowHeights();
        }
      } else if (this.isAutoRowHeight() && !this.internalProps._heightResizedRowMap.has(row)) {
        const oldHeight = this.getRowHeight(row);
        const newHeight = computeRowHeight(row, 0, this.colCount - 1, this);
        this.scenegraph.updateRowHeight(row, newHeight - oldHeight);
      }
      if (oldValue !== newValue) {
        this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
          col,
          row,
          rawValue,
          currentValue: oldValue,
          changedValue: newValue
        });
      }
      this.scenegraph.updateNextFrame();
    }
  }
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   * @param workOnEditableCell 是否仅更改可编辑单元格
   */
  changeCellValues(startCol: number, startRow: number, values: string[][], workOnEditableCell = false) {
    let pasteColEnd = startCol;
    let pasteRowEnd = startRow;
    // const rowCount = values.length;
    //#region 提前组织好未更改前的数据
    const beforeChangeValues: (string | number)[][] = [];
    const oldValues: (string | number)[][] = [];
    for (let i = 0; i < values.length; i++) {
      if (startRow + i > this.rowCount - 1) {
        break;
      }
      const rowValues = values[i];
      const rawRowValues: (string | number)[] = [];
      const oldRowValues: (string | number)[] = [];
      beforeChangeValues.push(rawRowValues);
      oldValues.push(oldRowValues);
      for (let j = 0; j < rowValues.length; j++) {
        if (startCol + j > this.colCount - 1) {
          break;
        }
        const beforeChangeValue = this.getCellRawValue(startCol + j, startRow + i);
        rawRowValues.push(beforeChangeValue);
        const oldValue = this.getCellOriginValue(startCol + j, startRow + i);
        oldRowValues.push(oldValue);
      }
    }
    //#endregion
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
        if (
          (workOnEditableCell && this.isHasEditorDefine(startCol + j, startRow + i)) ||
          workOnEditableCell === false
        ) {
          const value = rowValues[j];
          let newValue: string | number = value;
          const oldValue = oldValues[i][j];
          const rawValue = beforeChangeValues[i][j];
          if (typeof rawValue === 'number' && isAllDigits(value)) {
            newValue = parseFloat(value);
          }
          this._changeCellValueToDataSet(startCol + j, startRow + i, oldValue, newValue);
          const changedValue = this.getCellOriginValue(startCol + j, startRow + i);
          if (changedValue !== oldValue) {
            this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
              col: startCol + j,
              row: startRow + i,
              rawValue,
              currentValue: oldValue,
              changedValue
            });
          }
        }
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
    } else if (this.isAutoRowHeight()) {
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

  private _changeCellValueToDataSet(col: number, row: number, oldValue: string | number, newValue: string | number) {
    if (this.internalProps.recordsIsTwoDimensionalArray) {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      this.records[rowIndex][colIndex] = newValue;
    } else if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      if (this.isCornerHeader(col, row)) {
        this.internalProps.layoutMap.changeCornerTitle(col, row, newValue as string);
      } else if (this.isHeader(col, row)) {
        this.internalProps.layoutMap.changeTreeNodeTitle(col, row, newValue as string);

        !this.isCornerHeader(col, row) &&
          this.dataset.changeRecordFieldValue(
            cellDimensionPath.colHeaderPaths?.length
              ? cellDimensionPath.colHeaderPaths[cellDimensionPath.colHeaderPaths.length - 1].indicatorKey ??
                  cellDimensionPath.colHeaderPaths[cellDimensionPath.colHeaderPaths.length - 1].dimensionKey
              : cellDimensionPath.rowHeaderPaths[cellDimensionPath.rowHeaderPaths.length - 1].indicatorKey ??
                  cellDimensionPath.rowHeaderPaths[cellDimensionPath.rowHeaderPaths.length - 1].dimensionKey,
            oldValue,
            newValue
          );
      } else {
        const colKeys = cellDimensionPath.colHeaderPaths
          ?.filter((path: any) => {
            return !path.virtual;
          })
          .map((colPath: any) => {
            return colPath.indicatorKey ?? colPath.value;
          });
        const rowKeys = cellDimensionPath.rowHeaderPaths
          ?.filter((path: any) => {
            return !path.virtual;
          })
          .map((rowPath: any) => {
            return rowPath.indicatorKey ?? rowPath.value;
          });
        this.dataset.changeTreeNodeValue(
          !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
          this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
          (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
          newValue
        );
      }
    } else if (this.flatDataToObjects) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);

      if (this.isHeader(col, row)) {
        this.internalProps.layoutMap.changeTreeNodeTitle(col, row, newValue as string);

        !this.isCornerHeader(col, row) &&
          this.flatDataToObjects.changeRecordFieldValue(
            cellDimensionPath.colHeaderPaths?.length
              ? cellDimensionPath.colHeaderPaths[cellDimensionPath.colHeaderPaths.length - 1].indicatorKey ??
                  cellDimensionPath.colHeaderPaths[cellDimensionPath.colHeaderPaths.length - 1].dimensionKey
              : cellDimensionPath.rowHeaderPaths[cellDimensionPath.rowHeaderPaths.length - 1].indicatorKey ??
                  cellDimensionPath.rowHeaderPaths[cellDimensionPath.rowHeaderPaths.length - 1].dimensionKey,
            oldValue,
            newValue
          );
      } else {
        const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
          return colPath.indicatorKey ?? colPath.value;
        });
        const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
          return rowPath.indicatorKey ?? rowPath.value;
        });
        this.flatDataToObjects.changeTreeNodeValue(
          rowKeys,
          colKeys,
          (this.internalProps.layoutMap.getBody(col, row) as IndicatorData).indicatorKey,
          newValue
        );
      }
    }
  }
  _hasCustomRenderOrLayout() {
    if (this.options.customRender) {
      return true;
    }
    const { columnsDefine, rowsDefine, indicatorsDefine } = this.internalProps.layoutMap;
    for (let i = 0; i < columnsDefine.length; i++) {
      const columnDefine = columnsDefine[i];
      if (typeof columnDefine !== 'string' && (columnDefine.headerCustomLayout || columnDefine.headerCustomRender)) {
        return true;
      }
    }
    for (let i = 0; i < rowsDefine.length; i++) {
      const rowDefine = rowsDefine[i];
      if (typeof rowDefine !== 'string' && (rowDefine.headerCustomLayout || rowDefine.headerCustomRender)) {
        return true;
      }
    }
    for (let i = 0; i < indicatorsDefine.length; i++) {
      const indicatorDefine = indicatorsDefine[i];
      if (
        typeof indicatorDefine !== 'string' &&
        (indicatorDefine.customLayout ||
          indicatorDefine.headerCustomLayout ||
          indicatorDefine.customRender ||
          indicatorDefine.headerCustomRender)
      ) {
        return true;
      }
    }
    return false;
  }

  changeRecordOrder(source: number, target: number) {
    //
  }

  /**
   * 树形展示场景下，如果需要动态插入子节点的数据可以配合使用该接口，其他情况不适用
   * @param children 设置到该单元格的子节点
   * @param records 该节点展开后新增数据
   * @param col 需要设置子节点的单元格地址
   * @param row  需要设置子节点的单元格地址
   */
  setTreeNodeChildren(children: IHeaderTreeDefine[], records: any[], col: number, row: number) {
    if (this.flatDataToObjects) {
      // const headerPaths = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const headerTreeNode = this.internalProps.layoutMap.getHeadNode(
        // headerPaths.rowHeaderPaths.slice(0, headerPaths.rowHeaderPaths.length),
        col,
        row
      );
      headerTreeNode.children = children;
      this._refreshHierarchyState(col, row, true, () => {
        this.flatDataToObjects.changeDataConfig({
          rows: this.internalProps.layoutMap.fullRowDimensionKeys,
          columns: this.internalProps.layoutMap.colDimensionKeys,
          indicators: this.internalProps.layoutMap.indicatorKeys,
          indicatorsAsCol: this.internalProps.layoutMap.indicatorsAsCol,
          indicatorDimensionKey: this.internalProps.layoutMap.indicatorDimensionKey
        });
        this.flatDataToObjects.addRecords(records);
      });
    } else {
      // const headerPaths = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const headerTreeNode = this.internalProps.layoutMap.getHeadNode(
        // headerPaths.rowHeaderPaths.slice(0, headerPaths.rowHeaderPaths.length),
        col,
        row
      );
      headerTreeNode.children = children;
      this._refreshHierarchyState(col, row, true, () => {
        this.dataset._rowTreeHasChanged();
        this.dataset.changeDataConfig({
          rows: this.internalProps.layoutMap.fullRowDimensionKeys,
          columns: this.internalProps.layoutMap.colDimensionKeys
        });
        this.dataset.addRecords(records);
      });
    }
  }

  /** 更新数据过滤规则 对应dataConfig中filterRules配置格式 */
  updateFilterRules(filterRules: FilterRules) {
    this.internalProps.dataConfig.filterRules = filterRules;
    this.dataset.updateFilterRules(filterRules);
    this.renderWithRecreateCells();
  }
  /** 获取过滤后的数据 */
  getFilteredRecords() {
    return this.dataset?.filterRules;
  }

  release() {
    this.editorManager.release();
    super.release();
  }
}
