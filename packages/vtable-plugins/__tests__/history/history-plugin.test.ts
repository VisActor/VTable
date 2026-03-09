export {};

const BEFORE_KEYDOWN = 'before_keydown';
const CHANGE_CELL_VALUE = 'change_cell_value';
const CHANGE_CELL_VALUES = 'change_cell_values';
const ADD_RECORD = 'add_record';
const DELETE_RECORD = 'delete_record';
const UPDATE_RECORD = 'update_record';
const ADD_COLUMN = 'add_column';
const DELETE_COLUMN = 'delete_column';
const CHANGE_HEADER_POSITION = 'change_header_position';
const RESIZE_ROW = 'resize_row';
const RESIZE_ROW_END = 'resize_row_end';
const RESIZE_COLUMN = 'resize_column';
const RESIZE_COLUMN_END = 'resize_column_end';
const INITIALIZED = 'initialized';
const MERGE_CELLS = 'merge_cells';
const UNMERGE_CELLS = 'unmerge_cells';

jest.mock('@visactor/vtable', () => ({
  TABLE_EVENT_TYPE: {
    INITIALIZED,
    BEFORE_KEYDOWN,
    CHANGE_CELL_VALUE,
    CHANGE_CELL_VALUES,
    PASTED_DATA: 'pasted_data',
    MERGE_CELLS,
    UNMERGE_CELLS,
    ADD_RECORD,
    DELETE_RECORD,
    UPDATE_RECORD,
    ADD_COLUMN,
    DELETE_COLUMN,
    CHANGE_HEADER_POSITION,
    RESIZE_ROW,
    RESIZE_ROW_END,
    RESIZE_COLUMN,
    RESIZE_COLUMN_END
  }
}));

const { HistoryPlugin } = require('../../src/history');

function toA1(row: number, col: number) {
  let colStr = '';
  let temp = col + 1;
  while (temp > 0) {
    const mod = (temp - 1) % 26;
    colStr = String.fromCharCode(65 + mod) + colStr;
    temp = Math.floor((temp - 1) / 26);
  }
  return `${colStr}${row + 1}`;
}

function createVTableSheetEnv() {
  const handlers = new Map<string, Function[]>();
  const eventManager = {
    on: (type: string, cb: any) => {
      const list = handlers.get(type) || [];
      list.push(cb);
      handlers.set(type, list);
    },
    off: (type: string, cb: any) => {
      const list = handlers.get(type) || [];
      const idx = list.indexOf(cb);
      if (idx >= 0) {
        list.splice(idx, 1);
      }
      handlers.set(type, list);
    },
    emit: (type: string, event: any) => {
      (handlers.get(type) || []).forEach(cb => cb(event));
    }
  };

  const formulaStore = new Map<string, string>();
  const formulaManager = {
    formulaEngine: { updateSheetData: jest.fn() },
    formulaWorkingOnCell: false,
    getCellFormula: (cell: any) => formulaStore.get(`${cell.sheet}:${cell.row}:${cell.col}`),
    setCellContent: (cell: any, value: any) => {
      const key = `${cell.sheet}:${cell.row}:${cell.col}`;
      if (typeof value === 'string' && value.startsWith('=')) {
        formulaStore.set(key, value);
      } else {
        formulaStore.delete(key);
      }
    },
    normalizeSheetData: jest.fn(() => [['']]),
    exportFormulas: (sheetKey: string) => {
      const result: Record<string, string> = {};
      formulaStore.forEach((formula, key) => {
        const [sheet, rowStr, colStr] = key.split(':');
        if (sheet !== sheetKey) {
          return;
        }
        const row = Number(rowStr);
        const col = Number(colStr);
        result[toA1(row, col)] = formula;
      });
      return result;
    },
    getCellValue: (_cell: any) => ({ value: 28, error: undefined as string | undefined }),
    getCellDependents: (): any[] => []
  };

  const worksheet: any = { eventManager, tableInstance: null };
  const vtableSheet: any = {
    formulaManager,
    getWorkSheetByKey: (_sheetKey: string) => worksheet,
    workSheetInstances: new Map([['sheet1', worksheet]])
  };

  return { eventManager, formulaManager, vtableSheet, worksheet, formulaStore };
}

