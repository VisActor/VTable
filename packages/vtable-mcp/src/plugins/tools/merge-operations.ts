/**
 * VTable 合并单元格操作工具集
 *
 * 基于 VTable ListTable 的公开 API：
 * - mergeCells(startCol, startRow, endCol, endRow, text?)
 * - unmergeCells(startCol, startRow, endCol, endRow)
 *
 * 以及 BaseTableAPI 的：
 * - getCellRange(col, row)  // 返回该单元格所属的合并范围（未合并时返回自身范围）
 *
 * @module merge-operations
 */

import { z } from 'zod';
import type { BaseTableAPI } from '@visactor/vtable';

type VTableMergeApi = Partial<BaseTableAPI>;
const cellAddrSchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative()
});

const cellRangeSchema = z.object({
  start: cellAddrSchema,
  end: cellAddrSchema
});

function getVTableInstance(): VTableMergeApi {
  const table = (globalThis as unknown as { __vtable_instance?: unknown }).__vtable_instance;
  if (!table) {
    throw new Error('VTable instance not found. Make sure VTable is initialized.');
  }
  return table as VTableMergeApi;
}

function normalizeRange(range: { start: { row: number; col: number }; end: { row: number; col: number } }) {
  const rowStart = Math.min(range.start.row, range.end.row);
  const rowEnd = Math.max(range.start.row, range.end.row);
  const colStart = Math.min(range.start.col, range.end.col);
  const colEnd = Math.max(range.start.col, range.end.col);
  return { rowStart, rowEnd, colStart, colEnd };
}

export const mergeOperationTools = [
  {
    name: 'merge_cells',
    category: 'table',
    description: `合并一个矩形区域内的单元格（自定义合并）

使用示例：
  - merge_cells({ range: { start: { row: 1, col: 1 }, end: { row: 3, col: 4 } } })
  - merge_cells({ range: { start: { row: 1, col: 1 }, end: { row: 3, col: 4 } }, text: "合并单元格文本" })

参数：
  - range: 合并区域（start/end 坐标，0-based）
  - text: 合并后单元格展示文本（可选）

返回：
  'Success' 字符串

注意：
  - 该能力依赖 ListTable 的 mergeCells/unmergeCells 实现
  - 如果区域内已有合并，VTable 会拒绝再次合并（内部会检查）`,
    inputSchema: z.object({
      range: cellRangeSchema,
      text: z.string().optional()
    }),
    execute: async (params: {
      range: { start: { row: number; col: number }; end: { row: number; col: number } };
      text?: string;
    }) => {
      const table = getVTableInstance();
      if (typeof table.mergeCells !== 'function') {
        throw new Error('VTable instance does not support mergeCells (requires ListTable)');
      }
      const { rowStart, rowEnd, colStart, colEnd } = normalizeRange(params.range);
      table.mergeCells(colStart, rowStart, colEnd, rowEnd, params.text);
      return 'Success';
    }
  },

  {
    name: 'unmerge_cells',
    category: 'table',
    description: `取消合并一个矩形区域（与 merge_cells 使用同一范围）

使用示例：
  - unmerge_cells({ range: { start: { row: 1, col: 1 }, end: { row: 3, col: 4 } } })

参数：
  - range: 取消合并区域（start/end 坐标，0-based）

返回：
  'Success' 字符串`,
    inputSchema: z.object({
      range: cellRangeSchema
    }),
    execute: async (params: { range: { start: { row: number; col: number }; end: { row: number; col: number } } }) => {
      const table = getVTableInstance();
      if (typeof table.unmergeCells !== 'function') {
        throw new Error('VTable instance does not support unmergeCells (requires ListTable)');
      }
      const { rowStart, rowEnd, colStart, colEnd } = normalizeRange(params.range);
      table.unmergeCells(colStart, rowStart, colEnd, rowEnd);
      return 'Success';
    }
  },

  {
    name: 'get_cell_range',
    category: 'table',
    description: `获取指定单元格所属的“合并范围”

使用示例：
  - get_cell_range({ row: 2, col: 3 })

参数：
  - row: 行索引（0-based）
  - col: 列索引（0-based）

返回：
  CellRange 对象：{ start: { row, col }, end: { row, col } }`,
    inputSchema: z.object({
      row: z.number().int().nonnegative(),
      col: z.number().int().nonnegative()
    }),
    execute: async (params: { row: number; col: number }) => {
      const table = getVTableInstance();
      if (typeof table.getCellRange !== 'function') {
        throw new Error('VTable instance does not support getCellRange');
      }
      // 注意参数顺序：getCellRange(col, row)
      return table.getCellRange(params.col, params.row);
    }
  }
];
