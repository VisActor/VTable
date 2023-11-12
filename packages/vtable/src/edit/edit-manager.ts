import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../ts-types/base-table';

export class EditManeger {
  table: BaseTableAPI;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.bindEvent();
  }
  bindEvent() {
    this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
      const { col, row } = e;
      const rect = this.table.getCellRelativeRect(col, row);
      const editor = this.table.getEditor(col, row);
      if (editor) {
        const dataValue = this.table.getCellOriginValue(col, row);

        editor.beginEditing(
          this.table.getElement(),
          { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          dataValue
        );
      }
    });
  }
}
