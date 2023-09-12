import { LinearScale } from '@visactor/vscale';
import { isNil, isValid } from '@visactor/vutils';
import { DEFAULT_CONTINUOUS_TICK_COUNT } from '../../components/util/tick-data/config';

/**
 * @description: get axis nice domain and tick label text
 * @param {number} min
 * @param {number} max
 * @param {ITableAxisOption} axisOption
 * @return {*}
 */
export function getAxisDomainRangeAndLabels(min: number, max: number, axisOption: any, skipTick?: boolean) {
  const scale = new LinearScale();
  scale.domain([min, max], !!axisOption?.nice);

  if (axisOption?.nice) {
    let tickCount = axisOption.tick?.forceTickCount ?? axisOption.tick?.tickCount ?? 10;
    // 如果配置了精度优先，那么最低是10
    // 否则就直接使用tickCount即可
    if (axisOption.niceType === 'accurateFirst') {
      tickCount = Math.max(10, tickCount);
    }
    if (isNil(axisOption.min) && isNil(axisOption.max)) {
      scale.nice(tickCount);
    } else if (isValid(axisOption.min) && isNil(axisOption.max)) {
      scale.niceMax(tickCount);
    } else if (isNil(axisOption.min) && isValid(axisOption.max)) {
      scale.niceMin(tickCount);
    }
  }

  let scaleTicks;
  if (!skipTick) {
    scaleTicks = scale.ticks(axisOption?.tickCount ?? DEFAULT_CONTINUOUS_TICK_COUNT, {
      noDecimals: axisOption?.tick?.noDecimals
    });
    console.log(scaleTicks);
  }

  return {
    range: scale.domain(),
    ticks: scaleTicks
  };
}
