import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
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
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  const records = generatePersons(1000);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      sort: true,
      width: 'auto'
    },
    {
      field: 'email1',
      title: 'email',
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name'
        },
        {
          field: 'name',
          title: 'Last Name'
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday'
      // width: 200
    },
    {
      field: 'sex',
      title: 'sex'
    },
    {
      field: 'tel',
      title: 'telephone'
    },
    {
      field: 'work',
      title: 'job'
    },
    {
      field: 'city',
      title: 'city'
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    widthMode: 'standard',
    transpose: true,
    dragHeaderMode: 'all',
    limitMinWidth: 20,
    theme: VTable.themes.DEFAULT.extends({
      frameStyle: { borderLineWidth: 10 },
      scrollStyle: {
        hoverOn: false,
        visible: 'always',
        barToSide: true
      },
      // rowHeaderStyle: {
      //   // color: 'red',
      //   // borderColor: 'green',
      //   frameStyle: {
      //     borderColor: 'red',
      //     borderLineWidth: 2
      //   }
      // },
      headerStyle: {
        // color: 'red',
        // borderColor: 'green',
        frameStyle: {
          borderColor: [null, '#E1E4E8', null, null],
          borderLineWidth: 2
        }
      }
    })
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  // tableInstance.on(VTable.ListTable.EVENT_TYPE.MOUSEENTER_TABLE, arg => {
  //   console.log('MOUSEENTER_TABLE', arg);
  // });
  // tableInstance.on(VTable.ListTable.EVENT_TYPE.MOUSELEAVE_TABLE, arg => {
  //   console.log('MOUSELEAVE_TABLE', arg);
  // });

  // tableInstance.on(VTable.ListTable.EVENT_TYPE.MOUSEDOWN_TABLE, arg => {
  //   console.log('mousedown_table', arg);
  // });
  // tableInstance.on(VTable.ListTable.EVENT_TYPE.CHANGE_HEADER_POSITION, arg => {
  //   console.log('CHANGE_HEADER_POSITION', arg);
  // });

  // tableInstance.on(VTable.ListTable.EVENT_TYPE.DRAG_SELECT_END, arg => {
  //   console.log('DRAG_SELECT_END', arg);
  // });
}
