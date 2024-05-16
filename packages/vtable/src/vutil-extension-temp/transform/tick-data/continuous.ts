import type { LinearScale, ContinuousScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous } from '@visactor/vscale';
import { isFunction, isValid, last } from '@visactor/vutils';
import { DEFAULT_CONTINUOUS_TICK_COUNT } from './config';
import type { ICartesianTickDataOpt, ITickData, ITickDataOpt } from './interface';
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
export const continuousTicks = (scale: ContinuousScale, op: ITickDataOpt): ITickData[] => {
  if (!isContinuous(scale.type)) {
    return convertDomainToTickData(scale.domain());
  }
  // if range is so small
  const range = scale.range();
  const rangeSize = Math.abs(range[range.length - 1] - range[0]);
  if (rangeSize < 2) {
    return convertDomainToTickData([scale.domain()[0]]);
  }

  const { tickCount, forceTickCount, tickStep, noDecimals = false, labelStyle } = op;

  let scaleTicks: number[];
  if (isValid(tickStep)) {
    scaleTicks = (scale as LinearScale).stepTicks(tickStep);
  } else if (isValid(forceTickCount)) {
    scaleTicks = (scale as LinearScale).forceTicks(forceTickCount);
  } else if (op.tickMode === 'd3') {
    const count = isFunction(tickCount) ? tickCount({ axisLength: rangeSize, labelStyle }) : tickCount;
    scaleTicks = (scale as LinearScale).d3Ticks(count ?? DEFAULT_CONTINUOUS_TICK_COUNT, { noDecimals });
  } else {
    const count = isFunction(tickCount) ? tickCount({ axisLength: rangeSize, labelStyle }) : tickCount;
    scaleTicks = (scale as LinearScale).ticks(count ?? DEFAULT_CONTINUOUS_TICK_COUNT, { noDecimals });
  }

  if (op.sampling) {
    // 判断重叠
    if (op.coordinateType === 'cartesian' || (op.coordinateType === 'polar' && op.axisOrientType === 'radius')) {
      const { labelGap = 4, labelFlush } = op as ICartesianTickDataOpt;
      let items = getCartesianLabelBounds(scale, scaleTicks, op as ICartesianTickDataOpt).map(
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
        if (last(ticks) !== last(scaleTicks)) {
          ticks.push(last(scaleTicks));
        }
      }

      scaleTicks = ticks;
    }
  }

  return convertDomainToTickData(scaleTicks);
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
