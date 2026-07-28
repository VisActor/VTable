import { VTableSheet } from '../../src/index';

const CONTAINER_ID = 'vTable';
const SHEET_KEY = 'issue5234';

const removeDemoToolbar = () => {
  document.getElementById('issue5234Toolbar')?.remove();
};

const setStatus = (message: string, pass: boolean) => {
  const statusNode = document.getElementById('issue5234Status');
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.style.color = pass ? '#237804' : '#cf1322';
};

const getActiveWorkSheet = (sheetInstance: VTableSheet) => sheetInstance.getActiveSheet();

const getCellValue = (sheetInstance: VTableSheet, col: number, row: number) => {
  const worksheet = getActiveWorkSheet(sheetInstance);
  return worksheet.tableInstance?.getCellValue(col, row);
};

const getFormulaValue = (sheetInstance: VTableSheet, col: number, row: number) =>
  sheetInstance.formulaManager.getCellValue({
    sheet: SHEET_KEY,
    row,
    col
  }).value;

const collectDependents = (
  sheetInstance: VTableSheet,
  cell: { sheet: string; row: number; col: number },
  visited = new Set<string>()
): Array<{ sheet: string; row: number; col: number }> => {
  const cellKey = `${cell.sheet}!${cell.row},${cell.col}`;
  if (visited.has(cellKey)) {
    return [];
  }
  visited.add(cellKey);

  const directDependents = sheetInstance.formulaManager.getCellDependents(cell);
  return directDependents.reduce<Array<{ sheet: string; row: number; col: number }>>(
    (dependents, dependent) => dependents.concat(dependent, collectDependents(sheetInstance, dependent, visited)),
    []
  );
};

const syncDependentsToTable = (sheetInstance: VTableSheet, col: number, row: number) => {
  const worksheet = getActiveWorkSheet(sheetInstance);
  const dependents = collectDependents(sheetInstance, {
    sheet: SHEET_KEY,
    row,
    col
  });

  dependents.forEach(dependent => {
    const result = sheetInstance.formulaManager.getCellValue(dependent);
    worksheet.tableInstance?.changeCellValue(
      dependent.col,
      dependent.row,
      result.error ? '#ERROR!' : result.value,
      false,
      false
    );
  });
};

const setCell = (sheetInstance: VTableSheet, col: number, row: number, value: unknown) => {
  const worksheet = getActiveWorkSheet(sheetInstance);
  sheetInstance.formulaManager.setCellContent(
    {
      sheet: SHEET_KEY,
      row,
      col
    },
    value
  );

  if (typeof value === 'string' && value.startsWith('=')) {
    const result = sheetInstance.formulaManager.getCellValue({
      sheet: SHEET_KEY,
      row,
      col
    });
    worksheet.tableInstance?.changeCellValue(col, row, result.error ? '#ERROR!' : result.value, false, false);
  } else {
    worksheet.tableInstance?.changeCellValue(col, row, value, false, false);
  }

  syncDependentsToTable(sheetInstance, col, row);
};

export function createTable() {
  removeDemoToolbar();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '760px';
  container.style.height = '420px';

  const toolbar = document.createElement('div');
  toolbar.id = 'issue5234Toolbar';
  toolbar.style.cssText = ['display: flex', 'gap: 8px', 'align-items: center', 'height: 48px', 'font-size: 12px'].join(
    ';'
  );
  toolbar.innerHTML = `
    <button id="issue5234Reset">重置公式链</button>
    <button id="issue5234ChangeB3">修改 B3=20</button>
    <button id="issue5234ChangeB2">修改 B2=5 并检查</button>
    <span>公式：C2=B2，D2=C2+B3；预期最终 C2=5、D2=25。</span>
    <strong id="issue5234Status"></strong>
  `;
  container.before(toolbar);

  const sheetInstance = new VTableSheet(container, {
    showFormulaBar: true,
    showSheetTab: true,
    defaultRowHeight: 36,
    defaultColWidth: 120,
    sheets: [
      {
        sheetKey: SHEET_KEY,
        sheetTitle: 'Issue 5234',
        active: true,
        rowCount: 12,
        columnCount: 8,
        showHeader: false,
        data: [
          ['A', 'B', 'C', 'D'],
          ['', 1, '', ''],
          ['', 10, '', '']
        ]
      }
    ]
  });

  const resetFormulaChain = () => {
    setCell(sheetInstance, 1, 1, 1); // B2
    setCell(sheetInstance, 1, 2, 10); // B3
    setCell(sheetInstance, 2, 1, '=B2'); // C2
    setCell(sheetInstance, 3, 1, '=C2+B3'); // D2

    const c2 = getCellValue(sheetInstance, 2, 1);
    const d2 = getCellValue(sheetInstance, 3, 1);
    setStatus(`READY | C2=${String(c2)}, D2=${String(d2)}`, true);
  };

  const changeB3 = () => {
    setCell(sheetInstance, 1, 2, 20);
    const d2 = getCellValue(sheetInstance, 3, 1);
    setStatus(`STEP1 | B3=20, D2=${String(d2)}，预期 21`, d2 === 21);
  };

  const changeB2AndCheck = () => {
    setCell(sheetInstance, 1, 1, 5);

    const c2 = getCellValue(sheetInstance, 2, 1);
    const d2 = getCellValue(sheetInstance, 3, 1);
    const engineC2 = getFormulaValue(sheetInstance, 2, 1);
    const engineD2 = getFormulaValue(sheetInstance, 3, 1);
    const pass = c2 === 5 && d2 === 25 && engineC2 === 5 && engineD2 === 25;

    setStatus(
      `${pass ? 'PASS' : 'FAIL'} | table C2=${String(c2)}, D2=${String(d2)}; engine C2=${String(engineC2)}, D2=${String(
        engineD2
      )}; 预期 C2=5, D2=25`,
      pass
    );
  };

  document.getElementById('issue5234Reset')?.addEventListener('click', resetFormulaChain);
  document.getElementById('issue5234ChangeB3')?.addEventListener('click', changeB3);
  document.getElementById('issue5234ChangeB2')?.addEventListener('click', changeB2AndCheck);

  resetFormulaChain();

  const release = sheetInstance.release.bind(sheetInstance);
  sheetInstance.release = () => {
    removeDemoToolbar();
    release();
  };

  (window as any).sheetInstance = sheetInstance;
}
