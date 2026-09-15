/* eslint-env jest */
/* eslint-disable no-undef */
// @ts-nocheck

import { SearchComponent } from '../src';
import { CustomCellStylePlugin } from '../../vtable/src/plugins/custom-cell-style';

afterEach(() => {
  jest.restoreAllMocks();
  document.body.innerHTML = '';
});

function createCellTable(
  values: string[][],
  options: {
    columns?: any[];
    records?: any[];
    visibleRows?: { rowStart: number; rowEnd: number };
    visibleCols?: { colStart: number; colEnd: number };
    initialArrangements?: { col: number; row: number; style: string }[];
    columnHeaderLevelCount?: number;
    rowHierarchyType?: 'grid' | 'tree' | 'grid-tree';
    viewBox?: { x1: number; y1: number; x2: number; y2: number };
    tableNoFrameHeight?: number;
    frozenRowsHeight?: number;
    bottomFrozenRowsHeight?: number;
    frozenRowCount?: number;
    bottomFrozenRowCount?: number;
    cellRect?: (col: number, row: number) => { left: number; top: number; width: number; height: number };
    cellRangeRelativeRect?: (position: any) => {
      left: number;
      top: number;
      width: number;
      height: number;
    };
    isMasterDetail?: boolean;
  } = {}
) {
  const getArrangementKey = (cellPosition: any) => {
    if (cellPosition?.range) {
      const { start, end } = cellPosition.range;
      return `range:${start.col},${start.row},${end.col},${end.row}`;
    }
    if (typeof cellPosition?.col === 'number' && typeof cellPosition?.row === 'number') {
      return `cell:${cellPosition.col},${cellPosition.row}`;
    }
    return undefined;
  };
  const arrangements = (options.initialArrangements || []).map(item => ({
    cellPosition: { col: item.col, row: item.row },
    customStyleId: item.style
  }));
  const arrangementIndex = new Map(
    arrangements
      .map((item, index) => [getArrangementKey(item.cellPosition), index])
      .filter(([key]) => key !== undefined)
  );
  const registeredStyles = new Set<string>();
  const customCellStylePlugin = {
    customCellStyleArrangement: arrangements,
    addCustomCellStyleArrangement: jest.fn((cellPosition, customStyleId) => {
      customCellStylePlugin.customCellStyleArrangement.push({ cellPosition, customStyleId });
    }),
    clearCustomCellStyleArrangement: jest.fn(() => {
      customCellStylePlugin.customCellStyleArrangement = [];
    }),
    _rebuildCustomCellStyleArrangementIndex: jest.fn(() => {
      arrangementIndex.clear();
      customCellStylePlugin.customCellStyleArrangement.forEach((item, index) => {
        if (!item.customStyleId) {
          return;
        }
        const key = getArrangementKey(item.cellPosition);
        if (key) {
          arrangementIndex.set(key, index);
        }
      });
    })
  };
  const table = {
    isPivotTable: jest.fn(() => false),
    id: `table-${Math.random()}`,
    rowHierarchyType: options.rowHierarchyType,
    records: options.records,
    rowCount: values.length + 1,
    colCount: values[0]?.length ?? 1,
    columnHeaderLevelCount: options.columnHeaderLevelCount ?? 1,
    isReleased: false,
    isHeader: jest.fn((_col, row) => row === 0),
    getCellValue: jest.fn((col, row) => (row === 0 ? 'Name' : values[row - 1]?.[col])),
    getCellOriginValue: jest.fn((col, row) => (row === 0 ? 'Name' : values[row - 1]?.[col])),
    getCellHeaderPaths: jest.fn(() => undefined),
    getCellRange: jest.fn((col, row) => ({
      start: { col, row },
      end: { col, row }
    })),
    registerCustomCellStyle: jest.fn(styleId => {
      registeredStyles.add(styleId);
    }),
    hasCustomCellStyle: jest.fn(styleId => registeredStyles.has(styleId)),
    arrangeCustomCellStyle: jest.fn((position, style) => {
      if (style) {
        const key = getArrangementKey(position);
        const index = arrangementIndex.get(key);
        if (index === undefined) {
          customCellStylePlugin.customCellStyleArrangement.push({
            cellPosition: position,
            customStyleId: style
          });
          if (key) {
            arrangementIndex.set(key, customCellStylePlugin.customCellStyleArrangement.length - 1);
          }
        } else {
          customCellStylePlugin.customCellStyleArrangement[index].customStyleId = style;
        }
      }
    }),
    customCellStylePlugin,
    scenegraph: {
      updateCellContent: jest.fn(),
      updateNextFrame: jest.fn()
    },
    getBodyVisibleRowRange: jest.fn(() => options.visibleRows || { rowStart: 1, rowEnd: values.length + 1 }),
    getBodyVisibleColRange: jest.fn(() => options.visibleCols || { colStart: 0, colEnd: values[0]?.length ?? 1 }),
    getCellRect: jest.fn(
      options.cellRect || ((col: number, row: number) => ({ left: col * 100, top: row * 20, width: 100, height: 20 }))
    ),
    getCellRangeRelativeRect: jest.fn(
      options.cellRangeRelativeRect ||
        ((position: any) => {
          const col = position.col ?? position.start?.col ?? 0;
          const row = position.row ?? position.start?.row ?? 0;
          return { left: col * 100, top: row * 20, width: 100, height: 20 };
        })
    ),
    getVisibleRect: jest.fn(() => ({
      top: 0,
      bottom: options.tableNoFrameHeight ?? 200,
      left: 0,
      right: 800,
      height: options.tableNoFrameHeight ?? 200,
      width: 800
    })),
    tableNoFrameHeight: options.tableNoFrameHeight ?? 200,
    frozenRowCount: options.frozenRowCount ?? 0,
    bottomFrozenRowCount: options.bottomFrozenRowCount ?? 0,
    scrollTop: 0,
    tableY: 0,
    options: {
      columns: options.columns || [{ field: 'name' }],
      viewBox: options.viewBox
    },
    getFrozenRowsHeight: jest.fn(() => options.frozenRowsHeight ?? 0),
    getBottomFrozenRowsHeight: jest.fn(() => options.bottomFrozenRowsHeight ?? 0),
    scrollToCell: jest.fn()
  };

  if (options.isMasterDetail) {
    table.pluginManager = {
      getPluginByName: jest.fn(name => (name === 'Master Detail Plugin' ? {} : undefined))
    };
  }

  if (options.rowHierarchyType) {
    table.dataSource = {
      rowHierarchyType: options.rowHierarchyType,
      getTableIndex: jest.fn(index => (Array.isArray(index) ? index[0] : index))
    };
  }

  return { table, customCellStylePlugin, registeredStyles };
}

