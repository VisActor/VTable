import type { BaseTableAPI } from '../../ts-types/base-table';

export function getColX(col: number, table: BaseTableAPI) {
  let colX = table.getColsWidth(0, col);
  if (col >= table.frozenColCount) {
    colX -= table.scrollLeft;
  }
  return colX;
}
