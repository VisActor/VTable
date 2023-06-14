import type { Scenegraph } from '../../scenegraph/scenegraph';
import type { CellRange, HighlightScope } from '../../ts-types';
import { CellPosition } from '../../ts-types';
import { checkCellInSelect, checkColInlineInSelect, checkRowInlineInSelect } from '../common/check-in-select';
import { updateCell } from './update-cell';

export function clearSingleHover(
  scenegraph: Scenegraph,
  col: number,
  row: number,
  // selectCellPosStart: CellPosition,
  // selectCellPosEnd: CellPosition,
  selectRanges: CellRange[],
  selectMode: HighlightScope
): boolean {
  updateCell(scenegraph, col, row);
  return true;
}

export function updateSingleHover(
  scenegraph: Scenegraph,
  col: number,
  row: number,
  // selectCellPosStart: CellPosition,
  // selectCellPosEnd: CellPosition,
  selectRanges: CellRange[],
  selectMode: HighlightScope
): boolean {
  updateCell(scenegraph, col, row);
  return true;
}
