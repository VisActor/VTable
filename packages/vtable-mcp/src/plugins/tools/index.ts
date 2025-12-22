/**
 * VTable MCP 工具集合导出
 *
 * 这个文件聚合所有 VTable MCP 工具，方便统一导入和管理。
 *
 * 工具分类：
 * - cellOperationTools: 单元格操作（读写、查询）
 * - styleOperationTools: 样式操作（设置、获取）
 *
 * 扩展方式：
 * 如果要添加新类型的工具（如行列操作、筛选等），
 * 可以创建新文件如 row-operations.ts，然后在这里导入和导出。
 *
 * @module tools
 */

export { cellOperationTools } from './cell-operations';
export { styleOperationTools } from './style-operations';
export { rangeOperationTools } from './range-operations';
export { selectionOperationTools } from './selection-operations';
export { viewOperationTools } from './view-operations';
export { dimensionOperationTools } from './dimension-operations';
export { exportOperationTools } from './export-operations';
export { mergeOperationTools } from './merge-operations';
export { operateDataTools } from './operate-data';

import { cellOperationTools } from './cell-operations';
import { styleOperationTools } from './style-operations';
import { rangeOperationTools } from './range-operations';
import { selectionOperationTools } from './selection-operations';
import { viewOperationTools } from './view-operations';
import { dimensionOperationTools } from './dimension-operations';
import { exportOperationTools } from './export-operations';
import { mergeOperationTools } from './merge-operations';
import { operateDataTools } from './operate-data';

/**
 * 所有 VTable MCP 工具的集合
 *
 * 这个数组包含了所有可用的工具，
 * VTableToolRegistry 会将这些工具注册到 MCP 客户端的工具注册表中。
 *
 * 当前包含 5 个工具：
 * - set_cell_data (单元格操作)
 * - get_cell_data (单元格操作)
 * - get_table_info (单元格操作)
 * - set_cell_style (样式操作)
 * - get_cell_style (样式操作)
 *
 * @example
 * ```typescript
 * // 添加新工具
 * import { rowOperationTools } from './row-operations';
 * export const allVTableTools = [
 *   ...cellOperationTools,
 *   ...styleOperationTools,
 *   ...rowOperationTools,  // 新增
 * ];
 * ```
 */
export const allVTableTools = [
  ...cellOperationTools, // 3 个工具
  ...styleOperationTools, // 3 个工具
  ...rangeOperationTools, // 3 个工具
  ...selectionOperationTools, // 4 个工具
  ...viewOperationTools, // 5 个工具
  ...dimensionOperationTools, // 6 个工具
  ...exportOperationTools, // 3 个工具
  ...mergeOperationTools, // 3 个工具（合并单元格）
  ...operateDataTools // 4 个工具（ListTable 数据增删改）
];
