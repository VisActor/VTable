import { AddRowColumnPlugin } from '../src/add-row-column';

describe('AddRowColumnPlugin', () => {
  it('should instantiate with default options', () => {
    const plugin = new AddRowColumnPlugin({});
    expect(plugin).toBeInstanceOf(AddRowColumnPlugin);
    expect(plugin.name).toBe('Add Row Column');
  });

  it('should have an id and runTime', () => {
    const plugin = new AddRowColumnPlugin({});
    expect(plugin.id).toContain('add-row-column-');
    expect(Array.isArray(plugin.runTime)).toBe(true);
  });

  it('should set pluginOptions', () => {
    const options = { addColumnEnable: true, addRowEnable: false };
    const plugin = new AddRowColumnPlugin(options);
    expect(plugin.pluginOptions.addColumnEnable).toBe(true);
    expect(plugin.pluginOptions.addRowEnable).toBe(false);
  });

  it('should call addColumnCallback when triggered', () => {
    const addColumnCallback = jest.fn();
    const plugin = new AddRowColumnPlugin({ addColumnEnable: true, addColumnCallback });
    if (plugin.pluginOptions.addColumnCallback) {
      plugin.pluginOptions.addColumnCallback(2);
    }
    expect(addColumnCallback).toHaveBeenCalledWith(2);
  });

  it('should call addRowCallback when triggered', () => {
    const addRowCallback = jest.fn();
    const plugin = new AddRowColumnPlugin({ addRowEnable: true, addRowCallback });
    if (plugin.pluginOptions.addRowCallback) {
      plugin.pluginOptions.addRowCallback(3);
    }
    expect(addRowCallback).toHaveBeenCalledWith(3);
  });
});

describe('AddRowColumnPlugin run method', () => {
  let plugin: any;
  let mockTable: any;
  let mockEventArgs: any;
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('@visactor/vtable', () => ({
      TABLE_EVENT_TYPE: {
        MOUSEENTER_CELL: 'MOUSEENTER_CELL',
        MOUSELEAVE_CELL: 'MOUSELEAVE_CELL',
        MOUSELEAVE_TABLE: 'MOUSELEAVE_TABLE',
      },
      plugins: {},
      TYPES: {
        CellAddressWithBound: jest.fn()
      }
    }));
    const { AddRowColumnPlugin } = require('../src/add-row-column');
    mockTable = {
      canvas: { getBoundingClientRect: jest.fn(() => ({ left: 10, top: 20 })) },
      getCellAtRelativePosition: jest.fn(() => ({ col: 1, row: 2 })),
      getCellRelativeRect: jest.fn(() => ({ left: 30, right: 50, top: 40, bottom: 60 })),
      isSeriesNumber: jest.fn(() => false),
      isHeader: jest.fn(() => false),
      getDrawRange: jest.fn(() => ({ height: 100, width: 200 })),
      options: { columns: [{}, {}] },
      updateColumns: jest.fn(),
      getRecordIndexByCell: jest.fn(() => 0),
      addRecord: jest.fn(),
    };
    plugin = new AddRowColumnPlugin({ addColumnEnable: true, addRowEnable: true });
    plugin.table = mockTable;
    // mock DOM
    plugin.leftDotForAddColumn = { offsetWidth: 6, offsetHeight: 6, style: {}, remove: jest.fn() };
    plugin.rightDotForAddColumn = { offsetWidth: 6, offsetHeight: 6, style: {}, remove: jest.fn() };
    plugin.addIconForAddColumn = { offsetWidth: 18, offsetHeight: 18, style: {}, dataset: {}, remove: jest.fn(), addEventListener: jest.fn() };
    plugin.addLineForAddColumn = { style: {}, remove: jest.fn() };
    plugin.topDotForAddRow = { offsetWidth: 6, offsetHeight: 6, style: {}, remove: jest.fn() };
    plugin.bottomDotForAddRow = { offsetWidth: 6, offsetHeight: 6, style: {}, remove: jest.fn() };
    plugin.addIconForAddRow = { offsetWidth: 18, offsetHeight: 18, style: {}, dataset: {}, remove: jest.fn(), addEventListener: jest.fn() };
    plugin.addLineForAddRow = { style: {}, remove: jest.fn() };
    plugin.showDotForAddColumn = jest.fn();
    plugin.showDotForAddRow = jest.fn();
    plugin.delayHideAllForAddColumn = jest.fn();
    plugin.delayHideAllForAddRow = jest.fn();
    plugin.hideAllTimeoutId_addColumn = undefined;
    plugin.hideAllTimeoutId_addRow = undefined;
    mockEventArgs = { event: { clientX: 15, clientY: 25 } };
  });

  it('should handle MOUSEENTER_CELL', () => {
    plugin.run(mockEventArgs, 'MOUSEENTER_CELL', mockTable);
    expect(plugin.showDotForAddColumn).toHaveBeenCalled();
    expect(plugin.showDotForAddRow).toHaveBeenCalled();
  });

  it('should handle MOUSELEAVE_CELL (no-op branch)', () => {
    expect(() => plugin.run(mockEventArgs, 'MOUSELEAVE_CELL', mockTable)).not.toThrow();
  });

  it('should handle MOUSELEAVE_TABLE', () => {
    plugin.run(mockEventArgs, 'MOUSELEAVE_TABLE', mockTable);
    expect(plugin.delayHideAllForAddColumn).toHaveBeenCalled();
    expect(plugin.delayHideAllForAddRow).toHaveBeenCalled();
  });

  it('should not call showDotForAddColumn if addColumnEnable is false', () => {
    plugin.pluginOptions.addColumnEnable = false;
    plugin.run(mockEventArgs, 'MOUSEENTER_CELL', mockTable);
    expect(plugin.showDotForAddColumn).not.toHaveBeenCalled();
  });

  it('should not call showDotForAddRow if addRowEnable is false', () => {
    plugin.pluginOptions.addRowEnable = false;
    plugin.run(mockEventArgs, 'MOUSEENTER_CELL', mockTable);
    expect(plugin.showDotForAddRow).not.toHaveBeenCalled();
  });

  it('should handle exception in run gracefully', () => {
    mockTable.getCellAtRelativePosition = () => { throw new Error('fail'); };
    expect(() => plugin.run(mockEventArgs, 'MOUSEENTER_CELL', mockTable)).toThrow('fail');
  });

  it('should release all DOM elements in release()', () => {
    plugin.release();
    expect(plugin.leftDotForAddColumn.remove).toHaveBeenCalled();
    expect(plugin.rightDotForAddColumn.remove).toHaveBeenCalled();
    expect(plugin.addIconForAddColumn.remove).toHaveBeenCalled();
    expect(plugin.addLineForAddColumn.remove).toHaveBeenCalled();
    expect(plugin.topDotForAddRow.remove).toHaveBeenCalled();
    expect(plugin.bottomDotForAddRow.remove).toHaveBeenCalled();
    expect(plugin.addIconForAddRow.remove).toHaveBeenCalled();
    expect(plugin.addLineForAddRow.remove).toHaveBeenCalled();
  });
});
