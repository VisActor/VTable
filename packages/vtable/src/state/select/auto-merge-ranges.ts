import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

type SelectRange = CellRange & { skipBodyMerge?: boolean };

type IndexedRange = {
  index: number;
  range: SelectRange;
  normalizedRange: CellRange;
};

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
    normalizedRange: normalizeRange(range)
  }));
  const eligibleRanges = indexedRanges.filter(range => isMainBodyRange(range.normalizedRange, table));

  if (eligibleRanges.length < 2) {
    return ranges;
  }

  const visited = new Set<number>();
  const mergedComponents = new Map<number, SelectRange>();
  const removedIndexes = new Set<number>();

  for (let i = 0; i < eligibleRanges.length; i++) {
    const componentSeed = eligibleRanges[i];
    if (visited.has(componentSeed.index)) {
      continue;
    }

    const component: IndexedRange[] = [];
    const queue = [componentSeed];
    visited.add(componentSeed.index);

    while (queue.length) {
      const current = queue.shift();
      if (!current) {
        continue;
      }
      component.push(current);

      for (let nextIndex = 0; nextIndex < eligibleRanges.length; nextIndex++) {
        const candidate = eligibleRanges[nextIndex];
        if (visited.has(candidate.index)) {
          continue;
        }
        if (!isConnectedRange(current.normalizedRange, candidate.normalizedRange)) {
          continue;
        }
        visited.add(candidate.index);
        queue.push(candidate);
      }
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

function getUnionArea(ranges: CellRange[]): number {
  const xBoundaries = Array.from(
    new Set(ranges.flatMap(range => [range.start.col, range.end.col + 1]))
  ).sort((left, right) => left - right);
  let area = 0;

  for (let i = 0; i < xBoundaries.length - 1; i++) {
    const xStart = xBoundaries[i];
    const xEnd = xBoundaries[i + 1];
    if (xStart === xEnd) {
      continue;
    }

    const activeIntervals = ranges
      .filter(range => range.start.col < xEnd && range.end.col + 1 > xStart)
      .map(range => [range.start.row, range.end.row + 1] as const)
      .sort((left, right) => left[0] - right[0]);

    if (!activeIntervals.length) {
      continue;
    }

    let coveredHeight = 0;
    let [currentStart, currentEnd] = activeIntervals[0];
    for (let intervalIndex = 1; intervalIndex < activeIntervals.length; intervalIndex++) {
      const [nextStart, nextEnd] = activeIntervals[intervalIndex];
      if (nextStart > currentEnd) {
        coveredHeight += currentEnd - currentStart;
        currentStart = nextStart;
        currentEnd = nextEnd;
        continue;
      }
      currentEnd = Math.max(currentEnd, nextEnd);
    }
    coveredHeight += currentEnd - currentStart;
    area += (xEnd - xStart) * coveredHeight;
  }

  return area;
}
