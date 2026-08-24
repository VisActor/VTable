import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  const status = document.createElement('div');
  status.id = 'issueCellTypeUndefinedStatus';
  status.style.cssText = 'height: 32px; line-height: 32px; font-size: 13px; color: #333;';
  container.parentElement?.insertBefore(status, container);

  const option: VTable.ListTableConstructorOptions = {
    records: [{ name: 'A' }],
    columns: [
      {
        field: 'name',
        title: 'Name',
        cellType: () => undefined
      }
    ]
  };

  try {
    const tableInstance = new VTable.ListTable(container, option);
    (window as any).tableInstance = tableInstance;
    const cellType = tableInstance.getCellType(0, tableInstance.columnHeaderLevelCount);
    status.textContent = `PASS | cellType=${cellType}, value=${tableInstance.getCellValue(
      0,
      tableInstance.columnHeaderLevelCount
    )}`;
  } catch (err) {
    status.textContent = `FAIL | ${(err as Error).message}`;
  }
}
