/* Adapted from cheetah-grid by yosuke ota
 *url:https://github.com/future-architect/cheetah-grid/blob/master/packages/cheetah-grid/src/js/internal/utils.ts
 *License: https://github.com/future-architect/cheetah-grid/blob/master/LICENSE
 * @license
 */
import { validToString } from '../tools/util';
import type { CellPosition, CellRange, MaybeCall } from '../ts-types';

const isNode = typeof window === 'undefined' || typeof window.window === 'undefined';

type ArrayElementPredicate = (t: any, i: number, arr: any[]) => boolean;

let arrayFind: (arr: any[], predicate: ArrayElementPredicate) => any;
let arrayFindIndex: (arr: any[], predicate: ArrayElementPredicate) => number;
const array = {
  get find(): typeof arrayFind {
    if (arrayFind) {
      return arrayFind;
    }
    if (Array.prototype.find) {
      arrayFind = (arr: any[], predicate: ArrayElementPredicate): any => Array.prototype.find.call(arr, predicate);
    } else {
      arrayFind = (arr: any[], predicate: ArrayElementPredicate): any => {
        const index = array.findIndex(arr, predicate);
        return index >= 0 ? arr[index] : undefined;
      };
    }
    return arrayFind;
  },
  get findIndex(): typeof arrayFindIndex {
    if (arrayFindIndex) {
      return arrayFindIndex;
    }
    if (Array.prototype.findIndex) {
      arrayFindIndex = (arr: any[], predicate: ArrayElementPredicate): number =>
        Array.prototype.findIndex.call(arr, predicate);
    } else {
      arrayFindIndex = (arr: any[], predicate: ArrayElementPredicate): number => {
        const { length } = arr;
        for (let i = 0; i < length; i++) {
          const value = arr[i];
          if (predicate(value, i, arr)) {
            return i;
          }
        }
        return -1;
      };
    }
    return arrayFindIndex;
  }
};

function analyzeUserAgent(): {
  IE: boolean;
  Edge: boolean;
  Chrome: boolean;
  Firefox: boolean;
  Safari: boolean;
} {
  if (isNode) {
    return {
      IE: false,
      Edge: false,
      Chrome: false,
      Firefox: false,
      Safari: false
    };
  }
  const ua = window.navigator.userAgent.toLowerCase();
  return {
    IE: !!/(msie|trident)/.exec(ua),
    Edge: ua.indexOf('edge') > -1,
    Chrome: ua.indexOf('chrome') > -1 && ua.indexOf('edge') === -1,
    Firefox: ua.indexOf('firefox') > -1,
    Safari: ua.indexOf('safari') > -1 && ua.indexOf('edge') === -1
  };
}
const { IE, Chrome, Firefox, Edge, Safari } = analyzeUserAgent();

function isObject(obj: any): obj is Record<string, any> {
  return obj === Object(obj);
}

export function omit<T, K extends keyof T>(source: T, omits: K[]): Omit<T, K> {
  const result = {} as Omit<T, K>;
  for (const key in source) {
    if (omits.indexOf(key as never) >= 0) {
      continue;
    }
    Object.defineProperty(result, key, {
      get() {
        return source[key];
      },
      set(val) {
        source[key] = val;
      },
      configurable: true,
      enumerable: true
    });
  }
  return result;
}

export function defaults(source: any, defs: Partial<any>): any {
  const keys: string[] = [];
  const result = {};
  for (const key in source) {
    keys.push(key);
    Object.defineProperty(result, key, {
      get() {
        const val = source[key];
        return val === undefined ? defs[key] : val;
      },
      set(val) {
        source[key] = val;
      },
      configurable: true,
      enumerable: true
    });
  }
  for (const key in defs) {
    if (keys.indexOf(key) >= 0) {
      continue;
    }
    Object.defineProperty(result, key, {
      get() {
        const val = source[key];
        return val === undefined ? defs[key] : val;
      },
      set(val) {
        source[key] = val;
      },
      configurable: true,
      enumerable: true
    });
  }
  return result;
}

