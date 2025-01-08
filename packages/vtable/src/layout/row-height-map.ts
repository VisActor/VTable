import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../ts-types/base-table';

export class NumberRangeMap {
  data: Map<number, number>;
  cumulativeSum: Map<number, number>;
  difference: Map<number, number>;
  totalSum: number;
  table: BaseTableAPI;
  isUpdate = false;
  private _keys: number[] = [];
  private _sorted = false;

  constructor(table: BaseTableAPI) {
    this.data = new Map();
    this._keys.length = 0;
    this.cumulativeSum = new Map();
    this.difference = new Map();
    this.totalSum = 0;
    this.table = table;
  }

  get length() {
    return this.data.size;
  }

  clear() {
    this._keys = [];
    this.data.clear();
    this.cumulativeSum.clear();
    this.difference.clear();
    this.totalSum = 0;
  }

  clearRange() {
    this.cumulativeSum.clear();
    this.difference.clear();
  }

  add(position: number, value: number) {
    if (!isValid(value)) {
      return;
    }
    const defaultValue = this.table.getRowHeight(position);
    if (!this.data.has(position)) {
      this._keys.push(position);
      this._sorted = false;
    }
    this.data.set(position, value);
    this.totalSum += value;
    // this.updateCumulativeSum(position, value);
    this.updateDifference(position, value - defaultValue);
  }

  remove(position: number) {
    if (this.data.has(position)) {
      const value = this.data.get(position);
      this.data.delete(position);
      const index = this._keys.indexOf(position);
      if (index !== -1) {
        this._keys.splice(index, 1); // 使用 splice() 方法删除指定索引位置的元素
      }
      this.totalSum -= value;
      const defaultValue = this.table.getRowHeight(position);
      // this.updateCumulativeSum(position, -value);
      this.updateDifference(position, defaultValue - value);
    }
  }

  put(position: number, newValue: number) {
    if (!isValid(newValue)) {
      return;
    }
    if (this.data.has(position)) {
      const oldValue = this.data.get(position);

      if (oldValue === newValue) {
        return;
      }
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

  has(position: number) {
    return this.data.has(position);
  }

  private _sort() {
    const { _keys: keys } = this;
    if (!this._sorted) {
      keys.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      this._sorted = true;
    }
  }

  updateDifference(position: number, difference: number) {
    const oldDifference = this.difference.get(position) ?? 0;
    this.difference.set(position, oldDifference + difference);
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
    if (position < 0) {
      return 0;
    }
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
      // if (i === position && this.cumulativeSum.has(i + 1)) {
      //   sum += this.cumulativeSum.get(i + 1) - (this.data.get(i + 1) ?? this.table.getRowHeight(i + 1));
      //   break;
      // }
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
    for (const [sumPos] of this.cumulativeSum) {
      for (const [difPos, difference] of this.difference) {
        if (sumPos >= difPos) {
          const oldSum = this.cumulativeSum.get(sumPos);
          this.cumulativeSum.set(sumPos, oldSum + difference);
        }
      }
    }

    this.difference.clear();
  }

  // add and reorder
  insert(position: number, value?: number) {
    // clear all sum cover position
    for (let i = position; i <= this.getLastIndex(); i++) {
      this.cumulativeSum.delete(i);
    }
    const lastIndex = this.getLastIndex() + 1;
    this.adjustOrder(position, position + 1, lastIndex - position);
    if (isValid(value)) {
      this.put(position, value);
    }
  }

  getLastIndex() {
    this._sort();
    return this._keys[this._keys.length - 1];
  }

  delLast() {
    const lastIndex = this.getLastIndex();
    this.remove(lastIndex);
  }

  // del and reorder
  delete(position: number) {
    if (!this.has(position)) {
      return;
    }

    // clear all sum cover position
    for (let i = position; i <= this.getLastIndex(); i++) {
      this.cumulativeSum.delete(i);
    }

    const lastIndex = this.getLastIndex();

    this.adjustOrder(position + 1, position, lastIndex - position);
    this.delLast();
  }

  /**
   * 将sourceIndex位置开始 往后moveCount个值 调整到targetIndex位置处
   * @param sourceIndex
   * @param targetIndex
   * @param moveCount
   */
  adjustOrder(sourceIndex: number, targetIndex: number, moveCount: number) {
    this.clearRange();
    this._sort();
    const { _keys: keys } = this;

    if (sourceIndex > targetIndex) {
      const sourceVals = [];
      for (let i = indexFirst(keys, sourceIndex + moveCount - 1); i >= 0; i--) {
        const key = keys[i];
        if (key >= sourceIndex) {
          sourceVals.push(this.get(key));
        } else if (targetIndex <= key && key < sourceIndex) {
          this.put(key + moveCount, this.get(key));
        } else if (key < targetIndex) {
          break;
        }
      }
      for (let i = 0; i < moveCount; i++) {
        this.put(targetIndex + i, sourceVals[moveCount - 1 - i]);
      }
    }
    const { length } = keys;
    if (sourceIndex < targetIndex) {
      const sourceVals = [];
      for (let i = indexFirst(keys, sourceIndex); i < length; i++) {
        const key = keys[i];
        if (key >= sourceIndex && key < sourceIndex + moveCount) {
          sourceVals.push(this.get(key));
        } else if (sourceIndex + moveCount <= key && key <= targetIndex) {
          this.put(key - moveCount, this.get(key));
        } else if (key > targetIndex) {
          break;
        }
      }
      for (let i = 0; i < moveCount; i++) {
        this.put(targetIndex + i, sourceVals[i]);
      }
    }
  }

  exchangeOrder(
    sourceIndex: number,
    sourceCount: number,
    targetIndex: number,
    targetCount: number,
    insertIndex: number
  ) {
    const { _keys: keys } = this;
    if (!this._sorted) {
      keys.sort((a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      });
      this._sorted = true;
    }
    if (sourceIndex > targetIndex) {
      //先将target部分的值存起来
      const targetVals = [];
      const sourceVals = [];
      for (let i = indexFirst(keys, targetIndex); i < indexFirst(keys, sourceIndex) + sourceCount; i++) {
        const key = keys[i];
        if (key >= sourceIndex && key < sourceIndex + sourceCount) {
          sourceVals.push(this.get(key));
        } else {
          targetVals.push(this.get(key));
        }
      }
      for (let i = 0; i < sourceCount; i++) {
        this.put(insertIndex + i, sourceVals[i]);
      }

      for (let i = 0; i < targetVals.length; i++) {
        this.put(insertIndex + sourceCount + i, targetVals[i]);
      }
    } else {
      //先将target部分的值存起来
      const targetVals = [];
      const sourceVals = [];
      for (let i = indexFirst(keys, sourceIndex); i < indexFirst(keys, targetIndex) + targetCount; i++) {
        const key = keys[i];
        if (key >= sourceIndex && key < sourceIndex + sourceCount) {
          sourceVals.push(this.get(key));
        } else {
          targetVals.push(this.get(key));
        }
      }
      for (let i = 0; i < sourceCount; i++) {
        this.put(insertIndex + i, sourceVals[i]);
      }

      for (let i = 0; i < targetVals.length; i++) {
        this.put(sourceIndex + i, targetVals[i]);
      }
    }
  }
}

function indexFirst(arr: number[], elm: number): number {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    if (arr[i] === elm) {
      return i;
    } else if (arr[i] > elm) {
      high = i - 1;
    } else {
      low = i + 1;
    }
  }
  return high < 0 ? 0 : high;
}
