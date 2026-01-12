import type { ListTable, BaseTableAPI, TYPES, pluginsDefinition } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import type { EventArg } from './types';
import type { IEditor } from '@visactor/vtable-editors';
export enum ExcelEditCellKeyboardResponse {
  ENTER = 'enter',
  TAB = 'tab',
  ARROW_LEFT = 'arrowLeft',
  ARROW_RIGHT = 'arrowRight',
  ARROW_DOWN = 'arrowDown',
  ARROW_UP = 'arrowUp',
  DELETE = 'delete',
  BACKSPACE = 'backspace'
}
//备用 插件配置项 目前感觉都走默认逻辑就行
export type IExcelEditCellKeyboardPluginOptions = {
  id?: string;
  /** 该插件响应的键盘事件列表 */
  responseKeyboard?: ExcelEditCellKeyboardResponse[];
  /** 删除能力是否只应用到可编辑单元格 */
  deleteWorkOnEditableCell?: boolean;
  /** 删除范围时聚合成一次 change_cell_values 事件 */
  aggregateDeleteToOneChangeCellValuesEvent?: boolean;
  // keyDown_before?: (event: KeyboardEvent) => void;
  // keyDown_after?: (event: KeyboardEvent) => void;
};

export class ExcelEditCellKeyboardPlugin implements pluginsDefinition.IVTablePlugin {
  id = `excel-edit-cell-keyboard`;
  name = 'Excel Edit Cell Keyboard';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED];
  table: ListTable;
  pluginOptions: IExcelEditCellKeyboardPluginOptions;
  responseKeyboard: ExcelEditCellKeyboardResponse[];
  aggregateDeleteToOneChangeCellValuesEvent: boolean;
  constructor(pluginOptions?: IExcelEditCellKeyboardPluginOptions) {
    this.id = pluginOptions?.id ?? this.id;
    this.pluginOptions = pluginOptions;
    this.responseKeyboard = pluginOptions?.responseKeyboard ?? [
      ExcelEditCellKeyboardResponse.ENTER,
      ExcelEditCellKeyboardResponse.TAB,
      ExcelEditCellKeyboardResponse.ARROW_LEFT,
      ExcelEditCellKeyboardResponse.ARROW_RIGHT,
      ExcelEditCellKeyboardResponse.ARROW_DOWN,
      ExcelEditCellKeyboardResponse.ARROW_UP,
      ExcelEditCellKeyboardResponse.DELETE,
      ExcelEditCellKeyboardResponse.BACKSPACE
    ];

    this.aggregateDeleteToOneChangeCellValuesEvent = pluginOptions?.aggregateDeleteToOneChangeCellValuesEvent ?? false;

    this.bindEvent();
  }
  run(...args: [EventArg, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], BaseTableAPI]) {
    const table: BaseTableAPI = args[2];
    this.table = table as ListTable;
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
    // this.pluginOptions?.keyDown_before?.(event);
    if (this.table?.editorManager && this.isExcelShortcutKey(event)) {
      const eventKey = event.key.toLowerCase() as ExcelEditCellKeyboardResponse;
      //判断是键盘触发编辑单元格的情况下，那么在编辑状态中切换方向需要选中下一个继续编辑
      if (this.table.editorManager.editingEditor && this.table.editorManager.beginTriggerEditCellMode === 'keydown') {
        const { col, row } = this.table.editorManager.editCell;
        if (eventKey !== ExcelEditCellKeyboardResponse.BACKSPACE && eventKey !== ExcelEditCellKeyboardResponse.DELETE) {
          this.table.editorManager.completeEdit();
        } else {
          //如果输入了删除或退格键，应正常删除输入框内容
          return;
        }
        this.table.getElement().focus();
        if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
          //有这些配合键，则不进行选中下一个单元格的行为 执行vtable内部逻辑
          if (eventKey === ExcelEditCellKeyboardResponse.ENTER) {
            this.table.selectCell(col, row + 1);
          } else if (eventKey === ExcelEditCellKeyboardResponse.TAB) {
            this.table.selectCell(col + 1, row);
          } else if (eventKey === ExcelEditCellKeyboardResponse.ARROW_LEFT) {
            this.table.selectCell(col - 1, row);
          } else if (eventKey === ExcelEditCellKeyboardResponse.ARROW_RIGHT) {
            this.table.selectCell(col + 1, row);
          } else if (eventKey === ExcelEditCellKeyboardResponse.ARROW_DOWN) {
            this.table.selectCell(col, row + 1);
          } else if (eventKey === ExcelEditCellKeyboardResponse.ARROW_UP) {
            this.table.selectCell(col, row - 1);
          }
          // 阻止事件传播和默认行为
          event.stopPropagation();
          event.preventDefault();
        }
      } else {
        const { col, row } = this.table.stateManager.select.cellPos;
        if (
          this.table.editorManager.editingEditor &&
          (eventKey === ExcelEditCellKeyboardResponse.ENTER || eventKey === ExcelEditCellKeyboardResponse.TAB)
        ) {
          this.table.editorManager.completeEdit();
          this.table.getElement().focus();
          if (eventKey === ExcelEditCellKeyboardResponse.ENTER) {
            this.table.selectCell(col, row + 1);
          } else if (eventKey === ExcelEditCellKeyboardResponse.TAB) {
            this.table.selectCell(col + 1, row);
          }
          // 阻止事件传播和默认行为
          event.stopPropagation();
          event.preventDefault();
        } else if (
          !this.table.editorManager.editingEditor &&
          (eventKey === ExcelEditCellKeyboardResponse.DELETE || eventKey === ExcelEditCellKeyboardResponse.BACKSPACE)
        ) {
          //响应删除键，删除
          const selectCells = this.table.getSelectedCellInfos();
          if (
            selectCells?.length > 0 &&
            (document.activeElement === this.table.getElement() ||
              Object.values(this.table.editorManager.cacheLastSelectedCellEditor || {}).some(
                // 处理情况：没有开始编辑但编辑器及编辑输入框已经存在的情况下（editCellTrigger为keydown）判断当前激活的是cacheLastSelectedCellEditor中的input也应该响应删除单元格
                (editor: IEditor) => editor.getInputElement?.() === document.activeElement
              ))
          ) {
            // 如果选中的是范围，则删除范围内的所有单元格
            deleteSelectRange(
              selectCells,
              this.table,
              this.pluginOptions?.deleteWorkOnEditableCell ?? true,
              this.aggregateDeleteToOneChangeCellValuesEvent
            );
            // 阻止事件传播和默认行为
            event.stopPropagation();
            event.preventDefault();
          }
        }
      }
    }
    // this.pluginOptions?.keyDown_after?.apply(this, [event]);
  }
  // 判断event的keyCode是否是excel的快捷键
  isExcelShortcutKey(event: KeyboardEvent) {
    return this.responseKeyboard.includes(event.key.toLowerCase() as ExcelEditCellKeyboardResponse);
  }
  setResponseKeyboard(responseKeyboard: ExcelEditCellKeyboardResponse[]) {
    this.responseKeyboard = responseKeyboard;
  }
  deleteResponseKeyboard(responseKeyboard: ExcelEditCellKeyboardResponse[]) {
    this.responseKeyboard = this.responseKeyboard.filter(key => !responseKeyboard.includes(key));
  }
  addResponseKeyboard(responseKeyboard: ExcelEditCellKeyboardResponse[]) {
    this.responseKeyboard = [...this.responseKeyboard, ...responseKeyboard];
  }
  release() {
    document.removeEventListener('keydown', this.handleKeyDown, true);
  }
}
//将选中单元格的值设置为空
function deleteSelectRange(
  selectCells: TYPES.CellInfo[][],
  tableInstance: ListTable,
  workOnEditableCell: boolean = false,
  aggregateToOneChangeCellValuesEvent: boolean = false
) {
  if (aggregateToOneChangeCellValuesEvent) {
    const ranges = tableInstance.stateManager.select.ranges;
    if (ranges?.length) {
      tableInstance.changeCellValuesByIds(ranges, '', workOnEditableCell, true);
    }
    return;
  }

  for (let i = 0; i < selectCells.length; i++) {
    for (let j = 0; j < selectCells[i].length; j++) {
      tableInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '', workOnEditableCell);
    }
  }
}
