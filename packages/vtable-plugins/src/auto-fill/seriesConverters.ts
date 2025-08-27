// 定义数据类型标识
export type DataType = 'number' | 'date' | 'string' | string;

export interface IConverter {
  key: string;
  detect(value: any): boolean;
  toNumber(value: any): number;
  fromNumber(num: number, originalValue: any): any;
}

export class ConverterManager {
  private converters: Map<DataType, IConverter> = new Map();

  register(type: DataType, converter: IConverter) {
    this.converters.set(type, converter);
  }
  getConverter(value: any): IConverter {
    for (const [_, converter] of this.converters) {
      if (converter.detect(value)) {
        return converter;
      }
    }
    return this.converters.get('number')!;
  }
  getConverterByType(type: DataType): IConverter | undefined {
    return this.converters.get(type);
  }
}

export class NumberConverter implements IConverter {
  key = 'number';
  detect(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  toNumber(value: any): number {
    return Number(value);
  }

  fromNumber(num: number): number {
    return num;
  }
}

export class DateValueConverter {
  key = 'date';
  /**
   * 检测值是否为有效的日期
   * @param value 待检测的值
   * @returns 是否为有效日期
   */
  detect(value: any): boolean {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }

    if (typeof value !== 'string') {
      return false;
    }

    const str = value.trim();
    if (str.length === 0) {
      return false;
    }

    // 常见日期格式正则
    const datePatterns = [
      /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/,
      /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/,
      /^\d{4}年\d{1,2}月\d{1,2}(日)?$/,
      /^[A-Za-z]{3,9} \d{1,2}, \d{4}$/,
      /^\d{1,2} [A-Za-z]{3,9} \d{4}$/,
      /^\d{4}[-/]\d{1,2}[-/]\d{1,2}[ T]\d{1,2}:\d{2}(:\d{2})?(\.\d{3})?([+-]\d{2}:\d{2})?$/
    ];

    const matchesPattern = datePatterns.some(pattern => pattern.test(str));
    if (!matchesPattern) {
      return false;
    }

    // 最终验证
    return !isNaN(new Date(str).getTime());
  }

  toNumber(value: any): number {
    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else if (typeof value === 'string') {
      const normalized = value.replace(/年|月/g, '/').replace(/日/g, '').trim();
      date = new Date(normalized);
    } else {
      throw new Error(`不支持的日期类型: ${typeof value}`);
    }
    if (isNaN(date.getTime())) {
      throw new Error(`无效的日期值: ${value}`);
    }

    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  /**
   * 将数值（时间戳）转回日期格式
   * @param timestamp 毫秒时间戳
   * @param originalValue 原始值（用于参考格式）
   * @returns 转换后的日期
   */
  fromNumber(timestamp: number, originalValue: any): string | Date {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);

    // 如果原始值是Date对象，返回Date对象
    if (originalValue instanceof Date) {
      return date;
    }

    // 根据原始字符串格式选择输出格式
    const originalStr = originalValue.toString().trim();

    // 中文格式
    if (originalStr.includes('年') || originalStr.includes('月') || originalStr.includes('日')) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
    }

    // 斜杠分隔格式
    if (originalStr.includes('/')) {
      // 判断是YYYY/MM/DD还是MM/DD/YYYY
      const parts = originalStr.split('/');
      if (parts.length === 3 && parts[0].length === 4) {
        // YYYY/MM/DD格式
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      } else {
        // MM/DD/YYYY格式
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      }
    }

    // 短横线分隔格式（默认YYYY-MM-DD）
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}

// 初始化转换器管理器并注册默认转换器
export const converterManager = new ConverterManager();
converterManager.register('number', new NumberConverter());
converterManager.register('date', new DateValueConverter());
