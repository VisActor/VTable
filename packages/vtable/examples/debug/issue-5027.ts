import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

function createRecords(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    name: `John ${index + 1}`,
    age: 18 + (index % 10),
    gender: index % 2 === 0 ? 'male' : 'female',
    hobby: index % 3 === 0 ? '🏀' : index % 3 === 1 ? '🎸' : '📚'
  }));
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error('Cannot find VTable container');
  }
  const option: VTable.ListTableConstructorOptions = {
    container,
    columns: [
      {
        field: 'name',
        title: 'name',
        width: 180
      },
      {
        field: 'age',
        title: 'age',
        width: 120
      },
      {
        field: 'gender',
        title: 'gender',
        width: 140
      },
      {
        field: 'hobby',
        title: 'hobby',
        width: 140
      }
    ],
    records: createRecords(2000),
    frozenRowCount: 5,
    heightMode: 'standard',
    widthMode: 'standard',
    select: {
      headerSelectMode: 'inline',
      highlightMode: 'column'
    },
    theme: VTable.themes.DEFAULT.extends({
      scrollStyle: {
        visible: 'always',
        hoverOn: false
      }
    })
  };

  const tableInstance = new VTable.ListTable(option);

  // Preselect the age column so the scrollbar drag issue can be reproduced immediately.
  tableInstance.selectCol(1);

  const info = document.createElement('div');
  info.style.cssText = ['margin: 8px 0', 'font-size: 12px', 'line-height: 18px', 'color: #333'].join(';');
  info.innerText = 'issue-5027: drag the vertical scrollbar while the age column is selected and frozenRowCount is 5.';
  container.parentElement?.insertBefore(info, container);

  const w = window as unknown as {
    tableInstance?: VTable.ListTable;
    issue5027?: {
      table: VTable.ListTable;
      selectAgeColumn: () => void;
    };
  };
  w.tableInstance = tableInstance;
  w.issue5027 = {
    table: tableInstance,
    selectAgeColumn: () => tableInstance.selectCol(1)
  };
}
