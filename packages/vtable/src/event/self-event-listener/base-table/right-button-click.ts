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
        if (col >= range.start.col && col <= range.end.col && row >= range.start.row && row <= range.end.row) {
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
