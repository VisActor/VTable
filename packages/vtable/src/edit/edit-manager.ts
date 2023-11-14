import type { IEditor } from '@visactor/vtable-editors';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../ts-types/base-table';
import type { ListTableAPI } from '../ts-types';

export class EditManeger {
  table: BaseTableAPI;
  editingEditor: IEditor;
  editCell: { col: number; row: number };
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.bindEvent();
  }
  bindEvent() {
    this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
      console.log('editor-manager', 'DBLCLICK_CELL');
      const { col, row } = e;
      const rect = this.table.getCellRelativeRect(col, row);
      const editor = (this.table as ListTableAPI).getEditor(col, row);
      if (editor) {
        this.editingEditor = editor;
        this.editCell = { col, row };
        const dataValue = this.table.getCellOriginValue(col, row);

        editor.beginEditing(
          this.table.getElement(),
          { rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } },
          dataValue
        );
      }
    });
    document.body.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = e.target;
      if (this.editingEditor && !this.editingEditor.targetIsOnEditor(target as HTMLElement)) {
        this.completeEdit();
      }
    });
    this.table.on(TABLE_EVENT_TYPE.SCROLL, e => {
      this.completeEdit();
    });
    this.table.on(TABLE_EVENT_TYPE.KEYDOWN, e => {
      const { code } = e;
      if (this.editingEditor) {
        if (code === 'Escape') {
          this.editingEditor.exit();
          this.editingEditor = null;
        } else if (code === 'Enter') {
          this.completeEdit();
        }
      }
    });
  }
  completeEdit() {
    if (this.editingEditor) {
      const changedValue = this.editingEditor.getValue();
      (this.table as ListTableAPI).changeCellValue(this.editCell.col, this.editCell.row, changedValue);
      this.editingEditor.exit();
      this.editingEditor = null;
    }
  }
}
