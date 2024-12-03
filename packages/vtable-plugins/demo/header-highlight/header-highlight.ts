import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import * as VTable_editors from '@visactor/vtable-editors';

import { HeaderHighlightPlugin } from '../../src';
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

  const records = generatePersons(20);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true,
      headerEditor: 'input-editor',
      editor: 'input-editor'
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    rowSeriesNumber: {},
    select: {
      outsideClickDeselect: true,
      headerSelectMode: 'body'
    },
    autoWrapText: true,
    editor: 'input-editor',
    menu: {
      contextMenuItems: ['copy', 'paste', 'delete', '...']
    }
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  tableInstance.stateManager.setCustomSelectRanges([
    {
      range: {
        start: {
          col: 0,
          row: 4
        },
        end: {
          col: 5,
          row: 4
        }
      },
      style: {
        cellBorderColor: 'blue',
        cellBorderLineWidth: 2,
        cellBorderLineDash: [5, 5]
      }
    }
  ]);

  const highlightPlugin = new HeaderHighlightPlugin(tableInstance);
  window.highlightPlugin = highlightPlugin;

  const onShowMenu = () => {
    console.log('show_menu');
    // 菜单dom位置 及 层级处理
    const menuElement = document.getElementsByClassName('vtable__menu-element')[0];
    if (menuElement) {
      console.log('find_menu');
      // menuElement.setAttribute('style', `top: -${menuElement.clientHeight}px !important`)
      menuElement.setAttribute('style', `top: -${0}px !important`);
      menuElement.setAttribute('style', `z-index: 9999`);
    }
  };

  tableInstance.on('show_menu', onShowMenu);

  // tableInstance.scenegraph.temporarilyUpdateSelectRectStyle({stroke: false})
}
