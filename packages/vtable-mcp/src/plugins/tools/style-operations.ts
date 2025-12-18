/**
 * VTable 样式操作工具集
 *
 * 提供单元格样式的设置和读取功能。
 * 支持字体、颜色、对齐等样式属性。
 *
 * 注意：样式操作可能因 VTable 版本不同而有差异，
 * 建议参考 VTable 官方文档确认可用的样式属性。
 *
 * @module style-operations
 */

// ⭐ 浏览器端直接导入 zod
import { z } from 'zod';

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
  .describe('单元格样式对象');

/**
 * 样式操作工具集合
 *
 * 包含 2 个工具：
 * 1. set_cell_style - 设置单元格样式
 * 2. get_cell_style - 获取单元格样式
 */
export const styleOperationTools = [
  {
    name: 'set_cell_style',

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
        .array(
          z.object({
            row: z.number().int().nonnegative(),
            col: z.number().int().nonnegative(),
            style: cellStyleSchema
          })
        )
        .min(1)
    }),

    /**
     * 执行设置样式操作
     *
     * @param params - 验证后的参数
     * @returns 成功消息
     */
    execute: async (params: any) => {
      const table = (globalThis as any).__vtable_instance;

      if (!table) {
        throw new Error('VTable instance not found');
      }

      // 批量设置样式
      for (const item of params.items) {
        // updateCellStyle(col, row, style) - 注意参数顺序
        table.updateCellStyle(item.col, item.row, item.style);
      }

      return 'Success';
    }
  },

  {
    name: 'get_cell_style',

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
      const table = (globalThis as any).__vtable_instance;

      if (!table) {
        throw new Error('VTable instance not found');
      }

      // getCellStyle(col, row) - 注意参数顺序
      return table.getCellStyle(params.col, params.row);
    }
  }
];
