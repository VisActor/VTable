import { isValid } from '@visactor/vutils';
import { DayTimes } from '../gantt-helper';

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
  if (format.length > 10) {
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    format = format.replace('hh', hour);
    format = format.replace('mm', minute);
    format = format.replace('ss', second);
  }

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
// 修正后的 validateDate 函数
function validateTime(dateParts: string[], format: string) {
  // 如果格式包含时分秒，则进一步解析和验证
  if (format.includes('hh') || format.includes('mm') || format.includes('ss')) {
    const timeIndex = format.indexOf('hh') > -1 ? format.indexOf('hh') : format.indexOf('HH');
    const hour = parseInt(dateParts[timeIndex], 10);
    const minute = parseInt(dateParts[timeIndex + 1], 10);
    const second = dateParts.length > timeIndex + 2 ? parseInt(dateParts[timeIndex + 2], 10) : 0;

    if (isNaN(hour) || hour < 0 || hour > 23) {
      return false;
    }

    if (isNaN(minute) || minute < 0 || minute > 59) {
      return false;
    }

    if (isNaN(second) || second < 0 || second > 59) {
      return false;
    }
  }

  return true;
}
// 辅助函数，用于判断是否为闰年
function isLeapYear(year: number) {
  // 能被4整除且不能被100整除，或者能被400整除的年份是闰年
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// // 修正后的 parseDateFormat 函数
// export function parseDateFormat(dateString: string) {
//   const formats = [
//     'yyyy-mm-dd',
//     'dd-mm-yyyy',
//     'mm/dd/yyyy',
//     'yyyy/mm/dd',
//     'dd/mm/yyyy',
//     'yyyy.mm.dd',
//     'mm.dd.yyyy',
//     'dd.mm.yyyy'
//   ];
//   dateString = dateString.replace(/\s+/g, ''); // 移除空格
//   for (let i = 0; i < formats.length; i++) {
//     const format = formats[i];
//     const dateParts = dateString.split(getSeparator(format));
//     const isValid = validateDate(dateParts, format);
//     if (dateParts.length === 3 && isValid) {
//       return format;
//     }
//   }
//   return null;
// }

// 修正后的 parseDateFormat 函数
export function parseDateFormat(dateString: string) {
  const formats = [
    'yyyy-mm-dd',
    'dd-mm-yyyy',
    'mm/dd/yyyy',
    'yyyy/mm/dd',
    'dd/mm/yyyy',
    'yyyy.mm.dd',
    'mm.dd.yyyy',
    'dd.mm.yyyy'
  ];
  const timeFormat = ['hh:mm:ss', 'hh:mm'];
  dateString = dateString.trim(); // 移除空格
  const dates = dateString.split(' ');
  const date = dates[0];
  const time = dates[1];
  let dateFormatMatched;
  let timeFormatMatched;
  if (date) {
    for (let i = 0; i < formats.length; i++) {
      const format = formats[i];
      const dateParts = date.split(getSeparator(format));
      const isValid = validateDate(dateParts, format);
      if (dateParts.length === 3 && isValid) {
        dateFormatMatched = format;
        break;
      }
    }
  }
  if (dateFormatMatched) {
    if (time) {
      for (let i = 0; i < timeFormat.length; i++) {
        const format = timeFormat[i];
        const timeParts = time.split(getSeparator(format));
        const formatParts = format.split(getSeparator(format));
        const isValid = validateTime(timeParts, format);
        if (isValid && timeParts.length === formatParts.length) {
          timeFormatMatched = format;
          break;
        }
      }
    }
  }
  if (date && time && dateFormatMatched && timeFormatMatched) {
    return dateFormatMatched + ' ' + timeFormatMatched;
  }
  if (date && !time) {
    return dateFormatMatched;
  }
  return 'yyyy-mm-dd hh:mm:ss';
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
export function createDateAtMidnight(dateStr?: string | number | Date, forceMidnight: boolean = false): Date {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
    if (typeof dateStr === 'string') {
      if (dateStr.length > 10) {
        if (forceMidnight) {
          date.setHours(0, 0, 0, 0);
        }
        // 如果 dateStr 是字符串类型且包含时分秒，不需要设置为午夜
        return date;
      }
      date.setHours(0, 0, 0, 0);
    }
  } else {
    date = new Date();
  }
  if (forceMidnight) {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}
export function createDateAtLastMinute(dateStr?: string | number | Date, forceSetMinute: boolean = false): Date {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
    if (typeof dateStr === 'string') {
      if (dateStr.length > 10) {
        if (forceSetMinute) {
          date.setMinutes(59, 59, 999);
        }
        // 如果 dateStr 是字符串类型且包含时分秒，不需要设置为午夜
        return date;
      }
      date.setMinutes(59, 59, 999);
    }
  } else {
    date = new Date();
  }
  if (forceSetMinute) {
    date.setMinutes(59, 59, 999);
  }
  return date;
}

export function createDateAtLastSecond(dateStr?: string | number | Date, forceSetSecond: boolean = false): Date {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
    if (typeof dateStr === 'string') {
      if (dateStr.length > 10) {
        if (forceSetSecond) {
          date.setSeconds(59, 999);
        }
        // 如果 dateStr 是字符串类型且包含时分秒，不需要设置为午夜
        return date;
      }
      date.setSeconds(59, 999);
    }
  } else {
    date = new Date();
  }
  if (forceSetSecond) {
    date.setSeconds(59, 999);
  }
  return date;
}

