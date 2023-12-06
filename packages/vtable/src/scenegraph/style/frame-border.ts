import type { IGroupGraphicAttribute, IRect, IRectGraphicAttribute } from '@visactor/vrender';
import { createGroup, createRect } from '@visactor/vrender';
import type { TableFrameStyle } from '../../ts-types';
import type { Group } from '../graphic/group';
import { isArray } from '@visactor/vutils';
import { getQuadProps } from '../utils/padding';

/**
 * @description: create frame border
 * @param {Group} group
 * @param {TableFrameStyle} frameTheme
 * @param {string} role
 * @param {[boolean, boolean, boolean, boolean]} strokeArray
 * @return {*}
 */
export function createFrameBorder(
  group: Group,
  frameTheme: TableFrameStyle | undefined,
  role: string,
  strokeArray: [boolean, boolean, boolean, boolean] | undefined, // to do 处理成0b001111形式
  justForXYPosition?: boolean
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
    cornerRadius,
    borderColor,
    borderLineWidth,
    borderLineDash
  } = frameTheme;

  let hasShadow = false;
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
    rectAttributes.stroke = shadowColor;
    rectAttributes.lineWidth = 1;
    hasShadow = true;

    // rectAttributes.fill = true;
    // rectAttributes.fillOpacity = 0.01;
  }

  // 处理边框
  if (borderLineWidth) {
    rectAttributes.stroke = true;
    rectAttributes.fill = false;
    rectAttributes.stroke = getStroke(borderColor, strokeArray);
    rectAttributes.lineWidth = borderLineWidth as number;
    borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
    rectAttributes.lineCap = 'square';
  }

  if (Array.isArray(borderColor)) {
    (rectAttributes as any).strokeArrayColor = getQuadProps(borderColor as any);
  }
  if (Array.isArray(borderLineWidth)) {
    (rectAttributes as any).strokeArrayWidth = getQuadProps(borderLineWidth);
    (rectAttributes as any).lineWidth = 1;
  }

  if (cornerRadius) {
    rectAttributes.cornerRadius = cornerRadius;
    groupAttributes.cornerRadius = cornerRadius;
  }

  const borderTop = (rectAttributes as any).strokeArrayWidth
    ? (rectAttributes as any).strokeArrayWidth[0]
    : (rectAttributes.lineWidth as number) ?? 0;
  const borderRight = (rectAttributes as any).strokeArrayWidth
    ? (rectAttributes as any).strokeArrayWidth[1]
    : (rectAttributes.lineWidth as number) ?? 0;
  const borderBottom = (rectAttributes as any).strokeArrayWidth
    ? (rectAttributes as any).strokeArrayWidth[2]
    : (rectAttributes.lineWidth as number) ?? 0;
  const borderLeft = (rectAttributes as any).strokeArrayWidth
    ? (rectAttributes as any).strokeArrayWidth[3]
    : (rectAttributes.lineWidth as number) ?? 0;

  // // 处理边框引起的宽度高度变化（只对最外层tableGroup生效）
  // if (isTableGroup && (rectAttributes.shadowBlur || rectAttributes.lineWidth)) {
  //   const deltaX = (rectAttributes.shadowBlur ?? 0) + (borderLeft + borderRight) / 2;
  //   const deltaY = (rectAttributes.shadowBlur ?? 0) + (borderTop + borderBottom) / 2;

  //   groupAttributes.x = deltaX;
  //   groupAttributes.y = deltaY;
  //   // 宽度高度在tableNoFrameWidth&tableNoFrameHeight中处理
  //   // groupAttributes.width = group.attribute.width - deltaX - deltaX;
  //   // groupAttributes.height = group.attribute.height - deltaY - deltaY;
  // }
  group.setAttributes(groupAttributes);

  if (justForXYPosition) {
    return;
  }

  if (rectAttributes.stroke) {
    rectAttributes.x = borderLeft / 2;
    rectAttributes.y = borderTop / 2;
    rectAttributes.pickable = false;
    if (isTableGroup) {
      rectAttributes.x = group.attribute.x - borderLeft / 2;
      rectAttributes.y = group.attribute.y - borderTop / 2;
      rectAttributes.width = group.attribute.width + borderLeft / 2 + borderRight / 2;
      rectAttributes.height = group.attribute.height + borderTop / 2 + borderBottom / 2;

      let shadowRect;
      if (hasShadow) {
        rectAttributes.fill = 'black';
        (rectAttributes as any).notAdjustPos = true;
        shadowRect = createRect({
          x: borderLeft / 2,
          y: borderTop / 2,
          width: group.attribute.width,
          height: group.attribute.height,
          fill: 'red',
          globalCompositeOperation: 'destination-out'
        });
      }

      const borderRect = hasShadow ? createGroup(rectAttributes) : createRect(rectAttributes);
      borderRect.name = 'table-border-rect';
      if (shadowRect) {
        borderRect.addChild(shadowRect);
      }
      group.parent.insertBefore(borderRect, group);
      (group as any).border = borderRect;
    } else {
      // rectAttributes.x = rectAttributes.lineWidth / 2;
      // rectAttributes.y = rectAttributes.lineWidth / 2;
      rectAttributes.width = group.attribute.width - borderLeft / 2 - borderRight / 2;
      rectAttributes.height = group.attribute.height - borderTop / 2 - borderBottom / 2;
      const borderRect = createRect(rectAttributes);
      borderRect.name = 'border-rect';
      group.addChild(borderRect);
      (group as any).border = borderRect;
    }
  }
}

