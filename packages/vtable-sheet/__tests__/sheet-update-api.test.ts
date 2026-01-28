// @ts-nocheck
/**
 * 电子表格更新接口相关测试
 *
 * 覆盖：
 * - 多 sheet 场景下 VTableSheet.updateOption 的全量更新行为（added/removed/updated）；
 * - 单 sheet 场景下 WorkSheet.updateSheetOption 的常用增量配置更新行为。
 */

import { VTableSheet, TYPES } from '../src/index';
import { createDiv, removeDom } from './dom';
import type { IFilterState } from '../src/ts-types';

// 设置全局版本变量，避免外层依赖版本信息
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).__VERSION__ = 'none';

describe('VTableSheet.updateOption - 多 sheet 全量更新', () => {
  let container: HTMLDivElement;
  let sheetInstance: VTableSheet | null = null;

  beforeEach(() => {
    container = createDiv();
  });

  afterEach(() => {
    if (sheetInstance) {
      sheetInstance.release();
      sheetInstance = null;
    }
    removeDom(container);
  });

  test('全量更新应正确处理新增 / 删除 / 更新 sheet，并保持实例复用', () => {
    const sheet1 = {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      rowCount: 10,
      columnCount: 5,
      showHeader: false,
      filter: true,
      data: [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10]
      ],
      active: true
    };

    const sheet2 = {
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet 2',
      rowCount: 5,
      columnCount: 3,
      data: [[11, 12, 13]],
      active: false
    };

    sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [sheet1, sheet2]
    });

    expect(sheetInstance.getSheetCount()).toBe(2);

    const sheet1InstanceBefore = sheetInstance.getWorkSheetByKey('sheet1');
    expect(sheet1InstanceBefore).not.toBeNull();

    const filterState: IFilterState = {
      filters: {
        0: {
          enable: true,
          field: 0,
          type: 'byValue',
          values: [1]
        }
      }
    };

    const updatedSheet1 = {
      ...sheet1,
      sheetTitle: 'Sheet 1 Updated',
      showHeader: true,
      frozenRowCount: 1,
      frozenColCount: 1,
      filterState,
      columnWidthConfig: [
        {
          key: 0,
          width: 200
        }
      ],
      rowHeightConfig: [
        {
          key: 0,
          height: 40
        }
      ],
      active: false
    };

    const newSheet3 = {
      sheetKey: 'sheet3',
      sheetTitle: 'Sheet 3',
      rowCount: 5,
      columnCount: 3,
      data: [[100, 200, 300]],
      active: true
    };

    sheetInstance.updateOption({
      sheets: [updatedSheet1, newSheet3]
    });

    // sheet 数量应更新为 2（sheet2 被删除，sheet3 新增）
    expect(sheetInstance.getSheetCount()).toBe(2);

    // sheet2 应被删除
    expect(sheetInstance.getSheet('sheet2')).toBeNull();
    expect(sheetInstance.getWorkSheetByKey('sheet2')).toBeNull();

    // sheet1 的 WorkSheet 实例应该被复用
    const sheet1InstanceAfter = sheetInstance.getWorkSheetByKey('sheet1');
    expect(sheet1InstanceAfter).toBe(sheet1InstanceBefore);

    // SheetManager 中的定义应更新为最新配置
    const sheet1Define = sheetInstance.getSheet('sheet1');
    expect(sheet1Define).not.toBeNull();
    expect(sheet1Define.sheetTitle).toBe('Sheet 1 Updated');
    expect(sheet1Define.showHeader).toBe(true);
    expect(sheet1Define.frozenRowCount).toBe(1);
    expect(sheet1Define.frozenColCount).toBe(1);
    expect(sheet1Define.filterState).toEqual(filterState);

    // 新增的 sheet3 应存在且可获取 WorkSheet 实例
    const sheet3Define = sheetInstance.getSheet('sheet3');
    expect(sheet3Define).not.toBeNull();
    expect(sheetInstance.getWorkSheetByKey('sheet3')).not.toBeNull();

    // active 标记应生效，sheet3 成为当前激活工作表
    const activeSheet = sheetInstance.getActiveSheet();
    expect(activeSheet).not.toBeNull();
    expect(activeSheet.getKey()).toBe('sheet3');
  });
});

describe('WorkSheet.updateSheetOption - 单 sheet 增量更新', () => {
  let container: HTMLDivElement;
  let sheetInstance: VTableSheet | null = null;

  beforeEach(() => {
    container = createDiv();
  });

  afterEach(() => {
    if (sheetInstance) {
      sheetInstance.release();
      sheetInstance = null;
    }
    removeDom(container);
  });

  test('应正确增量更新列宽/行高、筛选状态、表头显示、冻结、排序和主题', () => {
    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      defaultRowHeight: 25,
      defaultColWidth: 100,
      sheets: [
        {
          sheetKey: 'single',
          sheetTitle: 'Single Sheet',
          rowCount: 10,
          columnCount: 5,
          filter: true,
          data: [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10]
          ],
          active: true
        }
      ]
    });

    const workSheet = sheetInstance.getActiveSheet();
    const table = workSheet.tableInstance as any;

    // 基本前置断言：列数/行数存在
    expect(table.colCount).toBeGreaterThanOrEqual(1);
    expect(table.rowCount).toBeGreaterThanOrEqual(1);

    const filterState: IFilterState = {
      filters: {
        0: {
          enable: true,
          field: 0,
          type: 'byValue',
          values: [1]
        }
      }
    };

    const sortState: any = {
      field: 0,
      order: 'asc'
    };

    const newTheme = {
      tableTheme: TYPES.VTableThemes.ARCO.extends({
        bodyStyle: {
          color: 'red'
        }
      })
    };

    // 执行增量更新
    workSheet.updateSheetOption({
      // 表头与冻结
      showHeader: true,
      frozenRowCount: 1,
      frozenColCount: 1,
      // 筛选与排序
      filter: true,
      filterState,
      sortState,
      // 主题
      theme: newTheme as any,
      // 尺寸
      defaultRowHeight: 30,
      defaultColWidth: 120,
      columnWidthConfig: [
        { key: 0, width: 200 },
        { key: 1, width: 150 }
      ],
      rowHeightConfig: [
        { key: 0, height: 40 },
        { key: 1, height: 35 }
      ]
    });

    // 显示表头
    expect(table.options.showHeader).toBe(true);

    // 冻结设置
    expect(table.frozenRowCount).toBe(1);
    expect(table.options.frozenColCount).toBe(1);

    // 默认行高/列宽
    expect(table.defaultRowHeight).toBe(30);
    expect(table.defaultColWidth).toBe(120);

    // 列宽/行高配置
    expect(table.getColWidth(0)).toBe(200);
    expect(table.getColWidth(1)).toBe(150);
    expect(table.getRowHeight(0)).toBe(40);
    expect(table.getRowHeight(1)).toBe(35);

    // 筛选状态应下发到 Filter 插件
    const filterPlugin = table.pluginManager.getPluginByName('Filter') as any;
    expect(filterPlugin).toBeDefined();
    const pluginFilterState = filterPlugin.getFilterState();
    expect(pluginFilterState).toEqual(filterState);

    // 排序状态应更新到内部 sortState
    const internalSortState = table.internalProps.sortState;
    expect(internalSortState).toBeTruthy();
    const sortArray = Array.isArray(internalSortState) ? internalSortState : [internalSortState];
    expect(sortArray[0].field).toBe(0);
    expect(sortArray[0].order).toBe('asc');

    // 主题应更新到表格 options 中
    expect(table.options.theme).toBe(newTheme.tableTheme);
  });
});