function attachRealCustomStylePlugin(
  target: ReturnType<typeof createCellTable>,
  customCellStyle: any[] = [],
  customCellStyleArrangement: any[] = []
) {
  const plugin = new CustomCellStylePlugin(
    target.table as any,
    customCellStyle as any,
    customCellStyleArrangement as any
  );
  target.table.customCellStylePlugin = plugin;
  target.table.registerCustomCellStyle = jest.fn(plugin.registerCustomCellStyle.bind(plugin));
  target.table.hasCustomCellStyle = jest.fn(plugin.hasCustomCellStyle.bind(plugin));
  target.table.arrangeCustomCellStyle = jest.fn(plugin.arrangeCustomCellStyle.bind(plugin));
  return plugin;
}

function createTreeTable() {
  const records = [{ name: 'Main' }];
  const main = createCellTable([], {
    columns: [{ field: 'name', tree: true }],
    records,
    visibleRows: { rowStart: 1, rowEnd: 3 },
    rowHierarchyType: 'tree'
  });
  main.table.rowCount = 2;
  main.table.colCount = 1;
  main.table.isHeader = jest.fn((_col, row) => row === 0);
  main.table.getCellValue = jest.fn((_col, row) => (row === 0 ? 'Name' : records[row - 1].name));
  main.table.dataSource = {
    getTableIndex: jest.fn(() => 0)
  };
  main.table.internalProps = {
    layoutMap: {
      getHeaderCellAddressByField: jest.fn(() => ({ col: 0, row: 0 }))
    },
    subTableInstances: new Map()
  };
  main.table.getHierarchyState = jest.fn(() => 'expand');
  main.table.toggleHierarchyState = jest.fn();
  return main;
}

test('clear keeps custom styles that do not belong to search', () => {
  const main = createCellTable([['Alice']], {
    initialArrangements: [{ col: 0, row: 1, style: 'user-style' }]
  });
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([
      { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-style' },
      expect.objectContaining({ customStyleId: '__search_component_highlight' })
    ])
  );

  search.next();

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([{ cellPosition: { col: 0, row: 1 }, customStyleId: 'user-style' }])
  );

  search.clear();

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual([
    { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-style' }
  ]);
});

test('merged search results keep their full range while navigating and clearing', () => {
  const main = createCellTable([['Alice', 'Alice']], {
    initialArrangements: [{ col: 0, row: 1, style: 'user-style' }]
  });
  main.table.colCount = 2;
  main.table.getCellRange = jest.fn((col, row) =>
    row === 1 ? { start: { col: 0, row: 1 }, end: { col: 1, row: 1 } } : { start: { col, row }, end: { col, row } }
  );
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([
      {
        cellPosition: { range: { start: { col: 0, row: 1 }, end: { col: 1, row: 1 } } },
        customStyleId: '__search_component_highlight'
      }
    ])
  );

  search.next();
  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([
      {
        cellPosition: { range: { start: { col: 0, row: 1 }, end: { col: 1, row: 1 } } },
        customStyleId: '__search_component_focus'
      }
    ])
  );

  search.clear();
  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual([
    { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-style' }
  ]);
});

