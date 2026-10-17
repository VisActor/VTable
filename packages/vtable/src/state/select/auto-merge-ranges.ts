import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

type SelectRange = CellRange & { skipBodyMerge?: boolean };

const headerSelectRanges = new WeakSet<CellRange>();

/** 保留表头和序号投影选区的来源，不向公开选区对象增加字段。 */
export function markHeaderSelectRange(range: CellRange): void {
  headerSelectRanges.add(range);
}

type IndexedRange = {
  index: number;
  range: SelectRange;
  normalizedRange: CellRange;
  visited: boolean;
};

type RangeNode = { bounds: CellRange; empty: boolean } & (
  | { item: IndexedRange }
  | { left: RangeNode; right: RangeNode }
);

/**
 * 将普通 body 主区域内、连通且恰好铺满外接矩形的多选区合并成单个矩形选区。
 */
export function autoMergeCellRanges(ranges: SelectRange[], table: BaseTableAPI): SelectRange[] {
  if (!table.options.select?.autoMergeRanges || ranges.length < 2) {
    return ranges;
  }

  const indexedRanges = ranges.map((range, index) => ({
    index,
    range,
    normalizedRange: normalizeRange(range),
    visited: false
  }));
  const eligibleRanges = indexedRanges.filter(
    range => !headerSelectRanges.has(range.range) && isMainBodyRange(range.normalizedRange, table)
  );

  if (eligibleRanges.length < 2) {
    return ranges;
  }

  const tree = buildRangeTree(eligibleRanges);
  const mergedComponents = new Map<number, SelectRange>();
  const removedIndexes = new Set<number>();

  for (let i = 0; i < eligibleRanges.length; i++) {
    const componentSeed = eligibleRanges[i];
    if (componentSeed.visited) {
      continue;
    }

    const component: IndexedRange[] = [];
    collectConnectedRanges(tree, componentSeed.normalizedRange, component);
    for (let cursor = 0; cursor < component.length; cursor++) {
      collectConnectedRanges(tree, component[cursor].normalizedRange, component);
    }

    if (component.length < 2) {
      continue;
    }

    const boundingRange = getBoundingRange(component);
    const boundingArea = getRangeArea(boundingRange);
    const unionArea = getUnionArea(component.map(item => item.normalizedRange));
    if (unionArea !== boundingArea) {
      continue;
    }

    const componentIndexes = component.map(item => item.index).sort((a, b) => a - b);
    const targetIndex = componentIndexes[componentIndexes.length - 1];

    mergedComponents.set(targetIndex, {
      start: { ...boundingRange.start },
      end: { ...boundingRange.end },
      ...(component.every(item => item.range.skipBodyMerge) ? { skipBodyMerge: true } : {})
    });
    componentIndexes
      .filter(index => index !== targetIndex)
      .forEach(index => {
        removedIndexes.add(index);
      });
  }

  if (!mergedComponents.size) {
    return ranges;
  }

  return ranges.reduce<SelectRange[]>((result, range, index) => {
    if (removedIndexes.has(index)) {
      return result;
    }
    result.push(mergedComponents.get(index) ?? range);
    return result;
  }, []);
}

/** 按两个坐标轴交替划分包围盒，只检索邻近选区。 */
function buildRangeTree(ranges: IndexedRange[], depth = 0): RangeNode {
  if (ranges.length === 1) {
    return { bounds: ranges[0].normalizedRange, item: ranges[0], empty: false };
  }
  const axis = depth % 2 ? 'row' : 'col';
  ranges.sort((left, right) => left.normalizedRange.start[axis] - right.normalizedRange.start[axis]);
  const middle = Math.floor(ranges.length / 2);
  const left = buildRangeTree(ranges.slice(0, middle), depth + 1);
  const right = buildRangeTree(ranges.slice(middle), depth + 1);
  return {
    left,
    right,
    empty: false,
    bounds: {
      start: {
        col: Math.min(left.bounds.start.col, right.bounds.start.col),
        row: Math.min(left.bounds.start.row, right.bounds.start.row)
      },
      end: {
        col: Math.max(left.bounds.end.col, right.bounds.end.col),
        row: Math.max(left.bounds.end.row, right.bounds.end.row)
      }
    }
  };
}

/** 收集连通的未访问选区并从索引移除，避免对同一分量重复扫描。 */
function collectConnectedRanges(node: RangeNode, range: CellRange, result: IndexedRange[]): void {
  if (node.empty || !isConnectedRange(node.bounds, range)) {
    return;
  }
  if ('item' in node) {
    node.empty = true;
    node.item.visited = true;
    result.push(node.item);
    return;
  }
  collectConnectedRanges(node.left, range, result);
  collectConnectedRanges(node.right, range, result);
  node.empty = node.left.empty && node.right.empty;
}

