/**
 * VTable 视图/滚动相关工具集
 *
 * @module view-operations
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

export const viewOperationTools = [
  {
    name: 'get_scroll',
    description: `获取当前滚动位置

返回：
  { scrollLeft: number, scrollTop: number }`,
    category: 'table',
    inputSchema: z.object({}),
    execute: async () => {
      const table = getVTableInstance();

      const scrollLeft = typeof table.getScrollLeft === 'function' ? table.getScrollLeft() : table.scrollLeft;
      const scrollTop = typeof table.getScrollTop === 'function' ? table.getScrollTop() : table.scrollTop;

      return { scrollLeft, scrollTop };
    }
  },

  {
    name: 'set_scroll',
    description: `设置滚动位置（可单独设置其中一个）

使用示例：
  - set_scroll({ scrollTop: 200 })
  - set_scroll({ scrollLeft: 100, scrollTop: 200 })

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      scrollLeft: z.number().optional(),
      scrollTop: z.number().optional()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();

      if (typeof table.setScrollLeft !== 'function' || typeof table.setScrollTop !== 'function') {
        throw new Error('VTable instance does not support setScrollLeft/setScrollTop');
      }

      if (typeof params.scrollTop === 'number') {
        table.setScrollTop(params.scrollTop);
      }
      if (typeof params.scrollLeft === 'number') {
        table.setScrollLeft(params.scrollLeft);
      }
      return 'Success';
    }
  },

  {
    name: 'scroll_to_cell',
    description: `滚动到指定单元格位置

使用示例：
  - scroll_to_cell({ row: 100 })
  - scroll_to_cell({ col: 5, row: 100 })

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      col: z.number().int().nonnegative().optional(),
      row: z.number().int().nonnegative().optional(),
      animation: z.boolean().optional().describe('是否开启动画（true 会使用默认动画配置）')
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.scrollToCell !== 'function') {
        throw new Error('VTable instance does not support scrollToCell');
      }
      const animationOption = params.animation ? true : undefined;
      table.scrollToCell({ col: params.col, row: params.row }, animationOption);
      return 'Success';
    }
  },

  {
    name: 'scroll_to_row',
    description: `滚动到指定行

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      row: z.number().int().nonnegative(),
      animation: z.boolean().optional()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.scrollToRow !== 'function') {
        throw new Error('VTable instance does not support scrollToRow');
      }
      table.scrollToRow(params.row, params.animation ? true : undefined);
      return 'Success';
    }
  },

  {
    name: 'scroll_to_col',
    description: `滚动到指定列

返回：
  'Success'`,
    category: 'table',
    inputSchema: z.object({
      col: z.number().int().nonnegative(),
      animation: z.boolean().optional()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.scrollToCol !== 'function') {
        throw new Error('VTable instance does not support scrollToCol');
      }
      table.scrollToCol(params.col, params.animation ? true : undefined);
      return 'Success';
    }
  },

  {
    name: 'get_visible_cell_range',
    description: `获取当前 body 区域的可视单元格范围

返回：
  { rowStart, colStart, rowEnd, colEnd }`,
    category: 'table',
    inputSchema: z.object({}),
    execute: async () => {
      const table = getVTableInstance();
      if (typeof table.getBodyVisibleCellRange !== 'function') {
        throw new Error('VTable instance does not support getBodyVisibleCellRange');
      }
      return table.getBodyVisibleCellRange();
    }
  }
];
