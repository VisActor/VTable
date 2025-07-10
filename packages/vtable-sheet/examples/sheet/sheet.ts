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
  const sheetInstance = new VTableSheet(document.getElementById(CONTAINER_ID)!, {
    width: 1528,
    height: 883,
    showFormulaBar: true,
    showSheetTab: true,
    defaultRowHeight: 25,
    defaultColWidth: 100,
    frozenRowCount: 0,
    frozenColCount: 0,
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'sheet1',
        columns: [
          {
            title: '名称',
            sort: true,
            width: 100
          }
        ],
        data: [
          [1, 2, 3],
          ['放到', '个', '哦']
        ],
        active: false
      },
      {
        sheetKey: 'sheet2',
        sheetTitle: 'sheet2',
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
        ],
        active: false
      },
      {
        sheetKey: 'sheet3',
        sheetTitle: 'sheet3',
        data: [
          ['s', 'd', 'f'],
          null,
          {
            '0': 't',
            '1': 'y',
            '2': 'u'
          },
          null,
          null,
          null,
          null,
          {
            '1': '3'
          }
        ],
        active: false,
        columns: [
          {
            title: 3
          },
          {
            title: 4
          },
          {
            title: 6
          }
        ]
      },
      {
        sheetKey: 'sheet4',
        sheetTitle: 'sheet4',
        active: true,
        showHeader: false,
        data: [
          {
            '0': 'r',
            '1': 't',
            '2': 'y'
          },
          {
            '0': 'y',
            '1': 'u',
            '2': 'i'
          },
          {
            '0': 'j',
            '1': 'k',
            '2': 'h'
          }
        ],
        columns: []
      }
    ]
  });
  window.sheetInstance = sheetInstance;

  // bindDebugTool(ganttInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
