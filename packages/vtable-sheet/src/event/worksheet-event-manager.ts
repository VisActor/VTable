/**
 * WorkSheet 层事件管理器
 * 管理工作表级别的状态和操作事件
 */

import { EventEmitter } from '@visactor/vutils';
import type { EventEmitter as EventEmitterType } from '@visactor/vutils';
import {
  WorkSheetEventType,
  type WorkSheetEventMap,
  type WorkSheetActivatedEvent,
  type WorkSheetResizedEvent,
  type FormulaCalculateEvent,
  type FormulaErrorEvent,
  type FormulaChangeEvent,
  type FormulaDependencyChangedEvent,
  type DataLoadedEvent,
  type DataSortedEvent,
  type DataFilteredEvent,
  type RangeDataChangedEvent
} from '../ts-types/spreadsheet-events';
import type { WorkSheet } from '../core/WorkSheet';

/**
 * WorkSheet 事件管理器
 * 负责管理 WorkSheet 层的事件监听和触发
 */
export class WorkSheetEventManager {
  /** 事件总线 */
  private eventBus: EventEmitterType;

  /** 关联的 WorkSheet 实例 */
  private worksheet: WorkSheet;

  constructor(worksheet: WorkSheet, eventBus: EventEmitterType) {
    this.worksheet = worksheet;
    this.eventBus = eventBus;
  }

  /**
   * 注册 WorkSheet 事件监听器
   */
  on<K extends keyof WorkSheetEventMap>(type: K, callback: (event: WorkSheetEventMap[K]) => void): void {
    this.eventBus.on(type, callback);
  }

  /**
   * 移除 WorkSheet 事件监听器
   */
  off<K extends keyof WorkSheetEventMap>(type: K, callback?: (event: WorkSheetEventMap[K]) => void): void {
    if (callback) {
      this.eventBus.off(type, callback);
    } else {
      // 移除该类型的所有监听器
      this.eventBus.off(type);
    }
  }

  /**
   * 触发 WorkSheet 事件
   */
  emit<K extends keyof WorkSheetEventMap>(type: K, event: WorkSheetEventMap[K]): void {
    this.eventBus.emit(type, event);
  }

  /**
   * 触发工作表激活事件
   */
  emitActivated(): void {
    const event: WorkSheetActivatedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sheetTitle: this.worksheet.sheetTitle
    };
    this.emit(WorkSheetEventType.ACTIVATED, event);
  }

  /**
   * 触发工作表停用事件
   */
  emitDeactivated(): void {
    const event: WorkSheetActivatedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sheetTitle: this.worksheet.sheetTitle
    };
    this.emit(WorkSheetEventType.DEACTIVATED, event);
  }

  /**
   * 触发工作表准备就绪事件
   */
  emitReady(): void {
    const event: WorkSheetActivatedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sheetTitle: this.worksheet.sheetTitle
    };
    this.emit(WorkSheetEventType.READY, event);
  }

  /**
   * 触发工作表尺寸改变事件
   */
  emitResized(width: number, height: number): void {
    const event: WorkSheetResizedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sheetTitle: this.worksheet.sheetTitle,
      width,
      height
    };
    this.emit(WorkSheetEventType.RESIZED, event);
  }

  // 注意：工作表管理事件（SHEET_ADDED, SHEET_REMOVED, SHEET_RENAMED, SHEET_MOVED）
  // 现在只在 SpreadSheet 层级处理，不在 WorkSheet 层级重复定义

  /**
   * 触发公式计算开始事件
   */
  emitFormulaCalculateStart(formulaCount?: number): void {
    const event: FormulaCalculateEvent = {
      sheetKey: this.worksheet.sheetKey,
      formulaCount
    };
    this.emit(WorkSheetEventType.FORMULA_CALCULATE_START, event);
  }

  /**
   * 触发公式计算结束事件
   */
  emitFormulaCalculateEnd(formulaCount?: number, duration?: number): void {
    const event: FormulaCalculateEvent = {
      sheetKey: this.worksheet.sheetKey,
      formulaCount,
      duration
    };
    this.emit(WorkSheetEventType.FORMULA_CALCULATE_END, event);
  }

  /**
   * 触发公式错误事件
   */
  emitFormulaError(cell: { row: number; col: number; sheet: string }, formula: string, error: string | Error): void {
    const event: FormulaErrorEvent = {
      sheetKey: this.worksheet.sheetKey,
      cell,
      formula,
      error
    };
    this.emit(WorkSheetEventType.FORMULA_ERROR, event);
  }

  /**
   * 触发公式依赖关系改变事件
   */
  emitFormulaDependencyChanged(): void {
    const event: FormulaDependencyChangedEvent = {
      sheetKey: this.worksheet.sheetKey
    };
    this.emit(WorkSheetEventType.FORMULA_DEPENDENCY_CHANGED, event);
  }

  /**
   * 触发公式添加事件
   */
  emitFormulaAdded(cell: { row: number; col: number }, formula?: string): void {
    const event: FormulaChangeEvent = {
      sheetKey: this.worksheet.sheetKey,
      cell,
      formula
    };
    this.emit(WorkSheetEventType.FORMULA_ADDED, event);
  }

  /**
   * 触发公式移除事件
   */
  emitFormulaRemoved(cell: { row: number; col: number }, formula?: string): void {
    const event: FormulaChangeEvent = {
      sheetKey: this.worksheet.sheetKey,
      cell,
      formula
    };
    this.emit(WorkSheetEventType.FORMULA_REMOVED, event);
  }

  /**
   * 触发数据加载完成事件
   */
  emitDataLoaded(rowCount: number, colCount: number): void {
    const event: DataLoadedEvent = {
      sheetKey: this.worksheet.sheetKey,
      rowCount,
      colCount
    };
    this.emit(WorkSheetEventType.DATA_LOADED, event);
  }

  /**
   * 触发数据排序完成事件
   */
  emitDataSorted(sortInfo: any): void {
    const event: DataSortedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sortInfo
    };
    this.emit(WorkSheetEventType.DATA_SORTED, event);
  }

  /**
   * 触发数据筛选完成事件
   */
  emitDataFiltered(filterInfo: any): void {
    const event: DataFilteredEvent = {
      sheetKey: this.worksheet.sheetKey,
      filterInfo
    };
    this.emit(WorkSheetEventType.DATA_FILTERED, event);
  }

  /**
   * 触发范围数据变更事件
   */
  emitRangeDataChanged(range: any, changes: any[]): void {
    const event: RangeDataChangedEvent = {
      sheetKey: this.worksheet.sheetKey,
      range,
      changes
    };
    this.emit(WorkSheetEventType.RANGE_DATA_CHANGED, event);
  }

  /**
   * 清除所有事件监听器
   */
  clearAllListeners(): void {
    // 获取所有 WorkSheet 事件类型
    const eventTypes = Object.values(WorkSheetEventType);

    // 移除每种类型的所有监听器
    eventTypes.forEach(type => {
      this.eventBus.off(type);
    });
  }

  /**
   * 获取事件监听器数量
   */
  getListenerCount(type?: WorkSheetEventType): number {
    if (type) {
      return this.eventBus.listenerCount(type);
    }

    // 返回所有 WorkSheet 事件的总监听器数量
    const eventTypes = Object.values(WorkSheetEventType);
    return eventTypes.reduce((total, type) => total + this.eventBus.listenerCount(type), 0);
  }
}
