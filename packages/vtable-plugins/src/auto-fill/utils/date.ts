/**
 * 解析日期字符串为Date对象
 * 支持更多日期格式，与日期转换器中的格式规则对应
 * @param dateString 日期字符串
 * @param formatString 格式字符串
 * @param referenceDate 解析失败时返回的参考日期
 * @returns 解析后的Date对象
 */
export function parse(dateString: string, formatString: string, referenceDate: Date = new Date()): Date {
  // 移除可能的空白字符
  const str = dateString.trim();

  // 处理 yyyy-MM-dd 格式 (如: 2023-12-31)
  if (formatString === 'yyyy-MM-dd') {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // 处理 yyyy-M-d 格式 (如: 2023-3-5)
  if (formatString === 'yyyy-M-d') {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // 处理 yyyy/MM/dd 格式 (如: 2023/12/31)
  if (formatString === 'yyyy/MM/dd') {
    const [year, month, day] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // 处理 yyyy/M/d 格式 (如: 2023/3/5)
  if (formatString === 'yyyy/M/d') {
    const [year, month, day] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // 处理 MM/dd/yyyy 格式 (如: 12/31/2023)
  if (formatString === 'MM/dd/yyyy') {
    const [month, day, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  // 处理 yyyy年M月d日 格式 (如: 2023年3月5日 或 2023年12月31日)
  if (formatString === 'yyyy年M月d日') {
    const match = str.match(/^(\d{4})年(\d{1,2})月(\d{1,2})(日)?$/);
    if (match) {
      return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
  }

  // 尝试通用解析（作为后备）
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  // 所有解析方法都失败时返回参考日期
  return new Date(referenceDate);
}

/**
 * 检查日期是否有效
 * @param date 要检查的日期
 * @returns 日期是否有效的布尔值
 */
export function isValid(date: Date): boolean {
  return !isNaN(date.getTime());
}

/**
 * 计算两个日期之间的天数差
 * @param dateLeft 第一个日期
 * @param dateRight 第二个日期
 * @returns 两个日期之间的天数差
 */
export function differenceInDays(dateLeft: Date, dateRight: Date): number {
  // 转换为UTC时间以避免时区问题
  const leftTime = Date.UTC(dateLeft.getFullYear(), dateLeft.getMonth(), dateLeft.getDate());
  const rightTime = Date.UTC(dateRight.getFullYear(), dateRight.getMonth(), dateRight.getDate());

  // 计算毫秒差并转换为天数
  const diffTime = leftTime - rightTime;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 给日期增加指定天数
 * @param date 基础日期
 * @param amount 要增加的天数
 * @returns 增加天数后的新日期
 */
export function addDays(date: Date, amount: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount);
  return newDate;
}

/**
 * 格式化日期为字符串
 * @param date 要格式化的日期
 * @param formatString 格式字符串
 * @returns 格式化后的日期字符串
 */
export function format(date: Date, formatString: string): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 辅助函数：数字补零
  const pad = (num: number) => num.toString().padStart(2, '0');

  // 处理几种常见格式
  switch (formatString) {
    case 'yyyy-MM-dd':
      return `${year}-${pad(month)}-${pad(day)}`;
    case 'yyyy-M-d':
      return `${year}-${month}-${day}`;
    case 'yyyy/MM/dd':
      return `${year}/${pad(month)}/${pad(day)}`;
    case 'yyyy/M/d':
      return `${year}/${month}/${day}`;
    case 'MM/dd/yyyy':
      return `${pad(month)}/${pad(day)}/${year}`;
    case 'yyyy年M月d日':
      return `${year}年${month}月${day}日`;
    default:
      return `${year}-${pad(month)}-${pad(day)}`;
  }
}
