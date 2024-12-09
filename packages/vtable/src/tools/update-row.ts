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
 * 2. no row after rowEnd => skip
 * 3. rows after rowEnd => update row to proxy rowEnd
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
  const { rowStart, rowLimit, bodyBottomRow } = proxy;
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

  for (let i = 0; i < removeCellPositions.length; i++) {
    const { row: cellRow } = removeCellPositions[i];
    if (cellRow < rowStart || cellRow > rowEnd) {
      continue;
    } else if (rowEnd === bodyBottomRow) {
      removeCells.push({
        col,
        row: cellRow
      });
    } else {
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
