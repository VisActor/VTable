import type { ListTable } from '../../ListTable';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { CellAddress } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function adjustMoveHeaderTarget(source: CellAddress, target: CellAddress, table: BaseTableAPI) {
  const sourceCellRange = table.getCellRange(source.col, source.row);

  if (
    table.isColumnHeader(source.col, source.row) ||
    ((table as ListTable).stateManager.columnMove.movingColumnOrRow === 'column' && source.row === 0)
  ) {
    // 处理是目标位置处是合并单元格的情况
    const targetCellRange = table.getCellRange(target.col, sourceCellRange.start.row);
    // 如果是拖拽处是body target.row处理成表头最后一层
    if (target.row >= table.columnHeaderLevelCount) {
      target.row = Math.max(table.columnHeaderLevelCount - 1, 0);
    }
    //如果拖拽目标的列在原位置的右侧 位置是合并单元格的最右侧
    if (target.col >= source.col) {
      target.col = targetCellRange.end.col;
    } else {
      target.col = targetCellRange.start.col;
    } //左侧 位置是合并单元格的最左侧
  } else if (
    table.isRowHeader(source.col, source.row)
    // ||
    // ((table as ListTable).transpose && table.internalProps.layoutMap.isSeriesNumberInBody(source.col, source.row))
  ) {
    const layoutMap = table.internalProps.layoutMap as PivotHeaderLayoutMap;
    const targetCellRange = table.getCellRange(sourceCellRange.start.col, target.row);
    if (target.col >= table.rowHeaderLevelCount + layoutMap.leftRowSeriesNumberColumnCount) {
      target.col = table.rowHeaderLevelCount + layoutMap.leftRowSeriesNumberColumnCount - 1;
    }
    // tree模式[透视表行表头]
    if (layoutMap.rowHierarchyType === 'tree') {
      const sourceRowHeaderPaths = layoutMap.getCellHeaderPathsWithTreeNode(source.col, source.row)
        .rowHeaderPaths as any;
      const targetRowHeaderPaths = layoutMap.getCellHeaderPathsWithTreeNode(target.col, target.row)
        .rowHeaderPaths as any;
      if (sourceRowHeaderPaths.length <= targetRowHeaderPaths.length) {
        const targetPathNode = targetRowHeaderPaths[sourceRowHeaderPaths.length - 1]; //找到共同层级节点
        // 根据这个目标节点找到结束的row index
        if (targetPathNode) {
          if (target.row >= source.row) {
            //如果拖拽目标的列在原位置的上面 位置是层级的最上端
            target.row = targetPathNode.startInTotal + targetPathNode.size - 1 + table.columnHeaderLevelCount;
          } else {
            target.row = targetPathNode.startInTotal + table.columnHeaderLevelCount;
          }
        } //如果拖拽目标的列在原位置的下面 位置是层级的最下端
      }
    } else if (target.row >= source.row) {
      //table模式 如果拖拽目标的列在原位置的下面 位置是层级的最下端
      target.row = targetCellRange.end.row;
    } else {
      //table模式  如果拖拽目标的列在原位置的上面 位置是层级的最上端
      target.row = targetCellRange.start.row;
    }
  }
  return target;
}

export function adjustWidthResizedColMap(
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
          // 目标位置之后的列需要向左移动（减去sourceSize）
          // 原来错误逻辑：目标位置之后的列保持不变
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

export function adjustHeightResizedRowMap(
  moveContext: { sourceIndex: number; targetIndex: number; sourceSize: number },
  table: BaseTableAPI
) {
  // internalProps._heightResizedRowMap 中存储着被手动调整过行高的列号 这里也需要调整下存储的列号
  if (table.internalProps._heightResizedRowMap.size > 0) {
    // 获取当前所有被调整过行高的列号
    const resizedRowIndexs = Array.from(table.internalProps._heightResizedRowMap.keys());
    // 清空映射，准备重新添加调整后的列号
    table.internalProps._heightResizedRowMap.clear();

    for (let i = 0; i < resizedRowIndexs.length; i++) {
      const rowIndex = resizedRowIndexs[i] as number;
      // 根据列移动情况调整列号
      let newRowIndex: number;
      const { sourceIndex, targetIndex, sourceSize } = moveContext;
      if (rowIndex >= sourceIndex && rowIndex < sourceIndex + sourceSize) {
        // 如果行在移动源范围内，则调整到目标位置
        newRowIndex = targetIndex + (rowIndex - sourceIndex);
      } else if (sourceIndex < targetIndex) {
        // 如果源位置在目标位置之前（向后移动）
        if (rowIndex >= sourceIndex + sourceSize && rowIndex < targetIndex) {
          // 在源位置之后、目标位置之前的行向前移动
          newRowIndex = rowIndex - sourceSize;
        } else if (rowIndex >= targetIndex) {
          // 修复：目标位置之后的行需要向左移动（减去sourceSize）
          // 原始逻辑错误：原来是保持不变 newRowIndex = rowIndex;
          newRowIndex = rowIndex - sourceSize;
        } else {
          // 源位置之前的行保持不变
          newRowIndex = rowIndex;
        }
      } else {
        // 如果源位置在目标位置之后（向前移动）
        if (rowIndex >= targetIndex && rowIndex < sourceIndex) {
          // 在目标位置之后、源位置之后的行向后移动
          newRowIndex = rowIndex + sourceSize;
        } else if (rowIndex >= sourceIndex + sourceSize) {
          // 源位置之后的行保持不变
          newRowIndex = rowIndex;
        } else {
          // 目标位置之前的行保持不变
          newRowIndex = rowIndex;
        }
      }

      // 将调整后的行号添加到映射中
      table.internalProps._heightResizedRowMap.add(newRowIndex);
    }
  }
}

export function adjustHeightResizedRowMapWithAddRecordIndex(table: ListTable, recordIndex: number, records: any[]) {
  const resizedRowIndexs = Array.from(table.internalProps._heightResizedRowMap.keys());
  const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
  const rowIndex = (recordIndex as number) + headerCount;
  for (let i = 0; i < resizedRowIndexs.length; i++) {
    if ((resizedRowIndexs[i] as number) >= (rowIndex as number)) {
      table.internalProps._heightResizedRowMap.delete(resizedRowIndexs[i] as number);
      table.internalProps._heightResizedRowMap.add((resizedRowIndexs[i] as number) + records.length);
    }
  }
}

export function adjustHeightResizedRowMapWithDeleteRecordIndex(table: ListTable, recordIndexs: number[]) {
  const headerCount = table.transpose ? table.rowHeaderLevelCount : table.columnHeaderLevelCount;
  recordIndexs.sort((a, b) => b - a);
  for (let i = 0; i < recordIndexs.length; i++) {
    const rowIndex = (recordIndexs[i] as number) + headerCount;
    const resizedRowIndexs = Array.from(table.internalProps._heightResizedRowMap.keys());
    for (let j = 0; j < resizedRowIndexs.length; j++) {
      if ((resizedRowIndexs[j] as number) === (rowIndex as number)) {
        table.internalProps._heightResizedRowMap.delete(resizedRowIndexs[j] as number);
      } else if ((resizedRowIndexs[j] as number) > (rowIndex as number)) {
        table.internalProps._heightResizedRowMap.delete(resizedRowIndexs[j] as number);
        table.internalProps._heightResizedRowMap.add((resizedRowIndexs[j] as number) - 1);
      } else {
      }
    }
  }
}
