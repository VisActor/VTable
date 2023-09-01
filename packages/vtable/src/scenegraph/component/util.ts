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
