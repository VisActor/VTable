/**
 * VTable 导出/截图相关工具集
 *
 * @module export-operations
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

export const exportOperationTools = [
  {
    name: 'export_img',
    description: `导出当前表格为图片（通常为 dataURL 字符串）

返回：
  string`,
    category: 'table',
    inputSchema: z.object({}),
    execute: async () => {
      const table = getVTableInstance();
      if (typeof table.exportImg !== 'function') {
        throw new Error('VTable instance does not support exportImg');
      }
      return table.exportImg();
    }
  },

  {
    name: 'export_cell_img',
    description: `导出指定单元格为图片（dataURL 字符串）

使用示例：
  - export_cell_img({ col: 3, row: 10, options: { disableBorder: true } })

返回：
  string`,
    category: 'table',
    inputSchema: z.object({
      col: z.number().int().nonnegative(),
      row: z.number().int().nonnegative(),
      options: z
        .object({
          disableBackground: z.boolean().optional(),
          disableBorder: z.boolean().optional()
        })
        .optional()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.exportCellImg !== 'function') {
        throw new Error('VTable instance does not support exportCellImg');
      }
      return table.exportCellImg(params.col, params.row, params.options);
    }
  },

  {
    name: 'export_cell_range_img',
    description: `导出指定区域为图片（dataURL 字符串）

使用示例：
  - export_cell_range_img({ range: { start: { col: 0, row: 0 }, end: { col: 5, row: 20 } } })

返回：
  string`,
    category: 'table',
    inputSchema: z.object({
      range: cellRangeSchema
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.exportCellRangeImg !== 'function') {
        throw new Error('VTable instance does not support exportCellRangeImg');
      }
      return table.exportCellRangeImg(params.range);
    }
  }
];
