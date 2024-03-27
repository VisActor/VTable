import type { Group } from '../scenegraph/graphic/group';
import type { Scenegraph } from '../scenegraph/scenegraph';

export function getCellMergeRange(cellGroup: Group, scene: Scenegraph) {
  if (!scene || !scene.proxy) {
    return {
      colStart: 0,
      colEnd: 0,
      rowStart: 0,
      rowEnd: 0
    };
  }
  const { mergeStartCol, mergeEndCol, mergeStartRow, mergeEndRow, col, row } = cellGroup;
  const { colStart, colEnd, rowStart, rowEnd, bodyLeftCol, bodyRightCol, bodyTopRow, bodyBottomRow } = scene.proxy;

  let cellRangeColStart = mergeStartCol;
  let cellRangeColEnd = mergeEndCol;
  let cellRangeRowStart = mergeStartRow;
  let cellRangeRowEnd = mergeEndRow;

  if (col >= bodyLeftCol && col <= bodyRightCol) {
    cellRangeColStart = Math.max(cellGroup.mergeStartCol, colStart);
    cellRangeColEnd = Math.min(cellGroup.mergeEndCol, colEnd);
  }

  if (row >= bodyTopRow && row <= bodyBottomRow) {
    cellRangeRowStart = Math.max(cellGroup.mergeStartRow, rowStart);
    cellRangeRowEnd = Math.min(cellGroup.mergeEndRow, rowEnd);
  }

  return {
    colStart: cellRangeColStart,
    colEnd: cellRangeColEnd,
    rowStart: cellRangeRowStart,
    rowEnd: cellRangeRowEnd
  };
}
