import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const generatePersons = i => {
  return {
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  };
};

export function createTable() {
  const records = new Array(10).fill('').map((_, i) => generatePersons(i));
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID ff',
      width: '1%',
      minWidth: 200,
      sort: true,
      mergeCell: (v1, v2, { source, target, table }) => {
        const sourceValue = table.getRecordByCell(source.col, source.row);
        const targetValue = table.getRecordByCell(target.col, target.row);

        return sourceValue.id === targetValue.id;
      }
    },
    {
      field: 'email1',
      title: 'email',
      width: 'auto',
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200,
          mergeCell: (v1, v2, { source, target, table }) => {
            const sourceValue = table.getRecordByCell(source.col, source.row);
            const targetValue = table.getRecordByCell(target.col, target.row);

            return sourceValue.name === targetValue.name;
          }
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
    autoWrapText: true,
    heightMode: 'autoHeight' as const
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  // tableInstance.dataSource = dataSource;
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
