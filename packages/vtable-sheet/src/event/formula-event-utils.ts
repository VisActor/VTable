/**
 * 公式事件处理工具类
 * 提供常用的公式事件处理功能
 */

import type { WorkSheetEventManager } from './worksheet-event-manager';
import { WorkSheetEventType } from '../ts-types/spreadsheet-events';
import type { FormulaErrorEvent, FormulaCalculateEvent } from '../ts-types/spreadsheet-events';

/**
 * 公式事件处理工具类
 */
export class FormulaEventUtils {
  /**
   * 监听公式错误事件并显示用户友好的错误信息
   */
  static onFormulaErrorWithUserFeedback(
    eventManager: WorkSheetEventManager,
    errorHandler: (error: FormulaErrorEvent) => void
  ): void {
    eventManager.on(WorkSheetEventType.FORMULA_ERROR, (event: FormulaErrorEvent) => {
      // 调用用户提供的错误处理器
      errorHandler(event);

      // 可以在这里添加默认的错误处理逻辑
      console.error(`公式错误 - Sheet: ${event.sheetKey}, 单元格: [${event.cell.row}, ${event.cell.col}]`, event.error);
    });
  }

  /**
   * 监听公式计算性能并记录慢查询
   */
  static onFormulaPerformanceMonitoring(
    eventManager: WorkSheetEventManager,
    threshold: number = 1000 // 默认阈值1秒
  ): void {
    eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_END, (event: FormulaCalculateEvent) => {
      if (event.duration && event.duration > threshold) {
        console.warn(
          `慢公式计算警告 - Sheet: ${event.sheetKey}, 公式数量: ${event.formulaCount}, 耗时: ${event.duration}ms`
        );
      }
    });
  }

  /**
   * 批量监听多个公式相关事件
   */
  static setupFormulaEventListeners(
    eventManager: WorkSheetEventManager,
    listeners: {
      onFormulaAdded?: (cell: { row: number; col: number }, formula?: string) => void;
      onFormulaRemoved?: (cell: { row: number; col: number }, formula?: string) => void;
      onFormulaError?: (event: FormulaErrorEvent) => void;
      onFormulaCalculateStart?: (formulaCount?: number) => void;
      onFormulaCalculateEnd?: (formulaCount?: number, duration?: number) => void;
      onFormulaDependencyChanged?: () => void;
    }
  ): void {
    if (listeners.onFormulaAdded) {
      eventManager.on(WorkSheetEventType.FORMULA_ADDED, event => {
        listeners.onFormulaAdded!(event.cell, event.formula);
      });
    }

    if (listeners.onFormulaRemoved) {
      eventManager.on(WorkSheetEventType.FORMULA_REMOVED, event => {
        listeners.onFormulaRemoved!(event.cell, event.formula);
      });
    }

    if (listeners.onFormulaError) {
      eventManager.on(WorkSheetEventType.FORMULA_ERROR, listeners.onFormulaError);
    }

    if (listeners.onFormulaCalculateStart) {
      eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_START, event => {
        listeners.onFormulaCalculateStart!(event.formulaCount);
      });
    }

    if (listeners.onFormulaCalculateEnd) {
      eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_END, event => {
        listeners.onFormulaCalculateEnd!(event.formulaCount, event.duration);
      });
    }

    if (listeners.onFormulaDependencyChanged) {
      eventManager.on(WorkSheetEventType.FORMULA_DEPENDENCY_CHANGED, listeners.onFormulaDependencyChanged);
    }
  }

  /**
   * 创建公式计算进度跟踪器
   */
  static createFormulaProgressTracker(
    eventManager: WorkSheetEventManager,
    onProgress?: (progress: number, total: number) => void
  ): {
    start: () => void;
    end: () => void;
  } {
    let startTime: number;
    let totalFormulas: number;

    const startListener = (event: FormulaCalculateEvent) => {
      startTime = Date.now();
      totalFormulas = event.formulaCount || 0;
      if (onProgress) {
        onProgress(0, totalFormulas);
      }
    };

    const endListener = (event: FormulaCalculateEvent) => {
      const duration = event.duration || Date.now() - startTime;
      if (onProgress) {
        onProgress(totalFormulas, totalFormulas);
      }
      console.log(`公式计算完成 - 数量: ${event.formulaCount}, 耗时: ${duration}ms`);
    };

    return {
      start: () => {
        eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_START, startListener);
        eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_END, endListener);
      },
      end: () => {
        eventManager.off(WorkSheetEventType.FORMULA_CALCULATE_START, startListener);
        eventManager.off(WorkSheetEventType.FORMULA_CALCULATE_END, endListener);
      }
    };
  }

  /**
   * 创建公式错误统计器
   */
  static createFormulaErrorCollector(eventManager: WorkSheetEventManager): {
    getErrors: () => FormulaErrorEvent[];
    clear: () => void;
    start: () => void;
    end: () => void;
  } {
    const errors: FormulaErrorEvent[] = [];

    const errorListener = (event: FormulaErrorEvent) => {
      errors.push(event);
    };

    return {
      getErrors: () => [...errors],
      clear: () => {
        errors.length = 0;
      },
      start: () => {
        eventManager.on(WorkSheetEventType.FORMULA_ERROR, errorListener);
      },
      end: () => {
        eventManager.off(WorkSheetEventType.FORMULA_ERROR, errorListener);
      }
    };
  }
}
