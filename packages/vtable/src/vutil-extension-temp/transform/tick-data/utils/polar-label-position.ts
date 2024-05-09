import type { ITextGraphicAttribute } from '@visactor/vrender-core';
import { getCircleLabelPosition, getCircleVerticalVector, getVerticalCoord } from '@visactor/vrender-components';
import { polarToCartesian } from '@visactor/vutils';

export function getLabelPosition(
  angle: number,
  center: { x: number; y: number },
  radius: number,
  labelOffset: number,
  inside: boolean,
  text: string | number,
  style: Partial<ITextGraphicAttribute>
) {
  const point = polarToCartesian({ x: 0, y: 0 }, radius, angle);
  const labelPoint = getVerticalCoord(point, getCircleVerticalVector(labelOffset, point, center, inside));
  const vector = getCircleVerticalVector(labelOffset || 1, labelPoint, center, inside);
  return getCircleLabelPosition(labelPoint, vector, text, style);
}