function createTableStub(env: any) {
  const changeCellValueCalls: any[] = [];
  const rowHeights = new Map<number, number>();
  const colWidths = new Map<number, number>();
  const updateCellContentCalls: any[] = [];

  const getCustomMergeCellFunc = (customMergeCell: any) => {
    if (typeof customMergeCell === 'function') {
      return customMergeCell;
    }
    if (Array.isArray(customMergeCell)) {
      return (col: number, row: number) => {
        return customMergeCell.find(item => {
          return (
            item.range.start.col <= col &&
            item.range.end.col >= col &&
            item.range.start.row <= row &&
            item.range.end.row >= row
          );
        });
      };
    }
    return undefined;
  };

  const shiftRowHeightsOnInsert = (rowIndex: number, count: number) => {
    const next = new Map<number, number>();
    rowHeights.forEach((h, k) => {
      next.set(k >= rowIndex ? k + count : k, h);
    });
    rowHeights.clear();
    next.forEach((v, k) => rowHeights.set(k, v));
  };

  const shiftRowHeightsOnDelete = (rowIndex: number, count: number) => {
    const sorted = Array.from({ length: count }, (_, i) => rowIndex + i).sort((a, b) => b - a);
    sorted.forEach(ri => {
      const next = new Map<number, number>();
      rowHeights.forEach((h, k) => {
        if (k === ri) {
          return;
        }
        next.set(k > ri ? k - 1 : k, h);
      });
      rowHeights.clear();
      next.forEach((v, k) => rowHeights.set(k, v));
    });
  };

  const table: any = {
    __vtableSheet: env.vtableSheet,
    options: { columns: [] as any[] },
    records: [] as any[],
    transpose: false,
    columnHeaderLevelCount: 1,
    rowHeaderLevelCount: 1,
    internalProps: {
      _heightResizedRowMap: new Set<number>(),
      _widthResizedColMap: new Set<number>(),
      customMergeCell: undefined
    },
    scenegraph: {
      updateCellContent: (col: number, row: number) => updateCellContentCalls.push([col, row]),
      updateNextFrame: jest.fn()
    },
    editorManager: { editingEditor: null },
    changeCellValue: (...args: any[]) => changeCellValueCalls.push(args),
    getCellOriginValue: (_col: number, _row: number): any => undefined,
    getCellValue: (col: number, row: number) => `${col},${row}`,
    getRowHeight: (row: number) => rowHeights.get(row) ?? 20,
    setRowHeight: (row: number, height: number) => {
      rowHeights.set(row, height);
      table.internalProps._heightResizedRowMap.add(row);
    },
    getColWidth: (col: number) => colWidths.get(col) ?? 80,
    setColWidth: (col: number, width: number) => {
      colWidths.set(col, width);
      table.internalProps._widthResizedColMap.add(col);
    },
    mergeCells: (startCol: number, startRow: number, endCol: number, endRow: number) => {
      if (!table.options.customMergeCell) {
        table.options.customMergeCell = [];
      } else if (typeof table.options.customMergeCell === 'function') {
        table.options.customMergeCell = [];
      }
      table.options.customMergeCell.push({
        text: table.getCellValue(startCol, startRow),
        range: {
          start: { col: startCol, row: startRow },
          end: { col: endCol, row: endRow }
        }
      });
      table.internalProps.customMergeCell = getCustomMergeCellFunc(table.options.customMergeCell);
      for (let i = startCol; i <= endCol; i++) {
        for (let j = startRow; j <= endRow; j++) {
          table.scenegraph.updateCellContent(i, j);
        }
      }
      table.scenegraph.updateNextFrame();
    },
    unmergeCells: (startCol: number, startRow: number, endCol: number, endRow: number) => {
      if (!table.options.customMergeCell) {
        table.options.customMergeCell = [];
      } else if (typeof table.options.customMergeCell === 'function') {
        table.options.customMergeCell = [];
      }
      table.options.customMergeCell = table.options.customMergeCell.filter((item: any) => {
        const { start, end } = item.range;
        return !(start.col === startCol && start.row === startRow && end.col === endCol && end.row === endRow);
      });
      table.internalProps.customMergeCell = getCustomMergeCellFunc(table.options.customMergeCell);
      for (let i = startCol; i <= endCol; i++) {
        for (let j = startRow; j <= endRow; j++) {
          table.scenegraph.updateCellContent(i, j);
        }
      }
      table.scenegraph.updateNextFrame();
    },
    addRecords: (records: any[], index?: number) => {
      if (typeof index === 'number') {
        shiftRowHeightsOnInsert(index + table.columnHeaderLevelCount, records.length);
        table.records.splice(index, 0, ...records);
      } else {
        table.records.push(...records);
      }
    },
    addRecord: (record: any, index: number) => {
      shiftRowHeightsOnInsert(index + table.columnHeaderLevelCount, 1);
      table.records.splice(index, 0, record);
    },
    deleteRecords: (indexs: number[]) => {
      const sorted = indexs.slice().sort((a, b) => b - a);
      sorted.forEach(i => {
        shiftRowHeightsOnDelete(i + table.columnHeaderLevelCount, 1);
        table.internalProps._heightResizedRowMap.delete(i + table.columnHeaderLevelCount);
        table.records.splice(i, 1);
      });
    },
    updateRecords: (records: any[], indexs: number[]) => {
      indexs.forEach((idx, i) => {
        table.records[idx] = records[i];
      });
    },
    addColumns: jest.fn(),
    deleteColumns: jest.fn(),
    changeHeaderPosition: jest.fn()
  };

  env.worksheet.tableInstance = table;
  return { table, changeCellValueCalls, rowHeights, colWidths, updateCellContentCalls };
}

