import { parsePadding } from '@visactor/vrender';

export function getQuadProps(paddingOrigin: number | number[]): [number, number, number, number] {
  let padding = parsePadding(paddingOrigin);
  if (typeof padding === 'number' || typeof padding === 'string') {
    padding = [padding, padding, padding, padding];
  } else if (Array.isArray(padding)) {
    padding = padding.slice(0) as any;
  }
  return padding as any;
}
