/**
 * 公式事件工具类测试
 */

import { FormulaEventUtils } from '../src/event/formula-event-utils';
import { WorkSheetEventManager } from '../src/event/worksheet-event-manager';
import type { WorkSheet } from '../src/core/WorkSheet';
import { EventEmitter } from '@visactor/vutils';
import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';

// 模拟 WorkSheet
const mockWorkSheet = {
  sheetKey: 'test-sheet',
  sheetTitle: 'Test Sheet'
} as WorkSheet;

describe('FormulaEventUtils', () => {
  let eventManager: WorkSheetEventManager;
  let eventBus: EventEmitter;

  beforeEach(() => {
    eventBus = new EventEmitter();
    eventManager = new WorkSheetEventManager(mockWorkSheet, eventBus);
  });

  afterEach(() => {
    eventManager.clearAllListeners();
  });

  describe('onFormulaErrorWithUserFeedback', () => {
    test('应该能处理公式错误事件', () => {
      const mockErrorHandler = jest.fn();
      FormulaEventUtils.onFormulaErrorWithUserFeedback(eventManager, mockErrorHandler);

      const errorEvent = {
        sheetKey: 'test-sheet',
        cell: { row: 1, col: 1, sheet: 'test-sheet' },
        formula: '=A1/0',
        error: new Error('Division by zero')
      };

      eventManager.emit(WorkSheetEventType.FORMULA_ERROR, errorEvent);

      expect(mockErrorHandler).toHaveBeenCalledWith(errorEvent);
    });
  });

  describe('onFormulaPerformanceMonitoring', () => {
    test('应该能监控慢公式计算', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      FormulaEventUtils.onFormulaPerformanceMonitoring(eventManager, 100); // 100ms阈值

      // 正常计算
      eventManager.emit(WorkSheetEventType.FORMULA_CALCULATE_END, {
        sheetKey: 'test-sheet',
        formulaCount: 5,
        duration: 50
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();

      // 慢计算
      eventManager.emit(WorkSheetEventType.FORMULA_CALCULATE_END, {
        sheetKey: 'test-sheet',
        formulaCount: 10,
        duration: 150
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('慢公式计算警告'));

      consoleWarnSpy.mockRestore();
    });
  });

  describe('setupFormulaEventListeners', () => {
    test('应该能设置多个公式事件监听器', () => {
      const mockOnFormulaAdded = jest.fn();
      const mockOnFormulaRemoved = jest.fn();
      const mockOnFormulaError = jest.fn();

      FormulaEventUtils.setupFormulaEventListeners(eventManager, {
        onFormulaAdded: mockOnFormulaAdded,
        onFormulaRemoved: mockOnFormulaRemoved,
        onFormulaError: mockOnFormulaError
      });

      // 触发公式添加事件
      eventManager.emit(WorkSheetEventType.FORMULA_ADDED, {
        sheetKey: 'test-sheet',
        cell: { row: 1, col: 1 },
        formula: '=SUM(A1:A10)'
      });

      expect(mockOnFormulaAdded).toHaveBeenCalledWith({ row: 1, col: 1 }, '=SUM(A1:A10)');

      // 触发公式移除事件
      eventManager.emit(WorkSheetEventType.FORMULA_REMOVED, {
        sheetKey: 'test-sheet',
        cell: { row: 2, col: 2 },
        formula: '=AVERAGE(B1:B10)'
      });

      expect(mockOnFormulaRemoved).toHaveBeenCalledWith({ row: 2, col: 2 }, '=AVERAGE(B1:B10)');

      // 触发公式错误事件
      const errorEvent = {
        sheetKey: 'test-sheet',
        cell: { row: 3, col: 3, sheet: 'test-sheet' },
        formula: '=C1/0',
        error: new Error('Division by zero')
      };

      eventManager.emit(WorkSheetEventType.FORMULA_ERROR, errorEvent);

      expect(mockOnFormulaError).toHaveBeenCalledWith(errorEvent);
    });
  });

  describe('createFormulaProgressTracker', () => {
    test('应该能跟踪公式计算进度', () => {
      const mockOnProgress = jest.fn();
      const progressTracker = FormulaEventUtils.createFormulaProgressTracker(eventManager, mockOnProgress);

      progressTracker.start();

      // 开始计算
      eventManager.emit(WorkSheetEventType.FORMULA_CALCULATE_START, {
        sheetKey: 'test-sheet',
        formulaCount: 10
      });

      expect(mockOnProgress).toHaveBeenCalledWith(0, 10);

      // 结束计算
      eventManager.emit(WorkSheetEventType.FORMULA_CALCULATE_END, {
        sheetKey: 'test-sheet',
        formulaCount: 10,
        duration: 100
      });

      expect(mockOnProgress).toHaveBeenCalledWith(10, 10);

      progressTracker.end();
    });
  });

  describe('createFormulaErrorCollector', () => {
    test('应该能收集公式错误', () => {
      const errorCollector = FormulaEventUtils.createFormulaErrorCollector(eventManager);

      errorCollector.start();

      // 触发一些错误
      const error1 = {
        sheetKey: 'test-sheet',
        cell: { row: 1, col: 1, sheet: 'test-sheet' },
        formula: '=A1/0',
        error: new Error('Division by zero')
      };

      const error2 = {
        sheetKey: 'test-sheet',
        cell: { row: 2, col: 2, sheet: 'test-sheet' },
        formula: '=INVALID',
        error: new Error('Invalid formula')
      };

      eventManager.emit(WorkSheetEventType.FORMULA_ERROR, error1);
      eventManager.emit(WorkSheetEventType.FORMULA_ERROR, error2);

      const errors = errorCollector.getErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0]).toEqual(error1);
      expect(errors[1]).toEqual(error2);

      // 清除错误
      errorCollector.clear();
      expect(errorCollector.getErrors()).toHaveLength(0);

      errorCollector.end();
    });
  });
});
