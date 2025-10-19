import type { CellRange } from './type';

/**
 * @description: comvert cell range to code
 * @param {CellRange} cellRange
 * @return {*}
 */
export function encodeCellRange(cellRange: CellRange) {
  const start = encodeCellAddress(cellRange.start.col, cellRange.start.row);
  const end = encodeCellAddress(cellRange.end.col, cellRange.end.row);
  return `${start}:${end}`;
}

/**
 * @description: convert cell address to code
 * @param {number} col
 * @param {number} row
 * @return {*}
 */
export function encodeCellAddress(col: number, row: number) {
  let s = '';
  for (let column = col + 1; column > 0; column = Math.floor((column - 1) / 26)) {
    s = String.fromCharCode(((column - 1) % 26) + 65) + s;
  }
  return s + (row + 1);
}
