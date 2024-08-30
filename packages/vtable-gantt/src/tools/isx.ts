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
