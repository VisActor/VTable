/**
 * SpreadSheet 层事件管理器
 * 管理电子表格应用级别的事件
 */

import { EventEmitter } from '@visactor/vutils';
import type { EventEmitter as EventEmitterType } from '@visactor/vutils';
import {
  SpreadSheetEventType,
  type SpreadSheetEventMap,
  type SheetAddedEvent,
  type SheetRemovedEvent,
  type SheetRenamedEvent,
  type SheetActivatedEvent,
  type SheetMovedEvent,
  type SheetVisibilityChangedEvent,
  type ImportEvent,
  type ExportEvent,
  type CrossSheetReferenceEvent
} from '../ts-types/spreadsheet-events';
import type VTableSheet from '../components/vtable-sheet';

/**
 * SpreadSheet 事件管理器
 * 负责管理电子表格应用级别的事件监听和触发
 */
export class SpreadSheetEventManager {
  /** 事件总线 */
  private eventBus: EventEmitterType;

  /** 关联的 VTableSheet 实例 */
  private spreadsheet: VTableSheet;

  constructor(spreadsheet: VTableSheet) {
    this.spreadsheet = spreadsheet;
    this.eventBus = new EventEmitter();
  }

  /**
   * 注册 SpreadSheet 事件监听器
   */
  on<K extends keyof SpreadSheetEventMap>(type: K, callback: (event: SpreadSheetEventMap[K]) => void): void {
    this.eventBus.on(type, callback);
  }

  /**
   * 移除 SpreadSheet 事件监听器
   */
  off<K extends keyof SpreadSheetEventMap>(type: K, callback?: (event: SpreadSheetEventMap[K]) => void): void {
    if (callback) {
      this.eventBus.off(type, callback);
    } else {
      // 移除该类型的所有监听器
      this.eventBus.off(type);
    }
  }

  /**
   * 触发 SpreadSheet 事件
   */
  emit<K extends keyof SpreadSheetEventMap>(type: K, event: SpreadSheetEventMap[K]): void {
    this.eventBus.emit(type, event);
  }

  /**
   * 触发电子表格准备就绪事件
   */
  emitReady(): void {
    this.emit(SpreadSheetEventType.READY, undefined);
  }

  /**
   * 触发电子表格销毁事件
   */
  emitDestroyed(): void {
    this.emit(SpreadSheetEventType.DESTROYED, undefined);
  }

  /**
   * 触发电子表格尺寸改变事件
   */
  emitResized(width: number, height: number): void {
    this.emit(SpreadSheetEventType.RESIZED, { width, height });
  }

  /**
   * 触发工作表添加事件
   */
  emitSheetAdded(sheetKey: string, sheetTitle: string, index: number): void {
    const event: SheetAddedEvent = {
      sheetKey,
      sheetTitle,
      index
    };
    this.emit(SpreadSheetEventType.SHEET_ADDED, event);
  }

  /**
   * 触发工作表移除事件
   */
  emitSheetRemoved(sheetKey: string, sheetTitle: string, index: number): void {
    const event: SheetRemovedEvent = {
      sheetKey,
      sheetTitle,
      index
    };
    this.emit(SpreadSheetEventType.SHEET_REMOVED, event);
  }

  /**
   * 触发工作表重命名事件
   */
  emitSheetRenamed(sheetKey: string, oldTitle: string, newTitle: string): void {
    const event: SheetRenamedEvent = {
      sheetKey,
      oldTitle,
      newTitle
    };
    this.emit(SpreadSheetEventType.SHEET_RENAMED, event);
  }

  /**
   * 触发工作表激活事件
   */
  emitSheetActivated(
    sheetKey: string,
    sheetTitle: string,
    previousSheetKey?: string,
    previousSheetTitle?: string
  ): void {
    const event: SheetActivatedEvent = {
      sheetKey,
      sheetTitle,
      previousSheetKey,
      previousSheetTitle
    };
    this.emit(SpreadSheetEventType.SHEET_ACTIVATED, event);
  }

