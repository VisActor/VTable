import * as sort from '../tools/sort';
import type {
  CustomAggregation,
  DataSourceAPI,
  FieldAssessor,
  FieldData,
  FieldDef,
  FieldFormat,
  FilterRules,
  IListTableDataConfig,
  IPagination,
  MaybePromiseOrCallOrUndefined,
  MaybePromiseOrUndefined,
  SortOrder
} from '../ts-types';
import { AggregationType, HierarchyState } from '../ts-types';
import { applyChainSafe, getOrApply, obj, isPromise, emptyFn } from '../tools/helper';
import { EventTarget } from '../event/EventTarget';
import { getValueByPath, isAllDigits } from '../tools/util';
import { calculateArrayDiff } from '../tools/diff-cell';
import { arrayEqual, cloneDeep, isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../ts-types/base-table';
import {
  RecordAggregator,
  type Aggregator,
  SumAggregator,
  CountAggregator,
  MaxAggregator,
  MinAggregator,
  AvgAggregator,
  NoneAggregator,
  CustomAggregator
} from '../dataset/statistics-helper';
import type { ColumnData } from '../ts-types/list-table/layout-map/api';

/**
 * 判断字段数据是否为访问器的格式
 * @param field
 * @returns boolean
 */
function isFieldAssessor(field: FieldDef | FieldFormat | number): field is FieldAssessor {
  if (obj.isObject(field)) {
    const a = field as FieldAssessor;
    if (isValid(a.get) && isValid(a.set)) {
      return true;
    }
  }
  return false;
}
const EVENT_TYPE = {
  SOURCE_LENGTH_UPDATE: 'source_length_update',
  CHANGE_ORDER: 'change_order'
} as const;
type PromiseBack = (value: MaybePromiseOrUndefined) => void;

/**
 * 获取到的某个filed的值 处理可能为promise的情况
 * @param value
 * @param promiseCallBack
 * @returns
 */
function getValue(value: MaybePromiseOrCallOrUndefined, promiseCallBack: PromiseBack): MaybePromiseOrUndefined {
  const maybePromiseOrValue = getOrApply(value);
  if (isPromise(maybePromiseOrValue)) {
    const promiseValue = maybePromiseOrValue.then((r: any) => {
      promiseCallBack(r);
      return r;
    });

    promiseCallBack(promiseValue);
    return promiseValue;
  }
  return maybePromiseOrValue;
}
/**
 * 根据field获取数据源record对应的值 获取到的可能是个异步Promise 需要设置回调处理逻辑
 * @param record
 * @param field
 * @param promiseCallBack
 * @returns
 */
export function getField(
  record: MaybePromiseOrUndefined,
  field: FieldDef | FieldFormat | number,
  col: number,
  row: number,
  table: BaseTableAPI,
  promiseCallBack: PromiseBack
): FieldData {
  if (record === null || record === undefined) {
    return undefined;
  }
  if (isPromise(record)) {
    return record.then((r: any) => getField(r, field, col, row, table, promiseCallBack));
  }
  const fieldGet: any = isFieldAssessor(field) ? field.get : field;
  if (fieldGet in (record as any)) {
    const fieldResult = (record as any)[fieldGet];

    return getValue(fieldResult, promiseCallBack);
  }
  if (typeof fieldGet === 'function') {
    const fieldResult = fieldGet(record, col, row, table);
    return getValue(fieldResult, promiseCallBack);
  }
  if (Array.isArray(fieldGet)) {
    const fieldResult = getValueByPath(record, [...fieldGet]);
    return getValue(fieldResult, promiseCallBack);
  }
  const fieldArray = `${fieldGet}`.split('.');
  if (fieldArray.length <= 1) {
    const fieldResult = (record as any)[fieldGet];
    return getValue(fieldResult, promiseCallBack);
  }
  const fieldResult = applyChainSafe(
    record,
    (val, name) => getField(val, name, col, row, table, emptyFn as any),
    ...fieldArray
  );
  return getValue(fieldResult, promiseCallBack);
}

function _getIndex(sortedIndexMap: null | (number | number[])[], index: number): number | number[] {
  if (!sortedIndexMap) {
    return index;
  }
  const mapIndex = sortedIndexMap[index];
  return isValid(mapIndex) ? mapIndex : index;
}

export interface DataSourceParam {
  get: (index: number) => any;
  length: number;
  /** 需要异步加载的情况 请不要设置records */
  records?: any;
  added?: (index: number, count: number) => any;
  deleted?: (index: number[]) => any;
}
export interface ISortedMapItem {
  asc?: (number | number[])[];
  desc?: (number | number[])[];
  normal?: (number | number[])[];
}

export class DataSource extends EventTarget implements DataSourceAPI {
  dataConfig: IListTableDataConfig;
  dataSourceObj: DataSourceParam | DataSource;
  private _get: (index: number | number[]) => any;
  /** 数据条目数 如果是树形结构的数据 则是第一层父节点的数量 */
  private _sourceLength: number;

  private _source: any[] | DataSourceParam | DataSource;
  /**
   * 缓存按字段进行排序的结果
   */
  protected sortedIndexMap: Map<FieldDef, ISortedMapItem>;
  /**
   * 记录最近一次排序规则 当展开树形结构的节点时需要用到
   */
  private lastOrder: SortOrder;
  private lastOrderFn: (a: any, b: any, order: string) => number;
  private lastOrderField: FieldDef;
  /** 每一行对应源数据的索引 */
  currentIndexedData: (number | number[])[] | null = [];
  protected userPagination: IPagination;
  protected pagination: IPagination;
  /** 当前页每一行对应源数据的索引 */
  _currentPagerIndexedData: (number | number[])[];
  // 当前是否为层级的树形结构 排序时判断该值确实是否继续进行子节点排序
  hierarchyExpandLevel: number = 0;
  static get EVENT_TYPE(): typeof EVENT_TYPE {
    return EVENT_TYPE;
  }
  hasHierarchyStateExpand: boolean = false;
  // treeDataHierarchyState: Map<number | string, HierarchyState> = new Map();
  beforeChangedRecordsMap: Record<number, any>[] = []; // TODO过滤后 或者排序后的对应关系

  // 注册聚合类型
  registedAggregators: {
    [key: string]: {
      new (config: {
        dimension: string | string[];
        formatFun?: any;
        isRecord?: boolean;
        aggregationFun?: Function;
      }): Aggregator;
    };
  } = {};
  rowHierarchyType: 'grid' | 'tree';
  // columns对应各个字段的聚合类对象
  fieldAggregators: Aggregator[] = [];
  layoutColumnObjects: ColumnData[] = [];
  lastFilterRules: FilterRules;
  constructor(
    dataSourceObj?: DataSourceParam,
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columnObjs?: ColumnData[],
    rowHierarchyType?: 'grid' | 'tree',
    hierarchyExpandLevel?: number
  ) {
    super();
    this.registerAggregators();
    this.dataSourceObj = dataSourceObj;
    this.dataConfig = dataConfig;
    this._get = dataSourceObj?.get;
    this.layoutColumnObjects = columnObjs;
    this._source = dataSourceObj?.records ? this.processRecords(dataSourceObj?.records) : dataSourceObj;
    this._sourceLength = this._source?.length || 0;
    this.sortedIndexMap = new Map<string, ISortedMapItem>();

    this._currentPagerIndexedData = [];
    this.userPagination = pagination;
    this.pagination = pagination || {
      totalCount: this._sourceLength,
      perPageCount: this._sourceLength,
      currentPage: 0
    };
    if (hierarchyExpandLevel >= 1) {
      this.hierarchyExpandLevel = hierarchyExpandLevel;
    }
    this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
    // 初始化currentIndexedData 正常未排序。设置其状态
    if (rowHierarchyType === 'tree') {
      this.initTreeHierarchyState();
    }
    this.rowHierarchyType = rowHierarchyType;
    this.updatePagerData();
  }
  initTreeHierarchyState() {
    // if (this.hierarchyExpandLevel) {
    this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
    // if (this.hierarchyExpandLevel > 1) {
    let nodeLength = this._sourceLength;
    for (let i = 0; i < nodeLength; i++) {
      const indexKey = this.currentIndexedData[i];
      const nodeData = this.getOriginalRecord(indexKey);
      const children = (nodeData as any).filteredChildren ?? (nodeData as any).children;
      if (children?.length > 0) {
        if (this.hierarchyExpandLevel > 1) {
          !nodeData.hierarchyState && (nodeData.hierarchyState = HierarchyState.expand);
        } else {
          !nodeData.hierarchyState && (nodeData.hierarchyState = HierarchyState.collapse);
        }
        this.hasHierarchyStateExpand = true;
        if (nodeData.hierarchyState === HierarchyState.collapse) {
          continue;
        }
        const childrenLength = this.initChildrenNodeHierarchy(indexKey, this.hierarchyExpandLevel, 2, nodeData);
        i += childrenLength;
        nodeLength += childrenLength;
      } else if ((nodeData as any).children === true) {
        !nodeData.hierarchyState && (nodeData.hierarchyState = HierarchyState.collapse);
      }
    }
    // }
    // }
  }

  //将聚合类型注册 收集到aggregators
  registerAggregator(type: string, aggregator: any) {
    this.registedAggregators[type] = aggregator;
  }
  //将聚合类型注册
  registerAggregators() {
    this.registerAggregator(AggregationType.RECORD, RecordAggregator);
    this.registerAggregator(AggregationType.SUM, SumAggregator);
    this.registerAggregator(AggregationType.COUNT, CountAggregator);
    this.registerAggregator(AggregationType.MAX, MaxAggregator);
    this.registerAggregator(AggregationType.MIN, MinAggregator);
    this.registerAggregator(AggregationType.AVG, AvgAggregator);
    this.registerAggregator(AggregationType.NONE, NoneAggregator);
    this.registerAggregator(AggregationType.CUSTOM, CustomAggregator);
  }
  _generateFieldAggragations() {
    const columnObjs = this.layoutColumnObjects;
    for (let i = 0; i < columnObjs?.length; i++) {
      columnObjs[i].aggregator = null; //重置聚合器 如更新了过滤条件都需要重新计算
      const field = columnObjs[i].field;
      const aggragation = columnObjs[i].aggregation;
      if (!aggragation) {
        continue;
      }
      if (Array.isArray(aggragation)) {
        for (let j = 0; j < aggragation.length; j++) {
          const item = aggragation[j];
          const aggregator = new this.registedAggregators[item.aggregationType]({
            dimension: field as string,
            formatFun: item.formatFun,
            isRecord: true,
            aggregationFun: (item as CustomAggregation).aggregationFun
          });
          this.fieldAggregators.push(aggregator);
          if (!columnObjs[i].aggregator) {
            columnObjs[i].aggregator = [];
          }
          columnObjs[i].aggregator.push(aggregator);
        }
      } else {
        const aggregator = new this.registedAggregators[aggragation.aggregationType]({
          dimension: field as string,
          formatFun: aggragation.formatFun,
          isRecord: true,
          aggregationFun: (aggragation as CustomAggregation).aggregationFun
        });
        this.fieldAggregators.push(aggregator);
        columnObjs[i].aggregator = aggregator;
      }
    }
  }
  processRecords(records: any[]) {
    this._generateFieldAggragations();
    const filteredRecords = [];
    const isHasAggregation = this.fieldAggregators.length >= 1;
    const isHasFilterRule = this.dataConfig?.filterRules?.length >= 1 || this.lastFilterRules?.length >= 1;
    if (isHasFilterRule || isHasAggregation) {
      for (let i = 0, len = records.length; i < len; i++) {
        const record = records[i];
        if (this.dataConfig?.filterRules?.length >= 1) {
          if (this.filterRecord(record)) {
            filteredRecords.push(record);
            if (this.rowHierarchyType === 'tree' && record.children) {
              record.filteredChildren = this.filteredChildren(record.children);
            }
            isHasAggregation && this.processRecord(record);
          }
        } else if (this.lastFilterRules?.length >= 1) {
          //上次做了过滤 本次做清除过滤规则的情况
          this.clearFilteredChildren(record);
          isHasAggregation && this.processRecord(record);
        } else if (isHasAggregation) {
          this.processRecord(record);
        }
      }
      if (this.dataConfig?.filterRules?.length >= 1) {
        return filteredRecords;
      }
    }
    return records;
  }

  filteredChildren(records: any[]) {
    const filteredRecords = [];
    for (let i = 0, len = records.length; i < len; i++) {
      const record = records[i];
      if (this.filterRecord(record)) {
        filteredRecords.push(record);
        if (record.children) {
          record.filteredChildren = this.filteredChildren(record.children);
        }
      }
    }
    return filteredRecords;
  }

  processRecord(record: any) {
    for (let i = 0; i < this.fieldAggregators.length; i++) {
      const aggregator = this.fieldAggregators[i];
      aggregator.push(record);
    }
  }
  /**
   * 初始化子节点的层次信息
   * @param indexKey 父节点的indexKey 即currentLevel-1的节点
   * @param hierarchyExpandLevel 需要展开层级数
   * @param currentLevel 当前要展开的是第几层
   * @param nodeData 父节点数据 即currentLevel-1的节点
   * @returns
   */
  initChildrenNodeHierarchy(
    indexKey: number | number[],
    // subNodeIndex:number,
    hierarchyExpandLevel: number,
    currentLevel: number,
    nodeData: any
  ): number {
    // if (currentLevel > hierarchyExpandLevel) {
    //   return 0;
    // }
    let childTotalLength = 0;
    const nodeLength = nodeData.filteredChildren ? nodeData.filteredChildren.length : nodeData.children?.length ?? 0;
    for (let j = 0; j < nodeLength; j++) {
      if (currentLevel <= hierarchyExpandLevel || nodeData.hierarchyState === HierarchyState.expand) {
        childTotalLength += 1;
      }
      const childNodeData = nodeData.filteredChildren ? nodeData.filteredChildren[j] : nodeData.children[j];
      const childIndexKey = Array.isArray(indexKey) ? indexKey.concat(j) : [indexKey, j];
      if (currentLevel <= hierarchyExpandLevel || nodeData.hierarchyState === HierarchyState.expand) {
        this.currentIndexedData.splice(
          this.currentIndexedData.indexOf(indexKey) + childTotalLength,
          // childTotalLength,
          0,
          childIndexKey
        );
      }
      if (
        childNodeData.filteredChildren ? childNodeData.filteredChildren.length > 0 : childNodeData.children?.length > 0
      ) {
        if (currentLevel < hierarchyExpandLevel || childNodeData.hierarchyState === HierarchyState.expand) {
          // this.treeDataHierarchyState.set(
          //   Array.isArray(childIndexKey) ? childIndexKey.join(',') : childIndexKey,
          //   HierarchyState.expand
          // );
          !childNodeData.hierarchyState && (childNodeData.hierarchyState = HierarchyState.expand);
          this.hasHierarchyStateExpand = true;
        } else {
          // this.treeDataHierarchyState.set(
          //   Array.isArray(childIndexKey) ? childIndexKey.join(',') : childIndexKey,
          //   HierarchyState.collapse
          // );
          !childNodeData.hierarchyState && (childNodeData.hierarchyState = HierarchyState.collapse);
        }
      }
      if (childNodeData.hierarchyState === HierarchyState.expand) {
        childTotalLength += this.initChildrenNodeHierarchy(
          childIndexKey,
          hierarchyExpandLevel,
          currentLevel + 1,
          childNodeData
        );
      }
    }
    return childTotalLength;
  }
  updatePagination(pagination?: IPagination): void {
    this.pagination = pagination || {
      totalCount: this._sourceLength,
      perPageCount: this._sourceLength,
      currentPage: 0
    };
    this.updatePagerData();
  }
  protected updatePagerData(): void {
    const { currentIndexedData } = this;
    const { perPageCount, currentPage } = this.pagination;
    const startIndex = perPageCount * (currentPage || 0);
    const endIndex = startIndex + perPageCount;
    this._currentPagerIndexedData.length = 0;
    if (currentIndexedData && currentIndexedData.length > 0) {
      // this._currentPagerIndexedData = currentIndexedData.slice(startIndex, endIndex);
      let firstLevelIndex = -1;
      for (let i = 0; i < currentIndexedData.length; i++) {
        //计算第一层父级节点数量
        if (
          (Array.isArray(currentIndexedData[i]) && (currentIndexedData[i] as Array<number>).length === 1) ||
          !Array.isArray(currentIndexedData[i])
        ) {
          firstLevelIndex++;
        }
        if (firstLevelIndex >= startIndex && firstLevelIndex < endIndex) {
          this._currentPagerIndexedData.push(currentIndexedData[i]);
        } else if (firstLevelIndex >= endIndex) {
          break;
        }
      }
    } else if (this._sourceLength > 0) {
      throw new Error(`currentIndexedData should has values!`);
    }
  }

  get records(): any[] {
    return Array.isArray(this._source) ? this._source : [];
  }

  get source(): any[] | DataSourceParam | DataSource {
    return this._source;
  }
  get(index: number): MaybePromiseOrUndefined {
    return this.getOriginalRecord(_getIndex(this.currentPagerIndexedData, index));
  }
  getRaw(index: number): MaybePromiseOrUndefined {
    return this.getRawRecord(_getIndex(this.currentPagerIndexedData, index) as number);
  }
  getIndexKey(index: number): number | number[] {
    return _getIndex(this.currentPagerIndexedData, index);
  }
  getTableIndex(colOrRow: number | number[]): number {
    if (Array.isArray(colOrRow)) {
      return this.currentPagerIndexedData.findIndex(value => arrayEqual(value, colOrRow));
    }
    return this.currentPagerIndexedData.findIndex(value => value === colOrRow);
  }
  /** 获取数据源中第index位置的field字段数据。传入col row是因为后面的format函数参数使用*/
  getField(
    index: number,
    field: FieldDef | FieldFormat | number,
    col: number,
    row: number,
    table: BaseTableAPI
  ): FieldData {
    return this.getOriginalField(_getIndex(this.currentPagerIndexedData, index), field, col, row, table);
  }

  getRawField(
    index: number,
    field: FieldDef | FieldFormat | number,
    col: number,
    row: number,
    table: BaseTableAPI
  ): FieldData {
    return this.getRawFieldData(_getIndex(this.currentPagerIndexedData, index) as number, field, col, row, table);
  }

  hasField(index: number, field: FieldDef): boolean {
    return this.hasOriginalField(_getIndex(this.currentPagerIndexedData, index), field);
  }
  /**
   * 获取第index条数据的展示收起状态
   * @param index
   * @returns
   */
  getHierarchyState(index: number): HierarchyState {
    // const indexed = this.getIndexKey(index);
    const record = this.getOriginalRecord(this.currentIndexedData[index]);
    return record?.hierarchyState ?? null;
    // return this.treeDataHierarchyState.get(Array.isArray(indexed) ? indexed.join(',') : indexed) ?? null;
  }
  /**
   * 展开或者收起数据index
   * @param index
   */
  toggleHierarchyState(index: number, bodyStartIndex: number, bodyEndIndex: number) {
    const oldIndexedData = this.currentIndexedData.slice(0);
    const indexed = this.getIndexKey(index);
    const state = this.getHierarchyState(index);
    const data = this.getOriginalRecord(indexed);

    this.clearSortedIndexMap();
    if (state === HierarchyState.collapse) {
      // 将节点状态置为expand
      // this.treeDataHierarchyState.set(Array.isArray(indexed) ? indexed.join(',') : indexed, HierarchyState.expand);
      data.hierarchyState = HierarchyState.expand;
      this.pushChildrenNode(indexed, HierarchyState.expand, data);
      this.hasHierarchyStateExpand = true;
    } else if (state === HierarchyState.expand) {
      // 记录状态变化影响的子节点行数
      let childrenLength = 0;
      /**
       * 当某个节点由展开变为折叠，需要计算出影响的节点数量 使用childrenLength来标记。同样需递归
       * @param indexKey
       * @param hierarchyState
       * @param nodeData
       * @returns
       */
      const computeChildrenNodeLength = (
        indexKey: number | number[],
        hierarchyState: HierarchyState,
        nodeData: any
      ) => {
        if (!hierarchyState || hierarchyState === HierarchyState.collapse || hierarchyState === HierarchyState.none) {
          return;
        }
        const children = nodeData.filteredChildren ? nodeData.filteredChildren : nodeData.children;
        if (children) {
          for (let i = 0; i < children.length; i++) {
            childrenLength += 1;
            const childIndex = Array.isArray(indexKey) ? indexKey.concat([i]) : [indexKey, i];

            computeChildrenNodeLength(
              childIndex,
              // this.treeDataHierarchyState.get(childIndex.join(',')),
              children[i].hierarchyState,
              children[i]
            );
          }
        }
      };
      computeChildrenNodeLength(indexed, state, data);

      this.currentIndexedData.splice(this.currentIndexedData.indexOf(indexed) + 1, childrenLength);
      // this.treeDataHierarchyState.set(Array.isArray(indexed) ? indexed.join(',') : indexed, HierarchyState.collapse);
      data.hierarchyState = HierarchyState.collapse;
    }
    // 变更了pagerConfig所以需要更新分页数据  TODO待定 因为只关注根节点的数量的话 可能不会影响到
    this.updatePagerData();
    const add = [];
    const remove = [];
    if (state === HierarchyState.collapse) {
      const addLength = this.currentIndexedData.length - oldIndexedData.length;
      for (let i = 0; i < addLength; i++) {
        add.push(index + i + 1);
      }
    } else if (state === HierarchyState.expand) {
      const removeLength = oldIndexedData.length - this.currentIndexedData.length;
      for (let i = 0; i < removeLength; i++) {
        remove.push(index + i + 1);
      }
    }
    // const newDiff = calculateArrayDiff(
    //   oldIndexedData.slice(bodyStartIndex, bodyEndIndex + 1),
    //   this.currentIndexedData.slice(bodyStartIndex, bodyEndIndex + 1),
    //   bodyStartIndex
    // );
    // // const oldDiff = diffCellIndices(oldIndexedData, this.currentIndexedData);

    // // return oldDiff;
    // return newDiff;
    return { add, remove };
  }
  /**
   * 某个节点状态由折叠变为展开，往this.currentIndexedData中插入展开后的新增节点，注意需要递归，因为展开节点下面的子节点也能是展开状态
   * @param recordRowIndex 要计算节点的行号（从body部分开始计算）
   * @param indexKey 需要判断节点的index
   * @param hierarchyState 当前节点状态
   * @param nodeData 当前节点数据 取children时用
   * @returns
   */
  pushChildrenNode(indexKey: number | number[], hierarchyState: HierarchyState, nodeData: any): number {
    if (!hierarchyState || hierarchyState === HierarchyState.collapse || hierarchyState === HierarchyState.none) {
      return 0;
    }
    let childrenLength = 0;
    const children = nodeData.filteredChildren ? nodeData.filteredChildren : nodeData.children;
    if (children) {
      const subNodeSortedIndexArray: Array<number> = Array.from({ length: children.length }, (_, i) => i);
      this.lastOrder &&
        this.lastOrder !== 'normal' &&
        this.lastOrderField &&
        sort.sort(
          index =>
            isValid(subNodeSortedIndexArray[index])
              ? subNodeSortedIndexArray[index]
              : (subNodeSortedIndexArray[index] = index),
          (index, rel) => {
            subNodeSortedIndexArray[index] = rel;
          },
          children.length,
          this.lastOrderFn,
          this.lastOrder,
          index =>
            this.getOriginalField(
              Array.isArray(indexKey) ? indexKey.concat([index]) : [indexKey, index],
              this.lastOrderField
            )
        );
      for (let i = 0; i < subNodeSortedIndexArray.length; i++) {
        childrenLength += 1;
        const childIndex = Array.isArray(indexKey)
          ? indexKey.concat([subNodeSortedIndexArray[i]])
          : [indexKey, subNodeSortedIndexArray[i]];
        this.currentIndexedData.splice(
          this.currentIndexedData.indexOf(indexKey) + childrenLength,
          // this.pagination.currentPage * this.pagination.perPageCount +
          // recordRowIndex +
          // childrenLength,
          0,
          childIndex
        );

        // const preChildState = this.treeDataHierarchyState.get(childIndex.join(','));
        const childData = this.getOriginalRecord(childIndex);
        if (!childData.hierarchyState && (childData.filteredChildren ?? childData.children)) {
          // this.treeDataHierarchyState.set(childIndex.join(','), HierarchyState.collapse);
          childData.hierarchyState = HierarchyState.collapse;
        }
        childrenLength += this.pushChildrenNode(
          childIndex,
          // this.treeDataHierarchyState.get(childIndex.join(',')),
          childData.hierarchyState,
          children[subNodeSortedIndexArray[i]]
        );
      }
    }
    return childrenLength;
  }
  changeFieldValue(
    value: FieldData,
    index: number,
    field: FieldDef,
    col?: number,
    row?: number,
    table?: BaseTableAPI
  ): FieldData {
    if (field === null) {
      return undefined;
    }
    if (index >= 0) {
      const dataIndex = this.getIndexKey(index) as number;

      if (!this.beforeChangedRecordsMap[dataIndex]) {
        const originRecord = this.getOriginalRecord(dataIndex);
        this.beforeChangedRecordsMap[dataIndex] = cloneDeep(originRecord) ?? {};
      }
      if (typeof field === 'string' || typeof field === 'number') {
        const beforeChangedValue = this.beforeChangedRecordsMap[dataIndex][field]; // this.getOriginalField(index, field, col, row, table);
        const record = this.getOriginalRecord(dataIndex);
        let formatValue = value;
        if (typeof beforeChangedValue === 'number' && isAllDigits(value)) {
          formatValue = parseFloat(value);
        }
        if (isPromise(record)) {
          record
            .then(record => {
              record[field] = formatValue;
            })
            .catch((err: Error) => {
              console.error('VTable Error:', err);
            });
        } else {
          if (record) {
            record[field] = formatValue;
          } else {
            this.records[dataIndex] = {};
            this.records[dataIndex][field] = formatValue;
          }
        }
      }
    }
    // return getField(record, field);
  }
  /**
   * 将数据record 替换到index位置处
   * @param record
   * @param index
   */
  setRecord(record: any, index: number) {
    let isAdd = true;
    if (this.dataConfig?.filterRules?.length >= 1) {
      if (this.filterRecord(record)) {
        if (this.rowHierarchyType === 'tree' && record.children) {
          record.filteredChildren = this.filteredChildren(record.children);
        }
      } else {
        isAdd = false;
      }
    }
    if (isAdd && Array.isArray(this.records)) {
      const indexed = this.getIndexKey(index);
      if (!Array.isArray(indexed)) {
        this.records.splice(indexed, 1, record);
      } else {
        // const c_node_index = (indexed as Array<any>)[indexed.length - 1];
        // const p_node = this.getOriginalRecord(indexed.slice(0, indexed.length - 1));
        // (p_node as any).children.splice(c_node_index, 1, record);
      }
    }
  }
  /**
   * 将单条数据record 添加到index位置处
   * @param record 被添加的单条数据
   * @param index 代表的数据源中的index
   */
  addRecord(record: any, index: number) {
    if (Array.isArray(this.records)) {
      this.records.splice(index, 0, record);
      this.adjustBeforeChangedRecordsMap(index, 1);
      this.currentIndexedData.push(this.currentIndexedData.length);
      this._sourceLength += 1;
      if (this.rowHierarchyType === 'tree') {
        this.initTreeHierarchyState();
      }
      if (this.userPagination) {
        //如果用户配置了分页
        this.pagination.totalCount = this._sourceLength;
        const { perPageCount, currentPage } = this.pagination;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        if (index < endIndex) {
          this.updatePagerData();
        }
      } else {
        this.pagination.perPageCount = this._sourceLength;
        this.pagination.totalCount = this._sourceLength;
        this.updatePagerData();
      }

      if ((this.dataSourceObj as DataSourceParam)?.added) {
        (this.dataSourceObj as DataSourceParam).added(index, 1);
      }
    }
  }
  /**
   * 将多条数据recordArr 依次添加到index位置处
   * @param recordArr
   * @param index 代表的数据源中的index
   */
  addRecords(recordArr: any, index: number) {
    if (Array.isArray(this.records)) {
      if (Array.isArray(recordArr)) {
        this.records.splice(index, 0, ...recordArr);
        this.adjustBeforeChangedRecordsMap(index, recordArr.length);
        for (let i = 0; i < recordArr.length; i++) {
          this.currentIndexedData.push(this.currentIndexedData.length);
        }
        this._sourceLength += recordArr.length;
      }

      if (this.userPagination) {
        //如果用户配置了分页
        this.pagination.totalCount = this._sourceLength;
        const { perPageCount, currentPage } = this.pagination;
        const startIndex = perPageCount * (currentPage || 0);
        const endIndex = startIndex + perPageCount;
        if (index < endIndex) {
          this.updatePagerData();
        }
      } else {
        this.pagination.perPageCount = this._sourceLength;
        this.pagination.totalCount = this._sourceLength;
        this.updatePagerData();
      }

      if ((this.dataSourceObj as DataSourceParam)?.added) {
        (this.dataSourceObj as DataSourceParam).added(index, recordArr.length);
      }
    }
  }

  /**
   * 将单条数据record 添加到index位置处
   * @param record 被添加的单条数据
   * @param index 代表的数据源中的index
   */
  addRecordForSorted(record: any) {
    if (Array.isArray(this.records)) {
      this.beforeChangedRecordsMap = []; // 排序情况下插入数据，很难将原index和插入新增再次排序后的新index做对应，所以这里之前先清除掉beforeChangedRecordsMap 不做维护
      this.records.push(record);
      this.currentIndexedData.push(this.currentIndexedData.length);
      this._sourceLength += 1;
      this.sortedIndexMap.clear();
      if (!this.userPagination) {
        this.pagination.perPageCount = this._sourceLength;
        this.pagination.totalCount = this._sourceLength;
      }
    }
  }
  /**
   * 将多条数据recordArr 依次添加到index位置处
   * @param recordArr
   * @param index 代表的数据源中的index
   */
  addRecordsForSorted(recordArr: any) {
    if (Array.isArray(this.records)) {
      this.beforeChangedRecordsMap = []; // 排序情况下插入数据，很难将原index和插入新增再次排序后的新index做对应，所以这里之前先清除掉beforeChangedRecordsMap 不做维护
      if (Array.isArray(recordArr)) {
        this.records.push(...recordArr);
        for (let i = 0; i < recordArr.length; i++) {
          this.currentIndexedData.push(this.currentIndexedData.length);
        }
        this._sourceLength += recordArr.length;
        this.sortedIndexMap.clear();
      }
      if (!this.userPagination) {
        this.pagination.perPageCount = this._sourceLength;
        this.pagination.totalCount = this._sourceLength;
      }
    }
  }

  adjustBeforeChangedRecordsMap(insertIndex: number, insertCount: number) {
    const length = this.beforeChangedRecordsMap.length;
    for (let key = length - 1; key >= insertIndex; key--) {
      const record = this.beforeChangedRecordsMap[key];
      delete this.beforeChangedRecordsMap[key];
      this.beforeChangedRecordsMap[key + insertCount] = record;
    }
  }
  /**
   * 删除多条数据recordIndexs
   */
  deleteRecords(recordIndexs: number[]) {
    if (Array.isArray(this.records)) {
      const realDeletedRecordIndexs = [];
      const recordIndexsMaxToMin = recordIndexs.sort((a, b) => b - a);
      for (let index = 0; index < recordIndexsMaxToMin.length; index++) {
        const recordIndex = recordIndexsMaxToMin[index];
        if (recordIndex >= this._sourceLength || recordIndex < 0) {
          continue;
        }
        delete this.beforeChangedRecordsMap[recordIndex];
        realDeletedRecordIndexs.push(recordIndex);
        this.records.splice(recordIndex, 1);
        this.currentIndexedData.pop();
        this._sourceLength -= 1;
      }
      if (this.userPagination) {
        // 如果用户配置了分页
        this.updatePagerData();
      } else {
        this.pagination.perPageCount = this._sourceLength;
        this.pagination.totalCount = this._sourceLength;
        this.updatePagerData();
      }
      if ((this.dataSourceObj as DataSourceParam)?.deleted) {
        (this.dataSourceObj as DataSourceParam).deleted(realDeletedRecordIndexs);
      }
      return realDeletedRecordIndexs;
    }
    return [];
  }
  /**
   * 删除多条数据recordIndexs
   */
  deleteRecordsForSorted(recordIndexs: number[]) {
    if (Array.isArray(this.records)) {
      const recordIndexsMaxToMin = recordIndexs.sort((a, b) => b - a);
      for (let index = 0; index < recordIndexsMaxToMin.length; index++) {
        const recordIndex = recordIndexsMaxToMin[index];
        if (recordIndex >= this._sourceLength || recordIndex < 0) {
          continue;
        }
        const rawIndex = this.currentIndexedData[recordIndex] as number;
        delete this.beforeChangedRecordsMap[rawIndex];
        this.records.splice(rawIndex, 1);
        this._sourceLength -= 1;
      }
      this.sortedIndexMap.clear();
      if (!this.userPagination) {
        this.pagination.perPageCount = this._sourceLength;
        this.pagination.totalCount = this._sourceLength;
      }
    }
  }

  /**
   * 修改多条数据recordIndexs
   */
  updateRecords(records: any[], recordIndexs: number[]) {
    const realDeletedRecordIndexs = [];
    for (let index = 0; index < recordIndexs.length; index++) {
      const recordIndex = recordIndexs[index];
      if (recordIndex >= this._sourceLength || recordIndex < 0) {
        continue;
      }
      delete this.beforeChangedRecordsMap[recordIndex];
      realDeletedRecordIndexs.push(recordIndex);
      this.records[recordIndex] = records[index];
    }
    if (this.userPagination) {
      // 如果用户配置了分页
      this.updatePagerData();
    }
    return realDeletedRecordIndexs;
  }

  /**
   * 删除多条数据recordIndexs
   */
  updateRecordsForSorted(records: any[], recordIndexs: number[]) {
    const realDeletedRecordIndexs: number[] = [];
    for (let index = 0; index < recordIndexs.length; index++) {
      const recordIndex = recordIndexs[index];
      if (recordIndex >= this._sourceLength || recordIndex < 0) {
        continue;
      }
      const rawIndex = this.currentIndexedData[recordIndex];
      if (typeof rawIndex !== 'number') {
        return;
      }
      delete this.beforeChangedRecordsMap[rawIndex];
      realDeletedRecordIndexs.push(recordIndex);
      this.records[rawIndex] = records[index];
    }
    this.sortedIndexMap.clear();
  }

  sort(
    field: FieldDef,
    order: SortOrder,
    orderFn: (v1: any, v2: any, order: SortOrder) => -1 | 0 | 1 = order !== 'desc'
      ? (v1: any, v2: any): -1 | 0 | 1 => (v1 === v2 ? 0 : v1 > v2 ? 1 : -1)
      : (v1: any, v2: any): -1 | 0 | 1 => (v1 === v2 ? 0 : v1 < v2 ? 1 : -1)
  ): void {
    this.lastOrderField = field;
    this.lastOrder = order;
    this.lastOrderFn = orderFn;
    let filedMap = this.sortedIndexMap.get(field);
    let orderedData;

    if (filedMap) {
      orderedData = filedMap[order];
      if (orderedData && orderedData.length > 0) {
        this.currentIndexedData = orderedData;
        this.updatePagerData();
        this.fireListeners(EVENT_TYPE.CHANGE_ORDER, null);
        return;
      }
    }
    const sortedIndexArray = [] as number[];
    if (order === 'normal') {
      for (let i = 0; i < this._sourceLength; i++) {
        sortedIndexArray[i] = i;
      }
    } else {
      sort.sort(
        index => (isValid(sortedIndexArray[index]) ? sortedIndexArray[index] : (sortedIndexArray[index] = index)),
        (index, rel) => {
          sortedIndexArray[index] = rel;
        },
        this._sourceLength,
        orderFn,
        order,
        index => this.getOriginalField(index, field)
      );
    }
    this.currentIndexedData = sortedIndexArray;

    if (this.hierarchyExpandLevel) {
      let nodeLength = sortedIndexArray.length;
      const t0 = window.performance.now();
      for (let i = 0; i < nodeLength; i++) {
        const record = this.getOriginalRecord(sortedIndexArray[i]);
        const subNodeLength = this.pushChildrenNode(
          sortedIndexArray[i],
          // this.treeDataHierarchyState.get(sortedIndexArray[i]),
          record.hierarchyState,
          this.getOriginalRecord(sortedIndexArray[i]) // ？sortedIndexArray 在这个过程中不是变化了吗 通过i取id还是对的吗？ 对哦！因为i和nodeLength都+subNodeLength 来动态调整过了！
        );
        nodeLength += subNodeLength;
        i += subNodeLength;
      }
    }
    if (!filedMap) {
      filedMap = { asc: [], desc: [], normal: [] };
      this.sortedIndexMap.set(field, filedMap);
    }
    filedMap[order] = sortedIndexArray;
    this.updatePagerData();
    this.fireListeners(EVENT_TYPE.CHANGE_ORDER, null);
  }

  setSortedIndexMap(field: FieldDef, filedMap: ISortedMapItem) {
    this.sortedIndexMap.set(field, filedMap);
  }

  private clearFilteredChildren(record: any) {
    record.filteredChildren = undefined;
    for (let i = 0; i < record.children?.length ?? 0; i++) {
      this.clearFilteredChildren(record.children[i]);
    }
  }
  private filterRecord(record: any) {
    let isReserved = true;
    for (let i = 0; i < this.dataConfig.filterRules?.length; i++) {
      const filterRule = this.dataConfig?.filterRules[i];
      if (filterRule.filterKey) {
        const filterValue = record[filterRule.filterKey];
        if (filterRule.filteredValues.indexOf(filterValue) === -1) {
          isReserved = false;
          break;
        }
      } else if (!filterRule.filterFunc?.(record)) {
        isReserved = false;
        break;
      }
    }
    return isReserved;
  }

  updateFilterRulesForSorted(filterRules?: FilterRules): void {
    this.lastFilterRules = this.dataConfig.filterRules;
    this.dataConfig.filterRules = filterRules;
    this._source = this.processRecords(this.dataSourceObj?.records ?? this.dataSourceObj);
    this._sourceLength = this._source?.length || 0;
    this.sortedIndexMap.clear();
    this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
    if (!this.userPagination) {
      this.pagination.perPageCount = this._sourceLength;
      this.pagination.totalCount = this._sourceLength;
    }
  }

  updateFilterRules(filterRules?: FilterRules): void {
    this.lastFilterRules = this.dataConfig.filterRules;
    this.dataConfig.filterRules = filterRules;
    this._source = this.processRecords(this.dataSourceObj?.records ?? this.dataSourceObj);
    this._sourceLength = this._source?.length || 0;
    // 初始化currentIndexedData 正常未排序。设置其状态
    this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
    if (this.userPagination) {
      // 如果用户配置了分页
      this.updatePagerData();
    } else {
      this.pagination.perPageCount = this._sourceLength;
      this.pagination.totalCount = this._sourceLength;
      if (this.rowHierarchyType === 'tree') {
        this.initTreeHierarchyState();
      }
      this.updatePagerData();
    }
  }
  /**
   * 当节点折叠或者展开时 将排序缓存清空（非当前排序规则的缓存）
   */
  clearSortedIndexMap() {
    if (this.lastOrderField && this.lastOrder) {
      this.sortedIndexMap.forEach((sortMap, key) => {
        if (key !== this.lastOrderField) {
          this.sortedIndexMap.delete(key);
        } else if (this.lastOrder === 'asc') {
          sortMap.desc = [];
          sortMap.normal = [];
        } else if (this.lastOrder === 'desc') {
          sortMap.asc = [];
          sortMap.normal = [];
        } else {
          sortMap.desc = [];
          sortMap.asc = [];
        }
      });
    }
  }
  get sourceLength(): number {
    return this._sourceLength;
  }
  set sourceLength(sourceLen: number) {
    if (this._sourceLength === sourceLen) {
      return;
    }
    this._sourceLength = sourceLen;
    this.fireListeners(EVENT_TYPE.SOURCE_LENGTH_UPDATE, this._sourceLength);
  }
  get length(): number {
    return this.currentPagerIndexedData.length;
  }
  get dataSource(): DataSource {
    return this;
  }
  get currentPagerIndexedData(): (number | number[])[] {
    if (this._currentPagerIndexedData.length > 0) {
      return this._currentPagerIndexedData;
    }
    return []; //this.currentIndexedData || [];
  }
  release(): void {
    super.release?.();
    this.lastFilterRules = null;
  }
  clearSortedMap() {
    this.currentIndexedData && (this.currentIndexedData.length = 0);
    this.currentIndexedData = null;
    this.sortedIndexMap.forEach(item => {
      item.asc && (item.asc.length = 0);
      item.desc && (item.desc.length = 0);
    });
    this.sortedIndexMap.clear();
  }
  clearCurrentIndexedData(): void {
    this.currentIndexedData = null;
    this.currentPagerIndexedData.length = 0;
  }
  protected getOriginalRecord(dataIndex: number | number[]): MaybePromiseOrUndefined {
    // if (this.dataConfig?.filterRules) {
    //   return (this.records as Array<any>)[dataIndex as number];
    // }
    let data;
    if (!this.dataSourceObj.records) {
      data = this._get(dataIndex);
    } else {
      if (Array.isArray(dataIndex)) {
        data = getValueFromDeepArray(this.records, dataIndex);
      } else {
        data = this.records[dataIndex];
      }
    }
    return getValue(data, (val: MaybePromiseOrUndefined) => {
      this.recordPromiseCallBack(dataIndex, val);
    });
  }
  protected getRawRecord(dataIndex: number): MaybePromiseOrUndefined {
    if (this.beforeChangedRecordsMap?.[dataIndex as number]) {
      return this.beforeChangedRecordsMap[dataIndex as number];
    }
    let data;
    if (!this.dataSourceObj.records) {
      data = this._get(dataIndex);
    } else {
      if (Array.isArray(dataIndex)) {
        data = getValueFromDeepArray(this.records, dataIndex);
      } else {
        data = this.records[dataIndex];
      }
    }
    return getValue(data, (val: MaybePromiseOrUndefined) => {
      this.recordPromiseCallBack(dataIndex, val);
    });
  }
  protected getOriginalField(
    index: number | number[],
    field: FieldDef | FieldFormat | number,
    col?: number,
    row?: number,
    table?: BaseTableAPI
  ): FieldData {
    if (field === null) {
      return undefined;
    }
    const record = this.getOriginalRecord(index);
    // return getField(record, field);
    return getField(record, field, col, row, table, (val: any) => {
      this.fieldPromiseCallBack(index, field, val);
    });
  }
  protected getRawFieldData(
    index: number,
    field: FieldDef | FieldFormat | number,
    col?: number,
    row?: number,
    table?: BaseTableAPI
  ): FieldData {
    if (field === null) {
      return undefined;
    }
    const record = this.getRawRecord(index);
    // return getField(record, field);
    return getField(record, field, col, row, table, (val: any) => {
      this.fieldPromiseCallBack(index, field, val);
    });
  }
  protected hasOriginalField(index: number | number[], field: FieldDef): boolean {
    if (field === null) {
      return false;
    }
    if (typeof field === 'function') {
      return true;
    }
    const record = this.getOriginalRecord(index);
    return Boolean(record && (field as any) in (record as any));
  }

  protected fieldPromiseCallBack(
    _index: number | number[],
    _field: FieldDef | FieldFormat | number,
    _value: MaybePromiseOrUndefined
  ): void {
    //
  }
  protected recordPromiseCallBack(_index: number | number[], _record: MaybePromiseOrUndefined): void {
    //
  }
  /** 静态变量  代表数据为空 */
  static EMPTY = new DataSource({
    get() {
      /* noop */
    },
    length: 0
  });
  isCanExchangeOrder(sourceIndex: number, targetIndex: number) {
    // if (this.treeDataHierarchyState?.size > 0) {
    if (this.hasHierarchyStateExpand) {
      let sourceIndexs = this.currentPagerIndexedData[sourceIndex] as number[];
      let targetIndexs = this.currentPagerIndexedData[targetIndex] as number[];
      if (Array.isArray(sourceIndexs)) {
        sourceIndexs = [...sourceIndexs];
      } else {
        sourceIndexs = [sourceIndexs];
      }

      if (Array.isArray(targetIndexs)) {
        targetIndexs = [...targetIndexs];
      } else {
        targetIndexs = [targetIndexs];
      }

      if (targetIndex > sourceIndex) {
        if (targetIndexs.length > sourceIndexs.length) {
          let targetNextIndexs = this.currentPagerIndexedData[targetIndex + 1] as number[];
          if (Array.isArray(targetNextIndexs)) {
            targetNextIndexs = [...targetNextIndexs];
          } else {
            targetNextIndexs = [targetNextIndexs];
          }

          if (targetNextIndexs.length < targetIndexs.length) {
            targetIndexs.splice(targetIndexs.length - 1, 1);
          }
        }
      }
      if (sourceIndexs.length === targetIndexs.length) {
        for (let i = 0; i <= sourceIndexs.length - 2; i++) {
          if (sourceIndexs[i] !== targetIndexs[i]) {
            return false;
          }
        }
        return true;
      }

      return false;
    }
    return true;
  }
  // 拖拽调整数据位置 目前对排序过的数据不过处理，因为自动排序和手动排序融合问题目前没有找到好的解决方式
  reorderRecord(sourceIndex: number, targetIndex: number) {
    if (this.lastOrder === 'asc' || this.lastOrder === 'desc') {
      // const sourceIds = this._currentPagerIndexedData.splice(sourceIndex, 1);
      // sourceIds.unshift(targetIndex, 0);
      // Array.prototype.splice.apply(this._currentPagerIndexedData, sourceIds);
      return;
    } else if (this.isCanExchangeOrder(sourceIndex, targetIndex)) {
      // if (this.treeDataHierarchyState?.size > 0) {
      if (this.hasHierarchyStateExpand) {
        let sourceIndexs = this.currentPagerIndexedData[sourceIndex];
        let targetIndexs = this.currentPagerIndexedData[targetIndex];
        if (Array.isArray(sourceIndexs)) {
          sourceIndexs = [...sourceIndexs];
        } else {
          sourceIndexs = [sourceIndexs];
        }

        if (Array.isArray(targetIndexs)) {
          targetIndexs = [...targetIndexs];
        } else {
          targetIndexs = [targetIndexs];
        }

        let sourceI;
        let targetI;
        if (sourceIndexs.length > 1 || targetIndexs.length > 1) {
          if (targetIndex > sourceIndex) {
            if (targetIndexs.length > sourceIndexs.length) {
              let targetNextIndexs = this.currentPagerIndexedData[targetIndex + 1] as number[];
              if (Array.isArray(targetNextIndexs)) {
                targetNextIndexs = [...targetNextIndexs];
              } else {
                targetNextIndexs = [targetNextIndexs];
              }

              if (targetNextIndexs.length < targetIndexs.length) {
                targetIndexs.splice(targetIndexs.length - 1, 1);
              }
            }
          }
          sourceI = (<number[]>sourceIndexs).splice(sourceIndexs.length - 1, 1)[0];
          targetI = (<number[]>targetIndexs).splice(targetIndexs.length - 1, 1)[0];
          if (sourceIndexs.length >= 1) {
            const parent = this.getOriginalRecord(sourceIndexs);
            const sourceIds = parent.filteredChildren
              ? parent.filteredChildren.splice(sourceI, 1)
              : parent.children.splice(sourceI, 1);
            sourceIds.unshift(targetI, 0);
            Array.prototype.splice.apply(parent.filteredChildren ?? parent.children, sourceIds);
          } else {
            const sourceIds = this.records.splice(sourceI, 1);
            // 将records插入到目标地址targetIndex处
            // 把records变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入到source数组
            sourceIds.unshift(targetI, 0);
            Array.prototype.splice.apply(this.records, sourceIds);
          }
        } else {
          sourceI = this.currentPagerIndexedData[sourceIndex] as number;
          targetI = this.currentPagerIndexedData[targetIndex];
          // 从source的二维数组中取出需要操作的records
          const records = this.records.splice(sourceI, 1);
          // 将records插入到目标地址targetIndex处
          // 把records变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入到source数组
          records.unshift(targetI, 0);
          Array.prototype.splice.apply(this.records, records);
        }
        this.restoreTreeHierarchyState();
        this.updatePagerData();
      } else {
        // 从source的二维数组中取出需要操作的records
        const records = this.records.splice(sourceIndex, 1);
        // 将records插入到目标地址targetIndex处
        // 把records变成一个适合splice的数组（包含splice前2个参数的数组） 以通过splice来插入到source数组
        records.unshift(targetIndex, 0);
        Array.prototype.splice.apply(this.records, records);
      }
    }
  }

  restoreTreeHierarchyState() {
    if (this.hierarchyExpandLevel) {
      for (let i = 0; i < this._sourceLength; i++) {
        //expandLevel为有效值即需要按tree分析展示数据
        const nodeData = this.getOriginalRecord(i);
        const children = (nodeData as any).filteredChildren ?? (nodeData as any).children;
        children && !nodeData.hierarchyState && (nodeData.hierarchyState = HierarchyState.collapse);
      }

      this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
      let nodeLength = this._sourceLength;
      for (let i = 0; i < nodeLength; i++) {
        const indexKey = this.currentIndexedData[i];
        const nodeData = this.getOriginalRecord(indexKey);
        const children = (nodeData as any).filteredChildren ?? (nodeData as any).children;
        if (children?.length > 0 && nodeData.hierarchyState === HierarchyState.expand) {
          this.hasHierarchyStateExpand = true;
          const childrenLength = this.restoreChildrenNodeHierarchy(indexKey, nodeData);
          i += childrenLength;
          nodeLength += childrenLength;
        } else if ((nodeData as any).children === true) {
          !nodeData.hierarchyState && (nodeData.hierarchyState = HierarchyState.collapse);
        }
      }
    }
  }
  restoreChildrenNodeHierarchy(
    indexKey: number | number[],

    nodeData: any
  ): number {
    let childTotalLength = 0;
    const children = (nodeData as any).filteredChildren ?? (nodeData as any).children;
    const nodeLength = children?.length ?? 0;
    for (let j = 0; j < nodeLength; j++) {
      if (nodeData.hierarchyState === HierarchyState.expand) {
        childTotalLength += 1;
      }
      const childNodeData = children[j];
      const childIndexKey = Array.isArray(indexKey) ? indexKey.concat(j) : [indexKey, j];
      if (nodeData.hierarchyState === HierarchyState.expand) {
        this.currentIndexedData.splice(
          this.currentIndexedData.indexOf(indexKey) + childTotalLength,
          // childTotalLength,
          0,
          childIndexKey
        );
      }
      childTotalLength += this.restoreChildrenNodeHierarchy(
        childIndexKey,

        childNodeData
      );
    }
    return childTotalLength;
  }
}

/**
 * 从数组array中获取index的值
 * 如：给index=[0,0] 则返回 array[0].children[0]；如果给index=[2] 则返回array[2]； 如果给index=[3,0,4] 则返回array[3].children[0].children[4]
 * @param array
 * @param index
 * @returns
 */
function getValueFromDeepArray(array: any, index: number[]) {
  let result = array;
  for (let i = 0; i < index.length; i++) {
    const currentIdx = index[i];
    if (result[currentIdx]) {
      result = result[currentIdx];
    } else {
      return undefined;
    }
    const children = result.filteredChildren ?? result?.children;
    if (children && i + 1 < index.length) {
      result = children;
    }
  }
  return result;
}
