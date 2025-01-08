import type { CellAddress } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

/*
 * fix update row range logic:
 *
 * ADD:
 * 1. proxy not full => add
 * 2. proxy full
 *   2.1 row outside of proxy row range => skip
 *   2.2 row inside of proxy row range => update row to proxy rowEnd
 * REM:
 * 1. row before rowStart or after rowEnd => skip
 * 2. row after rowStart and before new rowEnd => update row to rowEnd
 * 3. rows after new rowEnd before old rowEnd => delete
 */

export function fixUpdateRowRange(
  diffPositions: {
    addCellPositions: CellAddress[];
    removeCellPositions: CellAddress[];
  },
  // updateCells: CellAddress[], // default [{col,row}]
  col: number,
  row: number,
  table: BaseTableAPI
) {
  const updateCells = [{ col, row }];
  const addCells = [];
  const removeCells = [];

  const { addCellPositions, removeCellPositions } = diffPositions;
  const proxy = table.scenegraph.proxy;
  const { rowStart, rowLimit } = proxy;
  let { rowEnd } = proxy;
  let updateRow = Infinity;

  for (let i = 0; i < addCellPositions.length; i++) {
    const { row: cellRow } = addCellPositions[i];

    if (rowEnd - rowStart + 1 === rowLimit) {
      // current row cell is full
      if (cellRow >= rowStart && cellRow <= rowEnd) {
        updateRow = Math.min(updateRow, cellRow);
      }
    } else {
      // row cell is not full
      addCells.push({
        col,
        row: cellRow
      });
      rowEnd++;
    }
  }

  const newRowEnd = Math.min(rowStart + rowLimit, table.rowCount - 1 - table.bottomFrozenRowCount);
  const notFullRow = newRowEnd < rowStart + rowLimit;
  for (let i = 0; i < removeCellPositions.length; i++) {
    const { row: cellRow } = removeCellPositions[removeCellPositions.length - i - 1];
    if (cellRow < rowStart || cellRow > rowEnd) {
      // row before rowStart or after rowEnd => skip
      continue;
    } else if (cellRow > newRowEnd) {
      // rows after new rowEnd before old rowEnd => delete
      removeCells.push({
        col,
        row: cellRow
      });
      updateRow--;
    } else if (notFullRow) {
      // row range is not full
      removeCells.push({
        col,
        row: cellRow
      });
      updateRow--;
    } else {
      // row after rowStart and before new rowEnd => update row to rowEnd
      updateRow = Math.min(updateRow, cellRow);
    }
  }

  if (updateRow !== Infinity) {
    for (let i = updateRow; i <= rowEnd; i++) {
      updateCells.push({
        col,
        row: i
      });
    }
  }

  table.scenegraph.proxy.refreshRowCount();
  return {
    updateCells,
    addCells,
    removeCells
  };
}
