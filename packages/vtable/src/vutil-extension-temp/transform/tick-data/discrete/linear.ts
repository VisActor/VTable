import type { BandScale, IBaseScale } from '@visactor/vscale';
import { isFunction, isValid, maxInArray, minInArray } from '@visactor/vutils';
import type { ICartesianTickDataOpt, ITickData } from '../interface';
import { convertDomainToTickData, getCartesianLabelBounds, isAxisHorizontal } from '../util';
import { binaryFuzzySearchInNumberRange } from '../../../algorithm';

/** x1, x2, length */
type OneDimensionalBounds = [number, number, number];

const getOneDimensionalLabelBounds = (
  scale: IBaseScale,
  domain: any[],
  op: ICartesianTickDataOpt,
  isHorizontal: boolean
): OneDimensionalBounds[] => {
  const labelBoundsList = getCartesianLabelBounds(scale, domain, op);
  return labelBoundsList.map(bounds => {
    if (isHorizontal) {
      return [bounds.x1, bounds.x2, bounds.width()];
    }
    return [bounds.y1, bounds.y2, bounds.height()];
  });
};

/** 判断两个 bounds 是否有重叠情况 */
const boundsOverlap = (prevBounds: OneDimensionalBounds, nextBounds: OneDimensionalBounds, gap = 0): boolean => {
  return Math.max(prevBounds[0], nextBounds[0]) - gap / 2 <= Math.min(prevBounds[1], nextBounds[1]) + gap / 2;
};

/** 判断两个不相交的 bounds 相隔的距离 */
export const boundsDistance = (prevBounds: OneDimensionalBounds, nextBounds: OneDimensionalBounds): number => {
  if (prevBounds[1] < nextBounds[0]) {
    return nextBounds[0] - prevBounds[1];
  } else if (nextBounds[1] < prevBounds[0]) {
    return prevBounds[0] - nextBounds[1];
  }
  return 0;
};

/**
 * 对于离散轴：
 * - 如果spec配了tickCount、forceTickCount、tickStep，则直接输出BandScale的ticks()、forceTicks()、stepTicks()结果；
 * - 估算所有轴label的宽度（或高度，在竖轴的情况下）并存为数组domainLengthList；
 * - 通过循环来寻找最小的step，使：如果在这个step下采样，轴标签互不遮挡（此处用到domainLengthList和scale.range()）；
 * - 如果用户配置了spec.label.lastVisible，则处理右边界：强制采样最后一个tick数据，并删掉这个tick的label所覆盖的那些tick数据。
 *
 * @param scale
 * @param op
 * @returns
 */
export const linearDiscreteTicks = (scale: BandScale, op: ICartesianTickDataOpt): ITickData[] => {
  const domain = scale.domain();
  if (!domain.length) {
    return [];
  }
  const { tickCount, forceTickCount, tickStep, labelGap = 4, axisOrientType, labelStyle } = op;
  const isHorizontal = isAxisHorizontal(axisOrientType);
  const range = scale.range();

  // if range is so small
  const rangeSize = scale.calculateWholeRangeSize();
  if (rangeSize < 2) {
    if (op.labelLastVisible) {
      return convertDomainToTickData([domain[domain.length - 1]]);
    }
    return convertDomainToTickData([domain[0]]);
  }

  let scaleTicks;
  if (isValid(tickStep)) {
    scaleTicks = scale.stepTicks(tickStep);
  } else if (isValid(forceTickCount)) {
    scaleTicks = scale.forceTicks(forceTickCount);
  } else if (isValid(tickCount)) {
    const count = isFunction(tickCount) ? tickCount({ axisLength: rangeSize, labelStyle }) : tickCount;
    scaleTicks = scale.ticks(count);
  } else if (op.sampling) {
    const fontSize = (op.labelStyle.fontSize ?? 12) + 2;
    const rangeStart = minInArray(range);
    const rangeEnd = maxInArray(range);

    if (domain.length <= rangeSize / fontSize) {
      const incrementUnit = (rangeEnd - rangeStart) / domain.length;
      const labelBoundsList = getOneDimensionalLabelBounds(scale, domain, op, isHorizontal);
      const minBoundsLength = Math.min(...labelBoundsList.map(bounds => bounds[2]));

      const stepResult = getStep(
        domain,
        labelBoundsList,
        labelGap,
        op.labelLastVisible,
        Math.floor(minBoundsLength / incrementUnit), // 给step赋上合适的初值，有效改善外层循环次数
        false
      );

      scaleTicks = (scale as BandScale).stepTicks(stepResult.step);
      if (op.labelLastVisible) {
        if (stepResult.delCount) {
          scaleTicks = scaleTicks.slice(0, scaleTicks.length - stepResult.delCount);
        }
        scaleTicks.push(domain[domain.length - 1]);
      }
    } else {
      // only check first middle last, use the max size to sampling
      const tempDomain = [domain[0], domain[Math.floor(domain.length / 2)], domain[domain.length - 1]];
      const tempList = getOneDimensionalLabelBounds(scale, tempDomain, op, isHorizontal);
      let maxBounds: OneDimensionalBounds = null;
      tempList.forEach(current => {
        if (!maxBounds) {
          maxBounds = current;
          return;
        }
        if (maxBounds[2] < current[2]) {
          maxBounds = current;
        }
      });

      const step =
        rangeEnd - rangeStart - labelGap > 0
          ? Math.ceil((domain.length * (labelGap + maxBounds[2])) / (rangeEnd - rangeStart - labelGap))
          : domain.length - 1;

      scaleTicks = (scale as BandScale).stepTicks(step);

      if (
        op.labelLastVisible &&
        (!scaleTicks.length || scaleTicks[scaleTicks.length - 1] !== domain[domain.length - 1])
      ) {
        if (
          scaleTicks.length &&
          Math.abs(scale.scale(scaleTicks[scaleTicks.length - 1]) - scale.scale(domain[domain.length - 1])) <
            maxBounds[2]
        ) {
          scaleTicks = scaleTicks.slice(0, -1);
        }
        scaleTicks.push(domain[domain.length - 1]);
      }
    }
  } else {
    scaleTicks = scale.domain();
  }

  return convertDomainToTickData(scaleTicks);
};

