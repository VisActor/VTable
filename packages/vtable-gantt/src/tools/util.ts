import { isValid } from '@visactor/vutils';

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
// export function parseDateFormat(dateString: string) {
//   const formats = [
//     'yyyy-mm-dd',
//     'dd-mm-yyyy',
//     'mm/dd/yyyy',
//     'yyyy/mm/dd',
//     'dd/mm/yyyy',
//     'yyyy.mm.dd',
//     'dd.mm.yyyy',
//     'mm.dd.yyyy'
//   ];
//   const separatorsInDate = dateString.match(/[^\w]/g);
//   for (let i = 0; i < formats.length; i++) {
//     const format = formats[i];
//     const separators = format.match(/[^\w]/g);
//     let isValidFormat = true;
//     for (let j = 0; j < separators.length; j++) {
//       const part = separators[j];
//       if (part !== separatorsInDate[j]) {
//         isValidFormat = false;
//         break;
//       }
//     }
//     if (isValidFormat) {
//       return format;
//     }
//   }

//   return null;
// }

// export function parseDate(dateString, format) {
//   // 根据解析出的格式将 dateString 解析为日期对象
//   // 这里只是一个示例，假设解析格式为 "yyyy-mm-dd"
//   const parts = dateString.split('-');
//   const year = parseInt(parts[0], 10);
//   const month = parseInt(parts[1], 10) - 1;
//   const day = parseInt(parts[2], 10);
//   return new Date(year, month, day);
// }
export function getTodayNearDay(dayOffset: number, format?: string) {
  const today = new Date();
  const todayTime = today.getTime();
  const oneDayTime = 24 * 60 * 60 * 1000;
  const targetTime = todayTime + dayOffset * oneDayTime;
  const date = new Date(targetTime);
  if (format) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    format = format.replace('yyyy', year);
    format = format.replace('mm', month);
    format = format.replace('dd', day);
    return format;
  }
  return date;
}

export function formatDate(date: Date, format: string) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  format = format.replace('yyyy', year);
  format = format.replace('mm', month);
  format = format.replace('dd', day);

  return format;
}

// 修正后的 validateDate 函数
function validateDate(dateParts: string[], format: string) {
  // 根据格式确定年、月、日的索引
  const yearIndex = format.indexOf('yyyy');
  const monthIndex = format.indexOf('mm');
  const dayIndex = format.indexOf('dd');
  const dateYearIndex = yearIndex < monthIndex ? (yearIndex < dayIndex ? 0 : 1) : monthIndex < dayIndex ? 1 : 2;
  const dateMonthIndex = monthIndex < yearIndex ? (monthIndex < dayIndex ? 0 : 1) : monthIndex < dayIndex ? 1 : 2;
  const dateDayIndex = dayIndex < yearIndex ? (dayIndex < monthIndex ? 0 : 1) : dayIndex < monthIndex ? 1 : 2;
  // 解析年、月、日
  const year = parseInt(dateParts[dateYearIndex], 10);
  const month = parseInt(dateParts[dateMonthIndex], 10) - 1; // 月份从0开始
  const day = parseInt(dateParts[dateDayIndex], 10);

  // 检查年份是否有效
  if (isNaN(year) || year < 1) {
    return false;
  }

  // 检查月份是否有效
  if (isNaN(month) || month < 0 || month > 11) {
    return false;
  }

  // 检查日期是否有效
  // 每个月的天数不同，需要考虑闰年
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (isNaN(day) || day < 1 || day > daysInMonth[month]) {
    return false;
  }

  return true;
}

// 辅助函数，用于判断是否为闰年
function isLeapYear(year: number) {
  // 能被4整除且不能被100整除，或者能被400整除的年份是闰年
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
// 修正后的 parseDateFormat 函数
export function parseDateFormat(dateString: string) {
  const formats = [
    'yyyy-mm-dd',
    'dd-mm-yyyy',
    'mm/dd/yyyy',
    'yyyy/mm/dd',
    'dd/mm/yyyy',
    'yyyy.mm.dd',
    'dd.mm.yyyy',
    'mm.dd.yyyy'
  ];
  dateString = dateString.replace(/\s+/g, ''); // 移除空格
  for (let i = 0; i < formats.length; i++) {
    const format = formats[i];
    const dateParts = dateString.split(getSeparator(format));
    const isValid = validateDate(dateParts, format);
    if (dateParts.length === 3 && isValid) {
      return format;
    }
  }
  return null;
}

// 根据日期格式获取分隔符正则表达式
function getSeparator(format: string) {
  // 找到日期格式中的分隔符
  const separators = format.match(/[^\w]/g);
  if (separators) {
    // 转义分隔符，以确保正则表达式正确处理特殊字符
    const escapedSeparators = separators.map(s => '\\' + s).join('|');
    return new RegExp(escapedSeparators, 'g');
  }
  return /[^\w]/;
}

export function parseStringTemplate(template: string, data: any) {
  const result = template.replace(/\{([^}]+)\}/g, (match, key) => {
    const keys = key.split('.');
    let value = data;

    for (const k of keys) {
      if (value.hasOwnProperty(k)) {
        value = value[k];
      } else {
        value = match; // 如果找不到对应的字段值，保持原样
        break;
      }
    }

    return value;
  });
  return result;
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

export function getWeekNumber(currentDate: Date) {
  // Calculate the week number within the year
  const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
  // 以下代码的第一个 +1 是为了处理currentDate正好是一周当中的第一天0点0分0秒的情况 ；第2个 +1 是天索引从0开始的缘故
  const weekNumber = Math.ceil(((currentDate.getTime() + 1 - startOfYear.getTime()) / 86400000 + 1) / 7);
  return weekNumber;
}

export function getWeekday(dateString: string | Date, format: 'long' | 'short' = 'long') {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(dateString);

  if (format === 'short') {
    return days[date.getDay()].substr(0, 3);
  } else if (format === 'long') {
    return days[date.getDay()];
  }
  return 'Invalid format specified. Please use "short" or "long".';
}
/** 判断对象的属性是否可写 */
export function isPropertyWritable(obj: any, prop: string | number) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  if (!descriptor) {
    // 属性不存在
    return false;
  }

  // 检查是否有 setter 方法或 writable 属性为 true
  return !!descriptor.set || descriptor.writable === true;
}

/** 创建日期 */
export function createDateAtMidnight(dateStr?: string | number | Date): Date {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
  } else {
    date = new Date();
  }
  date.setHours(0, 0, 0, 0);
  return date;
}
