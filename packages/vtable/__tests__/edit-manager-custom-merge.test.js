const { EditManager } = require('../src/edit/edit-manager');

test('EditManager.startEditCell uses customMergeCell text as editor value', () => {
  const mergeItem = {
    text: 'merged-text',
    range: { start: { col: 1, row: 1 }, end: { col: 2, row: 2 } }
  };

  const editor = {
    onStart: jest.fn(),
    beginEditing: jest.fn()
  };

  const table = {
    options: { editCellTrigger: 'doubleclick', customMergeCell: [mergeItem] },
    on: jest.fn().mockReturnValue(1),
    off: jest.fn(),
    colCount: 10,
    rowCount: 10,
    internalProps: {
      layoutMap: { isSeriesNumber: jest.fn().mockReturnValue(false), isAggregation: jest.fn().mockReturnValue(false) }
    },
    getEditor: jest.fn().mockReturnValue(editor),
    getCellRawRecord: jest.fn().mockReturnValue(undefined),
    getCustomMerge: jest.fn().mockReturnValue(mergeItem),
    getCellOriginValue: jest.fn().mockReturnValue('origin'),
    getCellRange: jest.fn().mockReturnValue({
      start: { col: 1, row: 1 },
      end: { col: 2, row: 2 },
      isCustom: true
    }),
    getCellRangeRelativeRect: jest.fn().mockReturnValue({ left: 0, top: 0, width: 10, height: 10 }),
    _makeVisibleCell: jest.fn(),
    getElement: jest.fn().mockReturnValue(document.createElement('div'))
  };

  const manager = new EditManager(table);
  manager.startEditCell(1, 1);
  expect(editor.onStart).toHaveBeenCalled();
  expect(editor.onStart.mock.calls[0][0].value).toBe('merged-text');
});

test('EditManager.doExit writes merged value to range start cell', () => {
  const mergeItem = {
    text: 'before',
    range: { start: { col: 1, row: 1 }, end: { col: 2, row: 2 } }
  };

  const table = {
    options: { editCellTrigger: 'doubleclick', customMergeCell: [mergeItem] },
    on: jest.fn().mockReturnValue(1),
    off: jest.fn(),
    changeCellValue: jest.fn(),
    getCellRange: jest.fn().mockReturnValue({
      start: { col: 1, row: 1 },
      end: { col: 2, row: 2 },
      isCustom: true
    }),
    getCustomMerge: jest.fn().mockReturnValue(mergeItem)
  };

  const manager = new EditManager(table);
  manager.editCell = { col: 1, row: 1 };
  manager.editingEditor = { getValue: jest.fn().mockReturnValue('after'), beforeEnd: jest.fn(), onEnd: jest.fn() };
  manager.doExit();

  expect(table.changeCellValue).toHaveBeenCalledWith(1, 1, 'after');
  expect(manager.editingEditor).toBeNull();
});
