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
  const records = generatePersons(30);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 120,
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
  const option: VTable.TYPES.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    frozenColCount: 2,
    rightFrozenColCount: 2,
    allowFrozenColCount: 10,
    hover: {
      highlightMode: 'row'
    },
    theme: VTable.themes.ARCO
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  // bindDebugTool(tableInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', 'col', 'row']
  // });
}