test('released detail tables are removed from search state safely', () => {
  const main = createCellTable([['Alice']]);
  const detail = createCellTable([['Widget']]);
  main.table.internalProps = { subTableInstances: new Map([[0, detail.table]]) };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');
  expect(search.queryResult).toEqual(
    expect.arrayContaining([expect.objectContaining({ table: detail.table, value: 'Widget' })])
  );
  detail.table.isReleased = true;
  detail.table.scenegraph = null;
  main.table.internalProps.subTableInstances.clear();

  expect(() => search.clear()).not.toThrow();
  expect(search.queryResult).toHaveLength(0);
});

test('search skips all tables while the master table is entering release', () => {
  const main = createCellTable([['Alice']], { isMasterDetail: true });
  const detail = createCellTable([['Widget']]);
  main.table.internalProps = { subTableInstances: new Map([[0, detail.table]]) };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  main.table.internalProps._isReleasing = true;

  const result = search.search('i');

  expect(result.results).toHaveLength(0);
  expect(main.table.getCellValue).not.toHaveBeenCalled();
  expect(detail.table.getCellValue).not.toHaveBeenCalled();

  main.table.internalProps.subTableInstances.clear();
  main.table.pluginManager.getPluginByName.mockReturnValue(undefined);

  const resumedResult = search.search('i');

  expect(resumedResult.results).toHaveLength(1);
  expect(resumedResult.results[0]).toMatchObject({ table: main.table, value: 'Alice' });
});

test('search excludes a detail table while it is entering release', () => {
  const main = createCellTable([['Alice']], { isMasterDetail: true });
  const detail = createCellTable([['Widget']]);
  main.table.internalProps = { subTableInstances: new Map([[0, detail.table]]) };
  detail.table.internalProps = { _isReleasing: true };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  const result = search.search('i');

  expect(result.results).toHaveLength(1);
  expect(result.results[0]).toMatchObject({ table: main.table, value: 'Alice' });
  expect(detail.table.getCellValue).not.toHaveBeenCalled();
});

test('clearing stale results during master release does not touch table scenegraphs', () => {
  const main = createCellTable([['Alice']], { isMasterDetail: true });
  const detail = createCellTable([['Widget']]);
  main.table.internalProps = { subTableInstances: new Map([[0, detail.table]]) };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');
  main.table.scenegraph.updateCellContent.mockClear();
  main.table.scenegraph.updateNextFrame.mockClear();
  detail.table.scenegraph.updateCellContent.mockClear();
  detail.table.scenegraph.updateNextFrame.mockClear();
  main.table.internalProps._isReleasing = true;

  search.clear();

  expect(main.table.scenegraph.updateCellContent).not.toHaveBeenCalled();
  expect(main.table.scenegraph.updateNextFrame).not.toHaveBeenCalled();
  expect(detail.table.scenegraph.updateCellContent).not.toHaveBeenCalled();
  expect(detail.table.scenegraph.updateNextFrame).not.toHaveBeenCalled();
  expect(search.queryResult).toHaveLength(0);
});

test('tree master tables still search expanded detail tables', () => {
  const main = createTreeTable();
  const detail = createCellTable([['Widget']]);
  main.table.internalProps.subTableInstances.set(0, detail.table);
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  const result = search.search('i');

  expect(result.results).toHaveLength(2);
  expect(detail.customCellStylePlugin.customCellStyleArrangement).toEqual([
    {
      cellPosition: { col: 0, row: 1 },
      customStyleId: '__search_component_highlight'
    }
  ]);
  expect(detail.registeredStyles).toEqual(new Set(['__search_component_highlight', '__search_component_focus']));
});

test('detail result navigation scrolls the master row into view first', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 2 }
  });
  const detail = createCellTable([['Widget']], { visibleRows: { rowStart: 2, rowEnd: 2 } });
  main.table.internalProps = { subTableInstances: new Map([[5, detail.table]]) };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');
  search.next();

  expect(main.table.scrollToCell).toHaveBeenCalledWith({ row: 6 });
  expect(detail.table.scrollToCell).toHaveBeenCalled();
  expect(main.table.scrollToCell.mock.invocationCallOrder[0]).toBeLessThan(
    detail.table.scrollToCell.mock.invocationCallOrder[0]
  );
});

