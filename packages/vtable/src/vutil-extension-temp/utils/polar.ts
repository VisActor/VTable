import type { TextAlignType, TextBaselineType } from '@visactor/vrender-core';

/**
 * 角度标准化处理
 * @param angle 弧度角
 */
export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
}

/**
 * 计算对应角度下的角度轴标签定位属性
 * @param angle 弧度角，需要注意是逆时针计算的
 * @returns
 */
export function angleLabelOrientAttribute(angle: number) {
  let align: TextAlignType = 'center';
  let baseline: TextBaselineType = 'middle';

  angle = normalizeAngle(angle);

  // left: 5/3 - 1/3; right: 2/3 - 4/3; center: 5/3 - 1/3 & 2/3 - 4/3
  if (angle >= Math.PI * (5 / 3) || angle <= Math.PI * (1 / 3)) {
    align = 'left';
  } else if (angle >= Math.PI * (2 / 3) && angle <= Math.PI * (4 / 3)) {
    align = 'right';
  } else {
    align = 'center';
  }

  // bottom: 7/6 - 11/6; top: 1/6 - 5/6; middle: 11/6 - 1/6 & 5/6 - 7/6
  if (angle >= Math.PI * (7 / 6) && angle <= Math.PI * (11 / 6)) {
    baseline = 'bottom';
  } else if (angle >= Math.PI * (1 / 6) && angle <= Math.PI * (5 / 6)) {
    baseline = 'top';
  } else {
    baseline = 'middle';
  }

  return { align, baseline };
}
