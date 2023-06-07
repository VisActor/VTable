import type { CellRange, TextColumnDefine } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * @description: 获取对应坐标单元格的单元格合并信息，没有单元格合并返回false，有合并返回合并信息
 * @param {BaseTableAPI} table
 * @param {number} col
 * @param {number} row
 * @return {false | CellRange}
 */
export function getCellMergeInfo(table: BaseTableAPI, col: number, row: number): false | CellRange {
  // 先判断非表头且非cellMerge配置，返回false
  if (!table.isHeader(col, row) && (table.getBodyColumnDefine(col, row) as TextColumnDefine).mergeCell !== true) {
    return false;
  }
  const range = table.getCellRange(col, row);
  const isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
  if (!isMerge) {
    return false;
  }
  return range;
}
