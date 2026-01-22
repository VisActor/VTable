/**
 * 事件验证工具
 * 提供事件数据验证功能
 */

import { VTableSheetEventType } from '../ts-types/spreadsheet-events';

/**
 * 事件验证器
 */
export class EventValidator {
  /**
   * 验证事件数据
   */
  static validate(eventType: string, event: any): boolean {
    // 基础验证：事件可以是 undefined（对于无数据事件）
    if (event === undefined) {
      return true;
    }

    // 如果事件存在，必须是对象
    if (event && typeof event !== 'object') {
      return false;
    }

    // 根据事件类型进行特定验证
    switch (eventType) {
      // Sheet 相关事件必须包含 sheetKey
      case VTableSheetEventType.SHEET_ADDED:
      case VTableSheetEventType.SHEET_REMOVED:
      case VTableSheetEventType.SHEET_RENAMED:
      case VTableSheetEventType.SHEET_MOVED:
      case VTableSheetEventType.SHEET_VISIBILITY_CHANGED:
      case VTableSheetEventType.ACTIVATED:
        return this.validateSheetEvent(event);

      // 公式相关事件必须包含 sheetKey
      case VTableSheetEventType.FORMULA_ERROR:
      case VTableSheetEventType.FORMULA_ADDED:
      case VTableSheetEventType.FORMULA_REMOVED:
      case VTableSheetEventType.FORMULA_CALCULATE_START:
      case VTableSheetEventType.FORMULA_CALCULATE_END:
      case VTableSheetEventType.FORMULA_DEPENDENCY_CHANGED:
        return this.validateFormulaEvent(event);

      // 数据相关事件必须包含 sheetKey
      case VTableSheetEventType.DATA_LOADED:
        return this.validateDataEvent(event);

      // 导入导出事件
      case VTableSheetEventType.IMPORT_START:
      case VTableSheetEventType.IMPORT_COMPLETED:
      case VTableSheetEventType.IMPORT_ERROR:
        return this.validateImportEvent(event);

      case VTableSheetEventType.EXPORT_START:
      case VTableSheetEventType.EXPORT_COMPLETED:
      case VTableSheetEventType.EXPORT_ERROR:
        return this.validateExportEvent(event);

      // 跨Sheet事件
      case VTableSheetEventType.CROSS_SHEET_REFERENCE_UPDATED:
        return this.validateCrossSheetEvent(event);

      // 电子表格级别事件（不需要sheetKey）
      case VTableSheetEventType.SPREADSHEET_READY:
      case VTableSheetEventType.SPREADSHEET_DESTROYED:
      case VTableSheetEventType.SPREADSHEET_RESIZED:
      case VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START:
      case VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END:
        return true;

      default:
        // 未知事件类型，默认通过（向后兼容）
        console.warn(`[EventValidator] 未知事件类型: ${eventType}`);
        return true;
    }
  }

  /**
   * 验证Sheet事件
   */
  private static validateSheetEvent(event: any): boolean {
    return event.sheetKey && typeof event.sheetKey === 'string';
  }

  /**
   * 验证公式事件
   */
  private static validateFormulaEvent(event: any): boolean {
    if (!event.sheetKey || typeof event.sheetKey !== 'string') {
      return false;
    }

    // 公式错误事件需要额外的验证
    if (event.type === VTableSheetEventType.FORMULA_ERROR) {
      return event.cell && event.formula && event.error;
    }

    // 公式变更事件需要额外的验证
    if (event.type === VTableSheetEventType.FORMULA_ADDED || event.type === VTableSheetEventType.FORMULA_REMOVED) {
      return event.cell && typeof event.cell.row === 'number' && typeof event.cell.col === 'number';
    }

    return true;
  }

  /**
   * 验证数据事件
   */
  private static validateDataEvent(event: any): boolean {
    return event.sheetKey && typeof event.sheetKey === 'string';
  }

  /**
   * 验证导入事件
   */
  private static validateImportEvent(event: any): boolean {
    return event.fileType && ['xlsx', 'xls', 'csv'].includes(event.fileType);
  }

  /**
   * 验证导出事件
   */
  private static validateExportEvent(event: any): boolean {
    return event.fileType && ['xlsx', 'csv'].includes(event.fileType) && typeof event.allSheets === 'boolean';
  }

  /**
   * 验证跨Sheet事件
   */
  private static validateCrossSheetEvent(event: any): boolean {
    return (
      event.sourceSheetKey &&
      typeof event.sourceSheetKey === 'string' &&
      Array.isArray(event.targetSheetKeys) &&
      typeof event.affectedFormulaCount === 'number'
    );
  }

  /**
   * 获取验证错误信息
   */
  static getErrorMessage(eventType: string, event: any): string {
    if (this.validate(eventType, event)) {
      return '';
    }

    return `事件数据验证失败: ${eventType} - ${JSON.stringify(event)}`;
  }
}
