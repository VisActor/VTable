import type { BaseTableAPI } from '../../ts-types/base-table';

export function getColX(col: number, table: BaseTableAPI, isRightFrozen?: boolean) {
  if (isRightFrozen) {
    return table.tableNoFrameWidth - table.getColsWidth(col, table.colCount - 1);
  }
  let colX = table.getColsWidth(0, col);
  if (col >= table.frozenColCount) {
    colX -= table.scrollLeft;
  }
  return colX;
}

export function getRowY(row: number, table: BaseTableAPI, isBottomFrozen?: boolean) {
  if (isBottomFrozen) {
    return table.tableNoFrameWidth - table.getRowsHeight(row, table.rowCount - 1);
  }
  let rowY = table.getRowsHeight(0, row);
  if (row >= table.frozenRowCount) {
    rowY -= table.scrollLeft;
  }
  return rowY;
}
