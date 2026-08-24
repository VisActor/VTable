import * as VTable from '@visactor/vtable';
import { MenuHandler } from '../../src/contextmenu/handle-menu-helper';
import { TableSeriesNumber } from '../../src/table-series-number';

const CONTAINER_ID = 'vTable';

const initialRecords = [
  { id: 0, name: 'A' },
  { id: 1, name: 'B' },
  { id: 2, name: 'C' },
  { id: 3, name: 'D' },
  { id: 4, name: 'E' }
];

const removeDemoToolbar = () => {
  document.getElementById('issue5214Toolbar')?.remove();
};

const setStatus = (message: string, pass: boolean) => {
  const statusNode = document.getElementById('issue5214Status');
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.style.color = pass ? '#237804' : '#cf1322';
};

export function createTable() {
  removeDemoToolbar();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '640px';
  container.style.height = '360px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5214Toolbar';
  toolbar.style.cssText = [
    'display: flex',
    'gap: 8px',
    'align-items: center',
    'height: 48px',
    'font-size: 12px'
  ].join(';');
  toolbar.innerHTML = `
    <button id="issue5214Reproduce">模拟反向选区并右键删除</button>
    <button id="issue5214Reset">重置数据</button>
    <span>预期：删除 id=1,2,3，仅保留 0 和 4。</span>
    <strong id="issue5214Status"></strong>
  `;
  container.before(toolbar);

  const seriesNumberPlugin = new TableSeriesNumber({
    rowCount: 5,
    colCount: 2
  });

  const tableInstance = new VTable.ListTable({
    container,
    showHeader: false,
    columns: [
      { field: 'id', title: 'ID', width: 120 },
      { field: 'name', title: 'Name', width: 160 }
    ],
    records: initialRecords.map(record => ({ ...record })),
    syncRecordOperationsToSourceRecords: true,
    plugins: [seriesNumberPlugin],
    defaultRowHeight: 36
  });

  const getRecordIds = () => tableInstance.records.map((record: { id: number }) => record.id);
  const updateStatusFromRecords = (prefix: string, pass: boolean) => {
    setStatus(`${prefix} | records=[${getRecordIds().join(',')}]`, pass);
  };

  document.getElementById('issue5214Reset')?.addEventListener('click', () => {
    tableInstance.setRecords(initialRecords.map(record => ({ ...record })));
    updateStatusFromRecords('RESET', true);
  });

  document.getElementById('issue5214Reproduce')?.addEventListener('click', () => {
    tableInstance.stateManager.select.ranges = [
      {
        start: { col: 0, row: 3 },
        end: { col: tableInstance.colCount - 1, row: 1 }
      }
    ];

    seriesNumberPlugin['handleSeriesNumberCellRightClick']({
      detail: {
        seriesNumberCell: { id: 2, name: 'row-series-number-cell' },
        event: new MouseEvent('contextmenu')
      }
    });

    new MenuHandler().handleDeleteRow(tableInstance);

    const ids = getRecordIds();
    const pass = ids.length === 2 && ids[0] === 0 && ids[1] === 4;
    updateStatusFromRecords(pass ? 'PASS' : 'FAIL', pass);
  });

  updateStatusFromRecords('READY', true);

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    removeDemoToolbar();
    release();
  };

  (window as any).tableInstance = tableInstance;
}
