import type { Scenegraph } from '../../scenegraph/scenegraph';
import type { CellRange, HighlightScope } from '../../ts-types';
import { updateCell } from './update-cell';

export function clearRowHover(
  scenegraph: Scenegraph,
  colOrigin: number,
  row: number,
  // selectCellPosStart: CellPosition,
  // selectCellPosEnd: CellPosition,
  selectRanges: CellRange[],
  selectMode: HighlightScope
): boolean {
  const table = scenegraph.table;
  // 更新表头（无group theme）
  for (let col = 0; col < table.colCount; col++) {
    updateCell(scenegraph, col, row);
  }
  return true;
}

export function updateRowHover(
  scenegraph: Scenegraph,
  colOrigin: number,
  row: number,
  // selectCellPosStart: CellPosition,
  // selectCellPosEnd: CellPosition,
  selectRanges: CellRange[],
  selectMode: HighlightScope,
  singleStyle: boolean
): boolean {
  const table = scenegraph.table;
  // 更新表头（无group theme）
  for (let col = 0; col < table.colCount; col++) {
    updateCell(scenegraph, col, row);
  }
  return true;
}
