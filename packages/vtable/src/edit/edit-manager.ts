import type { IEditor, ValidateEnum } from '@visactor/vtable-editors';
import { TABLE_EVENT_TYPE } from '../core/TABLE_EVENT_TYPE';
import type { BaseTableAPI } from '../ts-types/base-table';
import type { ListTableAPI } from '../ts-types';
import { getCellEventArgsSet } from '../event/util';
import type { SimpleHeaderLayoutMap } from '../layout';
import { isPromise } from '../tools/helper';
import { isValid } from '@visactor/vutils';

export class EditManager {
  table: BaseTableAPI;
  editingEditor: IEditor;
  isValidatingValue: boolean = false;
  editCell: { col: number; row: number };
  listenersId: number[] = [];

  constructor(table: BaseTableAPI) {
    this.table = table;
    this.bindEvent();
  }

  bindEvent() {
    // const handler = this.table.internalProps.handler;
    const table = this.table as ListTableAPI;
    const doubleClickEventId = table.on(TABLE_EVENT_TYPE.DBLCLICK_CELL, e => {
      const { editCellTrigger = 'doubleclick' } = table.options;

      if (!editCellTrigger.includes('doubleclick')) {
        return;
      }

      const { col, row } = e;

      //取双击自动列宽逻辑
      const eventArgsSet = getCellEventArgsSet(e.federatedEvent);
      const resizeCol = table.scenegraph.getResizeColAt(
        eventArgsSet.abstractPos.x,
        eventArgsSet.abstractPos.y,
        eventArgsSet.eventArgs?.targetCell
      );
      if (table._canResizeColumn(resizeCol.col, resizeCol.row) && resizeCol.col >= 0) {
        // 判断同双击自动列宽的时间监听的DBLCLICK_CELL
        // 如果是双击自动列宽 则编辑不开启
        return;
      }
      this.startEditCell(col, row);
    });

    const clickEventId = table.on(TABLE_EVENT_TYPE.CLICK_CELL, e => {
      const { editCellTrigger = 'doubleclick' } = table.options;
      if (editCellTrigger === 'click' || (Array.isArray(editCellTrigger) && editCellTrigger.includes('click'))) {
        const { col, row } = e;
        this.startEditCell(col, row);
      }
    });

    this.listenersId.push(doubleClickEventId, clickEventId);

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
    if (this.editingEditor) {
      return;
    }
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

      this.table._makeVisibleCell(col, row);
      this.editingEditor = editor;
      const dataValue = isValid(value) ? value : this.table.getCellOriginValue(col, row);
      const rect = this.table.getCellRangeRelativeRect(this.table.getCellRange(col, row));
      const referencePosition = { rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } };

      // adjust last col&row, same as packages/vtable/src/scenegraph/graphic/contributions/group-contribution-render.ts getCellSizeForDraw
      if (col === this.table.colCount - 1) {
        referencePosition.rect.width = rect.width - 1;
      }
      if (row === this.table.rowCount - 1) {
        referencePosition.rect.height = rect.height - 1;
      }

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
        row,
        table: this.table
      });
    }
  }

  /** 如果是鼠标事件触发调用该接口 请传入原始事件对象 将判断事件对象是否在编辑器本身上面  来处理是否结束编辑
   * 返回值如果为false说明没有退出编辑状态  validateValue接口返回false 说明校验失败不退出编辑 */
  completeEdit(e?: Event): boolean | Promise<boolean> {
    if (!this.editingEditor) {
      return true;
    }
    if (this.isValidatingValue) {
      return false;
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
      this.isValidatingValue = true;
      const newValue = this.editingEditor.getValue();
      const oldValue = this.table.getCellOriginValue(this.editCell.col, this.editCell.row);

      const maybePromiseOrValue = this.editingEditor.validateValue?.(newValue, oldValue, this.editCell, this.table);

      if (isPromise(maybePromiseOrValue)) {
        this.isValidatingValue = true;
        return new Promise((resolve, reject) => {
          maybePromiseOrValue
            .then(result => {
              // if (result) {
              //   this.doExit();
              //   resolve(true);
              // } else {
              //   this.isValidatingValue = false;
              //   resolve(false);
              // }
              dealWithValidateValue(result, this, oldValue, resolve);
            })
            .catch((err: Error) => {
              this.isValidatingValue = false;
              console.error('VTable Error:', err);
              reject(err);
            });
        });
      }
      return dealWithValidateValue(maybePromiseOrValue, this, oldValue);
    }
    this.doExit();
    return true;
  }

  doExit() {
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
    this.isValidatingValue = false;
  }

  cancelEdit() {
    if (this.editingEditor) {
      // TODO: 添加开发时弃用警告
      this.editingEditor.exit?.();
      this.editingEditor.onEnd?.();
      this.editingEditor = null;
    }
  }

  release() {
    this.listenersId.forEach(id => {
      this.table.off(id);
    });
  }
}

function dealWithValidateValue(
  validateValue: boolean | ValidateEnum,
  editManager: EditManager,
  oldValue: any,
  resolve?: (value: boolean | PromiseLike<boolean>) => void
): boolean {
  editManager.isValidatingValue = false;
  if (validateValue === 'validate-exit') {
    editManager.doExit();
    resolve?.(true);
    return true;
  } else if (validateValue === 'invalidate-exit') {
    (editManager.editingEditor as any).setValue(oldValue);
    editManager.doExit();
    resolve?.(true);
    return true;
  } else if (validateValue === 'validate-not-exit') {
    resolve?.(false);
    return false;
  } else if (validateValue === 'invalidate-not-exit') {
    resolve?.(false);
    return false;
  } else if (validateValue === true) {
    editManager.doExit();
    resolve?.(true);
    return true;
  }
  resolve?.(false);
  return false;
}
