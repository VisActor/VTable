import type { Scenegraph } from '../../scenegraph/scenegraph';
import type { CellRange, HighlightScope } from '../../ts-types';
import { updateCell } from './update-cell';

export function clearColHover(
  scenegraph: Scenegraph,
  col: number,
  rowOrigin: number,
  // selectCellPosStart: CellPosition,
  // selectCellPosEnd: CellPosition,
  selectRanges: CellRange[],
  selectMode: HighlightScope
): boolean {
  const table = scenegraph.table;
  // 更新表头（无group theme）
  for (let row = 0; row < table.columnHeaderLevelCount; row++) {
    updateCell(scenegraph, col, row);
  }
  // 更新body
  const cellGroup = scenegraph.getColGroup(col);
  cellGroup?.addUpdateBoundTag();

  return true;
}

export function updateColHover(
  scenegraph: Scenegraph,
  col: number,
  rowOrigin: number,
  // selectCellPosStart: CellPosition,
  // selectCellPosEnd: CellPosition,
  selectRanges: CellRange[],
  selectMode: HighlightScope,
  singleStyle: boolean
): boolean {
  const table = scenegraph.table;
  // 更新表头（无group theme）
  for (let row = 0; row < table.columnHeaderLevelCount; row++) {
    updateCell(scenegraph, col, row);
  }
  // 更新body
  const cellGroup = scenegraph.getColGroup(col);
  cellGroup?.addUpdateBoundTag();

  return true;
}
