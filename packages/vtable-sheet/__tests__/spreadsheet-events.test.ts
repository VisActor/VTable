/**
 * SpreadSheet 层事件测试
 * 测试电子表格应用级别的事件
 */

import { SpreadSheetEventManager } from '../src/event/spreadsheet-event-manager';
import { VTableSheetEventType } from '../src/ts-types/spreadsheet-events';
import { VTableSheetEventBus } from '../src/event/vtable-sheet-event-bus';

describe('SpreadSheetEventManager', () => {
  let eventManager: SpreadSheetEventManager;
  let mockSpreadSheet: any;
  let eventBus: VTableSheetEventBus;

  beforeEach(() => {
    eventBus = new VTableSheetEventBus();
    mockSpreadSheet = {
      getEventBus: () => eventBus
    };
    eventManager = new SpreadSheetEventManager(mockSpreadSheet);
  });

  afterEach(() => {
    eventManager.clearAllListeners();
  });

  test('应该能触发电子表格准备就绪事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, mockCallback);

    eventManager.emitReady();

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(undefined);
  });

  test('应该能触发电子表格销毁事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SPREADSHEET_DESTROYED, mockCallback);

    eventManager.emitDestroyed();

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(undefined);
  });

  test('应该能触发电子表格尺寸改变事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SPREADSHEET_RESIZED, mockCallback);

    eventManager.emitResized(800, 600);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({ width: 800, height: 600 });
  });

  test('应该能触发工作表添加事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SHEET_ADDED, mockCallback);

    eventManager.emitSheetAdded('sheet1', 'Sheet 1', 0);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      index: 0
    });
  });

  test('应该能触发工作表移除事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SHEET_REMOVED, mockCallback);

    eventManager.emitSheetRemoved('sheet1', 'Sheet 1', 0);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      index: 0
    });
  });

  test('应该能触发工作表重命名事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SHEET_RENAMED, mockCallback);

    eventManager.emitSheetRenamed('sheet1', 'Old Name', 'New Name');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      oldTitle: 'Old Name',
      newTitle: 'New Name'
    });
  });

  test('应该能触发工作表激活事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SHEET_ACTIVATED, mockCallback);

    eventManager.emitSheetActivated('sheet2', 'Sheet 2', 'sheet1', 'Sheet 1');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      previousSheetKey: 'sheet1',
      previousSheetTitle: 'Sheet 1'
    });
  });

  test('应该能触发工作表移动事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SHEET_MOVED, mockCallback);

    eventManager.emitSheetMoved('sheet1', 2, 0);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      fromIndex: 2,
      toIndex: 0
    });
  });

  test('应该能触发工作表可见性改变事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SHEET_VISIBILITY_CHANGED, mockCallback);

    eventManager.emitSheetVisibilityChanged('sheet1', false);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      visible: false
    });
  });

  test('应该能触发导入开始事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.IMPORT_START, mockCallback);

    eventManager.emitImportStart('xlsx');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      fileType: 'xlsx'
    });
  });

  test('应该能触发导入完成事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.IMPORT_COMPLETED, mockCallback);

    eventManager.emitImportCompleted('xlsx', 3);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      fileType: 'xlsx',
      sheetCount: 3
    });
  });

  test('应该能触发导入失败事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.IMPORT_ERROR, mockCallback);

    const error = new Error('Import failed');
    eventManager.emitImportError('xlsx', error);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      fileType: 'xlsx',
      error: error
    });
  });

  test('应该能触发导出开始事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.EXPORT_START, mockCallback);

    eventManager.emitExportStart('xlsx', true);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      fileType: 'xlsx',
      allSheets: true
    });
  });

  test('应该能触发导出完成事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.EXPORT_COMPLETED, mockCallback);

    eventManager.emitExportCompleted('xlsx', true, 5);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      fileType: 'xlsx',
      allSheets: true,
      sheetCount: 5
    });
  });

  test('应该能触发导出失败事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.EXPORT_ERROR, mockCallback);

    const error = new Error('Export failed');
    eventManager.emitExportError('xlsx', true, error);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      fileType: 'xlsx',
      allSheets: true,
      error: error
    });
  });

  test('应该能触发跨工作表引用更新事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.CROSS_SHEET_REFERENCE_UPDATED, mockCallback);

    eventManager.emitCrossSheetReferenceUpdated('sheet1', ['sheet2', 'sheet3'], 10);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sourceSheetKey: 'sheet1',
      targetSheetKeys: ['sheet2', 'sheet3'],
      affectedFormulaCount: 10
    });
  });

  test('应该能触发跨工作表公式计算开始事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START, mockCallback);

    eventManager.emitCrossSheetFormulaCalculateStart();

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(undefined);
  });

  test('应该能触发跨工作表公式计算结束事件', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END, mockCallback);

    eventManager.emitCrossSheetFormulaCalculateEnd();

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(undefined);
  });

  test('应该能正确移除事件监听器', () => {
    const mockCallback = jest.fn();
    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, mockCallback);

    // 触发事件
    eventManager.emitReady();
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 移除监听器
    eventManager.off(VTableSheetEventType.SPREADSHEET_READY, mockCallback);

    // 再次触发事件
    eventManager.emitReady();
    expect(mockCallback).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能清除所有事件监听器', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, mockCallback1);
    eventManager.on(VTableSheetEventType.SPREADSHEET_DESTROYED, mockCallback2);

    // 触发事件
    eventManager.emitReady();
    eventManager.emitDestroyed();

    expect(mockCallback1).toHaveBeenCalledTimes(1);
    expect(mockCallback2).toHaveBeenCalledTimes(1);

    // 清除所有监听器
    eventManager.clearAllListeners();

    // 再次触发事件
    eventManager.emitReady();
    eventManager.emitDestroyed();

    expect(mockCallback1).toHaveBeenCalledTimes(1); // 应该仍然是1次
    expect(mockCallback2).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能正确获取事件监听器数量', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    expect(eventManager.getListenerCount()).toBe(0);

    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, mockCallback1);
    expect(eventManager.getListenerCount()).toBe(1);

    eventManager.on(VTableSheetEventType.SPREADSHEET_DESTROYED, mockCallback2);
    expect(eventManager.getListenerCount()).toBe(2);

    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, () => {}); // 同一个事件类型再加一个
    expect(eventManager.getListenerCount()).toBe(3);
    expect(eventManager.getListenerCount(VTableSheetEventType.SPREADSHEET_READY)).toBe(2);
  });

  test('应该能同时监听多个电子表格事件', () => {
    const readyCallback = jest.fn();
    const sheetAddedCallback = jest.fn();
    const importCompletedCallback = jest.fn();
    const exportErrorCallback = jest.fn();

    // 注册各种事件监听器
    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, readyCallback);
    eventManager.on(VTableSheetEventType.SHEET_ADDED, sheetAddedCallback);
    eventManager.on(VTableSheetEventType.IMPORT_COMPLETED, importCompletedCallback);
    eventManager.on(VTableSheetEventType.EXPORT_ERROR, exportErrorCallback);

    // 触发各种事件
    eventManager.emitReady();
    eventManager.emitSheetAdded('sheet1', 'Sheet 1', 0);
    eventManager.emitImportCompleted('xlsx', 3);
    eventManager.emitExportError('csv', false, new Error('Export failed'));

    expect(readyCallback).toHaveBeenCalledTimes(1);
    expect(sheetAddedCallback).toHaveBeenCalledTimes(1);
    expect(importCompletedCallback).toHaveBeenCalledTimes(1);
    expect(exportErrorCallback).toHaveBeenCalledTimes(1);
  });

  test('应该能处理复杂的电子表格操作流程', () => {
    const events: string[] = [];

    // 注册各种事件监听器，记录事件顺序
    eventManager.on(VTableSheetEventType.SPREADSHEET_READY, () => {
      events.push('READY');
    });

    eventManager.on(VTableSheetEventType.SHEET_ADDED, event => {
      events.push(`ADDED:${event.sheetKey}`);
    });

    eventManager.on(VTableSheetEventType.SHEET_ACTIVATED, event => {
      events.push(`ACTIVATED:${event.sheetKey}`);
    });

    eventManager.on(VTableSheetEventType.SHEET_RENAMED, event => {
      events.push(`RENAMED:${event.sheetKey}:${event.oldTitle}->${event.newTitle}`);
    });

    eventManager.on(VTableSheetEventType.SHEET_MOVED, event => {
      events.push(`MOVED:${event.sheetKey}:${event.fromIndex}->${event.toIndex}`);
    });

    eventManager.on(VTableSheetEventType.SHEET_REMOVED, event => {
      events.push(`REMOVED:${event.sheetKey}`);
    });

    eventManager.on(VTableSheetEventType.IMPORT_COMPLETED, event => {
      events.push(`IMPORT_COMPLETED:${event.fileType}:${event.sheetCount}`);
    });

    eventManager.on(VTableSheetEventType.EXPORT_COMPLETED, event => {
      events.push(`EXPORT_COMPLETED:${event.fileType}:${event.sheetCount}`);
    });

    eventManager.on(VTableSheetEventType.SPREADSHEET_DESTROYED, () => {
      events.push('DESTROYED');
    });

    // 模拟一个复杂的电子表格操作流程
    eventManager.emitReady();
    eventManager.emitSheetAdded('sheet1', 'Sheet 1', 0);
    eventManager.emitSheetActivated('sheet1', 'Sheet 1');
    eventManager.emitSheetRenamed('sheet1', 'Sheet 1', 'Main Sheet');
    eventManager.emitSheetAdded('sheet2', 'Sheet 2', 1);
    eventManager.emitSheetAdded('sheet3', 'Sheet 3', 2);
    eventManager.emitSheetMoved('sheet3', 2, 0);
    eventManager.emitImportCompleted('xlsx', 3);
    eventManager.emitExportCompleted('csv', false, 1);
    eventManager.emitSheetRemoved('sheet2', 'Sheet 2', 1);
    eventManager.emitDestroyed();

    // 验证事件顺序
    expect(events).toEqual([
      'READY',
      'ADDED:sheet1',
      'ACTIVATED:sheet1',
      'RENAMED:sheet1:Sheet 1->Main Sheet',
      'ADDED:sheet2',
      'ADDED:sheet3',
      'MOVED:sheet3:2->0',
      'IMPORT_COMPLETED:xlsx:3',
      'EXPORT_COMPLETED:csv:1',
      'REMOVED:sheet2',
      'DESTROYED'
    ]);
  });
});
