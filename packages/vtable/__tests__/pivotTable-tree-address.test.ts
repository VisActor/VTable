// @ts-nocheck
import { PivotTable } from '../src';
import { createDiv } from './dom';

global.__VERSION__ = 'none';

describe('tree row header addresses', () => {
  let table: PivotTable;

  /** 创建空数据、单段扩展树的确定性表头，用于核对路径和物理列的区别。 */
  function createTable(options = {}) {
    const container = createDiv();
    container.style.width = '800px';
    container.style.height = '400px';
    table = new PivotTable(container, {
      records: [],
      rows: ['main'],
      rowTree: [
        { dimensionKey: 'main', value: 'A' },
        { dimensionKey: 'main', value: 'B' }
      ],
      extensionRows: [
        {
          rows: ['group', 'item'],
          rowTree: [
            {
              dimensionKey: 'group',
              value: 'G',
              hierarchyState: 'expand',
              children: [
                { dimensionKey: 'item', value: 'I1' },
                { dimensionKey: 'item', value: 'I2' }
              ]
            }
          ]
        }
      ],
      indicators: ['amount'],
      rowHierarchyType: 'tree',
      frozenColCount: 3,
      ...options
    });
    return table;
  }

  /** 与报告一致，仅传入行列路径，不依赖 cellLocation 或原始坐标。 */
  function address(col: number, row: number) {
    const { colHeaderPaths, rowHeaderPaths } = table.getCellHeaderPaths(col, row);
    return table.getCellAddressByHeaderPaths({ colHeaderPaths, rowHeaderPaths });
  }

  afterEach(() => {
    table?.release();
    document.body.innerHTML = '';
  });

  test('locates the extension leaf column instead of using dimension depth', () => {
    createTable();
    expect(table.getCellHeaderPaths(1, 2).rowHeaderPaths).toHaveLength(3);
    expect(address(1, 2)).toEqual({ col: 1, row: 2 });
  });

  test('uses the deepest matched header for shared row paths and preserves body addresses', () => {
    createTable();
    for (let row = 1; row < table.rowCount; row++) {
      expect(table.getCellHeaderPaths(0, row)).toEqual(table.getCellHeaderPaths(1, row));
      expect(address(0, row)).toEqual({ col: 1, row });
      expect(address(1, row)).toEqual({ col: 1, row });
      expect(address(2, row)).toEqual({ col: 2, row });
    }
  });

  test('includes the left series-number column offset', () => {
    createTable({ rowSeriesNumber: { title: 'No.', width: 40 } });
    expect(address(2, 2)).toEqual({ col: 2, row: 2 });
    expect(address(3, 2)).toEqual({ col: 3, row: 2 });
  });

  test('locates the last physical column with multiple extension trees', () => {
    createTable();
    const extensions = [
      ...table.options.extensionRows,
      {
        rows: ['extra'],
        rowTree: [
          { dimensionKey: 'extra', value: 'E1' },
          { dimensionKey: 'extra', value: 'E2' }
        ]
      }
    ];
    table.updateOption({ ...table.options, extensionRows: extensions });
    for (let row = 1; row < table.rowCount; row++) {
      expect(address(2, row)).toEqual({ col: 2, row });
      expect(address(3, row)).toEqual({ col: 3, row });
    }
  });

  test('keeps ordinary nested tree headers in one column', () => {
    createTable({
      extensionRows: undefined,
      rows: ['main', 'child'],
      rowTree: [
        {
          dimensionKey: 'main',
          value: 'A',
          hierarchyState: 'expand',
          children: [{ dimensionKey: 'child', value: 'A1' }]
        }
      ]
    });
    expect(address(0, 1)).toEqual({ col: 0, row: 1 });
    expect(address(0, 2)).toEqual({ col: 0, row: 2 });
    expect(address(1, 2)).toEqual({ col: 1, row: 2 });
    expect(table.getCellAddressByHeaderPaths([{ dimensionKey: 'main' }])).toEqual({ col: 0, row: undefined });
    expect(
      table.getCellAddressByHeaderPaths({
        colHeaderPaths: [],
        rowHeaderPaths: [{ dimensionKey: 'missing', value: 'missing' }]
      })
    ).toBeUndefined();
  });

  test('resolves current visible rows after collapsing and expanding an extension', () => {
    createTable();
    const expandedCount = table.rowCount;
    table.toggleHierarchyState(1, 1);
    expect(table.rowCount).toBeLessThan(expandedCount);
    expect(address(1, 1)).toEqual({ col: 1, row: 1 });
    table.toggleHierarchyState(1, 1);
    expect(table.rowCount).toBe(expandedCount);
    expect(address(1, 2)).toEqual({ col: 1, row: 2 });
  });

  test('preserves existing grid global-row lookup after pagination changes', () => {
    // grid 分页反查目前返回整表行号；本次只修树形列号，保持该行为。
    createTable({
      rowHierarchyType: 'grid',
      extensionRows: undefined,
      rowTree: ['A', 'B', 'C'].map(value => ({ dimensionKey: 'main', value })),
      pagination: { currentPage: 0, perPageCount: 2 }
    });
    expect(address(0, 2)).toEqual({ col: 0, row: 2 });
    table.updatePagination({ currentPage: 1 });
    expect(table.getCellValue(0, 1)).toBe('C');
    expect(address(0, 1)).toEqual({ col: 0, row: 3 });
    expect(address(1, 1)).toEqual({ col: 1, row: 3 });
  });
});
