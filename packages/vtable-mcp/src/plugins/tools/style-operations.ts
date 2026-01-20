/**
 * VTable 样式操作工具集
 *
 * 提供单元格/区域样式的设置与读取能力。
 *
 * 重要说明：
 * - VTable 核心 API 并不存在 `updateCellStyle` 方法。
 * - 正确的做法是使用 `registerCustomCellStyle` + `arrangeCustomCellStyle`
 *   通过 custom style plugin 将样式“挂载”到单元格或区域上。
 *
 * @module style-operations
 */

// ⭐ 浏览器端直接导入 zod
import { z } from 'zod';
import type { BaseTableAPI } from '@visactor/vtable';

type VTableStyleApi = Partial<BaseTableAPI>;

function getVTableInstance(): VTableStyleApi {
  const table = (globalThis as unknown as { __vtable_instance?: unknown }).__vtable_instance;
  if (!table) {
    throw new Error('VTable instance not found');
  }
  return table as VTableStyleApi;
}

/**
 * 单元格样式 Schema
 *
 * 定义了支持的样式属性。
 * 可以根据 VTable 的实际支持情况扩展。
 */
const cellStyleSchema = z
  .object({
    /** 字体大小（像素） */
    fontSize: z.number().positive().optional(),

    /** 字体族 */
    fontFamily: z.string().optional(),

    /** 字体粗细 */
    fontWeight: z.union([z.literal('normal'), z.literal('bold')]).optional(),

    /** 字体样式 */
    fontStyle: z.union([z.literal('normal'), z.literal('italic')]).optional(),

    /** 文字颜色（十六进制或颜色名） */
    color: z.string().optional(),

    /** 背景颜色 */
    bgColor: z.string().optional(),

    /** 水平对齐 */
    textAlign: z.union([z.literal('left'), z.literal('center'), z.literal('right')]).optional(),

    /** 垂直对齐 */
    textBaseline: z.union([z.literal('top'), z.literal('middle'), z.literal('bottom')]).optional()
  })
  // 允许透传更多 VTable 支持的样式属性（例如 padding、lineHeight、textOverflow 等）
  .passthrough()
  .describe('单元格样式对象');

/**
 * 样式操作工具集合
 *
 * 包含 3 个工具：
 * 1. set_cell_style - 设置单元格样式
 * 2. get_cell_style - 获取单元格样式
 * 3. set_range_style - 设置区域样式
 */
export const styleOperationTools = [
  {
    name: 'set_cell_style',
    category: 'style',

    description: `设置一个或多个单元格的样式

使用示例：
  - set_cell_style({ items: [
      { row: 0, col: 0, style: { color: "#FF0000", fontWeight: "bold" } }
    ]})

支持的样式属性：
  - fontSize: 字体大小
  - fontFamily: 字体族
  - fontWeight: 'normal' | 'bold'
  - fontStyle: 'normal' | 'italic'
  - color: 文字颜色
  - bgColor: 背景颜色
  - textAlign: 'left' | 'center' | 'right'
  - textBaseline: 'top' | 'middle' | 'bottom'

参数：
  - items: 样式设置数组
    - row: 行索引
    - col: 列索引
    - style: 样式对象

返回：
  'Success' 字符串`,

    inputSchema: z.object({
      items: z
        .union([
          z
            .array(
              z.object({
                row: z.number().int().nonnegative(),
                col: z.number().int().nonnegative(),
                style: cellStyleSchema
              })
            )
            .min(1),
          z.object({
            row: z.number().int().nonnegative(),
            col: z.number().int().nonnegative(),
            style: cellStyleSchema
          })
        ])
        .describe('样式设置：支持单个对象或对象数组（推荐数组）')
    }),

    /**
     * 执行设置样式操作
     *
     * @param params - 验证后的参数
     * @returns 成功消息
     */
    execute: async (params: {
      items:
        | Array<{ row: number; col: number; style: Record<string, unknown> }>
        | { row: number; col: number; style: Record<string, unknown> };
    }) => {
      const table = getVTableInstance();

      if (typeof table.registerCustomCellStyle !== 'function' || typeof table.arrangeCustomCellStyle !== 'function') {
        throw new Error('VTable instance does not support custom cell style APIs');
      }

      const items = Array.isArray((params as any).items) ? (params as any).items : [(params as any).items];

      // 批量设置样式：为每个单元格注册一个稳定的 customStyleId，然后挂载到该单元格
      for (const item of items) {
        const customStyleId = `mcp_cell_style_${item.col}_${item.row}`;
        table.registerCustomCellStyle(customStyleId, item.style);
        table.arrangeCustomCellStyle({ col: item.col, row: item.row }, customStyleId, true);
      }

      return 'Success';
    }
  },

  {
    name: 'get_cell_style',
    category: 'style',

    description: `获取单元格的当前样式

使用示例：
  - get_cell_style({ row: 0, col: 0 })

参数：
  - row: 行索引
  - col: 列索引

返回：
  样式对象，包含该单元格的所有样式属性`,

    inputSchema: z.object({
      row: z.number().int().nonnegative(),
      col: z.number().int().nonnegative()
    }),

    /**
     * 执行获取样式操作
     *
     * @param params - 验证后的参数
     * @returns 样式对象
     */
    execute: async (params: { row: number; col: number }) => {
      const table = getVTableInstance();
      if (typeof table.getCellStyle !== 'function') {
        throw new Error('VTable instance does not support getCellStyle');
      }

      // getCellStyle(col, row) - 注意参数顺序
      return table.getCellStyle(params.col, params.row);
    }
  },

  {
    name: 'set_range_style',
    category: 'style',

    description: `为一个区域设置样式（通过 custom cell style 挂载）

使用示例：
  - set_range_style({ range: { start: { col: 0, row: 0 }, end: { col: 3, row: 10 } }, style: { bgColor: "#FFF7E6" } })

参数：
  - range: 区域（start/end）
  - style: 样式对象（会透传更多 VTable 支持的样式字段）

返回：
  'Success' 字符串`,

    inputSchema: z.object({
      range: z.object({
        start: z.object({ col: z.number().int().nonnegative(), row: z.number().int().nonnegative() }),
        end: z.object({ col: z.number().int().nonnegative(), row: z.number().int().nonnegative() })
      }),
      style: cellStyleSchema
    }),

    execute: async (params: {
      range: { start: { col: number; row: number }; end: { col: number; row: number } };
      style: Record<string, unknown>;
    }) => {
      const table = getVTableInstance();
      if (typeof table.registerCustomCellStyle !== 'function' || typeof table.arrangeCustomCellStyle !== 'function') {
        throw new Error('VTable instance does not support custom cell style APIs');
      }

      const { range, style } = params;
      const { start, end } = range;
      const customStyleId = `mcp_range_style_${start.col}_${start.row}_${end.col}_${end.row}`;

      table.registerCustomCellStyle(customStyleId, style);
      table.arrangeCustomCellStyle({ range }, customStyleId, true);
      return 'Success';
    }
  }
];