function initPlugin(plugin: any, table: any) {
  plugin.run({}, 'noop', table);
}

test('undo/redo works for plain cell value changes', () => {
  const env = createVTableSheetEnv();
  const { table, changeCellValueCalls } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ row: 0, col: 0, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: 'A' }] } as any, CHANGE_CELL_VALUES, table);

  plugin.undo();
  expect(changeCellValueCalls[changeCellValueCalls.length - 1][2]).toBe('');

  plugin.redo();
  expect(changeCellValueCalls[changeCellValueCalls.length - 1][2]).toBe('A');
});

test('transaction groups multiple commands into one undo', () => {
  const env = createVTableSheetEnv();
  const { table, changeCellValueCalls } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.startTransaction();
  plugin.run({ row: 0, col: 0, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: 'A' }] } as any, CHANGE_CELL_VALUES, table);
  plugin.run({ row: 0, col: 1, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 1, currentValue: '', changedValue: 'B' }] } as any, CHANGE_CELL_VALUES, table);
  plugin.endTransaction();

  plugin.undo();
  const lastTwo = changeCellValueCalls.slice(-2).map(c => c[2]);
  expect(lastTwo).toEqual(['', '']);
});

test('cell compression keeps latest newContent for same cell', () => {
  const env = createVTableSheetEnv();
  const { table, changeCellValueCalls } = createTableStub(env);
  const plugin = new HistoryPlugin({ enableCompression: true });
  initPlugin(plugin, table);

  plugin.run({ row: 0, col: 0, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: 'A' }] } as any, CHANGE_CELL_VALUES, table);
  plugin.run({ row: 0, col: 0, currentValue: 'A' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: 'A', changedValue: 'B' }] } as any, CHANGE_CELL_VALUES, table);

  plugin.undo();
  expect(changeCellValueCalls[changeCellValueCalls.length - 1][2]).toBe('');
  plugin.redo();
  expect(changeCellValueCalls[changeCellValueCalls.length - 1][2]).toBe('B');
});

test('change_cell_values does not push when content unchanged or empty cleared', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ row: 9, col: 5, currentValue: undefined } as any, CHANGE_CELL_VALUE, table);
  plugin.run(
    { values: [{ row: 9, col: 5, currentValue: undefined, changedValue: '' }] } as any,
    CHANGE_CELL_VALUES,
    table
  );

  expect((plugin as any).undoStack.length).toBe(0);
});

test('resize_row_end does not push when height unchanged', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ row: 2 } as any, RESIZE_ROW, table);
  plugin.run({ row: 2, rowHeight: 20 } as any, RESIZE_ROW_END, table);

  expect((plugin as any).undoStack.length).toBe(0);
});

