import * as VTable from '../../src';

interface Issue4794Window extends Window {
  tableInstance?: VTable.ListTable;
  issue4794Run?: () => boolean;
  BUGSERVER_SCREENSHOT?: () => void;
}

interface EmployeeRecord {
  id: number;
  name: string;
  modifiedCells?: {
    name?: boolean;
  };
}

const CONTAINER_ID = 'vTable';

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Missing #${CONTAINER_ID} container`);
  }
  container.style.width = '640px';
  container.style.height = '360px';

  const sourceRecords: EmployeeRecord[] = [
    { id: 1, name: 'Employee 1' },
    { id: 2, name: 'Employee 2' },
    { id: 3, name: 'Employee 3' },
    { id: 4, name: 'Employee 4' },
    { id: 5, name: 'Employee 5' }
  ];

  const status = document.createElement('div');
  status.id = 'issue4794Status';
  status.style.cssText = 'margin: 0 0 12px; font: 600 14px/1.5 sans-serif;';
  status.textContent = 'RUNNING';
  container.parentElement?.insertBefore(status, container);

  const tableInstance = new VTable.ListTable(container, {
    columns: [
      { field: 'id', title: 'ID', width: 100 },
      {
        field: 'name',
        title: 'Name',
        width: 260,
        style: args => {
          const record = args.table.records[args.row - 1] as EmployeeRecord | undefined;
          return {
            bgColor: record?.modifiedCells?.name ? '#ffccc7' : '#fff'
          };
        }
      },
      {
        field: 'modifiedCells',
        title: 'Source record updated',
        width: 200,
        fieldFormat: record => (record.modifiedCells?.name ? 'yes' : 'no')
      }
    ],
    records: sourceRecords,
    syncRecordOperationsToSourceRecords: true
  });

  const runCheck = () => {
    tableInstance.updateFilterRules([
      {
        filterKey: 'id',
        filteredValues: [2, 3, 4]
      }
    ]);

    const updatedRecord: EmployeeRecord = {
      ...(tableInstance.records[0] as EmployeeRecord),
      name: 'Employee 2 updated',
      modifiedCells: { name: true }
    };
    tableInstance.updateRecords([updatedRecord], [0]);
    tableInstance.updateFilterRules([]);

    const sourceRecord = sourceRecords[1];
    const displayedRecord = tableInstance.records[1] as EmployeeRecord;
    const pass =
      sourceRecord === updatedRecord &&
      displayedRecord === updatedRecord &&
      sourceRecord.name === 'Employee 2 updated' &&
      sourceRecord.modifiedCells?.name === true;

    status.textContent = `${pass ? 'PASS' : 'FAIL'} | source Employee 2: ${sourceRecord.name} | modified: ${
      sourceRecord.modifiedCells?.name === true ? 'yes' : 'no'
    }`;
    status.style.color = pass ? '#237804' : '#a8071a';
    status.style.borderLeft = `4px solid ${pass ? '#52c41a' : '#ff4d4f'}`;
    status.style.paddingLeft = '8px';
    (window as Issue4794Window).BUGSERVER_SCREENSHOT?.();
    return pass;
  };

  const issueWindow = window as Issue4794Window;
  issueWindow.tableInstance = tableInstance;
  issueWindow.issue4794Run = runCheck;
  requestAnimationFrame(runCheck);
}
