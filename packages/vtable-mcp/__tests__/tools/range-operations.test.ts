/**
 * range-operations.ts 工具单测
 *
 * 测试覆盖：
 * - get_range_data: 读取区域数据
 * - set_range_data: 设置区域数据
 * - clear_range: 清空区域
 * - 参数验证
 * - 错误处理（范围过大等）
 */

/// <reference types="jest" />

import { rangeOperationTools } from '../../src/plugins/tools/range-operations';
import { createMockBaseTable, setupMockTable, cleanupMockTable } from '../test-utils';

describe('range-operations tools', () => {
  beforeEach(() => {
    cleanupMockTable();
  });

  afterEach(() => {
    cleanupMockTable();
  });

  describe('get_range_data', () => {
    const tool = rangeOperationTools.find(t => t.name === 'get_range_data')!;

    test('应该成功读取区域数据', async () => {
      const mockTable = createMockBaseTable();
      mockTable.getCellValue = jest.fn((col: number, row: number) => `value-${row}-${col}`);
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({
        range: { start: { row: 0, col: 0 }, end: { row: 1, col: 1 } }
      });

      expect(result).toEqual({
        range: { start: { row: 0, col: 0 }, end: { row: 1, col: 1 } },
        values: [
          ['value-0-0', 'value-0-1'],
          ['value-1-0', 'value-1-1']
        ]
      });
    });

    test('应该自动规范化范围（start > end）', async () => {
      const mockTable = createMockBaseTable();
      mockTable.getCellValue = jest.fn((col: number, row: number) => `value-${row}-${col}`);
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({
        range: { start: { row: 1, col: 1 }, end: { row: 0, col: 0 } }
      });

      expect(result).toEqual({
        range: { start: { row: 0, col: 0 }, end: { row: 1, col: 1 } },
        values: [
          ['value-0-0', 'value-0-1'],
          ['value-1-0', 'value-1-1']
        ]
      });
    });

    test('应该使用默认 maxCells (200)', async () => {
      const mockTable = createMockBaseTable();
      mockTable.getCellValue = jest.fn((col: number, row: number) => `value-${row}-${col}`);
      setupMockTable(mockTable);

      // 10x10 = 100 cells，应该成功
      const result = await (tool.execute as any)({
        range: { start: { row: 0, col: 0 }, end: { row: 9, col: 9 } }
      });

      expect((result as any).values.length).toBe(10);
      expect((result as any).values[0].length).toBe(10);
    });

    test('应该支持自定义 maxCells', async () => {
      const mockTable = createMockBaseTable();
      mockTable.getCellValue = jest.fn((col: number, row: number) => `value-${row}-${col}`);
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({
        range: { start: { row: 0, col: 0 }, end: { row: 4, col: 4 } },
        maxCells: 30
      });

      expect((result as any).values.length).toBe(5);
    });

    test('应该抛出错误（范围过大）', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      await expect(
        (tool.execute as any)({
          range: { start: { row: 0, col: 0 }, end: { row: 14, col: 14 } },
          maxCells: 200
        })
      ).rejects.toThrow('Range too large: 225 cells (maxCells=200)');
    });

    test('应该验证参数 schema（缺少 range）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect(
        (tool.execute as any)({ range: { start: { row: 0, col: 0 }, end: { row: 1, col: 1 } } })
      ).rejects.toThrow('VTable instance not found');
    });

    test('应该抛出错误（缺少 getCellValue 方法）', async () => {
      const mockTable = {};
      setupMockTable(mockTable);

      await expect(
        (tool.execute as any)({ range: { start: { row: 0, col: 0 }, end: { row: 1, col: 1 } } })
      ).rejects.toThrow('VTable instance does not support getCellValue');
    });
  });

  describe('set_range_data', () => {
    const tool = rangeOperationTools.find(t => t.name === 'set_range_data')!;

    test('应该成功设置区域数据', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const values = [
        [1, 2, 3],
        ['a', 'b', 'c']
      ];
      const result = await (tool.execute as any)({
        start: { row: 0, col: 0 },
        values
      });

      expect(result).toBe('Success');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 0, 1);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 0, 2);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(2, 0, 3);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 1, 'a');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 1, 'b');
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(2, 1, 'c');
    });

    test('应该从指定位置开始写入', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const values = [[1, 2]];
      await (tool.execute as any)({
        start: { row: 5, col: 3 },
        values
      });

      expect(mockTable.changeCellValue).toHaveBeenCalledWith(3, 5, 1);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(4, 5, 2);
    });

    test('应该处理不规则的二维数组（行长度不一致）', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const values = [[1, 2], [3]];
      await (tool.execute as any)({
        start: { row: 0, col: 0 },
        values
      });

      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 0, 1);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 0, 2);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 1, 3);
    });

    test('应该验证参数 schema（values 为空数组）', async () => {
      await expect(tool.inputSchema.parseAsync({ start: { row: 0, col: 0 }, values: [] })).rejects.toThrow();
    });

    test('应该验证参数 schema（缺少 start）', async () => {
      await expect(tool.inputSchema.parseAsync({ values: [[1]] })).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ start: { row: 0, col: 0 }, values: [[1]] })).rejects.toThrow(
        'VTable instance not found'
      );
    });
  });

  describe('clear_range', () => {
    const tool = rangeOperationTools.find(t => t.name === 'clear_range')!;

    test('应该成功清空区域', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({
        range: { start: { row: 0, col: 0 }, end: { row: 2, col: 2 } }
      });

      expect(result).toBe('Success');
      // 应该调用 3x3 = 9 次
      expect(mockTable.changeCellValue).toHaveBeenCalledTimes(9);
      // 所有值都应该是 null
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(0, 0, null);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 0, null);
      expect(mockTable.changeCellValue).toHaveBeenCalledWith(2, 2, null);
    });

    test('应该使用默认 maxCells (500)', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      // 20x20 = 400 cells，应该成功
      await (tool.execute as any)({
        range: { start: { row: 0, col: 0 }, end: { row: 19, col: 19 } }
      });

      expect(mockTable.changeCellValue).toHaveBeenCalledTimes(400);
    });

    test('应该支持自定义 maxCells', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      await (tool.execute as any)({
        range: { start: { row: 0, col: 0 }, end: { row: 9, col: 9 } },
        maxCells: 200
      });

      expect(mockTable.changeCellValue).toHaveBeenCalledTimes(100);
    });

    test('应该抛出错误（范围过大）', async () => {
      const mockTable = createMockBaseTable();
      setupMockTable(mockTable);

      await expect(
        (tool.execute as any)({
          range: { start: { row: 0, col: 0 }, end: { row: 24, col: 24 } },
          maxCells: 500
        })
      ).rejects.toThrow('Range too large: 625 cells (maxCells=500)');
    });

    test('应该验证参数 schema（缺少 range）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect(
        (tool.execute as any)({ range: { start: { row: 0, col: 0 }, end: { row: 1, col: 1 } } })
      ).rejects.toThrow('VTable instance not found');
    });
  });
});
