import type { IRectGraphicAttribute } from '@src/vrender';
import type { ThemeStyle } from '../../ts-types';
import type { Group } from '../graphic/group';
import { getStroke } from './frame-border';
import { getQuadProps } from '../utils/padding';

export function createCornerCell(cellGroup: Group, frameTheme: ThemeStyle) {
  const { bgColor, borderColor, borderLineWidth, borderLineDash } = frameTheme;

  const rectAttributes: IRectGraphicAttribute = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
    pickable: true,
    fill: bgColor as string
  };
  rectAttributes.stroke = getStroke(borderColor as string, undefined);
  rectAttributes.lineWidth = borderLineWidth as number;
  borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
  rectAttributes.lineCap = 'butt';
  if (Array.isArray(borderColor)) {
    (rectAttributes as any).strokeArrayColor = getQuadProps(borderColor as any);
  }
  if (Array.isArray(borderLineWidth)) {
    (rectAttributes as any).strokeArrayWidth = getQuadProps(borderLineWidth);
    (rectAttributes as any).lineWidth = 1;
  }

  // const cornerCellGroup = new Group(rectAttributes);
  cellGroup.setAttributes(rectAttributes);
  cellGroup.role = 'corner-frozen';
  return cellGroup;
}
