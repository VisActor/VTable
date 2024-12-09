import { isValid } from '@visactor/vutils';
import type { Scenegraph } from '../../scenegraph/scenegraph';
import { getCellMergeRange } from '../../tools/merge-range';

export function updateCell(scenegraph: Scenegraph, col: number, row: number) {
  const cellGroup = scenegraph.highPerformanceGetCell(col, row);
  if (
    cellGroup.role === 'cell' &&
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    const { colStart, colEnd, rowStart, rowEnd } = getCellMergeRange(cellGroup, scenegraph);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const mergeCell = scenegraph.highPerformanceGetCell(col, row);
        if (mergeCell.role !== 'cell') {
          continue;
        }
        mergeCell.addUpdateBoundTag();
      }
    }
  } else {
    cellGroup.addUpdateBoundTag();
  }
}
