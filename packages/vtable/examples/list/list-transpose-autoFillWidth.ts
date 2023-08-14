import * as VTable from '../../src';
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
  const records = generatePersons(5);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      caption: 'ID',
      sort: true,
      width: 'auto'
    },
    {
      field: 'email1',
      caption: 'email',
      sort: true
    },
    {
      caption: 'full name',
      columns: [
        {
          field: 'name',
          caption: 'First Name'
        },
        {
          field: 'name',
          caption: 'Last Name'
        }
      ]
    },
    {
      field: 'date1',
      caption: 'birthday'
      // width: 200
    },
    {
      field: 'sex',
      caption: 'sex'
    },
    {
      field: 'tel',
      caption: 'telephone'
    },
    {
      field: 'work',
      caption: 'job'
    },
    {
      field: 'city',
      caption: 'city'
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(Table_CONTAINER_DOM_ID),
    records,
    columns,
    widthMode: 'standard',
    transpose: true,
    dragHeaderMode: 'all',
    autoFillWidth: true
  };
  const tableInstance = new VTable.ListTable(option);
  (window as any).tableInstance = tableInstance;
}
