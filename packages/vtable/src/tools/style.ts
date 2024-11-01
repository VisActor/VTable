import { isArray, isValid } from '@visactor/vutils';
import type { ScrollStyle } from '../ts-types';

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
