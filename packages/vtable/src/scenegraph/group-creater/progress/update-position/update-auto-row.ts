import { isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../../ts-types/base-table';
import type { Group } from '../../../graphic/group';

export function updateAutoRow(
  colStart: number,
  colEnd: number,
  rowStart: number,
  rowEnd: number,
  table: BaseTableAPI,
  direction: 'up' | 'down' = 'up',
  part?: boolean
) {
  // return;
  // 更新y位置
  if (direction === 'up') {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
        if (cellGroup.role !== 'cell' || !cellGroup.row) {
          continue;
        }
        let y;
        if (cellGroup._prev) {
          // y = ((cellGroup._prev as Group)?.attribute.y ?? 0) + ((cellGroup._prev as Group)?.attribute.height ?? 0);
          y = (cellGroup._prev as Group)?.attribute.y + table.getRowHeight((cellGroup._prev as Group).row);
        } else if (part) {
          const baseCellGroup = table.scenegraph.highPerformanceGetCell(col, rowEnd + 1, true);
          y = baseCellGroup.attribute.y;
          if (isValid(y)) {
            for (let r = row; r <= rowEnd; r++) {
              y -= table.getRowHeight(r);
            }
          }
        } else {
          // 估计位置
          y = table.getRowsHeight(table.frozenRowCount, cellGroup.row - 1);
        }
        if (isValid(y)) {
          cellGroup.setAttribute('y', y);
        }
      }
    }
  } else {
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowEnd; row >= rowStart; row--) {
        const cellGroup = table.scenegraph.highPerformanceGetCell(col, row, true);
        if (cellGroup.role !== 'cell' || !cellGroup.row) {
          continue;
        }
        let y;
        if (cellGroup._next) {
          // y = ((cellGroup._next as Group)?.attribute.y ?? 0) - (cellGroup.attribute.height ?? 0);
          y = (cellGroup._next as Group)?.attribute.y - table.getRowHeight(cellGroup.row);
        } else if (part) {
          const baseCellGroup = table.scenegraph.highPerformanceGetCell(col, rowStart - 1, true);
          y = baseCellGroup.attribute.y;
          for (let r = rowStart - 1; r < row; r++) {
            const height = table.getRowHeight(r);
            y += height;
          }
        } else {
          // 估计位置
          y = table.getRowsHeight(table.frozenRowCount, cellGroup.row - 1);
          // console.log('估计位置', table.getRowsHeight(table.frozenRowCount, cellGroup.row));
        }
        if (isValid(y)) {
          cellGroup.setAttribute('y', y);
        }
      }
    }
  }

  // update y limit in proxy
  const totalActualBodyRowCount = Math.min(
    table.scenegraph.proxy.rowLimit,
    table.scenegraph.proxy.bodyBottomRow - table.scenegraph.proxy.bodyTopRow + 1
  );
  // 渐进加载总row数量
  const totalBodyHeight = table.getRowsHeight(table.frozenRowCount, table.frozenRowCount + totalActualBodyRowCount);
  const totalHeight = table.getRowsHeight(table.frozenRowCount, table.rowCount - 1);
  table.scenegraph.proxy.yLimitTop = totalBodyHeight / 2;
  table.scenegraph.proxy.yLimitBottom = totalHeight - totalBodyHeight / 2;

  // // check
  // const columnGroup = table.scenegraph.bodyGroup.firstChild;
  // let y;
  // columnGroup.forEachChildren(child => {
  //   if (!isValid(y)) {
  //     y = child.attribute.y + child.attribute.height;
  //   } else if (child.attribute.y !== y) {
  //     debugger;
  //   }
  //   y = child.attribute.y + child.attribute.height;
  // });
}
