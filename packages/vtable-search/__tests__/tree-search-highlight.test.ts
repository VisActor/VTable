/* eslint-env jest */
/* eslint-disable no-undef */
// @ts-nocheck

import { SearchComponent } from '../src';

type TreeRecord = {
  [key: string]: unknown;
  children?: TreeRecord[];
};

function pathKey(path: number[]) {
  return path.join('.');
}

function createTreeTableMock(records: TreeRecord[]) {
  const expandedPaths = new Set<string>();
  const arrangementMap = new Map<string, { cellPosition: { col: number; row: number }; customStyleId: string }>();
  const refreshedCells: { col: number; row: number }[] = [];
  const fieldToCol: Record<string, number> = {
    类别: 0,
    销售额: 1,
    利润: 2
  };

  const getVisibleEntries = () => {
    const entries: { path: number[]; record: TreeRecord }[] = [];
    const walk = (nodes: TreeRecord[], parentPath: number[] = []) => {
      nodes.forEach((node, index) => {
        const currentPath = [...parentPath, index];
        entries.push({ path: currentPath, record: node });
        if (Array.isArray(node.children) && expandedPaths.has(pathKey(currentPath))) {
          walk(node.children, currentPath);
        }
      });
    };
    walk(records);
    return entries;
  };

  const findPathByRow = (row: number) => {
    const bodyIndex = row - 1;
    const entry = getVisibleEntries()[bodyIndex];
    return entry?.path;
  };

  const table = {
    options: {
      columns: [{ field: '类别', tree: true }, { field: '销售额' }, { field: '利润' }]
    },
    records,
    customCellStylePlugin: {
      customCellStyleArrangement: [] as { cellPosition: { col: number; row: number }; customStyleId: string }[],
      addCustomCellStyleArrangement(cellPosition: { col: number; row: number }, customStyleId: string) {
        arrangementMap.set(`${cellPosition.col}:${cellPosition.row}:${customStyleId}`, { cellPosition, customStyleId });
        this.customCellStyleArrangement = Array.from(arrangementMap.values());
      },
      clearCustomCellStyleArrangement() {
        arrangementMap.clear();
        this.customCellStyleArrangement = [];
      }
    },
    scenegraph: {
      updateCellContent: jest.fn((col: number, row: number) => {
        refreshedCells.push({ col, row });
      }),
      updateNextFrame: jest.fn()
    },
    registerCustomCellStyle: jest.fn(),
    hasCustomCellStyle: jest.fn(() => true),
    isHeader: jest.fn((col: number, row: number) => row < 1),
    dataSource: {
      getTableIndex: jest.fn((path: number[] | number) => {
        const pathArray = Array.isArray(path) ? path : [path];
        const visibleEntries = getVisibleEntries();
        const target = pathKey(pathArray);
        const index = visibleEntries.findIndex(entry => pathKey(entry.path) === target);
        return index;
      })
    },
    internalProps: {
      layoutMap: {
        getHeaderCellAddressByField: jest.fn((field: string) => {
          const col = fieldToCol[field];
          return typeof col === 'number' ? { col, row: 0 } : undefined;
        })
      }
    },
    getHierarchyState: jest.fn((_col: number, row: number) => {
      const path = findPathByRow(row);
      return path && expandedPaths.has(pathKey(path)) ? 'expand' : 'collapse';
    }),
    toggleHierarchyState: jest.fn((col: number, row: number) => {
      const path = findPathByRow(row);
      if (!path) {
        return;
      }
      const key = pathKey(path);
      if (expandedPaths.has(key)) {
        expandedPaths.delete(key);
      } else {
        expandedPaths.add(key);
      }
    }),
    scrollToCell: jest.fn(),
    getBodyVisibleRowRange: jest.fn(() => ({ rowStart: 1, rowEnd: 20 })),
    getBodyVisibleColRange: jest.fn(() => ({ colStart: 0, colEnd: 3 })),
    rowCount: 20,
    colCount: 3
  };

  seedExpandedPaths(records, expandedPaths, 2);

  return {
    table,
    refreshedCells,
    getArrangementRows: () =>
      table.customCellStylePlugin.customCellStyleArrangement.map(item => ({
        row: item.cellPosition.row,
        col: item.cellPosition.col,
        style: item.customStyleId
      }))
  };
}

function seedExpandedPaths(
  records: TreeRecord[],
  expandedPaths: Set<string>,
  maxLevel: number,
  parentPath: number[] = []
) {
  records.forEach((record, index) => {
    const currentPath = [...parentPath, index];
    if (currentPath.length <= maxLevel && Array.isArray(record.children) && record.children.length > 0) {
      expandedPaths.add(pathKey(currentPath));
      seedExpandedPaths(record.children, expandedPaths, maxLevel, currentPath);
    }
  });
}

describe('树形搜索高亮回归', () => {
  function createSearch() {
    const records: TreeRecord[] = [
      {
        类别: '办公用品',
        销售额: '129.696',
        利润: '60.704',
        children: [
          {
            类别: '信封',
            销售额: '125.44',
            利润: '42.56',
            children: [
              { 类别: '黄色信封', 销售额: '125.44', 利润: '42.56' },
              { 类别: '白色信封', 销售额: '1375.92', 利润: '550.2' }
            ]
          },
          {
            类别: '器具',
            销售额: '1375.92',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '技术',
        销售额: '229.696',
        利润: '90.704',
        children: [{ 类别: '配件', 销售额: '375.92', 利润: '550.2' }]
      },
      {
        类别: '办公用品',
        销售额: '129.696',
        利润: '60.704',
        children: [
          {
            类别: '信封',
            销售额: '125.44',
            利润: '42.56',
            children: [
              { 类别: '黄色信封', 销售额: '125.44', 利润: '42.56' },
              { 类别: '白色信封', 销售额: '1375.92', 利润: '550.2' }
            ]
          }
        ]
      }
    ];

    const mock = createTreeTableMock(records);
    const search = new SearchComponent({
      table: mock.table as any,
      autoJump: false
    });
    return { ...mock, search };
  }

  test('search 信封 时不应把旧行号错误映射到 row 8 配件', () => {
    const { search, getArrangementRows } = createSearch();

    search.search('信封');

    const arrangements = getArrangementRows();
    expect(arrangements.some(item => item.row === 8)).toBe(false);
    expect(arrangements.some(item => item.row === 2 && item.style === '__search_component_focus')).toBe(true);
  });

  test('search 信封 后 next 不应保留旧的 row 8 高亮导致配件变黄', () => {
    const { search, getArrangementRows } = createSearch();

    search.search('信封');
    search.next();

    const arrangements = getArrangementRows();
    expect(arrangements.some(item => item.row === 8)).toBe(false);
    expect(arrangements.some(item => item.row === 3 && item.style === '__search_component_focus')).toBe(true);
  });
});
