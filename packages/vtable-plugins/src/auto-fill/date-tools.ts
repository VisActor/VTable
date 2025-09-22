import { TimeUtil } from '@visactor/vutils';

/**
 * 检查日期是否有效
 * @param date 待检查的日期
 * @returns 是否有效
 */
export function isValid(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 计算两个日期之间的天数差
 * @param dateLeft 较早的日期
 * @param dateRight 较晚的日期
 * @returns 天数差（dateRight - dateLeft）
 */
export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  if (!isValid(dateLeft) || !isValid(dateRight)) {
    throw new Error('Invalid date passed to differenceInDays');
  }

  // 转换为UTC时间戳（忽略时分秒影响）
  const leftTime = Date.UTC(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate());

  const rightTime = Date.UTC(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate());

  // 一天的毫秒数：86400000 = 24 * 60 * 60 * 1000
  return Math.floor((rightTime - leftTime) / 86400000);
}

/**
 * 给日期增加指定天数
 * @param date 基础日期
 * @param amount 要增加的天数
 * @returns 新的日期对象
 */
export function addDays(date: Date, amount: number): Date {
  if (!isValid(date)) {
    throw new Error('Invalid date passed to addDays');
  }

  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount);
  return newDate;
}

/**
 * 解析日期字符串为Date对象
 * @param dateString 日期字符串
 * @param format 格式字符串（支持yyyy、MM、dd、M、d）
 * @param referenceDate 参考日期（用于补全缺失信息）
 * @returns 解析后的Date对象
 */
export function parse(dateString: string, format: string, referenceDate: Date = new Date()): Date {
  // 提取格式中的日期部分
  const yearMatch = format.match(/y+/);
  const monthMatch = format.match(/M+/);
  const dayMatch = format.match(/d+/);

  if (!yearMatch || !monthMatch || !dayMatch) {
    throw new Error('Format string must contain yyyy, MM (or M), and dd (or d)');
  }

  // 提取日期字符串中的对应部分
  const yearIndex = format.indexOf(yearMatch[0]);
  const monthIndex = format.indexOf(monthMatch[0]);
  const dayIndex = format.indexOf(dayMatch[0]);

  const year = parseInt(dateString.substring(yearIndex, yearIndex + yearMatch[0].length), 10);
  const month = parseInt(dateString.substring(monthIndex, monthIndex + monthMatch[0].length), 10) - 1; // 月份从0开始
  const day = parseInt(dateString.substring(dayIndex, dayIndex + dayMatch[0].length), 10);

  // 处理可能的年份简写（如"24"解析为2024）
  const fullYear = year < 100 ? 2000 + year : year;

  const date = new Date(fullYear, month, day);

  // 验证解析结果是否正确（处理无效日期如2月30日）
  if (date.getFullYear() !== fullYear || date.getMonth() !== month || date.getDate() !== day) {
    return new Date(NaN); // 返回无效日期
  }

  return date;
}

/**
 * 格式化日期为指定字符串
 * @param date 日期对象
 * @param format 格式字符串（支持yyyy、MM、dd、M、d）
 * @returns 格式化后的字符串
 */
export function format(date: Date, format: string): string {
  if (!isValid(date)) {
    throw new Error('Invalid date passed to format');
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从1开始
  const day = date.getDate();

  // 替换格式中的占位符
  return format
    .replace('yyyy', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('M', month.toString())
    .replace('dd', day.toString().padStart(2, '0'))
    .replace('d', day.toString());
}
