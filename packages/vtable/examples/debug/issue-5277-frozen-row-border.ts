import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const generateRecords = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Name ${index + 1}`,
    city: ['Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou', 'Chengdu', 'Wuhan'][index % 6],
    sales: 1000 + index * 100,
    profit: 120 + index * 10
  }));

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }
  container.style.width = '900px';
  container.style.height = '500px';

  const columns: VTable.ColumnsDefine = [
    { field: 'id', title: 'ID', width: 120 },
    { field: 'name', title: 'Name', width: 180 },
    { field: 'city', title: 'City', width: 180 },
    { field: 'sales', title: 'Sales', width: 180 },
    { field: 'profit', title: 'Profit', width: 180 }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container,
    records: generateRecords(6),
    frozenRowCount: 3,
    bottomFrozenRowCount: 1,
    columns,
    widthMode: 'standard',
    theme: {
      frameStyle: {
        borderLineWidth: [1, 1, 1, 1],
        borderColor: 'red'
      }
    }
  };

  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
}
