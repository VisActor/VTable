// import type { FieldDef, MaybePromise, MaybePromiseOrUndefined } from "../ts-types";
// import { each, isPromise } from "../tools/utils";
// import { DataSource } from "./DataSource";
// import { EventHandler } from "../tools/EventHandler";

// /** @private */
// type Filter = (record: T | undefined) => boolean;

// /** @private */
// class DataSourceIterator {
//   _dataSource: DataSource;
//   _curIndex: number;
//   _data: MaybePromiseOrUndefined[];
//   constructor(dataSource: DataSource) {
//     this._dataSource = dataSource;
//     this._curIndex = -1;
//     this._data = [];
//   }
//   hasNext(): boolean {
//     const next = this._curIndex + 1;
//     return this._dataSource.length > next;
//   }
//   next(): MaybePromiseOrUndefined {
//     const next = this._curIndex + 1;
//     const data = this._getIndexData(next);
//     this._curIndex = next;
//     return data;
//   }
//   movePrev(): void {
//     this._curIndex--;
//   }
//   _getIndexData(index: number, nest?: boolean): MaybePromiseOrUndefined {
//     const dataSource = this._dataSource;
//     const data = this._data;
//     if (index < data.length) {
//       return data[index];
//     }

//     if (dataSource.length <= index) {
//       return undefined;
//     }
//     const record = this._dataSource.get(index);
//     data[index] = record;
//     if (isPromise(record)) {
//       record.then((val) => {
//         data[index] = val;
//       });
//       if (!nest) {
//         for (let i = 1; i <= 100; i++) {
//           this._getIndexData(index + i, true);
//         }
//       }
//     }
//     return record;
//   }
// }
// /** @private */
// class FilterData {
//   _owner: FilterDataSource;
//   _dataSourceItr: DataSourceIterator;
//   _filter: Filter;
//   _filterdList: (T | undefined)[];
//   _queues: (Promise<T | undefined> | null)[];
//   _cancel = false;
//   constructor(
//     dc: FilterDataSource,
//     original: DataSource,
//     filter: Filter
//   ) {
//     this._owner = dc;
//     this._dataSourceItr = new DataSourceIterator(original);
//     this._filter = filter;
//     this._filterdList = [];
//     this._queues = [];
//   }
//   get(index: number): MaybePromiseOrUndefined {
//     if (this._cancel) {
//       return undefined;
//     }
//     const filterdList = this._filterdList;
//     if (index < filterdList.length) {
//       return filterdList[index];
//     }
//     const queues = this._queues;
//     const indexQueue = queues[index];
//     if (indexQueue) {
//       return indexQueue;
//     }
//     return queues[index] || this._findIndex(index);
//   }
//   cancel(): void {
//     this._cancel = true;
//   }
//   _findIndex(index: number): MaybePromiseOrUndefined {
//     if (window.Promise) {
//       const timeout = Date.now() + 100;
//       let count = 0;
//       return this._findIndexWithTimeout(index, () => {
//         count++;
//         if (count >= 100) {
//           count = 0;
//           return timeout < Date.now();
//         }
//         return false;
//       });
//     }
//     return this._findIndexWithTimeout(index, () => false);
//   }
//   _findIndexWithTimeout(
//     index: number,
//     testTimeout: () => boolean
//   ): MaybePromiseOrUndefined {
//     const filterdList = this._filterdList;
//     const filter = this._filter;
//     const dataSourceItr = this._dataSourceItr;

//     const queues = this._queues;

//     while (dataSourceItr.hasNext()) {
//       if (this._cancel) {
//         return undefined;
//       }
//       const record = dataSourceItr.next();
//       if (isPromise(record)) {
//         dataSourceItr.movePrev();
//         const queue = record.then((_value) => {
//           queues[index] = null;
//           return this.get(index);
//         });
//         queues[index] = queue;
//         return queue;
//       }
//       if (filter(record)) {
//         filterdList.push(record);
//         if (index < filterdList.length) {
//           return filterdList[index];
//         }
//       }
//       if (testTimeout()) {
//         const promise = new Promise((resolve) => {
//           setTimeout(() => {
//             resolve();
//           }, 300);
//         });
//         const queue = promise.then(() => {
//           queues[index] = null;
//           return this.get(index);
//         });
//         queues[index] = queue;
//         return queue;
//       }
//     }
//     const dc = this._owner;
//     dc.length = filterdList.length;
//     return undefined;
//   }
// }

// /**
//  * table data source for filter
//  *
//  * @classdesc VTable.data.FilterDataSource
//  * @memberof VTable.data
//  */
// export class FilterDataSource extends DataSource {
//   private _dataSource: DataSource;
//   private _handler: EventHandler;
//   private _filterData: FilterData | null = null;
//   static get EVENT_TYPE(): typeof DataSource.EVENT_TYPE {
//     return DataSource.EVENT_TYPE;
//   }
//   constructor(dataSource: DataSource, filter: Filter) {
//     super(dataSource);
//     this._dataSource = dataSource;
//     this.filter = filter;
//     const handler = (this._handler = new EventHandler());
//     handler.on(dataSource, DataSource.EVENT_TYPE.UPDATED_ORDER, () => {
//       // reset
//       // eslint-disable-next-line no-self-assign
//       this.filter = this.filter;
//     });
//     each(DataSource.EVENT_TYPE, (type) => {
//       handler.on(dataSource, type, (...args) =>
//         this.fireListeners(type, ...args)
//       );
//     });
//   }
//   get filter(): Filter | null {
//     return this._filterData?._filter || null;
//   }
//   set filter(filter: Filter | null) {
//     if (this._filterData) {
//       this._filterData.cancel();
//     }
//     this._filterData = filter
//       ? new FilterData(this, this._dataSource, filter)
//       : null;
//     this.length = this._dataSource.length;
//   }
//   protected getOriginal(index: number): MaybePromiseOrUndefined {
//     if (!this._filterData) {
//       return super.getOriginal(index);
//     }
//     return this._filterData.get(index);
//   }
//   sort(field: FieldDef, order: "desc" | "asc",orderFn: (v1: T, v2: T, order: string) => -1 | 0 | 1): void {
//      this._dataSource.sort(field, order,orderFn);
//   }
//
//   get source(): any {
//     return this._dataSource.source;
//   }
//   get dataSource(): DataSource {
//     return this._dataSource;
//   }
//   release(): void {
//     this._handler.release?.();
//     super.release?.();
//   }
// }
