import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const Table_CONTAINER_DOM_ID = 'vTable';
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
  const records = generatePersons(100);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      caption: 'ID',
      width: 120,
      sort: true
    },
    {
      field: 'email1',
      caption: 'email',
      width: 200,
      sort: true
    },
    {
      caption: 'full name',
      columns: [
        {
          field: 'name',
          caption: 'First Name',
          width: 200
        },
        {
          field: 'name',
          caption: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      caption: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      caption: 'sex',
      width: 100
    },
    {
      field: 'tel',
      caption: 'telephone',
      width: 150
    },
    {
      field: 'work',
      caption: 'job',
      width: 200
    },
    {
      field: 'city',
      caption: 'city',
      width: 150
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    records,
    columns,
    legends: {
      data: [
        {
          label: 'line_5',
          shape: {
            fill: '#1664FF',
            symbolType: 'circle'
          }
        },
        {
          label: 'bar_12',
          shape: {
            fill: '#1AC6FF',
            symbolType: 'square'
          }
        }
      ],
      orient: 'bottom',
      position: 'start'
    }
  };
  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  const { LEGEND_ITEM_CLICK, LEGEND_ITEM_HOVER, LEGEND_ITEM_UNHOVER } = VTable.ListTable.EVENT_TYPE;
  tableInstance.listen(LEGEND_ITEM_CLICK, args => {
    console.log('LEGEND_ITEM_CLICK', args);
  });
  tableInstance.listen(LEGEND_ITEM_HOVER, args => {
    console.log('LEGEND_ITEM_HOVER', args);
  });
  tableInstance.listen(LEGEND_ITEM_UNHOVER, args => {
    console.log('LEGEND_ITEM_UNHOVER', args);
  });
}
