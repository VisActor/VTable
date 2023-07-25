import type { BandScale } from '@visactor/vscale';
import { isValid } from '@visactor/vutils';
import { convertDomainToTickData, getCartesianLabelBounds, labelDistance, labelOverlap } from '../util';
import type { AABBBounds } from '@visactor/vutils';

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
export const linearDiscreteTicks = (scale: BandScale, op: any): any[] => {
  const { tickCount, forceTickCount, tickStep, labelGap = 4, axisOrientType } = op;
  const isHorizontal = ['bottom', 'top'].includes(axisOrientType);

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

    const labelBoundsList = getCartesianLabelBounds(scale, domain, op);

    const domainLengthList = labelBoundsList.map(b => {
      return isHorizontal ? b.width() : b.height();
    });

    const rangeStart = Math.min(...range);
    const rangeEnd = Math.max(...range);
    const incrementUnit = (rangeEnd - rangeStart) / domain.length;
    const result = getStep(
      domain,
      labelBoundsList,
      labelGap,
      op.labelLastVisible,
      isHorizontal,
      Math.floor(Math.min(...domainLengthList) / incrementUnit) // 给step赋上合适的初值，有效改善外层循环次数
    );

    scaleTicks = (scale as BandScale).stepTicks(result.step);
    if (op.labelLastVisible) {
      scaleTicks = scaleTicks.slice(0, scaleTicks.length - result.delCount);
      scaleTicks.push(domain[domain.length - 1]);
    }
  }

  return convertDomainToTickData(scaleTicks, op);
};

/** 计算合适的step */
const getStep = (
  domain: any[],
  labelBoundsList: AABBBounds[],
  labelGap: number,
  labelLastVisible: boolean,
  isHorizontal: boolean,
  defaultStep: number
) => {
  let step = defaultStep;
  let delCount = 0;
  let resultDelCount = 0;
  let resultStep = 0;
  let resultTickCount = -1;
  let minDiff = Number.MAX_VALUE;
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
      if (labelLastVisible) {
        const lastIndex = domain.length - 1;
        delCount = 0;
        do {
          ptr -= step; // 获取最后一个label位置
          if (ptr === lastIndex || labelOverlap(labelBoundsList[ptr], labelBoundsList[lastIndex], labelGap)) {
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
            const distanceIndex = isHorizontal ? 0 : 1;
            const distance1 = labelDistance(labelBoundsList[ptr], labelBoundsList[lastIndex])[distanceIndex]; // 倒数第2项和最后一项的距离
            const distance2 =
              ptr - step >= 0
                ? labelDistance(labelBoundsList[ptr - step], labelBoundsList[ptr])[distanceIndex]
                : distance1; // 倒数第3项和倒数第2项的距离
            const diff = Math.abs(distance1 - distance2);
            if (diff < minDiff) {
              minDiff = diff;
              resultStep = step; // 记录最均匀的 step
              resultDelCount = delCount;
            }
          }
        }
      } else {
        resultStep = step;
        break;
      }
    }
  } while (step <= domain.length);

  return {
    step: resultStep,
    delCount: resultDelCount
  };
};