/** 计算合适的step */
const getStep = (
  domain: any[],
  labelBoundsList: OneDimensionalBounds[],
  labelGap: number,
  labelLastVisible: boolean,
  defaultStep: number,
  areAllBoundsSame: boolean
) => {
  let resultDelCount = 0;
  let resultStep = 0;
  let resultTickCount = -1;
  let minDiff = Number.MAX_VALUE;

  /** 验证在当前 step 下是否会产生重叠 */
  const validateStep = (step: number) => {
    let success = true;
    let ptr = 0;
    do {
      if (ptr + step < domain.length && boundsOverlap(labelBoundsList[ptr], labelBoundsList[ptr + step], labelGap)) {
        success = false;
      }
      ptr += step;
    } while (success && ptr < domain.length);
    return success;
  };

  // 通过二分来寻找最小的step，使：如果在这个step下采样，轴标签互不遮挡
  const minValidStep = binaryFuzzySearchInNumberRange(defaultStep, domain.length, step =>
    validateStep(step) ? 1 : -1
  );

  // 对 step 进行微调
  let step = minValidStep;
  do {
    if (step > minValidStep && !areAllBoundsSame) {
      if (!validateStep(step)) {
        step++;
        continue;
      }
    }
    if (labelLastVisible) {
      const lastIndex = domain.length - 1;
      let delCount = 0;
      let ptr;
      if (domain.length % step > 0) {
        ptr = domain.length - (domain.length % step) + step;
      } else {
        ptr = domain.length;
      }
      do {
        ptr -= step; // 获取最后一个label位置
        if (ptr === lastIndex || boundsOverlap(labelBoundsList[ptr], labelBoundsList[lastIndex], labelGap)) {
          delCount++;
        } else {
          break;
        }
      } while (ptr > 0);
      if (ptr === lastIndex) {
        // 采到的最后的一个 label 刚好是最后一项，直接退出
        resultStep = step;
        resultDelCount = delCount;
        break;
      } else {
        // 尝试获取最均匀的结果，防止倒数第二项和最后一项有大的空档
        const tickCount = Math.floor(domain.length / step) - delCount + 1;
        if (tickCount < resultTickCount) {
          break;
        } else {
          resultTickCount = tickCount;
          const distance1 = boundsDistance(labelBoundsList[ptr], labelBoundsList[lastIndex]); // 倒数第2项和最后一项的距离
          const distance2 =
            ptr - step >= 0 ? boundsDistance(labelBoundsList[ptr - step], labelBoundsList[ptr]) : distance1; // 倒数第3项和倒数第2项的距离
          const diff = Math.abs(distance1 - distance2);
          if (diff < minDiff) {
            minDiff = diff;
            resultStep = step; // 记录最均匀的 step
            resultDelCount = delCount;
          }
          if (distance1 <= distance2) {
            break;
          }
        }
      }
    } else {
      resultStep = step;
      break;
    }
    step++;
  } while (step <= domain.length);

  return {
    step: resultStep,
    delCount: resultDelCount
  };
};
