import type { IEditor } from '@visactor/vtable-editors';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../ts-types/base-table';
import type { ListTableAPI, ListTableConstructorOptions } from '../ts-types';
import { getCellEventArgsSet } from '../event/util';

export class EditManeger {
  table: BaseTableAPI;
  editingEditor: IEditor;
  editCell: { col: number; row: number };
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.bindEvent();
  }
  bindEvent() {
    const handler = this.table.internalProps.handler;
    this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
      if (
        !(this.table.options as ListTableConstructorOptions).editCellTrigger || //默认为双击
        (this.table.options as ListTableConstructorOptions).editCellTrigger === 'doubleclick'
      ) {
        const { col, row } = e;

        //取双击自动列宽逻辑
        const eventArgsSet = getCellEventArgsSet(e.federatedEvent);
        const resizeCol = this.table.scenegraph.getResizeColAt(
          eventArgsSet.abstractPos.x,
          eventArgsSet.abstractPos.y,
          eventArgsSet.eventArgs?.targetCell
        );
        if (this.table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
          // 判断同双击自动列宽的时间监听的DBLCLICK_CELL
          // 如果是双击自动列宽 则编辑不开启
          return;
        }
        this.startEditCell(col, row);
      }
    });

    this.table.on(TABLE_EVENT_TYPE.CLICK_CELL, e => {
      if ((this.table.options as ListTableConstructorOptions).editCellTrigger === 'click') {
        const { col, row } = e;
        this.startEditCell(col, row);
      }
    });

    handler.on(this.table.getElement(), 'wheel', (e: WheelEvent) => {
      this.completeEdit();
    });
  }
  startEditCell(col: number, row: number) {
    //透视表的表头不允许编辑
    if (this.table.isPivotTable() && this.table.isHeader(col, row)) {
      return;
    }
    const editor = (this.table as ListTableAPI).getEditor(col, row);
    if (editor) {
      //自定义内容单元格不允许编辑
      if (this.table.getCustomRender(col, row) || this.table.getCustomLayout(col, row)) {
        console.warn("VTable Warn: cell has config custom render or layout, can't be edited");
        return;
      }
      if (!this.table.isHeader(col, row)) {
        const range = this.table.getCellRange(col, row);
        const isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
        if (isMerge) {
          console.warn("VTable Warn: this is merge cell, can't be edited");
          return;
        }
      }
      editor.bindSuccessCallback?.(() => {
        this.completeEdit();
      });
      this.editingEditor = editor;
      this.editCell = { col, row };
      const dataValue = this.table.getCellOriginValue(col, row);
      const rect = this.table.getCellRangeRelativeRect(this.table.getCellRange(col, row));
      editor.beginEditing(
        this.table.getElement(),
        { rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } },
        dataValue
      );
    }
  }
  /** 如果是事件触发调用该接口 请传入原始事件对象 将判断事件对象是否在编辑器本身上面  来处理是否结束编辑 */
  completeEdit(e?: any) {
    const target = e?.target;
    if (this.editingEditor && (!target || (target && !this.editingEditor.targetIsOnEditor(target as HTMLElement)))) {
      const changedValue = this.editingEditor.getValue();
      (this.table as ListTableAPI).changeCellValue(this.editCell.col, this.editCell.row, changedValue);
      this.editingEditor.exit();
      this.editingEditor = null;
    }
  }

  cancelEdit() {
    if (this.editingEditor) {
      this.editingEditor.exit();
      this.editingEditor = null;
    }
  }
}
