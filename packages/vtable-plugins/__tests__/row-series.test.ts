beforeEach(() => {
  jest.resetModules();
  jest.doMock('@visactor/vtable', () => ({
    TABLE_EVENT_TYPE: {
      BEFORE_INIT: 'BEFORE_INIT',
      BEFORE_KEYDOWN: 'BEFORE_KEYDOWN'
    },
    plugins: {}
  }));
});

describe('RowSeriesPlugin', () => {
  it('should instantiate with default rowCount', () => {
    const { RowSeriesPlugin } = require('../src/row-series');
    const plugin = new RowSeriesPlugin({ rowCount: 10 });
    expect(plugin).toBeInstanceOf(RowSeriesPlugin);
    expect(plugin.pluginOptions.rowCount).toBe(10);
  });

  it('should have an id and name', () => {
    const { RowSeriesPlugin } = require('../src/row-series');
    const plugin = new RowSeriesPlugin({ rowCount: 1 });
    expect(plugin.id).toContain('row-series-');
    expect(plugin.name).toBe('Row Series');
  });
});

describe('RowSeriesPlugin run method', () => {
  let mockTable;
  let RowSeriesPlugin;
  beforeEach(() => {
    RowSeriesPlugin = require('../src/row-series').RowSeriesPlugin;
    mockTable = {
      stateManager: { select: { cellPos: { row: 9 } } },
      rowCount: 10,
      columnHeaderLevelCount: 1,
      addRecord: jest.fn(),
    };
  });
  it('should fill records and set rowSeriesNumber on BEFORE_INIT', () => {
    const plugin = new RowSeriesPlugin({ rowCount: 10, rowSeriesNumber: { width: 50 } });
    const eventArgs = { options: { records: [] } };
    plugin.run(eventArgs, 'BEFORE_INIT', mockTable);
    expect(eventArgs.options.records.length).toBe(10);
    expect(plugin.pluginOptions.rowSeriesNumber?.width).toBe(50);
  });

  it('should auto extend row on BEFORE_KEYDOWN', () => {
    const plugin = new RowSeriesPlugin({ rowCount: 10, autoExtendRowTriggerKeys: ['Enter'] });
    plugin.table = mockTable;
    const eventArgs = { event: { key: 'Enter' } };
    plugin.run(eventArgs, 'BEFORE_KEYDOWN', mockTable);
    expect(mockTable.addRecord).toHaveBeenCalled();
  });

  it('should use fillRowRecord callback', () => {
    const plugin = new RowSeriesPlugin({ rowCount: 2, fillRowRecord: (i: number) => ({ idx: i }) });
    const eventArgs: { options: { records: { idx: number }[] } } = { options: { records: [] } };
    plugin.run(eventArgs, 'BEFORE_INIT', mockTable);
    expect((eventArgs.options.records)[1].idx).toBe(1);
  });
});
