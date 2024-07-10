import type { SortOrder } from '../ts-types';
import { AggregationType } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

export interface IAggregator {
  records?: any[];
  value: () => any;
  className: string;
  push: (record: any) => void;
  recalculate: () => any;
  formatValue?: (col?: number, row?: number, table?: BaseTableAPI) => any;
  formatFun?: () => any;
  clearCacheValue: () => any;
  reset: () => void;
}
export abstract class Aggregator implements IAggregator {
  className = 'Aggregator';
  isRecord?: boolean = true; //是否需要维护records 将数据源都记录下来
  records?: any[] = [];
  type?: string;
  key: string;
  field?: string | string[];
  formatFun?: any;
  _formatedValue?: any;

  constructor(config: { key: string; dimension: string; formatFun?: any; isRecord?: boolean }) {
    this.key = config.key;
    this.field = config.dimension;
    this.formatFun = config.formatFun;
    this.isRecord = config.isRecord ?? this.isRecord;
  }
  abstract push(record: any): void;
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
  }
}
export class RecordAggregator extends Aggregator {
  type: string = AggregationType.RECORD;
  isRecord?: boolean = true;
  push(record: any): void {
    if (record && this.isRecord && this.records) {
      if (record.className === 'Aggregator') {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }
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
  type: string = AggregationType.NONE; //仅获取其中一条数据 不做聚合 其fieldValue可以是number或者string类型
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
  type: string = AggregationType.CUSTOM; //仅获取其中一条数据 不做聚合 其fieldValue可以是number或者string类型
  isRecord?: boolean = true;
  declare field?: string;
  aggregationFun?: Function;
  values: (string | number)[] = [];
  fieldValue?: any;
  constructor(config: {
    key: string;
    dimension: string;
    formatFun?: any;
    isRecord?: boolean;
    aggregationFun?: Function;
  }) {
    super(config);
    this.aggregationFun = config.aggregationFun;
  }
  push(record: any): void {
    if (record) {
      if (this.isRecord && this.records) {
        if (record.className === 'Aggregator') {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (this.field) {
        this.values.push(record[this.field]);
      }
    }
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
    // do nothing
  }
}
export class RecalculateAggregator extends Aggregator {
  type: string = AggregationType.RECALCULATE; //仅获取其中一条数据 不做聚合 其fieldValue可以是number或者string类型
  isRecord?: boolean = true;
  declare field?: string;
  calculateFun: Function;
  fieldValue?: any;
  dependAggregators: Aggregator[];
  dependIndicatorKeys: string[];
  constructor(config: {
    key: string;
    dimension: string;
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
      if (record.className === 'Aggregator') {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }
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
    dimension: string;
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
        if (record.className === 'Aggregator') {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.className === 'Aggregator') {
        const value = record.value();
        this.sum += value;
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
  value() {
    return this.sum;
  }
  positiveValue() {
    return this.positiveSum;
  }
  negativeValue() {
    return this.nagetiveSum;
  }
  reset() {
    this.records = [];
    this.sum = 0;
  }
  recalculate() {
    this.sum = 0;
    this._formatedValue = undefined;
    if (this.records) {
      for (let i = 0; i < this.records.length; i++) {
        const record = this.records[i];
        if (record.className === 'Aggregator') {
          const value = record.value();
          this.sum += value;
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
        if (record.className === 'Aggregator') {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.className === 'Aggregator') {
        this.count += record.value();
      } else {
        this.count++;
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
        if (record.className === 'Aggregator') {
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
        if (record.className === 'Aggregator') {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.className === 'Aggregator' && record.type === AggregationType.AVG) {
        this.sum += record.sum;
        this.count += record.count;
      } else if (this.field && !isNaN(parseFloat(record[this.field]))) {
        this.sum += parseFloat(record[this.field]);
        this.count++;
      }
    }
  }
  value() {
    return this.sum / this.count;
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
        if (record.className === 'Aggregator' && record.type === AggregationType.AVG) {
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
        if (record.className === 'Aggregator') {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.className === 'Aggregator') {
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
  value() {
    return this.max;
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
        if (record.className === 'Aggregator') {
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
        if (record.className === 'Aggregator') {
          this.records.push(...record.records);
        } else {
          this.records.push(record);
        }
      }
      if (record.className === 'Aggregator') {
        this.min = record.min < this.min ? record.min : this.min;
      } else if (typeof record === 'number') {
        this.min = record < this.min ? record : this.min;
      } else if (this.field && typeof record[this.field] === 'number') {
        this.min = record[this.field] < this.min ? record[this.field] : this.min;
      }
    }
  }
  value() {
    return this.min;
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
        if (record.className === 'Aggregator') {
          this.min = record.min < this.min ? record.min : this.min;
        } else if (typeof record === 'number') {
          this.min = record < this.min ? record : this.min;
        } else if (this.field && typeof record[this.field] === 'number') {
          this.min = record[this.field] < this.min ? record[this.field] : this.min;
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
export function typeSort(a: any, b: any) {
  if (a && b) {
    // 数据健全兼容，用户数据不全时，能够展示.
    return a.toString().localeCompare(b.toString(), 'zh');
  }
  if (a) {
    return 1;
  }
  return -1;
}
export function naturalSort(as: any, bs: any) {
  const rx = /(\d+)|(\D+)/g;
  const rd = /\d/;
  const rz = /^0/;
  let a;
  let a1;
  let b;
  let b1;
  let nas = 0;
  let nbs = 0;
  if (bs !== null && as === null) {
    return -1;
  }
  if (as !== null && bs === null) {
    return 1;
  }
  if (typeof as === 'number' && isNaN(as)) {
    return -1;
  }
  if (typeof bs === 'number' && isNaN(bs)) {
    return 1;
  }
  nas = +as;
  nbs = +bs;
  if (nas < nbs) {
    return -1;
  }
  if (nas > nbs) {
    return 1;
  }
  if (typeof as === 'number' && typeof bs !== 'number') {
    return -1;
  }
  if (typeof bs === 'number' && typeof as !== 'number') {
    return 1;
  }
  if (typeof as === 'number' && typeof bs === 'number') {
    return 0;
  }
  if (isNaN(nbs) && !isNaN(nas)) {
    return -1;
  }
  if (isNaN(nas) && !isNaN(nbs)) {
    return 1;
  }
  a = String(as);
  b = String(bs);
  if (a === b) {
    return 0;
  }
  if (!(rd.test(a) && rd.test(b))) {
    return a > b ? 1 : -1;
  }
  a = a.match(rx);
  b = b.match(rx);
  while (a.length && b.length) {
    a1 = a.shift();
    b1 = b.shift();
    if (a1 !== b1) {
      if (rd.test(a1) && rd.test(b1)) {
        return <any>a1.replace(rz, '.0') - <any>b1.replace(rz, '.0');
      }
      return a1 > b1 ? 1 : -1;
    }
  }
  return a.length - b.length;
}
export function sortBy(order: string[]) {
  let x;
  let i;
  const mapping = {};
  const lowercase_mapping = {};
  // for (i in order) {
  for (let i = 0; i < order.length; i++) {
    x = order[i];
    mapping[x] = i;
    if (typeof x === 'string') {
      lowercase_mapping[x.toLowerCase()] = i;
    }
  }
  return function (a: any, b: any) {
    if (mapping[a] !== null && mapping[a] !== undefined && mapping[b] !== null && mapping[b] !== undefined) {
      return mapping[a] - mapping[b];
    } else if (mapping[a] !== null && mapping[a] !== undefined) {
      return -1;
    } else if (mapping[b] !== null && mapping[b] !== undefined) {
      return 1;
    } else if (
      lowercase_mapping[a] !== null &&
      mapping[a] !== undefined &&
      lowercase_mapping[b] !== null &&
      mapping[b] !== undefined
    ) {
      return lowercase_mapping[a] - lowercase_mapping[b];
    } else if (
      lowercase_mapping[a] === null ||
      mapping[a] === undefined ||
      lowercase_mapping[b] === null ||
      mapping[b] === undefined
    ) {
      return 0;
    } else if (lowercase_mapping[a] !== null && mapping[a] !== undefined) {
      return -1;
    } else if (lowercase_mapping[b] !== null && mapping[b] !== undefined) {
      return 1;
    }
    return naturalSort(a, b);
  };
}

function _getDependAggregatorValues(aggregators: Aggregator[], dependIndicatorKeys: string[]) {
  const dependAggregatorValues: any = {};
  for (let m = 0; m < dependIndicatorKeys?.length; m++) {
    const aggrator = aggregators.find(aggrator => aggrator.key === dependIndicatorKeys[m]);
    if (aggrator) {
      dependAggregatorValues[aggrator.key] = aggrator?.value();
    }
  }
  return dependAggregatorValues;
}
