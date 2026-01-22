/**
 * 基础事件管理器
 * 提供通用的事件管理功能，避免代码重复
 */

import type { IEventBus, IEventManager, EventManagerConfig } from './event-interfaces';
import { EventValidator } from './event-validator';
import { EventPerformanceOptimizer } from './event-performance';

/**
 * 基础事件管理器
 * 提供类型安全的事件管理功能
 */
export abstract class BaseEventManager<T extends Record<string, any>> implements IEventManager<T> {
  protected eventBus: IEventBus;
  protected config: EventManagerConfig;
  protected performanceOptimizer: EventPerformanceOptimizer;
  private callbackMap: WeakMap<Function, Function> = new WeakMap();

  constructor(eventBus: IEventBus, config: EventManagerConfig = {}) {
    this.eventBus = eventBus;
    this.config = {
      enableValidation: true,
      enablePerformanceMonitoring: false,
      enableErrorBoundary: true,
      maxListeners: 100,
      ...config
    };
    this.performanceOptimizer = new EventPerformanceOptimizer();
  }

  /**
   * 注册事件监听器
   */
  on<K extends keyof T>(type: K, callback: (event: T[K]) => void): void {
    let finalCallback: any = callback;

    // 应用验证（暂时禁用性能优化以解决测试问题）
    if (this.config.enableValidation) {
      finalCallback = (event: T[K]) => {
        if (this.validateEvent(type as string, event)) {
          callback(event);
        }
      };
    }

    this.eventBus.on(type as string, finalCallback);

    // 存储原始回调和包装回调的映射
    if (finalCallback !== callback) {
      this.callbackMap.set(callback, finalCallback);
    }
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof T>(type: K, callback?: (event: T[K]) => void): void {
    if (callback) {
      // 查找优化后的回调
      const optimizedCallback = this.callbackMap.get(callback);

      if (optimizedCallback) {
        this.eventBus.off(type as string, optimizedCallback as any);
        this.callbackMap.delete(callback);
      } else {
        // 如果没有找到优化后的回调，尝试直接移除原始回调
        this.eventBus.off(type as string, callback as any);
      }
    } else {
      // 移除所有监听器
      this.eventBus.off(type as string);

      // 清理所有相关的回调映射
      this.callbackMap = new WeakMap();
    }
  }

  /**
   * 触发事件
   */
  emit<K extends keyof T>(type: K, event: T[K]): void {
    if (this.config.enableValidation && !this.validateEvent(type as string, event)) {
      console.warn(`[BaseEventManager] Invalid event data for type '${String(type)}':`, event);
      return;
    }

    this.eventBus.emit(type as string, event);
  }

  /**
   * 获取事件监听器数量
   */
  getListenerCount(type?: keyof T): number {
    if (type) {
      return this.eventBus.listenerCount(type as string);
    }

    const eventTypes = this.getEventTypes();
    return eventTypes.reduce((total, eventType) => total + this.eventBus.listenerCount(eventType), 0);
  }

  /**
   * 清除所有事件监听器
   */
  clearAllListeners(): void {
    const eventTypes = this.getEventTypes();
    eventTypes.forEach(eventType => {
      this.eventBus.removeAllListeners(eventType);
    });

    // 清理性能优化器和回调映射
    this.performanceOptimizer.clearAll();
    this.callbackMap = new WeakMap();
  }

  /**
   * 获取统计信息
   */
  getStatistics() {
    const eventTypes = this.getEventTypes();
    const listenersByType: Record<string, number> = {};

    eventTypes.forEach(type => {
      listenersByType[type] = this.eventBus.listenerCount(type);
    });

    return {
      totalEvents: eventTypes.length,
      listenersByType,
      totalListeners: Object.values(listenersByType).reduce((sum, count) => sum + count, 0)
    };
  }

  /**
   * 验证事件数据
   * 子类可以重写此方法提供自定义验证
   */
  protected validateEvent(eventType: string, event: any): boolean {
    return EventValidator.validate(eventType, event);
  }

  /**
   * 获取当前管理器负责的事件类型列表
   * 子类必须实现此方法
   */
  protected abstract getEventTypes(): string[];
}
