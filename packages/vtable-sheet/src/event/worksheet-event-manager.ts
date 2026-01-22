/**
 * WorkSheet 层事件管理器
 * 管理工作表级别的状态和操作事件
 */

import {
  VTableSheetEventType,
  type WorkSheetEventMap,
  type SheetActivatedEvent,
  type SheetResizedEvent,
  type FormulaCalculateEvent,
  type FormulaErrorEvent,
  type FormulaChangeEvent,
  type FormulaDependencyChangedEvent,
  type DataLoadedEvent,
  type DataSortedEvent,
  type DataFilteredEvent,
  type RangeDataChangedEvent
} from '../ts-types/spreadsheet-events';
import { BaseEventManager } from './base-event-manager';
import type { IWorksheetEventSource } from './event-interfaces';

/**
 * WorkSheet 事件管理器
 * 负责管理 WorkSheet 层的事件监听和触发
 */
export class WorkSheetEventManager extends BaseEventManager<WorkSheetEventMap> {
  /** 关联的 WorkSheet 实例 */
  private worksheet: IWorksheetEventSource;

  constructor(worksheet: IWorksheetEventSource) {
    super(worksheet.getEventBus());
    this.worksheet = worksheet;
  }

  /**
   * 获取事件类型列表
   */
  protected getEventTypes(): string[] {
    return [
      'ready',
      'destroyed',
      'resized',
      'activated',
      'formula_calculate_start',
      'formula_calculate_end',
      'formula_error',
      'formula_dependency_changed',
      'formula_added',
      'formula_removed',
      'data_loaded',
      'data_sorted',
      'data_filtered',
      'range_data_changed'
    ];
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
   * 触发工作表准备就绪事件
   */
  emitReady(): void {
    const event: SheetActivatedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sheetTitle: this.worksheet.sheetTitle
    };
    this.emit('ready', event);
  }

  /**
   * 触发工作表尺寸改变事件
   */
  emitResized(width: number, height: number): void {
    const event: SheetResizedEvent = {
      sheetKey: this.worksheet.sheetKey,
      sheetTitle: this.worksheet.sheetTitle,
      width,
      height
    };
    this.emit('resized', event);
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
    this.emit(VTableSheetEventType.FORMULA_CALCULATE_START, event);
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
    this.emit(VTableSheetEventType.FORMULA_CALCULATE_END, event);
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
    this.emit(VTableSheetEventType.FORMULA_ERROR, event);
  }

  /**
   * 触发公式依赖关系改变事件
   */
  emitFormulaDependencyChanged(): void {
    const event: FormulaDependencyChangedEvent = {
      sheetKey: this.worksheet.sheetKey
    };
    this.emit(VTableSheetEventType.FORMULA_DEPENDENCY_CHANGED, event);
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
    this.emit(VTableSheetEventType.FORMULA_ADDED, event);
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
    this.emit(VTableSheetEventType.FORMULA_REMOVED, event);
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
    this.emit(VTableSheetEventType.DATA_LOADED, event);
  }
}
