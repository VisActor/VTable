import { ColumnSeriesPlugin } from '../src/column-series';

describe('ColumnSeriesPlugin', () => {
  it('should instantiate with default columnCount', () => {
    const plugin = new ColumnSeriesPlugin({ columnCount: 10 });
    expect(plugin).toBeInstanceOf(ColumnSeriesPlugin);
    expect(plugin.pluginOptions.columnCount).toBe(10);
  });

  it('should have an id and name', () => {
    const plugin = new ColumnSeriesPlugin({ columnCount: 1 });
    expect(plugin.id).toContain('column-series-');
    expect(plugin.name).toBe('Column Series');
  });
});

describe('ColumnSeriesPlugin run method', () => {
  let mockTable: any;
  let ColumnSeriesPlugin: any;
  beforeEach(() => {
    jest.resetModules();
    jest.doMock('@visactor/vtable', () => ({
      TABLE_EVENT_TYPE: {
        BEFORE_INIT: 'BEFORE_INIT',
        BEFORE_KEYDOWN: 'BEFORE_KEYDOWN',
      },
      plugins: {},
    }));
    ColumnSeriesPlugin = require('../src/column-series').ColumnSeriesPlugin;
    mockTable = {
      stateManager: { select: { cellPos: { col: 9 } } },
      colCount: 10,
      addColumn: jest.fn(),
    };
  });
  it('should generate columns on BEFORE_INIT', () => {
    const plugin = new ColumnSeriesPlugin({ columnCount: 10, autoExtendColumnTriggerKeys: ['Tab'] });
    const eventArgs: { options: { columns?: any[] } } = { options: {} };
    plugin.run(eventArgs, 'BEFORE_INIT', mockTable);
    expect(eventArgs.options.columns).toBeDefined();
    expect(eventArgs.options.columns?.length).toBe(10);
  });

  it('should auto extend column on BEFORE_KEYDOWN', () => {
    const plugin = new ColumnSeriesPlugin({ columnCount: 10, autoExtendColumnTriggerKeys: ['Tab'] });
    plugin.table = mockTable as any;
    const eventArgs = { event: { key: 'Tab' } };
    plugin.run(eventArgs, 'BEFORE_KEYDOWN', mockTable);
    expect(mockTable.addColumn).toHaveBeenCalled();
  });

  it('should use custom generateColumnTitle', () => {
    const customPlugin = new ColumnSeriesPlugin({ columnCount: 2, generateColumnTitle: i => `T${i}` });
    const columns = customPlugin.generateColumns(2);
    expect(columns[0].title).toBe('T0');
  });
});