test('resize_column_end does not push when width unchanged', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ col: 2 } as any, RESIZE_COLUMN, table);
  plugin.run({ col: 2, colWidths: [80, 80, 80] } as any, RESIZE_COLUMN_END, table);

  expect((plugin as any).undoStack.length).toBe(0);
});

test('merge_cells pushes command and undo/redo restores merge config', () => {
  const env = createVTableSheetEnv();
  const { table, updateCellContentCalls } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  table.mergeCells(0, 1, 1, 2);
  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, MERGE_CELLS, table);
  expect((plugin as any).undoStack.length).toBe(1);
  expect(table.options.customMergeCell.length).toBe(1);

  plugin.undo();
  expect(table.options.customMergeCell).toBeUndefined();
  expect(updateCellContentCalls.length).toBeGreaterThan(0);

  plugin.redo();
  expect(Array.isArray(table.options.customMergeCell)).toBe(true);
  expect(table.options.customMergeCell.length).toBe(1);
});

test('unmerge_cells pushes command and undo restores previous merge', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  table.mergeCells(0, 1, 1, 2);
  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, MERGE_CELLS, table);
  table.unmergeCells(0, 1, 1, 2);
  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, UNMERGE_CELLS, table);
  expect((plugin as any).undoStack.length).toBe(2);
  expect(table.options.customMergeCell.length).toBe(0);

  plugin.undo();
  expect(table.options.customMergeCell.length).toBe(1);
});

test('merge_cells does not push when merge config unchanged', () => {
  const env = createVTableSheetEnv();
  const table: any = {
    __vtableSheet: env.vtableSheet,
    options: { columns: [] as any[] },
    internalProps: {},
    mergeCells: () => {},
    unmergeCells: () => {},
    editorManager: { editingEditor: null }
  };
  env.worksheet.tableInstance = table;

  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, MERGE_CELLS, table);
  expect((plugin as any).undoStack.length).toBe(0);
});

test('merge_cells does not push when customMergeCell function unchanged', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  const fn = (_col: number, _row: number): any => undefined;
  table.options.customMergeCell = fn;
  table.internalProps.customMergeCell = fn;
  initPlugin(plugin, table);

  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, MERGE_CELLS, table);
  expect((plugin as any).undoStack.length).toBe(0);
});

test('merge_cells pushes when merge config differs in range structure', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  initPlugin(plugin, table);
  (plugin as any).prevMergeSnapshot = [{ text: 'x' }];

  table.options.customMergeCell = [
    {
      text: 'x',
      range: { start: { col: 0, row: 1 }, end: { col: 1, row: 2 } }
    }
  ];
  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, MERGE_CELLS, table);
  expect((plugin as any).undoStack.length).toBe(1);
});

test('merge_cells restores old customMergeCell function on undo', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  const fn = (_col: number, _row: number): any => undefined;
  table.options.customMergeCell = fn;
  table.internalProps.customMergeCell = fn;
  initPlugin(plugin, table);

  table.mergeCells(0, 1, 1, 2);
  plugin.run({ startCol: 0, startRow: 1, endCol: 1, endRow: 2 } as any, MERGE_CELLS, table);
  expect(Array.isArray(table.options.customMergeCell)).toBe(true);

  plugin.undo();
  expect(table.options.customMergeCell).toBe(fn);
  expect(table.internalProps.customMergeCell).toBe(fn);
});

test('before_keydown triggers undo/redo with ctrl+z / ctrl+y', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ row: 0, col: 0, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: 'A' }] } as any, CHANGE_CELL_VALUES, table);

  const e: any = {
    ctrlKey: true,
    metaKey: false,
    shiftKey: false,
    key: 'z',
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  };
  plugin.run({ event: e } as any, BEFORE_KEYDOWN, table);
  expect(e.preventDefault).toHaveBeenCalled();
  expect(e.stopPropagation).toHaveBeenCalled();
});

