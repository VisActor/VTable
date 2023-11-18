import type { Container } from './container';
import type { AlignItems, Direction, DirectionKey, JustifyContent } from './direction';
import { DIRECTION_KEY } from './direction';
import type { BaseElement } from './element';
import type { Icon } from './icon';

export class Line {
  width = 0;
  height = 0;
  y = 0;
  x = 0;
  children: BaseElement[] = [];
  addAble = true;
  widthLimit = 0;
  heightLimit = 0;
  direction: Direction;
  directionKey: DirectionKey;
  offsetX = 0;
  justifyContent: JustifyContent;
  alignItems: AlignItems;

  constructor(widthLimit: number, direction: Direction, justifyContent: JustifyContent, alignItems: AlignItems) {
    this.direction = direction;
    this.directionKey = DIRECTION_KEY[this.direction];
    this.justifyContent = justifyContent;
    this.alignItems = alignItems;

    // this.widthLimit = widthLimit;
    this[this.directionKey.widthLimit] = widthLimit;
  }

  add(element: BaseElement) {
    // element.x = this.width;
    // this.width += element.layoutWidth;
    element[this.directionKey.x] = this[this.directionKey.width];
    this[this.directionKey.width] += element[this.directionKey.layoutWidth];

    this.children.push(element);
    this.updateHeight(element);
  }

  canAdd(element: BaseElement): boolean {
    // if (this.width + element.layoutWidth > this.widthLimit) {
    if (this[this.directionKey.width] + element[this.directionKey.layoutWidth] > this[this.directionKey.widthLimit]) {
      return false;
    }
    return true;
  }

  updateHeight(element: BaseElement) {
    // if (element.layoutHeight > this.height) {
    //   this.height = element.layoutHeight;
    // }
    if (element[this.directionKey.layoutHeight] > this[this.directionKey.height]) {
      this[this.directionKey.height] = element[this.directionKey.layoutHeight];
    }
  }

  lineFinish() {
    this.updateXAlign();
  }

  // 主轴方向上对齐
  updateXAlign() {
    const offsetX = this[this.directionKey.widthLimit] - this[this.directionKey.width];
    if (this.justifyContent === 'center') {
      this.offsetX = offsetX / 2;
    } else if (this.justifyContent === 'start') {
      this.offsetX = 0;
    } else {
      this.offsetX = offsetX;
    }
  }

  getOffsetY(element: BaseElement): number {
    switch (this.alignItems) {
      case 'start':
        return 0;
      case 'center':
        return (this[this.directionKey.height] - element[this.directionKey.layoutHeight]) / 2;
      case 'end':
        return this[this.directionKey.height] - element[this.directionKey.layoutHeight];
      default:
        return 0;
    }
  }

  getContentSize() {
    const result = {
      width: 0,
      height: 0
    };

    for (let i = 0; i < this.children.length; i++) {
      const element = this.children[i];
      let size;
      if (element.type === 'container') {
        size = (element as any).getContentSize();
      } else {
        size = {
          width: element.layoutWidth,
          height: element.layoutHeight
        };
      }

      if (result[this.directionKey.height] < size[this.directionKey.height]) {
        result[this.directionKey.height] = size[this.directionKey.height];
      }
      result[this.directionKey.width] += size[this.directionKey.width];
    }

    return result;
  }

  // 获取平坦后的全部子图元，更新子图元xy位置信息
  getElements(
    parentPos: { parentX: number; parentY: number } = { parentX: 0, parentY: 0 },
    isHover = false,
    isSelect = false
  ) {
    const elements = [];
    // const parentPos = { parentX, parentY };
    for (let i = 0; i < this.children.length; i++) {
      const element = this.children[i];
      if (element.type === 'container' || element.type === 'group-element') {
        const childElements = (element as any).getElements(
          {
            [this.directionKey.parentX]: this.offsetX + this[this.directionKey.x] + parentPos.parentX,
            [this.directionKey.parentY]: this.getOffsetY(element) + this[this.directionKey.y] + parentPos.parentY
          },
          isHover,
          isSelect
        );
        elements.push(...childElements);
      } else {
        if (
          element.type === 'icon' &&
          (((element as any).cache?.visibleTime === 'mouseenter_cell' && !isHover) ||
            ((element as any).cache?.visibleTime === 'click_cell' && !isSelect))
        ) {
          continue;
        }

        element[this.directionKey.x] += this.offsetX + this[this.directionKey.x] + parentPos.parentX;
        element[this.directionKey.y] += this.getOffsetY(element) + this[this.directionKey.y] + parentPos.parentY;
        elements.push(element);
      }
    }

    return elements;
  }
}