export function createDateAtLastMillisecond(
  dateStr?: string | number | Date,
  forceSetMillisecond: boolean = false
): Date {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
    if (typeof dateStr === 'string') {
      if (dateStr.length > 10) {
        if (forceSetMillisecond) {
          date.setMilliseconds(999);
        }
        // 如果 dateStr 是字符串类型且包含时分秒，不需要设置为午夜
        return date;
      }
      date.setMilliseconds(999);
    }
  } else {
    date = new Date();
  }
  if (forceSetMillisecond) {
    date.setMilliseconds(999);
  }
  return date;
}
/** 创建日期 */
export function createDateAtLastHour(dateStr?: string | number | Date, forceLastHour: boolean = false): Date {
  let date;
  if (dateStr) {
    date = new Date(dateStr);
    if (typeof dateStr === 'string') {
      if (dateStr.length > 10) {
        if (forceLastHour) {
          date.setHours(23, 59, 59, 999);
        }
        // 如果 dateStr 是字符串类型且包含时分秒，不需要设置为午夜
        return date;
      }
      date.setHours(23, 59, 59, 999);
    }
  } else {
    date = new Date();
  }
  if (forceLastHour) {
    date.setHours(23, 59, 59, 999);
  }
  return date;
}

export function getEndDateByTimeUnit(
  startDate: Date,
  date: Date,
  timeScale: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second',
  step: number
) {
  let endDate = new Date(date);

  switch (timeScale) {
    case 'second':
      endDate.setMilliseconds(999);
      break;
    case 'minute':
      endDate.setSeconds(59, 999);
      break;
    case 'hour':
      endDate.setMinutes(59, 59, 999);
      break;
    case 'day':
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      const day = endDate.getDay();
      const diffToEndOfWeek = 6 - day;
      endDate.setDate(endDate.getDate() + diffToEndOfWeek);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'month':
      const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
      endDate.setDate(lastDayOfMonth);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'quarter':
      const currentMonth = endDate.getMonth();
      const endMonthOfQuarter = currentMonth - (currentMonth % 3) + 2;
      const lastDayOfQuarter = new Date(endDate.getFullYear(), endMonthOfQuarter + 1, 0).getDate();
      endDate.setMonth(endMonthOfQuarter, lastDayOfQuarter);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'year':
      endDate.setMonth(11, 31);
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error('Invalid time scale');
  }

  const count = computeCountToTimeScale(endDate, startDate, timeScale, step, 1);
  const targetCount = Math.ceil(count);
  if (targetCount > count) {
    const dif = (targetCount - count) * step;
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;
    const msInWeek = msInDay * 7;
    const adjusted_date = new Date(endDate.getTime() + 1);
    switch (timeScale) {
      case 'second':
        endDate.setTime(endDate.getTime() + dif * msInSecond);
        break;
      case 'minute':
        endDate.setTime(endDate.getTime() + dif * msInMinute);
        break;
      case 'hour':
        endDate.setTime(endDate.getTime() + dif * msInHour);
        break;
      case 'day':
        endDate.setTime(endDate.getTime() + dif * msInDay);
        break;
      case 'week':
        endDate.setTime(endDate.getTime() + dif * msInWeek);
        break;
      case 'month':
        endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1 + Math.round(dif), 0);
        // endDate.setTime(lastDayOfMonth);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'quarter':
        const currentMonth = endDate.getMonth();
        const endMonthOfQuarter = currentMonth - (currentMonth % 3) + 2;
        endDate = new Date(endDate.getFullYear(), endMonthOfQuarter + Math.round(dif * 3) + 1, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'year':
        endDate.setFullYear(endDate.getFullYear() + Math.floor(dif));
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        throw new Error('Invalid time scale');
    }
  }

  return endDate;
}

