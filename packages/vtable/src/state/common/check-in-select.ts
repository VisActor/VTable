import { cellInRange, rangeIntersected } from '../../tools/helper';
import type { CellAddress, CellRange, HighlightScope } from '../../ts-types';

export function checkColInlineInSelect(col: number, cellRanges: CellRange[]): boolean {
  for (let i = 0; i < cellRanges.length; i++) {
    const currentRangeMinCol = Math.min(cellRanges[i].start.col, cellRanges[i].end.col);
    const currentRangeMaxCol = Math.max(cellRanges[i].start.col, cellRanges[i].end.col);
    if (col >= currentRangeMinCol && col <= currentRangeMaxCol) {
      // 不更新在select范围内的单元格
      return true;
    }
  }
  return false;
}

export function checkRowInlineInSelect(row: number, cellRanges: CellRange[]): boolean {
  for (let i = 0; i < cellRanges.length; i++) {
    const currentRangeMinRow = Math.min(cellRanges[i].start.row, cellRanges[i].end.row);
    const currentRangeMaxRow = Math.max(cellRanges[i].start.row, cellRanges[i].end.row);
    if (row >= currentRangeMinRow && row <= currentRangeMaxRow) {
      // 不更新在select范围内的单元格
      return true;
    }
  }
  return false;
}
/**
 * @description: 判断单元格是否在select区域中
 * @param {number} col
 * @param {number} row
 * @param {CellAddress} selectCellPosStart
 * @param {CellAddress} selectCellPosEnd
 * @param {HighlightScope} selectMode
 * @return {*}
 */
export function checkCellInSelect(
  col: number,
  row: number,
  // selectCellPosStart: CellAddress,
  // selectCellPosEnd: CellAddress,
  cellRanges: CellRange[]
  // selectMode: HighlightScope
): boolean {
  for (let i = 0; i < cellRanges.length; i++) {
    const range = cellRanges[i];
    const _in = cellInRange(range, col, row);
    if (_in) {
      return true;
    }
  }
  // if (selectMode === HighlightScope.single) {
  //   if (cellInRange(cellRange, col, row)) {
  //     return true;
  //   }
  // } else if (selectMode === HighlightScope.column) {
  //   if (col >= cellRange.start.col && col <= cellRange.end.col) {
  //     return true;
  //   }
  // } else if (selectMode === HighlightScope.row) {
  //   if (row >= cellRange.start.row && row <= cellRange.end.row) {
  //     return true;
  //   }
  // } else if (selectMode === HighlightScope.cross) {
  //   if (col >= cellRange.start.col && col <= cellRange.end.col) {
  //     return true;
  //   } else if (row >= cellRange.start.row && row <= cellRange.end.row) {
  //     return true;
  //   }
  // }

  return false;
}

/**
 * @description: 判断单元格范围是否与select区域有交集
 * @param {CellAddress} cellPosStart
 * @param {CellAddress} cellPosEnd
 * @param {CellAddress} selectCellPosStart
 * @param {CellAddress} selectCellPosEnd
 * @param {HighlightScope} selectMode
 * @return {*}
 */
export function checkMultiCellInSelect(
  cellPosStart: CellAddress,
  cellPosEnd: CellAddress,
  // selectCellPosStart: CellAddress,
  // selectCellPosEnd: CellAddress,
  selectRangs: CellRange[],
  selectMode: HighlightScope
): boolean {
  for (let i = 0; i < selectRangs.length; i++) {
    const range = selectRangs[i];
    const inSelect = rangeIntersected(range, { start: cellPosStart, end: cellPosEnd });
    if (inSelect) {
      return true;
    }
  }

  // for (let col = cellPosStart.col; col <= cellPosEnd.col; col++) {
  //   for (let row = cellPosStart.row; row <= cellPosEnd.row; row++) {
  //     const inSelect = checkCellInSelect(
  //       col,
  //       row,
  //       selectCellPosStart,
  //       selectCellPosEnd,
  //       selectMode
  //     );
  //     if (inSelect) {
  //       return true;
  //     }
  //   }
  // }

  return false;
}

export function checkRowInSelect(
  row: number,
  // selectCellPosStart: CellAddress,
  // selectCellPosEnd: CellAddress,
  cellRanges: CellRange[]
  // selectMode: HighlightScope
): boolean {
  for (let i = 0; i < cellRanges.length; i++) {
    const range = cellRanges[i];
    const minRow = Math.min(range.start.row, range.end.row);
    const maxRow = Math.max(range.start.row, range.end.row);
    const _in = row >= minRow && row <= maxRow;
    if (_in) {
      return true;
    }
  }
  return false;
}

export function checkColInSelect(
  col: number,
  // selectCellPosStart: CellAddress,
  // selectCellPosEnd: CellAddress,
  cellRanges: CellRange[]
  // selectMode: HighlightScope
): boolean {
  for (let i = 0; i < cellRanges.length; i++) {
    const range = cellRanges[i];
    const minCol = Math.min(range.start.col, range.end.col);
    const maxCol = Math.max(range.start.col, range.end.col);
    const _in = col >= minCol && col <= maxCol;
    if (_in) {
      return true;
    }
  }
  return false;
}
