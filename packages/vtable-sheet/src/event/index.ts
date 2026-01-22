/**
 * 事件模块导出
 */

// 基础类和接口
export { BaseEventManager } from './base-event-manager';
export { VTableSheetEventBus } from './vtable-sheet-event-bus';
export { EventValidator } from './event-validator';
export { EventPerformanceOptimizer } from './event-performance';

// 事件管理器
export { TableEventRelay } from './table-event-relay';
export { WorkSheetEventManager } from './worksheet-event-manager';
export { SpreadSheetEventManager } from './spreadsheet-event-manager';
export { FormulaEventUtils } from './formula-event-utils';

// 接口定义
export type {
  IEventBus,
  IEventManager,
  IEventSource,
  IWorksheetEventSource,
  ISpreadsheetEventSource,
  IEventValidator,
  EventManagerConfig,
  EventStatistics
} from './event-interfaces';
