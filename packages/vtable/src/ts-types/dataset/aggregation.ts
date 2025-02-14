import { isValid } from '@visactor/vutils';
import type { SortOrder } from '..';
import { AggregationType, SortType } from '..';
import type { BaseTableAPI } from '../base-table';

export const registeredAggregators: {
  [key: string]: {
    new (args: {
      key?: string;
      field: string | string[];
      aggregationFun?: any;
      formatFun?: any;
      isRecord?: boolean;
      needSplitPositiveAndNegative?: boolean;
      calculateFun?: any;
      dependAggregators?: any;
      dependIndicatorKeys?: string[];
    }): Aggregator;
  };
} = {};

export interface IAggregator {
  records: any[];
  value: () => any;
  push: (record: any) => void;
  deleteRecord: (record: any) => void;
  updateRecord: (oldRecord: any, newRecord: any) => void;
  recalculate: () => any;
  formatValue?: (col?: number, row?: number, table?: BaseTableAPI) => any;
  formatFun?: () => any;
  clearCacheValue: () => any;
  reset: () => void;
}
export abstract class Aggregator implements IAggregator {
  isAggregator?: boolean = true;
  isRecord?: boolean = true; //是否需要维护records 将数据源都记录下来
  records: any[] = [];
  type?: string;
  key: string;
  field?: string | string[];
  formatFun?: any;
  _formatedValue?: any;

