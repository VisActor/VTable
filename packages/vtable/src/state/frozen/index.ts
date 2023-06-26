import type { BaseTableAPI } from '../../ts-types/base-table';

export function dealFreeze(col: number, row: number, table: BaseTableAPI) {
  // table.setFrozenColCount(col + 1);
  if (table.frozenColCount > 0) {
    if (col !== table.frozenColCount - 1) {
      table.setFrozenColCount(col + 1);
    } else {
      table.setFrozenColCount(0);
    }
  } else {
    table.setFrozenColCount(col + 1);
  }

  // table.stateManeger.frozen.col = table.frozenColCount - 1;
  // table.stateManeger.frozen.row = row;
  // if (table.stateManeger.checkFrozen()) {
  //   table.stateManeger.setFrozenCol(table.frozenColCount - 1);
  // } else {
  //   table.scenegraph.updateFrozenIcon(0, table.colCount - 1);
  // }
}
