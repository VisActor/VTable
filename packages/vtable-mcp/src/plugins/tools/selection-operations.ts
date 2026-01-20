/**
 * VTable 选区操作工具集
 *
 * 基于 VTable BaseTableAPI 的选区能力：
 * - getSelectedCellRanges()
 * - selectCells()
 * - clearSelected()
 * - selectCell()
 *
 * @module selection-operations
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

export const selectionOperationTools = [
  {
    name: 'get_selected_ranges',
    description: `获取当前选中的区域列表

返回：
  CellRange[]，形如：
  [{ start: { col, row }, end: { col, row } }, ...]`,
    category: 'table',
    inputSchema: z.object({}).describe('无需参数'),
    execute: async () => {
      const table = getVTableInstance();
      if (typeof table.getSelectedCellRanges !== 'function') {
        throw new Error('VTable instance does not support getSelectedCellRanges');
      }
      return table.getSelectedCellRanges();
    }
  },

  {
    name: 'set_selected_ranges',
    description: `设置当前选区（可一次设置多个区域）

使用示例：
  - set_selected_ranges({ ranges: [{ start: { col: 0, row: 0 }, end: { col: 2, row: 10 } }] })

返回：
  'Success' 字符串`,
    category: 'table',
    inputSchema: z.object({
      ranges: z.array(cellRangeSchema).min(1)
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.selectCells !== 'function') {
        throw new Error('VTable instance does not support selectCells');
      }
      table.selectCells(params.ranges);
      return 'Success';
    }
  },

  {
    name: 'clear_selected',
    description: `清除选区

返回：
  'Success' 字符串`,
    category: 'table',
    inputSchema: z.object({}),
    execute: async () => {
      const table = getVTableInstance();
      if (typeof table.clearSelected !== 'function') {
        throw new Error('VTable instance does not support clearSelected');
      }
      table.clearSelected();
      return 'Success';
    }
  },

  {
    name: 'select_cell',
    description: `选中一个单元格（可选支持 shift/ctrl 行为）

使用示例：
  - select_cell({ col: 3, row: 10 })
  - select_cell({ col: 3, row: 10, isShift: true })

返回：
  'Success' 字符串`,
    category: 'table',
    inputSchema: z.object({
      col: z.number().int().nonnegative(),
      row: z.number().int().nonnegative(),
      isShift: z.boolean().optional(),
      isCtrl: z.boolean().optional(),
      makeVisible: z.boolean().optional(),
      skipBodyMerge: z.boolean().optional()
    }),
    execute: async (params: any) => {
      const table = getVTableInstance();
      if (typeof table.selectCell !== 'function') {
        throw new Error('VTable instance does not support selectCell');
      }
      table.selectCell(params.col, params.row, params.isShift, params.isCtrl, params.makeVisible, params.skipBodyMerge);
      return 'Success';
    }
  }
];