test('master-detail search does not recurse child records as tree results', () => {
  const main = createCellTable([['Parent']], {
    columns: [{ field: 'name', tree: true }],
    records: [{ name: 'Parent', children: [{ name: 'Widget' }] }],
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  const detail = createCellTable([['Widget']]);
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };
  main.table.getHierarchyState = jest.fn(() => 'expand');
  main.table.toggleHierarchyState = jest.fn();

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  const result = search.search('Widget');

  expect(result.results).toHaveLength(1);
  expect(result.results[0]).toMatchObject({
    col: 0,
    row: 1,
    value: 'Widget',
    table: detail.table,
    parentRow: 0
  });
  expect(result.results[0].indexNumber).toBeUndefined();
});

test('detail navigation scrolls the master when its expanded viewBox is clipped', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 1 },
    tableNoFrameHeight: 200,
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  const detail = createCellTable([['Widget']], {
    viewBox: { x1: 0, y1: 180, x2: 100, y2: 360 },
    cellRangeRelativeRect: () => ({ left: 0, top: 200, width: 100, height: 20 }),
    visibleRows: { rowStart: 2, rowEnd: 2 }
  });
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.next();

  expect(main.table.scrollToCell).toHaveBeenCalledWith({ row: 1 });
  expect(detail.table.scrollToCell).toHaveBeenCalled();
});

test('detail navigation offsets the master scroll when the target cell remains below the viewport', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 1 },
    tableNoFrameHeight: 200,
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  const detail = createCellTable([['Widget']], {
    cellRangeRelativeRect: () => ({ left: 0, top: 200, width: 100, height: 20 }),
    visibleRows: { rowStart: 2, rowEnd: 2 }
  });
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.next();

  expect(main.table.scrollTop).toBe(20);
});

test('detail navigation accounts for the master viewBox offset', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 1 },
    tableNoFrameHeight: 200,
    viewBox: { x1: 0, y1: 40, x2: 800, y2: 240 },
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  const detail = createCellTable([['Widget']], {
    cellRangeRelativeRect: () => ({ left: 0, top: 230, width: 100, height: 20 }),
    visibleRows: { rowStart: 2, rowEnd: 2 }
  });
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.next();

  expect(main.table.scrollTop).toBe(10);
});

test('detail navigation respects the master clipping area for frozen rows', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 1 },
    tableNoFrameHeight: 200,
    frozenRowsHeight: 40,
    bottomFrozenRowsHeight: 30,
    frozenRowCount: 2,
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  main.table.rowCount = 10;
  const detail = createCellTable([['Widget']], {
    cellRangeRelativeRect: () => ({ left: 0, top: 160, width: 100, height: 20 }),
    visibleRows: { rowStart: 2, rowEnd: 2 }
  });
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.next();

  expect(main.table.scrollTop).toBe(10);
});

test('detail navigation does not scroll the master for a visible viewBox after master scrolling', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 1 },
    tableNoFrameHeight: 200,
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  main.table.scrollTop = 400;
  main.table.getVisibleRect = jest.fn(() => ({
    top: 400,
    bottom: 600,
    left: 0,
    right: 800,
    height: 200,
    width: 800
  }));
  const detail = createCellTable([['Widget']], {
    viewBox: { x1: 0, y1: 20, x2: 100, y2: 100 },
    visibleRows: { rowStart: 1, rowEnd: 1 }
  });
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.next();

  expect(main.table.scrollToCell).not.toHaveBeenCalled();
});

test('detail navigation checks the target cell when the detail viewBox is taller than the master viewport', () => {
  const main = createCellTable([['Parent']], {
    visibleRows: { rowStart: 1, rowEnd: 1 },
    tableNoFrameHeight: 200,
    rowHierarchyType: 'grid',
    isMasterDetail: true
  });
  const detail = createCellTable([['Widget']], {
    viewBox: { x1: 0, y1: 20, x2: 100, y2: 520 },
    cellRangeRelativeRect: () => ({ left: 0, top: 40, width: 100, height: 20 }),
    visibleRows: { rowStart: 2, rowEnd: 2 }
  });
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.next();

  expect(main.table.scrollToCell).not.toHaveBeenCalled();
  expect(detail.table.scrollToCell).toHaveBeenCalled();
});

