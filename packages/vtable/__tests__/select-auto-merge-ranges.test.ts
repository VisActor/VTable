import { autoMergeCellRanges } from '../src/state/select/auto-merge-ranges';
import type { CellRange } from '../src/ts-types';
import type { BaseTableAPI } from '../src/ts-types/base-table';

// 几何函数只读取这些表格边界，大范围回归不需要构造图元。
const table = {
  options: { select: { autoMergeRanges: true } },
  rowHeaderLevelCount: 0,
  leftRowSeriesNumberCount: 0,
  frozenColCount: 0,
  columnHeaderLevelCount: 0,
  frozenRowCount: 0,
  rightFrozenColCount: 0,
  bottomFrozenRowCount: 0,
  colCount: 100001,
  rowCount: 100001,
  getCellLocation: () => 'body'
} as unknown as BaseTableAPI;

/** 构造包含首尾坐标的普通 body 矩形。 */
function range(col: number, row: number, endCol = col, endRow = row): CellRange {
  return { start: { col, row }, end: { col: endCol, row: endRow } };
}

test.each(['horizontal', 'vertical', 'grid'])('keeps 10000 sparse %s selections separate', axis => {
  const ranges = Array.from({ length: 10000 }, (_, index) =>
    axis === 'horizontal'
      ? range(index * 3 + 1, 1)
      : axis === 'vertical'
      ? range(1, index * 3 + 1)
      : range((index % 100) * 3 + 1, Math.floor(index / 100) * 3 + 1)
  );
  expect(autoMergeCellRanges(ranges, table)).toBe(ranges);
});

test.each(['horizontal', 'vertical'])('merges 10000 contiguous %s cells', axis => {
  const ranges = Array.from({ length: 10000 }, (_, index) =>
    axis === 'horizontal' ? range(index + 1, 1) : range(1, index + 1)
  );
  expect(autoMergeCellRanges(ranges, table)).toEqual([
    axis === 'horizontal' ? range(1, 1, 10000, 1) : range(1, 1, 1, 10000)
  ]);
});

test('keeps an overlapping union with holes even when summed areas equal the bounding area', () => {
  const ranges = [range(1, 1, 3, 1), range(1, 2, 1, 3), range(1, 1, 2, 2)];
  expect(autoMergeCellRanges(ranges, table)).toBe(ranges);
});

test('merges a 10000-cell tile and preserves corner-only and disconnected selections', () => {
  const cells = Array.from({ length: 10000 }, (_, index) => range((index % 100) + 1, Math.floor(index / 100) + 1));
  const corner = range(101, 101);
  const disconnected = range(104, 1);
  expect(autoMergeCellRanges([...cells, corner, disconnected], table)).toEqual([
    range(1, 1, 100, 100),
    corner,
    disconnected
  ]);
});

test('preserves exact cell coverage for deterministic overlapping and reversed ranges', () => {
  let seed = 0x12345678;
  const coordinate = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return 1 + ((seed >>> 24) % 8);
  };
  // 逐格枚举作为独立参照，不复用归并的空间索引或面积算法。
  const coverage = (ranges: CellRange[]) => {
    const cells = new Set<string>();
    for (const item of ranges) {
      for (let col = Math.min(item.start.col, item.end.col); col <= Math.max(item.start.col, item.end.col); col++) {
        for (let row = Math.min(item.start.row, item.end.row); row <= Math.max(item.start.row, item.end.row); row++) {
          cells.add(col + ',' + row);
        }
      }
    }
    return [...cells].sort();
  };
  for (let sample = 0; sample < 100; sample++) {
    const ranges = Array.from({ length: 12 }, () => range(coordinate(), coordinate(), coordinate(), coordinate()));
    const before = JSON.stringify(ranges);
    expect(coverage(autoMergeCellRanges(ranges, table))).toEqual(coverage(ranges));
    expect(JSON.stringify(ranges)).toBe(before);
  }
});
