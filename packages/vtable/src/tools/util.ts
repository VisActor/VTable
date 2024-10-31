import { isValid } from '@visactor/vutils';
import type { SortOrder } from '../ts-types';

export const judgeType = (value: any) => {
  switch (Object.prototype.toString.call(value)) {
    case '[object Object]':
      return 'object';
    case '[object Function]':
      return 'function';
    case '[object Array]':
      return 'array';
    case '[object String]':
      return 'string';
    case '[object Number]':
      return 'number';
    case '[object RegExp]':
      return 'regExp';
    case '[object Boolean]':
      return 'boolean';
    case '[object Symbol]':
      return 'symbol';
    case '[object Date]':
      return 'date';
    case '[object Undefined]':
      return 'undefined';
    case '[object Null]':
      return 'null';
    case '[object Error]':
      return 'error';
    case '[object HTMLDocument]':
      return 'document';
    case '[object global]':
      return 'global'; // window 是全局对象 global 的引用
    default:
      return null;
  }
};

export const isIt = (v: any, type: string): boolean => judgeType(v) === type;

export const isObject = (v: any): boolean => isIt(v, 'object');
export const isFunction = (v: any): boolean => isIt(v, 'function');
export const isArray = (v: any): boolean => isIt(v, 'array');
export const isString = (v: any): boolean => isIt(v, 'string');
export const isNumber = (v: any): boolean => isIt(v, 'number');
export const isRegExp = (v: any): boolean => isIt(v, 'regExp');
export const isBoolean = (v: any): boolean => isIt(v, 'boolean');
export const isSymbol = (v: any): boolean => isIt(v, 'symbol');
export const isDate = (v: any): boolean => isIt(v, 'date');
export const isUndefined = (v: any): boolean => isIt(v, 'undefined');
export const isNull = (v: any): boolean => isIt(v, 'null');
export const isError = (v: any): boolean => isIt(v, 'error');
export const isDocument = (v: any): boolean => isIt(v, 'document');
export const isGlobal = (v: any): boolean => isIt(v, 'global');

export function merge(target: any, ...sources: any[]): any {
  if (!sources.length) {
    return target || {};
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        if (!isObject(target[key])) {
          Object.assign(target, { [key]: source[key] });
        }
        merge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return merge(target, ...sources);
}
export function ingoreNoneValueMerge(target: any, ...sources: any[]): any {
  if (!sources.length) {
    return target || {};
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        if (!isObject(target[key])) {
          Object.assign(target, { [key]: source[key] });
        }
        ingoreNoneValueMerge(target[key], source[key]);
      } else if (source[key] !== null && source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return ingoreNoneValueMerge(target, ...sources);
}

// 使用vutils库中的cloneDeep
// export function cloneDeep(item: any) {
//   if (!item) {
//     return item;
//   } // null, undefined values check

//   const types = [Number, String, Boolean];
//   let result: any;

//   // normalizing primitives if someone did new String('aaa'), or new Number('444');
//   types.forEach(function (type) {
//     if (item instanceof type) {
//       result = type(item);
//     }
//   });

//   if (typeof result === 'undefined') {
//     if (Object.prototype.toString.call(item) === '[object Array]') {
//       result = [];
//       item.forEach(function (child: any, index: number) {
//         result[index] = cloneDeep(child);
//       });
//     } else if (typeof item === 'object') {
//       // testing that this is DOM
//       if (item.nodeType && typeof item.cloneNode === 'function') {
//         result = item.cloneNode(true);
//       } else if (!item.prototype) {
//         // check that this is a literal
//         if (item instanceof Date) {
//           result = new Date(item);
//         } else if (item.clone) {
//           result = item.clone();
//         } else {
//           // it is an object literal
//           result = {};
//           for (const i in item) {
//             result[i] = cloneDeep(item[i]);
//           }
//         }
//       } else {
//         // depending what you would like here,
//         // just keep the reference, or create new object
//         if (item.constructor) {
//           // would not advice to do that, reason? Read below
//           result = new item.constructor();
//         } else {
//           result = item;
//         }
//       }
//     } else {
//       result = item;
//     }
//   }

//   return result;
// }

export function convertInternal(value: unknown): string {
  if (typeof value === 'function') {
    value = value();
  }
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  return isValid(value) ? `${value}` : '';
}
/**
 * 返回 matrix 的 转置矩阵
 * @param matrix
 * @returns
 */
export function transpose(matrix: Array<Array<any>>) {
  if (matrix?.length <= 0) {
    return matrix;
  }
  const m = matrix.length;
  const n = matrix[0].length;
  const transposed = new Array(n);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (!transposed[j]) {
        transposed[j] = new Array(m);
      }
      transposed[j][i] = matrix[i][j];
    }
  }
  return transposed;
}

