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
    sex: i % 2 === 0 ? 'boy fdsa fds gds' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  const records = generatePersons(50);
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
      width: 53
    },
    {
      field: 'tel',
      caption: 'telephone',
      width: 100
    },
    {
      field: 'work',
      caption: 'job',
      width: 100
    },
    {
      field: 'city',
      caption: 'city',
      width: 150
    }
  ];
  const option = {
    container: document.getElementById(Table_CONTAINER_DOM_ID),
    records,
    columns,
    defaultRowHeight: 50,
    // autoWrapText: true,
    heightMode: 'autoWrapText'
  };
  const tableInstance = new VTable.ListTable(option);
  setTimeout(() => {
    tableInstance.updateColumns([
      {
        field: 'id',
        caption: 'ID updated',
        width: 120,
        sort: true
      },
      {
        caption: 'full name updated',
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
        field: 'sex',
        caption: 'sex updated',
        width: 53
      },
      {
        field: 'tel',
        caption: 'telephone updated',
        width: 100
      },
      {
        field: 'work',
        caption: 'job updated',
        width: 100
      },
      {
        field: 'city',
        caption: 'city updated',
        width: 150
      }
    ]);
  }, 2000);

  (window as any).tableInstance = tableInstance;
}
