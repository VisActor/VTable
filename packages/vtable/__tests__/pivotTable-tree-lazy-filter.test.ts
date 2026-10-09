import { PivotTable, TYPES } from '../src';
import { createDiv } from './dom';

(global as typeof globalThis & { __VERSION__: string }).__VERSION__ = 'none';

describe('pivot tree lazy records and filtering', () => {
  let table: PivotTable;
  let container: HTMLElement;

  beforeEach(() => {
    container = createDiv();
    container.style.width = '700px';
    container.style.height = '500px';
    table = new PivotTable(container, {
      records: [
        { category: 'A', sales: 30 },
        { category: 'B', sales: 40 }
      ],
      rows: ['category', 'subcategory'],
      columns: [],
      indicators: ['sales'],
      rowTree: [
        { dimensionKey: 'category', value: 'A', children: true },
        { dimensionKey: 'category', value: 'B', children: true }
      ],
      rowHierarchyType: 'tree',
      dataConfig: {
        aggregationRules: [{ indicatorKey: 'sales', field: 'sales', aggregationType: TYPES.AggregationType.SUM }]
      }
    });
  });

  afterEach(() => {
    table.release();
    container.remove();
  });

  function findRow(label: string) {
    for (let row = 1; row < table.rowCount; row++) {
      if (table.getCellValue(0, row) === label) {
        return row;
      }
    }
    throw new Error(`Missing row: ${label}`);
  }

  function value(label: string) {
    return table.getCellOriginValue(1, findRow(label));
  }

  function loadChildren(category: string, sales: number[]) {
    table.setTreeNodeChildren(
      sales.map((_, index) => ({ dimensionKey: 'subcategory', value: `${category}${index + 1}` })),
      sales.map((amount, index) => ({ category, subcategory: `${category}${index + 1}`, sales: amount })),
      0,
      findRow(category)
    );
  }

  it.each([false, true])('retains loaded values after an empty filter update (reset tree: %s)', isResetTree => {
    loadChildren('A', [10, 20]);
    expect([value('A1'), value('A2'), value('B')]).toEqual([10, 20, 40]);

    table.updateFilterRules([], isResetTree);

    expect([value('A1'), value('A2'), value('B')]).toEqual([10, 20, 40]);
  });

  it('filters and restores records from multiple lazy loads', () => {
    loadChildren('A', [10, 20]);
    loadChildren('B', [15, 25]);
    expect([value('A1'), value('A2'), value('B1'), value('B2')]).toEqual([10, 20, 15, 25]);

    table.updateFilterRules([{ filterFunc: record => record.sales >= 20 }]);

    expect(value('A1')).toBeUndefined();
    expect(value('B1')).toBeUndefined();
    expect([value('A2'), value('B2')]).toEqual([20, 25]);

    table.updateFilterRules([]);

    expect([value('A1'), value('A2'), value('B1'), value('B2')]).toEqual([10, 20, 15, 25]);
    expect([value('A'), value('B')]).toEqual([30, 40]);
  });

  it('preserves a large batch without spreading records into function arguments', () => {
    const records = Array.from({ length: 150000 }, () => ({ category: 'A', subcategory: 'A1', sales: 1 }));
    table.setTreeNodeChildren([{ dimensionKey: 'subcategory', value: 'A1' }], records, 0, findRow('A'));
    expect(value('A1')).toBe(records.length);

    table.updateFilterRules([]);

    expect(value('A1')).toBe(records.length);
    expect(value('B')).toBe(40);
  });
});
