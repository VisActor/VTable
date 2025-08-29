import { parse, isValid, differenceInDays, addDays, format } from './utils/date';

// 通用转换器接口
export interface IConverter {
  key: string; // 转换器标识
  detect(value: any): boolean; // 检测值是否可被当前转换器处理
  toNumber(value: any): { v: number; meta?: any }; // 转换为数字
  fromNumber(num: number, meta?: any): any; // 从数字转换回来
}

// 日期格式规则
interface DateFormatRule {
  pattern: RegExp;
  format: string;
  parser?: (value: string) => Date;
}

/**
 * 日期转换器 - 实现IConverter接口
 */
export class DateConverter implements IConverter {
  key = 'date'; // 标识为日期转换器
  private baseDate = new Date(1900, 0, 1);

  // 日期格式规则
  private dateFormats: DateFormatRule[] = [
    { pattern: /^\d{4}-\d{2}-\d{2}$/, format: 'yyyy-MM-dd' },
    { pattern: /^\d{4}-\d{1,2}-\d{1,2}$/, format: 'yyyy-M-d' },
    { pattern: /^\d{4}\/\d{2}\/\d{2}$/, format: 'yyyy/MM/dd' },
    { pattern: /^\d{4}\/\d{1,2}\/\d{1,2}$/, format: 'yyyy/M/d' },
    { pattern: /^\d{2}\/\d{2}\/\d{4}$/, format: 'MM/dd/yyyy' },
    {
      pattern: /^\d{4}年\d{1,2}月\d{1,2}(日)?$/,
      format: 'yyyy年M月d日',
      parser: (value: string) => {
        const match = value.match(/(\d{4})年(\d{1,2})月(\d{1,2})/);
        if (!match) throw new Error('无效的中文日期格式');
        return new Date(+match[1], +match[2] - 1, +match[3]);
      }
    }
  ];

  // 检测是否为日期
  detect(value: any): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (typeof value !== 'string') {
      return false;
    }

    const str = value.trim();
    const matchedFormat = this.dateFormats.find(rule => rule.pattern.test(str));

    if (matchedFormat) {
      try {
        const date = matchedFormat.parser ? matchedFormat.parser(str) : parse(str, matchedFormat.format, new Date());
        return isValid(date);
      } catch {
        return false;
      }
    }

    return false;
  }

  // 转换为数字（日偏移量）
  toNumber(value: Date | string): { v: number; meta?: string } {
    let date: Date;
    let formatMeta: string | undefined;

    if (value instanceof Date) {
      if (!isValid(value)) throw new Error('无效的日期对象');
      date = value;
      formatMeta = 'yyyy-MM-dd';
    } else {
      const str = value.trim();
      const matchedFormat = this.dateFormats.find(rule => rule.pattern.test(str));

      if (!matchedFormat) throw new Error(`不支持的日期格式: ${str}`);

      date = matchedFormat.parser ? matchedFormat.parser(str) : parse(str, matchedFormat.format, new Date());

      if (!isValid(date)) throw new Error(`无效的日期值: ${str}`);
      formatMeta = matchedFormat.format;
    }

    return {
      v: differenceInDays(date, this.baseDate),
      meta: formatMeta
    };
  }

  // 从数字转换回日期
  fromNumber(daysOffset: number, meta?: string): string {
    const targetDate = addDays(this.baseDate, daysOffset);
    targetDate.setHours(0, 0, 0, 0);

    return format(targetDate, meta || 'yyyy-MM-dd');
  }
}

/**
 * 转换器管理器 - 用于统一管理和获取转换器
 */
export class ConverterManager {
  private converters: IConverter[] = [];

  // 注册转换器
  register(converter: IConverter): void {
    this.converters.push(converter);
  }

  // 根据值自动获取合适的转换器
  getConverter(value: any): IConverter | null {
    return this.converters.find(converter => converter.detect(value)) || null;
  }

  // 根据key获取转换器
  getConverterByKey(key: string): IConverter | null {
    return this.converters.find(converter => converter.key === key) || null;
  }
}

// 初始化示例
export const converterManager = new ConverterManager();
converterManager.register(new DateConverter());