export function extend<T, U>(t: T, u: U): T & U;
export function extend<T, U, V>(t: T, u: U, v: V): T & U & V;
export function extend<T>(...args: T[]): T;
export function extend<T>(...args: T[]): T {
  const result = {} as T;
  args.forEach(source => {
    for (const key in source) {
      Object.defineProperty(result, key, {
        get() {
          return source[key];
        },
        set(val) {
          source[key] = val;
        },
        configurable: true,
        enumerable: true
      });
    }
  });
  return result;
}

function applyChainSafe(obj: any, fn: (value: any, name: string) => any, ...names: string[]): any {
  let value = obj;
  for (let i = 0; i < names.length && value !== null && value !== undefined; i++) {
    value = fn(value, names[i]);
  }
  return value;
}
function getChainSafe(obj: any, ...names: string[]): any {
  return applyChainSafe(obj, (val, name) => val[name], ...names);
}
function getOrApply<_T, A extends any[]>(value: undefined, ...args: A): undefined;
function getOrApply<_T, A extends any[]>(value: null, ...args: A): null;
function getOrApply<T, A extends any[]>(value: MaybeCall<T, A>, ...args: A): T;
function getOrApply<T, A extends any[]>(value: MaybeCall<T, A>, ...args: A): T {
  if (typeof value === 'function') {
    return (value as any)(...args);
  }
  return value;
}

function endsWith(str: string, searchString: string, position?: number): boolean {
  const subjectString = validToString(str);
  if (
    typeof position !== 'number' ||
    !isFinite(position) ||
    Math.floor(position) !== position ||
    position > subjectString.length
  ) {
    position = subjectString.length;
  }
  position -= searchString.length;
  const lastIndex = subjectString.lastIndexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}

export function isPromise(data: any | Promise<any> | undefined): data is Promise<any> {
  return Boolean(data && typeof (data as Promise<any>).then === 'function');
}

export function getPromiseValue<T = any>(value: T | Promise<T>, callback: (value: T) => void) {
  if (isPromise(value)) {
    value
      .then(result => {
        callback(result);
      })
      .catch((err: Error) => {
        console.error('Error:', err);
      });
  } else {
    callback(value);
  }
}

function isTouchEvent(e: TouchEvent | MouseEvent): e is TouchEvent {
  return !!(e as TouchEvent).changedTouches;
}

function getIgnoreCase(obj: any, name: string): any {
  if (obj[name]) {
    return obj[name];
  }
  const l = name.toLowerCase();
  if (obj[l]) {
    return obj[l];
  }
  const u = name.toLowerCase();
  if (obj[u]) {
    return obj[u];
  }
  for (const k in obj) {
    if (k.toLowerCase() === l) {
      return obj[k];
    }
  }
  return undefined;
}

export function toBoxArray<T>(obj: T | T[]): [T, T, T, T] {
  if (!Array.isArray(obj)) {
    return [obj /*top*/, obj /*right*/, obj /*bottom*/, obj /*left*/];
  }
  if (obj.length === 3) {
    return [obj[0] /*top*/, obj[1] /*right*/, obj[2] /*bottom*/, obj[1] /*left*/];
  }
  if (obj.length === 2) {
    return [obj[0] /*top*/, obj[1] /*right*/, obj[0] /*bottom*/, obj[1] /*left*/];
  }
  if (obj.length === 1) {
    return [obj[0] /*top*/, obj[0] /*right*/, obj[0] /*bottom*/, obj[0] /*left*/];
  }
  // return obj as [T, T, T, T];//原先这种返回方式，会造成修改引用问题
  return [obj[0] /*top*/, obj[1] /*right*/, obj[2] /*bottom*/, obj[3] /*left*/];
}

export { isNode, getChainSafe, applyChainSafe, getOrApply, getIgnoreCase, array };

