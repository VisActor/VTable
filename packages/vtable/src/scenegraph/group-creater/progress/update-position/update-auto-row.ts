import type { BaseTableAPI } from '../../../../ts-types/base-table';
import type { Group } from '../../../graphic/group';

export function updateAutoRow(
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
  table: BaseTableAPI,
  direction: 'up' | 'down' = 'up'
) {
  // // 获取行高
  // for (let row = rowStart; row <= rowEnd; row++) {
  //   let maxRowHeight = 0;
  //   for (let col = colStart; col <= colEnd; col++) {
  //     const cellGroup = table.scenegraph.highPerformanceGetCell(col, row);
  //     if (!cellGroup.row) {
  //       continue;
  //     }
  //     // const contentHeight = cellGroup.getContentHeight();
  //     const text = (cellGroup.getChildByName('text') as WrapText) || cellGroup.getChildByName('content');
  //     const headerStyle = table._getCellStyle(col, row);
  //     const padding = getQuadProps(getProp('padding', headerStyle, col, row, table));
  //     const height = text.AABBBounds.height() + (padding[0] + padding[2]);
  //     maxRowHeight = Math.max(maxRowHeight, height);
  //     (cellGroup as any).needUpdateForAutoRowHeight = false;
  //   }
  //   // updateRowHeight(table.scenegraph, row, table.getRowHeight(row) - maxRowHeight);
  //   for (let col = colStart; col <= colEnd; col++) {
  //     const cellGroup = table.scenegraph.highPerformanceGetCell(col, row);
  //     updateCellHeightForColumn(table.scenegraph, cellGroup, col, row, maxRowHeight, 0, false);
  //   }

  //   table.setRowHeight(row, maxRowHeight, true);
  // }

  // 更新y位置
  if (direction === 'up') {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
        if (!cellGroup.row) {
          continue;
        }
        let y;
        if (cellGroup._prev) {
          // y = ((cellGroup._prev as Group)?.attribute.y ?? 0) + ((cellGroup._prev as Group)?.attribute.height ?? 0);
          y = (cellGroup._prev as Group)?.attribute.y + table.getRowHeight((cellGroup._prev as Group).row);
        } else {
          // 估计位置
          y = table.getRowsHeight(table.columnHeaderLevelCount, cellGroup.row - 1);
        }
        cellGroup.setAttribute('y', y);
      }
    }
  } else {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowEnd; row >= rowStart; row--) {
        const cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
        if (!cellGroup.row) {
          continue;
        }
        let y;
        if (cellGroup._next) {
          // y = ((cellGroup._next as Group)?.attribute.y ?? 0) - (cellGroup.attribute.height ?? 0);
          y = (cellGroup._next as Group)?.attribute.y - table.getRowHeight(cellGroup.row);
        } else {
          // 估计位置
          y = table.getRowsHeight(table.columnHeaderLevelCount, cellGroup.row - 1);
          // console.log('估计位置', table.getRowsHeight(table.columnHeaderLevelCount, cellGroup.row));
        }
        cellGroup.setAttribute('y', y);
      }
    }
  }

  // update y limit in proxy
  const totalActualBodyRowCount = Math.min(
    table.scenegraph.proxy.rowLimit,
    table.scenegraph.proxy.bodyBottomRow - table.scenegraph.proxy.bodyTopRow + 1
  ); // 渐进加载总row数量
  const totalBodyHeight = table.getRowsHeight(
    table.columnHeaderLevelCount,
    table.columnHeaderLevelCount + totalActualBodyRowCount
  );
  const totalHeight = table.getRowsHeight(table.columnHeaderLevelCount, table.rowCount - 1);
  table.scenegraph.proxy.yLimitTop = totalBodyHeight / 2;
  table.scenegraph.proxy.yLimitBottom = totalHeight - totalBodyHeight / 2;
}
