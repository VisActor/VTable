import { register } from '@visactor/vtable';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
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
        data: [['s', 'd', 'f'], null, ['t', 'y', 'u'], null, null, null, null, ['3']],
        active: false,
        columns: [
          {
            title: '3'
          },
          {
            title: '4'
          },
          {
            title: '6'
          }
        ]
      },
      {
        sheetKey: 'sheet4',
        sheetTitle: 'sheet4',
        active: true,
        showHeader: false,
        data: [
          ['r', 't', 'y'],
          ['y', 'u', 'i'],
          ['j', 'k', 'h']
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
