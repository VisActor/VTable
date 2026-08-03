import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const filteredChildren = Array.from({ length: 300 }, (_, index) => ({
  name: `filtered child ${index + 1}`,
  status: 'visible before filter',
  desc: 'This row is hidden after filter interaction',
  _show: true
}));
const visibleChildren = Array.from({ length: 40 }, (_, index) => ({
  name: `visible child ${index + 1}`,
  status: 'visible after filter',
  desc: `Visible tree row ${index + 1} should fill the viewport after filtered zero-height rows`,
  _show: true
}));
const records = [
  {
    name: 'expanded group filtered by interaction',
    status: 'group',
    desc: 'Children below become _show=false after simulated filter interaction',
    _show: true,
    hierarchyState: 'expand',
    children: filteredChildren
  },
  {
    name: 'expanded group with visible children',
    status: 'group',
    desc: 'These rows should be pulled into first screen after zero-height rows',
    _show: true,
    hierarchyState: 'expand',
    children: visibleChildren
  }
];

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  document.getElementById('issue5115Toolbar')?.remove();
  container.style.width = '720px';
  container.style.height = '420px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5115Toolbar';
  toolbar.style.cssText = 'height: 48px; font-size: 12px; display: flex; gap: 12px; align-items: center;';
  toolbar.innerHTML = `
    <button id="issue5115Check">check</button>
    <button id="issue5115ToggleCheck">toggle check</button>
    <span id="issue5115State"></span>
  `;
  container.before(toolbar);

  const option: VTable.ListTableConstructorOptions = {
    container,
    records,
    columns: [
      { field: 'name', title: 'Name', tree: true, width: 260 },
      { field: 'status', title: 'Status', width: 180 },
      { field: 'desc', title: 'Description', width: 260 }
    ],
    widthMode: 'standard',
    heightMode: 'autoHeight',
    defaultRowHeight: 40,
    hierarchyIndent: 20,
    hierarchyExpandLevel: 2,
    customComputeRowHeight: ({ row, table }) => {
      const record = table.getCellOriginRecord(0, row);
      return record && record._show === false ? 0 : 'auto';
    }
  };
  const tableInstance = new VTable.ListTable(option);

  const check = () => {
    const proxy = tableInstance.scenegraph.proxy;
    const bodyStart = tableInstance.frozenRowCount;
    const bodyHeight =
      tableInstance.tableNoFrameHeight -
      tableInstance.getFrozenRowsHeight() -
      tableInstance.getBottomFrozenRowsHeight();
    const renderedHeight = tableInstance.getRowsHeight(bodyStart, proxy.rowEnd);
    const firstFilteredRowHeight = tableInstance.getRowHeight(tableInstance.columnHeaderLevelCount + 1);
    const proxyRowsSynced =
      proxy.totalRow >= proxy.rowEnd && proxy.totalActualBodyRowCount >= proxy.rowEnd - proxy.rowStart + 1;
    const pass = firstFilteredRowHeight === 0 && renderedHeight >= bodyHeight && proxyRowsSynced;
    const state = document.getElementById('issue5115State')!;
    state.textContent =
      `${pass ? 'PASS' : 'FAIL'} | firstFilteredRowHeight=${firstFilteredRowHeight} renderedHeight=${renderedHeight} ` +
      `bodyHeight=${bodyHeight} rowEnd=${proxy.rowEnd} totalRow=${proxy.totalRow}`;
    return {
      pass,
      firstFilteredRowHeight,
      renderedHeight,
      bodyHeight,
      rowEnd: proxy.rowEnd,
      totalRow: proxy.totalRow,
      totalActualBodyRowCount: proxy.totalActualBodyRowCount,
      proxyRowsSynced
    };
  };

  const filterRows = () => {
    filteredChildren.forEach(record => {
      record._show = false;
      record.status = 'hidden by _show=false';
    });
    tableInstance.updateOption(option, { clearRowHeightCache: true, clearColWidthCache: false });
  };

  const toggleCheck = async () => {
    tableInstance.toggleHierarchyState(0, 1, false);
    await new Promise(resolve => setTimeout(resolve, 60));
    tableInstance.toggleHierarchyState(0, 1, false);
    await new Promise(resolve => setTimeout(resolve, 120));
    return check();
  };

  document.getElementById('issue5115Check')!.addEventListener('click', check);
  document.getElementById('issue5115ToggleCheck')!.addEventListener('click', toggleCheck);

  window.tableInstance = tableInstance;
  (window as any).issue5115Check = check;
  (window as any).issue5115ToggleCheck = toggleCheck;

  setTimeout(() => {
    filterRows();
    setTimeout(check, 0);
  }, 0);
}