test('before_keydown does not undo while formula is working or editor is active', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ row: 0, col: 0, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: 'A' }] } as any, CHANGE_CELL_VALUES, table);

  env.formulaManager.formulaWorkingOnCell = true;
  const e1: any = {
    ctrlKey: true,
    metaKey: false,
    shiftKey: false,
    key: 'z',
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  };
  plugin.run({ event: e1 } as any, BEFORE_KEYDOWN, table);
  expect(e1.preventDefault).not.toHaveBeenCalled();

  env.formulaManager.formulaWorkingOnCell = false;
  table.editorManager.editingEditor = {};
  const e2: any = {
    ctrlKey: true,
    metaKey: false,
    shiftKey: false,
    key: 'z',
    preventDefault: jest.fn(),
    stopPropagation: jest.fn()
  };
  plugin.run({ event: e2 } as any, BEFORE_KEYDOWN, table);
  expect(e2.preventDefault).not.toHaveBeenCalled();
});

test('add_record undo removes inserted records and redo restores', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ records: [{ a: 1 }, { a: 2 }], recordIndex: 0, recordCount: 2 } as any, ADD_RECORD, table);
  table.addRecords([{ a: 1 }, { a: 2 }], 0);
  expect(table.records.length).toBe(2);

  plugin.undo();
  expect(table.records.length).toBe(0);
  plugin.redo();
  expect(table.records.length).toBe(2);
});

test('delete_record undo restores records at indices', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  table.records = [{ a: 1 }, { a: 2 }, { a: 3 }];
  plugin.run({ records: [{ a: 2 }], recordIndexs: [1] } as any, DELETE_RECORD, table);
  table.deleteRecords([1]);
  expect(table.records).toEqual([{ a: 1 }, { a: 3 }]);

  plugin.undo();
  expect(table.records).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
});

test('delete_record undo restores correct order when deleting multiple rows', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  const bob = { name: 'Bob' };
  const carol = { name: 'Carol' };
  table.records = [{ name: 'Alice' }, bob, carol, { name: 'David' }, { name: 'Eve' }];

  plugin.run({ records: [carol, bob], recordIndexs: [2, 1] } as any, DELETE_RECORD, table);
  table.deleteRecords([2, 1]);
  expect(table.records.map((r: any) => r.name)).toEqual(['Alice', 'David', 'Eve']);

  plugin.undo();
  expect(table.records.map((r: any) => r.name)).toEqual(['Alice', 'Bob', 'Carol', 'David', 'Eve']);
});

test('delete_record undo restores resized row height', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  table.records = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];

  plugin.run({ row: 3 } as any, RESIZE_ROW, table);
  table.setRowHeight(3, 50);
  plugin.run({ row: 3, rowHeight: 50 } as any, RESIZE_ROW_END, table);

  plugin.run({ recordIndexs: [2], records: [{ a: 3 }], rowIndexs: [3], deletedCount: 1 } as any, DELETE_RECORD, table);
  table.deleteRecords([2]);
  expect(table.getRowHeight(3)).toBe(20);

  plugin.undo();
  expect(table.getRowHeight(3)).toBe(50);
});

test('delete_column undo restores resized col width', () => {
  const env = createVTableSheetEnv();
  const { table, colWidths } = createTableStub(env);
  const plugin = new HistoryPlugin();

  table.options.columns = [{ field: 'a' }, { field: 'b' }, { field: 'c' }];
  initPlugin(plugin, table);

  plugin.run({ col: 1 } as any, RESIZE_COLUMN, table);
  table.setColWidth(1, 120);
  plugin.run({ col: 1, colWidths: [80, 120, 80] } as any, RESIZE_COLUMN_END, table);

  table.internalProps._widthResizedColMap.delete(1);
  colWidths.delete(1);

  plugin.run(
    { deleteColIndexs: [1], columns: table.options.columns, deletedColumns: [table.options.columns[1]] } as any,
    DELETE_COLUMN,
    table
  );
  plugin.undo();

  expect(table.getColWidth(1)).toBe(120);
});

test('update_record undo restores previous snapshot values', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  table.records = [{ a: 1 }, { a: 2 }];
  initPlugin(plugin, table);
  table.records = [{ a: 10 }, { a: 20 }];

  plugin.run({ recordIndexs: [0, 1], records: table.records } as any, UPDATE_RECORD, table);
  plugin.undo();
  expect(table.records).toEqual([{ a: 1 }, { a: 2 }]);
});

