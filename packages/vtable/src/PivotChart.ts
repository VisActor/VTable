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
  IHeaderTreeDefine,
  IDimensionInfo,
  SortOrder,
  IIndicator,
  PivotChartConstructorOptions,
  CollectValueBy,
  AggregationRules,
  AggregationRule,
  AnyFunction,
  FilterRules,
  IPivotTableCellHeaderPaths,
  PivotChartAPI
} from './ts-types';
import { AggregationType } from './ts-types';
import type { HierarchyState } from './ts-types';
import { getField } from './data/DataSource';
import { PivotHeaderLayoutMap } from './layout/pivot-header-layout';
import { PIVOT_CHART_EVENT_TYPE } from './ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import { cellInRange, emptyFn } from './tools/helper';
import { Dataset } from './dataset/dataset';
import { _setDataSource, parseMarkLineGetExtendRange } from './core/tableHelper';
import { BaseTable } from './core/BaseTable';
import type { BaseTableAPI, HeaderData, PivotChartProtected } from './ts-types/base-table';
import type { IChartColumnIndicator } from './ts-types/pivot-table/indicator/chart-indicator';
import type { Chart } from './scenegraph/graphic/chart';
import {
  clearCellChartCacheImage,
  clearChartCacheImage,
  updateChartData
} from './scenegraph/refresh-node/update-chart';
import type { ITableAxisOption } from './ts-types/component/axis';
import { cloneDeep, isArray, isNumber } from '@visactor/vutils';
import type { DiscreteLegend } from '@src/vrender';
import type { ITitleComponent } from './components/title/title';
import { Env } from './tools/env';
import { TABLE_EVENT_TYPE } from './core/TABLE_EVENT_TYPE';
import type { IndicatorData } from './ts-types/list-table/layout-map/api';
import { cloneDeepSpec } from '@visactor/vutils-extension';
import type { ITreeLayoutHeadNode } from './layout/tree-helper';
import { DimensionTree, type LayouTreeNode } from './layout/tree-helper';
import { IndicatorDimensionKeyPlaceholder } from './tools/global';
import { checkHasCartesianChart } from './layout/chart-helper/get-chart-spec';
import { supplementIndicatorNodesForCustomTree } from './layout/layout-helper';
import type { IEmptyTipComponent } from './components/empty-tip/empty-tip';
import { Factory } from './core/factory';
import {
  registerAxis,
  registerEmptyTip,
  registerLegend,
  registerMenu,
  registerTitle,
  registerTooltip
} from './components';
import {
  registerChartCell,
  registerCheckboxCell,
  registerImageCell,
  registerProgressBarCell,
  registerRadioCell,
  registerSparkLineCell,
  registerTextCell,
  registerVideoCell
} from './scenegraph/group-creater/cell-type';
import { hasLinearAxis } from './layout/chart-helper/get-axis-config';
import { cacheStageCanvas } from './scenegraph/graphic/contributions/chart-render-helper';

registerAxis();
registerEmptyTip();
registerLegend();
registerMenu();
registerTitle();
registerTooltip();

registerChartCell();
registerCheckboxCell();
registerImageCell();
registerProgressBarCell();
registerRadioCell();
registerSparkLineCell();
registerTextCell();
registerVideoCell();

export class PivotChart extends BaseTable implements PivotChartAPI {
  layoutNodeId: { seqId: number } = { seqId: 0 };
  declare internalProps: PivotChartProtected;
  declare options: PivotChartConstructorOptions;
  pivotSortState: PivotSortState[];

  dataset?: Dataset; //数据处理对象  开启数据透视分析的表

  _selectedDataItemsInChart: any[] = [];
  _selectedDimensionInChart: { key: string; value: string }[] = [];
  _chartEventMap: Record<string, { query?: any; callback: AnyFunction }[]> = {};

