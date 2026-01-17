/**
 * WorkSheet 层事件测试
 */

import { WorkSheetEventManager } from '../src/event/worksheet-event-manager';
import type { WorkSheet } from '../src/core/WorkSheet';
import { EventEmitter } from '@visactor/vutils';
import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';

// 模拟 WorkSheet
const mockWorkSheet = {
  sheetKey: 'test-sheet',
  sheetTitle: 'Test Sheet'
} as WorkSheet;

describe('WorkSheetEventManager', () => {
  let eventManager: WorkSheetEventManager;
  let eventBus: EventEmitter;

  beforeEach(() => {
    eventBus = new EventEmitter();
    eventManager = new WorkSheetEventManager(mockWorkSheet, eventBus);
  });

  afterEach(() => {
    eventManager.clearAllListeners();
  });

  test('应该能触发工作表激活事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.ACTIVATED, mockCallback);

    eventManager.emitActivated();

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet'
    });
  });

  test('应该能触发工作表停用事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.DEACTIVATED, mockCallback);

    eventManager.emitDeactivated();

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet'
    });
  });

  test('应该能触发工作表准备就绪事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.READY, mockCallback);

    eventManager.emitReady();

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      sheetTitle: 'Test Sheet'
    });
  });

  test('应该能触发工作表尺寸改变事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.RESIZED, mockCallback);

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
    eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_START, mockCallback);

    eventManager.emitFormulaCalculateStart(10);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      formulaCount: 10
    });
  });

  test('应该能触发公式计算结束事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.FORMULA_CALCULATE_END, mockCallback);

    eventManager.emitFormulaCalculateEnd(10, 500);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      formulaCount: 10,
      duration: 500
    });
  });

  test('应该能触发公式错误事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.FORMULA_ERROR, mockCallback);

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
    eventManager.on(WorkSheetEventType.FORMULA_ADDED, mockCallback);

    eventManager.emitFormulaAdded({ row: 1, col: 1 }, '=SUM(A1:A10)');

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      cell: { row: 1, col: 1 },
      formula: '=SUM(A1:A10)'
    });
  });

  test('应该能触发公式移除事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.FORMULA_REMOVED, mockCallback);

    eventManager.emitFormulaRemoved({ row: 1, col: 1 }, '=SUM(A1:A10)');

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      cell: { row: 1, col: 1 },
      formula: '=SUM(A1:A10)'
    });
  });

  test('应该能触发数据加载完成事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.DATA_LOADED, mockCallback);

    eventManager.emitDataLoaded(100, 20);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      rowCount: 100,
      colCount: 20
    });
  });

  test('应该能触发范围数据变更事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.RANGE_DATA_CHANGED, mockCallback);

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
    eventManager.on(WorkSheetEventType.ACTIVATED, mockCallback);

    // 触发事件
    eventManager.emitActivated();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 移除监听器
    eventManager.off(WorkSheetEventType.ACTIVATED, mockCallback);

    // 再次触发事件
    eventManager.emitActivated();
    expect(mockCallback).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能清除所有事件监听器', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    eventManager.on(WorkSheetEventType.ACTIVATED, mockCallback1);
    eventManager.on(WorkSheetEventType.READY, mockCallback2);

    // 触发事件
    eventManager.emitActivated();
    eventManager.emitReady();

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);

    // 清除所有监听器
    eventManager.clearAllListeners();

    // 再次触发事件
    eventManager.emitActivated();
    eventManager.emitReady();

    expect(mockCallback1).toHaveBeenCalledTimes(1); // 应该仍然是1次
    expect(mockCallback2).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能正确获取事件监听器数量', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    expect(eventManager.getListenerCount()).toBe(0);

    eventManager.on(WorkSheetEventType.ACTIVATED, mockCallback1);
    expect(eventManager.getListenerCount()).toBe(1);

    eventManager.on(WorkSheetEventType.READY, mockCallback2);
    expect(eventManager.getListenerCount()).toBe(2);

    eventManager.on(WorkSheetEventType.ACTIVATED, () => {}); // 同一个事件类型再加一个
    expect(eventManager.getListenerCount()).toBe(3);
    expect(eventManager.getListenerCount(WorkSheetEventType.ACTIVATED)).toBe(2);
  });

  test('应该能触发工作表添加事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.SHEET_ADDED, mockCallback);

    eventManager.emitSheetAdded('new-sheet', 'New Sheet', 1);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'new-sheet',
      sheetTitle: 'New Sheet',
      index: 1
    });
  });

  test('应该能触发工作表移除事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.SHEET_REMOVED, mockCallback);

    eventManager.emitSheetRemoved('removed-sheet', 'Removed Sheet', 2);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'removed-sheet',
      sheetTitle: 'Removed Sheet',
      index: 2
    });
  });

  test('应该能触发工作表重命名事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.SHEET_RENAMED, mockCallback);

    eventManager.emitSheetRenamed('test-sheet', 'Old Title', 'New Title');

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      oldTitle: 'Old Title',
      newTitle: 'New Title'
    });
  });

  test('应该能触发工作表移动事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(WorkSheetEventType.SHEET_MOVED, mockCallback);

    eventManager.emitSheetMoved('moved-sheet', 1, 3);

    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'moved-sheet',
      fromIndex: 1,
      toIndex: 3
    });
  });
});
