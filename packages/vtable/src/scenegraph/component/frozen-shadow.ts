import type { BaseTableAPI } from '../../ts-types/base-table';

export type ShadowSegment = { start: number; end: number };

/** Subtract merged-cell intervals from a vertical shadow. */
export function subtractShadowIntervals(height: number, blocked: ShadowSegment[]): ShadowSegment[] {
  const segments: ShadowSegment[] = [];
  let cursor = 0;
  for (const interval of blocked.slice().sort((a, b) => a.start - b.start)) {
    const start = Math.max(0, Math.min(height, interval.start));
    const end = Math.max(0, Math.min(height, interval.end));
    if (end <= start) {
      continue;
    }
    if (start > cursor) {
      segments.push({ start: cursor, end: start });
    }
    cursor = Math.max(cursor, end);
  }
  if (cursor < height) {
    segments.push({ start: cursor, end: height });
  }
  return segments;
}

/** Only inspect visible rows at the boundary, including top/bottom frozen bands. */
export function getFrozenShadowSegments(table: BaseTableAPI, boundaryCol: number, height: number): ShadowSegment[] {
  if (boundaryCol < 0 || boundaryCol >= table.colCount - 1) {
    return height > 0 ? [{ start: 0, end: height }] : [];
  }
  const blocked: ShadowSegment[] = [];
  const top = Math.min(height, table.getFrozenRowsHeight());
  const bottom = Math.max(top, height - table.getBottomFrozenRowsHeight());
  const bottomRow = table.rowCount - table.bottomFrozenRowCount;
  const visibleBody = table.getBodyVisibleCellRange();
  const bands = [
    { rowStart: 0, rowEnd: table.frozenRowCount - 1, start: 0, end: top },
    {
      rowStart: Math.max(table.frozenRowCount, visibleBody?.rowStart ?? table.frozenRowCount),
      rowEnd: Math.min(bottomRow - 1, visibleBody?.rowEnd ?? -1),
      start: top,
      end: bottom
    },
    { rowStart: bottomRow, rowEnd: table.rowCount - 1, start: bottom, end: height }
  ];

  for (const band of bands) {
    if (band.end <= band.start) {
      continue;
    }
    let row = band.rowStart;
    while (row <= band.rowEnd) {
      const range = table.getCellRange(boundaryCol, row);
      if (range && range.start.col <= boundaryCol && range.end.col > boundaryCol) {
        const rect = table.getCellRangeRelativeRect(range);
        const start = Math.max(band.start, rect.top);
        const end = Math.min(band.end, rect.bottom);
        if (end > start) {
          blocked.push({ start, end });
        }
      }
      row = Math.max(row + 1, (range?.end.row ?? row) + 1);
    }
  }
  return subtractShadowIntervals(height, blocked);
}