  /**
   * 触发工作表移动事件
   */
  emitSheetMoved(sheetKey: string, fromIndex: number, toIndex: number): void {
    const event: SheetMovedEvent = {
      sheetKey,
      fromIndex,
      toIndex
    };
    this.emit(SpreadSheetEventType.SHEET_MOVED, event);
  }

  /**
   * 触发工作表可见性改变事件
   */
  emitSheetVisibilityChanged(sheetKey: string, visible: boolean): void {
    const event: SheetVisibilityChangedEvent = {
      sheetKey,
      visible
    };
    this.emit(SpreadSheetEventType.SHEET_VISIBILITY_CHANGED, event);
  }

  /**
   * 触发导入开始事件
   */
  emitImportStart(fileType: 'xlsx' | 'xls' | 'csv'): void {
    const event: ImportEvent = {
      fileType
    };
    this.emit(SpreadSheetEventType.IMPORT_START, event);
  }

  /**
   * 触发导入完成事件
   */
  emitImportCompleted(fileType: 'xlsx' | 'xls' | 'csv', sheetCount?: number): void {
    const event: ImportEvent = {
      fileType,
      sheetCount
    };
    this.emit(SpreadSheetEventType.IMPORT_COMPLETED, event);
  }

  /**
   * 触发导入失败事件
   */
  emitImportError(fileType: 'xlsx' | 'xls' | 'csv', error: string | Error): void {
    const event: ImportEvent = {
      fileType,
      error
    };
    this.emit(SpreadSheetEventType.IMPORT_ERROR, event);
  }

  /**
   * 触发导出开始事件
   */
  emitExportStart(fileType: 'xlsx' | 'csv', allSheets: boolean): void {
    const event: ExportEvent = {
      fileType,
      allSheets
    };
    this.emit(SpreadSheetEventType.EXPORT_START, event);
  }

  /**
   * 触发导出完成事件
   */
  emitExportCompleted(fileType: 'xlsx' | 'csv', allSheets: boolean, sheetCount?: number): void {
    const event: ExportEvent = {
      fileType,
      allSheets,
      sheetCount
    };
    this.emit(SpreadSheetEventType.EXPORT_COMPLETED, event);
  }

  /**
   * 触发导出失败事件
   */
  emitExportError(fileType: 'xlsx' | 'csv', allSheets: boolean, error: string | Error): void {
    const event: ExportEvent = {
      fileType,
      allSheets,
      error
    };
    this.emit(SpreadSheetEventType.EXPORT_ERROR, event);
  }

  /**
   * 触发跨工作表引用更新事件
   */
  emitCrossSheetReferenceUpdated(
    sourceSheetKey: string,
    targetSheetKeys: string[],
    affectedFormulaCount: number
  ): void {
    const event: CrossSheetReferenceEvent = {
      sourceSheetKey,
      targetSheetKeys,
      affectedFormulaCount
    };
    this.emit(SpreadSheetEventType.CROSS_SHEET_REFERENCE_UPDATED, event);
  }

  /**
   * 触发跨工作表公式计算开始事件
   */
  emitCrossSheetFormulaCalculateStart(): void {
    this.emit(SpreadSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START, undefined);
  }

  /**
   * 触发跨工作表公式计算结束事件
   */
  emitCrossSheetFormulaCalculateEnd(): void {
    this.emit(SpreadSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END, undefined);
  }

  /**
   * 清除所有事件监听器
   */
  clearAllListeners(): void {
    // 获取所有 SpreadSheet 事件类型
    const eventTypes = Object.values(SpreadSheetEventType);

    // 移除每种类型的所有监听器
    eventTypes.forEach(type => {
      this.eventBus.off(type);
    });
  }

  /**
   * 获取事件监听器数量
   */
  getListenerCount(type?: SpreadSheetEventType): number {
    if (type) {
      return this.eventBus.listenerCount(type);
    }

    // 返回所有 SpreadSheet 事件的总监听器数量
    const eventTypes = Object.values(SpreadSheetEventType);
    return eventTypes.reduce((total, type) => total + this.eventBus.listenerCount(type), 0);
  }
}
