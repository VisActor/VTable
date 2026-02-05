/**
 * 事件系统接口定义
 * 提供松耦合的事件管理架构
 */

import type { VTableSheetEventType } from '../ts-types/spreadsheet-events';

/**
 * 事件总线接口
 */
export interface IEventBus {
  on: (eventType: string, callback: (...args: any[]) => void) => void;
  off: (eventType: string, callback?: (...args: any[]) => void) => void;
  emit: (eventType: string, ...args: any[]) => void;
  once: (eventType: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: (eventType?: string) => void;
  listenerCount: (eventType: string) => number;
}

/**
 * 事件管理器接口
 */
export interface IEventManager<T extends Record<string, any>> {
  on: <K extends keyof T>(type: K, callback: (event: T[K]) => void) => void;
  off: <K extends keyof T>(type: K, callback?: (event: T[K]) => void) => void;
  emit: <K extends keyof T>(type: K, event: T[K]) => void;
  clearAllListeners: () => void;
  getListenerCount: (type?: keyof T) => number;
}

/**
 * 事件源接口 - 提供事件总线访问
 */
export interface IEventSource {
  getEventBus: () => IEventBus;
}

/**
 * 工作表事件源接口
 */
export interface IWorksheetEventSource extends IEventSource {
  readonly sheetKey: string;
  readonly sheetTitle: string;
  readonly tableInstance?: any; // Optional table instance for event relay
}

/**
 * 电子表格事件源接口
 */
export interface ISpreadsheetEventSource extends IEventSource {
  readonly workSheetInstances: Map<string, IWorksheetEventSource>;
}

/**
 * 事件验证器接口
 */
export interface IEventValidator<T = any> {
  validate: (event: T) => boolean;
  getErrorMessage: (event: T) => string;
}

/**
 * 事件配置接口
 */
export interface EventManagerConfig {
  /** 是否启用事件验证 */
  enableValidation?: boolean;
  /** 是否启用性能监控 */
  enablePerformanceMonitoring?: boolean;
  /** 事件监听器最大数量 */
  maxListeners?: number;
  /** 是否启用错误边界 */
  enableErrorBoundary?: boolean;
}

/**
 * 事件统计信息
 */
export interface EventStatistics {
  totalEvents: number;
  listenersByType: Record<string, number>;
  performanceMetrics?: Record<
    string,
    {
      avgDuration: number;
      maxDuration: number;
      minDuration: number;
      callCount: number;
    }
  >;
}