test('add_column undo deletes added columns; delete_column undo restores columns', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  table.options.columns = [{ field: 'a' }, { field: 'b' }, { field: 'c' }];
  initPlugin(plugin, table);

  plugin.run(
    {
      columnIndex: 1,
      columnCount: 1,
      columns: [{ field: 'a' }, { field: 'x' }, { field: 'b' }, { field: 'c' }]
    } as any,
    ADD_COLUMN,
    table
  );
  plugin.undo();
  expect(table.deleteColumns).toHaveBeenCalled();

  plugin.run({ deleteColIndexs: [1] } as any, DELETE_COLUMN, table);
  plugin.undo();
  expect(table.addColumns).toHaveBeenCalled();
});

test('delete_column undo uses stable column snapshot even if live columns mutate', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  table.options.columns = [
    { field: 'a', title: 'Name' },
    { field: 'b', title: 'Age' },
    { field: 'c', title: 'City' }
  ];
  initPlugin(plugin, table);

  (table.options.columns[1] as any).field = 'c';
  (table.options.columns[1] as any).title = 'City';

  plugin.run({ deleteColIndexs: [1] } as any, DELETE_COLUMN, table);
  plugin.undo();

  const firstCall = (table.addColumns as any).mock.calls[0];
  expect(firstCall[0][0].field).toBe('b');
  expect(firstCall[0][0].title).toBe('Age');
});

test('delete_column undo restores correct column and data when event provides deleted snapshots', () => {
  const env = createVTableSheetEnv();
  const plugin = new HistoryPlugin();

  const table: any = {
    __vtableSheet: env.vtableSheet,
    options: { columns: [] as any[] },
    records: [] as any[],
    editorManager: { editingEditor: null },
    changeCellValue: jest.fn(),
    getCellOriginValue: (_col: number, _row: number): any => undefined,
    getRowHeight: () => 20,
    setRowHeight: jest.fn(),
    getColWidth: () => 80,
    setColWidth: jest.fn(),
    addRecords: jest.fn(),
    addRecord: jest.fn(),
    deleteRecords: jest.fn(),
    updateRecords: (records: any[], recordIndexs: number[]) => {
      recordIndexs.forEach((idx, i) => {
        table.records[idx] = records[i];
      });
    },
    addColumns: (cols: any[], colIndex: number) => {
      table.options.columns.splice(colIndex, 0, ...cols);
      for (let i = 0; i < table.records.length; i++) {
        if (Array.isArray(table.records[i])) {
          table.records[i].splice(colIndex, 0, ...Array(cols.length).fill(undefined));
        }
      }
    },
    deleteColumns: (deleteColIndexs: number[]) => {
      const sorted = deleteColIndexs.slice().sort((a, b) => b - a);
      sorted.forEach(idx => {
        table.options.columns.splice(idx, 1);
        for (let i = 0; i < table.records.length; i++) {
          if (Array.isArray(table.records[i])) {
            table.records[i].splice(idx, 1);
          }
        }
      });
    },
    changeHeaderPosition: jest.fn()
  };
  env.worksheet.tableInstance = table;

  table.options.columns = [
    { field: 0, title: 'Name' },
    { field: 1, title: 'Age' },
    { field: 2, title: 'City' }
  ];
  table.records = [
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai']
  ];
  initPlugin(plugin, table);

  const deletedColumns = [table.options.columns[1]];
  const deletedRecordValues = [[24], [30]];
  table.deleteColumns([1]);

  plugin.run(
    { deleteColIndexs: [1], columns: table.options.columns, deletedColumns, deletedRecordValues } as any,
    DELETE_COLUMN,
    table
  );
  plugin.undo();

  expect(table.options.columns.map((c: any) => c.title)).toEqual(['Name', 'Age', 'City']);
  expect(table.records).toEqual([
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai']
  ]);
});

test('delete_column undo restores formulas from snapshot', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  table.options.columns = [{ field: 'a' }, { field: 'b' }, { field: 'c' }];
  env.formulaStore.set('sheet1:4:1', '=SUM(B3:B4)');

  initPlugin(plugin, table);

  plugin.run({ deleteColIndexs: [1] } as any, DELETE_COLUMN, table);
  plugin.undo();

  expect(env.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBe('=SUM(B3:B4)');
  expect(env.formulaManager.normalizeSheetData).toHaveBeenCalled();
  expect(env.formulaManager.formulaEngine.updateSheetData).toHaveBeenCalled();
});

