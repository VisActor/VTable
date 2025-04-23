import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import * as VTable_editors from '@visactor/vtable-editors';

// import * as VTable_editors from '../../../vtable-editors/src/index'; // 直接引入，省的需要在vtable-editors中rushx build。

import { HighlightHeaderWhenSelectCellPlugin } from '../../src';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};

export function createTable() {
  const input_editor = new VTable_editors.InputEditor();
  VTable.register.editor('input-editor', input_editor);

  const textArea_editor = new VTable_editors.TextAreaEditor();
  VTable.register.editor('textArea-editor', textArea_editor);

  const date_input_editor = new VTable_editors.DateInputEditor();
  const list_editor = new VTable_editors.ListEditor({ values: ['girl', 'boy'] });
  VTable.register.editor('date_input_editor', date_input_editor);
  VTable.register.editor('list_editor', list_editor);

  const records = generatePersons(20);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID ( input-editor )',
      width: 'auto',
      minWidth: 50,
      sort: true,
      headerEditor: 'input-editor',
      editor: 'input-editor'
    },
    {
      field: 'email1',
      title: 'email ( textArea-editor )',
      width: 300,
      sort: true,
      editor: 'textArea-editor',
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      field: 'date1',
      title: 'birthday ( date_input_editor )',
      width: 300,
      editor: 'date_input_editor'
    },
    {
      field: 'sex',
      title: 'sex ( list_editor )',
      width: 300,
      editor: 'list_editor'
    }
  ];

  const highlightPlugin = new HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    rowSeriesNumber: {},
    select: {
      outsideClickDeselect: true,
      headerSelectMode: 'body'
    },

    editCellTrigger: 'click',
    autoWrapText: true,
    editor: 'input-editor',
    menu: {
      contextMenuItems: ['copy', 'paste', 'delete', '...']
    },
    plugins: [highlightPlugin]
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  // tableInstance.scenegraph.temporarilyUpdateSelectRectStyle({stroke: false})
}
