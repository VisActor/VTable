import type { IGroupGraphicAttribute, IRectGraphicAttribute } from '@visactor/vrender';
import { createRect } from '@visactor/vrender';
import type { TableFrameStyle } from '../../ts-types';
import type { Group } from '../graphic/group';

export function createFrameBorder(
  group: Group,
  frameTheme: TableFrameStyle | undefined,
  role: string,
  strokeArray?: [boolean, boolean, boolean, boolean] // to do 处理成0b001111形式
) {
  if (!frameTheme) {
    return;
  }

  const isTableGroup = role === 'table';

  const {
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowColor,
    roundCornerRadius,
    borderColor,
    borderLineWidth,
    borderLineDash
  } = frameTheme;

  const groupAttributes: IGroupGraphicAttribute = {};
  const rectAttributes: IRectGraphicAttribute = {
    pickable: false
  };
  // 处理shadow
  if (shadowBlur && isTableGroup) {
    // 只有table才能配置shadow
    rectAttributes.shadowBlur = shadowBlur;
    rectAttributes.shadowOffsetX = shadowOffsetX;
    rectAttributes.shadowOffsetY = shadowOffsetY;
    rectAttributes.shadowColor = shadowColor;
    rectAttributes.stroke = true;
    rectAttributes.strokeColor = shadowColor;
    rectAttributes.lineWidth = 1;

    rectAttributes.fill = true;
    rectAttributes.fillOpacity = 0.01;
  }

  // 处理边框
  if (borderLineWidth) {
    rectAttributes.stroke = true;
    (rectAttributes as any).stroke = strokeArray || true;
    // (rectAttributes as any).strokeArrayColor = borderColor as string;
    rectAttributes.fill = false;
    rectAttributes.strokeColor = borderColor as string;
    rectAttributes.lineWidth = borderLineWidth as number;
    borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
  }

  if (Array.isArray(borderColor)) {
    (rectAttributes as any).strokeArrayColor = borderColor;
  }
  if (Array.isArray(borderLineWidth)) {
    (rectAttributes as any).strokeArrayWidth = borderLineWidth;
    (rectAttributes as any).lineWidth = 1;
  }

  if (roundCornerRadius) {
    rectAttributes.borderRadius = roundCornerRadius;
    groupAttributes.borderRadius = roundCornerRadius;
  }

  // 处理边框引起的宽度高度变化（只对最外层tableGroup生效）
  if (isTableGroup && (rectAttributes.shadowBlur || rectAttributes.lineWidth)) {
    const deltaX = (rectAttributes.shadowBlur ?? 0) + ((rectAttributes.lineWidth as number) ?? 0);
    const deltaY = (rectAttributes.shadowBlur ?? 0) + ((rectAttributes.lineWidth as number) ?? 0);

    groupAttributes.x = group.attribute.x + deltaX;
    groupAttributes.y = group.attribute.y + deltaY;
    // 宽度高度在tableNoFrameWidth&tableNoFrameHeight中处理
    // groupAttributes.width = group.attribute.width - deltaX - deltaX;
    // groupAttributes.height = group.attribute.height - deltaY - deltaY;
  }
  group.setAttributes(groupAttributes);

  if (rectAttributes.stroke) {
    rectAttributes.x = rectAttributes.lineWidth / 2;
    rectAttributes.y = rectAttributes.lineWidth / 2;
    rectAttributes.pickable = false;
    if (isTableGroup) {
      rectAttributes.x = group.attribute.x - rectAttributes.lineWidth / 2;
      rectAttributes.y = group.attribute.y - rectAttributes.lineWidth / 2;
      rectAttributes.width = group.attribute.width + rectAttributes.lineWidth;
      rectAttributes.height = group.attribute.height + rectAttributes.lineWidth;
      const borderRect = createRect(rectAttributes);
      borderRect.name = 'table-border-rect';
      group.parent.insertBefore(borderRect, group);
      (group as any).border = borderRect;
    } else {
      rectAttributes.x = rectAttributes.lineWidth / 2;
      rectAttributes.y = rectAttributes.lineWidth / 2;
      rectAttributes.width = group.attribute.width - rectAttributes.lineWidth;
      rectAttributes.height = group.attribute.height - rectAttributes.lineWidth;
      const borderRect = createRect(rectAttributes);
      borderRect.name = 'border-rect';
      group.addChild(borderRect);
      (group as any).border = borderRect;
    }
  }
}
