/**
 * 事件性能优化工具
 * 提供防抖、节流等性能优化功能
 */

/**
 * 防抖配置
 */
export interface DebounceConfig {
  /** 延迟时间（毫秒） */
  delay: number;
  /** 是否立即执行第一次 */
  immediate?: boolean;
  /** 最大等待时间 */
  maxWait?: number;
}

/**
 * 节流配置
 */
export interface ThrottleConfig {
  /** 间隔时间（毫秒） */
  interval: number;
  /** 是否立即执行第一次 */
  leading?: boolean;
  /** 是否执行最后一次 */
  trailing?: boolean;
}

/**
 * 事件性能优化器
 */
export class EventPerformanceOptimizer {
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private throttleTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastCallTimes: Map<string, number> = new Map();

  /**
   * 创建防抖函数
   */
  debounce<T extends (...args: any[]) => void>(func: T, config: DebounceConfig): T {
    const { delay, immediate = false, maxWait } = config;
    let timeout: NodeJS.Timeout | undefined;
    let lastCallTime = 0;
    let lastInvokeTime = 0;

    return ((...args: Parameters<T>) => {
      const now = Date.now();
      lastCallTime = now;

      if (immediate && !timeout && now - lastInvokeTime > delay) {
        func(...args);
        lastInvokeTime = now;
        return;
      }

      const shouldInvoke = () => {
        const timeSinceLastCall = now - lastCallTime;
        const timeSinceLastInvoke = now - lastInvokeTime;

        return !timeout || timeSinceLastCall >= delay || (maxWait && timeSinceLastInvoke >= maxWait);
      };

      if (shouldInvoke()) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        func(...args);
        lastInvokeTime = now;
        return;
      }

      if (!timeout) {
        timeout = setTimeout(() => {
          func(...args);
          lastInvokeTime = Date.now();
          timeout = undefined;
        }, delay);
      }
    }) as T;
  }

  /**
   * 创建节流函数
   */
  throttle<T extends (...args: any[]) => void>(func: T, config: ThrottleConfig): T {
    const { interval, leading = true, trailing = true } = config;
    let timeout: NodeJS.Timeout | undefined;
    let lastInvokeTime = 0;
    let lastArgs: Parameters<T> | undefined;

    return ((...args: Parameters<T>) => {
      const now = Date.now();
      lastArgs = args;

      if (!lastInvokeTime && !leading) {
        lastInvokeTime = now;
      }

      const remaining = interval - (now - lastInvokeTime);

      if (remaining <= 0 || remaining > interval) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }

        lastInvokeTime = now;
        func(...args);
      } else if (!timeout && trailing) {
        timeout = setTimeout(() => {
          lastInvokeTime = leading ? Date.now() : 0;
          timeout = undefined;
          if (lastArgs) {
            func(...lastArgs);
          }
        }, remaining);
      }
    }) as T;
  }

  /**
   * 清理所有定时器
   */
  clearAll(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    for (const timer of this.throttleTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    this.throttleTimers.clear();
    this.lastCallTimes.clear();
  }

  /**
   * 获取推荐的防抖配置
   */
  static getRecommendedDebounceConfig(eventType: string): DebounceConfig | null {
    switch (eventType) {
      case 'resized':
      case 'spreadsheet_resized':
        return { delay: 300, immediate: true, maxWait: 1000 };

      case 'range_data_changed':
        return { delay: 100, immediate: false };

      case 'formula_calculate_start':
      case 'formula_calculate_end':
        return { delay: 50, immediate: false };

      default:
        return null;
    }
  }

  /**
   * 获取推荐的节流配置
   */
  static getRecommendedThrottleConfig(eventType: string): ThrottleConfig | null {
    switch (eventType) {
      case 'mousemove':
      case 'scroll':
        return { interval: 16, leading: true, trailing: true }; // ~60fps

      case 'resize':
        return { interval: 100, leading: true, trailing: true };

      default:
        return null;
    }
  }
}
