import type { CellCoord, CellRange, CellValue } from './base';

/** 事件处理器类型 */
export type EventHandler = (...args: any[]) => void;

/** 事件映射表 */
export interface IEventMap {
  // 单元格事件
  'cell:selected': { coord: CellCoord };
  'cell:deselected': { coord: CellCoord };
  'cell:changed': { coord: CellCoord; oldValue: CellValue; newValue: CellValue };
  'cell:editing': { coord: CellCoord };
  'cell:edited': { coord: CellCoord; value: CellValue };

  // 选择事件
  'selection:changed': { range: CellRange };
  'selection:start': { coord: CellCoord };
  'selection:end': { range: CellRange };

  // Sheet事件
  'sheet:ready': void;
  'sheet:destroyed': void;
  'sheet:resized': { width: number; height: number };
  'sheet:focused': void;
  'sheet:blurred': void;

  // 数据事件
  'data:changed': { changes: Array<{ coord: CellCoord; oldValue: CellValue; newValue: CellValue }> };
  'data:loaded': void;
  'data:sorted': { columnKey: string; direction: 'asc' | 'desc' };
  'data:filtered': { filters: Array<{ columnKey: string; value: any }> };

  // 工具栏事件
  'toolbar:action': { actionId: string };
  'toolbar:stateChanged': { actionId: string; enabled: boolean };
}

/** 事件管理器接口 */
export interface IEventManager {
  /** 注册事件监听器 */
  on: <K extends keyof IEventMap>(event: K, handler: (payload: IEventMap[K]) => void) => void;

  /** 移除事件监听器 */
  off: <K extends keyof IEventMap>(event: K, handler: (payload: IEventMap[K]) => void) => void;

  /** 触发事件 */
  emit: <K extends keyof IEventMap>(event: K, payload: IEventMap[K]) => void;

  /** 一次性事件监听器 */
  once: <K extends keyof IEventMap>(event: K, handler: (payload: IEventMap[K]) => void) => void;

  /** 移除所有事件监听器 */
  removeAllListeners: () => void;
}

export interface CellValueChangedEvent {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 新值 */
  newValue: CellValue;
  /** 旧值 */
  oldValue: CellValue;
}

export type CellSelectedEvent = IEventMap['cell:selected'];
export type SelectionChangedEvent = IEventMap['selection:changed'];
