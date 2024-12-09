import type { Group } from '../scenegraph/graphic/group';
import type { Scenegraph } from '../scenegraph/scenegraph';
import type { CellRange } from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

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
  // const { colStart, colEnd, rowStart, rowEnd, bodyLeftCol, bodyRightCol, bodyTopRow, bodyBottomRow } = scene.proxy;

  const cellRangeColStart = mergeStartCol;
  const cellRangeColEnd = mergeEndCol;
  const cellRangeRowStart = mergeStartRow;
  const cellRangeRowEnd = mergeEndRow;

  // if (col >= bodyLeftCol && col <= bodyRightCol) {
  //   cellRangeColStart = Math.max(cellGroup.mergeStartCol, colStart);
  //   cellRangeColEnd = Math.min(cellGroup.mergeEndCol, colEnd);
  // }

  // if (row >= bodyTopRow && row <= bodyBottomRow) {
  //   cellRangeRowStart = Math.max(cellGroup.mergeStartRow, rowStart);
  //   cellRangeRowEnd = Math.min(cellGroup.mergeEndRow, rowEnd);
  // }

  return {
    colStart: cellRangeColStart,
    colEnd: cellRangeColEnd,
    rowStart: cellRangeRowStart,
    rowEnd: cellRangeRowEnd
  };
}

export function expendCellRange(cellRange: CellRange, table: BaseTableAPI): CellRange {
  const colStart = cellRange.start.col;
  const colEnd = cellRange.end.col;
  const rowStart = cellRange.start.row;
  const rowEnd = cellRange.end.row;

  let newColStart = colStart;
  let newColEnd = colEnd;
  let newRowStart = rowStart;
  let newRowEnd = rowEnd;
  for (let col = colStart; col <= colEnd; col++) {
    for (let row = rowStart; row <= rowEnd; row++) {
      const mergeRange = table.getCellRange(col, row);
      if (mergeRange) {
        newColStart = Math.min(newColStart, mergeRange.start.col);
        newColEnd = Math.max(newColEnd, mergeRange.end.col);
        newRowStart = Math.min(newRowStart, mergeRange.start.row);
        newRowEnd = Math.max(newRowEnd, mergeRange.end.row);
      }
    }
  }

  cellRange.start.col = newColStart;
  cellRange.end.col = newColEnd;
  cellRange.start.row = newRowStart;
  cellRange.end.row = newRowEnd;

  return cellRange;
}
