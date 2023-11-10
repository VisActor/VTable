import { isValid } from '@visactor/vutils';
import type { Scenegraph } from '../../scenegraph/scenegraph';

export function updateCell(scenegraph: Scenegraph, col: number, row: number) {
  const cellGroup = scenegraph.getCell(col, row);
  if (
    isValid(cellGroup.mergeStartCol) &&
    isValid(cellGroup.mergeStartRow) &&
    isValid(cellGroup.mergeEndCol) &&
    isValid(cellGroup.mergeEndRow)
  ) {
    for (let col = cellGroup.mergeStartCol; col <= cellGroup.mergeEndCol; col++) {
      for (let row = cellGroup.mergeStartRow; row <= cellGroup.mergeEndRow; row++) {
        const mergeCell = scenegraph.getCell(col, row);
        mergeCell.addUpdateBoundTag();
      }
    }
  } else {
    cellGroup.addUpdateBoundTag();
  }
}
