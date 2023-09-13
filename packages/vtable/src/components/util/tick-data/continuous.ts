import type { LinearScale, ContinuousScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import { isValid, last as peek } from '@visactor/vutils';
import { DEFAULT_CONTINUOUS_TICK_COUNT } from './config';
import type { ILabelItem } from './util';
// eslint-disable-next-line no-duplicate-imports
import { convertDomainToTickData, getCartesianLabelBounds, hasOverlap, intersect } from './util';

/**
 * 对于连续轴：
 * - 如果spec配了tickCount、forceTickCount、tickStep，则直接输出LinearScale的ticks()、forceTicks()、stepTicks()结果；
 * - 默认输出tickCount为10的ticks()结果。
 *
 * @param scale
 * @param op
 * @returns
 */
export const continuousTicks = (scale: ContinuousScale, op: any): any[] => {
  if (!isContinuous(scale.type)) {
    return convertDomainToTickData(scale.domain(), op);
  }
  // if range is so small
  const range = scale.range();
  const rangeSize = Math.abs(range[range.length - 1] - range[0]);
  if (rangeSize < 2) {
    return convertDomainToTickData([scale.domain()[0]], op);
  }

  const { tickCount, forceTickCount, tickStep, noDecimals = false } = op;

  let scaleTicks: number[];
  if (isValid(tickStep)) {
    scaleTicks = (scale as LinearScale).stepTicks(tickStep);
  } else if (isValid(forceTickCount)) {
    scaleTicks = (scale as LinearScale).forceTicks(forceTickCount);
  } else if (op.tickMode === 'd3') {
    scaleTicks = (scale as LinearScale).d3Ticks(tickCount ?? DEFAULT_CONTINUOUS_TICK_COUNT, { noDecimals });
  } else {
    scaleTicks = (scale as LinearScale).ticks(tickCount ?? DEFAULT_CONTINUOUS_TICK_COUNT, { noDecimals });
  }

  if (op.sampling) {
    // 判断重叠
    if (op.coordinateType === 'cartesian' || (op.coordinateType === 'polar' && op.axisOrientType === 'radius')) {
      const { labelGap = 4, labelFlush } = op as any;
      let items = getCartesianLabelBounds(scale, scaleTicks, op as any).map(
        (bounds, i) =>
          ({
            AABBBounds: bounds,
            value: scaleTicks[i]
          } as ILabelItem<number>)
      );
      while (items.length >= 3 && hasOverlap(items, labelGap)) {
        items = methods.parity(items);
      }
      const ticks = items.map(item => item.value);

      if (ticks.length < 3 && labelFlush) {
        if (ticks.length > 1) {
          ticks.pop();
        }
        if (peek(ticks) !== peek(scaleTicks)) {
          ticks.push(peek(scaleTicks));
        }
      }

      scaleTicks = ticks;
    }
  }

  return convertDomainToTickData(scaleTicks, op);
};

const methods = {
  parity: function <T>(items: ILabelItem<T>[]) {
    return items.filter((item, i) => i % 2 === 0);
  },
  greedy: function <T>(items: ILabelItem<T>[], sep: number) {
    let a: ILabelItem<T>;
    return items.filter((b, i) => {
      if (!i || !intersect(a.AABBBounds, b.AABBBounds, sep)) {
        a = b;
        return true;
      }
      return false;
    });
  }
};
