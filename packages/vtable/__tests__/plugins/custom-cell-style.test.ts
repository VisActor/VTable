// @ts-nocheck
import { CustomCellStylePlugin } from '../../src/plugins/custom-cell-style';

function createMockTable(colCount = 5000, rowCount = 5000) {
  return {
    colCount,
    rowCount,
    getCellRange: (col: number, row: number) => ({
      start: { col, row },
      end: { col, row }
    }),
    getCellValue: jest.fn(),
    getCellOriginValue: jest.fn(),
    getCellHeaderPaths: jest.fn(),
    scenegraph: {
      updateCellContent: jest.fn(),
      updateNextFrame: jest.fn()
    }
  };
}

describe('CustomCellStylePlugin', () => {
  test('apply and clear single cell style without shrinking array', () => {
    const table = createMockTable();
    const plugin = new CustomCellStylePlugin(
      table as any,
      [
        {
          id: 's1',
          style: { bgColor: 'red' }
        }
      ] as any,
      [] as any
    );

    plugin.arrangeCustomCellStyle({ col: 1, row: 2 }, 's1');
    expect(plugin.getCustomCellStyleIds(1, 2)).toEqual(['s1']);
    expect(plugin.getCustomCellStyle(1, 2)).toEqual({ bgColor: 'red' });

    const beforeClearLength = plugin.customCellStyleArrangement.length;
    plugin.arrangeCustomCellStyle({ col: 1, row: 2 }, null);
    expect(plugin.getCustomCellStyleIds(1, 2)).toEqual([]);
    expect(plugin.getCustomCellStyle(1, 2)).toBeUndefined();
    expect(plugin.customCellStyleArrangement.length).toBe(beforeClearLength);
    expect((plugin as any)._customCellStyleArrangementTombstoneCount).toBe(1);
  });

  test('does not delete wrong cell when index map is stale', () => {
    const table = createMockTable();
    const plugin = new CustomCellStylePlugin(
      table as any,
      [
        { id: 'a', style: { bgColor: 'red' } },
        { id: 'b', style: { bgColor: 'blue' } }
      ] as any,
      [] as any
    );

    plugin.arrangeCustomCellStyle({ col: 1, row: 1 }, 'a');
    plugin.arrangeCustomCellStyle({ col: 2, row: 2 }, 'b');

    const arr = plugin.customCellStyleArrangement;
    const tmp = arr[0];
    arr[0] = arr[1];
    arr[1] = tmp;

    plugin.arrangeCustomCellStyle({ col: 1, row: 1 }, null);

    expect(plugin.getCustomCellStyleIds(1, 1)).toEqual([]);
    expect(plugin.getCustomCellStyleIds(2, 2)).toEqual(['b']);
  });

  test('compacts tombstones during massive clears and keeps index consistent', () => {
    const table = createMockTable(10000, 2);
    const plugin = new CustomCellStylePlugin(
      table as any,
      [
        {
          id: 's',
          style: { bgColor: 'yellow' }
        }
      ] as any,
      [] as any
    );

    const total = 3000;
    const removed = 2500;
    for (let i = 0; i < total; i++) {
      plugin.arrangeCustomCellStyle({ col: i, row: 0 }, 's');
    }
    for (let i = 0; i < removed; i++) {
      plugin.arrangeCustomCellStyle({ col: i, row: 0 }, null);
    }

    expect((plugin as any)._customCellStyleArrangementTombstoneCount).toBeLessThan(2048);
    expect((plugin as any)._customCellStyleArrangementIndex.size).toBe(total - removed);

    for (let i = 0; i < removed; i++) {
      expect(plugin.getCustomCellStyleIds(i, 0)).toEqual([]);
    }
    for (let i = removed; i < total; i++) {
      expect(plugin.getCustomCellStyleIds(i, 0)).toEqual(['s']);
    }
  });

  test('uses fast update when style only touches cellStyleKeys', () => {
    const table = createMockTable();
    const plugin = new CustomCellStylePlugin(
      table as any,
      [
        {
          id: 's',
          style: { bgColor: 'red', color: '#000' }
        }
      ] as any,
      [] as any
    );

    plugin.arrangeCustomCellStyle({ col: 3, row: 4 }, 's');
    const calls = (table as any).scenegraph.updateCellContent.mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const lastCall = calls[calls.length - 1];
    expect(lastCall[0]).toBe(3);
    expect(lastCall[1]).toBe(4);
    expect(lastCall[2]).toBe(true);
  });
});