test('pruning unavailable results preserves the current result identity', () => {
  const main = createCellTable([['Parent']], { rowHierarchyType: 'grid', isMasterDetail: true });
  const first = createCellTable([['First']]);
  const second = createCellTable([['Middle']]);
  const third = createCellTable([['Third']]);
  main.table.internalProps = {
    subTableInstances: new Map([
      [0, first.table],
      [1, second.table],
      [2, third.table]
    ])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');
  search.currentIndex = 1;
  const currentResult = search.queryResult[1];

  first.table.isReleased = true;
  first.table.scenegraph = null;
  main.table.internalProps.subTableInstances.delete(0);
  search.updateCellStyle();

  expect(search.queryResult[search.currentIndex]).toBe(currentResult);
  expect(search.currentIndex).toBe(0);
});

test('search styles do not replace a user arrangement at the same cell', () => {
  const main = createCellTable([['Alice']], {
    initialArrangements: [{ col: 0, row: 1, style: 'user-style' }]
  });
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');

  main.table.arrangeCustomCellStyle({ col: 0, row: 1 }, 'user-updated');

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([
      { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-updated' },
      expect.objectContaining({ customStyleId: '__search_component_highlight' })
    ])
  );
});

test('search styles remain separate when a user adds a style to an unstyled cell', () => {
  const main = createCellTable([['Alice']]);
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');

  main.table.arrangeCustomCellStyle({ col: 0, row: 1 }, 'user-updated');

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ customStyleId: 'user-updated' }),
      expect.objectContaining({ customStyleId: '__search_component_highlight' })
    ])
  );
});

test('search styles do not replace a user range arrangement at the same cell', () => {
  const main = createCellTable([['Alice']]);
  const userRange = {
    start: { col: 0, row: 1 },
    end: { col: 0, row: 1 }
  };
  main.customCellStylePlugin.customCellStyleArrangement.push({
    cellPosition: { range: userRange },
    customStyleId: 'user-range-style'
  });
  main.customCellStylePlugin._rebuildCustomCellStyleArrangementIndex();

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('i');

  main.table.arrangeCustomCellStyle({ range: userRange }, 'user-range-updated');

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual(
    expect.arrayContaining([
      { cellPosition: { range: userRange }, customStyleId: 'user-range-updated' },
      expect.objectContaining({ customStyleId: '__search_component_highlight' })
    ])
  );

  search.clear();

  expect(main.customCellStylePlugin.customCellStyleArrangement).toEqual([
    { cellPosition: { range: userRange }, customStyleId: 'user-range-updated' }
  ]);
});

test('real style plugin keeps multiple user styles separate from search overlays', () => {
  const main = createCellTable([['Alice']]);
  const plugin = attachRealCustomStylePlugin(
    main,
    [
      { id: 'user-a', style: { color: 'red' } },
      { id: 'user-b', style: { fontWeight: 'bold' } },
      { id: 'user-updated', style: { color: 'blue' } }
    ],
    [
      { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-a' },
      { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-b' }
    ]
  );
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('Ali');
  main.table.arrangeCustomCellStyle({ col: 0, row: 1 }, 'user-updated');

  expect(plugin.customCellStyleArrangement).toEqual([
    { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-a' },
    { cellPosition: { col: 0, row: 1 }, customStyleId: 'user-updated' }
  ]);
  expect(plugin.getCustomCellStyleIds(0, 1)).toEqual(['user-a', 'user-updated', '__search_component_highlight']);

  search.clear();

  expect(plugin.customCellStyleArrangement).toHaveLength(2);
  expect(plugin.getCustomCellStyleIds(0, 1)).toEqual(['user-a', 'user-updated']);
});

test('real style plugin indexes merged search overlays without growing the public arrangement list', () => {
  const values = Array.from({ length: 80 }, (_, index) => `Hit ${Math.floor(index / 2)}`);
  const main = createCellTable([values]);
  main.table.colCount = values.length;
  main.table.getCellRange = jest.fn((col, row) => {
    if (row !== 1) {
      return { start: { col, row }, end: { col, row } };
    }
    const startCol = col - (col % 2);
    return { start: { col: startCol, row }, end: { col: startCol + 1, row } };
  });
  let arrangementReads = 0;
  const publicArrangements = new Proxy([], {
    get(target, property, receiver) {
      if (typeof property === 'string' && /^\d+$/.test(property)) {
        arrangementReads++;
      }
      return Reflect.get(target, property, receiver);
    }
  });
  const plugin = attachRealCustomStylePlugin(main, [], publicArrangements);
  main.table.scenegraph.updateCellContent.mockImplementation((col, row) => {
    plugin.getCustomCellStyleIds(col, row);
  });
  const collectStyleIdsSpy = jest.spyOn(plugin as any, '_collectCustomCellStyleIds');
  const search = new SearchComponent({ table: main.table as any, autoJump: false, skipHeader: true });
  arrangementReads = 0;

  const result = search.search('Hit');

  expect(result.results).toHaveLength(40);
  expect(plugin.customCellStyleArrangement).toHaveLength(0);
  expect((plugin as any)._customCellStyleOverlays.get('__search_component_overlay').positions.size).toBe(40);
  expect(main.table.scenegraph.updateCellContent).toHaveBeenCalledTimes(80);
  expect(main.table.scenegraph.updateCellContent.mock.calls.map(([col]) => col)).toEqual(
    Array.from({ length: 80 }, (_, col) => col)
  );
  expect(collectStyleIdsSpy).toHaveBeenCalledTimes(40);
  expect(arrangementReads).toBe(0);
});

test('real plugin navigation updates only the previous and current overlays', () => {
  const main = createCellTable([['Alice', 'Alina']]);
  main.table.colCount = 2;
  const plugin = attachRealCustomStylePlugin(main);
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('Ali');
  const setOverlaySpy = jest.spyOn(plugin, 'setCustomCellStyleOverlay');

  search.next();
  search.next();

  expect(setOverlaySpy).toHaveBeenCalledTimes(3);
  expect(plugin.customCellStyleArrangement).toHaveLength(0);
});

test('visible range boundaries are treated as inclusive', () => {
  const main = createCellTable(
    [
      ['One', 'Two'],
      ['Three', 'Four']
    ],
    {
      visibleRows: { rowStart: 1, rowEnd: 2 },
      visibleCols: { colStart: 0, colEnd: 1 }
    }
  );
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.jumpToCell({ col: 1, row: 2 });

  expect(main.table.scrollToCell).not.toHaveBeenCalled();
});

test('detail results expose their source table and parent body row', () => {
  const main = createCellTable([['Parent']], { rowHierarchyType: 'grid', isMasterDetail: true });
  const first = createCellTable([['Widget']]);
  const second = createCellTable([['Widget']]);
  main.table.internalProps = {
    subTableInstances: new Map([
      [3, first.table],
      [7, second.table]
    ])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  const result = search.search('i');

  expect(result.results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ table: first.table, parentRow: 3, row: 1, col: 0 }),
      expect.objectContaining({ table: second.table, parentRow: 7, row: 1, col: 0 })
    ])
  );
});

