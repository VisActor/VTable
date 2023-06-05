export interface NumberFormatOption {
  /**小数点后几位 */
  digitsAfterDecimal?: number;
  /**数据缩放倍数 */
  scaler?: number;
  /**千位分隔符 */
  thousandsSep?: string;
  /**小数分隔符 */
  decimalSep?: string;
  /**数据前缀 */
  prefix?: string;
  /**数据后缀 */
  suffix?: string;
}
/**
 * 对字符型数值处理，千位分隔符 小数分隔符
 * @param str
 * @param thousandsSep
 * @param decimalSep
 * @returns
 */
function numberAddSeparators(str: string, thousandsSep: string, decimalSep: string) {
  str += '';
  const strArr = str.split('.');
  let str1 = strArr[0];
  const str2 = strArr.length > 1 ? decimalSep + strArr[1] : '';
  // const regex = /(?<=\d)(?=(\d{3})+$)/g;
  // str1 = str1.replace(regex, thousandsSep);
  str1 = numFormat(str1, thousandsSep);
  return str1 + str2;
}
function numFormat(num: string, thousandsSep: string) {
  const res = num.replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return `${$1}${thousandsSep}`;
    });
  });
  return res;
}
/**
 * 对数据进行格式化
 * @param option 格式化规则参数
 * @returns
 */
export function numberFormat(option?: NumberFormatOption): (num: number) => string {
  const defaults: NumberFormatOption = {
    digitsAfterDecimal: 2,
    scaler: 1,
    thousandsSep: ',',
    decimalSep: '.',
    prefix: '',
    suffix: ''
  };
  option = Object.assign({}, defaults, option);
  return function (num: number) {
    if (isNaN(num) || !isFinite(num)) {
      return '';
    }
    const result = numberAddSeparators(
      (option.scaler * num).toFixed(option.digitsAfterDecimal),
      option.thousandsSep,
      option.decimalSep
    );
    return `${option.prefix}${result}${option.suffix}`;
  };
}

export function dateFormat(
  baseField: string,
  formatString: string,
  utcOutput: boolean,
  mthNames?: string[],
  dayNames?: string[]
): (record: Record<string, any>) => string {
  const mthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  if (utcOutput === null || utcOutput === undefined) {
    utcOutput = false;
  }
  if (mthNames === null || mthNames === undefined) {
    mthNames = mthNamesEn;
  }
  if (dayNames === null || dayNames === undefined) {
    dayNames = dayNamesEn;
  }
  const utc = utcOutput ? 'UTC' : '';
  const zeroPad = function (number: number) {
    return `0${number}`.substring(0, 2);
  };
  return function (record) {
    const date = new Date(Date.parse(record[baseField]));
    return formatString.replace(/%(.)/g, function (m: any, p: any): any {
      switch (p) {
        case 'y':
          return date[`get${utc}FullYear`]();
        case 'm':
          return zeroPad(date[`get${utc}Month`]() + 1);
        case 'n':
          return mthNames[date[`get${utc}Month`]()];
        case 'd':
          return zeroPad(date[`get${utc}Date`]());
        case 'w':
          return dayNames[date[`get${utc}Day`]()];
        case 'x':
          return date[`get${utc}Day`]();
        case 'H':
          return zeroPad(date[`get${utc}Hours`]());
        case 'M':
          return zeroPad(date[`get${utc}Minutes`]());
        case 'S':
          return zeroPad(date[`get${utc}Seconds`]());
        default:
          return `%${p}`;
      }
    });
  };
}
// export const defaultNumberFormat = numberFormat();
