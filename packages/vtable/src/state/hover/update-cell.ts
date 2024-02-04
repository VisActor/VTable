import { isValid } from '@visactor/vutils';
import type { Scenegraph } from '../../scenegraph/scenegraph';

export function updateCell(scenegraph: Scenegraph, col: number, row: number) {
  const cellGroup = scenegraph.highPerformanceGetCell(col, row);
  if (
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    const colStart = Math.max(cellGroup.mergeStartCol, scenegraph.proxy.colStart);
    const colEnd = Math.min(cellGroup.mergeEndCol, scenegraph.proxy.colEnd);
    const rowStart = Math.max(cellGroup.mergeStartRow, scenegraph.proxy.rowStart);
    const rowEnd = Math.min(cellGroup.mergeEndRow, scenegraph.proxy.rowEnd);
    for (let col = colStart; col <= colEnd; col++) {
      for (let row = rowStart; row <= rowEnd; row++) {
        const mergeCell = scenegraph.highPerformanceGetCell(col, row);
        mergeCell.addUpdateBoundTag();
      }
    }
  } else {
    cellGroup.addUpdateBoundTag();
  }
}