test('tree detail search includes collapsed descendants from raw records', () => {
  const main = createCellTable([['Parent']], { rowHierarchyType: 'grid', isMasterDetail: true });
  const detail = createCellTable([['Parent']], {
    columns: [{ field: 'name', tree: true }],
    records: [{ name: 'Parent', children: [{ name: 'HiddenWidget' }] }],
    rowHierarchyType: 'tree'
  });
  detail.table.rowCount = 2;
  detail.table.dataSource = {
    rowHierarchyType: 'tree',
    getTableIndex: jest.fn(index => (Array.isArray(index) && index.length > 1 ? -1 : 0))
  };
  detail.table.internalProps = {
    layoutMap: {
      getHeaderCellAddressByField: jest.fn(() => ({ col: 0, row: 0 }))
    }
  };
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  const result = search.search('Hidden');

  expect(result.results).toEqual([
    expect.objectContaining({
      indexNumber: [0, 0],
      table: detail.table,
      parentRow: 0,
      value: 'HiddenWidget'
    })
  ]);
});

test('page scrolling includes a detail table viewBox offset', () => {
  const main = createCellTable([['Parent']], { rowHierarchyType: 'grid', isMasterDetail: true });
  const detail = createCellTable([['Widget']], {
    viewBox: { x1: 0, y1: 500, x2: 100, y2: 700 },
    cellRangeRelativeRect: () => ({ left: 0, top: 500, width: 100, height: 20 })
  });
  const scrollContainer = document.createElement('div');
  const root = document.createElement('div');
  scrollContainer.style.overflowY = 'auto';
  Object.defineProperty(scrollContainer, 'clientHeight', { configurable: true, value: 100 });
  Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 1000 });
  Object.defineProperty(scrollContainer, 'scrollTop', { configurable: true, writable: true, value: 0 });
  Object.defineProperty(scrollContainer, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100 })
  });
  Object.defineProperty(root, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ top: 0, bottom: 100, left: 0, right: 100, width: 100, height: 100 })
  });
  scrollContainer.appendChild(root);
  document.body.appendChild(scrollContainer);
  detail.table.getElement = () => root;
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({ table: main.table as any, autoJump: false, enableViewportScroll: true });
  search.jumpToCell({ col: 0, row: 1 }, detail.table as any);

  expect(scrollContainer.scrollTop).toBe(420);
});

test('scrolling a detail result keeps the master horizontal position', () => {
  const main = createCellTable([['Parent']], {
    rowHierarchyType: 'grid',
    isMasterDetail: true,
    visibleRows: { rowStart: 2, rowEnd: 2 }
  });
  const detail = createCellTable([['Widget']]);
  main.table.scrollLeft = 120;
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');
  search.next();

  expect(main.table.scrollLeft).toBe(120);
  expect(main.table.scrollToCell).toHaveBeenCalledWith({ row: 1 });
});