  constructor(config: { key: string; field: string | string[]; formatFun?: any; isRecord?: boolean }) {
    this.key = config.key;
    this.field = config.field;
    this.formatFun = config.formatFun;
    this.isRecord = config.isRecord ?? this.isRecord;
  }
  abstract push(record: any): void;
  abstract deleteRecord(record: any): void;
  abstract updateRecord(oldRecord: any, newRecord: any): void;
  abstract value(): any;
  abstract recalculate(): any;
  clearCacheValue() {
    this._formatedValue = undefined;
  }
  formatValue(col?: number, row?: number, table?: BaseTableAPI) {
    if (!this._formatedValue) {
      if (this.formatFun) {
        this._formatedValue = this.formatFun(this.value(), col, row, table);
      } else {
        this._formatedValue = this.value();
      }
    }
    return this._formatedValue;
  }
  reset() {
    this.records = [];
    this.clearCacheValue();
  }
}
export class RecordAggregator extends Aggregator {
  type: string = AggregationType.RECORD;
  isRecord?: boolean = true;
  push(record: any): void {
    if (record && this.isRecord && this.records) {
      if (record.isAggregator) {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      this.clearCacheValue();
    }
  }
  value() {
    return this.records;
  }
  reset() {
    this.records = [];
  }
  recalculate() {
    // do nothing
  }
}

export class NoneAggregator extends Aggregator {
  type: string = AggregationType.NONE; //仅获取其中一条数据(最新push的一条) 不做聚合 其fieldValue可以是number或者string类型
  isRecord?: boolean = true;
  declare field?: string;
  fieldValue?: any;
  push(record: any): void {
    if (record) {
      if (this.isRecord) {
        this.records = [record];
      }
      if (this.field) {
        this.fieldValue = record[this.field];
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      if (this.field && this.records.length) {
        this.fieldValue = this.records[this.records.length - 1][this.field];
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      if (this.field && this.records.length) {
        this.fieldValue = this.records[this.records.length - 1][this.field];
      }
      this.clearCacheValue();
    }
  }
  value() {
    return this.fieldValue;
  }
  reset() {
    this.records = [];
    this.fieldValue = undefined;
  }
  recalculate() {
    // do nothing
  }
}
export class CustomAggregator extends Aggregator {
  type: string = AggregationType.CUSTOM;
  isRecord?: boolean = true;
  declare field?: string;
  aggregationFun?: Function;
  values: (string | number)[] = [];
  fieldValue?: any;
  constructor(config: { key: string; field: string; formatFun?: any; isRecord?: boolean; aggregationFun?: Function }) {
    super(config);
    this.aggregationFun = config.aggregationFun;
  }
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.isAggregator) {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (this.field) {
        this.values.push(record[this.field]);
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      if (this.field && this.records.length) {
        this.values = this.records.map(item => item[this.field]);
      }
      this.clearCacheValue();
    }
  }
  deleteRecord(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      if (this.field && this.records.length) {
        this.values = this.records.map(item => item[this.field]);
      }
    }
    this.clearCacheValue();
  }
  value() {
    if (!this.fieldValue) {
      this.fieldValue = this.aggregationFun?.(this.values, this.records, this.field);
    }
    return this.fieldValue;
  }
  reset() {
    this.records = [];
    this.fieldValue = undefined;
  }
  recalculate() {
    this.fieldValue = undefined;
    this._formatedValue = undefined;
    // do nothing
  }
}
/** 透视表计算字段逻辑使用 */
export class RecalculateAggregator extends Aggregator {
  type: string = AggregationType.RECALCULATE;
  isRecord?: boolean = true;
  declare field?: string;
  calculateFun: Function;
  fieldValue?: any;
  dependAggregators: Aggregator[];
  dependIndicatorKeys: string[];
  constructor(config: {
    key: string;
    field: string;
    formatFun: any;
    isRecord: boolean;
    calculateFun: Function;
    dependAggregators: Aggregator[];
    dependIndicatorKeys: string[];
  }) {
    super(config);
    this.calculateFun = config.calculateFun;
    this.dependAggregators = config.dependAggregators;
    this.dependIndicatorKeys = config.dependIndicatorKeys;
  }
  push(record: any): void {
    if (record && this.isRecord && this.records) {
      if (record.isAggregator) {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      this.clearCacheValue();
    }
  }
  value() {
    if (!this.fieldValue) {
      const aggregatorValue = _getDependAggregatorValues(this.dependAggregators, this.dependIndicatorKeys);
      this.fieldValue = this.calculateFun?.(aggregatorValue, this.records, this.field);
    }
    return this.fieldValue;
  }
  reset() {
    this.records = [];
    this.fieldValue = undefined;
  }
  recalculate() {
    // do nothing
  }
}
export class SumAggregator extends Aggregator {
  type: string = AggregationType.SUM;
  sum = 0;
  positiveSum = 0;
  nagetiveSum = 0;
  declare field?: string;
  needSplitPositiveAndNegativeForSum?: boolean = false;
  constructor(config: {
    key: string;
    field: string;
    formatFun?: any;
    isRecord?: boolean;
    needSplitPositiveAndNegative?: boolean;
  }) {
    super(config);
    this.needSplitPositiveAndNegativeForSum = config.needSplitPositiveAndNegative ?? false;
  }
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.isAggregator) {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.isAggregator) {
        const value = record.value();
        this.sum += value ?? 0;
        if (this.needSplitPositiveAndNegativeForSum) {
          if (value > 0) {
            this.positiveSum += value;
          } else if (value < 0) {
            this.nagetiveSum += value;
          }
        }
      } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
        const value = parseFloat(record[this.field]);
        this.sum += value;
        if (this.needSplitPositiveAndNegativeForSum) {
          if (value > 0) {
            this.positiveSum += value;
          } else if (value < 0) {
            this.nagetiveSum += value;
          }
        }
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      if (record.isAggregator) {
        const value = record.value();
        this.sum -= value ?? 0;
        if (this.needSplitPositiveAndNegativeForSum) {
          if (value > 0) {
            this.positiveSum -= value;
          } else if (value < 0) {
            this.nagetiveSum -= value;
          }
        }
      } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
        const value = parseFloat(record[this.field]);
        this.sum -= value;
        if (this.needSplitPositiveAndNegativeForSum) {
          if (value > 0) {
            this.positiveSum -= value;
          } else if (value < 0) {
            this.nagetiveSum -= value;
          }
        }
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      if (oldRecord.isAggregator) {
        const oldValue = oldRecord.value();
        const newValue = newRecord.value();
        this.sum += newValue - oldValue;
        if (this.needSplitPositiveAndNegativeForSum) {
          if (oldValue > 0) {
            this.positiveSum -= oldValue;
          } else if (oldValue < 0) {
            this.nagetiveSum -= oldValue;
          }
          if (newValue > 0) {
            this.positiveSum += newValue;
          } else if (newValue < 0) {
            this.nagetiveSum += newValue;
          }
        }
      } else if (this.field && !isNaN(parseFloat(oldRecord[this.field]))) {
        const oldValue = parseFloat(oldRecord[this.field]);
        const newValue = parseFloat(newRecord[this.field]);
        this.sum += newValue - oldValue;
        if (this.needSplitPositiveAndNegativeForSum) {
          if (oldValue > 0) {
            this.positiveSum -= oldValue;
          } else if (oldValue < 0) {
            this.nagetiveSum -= oldValue;
          }
          if (newValue > 0) {
            this.positiveSum += newValue;
          } else if (newValue < 0) {
            this.nagetiveSum += newValue;
          }
        }
      }
      this.clearCacheValue();
    }
  }
  value() {
    return this.records?.length >= 1 ? this.sum : undefined;
  }
  positiveValue() {
    return this.positiveSum;
  }
  negativeValue() {
    return this.nagetiveSum;
  }
  reset() {
    super.reset();
    this.records = [];
    this.sum = 0;
  }
  recalculate() {
    this.sum = 0;
    this._formatedValue = undefined;
    if (this.records) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (record.isAggregator) {
          const value = record.value();
          this.sum += value ?? 0;
          if (this.needSplitPositiveAndNegativeForSum) {
            if (value > 0) {
              this.positiveSum += value;
            } else if (value < 0) {
              this.nagetiveSum += value;
            }
          }
        } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
          const value = parseFloat(record[this.field]);
          this.sum += value;
          if (this.needSplitPositiveAndNegativeForSum) {
            if (value > 0) {
              this.positiveSum += value;
            } else if (value < 0) {
              this.nagetiveSum += value;
            }
          }
        }
      }
    }
  }
}

