/**
 * VTable 单元格操作工具集
 *
 * 提供基础的单元格读写和表格信息查询工具。
 * 这些是 VTable MCP 最核心的工具。
 *
 * 设计原则：
 * - 每个工具只做一件事（单一职责）
 * - 参数简单明了
 * - 错误信息清晰
 * - 支持批量操作
 *
 * @module cell-operations
 */

import { z } from 'zod';
import type { BaseTableAPI } from '@visactor/vtable';

function getVTableInstance(): Partial<BaseTableAPI> {
  const table = (globalThis as unknown as { __vtable_instance?: unknown }).__vtable_instance;
  if (!table) {
    throw new Error('VTable instance not found. Make sure VTable is initialized.');
  }
  return table as Partial<BaseTableAPI>;
}

/**
 * 单元格数据项 Schema
 * 用于验证单个单元格的数据
 */
const cellDataItemSchema = z.object({
  row: z.number().int().nonnegative().describe('Row index (0-based)'),
  col: z.number().int().nonnegative().describe('Column index (0-based)'),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]).describe('Cell value')
});

/**
 * 单元格位置 Schema
 * 用于指定单元格位置
 */
const cellPositionSchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative()
});

/**
 * 单元格操作工具集合
 *
 * ⭐ 基于共享元数据创建工具
 *
 * 包含 3 个核心工具：
 * 1. set_cell_data - 设置单元格值（支持批量）
 * 2. get_cell_data - 读取单元格值（支持批量）
 * 3. get_table_info - 获取表格信息
 */
export const cellOperationTools = [
  {
    name: 'set_cell_data',
    category: 'cell',

    description: `设置一个或多个单元格的值

使用示例：
  - set_cell_data({ items: [{ row: 0, col: 0, value: "Hello" }] })
  - set_cell_data({ items: [
      { row: 0, col: 0, value: "A" },
      { row: 0, col: 1, value: "B" }
    ]})

参数：
  - items: 单元格数据数组
    - row: 行索引（从 0 开始）
    - col: 列索引（从 0 开始）
    - value: 单元格值（字符串、数字、布尔值或 null）

返回：
  'Success' 字符串`,

    // ⭐ 添加 Zod 验证（运行时类型检查）
    // 兼容：部分 MCP Host 可能把数组参数当作单对象传入（例如 items/object、cells/object）
    // 为了更稳健，这里同时接受「单个对象」或「对象数组」两种形态。
    inputSchema: z.object({
      items: z
        .union([z.array(cellDataItemSchema).min(1), cellDataItemSchema])
        .describe('单元格数据：支持单个对象或对象数组（推荐数组）')
    }),

    /**
     * 执行设置单元格值操作
     *
     * @param params - 验证后的参数
     * @param params.items - 单元格数据数组
     * @returns 成功消息
     * @throws 如果 VTable 实例不存在
     */
    execute: async (params: {
      items: Array<{ row: number; col: number; value: any }> | { row: number; col: number; value: any };
    }) => {
      const table = getVTableInstance();
      if (typeof table.changeCellValue !== 'function') {
        throw new Error('VTable instance does not support changeCellValue');
      }

      const items = Array.isArray((params as any).items) ? (params as any).items : [(params as any).items];

      // 批量设置单元格值
      for (const item of items) {
        // 调用 VTable API
        // changeCellValue(col, row, value) - 注意参数顺序！
        table.changeCellValue(item.col, item.row, item.value);
      }

      return 'Success';
    }
  },

  {
    name: 'get_cell_data',
    category: 'cell',

    description: `读取一个或多个单元格的值

使用示例：
  - get_cell_data({ cells: [{ row: 0, col: 0 }] })
  - get_cell_data({ cells: [
      { row: 0, col: 0 },
      { row: 1, col: 1 }
    ]})

参数：
  - cells: 单元格位置数组
    - row: 行索引（从 0 开始）
    - col: 列索引（从 0 开始）

返回：
  单元格数据数组，每项包含 { row, col, value }`,

    // ⭐ 添加 Zod 验证
    inputSchema: z.object({
      cells: z
        .union([z.array(cellPositionSchema).min(1), cellPositionSchema])
        .describe('单元格位置：支持单个对象或对象数组（推荐数组）')
    }),

    /**
     * 执行读取单元格值操作
     *
     * @param params - 验证后的参数
     * @param params.cells - 单元格位置数组
     * @returns 单元格数据数组
     */
    execute: async (params: { cells: Array<{ row: number; col: number }> | { row: number; col: number } }) => {
      const table = getVTableInstance();
      if (typeof table.getCellValue !== 'function') {
        throw new Error('VTable instance does not support getCellValue');
      }
      const cells = Array.isArray((params as any).cells) ? (params as any).cells : [(params as any).cells];

      // 批量读取单元格值
      return cells.map((cell: { row: number; col: number }) => ({
        row: cell.row,
        col: cell.col,
        // getCellValue(col, row) - 注意参数顺序！
        value: table.getCellValue!(cell.col, cell.row)
      }));
    }
  },

  {
    name: 'get_table_info',
    category: 'table',

    description: `获取 VTable 表格的基本信息

返回：
  {
    rowCount: number,    // 总行数
    colCount: number,    // 总列数
  }

使用示例：
  - get_table_info({})`,

    // ⭐ 添加 Zod 验证
    inputSchema: z.object({}).passthrough().describe('无需参数'),

    /**
     * 执行获取表格信息操作
     *
     * @returns 表格信息对象
     */
    execute: async () => {
      const table = getVTableInstance();

      // 返回表格基本信息
      return {
        rowCount: table.rowCount,
        colCount: table.colCount
        // 可以添加更多信息
        // frozenColCount: table.frozenColCount || 0,
        // frozenRowCount: table.frozenRowCount || 0,
      };
    }
  }
];
