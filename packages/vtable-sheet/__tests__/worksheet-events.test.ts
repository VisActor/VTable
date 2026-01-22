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

  test('应该能触发工作表准备就绪事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('ready', mockCallback);

    eventManager.emitReady();

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet'
    });
  });

  test('应该能触发工作表准备就绪事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('ready', mockCallback);

    eventManager.emitReady();

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet'
    });
  });

  test('应该能触发工作表尺寸改变事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('resized', mockCallback);

    eventManager.emitResized(800, 600);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet',
      width: 800,
      height: 600
    });
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

  test('应该能触发范围数据变更事件', () => {
    const mockCallback = jest.fn();
    eventManager.on('range_data_changed', mockCallback);

    const range = { startRow: 1, startCol: 1, endRow: 3, endCol: 3 };
    const changes = [
      { row: 1, col: 1, oldValue: 'A', newValue: 'B' },
      { row: 2, col: 2, oldValue: 10, newValue: 20 }
    ];

    eventManager.emitRangeDataChanged(range, changes);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      range: range,
      changes: changes
    });
  });

  test('应该能正确移除事件监听器', () => {
    const mockCallback = jest.fn();
    eventManager.on('ready', mockCallback);

    // 触发事件
    eventManager.emitReady();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 移除监听器
    eventManager.off('ready', mockCallback);

    // 再次触发事件
    eventManager.emitReady();
    expect(mockCallback).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能清除所有事件监听器', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    eventManager.on('ready', mockCallback1);
    eventManager.on('resized', mockCallback2);

    // 触发事件
    eventManager.emitReady();
    eventManager.emitResized(800, 600);

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);

    // 清除所有监听器
    eventManager.clearAllListeners();

    // 再次触发事件
    eventManager.emitReady();
    eventManager.emitReady();

    expect(mockCallback1).toHaveBeenCalledTimes(1); // 应该仍然是1次
    expect(mockCallback2).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能正确获取事件监听器数量', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    expect(eventManager.getListenerCount()).toBe(0);

    eventManager.on('ready', mockCallback1);
    expect(eventManager.getListenerCount()).toBe(1);

    eventManager.on('resized', mockCallback2);
    expect(eventManager.getListenerCount()).toBe(2);

    eventManager.on('ready', () => {}); // 同一个事件类型再加一个
    expect(eventManager.getListenerCount()).toBe(3);
    expect(eventManager.getListenerCount('ready')).toBe(2);
  });

  // 注意：工作表管理事件（SHEET_ADDED, SHEET_REMOVED, SHEET_RENAMED, SHEET_MOVED）
  // 现在只在 SpreadSheet 层级处理，不在 WorkSheet 层级重复定义
});
