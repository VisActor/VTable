import type { CellRange } from '@visactor/vtable/es/ts-types';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';
import * as VTable from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import type { EventArg } from './types';

interface IExcelEditCellKeyboardPluginOptions {
  replaceMode?: boolean;
}

export class ExcelEditCellKeyboardPlugin implements VTable.plugins.IVTablePlugin {
  id = 'excel-edit-cell-keyboard';
  name = 'Excel Edit Cell Keyboard';
  type: 'layout' = 'layout';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED, VTable.TABLE_EVENT_TYPE.KEYDOWN];
  table: VTable.ListTable;
  pluginOptions: IExcelEditCellKeyboardPluginOptions;
  constructor(pluginOptions: IExcelEditCellKeyboardPluginOptions) {
    this.pluginOptions = pluginOptions;

    this.bindEvent();
  }
  run(...args: [EventArg, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], VTable.BaseTableAPI]) {
    const eventArgs = args[0];
    const runTime = args[1];
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
    if (runTime === VTable.TABLE_EVENT_TYPE.KEYDOWN) {
      this.handleWithKeyDown(eventArgs);
    } else if (runTime === VTable.TABLE_EVENT_TYPE.INITIALIZED) {
      //
    }
  }

  handleWithKeyDown(eventArgs: EventArg) {
    const select = this.table.stateManager.select;
    const cellPos = select.cellPos;
    const event = eventArgs.event as KeyboardEvent;
    //判断event的keycode如果不是excel的快捷键，如left enter tab 而是数字字母符号等 则调用table的startEditCell方法 进入编辑 且替换单元格已有内容
    if (!this.isExcelShortcutKey(event)) {
      // this.table.startEditCell(cellPos.col, cellPos.row, '');
    } else if (event.key === 'Enter') {
      this.table.startEditCell(cellPos.col, cellPos.row, '');
    }
  }
  // 判断event的keyCode是否是excel的快捷键
  isExcelShortcutKey(event: KeyboardEvent) {
    return (
      event.key === 'Enter' ||
      event.key === 'Tab' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp'
    );
  }
  bindEvent() {
    //监听document全局的keydown事件 捕获阶段
    document.addEventListener(
      'keydown',
      event => {
        if (this.table.editorManager.beginTriggerEditCellMode === 'keydown') {
          if (this.table.editorManager.editingEditor && this.isExcelShortcutKey(event)) {
            const { col, row } = this.table.editorManager.editCell;
            this.table.editorManager.completeEdit();
            if (event.key === 'Enter') {
              this.table.selectCell(col, row + 1);
            } else if (event.key === 'Tab') {
              this.table.selectCell(col + 1, row);
            } else if (event.key === 'ArrowLeft') {
              this.table.selectCell(col - 1, row);
            } else if (event.key === 'ArrowRight') {
              this.table.selectCell(col + 1, row);
            } else if (event.key === 'ArrowDown') {
              this.table.selectCell(col, row + 1);
            } else if (event.key === 'ArrowUp') {
              this.table.selectCell(col, row - 1);
            }
            // 阻止事件传播和默认行为
            event.stopPropagation();
            event.preventDefault();
          }
        }
      },
      true
    );
    //   this.table.on('selected_cell', () => {
    //     this.updateHighlight();
    //   });

    //   this.table.on('selected_clear', () => {
    //     this.clearHighlight();
    //   });

    //   this.table.on('mousemove_table', () => {
    //     if (this.table.stateManager.select.selecting) {
    //       this.updateHighlight();
    //     }
    //   });
  }

  release() {
    //
  }
}