export function cellInRange(range: CellRange, col: number, row: number): boolean {
  return (
    (range.start.col <= col && col <= range.end.col && range.start.row <= row && row <= range.end.row) ||
    (range.end.col <= col && col <= range.start.col && range.end.row <= row && row <= range.start.row) ||
    (range.end.col <= col && col <= range.start.col && range.start.row <= row && row <= range.end.row) ||
    (range.start.col <= col && col <= range.end.col && range.end.row <= row && row <= range.start.row)
  );
}
export function cellInRanges(ranges: CellRange[], col: number, row: number): boolean {
  // cell range may in wrong order
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    const startCol = Math.min(range.start.col, range.end.col);
    const endCol = Math.max(range.start.col, range.end.col);
    const startRow = Math.min(range.start.row, range.end.row);
    const endRow = Math.max(range.start.row, range.end.row);
    if (
      (startCol <= col && col <= endCol && startRow <= row && row <= endRow) ||
      (endCol <= col && col <= startCol && endRow <= row && row <= startRow)
    ) {
      return true;
    }
  }
  return false;
}
export function adjust(range: CellRange): CellRange {
  const start = {
    col: Math.min(range.start.col, range.end.col),
    row: Math.min(range.start.row, range.end.row)
  };
  const end = {
    col: Math.max(range.start.col, range.end.col),
    row: Math.max(range.start.row, range.end.row)
  };
  return { start, end };
}
export function rangeIntersected(range: CellRange, range1: CellRange): boolean {
  const rangeAdjust = adjust(range);
  const range1Adjust = adjust(range1);
  const col0 = Math.max(rangeAdjust.start.col, range1Adjust.start.col);
  const col1 = Math.min(rangeAdjust.end.col, range1Adjust.end.col);
  if (col0 <= col1) {
    const row0 = Math.max(rangeAdjust.start.row, range1Adjust.start.row);
    const row1 = Math.min(rangeAdjust.end.row, range1Adjust.end.row);
    if (row0 <= row1) {
      return true;
    }
  }
  return false;
}
export function rangeContained(range: CellRange, range1: CellRange): boolean {
  const rangeAdjust = adjust(range);
  const range1Adjust = adjust(range1);
  if (
    rangeAdjust.start.col <= range1Adjust.start.col &&
    rangeAdjust.end.col >= range1Adjust.end.col &&
    rangeAdjust.start.row <= range1Adjust.start.row &&
    rangeAdjust.end.row >= range1Adjust.end.row
  ) {
    return true;
  }
  return false;
}
export const browser = {
  IE,
  Edge,
  Chrome,
  Firefox,
  Safari,
  // Chrome 33554431
  // FireFox 17895588
  // IE 10737433
  heightLimit: Chrome ? 33554431 : Firefox ? 17895588 : 10737433 // default IE limit
};

export const obj = {
  isObject
};
export const str = {
  endsWith
};
export const event = {
  isTouchEvent
};
export const style = {
  toBoxArray
};
export const emptyFn = Function.prototype;

export function cellInPlaneRange(
  col: number,
  row: number,
  rangePosStart: CellPosition,
  rangePosEnd: CellPosition
): boolean {
  return (
    (rangePosStart.col <= col && col <= rangePosEnd.col && rangePosStart.row <= row && row <= rangePosEnd.row) ||
    (rangePosEnd.col <= col && col <= rangePosStart.col && rangePosEnd.row <= row && row <= rangePosStart.row)
  );
}

// 使用联合类型时  可解决不同属性调用飘红问题
export type Either<X, Y> =
  | ({
      [KX in keyof X]: X[KX];
    } & {
      [KY in Exclude<keyof Y, keyof X>]?: never;
    })
  | ({
      [KY in keyof Y]: Y[KY];
    } & {
      [KX in Exclude<keyof X, keyof Y>]?: never;
    });

/** 判断两个矩形是否相交，不包括包含关系，如果相交返回true，否则返回falses */
export function checkIntersect(
  rectA: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  },
  rectB: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }
) {
  // 判断两个矩形是否有重叠部分
  if (rectA.x2 <= rectB.x1 || rectA.x1 >= rectB.x2 || rectA.y2 <= rectB.y1 || rectA.y1 >= rectB.y2) {
    return false;
  }
  // 判断是否为包含关系
  if (
    (rectA.x1 <= rectB.x1 && rectA.x2 >= rectB.x2 && rectA.y1 <= rectB.y1 && rectA.y2 >= rectB.y2) ||
    (rectB.x1 <= rectA.x1 && rectB.x2 >= rectA.x2 && rectB.y1 <= rectA.y1 && rectB.y2 >= rectA.y2)
  ) {
    return false;
  }
  return true;
}
