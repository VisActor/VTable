import type { ColumnsDefine } from '@visactor/vtable';
import { register, themes } from '@visactor/vtable';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import type { GanttConstructorOptions, TYPES } from '@visactor/vtable-gantt';
import { Gantt } from '@visactor/vtable-gantt';
import { VTableSheet } from '../../src/index';
const CONTAINER_ID = 'vTable';
const date_input_editor = new DateInputEditor({});
const input_editor = new InputEditor({});
register.editor('input', input_editor);
register.editor('date-input', date_input_editor);
export function createTable() {
  const ganttInstance = new VTableSheet(document.getElementById(CONTAINER_ID)!, {
    sheets: [
      {
        key: 'sheet1',
        title: 'sheet1',
        columns: [
          {
            field: 'name',
            title: '名称',
            width: 100
          }
        ],
        data: [
          [1, 2, 3],
          ['放到', '个', '哦']
        ]
      },
      {
        key: 'sheet2',
        title: 'sheet2',
        columns: [
          {
            key: 'name',
            title: '名称',
            width: 100
          }
        ],
        data: [
          [3, 4, 6],
          ['s', 'd', 'f']
        ]
      }
    ],
    // showSheetTab: true,
    activeSheetKey: 'sheet1'
  });
  window.ganttInstance = ganttInstance;

  // bindDebugTool(ganttInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
