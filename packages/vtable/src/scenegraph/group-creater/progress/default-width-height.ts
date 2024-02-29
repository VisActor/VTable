import type { BaseTableAPI } from '../../../ts-types/base-table';
import { computeColWidth } from '../../layout/compute-col-width';
import { computeRowHeight } from '../../layout/compute-row-height';

const colSamplingNumber = 5;
const rowSamplingNumber = 5;
// The default row height and column width for proxy
// use sampling calculation to get closer to the actual situation
export function getDefaultWidth(table: BaseTableAPI) {
  const { rowCount, colCount, frozenColCount, frozenRowCount, rightFrozenColCount, bottomFrozenRowCount } = table;

  const widths = [];
  // const heights = [];
  const deltaCol = Math.ceil((rowCount - frozenRowCount - bottomFrozenRowCount) / colSamplingNumber);
  const deltaRow = Math.ceil((colCount - frozenColCount - rightFrozenColCount) / rowSamplingNumber);

  for (let col = frozenColCount; col < colCount; col += deltaCol) {
    for (let row = frozenRowCount; row < rowCount; row += deltaRow) {
      widths.push(computeColWidth(col, row, row, table));
      // heights.push(computeRowHeight(row, col, col, table));
    }
  }
  const meanWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
  // const meanHeight = heights.reduce((a, b) => a + b, 0) / heights.length;

  return meanWidth;
}

export function getDefaultHeight(table: BaseTableAPI) {
  const { rowCount, colCount, frozenColCount, frozenRowCount, rightFrozenColCount, bottomFrozenRowCount } = table;

  // const widths = [];
  const heights = [];
  const deltaCol = Math.ceil((rowCount - frozenRowCount - bottomFrozenRowCount) / colSamplingNumber);
  const deltaRow = Math.ceil((colCount - frozenColCount - rightFrozenColCount) / rowSamplingNumber);

  for (let col = frozenColCount; col < colCount; col += deltaCol) {
    for (let row = frozenRowCount; row < rowCount; row += deltaRow) {
      // widths.push(computeColWidth(col, row, row, table));
      heights.push(computeRowHeight(row, col, col, table));
    }
  }
  // const meanWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
  const meanHeight = heights.reduce((a, b) => a + b, 0) / heights.length;

  return meanHeight;
}
