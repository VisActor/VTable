import type { BaseTableAPI } from '../../../ts-types/base-table';
import { computeColWidth } from '../../layout/compute-col-width';
import { computeRowHeight } from '../../layout/compute-row-height';

// defaultRowHeight & defaultColWidth 在自动宽高模式中，
// 会被用在滚动条跳转时，作为未测量的高（宽）用于计算预估滚动位置；
// 如果default和实际相差过大，可能导致预估位置与实际位置相差过大，
// 在相应行（列）计算出实际位置后，显示效果与预期相差较大（向上偏移或向下偏移）。
// 这里使用采样方式，测量计算出一个预估的defaultRowHeight & defaultColWidth，
// 优化实际位置与预期位置的差距

const colSamplingNumber = 10;
const rowSamplingNumber = 10;
// The default row height and column width for proxy
// use sampling calculation to get closer to the actual situation
export function getDefaultWidth(table: BaseTableAPI) {
  const { rowCount, colCount } = table;

  const widths = [];
  // const heights = [];
  const deltaCol = Math.max(1, Math.ceil(rowCount / colSamplingNumber));
  const deltaRow = Math.max(1, Math.ceil(colCount / rowSamplingNumber));

  for (let col = 0; col < colCount; col += deltaCol) {
    for (let row = 0; row < rowCount; row += deltaRow) {
      widths.push(computeColWidth(col, row, row, table));
      // heights.push(computeRowHeight(row, col, col, table));
    }
  }
  const meanWidth = Math.ceil((widths.reduce((a, b) => a + b, 0) / widths.length) * 1.2); // 1.2为buffer值，让计算结果稍大
  // const meanHeight = heights.reduce((a, b) => a + b, 0) / heights.length;

  return meanWidth;
}

export function getDefaultHeight(table: BaseTableAPI) {
  const { rowCount, colCount } = table;

  // const widths = [];
  const heights = [];
  const deltaCol = Math.max(1, Math.ceil(rowCount / colSamplingNumber));
  const deltaRow = Math.max(1, Math.ceil(colCount / rowSamplingNumber));

  for (let col = 0; col < colCount; col += deltaCol) {
    for (let row = 0; row < rowCount; row += deltaRow) {
      // widths.push(computeColWidth(col, row, row, table));
      heights.push(computeRowHeight(row, col, col, table));
    }
  }
  // const meanWidth = widths.reduce((a, b) => a + b, 0) / widths.length;
  const meanHeight = Math.ceil((heights.reduce((a, b) => a + b, 0) / heights.length) * 1.2); // 1.2为buffer值，让计算结果稍大

  return meanHeight;
}
