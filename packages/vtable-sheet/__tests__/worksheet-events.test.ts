/**
 * WorkSheet 层事件测试
 */

import { WorkSheetEventManager } from '../src/event/worksheet-event-manager';
import type { WorkSheet } from '../src/core/WorkSheet';
import { VTableSheetEventBus } from '../src/event/vtable-sheet-event-bus';
import { VTableSheetEventType } from '../src/ts-types/spreadsheet-events';

// 模拟 WorkSheet
const mockWorkSheet = {
  sheetKey: 'test-sheet',
  sheetTitle: 'Test Sheet',
  getEventBus: () => new VTableSheetEventBus()
} as any;

describe('WorkSheetEventManager', () => {
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

  test('应该能触发公式计算开始事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('formula_calculate_start', mockCallback);

    eventManager.emitFormulaCalculateStart(10);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      formulaCount: 10
    });
  });

  test('应该能触发公式计算结束事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('formula_calculate_end', mockCallback);

    eventManager.emitFormulaCalculateEnd(10, 500);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      formulaCount: 10,
      duration: 500
    });
  });

  test('应该能触发公式错误事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('formula_error', mockCallback);

    const error = new Error('Division by zero');
    eventManager.emitFormulaError({ row: 1, col: 1, sheet: 'test-sheet' }, '=A1/0', error);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      cell: { row: 1, col: 1, sheet: 'test-sheet' },
      formula: '=A1/0',
      error: error
    });
  });

  test('应该能触发公式添加事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('formula_added', mockCallback);

    eventManager.emitFormulaAdded({ row: 1, col: 1 }, '=SUM(A1:A10)');

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      cell: { row: 1, col: 1 },
      formula: '=SUM(A1:A10)'
    });
  });

  test('应该能触发公式移除事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('formula_removed', mockCallback);

    eventManager.emitFormulaRemoved({ row: 1, col: 1 }, '=SUM(A1:A10)');

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      cell: { row: 1, col: 1 },
      formula: '=SUM(A1:A10)'
    });
  });

  test('应该能触发数据加载完成事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('data_loaded', mockCallback);

    eventManager.emitDataLoaded(100, 20);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      rowCount: 100,
      colCount: 20
    });
  });

  // 注意：工作表管理事件（SHEET_ADDED, SHEET_REMOVED, SHEET_RENAMED, SHEET_MOVED）
  // 现在只在 SpreadSheet 层级处理，不在 WorkSheet 层级重复定义
});
