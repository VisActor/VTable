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
  const records = generatePersons(100);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      // width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name'
          // width: 200
        },
        {
          field: 'name',
          title: 'Last Name'
          // width: 200
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
      // width: 100
    },
    {
      field: 'tel',
      title: 'telephone'
      // width: 150
    },
    {
      field: 'work',
      title: 'job'
      // width: 200
    },
    {
      field: 'city',
      title: 'city'
      // width: 150
    }
  ];
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
  setTimeout(() => {
    const option1 = {
      //container: document.getElementById(CONTAINER_ID),
      // records,
      columns,
      // widthMode: 'autoWidth',
      theme: {
        defaultStyle: {},
        bodyStyle: {
          color: 'red',
          hover: {
            cellBgColor: 'red'
          }
        }
      },
      transpose: true,
      autoWrapText: true
    };
    tableInstance.updateOption(option1);
  }, 3000);
}
