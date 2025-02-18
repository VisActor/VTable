import { isValid } from '@visactor/vutils';

const indexFirst = (arr: number[], elm: number): number => {
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
};

export class NumberMap<T> {
  private _keys: number[] = [];
  private _vals: { [key: number]: T } = {};
  private _sorted = false;
  count() {
    return this._keys.length;
  }
  values() {
    return this._vals;
  }
  valueArr() {
    return Object.values(this._vals);
  }
  /**
   * 将sourceIndex位置开始 往后moveCount个值 调整到targetIndex位置处
   * @param sourceIndex
   * @param targetIndex
   * @param moveCount
   */
  adjustOrder(sourceIndex: number, targetIndex: number, moveCount: number) {
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
  del(key: number): void {
    delete this._vals[key];
    const index = this._keys.indexOf(key);
    if (index !== -1) {
      this._keys.splice(index, 1); // 使用 splice() 方法删除指定索引位置的元素
    }
  }
  put(key: number, value: T): void {
    if (!(key in this._vals)) {
      this._keys.push(key);
      this._sorted = false;
    }
    this._vals[key] = value;
  }
  get(key: number): T | undefined {
    return this._vals[key];
  }
  has(key: number): boolean {
    return isValid(this._vals[key]);
  }
  contain(value: T): boolean {
    return Object.values(this._vals).indexOf(value) >= 0;
  }
  each(keyFrom: number, keyTo: number, fn: (t: T, k: number) => boolean | void): void {
    const { _keys: keys } = this;
    const { length } = keys;
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

    for (let i = indexFirst(keys, keyFrom); i < length; i++) {
      const key = keys[i];
      if (keyFrom <= key && key <= keyTo) {
        const callRes = fn(this.get(key) as T, key);
        if (callRes === false) {
          break;
        }
      } else if (keyTo < key) {
        return;
      }
    }
  }
  clear() {
    this._keys.length = 0;
    this._vals = {};
    this._sorted = false;
  }

  getLastIndex() {
    return this._keys[this._keys.length - 1];
  }

  delLast() {
    const lastIndex = this.getLastIndex();
    this.del(lastIndex);
  }

  delAndReorder(index: number) {
    if (!this.has(index)) {
      return;
    }
    const lastIndex = this.getLastIndex();

    this.adjustOrder(index + 1, index, lastIndex - index);
    this.delLast();
  }

  addAndReorder(index: number, newValue?: T) {
    if (isValid(newValue)) {
      const lastIndex = this.getLastIndex();
      this.adjustOrder(index, index + 1, lastIndex - index);

      this.put(index, newValue);
    }
  }
}
