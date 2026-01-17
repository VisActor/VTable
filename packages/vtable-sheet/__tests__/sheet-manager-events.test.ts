/**
 * SheetManager 事件测试
 * 测试通过 SheetManager 触发的工作表事件
 */

import SheetManager from '../src/managers/sheet-manager';
import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';
import type { ISheetDefine } from '../src/ts-types';

describe('SheetManager 事件测试', () => {
  let sheetManager: SheetManager;

  beforeEach(() => {
    sheetManager = new SheetManager();
  });

  test('应该能触发工作表添加事件', () => {
    const mockCallback = jest.fn();
    const eventBus = sheetManager.getEventBus();
    eventBus.on(WorkSheetEventType.SHEET_ADDED, mockCallback);

    const newSheet: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };

    sheetManager.addSheet(newSheet);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      index: 0
    });
  });

  test('应该能触发工作表移除事件', () => {
    const mockCallback = jest.fn();
    const eventBus = sheetManager.getEventBus();
    eventBus.on(WorkSheetEventType.SHEET_REMOVED, mockCallback);

    // 先添加一个工作表
    const sheet1: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet1);

    // 重置mock以清除添加事件的调用
    mockCallback.mockClear();

    // 再添加第二个工作表
    const sheet2: ISheetDefine = {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet2);

    // 移除第一个工作表
    sheetManager.removeSheet('sheet1');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      index: 0
    });
  });

  test('应该能触发工作表重命名事件', () => {
    const mockCallback = jest.fn();
    const eventBus = sheetManager.getEventBus();
    eventBus.on(WorkSheetEventType.SHEET_RENAMED, mockCallback);

    // 添加工作表
    const sheet: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet);

    // 重命名工作表
    sheetManager.renameSheet('sheet1', 'Renamed Sheet');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet1',
      oldTitle: 'Sheet 1',
      newTitle: 'Renamed Sheet'
    });
  });

  test('应该能触发工作表移动事件', () => {
    const mockCallback = jest.fn();
    const eventBus = sheetManager.getEventBus();
    eventBus.on(WorkSheetEventType.SHEET_MOVED, mockCallback);

    // 添加三个工作表
    const sheet1: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    const sheet2: ISheetDefine = {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    const sheet3: ISheetDefine = {
      sheetKey: 'sheet3',
      sheetTitle: 'Sheet 3',
      rowCount: 10,
      columnCount: 10,
      data: []
    };

    sheetManager.addSheet(sheet1);
    sheetManager.addSheet(sheet2);
    sheetManager.addSheet(sheet3);

    // 移动工作表（将sheet3移动到sheet1前面）
    sheetManager.reorderSheet('sheet3', 'sheet1', 'left');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      sheetKey: 'sheet3',
      fromIndex: 2,
      toIndex: 0
    });
  });

  test('应该能同时监听多个工作表事件', () => {
    const sheetAddedCallback = jest.fn();
    const sheetRemovedCallback = jest.fn();
    const sheetRenamedCallback = jest.fn();
    const sheetMovedCallback = jest.fn();

    const eventBus = sheetManager.getEventBus();
    eventBus.on(WorkSheetEventType.SHEET_ADDED, sheetAddedCallback);
    eventBus.on(WorkSheetEventType.SHEET_REMOVED, sheetRemovedCallback);
    eventBus.on(WorkSheetEventType.SHEET_RENAMED, sheetRenamedCallback);
    eventBus.on(WorkSheetEventType.SHEET_MOVED, sheetMovedCallback);

    // 添加工作表
    const sheet1: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet1);

    // 重命名工作表
    sheetManager.renameSheet('sheet1', 'Renamed Sheet');

    // 添加第二个工作表
    const sheet2: ISheetDefine = {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet2);

    // 移动工作表
    sheetManager.reorderSheet('sheet2', 'sheet1', 'left');

    // 移除工作表
    sheetManager.removeSheet('sheet2');

    expect(sheetAddedCallback).toHaveBeenCalledTimes(2);
    expect(sheetRenamedCallback).toHaveBeenCalledTimes(1);
    expect(sheetMovedCallback).toHaveBeenCalledTimes(1);
    expect(sheetRemovedCallback).toHaveBeenCalledTimes(1);
  });

  test('应该能移除事件监听器', () => {
    const mockCallback = jest.fn();
    const eventBus = sheetManager.getEventBus();

    eventBus.on(WorkSheetEventType.SHEET_ADDED, mockCallback);

    // 添加工作表（应该触发事件）
    const sheet: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    // 移除事件监听器
    eventBus.off(WorkSheetEventType.SHEET_ADDED, mockCallback);

    // 再次添加工作表（不应该触发事件）
    const sheet2: ISheetDefine = {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    sheetManager.addSheet(sheet2);

    expect(mockCallback).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能处理复杂的工作表操作流程', () => {
    const events: string[] = [];
    const eventBus = sheetManager.getEventBus();

    // 注册各种事件监听器，记录事件顺序
    eventBus.on(WorkSheetEventType.SHEET_ADDED, event => {
      events.push(`ADDED:${event.sheetKey}`);
    });

    eventBus.on(WorkSheetEventType.SHEET_RENAMED, event => {
      events.push(`RENAMED:${event.sheetKey}:${event.oldTitle}->${event.newTitle}`);
    });

    eventBus.on(WorkSheetEventType.SHEET_MOVED, event => {
      events.push(`MOVED:${event.sheetKey}:${event.fromIndex}->${event.toIndex}`);
    });

    eventBus.on(WorkSheetEventType.SHEET_REMOVED, event => {
      events.push(`REMOVED:${event.sheetKey}`);
    });

    // 模拟一个复杂的工作表操作流程
    const sheet1: ISheetDefine = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    const sheet2: ISheetDefine = {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      rowCount: 10,
      columnCount: 10,
      data: []
    };
    const sheet3: ISheetDefine = {
      sheetKey: 'sheet3',
      sheetTitle: 'Sheet 3',
      rowCount: 10,
      columnCount: 10,
      data: []
    };

    sheetManager.addSheet(sheet1);
    sheetManager.renameSheet('sheet1', 'Main Sheet');
    sheetManager.addSheet(sheet2);
    sheetManager.addSheet(sheet3);
    sheetManager.reorderSheet('sheet3', 'sheet1', 'left');
    sheetManager.removeSheet('sheet2');

    // 验证事件顺序
    expect(events).toEqual([
      'ADDED:sheet1',
      'RENAMED:sheet1:Sheet 1->Main Sheet',
      'ADDED:sheet2',
      'ADDED:sheet3',
      'MOVED:sheet3:2->0',
      'REMOVED:sheet2'
    ]);
  });
});
