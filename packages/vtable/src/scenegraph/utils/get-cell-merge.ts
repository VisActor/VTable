import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * @description: 获取对应坐标单元格的单元格合并信息，没有单元格合并返回false，有合并返回合并信息
 * @param {BaseTableAPI} table
 * @param {number} col
 * @param {number} row
 * @return {false | CellRange}
 */
export function getCellMergeInfo(table: BaseTableAPI, col: number, row: number): false | CellRange {
  const range = table.getCellRange(col, row);
  const isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
  if (!isMerge) {
    return false;
  }
  return range;
}
