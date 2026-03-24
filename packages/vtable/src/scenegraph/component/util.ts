import type { BaseTableAPI } from '../../ts-types/base-table';

export function getColX(col: number, table: BaseTableAPI, isRightFrozen?: boolean) {
  if (isRightFrozen) {
    // 右冻结列的 x 位置以“表格最右侧”为基准向左累加。
    // 当开启右冻结区域内部滚动时，需要叠加右冻结的 scrollLeft，使得列在右冻结视口内可左右移动。
    return (
      Math.min(table.tableNoFrameWidth, table.getAllColsWidth()) -
      table.getColsWidth(col, table.colCount - 1) +
      (table.getRightFrozenColsScrollLeft?.() ?? 0)
    );
  }
  const frozenOffset = table.getFrozenColsOffset?.() ?? 0;
  const frozenScrollLeft = table.getFrozenColsScrollLeft?.() ?? 0;
  let colX = table.getColsWidth(0, col);
  if (col >= table.frozenColCount) {
    colX -= table.scrollLeft + frozenOffset;
  } else {
    colX -= frozenScrollLeft;
  }
  return colX;
}

export function getRowY(row: number, table: BaseTableAPI, isBottomFrozen?: boolean) {
  if (isBottomFrozen) {
    return Math.min(table.tableNoFrameWidth, table.getAllRowsHeight()) - table.getRowsHeight(row, table.rowCount - 1);
  }
  let rowY = table.getRowsHeight(0, row);
  if (row >= table.frozenRowCount) {
    rowY -= table.scrollTop;
  }
  return rowY;
}
