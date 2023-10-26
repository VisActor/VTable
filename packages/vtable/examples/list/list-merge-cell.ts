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
  const records = generatePersons(10);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID ff',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
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
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    allowFrozenColCount: 3,
    // frozenColCount: 2,
    // autoWrapText: true,
    // heightMode: 'autoHeight',
    // widthMode: 'adaptive',
    customMergeCell: (col, row, table) => {
      if (col > 0 && col < 8 && row > 7 && row < 11) {
        return {
          text: 'long long long long long long long long long long long long long long long long long long text!',
          range: {
            start: {
              col: 1,
              row: 8
            },
            end: {
              col: 7,
              row: 10
            }
          },
          style: {
            bgColor: '#fff'
          }
        };
      }
    }
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
  // tableInstance.on('sort_click', args => {
  //   tableInstance.updateSortState(
  //     {
  //       field: args.field,
  //       order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
  //     },
  //     false
  //   );
  //   return false; //return false代表不执行内部排序逻辑
  // });
}
