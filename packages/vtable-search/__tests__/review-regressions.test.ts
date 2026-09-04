/* eslint-env jest */
/* eslint-disable no-undef */
// @ts-nocheck

import { SearchComponent } from '../src';

function createCellTable(
  values: string[][],
  options: {
    columns?: any[];
    records?: any[];
    visibleRows?: { rowStart: number; rowEnd: number };
    visibleCols?: { colStart: number; colEnd: number };
    initialArrangements?: { col: number; row: number; style: string }[];
    columnHeaderLevelCount?: number;
    rowHierarchyType?: 'grid' | 'tree';
    viewBox?: { x1: number; y1: number; x2: number; y2: number };
    tableNoFrameHeight?: number;
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
    id: `table-${Math.random()}`,
    rowHierarchyType: options.rowHierarchyType,
    records: options.records,
    rowCount: values.length + 1,
    colCount: values[0]?.length ?? 1,
    columnHeaderLevelCount: options.columnHeaderLevelCount ?? 1,
    isReleased: false,
    isHeader: jest.fn((_col, row) => row === 0),
    getCellValue: jest.fn((col, row) => (row === 0 ? 'Name' : values[row - 1]?.[col])),
    getCellRange: jest.fn((col, row) => ({
      start: { col, row },
      end: { col, row }
    })),
    registerCustomCellStyle: jest.fn(),
    hasCustomCellStyle: jest.fn(() => true),
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
    scrollTop: 0,
    tableY: 0,
    options: {
      columns: options.columns || [{ field: 'name' }],
      viewBox: options.viewBox
    },
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

  return { table, customCellStylePlugin };
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
  detail.table.isReleased = true;
  detail.table.scenegraph = null;
  main.table.internalProps.subTableInstances.clear();

  expect(() => search.clear()).not.toThrow();
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

test('navigation does not rebuild the custom style index for search entries', () => {
  const main = createCellTable([['Alice', 'Alina']]);
  main.table.colCount = 2;
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('Ali');
  const rebuildIndex = main.customCellStylePlugin._rebuildCustomCellStyleArrangementIndex;
  rebuildIndex.mockClear();

  search.next();
  search.next();

  expect(rebuildIndex).not.toHaveBeenCalled();
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

test('normal navigation does not filter the entire result list', () => {
  const main = createCellTable([['Alice', 'Alina', 'Alicia']], { rowHierarchyType: 'grid' });
  main.table.colCount = 3;
  const search = new SearchComponent({ table: main.table as any, autoJump: false });
  search.search('Ali');

  const filterSpy = jest.spyOn(Array.prototype, 'filter');
  search.next();
  search.next();
  search.prev();

  expect(filterSpy).not.toHaveBeenCalled();
  filterSpy.mockRestore();
});
