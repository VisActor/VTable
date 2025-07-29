import { isArray, isValid } from '@visactor/vutils';
import type { BaseTableAPI, ScrollStyle } from '../ts-types';

export function getHorizontalScrollBarSize(scrollStyle?: ScrollStyle): number {
  if (
    scrollStyle?.hoverOn ||
    (scrollStyle?.horizontalVisible && scrollStyle?.horizontalVisible === 'none') ||
    (!scrollStyle?.horizontalVisible && scrollStyle?.visible === 'none')
  ) {
    return 0;
  }
  return scrollStyle?.width ?? 7;
}

export function getVerticalScrollBarSize(scrollStyle?: ScrollStyle): number {
  if (
    scrollStyle?.hoverOn ||
    (scrollStyle?.verticalVisible && scrollStyle?.verticalVisible === 'none') ||
    (!scrollStyle?.verticalVisible && scrollStyle?.visible === 'none')
  ) {
    return 0;
  }
  return scrollStyle?.width ?? 7;
}

export function isValidStyle(style: (string | number) | (string | number)[]) {
  if (!isValid(style)) {
    return false;
  }
  if (isArray(style)) {
    return style.some(s => isValid(s));
  }

  return true;
}

export function isZeroStyle(style: number | number[]) {
  return style === 0 || (isArray(style) && style.every(s => s === 0));
}

// 设置复制区域的状态 类似excel的虚线框
export function setActiveCellRangeState(table: BaseTableAPI) {
  const selectRanges = table.stateManager.select.ranges;
  const setRanges = [];
  for (let i = 0; i < selectRanges.length; i++) {
    const range = selectRanges[i];
    setRanges.push({
      range,
      style: {
        cellBorderColor: 'blue',
        cellBorderLineWidth: 2,
        cellBorderLineDash: [5, 5]
      }
    });
  }
  table.stateManager.setCustomSelectRanges(setRanges);
}
export function clearActiveCellRangeState(table: BaseTableAPI) {
  table.stateManager.setCustomSelectRanges([]);
}