// export function getEndDateByTimeUnit(
//   startDate: Date,
//   date: Date,
//   timeScale: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second',
//   step: number
// ): Date {
//   const count = computeCountToTimeScale(date, startDate, timeScale, step);
//   const targetCount = Math.ceil(count);
//   debugger;
//   const endDate = new Date(startDate);

//   switch (timeScale) {
//     case 'second':
//       endDate.setSeconds(endDate.getSeconds() + targetCount * step);
//       endDate.setMilliseconds(999);
//       break;
//     case 'minute':
//       endDate.setMinutes(endDate.getMinutes() + targetCount * step);
//       endDate.setSeconds(59, 999);
//       break;
//     case 'hour':
//       endDate.setHours(endDate.getHours() + targetCount * step);
//       endDate.setMinutes(59, 59, 999);
//       break;
//     case 'day':
//       endDate.setDate(endDate.getDate() + targetCount * step);
//       endDate.setHours(23, 59, 59, 999);
//       break;
//     case 'week':
//       endDate.setDate(endDate.getDate() + targetCount * step * 7);
//       endDate.setHours(23, 59, 59, 999);
//       break;
//     case 'month':
//       endDate.setMonth(endDate.getMonth() + targetCount * step);
//       const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
//       endDate.setDate(lastDayOfMonth);
//       endDate.setHours(23, 59, 59, 999);
//       break;
//     case 'quarter':
//       endDate.setMonth(endDate.getMonth() + targetCount * step * 3);
//       const lastDayOfQuarter = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
//       endDate.setDate(lastDayOfQuarter);
//       endDate.setHours(23, 59, 59, 999);
//       break;
//     case 'year':
//       endDate.setFullYear(endDate.getFullYear() + targetCount * step);
//       endDate.setMonth(11, 31);
//       endDate.setHours(23, 59, 59, 999);
//       break;
//     default:
//       throw new Error('Invalid time scale');
//   }

//   return endDate;
// }

