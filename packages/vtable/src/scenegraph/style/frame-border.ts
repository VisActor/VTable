import type { IGroupGraphicAttribute, IRect, IRectGraphicAttribute } from '@src/vrender';
import { createGroup, createRect } from '@src/vrender';
import type { TableFrameStyle } from '../../ts-types';
import type { Group } from '../graphic/group';
import { isArray } from '@visactor/vutils';
import { getQuadProps } from '../utils/padding';
import type { BaseTableAPI } from '../../ts-types/base-table';

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
      if (cornerRadius) {
        rectAttributes.cornerRadius = cornerRadius + (rectAttributes.lineWidth ?? 0) / 2;
      }
      if (frameTheme.innerBorder) {
        rectAttributes.x = group.attribute.x + borderLeft / 2;
        rectAttributes.y = group.attribute.y + borderTop / 2;
        rectAttributes.width = group.attribute.width - borderLeft / 2 - borderRight / 2;
        rectAttributes.height = group.attribute.height - borderTop / 2 - borderBottom / 2;
      } else {
        rectAttributes.x = group.attribute.x - borderLeft / 2;
        rectAttributes.y = group.attribute.y - borderTop / 2;
        rectAttributes.width = group.attribute.width + borderLeft / 2 + borderRight / 2;
        rectAttributes.height = group.attribute.height + borderTop / 2 + borderBottom / 2;
      }

      let shadowRect;
      let borderRect;
      if (hasShadow) {
        rectAttributes.fill = 'white';
        (rectAttributes as any).notAdjustPos = true;
        // rectAttributes.globalCompositeOperation = 'source-over';

        // first draw group
        borderRect = createGroup(rectAttributes);
        borderRect.name = 'table-border-rect';

        // second draw rect
        shadowRect = createRect({
          x: borderLeft / 2,
          y: borderTop / 2,
          width: group.attribute.width,
          height: group.attribute.height,
          fill: 'red',
          cornerRadius: group.attribute.cornerRadius,
          globalCompositeOperation: 'destination-out'
        });
        borderRect.addChild(shadowRect);

        // hack for vrender globalCompositeOperation&clip render problem
        const hackRect = createRect({
          width: 1,
          height: 1,
          fill: 'transparent',
          pickable: false
        });
        borderRect.addChild(hackRect);
      } else {
        borderRect = createRect(rectAttributes);
        borderRect.name = 'table-border-rect';
      }

      // to be fixed: border index in shadow mode
      if (frameTheme.innerBorder && !hasShadow) {
        group.parent.insertAfter(borderRect, group);
      } else {
        group.parent.insertBefore(borderRect, group);
      }
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

export function updateCornerRadius(table: BaseTableAPI) {
  if (!table.theme.frameStyle.cornerRadius) {
    return;
  }
  const cornerRadius = table.theme.frameStyle.cornerRadius;
  const {
    cornerHeaderGroup,
    colHeaderGroup,
    rowHeaderGroup,
    bodyGroup,
    rightTopCornerGroup,
    leftBottomCornerGroup,
    rightBottomCornerGroup,
    rightFrozenGroup,
    bottomFrozenGroup
  } = table.scenegraph;

  // reset corner radius
  cornerHeaderGroup.setAttribute('cornerRadius', 0);
  colHeaderGroup.setAttribute('cornerRadius', 0);
  rowHeaderGroup.setAttribute('cornerRadius', 0);
  bodyGroup.setAttribute('cornerRadius', 0);
  rightTopCornerGroup.setAttribute('cornerRadius', 0);
  leftBottomCornerGroup.setAttribute('cornerRadius', 0);
  rightBottomCornerGroup.setAttribute('cornerRadius', 0);
  rightFrozenGroup.setAttribute('cornerRadius', 0);
  bottomFrozenGroup.setAttribute('cornerRadius', 0);

  // left top
  if (cornerHeaderGroup.attribute.width > 0 && cornerHeaderGroup.attribute.height > 0) {
    setCornerRadius(cornerHeaderGroup, [cornerRadius, 0, 0, 0]);
  } else if (colHeaderGroup.attribute.height > 0) {
    setCornerRadius(colHeaderGroup, [cornerRadius, 0, 0, 0]);
  } else if (rowHeaderGroup.attribute.width > 0) {
    setCornerRadius(rowHeaderGroup, [cornerRadius, 0, 0, 0]);
  } else {
    setCornerRadius(bodyGroup, [cornerRadius, 0, 0, 0]);
  }

  // left bottom
  if (leftBottomCornerGroup.attribute.width > 0 && leftBottomCornerGroup.attribute.height > 0) {
    setCornerRadius(leftBottomCornerGroup, [0, 0, 0, cornerRadius]);
  } else if (bottomFrozenGroup.attribute.height > 0) {
    setCornerRadius(bottomFrozenGroup, [0, 0, 0, cornerRadius]);
  } else if (rowHeaderGroup.attribute.width > 0) {
    setCornerRadius(rowHeaderGroup, [0, 0, 0, cornerRadius]);
  } else {
    setCornerRadius(bodyGroup, [0, 0, 0, cornerRadius]);
  }

  // right top
  if (rightTopCornerGroup.attribute.width > 0 && rightTopCornerGroup.attribute.height > 0) {
    setCornerRadius(rightTopCornerGroup, [0, cornerRadius, 0, 0]);
  } else if (colHeaderGroup.attribute.height > 0) {
    setCornerRadius(colHeaderGroup, [0, cornerRadius, 0, 0]);
  } else if (rightFrozenGroup.attribute.width > 0) {
    setCornerRadius(rightFrozenGroup, [0, cornerRadius, 0, 0]);
  } else {
    setCornerRadius(bodyGroup, [0, cornerRadius, 0, 0]);
  }

  // right bottom
  if (rightBottomCornerGroup.attribute.width > 0 && rightBottomCornerGroup.attribute.height > 0) {
    setCornerRadius(rightBottomCornerGroup, [0, 0, cornerRadius, 0]);
  } else if (rightFrozenGroup.attribute.width > 0) {
    setCornerRadius(rightFrozenGroup, [0, 0, cornerRadius, 0]);
  } else if (bottomFrozenGroup.attribute.height > 0) {
    setCornerRadius(bottomFrozenGroup, [0, 0, cornerRadius, 0]);
  } else {
    setCornerRadius(bodyGroup, [0, 0, cornerRadius, 0]);
  }
}

function setCornerRadius(group: Group, cornerRadius: number[]) {
  group.setAttribute('cornerRadius', cornerRadius);
  if (group.border) {
    group.border.setAttribute('cornerRadius', cornerRadius);
  }
}
