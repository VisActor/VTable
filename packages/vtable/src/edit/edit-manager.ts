import type { IEditor } from '@visactor/vtable-editors';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../ts-types/base-table';
import type { ListTableAPI, ListTableConstructorOptions } from '../ts-types';
import { getCellEventArgsSet } from '../event/util';
import type { SimpleHeaderLayoutMap } from '../layout';
import { isPromise } from '../tools/helper';
import { isValid } from '@visactor/vutils';

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
    const editCellTrigger = (this.table.options as ListTableConstructorOptions).editCellTrigger;
    this.table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
      if (
        !editCellTrigger || //默认为双击
        editCellTrigger === 'doubleclick' ||
        (Array.isArray(editCellTrigger) && editCellTrigger.includes('doubleclick'))
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
      if (editCellTrigger === 'click' || (Array.isArray(editCellTrigger) && editCellTrigger.includes('click'))) {
        const { col, row } = e;
        this.startEditCell(col, row);
      }
    });

    // handler.on(this.table.getElement(), 'wheel', (e: WheelEvent) => {
    //   this.completeEdit();
    // });
    // handler.on(this.table.getElement(), 'resize', (e: Event) => {
    //   if (this.table.autoFillWidth || this.table.autoFillHeight) {
    //     this.completeEdit();
    //   }
    // });
  }

  startEditCell(col: number, row: number, value?: string | number) {
    const editor = (this.table as ListTableAPI).getEditor(col, row);
    if (editor) {
      // //自定义内容单元格不允许编辑
      // if (this.table.getCustomRender(col, row) || this.table.getCustomLayout(col, row)) {
      //   console.warn("VTable Warn: cell has config custom render or layout, can't be edited");
      //   return;
      // }
      // if (!this.table.isHeader(col, row)) {
      //   const range = this.table.getCellRange(col, row);
      //   const isMerge = range.start.col !== range.end.col || range.start.row !== range.end.row;
      //   if (isMerge) {
      //     console.warn("VTable Warn: this is merge cell, can't be edited");
      //     return;
      //   }
      // }
      if ((this.table.internalProps.layoutMap as SimpleHeaderLayoutMap)?.isAggregation?.(col, row)) {
        console.warn("VTable Warn: this is aggregation value, can't be edited");
        return;
      }

      if (!this.editingEditor) {
        this.editCell = { col, row };
      }
      this.editingEditor = editor;
      const dataValue = isValid(value) ? value : this.table.getCellOriginValue(col, row);
      const rect = this.table.getCellRangeRelativeRect(this.table.getCellRange(col, row));
      const referencePosition = { rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };

      editor.beginEditing && console.warn('VTable Warn: `beginEditing` is deprecated, please use `onStart` instead.');
      editor.beginEditing?.(this.table.getElement(), referencePosition, dataValue);

      if (editor.bindSuccessCallback) {
        console.warn('VTable Warn: `bindSuccessCallback` is deprecated, please use `onStart` instead.');
      }
      editor.bindSuccessCallback?.(() => {
        this.completeEdit();
      });
      editor.onStart?.({
        value: dataValue,
        endEdit: () => {
          this.completeEdit();
        },
        referencePosition,
        container: this.table.getElement(),
        col,
        row
      });
    }
  }

  /** 如果是鼠标事件触发调用该接口 请传入原始事件对象 将判断事件对象是否在编辑器本身上面  来处理是否结束编辑
   * 返回值如果为false说明没有退出编辑状态  validateValue接口返回false 说明校验失败不退出编辑 */
  completeEdit(e?: Event): boolean | Promise<boolean> {
    if (!this.editingEditor) {
      return true;
    }

    const target = e?.target as HTMLElement | undefined;
    const { editingEditor: editor } = this;

    if (target) {
      if (editor.targetIsOnEditor) {
        console.warn('VTable Warn: `targetIsOnEditor` is deprecated, please use `isEditorElement` instead.');

        if (editor.targetIsOnEditor(target)) {
          return false;
        }
      } else if (!editor.isEditorElement || editor.isEditorElement(target)) {
        return false;
      }
    }

    if (!this.editingEditor.getValue) {
      console.warn('VTable Warn: `getValue` is not provided, did you forget to implement it?');
    }
    if (this.editingEditor.validateValue) {
      const maybePromiseOrValue = this.editingEditor.validateValue?.();
      if (isPromise(maybePromiseOrValue)) {
        return new Promise((resolve, reject) => {
          maybePromiseOrValue
            .then(result => {
              if (result) {
                this.doExit();
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((err: Error) => {
              console.error('VTable Error:', err);
              reject(err);
            });
        });
      } else if (maybePromiseOrValue) {
        this.doExit();
        return true;
      }
      return false;
    }
    this.doExit();
    return true;
  }

  private doExit() {
    const changedValue = this.editingEditor.getValue?.();
    const range = this.table.getCellRange(this.editCell.col, this.editCell.row);
    const changedValues: any[] = [];
    for (let row = range.start.row; row <= range.end.row; row++) {
      const rowChangedValues = [];
      for (let col = range.start.col; col <= range.end.col; col++) {
        rowChangedValues.push(changedValue);
      }
      changedValues.push(rowChangedValues);
    }
    (this.table as ListTableAPI).changeCellValues(range.start.col, range.start.row, changedValues);
    this.editingEditor.exit && console.warn('VTable Warn: `exit` is deprecated, please use `onEnd` instead.');
    this.editingEditor.exit?.();
    this.editingEditor.onEnd?.();
    this.editingEditor = null;
  }

  cancelEdit() {
    if (this.editingEditor) {
      // TODO: 添加开发时弃用警告
      this.editingEditor.exit?.();
      this.editingEditor.onEnd?.();
      this.editingEditor = null;
    }
  }
}
