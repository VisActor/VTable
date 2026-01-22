/**
 * SpreadSheet 层事件管理器
 * 管理电子表格应用级别的事件
 */

import {
  VTableSheetEventType,
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
import { BaseEventManager } from './base-event-manager';
import type { IEventBus, ISpreadsheetEventSource } from './event-interfaces';

/**
 * SpreadSheet 事件管理器
 * 负责管理电子表格应用级别的事件监听和触发
 */
export class SpreadSheetEventManager extends BaseEventManager<SpreadSheetEventMap> {
  /** 关联的 VTableSheet 实例 */
  private spreadsheet: ISpreadsheetEventSource;

  constructor(spreadsheet: ISpreadsheetEventSource) {
    super(spreadsheet.getEventBus());
    this.spreadsheet = spreadsheet;
  }

  /**
   * 获取事件类型列表
   */
  protected getEventTypes(): string[] {
    return [
      VTableSheetEventType.SPREADSHEET_READY,
      VTableSheetEventType.SPREADSHEET_DESTROYED,
      VTableSheetEventType.SPREADSHEET_RESIZED,
      VTableSheetEventType.SHEET_ADDED,
      VTableSheetEventType.SHEET_REMOVED,
      VTableSheetEventType.SHEET_RENAMED,
      VTableSheetEventType.SHEET_ACTIVATED,
      VTableSheetEventType.SHEET_DEACTIVATED,
      VTableSheetEventType.SHEET_MOVED,
      VTableSheetEventType.SHEET_VISIBILITY_CHANGED,
      VTableSheetEventType.IMPORT_START,
      VTableSheetEventType.IMPORT_COMPLETED,
      VTableSheetEventType.IMPORT_ERROR,
      VTableSheetEventType.EXPORT_START,
      VTableSheetEventType.EXPORT_COMPLETED,
      VTableSheetEventType.EXPORT_ERROR,
      VTableSheetEventType.CROSS_SHEET_REFERENCE_UPDATED,
      VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START,
      VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END
    ];
  }

  /**
   * 触发电子表格准备就绪事件
   */
  emitReady(): void {
    this.emit(VTableSheetEventType.SPREADSHEET_READY, undefined);
  }

  /**
   * 触发电子表格销毁事件
   */
  emitDestroyed(): void {
    this.emit(VTableSheetEventType.SPREADSHEET_DESTROYED, undefined);
  }

  /**
   * 触发电子表格尺寸改变事件
   */
  emitResized(width: number, height: number): void {
    this.emit(VTableSheetEventType.SPREADSHEET_RESIZED, { width, height });
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
    this.emit(VTableSheetEventType.SHEET_ADDED, event);
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
    this.emit(VTableSheetEventType.SHEET_REMOVED, event);
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
    this.emit(VTableSheetEventType.SHEET_RENAMED, event);
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
    this.emit(VTableSheetEventType.SHEET_ACTIVATED, event);
  }
  emitSheetDeactivated(sheetKey: string, sheetTitle: string): void {
    const event: SheetActivatedEvent = {
      sheetKey,
      sheetTitle
    };
    this.emit(VTableSheetEventType.SHEET_DEACTIVATED, event);
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
    this.emit(VTableSheetEventType.SHEET_MOVED, event);
  }

  /**
   * 触发工作表可见性改变事件
   */
  emitSheetVisibilityChanged(sheetKey: string, visible: boolean): void {
    const event: SheetVisibilityChangedEvent = {
      sheetKey,
      visible
    };
    this.emit(VTableSheetEventType.SHEET_VISIBILITY_CHANGED, event);
  }

  /**
   * 触发导入开始事件
   */
  emitImportStart(fileType: 'xlsx' | 'xls' | 'csv'): void {
    const event: ImportEvent = {
      fileType
    };
    this.emit(VTableSheetEventType.IMPORT_START, event);
  }

  /**
   * 触发导入完成事件
   */
  emitImportCompleted(fileType: 'xlsx' | 'xls' | 'csv', sheetCount?: number): void {
    const event: ImportEvent = {
      fileType,
      sheetCount
    };
    this.emit(VTableSheetEventType.IMPORT_COMPLETED, event);
  }

  /**
   * 触发导入失败事件
   */
  emitImportError(fileType: 'xlsx' | 'xls' | 'csv', error: string | Error): void {
    const event: ImportEvent = {
      fileType,
      error
    };
    this.emit(VTableSheetEventType.IMPORT_ERROR, event);
  }

  /**
   * 触发导出开始事件
   */
  emitExportStart(fileType: 'xlsx' | 'csv', allSheets: boolean): void {
    const event: ExportEvent = {
      fileType,
      allSheets
    };
    this.emit(VTableSheetEventType.EXPORT_START, event);
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
    this.emit(VTableSheetEventType.EXPORT_COMPLETED, event);
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
    this.emit(VTableSheetEventType.EXPORT_ERROR, event);
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
    this.emit(VTableSheetEventType.CROSS_SHEET_REFERENCE_UPDATED, event);
  }

  /**
   * 触发跨工作表公式计算开始事件
   */
  emitCrossSheetFormulaCalculateStart(): void {
    this.emit(VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START, undefined);
  }

  /**
   * 触发跨工作表公式计算结束事件
   */
  emitCrossSheetFormulaCalculateEnd(): void {
    this.emit(VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END, undefined);
  }
}
