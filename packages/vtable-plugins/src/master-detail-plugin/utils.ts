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
 * 获取内部属性 - 类型安全的访问器
 */
export function getInternalProps(table: VTable.ListTable): VTable.ListTable['internalProps'] & InternalProps {
  return table.internalProps as VTable.ListTable['internalProps'] & InternalProps;
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
