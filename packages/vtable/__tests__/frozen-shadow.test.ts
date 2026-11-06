import { getFrozenShadowSegments, subtractShadowIntervals } from '../src/scenegraph/component/frozen-shadow';
import type { BaseTableAPI } from '../src/ts-types/base-table';
import type { CellRange } from '../src/ts-types';

type Merge = CellRange & { rect?: { top: number; bottom: number } };

function merge(startCol: number, endCol: number, startRow: number, endRow = startRow, rect?: Merge['rect']): Merge {
  return { start: { col: startCol, row: startRow }, end: { col: endCol, row: endRow }, rect };
}

function createTable(merges: Merge[] = [], overrides: Partial<BaseTableAPI> = {}) {
  const visited: number[] = [];
  const table = {
    colCount: 9,
    rowCount: 12,
    frozenRowCount: 2,
    bottomFrozenRowCount: 1,
    getFrozenRowsHeight: () => 80,
    getBottomFrozenRowsHeight: () => 40,
    getBodyVisibleCellRange: () => ({ rowStart: 2, rowEnd: 9 }),
    getCellRange: (col: number, row: number) => {
      visited.push(row);
      return (
        merges.find(m => m.start.row <= row && m.end.row >= row && m.start.col <= col && m.end.col >= col) ?? {
          start: { col, row },
          end: { col, row }
        }
      );
    },
    getCellRangeRelativeRect: (range: Merge) => {
      if (range.rect) {
        return range.rect;
      }
      const top = range.start.row === 11 ? 380 : range.start.row * 40;
      return { top, bottom: top + (range.end.row - range.start.row + 1) * 40 };
    },
    ...overrides
  } as unknown as BaseTableAPI;
  return { table, visited };
}

describe('frozen column shadows skipping merged cells', () => {
  test('truncates the shadow above a cross-boundary bottom summary', () => {
    const { table } = createTable([merge(0, 8, 11)]);
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([{ start: 0, end: 380 }]);
  });

  test('keeps the shadow for ordinary bottom frozen cells', () => {
    const { table } = createTable();
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([{ start: 0, end: 420 }]);
  });

  test('resumes the shadow after multiple body merges including a multi-row merge', () => {
    const { table } = createTable([merge(0, 3, 3), merge(0, 3, 6, 7), merge(0, 8, 11)]);
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([
      { start: 0, end: 120 },
      { start: 160, end: 240 },
      { start: 320, end: 380 }
    ]);
  });

  test('handles both header and bottom merges', () => {
    const { table } = createTable([merge(0, 3, 0, 1), merge(0, 8, 11)]);
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([{ start: 80, end: 380 }]);
  });

  test('does not skip merges contained on one side of the frozen boundary', () => {
    const { table } = createTable([merge(0, 1, 3), merge(2, 4, 5)]);
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([{ start: 0, end: 420 }]);
  });

  test('handles the right frozen boundary', () => {
    const { table } = createTable([merge(5, 8, 3), merge(0, 8, 11)]);
    expect(getFrozenShadowSegments(table, 6, 420)).toEqual([
      { start: 0, end: 120 },
      { start: 160, end: 380 }
    ]);
  });

  test('clips a scrolled body merge to the body viewport and visits only visible rows', () => {
    const { table, visited } = createTable([merge(0, 3, 2, 8, { top: -60, bottom: 220 })], {
      getBodyVisibleCellRange: () => ({ rowStart: 5, rowEnd: 10, colStart: 2, colEnd: 8 })
    });
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([
      { start: 0, end: 80 },
      { start: 220, end: 420 }
    ]);
    expect(visited).toEqual([0, 1, 5, 9, 10, 11]);
  });

  test('handles an empty body and multiple bottom frozen rows', () => {
    const { table } = createTable([merge(0, 8, 10, 11, { top: 340, bottom: 420 })], {
      bottomFrozenRowCount: 2,
      getBottomFrozenRowsHeight: () => 80,
      getBodyVisibleCellRange: () => null
    });
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([{ start: 0, end: 340 }]);
  });

  test('unions overlapping intervals and clips them to the drawing height', () => {
    expect(
      subtractShadowIntervals(420, [
        { start: 100, end: 200 },
        { start: 180, end: 240 },
        { start: -30, end: 20 },
        { start: 380, end: 900 },
        { start: 20, end: 20 }
      ])
    ).toEqual([
      { start: 20, end: 100 },
      { start: 240, end: 380 }
    ]);
    expect(subtractShadowIntervals(0, [])).toEqual([]);
    expect(subtractShadowIntervals(420, [{ start: 0, end: 420 }])).toEqual([]);
  });

  test('keeps the full-height shadow when there is no column boundary', () => {
    const { table } = createTable([merge(0, 8, 11)]);
    expect(getFrozenShadowSegments(table, -1, 420)).toEqual([{ start: 0, end: 420 }]);
    expect(getFrozenShadowSegments(table, 8, 420)).toEqual([{ start: 0, end: 420 }]);
  });

  test('recomputes intervals after row geometry or merge definitions change', () => {
    const merges = [merge(0, 3, 3, 3, { top: 120, bottom: 160 })];
    const { table } = createTable(merges);
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([
      { start: 0, end: 120 },
      { start: 160, end: 420 }
    ]);
    merges[0].rect = { top: 120, bottom: 190 };
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([
      { start: 0, end: 120 },
      { start: 190, end: 420 }
    ]);
    merges.length = 0;
    expect(getFrozenShadowSegments(table, 1, 420)).toEqual([{ start: 0, end: 420 }]);
  });
});
