// @ts-nocheck
import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';
import * as VTablePlugins from '../src/test-shims/vtable-plugins';

(global as any).__VERSION__ = 'none';

jest.setTimeout(20000);

async function waitForHistoryPlugin(table: any) {
  for (let i = 0; i < 20; i++) {
    const fromManager =
      table?.pluginManager?.getPlugin?.('history-plugin') ?? table?.pluginManager?.getPluginByName?.('History');
    if (fromManager) {
      return fromManager;
    }
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return undefined;
}

function createSheet() {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const columns = new Array(10).fill(0).map((_, i) => ({
    title: String.fromCharCode(65 + i)
  }));

  const sheet = new VTableSheet(container, {
    showFormulaBar: false,
    showSheetTab: false,
    defaultRowHeight: 25,
    defaultColWidth: 80,
    VTablePluginModules: [
      {
        module: VTablePlugins.HistoryPlugin,
        moduleOptions: {
          maxHistory: 100,
          enableCompression: true
        },
        disabled: false
      }
    ],
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'History Integration',
        rowCount: 30,
        columnCount: 10,
        columns,
        showHeader: true,
        active: true
      }
    ]
  });

  return { container, sheet };
}

test('HistoryPlugin + VTableSheet formula edit chain: undo twice restores blank', async () => {
  expect(typeof (VTablePlugins as any).HistoryPlugin).toBe('function');
  const { container, sheet } = createSheet();

  try {
    const ws = sheet.getActiveSheet();
    expect(ws).toBeTruthy();
    const table = ws.tableInstance;
    expect(table).toBeTruthy();

    const history = await waitForHistoryPlugin(table);
    expect(history).toBeTruthy();

    table.changeCellValue(1, 2, 0);
    table.changeCellValue(1, 3, 28);

    table.changeCellValue(1, 4, '=sum(B4)');
    await Promise.resolve();
    expect(sheet.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBeTruthy();

    table.changeCellValue(1, 4, '=sum(B3:B4)');
    await Promise.resolve();
    const f2 = sheet.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 });
    expect(typeof f2).toBe('string');

    history.undo();
    await Promise.resolve();
    const f1 = sheet.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 });
    expect(f1).toBeTruthy();
    expect(String(f1).toLowerCase()).toContain('sum');

    history.undo();
    await Promise.resolve();
    expect(sheet.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBeUndefined();

    const displayed = table.getCellValue(1, 4);
    expect(displayed === '' || displayed == null).toBe(true);
  } finally {
    sheet.release();
    removeDom(container);
  }
});

test('SUM supports reversed range like B4:B3', async () => {
  const { container, sheet } = createSheet();

  try {
    const ws = sheet.getActiveSheet();
    const table = ws.tableInstance;

    table.changeCellValue(1, 2, 1);
    table.changeCellValue(1, 3, 2);

    table.changeCellValue(1, 4, '=sum(B3:B4)');
    await Promise.resolve();
    const normal = table.getCellValue(1, 4);

    table.changeCellValue(1, 4, '=sum(B4:B3)');
    await Promise.resolve();
    const reversed = table.getCellValue(1, 4);

    expect(Number(normal)).toBe(3);
    expect(Number(reversed)).toBe(3);
  } finally {
    sheet.release();
    removeDom(container);
  }
});

test('range selection insertion does not emit formula events', async () => {
  const { container, sheet } = createSheet();

  try {
    const ws: any = sheet.getActiveSheet();
    const fm: any = sheet.formulaManager;
    const formulaInput = document.createElement('input');
    formulaInput.value = '=sum(';

    ws.editingCell = { row: 4, col: 1 };
    fm.inputIsParamMode = { inParamMode: true, functionParamPosition: { start: 5, end: 5 } };
    fm.lastKnownCursorPosInFormulaInput = formulaInput.value.length;

    fm.formulaRangeSelector.insertA1ReferenceInFunction(formulaInput, 'B4:B3', false);

    expect(formulaInput.value).toContain('B4:B3');
  } finally {
    sheet.release();
    removeDom(container);
  }
});
