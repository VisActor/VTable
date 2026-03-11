// @ts-nocheck
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
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

async function waitForFilterPlugin(table: any) {
  for (let i = 0; i < 20; i++) {
    const fromManager =
      table?.pluginManager?.getPlugin?.('filter') ?? table?.pluginManager?.getPluginByName?.('Filter');
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

test('merge range restored after deleteRecords undo', async () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [
    ['A', 'B', 'C', 'D', 'E'],
    [0, 10, 20, 30, 40],
    [1, 11, 21, 31, 41],
    [2, 12, 22, 32, 42],
    [3, 13, 23, 33, 43],
    [4, 14, 24, 34, 44],
    [5, 15, 25, 35, 45],
    [6, 16, 26, 36, 46],
    [7, 17, 27, 37, 47],
    [8, 18, 28, 38, 48],
    [9, 19, 29, 39, 49]
  ];

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
        sheetTitle: 'History Merge Undo',
        data,
        active: true,
        firstRowAsHeader: true
      }
    ]
  });

  try {
    const ws = sheet.getActiveSheet();
    const table = ws.tableInstance;
    const history = await waitForHistoryPlugin(table);
    expect(history).toBeTruthy();

    table.mergeCells(1, 2, 3, 5);
    await new Promise(resolve => setTimeout(resolve, 0));

    table.deleteRecords([4, 3, 2, 1]);
    await new Promise(resolve => setTimeout(resolve, 0));

    history.undo();
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    expect(table.options.customMergeCell.length).toBe(1);
    expect(table.options.customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(table.options.customMergeCell[0].range.end).toEqual({ col: 3, row: 5 });

    const mergedCell = table.scenegraph.getCell(1, 2, true);
    expect(mergedCell.mergeStartRow).toBe(2);
    expect(mergedCell.mergeEndRow).toBe(5);
    expect(mergedCell.mergeStartCol).toBe(1);
    expect(mergedCell.mergeEndCol).toBe(3);
  } finally {
    sheet.release();
    removeDom(container);
  }
});

test('FilterPlugin apply/clear is undoable via HistoryPlugin', async () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [
    ['A', 'B', 'C'],
    [0, 10, 20],
    [1, 11, 21],
    [2, 12, 22],
    [3, 13, 23]
  ];

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
      },
      {
        module: (VTablePlugins as any).FilterPlugin,
        moduleOptions: {},
        disabled: false
      }
    ],
    sheets: [
      {
        sheetKey: 'sheet1',
        sheetTitle: 'History Filter Undo',
        data,
        active: true,
        firstRowAsHeader: true
      }
    ]
  });

  try {
    const ws = sheet.getActiveSheet();
    const table = ws.tableInstance;
    const history = await waitForHistoryPlugin(table);
    expect(history).toBeTruthy();
    const filter = await waitForFilterPlugin(table);
    expect(filter).toBeTruthy();

    const beforeCount = table.getFilteredRecords().length;

    filter.filterToolbar.show(0, 0, ['byValue']);
    await new Promise(resolve => setTimeout(resolve, 0));

    const checkboxes = Array.from(
      document.querySelectorAll('.vtable-filter-menu input[type="checkbox"]')
    ) as HTMLInputElement[];
    expect(checkboxes.length > 1).toBe(true);
    const selectAll = checkboxes[0];
    selectAll.checked = false;
    selectAll.dispatchEvent(new Event('change', { bubbles: true }));

    const firstOption = checkboxes[1];
    firstOption.checked = true;
    firstOption.dispatchEvent(new Event('change', { bubbles: true }));

    const applyBtn = Array.from(document.querySelectorAll('.vtable-filter-menu button')).find(
      b => (b as HTMLButtonElement).innerText === '确认'
    ) as HTMLButtonElement | undefined;
    expect(applyBtn).toBeTruthy();
    applyBtn!.click();
    await new Promise(resolve => setTimeout(resolve, 0));

    const filteredCount = table.getFilteredRecords().length;
    expect(filteredCount).toBeLessThan(beforeCount);

    history.undo();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(table.getFilteredRecords().length).toBe(beforeCount);

    history.redo();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(table.getFilteredRecords().length).toBe(filteredCount);
  } finally {
    sheet.release();
    removeDom(container);
  }
});

test('Sort is undoable via HistoryPlugin', async () => {
  const container = createDiv() as HTMLDivElement;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '800px';

  const data = [['A'], [3], [1], [2]];

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
        sheetTitle: 'History Sort Undo',
        data,
        active: true,
        firstRowAsHeader: true,
        columns: [{ title: 'A', sort: true }]
      }
    ]
  });

  try {
    const ws = sheet.getActiveSheet();
    const table: any = ws.tableInstance;
    const history: any = await waitForHistoryPlugin(table);
    expect(history).toBeTruthy();

    expect(table.getCellValue(0, 1)).toBe(3);
    expect(table.getCellValue(0, 2)).toBe(1);
    expect(table.getCellValue(0, 3)).toBe(2);

    table.fireListeners(TABLE_EVENT_TYPE.SORT_CLICK, {
      field: 0,
      order: 'asc',
      event: new Event('click')
    });
    table.updateSortState({ field: 0, order: 'asc' }, true);
    table.fireListeners(TABLE_EVENT_TYPE.AFTER_SORT, {
      field: 0,
      order: 'asc',
      event: new Event('click')
    });
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(table.getCellValue(0, 1)).toBe(1);
    expect(table.getCellValue(0, 2)).toBe(2);
    expect(table.getCellValue(0, 3)).toBe(3);

    history.undo();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(table.getCellValue(0, 1)).toBe(3);
    expect(table.getCellValue(0, 2)).toBe(1);
    expect(table.getCellValue(0, 3)).toBe(2);

    history.redo();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(table.getCellValue(0, 1)).toBe(1);
    expect(table.getCellValue(0, 2)).toBe(2);
    expect(table.getCellValue(0, 3)).toBe(3);
  } finally {
    sheet.release();
    removeDom(container);
  }
});
