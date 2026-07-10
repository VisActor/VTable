// @ts-nocheck
import { ListTable } from '../../src';
import { CachedDataSource } from '../../src/data/CachedDataSource';
import { getListTableRowHierarchyType } from '../../src/core/tableHelper';
import { createDiv } from '../dom';
import data from '../data/North_American_Superstore_data.json';

global.__VERSION__ = 'none';

describe('listTable grouped updateOption perf', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  test('grouped updateOption with records only clears cells once before rebuilding', async () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';

    const columns = [
      { field: 'Order ID', title: 'Order ID', width: 'auto' },
      { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
      { field: 'Product Name', title: 'Product Name', width: 'auto' },
      { field: 'Category', title: 'Category', width: 'auto' },
      { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
      { field: 'Region', title: 'Region', width: 'auto' }
    ];

    const table = new ListTable(container, {
      records: JSON.parse(JSON.stringify(data.slice(0, 30))),
      columns,
      widthMode: 'standard',
      groupBy: ['Category', 'Sub-Category']
    });

    const clearCellsSpy = jest.spyOn(table.scenegraph, 'clearCells');

    await table.updateOption({
      ...table.options,
      records: JSON.parse(JSON.stringify(data.slice(30, 80))),
      groupBy: ['Category', 'Sub-Category']
    });

    expect(clearCellsSpy).toHaveBeenCalledTimes(1);
    expect(table.options.records.length).toBe(50);

    table.release();
  });

  test('grouped updateOption reuses cached data source when records stay the same', async () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';

    const records = JSON.parse(JSON.stringify(data.slice(0, 60)));
    const columns = [
      { field: 'Order ID', title: 'Order ID', width: 'auto' },
      { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
      { field: 'Product Name', title: 'Product Name', width: 'auto' },
      { field: 'Category', title: 'Category', width: 'auto' },
      { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
      { field: 'Region', title: 'Region', width: 'auto' }
    ];

    const table = new ListTable(container, {
      records,
      columns,
      widthMode: 'standard'
    });

    const oldDataSource = table.dataSource;
    const ofArraySpy = jest.spyOn(CachedDataSource, 'ofArray');

    await table.updateOption({
      ...table.options,
      records,
      groupBy: ['Category', 'Sub-Category']
    });

    expect(ofArraySpy).not.toHaveBeenCalled();
    expect(table.dataSource).toBe(oldDataSource);
    expect(table.dataSource.rowHierarchyType).toBe('tree');

    table.release();
  });

  test('grouped updateOption with same records and changed sortState falls back to setRecords', async () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';

    const records = JSON.parse(JSON.stringify(data.slice(0, 60)));
    const columns = [
      { field: 'Order ID', title: 'Order ID', width: 'auto' },
      { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
      { field: 'Product Name', title: 'Product Name', width: 'auto' },
      { field: 'Category', title: 'Category', width: 'auto' },
      { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
      { field: 'Sales', title: 'Sales', width: 'auto', sort: true }
    ];

    const table = new ListTable(container, {
      records,
      columns,
      widthMode: 'standard',
      groupBy: ['Category', 'Sub-Category']
    });

    const setRecordsSpy = jest.spyOn(table, 'setRecords');
    const nextSortState = {
      field: 'Sales',
      order: 'desc'
    };

    await table.updateOption({
      ...table.options,
      records,
      groupBy: ['Category', 'Sub-Category'],
      sortState: nextSortState
    });

    expect(setRecordsSpy).toHaveBeenCalled();
    expect(table.internalProps.sortState).toEqual(nextSortState);

    table.release();
  });

  test('grouped updateOption with same records and same active sortState still falls back to setRecords', async () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';

    const records = JSON.parse(JSON.stringify(data.slice(0, 60)));
    const sortState = {
      field: 'Sales',
      order: 'desc'
    };
    const columns = [
      { field: 'Order ID', title: 'Order ID', width: 'auto' },
      { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
      { field: 'Product Name', title: 'Product Name', width: 'auto' },
      { field: 'Category', title: 'Category', width: 'auto' },
      { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
      { field: 'Sales', title: 'Sales', width: 'auto', sort: true }
    ];

    const table = new ListTable(container, {
      records,
      columns,
      widthMode: 'standard',
      groupBy: ['Category', 'Sub-Category'],
      sortState
    });

    const setRecordsSpy = jest.spyOn(table, 'setRecords');

    await table.updateOption({
      ...table.options,
      records,
      groupBy: ['Category', 'Sub-Category'],
      sortState
    });

    expect(setRecordsSpy).toHaveBeenCalled();
    expect(table.internalProps.sortState).toBe(sortState);

    table.release();
  });

  test('refreshRecords syncs addRecordRule for reused cached data source', async () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '1000px';
    container.style.height = '800px';

    const records: any[] = [{ name: 'Alice' }];
    const columns = [{ field: 'name', title: 'Name', width: 'auto' }];

    const table = new ListTable(container, {
      records,
      columns,
      widthMode: 'standard',
      addRecordRule: 'Object'
    });

    await table.updateOption({
      ...table.options,
      records,
      addRecordRule: 'Array'
    });

    expect(table.dataSource.addRecordRule).toBe('Array');

    (table.dataSource as any).changeFieldValueByRecordIndex('inserted', 1, 0, table);

    expect(Array.isArray(records[1])).toBe(true);
    expect(records[1][0]).toBe('inserted');

    table.release();
  });

  test('refreshRecords syncs rowHierarchyType before processing tree filter children', () => {
    const records = [
      {
        name: 'parent',
        children: [
          { name: 'keep', visible: true },
          { name: 'drop', visible: false }
        ]
      }
    ];
    const dataConfig = {
      filterRules: [
        {
          filterFunc: record => record.visible !== false
        }
      ]
    };
    const columns = [{ field: 'name', title: 'Name' }];
    const dataSource = CachedDataSource.ofArray(records, undefined, undefined, columns, 'grid');

    dataSource.refreshRecords(records, dataConfig, undefined, columns, 'tree');

    expect(records[0].filteredChildren).toEqual([{ name: 'keep', visible: true }]);
  });

  test('getListTableRowHierarchyType works before pluginManager initialization', () => {
    const table = {
      internalProps: {
        layoutMap: {
          rowHierarchyType: 'grid'
        },
        dataConfig: {
          groupByRules: [{ field: 'Category' }]
        }
      }
    };

    expect(getListTableRowHierarchyType(table)).toBe('tree');
  });
});
