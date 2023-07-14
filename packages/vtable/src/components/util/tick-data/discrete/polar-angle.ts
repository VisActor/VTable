import type { BandScale } from '@visactor/vscale';
import { isValid } from '@visactor/vutils';
import { convertDomainToTickData, getAxisLabelOffset, getPolarAngleLabelBounds, labelOverlap } from '../util';
import type { AABBBounds } from '@visactor/vutils';

/**
 * 对于离散轴：
 * - 如果spec配了tickCount、forceTickCount、tickStep，则直接输出BandScale的ticks()、forceTicks()、stepTicks()结果；
 * - 估算所有轴label的宽高并存为数组labelBoundsList；
 * - 通过循环来寻找最小的step，使：如果在这个step下采样，轴标签互不遮挡（此处用到labelBoundsList和scale.range()）；
 *
 * @param scale
 * @param op
 * @returns
 */
export const polarAngleAxisDiscreteTicks = (scale: BandScale, op: any): any[] => {
  const { tickCount, forceTickCount, tickStep, getRadius, axisSpec, labelGap = 0 } = op;
  const radius = getRadius?.();
  if (!radius) {
    return convertDomainToTickData(scale.domain(), op);
  }

  let scaleTicks;
  if (isValid(tickStep)) {
    scaleTicks = scale.stepTicks(tickStep);
  } else if (isValid(forceTickCount)) {
    scaleTicks = scale.forceTicks(forceTickCount);
  } else if (isValid(tickCount)) {
    scaleTicks = scale.ticks(tickCount);
  } else {
    const domain = scale.domain();
    const range = scale.range();

    const labelOffset = getAxisLabelOffset(axisSpec);
    const labelBoundsList = getPolarAngleLabelBounds(scale, domain, op);

    const rangeStart = Math.min(...range);
    const rangeEnd = Math.max(...range);

    const axisLength = Math.abs(rangeEnd - rangeStart) * (radius + labelOffset);
    const incrementUnit = axisLength / domain.length;
    const { step, delCount } = getStep(
      domain,
      labelBoundsList,
      labelGap,
      Math.floor(
        labelBoundsList.reduce((min, curBounds) => {
          return Math.min(min, curBounds.width(), curBounds.height());
        }, Number.MAX_VALUE) / incrementUnit
      ) // 给step赋上合适的初值，有效改善外层循环次数
    );

    scaleTicks = (scale as BandScale).stepTicks(step);
    scaleTicks = scaleTicks.slice(0, scaleTicks.length - delCount);
  }

  return convertDomainToTickData(scaleTicks, op);
};

/** 计算合适的step */
const getStep = (domain: any[], labelBoundsList: AABBBounds[], labelGap: number, defaultStep: number) => {
  let step = defaultStep;
  // 通过循环来寻找最小的step，使：如果在这个step下采样，轴标签互不遮挡
  do {
    let success = true;
    step++;
    let ptr = 0;
    do {
      if (ptr + step < domain.length && labelOverlap(labelBoundsList[ptr], labelBoundsList[ptr + step], labelGap)) {
        success = false;
      }
      ptr += step;
    } while (success && ptr < domain.length);
    if (success) {
      break;
    }
  } while (step <= domain.length);

  let delCount = 0;
  if (domain.length > 2) {
    let ptr = domain.length - (domain.length % step);
    if (ptr >= domain.length) {
      ptr -= step;
    }
    // 判断首尾是否互相覆盖
    while (ptr > 0 && labelOverlap(labelBoundsList[0], labelBoundsList[ptr])) {
      delCount++;
      ptr -= step;
    }
  }

  return {
    step,
    delCount
  };
};
