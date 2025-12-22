/**
 * VTable 行列尺寸相关工具集
 *
 * @module dimension-operations
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

export const dimensionOperationTools = [
  {
    name: 'set_row_height',
    description: `设置指定行高度

使用示例：
  - set_row_height({ row: 10, height: 36 })

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      row: z.number().int().nonnegative(),
      height: z.number().positive()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.setRowHeight !== 'function') {
        throw new Error('VTable instance does not support setRowHeight');
      }
      table.setRowHeight(params.row, params.height);
      return 'Success';
    }
  },

  {
    name: 'set_col_width',
    description: `设置指定列宽度

使用示例：
  - set_col_width({ col: 2, width: 120 })

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      col: z.number().int().nonnegative(),
      width: z.number().positive()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.setColWidth !== 'function') {
        throw new Error('VTable instance does not support setColWidth');
      }
      table.setColWidth(params.col, params.width);
      return 'Success';
    }
  },

  {
    name: 'get_row_height',
    description: `获取指定行高度

返回：
  { row, height }`,
    category: 'table',
    inputSchema: z.object({
      row: z.number().int().nonnegative()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.getRowHeight !== 'function') {
        throw new Error('VTable instance does not support getRowHeight');
      }
      return { row: params.row, height: table.getRowHeight(params.row) };
    }
  },

  {
    name: 'get_col_width',
    description: `获取指定列宽度

返回：
  { col, width }`,
    category: 'table',
    inputSchema: z.object({
      col: z.number().int().nonnegative()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.getColWidth !== 'function') {
        throw new Error('VTable instance does not support getColWidth');
      }
      return { col: params.col, width: table.getColWidth(params.col) };
    }
  },

  {
    name: 'batch_set_row_heights',
    description: `批量设置行高

使用示例：
  - batch_set_row_heights({ items: [{ row: 0, height: 28 }, { row: 1, height: 40 }] })

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      items: z
        .array(
          z.object({
            row: z.number().int().nonnegative(),
            height: z.number().positive()
          })
        )
        .min(1)
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.setRowHeight !== 'function') {
        throw new Error('VTable instance does not support setRowHeight');
      }
      for (const item of params.items) {
        table.setRowHeight(item.row, item.height);
      }
      return 'Success';
    }
  },

  {
    name: 'batch_set_col_widths',
    description: `批量设置列宽

使用示例：
  - batch_set_col_widths({ items: [{ col: 0, width: 120 }, { col: 1, width: 200 }] })

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      items: z
        .array(
          z.object({
            col: z.number().int().nonnegative(),
            width: z.number().positive()
          })
        )
        .min(1)
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.setColWidth !== 'function') {
        throw new Error('VTable instance does not support setColWidth');
      }
      for (const item of params.items) {
        table.setColWidth(item.col, item.width);
      }
      return 'Success';
    }
  }
];
