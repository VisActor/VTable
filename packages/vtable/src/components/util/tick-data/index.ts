import type { BandScale, ContinuousScale, IBaseScale } from '@visactor/vscale';
// eslint-disable-next-line no-duplicate-imports
import { isContinuous, isDiscrete } from '@visactor/vscale';
import { continuousTicks } from './continuous';
import { linearDiscreteTicks } from './discrete/linear';
import { polarAngleAxisDiscreteTicks } from './discrete/polar-angle';
import { convertDomainToTickData } from './util';

// 总入口
export const ticks = (scale: IBaseScale, op: any): any[] => {
  if (isContinuous(scale.type)) {
    return continuousTicks(scale as ContinuousScale, op);
  } else if (isDiscrete(scale.type)) {
    if (op.coordinateType === 'cartesian') {
      return linearDiscreteTicks(scale as BandScale, op as any);
    } else if (op.coordinateType === 'polar') {
      if (op.axisOrientType === 'angle') {
        return polarAngleAxisDiscreteTicks(scale as BandScale, op as any);
      }
    }
  }
  return convertDomainToTickData(scale.domain(), op);
};
