import * as VTable from '../../src';
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
  const records = generatePersons(1000000);
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
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns
  };
  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;
  tableInstance.on('sort_click', args => {
    tableInstance.updateSortState(
      {
        field: args.field,
        order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
      },
      false
    );
    return false; //return false代表不执行内部排序逻辑
  });
}
