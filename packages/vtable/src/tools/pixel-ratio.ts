import { isNode } from './helper';

export let defaultPixelRatio = 1;
/*
 * @Description: 设置像素比
 */
export function getPixelRatio(): number {
  if (isNode) {
    defaultPixelRatio = 1;
  } else {
    defaultPixelRatio = Math.ceil(window.devicePixelRatio || 1);
    if (defaultPixelRatio > 1 && defaultPixelRatio % 2 !== 0) {
      // 非整数倍的像素比，向上取整
      defaultPixelRatio += 1;
    }
  }
  return defaultPixelRatio;
}
getPixelRatio();
