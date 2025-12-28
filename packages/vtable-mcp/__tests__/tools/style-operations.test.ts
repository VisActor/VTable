/**
 * style-operations.ts 工具单测
 *
 * 测试覆盖：
 * - set_cell_style: 设置单元格样式
 * - get_cell_style: 获取单元格样式
 * - set_range_style: 设置区域样式
 * - 参数验证
 * - 错误处理
 */

import { styleOperationTools } from '../../src/plugins/tools/style-operations';
import { createMockBaseTable, setupMockTable, cleanupMockTable } from '../test-utils';

describe('style-operations tools', () => {
  beforeEach(() => {
    cleanupMockTable();
  });

  afterEach(() => {
    cleanupMockTable();
  });

  describe('set_cell_style', () => {
    const tool = styleOperationTools.find(t => t.name === 'set_cell_style')!;

    test('应该成功设置单个单元格样式', async () => {
      const mockTable = createMockBaseTable() as any;
      mockTable.registerCustomCellStyle = jest.fn();
      mockTable.arrangeCustomCellStyle = jest.fn();
      setupMockTable(mockTable);

      const style = { color: '#FF0000', fontWeight: 'bold' };
      const result = await (tool.execute as any)({
        items: { row: 0, col: 0, style }
      });

      expect(result).toBe('Success');
      expect(mockTable.registerCustomCellStyle).toHaveBeenCalledWith('mcp_cell_style_0_0', style);
      expect(mockTable.arrangeCustomCellStyle).toHaveBeenCalledWith({ col: 0, row: 0 }, 'mcp_cell_style_0_0', true);
    });

    test('应该成功设置多个单元格样式', async () => {
      const mockTable = createMockBaseTable() as any;
      mockTable.registerCustomCellStyle = jest.fn();
      mockTable.arrangeCustomCellStyle = jest.fn();
      setupMockTable(mockTable);

      const items = [
        { row: 0, col: 0, style: { color: '#FF0000' } },
        { row: 1, col: 1, style: { bgColor: '#FFFF00' } }
      ];
      const result = await (tool.execute as any)({ items });

      expect(result).toBe('Success');
      expect(mockTable.registerCustomCellStyle).toHaveBeenCalledTimes(2);
      expect(mockTable.arrangeCustomCellStyle).toHaveBeenCalledTimes(2);
    });

    test('应该支持所有样式属性', async () => {
      const mockTable = createMockBaseTable() as any;
      mockTable.registerCustomCellStyle = jest.fn();
      mockTable.arrangeCustomCellStyle = jest.fn();
      setupMockTable(mockTable);

      const style = {
        fontSize: 14,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#FF0000',
        bgColor: '#FFFF00',
        textAlign: 'center',
        textBaseline: 'middle'
      };
      await (tool.execute as any)({ items: { row: 0, col: 0, style } });

      expect(mockTable.registerCustomCellStyle).toHaveBeenCalledWith('mcp_cell_style_0_0', style);
    });

    test('应该支持透传额外样式属性（passthrough）', async () => {
      const mockTable = createMockBaseTable() as any;
      mockTable.registerCustomCellStyle = jest.fn();
      mockTable.arrangeCustomCellStyle = jest.fn();
      setupMockTable(mockTable);

      const style = {
        color: '#FF0000',
        padding: [10, 20],
        lineHeight: 1.5
      };
      await (tool.execute as any)({ items: { row: 0, col: 0, style } });

      expect(mockTable.registerCustomCellStyle).toHaveBeenCalledWith('mcp_cell_style_0_0', style);
    });

    test('应该验证参数 schema（缺少 items）', async () => {
      await expect(tool.inputSchema.parseAsync({})).rejects.toThrow();
    });

    test('应该验证参数 schema（row 为负数）', async () => {
      await expect(
        tool.inputSchema.parseAsync({
          items: { row: -1, col: 0, style: { color: '#FF0000' } }
        })
      ).rejects.toThrow();
    });

    test('应该验证参数 schema（fontSize 为负数）', async () => {
      await expect(
        tool.inputSchema.parseAsync({
          items: { row: 0, col: 0, style: { fontSize: -1 } }
        })
      ).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ items: { row: 0, col: 0, style: { color: '#FF0000' } } })).rejects.toThrow(
        'VTable instance not found'
      );
    });

    test('应该抛出错误（缺少样式 API）', async () => {
      const mockTable = {};
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ items: { row: 0, col: 0, style: { color: '#FF0000' } } })).rejects.toThrow(
        'VTable instance does not support custom cell style APIs'
      );
    });
  });

  describe('get_cell_style', () => {
    const tool = styleOperationTools.find(t => t.name === 'get_cell_style')!;

    test('应该成功获取单元格样式', async () => {
      const mockTable = createMockBaseTable() as any;
      const mockStyle = { color: '#FF0000', fontSize: 14 };
      mockTable.getCellStyle = jest.fn(() => mockStyle);
      setupMockTable(mockTable);

      const result = await (tool.execute as any)({ row: 0, col: 0 });

      expect(result).toEqual(mockStyle);
      expect(mockTable.getCellStyle).toHaveBeenCalledWith(0, 0);
    });

    test('应该验证参数 schema（缺少 row）', async () => {
      await expect(tool.inputSchema.parseAsync({ col: 0 })).rejects.toThrow();
    });

    test('应该验证参数 schema（row 为负数）', async () => {
      await expect(tool.inputSchema.parseAsync({ row: -1, col: 0 })).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect((tool.execute as any)({ row: 0, col: 0 })).rejects.toThrow('VTable instance not found');
    });

    test('应该抛出错误（缺少 getCellStyle 方法）', async () => {
      const mockTable = {};
      setupMockTable(mockTable);

      await expect((tool.execute as any)({ row: 0, col: 0 })).rejects.toThrow(
        'VTable instance does not support getCellStyle'
      );
    });
  });

  describe('set_range_style', () => {
    const tool = styleOperationTools.find(t => t.name === 'set_range_style')!;

    test('应该成功设置区域样式', async () => {
      const mockTable = createMockBaseTable() as any;
      mockTable.registerCustomCellStyle = jest.fn();
      mockTable.arrangeCustomCellStyle = jest.fn();
      setupMockTable(mockTable);

      const style = { bgColor: '#FFF7E6' };
      const result = await (tool.execute as any)({
        range: { start: { col: 0, row: 0 }, end: { col: 3, row: 10 } },
        style
      });

      expect(result).toBe('Success');
      expect(mockTable.registerCustomCellStyle).toHaveBeenCalledWith('mcp_range_style_0_0_3_10', style);
      expect(mockTable.arrangeCustomCellStyle).toHaveBeenCalledWith(
        {
          range: { start: { col: 0, row: 0 }, end: { col: 3, row: 10 } }
        },
        'mcp_range_style_0_0_3_10',
        true
      );
    });

    test('应该验证参数 schema（缺少 range）', async () => {
      await expect(tool.inputSchema.parseAsync({ style: { color: '#FF0000' } })).rejects.toThrow();
    });

    test('应该验证参数 schema（缺少 style）', async () => {
      await expect(
        tool.inputSchema.parseAsync({
          range: { start: { col: 0, row: 0 }, end: { col: 1, row: 1 } }
        })
      ).rejects.toThrow();
    });

    test('应该抛出错误（VTable 实例不存在）', async () => {
      await expect(
        (tool.execute as any)({
          range: { start: { col: 0, row: 0 }, end: { col: 1, row: 1 } },
          style: { color: '#FF0000' }
        })
      ).rejects.toThrow('VTable instance not found');
    });

    test('应该抛出错误（缺少样式 API）', async () => {
      const mockTable = {};
      setupMockTable(mockTable);

      await expect(
        (tool.execute as any)({
          range: { start: { col: 0, row: 0 }, end: { col: 1, row: 1 } },
          style: { color: '#FF0000' }
        })
      ).rejects.toThrow('VTable instance does not support custom cell style APIs');
    });
  });
});
