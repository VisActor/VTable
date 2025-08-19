import type { CellRange } from '@visactor/vtable/es/ts-types/table-engine';

import type { ListTable } from '@visactor/vtable';
import { Direction, IDiscreteRange } from './types';
export interface ISelectedRangeArray {
  cols: number[];
  rows: number[];
}

export function getSelectedRangeArray(selectedRange: CellRange): ISelectedRangeArray {
  const minCol = Math.min(selectedRange.start.col, selectedRange.end.col);
  const minRow = Math.min(selectedRange.start.row, selectedRange.end.row);
  const maxCol = Math.max(selectedRange.start.col, selectedRange.end.col);
  const maxRow = Math.max(selectedRange.start.row, selectedRange.end.row);
  const cols = [];
  const rows = [];
  for (let i = minCol; i <= maxCol; i++) {
    cols.push(i);
  }
  for (let i = minRow; i <= maxRow; i++) {
    rows.push(i);
  }
  return { cols, rows };
}

/**
 * 获取目标范围，根据源范围和选中的范围计算目标范围
 * @param direction - 方向
 * @param sourceRange - 源范围
 * @param selectedRange - 选中的范围
 * @returns 目标范围
 */
export function getTargetRange(direction: Direction, sourceRange: IDiscreteRange, selectedRange: ISelectedRangeArray) {
  if (direction === Direction.DOWN || direction === Direction.UP) {
    return {
      cols: selectedRange.cols,
      rows: selectedRange.rows.filter(row => !sourceRange.rows.includes(row))
    };
  } else {
    return {
      cols: selectedRange.cols.filter(col => !sourceRange.cols.includes(col)),
      rows: selectedRange.rows
    };
  }
}

/**
 * 打开自动填充菜单
 * @param tableInstance - 表格实例
 * @param endCol - 结束列
 * @param endRow - 结束行
 */
export function openAutoFillMenu(tableInstance: ListTable, endCol: number, endRow: number) {
  const rect = tableInstance.scenegraph.highPerformanceGetCell(endCol, endRow).globalAABBBounds;
  tableInstance.showDropDownMenu(endCol, endRow, {
    content: [
      {
        type: 'item',
        text: '复制填充'
      },
      {
        type: 'item',
        text: '序列填充'
      }
    ],
    referencePosition: {
      // @ts-ignore
      rect: {
        right: rect.x2 + 88,
        bottom: rect.y2
      }
    }
  });
}
