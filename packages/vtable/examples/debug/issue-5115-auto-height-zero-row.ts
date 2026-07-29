import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const records = Array.from({ length: 120 }, (_, index) => ({
  id: index + 1,
  status: index % 2 === 0 ? 'hidden-height-0' : 'visible',
  text: `row ${index + 1} visible content`
}));

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
    <span id="issue5115State"></span>
  `;
  container.before(toolbar);

  const tableInstance = new VTable.ListTable({
    container,
    records,
    columns: [
      { field: 'id', title: 'ID', width: 80 },
      { field: 'status', title: 'Status', width: 160 },
      { field: 'text', title: 'Text', width: 260 }
    ],
    widthMode: 'standard',
    heightMode: 'autoHeight',
    defaultRowHeight: 40,
    bottomFrozenRowCount: 2,
    customComputeRowHeight: ({ row }) => {
      if (row > 0 && (row - 1) % 2 === 0) {
        return 0;
      }
      return 'auto';
    }
  });

  const check = () => {
    const proxy = tableInstance.scenegraph.proxy;
    const bodyStart = tableInstance.frozenRowCount;
    const bodyHeight =
      tableInstance.tableNoFrameHeight - tableInstance.getFrozenRowsHeight() - tableInstance.getBottomFrozenRowsHeight();
    const renderedHeight = tableInstance.getRowsHeight(bodyStart, proxy.rowEnd);
    const zeroHeight = tableInstance.getRowHeight(tableInstance.columnHeaderLevelCount) === 0;
    const pass = zeroHeight && renderedHeight >= bodyHeight;
    const state = document.getElementById('issue5115State')!;
    state.textContent =
      `${pass ? 'PASS' : 'FAIL'} | zeroHeight=${zeroHeight} renderedHeight=${renderedHeight} ` +
      `bodyHeight=${bodyHeight} rowEnd=${proxy.rowEnd}`;
    return { pass, zeroHeight, renderedHeight, bodyHeight, rowEnd: proxy.rowEnd };
  };

  document.getElementById('issue5115Check')!.addEventListener('click', check);

  window.tableInstance = tableInstance;
  (window as any).issue5115Check = check;

  setTimeout(check, 0);
}
