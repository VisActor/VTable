import { resolveSheetKey } from '../../src/history/sheet-key';
import { captureSnapshot, cloneRecord } from '../../src/history/snapshot';
import {
  applyCellContent,
  captureCellPreChangeContent,
  popCellPreChangeContent,
  refreshDependentDisplays
} from '../../src/history/formula';

test('resolveSheetKey returns cached key and handles missing vtableSheet', () => {
  expect(resolveSheetKey({ vtableSheet: undefined, table: null, cached: undefined })).toEqual({
    sheetKey: undefined,
    cached: undefined
  });

  expect(resolveSheetKey({ vtableSheet: {}, table: null, cached: 's1' })).toEqual({
    sheetKey: 's1',
    cached: 's1'
  });
});

test('resolveSheetKey finds key by workSheetInstances tableInstance match and by active sheet', () => {
  const table: any = {};
  const worksheet: any = { tableInstance: table };
  const vtableSheet1: any = { workSheetInstances: new Map([['sheet1', worksheet]]) };
  expect(resolveSheetKey({ vtableSheet: vtableSheet1, table, cached: undefined })).toEqual({
    sheetKey: 'sheet1',
    cached: 'sheet1'
  });

  const vtableSheet2: any = { getActiveSheet: () => ({ getKey: () => 'active' }) };
  expect(resolveSheetKey({ vtableSheet: vtableSheet2, table: null, cached: undefined })).toEqual({
    sheetKey: 'active',
    cached: 'active'
  });
});

test('captureSnapshot handles non-array inputs and cloneRecord primitives', () => {
  const table: any = { options: { columns: null, customMergeCell: undefined }, records: {} };
  const state: any = { prevColumnsSnapshot: [], prevMergeSnapshot: undefined, prevRecordsSnapshot: [] };
  captureSnapshot(table, state);
  expect(state.prevColumnsSnapshot).toBeNull();
  expect(state.prevMergeSnapshot).toBeUndefined();
  expect(state.prevRecordsSnapshot).toBeNull();

  expect(cloneRecord(1)).toBe(1);
  expect(cloneRecord({ a: 1 })).toEqual({ a: 1 });
  expect(cloneRecord([1, 2])).toEqual([1, 2]);
});

test('captureSnapshot deep clones merge ranges', () => {
  const table: any = {
    options: {
      columns: [],
      customMergeCell: [
        {
          range: { start: { col: 0, row: 0 }, end: { col: 1, row: 1 } }
        }
      ]
    },
    records: []
  };
  const state: any = { prevColumnsSnapshot: null, prevMergeSnapshot: undefined, prevRecordsSnapshot: null };
  captureSnapshot(table, state);
  expect(state.prevMergeSnapshot).toBeDefined();
  expect(state.prevMergeSnapshot[0].range).not.toBe(table.options.customMergeCell[0].range);
});

test('capture/pop pre-change content normalizes formula and uses fallback', () => {
  const store = new Map<string, any>();
  const fm = { getCellFormula: () => 'SUM(A1:A2)' };
  captureCellPreChangeContent({ sheetKey: 's', row: 1, col: 2, currentValue: 'x', formulaManager: fm, store });
  expect(popCellPreChangeContent({ sheetKey: 's', row: 1, col: 2, fallbackOldContent: 'y', store })).toBe(
    '=SUM(A1:A2)'
  );

  expect(popCellPreChangeContent({ sheetKey: undefined, row: 1, col: 2, fallbackOldContent: 'y', store })).toBe('y');
});

test('applyCellContent falls back to table when formulaManager missing or throws', () => {
  const calls: any[] = [];
  const table: any = { changeCellValue: (...args: any[]) => calls.push(args) };

  applyCellContent({ table, sheetKey: undefined, row: 0, col: 0, content: 'A', formulaManager: undefined });
  expect(calls[calls.length - 1][2]).toBe('A');

  const fm = {
    setCellContent: () => {
      throw new Error('x');
    },
    getCellValue: () => ({ value: 1 })
  };
  applyCellContent({ table, sheetKey: 's', row: 0, col: 0, content: '=A1', formulaManager: fm });
  expect(calls[calls.length - 1][2]).toBe('=A1');
});

test('applyCellContent writes calculated display and refreshes dependents', () => {
  const calls: any[] = [];
  const table: any = { changeCellValue: (...args: any[]) => calls.push(args) };
  const deps = [
    { sheet: 's', row: 0, col: 1 },
    { sheet: 's', row: 0, col: 2 }
  ];
  const fm: any = {
    setCellContent: jest.fn(),
    getCellValue: (cell: any) => {
      if (cell.col === 1) {
        return { value: 3 };
      }
      if (cell.col === 2) {
        return { error: 'err' };
      }
      return { value: 2 };
    },
    getCellDependents: (cell: any) => {
      if (cell.col === 0) {
        return deps;
      }
      return [];
    }
  };

  applyCellContent({ table, sheetKey: 's', row: 0, col: 0, content: '=A1', formulaManager: fm });
  expect(calls.map(c => c[2])).toContain(2);
  expect(calls.map(c => c[2])).toContain(3);
  expect(calls.map(c => c[2])).toContain('#ERROR!');
});

test('refreshDependentDisplays respects maxCells and skips other sheets', () => {
  const calls: any[] = [];
  const table: any = { changeCellValue: (...args: any[]) => calls.push(args) };
  const fm: any = {
    getCellValue: () => ({ value: 1 }),
    getCellDependents: (cell: any) => {
      if (cell.col === 0) {
        return [
          { sheet: 's', row: 0, col: 1 },
          { sheet: 'other', row: 0, col: 2 }
        ];
      }
      if (cell.col === 1) {
        return [{ sheet: 's', row: 0, col: 3 }];
      }
      return [];
    }
  };

  refreshDependentDisplays({
    table,
    sheetKey: 's',
    startCell: { sheet: 's', row: 0, col: 0 },
    formulaManager: fm,
    maxCells: 1
  });
  expect(calls.length).toBe(1);
});
