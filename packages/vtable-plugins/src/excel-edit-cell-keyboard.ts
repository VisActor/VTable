import * as VTable from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import type { EventArg } from './types';
//备用 插件配置项 目前感觉都走默认逻辑就行
export type IExcelEditCellKeyboardPluginOptions = {
  id?: string;
  // 是否响应删除
  // enableDeleteKey?: boolean;
};

export class ExcelEditCellKeyboardPlugin implements VTable.plugins.IVTablePlugin {
  id = `excel-edit-cell-keyboard`;
  name = 'Excel Edit Cell Keyboard';
  runTime = [VTable.TABLE_EVENT_TYPE.INITIALIZED];
  table: VTable.ListTable;
  pluginOptions: IExcelEditCellKeyboardPluginOptions;
  constructor(pluginOptions?: IExcelEditCellKeyboardPluginOptions) {
    this.id = pluginOptions?.id ?? this.id;
    this.pluginOptions = pluginOptions;

    this.bindEvent();
  }
  run(...args: [EventArg, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], VTable.BaseTableAPI]) {
    const table: VTable.BaseTableAPI = args[2];
    this.table = table as VTable.ListTable;
  }

  bindEvent() {
    //监听document全局的keydown事件 捕获阶段监听 可以及时阻止事件传播和默认行为
    document.addEventListener('keydown', this.handleKeyDown.bind(this), true);
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
  handleKeyDown(event: KeyboardEvent) {
    if (this.table.editorManager) {
      //判断是键盘触发编辑单元格的情况下，那么在编辑状态中切换方向需要选中下一个继续编辑
      if (this.table.editorManager.beginTriggerEditCellMode === 'keydown') {
        if (this.table.editorManager.editingEditor && this.isExcelShortcutKey(event)) {
          const { col, row } = this.table.editorManager.editCell;
          this.table.editorManager.completeEdit();
          this.table.getElement().focus();
          if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
            //有这些配合键，则不进行选中下一个单元格的行为 执行vtable内部逻辑
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
      } else {
        const { col, row } = this.table.stateManager.select.cellPos;
        if (this.table.editorManager.editingEditor && (event.key === 'Enter' || event.key === 'Tab')) {
          this.table.editorManager.completeEdit();
          this.table.getElement().focus();
          if (event.key === 'Enter') {
            this.table.selectCell(col, row + 1);
          } else if (event.key === 'Tab') {
            this.table.selectCell(col + 1, row);
          }
          // 阻止事件传播和默认行为
          event.stopPropagation();
          event.preventDefault();
        } else if (!this.table.editorManager.editingEditor && (event.key === 'Delete' || event.key === 'Backspace')) {
          //响应删除键，删除
          const selectCells = this.table.getSelectedCellInfos();
          if (selectCells?.length > 0) {
            // 如果选中的是范围，则删除范围内的所有单元格
            deleteSelectRange(selectCells, this.table);
          }
          // 阻止事件传播和默认行为
          event.stopPropagation();
          event.preventDefault();
        }
      }
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
  release() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }
}
//将选中单元格的值设置为空
function deleteSelectRange(selectCells: VTable.TYPES.CellInfo[][], tableInstance: VTable.ListTable) {
  for (let i = 0; i < selectCells.length; i++) {
    for (let j = 0; j < selectCells[i].length; j++) {
      tableInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '');
    }
  }
}
