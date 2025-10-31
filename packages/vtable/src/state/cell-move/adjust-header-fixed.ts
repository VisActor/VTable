import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * 调整被手动设置过宽度的列的映射，修复版本
 * @param moveContext 移动上下文
 * @param table 表格实例
 */
export function adjustWidthResizedColMapFixed(
  moveContext: { sourceIndex: number; targetIndex: number; sourceSize: number },
  table: BaseTableAPI
) {
  // internalProps._widthResizedColMap 中存储着被手动调整过列宽的列号 这里也需要调整下存储的列号
  if (table.internalProps._widthResizedColMap.size > 0) {
    // 获取当前所有被调整过列宽的列号
    const resizedColIndexs = Array.from(table.internalProps._widthResizedColMap.keys());
    // 清空映射，准备重新添加调整后的列号
    table.internalProps._widthResizedColMap.clear();

    for (let i = 0; i < resizedColIndexs.length; i++) {
      const colIndex = resizedColIndexs[i] as number;
      // 根据列移动情况调整列号
      let newColIndex: number;
      const { sourceIndex, targetIndex, sourceSize } = moveContext;

      if (colIndex >= sourceIndex && colIndex < sourceIndex + sourceSize) {
        // 如果列在移动源范围内，则调整到目标位置
        newColIndex = targetIndex + (colIndex - sourceIndex);
      } else if (sourceIndex < targetIndex) {
        // 如果源位置在目标位置之前（向后移动）
        if (colIndex >= sourceIndex + sourceSize && colIndex < targetIndex) {
          // 在源位置之后、目标位置之前的列向前移动
          newColIndex = colIndex - sourceSize;
        } else if (colIndex >= targetIndex) {
          // 修复：目标位置之后的列需要向左移动（减去sourceSize）
          // 原始逻辑错误：原来是保持不变 newColIndex = colIndex;
          newColIndex = colIndex - sourceSize;
        } else {
          // 源位置之前的列保持不变
          newColIndex = colIndex;
        }
      } else {
        // 如果源位置在目标位置之后（向前移动）
        if (colIndex >= targetIndex && colIndex < sourceIndex) {
          // 在目标位置之后、源位置之前的列向后移动
          newColIndex = colIndex + sourceSize;
        } else if (colIndex >= sourceIndex + sourceSize) {
          // 源位置之后的列保持不变
          newColIndex = colIndex;
        } else {
          // 目标位置之前的列保持不变
          newColIndex = colIndex;
        }
      }

      // 将调整后的列号添加到映射中
      table.internalProps._widthResizedColMap.add(newColIndex);
    }
  }
}
