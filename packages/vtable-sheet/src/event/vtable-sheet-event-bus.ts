/**
 * 统一事件总线
 * 为整个VTableSheet组件提供单一的事件管理入口
 */

import { EventEmitter } from '@visactor/vutils';
import type { EventEmitter as EventEmitterType } from '@visactor/vutils';

export interface EventBusOptions {
  /** 是否启用错误边界 */
  enableErrorBoundary?: boolean;
  /** 是否启用性能监控 */
  enablePerformanceMonitoring?: boolean;
  /** 事件监听器最大数量限制 */
  maxListeners?: number;
}

export class VTableSheetEventBus {
  private eventBus: EventEmitterType;
  private options: EventBusOptions;
  private performanceMetrics: Map<string, number[]> = new Map();
  private wrappedCallbacks: WeakMap<Function, Function> = new WeakMap();

  constructor(options: EventBusOptions = {}) {
    this.options = {
      enableErrorBoundary: true,
      enablePerformanceMonitoring: false,
      maxListeners: 100,
      ...options
    };

    this.eventBus = new EventEmitter();

    // VUtils EventEmitter might not have setMaxListeners method
    if (this.options.maxListeners && typeof (this.eventBus as any).setMaxListeners === 'function') {
      (this.eventBus as any).setMaxListeners(this.options.maxListeners);
    }
  }

  /**
   * 监听事件（带错误边界）
   */
  on(eventType: string, callback: (...args: any[]) => void): void {
    const wrappedCallback = this.options.enableErrorBoundary ? this.createErrorBoundary(callback, eventType) : callback;

    this.eventBus.on(eventType, wrappedCallback);
    this.wrappedCallbacks.set(callback, wrappedCallback);
  }

  /**
   * 取消监听事件
   */
  off(eventType: string, callback?: (...args: any[]) => void): void {
    if (callback) {
      // 查找包装后的回调
      const wrappedCallback = this.wrappedCallbacks.get(callback);
      if (wrappedCallback) {
        this.eventBus.off(eventType, wrappedCallback as any);
        this.wrappedCallbacks.delete(callback);
      } else {
        // 如果没有找到包装后的回调，尝试直接移除
        this.eventBus.off(eventType, callback);
      }
    } else {
      this.eventBus.off(eventType);
      // 清理所有包装回调映射
      this.wrappedCallbacks = new WeakMap();
    }
  }

  /**
   * 触发事件（带性能监控）
   */
  emit(eventType: string, ...args: any[]): void {
    const startTime = this.options.enablePerformanceMonitoring ? performance.now() : 0;

    try {
      this.eventBus.emit(eventType, ...args);
    } catch (error) {
      if (this.options.enableErrorBoundary) {
        console.error(`[VTableSheetEventBus] Error emitting event '${eventType}':`, error);
      } else {
        throw error;
      }
    } finally {
      if (this.options.enablePerformanceMonitoring) {
        const duration = performance.now() - startTime;
        this.recordPerformanceMetric(eventType, duration);
      }
    }
  }

  /**
   * 监听一次性事件（带错误边界）
   */
  once(eventType: string, callback: (...args: any[]) => void): void {
    const wrappedCallback = this.options.enableErrorBoundary
      ? this.createErrorBoundary(callback, eventType, true)
      : callback;

    this.eventBus.once(eventType, wrappedCallback);
    this.wrappedCallbacks.set(callback, wrappedCallback);
  }

  /**
   * 移除所有监听
   */
  removeAllListeners(eventType?: string): void {
    if (eventType) {
      this.eventBus.removeAllListeners(eventType);
      this.performanceMetrics.delete(eventType);
    } else {
      this.eventBus.removeAllListeners();
      this.performanceMetrics.clear();
    }
  }

  /**
   * 获取指定事件的监听器数量
   */
  listenerCount(eventType: string): number {
    return this.eventBus.listenerCount(eventType);
  }

  /**
   * 获取事件性能指标
   */
  getPerformanceMetrics(eventType?: string): Map<string, number[]> {
    if (eventType) {
      const metrics = new Map<string, number[]>();
      const eventMetrics = this.performanceMetrics.get(eventType);
      if (eventMetrics) {
        metrics.set(eventType, [...eventMetrics]);
      }
      return metrics;
    }
    return new Map(this.performanceMetrics);
  }

  /**
   * 获取底层EventEmitter实例（用于兼容需要直接访问的场景）
   */
  getEventEmitter(): EventEmitterType {
    return this.eventBus;
  }

  /**
   * 创建错误边界包装函数
   */
  private createErrorBoundary(
    callback: (...args: any[]) => void,
    eventType: string,
    isOnce = false
  ): (...args: any[]) => void {
    return (...args: any[]) => {
      try {
        callback(...args);
      } catch (error) {
        console.error(
          `[VTableSheetEventBus] Error in ${isOnce ? 'once' : 'on'} listener for event '${eventType}':`,
          error
        );
        // 可以选择是否重新抛出错误，这里选择吞掉错误以保证系统稳定性
      }
    };
  }

  /**
   * 记录性能指标
   */
  private recordPerformanceMetric(eventType: string, duration: number): void {
    if (!this.performanceMetrics.has(eventType)) {
      this.performanceMetrics.set(eventType, []);
    }

    const metrics = this.performanceMetrics.get(eventType)!;
    metrics.push(duration);

    // 保持最近100次记录
    if (metrics.length > 100) {
      metrics.shift();
    }
  }
}