test('change_header_position undo swaps source/target', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run(
    { movingColumnOrRow: 'column', source: { col: 1, row: 0 }, target: { col: 3, row: 0 } } as any,
    CHANGE_HEADER_POSITION,
    table
  );
  plugin.undo();
  expect(table.changeHeaderPosition).toHaveBeenCalled();
});

test('resize row/column undo restores old size', () => {
  const env = createVTableSheetEnv();
  const { table, rowHeights, colWidths } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  rowHeights.set(2, 30);
  plugin.run({ row: 2 } as any, RESIZE_ROW, table);
  plugin.run({ row: 2, rowHeight: 50 } as any, RESIZE_ROW_END, table);
  plugin.undo();
  expect(table.getRowHeight(2)).toBe(30);

  colWidths.set(1, 90);
  plugin.run({ col: 1 } as any, RESIZE_COLUMN, table);
  plugin.run({ col: 1, colWidths: { 1: 120 } } as any, RESIZE_COLUMN_END, table);
  plugin.undo();
  expect(table.getColWidth(1)).toBe(90);
});

test('formula edits use formula_added and ignore display sync cell updates', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.run({ row: 4, col: 1, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  env.formulaManager.setCellContent({ sheet: 'sheet1', row: 4, col: 1 }, '=sum(B4)');
  env.eventManager.emit('formula_added', { cell: { row: 4, col: 1 }, formula: '=sum(B4)' });
  plugin.run({ values: [{ row: 4, col: 1, currentValue: '', changedValue: 28 }] } as any, CHANGE_CELL_VALUES, table);

  plugin.run({ row: 4, col: 1, currentValue: 28 } as any, CHANGE_CELL_VALUE, table);
  env.formulaManager.setCellContent({ sheet: 'sheet1', row: 4, col: 1 }, '=sum(B3:B4)');
  env.eventManager.emit('formula_added', { cell: { row: 4, col: 1 }, formula: '=sum(B3:B4)' });
  plugin.run({ values: [{ row: 4, col: 1, currentValue: 28, changedValue: 28 }] } as any, CHANGE_CELL_VALUES, table);

  plugin.undo();
  expect(env.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBe('=sum(B4)');
  plugin.undo();
  expect(env.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBeUndefined();
});

test('updateOptions maxHistory trims undo stack and clear prevents undo', () => {
  const env = createVTableSheetEnv();
  const { table, changeCellValueCalls } = createTableStub(env);
  const plugin = new HistoryPlugin({ maxHistory: 10 });
  initPlugin(plugin, table);

  plugin.run({ row: 0, col: 0, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: 'A' }] } as any, CHANGE_CELL_VALUES, table);
  plugin.run({ row: 0, col: 1, currentValue: '' } as any, CHANGE_CELL_VALUE, table);
  plugin.run({ values: [{ row: 0, col: 1, currentValue: '', changedValue: 'B' }] } as any, CHANGE_CELL_VALUES, table);

  plugin.updateOptions({ maxHistory: 1 });
  plugin.undo();
  expect(changeCellValueCalls[changeCellValueCalls.length - 1][2]).toBe('');
  const before = changeCellValueCalls.length;
  plugin.undo();
  expect(changeCellValueCalls.length).toBe(before);

  plugin.clear();
  const before2 = changeCellValueCalls.length;
  plugin.undo();
  expect(changeCellValueCalls.length).toBe(before2);
});

test('release unbinds formula events so later emits do not push history', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  plugin.release();
  env.formulaManager.setCellContent({ sheet: 'sheet1', row: 0, col: 0 }, '=A1');
  env.eventManager.emit('formula_added', { cell: { row: 0, col: 0 }, formula: '=A1' });
  expect(() => plugin.undo()).not.toThrow();
});

