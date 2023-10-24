import { LinearScale, LogScale, SymlogScale } from '@visactor/vscale';
import { isFunction, isNil, isNumber, isValid } from '@visactor/vutils';

const DEFAULT_CONTINUOUS_TICK_COUNT = 5;
/**
 * @description: get axis nice domain and tick label text
 * @param {number} min
 * @param {number} max
 * @param {ITableAxisOption} axisOption
 * @return {*}
 */
export function getAxisDomainRangeAndLabels(
  min: number,
  max: number,
  axisOption: any,
  isZeroAlign: boolean,
  skipTick?: boolean
) {
  if (axisOption?.zero) {
    min = Math.min(min, 0);
    max = Math.max(max, 0);
  }
  if (isNumber(axisOption?.min)) {
    min = axisOption.min;
  }
  if (isNumber(axisOption?.max)) {
    max = axisOption.max;
  }

  let scale;
  if (axisOption?.type === 'log') {
    scale = new LogScale();
    scale.base(axisOption?.base ?? 10);
  } else if (axisOption?.type === 'symlog') {
    scale = new SymlogScale();
    scale.constant(axisOption?.constant ?? 10);
  } else {
    scale = new LinearScale();
  }
  scale.domain([min, max], !!axisOption?.nice);

  if (axisOption?.nice && !isZeroAlign) {
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

  delete (scale as any)._niceType; // ensure scaleTicks consistent in `measurement`, `component label` and `chart`
  let scaleTicks;
  if (!skipTick) {
    scaleTicks = scale.ticks(isNumber(axisOption?.tickCount) ? axisOption?.tickCount : DEFAULT_CONTINUOUS_TICK_COUNT, {
      noDecimals: axisOption?.tick?.noDecimals
    });
    // console.log(scaleTicks);
  }

  return {
    range: scale.domain(),
    ticks: scaleTicks
  };
}
