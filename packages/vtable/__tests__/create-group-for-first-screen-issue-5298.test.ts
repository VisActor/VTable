// @ts-nocheck
import { createGroupForFirstScreen } from '../src/scenegraph/group-creater/progress/create-group-for-first-screen';
import { computeColsWidth } from '../src/scenegraph/layout/compute-col-width';

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
});
