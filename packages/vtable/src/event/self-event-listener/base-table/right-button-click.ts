import { TABLE_EVENT_TYPE } from '../../../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../../../ts-types/base-table';

export function rightButtonClickEvent(table: BaseTableAPI) {
  table.on(TABLE_EVENT_TYPE.CONTEXTMENU_CELL, e => {
    console.log(TABLE_EVENT_TYPE.CONTEXTMENU_CELL, e);
    const { col, row } = e;
    const ranges = table.getSelectedCellRanges();
    let cellInRange = false;
    if (ranges.length > 0) {
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const startCol = range.start.col;
        const endCol = range.end.col;
        const startRow = range.start.row;
        const endRow = range.end.row;
        if (
          (col >= startCol && col <= endCol && row >= startRow && row <= endRow) || // 左上向右下选择
          (col >= endCol && col <= startCol && row >= endRow && row <= startRow) || // 右下向左上选择
          (col >= startCol && col <= endCol && row >= endRow && row <= startRow) || // 左下向右上选择
          (col >= endCol && col <= startCol && row >= startRow && row <= endRow) // 右上向左下选择
        ) {
          cellInRange = true;
          break;
        }
      }
    }

    if (!cellInRange) {
      table.selectCell(col, row);
    }
  });
}
