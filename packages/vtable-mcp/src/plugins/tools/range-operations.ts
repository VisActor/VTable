/**
 * VTable 范围操作工具集
 *
 * 提供类似 spreadsheet 的“区域读写”能力（基于 getCellValue/changeCellValue 组合实现）。
 *
 * @module range-operations
 */

import { z } from 'zod';
import type { BaseTableAPI } from '@visactor/vtable';

const cellAddrSchema = z.object({
  row: z.number().int().nonnegative(),
  col: z.number().int().nonnegative()
});

const cellRangeSchema = z.object({
  start: cellAddrSchema,
  end: cellAddrSchema
});

function getVTableInstance(): Partial<BaseTableAPI> {
  const table = (globalThis as unknown as { __vtable_instance?: unknown }).__vtable_instance;
  if (!table) {
    throw new Error('VTable instance not found. Make sure VTable is initialized.');
  }
  return table as Partial<BaseTableAPI>;
}

function normalizeRange(range: { start: { row: number; col: number }; end: { row: number; col: number } }) {
  const rowStart = Math.min(range.start.row, range.end.row);
  const rowEnd = Math.max(range.start.row, range.end.row);
  const colStart = Math.min(range.start.col, range.end.col);
  const colEnd = Math.max(range.start.col, range.end.col);
  return { rowStart, rowEnd, colStart, colEnd };
}

export const rangeOperationTools = [
  {
    name: 'get_range_data',
    description: `读取一个矩形区域的数据（二维数组）

使用示例：
  - get_range_data({ range: { start: { row: 0, col: 0 }, end: { row: 9, col: 4 } } })

参数：
  - range: 区域（start/end 坐标，0-based）
  - maxCells: 最大允许读取的单元格数量（默认 200），防止一次性读太大范围

返回：
  {
    range: { start, end },
    values: any[][]
  }`,
    category: 'data',
    inputSchema: z.object({
      range: cellRangeSchema,
      maxCells: z.number().int().positive().optional().describe('最大单元格数量，默认 200')
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();

      if (typeof table.getCellValue !== 'function') {
        throw new Error('VTable instance does not support getCellValue');
      }

      const { rowStart, rowEnd, colStart, colEnd } = normalizeRange(params.range);
      const rows = rowEnd - rowStart + 1;
      const cols = colEnd - colStart + 1;
      const maxCells = params.maxCells ?? 200;

      if (rows * cols > maxCells) {
        throw new Error(`Range too large: ${rows * cols} cells (maxCells=${maxCells})`);
      }

      const values: any[][] = [];
      for (let r = rowStart; r <= rowEnd; r++) {
        const rowVals: any[] = [];
        for (let c = colStart; c <= colEnd; c++) {
          rowVals.push(table.getCellValue(c, r));
        }
        values.push(rowVals);
      }

      return {
        range: { start: { row: rowStart, col: colStart }, end: { row: rowEnd, col: colEnd } },
        values
      };
    }
  },

  {
    name: 'set_range_data',
    description: `从左上角开始写入一个二维数组到表格

使用示例：
  - set_range_data({ start: { row: 0, col: 0 }, values: [[1,2,3],["a","b","c"]] })

参数：
  - start: 起点（左上角，0-based）
  - values: 二维数组（values[rowOffset][colOffset]）

返回：
  'Success' 字符串`,
    category: 'data',
    inputSchema: z.object({
      start: cellAddrSchema,
      values: z.array(z.array(z.any())).min(1).describe('二维数组，至少 1 行')
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();

      if (typeof table.changeCellValue !== 'function') {
        throw new Error('VTable instance does not support changeCellValue');
      }

      const startRow = params.start.row;
      const startCol = params.start.col;
      const values: any[][] = params.values;

      for (let r = 0; r < values.length; r++) {
        const rowVals = values[r] ?? [];
        for (let c = 0; c < rowVals.length; c++) {
          table.changeCellValue(startCol + c, startRow + r, rowVals[c]);
        }
      }

      return 'Success';
    }
  },

  {
    name: 'clear_range',
    description: `清空一个矩形区域（写入 undefined）

使用示例：
  - clear_range({ range: { start: { row: 1, col: 1 }, end: { row: 10, col: 5 } } })

参数：
  - range: 区域（start/end 坐标，0-based）
  - maxCells: 最大允许清空的单元格数量（默认 500）

返回：
  'Success' 字符串`,
    category: 'data',
    inputSchema: z.object({
      range: cellRangeSchema,
      maxCells: z.number().int().positive().optional()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();

      if (typeof table.changeCellValue !== 'function') {
        throw new Error('VTable instance does not support changeCellValue');
      }

      const { rowStart, rowEnd, colStart, colEnd } = normalizeRange(params.range);
      const rows = rowEnd - rowStart + 1;
      const cols = colEnd - colStart + 1;
      const maxCells = params.maxCells ?? 500;
      if (rows * cols > maxCells) {
        throw new Error(`Range too large: ${rows * cols} cells (maxCells=${maxCells})`);
      }

      for (let r = rowStart; r <= rowEnd; r++) {
        for (let c = colStart; c <= colEnd; c++) {
          // 对齐 ListTable.changeCellValue(value: string | number | null)
          table.changeCellValue(c, r, null);
        }
      }
      return 'Success';
    }
  }
];
