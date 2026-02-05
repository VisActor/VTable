/**
 * 公式事件工具类测试
 */

import { FormulaEventUtils } from '../src/event/formula-event-utils';
import { WorkSheetEventManager } from '../src/event/worksheet-event-manager';
import { VTableSheetEventBus } from '../src/event/vtable-sheet-event-bus';
import type { FormulaErrorEvent, FormulaCalculateEvent } from '../src/ts-types/spreadsheet-events';

// 模拟 WorkSheet
const mockWorkSheet = {
  sheetKey: 'test-sheet',
  sheetTitle: 'Test Sheet',
  getEventBus: () => new VTableSheetEventBus()
} as any;

describe('FormulaEventUtils', () => {
  let eventManager: WorkSheetEventManager;
  let eventBus: VTableSheetEventBus;

  beforeEach(() => {
    eventBus = new VTableSheetEventBus();
    mockWorkSheet.getEventBus = () => eventBus;
    eventManager = new WorkSheetEventManager(mockWorkSheet);
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

      eventManager.emit('formula_error', errorEvent);

      expect(mockErrorHandler).toHaveBeenCalledWith(errorEvent);
    });
  });

  describe('onFormulaPerformanceMonitoring', () => {
    test('应该能监控慢公式计算', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      FormulaEventUtils.onFormulaPerformanceMonitoring(eventManager, 100); // 100ms阈值

      // 正常计算
      eventManager.emit('formula_calculate_end', {
        sheetKey: 'test-sheet',
        formulaCount: 5,
        duration: 50
      });

      expect(consoleWarnSpy).not.toHaveBeenCalled();

      // 慢计算
      eventManager.emit('formula_calculate_end', {
        sheetKey: 'test-sheet',
        formulaCount: 10,
        duration: 150
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('慢公式计算警告 - Sheet: test-sheet, 公式数量: 10, 耗时: 150ms');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('setupFormulaEventListeners', () => {
    test('应该能设置多个公式事件监听器', () => {
      const mockCallbacks = {
        onFormulaAdded: jest.fn(),
        onFormulaRemoved: jest.fn(),
        onFormulaError: jest.fn(),
        onFormulaCalculateStart: jest.fn(),
        onFormulaCalculateEnd: jest.fn(),
        onFormulaDependencyChanged: jest.fn()
      };

      FormulaEventUtils.setupFormulaEventListeners(eventManager, mockCallbacks);

      // 触发公式添加事件
      eventManager.emit('formula_added', {
        sheetKey: 'test-sheet',
        cell: { row: 1, col: 1 },
        formula: '=SUM(A1:A10)'
      });

      expect(mockCallbacks.onFormulaAdded).toHaveBeenCalledWith({ row: 1, col: 1 }, '=SUM(A1:A10)');

      // 触发公式移除事件
      eventManager.emit('formula_removed', {
        sheetKey: 'test-sheet',
        cell: { row: 2, col: 2 },
        formula: '=AVERAGE(B1:B5)'
      });

      expect(mockCallbacks.onFormulaRemoved).toHaveBeenCalledWith({ row: 2, col: 2 }, '=AVERAGE(B1:B5)');

      // 触发公式错误事件
      const errorEvent = {
        sheetKey: 'test-sheet',
        cell: { row: 3, col: 3, sheet: 'test-sheet' },
        formula: '=INVALID()',
        error: new Error('Invalid function')
      };
      eventManager.emit('formula_error', errorEvent);

      expect(mockCallbacks.onFormulaError).toHaveBeenCalledWith(errorEvent);

      // 触发公式计算开始事件
      eventManager.emit('formula_calculate_start', {
        sheetKey: 'test-sheet',
        formulaCount: 5
      });

      expect(mockCallbacks.onFormulaCalculateStart).toHaveBeenCalledWith(5);

      // 触发公式计算结束事件
      eventManager.emit('formula_calculate_end', {
        sheetKey: 'test-sheet',
        formulaCount: 5,
        duration: 100
      });

      expect(mockCallbacks.onFormulaCalculateEnd).toHaveBeenCalledWith(5, 100);

      // 触发公式依赖关系改变事件
      eventManager.emit('formula_dependency_changed', {
        sheetKey: 'test-sheet'
      });

      expect(mockCallbacks.onFormulaDependencyChanged).toHaveBeenCalledWith();
    });
  });

  describe('createFormulaProgressTracker', () => {
    test('应该能跟踪公式计算进度', () => {
      const mockProgressCallback = jest.fn();
      const progressTracker = FormulaEventUtils.createFormulaProgressTracker(eventManager, mockProgressCallback);

      // 开始跟踪
      progressTracker.start();

      // 模拟计算开始
      eventManager.emit('formula_calculate_start', {
        sheetKey: 'test-sheet',
        formulaCount: 10
      });

      expect(mockProgressCallback).toHaveBeenCalledWith(0, 10);

      // 模拟计算结束
      eventManager.emit('formula_calculate_end', {
        sheetKey: 'test-sheet',
        formulaCount: 10,
        duration: 200
      });

      expect(mockProgressCallback).toHaveBeenCalledWith(10, 10);

      // 结束跟踪
      progressTracker.end();
    });
  });

  describe('createFormulaErrorCollector', () => {
    test('应该能收集公式错误', () => {
      const errorCollector = FormulaEventUtils.createFormulaErrorCollector(eventManager);

      // 开始收集
      errorCollector.start();

      // 模拟一些公式错误
      const error1 = {
        sheetKey: 'test-sheet',
        cell: { row: 1, col: 1, sheet: 'test-sheet' },
        formula: '=A1/0',
        error: new Error('Division by zero')
      };

      const error2 = {
        sheetKey: 'test-sheet',
        cell: { row: 2, col: 2, sheet: 'test-sheet' },
        formula: '=INVALID()',
        error: new Error('Invalid function')
      };

      eventManager.emit('formula_error', error1);
      eventManager.emit('formula_error', error2);

      // 验证错误收集
      const errors = errorCollector.getErrors();
      expect(errors).toHaveLength(2);
      expect(errors[0]).toEqual(error1);
      expect(errors[1]).toEqual(error2);

      // 验证清空功能
      errorCollector.clear();
      expect(errorCollector.getErrors()).toHaveLength(0);

      // 结束收集
      errorCollector.end();
    });
  });
});