function normalizeRange(range: CellRange): CellRange {
  return {
    start: {
      col: Math.min(range.start.col, range.end.col),
      row: Math.min(range.start.row, range.end.row)
    },
    end: {
      col: Math.max(range.start.col, range.end.col),
      row: Math.max(range.start.row, range.end.row)
    }
  };
}

function isMainBodyRange(range: CellRange, table: BaseTableAPI): boolean {
  const startCol = Math.max(table.rowHeaderLevelCount + table.leftRowSeriesNumberCount, table.frozenColCount);
  const startRow = Math.max(table.columnHeaderLevelCount, table.frozenRowCount);
  const endCol = table.colCount - table.rightFrozenColCount - 1;
  const endRow = table.rowCount - table.bottomFrozenRowCount - 1;

  if (startCol > endCol || startRow > endRow) {
    return false;
  }

  return (
    range.start.col >= startCol &&
    range.end.col <= endCol &&
    range.start.row >= startRow &&
    range.end.row <= endRow &&
    table.getCellLocation(range.start.col, range.start.row) === 'body' &&
    table.getCellLocation(range.end.col, range.end.row) === 'body'
  );
}

function isConnectedRange(left: CellRange, right: CellRange): boolean {
  const rowOverlap = left.start.row <= right.end.row && right.start.row <= left.end.row;
  const colOverlap = left.start.col <= right.end.col && right.start.col <= left.end.col;
  if (rowOverlap && colOverlap) {
    return true;
  }

  const horizontalTouch = rowOverlap && (left.end.col + 1 === right.start.col || right.end.col + 1 === left.start.col);
  if (horizontalTouch) {
    return true;
  }

  return colOverlap && (left.end.row + 1 === right.start.row || right.end.row + 1 === left.start.row);
}

function getBoundingRange(ranges: IndexedRange[]): CellRange {
  return ranges.reduce<CellRange>(
    (boundingRange, item) => ({
      start: {
        col: Math.min(boundingRange.start.col, item.normalizedRange.start.col),
        row: Math.min(boundingRange.start.row, item.normalizedRange.start.row)
      },
      end: {
        col: Math.max(boundingRange.end.col, item.normalizedRange.end.col),
        row: Math.max(boundingRange.end.row, item.normalizedRange.end.row)
      }
    }),
    {
      start: { ...ranges[0].normalizedRange.start },
      end: { ...ranges[0].normalizedRange.end }
    }
  );
}

function getRangeArea(range: CellRange): number {
  return (range.end.col - range.start.col + 1) * (range.end.row - range.start.row + 1);
}

/** 扫描列边界并维护行覆盖长度，避免每个列带重新扫描全部选区。 */
function getUnionArea(ranges: CellRange[]): number {
  const rows = Array.from(new Set(ranges.flatMap(range => [range.start.row, range.end.row + 1]))).sort((a, b) => a - b);
  const rowIndexes = new Map(rows.map((row, index) => [row, index]));
  const events = ranges
    .flatMap(range => {
      const start = rowIndexes.get(range.start.row)!;
      const end = rowIndexes.get(range.end.row + 1)!;
      return [
        { col: range.start.col, start, end, delta: 1 },
        { col: range.end.col + 1, start, end, delta: -1 }
      ];
    })
    .sort((a, b) => a.col - b.col);
  const covers = new Int32Array(rows.length * 4);
  const lengths = new Float64Array(rows.length * 4);

  // 每条事件仅更新覆盖到的行区间；有覆盖时直接使用整段长度。
  function update(node: number, left: number, right: number, start: number, end: number, delta: number): void {
    if (start <= left && right <= end) {
      covers[node] += delta;
    } else {
      const middle = Math.floor((left + right) / 2);
      if (start < middle) {
        update(node * 2, left, middle, start, end, delta);
      }
      if (end > middle) {
        update(node * 2 + 1, middle, right, start, end, delta);
      }
    }
    lengths[node] = covers[node]
      ? rows[right] - rows[left]
      : right - left === 1
      ? 0
      : lengths[node * 2] + lengths[node * 2 + 1];
  }
  let area = 0;
  let previous = events[0].col;
  for (const event of events) {
    area += (event.col - previous) * lengths[1];
    update(1, 0, rows.length - 1, event.start, event.end, event.delta);
    previous = event.col;
  }
  return area;
}
