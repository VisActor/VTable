/**
 * WorkSheet 事件集成测试 - 简化版本
 * 测试通过 VTableSheet 组件触发的工作表事件
 */

import { WorkSheetEventManager } from '../src/event/worksheet-event-manager';
import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';
import { EventEmitter } from '@visactor/vutils';

// 模拟 WorkSheet
const mockWorkSheet = {
  sheetKey: 'test-sheet',
  sheetTitle: 'Test Sheet'
} as any;

describe('WorkSheet 事件集成测试', () => {
  let eventManager: WorkSheetEventManager;
  let eventBus: EventEmitter;

  beforeEach(() => {
    eventBus = new EventEmitter();
    eventManager = new WorkSheetEventManager(mockWorkSheet, eventBus);
  });

  afterEach(() => {
    eventManager.clearAllListeners();
  });

  test('应该能正确触发工作表添加事件', () => {
    const sheetAddedCallback = jest.fn();

    // 注册工作表添加事件监听器
    eventManager.on(WorkSheetEventType.SHEET_ADDED, sheetAddedCallback);

    // 触发工作表添加事件
    eventManager.emitSheetAdded('new-sheet', 'New Sheet', 1);

    expect(sheetAddedCallback).toHaveBeenCalledTimes(1);
    expect(sheetAddedCallback).toHaveBeenCalledWith({
      sheetKey: 'new-sheet',
      sheetTitle: 'New Sheet',
      index: 1
    });
  });

  test('应该能正确触发工作表移除事件', () => {
    const sheetRemovedCallback = jest.fn();

    // 注册工作表移除事件监听器
    eventManager.on(WorkSheetEventType.SHEET_REMOVED, sheetRemovedCallback);

    // 触发工作表移除事件
    eventManager.emitSheetRemoved('removed-sheet', 'Removed Sheet', 2);

    expect(sheetRemovedCallback).toHaveBeenCalledTimes(1);
    expect(sheetRemovedCallback).toHaveBeenCalledWith({
      sheetKey: 'removed-sheet',
      sheetTitle: 'Removed Sheet',
      index: 2
    });
  });

  test('应该能正确触发工作表重命名事件', () => {
    const sheetRenamedCallback = jest.fn();

    // 注册工作表重命名事件监听器
    eventManager.on(WorkSheetEventType.SHEET_RENAMED, sheetRenamedCallback);

    // 触发工作表重命名事件
    eventManager.emitSheetRenamed('test-sheet', 'Old Title', 'New Title');

    expect(sheetRenamedCallback).toHaveBeenCalledTimes(1);
    expect(sheetRenamedCallback).toHaveBeenCalledWith({
      sheetKey: 'test-sheet',
      oldTitle: 'Old Title',
      newTitle: 'New Title'
    });
  });

  test('应该能正确触发工作表移动事件', () => {
    const sheetMovedCallback = jest.fn();

    // 注册工作表移动事件监听器
    eventManager.on(WorkSheetEventType.SHEET_MOVED, sheetMovedCallback);

    // 触发工作表移动事件
    eventManager.emitSheetMoved('moved-sheet', 1, 3);

    expect(sheetMovedCallback).toHaveBeenCalledTimes(1);
    expect(sheetMovedCallback).toHaveBeenCalledWith({
      sheetKey: 'moved-sheet',
      fromIndex: 1,
      toIndex: 3
    });
  });

  test('应该能同时监听多个工作表事件', () => {
    const sheetAddedCallback = jest.fn();
    const sheetRemovedCallback = jest.fn();
    const sheetRenamedCallback = jest.fn();
    const sheetMovedCallback = jest.fn();

    // 注册所有事件监听器
    eventManager.on(WorkSheetEventType.SHEET_ADDED, sheetAddedCallback);
    eventManager.on(WorkSheetEventType.SHEET_REMOVED, sheetRemovedCallback);
    eventManager.on(WorkSheetEventType.SHEET_RENAMED, sheetRenamedCallback);
    eventManager.on(WorkSheetEventType.SHEET_MOVED, sheetMovedCallback);

    // 触发各种事件
    eventManager.emitSheetAdded('sheet2', 'Sheet 2', 1);
    eventManager.emitSheetRenamed('sheet1', 'Sheet 1', 'Renamed Sheet');
    eventManager.emitSheetMoved('sheet2', 1, 0);
    eventManager.emitSheetRemoved('sheet2', 'Sheet 2', 1);

    expect(sheetAddedCallback).toHaveBeenCalledTimes(1);
    expect(sheetRenamedCallback).toHaveBeenCalledTimes(1);
    expect(sheetMovedCallback).toHaveBeenCalledTimes(1);
    expect(sheetRemovedCallback).toHaveBeenCalledTimes(1);
  });

  test('应该能移除工作表事件监听器', () => {
    const sheetAddedCallback = jest.fn();

    // 注册事件监听器
    eventManager.on(WorkSheetEventType.SHEET_ADDED, sheetAddedCallback);

    // 触发事件（应该调用回调）
    eventManager.emitSheetAdded('sheet2', 'Sheet 2', 1);
    expect(sheetAddedCallback).toHaveBeenCalledTimes(1);

    // 移除事件监听器
    eventManager.off(WorkSheetEventType.SHEET_ADDED, sheetAddedCallback);

    // 再次触发事件（不应该调用回调）
    eventManager.emitSheetAdded('sheet3', 'Sheet 3', 2);
    expect(sheetAddedCallback).toHaveBeenCalledTimes(1); // 应该仍然是1次
  });

  test('应该能处理复杂的事件场景', () => {
    const events: string[] = [];

    // 注册各种事件监听器，记录事件顺序
    eventManager.on(WorkSheetEventType.SHEET_ADDED, event => {
      events.push(`ADDED:${event.sheetKey}`);
    });

    eventManager.on(WorkSheetEventType.SHEET_RENAMED, event => {
      events.push(`RENAMED:${event.sheetKey}:${event.oldTitle}->${event.newTitle}`);
    });

    eventManager.on(WorkSheetEventType.SHEET_MOVED, event => {
      events.push(`MOVED:${event.sheetKey}:${event.fromIndex}->${event.toIndex}`);
    });

    eventManager.on(WorkSheetEventType.SHEET_REMOVED, event => {
      events.push(`REMOVED:${event.sheetKey}`);
    });

    // 模拟一个复杂的工作表操作流程
    eventManager.emitSheetAdded('sheet2', 'Sheet 2', 1);
    eventManager.emitSheetRenamed('sheet1', 'Sheet 1', 'Main Sheet');
    eventManager.emitSheetMoved('sheet2', 1, 0);
    eventManager.emitSheetRemoved('sheet2', 'Sheet 2', 0);

    // 验证事件顺序
    expect(events).toEqual([
      'ADDED:sheet2',
      'RENAMED:sheet1:Sheet 1->Main Sheet',
      'MOVED:sheet2:1->0',
      'REMOVED:sheet2'
    ]);
  });
});
