import { VTableSheet } from '../src/index';
import { createDiv, removeDom } from './dom';

type MergeRange = { start: { col: number; row: number }; end: { col: number; row: number } };
type CustomMergeItem = { range: MergeRange };
type SceneCell = {
  mergeStartRow?: number;
  mergeEndRow?: number;
  mergeStartCol?: number;
  mergeEndCol?: number;
};
type TableInstance = {
  mergeCells: (startCol: number, startRow: number, endCol: number, endRow: number) => void;
  addRecord: (record: unknown, recordIndex: number) => void;
  deleteRecords: (recordIndexs: number[]) => void;
  addColumns: (columns: unknown[], colIndex?: number, isMaintainArrayData?: boolean) => void;
  deleteColumns: (deleteColIndexs: number[]) => void;
  scenegraph: { getCell: (col: number, row: number, includeMerged?: boolean) => SceneCell };
  options: { customMergeCell?: CustomMergeItem[] };
};
type SheetInstance = { activeWorkSheet?: { tableInstance?: TableInstance } };
type ExpectFn = (value: unknown) => {
  toBe: (expected: unknown) => void;
  toEqual: (expected: unknown) => void;
  toBeTruthy: () => void;
  toBeUndefined: () => void;
};
type GlobalTest = {
  describe: (name: string, fn: () => void) => void;
  test: (name: string, fn: (done?: () => void) => void) => void;
  expect: ExpectFn;
  beforeEach: (fn: () => void) => void;
  afterEach: (fn: () => void) => void;
  __VERSION__?: string;
};

const globals = globalThis as unknown as GlobalTest;
const { describe, test, expect, beforeEach, afterEach } = globals;

globals.__VERSION__ = 'none';

describe('VTableSheet merge cell adjust on delete record', () => {
  let container: HTMLElement;
  let sheetInstance: VTableSheet | null = null;

  beforeEach(() => {
    container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';
  });

  afterEach(() => {
    if (sheetInstance) {
      sheetInstance.release();
      sheetInstance = null;
    }
    removeDom(container);
  });

  test('deleteRecords updates scenegraph mergeStart/End after customMergeCell changes', () => {
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

    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data,
          active: true,
          firstRowAsHeader: true
        }
      ]
    });

    const table = (sheetInstance as unknown as SheetInstance).activeWorkSheet?.tableInstance;
    if (!table) {
      throw new Error('tableInstance not found');
    }

    table.mergeCells(1, 2, 3, 5);
    const mergedCell = table.scenegraph.getCell(1, 2, true);
    expect(mergedCell.mergeStartRow).toBe(2);
    expect(mergedCell.mergeEndRow).toBe(5);

    table.deleteRecords([3]);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    const customMergeCell = table.options.customMergeCell as CustomMergeItem[];
    expect(customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(customMergeCell[0].range.end).toEqual({ col: 3, row: 4 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartRow).toBe(2);
    expect(mergedCellAfter.mergeEndRow).toBe(4);
  });

  test('deleteColumns updates customMergeCell range after column deletion', () => {
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

    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data,
          active: true,
          firstRowAsHeader: true
        }
      ]
    });

    const table = (sheetInstance as unknown as SheetInstance).activeWorkSheet?.tableInstance;
    if (!table) {
      throw new Error('tableInstance not found');
    }

    table.mergeCells(1, 2, 3, 5);
    const mergedCell = table.scenegraph.getCell(1, 2, true);
    expect(mergedCell.mergeStartCol).toBe(1);
    expect(mergedCell.mergeEndCol).toBe(3);

    table.deleteColumns([2]);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    const customMergeCell = table.options.customMergeCell as CustomMergeItem[];
    expect(customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(customMergeCell[0].range.end).toEqual({ col: 2, row: 5 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartCol).toBe(1);
    expect(mergedCellAfter.mergeEndCol).toBe(2);
  });

  test('addRecord expands customMergeCell range when inserting within merged rows', () => {
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

    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data,
          active: true,
          firstRowAsHeader: true
        }
      ]
    });

    const table = (sheetInstance as unknown as SheetInstance).activeWorkSheet?.tableInstance;
    if (!table) {
      throw new Error('tableInstance not found');
    }

    table.mergeCells(1, 2, 3, 5);
    table.addRecord([100, 200, 300, 400, 500], 2);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    const customMergeCell = table.options.customMergeCell as CustomMergeItem[];
    expect(customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(customMergeCell[0].range.end).toEqual({ col: 3, row: 6 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartRow).toBe(2);
    expect(mergedCellAfter.mergeEndRow).toBe(6);
  });

  test('addColumns expands customMergeCell range when inserting within merged columns', () => {
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

    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data,
          active: true,
          firstRowAsHeader: true
        }
      ]
    });

    const table = (sheetInstance as unknown as SheetInstance).activeWorkSheet?.tableInstance;
    if (!table) {
      throw new Error('tableInstance not found');
    }

    table.mergeCells(1, 2, 3, 5);
    table.addColumns([{ title: 'X', width: 100 }], 2, true);

    expect(Array.isArray(table.options.customMergeCell)).toBe(true);
    const customMergeCell = table.options.customMergeCell as CustomMergeItem[];
    expect(customMergeCell[0].range.start).toEqual({ col: 1, row: 2 });
    expect(customMergeCell[0].range.end).toEqual({ col: 4, row: 5 });

    const mergedCellAfter = table.scenegraph.getCell(1, 2, true);
    expect(mergedCellAfter.mergeStartCol).toBe(1);
    expect(mergedCellAfter.mergeEndCol).toBe(4);
  });

  test('deleteRecords clears merge when fully deleted', (done?: () => void) => {
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

    sheetInstance = new VTableSheet(container, {
      showSheetTab: false,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          data,
          active: true,
          firstRowAsHeader: true
        }
      ]
    });

    const table = (sheetInstance as unknown as SheetInstance).activeWorkSheet?.tableInstance;
    if (!table) {
      throw new Error('tableInstance not found');
    }

    table.mergeCells(1, 2, 3, 5);
    table.deleteRecords([4, 3, 2, 1]);

    setTimeout(() => {
      expect(Array.isArray(table.options.customMergeCell)).toBe(true);
      expect((table.options.customMergeCell as CustomMergeItem[]).length).toBe(0);
      const cell = table.scenegraph.getCell(1, 2);
      expect(cell.mergeStartCol).toBeUndefined();
      expect(cell.mergeEndCol).toBeUndefined();
      expect(cell.mergeStartRow).toBeUndefined();
      expect(cell.mergeEndRow).toBeUndefined();
      done?.();
    }, 0);
  });
});
