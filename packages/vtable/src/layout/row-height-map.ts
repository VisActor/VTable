import type { BaseTableAPI } from '../ts-types/base-table';

export class NumberRangeMap {
  data: Map<number, number>;
  cumulativeSum: Map<number, number>;
  difference: Map<number, number>;
  totalSum: number;
  table: BaseTableAPI;
  isUpdate = false;

  constructor(table: BaseTableAPI) {
    this.data = new Map();
    this.cumulativeSum = new Map();
    this.difference = new Map();
    this.totalSum = 0;
    this.table = table;
  }

  clear() {
    this.data.clear();
    this.cumulativeSum.clear();
    this.difference.clear();
    this.totalSum = 0;
  }

  add(position: number, value: number) {
    const defaultValue = this.table.getRowHeight(position);
    this.data.set(position, value);
    this.totalSum += value;
    // this.updateCumulativeSum(position, value);
    this.updateDifference(position, value - defaultValue);
  }

  remove(position: number) {
    if (this.data.has(position)) {
      const value = this.data.get(position);
      this.data.delete(position);
      this.totalSum -= value;
      const defaultValue = this.table.getRowHeight(position);
      // this.updateCumulativeSum(position, -value);
      this.updateDifference(position, defaultValue - value);
    }
  }

  put(position: number, newValue: number) {
    if (this.data.has(position)) {
      const oldValue = this.data.get(position);
      this.data.set(position, newValue);
      const difference = newValue - oldValue;
      this.totalSum += difference;
      // this.updateCumulativeSum(position, difference);
      this.updateDifference(position, difference);
    } else {
      this.add(position, newValue);
    }
  }

  get(position: number) {
    return this.data.get(position);
  }

  updateDifference(position: number, difference: number) {
    this.difference.set(position, difference);
    this.update();
  }

  getSumInRange(start: number, end: number) {
    return this.calculatePrefixSum(end) - this.calculatePrefixSum(start - 1);
  }

  updateCumulativeSum(position: number, difference: number) {
    // 更新累加和
    for (const [pos, sum] of this.cumulativeSum) {
      if (pos >= position) {
        this.cumulativeSum.set(pos, sum + difference);
      }
    }
  }

  calculatePrefixSum(position: number) {
    if (this.cumulativeSum.has(position)) {
      let cache = this.cumulativeSum.get(position);
      for (const [pos, difference] of this.difference) {
        if (pos <= position) {
          cache += difference;
        }
      }
      return cache;
    }

    this.dealDiffenence();
    return this.getCumulativeSum(position);
  }

  getCumulativeSum(position: number) {
    let sum = 0;
    for (let i = position; i >= 0; i--) {
      if (this.cumulativeSum.has(i)) {
        sum += this.cumulativeSum.get(i);
        break;
      } else {
        sum += this.data.get(i) ?? this.table.getRowHeight(i);
      }
    }
    this.cumulativeSum.set(position, sum);
    return sum;
  }

  update() {
    if (this.isUpdate) {
      return;
    }
    this.isUpdate = true;
    setTimeout(() => {
      this.dealDiffenence();
      this.isUpdate = false;
    }, 0);
  }

  dealDiffenence() {
    for (const [sumPos, sum] of this.cumulativeSum) {
      for (const [difPos, difference] of this.difference) {
        if (sumPos >= difPos) {
          this.cumulativeSum.set(sumPos, sum + difference);
        }
      }
    }

    this.difference.clear();
  }
}
