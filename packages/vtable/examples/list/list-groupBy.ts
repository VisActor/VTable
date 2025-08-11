import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
import { InputEditor } from '@visactor/vtable-editors';
const inputEditor = new InputEditor();
VTable.register.editor('inputEditor', inputEditor);

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    records: [
      {
        propa: '分组数据 1',
        propb: 'aaa'
      },
      {
        propa: '分组数据 2',
        propb: 'bbb'
      }
    ],
    groupConfig: {
      groupBy: ['propa']
    },
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'propa',
        title: 'AAAA',
        width: 'auto',
        editor: inputEditor
      },
      {
        field: 'propb',
        title: 'BBBB',
        width: 'auto',
        editor: inputEditor
      }
    ],
    // tooltip: {
    //   isShowOverflowTextTooltip: true
    // },
    frozenColCount: 2 // 开启这个复现问题
    // autoWrapText: true,
    // heightMode: 'autoHeight',
    // widthMode: 'adaptive'
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  tableInstance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
    console.log('分组状态变化:', args);
    // console.log(tableInstance);
    // args 包含 col, row, hierarchyState, originData 等信息
  });
}