export function debounce(fn: Function, delay: number, immediate = false) {
  let timer: any;
  let result: any;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      // 如果timer存在，说明第二次调用的时候还没到delay时间，因为如果超过delay时间
      // timer会被赋值为0，所以这个时候我们不应该执行fn，应该重新设置一个定时器
      // 但如果是一次的时候，因为还没有设过定时器，所以这里timer会是undefined
      if (timer) {
        timer = setTimeout(() => (timer = 0), delay);
      } else {
        result = fn.apply(this, args);
        return result;
      }
    } else {
      timer = setTimeout(() => fn.apply(this, args), delay);
    }
  };
}
/**
 * throttle 保障了首次立即执行 后续触发的回调执行间隔delay时间 区别于throttle2 最后执行时机会提前
 * @param { Function } func 执行函数
 * @param { Interger } time 多长时间内不能第二次执行
 * @returns function 返回经过节流处理的函数
 */
export function throttle(func: Function, delay: number) {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    // let args=arguments 也可以写成这种或...args也是代表我们传过来的实参
    if (!timer) {
      func.apply(this, args); //先执行函数,保证第一次立即执行
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    }
    // console.log('throttle');
    // 当我们第一次触发事件，定时器不存在时就执行函数，当我们再次点击时，因为定时器存在，
    // 所以无法再进入函数调用(无论事件如何执行),那么只能等定时器事件结束，
    // 我们让timer=null，回到第一次的状态,就又重新开始新的一轮
  };
}
/**
 * throttle节流 间隔delay时间后执行 保障了最后执行时机是在delay之后
 * @param { Function } func 执行函数
 * @param { Interger } time 多长时间内不能第二次执行
 * @returns function 返回经过节流处理的函数
 */
