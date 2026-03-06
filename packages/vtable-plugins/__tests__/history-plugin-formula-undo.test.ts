export {};

const CHANGE_CELL_VALUE = 'change_cell_value';
const CHANGE_CELL_VALUES = 'change_cell_values';

jest.mock('@visactor/vtable', () => ({
  TABLE_EVENT_TYPE: {
    BEFORE_KEYDOWN: 'before_keydown',
    CHANGE_CELL_VALUE,
    CHANGE_CELL_VALUES,
    PASTED_DATA: 'pasted_data',
    ADD_RECORD: 'add_record',
    DELETE_RECORD: 'delete_record',
    UPDATE_RECORD: 'update_record',
    ADD_COLUMN: 'add_column',
    DELETE_COLUMN: 'delete_column',
    CHANGE_HEADER_POSITION: 'change_header_position',
    RESIZE_ROW: 'resize_row',
    RESIZE_ROW_END: 'resize_row_end',
    RESIZE_COLUMN: 'resize_column',
    RESIZE_COLUMN_END: 'resize_column_end'
  }
}));

const { HistoryPlugin } = require('../src/history');

function createTestEnv() {
  const handlers: Record<string, Function[]> = {};
  const eventManager = {
    on: (type: string, cb: any) => {
      handlers[type] = handlers[type] || [];
      handlers[type].push(cb);
    },
    off: (type: string, cb: any) => {
      const list = handlers[type] || [];
      const idx = list.indexOf(cb);
      if (idx >= 0) {
        list.splice(idx, 1);
      }
    },
    emit: (type: string, event: any) => {
      (handlers[type] || []).forEach(cb => cb(event));
    }
  };

  const formulaStore = new Map<string, string>();
  const formulaManager = {
    getCellFormula: (cell: any) => {
      return formulaStore.get(`${cell.sheet}:${cell.row}:${cell.col}`);
    },
    setCellContent: (cell: any, value: any) => {
      const key = `${cell.sheet}:${cell.row}:${cell.col}`;
      if (typeof value === 'string' && value.startsWith('=')) {
        formulaStore.set(key, value);
      } else {
        formulaStore.delete(key);
      }
    },
    getCellValue: (_cell: any) => {
      return { value: 28, error: undefined as string | undefined };
    },
    getCellDependents: (): any[] => []
  };

  const worksheet = {
    eventManager,
    tableInstance: null as any
  };

  const vtableSheet = {
    formulaManager,
    getWorkSheetByKey: (_sheetKey: string) => worksheet,
    workSheetInstances: new Map([['sheet1', worksheet]])
  };

  const changeCellValueCalls: any[] = [];
  const table: any = {
    __vtableSheet: vtableSheet,
    options: {},
    records: [],
    editorManager: { editingEditor: null },
    changeCellValue: (...args: any[]) => {
      changeCellValueCalls.push(args);
    }
  };
  worksheet.tableInstance = table;

  return { eventManager, formulaManager, table, vtableSheet, changeCellValueCalls };
}

test('HistoryPlugin undo twice restores blank after two formula edits', () => {
  const env = createTestEnv();
  const plugin = new HistoryPlugin();

  plugin.run({ row: 4, col: 1, currentValue: '' } as any, CHANGE_CELL_VALUE as any, env.table as any);
  env.formulaManager.setCellContent({ sheet: 'sheet1', row: 4, col: 1 }, '=sum(B4)');
  env.eventManager.emit('formula_added', { cell: { row: 4, col: 1 }, formula: '=sum(B4)' });

  plugin.run(
    {
      values: [{ row: 4, col: 1, currentValue: '', changedValue: 28 }]
    } as any,
    CHANGE_CELL_VALUES as any,
    env.table as any
  );

  plugin.run({ row: 4, col: 1, currentValue: 28 } as any, CHANGE_CELL_VALUE as any, env.table as any);
  env.formulaManager.setCellContent({ sheet: 'sheet1', row: 4, col: 1 }, '=sum(B3:B4)');
  env.eventManager.emit('formula_added', { cell: { row: 4, col: 1 }, formula: '=sum(B3:B4)' });

  plugin.undo();
  expect(env.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBe('=sum(B4)');

  plugin.undo();
  expect(env.formulaManager.getCellFormula({ sheet: 'sheet1', row: 4, col: 1 })).toBeUndefined();
});
