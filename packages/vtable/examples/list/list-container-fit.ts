import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `Name ${i + 1}`,
    age: 20 + i,
    city: `City ${i + 1}`
  }));
};

export function createTable() {
  const records = generatePersons(3);
  const columns: VTable.ColumnsDefine = [
    { field: 'id', title: 'ID', width: 100 },
    { field: 'name', title: 'Name', width: 200 },
    { field: 'age', title: 'Age', width: 100 },
    { field: 'city', title: 'City', width: 200 }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    widthMode: 'standard',
    heightMode: 'standard',
    containerFit: true // 关键配置
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
}
