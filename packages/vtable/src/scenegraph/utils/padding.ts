import { parsePadding } from '@src/vrender';
import { isArray, isNumber, isString } from '@visactor/vutils';

export function getQuadProps(
  paddingOrigin: number | string | number[] | { left?: number; right?: number; top?: number; bottom?: number }
): [number, number, number, number] {
  if (isNumber(paddingOrigin) || isString(paddingOrigin) || isArray(paddingOrigin)) {
    let padding = parsePadding(paddingOrigin as number);
    if (typeof padding === 'number' || typeof padding === 'string') {
      padding = [padding, padding, padding, padding];
    } else if (Array.isArray(padding)) {
      padding = padding.slice(0) as any;
    }
    return padding as any;
  } else if (
    paddingOrigin &&
    (isFinite(paddingOrigin.bottom) ||
      isFinite(paddingOrigin.left) ||
      isFinite(paddingOrigin.right) ||
      isFinite(paddingOrigin.top))
  ) {
    return [paddingOrigin.top ?? 0, paddingOrigin.right ?? 0, paddingOrigin.bottom ?? 0, paddingOrigin.left ?? 0];
  }
  return [0, 0, 0, 0];
}
