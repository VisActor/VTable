import { isArray, isBoolean, isDate, isNumber, isString, isValid } from '@visactor/vutils';
import { isDataView, isHTMLElement } from './common';

/**
 * 深拷贝 spec，为避免循环引用，DataView 维持原有引用
 * @param spec 原spec
 */
export function cloneDeepSpec(spec: any, excludeKeys: string[] = ['data']) {
  const value = spec;

  let result;
  if (!isValid(value) || typeof value !== 'object') {
    return value;
  }

  // 判断是不是不能深拷贝的对象
  if (isDataView(value) || isHTMLElement(value)) {
    return value;
  }

  const isArr = isArray(value);
  const length = value.length;
  // 不考虑特殊数组的额外处理
  if (isArr) {
    result = new Array(length);
  }
  // 不考虑 buffer / arguments 类型的处理以及 prototype 的额外处理
  else if (typeof value === 'object') {
    result = {};
  }
  // 不建议使用作为 Boolean / Number / String 作为构造器
  else if (isBoolean(value) || isNumber(value) || isString(value)) {
    result = value;
  } else if (isDate(value)) {
    result = new Date(+value);
  }
  // 不考虑 ArrayBuffer / DataView / TypedArray / map / set / regexp / symbol 类型
  else {
    result = undefined;
  }

  // 不考虑 map / set / TypedArray 类型的赋值

  // 不考虑对象的 symbol 属性
  const props = isArr ? undefined : Object.keys(Object(value));

  let index = -1;
  if (result) {
    while (++index < (props || value).length) {
      const key = props ? props[index] : index;
      const subValue = value[key];
      if (excludeKeys?.includes(key.toString())) {
        result[key] = subValue;
      } else {
        result[key] = cloneDeepSpec(subValue, excludeKeys);
      }
    }
  }

  return result;
}
