import { isArray, isNumber, isValid } from '@visactor/vutils';
import type { ListTableConstructorOptions } from '../ts-types';
import {
  AggregationType,
  HierarchyState,
  type FieldData,
  type FieldDef,
  type IListTableDataConfig,
  type IPagination,
  type MaybePromise,
  type MaybePromiseOrUndefined
} from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';
import type { ColumnData, ColumnsDefine } from '../ts-types/list-table/layout-map/api';
import type { DataSourceParam } from './DataSource';
import { DataSource, sortRecordIndexs } from './DataSource';
import get from 'lodash/get';

/** @private */
function _setFieldCache(
  fCache: { [index: number]: Map<FieldDef, any> },
  index: number,
  field: FieldDef,

  value: any
): void {
  const recCache = fCache[index] || (fCache[index] = new Map());
  recCache.set(field, value);
}
/**
 * table data source for caching Promise data
 *
 * @classdesc VTable.data.CachedDataSource
 * @memberof VTable.data
 */
export class CachedDataSource extends DataSource {
  /**
   * record cache 当用户定义的CachedDataSource.get为promise的时候 可以用rCache缓存已获取数据条目
   */
  private _recordCache: any[];
  /**
   * field cache 当用户定义field为promise的时候 可以用fCache缓存已获取值
   */
  private _fieldCache: { [index: number]: Map<FieldDef, any> };

  groupAggregator: any;

  static get EVENT_TYPE(): typeof DataSource.EVENT_TYPE {
    return DataSource.EVENT_TYPE;
  }
  static ofArray(
    array: any[],
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columns?: ColumnsDefine,
    rowHierarchyType?: 'grid' | 'tree',
    hierarchyExpandLevel?: number
  ): CachedDataSource {
    return new CachedDataSource(
      {
        get: (index: number): any => {
          // if (Array.isArray(index)) {
          //   return getValueFromDeepArray(array, index);
          // }
          return array[index];
        },
        length: array.length,
        records: array
      },
      dataConfig,
      pagination,
      columns,
      rowHierarchyType,
      hierarchyExpandLevel
    );
  }

  // _originalRecords: any[];
  constructor(
    opt?: DataSourceParam,
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columns?: ColumnsDefine,
    rowHierarchyType?: 'grid' | 'tree',
    hierarchyExpandLevel?: number
  ) {
    if (isArray(dataConfig?.groupByRules)) {
      rowHierarchyType = 'tree';
    }
    super(opt, dataConfig, pagination, columns, rowHierarchyType, hierarchyExpandLevel);
    this._recordCache = [];
    this._fieldCache = {};
  }
  protected getOriginalRecord(index: number | number[]): MaybePromiseOrUndefined {
    if (isNumber(index) && this._recordCache && this._recordCache[index]) {
      return this._recordCache[index];
    }
    return super.getOriginalRecord(index);
  }
  protected getRawRecord(index: number | number[]): MaybePromiseOrUndefined {
    if (this.beforeChangedRecordsMap?.has(index.toString())) {
      return this.beforeChangedRecordsMap?.get(index.toString());
    }
    if (isNumber(index) && this._recordCache && this._recordCache[index]) {
      return this._recordCache[index];
    }
    return super.getRawRecord(index);
  }
  protected getOriginalField<F extends FieldDef>(
    index: number,
    field: F,
    col?: number,
    row?: number,
    table?: BaseTableAPI
  ): FieldData {
    const rowCache = this._fieldCache && this._fieldCache[index];
    if (rowCache) {
      const cache = rowCache.get(field);
      if (cache) {
        return cache;
      }
    }
    return super.getOriginalField(index, field, col, row, table);
  }

  clearCache(): void {
    if (this._recordCache) {
      this._recordCache = [];
    }
    if (this._fieldCache) {
      this._fieldCache = {};
    }
  }

  protected fieldPromiseCallBack<F extends FieldDef>(index: number, field: F, value: MaybePromiseOrUndefined): void {
    _setFieldCache(this._fieldCache, index, field, value);
  }
  protected recordPromiseCallBack(index: number, record: MaybePromiseOrUndefined): void {
    this._recordCache && (this._recordCache[index] = record);
  }
  get records(): any[] {
    return Array.isArray(this._recordCache) && this._recordCache.length > 0 ? this._recordCache : super.records;
  }

  release(): void {
    super.release?.();
    this._recordCache = null;
    this._fieldCache = null;
  }

  _generateFieldAggragations() {
    super._generateFieldAggragations();
    // groupby aggragations
    if (isArray(this.dataConfig?.groupByRules)) {
      // const groupByKey = this.dataConfig.groupByRules[0];
      const groupByKeys = this.dataConfig.groupByRules;
      this.groupAggregator = new this.registedAggregators[AggregationType.CUSTOM]({
        field: '',
        aggregationFun: (values: any, records: any, field: any) => {
          const groupMap = new Map();
          const groupResult = [] as any[];
          for (let i = 0; i < records.length; i++) {
            dealWithGroup(records[i], groupResult, groupMap, groupByKeys, 0);
            records[i].vtableOriginIndex = i;
          }
          return groupResult;
        }
      });
      this.fieldAggregators.push(this.groupAggregator);
    }
  }

