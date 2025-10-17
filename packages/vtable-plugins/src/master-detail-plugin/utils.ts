import type * as VTable from '@visactor/vtable';
import type { InternalProps } from './types';

/**
 * 解析 margin 配置，返回 [上, 右, 下, 左] 格式
 */
export function parseMargin(
  margin?: number | [number, number] | [number, number, number, number]
): [number, number, number, number] {
  if (margin === undefined || margin === null) {
    return [10, 10, 10, 10];
  }
  if (typeof margin === 'number') {
    return [margin, margin, margin, margin];
  }
  if (Array.isArray(margin)) {
    if (margin.length === 2) {
      // [上下, 左右]
      const [vertical, horizontal] = margin;
      return [vertical, horizontal, vertical, horizontal];
    } else if (margin.length === 4) {
      // [上, 右, 下, 左]
      return margin;
    }
  }
  return [10, 10, 10, 10];
}

/**
 * 获取内部属性
 */
export function getInternalProps(table: VTable.ListTable): VTable.TYPES.ListTableProtected & InternalProps {
  return table.internalProps as VTable.TYPES.ListTableProtected & InternalProps;
}

/**
 * 根据行索引获取记录
 */
export function getRecordByRowIndex(table: VTable.ListTable, bodyRowIndex: number): Record<string, unknown> {
  return table.dataSource.getRaw(bodyRowIndex) as Record<string, unknown>;
}

/**
 * 获取原始行高
 */
export function getOriginalRowHeight(table: VTable.ListTable, bodyRowIndex: number): number {
  const internalProps = getInternalProps(table);
  return internalProps.originalRowHeights?.get(bodyRowIndex) || 0;
}

// 缓存列索引
const columnIndexCache = new WeakMap<VTable.ListTable, Map<string | number, number>>();

/**
 * 查找checkbox列的索引
 */
export function findCheckboxColumnIndex(table: VTable.ListTable, field: string | number): number {
  // 获取或创建表格的缓存
  let tableCache = columnIndexCache.get(table);
  if (!tableCache) {
    tableCache = new Map();
    columnIndexCache.set(table, tableCache);
  }

  // 检查缓存
  if (tableCache.has(field)) {
    return tableCache.get(field);
  }

  // 查找列索引
  for (let col = 0; col < table.colCount; col++) {
    const cellField = table.getHeaderField(col, 0);
    if (cellField === field) {
      tableCache.set(field, col);
      return col;
    }
  }

  // 未找到时也缓存结果
  tableCache.set(field, -1);
  return -1;
}

/**
 * 设置单元格checkbox状态并更新属性
 */
export function setCellCheckboxStateByAttribute(
  col: number,
  row: number,
  checked: boolean | 'indeterminate',
  table: VTable.ListTable
): void {
  const cellGroup = table.scenegraph.getCell(col, row);
  if (cellGroup) {
    cellGroup.forEachChildren((child: unknown) => {
      const childNode = child as {
        name?: string;
        type?: string;
        attribute?: { type?: string };
        setAttributes?: (attrs: { checked?: boolean; indeterminate?: boolean }) => void;
      };
      if (
        childNode.name === 'checkbox-icon' ||
        childNode.name === 'checkbox' ||
        childNode.type === 'checkbox' ||
        (childNode.attribute && childNode.attribute.type === 'checkbox')
      ) {
        if (childNode.setAttributes) {
          if (checked === 'indeterminate') {
            childNode.setAttributes({
              checked: false,
              indeterminate: true
            });
          } else {
            childNode.setAttributes({
              checked: checked,
              indeterminate: false
            });
          }
        }
      }
    });
  }
}
