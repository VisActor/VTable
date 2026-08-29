/* eslint-env jest */
/* eslint-disable no-undef */
// @ts-nocheck

import { SearchComponent } from '../src';

function createTable(values: string[][]) {
  const arrangements: { col: number; row: number; style: string }[] = [];
  const table = {
    options: {
      columns: [{ field: 'name' }]
    },
    rowCount: values.length + 1,
    colCount: values[0]?.length ?? 1,
    isReleased: false,
    isHeader: jest.fn((_col: number, row: number) => row === 0),
    getCellValue: jest.fn((col: number, row: number) => (row === 0 ? 'Name' : values[row - 1][col])),
    getCellRange: jest.fn((col: number, row: number) => ({
      start: { col, row },
      end: { col, row }
    })),
    registerCustomCellStyle: jest.fn(),
    hasCustomCellStyle: jest.fn(() => true),
    arrangeCustomCellStyle: jest.fn((position: { col: number; row: number }, style: string) => {
      if (style) {
        arrangements.push({ col: position.col, row: position.row, style });
      }
    }),
    customCellStylePlugin: {
      customCellStyleArrangement: arrangements,
      addCustomCellStyleArrangement: jest.fn((position: { col: number; row: number }, style: string) => {
        arrangements.push({ col: position.col, row: position.row, style });
      }),
      clearCustomCellStyleArrangement: jest.fn(() => {
        arrangements.splice(0, arrangements.length);
      })
    },
    scenegraph: {
      updateCellContent: jest.fn(),
      updateNextFrame: jest.fn()
    },
    getBodyVisibleRowRange: jest.fn(() => ({ rowStart: 1, rowEnd: values.length + 1 })),
    getBodyVisibleColRange: jest.fn(() => ({ colStart: 0, colEnd: values[0]?.length ?? 1 })),
    scrollToCell: jest.fn()
  };

  return { table, arrangements };
}

test('search includes and highlights values in expanded master-detail tables', () => {
  const main = createTable([['Alice']]);
  const detail = createTable([['Widget']]);
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({
    table: main.table as any,
    autoJump: false
  });

  const result = search.search('i');

  expect(result.results).toHaveLength(2);
  expect(detail.arrangements).toEqual([
    {
      col: 0,
      row: 1,
      style: '__search_component_highlight'
    }
  ]);
});

test('focus navigation and clear operate on the matching detail table', () => {
  const main = createTable([['Alice']]);
  const detail = createTable([['Widget']]);
  main.table.internalProps = {
    subTableInstances: new Map([[0, detail.table]])
  };

  const search = new SearchComponent({
    table: main.table as any,
    autoJump: false
  });

  search.search('i');
  search.next();
  search.next();

  expect(detail.table.arrangeCustomCellStyle).toHaveBeenCalledWith({ col: 0, row: 1 }, '__search_component_focus');

  search.clear();

  expect(detail.table.customCellStylePlugin.clearCustomCellStyleArrangement).toHaveBeenCalled();
  expect(detail.arrangements).toHaveLength(0);
});
