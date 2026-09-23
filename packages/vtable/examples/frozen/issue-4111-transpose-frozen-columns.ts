import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

function generateRecords(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    name: `Person ${index + 1}`,
    age: 20 + (index % 30),
    gender: index % 2 === 0 ? 'Male' : 'Female',
    hobby: ['Basketball', 'Reading', 'Travel', 'Music'][index % 4]
  }));
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }

  const tableInstance = new VTable.ListTable(container, {
    columns: [
      { field: 'name', title: 'Name', width: 120 },
      { field: 'age', title: 'Age', width: 120 },
      { field: 'gender', title: 'Gender', width: 120 },
      { field: 'hobby', title: 'Hobby', width: 120 }
    ],
    records: generateRecords(100),
    defaultColWidth: 120,
    frozenColCount: 2,
    transpose: true
  });

  window.tableInstance = tableInstance;
}
