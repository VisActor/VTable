import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const STATUS_ID = 'issue3903Status';

const records = [
  { id: 1, name: 'Alice', total: 120 },
  { id: 2, name: 'Bob', total: 180 }
];

export function createTable() {
  document.getElementById(STATUS_ID)?.remove();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '720px';
  container.style.height = '320px';

  const status = document.createElement('strong');
  status.id = STATUS_ID;
  status.style.cssText = 'display: block; margin-bottom: 8px; font: 14px/1.5 sans-serif;';
  status.textContent = 'RUNNING';
  container.before(status);

  const tableInstance = new VTable.ListTable(container, {
    records: records.slice(),
    columns: [
      { field: 'id', title: 'ID', width: 120 },
      { field: 'name', title: 'Name', width: 300 },
      { field: 'total', title: 'Total', width: 180 }
    ],
    frozenColCount: 1,
    rightFrozenColCount: 1,
    bottomFrozenRowCount: 1,
    widthMode: 'standard'
  });

  try {
    tableInstance.deleteRecords([0, 1]);
    const pass =
      tableInstance.records.length === 0 &&
      tableInstance.bottomFrozenRowCount === 0 &&
      tableInstance.scenegraph.bottomFrozenGroup.attribute.height === 0;
    status.textContent = `${pass ? 'PASS' : 'FAIL'} | records=${tableInstance.records.length}, bottomFrozenRows=${
      tableInstance.bottomFrozenRowCount
    }`;
    status.style.color = pass ? '#237804' : '#a8071a';
  } catch (error) {
    status.textContent = `FAIL | ${error instanceof Error ? error.message : String(error)}`;
    status.style.color = '#a8071a';
  }

  requestAnimationFrame(() => {
    (window as any).BUGSERVER_SCREENSHOT?.();
  });

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    document.getElementById(STATUS_ID)?.remove();
    release();
  };

  (window as any).tableInstance = tableInstance;
}
