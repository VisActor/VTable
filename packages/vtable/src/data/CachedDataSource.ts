import type {
  FieldData,
  FieldDef,
  IListTableDataConfig,
  IPagination,
  MaybePromise,
  MaybePromiseOrUndefined
} from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';
import type { ColumnData } from '../ts-types/list-table/layout-map/api';
import type { DataSourceParam } from './DataSource';
import { DataSource } from './DataSource';

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
  static get EVENT_TYPE(): typeof DataSource.EVENT_TYPE {
    return DataSource.EVENT_TYPE;
  }
  static ofArray(
    array: any[],
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columnObjs?: ColumnData[],
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
      columnObjs,
      rowHierarchyType,
      hierarchyExpandLevel
    );
  }
  constructor(
    opt?: DataSourceParam,
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columnObjs?: ColumnData[],
    rowHierarchyType?: 'grid' | 'tree',
    hierarchyExpandLevel?: number
  ) {
    super(opt, dataConfig, pagination, columnObjs, rowHierarchyType, hierarchyExpandLevel);
    this._recordCache = [];
    this._fieldCache = {};
  }
  protected getOriginalRecord(index: number): MaybePromiseOrUndefined {
    if (this._recordCache && this._recordCache[index]) {
      return this._recordCache[index];
    }
    return super.getOriginalRecord(index);
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
    this._recordCache[index] = record;
  }
  get records(): any[] {
    return Array.isArray(this._recordCache) && this._recordCache.length > 0 ? this._recordCache : super.records;
  }

  release(): void {
    super.release?.();
    this._recordCache = null;
    this._fieldCache = null;
  }
}