export function getStartDateByTimeUnit(
  date: Date,
  timeScale: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second',
  startOfWeekSetting = 'monday'
): Date {
  const startDate = new Date(date);

  switch (timeScale) {
    case 'second':
      startDate.setMilliseconds(0);
      break;
    case 'minute':
      startDate.setSeconds(0, 0);
      break;
    case 'hour':
      startDate.setMinutes(0, 0, 0);
      break;
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      const day = startDate.getDay();
      let diffToStartOfWeek = day;
      if (startOfWeekSetting === 'monday') {
        diffToStartOfWeek = day === 0 ? -6 : 1 - day; // Adjusting for Sunday as the start of the week
      } else {
        diffToStartOfWeek = -day;
      }

      startDate.setDate(startDate.getDate() + diffToStartOfWeek);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'quarter':
      const currentMonth = startDate.getMonth();
      const startMonthOfQuarter = currentMonth - (currentMonth % 3);
      startDate.setMonth(startMonthOfQuarter, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'year':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      throw new Error('Invalid time scale');
  }

  return startDate;
}

export function computeCountToTimeScale(
  date: Date,
  startDate: Date,
  timeScale: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second',
  step: number,
  diffMS: number = 0
): number {
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;
  const msInWeek = msInDay * 7;

  let difference: number;
  const adjusted_date = new Date(date.getTime() + diffMS);
  switch (timeScale) {
    case 'second':
      difference = (adjusted_date.getTime() - startDate.getTime()) / msInSecond;
      break;
    case 'minute':
      difference = (adjusted_date.getTime() - startDate.getTime()) / msInMinute;
      break;
    case 'hour':
      difference = (adjusted_date.getTime() - startDate.getTime()) / msInHour;
      break;
    case 'day':
      difference = (adjusted_date.getTime() - startDate.getTime()) / msInDay;
      break;
    case 'week':
      difference = (adjusted_date.getTime() - startDate.getTime()) / msInWeek;
      break;
    case 'month':
      difference =
        (adjusted_date.getFullYear() - startDate.getFullYear()) * 12 +
        (adjusted_date.getMonth() - startDate.getMonth());
      difference +=
        (adjusted_date.getDate() - startDate.getDate()) /
        new Date(adjusted_date.getFullYear(), adjusted_date.getMonth() + 1, 0).getDate();
      break;
    case 'quarter':
      difference =
        (adjusted_date.getFullYear() - startDate.getFullYear()) * 4 +
        Math.floor(adjusted_date.getMonth() / 3) -
        Math.floor(startDate.getMonth() / 3);
      difference +=
        (adjusted_date.getTime() - startDate.getTime()) /
        DayTimes /
        (3 * new Date(adjusted_date.getFullYear(), adjusted_date.getMonth() + 1, 0).getDate());
      break;
    case 'year':
      difference = adjusted_date.getFullYear() - startDate.getFullYear();
      difference += (adjusted_date.getMonth() - startDate.getMonth()) / 12;
      break;
    default:
      throw new Error('Invalid time scale');
  }

  return difference / step;
}

/** 暂时没有用上  函数为了解析日期的余数 */
export function parseDateToTimeUnit(
  date: Date,
  timeUnit: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second'
): number {
  const millisecondsInSecond = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;
  const daysInWeek = 7;
  const monthsInYear = 12;
  const quartersInYear = 4;

  const millisecondsInMinute = millisecondsInSecond * secondsInMinute;
  const millisecondsInHour = millisecondsInMinute * minutesInHour;
  const millisecondsInDay = millisecondsInHour * hoursInDay;
  const millisecondsInWeek = millisecondsInDay * daysInWeek;
  const millisecondsInMonth = millisecondsInDay * (365.25 / monthsInYear); // 近似值
  const millisecondsInQuarter = millisecondsInMonth * (monthsInYear / quartersInYear); // 近似值
  const millisecondsInYear = millisecondsInDay * 365.25; // 近似值
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  switch (timeUnit) {
    case 'second':
      return date.getMilliseconds() / millisecondsInSecond;
    case 'minute':
      return (date.getSeconds() + date.getMilliseconds() / millisecondsInSecond) / secondsInMinute;
    case 'hour':
      return (
        (date.getMinutes() * secondsInMinute + date.getSeconds() + date.getMilliseconds() / millisecondsInSecond) /
        (minutesInHour * secondsInMinute)
      );
    case 'day':
      return (
        (date.getHours() * minutesInHour * secondsInMinute +
          date.getMinutes() * secondsInMinute +
          date.getSeconds() +
          date.getMilliseconds() / millisecondsInSecond) /
        (hoursInDay * minutesInHour * secondsInMinute)
      );
    case 'week':
      return (
        (date.getDay() * hoursInDay * minutesInHour * secondsInMinute +
          date.getHours() * minutesInHour * secondsInMinute +
          date.getMinutes() * secondsInMinute +
          date.getSeconds() +
          date.getMilliseconds() / millisecondsInSecond) /
        (daysInWeek * hoursInDay * minutesInHour * secondsInMinute)
      );
    case 'month':
      return (
        ((date.getDate() - 1) * hoursInDay * minutesInHour * secondsInMinute +
          date.getHours() * minutesInHour * secondsInMinute +
          date.getMinutes() * secondsInMinute +
          date.getSeconds() +
          date.getMilliseconds() / millisecondsInSecond) /
        (daysInMonth * hoursInDay * minutesInHour * secondsInMinute)
      );
    case 'quarter':
      const monthInQuarter = date.getMonth() % 3;
      const daysInQuarter = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() * 3;
      return (
        ((monthInQuarter * daysInMonth + date.getDate() - 1) * hoursInDay * minutesInHour * secondsInMinute +
          date.getHours() * minutesInHour * secondsInMinute +
          date.getMinutes() * secondsInMinute +
          date.getSeconds() +
          date.getMilliseconds() / millisecondsInSecond) /
        (daysInQuarter * hoursInDay * minutesInHour * secondsInMinute)
      );
    case 'year':
      const daysInYear = isLeapYear(date.getFullYear()) ? 366 : 365;
      return (
        ((date.getMonth() * daysInMonth + date.getDate() - 1) * hoursInDay * minutesInHour * secondsInMinute +
          date.getHours() * minutesInHour * secondsInMinute +
          date.getMinutes() * secondsInMinute +
          date.getSeconds() +
          date.getMilliseconds() / millisecondsInSecond) /
        (daysInYear * hoursInDay * minutesInHour * secondsInMinute)
      );
    default:
      throw new Error('Invalid time unit');
  }
}

// // 示例用法
// const date = new Date('2024-07-04T17:20:30');
// const timeUnit = 'hour';
// const result = parseDateToTimeUnit(date, timeUnit);
// console.log(result); // 输出相对于小时的时间差值
