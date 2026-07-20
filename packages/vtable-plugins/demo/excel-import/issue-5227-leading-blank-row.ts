import ExcelJS from 'exceljs';
import * as VTable from '@visactor/vtable';
import { parseWorksheetToSheetData } from '../../src/excel-import/excel';

const CONTAINER_ID = 'vTable';

const removeDemoToolbar = () => {
  document.getElementById('issue5227Toolbar')?.remove();
};

const setStatus = (message: string, pass: boolean) => {
  const statusNode = document.getElementById('issue5227Status');
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.style.color = pass ? '#237804' : '#cf1322';
};

const createWorksheetWithLeadingBlankRow = () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.getCell('A2').value = 'Name';
  worksheet.getCell('B2').value = 'Age';
  worksheet.getCell('A3').value = 'Alice';
  worksheet.getCell('B3').value = 30;
  return worksheet;
};

const renderImportedData = (container: HTMLElement, data: unknown[][]) => {
  if ((window as any).tableInstance) {
    (window as any).tableInstance.release();
  }

  const maxColumnCount = data.reduce((max, row) => Math.max(max, row.length), 0);
  const records = data.map((row, index) => {
    const record: Record<string, unknown> = { rowIndex: index + 1 };
    for (let col = 0; col < maxColumnCount; col++) {
      record[`col${col}`] = row[col] ?? null;
    }
    return record;
  });

  const columns: VTable.ColumnsDefine = [
    { field: 'rowIndex', title: 'Excel Row', width: 100 },
    ...Array.from({ length: maxColumnCount }, (_, col) => ({
      field: `col${col}`,
      title: String.fromCharCode(65 + col),
      width: 140
    }))
  ];

  const tableInstance = new VTable.ListTable({
    container,
    columns,
    records,
    defaultRowHeight: 36
  });

  (window as any).tableInstance = tableInstance;
};

export function createTable() {
  removeDemoToolbar();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '640px';
  container.style.height = '360px';
  container.innerHTML = '';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5227Toolbar';
  toolbar.style.cssText = [
    'display: flex',
    'gap: 8px',
    'align-items: center',
    'height: 48px',
    'font-size: 12px'
  ].join(';');
  toolbar.innerHTML = `
    <button id="issue5227Import">导入首行空白的 Excel</button>
    <span>预期：保留空白第 1 行，rowCount=3。</span>
    <strong id="issue5227Status"></strong>
  `;
  container.before(toolbar);

  document.getElementById('issue5227Import')?.addEventListener('click', async () => {
    const worksheet = createWorksheetWithLeadingBlankRow();
    const result = await parseWorksheetToSheetData(worksheet, 0);
    const pass =
      result.rowCount === 3 &&
      result.columnCount === 2 &&
      result.data[0]?.[0] === null &&
      result.data[1]?.[0] === 'Name' &&
      result.data[2]?.[0] === 'Alice';

    renderImportedData(container, result.data);
    setStatus(
      `${pass ? 'PASS' : 'FAIL'} | rowCount=${result.rowCount}, columnCount=${result.columnCount}, data=${JSON.stringify(
        result.data
      )}`,
      pass
    );
  });

  setStatus('READY', true);
}