test('normal navigation does not check every result for availability', () => {
  const main = createCellTable([['Alice', 'Alina', 'Alicia']], { rowHierarchyType: 'grid' });
  main.table.colCount = 3;
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('Ali');

  const availabilitySpy = jest.spyOn(search as any, 'isResultAvailable');
  search.next();
  search.next();
  search.prev();

  expect(availabilitySpy).not.toHaveBeenCalled();
});

test('tree-configured pivot tables search rendered cells instead of raw records', () => {
  const pivot = createCellTable([['North', 'Hit total']], { rowHierarchyType: 'tree' });
  pivot.table.isPivotTable.mockReturnValue(true);
  const search = new SearchComponent({ table: pivot.table as any, autoJump: false, skipHeader: true });

  const result = search.search('Hit');

  expect(result.results).toEqual([expect.objectContaining({ table: pivot.table, col: 1, row: 1, value: 'Hit total' })]);
  expect(result.results[0].indexNumber).toBeUndefined();
});

test('bulk highlighting creates every result and arrangement', () => {
  const main = createCellTable([Array.from({ length: 100 }, (_, index) => `Hit ${index}`)]);
  main.table.colCount = 100;
  const search = new SearchComponent({ table: main.table as any, autoJump: false, skipHeader: true });

  const result = search.search('Hit');

  expect(result.results).toHaveLength(100);
  expect(main.customCellStylePlugin.customCellStyleArrangement).toHaveLength(100);
});

test('navigation rebuilds a middle style cache entry mutated in place', () => {
  const main = createCellTable([['Alice', 'Alina', 'Alicia']]);
  main.table.colCount = 3;
  const search = new SearchComponent({ table: main.table as any, autoJump: false, skipHeader: true });
  search.search('Ali');
  const arrangements = main.customCellStylePlugin.customCellStyleArrangement;
  const firstArrangement = arrangements[0];
  const detachedSearchStyle = arrangements[1];
  const lastArrangement = arrangements[2];
  arrangements.splice(1, 1, {
    cellPosition: { col: 1, row: 1 },
    customStyleId: 'user-style'
  });

  search.next();
  search.next();

  expect(detachedSearchStyle.customStyleId).toBe('__search_component_highlight');
  expect(arrangements[0]).toBe(firstArrangement);
  expect(arrangements[2]).toBe(lastArrangement);
  expect(arrangements).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ customStyleId: 'user-style' }),
      expect.objectContaining({ customStyleId: '__search_component_focus' })
    ])
  );
});

test('expanding a tree result rebuilds highlights with current row coordinates', () => {
  const records = [
    { name: 'Hit before' },
    { name: 'Parent', children: [{ name: 'Hit child' }] },
    { name: 'Hit after' }
  ];
  const main = createCellTable([], {
    columns: [{ field: 'name', tree: true }],
    records,
    rowHierarchyType: 'tree'
  });
  let expanded = false;
  main.table.rowCount = 4;
  main.table.dataSource.getTableIndex = jest.fn(index => {
    const path = Array.isArray(index) ? index : [index];
    if (path[0] === 0) {
      return 0;
    }
    if (path[0] === 1 && path.length === 1) {
      return 1;
    }
    if (path[0] === 1 && path[1] === 0) {
      return expanded ? 2 : -1;
    }
    if (path[0] === 2) {
      return expanded ? 3 : 2;
    }
    return -1;
  });
  main.table.getHierarchyState = jest.fn(() => (expanded ? 'expand' : 'collapse'));
  main.table.toggleHierarchyState = jest.fn(() => {
    expanded = true;
    main.table.rowCount = 5;
  });
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('Hit');
  search.next();

  const searchArrangements = main.customCellStylePlugin.customCellStyleArrangement.filter(item =>
    item.customStyleId?.startsWith('__search_component_')
  );
  expect(searchArrangements).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        cellPosition: { col: 0, row: 3 },
        customStyleId: '__search_component_focus'
      }),
      expect.objectContaining({ cellPosition: { col: 0, row: 4 }, customStyleId: '__search_component_highlight' })
    ])
  );
  expect(searchArrangements).not.toEqual(
    expect.arrayContaining([expect.objectContaining({ cellPosition: { col: 0, row: 2 } })])
  );
});

test('next keeps its direction when the current detail result is released', () => {
  const main = createCellTable([['Match']], { isMasterDetail: true });
  const firstDetail = createCellTable([['Match first']]);
  const secondDetail = createCellTable([['Match second']]);
  main.table.internalProps = {
    subTableInstances: new Map([
      [0, firstDetail.table],
      [1, secondDetail.table]
    ])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false, skipHeader: true });
  search.search('Match');
  search.next();
  search.next();
  firstDetail.table.isReleased = true;
  firstDetail.table.scenegraph = null;

  const result = search.next();

  expect(result.index).toBe(1);
  expect(result.results[1].table).toBe(secondDetail.table);
});

