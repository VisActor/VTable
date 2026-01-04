/// <reference types="jest" />

/**
 * cell-operations.ts 工具单测
 *
 * 测试覆盖：
 * - set_cell_data: 设置单元格值（单个/批量）
 * - get_cell_data: 读取单元格值（单个/批量）
 * - get_table_info: 获取表格信息
 * - 参数验证（Zod schema）
 * - 错误处理
 */

import { cellOperationTools } from '../../src/plugins/tools/cell-operations';
import { createMockBaseTable, setupMockTable, cleanupMockTable } from '../test-utils';

describe('cell-operations tools', () => {
  beforeEach(() => {
    cleanupMockTable();
  });

  afterEach(() => {
    cleanupMockTable();
  });

  describe('set_cell_data', () => {
    const tool = cellOperationTools.find(t => t.name === 'set_cell_data')!;

    test('应该成功设置单个单元格值', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({ items: { row: 0, col: 0, value: 'Hello' } });

      expect(result).toBe('Success');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 0, 'Hello');
      expect(mockTable.changeCellValue).toHaveBeenCalledTimes(1);
    });

    test('应该成功设置多个单元格值', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const items = [
        { row: 0, col: 0, value: 'A' },
        { row: 0, col: 1, value: 'B' }
      ];
      const result = await (tool.execute as any)({ items });

      expect(result).toBe('Success');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 0, 'A');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 0, 'B');
      expect(mockTable.changeCellValue).toHaveBeenCalledTimes(2);
    });

    test('应该支持不同类型的值（string, number, boolean, null）', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const items = [
        { row: 0, col: 0, value: 'string' },
        { row: 0, col: 1, value: 123 },
        { row: 0, col: 2, value: true },
        { row: 0, col: 3, value: null }
      ];
      await (tool.execute as any)({ items });

      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 0, 'string');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 0, 123);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(2, 0, true);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(3, 0, null);
    });

    test('应该验证参数 schema（缺少 items）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该验证参数 schema（row 为负数）', async () => {
      await expect(tool.inputSchema.parseAsync({ items: { row: -1, col: 0, value: 'test' } })).rejects.toThrow();
    });

    test('应该验证参数 schema（col 为负数）', async () => {
      await expect(tool.inputSchema.parseAsync({ items: { row: 0, col: -1, value: 'test' } })).rejects.toThrow();
    });

    test('应该验证参数 schema（row 为小数）', async () => {
      await expect(tool.inputSchema.parseAsync({ items: { row: 0.5, col: 0, value: 'test' } })).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ items: { row: 0, col: 0, value: 'test' } })).rejects.toThrow(
        'VTable instance not found'
      );
    });

    test('应该抛出错误（缺少 changeCellValue 方法）', async () => {
      const mockTable = {
        // 没有 changeCellValue 方法
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ items: { row: 0, col: 0, value: 'test' } })).rejects.toThrow(
        'VTable instance does not support changeCellValue'
      );
    });
  });

  describe('get_cell_data', () => {
    const tool = cellOperationTools.find(t => t.name === 'get_cell_data')!;

    test('应该成功读取单个单元格值', async () => {
      const mockTable = createMockBaseTable();
      mockTable.getCellValue = jest.fn((col: number, row: number) => `value-${row}-${col}`);
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({ cells: { row: 0, col: 0 } });

      expect(result).toEqual([{ row: 0, col: 0, value: 'value-0-0' }]);
      expect(mockTable.getCellValue).toHaveBeenCalledWith(0, 0);
    });

    test('应该成功读取多个单元格值', async () => {
      const mockTable = createMockBaseTable();
      mockTable.getCellValue = jest.fn((col: number, row: number) => `value-${row}-${col}`);
      setupMockTable(mockTable);

      const cells = [
        { row: 0, col: 0 },
        { row: 1, col: 1 }
      ];
      const result = await (tool.execute as any)({ cells });

      expect(result).toEqual([
        { row: 0, col: 0, value: 'value-0-0' },
        { row: 1, col: 1, value: 'value-1-1' }
      ]);
      expect(mockTable.getCellValue).toHaveBeenCalledWith(0, 0);
      expect(mockTable.getCellValue).toHaveBeenCalledWith(1, 1);
    });

    test('应该验证参数 schema（缺少 cells）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该验证参数 schema（row 为负数）', async () => {
      await expect(tool.inputSchema.parseAsync({ cells: { row: -1, col: 0 } })).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ cells: { row: 0, col: 0 } })).rejects.toThrow('VTable instance not found');
    });

    test('应该抛出错误（缺少 getCellValue 方法）', async () => {
      const mockTable = {
        // 没有 getCellValue 方法
      };
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ cells: { row: 0, col: 0 } })).rejects.toThrow(
        'VTable instance does not support getCellValue'
      );
    });
  });

  describe('get_table_info', () => {
    const tool = cellOperationTools.find(t => t.name === 'get_table_info')!;

    test('应该成功获取表格信息', async () => {
      const mockTable = createMockBaseTable();
      mockTable.rowCount = 10;
      mockTable.colCount = 5;
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({});

      expect(result).toEqual({
        rowCount: 10,
        colCount: 5
      });
    });

    test('应该验证参数 schema（空对象）', async () => {
      const result = await tool.inputSchema.parseAsync({});
      expect(result).toEqual({});
    });

    test('应该验证参数 schema（带额外参数）', async () => {
      // 空对象 schema 应该允许额外参数（passthrough）
      const result = await tool.inputSchema.parseAsync({ extra: 'value' });
      expect(result).toEqual({ extra: 'value' });
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({})).rejects.toThrow('VTable instance not found');
    });
  });
});