/**
 * @description: update frame border stroke atrribute
 * @param {Group} group
 * @param {TableFrameStyle} frameTheme
 * @param {array} strokeArray stroke boolean array
 * @return {*}
 */
export function updateFrameBorder(
  group: Group,
  frameTheme: TableFrameStyle | undefined,
  strokeArray: [boolean, boolean, boolean, boolean] // to do 处理成0b001111形式
) {
  const { borderColor } = frameTheme;
  group.border?.setAttribute('stroke', getStroke(borderColor, strokeArray));
}

export function getStroke(borderColor: string | string[], strokeArray: boolean[] | undefined) {
  let stroke: boolean | string | (boolean | string)[] = true;
  if (strokeArray && !isArray(borderColor)) {
    stroke = strokeArray.map(stroke => {
      if (stroke) {
        return borderColor;
      }
      return false;
    });
  } else if (strokeArray) {
    stroke = strokeArray;
  } else if (!strokeArray && !isArray(borderColor)) {
    stroke = borderColor;
  } else if (isArray(borderColor)) {
    stroke = true;
  }
  return stroke;
}

/**
 * @description: update frame border size when group size change
 * @param {Group} group
 * @return {*}
 */
export function updateFrameBorderSize(group: Group) {
  if (!group.border) {
    return;
  }
  const borderTop = (group.border.attribute as any).strokeArrayWidth
    ? (group.border.attribute as any).strokeArrayWidth[0]
    : (group.border.attribute.lineWidth as number) ?? 0;
  const borderRight = (group.border.attribute as any).strokeArrayWidth
    ? (group.border.attribute as any).strokeArrayWidth[1]
    : (group.border.attribute.lineWidth as number) ?? 0;
  const borderBottom = (group.border.attribute as any).strokeArrayWidth
    ? (group.border.attribute as any).strokeArrayWidth[2]
    : (group.border.attribute.lineWidth as number) ?? 0;
  const borderLeft = (group.border.attribute as any).strokeArrayWidth
    ? (group.border.attribute as any).strokeArrayWidth[3]
    : (group.border.attribute.lineWidth as number) ?? 0;

  group.border.setAttributes({
    width: group.attribute.width - borderLeft / 2 - borderRight / 2,
    height: group.attribute.height - borderTop / 2 - borderBottom / 2
  });

  if (group.border.type === 'group') {
    (group.border.firstChild as IRect).setAttributes({
      width: group.attribute.width,
      height: group.attribute.height
    });
  }
}
