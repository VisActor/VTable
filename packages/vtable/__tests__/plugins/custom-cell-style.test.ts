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

  test('uses indexed overlays without scanning unrelated search positions', () => {
    let numericReads = 0;
    const arrangements = new Proxy([], {
      get(target, property, receiver) {
        if (typeof property === 'string' && /^\d+$/.test(property)) {
          numericReads++;
        }
        return Reflect.get(target, property, receiver);
      }
    });
    const plugin = new CustomCellStylePlugin(
      createMockTable(1000, 1) as any,
      [{ id: 's', style: { bgColor: 'yellow' } }] as any,
      arrangements as any
    );
    for (let col = 0; col < 1000; col++) {
      plugin.setCustomCellStyleOverlay('search', { range: { start: { col, row: 0 }, end: { col, row: 0 } } }, 's');
    }
    numericReads = 0;

    expect(plugin.getCustomCellStyleIds(500, 0)).toEqual(['s']);
    expect(numericReads).toBeLessThan(10);
  });

  test('keeps exact and range styles in arrangement order', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [
        { id: 'range-first', style: { bgColor: 'red' } },
        { id: 'exact', style: { color: 'white' } },
        { id: 'range-last', style: { fontWeight: 'bold' } }
      ] as any,
      [
        {
          cellPosition: { range: { start: { col: 0, row: 0 }, end: { col: 5, row: 5 } } },
          customStyleId: 'range-first'
        },
        { cellPosition: { col: 2, row: 2 }, customStyleId: 'exact' },
        {
          cellPosition: { range: { start: { col: 1, row: 1 }, end: { col: 3, row: 3 } } },
          customStyleId: 'range-last'
        }
      ] as any
    );

    expect(plugin.getCustomCellStyleIds(2, 2)).toEqual(['range-first', 'exact', 'range-last']);
  });

  test('clearing arrangements also clears lookup indexes', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [{ id: 's', style: { bgColor: 'red' } }] as any,
      [{ cellPosition: { col: 1, row: 2 }, customStyleId: 's' }] as any
    );

    plugin.clearCustomCellStyleArrangement();

    expect((plugin as any)._customCellStyleArrangementIndex.size).toBe(0);
    expect(plugin.getCustomCellStyleIds(1, 2)).toEqual([]);
  });

  test('keeps search overlays separate from user arrangement updates', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [
        { id: 'user-a', style: { color: 'red' } },
        { id: 'user-b', style: { fontWeight: 'bold' } },
        { id: 'user-updated', style: { color: 'blue' } },
        { id: 'search', style: { bgColor: 'yellow' } }
      ] as any,
      [
        { cellPosition: { col: 1, row: 2 }, customStyleId: 'user-a' },
        { cellPosition: { col: 1, row: 2 }, customStyleId: 'user-b' }
      ] as any
    );
    plugin.setCustomCellStyleOverlay('search-component', { col: 1, row: 2 }, 'search');

    plugin.arrangeCustomCellStyle({ col: 1, row: 2 }, 'user-updated');

    expect(plugin.customCellStyleArrangement).toEqual([
      { cellPosition: { col: 1, row: 2 }, customStyleId: 'user-a' },
      { cellPosition: { col: 1, row: 2 }, customStyleId: 'user-updated' }
    ]);
    expect(plugin.getCustomCellStyleIds(1, 2)).toEqual(['user-a', 'user-updated', 'search']);

    plugin.clearCustomCellStyleOverlay('search-component');

    expect(plugin.getCustomCellStyleIds(1, 2)).toEqual(['user-a', 'user-updated']);
  });

  test('reads direct public arrangement mutations without a lookup cache', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [
        { id: 'first', style: { color: 'red' } },
        { id: 'second', style: { color: 'blue' } }
      ] as any,
      [{ cellPosition: { col: 1, row: 1 }, customStyleId: 'first' }] as any
    );

    plugin.customCellStyleArrangement.splice(0, 1, {
      cellPosition: { col: 2, row: 2 },
      customStyleId: 'second'
    } as any);

    expect(plugin.getCustomCellStyleIds(1, 1)).toEqual([]);
    expect(plugin.getCustomCellStyleIds(2, 2)).toEqual(['second']);
  });

  test('updates and clears positions inserted directly into the public arrangement array', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [
        { id: 'first', style: { color: 'red' } },
        { id: 'second', style: { color: 'blue' } }
      ] as any,
      [] as any
    );
    plugin.customCellStyleArrangement.push({
      cellPosition: { col: 3, row: 4 },
      customStyleId: 'first'
    } as any);

    plugin.arrangeCustomCellStyle({ col: 3, row: 4 }, 'second');

    expect(plugin.customCellStyleArrangement).toHaveLength(1);
    expect(plugin.getCustomCellStyleIds(3, 4)).toEqual(['second']);

    plugin.arrangeCustomCellStyle({ col: 3, row: 4 }, null);

    expect(plugin.getCustomCellStyleIds(3, 4)).toEqual([]);
  });

  test('updates the latest style after a same-position public append', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [
        { id: 'first', style: { color: 'red' } },
        { id: 'second', style: { color: 'blue' } },
        { id: 'updated', style: { color: 'green' } }
      ] as any,
      [{ cellPosition: { col: 2, row: 2 }, customStyleId: 'first' }] as any
    );
    plugin.customCellStyleArrangement.push({
      cellPosition: { col: 2, row: 2 },
      customStyleId: 'second'
    } as any);

    plugin.arrangeCustomCellStyle({ col: 2, row: 2 }, 'updated');

    expect(plugin.customCellStyleArrangement).toEqual([
      { cellPosition: { col: 2, row: 2 }, customStyleId: 'first' },
      { cellPosition: { col: 2, row: 2 }, customStyleId: 'updated' }
    ]);

    plugin.arrangeCustomCellStyle({ col: 2, row: 2 }, null);

    expect(plugin.getCustomCellStyleIds(2, 2)).toEqual(['first']);
    expect((plugin as any)._customCellStyleArrangementIndex.get('cell:2,2')).toBe(0);
  });

  test('updates the correct style after a direct public deletion shifts indexes', () => {
    const plugin = new CustomCellStylePlugin(
      createMockTable() as any,
      [
        { id: 'first', style: { color: 'red' } },
        { id: 'second', style: { color: 'blue' } },
        { id: 'updated', style: { color: 'green' } }
      ] as any,
      [
        { cellPosition: { col: 1, row: 1 }, customStyleId: 'first' },
        { cellPosition: { col: 2, row: 2 }, customStyleId: 'second' }
      ] as any
    );
    plugin.customCellStyleArrangement.splice(0, 1);

    plugin.arrangeCustomCellStyle({ col: 2, row: 2 }, 'updated');

    expect(plugin.customCellStyleArrangement).toEqual([{ cellPosition: { col: 2, row: 2 }, customStyleId: 'updated' }]);
    expect((plugin as any)._customCellStyleArrangementIndex.get('cell:2,2')).toBe(0);
  });

  test('bulk updates arrangements with a single index rebuild', () => {
    const table = createMockTable(1000, 2);
    const plugin = new CustomCellStylePlugin(table as any, [] as any, [] as any);
    const rebuildSpy = jest.spyOn(plugin as any, '_rebuildCustomCellStyleArrangementIndex');
    const arrangements = Array.from({ length: 1000 }, (_, col) => ({
      cellPosition: { col, row: 0 },
      customStyleId: 'bulk'
    }));
    arrangements.push({
      cellPosition: { col: 500, row: 0 },
      customStyleId: 'updated'
    });

    plugin.updateCustomCell(
      [
        { id: 'bulk', style: { bgColor: 'yellow' } },
        { id: 'updated', style: { bgColor: 'green' } }
      ] as any,
      arrangements as any
    );

    expect(rebuildSpy).toHaveBeenCalledTimes(1);
    expect(plugin.customCellStyleArrangement).toHaveLength(1000);
    expect((plugin as any)._customCellStyleArrangementIndex.size).toBe(1000);
    expect(plugin.getCustomCellStyleIds(500, 0)).toEqual(['updated']);
    expect(table.scenegraph.updateCellContent).toHaveBeenCalledTimes(1000);
    expect(table.scenegraph.updateNextFrame).toHaveBeenCalledTimes(1);
  });
});
