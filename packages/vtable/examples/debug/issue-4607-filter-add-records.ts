import * as VTable from '../../src';

interface Issue4607Window extends Window {
  tableInstance?: VTable.ListTable;
  issue4607Run?: () => boolean;
  BUGSERVER_SCREENSHOT?: () => void;
}

const CONTAINER_ID = 'vTable';

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Missing #${CONTAINER_ID} container`);
  }
  container.style.width = '640px';
  container.style.height = '360px';

  const sourceRecords = [
    { name: 'Alice', age: 25, group: 'A' },
    { name: 'Bob', age: 30, group: 'B' },
    { name: 'Charlie', age: 35, group: 'A' }
  ];
  const addedRecords = [
    { name: 'David', age: 40, group: 'A' },
    { name: 'Eve', age: 45, group: 'B' }
  ];

  const status = document.createElement('div');
  status.id = 'issue4607Status';
  status.style.cssText = 'margin: 0 0 12px; font: 600 14px/1.5 sans-serif;';
  status.textContent = 'RUNNING';
  container.parentElement?.insertBefore(status, container);

  const tableInstance = new VTable.ListTable(container, {
    columns: [
      { field: 'name', title: 'Name', width: 180 },
      { field: 'age', title: 'Age', width: 120 },
      { field: 'group', title: 'Group', width: 120 }
    ],
    records: sourceRecords,
    syncRecordOperationsToSourceRecords: true
  });

  const runCheck = () => {
    tableInstance.updateFilterRules([
      {
        filterKey: 'group',
        filteredValues: ['A']
      }
    ]);
    tableInstance.addRecords(addedRecords);
    tableInstance.updateFilterRules([]);

    const names = (tableInstance.records as typeof sourceRecords).map(record => record.name);
    const pass =
      names.join(',') === 'Alice,Bob,Charlie,David,Eve' &&
      sourceRecords.length === 5 &&
      sourceRecords[3] === addedRecords[0] &&
      sourceRecords[4] === addedRecords[1];

    status.textContent = `${pass ? 'PASS' : 'FAIL'} | ${names.join(', ')}`;
    status.style.color = pass ? '#237804' : '#a8071a';
    status.style.borderLeft = `4px solid ${pass ? '#52c41a' : '#ff4d4f'}`;
    status.style.paddingLeft = '8px';
    (window as Issue4607Window).BUGSERVER_SCREENSHOT?.();
    return pass;
  };

  const issueWindow = window as Issue4607Window;
  issueWindow.tableInstance = tableInstance;
  issueWindow.issue4607Run = runCheck;
  requestAnimationFrame(runCheck);
}
