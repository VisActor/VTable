import type { Scenegraph } from '../../scenegraph/scenegraph';

export function updateCell(scenegraph: Scenegraph, col: number, row: number) {
  const cellGroup = scenegraph.getCell(col, row);
  if (cellGroup.role === 'shadow-cell') {
    const mergeCell = scenegraph.getCell(cellGroup.mergeCol, cellGroup.mergeRow);
    mergeCell.addUpdateBoundTag();
  } else {
    cellGroup.addUpdateBoundTag();
  }
}
