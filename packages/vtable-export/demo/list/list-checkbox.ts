import * as VTable from '@visactor/vtable';
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
  const records = [
    { productName: 'aaaa', price: 20, check: { text: 'unchecked', checked: false, disable: false } },
    { productName: 'bbbb', price: 18, check: { text: 'checked', checked: true, disable: false } },
    { productName: 'cccc', price: 16, check: { text: 'disable', checked: true, disable: true } },
    { productName: 'cccc', price: 14, check: { text: 'disable', checked: false, disable: true } },
    { productName: 'eeee', price: 12, check: { text: 'checked', checked: false, disable: false } },
    { productName: 'ffff', price: 10, check: { text: 'checked', checked: false, disable: false } },
    { productName: 'gggg', price: 10, check: { text: 'checked', checked: false, disable: false } }
  ];

  const columns = [
    {
      field: 'isCheck',
      title: '',
      width: 60,
      headerType: 'checkbox',
      cellType: 'checkbox'
    },
    {
      field: 'productName',
      title: 'productName',
      width: 120
    },
    {
      field: 'price',
      title: 'checkbox',
      width: 120,
      cellType: 'checkbox',
      disable: true,
      checked: true
    },
    {
      field: 'check',
      title: 'checkbox',
      width: 120,
      cellType: 'checkbox'
      // disable: true
    }
  ];
  const option = {
    records,
    columns
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
  window.excelOption = {
    formatExportOutput: ({ cellType, cellValue, table, col, row }) => {
      if (cellType === 'checkbox') {
        return table.getCellCheckboxState(col, row) ? 'true' : 'false';
      }
    }
  };
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
