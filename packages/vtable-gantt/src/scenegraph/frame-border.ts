import type { Group, IGroupGraphicAttribute, IRect, IRectGraphicAttribute } from '@visactor/vrender-core';
import { createGroup, createRect } from '@visactor/vrender-core';

import { isArray } from '@visactor/vutils';
import type { IFrameStyle } from '../ts-types';
import type { Gantt } from '../Gantt';
import { getQuadProps } from '../gantt-helper';

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
  frameTheme: IFrameStyle | undefined,
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

  // const hasShadow = false;
  const groupAttributes: IGroupGraphicAttribute = {};
  const rectAttributes: IRectGraphicAttribute = {
    pickable: false
  };
  // // 处理shadow
  // if (shadowBlur && isTableGroup) {
  //   // 只有table才能配置shadow
  //   rectAttributes.shadowBlur = shadowBlur;
  //   rectAttributes.shadowOffsetX = shadowOffsetX;
  //   rectAttributes.shadowOffsetY = shadowOffsetY;
  //   rectAttributes.shadowColor = shadowColor;
  //   rectAttributes.stroke = true;
  //   rectAttributes.stroke = shadowColor;
  //   rectAttributes.lineWidth = 1;
  //   hasShadow = true;

  //   // rectAttributes.fill = true;
  //   // rectAttributes.fillOpacity = 0.01;
  // }

  // 处理边框
  if (borderLineWidth) {
    rectAttributes.stroke = true;
    rectAttributes.fill = false;
    rectAttributes.stroke = borderColor; // getStroke(borderColor, strokeArray);
    rectAttributes.lineWidth = borderLineWidth as number;
    borderLineDash && (rectAttributes.lineDash = borderLineDash as number[]);
    rectAttributes.lineCap = 'butt';
  }
  if (Array.isArray(borderColor)) {
    (rectAttributes as any).strokeArrayColor = getQuadProps(borderColor as any);
  }

  if (Array.isArray(borderLineWidth)) {
    (rectAttributes as any).strokeArrayWidth = getQuadProps(borderLineWidth);
    (rectAttributes as any).lineWidth = 1;
  }

  if (cornerRadius) {
    rectAttributes.cornerRadius = [0, 10, 10, 0];
    groupAttributes.cornerRadius = [0, 10, 10, 0];
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
  group.setAttributes(groupAttributes);

  if (justForXYPosition) {
    return;
  }

  if (rectAttributes.stroke) {
    rectAttributes.x = -borderLeft / 2; //为了可以绘制完整矩形 且左侧的边框不出现在group中
    rectAttributes.y = borderTop / 2;
    rectAttributes.pickable = false;

    rectAttributes.width = group.attribute.width + borderLeft / 2 + borderRight / 2;
    rectAttributes.height = group.attribute.height + borderTop / 2 + borderBottom / 2;
    const borderRect = createRect(rectAttributes);
    borderRect.name = 'border-rect';
    group.parent.insertAfter(borderRect, group);
    (group as any).border = borderRect;
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
  frameTheme: IFrameStyle | undefined,
  strokeArray?: [boolean, boolean, boolean, boolean] // to do 处理成0b001111形式
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

export function updateCornerRadius(gantt: Gantt) {
  if (!gantt.frameStyle.cornerRadius) {
    return;
  }
  const cornerRadius = gantt.frameStyle.cornerRadius;
  // const {
  //   cornerHeaderGroup,
  //   colHeaderGroup,
  //   rowHeaderGroup,
  //   bodyGroup,
  //   rightTopCornerGroup,
  //   leftBottomCornerGroup,
  //   rightBottomCornerGroup,
  //   rightFrozenGroup,
  //   bottomFrozenGroup
  // } = gantt.scenegraph;

  // // reset corner radius
  // cornerHeaderGroup.setAttribute('cornerRadius', 0);
  // colHeaderGroup.setAttribute('cornerRadius', 0);
  // rowHeaderGroup.setAttribute('cornerRadius', 0);
  // bodyGroup.setAttribute('cornerRadius', 0);
  // rightTopCornerGroup.setAttribute('cornerRadius', 0);
  // leftBottomCornerGroup.setAttribute('cornerRadius', 0);
  // rightBottomCornerGroup.setAttribute('cornerRadius', 0);
  // rightFrozenGroup.setAttribute('cornerRadius', 0);
  // bottomFrozenGroup.setAttribute('cornerRadius', 0);

  // // left top
  // if (cornerHeaderGroup.attribute.width > 0 && cornerHeaderGroup.attribute.height > 0) {
  //   setCornerRadius(cornerHeaderGroup, [cornerRadius, 0, 0, 0]);
  // } else if (colHeaderGroup.attribute.height > 0) {
  //   setCornerRadius(colHeaderGroup, [cornerRadius, 0, 0, 0]);
  // } else if (rowHeaderGroup.attribute.width > 0) {
  //   setCornerRadius(rowHeaderGroup, [cornerRadius, 0, 0, 0]);
  // } else {
  //   setCornerRadius(bodyGroup, [cornerRadius, 0, 0, 0]);
  // }

  // // left bottom
  // if (leftBottomCornerGroup.attribute.width > 0 && leftBottomCornerGroup.attribute.height > 0) {
  //   setCornerRadius(leftBottomCornerGroup, [0, 0, 0, cornerRadius]);
  // } else if (bottomFrozenGroup.attribute.height > 0) {
  //   setCornerRadius(bottomFrozenGroup, [0, 0, 0, cornerRadius]);
  // } else if (rowHeaderGroup.attribute.width > 0) {
  //   setCornerRadius(rowHeaderGroup, [0, 0, 0, cornerRadius]);
  // } else {
  //   setCornerRadius(bodyGroup, [0, 0, 0, cornerRadius]);
  // }

  // // right top
  // if (rightTopCornerGroup.attribute.width > 0 && rightTopCornerGroup.attribute.height > 0) {
  //   setCornerRadius(rightTopCornerGroup, [0, cornerRadius, 0, 0]);
  // } else if (colHeaderGroup.attribute.height > 0) {
  //   setCornerRadius(colHeaderGroup, [0, cornerRadius, 0, 0]);
  // } else if (rightFrozenGroup.attribute.width > 0) {
  //   setCornerRadius(rightFrozenGroup, [0, cornerRadius, 0, 0]);
  // } else {
  //   setCornerRadius(bodyGroup, [0, cornerRadius, 0, 0]);
  // }

  // // right bottom
  // if (rightBottomCornerGroup.attribute.width > 0 && rightBottomCornerGroup.attribute.height > 0) {
  //   setCornerRadius(rightBottomCornerGroup, [0, 0, cornerRadius, 0]);
  // } else if (rightFrozenGroup.attribute.width > 0) {
  //   setCornerRadius(rightFrozenGroup, [0, 0, cornerRadius, 0]);
  // } else if (bottomFrozenGroup.attribute.height > 0) {
  //   setCornerRadius(bottomFrozenGroup, [0, 0, cornerRadius, 0]);
  // } else {
  //   setCornerRadius(bodyGroup, [0, 0, cornerRadius, 0]);
  // }
}

function setCornerRadius(group: Group, cornerRadius: number[]) {
  group.setAttribute('cornerRadius', cornerRadius);
  if (group.border) {
    group.border.setAttribute('cornerRadius', cornerRadius);
  }
}