export class CountAggregator extends Aggregator {
  type: string = AggregationType.COUNT;
  count = 0;
  declare field?: string;
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.isAggregator) {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.isAggregator) {
        this.count += record.value();
      } else {
        this.count++;
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      if (record.isAggregator) {
        this.count -= record.value();
      } else {
        this.count--;
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      if (oldRecord.isAggregator) {
        this.count += newRecord.value() - oldRecord.value();
      } else {
        //this.count++;
      }
    }
  }
  value() {
    return this.count;
  }
  reset() {
    this.records = [];
    this.count = 0;
  }
  recalculate() {
    this.count = 0;
    this._formatedValue = undefined;
    if (this.records) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (record.isAggregator) {
          this.count += record.value();
        } else {
          this.count++;
        }
      }
    }
  }
}
export class AvgAggregator extends Aggregator {
  type: string = AggregationType.AVG;
  sum = 0;
  count = 0;
  declare field?: string;
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.isAggregator) {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.isAggregator && record.type === AggregationType.AVG) {
        this.sum += record.sum;
        this.count += record.count;
      } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
        this.sum += parseFloat(record[this.field]);
        this.count++;
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      if (record.isAggregator && record.type === AggregationType.AVG) {
        this.sum -= record.sum;
        this.count -= record.count;
      } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
        this.sum -= parseFloat(record[this.field]);
        this.count--;
      }
    }
    this.clearCacheValue();
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      if (oldRecord.isAggregator && oldRecord.type === AggregationType.AVG) {
        this.sum += newRecord.sum - oldRecord.sum;
        this.count += newRecord.count - oldRecord.count;
      } else if (this.field && !isNaN(parseFloat(oldRecord[this.field]))) {
        this.sum += parseFloat(newRecord[this.field]) - parseFloat(oldRecord[this.field]);
        // this.count++;
      }
      this.clearCacheValue();
    }
  }
  value() {
    return this.records?.length >= 1 ? this.sum / this.count : undefined;
  }
  reset() {
    this.records = [];
    this.sum = 0;
    this.count = 0;
  }
  recalculate() {
    this.sum = 0;
    this.count = 0;
    this._formatedValue = undefined;
    if (this.records) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (record.isAggregator && record.type === AggregationType.AVG) {
          this.sum += record.sum;
          this.count += record.count;
        } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
          this.sum += parseFloat(record[this.field]);
          this.count++;
        }
      }
    }
  }
}
export class MaxAggregator extends Aggregator {
  type: string = AggregationType.MAX;
  max: number = Number.MIN_SAFE_INTEGER;
  declare field?: string;
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.isAggregator) {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.isAggregator) {
        this.max = record.max > this.max ? record.max : this.max;
      } else if (typeof record === 'number') {
        this.max = record > this.max ? record : this.max;
      } else if (this.field && typeof record[this.field] === 'number') {
        this.max = record[this.field] > this.max ? record[this.field] : this.max;
      } else if (this.field && !isNaN(record[this.field])) {
        this.max = parseFloat(record[this.field]) > this.max ? parseFloat(record[this.field]) : this.max;
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      this.recalculate();
    }
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      this.recalculate();
    }
  }
  value() {
    return this.records?.length >= 1 ? this.max : undefined;
  }
  reset() {
    this.records = [];
    this.max = Number.MIN_SAFE_INTEGER;
  }
  recalculate() {
    this.max = Number.MIN_SAFE_INTEGER;
    this._formatedValue = undefined;
    if (this.records) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (record.isAggregator) {
          this.max = record.max > this.max ? record.max : this.max;
        } else if (typeof record === 'number') {
          this.max = record > this.max ? record : this.max;
        } else if (this.field && typeof record[this.field] === 'number') {
          this.max = record[this.field] > this.max ? record[this.field] : this.max;
        } else if (this.field && !isNaN(record[this.field])) {
          this.max = parseFloat(record[this.field]) > this.max ? parseFloat(record[this.field]) : this.max;
        }
      }
    }
  }
}
export class MinAggregator extends Aggregator {
  type: string = AggregationType.MIN;
  min: number = Number.MAX_SAFE_INTEGER;
  declare field?: string;
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.isAggregator) {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.isAggregator) {
        this.min = record.min < this.min ? record.min : this.min;
      } else if (typeof record === 'number') {
        this.min = record < this.min ? record : this.min;
      } else if (this.field && typeof record[this.field] === 'number') {
        this.min = record[this.field] < this.min ? record[this.field] : this.min;
      } else if (this.field && !isNaN(record[this.field])) {
        this.min = parseFloat(record[this.field]) < this.min ? parseFloat(record[this.field]) : this.min;
      }
    }
    this.clearCacheValue();
  }
  deleteRecord(record: any) {
    if (record) {
      if (this.isRecord && this.records) {
        this.records = this.records.filter(item => item !== record);
      }
      this.recalculate();
    }
  }
  updateRecord(oldRecord: any, newRecord: any): void {
    if (oldRecord && newRecord) {
      if (this.isRecord && this.records) {
        this.records = this.records.map(item => {
          if (item === oldRecord) {
            return newRecord;
          }
          return item;
        });
      }
      this.recalculate();
    }
  }
  value() {
    return this.records?.length >= 1 ? this.min : undefined;
  }
  reset() {
    this.records = [];
    this.min = Number.MAX_SAFE_INTEGER;
  }
  recalculate() {
    this.min = Number.MAX_SAFE_INTEGER;
    this._formatedValue = undefined;
    if (this.records) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (record.isAggregator) {
          this.min = record.min < this.min ? record.min : this.min;
        } else if (typeof record === 'number') {
          this.min = record < this.min ? record : this.min;
        } else if (this.field && typeof record[this.field] === 'number') {
          this.min = record[this.field] < this.min ? record[this.field] : this.min;
        } else if (this.field && !isNaN(record[this.field])) {
          this.min = parseFloat(record[this.field]) < this.min ? parseFloat(record[this.field]) : this.min;
        }
      }
    }
  }
}
export function indicatorSort(a: any, b: any) {
  if (a && b) {
    // 数据健全兼容，用户数据不全时，能够展示.
    return a.toString().localeCompare(b.toString(), 'zh');
  }
  if (a) {
    return 1;
  }
  return -1;
}
export function typeSort(a: any, b: any, sortType: SortType) {
  if (sortType === SortType.NORMAL || sortType === SortType.normal) {
    return 0;
  }
  const factor = sortType === SortType.DESC || sortType === SortType.desc ? -1 : 1;
  if (a && b) {
    // 数据健全兼容，用户数据不全时，能够展示.
    return a.toString().localeCompare(b.toString(), 'zh') * factor;
  }
  if (a) {
    return 1 * factor;
  }
  return -1 * factor;
}
export function naturalSort(as: any, bs: any, sortType: SortType) {
  if (sortType === SortType.NORMAL || sortType === SortType.normal) {
    return 0;
  }

  const rx = /(\d+)|(\D+)/g;
  const rd = /\d/;
  const rz = /^0/;
  let a;
  let a1;
  let b;
  let b1;
  let nas = 0;
  let nbs = 0;
  const factor = sortType === SortType.DESC || sortType === SortType.desc ? -1 : 1;
  if (bs !== null && as === null) {
    return -1 * factor;
  }
  if (as !== null && bs === null) {
    return 1 * factor;
  }
  if (typeof as === 'number' && isNaN(as)) {
    return -1 * factor;
  }
  if (typeof bs === 'number' && isNaN(bs)) {
    return 1 * factor;
  }
  nas = +as;
  nbs = +bs;
  if (nas < nbs) {
    return -1 * factor;
  }
  if (nas > nbs) {
    return 1 * factor;
  }
  if (typeof as === 'number' && typeof bs !== 'number') {
    return -1 * factor;
  }
  if (typeof bs === 'number' && typeof as !== 'number') {
    return 1 * factor;
  }
  if (typeof as === 'number' && typeof bs === 'number') {
    return 0;
  }
  if (isNaN(nbs) && !isNaN(nas)) {
    return -1 * factor;
  }
  if (isNaN(nas) && !isNaN(nbs)) {
    return 1 * factor;
  }
  a = String(as);
  b = String(bs);
  if (a === b) {
    return 0;
  }
  if (!(rd.test(a) && rd.test(b))) {
    return (a > b ? 1 : -1) * factor;
  }
  a = a.match(rx);
  b = b.match(rx);
  while (a.length && b.length) {
    a1 = a.shift();
    b1 = b.shift();
    if (a1 !== b1) {
      if (rd.test(a1) && rd.test(b1)) {
        return (<any>a1.replace(rz, '.0') - <any>b1.replace(rz, '.0')) * factor;
      }
      return (a1 > b1 ? 1 : -1) * factor;
    }
  }
  return (a.length - b.length) * factor;
}
export function sortBy(order: string[]) {
  let x;
  let i;
  const mapping: any = {};
  const lowercase_mapping: any = {};
  // for (i in order) {
  for (let i = 0; i < order.length; i++) {
    x = order[i];
    mapping[x] = i;
    if (typeof x === 'string') {
      lowercase_mapping[x.toLowerCase()] = i;
    }
  }
  return function (a: any, b: any, sortType: SortType) {
    if (sortType === SortType.NORMAL || sortType === SortType.normal) {
      return 0;
    }
    const factor = sortType === SortType.DESC || sortType === SortType.desc ? -1 : 1;
    let comparison;
    if (mapping[a] !== null && mapping[a] !== undefined && mapping[b] !== null && mapping[b] !== undefined) {
      comparison = mapping[a] - mapping[b];
    } else if (mapping[a] !== null && mapping[a] !== undefined) {
      comparison = -1;
    } else if (mapping[b] !== null && mapping[b] !== undefined) {
      comparison = 1;
    } else if (
      lowercase_mapping[a] !== null &&
      mapping[a] !== undefined &&
      lowercase_mapping[b] !== null &&
      mapping[b] !== undefined
    ) {
      comparison = lowercase_mapping[a] - lowercase_mapping[b];
    } else if (
      lowercase_mapping[a] === null ||
      mapping[a] === undefined ||
      lowercase_mapping[b] === null ||
      mapping[b] === undefined
    ) {
      comparison = 0;
    } else if (lowercase_mapping[a] !== null && mapping[a] !== undefined) {
      comparison = -1;
    } else if (lowercase_mapping[b] !== null && mapping[b] !== undefined) {
      comparison = 1;
    }
    if (isValid(comparison)) {
      return comparison * factor;
    }

    return naturalSort(a, b, sortType);
  };
}

function _getDependAggregatorValues(aggregators: Aggregator[], dependIndicatorKeys: string[]) {
  const dependAggregatorValues: any = {};
  for (let m = 0; m < dependIndicatorKeys?.length; m++) {
    const aggrator = aggregators.find(aggrator => aggrator?.key === dependIndicatorKeys[m]);
    if (aggrator) {
      dependAggregatorValues[aggrator.key] = aggrator?.value();
    }
  }
  return dependAggregatorValues;
}
