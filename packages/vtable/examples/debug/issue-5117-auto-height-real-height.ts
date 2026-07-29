import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

const records = Array.from({ length: 60 }, (_, index) => ({
  id: index + 1,
  name: `row-${index + 1}`,
  desc:
    index % 3 === 0
      ? 'long text long text long text long text long text long text long text long text long text'
      : 'short'
}));

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  document.getElementById('issue5117Toolbar')?.remove();
  container.style.width = '760px';
  container.style.height = '420px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5117Toolbar';
  toolbar.style.cssText = 'height: 48px; font-size: 12px; display: flex; gap: 12px; align-items: center;';
  toolbar.innerHTML = `
    <button id="issue5117Check">check</button>
    <span id="issue5117State"></span>
  `;
  container.before(toolbar);

  const realHeights: Array<number | undefined> = [];
  const minRowHeight = 64;
  const tableInstance = new VTable.ListTable({
    container,
    records,
    columns: [
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: 'Name', width: 120 },
      {
        field: 'desc',
        title: 'Description',
        width: 280,
        style: {
          autoWrapText: true
        }
      }
    ],
    widthMode: 'standard',
    heightMode: 'autoHeight',
    customComputeRowHeight: ({ row, realHeight }) => {
      realHeights[row] = realHeight;
      return Math.max(realHeight ?? 0, minRowHeight);
    }
  });

  const check = () => {
    const bodyRow = tableInstance.columnHeaderLevelCount;
    const realHeight = realHeights[bodyRow];
    const rowHeight = tableInstance.getRowHeight(bodyRow);
    const pass = typeof realHeight === 'number' && rowHeight === Math.max(realHeight, minRowHeight);
    const state = document.getElementById('issue5117State')!;
    state.textContent = `${pass ? 'PASS' : 'FAIL'} | realHeight=${realHeight} rowHeight=${rowHeight}`;
    return { pass, realHeight, rowHeight };
  };

  document.getElementById('issue5117Check')!.addEventListener('click', check);

  window.tableInstance = tableInstance;
  (window as any).issue5117Check = check;

  setTimeout(check, 0);
}
