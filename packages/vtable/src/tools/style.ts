import type { ScrollStyle } from '../ts-types';

export function getScrollBarSize(scrollStyle?: ScrollStyle): number {
  if (scrollStyle?.hoverOn || scrollStyle?.visible === 'none') {
    return 0;
  }
  return scrollStyle?.width ?? 7;
}
