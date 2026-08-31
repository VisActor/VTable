// @ts-nocheck
import { createGroupForFirstScreen } from '../src/scenegraph/group-creater/progress/create-group-for-first-screen';
import { computeColsWidth } from '../src/scenegraph/layout/compute-col-width';
import { computeRowsHeight } from '../src/scenegraph/layout/compute-row-height';

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
});