test('next keeps its direction when multiple results before and at the current index are released', () => {
  const main = createCellTable([['Match']], { isMasterDetail: true });
  const firstDetail = createCellTable([['Match first']]);
  const secondDetail = createCellTable([['Match second']]);
  const thirdDetail = createCellTable([['Match third']]);
  main.table.internalProps = {
    subTableInstances: new Map([
      [0, firstDetail.table],
      [1, secondDetail.table],
      [2, thirdDetail.table]
    ])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false, skipHeader: true });
  search.search('Match');
  search.next();
  search.next();
  search.next();
  firstDetail.table.isReleased = true;
  firstDetail.table.scenegraph = null;
  secondDetail.table.isReleased = true;
  secondDetail.table.scenegraph = null;

  const result = search.next();

  expect(result.index).toBe(1);
  expect(result.results[1].table).toBe(thirdDetail.table);
});

test('prev keeps its direction when multiple results including the current detail are released', () => {
  const main = createCellTable([['Match']], { isMasterDetail: true });
  const firstDetail = createCellTable([['Match first']]);
  const secondDetail = createCellTable([['Match second']]);
  const thirdDetail = createCellTable([['Match third']]);
  const fourthDetail = createCellTable([['Match fourth']]);
  main.table.internalProps = {
    subTableInstances: new Map([
      [0, firstDetail.table],
      [1, secondDetail.table],
      [2, thirdDetail.table],
      [3, fourthDetail.table]
    ])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false, skipHeader: true });
  search.search('Match');
  search.next();
  search.next();
  search.next();
  search.next();
  firstDetail.table.isReleased = true;
  firstDetail.table.scenegraph = null;
  thirdDetail.table.isReleased = true;
  thirdDetail.table.scenegraph = null;

  const result = search.prev();

  expect(result.index).toBe(1);
  expect(result.results[1].table).toBe(secondDetail.table);
});

test('result navigation uses the recorded detail parent row without a reverse scan', () => {
  const main = createCellTable([['Parent']], { isMasterDetail: true });
  const detail = createCellTable([['Widget']]);
  const subTableInstances = new Map([[7, detail.table]]);
  main.table.internalProps = { subTableInstances };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  const result = search.search('Widget');
  const reverseLookupSpy = jest.spyOn(search as any, 'getSubTableBodyRowIndex');

  search.next();

  expect(result.results[0].parentRow).toBe(7);
  expect(reverseLookupSpy).not.toHaveBeenCalled();
  expect(main.table.scrollToCell).toHaveBeenCalledWith({ row: 8 });
});

test('tree detail navigation uses synchronous local scrolling before reading its target geometry', () => {
  const main = createCellTable([['Parent']], { isMasterDetail: true });
  let detailScrolled = false;
  const geometryReads: boolean[] = [];
  const detail = createCellTable([['Widget']], {
    columns: [{ field: 'name', tree: true }],
    records: [{ name: 'Widget' }],
    rowHierarchyType: 'tree',
    cellRangeRelativeRect: () => {
      geometryReads.push(detailScrolled);
      return { left: 0, top: detailScrolled ? 50 : 500, width: 100, height: 20 };
    }
  });
  detail.table.scrollToCell.mockImplementation((_cell, option) => {
    if (option === false) {
      detailScrolled = true;
    }
  });
  main.table.internalProps = { subTableInstances: new Map([[0, detail.table]]) };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.jumpToCell({ IndexNumber: [0], col: 0 }, detail.table as any, 0);

  expect(detail.table.scrollToCell).toHaveBeenCalledWith({ row: 1, col: 0 }, false);
  expect(geometryReads.length).toBeGreaterThan(0);
  expect(geometryReads.every(Boolean)).toBe(true);
  expect(main.table.scrollTop).toBe(0);
});

test('search result table IDs remain unique when VTable timestamp IDs collide', () => {
  const main = createCellTable([['Parent']], { isMasterDetail: true });
  const firstDetail = createCellTable([['Widget one']]);
  const secondDetail = createCellTable([['Widget two']]);
  firstDetail.table.id = 'VTable123';
  secondDetail.table.id = 'VTable123';
  main.table.internalProps = {
    subTableInstances: new Map([
      [0, firstDetail.table],
      [1, secondDetail.table]
    ])
  };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  const result = search.search('Widget');

  expect(result.results.map(item => item.tableId)).toEqual(['VTable123', 'VTable123-1']);
});