test('early returns are safe (undo/redo empty, double startTransaction, endTransaction empty)', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  expect(() => plugin.undo()).not.toThrow();
  expect(() => plugin.redo()).not.toThrow();

  plugin.startTransaction();
  plugin.startTransaction();
  plugin.endTransaction();
  expect(() => plugin.undo()).not.toThrow();
});

test('ensureFormulaEventBindings tolerates missing sheetKey and missing eventManager', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  table.__vtableSheet = { formulaManager: env.formulaManager };
  expect(() => plugin.run({}, CHANGE_CELL_VALUE, table)).not.toThrow();

  const table2: any = {
    __vtableSheet: {
      getActiveSheet: () => ({ getKey: () => 'sheet1' }),
      getWorkSheetByKey: () => ({})
    }
  };
  expect(() => plugin.run({}, CHANGE_CELL_VALUE, table2)).not.toThrow();
});

test('private helpers handle null table branches', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);
  plugin.release();

  expect(() => (plugin as any).handleResizeRowEnd({ row: 1, rowHeight: 10 })).not.toThrow();
  expect(() => (plugin as any).handleResizeColumnEnd({ col: 1, colWidths: [] })).not.toThrow();
  expect(() => (plugin as any).applyCommand({ type: 'cells', sheetKey: 'sheet1', cells: [] }, 'undo')).not.toThrow();
  expect(() => (plugin as any).deleteRecordsByReference([])).not.toThrow();
});

test('covers remaining history-plugin branches around unbind and record/column handlers', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();

  expect(() => (plugin as any).unbindFormulaEvents()).not.toThrow();

  initPlugin(plugin, table);

  expect(() => (plugin as any).handleUpdateRecord({ recordIndexs: [], records: [] })).not.toThrow();
  plugin.run({ recordIndexs: [[0] as any], records: [] } as any, UPDATE_RECORD, table);

  const r1 = { a: 1 };
  const r2 = { a: 2 };
  table.records = [r1, r2];
  expect(() => (plugin as any).deleteRecordsByReference([r2])).not.toThrow();
  expect(table.records.length).toBe(1);

  plugin.release();
  expect(() => (plugin as any).handleAddColumn({ columnIndex: 0, columnCount: 1, columns: [] })).not.toThrow();
  expect(() => (plugin as any).handleDeleteColumn({ deleteColIndexs: [0] })).not.toThrow();
  expect(() => (plugin as any).handleResizeRow({ row: 0 })).not.toThrow();
  expect(() => (plugin as any).handleResizeColumn({ col: 0 })).not.toThrow();
});

test('add_record undo without recordIndex uses deleteRecordsByReference callback', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  const r1 = { a: 1 };
  const r2 = { a: 2 };
  table.records = [r1, r2];

  plugin.run({ records: [r2], recordIndex: undefined, recordCount: 0 } as any, ADD_RECORD, table);
  plugin.undo();
  expect(table.records).toEqual([r1]);
});

test('covers remaining branches in change_cell_values filter and formula_added handler', () => {
  const env = createVTableSheetEnv();
  const { table } = createTableStub(env);
  const plugin = new HistoryPlugin();
  initPlugin(plugin, table);

  const fm = env.formulaManager;
  fm.getCellValue = (_cell: any) => ({ value: 28, error: undefined as string | undefined });
  fm.getCellFormula = (_cell: any) => '=A1';

  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: '=A1' }] } as any, CHANGE_CELL_VALUES, table);

  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: '28' }] } as any, CHANGE_CELL_VALUES, table);

  plugin.run({ values: [{ row: 0, col: 0, currentValue: '', changedValue: '29' }] } as any, CHANGE_CELL_VALUES, table);

  (plugin as any).isReplaying = true;
  env.eventManager.emit('formula_added', { cell: { row: 0, col: 0 }, formula: '=A1' });
  (plugin as any).isReplaying = false;

  env.eventManager.emit('formula_added', { cell: null, formula: '=A1' });
  env.eventManager.emit('formula_added', { cell: { row: 0, col: 0 }, formula: '' });

  env.formulaStore.set('sheet1:0:0', '=A1');
  plugin.run({ row: 0, col: 0, currentValue: '28' } as any, CHANGE_CELL_VALUE, table);
  env.eventManager.emit('formula_added', { cell: { row: 0, col: 0 }, formula: '=A1' });
});
