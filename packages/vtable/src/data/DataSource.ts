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
  source?: any;
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

  private _source: any;
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
  treeDataHierarchyState: Map<number | string, HierarchyState> = new Map();
  beforeChangedRecordsMap: Record<number, any>[] = [];

  // 注册聚合类型
  registedAggregators: {
    [key: string]: {
      new (dimension: string | string[], formatFun?: any, isRecord?: boolean, aggregationFun?: Function): Aggregator;
    };
  } = {};
  // columns对应各个字段的聚合类对象
  fieldAggregators: Aggregator[] = [];
  layoutColumnObjects: ColumnData[] = [];
  constructor(
    dataSourceObj?: DataSourceParam | DataSource,
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columnObjs?: ColumnData[],
    hierarchyExpandLevel?: number
  ) {
    super();
    this.registerAggregators();
    this.dataSourceObj = dataSourceObj;
    this.dataConfig = dataConfig;
    this._get = dataSourceObj?.get.bind(dataSourceObj) || (undefined as any);
    this.layoutColumnObjects = columnObjs;
    this._source = this.processRecords(dataSourceObj?.source ?? dataSourceObj);
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
    this.initTreeHierarchyState();
    this.updatePagerData();
  }
  initTreeHierarchyState() {
    if (this.hierarchyExpandLevel) {
      this.treeDataHierarchyState = new Map();
      for (let i = 0; i < this._sourceLength; i++) {
        //expandLevel为有效值即需要按tree分析展示数据
        const nodeData = this.getOriginalRecord(i);
        (nodeData as any).children && this.treeDataHierarchyState.set(i, HierarchyState.collapse);
      }

      this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
      if (this.hierarchyExpandLevel > 1) {
        let nodeLength = this._sourceLength;
        for (let i = 0; i < nodeLength; i++) {
          const indexKey = this.currentIndexedData[i];
          const nodeData = this.getOriginalRecord(indexKey);
          if ((nodeData as any).children?.length > 0) {
            this.treeDataHierarchyState.set(
              Array.isArray(indexKey) ? indexKey.join(',') : indexKey,
              HierarchyState.expand
            );
            const childrenLength = this.initChildrenNodeHierarchy(indexKey, this.hierarchyExpandLevel, 2, nodeData);
            i += childrenLength;
            nodeLength += childrenLength;
          }
        }
      }
    }
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
          const aggregator = new this.registedAggregators[item.aggregationType](
            field as string,
            item.formatFun,
            true,
            (item as CustomAggregation).aggregationFun
          );
          this.fieldAggregators.push(aggregator);
          if (!columnObjs[i].aggregator) {
            columnObjs[i].aggregator = [];
          }
          columnObjs[i].aggregator.push(aggregator);
        }
      } else {
        const aggregator = new this.registedAggregators[aggragation.aggregationType](
          field as string,
          aggragation.formatFun,
          true,
          (aggragation as CustomAggregation).aggregationFun
        );
        this.fieldAggregators.push(aggregator);
        columnObjs[i].aggregator = aggregator;
      }
    }
  }
  processRecords(records: any[]) {
    this._generateFieldAggragations();
    const filteredRecords = [];
    const isHasAggregation = this.fieldAggregators.length >= 1;
    const isHasFilterRule = this.dataConfig?.filterRules?.length >= 1;
    if (isHasFilterRule || isHasAggregation) {
      for (let i = 0, len = records.length; i < len; i++) {
        const record = records[i];
        if (isHasFilterRule) {
          if (this.filterRecord(record)) {
            filteredRecords.push(record);
            isHasAggregation && this.processRecord(record);
          }
        } else if (isHasAggregation) {
          this.processRecord(record);
        }
      }
      if (isHasFilterRule) {
        return filteredRecords;
      }
    }
    return records;
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
    if (currentLevel > hierarchyExpandLevel) {
      return 0;
    }
    let childTotalLength = 0;
    const nodeLength = nodeData.children?.length ?? 0;
    for (let j = 0; j < nodeLength; j++) {
      childTotalLength += 1;
      const childNodeData = nodeData.children[j];
      const childIndexKey = Array.isArray(indexKey) ? indexKey.concat(j) : [indexKey, j];
      this.currentIndexedData.splice(
        this.currentIndexedData.indexOf(indexKey) + childTotalLength,
        // childTotalLength,
        0,
        childIndexKey
      );
      if (childNodeData.children?.length > 0) {
        if (currentLevel < hierarchyExpandLevel) {
          this.treeDataHierarchyState.set(
            Array.isArray(childIndexKey) ? childIndexKey.join(',') : childIndexKey,
            HierarchyState.expand
          );
        } else {
          this.treeDataHierarchyState.set(
            Array.isArray(childIndexKey) ? childIndexKey.join(',') : childIndexKey,
            HierarchyState.collapse
          );
        }
      }

      childTotalLength += this.initChildrenNodeHierarchy(
        childIndexKey,
        hierarchyExpandLevel,
        currentLevel + 1,
        childNodeData
      );
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

  get source(): any {
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
    const indexed = this.getIndexKey(index);
    return this.treeDataHierarchyState.get(Array.isArray(indexed) ? indexed.join(',') : indexed) ?? null;
  }
  /**
   * 展开或者收起数据index
   * @param index
   */
  toggleHierarchyState(index: number) {
    const oldIndexedData = this.currentIndexedData.slice(0);
    const indexed = this.getIndexKey(index);
    const state = this.getHierarchyState(index);
    const data = this.getOriginalRecord(indexed);

    this.clearSortedIndexMap();
    if (state === HierarchyState.collapse) {
      // 将节点状态置为expand
      this.treeDataHierarchyState.set(Array.isArray(indexed) ? indexed.join(',') : indexed, HierarchyState.expand);
      this.pushChildrenNode(indexed, HierarchyState.expand, data);
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
        if (nodeData.children) {
          for (let i = 0; i < nodeData.children.length; i++) {
            childrenLength += 1;
            const childIndex = Array.isArray(indexKey) ? indexKey.concat([i]) : [indexKey, i];

            computeChildrenNodeLength(
              childIndex,
              this.treeDataHierarchyState.get(childIndex.join(',')),
              nodeData.children[i]
            );
          }
        }
      };
      computeChildrenNodeLength(indexed, state, data);

      this.currentIndexedData.splice(this.currentIndexedData.indexOf(indexed) + 1, childrenLength);
      this.treeDataHierarchyState.set(Array.isArray(indexed) ? indexed.join(',') : indexed, HierarchyState.collapse);
    }
    // 变更了pagerConfig所以需要更新分页数据  TODO待定 因为只关注根节点的数量的话 可能不会影响到
    this.updatePagerData();

    const newDiff = calculateArrayDiff(oldIndexedData, this.currentIndexedData);
    // const oldDiff = diffCellIndices(oldIndexedData, this.currentIndexedData);

    // return oldDiff;
    return newDiff;
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
    if (nodeData.children) {
      const subNodeSortedIndexArray: Array<number> = Array.from({ length: nodeData.children.length }, (_, i) => i);
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
          nodeData.children.length,
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
        const preChildState = this.treeDataHierarchyState.get(childIndex.join(','));
        const childData = this.getOriginalRecord(childIndex);
        if (!preChildState && (childData as any).children) {
          this.treeDataHierarchyState.set(childIndex.join(','), HierarchyState.collapse);
        }
        childrenLength += this.pushChildrenNode(
          childIndex,
          this.treeDataHierarchyState.get(childIndex.join(',')),
          nodeData.children[subNodeSortedIndexArray[i]]
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
        this.beforeChangedRecordsMap[dataIndex] = cloneDeep(originRecord);
      }
      if (typeof field === 'string' || typeof field === 'number') {
        const beforeChangedValue = this.beforeChangedRecordsMap[dataIndex][field]; // this.getOriginalField(index, field, col, row, table);
        const record = this.getOriginalRecord(dataIndex);
        if (typeof beforeChangedValue === 'number' && isAllDigits(value)) {
          record[field] = parseFloat(value);
        } else {
          record[field] = value;
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
    const indexed = this.getIndexKey(index);
    if (!Array.isArray(indexed)) {
      this.source.splice(indexed, 1, record);
    } else {
      const c_node_index = (indexed as Array<any>)[indexed.length - 1];
      const p_node = this.getOriginalRecord(indexed.slice(0, indexed.length - 1));
      (p_node as any).children.splice(c_node_index, 1, record);
    }
  }
  /**
   * 将单条数据record 添加到index位置处
   * @param record 被添加的单条数据
   * @param index 代表的数据源中的index
   */
  addRecord(record: any, index: number) {
    this.source.splice(index, 0, record);
    this.currentIndexedData.push(this.currentIndexedData.length);
    this._sourceLength += 1;
    this.initTreeHierarchyState();
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
  }
  /**
   * 将多条数据recordArr 依次添加到index位置处
   * @param recordArr
   * @param index 代表的数据源中的index
   */
  addRecords(recordArr: any, index: number) {
    if (Array.isArray(recordArr)) {
      this.source.splice(index, 0, ...recordArr);
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
  }

  /**
   * 将单条数据record 添加到index位置处
   * @param record 被添加的单条数据
   * @param index 代表的数据源中的index
   */
  addRecordForSorted(record: any) {
    this.source.push(record);
    this.currentIndexedData.push(this.currentIndexedData.length);
    this._sourceLength += 1;
    this.sortedIndexMap.clear();
    if (!this.userPagination) {
      this.pagination.perPageCount = this._sourceLength;
      this.pagination.totalCount = this._sourceLength;
    }
  }
  /**
   * 将多条数据recordArr 依次添加到index位置处
   * @param recordArr
   * @param index 代表的数据源中的index
   */
  addRecordsForSorted(recordArr: any) {
    if (Array.isArray(recordArr)) {
      this.source.push(...recordArr);
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

  /**
   * 删除多条数据recordIndexs
   */
  deleteRecords(recordIndexs: number[]) {
    const realDeletedRecordIndexs = [];
    const recordIndexsMaxToMin = recordIndexs.sort((a, b) => b - a);
    for (let index = 0; index < recordIndexsMaxToMin.length; index++) {
      const recordIndex = recordIndexsMaxToMin[index];
      if (recordIndex >= this._sourceLength || recordIndex < 0) {
        continue;
      }
      realDeletedRecordIndexs.push(recordIndex);
      this.source.splice(recordIndex, 1);
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
    return realDeletedRecordIndexs;
  }
  /**
   * 删除多条数据recordIndexs
   */
  deleteRecordsForSorted(recordIndexs: number[]) {
    const recordIndexsMaxToMin = recordIndexs.sort((a, b) => b - a);
    for (let index = 0; index < recordIndexsMaxToMin.length; index++) {
      const recordIndex = recordIndexsMaxToMin[index];
      if (recordIndex >= this._sourceLength || recordIndex < 0) {
        continue;
      }
      const rawIndex = this.currentIndexedData[recordIndex];
      this.source.splice(rawIndex, 1);
      this._sourceLength -= 1;
    }
    this.sortedIndexMap.clear();
    if (!this.userPagination) {
      this.pagination.perPageCount = this._sourceLength;
      this.pagination.totalCount = this._sourceLength;
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
      realDeletedRecordIndexs.push(recordIndex);
      this.source[recordIndex] = records[index];
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
      realDeletedRecordIndexs.push(recordIndex);
      this.source[rawIndex] = records[index];
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
        const subNodeLength = this.pushChildrenNode(
          sortedIndexArray[i],
          this.treeDataHierarchyState.get(sortedIndexArray[i]),
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

  private filterRecord(record: any) {
    let isReserved = true;
    for (let i = 0; i < this.dataConfig.filterRules.length; i++) {
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
    this.dataConfig.filterRules = filterRules;
    this._source = this.processRecords(this.dataSourceObj?.source ?? this.dataSourceObj);
    this._sourceLength = this._source?.length || 0;
    this.sortedIndexMap.clear();
    this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
    if (!this.userPagination) {
      this.pagination.perPageCount = this._sourceLength;
      this.pagination.totalCount = this._sourceLength;
    }
  }

  updateFilterRules(filterRules?: FilterRules): void {
    this.dataConfig.filterRules = filterRules;
    this._source = this.processRecords(this.dataSourceObj?.source ?? this.dataSourceObj);
    this._sourceLength = this._source?.length || 0;
    // 初始化currentIndexedData 正常未排序。设置其状态
    this.currentIndexedData = Array.from({ length: this._sourceLength }, (_, i) => i);
    if (this.userPagination) {
      // 如果用户配置了分页
      this.updatePagerData();
    } else {
      this.pagination.perPageCount = this._sourceLength;
      this.pagination.totalCount = this._sourceLength;
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
    if (this.dataConfig?.filterRules) {
      return (this.source as Array<any>)[dataIndex as number];
    }
    return getValue(this._get(dataIndex), (val: MaybePromiseOrUndefined) => {
      this.recordPromiseCallBack(dataIndex, val);
    });
  }
  protected getRawRecord(dataIndex: number): MaybePromiseOrUndefined {
    if (this.beforeChangedRecordsMap?.[dataIndex as number]) {
      return this.beforeChangedRecordsMap[dataIndex as number];
    }
    return getValue(this._get(dataIndex), (val: MaybePromiseOrUndefined) => {
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
}