  _axes: ITableAxisOption[];
  constructor(options: PivotChartConstructorOptions);
  constructor(container: HTMLElement, options: PivotChartConstructorOptions);
  constructor(container?: HTMLElement | PivotChartConstructorOptions, options?: PivotChartConstructorOptions) {
    if (Env.mode === 'node') {
      options = container as PivotChartConstructorOptions;
      container = null;
    } else if (!(container instanceof HTMLElement)) {
      options = container as PivotChartConstructorOptions;
      if ((container as PivotChartConstructorOptions).container) {
        container = (container as PivotChartConstructorOptions).container;
      } else {
        container = null;
      }
    }
    super(container as HTMLElement, options);
    if ((options as any).layout) {
      //TODO hack处理之前的demo都是定义到layout上的 所以这里直接并到options中
      Object.assign(options, (options as any).layout);
    }
    this.internalProps.columns = cloneDeep(options.columns);
    this.internalProps.rows = cloneDeep(options.rows);
    this.internalProps.indicators = cloneDeepSpec(options.indicators);
    this.internalProps.columnTree =
      options.indicatorsAsCol && !options.columns?.length && !options.columnTree ? [] : cloneDeep(options.columnTree);
    this.internalProps.rowTree =
      !options.indicatorsAsCol && !options.rows?.length && !options.rowTree ? [] : cloneDeep(options.rowTree);
    this.internalProps.records = options.records;

    this.setCustomStateNameToSpec();
    this.internalProps.columnResizeType = options.resize?.columnResizeType ?? options.columnResizeType ?? 'column';
    this.internalProps.rowResizeType = options.resize?.rowResizeType ?? options.rowResizeType ?? 'row';
    this.internalProps.dataConfig = { isPivotChart: true };
    this._axes = isArray(options.axes) ? options.axes : [];

    let columnDimensionTree;
    let rowDimensionTree;
    if (options.columnTree) {
      if (options.indicatorsAsCol !== false) {
        this.internalProps.columnTree = supplementIndicatorNodesForCustomTree(
          this.internalProps.columnTree,
          options.indicators
        );
      }
      columnDimensionTree = new DimensionTree(
        (this.internalProps.columnTree as ITreeLayoutHeadNode[]) ?? [],
        this.layoutNodeId
      );
    }
    if (options.rowTree) {
      if (options.indicatorsAsCol === false) {
        this.internalProps.rowTree = supplementIndicatorNodesForCustomTree(
          this.internalProps.rowTree,
          options.indicators
        );
      }
      rowDimensionTree = new DimensionTree(
        (this.internalProps.rowTree as ITreeLayoutHeadNode[]) ?? [],
        this.layoutNodeId
      );
    }
    const rowKeys = rowDimensionTree?.dimensionKeys?.count
      ? rowDimensionTree.dimensionKeys.valueArr()
      : options.rows?.reduce((keys, rowObj) => {
          if (typeof rowObj === 'string') {
            keys.push(rowObj);
          } else {
            keys.push(rowObj.dimensionKey);
          }
          return keys;
        }, []) ?? [];
    const columnKeys = columnDimensionTree?.dimensionKeys?.count
      ? columnDimensionTree.dimensionKeys.valueArr()
      : options.columns?.reduce((keys, columnObj) => {
          if (typeof columnObj === 'string') {
            keys.push(columnObj);
          } else {
            keys.push(columnObj.dimensionKey);
          }
          return keys;
        }, []) ?? [];
    const indicatorKeys =
      options.indicators?.reduce((keys, indicatorObj) => {
        if (typeof indicatorObj === 'string') {
          keys.push(indicatorObj);
        } else {
          keys.push(indicatorObj.indicatorKey);
        }
        return keys;
      }, []) ?? [];
    this.internalProps.dataConfig.collectValuesBy = this._generateCollectValuesConfig(columnKeys, rowKeys);
    this.internalProps.dataConfig.aggregationRules = this._generateAggregationRules();
    this.internalProps.dataConfig.dimensionSortArray = this._getDimensionSortArray();
    this.dataset = new Dataset(
      this.internalProps.dataConfig,
      // null,
      rowKeys,
      columnKeys,
      indicatorKeys,
      this.internalProps.indicators,
      options.indicatorsAsCol ?? true,
      options.records,
      undefined,
      undefined,
      this.internalProps.columnTree, //传递自定义树形结构会在dataset中补充指标节点children
      this.internalProps.rowTree,
      true
    );
    if (this.options.indicatorsAsCol && checkHasCartesianChart(this.internalProps.indicators)) {
      const supplyAxisNode = (nodes: IHeaderTreeDefine[]) => {
        nodes.forEach((node: IHeaderTreeDefine) => {
          if ((node.children as IHeaderTreeDefine[])?.length) {
            supplyAxisNode(node.children as IHeaderTreeDefine[]);
          } else {
            // 在指标在列上的透视图中，主指标轴（离散轴）显示在左侧，因此需要在原先行表头的布局中最右侧加入一列，用来显示坐标轴
            // 加入的这一列dimensionKey配置为'axis'，在后续行列计算维度时需要注意，这一列是为了显示坐标轴加入的，不在行列维度信息内
            node.children = [
              {
                dimensionKey: 'axis',
                value: ''
              }
            ];
          }
        });
      };
      if (this.dataset.rowHeaderTree?.length) {
        supplyAxisNode(this.dataset.rowHeaderTree);
      } else {
        this.dataset.rowHeaderTree = [
          {
            dimensionKey: 'axis',
            value: ''
          }
        ];
      }
    }
    if (!options.columnTree) {
      if (options.indicatorsAsCol !== false) {
        this.dataset.colHeaderTree = supplementIndicatorNodesForCustomTree(
          this.dataset.colHeaderTree,
          options.indicators
        );
      }
    }
    if (!options.rowTree) {
      if (options.indicatorsAsCol === false) {
        this.dataset.rowHeaderTree = supplementIndicatorNodesForCustomTree(
          this.dataset.rowHeaderTree,
          options.indicators
        );
      }
    }
    columnDimensionTree = new DimensionTree(
      (this.dataset.colHeaderTree as ITreeLayoutHeadNode[]) ?? [],
      this.layoutNodeId
    );
    rowDimensionTree = new DimensionTree(
      (this.dataset.rowHeaderTree as ITreeLayoutHeadNode[]) ?? [],
      this.layoutNodeId
    );

    this.internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset, columnDimensionTree, rowDimensionTree);
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
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
  static get EVENT_TYPE(): typeof PIVOT_CHART_EVENT_TYPE {
    return PIVOT_CHART_EVENT_TYPE;
  }
  get pivotChartAxes() {
    return this._axes;
  }
  get recordsCount() {
    return this.records?.length;
  }

