import type { pluginsDefinition, BaseTableAPI, ListTable, TYPES } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEvents } from '@visactor/vtable/src/core/TABLE_EVENT_TYPE';
import type { EventArg } from './types';
import { generateAutoFillData } from './fillHandleUtils/autoFillHandle';
//备用 插件配置项 目前感觉都走默认逻辑就行
export type IWpsFillHandlePluginOptions = {
  id?: string;
  // 是否响应删除
  // enableDeleteKey?: boolean;
};

export class WpsFillHandlePlugin implements pluginsDefinition.IVTablePlugin {
  id = `wps-fill-handle`;
  name = 'WPS Fill Handle';
  runTime = [TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE, TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END];
  table: ListTable;
  pluginOptions: IWpsFillHandlePluginOptions;

  beforeDragMinCol = 0;
  beforeDragMinRow = 0;
  beforeDragMaxCol = 0;
  beforeDragMaxRow = 0;

  constructor(pluginOptions?: IWpsFillHandlePluginOptions) {
    this.id = pluginOptions?.id ?? this.id;
    this.pluginOptions = pluginOptions;
  }
  run(...args: [EventArg, TableEvents[keyof TableEvents] | TableEvents[keyof TableEvents][], BaseTableAPI]) {
    if (args[1] === TABLE_EVENT_TYPE.MOUSEDOWN_FILL_HANDLE) {
      const eventArgs = args[0];
      const table: BaseTableAPI = args[2];
      this.table = table as ListTable;
      const startSelectCellRange = this.table?.getSelectedCellRanges()[0];
      if (!startSelectCellRange) {
        return;
      }
      this.beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
      this.beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
      this.beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
      this.beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
    } else if (args[1] === TABLE_EVENT_TYPE.DRAG_FILL_HANDLE_END) {
      const direction = (args[0] as { direction?: 'bottom' | 'right' | 'top' | 'left' }).direction;
      let endChangeCellCol;
      let endChangeCellRow;
      const endSelectCellRange = this.table?.getSelectedCellRanges()[0];
      if (!endSelectCellRange) {
        return;
      }
      //根据填充方向 确定需要填充值的范围
      if (direction === 'bottom') {
        endChangeCellCol = this.beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direction === 'right') {
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = this.beforeDragMaxRow;
      } else if (direction === 'top') {
        endChangeCellCol = this.beforeDragMaxCol;
        endChangeCellRow = endSelectCellRange.end.row;
      } else if (direction === 'left') {
        endChangeCellCol = endSelectCellRange.end.col;
        endChangeCellRow = this.beforeDragMaxRow;
      }
      const rowDatas = this.table?.records;
      const tableColumns = this.table?.getAllColumnHeaderCells() || [];
      let highestColumns: TYPES.CellInfo[] = [];
      if (tableColumns?.length) {
        highestColumns = tableColumns[tableColumns.length - 1];
      }
      const newDatas = generateAutoFillData(
        rowDatas,
        highestColumns,
        {
          startRow: this.beforeDragMinRow - tableColumns.length,
          startCol: this.beforeDragMinCol,
          endRow: this.beforeDragMaxRow - tableColumns.length,
          endCol: this.beforeDragMaxCol
        },
        {
          row: endChangeCellRow - tableColumns.length,
          col: endChangeCellCol
        }
      );
      this.table?.setRecords(newDatas);
    }
  }

  handleKeyDown() {
    if (this.table.editorManager) {
      //判断是键盘触发编辑单元格的情况下，那么在编辑状态中切换方向需要选中下一个继续编辑
      const startSelectCellRange = this.table?.getSelectedCellRanges()[0];
      if (!startSelectCellRange) {
        return;
      }
      this.beforeDragMaxCol = Math.max(startSelectCellRange.start.col, startSelectCellRange.end.col);
      this.beforeDragMinCol = Math.min(startSelectCellRange.start.col, startSelectCellRange.end.col);
      this.beforeDragMaxRow = Math.max(startSelectCellRange.start.row, startSelectCellRange.end.row);
      this.beforeDragMinRow = Math.min(startSelectCellRange.start.row, startSelectCellRange.end.row);
    }
  }

  release() {
    this.beforeDragMinCol = 0;
    this.beforeDragMinRow = 0;
    this.beforeDragMaxCol = 0;
    this.beforeDragMaxRow = 0;
    // document.removeEventListener('mousedown_fill_handle', this.handleKeyDown, true);
    // document.removeEventListener('drag_fill_handle_end', this.handleDragEnd, true);
  }
}
//将选中单元格的值设置为空
function deleteSelectRange(selectCells: TYPES.CellInfo[][], tableInstance: ListTable) {
  for (let i = 0; i < selectCells.length; i++) {
    for (let j = 0; j < selectCells[i].length; j++) {
      tableInstance.changeCellValue(selectCells[i][j].col, selectCells[i][j].row, '');
    }
  }
}
