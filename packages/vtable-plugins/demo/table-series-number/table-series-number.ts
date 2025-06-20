import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import * as VTable_editors from '@visactor/vtable-editors';

import { TableSeriesNumber } from '../../src';
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
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 1000,
  colCount: 1000,
  rowHeight: 30,
  colWidth: 30
});
export function createTable() {
  // const input_editor = new VTable_editors.InputEditor();
  // VTable.register.editor('input-editor', input_editor);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true
      // headerEditor: 'input-editor',
      // editor: 'input-editor'
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
    },
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true
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
    },
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true
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
  window.createTableInstance = function () {
    // window.tableInstance?.release();
    const records = generatePersons(4000);
    const option: VTable.ListTableConstructorOptions = {
      records,
      columns,
      // rowSeriesNumber: {}
      // select: {
      //   outsideClickDeselect: true,
      //   headerSelectMode: 'body'
      // },
      // autoWrapText: true,
      // editor: 'input-editor',
      // overscrollBehavior: 'none',
      // menu: {
      //   contextMenuItems: ['copy', 'paste', 'delete', '...']
      // },
      // viewBox: {
      //   x1: 40,
      //   y1: 40,
      //   x2: 1700,
      //   y2: 600
      // },
      plugins: [tableSeriesNumberPlugin]
    };
    const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, option);
    window.tableInstance = tableInstance;
    tableInstance.on('click_cell', e => {
      console.log('click_cell');
    });
  };
  /** @ts-ignore */
  window.createTableInstance();
  /** @ts-ignore */
  bindDebugTool(window.tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
  /** @ts-ignore */
  // window.updateOption = function () {
  //   const records = generatePersons(40);
  //   const option: VTable.ListTableConstructorOptions = {
  //     records: records.sort((a, b) => b.id - a.id),
  //     columns,
  //     rowSeriesNumber: {},
  //     select: {
  //       outsideClickDeselect: true,
  //       headerSelectMode: 'body'
  //     },
  //     autoWrapText: true,
  //     editor: 'input-editor',
  //     overscrollBehavior: 'none',
  //     menu: {
  //       contextMenuItems: ['copy', 'paste', 'delete', '...']
  //     },
  //     plugins: [tableSeriesNumberPlugin]
  //   };
  // window.tableInstance.updateOption(option);
}

// tableInstance.scenegraph.temporarilyUpdateSelectRectStyle({stroke: false})
// }