  isListTable(): false {
    return false;
  }
  isPivotTable(): true {
    return true;
  }
  isPivotChart(): true {
    return true;
  }
  _canResizeColumn(col: number, row: number): boolean {
    const ifCan = super._canResizeColumn(col, row);
    if (ifCan) {
      if (!this.internalProps.layoutMap.indicatorsAsCol) {
        // 列上是否配置了禁止拖拽列宽的配置项disableColumnResize
        const cellDefine = this.internalProps.layoutMap.getBody(col, this.columnHeaderLevelCount);
        if ((cellDefine as IndicatorData)?.disableColumnResize) {
          return false;
        }
      }
    }
    return ifCan;
  }
  updateOption(options: PivotChartConstructorOptions) {
    const internalProps = this.internalProps;
    //维护选中状态
    // const range = internalProps.selection.range; //保留原有单元格选中状态
    super.updateOption(options);
    this.layoutNodeId = { seqId: 0 };
    this.internalProps.columns = cloneDeep(options.columns);
    this.internalProps.rows = cloneDeep(options.rows);
    this.internalProps.indicators = !options.indicators?.length ? [] : cloneDeepSpec(options.indicators);
    this.internalProps.columnTree =
      options.indicatorsAsCol && !options.columns?.length && !options.columnTree ? [] : cloneDeep(options.columnTree);
    this.internalProps.rowTree =
      !options.indicatorsAsCol && !options.rows?.length && !options.rowTree ? [] : cloneDeep(options.rowTree);
    options.records && (this.internalProps.records = options.records);
    this.setCustomStateNameToSpec();
    this._selectedDataItemsInChart = [];
    // 更新protectedSpace
    internalProps.columnResizeType = options.resize?.columnResizeType ?? options.columnResizeType ?? 'column';
    internalProps.rowResizeType = options.resize?.rowResizeType ?? options.rowResizeType ?? 'row';
    internalProps.dataConfig = { isPivotChart: true };

    this._axes = isArray(options.axes) ? options.axes : [];

    //TODO 这里需要加上判断 dataConfig是否有配置变化
    // if (options.rows || options.columns) {

    let columnDimensionTree;
    let rowDimensionTree;
    if (options.columnTree) {
      if (options.indicatorsAsCol !== false) {
        this.internalProps.columnTree = supplementIndicatorNodesForCustomTree(
          this.internalProps.columnTree,
          options.indicators
        );
      }
      columnDimensionTree = new DimensionTree(
        (this.internalProps.columnTree as ITreeLayoutHeadNode[]) ?? [],
        this.layoutNodeId
      );
    }
    if (options.rowTree) {
      if (options.indicatorsAsCol === false) {
        this.internalProps.rowTree = supplementIndicatorNodesForCustomTree(
          this.internalProps.rowTree,
          options.indicators
        );
      }
      rowDimensionTree = new DimensionTree(
        (this.internalProps.rowTree as ITreeLayoutHeadNode[]) ?? [],
        this.layoutNodeId
      );
    }
    const rowKeys = rowDimensionTree?.dimensionKeys?.count
      ? rowDimensionTree.dimensionKeys.valueArr()
      : options.rows?.reduce((keys, rowObj) => {
          if (typeof rowObj === 'string') {
            keys.push(rowObj);
          } else {
            keys.push(rowObj.dimensionKey);
          }
          return keys;
        }, []) ?? [];
    const columnKeys = columnDimensionTree?.dimensionKeys?.count
      ? columnDimensionTree.dimensionKeys.valueArr()
      : options.columns?.reduce((keys, columnObj) => {
          if (typeof columnObj === 'string') {
            keys.push(columnObj);
          } else {
            keys.push(columnObj.dimensionKey);
          }
          return keys;
        }, []) ?? [];
    const indicatorKeys =
      options.indicators?.reduce((keys, indicatorObj) => {
        if (typeof indicatorObj === 'string') {
          keys.push(indicatorObj);
        } else {
          keys.push(indicatorObj.indicatorKey);
        }
        return keys;
      }, []) ?? [];

    this.internalProps.dataConfig.collectValuesBy = this._generateCollectValuesConfig(columnKeys, rowKeys);
    this.internalProps.dataConfig.aggregationRules = this._generateAggregationRules();
    this.internalProps.dataConfig.dimensionSortArray = this._getDimensionSortArray();
    this.dataset = new Dataset(
      this.internalProps.dataConfig,
      // null,
      rowKeys,
      columnKeys,
      indicatorKeys,
      this.internalProps.indicators,
      options.indicatorsAsCol ?? true,
      options.records ?? this.internalProps.records,
      undefined,
      undefined,
      this.internalProps.columnTree,
      this.internalProps.rowTree,
      true
    );
    if (this.options.indicatorsAsCol && checkHasCartesianChart(this.internalProps.indicators)) {
      const supplyAxisNode = (nodes: IHeaderTreeDefine[]) => {
        nodes.forEach((node: IHeaderTreeDefine) => {
          if ((node.children as IHeaderTreeDefine[])?.length) {
            supplyAxisNode(node.children as IHeaderTreeDefine[]);
          } else {
            // 在指标在列上的透视图中，主指标轴（离散轴）显示在左侧，因此需要在原先行表头的布局中最右侧加入一列，用来显示坐标轴
            // 加入的这一列dimensionKey配置为'axis'，在后续行列计算维度时需要注意，这一列是为了显示坐标轴加入的，不在行列维度信息内
            node.children = [
              {
                dimensionKey: 'axis',
                value: ''
              }
            ];
          }
        });
      };
      if (this.dataset.rowHeaderTree?.length) {
        supplyAxisNode(this.dataset.rowHeaderTree);
      } else {
        this.dataset.rowHeaderTree = [
          {
            dimensionKey: 'axis',
            value: ''
          }
        ];
      }
    }

    if (!options.columnTree) {
      if (options.indicatorsAsCol !== false) {
        this.dataset.colHeaderTree = supplementIndicatorNodesForCustomTree(
          this.dataset.colHeaderTree,
          options.indicators
        );
      }
    }

    if (!options.rowTree) {
      if (options.indicatorsAsCol === false) {
        this.dataset.rowHeaderTree = supplementIndicatorNodesForCustomTree(
          this.dataset.rowHeaderTree,
          options.indicators
        );
      }
    }
    columnDimensionTree = new DimensionTree(
      (this.dataset.colHeaderTree as ITreeLayoutHeadNode[]) ?? [],
      this.layoutNodeId
    );

    rowDimensionTree = new DimensionTree(
      (this.dataset.rowHeaderTree as ITreeLayoutHeadNode[]) ?? [],
      this.layoutNodeId
    );

    internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset, columnDimensionTree, rowDimensionTree);
    // else {
    //   console.warn('VTable Warn: your option is invalid, please check it!');
    //   return this;
    // }

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
    // 传入新数据
    // if (options.dataSource) {
    //   _setDataSource(this, options.dataSource);
    // }else
    // 清空单元格内容
    this.scenegraph.clearCells();
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
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
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }
  updatePagination() {
    //void
  }
  refreshHeader(): void {
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
    // table.frozenColCount = layoutMap.rowHeaderLevelCount; //这里不要这样写 这个setter会检查扁头宽度 可能将frozenColCount置为0
    table.internalProps.frozenColCount = layoutMap.rowHeaderLevelCount ?? 0;
    // table.frozenRowCount = layoutMap.headerLevelCount;
    table.frozenRowCount = Math.max(layoutMap.headerLevelCount, this.options.frozenRowCount ?? 0);
    if (table.bottomFrozenRowCount !== (layoutMap?.bottomFrozenRowCount ?? 0)) {
      table.bottomFrozenRowCount = layoutMap?.bottomFrozenRowCount ?? 0;
    }
    if (table.rightFrozenColCount !== (layoutMap?.rightFrozenColCount ?? 0)) {
      table.rightFrozenColCount = layoutMap?.rightFrozenColCount ?? 0;
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
  }
  protected _getSortFuncFromHeaderOption(
    columns: undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): ((v1: any, v2: any, order: SortOrder) => 0 | 1 | -1) | undefined {
    return undefined;
  }
  /**
   * 将现有tree中的的hierarchyState同步到rows透视树中
   * @param sourceNode
   * @param targetNode
   */
  private syncHierarchyState(sourceNode: any, targetNode: IHeaderTreeDefine) {
    if (sourceNode.value === targetNode.value && sourceNode.dimensionKey === targetNode.dimensionKey) {
      targetNode.hierarchyState =
        targetNode.hierarchyState ?? (targetNode?.children ? sourceNode.hierarchyState : undefined);
      (targetNode?.children as IHeaderTreeDefine[])?.forEach((targetChildNode: IHeaderTreeDefine, index: number) => {
        if (sourceNode?.children?.[index] && targetChildNode) {
          this.syncHierarchyState(sourceNode.children[index], targetChildNode);
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
  // getFieldData(field: FieldDef | FieldFormat | undefined, col: number, row: number): FieldData {
  //   if (field === null || field === undefined) {
  //     return null;
  //   }
  //   const table = this;
  //   if (table.internalProps.layoutMap.isHeader(col, row)) {
  //     return null;
  //   }
  //   const rowIndex = this.getBodyIndexByRow(row);
  //   const colIndex = this.getBodyIndexByCol(col);
  //   const dataValue = table.dataSource?.getField(rowIndex, colIndex, col, row, this);
  //   if (typeof field !== 'string') {
  //     //field为函数format
  //     const cellHeaderPaths = table.internalProps.layoutMap.getCellHeaderPaths(col, row);
  //     return getField({ dataValue, ...cellHeaderPaths }, field, col, row, this, emptyFn as any);
  //   }
  //   return dataValue;
  // }

  getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData {
    if (!skipCustomMerge) {
      const customMergeText = this.getCustomMergeValue(col, row);
      if (customMergeText) {
        return customMergeText;
      }
    }
    if (this.internalProps.layoutMap.isHeader(col, row)) {
      if (
        this.internalProps.layoutMap.isBottomFrozenRow(col, row) ||
        this.internalProps.layoutMap.isRightFrozenColumn(col, row)
      ) {
        //针对底部和右侧冻结的轴单元格的值做处理 如果有轴这里会显示轴  如果没有则显示这里获取到的值
        const indicatorKeys = this.internalProps.layoutMap.getIndicatorKeyInChartSpec(col, row);
        let indicatorInfo: IIndicator;
        indicatorKeys?.forEach(key => {
          const info = this.internalProps.layoutMap.getIndicatorInfo(key);
          if (info) {
            indicatorInfo = info;
          }
        });
        return indicatorInfo?.title ?? indicatorInfo?.indicatorKey ?? '';
      }
      const { title, fieldFormat } = this.internalProps.layoutMap.getHeader(col, row) as HeaderData;
      return typeof fieldFormat === 'function' ? fieldFormat(title, col, row, this as BaseTableAPI) : title;
    }
    if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any, index: number) => {
        if (colPath.indicatorKey) {
          indicatorPosition = {
            position: 'col',
            index
          };
        }
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any, index: number) => {
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
    }
    const { fieldFormat } = this.internalProps.layoutMap.getBody(col, row) as IndicatorData;
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    const dataValue = this.records[rowIndex]?.[colIndex];
    if (typeof fieldFormat === 'function') {
      const fieldResult = fieldFormat(dataValue, col, row, this as BaseTableAPI);
      return fieldResult;
    }
    return dataValue;
    // const { field, fieldFormat } = this.internalProps.layoutMap.getBody(col, row);
    // return this.getFieldData(fieldFormat || field, col, row);
  }

  getCellOriginValue(col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      if (
        this.internalProps.layoutMap.isBottomFrozenRow(col, row) ||
        this.internalProps.layoutMap.isRightFrozenColumn(col, row)
      ) {
        //针对底部和右侧冻结的轴单元格的值做处理 如果有轴这里会显示轴  如果没有则显示这里获取到的值
        const indicatorKeys = this.internalProps.layoutMap.getIndicatorKeyInChartSpec(col, row);
        let indicatorInfo: IIndicator;
        indicatorKeys?.forEach(key => {
          const info = this.internalProps.layoutMap.getIndicatorInfo(key);
          if (info) {
            indicatorInfo = info;
          }
        });
        return indicatorInfo?.title ?? indicatorInfo?.indicatorKey ?? '';
      }
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    }
    if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any, index: number) => {
        if (colPath.indicatorKey) {
          indicatorPosition = {
            position: 'col',
            index
          };
        }
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any, index: number) => {
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
    }
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    const dataValue = this.records[rowIndex]?.[colIndex];
    return dataValue;
    // const { field } = table.internalProps.layoutMap.getBody(col, row);
    // return table.getFieldData(field, col, row);
  }

  getCellRawValue(col: number, row: number) {
    return this.getCellOriginValue(col, row);
  }

  // 获取原始数据
  getCellOriginRecord(col: number, row: number) {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.dataset) {
      let indicatorPosition: { position: 'col' | 'row'; index?: number };
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any, index: number) => {
        if (colPath.indicatorKey) {
          indicatorPosition = {
            position: 'col',
            index
          };
        }
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any, index: number) => {
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
    }
    return undefined;
  }

  getCellRawRecord(col: number, row: number) {
    return this.getCellOriginRecord(col, row);
  }

  getPivotSortState(col: number, row: number): SortOrder {
    if (!this.pivotSortState) {
      return undefined;
    }
    const cellRange = this.getCellRange(col, row);
    for (let i = 0; i < this.pivotSortState.length; i++) {
      const { col: sortCol, row: sortRow, order } = this.pivotSortState[i];

      if (cellInRange(cellRange, sortCol, sortRow)) {
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
    // 调用布局类 布局数据结构调整为移动位置后的
    const moveContext = (this.internalProps.layoutMap as PivotHeaderLayoutMap).moveHeaderPosition(source, target);
    if (moveContext) {
      if (moveContext.moveType === 'column') {
        // 是扁平数据结构 需要将二维数组this.records进行调整
        if (this.options.records?.[0]?.constructor === Array) {
          for (let row = 0; row < (this.internalProps.records as Array<any>).length; row++) {
            const sourceColumns = (this.internalProps.records[row] as unknown as number[]).splice(
              moveContext.sourceIndex - this.rowHeaderLevelCount,
              moveContext.sourceSize
            );
            sourceColumns.unshift((moveContext.targetIndex as any) - this.rowHeaderLevelCount, 0 as any);
            Array.prototype.splice.apply(this.internalProps.records[row] as unknown as number[], sourceColumns);
          }
        }
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        this.colWidthsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.sourceSize);
        //下面代码取自refreshHeader列宽设置逻辑
        //设置列宽极限值 TODO 目前是有问题的 最大最小宽度限制 移动列位置后不正确
        this.setMinMaxLimitWidth();
      } else if (moveContext.moveType === 'row') {
        // 是扁平数据结构 需要将二维数组this.records进行调整
        if (this.options.records?.[0]?.constructor === Array) {
          const sourceRows = (this.internalProps.records as unknown as number[]).splice(
            moveContext.sourceIndex - this.columnHeaderLevelCount,
            moveContext.sourceSize
          );
          sourceRows.unshift((moveContext.targetIndex as any) - this.columnHeaderLevelCount, 0 as any);
          Array.prototype.splice.apply(this.internalProps.records, sourceRows);
        }
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        this.rowHeightsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.sourceSize);
      }
      return moveContext;
    }
    return null;
  }
  /**
   * 表头切换层级状态
   * @param col
   * @param row
   */
  toggleHierarchyState(col: number, row: number, recalculateColWidths: boolean = true) {
    //nothing
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
    dimensionPaths: // | {
    //     colHeaderPaths: IDimensionInfo[];
    //     rowHeaderPaths: IDimensionInfo[];
    //   }
    IPivotTableCellHeaderPaths | IDimensionInfo[]
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
   * 根据用户配置 生成 收集维度值collectValuesBy 的配置  传给dataset用
   * 这个收集规则的逻辑是按照正常使用方式：
   * 指标显示在行表头indicatorsAsCol=false时，图表yField为指标值，xField为维度值（考虑stack）direction为默认值'vertical'；
   * 指标显示在列表头indicatorsAsCol=true时，图表xField为指标值，yField为维度值（考虑stack）direction为'horizontal'；
   * @param columnKeys
   * @param rowKeys
   * @returns
   */
  private _generateCollectValuesConfig(columnKeys: string[], rowKeys: string[]): Record<string, CollectValueBy> {
    columnKeys = columnKeys.filter(key => key !== IndicatorDimensionKeyPlaceholder);
    rowKeys = rowKeys.filter(key => key !== IndicatorDimensionKeyPlaceholder);
    const indicators = this.internalProps.indicators;
    const collectValuesBy: Record<string, CollectValueBy> = {};

    for (let i = 0, len = indicators?.length; i < len; i++) {
      if (typeof indicators[i] !== 'string' && (indicators[i] as IChartColumnIndicator).chartSpec) {
        if (
          (indicators[i] as IChartColumnIndicator).chartSpec?.type === 'pie' ||
          (indicators[i] as IChartColumnIndicator).chartSpec?.type === 'rose' ||
          (indicators[i] as IChartColumnIndicator).chartSpec?.type === 'radar' ||
          (indicators[i] as IChartColumnIndicator).chartSpec?.type === 'gauge' ||
          (indicators[i] as IChartColumnIndicator).chartSpec?.type === 'wordCloud'
        ) {
          continue;
        }
        const indicatorDefine = indicators[i] as IIndicator;
        const indicatorSpec = (indicatorDefine as IChartColumnIndicator).chartSpec;

        if (this.options.indicatorsAsCol === false) {
          //明确指定 chartSpec.stack为true
          indicatorSpec?.stack !== false &&
            (indicatorSpec?.type === 'bar' || indicatorSpec?.type === 'area') &&
            (indicatorSpec.stack = true);
          // 收集指标值的范围
          collectValuesBy[indicatorDefine.indicatorKey] = {
            by: rowKeys,
            range: true,
            // 判断是否需要匹配维度值相同的进行求和计算
            sumBy: indicatorSpec?.stack && columnKeys.concat(indicatorSpec?.xField)
          };
          if (indicatorSpec.series) {
            indicatorSpec.series.forEach((chartSeries: any) => {
              const xField = typeof chartSeries.xField === 'string' ? chartSeries.xField : chartSeries.xField[0];
              collectValuesBy[xField] = {
                by: columnKeys,
                type: chartSeries.direction !== 'horizontal' ? 'xField' : undefined,
                // range: chartSeries.type === 'scatter' ? true : chartSeries.direction === 'horizontal',
                range: hasLinearAxis(chartSeries, this._axes, chartSeries.direction === 'horizontal', true),
                sortBy:
                  chartSeries.direction !== 'horizontal'
                    ? chartSeries?.data?.fields?.[xField]?.domain ?? indicatorSpec?.data?.fields?.[xField]?.domain
                    : undefined
              };

              const yField = chartSeries.yField;
              chartSeries.stack !== false &&
                (chartSeries.type === 'bar' || chartSeries.type === 'area') &&
                (chartSeries.stack = true); //明确指定 chartSpec.stack为true
              collectValuesBy[yField] = {
                by: rowKeys,
                // range: chartSeries.type === 'scatter' ? true : chartSeries.direction !== 'horizontal', // direction默认为'vertical'
                range: hasLinearAxis(chartSeries, this._axes, chartSeries.direction === 'horizontal', false),
                sumBy: chartSeries.stack && columnKeys.concat(chartSeries?.xField), // 逻辑严谨的话 这个concat的值也需要结合 chartSeries.direction来判断是xField还是yField
                sortBy:
                  chartSeries.direction === 'horizontal'
                    ? chartSeries?.data?.fields?.[yField]?.domain ?? indicatorSpec?.data?.fields?.[yField]?.domain
                    : undefined,
                extendRange: parseMarkLineGetExtendRange(indicatorSpec.markLine)
              };
            });
          } else {
            const xField = typeof indicatorSpec.xField === 'string' ? indicatorSpec.xField : indicatorSpec.xField[0];
            collectValuesBy[xField] = {
              by: columnKeys,
              type: indicatorSpec.direction !== 'horizontal' ? 'xField' : undefined,
              // range: indicatorSpec.type === 'scatter' ? true : indicatorSpec.direction === 'horizontal',
              range: hasLinearAxis(indicatorSpec, this._axes, indicatorSpec.direction === 'horizontal', true),
              sortBy:
                indicatorSpec.direction !== 'horizontal' ? indicatorSpec?.data?.fields?.[xField]?.domain : undefined
            };
            //明确指定 chartSpec.stack为true
            indicatorSpec?.stack !== false &&
              (indicatorSpec?.type === 'bar' || indicatorSpec?.type === 'area') &&
              (indicatorSpec.stack = true);
            //下面这个收集的值 应该是和收集的 collectValuesBy[indicatorDefine.indicatorKey] 相同
            const yField = indicatorSpec.yField;
            collectValuesBy[yField] = {
              by: rowKeys,
              range: indicatorSpec.direction !== 'horizontal', // direction默认为'vertical'
              sumBy: indicatorSpec.stack && columnKeys.concat(indicatorSpec?.xField), // 逻辑严谨的话 这个concat的值也需要结合 chartSeries.direction来判断是xField还是yField
              sortBy:
                indicatorSpec.direction === 'horizontal' ? indicatorSpec?.data?.fields?.[yField]?.domain : undefined,
              extendRange: parseMarkLineGetExtendRange(indicatorSpec.markLine)
            };
          }
        } else {
          const indicatorDefine = indicators[i] as IIndicator;
          //明确指定 chartSpec.stack为true
          indicatorSpec?.stack !== false &&
            (indicatorSpec?.type === 'bar' || indicatorSpec?.type === 'area') &&
            (indicatorSpec.stack = true);
          // 收集指标值的范围
          collectValuesBy[indicatorDefine.indicatorKey] = {
            by: columnKeys,
            range: true,
            // 判断是否需要匹配维度值相同的进行求和计算
            sumBy: indicatorSpec?.stack && rowKeys.concat(indicatorSpec?.yField)
          };
          if (indicatorSpec.series) {
            indicatorSpec.series.forEach((chartSeries: any) => {
              const yField = typeof chartSeries.yField === 'string' ? chartSeries.yField : chartSeries.yField[0];
              collectValuesBy[yField] = {
                by: rowKeys,
                type: chartSeries.direction === 'horizontal' ? 'yField' : undefined,
                // range: chartSeries.type === 'scatter' ? true : chartSeries.direction !== 'horizontal',
                range: hasLinearAxis(chartSeries, this._axes, chartSeries.direction === 'horizontal', false),
                sortBy:
                  chartSeries.direction === 'horizontal'
                    ? chartSeries?.data?.fields?.[yField]?.domain ?? indicatorSpec?.data?.fields?.[yField]?.domain
                    : undefined
              };

              const xField = chartSeries.xField;
              chartSeries.stack !== false &&
                (chartSeries.type === 'bar' || chartSeries.type === 'area') &&
                (chartSeries.stack = true); //明确指定 chartSpec.stack为true
              collectValuesBy[xField] = {
                by: columnKeys,
                // range: chartSeries.type === 'scatter' ? true : chartSeries.direction === 'horizontal', // direction默认为'vertical'
                range: hasLinearAxis(chartSeries, this._axes, chartSeries.direction === 'horizontal', true),
                sumBy: chartSeries.stack && rowKeys.concat(chartSeries?.yField),
                sortBy:
                  chartSeries.direction !== 'horizontal'
                    ? chartSeries?.data?.fields?.[xField]?.domain ?? indicatorSpec?.data?.fields?.[xField]?.domain
                    : undefined,
                extendRange: parseMarkLineGetExtendRange(indicatorSpec.markLine)
              };
            });
          } else {
            const yField = typeof indicatorSpec.yField === 'string' ? indicatorSpec.yField : indicatorSpec.yField[0];
            collectValuesBy[yField] = {
              by: rowKeys,
              type: indicatorSpec.direction === 'horizontal' ? 'yField' : undefined,
              // range: indicatorSpec.type === 'scatter' ? true : indicatorSpec.direction !== 'horizontal',
              range: hasLinearAxis(indicatorSpec, this._axes, indicatorSpec.direction === 'horizontal', false),
              sortBy:
                indicatorSpec.direction === 'horizontal' ? indicatorSpec?.data?.fields?.[yField]?.domain : undefined
            };
            //明确指定 chartSpec.stack为true
            indicatorSpec?.stack !== false &&
              (indicatorSpec?.type === 'bar' || indicatorSpec?.type === 'area') &&
              (indicatorSpec.stack = true);
            //下面这个收集的值 应该是和收集的 collectValuesBy[indicatorDefine.indicatorKey] 相同
            const xField = indicatorSpec.xField;
            collectValuesBy[xField] = {
              by: columnKeys,
              // range: indicatorSpec.type === 'scatter' ? true : indicatorSpec.direction === 'horizontal', // direction默认为'vertical'
              range: hasLinearAxis(indicatorSpec, this._axes, indicatorSpec.direction === 'horizontal', true),
              sumBy: indicatorSpec.stack && rowKeys.concat(indicatorSpec?.yField),
              sortBy:
                indicatorSpec.direction !== 'horizontal' ? indicatorSpec?.data?.fields?.[xField]?.domain : undefined,
              extendRange: parseMarkLineGetExtendRange(indicatorSpec.markLine)
            };
          }
        }
      }
    }

    return collectValuesBy;
  }
  // private _generateAggregationRules(indicatorKeys: string[]): AggregationRules {
  //   return indicatorKeys.map((indicatorKey: string) => {
  //     return {
  //       indicatorKey, //field转为指标key
  //       field: indicatorKey, //指标依据字段
  //       aggregationType: AggregationType.RECORD //计算类型
  //     };
  //   });
  // }
  /**
   *
   * @param indicatorFromChartSpec 是否需要考虑chartSpec中的yField或者xField分析作为指标来分组数据
   * @returns
   */
  private _generateAggregationRules() {
    const aggregationRules: AggregationRules = [];
    // indicatorFromChartSpec = true;
    this.internalProps.indicators?.forEach((indicator: IIndicator | string) => {
      if (typeof indicator === 'string') {
        aggregationRules.push({
          indicatorKey: indicator, //field转为指标key
          field: indicator, //指标依据字段
          aggregationType: AggregationType.RECORD //计算类型
        } as AggregationRule<AggregationType.RECORD>);
      } else {
        if ((indicator as IChartColumnIndicator).chartSpec?.series) {
          // 如果chartSpec配置了组合图 series 则需要考虑 series中存在的多个指标
          const fields: string[] = [];
          (indicator as IChartColumnIndicator).chartSpec?.series.forEach((seriesSpec: any) => {
            const seriesField = this.options.indicatorsAsCol === false ? seriesSpec.yField : seriesSpec.xField;
            if (fields.indexOf(seriesField) === -1) {
              fields.push(seriesField);
            }
          });
          aggregationRules.push({
            indicatorKey: indicator.indicatorKey, //field转为指标key
            field: fields, //指标依据字段
            aggregationType: AggregationType.RECORD //计算类型
          });
        } else {
          const field =
            this.options.indicatorsAsCol === false
              ? (indicator as IChartColumnIndicator).chartSpec.yField
              : (indicator as IChartColumnIndicator).chartSpec.xField;
          aggregationRules.push({
            indicatorKey: indicator.indicatorKey, //field转为指标key
            field: field ?? indicator.indicatorKey, //指标依据字段
            aggregationType: AggregationType.RECORD //计算类型
          });
        }
      }
    });

    return aggregationRules;
  }
  /** 将spec中的 selected和selected_reverse  更名为vtable_selected和vtable_selected_reverse */
  private setCustomStateNameToSpec() {
    /** 修改设置的selected 和 dselected_reverse的名字加前缀vtable */
    const setCustomStateName = (spec: any) => {
      if (spec.bar?.state?.selected) {
        spec.bar.state.vtable_selected = spec.bar.state.selected;
        spec.bar.state.vtable_selected_reverse = spec.bar.state.selected_reverse;
        delete spec.bar.state.selected;
        delete spec.bar.state.selected_reverse;
      }
      if (spec.point?.state?.selected) {
        spec.point.state.vtable_selected = spec.point.state.selected;
        spec.point.state.vtable_selected_reverse = spec.point.state.selected_reverse;
        delete spec.point.state.selected;
        delete spec.point.state.selected_reverse;
      }
      if (spec.line?.state?.selected) {
        spec.line.state.vtable_selected = spec.line.state.selected;
        spec.line.state.vtable_selected_reverse = spec.line.state.selected_reverse;
        delete spec.line.state.selected;
        delete spec.line.state.selected_reverse;
      }
      if (spec.area?.state?.selected) {
        spec.area.state.vtable_selected = spec.area.state.selected;
        spec.area.state.vtable_selected_reverse = spec.area.state.selected_reverse;
        delete spec.area.state.selected;
        delete spec.area.state.selected_reverse;
      }
      if (spec.pie?.state?.selected) {
        spec.pie.state.vtable_selected = spec.pie.state.selected;
        spec.pie.state.vtable_selected_reverse = spec.pie.state.selected_reverse;
        delete spec.pie.state.selected;
        delete spec.pie.state.selected_reverse;
      }
    };
    this.internalProps.indicators?.forEach((indicator: string | IIndicator) => {
      if ((indicator as IChartColumnIndicator).chartSpec) {
        const spec = (indicator as IChartColumnIndicator).chartSpec;
        if (spec.series) {
          spec.series.forEach((series: any) => {
            setCustomStateName(series);
          });
        } else {
          setCustomStateName(spec);
        }
      }
    });
  }

  /** 更新数据过滤规则，适用场景：点击图例项后 更新过滤规则 来更新图表 */
  updateFilterRules(filterRules: FilterRules) {
    this.internalProps.dataConfig.filterRules = filterRules;
    this.dataset.updateFilterRules(filterRules);
    clearChartCacheImage(this.scenegraph);
    updateChartData(this.scenegraph);
    this.render();
  }
  clearChartCacheImage(col?: number, row?: number) {
    if (isNumber(col) && isNumber(row)) {
      clearCellChartCacheImage(col, row, this.scenegraph);
    } else {
      clearChartCacheImage(this.scenegraph);
    }
  }
  /** 获取图例的选择状态 */
  getLegendSelected() {
    const selected: any[] = [];
    this.internalProps.legends?.forEach(legend => {
      const data = (legend.legendComponent as any)._getSelectedLegends().map((d: any) => d.label);
      selected.push(...data);
    });
    return selected;
  }
  setLegendSelected(selectedData: (string | number)[]) {
    this.internalProps.legends?.forEach(legend => {
      (legend.legendComponent as DiscreteLegend).setSelected(selectedData);
    });
    // this.updateFilterRules([{ filterKey: '20001', filteredValues: selectedData }]);
    // this.invalidate();
  }
  /**
   * 获取图表上某一个图元的位置
   * @param datum 图元对应的数据
   * @param cellHeaderPaths 单元格的header路径
   * @returns 图元在整个表格上的坐标位置（相对表格左上角视觉坐标）
   */
  getChartDatumPosition(datum: any, cellHeaderPaths: IPivotTableCellHeaderPaths): { x: number; y: number } {
    const { chartInstance, bounds } = this.getChartInstance(cellHeaderPaths);
    if (chartInstance) {
      const position = chartInstance.convertDatumToPosition(datum);
      return position ? { x: Math.round(position.x + bounds.x1), y: Math.round(position.y + bounds.y1) } : null;
    }
    return null;
  }
  /** 获取某条数据所在的行列位置 */
  getCellAddressByRecord(record: any) {
    const rowHeaderPaths: IDimensionInfo[] = [];
    const colHeaderPaths: IDimensionInfo[] = [];
    const recordKeyMapToIndicatorKeys = {};
    const indicatorRecordKeys: (string | number)[] = [];
    this.dataset.dataConfig.aggregationRules.forEach(aggregationRule => {
      if (typeof aggregationRule.field === 'string') {
        recordKeyMapToIndicatorKeys[aggregationRule.field] = aggregationRule.indicatorKey;
        indicatorRecordKeys.push(aggregationRule.field);
      } else {
        for (let i = 0; i < aggregationRule.field.length; i++) {
          recordKeyMapToIndicatorKeys[aggregationRule.field[i]] = aggregationRule.indicatorKey;
          indicatorRecordKeys.push(aggregationRule.field[i]);
        }
      }
    });
    for (const key in record) {
      if (this.dataset.rows.indexOf(key) >= 0) {
        rowHeaderPaths.push({
          dimensionKey: key,
          value: record[key]
        });
      }
      if (this.dataset.columns.indexOf(key) >= 0) {
        colHeaderPaths.push({
          dimensionKey: key,
          value: record[key]
        });
      }
      if (indicatorRecordKeys.indexOf(key) >= 0) {
        if (this.dataset.indicatorsAsCol) {
          colHeaderPaths.push({
            indicatorKey: recordKeyMapToIndicatorKeys[key]
          });
        } else {
          rowHeaderPaths.push({
            indicatorKey: recordKeyMapToIndicatorKeys[key]
          });
        }
      }
    }
    return this.getCellAddressByHeaderPaths({
      rowHeaderPaths,
      colHeaderPaths,
      cellLocation: 'body'
    });
  }

  getChartInstance(cellHeaderPaths: IPivotTableCellHeaderPaths) {
    const cellAddr = this.getCellAddressByHeaderPaths(cellHeaderPaths);
    if (cellAddr) {
      const cellPosition = this.getCellRelativeRect(cellAddr.col, cellAddr.row);
      const cellGroup = this.scenegraph.getCell(cellAddr.col, cellAddr.row);
      // let position;
      let chartInstance: any;
      const chartNode: Chart = cellGroup?.getChildren()?.[0] as Chart;
      if (chartNode.attribute.chartInstance) {
        chartInstance = chartNode.attribute.chartInstance;
        const { dataId, data, axes, spec } = chartNode.attribute;
        const viewBox = chartNode.getViewBox();
        axes?.forEach((axis: any, index: number) => {
          if (axis.type === 'linear') {
            // const chartAxis = chartInstance._chart._components[index];
            // chartAxis._domain = {
            //   min: axis.range?.min ?? 0,
            //   max: axis.range?.max ?? 0
            // };
            chartInstance.updateModelSpecSync(
              { type: 'axes', index },
              {
                min: axis.range?.min ?? 0,
                max: axis.range?.max ?? 0,
                tick: {
                  tickMode: axis.tick?.tickMode
                }
              },
              true
            );
          } else if (axis.type === 'band') {
            // const chartAxis = chartInstance._chart._components[index];
            // chartAxis._spec.domain = axis.domain.slice(0);
            // chartAxis.updateScaleDomain();
            chartInstance.updateModelSpec({ type: 'axes', index }, { domain: axis.domain.slice(0) }, true);
          }
        });

        chartInstance.updateViewBox(
          {
            x1: 0,
            x2: viewBox.x2 - viewBox.x1,
            y1: 0,
            y2: viewBox.y2 - viewBox.y1
          },
          false,
          false
        );
        // 拷贝的chart-render-helper.ts 的代码
        const chartStage = chartInstance.getStage();
        const matrix = chartNode.globalTransMatrix.clone();
        const stageMatrix = chartNode.stage.window.getViewBoxTransform();
        matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
        chartStage.window.setViewBoxTransform &&
          chartStage.window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

        // chartInstance.updateDataSync(dataId, data);
        if (typeof dataId === 'string') {
          chartInstance.updateDataSync(dataId, data ?? []);
        } else {
          const dataBatch = [];
          for (const dataIdStr in dataId) {
            const dataIdAndField = dataId[dataIdStr];
            const series = spec.series.find((item: any) => item?.data?.id === dataIdStr);
            dataBatch.push({
              id: dataIdStr,
              values: dataIdAndField
                ? data?.filter((item: any) => {
                    return item.hasOwnProperty(dataIdAndField);
                  }) ?? []
                : data ?? [],
              fields: series?.data?.fields
            });
            // 判断是否有updateFullDataSync 木有的话 还是循环调用updateDataSync
            if (!chartInstance.updateFullDataSync) {
              chartInstance.updateDataSync(
                dataIdStr,
                dataIdAndField
                  ? data?.filter((item: any) => {
                      return item.hasOwnProperty(dataIdAndField);
                    }) ?? []
                  : data ?? []
              );
            }
          }
          chartInstance.updateFullDataSync?.(dataBatch);
        }
        // position = chartInstance.convertDatumToPosition(datum);
        this.render();
        // this.renderAsync();
      }
      // cellPosition.offsetLeft(this.tableX);
      // cellPosition.offsetTop(this.tableY);
      return {
        chartInstance,
        bounds: cellPosition.bounds
      };
      // return position
      //   ? { x: Math.round(position.x + cellPosition.bounds.x1), y: Math.round(position.y + cellPosition.bounds.y1) }
      //   : null;
    }
    return {};
  }

  /** 激活某个单元格的图表（相当于鼠标hover到单元格上）  */
  activateChartInstance(cellHeaderPaths: IPivotTableCellHeaderPaths) {
    const cellAddr = this.getCellAddressByHeaderPaths(cellHeaderPaths);
    if (cellAddr) {
      // const cellPosition = this.getCellRelativeRect(cellAddr.col, cellAddr.row);
      const col = cellAddr.col;
      const row = cellAddr.row;
      const cellGroup = this.scenegraph.getCell(col, row);
      const chartNode: Chart = cellGroup?.getChildren()?.[0] as Chart;
      const activeChartInstance = this.scenegraph.activateChart(col, row);
      const { dataId, data, axes, spec } = chartNode.attribute;
      const viewBox = chartNode.getViewBox();

      axes?.forEach((axis: any, index: number) => {
        if (axis.type === 'linear') {
          // const chartAxis = chartInstance._chart._components[index];
          // chartAxis._domain = {
          //   min: axis.range?.min ?? 0,
          //   max: axis.range?.max ?? 0
          // };
          activeChartInstance.updateModelSpecSync(
            { type: 'axes', index },
            {
              min: axis.range?.min ?? 0,
              max: axis.range?.max ?? 0,
              tick: {
                tickMode: axis.tick?.tickMode
              }
            },
            true
          );
        } else if (axis.type === 'band') {
          // const chartAxis = chartInstance._chart._components[index];
          // chartAxis._spec.domain = axis.domain.slice(0);
          // chartAxis.updateScaleDomain();
          activeChartInstance.updateModelSpec({ type: 'axes', index }, { domain: axis.domain.slice(0) }, true);
        }
      });

      activeChartInstance.updateViewBox(
        {
          x1: 0,
          x2: viewBox.x2 - viewBox.x1,
          y1: 0,
          y2: viewBox.y2 - viewBox.y1
        },
        false,
        false
      );
      // console.log(viewBox);

      const chartStage = activeChartInstance.getStage();
      chartStage.needRender = true;
      // chartStage.background = 'red';
      const matrix = chartNode.globalTransMatrix.clone();
      const stageMatrix = chartNode.stage.window.getViewBoxTransform().clone();
      // matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
      stageMatrix.multiply(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
      chartStage.window.setViewBoxTransform(
        stageMatrix.a,
        stageMatrix.b,
        stageMatrix.c,
        stageMatrix.d,
        stageMatrix.e,
        stageMatrix.f
      );
      if (typeof dataId === 'string') {
        activeChartInstance.updateDataSync(dataId, data ?? []);
      } else {
        const dataBatch = [];
        // 如果是组合图有series系列 需要组个设置数据 这里的data包括的单元格完整数据 需要根据key过滤
        for (const dataIdStr in dataId) {
          const dataIdAndField = dataId[dataIdStr];
          const series = spec.series.find((item: any) => item?.data?.id === dataIdStr);
          dataBatch.push({
            id: dataIdStr,
            values: dataIdAndField
              ? data?.filter((item: any) => {
                  return item.hasOwnProperty(dataIdAndField);
                }) ?? []
              : data ?? [],
            fields: series?.data?.fields
          });
          if (!activeChartInstance.updateFullDataSync) {
            activeChartInstance.updateDataSync(
              dataIdStr,
              dataIdAndField
                ? data?.filter((item: any) => {
                    return item.hasOwnProperty(dataIdAndField);
                  }) ?? []
                : data ?? []
            );
          }
        }
        activeChartInstance.updateFullDataSync?.(dataBatch);
      }
      return activeChartInstance;
    }
  }
  /** 替换某个单元格图表的缓存图片 */
  replaceChartCacheImage(cellHeaderPaths: IPivotTableCellHeaderPaths, chartInstance: any) {
    const cellAddr = this.getCellAddressByHeaderPaths(cellHeaderPaths);
    if (cellAddr) {
      const cellGroup = this.scenegraph.getCell(cellAddr.col, cellAddr.row);
      const chartNode: Chart = cellGroup?.getChildren()?.[0] as Chart;
      cacheStageCanvas(chartInstance.getStage(), chartNode);
    }
  }
  _getDimensionSortArray(): string[] | undefined {
    if (this.options?.axes?.length) {
      const dimensionAxisOrient = this.options.indicatorsAsCol ? 'left' : 'bottom';
      const dimensionAxisOption = this.options.axes.find(axis => {
        if (axis.orient === dimensionAxisOrient) {
          return true;
        }
        return false;
      });
      if (dimensionAxisOption && isArray((dimensionAxisOption as any).domain)) {
        return (dimensionAxisOption as any).domain;
      }
    }
    return undefined;
  }

  /**
   * 设置表格数据 及排序状态
   * @param records
   * @param sort
   */
  setRecords(records: Array<any>): void {
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.options.records = this.internalProps.records = records;
    const options = this.options;
    const internalProps = this.internalProps;

    this.dataset.setRecords(records);
    let columnDimensionTree;
    let rowDimensionTree;
    if (options.columnTree) {
      columnDimensionTree = internalProps.layoutMap.columnDimensionTree;
    } else {
      columnDimensionTree = new DimensionTree(
        (this.dataset.colHeaderTree as ITreeLayoutHeadNode[]) ?? [],
        this.layoutNodeId
      );
    }
    if (options.rowTree) {
      rowDimensionTree = internalProps.layoutMap.rowDimensionTree;
    } else {
      rowDimensionTree = new DimensionTree(
        (this.dataset.rowHeaderTree as ITreeLayoutHeadNode[]) ?? [],
        this.layoutNodeId
      );
    }
    internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset, columnDimensionTree, rowDimensionTree);

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
}
