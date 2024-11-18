import type { CellRange } from '../ts-types';

export function isSameRange(range1: CellRange | undefined | null, range2: CellRange | undefined | null) {
  if (!range1 && !range2) {
    return true;
  }

  if (!range1 || !range2) {
    return false;
  }

  return (
    range1.start.col === range2.start.col &&
    range1.start.row === range2.start.row &&
    range1.end.col === range2.end.col &&
    range1.end.row === range2.end.row
  );
}