export function throttle2(func: Function, delay: number) {
  let timer: any = null;
  return function (this: any, ...args: any[]) {
    // let args=arguments 也可以写成这种或...args也是代表我们传过来的实参
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}

function pad(num: string, totalChars: number) {
  const pad = '0';
  num = `${num}`;
  while (num.length < totalChars) {
    num = pad + num;
  }
  return num;
}
/**
 * 在某个颜色的基础上 获取变暗或者变亮的颜色
 * @param color 基础颜色值
 * @param ratio  Ratio is between 0 and 1
 * @param isDarker 是否获取变暗的颜色
 * @returns
 */
export function changeColor(color: string, ratio: number, isDarker: boolean) {
  // Trim trailing/leading whitespace
  color = color.replace(/^\s*|\s*$/, '');

  // Expand three-digit hex
  color = color.replace(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i, '#$1$1$2$2$3$3');

  // Calculate ratio
  const difference = Math.round(ratio * 256) * (isDarker ? -1 : 1);
  // Determine if input is RGB(A)
  const rgb = color.match(
    new RegExp(
      '^rgba?\\(\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '\\s*,\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '\\s*,\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '(?:\\s*,\\s*' +
        '(0|1|0?\\.\\d+))?' +
        '\\s*\\)$',
      'i'
    )
  );
  const alpha = !!rgb && isValid(rgb[4]) ? rgb[4] : null;
  // Convert hex to decimal
  const decimal = rgb
    ? [rgb[1], rgb[2], rgb[3]]
    : color
        .replace(/^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i, function () {
          return `${parseInt(arguments[1], 16)},${parseInt(arguments[2], 16)},${parseInt(arguments[3], 16)}`;
        })
        .split(/,/);

  // Return RGB(A)
  return rgb
    ? `rgb${alpha !== null ? 'a' : ''}(${Math[isDarker ? 'max' : 'min'](
        parseInt(decimal[0], 10) + difference,
        isDarker ? 0 : 255
      )}, ${Math[isDarker ? 'max' : 'min'](parseInt(decimal[1], 10) + difference, isDarker ? 0 : 255)}, ${Math[
        isDarker ? 'max' : 'min'
      ](parseInt(decimal[2], 10) + difference, isDarker ? 0 : 255)}${alpha !== null ? `, ${alpha}` : ''})`
    : // Return hex
      [
        '#',
        pad(Math[isDarker ? 'max' : 'min'](parseInt(decimal[0], 10) + difference, isDarker ? 0 : 255).toString(16), 2),
        pad(Math[isDarker ? 'max' : 'min'](parseInt(decimal[1], 10) + difference, isDarker ? 0 : 255).toString(16), 2),
        pad(Math[isDarker ? 'max' : 'min'](parseInt(decimal[2], 10) + difference, isDarker ? 0 : 255).toString(16), 2)
      ].join('');
}
/**
 * 解决加减出现很多小数位的问题
 * @param n
 * @param fixed
 * @returns
 */
export function toFixed(n: number, fixed = 0) {
  return parseFloat(n.toFixed(fixed));
}

export function validToString(v: any) {
  if (isString(v) || isNumber(v) || isBoolean(v)) {
    return v.toString();
  }
  return '';
}
export function isMobile() {
  return navigator.userAgent.match(
    // eslint-disable-next-line max-len
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  );
}
export function defaultOrderFn(v1: any, v2: any, order: SortOrder): -1 | 0 | 1 {
  if (order !== 'desc') {
    return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
  }
  return v1 === v2 ? 0 : v1 < v2 ? 1 : -1;
}
/**
 * 针对一个具有多级结构的对象，根据层级路径获取到具体值
 * @param obj
 * @param paths
 * @returns
 */
export function getValueByPath(obj: any, paths: string[]) {
  let res = obj;
  let prop;
  while ((prop = paths.shift())) {
    res = res[prop];
    if (!res) {
      break;
    }
  }
  return res;
}
export function inBound(
  { x, y }: { x: number; y: number },
  { left, top, width, height }: { left: number; top: number; width: number; height: number }
) {
  if (x > left && x < left + width && y > top && y < top + height) {
    return true;
  }
  return false;
}

export const isArrEqual = (arr1: Array<any>, arr2: Array<any>) => {
  return arr1.length === arr2.length && arr1.every((ele, index) => Object.is(ele, arr2[index]));
};
/**
 * 根据string生成hash值
 * @param input
 * @returns
 */
export function hashCode(input: string) {
  const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('');
  let hash = 5381;
  let i = input.length - 1;

  for (; i > -1; i--) {
    hash += (hash << 5) + input.charCodeAt(i);
  }

  let value = hash & 0x7fffffff;

  let retValue = '';
  do {
    retValue += I64BIT_TABLE[value & 0x3f];
  } while ((value >>= 6));
  return retValue;
}

export function toBoolean(val: unknown): boolean {
  if (typeof val === 'string') {
    if (val === 'false') {
      return false;
    } else if (val === 'off') {
      return false;
    } else if (/^0+$/.exec(val)) {
      return false;
    }
  }
  return Boolean(val);
}

export function isAllDigits(str: string) {
  const pattern = /^-?\d+(\.\d+)?$/;
  return pattern.test(str);
}
// array deduplication
export function deduplication(array: number[]) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (result.indexOf(array[i]) === -1) {
      result.push(array[i]);
    }
  }
  return result;
}

/** 判断div中的文本是否有被选中 */
export function isDivSelected(div: HTMLDivElement) {
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    return range.endOffset > range.startOffset && div.contains(range.commonAncestorContainer);
  }
  return false;
}

export function traverseObject(obj: any, childrenProperty: string, callback: Function) {
  callback(obj);

  if (obj?.[childrenProperty] && Array.isArray(obj?.[childrenProperty])) {
    obj[childrenProperty].forEach((child: any) => traverseObject(child, childrenProperty, callback));
  }
}
