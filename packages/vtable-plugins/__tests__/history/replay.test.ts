import { replayCommand } from '../../src/history/replay';

test('replayCommand covers redo branches and default', () => {
  const calls: any[] = [];
  const table: any = {
    deleteRecords: jest.fn(),
    addRecords: jest.fn(),
    updateRecords: jest.fn(),
    addColumns: jest.fn(),
    deleteColumns: jest.fn(),
    changeHeaderPosition: jest.fn(),
    setRowHeight: jest.fn(),
    setColWidth: jest.fn(),
    changeCellValue: (...args: any[]) => calls.push(args),
    addRecord: jest.fn()
  };
  const vtableSheet: any = { formulaManager: undefined };

  replayCommand({
    table,
    vtableSheet,
    direction: 'undo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'add_record', records: [{ a: 1 }], recordIndex: undefined, recordCount: 0 } as any
  });

  replayCommand({
    table,
    vtableSheet,
    direction: 'redo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'delete_record', records: [{ a: 1 }], recordIndexs: [0] } as any
  });
  expect(table.deleteRecords).toHaveBeenCalled();

  replayCommand({
    table,
    vtableSheet,
    direction: 'redo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'update_record', oldRecords: [{ a: 1 }], newRecords: [{ a: 2 }], recordIndexs: [0] } as any
  });
  expect(table.updateRecords).toHaveBeenCalledWith([{ a: 2 }], [0]);

  replayCommand({
    table,
    vtableSheet,
    direction: 'redo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'add_column', columns: [{ field: 'x' }], columnIndex: 1, columnCount: 1 } as any
  });
  expect(table.addColumns).toHaveBeenCalled();

  replayCommand({
    table,
    vtableSheet,
    direction: 'redo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'delete_column', deleteColIndexs: [1], columns: [{ field: 'x' }] } as any
  });
  expect(table.deleteColumns).toHaveBeenCalled();

  replayCommand({
    table,
    vtableSheet,
    direction: 'undo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'delete_column', deleteColIndexs: [2, 1], columns: [{ field: 'b' }, { field: 'a' }] } as any
  });
  expect(table.addColumns).toHaveBeenCalled();

  replayCommand({
    table,
    vtableSheet,
    direction: 'undo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'change_header_position', moving: 'row', sourceIndex: 1, targetIndex: 2 } as any
  });
  expect(table.changeHeaderPosition).toHaveBeenCalled();

  replayCommand({
    table,
    vtableSheet,
    direction: 'undo',
    deleteRecordsByReference: jest.fn(),
    cmd: { type: 'unknown' } as any
  });
});

test('replayCommand delete_column undo restores array record values when provided', () => {
  const table: any = {
    records: [
      ['Alice', 24, 'Beijing'],
      ['Bob', 30, 'Shanghai']
    ],
    addColumns: (_cols: any[], colIndex: number) => {
      for (let i = 0; i < table.records.length; i++) {
        table.records[i].splice(colIndex, 0, undefined);
      }
    },
    deleteColumns: jest.fn(),
    deleteRecords: jest.fn(),
    addRecords: jest.fn(),
    updateRecords: (records: any[], recordIndexs: number[], _trigger?: boolean) => {
      recordIndexs.forEach((idx, i) => {
        table.records[idx] = records[i];
      });
    },
    changeCellValue: jest.fn(),
    addRecord: jest.fn()
  };
  const vtableSheet: any = { formulaManager: undefined };

  table.records = [
    ['Alice', 'Beijing'],
    ['Bob', 'Shanghai']
  ];

  replayCommand({
    table,
    vtableSheet,
    direction: 'undo',
    deleteRecordsByReference: jest.fn(),
    cmd: {
      type: 'delete_column',
      deleteColIndexs: [1],
      columns: [{ field: 1, title: 'Age' }],
      deletedRecordValues: [[24], [30]]
    } as any
  });

  expect(table.records).toEqual([
    ['Alice', 24, 'Beijing'],
    ['Bob', 30, 'Shanghai']
  ]);
});
