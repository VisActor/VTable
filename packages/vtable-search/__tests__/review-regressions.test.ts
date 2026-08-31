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
    initialArrangements?: { col: number; row: number; style: string }[];
    columnHeaderLevelCount?: number;
  } = {}
) {
  const arrangements = (options.initialArrangements || []).map(item => ({
    cellPosition: { col: item.col, row: item.row },
    customStyleId: item.style
  }));
  const arrangementIndex = new Map(
    arrangements.map((item, index) => [`${item.cellPosition.col}:${item.cellPosition.row}`, index])
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
        arrangementIndex.set(`${item.cellPosition.col}:${item.cellPosition.row}`, index);
      });
    })
  };
  const table = {
    options: {
      columns: options.columns || [{ field: 'name' }]
    },
    records: options.records,
    rowCount: values.length + 1,
    colCount: values[0]?.length ?? 1,
    columnHeaderLevelCount: options.columnHeaderLevelCount ?? 1,
    isReleased: false,
    isHeader: jest.fn((_col, row) => row === 0),
    getCellValue: jest.fn((col, row) => (row === 0 ? 'Name' : values[row - 1][col])),
    getCellRange: jest.fn((col, row) => ({
      start: { col, row },
      end: { col, row }
    })),
    registerCustomCellStyle: jest.fn(),
    hasCustomCellStyle: jest.fn(() => true),
    arrangeCustomCellStyle: jest.fn((position, style) => {
      if (style) {
        const cellPosition = position.range || position;
        const key = `${cellPosition.col}:${cellPosition.row}`;
        const index = arrangementIndex.get(key);
        if (index === undefined) {
          customCellStylePlugin.customCellStyleArrangement.push({
            cellPosition,
            customStyleId: style
          });
          arrangementIndex.set(key, customCellStylePlugin.customCellStyleArrangement.length - 1);
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
    getBodyVisibleColRange: jest.fn(() => ({ colStart: 0, colEnd: values[0]?.length ?? 1 })),
    scrollToCell: jest.fn()
  };

  return { table, customCellStylePlugin };
}

function createTreeTable() {
  const records = [{ name: 'Main' }];
  const main = createCellTable([], {
    columns: [{ field: 'name', tree: true }],
    records,
    visibleRows: { rowStart: 1, rowEnd: 3 }
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
      { cellPosition: { col: 0, row: 1 }, customStyleId: '__search_component_highlight' }
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
  const detail = createCellTable([['Widget']]);
  main.table.internalProps = { subTableInstances: new Map([[5, detail.table]]) };
  const search = new SearchComponent({ table: main.table as any, autoJump: false });

  search.search('i');
  search.next();

  expect(main.table.scrollToCell).toHaveBeenCalledWith({ col: 0, row: 6 });
  expect(detail.table.scrollToCell).toHaveBeenCalled();
});
