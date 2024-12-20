import { Factory } from '../../core/factory';
import type { PivotHeaderLayoutMap } from '../pivot-header-layout';
import { getAxisOption } from './get-axis-config';
import type { GetAxisDomainRangeAndLabels } from './get-axis-domain';

export function getZeroAlignTickAlignTicks(
  targetRange: { min: number; max: number },
  col: number,
  row: number,
  index: number,
  position: 'top' | 'bottom' | 'left' | 'right',
  layout: PivotHeaderLayoutMap
) {
  const getAxisDomainRangeAndLabels = Factory.getFunction('getAxisDomainRangeAndLabels') as GetAxisDomainRangeAndLabels;
  const { axisOption, isZeroAlign } = getAxisOption(col, row, index === 0 ? 'right' : 'left', layout);

  const { ticks } = getAxisDomainRangeAndLabels(
    targetRange.min,
    targetRange.max,
    axisOption,
    isZeroAlign,
    position === 'bottom' || position === 'top'
      ? layout._table.getColWidth(col) || layout._table.tableNoFrameWidth
      : layout._table.getRowHeight(row) || layout._table.tableNoFrameHeight // avoid 0, 0 causes NaN
  );

  return ticks;
}

export function getTickModeFunction(
  targetTicks: number[],
  targetRange: { min: number; max: number },
  range: { min: number; max: number },
  indicatorIndex: number
) {
  return indicatorIndex !== 0 && targetTicks
    ? () => {
        const newTicks: number[] = targetTicks.map((value: number) => {
          const percent = (value - targetRange.min) / (targetRange.max - targetRange.min);
          const tick = (range.max - range.min) * percent + range.min;
          // TO BE FIXED: 保留2位有效数字，避免出现过长的数字
          return Math.round(tick * 100) / 100;
          // return tick;
        });
        return newTicks;
      }
    : undefined;
}
