/**
 * @description: 从事件对象中获取图标和位置信息
 * @param {any} target
 * @return {*}
 */
export function getIconAndPositionFromTarget(target: any):
  | {
      icon: any;
      position: {
        left: number;
        right: number;
        top: number;
        bottom: number;
        width: number;
        height: number;
      };
      type: string;
    }
  | undefined {
  if (!target) {
    return undefined;
  }
  const icon = target.role?.startsWith('icon')
    ? target
    : target.type === 'richtext'
    ? target._currentHoverIcon
    : undefined;
  if (!icon) {
    return undefined;
  }
  if (target.type === 'richtext') {
    return {
      icon: icon,
      position: {
        left: target.globalAABBBounds.x1 + icon.globalAABBBounds.x1,
        right: target.globalAABBBounds.x1 + icon.globalAABBBounds.x2,
        top: target.globalAABBBounds.y1 + icon.globalAABBBounds.y1,
        bottom: target.globalAABBBounds.y1 + icon.globalAABBBounds.y2,
        width: icon.globalAABBBounds.x2 - icon.globalAABBBounds.x1,
        height: icon.globalAABBBounds.y2 - icon.globalAABBBounds.y1
      },
      type: 'richtext-icon'
    };
  }
  return {
    icon: icon,
    position: {
      left: icon.globalAABBBounds.x1,
      right: icon.globalAABBBounds.x2,
      top: icon.globalAABBBounds.y1,
      bottom: icon.globalAABBBounds.y2,
      width: icon.globalAABBBounds.x2 - icon.globalAABBBounds.x1,
      height: icon.globalAABBBounds.y2 - icon.globalAABBBounds.y1
    },
    type: 'icon'
  };
}
