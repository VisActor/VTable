// @ts-nocheck
import { createGroupForFirstScreen } from '../src/scenegraph/group-creater/progress/create-group-for-first-screen';
import { computeColsWidth } from '../src/scenegraph/layout/compute-col-width';
import { computeRowsHeight } from '../src/scenegraph/layout/compute-row-height';

const { computeRowHeight, computeRowsHeight: computeRowsHeightActual } = jest.requireActual(
  '../src/scenegraph/layout/compute-row-height'
);

jest.mock('../src/scenegraph/layout/compute-col-width', () => ({
  computeColsWidth: jest.fn()
}));
jest.mock('../src/scenegraph/layout/compute-row-height', () => ({
  computeRowsHeight: jest.fn()
}));
jest.mock('../src/scenegraph/group-creater/column', () => ({
  createColGroup: jest.fn()
}));

describe('createGroupForFirstScreen issue #5298', () => {
  const makeGroup = () => ({
    firstChild: null,
    lastChild: null,
    setAttribute: jest.fn(),
    setAttributes: jest.fn()
  });

  const createMockTable = () => ({
    widthMode: 'standard',
    heightMode: 'standard',
    options: {},
    colCount: 3,
    rowCount: 3,
    frozenColCount: 1,
    frozenRowCount: 1,
    rowHeaderLevelCount: 1,
    leftRowSeriesNumberCount: 0,
    rightFrozenColCount: 0,
    bottomFrozenRowCount: 0,
    isListTable: () => false,
    isPivotChart: () => false,
    getFrozenColsWidth: () => 0,
    getFrozenRowsHeight: () => 0,
    scenegraph: {
      leftBottomCornerGroup: makeGroup(),
      rightTopCornerGroup: makeGroup(),
      rightBottomCornerGroup: makeGroup(),
      colHeaderGroup: makeGroup(),
      rowHeaderGroup: makeGroup(),
      bottomFrozenGroup: makeGroup(),
      rightFrozenGroup: makeGroup(),
      bodyGroup: makeGroup()
    },
    internalProps: {
      _widthResizedColMap: new Set([0]),
      _heightResizedRowMap: new Set()
    }
  });

  test('recalculates unresized columns when some columns keep manual widths', () => {
    const table = createMockTable();
    const proxy = {
      table,
      firstScreenColLimit: 3,
      firstScreenRowLimit: 3,
      totalCol: 2,
      totalRow: 2,
      setParamsForRow: jest.fn(),
      setParamsForColumn: jest.fn(),
      progress: jest.fn(),
      colStart: 0,
      rowStart: 0
    };
    const groups = [makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup()];

    createGroupForFirstScreen(...groups, 0, 0, proxy);

    expect(computeColsWidth).toHaveBeenCalledWith(table, 0, 2);
  });

  test('stops scanning resized columns after finding an unresized column', () => {
    const table = createMockTable();
    table.colCount = 10000;
    table.widthMode = 'adaptive';
    table.internalProps._widthResizedColMap = {
      has: jest.fn(col => col === 0)
    };
    const proxy = {
      table,
      firstScreenColLimit: 3,
      firstScreenRowLimit: 3,
      totalCol: 2,
      totalRow: 2,
      setParamsForRow: jest.fn(),
      setParamsForColumn: jest.fn(),
      progress: jest.fn(),
      colStart: 0,
      rowStart: 0
    };
    const groups = [makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup()];

    createGroupForFirstScreen(...groups, 0, 0, proxy);

    expect(table.internalProps._widthResizedColMap.has).toHaveBeenCalledTimes(2);
    expect(computeColsWidth).toHaveBeenCalledWith(table, 0, 9999);
  });

  test('recalculates unresized rows when some rows keep manual heights', () => {
    const table = createMockTable();
    table.internalProps._heightResizedRowMap = new Set([0]);
    const proxy = {
      table,
      firstScreenColLimit: 3,
      firstScreenRowLimit: 3,
      totalCol: 2,
      totalRow: 2,
      setParamsForRow: jest.fn(),
      setParamsForColumn: jest.fn(),
      progress: jest.fn(),
      colStart: 0,
      rowStart: 0
    };
    const groups = [makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup()];

    createGroupForFirstScreen(...groups, 0, 0, proxy);

    expect(computeRowsHeight).toHaveBeenCalledWith(table, 0, 2);
  });

  test('stops scanning resized rows after finding an unresized row', () => {
    const table = createMockTable();
    table.rowCount = 10000;
    table.heightMode = 'adaptive';
    table.internalProps._heightResizedRowMap = {
      has: jest.fn(row => row === 0)
    };
    const proxy = {
      table,
      firstScreenColLimit: 3,
      firstScreenRowLimit: 3,
      totalCol: 2,
      totalRow: 2,
      setParamsForRow: jest.fn(),
      setParamsForColumn: jest.fn(),
      progress: jest.fn(),
      colStart: 0,
      rowStart: 0
    };
    const groups = [makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup()];

    createGroupForFirstScreen(...groups, 0, 0, proxy);

    expect(table.internalProps._heightResizedRowMap.has).toHaveBeenCalledTimes(2);
    expect(computeRowsHeight).toHaveBeenCalledWith(table, 0, 9999);
  });

  test('syncs autoHeight visible rows even when all first screen rows keep manual heights', () => {
    const table = createMockTable();
    table.heightMode = 'autoHeight';
    table.rowCount = 5;
    table.tableNoFrameHeight = 100;
    table.getBottomFrozenRowsHeight = () => 0;
    table.getRowsHeight = jest.fn((start, end) => (end < 4 ? 50 : 120));
    table.internalProps._heightResizedRowMap = new Set([0, 1, 2]);
    const proxy = {
      table,
      firstScreenColLimit: 3,
      firstScreenRowLimit: 3,
      bodyBottomRow: 4,
      bodyTopRow: 1,
      totalActualBodyRowCount: 2,
      totalCol: 2,
      totalRow: 2,
      setParamsForRow: jest.fn(),
      setParamsForColumn: jest.fn(),
      progress: jest.fn(),
      colStart: 0,
      rowStart: 0
    };
    const groups = [makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup()];

    createGroupForFirstScreen(...groups, 0, 0, proxy);

    expect(computeRowsHeight).not.toHaveBeenCalledWith(table, 0, 2);
    expect(computeRowsHeight).toHaveBeenCalledWith(table, 3, 3, false);
    expect(computeRowsHeight).toHaveBeenCalledWith(table, 4, 4, false);
    expect(proxy.totalRow).toBe(4);
    expect(proxy.totalActualBodyRowCount).toBe(4);
  });

  test('does not recompute manually resized rows while filling autoHeight visible rows', () => {
    const table = createMockTable();
    table.heightMode = 'autoHeight';
    table.rowCount = 5;
    table.tableNoFrameHeight = 100;
    table.getBottomFrozenRowsHeight = () => 0;
    table.getRowsHeight = jest.fn((start, end) => (end < 4 ? 50 : 120));
    table.internalProps._heightResizedRowMap = new Set([0, 1, 2, 3]);
    const proxy = {
      table,
      firstScreenColLimit: 3,
      firstScreenRowLimit: 3,
      bodyBottomRow: 4,
      bodyTopRow: 1,
      totalActualBodyRowCount: 2,
      totalCol: 2,
      totalRow: 2,
      setParamsForRow: jest.fn(),
      setParamsForColumn: jest.fn(),
      progress: jest.fn(),
      colStart: 0,
      rowStart: 0
    };
    const groups = [makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup(), makeGroup()];

    createGroupForFirstScreen(...groups, 0, 0, proxy);

    expect(computeRowsHeight).not.toHaveBeenCalledWith(table, 3, 3, false);
    expect(computeRowsHeight).toHaveBeenCalledWith(table, 4, 4, false);
  });

  test('keeps manually resized row height when computing row height directly', () => {
    const table = {
      internalProps: {
        _heightResizedRowMap: new Set([1])
      },
      getRowHeight: jest.fn(() => 42),
      isAutoRowHeight: jest.fn()
    };

    expect(computeRowHeight(1, 0, 2, table)).toBe(42);
    expect(table.isAutoRowHeight).not.toHaveBeenCalled();
  });

  test('uses an unresized representative row when filling fixed body row heights', () => {
    const setRowHeight = jest.fn();
    const table = {
      defaultHeaderRowHeight: 40,
      defaultHeaderColWidth: 80,
      defaultRowHeight: 33,
      heightMode: 'standard',
      heightAdaptiveMode: 'all',
      autoFillHeight: false,
      options: {
        defaultRowHeight: 'auto'
      },
      rowCount: 4,
      colCount: 2,
      columnHeaderLevelCount: 1,
      rowHeaderLevelCount: 0,
      bottomFrozenRowCount: 0,
      internalProps: {
        _heightResizedRowMap: new Set([1]),
        layoutMap: {
          getBody: jest.fn(() => ({
            cellType: 'text',
            define: {}
          }))
        },
        transpose: false,
        autoWrapText: false,
        enableLineBreak: false,
        useOneRowHeightFillAll: false
      },
      isPivotTable: () => false,
      isPivotChart: () => false,
      isAutoRowHeight: () => false,
      getDefaultRowHeight: jest.fn(row => (row === 1 ? 200 : 33)),
      getRowHeight: jest.fn(row => (row === 1 ? 200 : 33)),
      _getCellStyle: jest.fn(() => ({})),
      _setRowHeight: setRowHeight,
      _clearRowRangeHeightsMap: jest.fn()
    };

    computeRowsHeightActual(table, 0, 3);

    expect(table.getDefaultRowHeight).toHaveBeenCalledWith(2);
    expect(setRowHeight).not.toHaveBeenCalledWith(1, expect.any(Number));
    expect(setRowHeight).toHaveBeenCalledWith(2, 33);
    expect(setRowHeight).toHaveBeenCalledWith(3, 33);
  });
});
