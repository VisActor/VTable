import { HighlightHeaderWhenSelectCellPlugin } from '../src/highlight-header-when-select-cell';

describe('HighlightHeaderWhenSelectCellPlugin', () => {
  it('should instantiate with options', () => {
    const plugin = new HighlightHeaderWhenSelectCellPlugin({ rowHighlight: true });
    expect(plugin).toBeInstanceOf(HighlightHeaderWhenSelectCellPlugin);
    expect(plugin.pluginOptions.rowHighlight).toBe(true);
  });

  it('should have an id and name', () => {
    const plugin = new HighlightHeaderWhenSelectCellPlugin({});
    expect(plugin.id).toContain('highlight-header-when-select-cell-');
    expect(plugin.name).toBe('Highlight Header When Select Cell');
  });
});

beforeEach(() => {
  jest.resetModules();
  jest.doMock('@visactor/vtable', () => ({
    TABLE_EVENT_TYPE: {
      INITIALIZED: 'INITIALIZED',
      SELECTED_CELL: 'SELECTED_CELL',
      SELECTED_CLEAR: 'SELECTED_CLEAR',
      MOUSEMOVE_TABLE: 'MOUSEMOVE_TABLE'
    },
    plugins: {}
  }));
});

describe('HighlightHeaderWhenSelectCellPlugin run method', () => {
  let plugin: any;
  let mockTable: any;
  beforeEach(() => {
    const { HighlightHeaderWhenSelectCellPlugin } = require('../src/highlight-header-when-select-cell');
    mockTable = {
      arrangeCustomCellStyle: jest.fn(),
      registerCustomCellStyle: jest.fn(),
      getSelectedCellRanges: jest.fn(() => [
        { start: { col: 0, row: 0 }, end: { col: 1, row: 1 } },
        { start: { col: 2, row: 2 }, end: { col: 3, row: 3 } }
      ]),
      isPivotTable: jest.fn(() => false),
      columnHeaderLevelCount: 2,
      rowHeaderLevelCount: 2,
    };
    plugin = new HighlightHeaderWhenSelectCellPlugin({ colHighlight: true, rowHighlight: true });
    plugin.table = mockTable;
  });

  it('should call clearHighlight on SELECTED_CLEAR', () => {
    plugin.clearHighlight = jest.fn();
    plugin.run({}, 'SELECTED_CLEAR', mockTable);
    expect(plugin.clearHighlight).toHaveBeenCalled();
  });

  it('should call updateHighlight on SELECTED_CELL', () => {
    plugin.updateHighlight = jest.fn();
    plugin.run({}, 'SELECTED_CELL', mockTable);
    expect(plugin.updateHighlight).toHaveBeenCalled();
  });

  it('should call updateHighlight on MOUSEMOVE_TABLE', () => {
    plugin.updateHighlight = jest.fn();
    plugin.run({}, 'MOUSEMOVE_TABLE', mockTable);
    expect(plugin.updateHighlight).toHaveBeenCalled();
  });

  it('should call registerStyle on INITIALIZED', () => {
    plugin.registerStyle = jest.fn();
    plugin.run({}, 'INITIALIZED', mockTable);
    expect(plugin.registerStyle).toHaveBeenCalled();
  });

  it('should clear highlight ranges in clearHighlight', () => {
    plugin.colHeaderRanges = [{ start: { col: 0, row: 0 }, end: { col: 1, row: 1 } }];
    plugin.rowHeaderRanges = [{ start: { col: 0, row: 0 }, end: { col: 1, row: 1 } }];
    plugin.clearHighlight();
    expect(mockTable.arrangeCustomCellStyle).toHaveBeenCalled();
    expect(plugin.colHeaderRanges.length).toBe(0);
    expect(plugin.rowHeaderRanges.length).toBe(0);
  });

  it('should register custom styles in registerStyle', () => {
    plugin.registerStyle();
    expect(mockTable.registerCustomCellStyle).toHaveBeenCalledWith('col-highlight', expect.any(Object));
    expect(mockTable.registerCustomCellStyle).toHaveBeenCalledWith('row-highlight', expect.any(Object));
  });
});