  processRecords(records: any[]) {
    const result = super.processRecords(records);
    const groupResult = this.groupAggregator?.value();
    if (groupResult) {
      // this._originalRecords = result;
      return groupResult;
    }
    return result;
  }

  getGroupLength() {
    return this.dataConfig?.groupByRules?.length ?? 0;
  }

  updateGroup() {
    this.clearCache();

    const oldSource = this.source;
    (this as any)._source = this.processRecords(this.dataSourceObj?.records ?? this.dataSourceObj);
    if (oldSource) {
      syncGroupCollapseState(oldSource, this.source);
    }

    // syncGroupCollapseState(this.source, newSource.source);
    this.sourceLength = this.source?.length || 0;
    this.sortedIndexMap.clear();
    this.currentIndexedData = Array.from({ length: this.sourceLength }, (_, i) => i);
    if (!this.userPagination) {
      this.pagination.perPageCount = this.sourceLength;
      this.pagination.totalCount = this.sourceLength;
    }

    this.initTreeHierarchyState();
    this.updatePagerData();
  }

  getOriginRecordIndexForGroup(recordIndex: number | number[]) {
    const targetRecord = this.getOriginalRecord(recordIndex);
    for (let i = 0; i < this.dataSourceObj.records.length; i++) {
      if (this.dataSourceObj.records[i] === targetRecord) {
        return i;
      }
    }
    return undefined;
  }

  addRecordsForGroup(recordArr: any[], recordIndex?: number | number[]) {
    if (!isArray(recordArr) || recordArr.length === 0) {
      return;
    }
    let originRecordIndex = this.getOriginRecordIndexForGroup(recordIndex);

    if (originRecordIndex === undefined || originRecordIndex > this.dataSourceObj.records) {
      originRecordIndex = this.dataSourceObj.records.length;
    }
    this.dataSourceObj.records.splice(originRecordIndex, 0, ...recordArr);

    this.adjustBeforeChangedRecordsMap(originRecordIndex, recordArr.length);

    this.updateGroup();
  }

  deleteRecordsForGroup(recordIndexs: (number | number[])[]) {
    if (!isArray(recordIndexs) || recordIndexs.length === 0) {
      return;
    }
    const recordIndexsMaxToMin = sortRecordIndexs(recordIndexs, -1);
    for (let index = 0; index < recordIndexsMaxToMin.length; index++) {
      const recordIndex = recordIndexsMaxToMin[index];
      if (isNumber(recordIndex) && (recordIndex >= this.sourceLength || recordIndex < 0)) {
        continue;
      }
      const originRecordIndex = this.getOriginRecordIndexForGroup(recordIndex);

      this.beforeChangedRecordsMap.delete(recordIndex.toString());
      this.dataSourceObj.records.splice(originRecordIndex, 1);
      this.sourceLength -= 1;

      this.adjustBeforeChangedRecordsMap(originRecordIndex, 1, 'delete');
    }

    this.updateGroup();
  }

  updateRecordsForGroup(records: any[], recordIndexs: (number | number[])[]) {
    for (let index = 0; index < recordIndexs.length; index++) {
      const recordIndex = recordIndexs[index];
      if (isNumber(recordIndex) && (recordIndex >= this.sourceLength || recordIndex < 0)) {
        continue;
      }
      const originRecordIndex = this.getOriginRecordIndexForGroup(recordIndex);
      this.beforeChangedRecordsMap.delete(recordIndex.toString());
      this.dataSourceObj.records[originRecordIndex] = records[index];
    }

    this.updateGroup();
  }

  addRecordsForTree(recordArr: any[], recordIndex?: number | number[]) {
    if (!isArray(recordArr) || recordArr.length === 0) {
      return;
    }

    this.adjustBeforeChangedRecordsMap(recordIndex, recordArr.length);

    if (isNumber(recordIndex)) {
      this.dataSourceObj.records.splice(recordIndex, 0, ...recordArr);
    } else {
      const index = recordIndex.pop();
      const parentRecord = this.getOriginalRecord(recordIndex);
      if (parentRecord.children) {
        parentRecord.children.splice(index, 0, ...recordArr);
      } else {
        parentRecord.children = recordArr;
      }
    }

    this.initTreeHierarchyState();
    this.updatePagerData();
  }

  deleteRecordsForTree(recordIndexs: (number | number[])[]) {
    if (!isArray(recordIndexs) || recordIndexs.length === 0) {
      return;
    }
    const recordIndexsMaxToMin = sortRecordIndexs(recordIndexs, -1);
    for (let index = 0; index < recordIndexsMaxToMin.length; index++) {
      const recordIndex = recordIndexsMaxToMin[index];
      if (isNumber(recordIndex) && (recordIndex >= this.sourceLength || recordIndex < 0)) {
        continue;
      }
      this.beforeChangedRecordsMap.delete(recordIndex.toString());

      if (isNumber(recordIndex)) {
        this.dataSourceObj.records.splice(recordIndex, 1);
      } else {
        const index = recordIndex.pop();
        const parentRecord = this.getOriginalRecord(recordIndex);
        // delete parentRecord.children[index];
        parentRecord.children.splice(index, 1);
      }

      this.adjustBeforeChangedRecordsMap(recordIndex, 1, 'delete');
    }

    this.initTreeHierarchyState();
    this.updatePagerData();
  }

  updateRecordsForTree(records: any[], recordIndexs: (number | number[])[]) {
    for (let index = 0; index < recordIndexs.length; index++) {
      const recordIndex = recordIndexs[index];
      const record = records[index];
      if (isNumber(recordIndex) && (recordIndex >= this.sourceLength || recordIndex < 0)) {
        continue;
      }
      this.beforeChangedRecordsMap.delete(recordIndex.toString());

      if (isNumber(recordIndex)) {
        this.dataSourceObj.records.splice(recordIndex, 1, record);
      } else {
        const index = recordIndex.pop();
        const parentRecord = this.getOriginalRecord(recordIndex);
        parentRecord.children.splice(index, 1, record);
      }
    }

    this.initTreeHierarchyState();
    this.updatePagerData();
  }

  adjustBeforeChangedRecordsMap(insertIndex: number | number[], insertCount: number, type: 'add' | 'delete' = 'add') {
    if (this.rowHierarchyType === 'tree') {
      let insertIndexArr: number[];
      if (isNumber(insertIndex)) {
        insertIndexArr = [insertIndex];
      } else {
        insertIndexArr = insertIndex;
      }

      const targetResult: { originKey: string; targetKey: string; value: any }[] = [];
      this.beforeChangedRecordsMap.forEach((value, key) => {
        const keyArray = key.split(',');
        const length = Math.max(keyArray.length, insertIndexArr.length);
        for (let i = 0; i < length; i++) {
          const current = insertIndexArr[i] ?? -1;
          const keyIndex = Number(keyArray[i]) ?? -1;
          if (
            current < keyIndex ||
            (current === keyIndex && i === keyArray.length - 1 && i === insertIndexArr.length - 1)
          ) {
            keyArray[i] = (keyIndex + (type === 'add' ? insertCount : -insertCount)).toString();
            targetResult.push({
              originKey: key,
              targetKey: keyArray.toString(),
              value
            });
            return;
          }
        }
      });
      targetResult.forEach(({ originKey, targetKey, value }) => {
        this.beforeChangedRecordsMap.delete(originKey);
        this.beforeChangedRecordsMap.set(targetKey, value);
      });
    } else {
      super.adjustBeforeChangedRecordsMap(insertIndex as number, insertCount, type);
    }
  }

  cacheBeforeChangedRecord(dataIndex: number | number[], table?: BaseTableAPI) {
    if ((table.options as ListTableConstructorOptions).groupBy) {
      dataIndex = this.getOriginRecordIndexForGroup(dataIndex);
    }
    super.cacheBeforeChangedRecord(dataIndex, table);
  }
}

function dealWithGroup(record: any, children: any[], map: Map<number, any>, groupByKeys: string[], level: number): any {
  const groupByKey = groupByKeys[level];
  if (!isValid(groupByKey)) {
    children.push(record);
    return;
  }
  const value = get(record, groupByKey);
  if (value !== undefined) {
    if (map.has(value)) {
      const index = map.get(value);
      // children[index].children.push(record);
      return dealWithGroup(record, children[index].children, children[index].map, groupByKeys, level + 1);
    }
    map.set(value, children.length);
    children.push({
      vtableMerge: true,
      vtableMergeName: value,
      children: [] as any,
      map: new Map()
    });
    return dealWithGroup(
      record,
      children[children.length - 1].children,
      children[children.length - 1].map,
      groupByKeys,
      level + 1
    );
  }
}

function syncGroupCollapseState(
  oldSource: any,
  newSource: any,
  oldGroupMap?: Map<string, number>,
  newGroupMap?: Map<string, number>
) {
  if (!oldGroupMap) {
    oldGroupMap = new Map();
    for (let i = 0; i < oldSource.length; i++) {
      const record = oldSource[i];
      if (record.vtableMerge) {
        oldGroupMap.set(record.vtableMergeName, i);
      }
    }
  }

  if (!newGroupMap) {
    newGroupMap = new Map();
    for (let i = 0; i < newSource.length; i++) {
      const record = newSource[i];
      if (record.vtableMerge) {
        newGroupMap.set(record.vtableMergeName, i);
      }
    }
  }

  for (let i = 0; i < oldSource.length; i++) {
    const oldRecord = oldSource[i];
    const newRecord = newSource[newGroupMap.get(oldRecord.vtableMergeName)];
    if (isValid(newRecord)) {
      newRecord.hierarchyState = oldSource[i].hierarchyState;
    }
    if (
      isArray(oldRecord.children) &&
      isArray(newRecord.children) &&
      oldRecord.map.size !== 0 &&
      newRecord.map.size !== 0
    ) {
      syncGroupCollapseState(oldRecord.children, newRecord.children, oldRecord.map, newRecord.map);
    }
  }
}
