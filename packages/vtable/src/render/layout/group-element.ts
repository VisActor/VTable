import type { AlignItems, DirectionKey } from './direction';
import { DIRECTION_KEY } from './direction';
import type { ElementOptions } from './element';
import { BaseElement } from './element';
import type { Icon } from './icon';

type GroupElementOptions = {
  direction?: 'row' | 'column';
  alignItems?: AlignItems;
} & ElementOptions;

export class GroupElement extends BaseElement {
  type: 'group-element' = 'group-element';
  direction: 'row' | 'column';
  alignItems?: AlignItems;
  width = 0;
  height = 0;
  children: BaseElement[] = [];
  directionKey: DirectionKey;

  constructor(options: GroupElementOptions) {
    super(options);
    this.direction = options.direction || 'row';
    this.alignItems = options.alignItems || 'start';

    this.directionKey = DIRECTION_KEY[this.direction];
  }

  add(element: BaseElement) {
    element.x = this.width;
    this.width += element.layoutWidth;
    this.children.push(element);
    this.updateHeight(element);
    this.initLayoutSize();
  }

  updateHeight(element: BaseElement) {
    if (element.layoutHeight > this.height) {
      this.height = element.layoutHeight;
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

  // 获取平坦后的全部子图元，更新子图元xy位置信息
  getElements(
    parentPos: { parentX: number; parentY: number } = { parentX: 0, parentY: 0 },
    isHover = false,
    isSelect = false
  ) {
    const elements = [];
    for (let i = 0; i < this.children.length; i++) {
      const element = this.children[i];
      // element.getSize(table);
      // element.x = this.width;
      // this.width += element.layoutWidth;
      // this.updateHeight(element);

      if (
        element.type === 'icon' &&
        (((element as Icon).cache?.visibleTime === 'mouseenter_cell' && !isHover) ||
          ((element as Icon).cache?.visibleTime === 'click_cell' && !isSelect))
      ) {
        continue;
      }

      element[this.directionKey.x] += this[this.directionKey.dx] + this[this.directionKey.x] + parentPos.parentX;
      element[this.directionKey.y] +=
        this.getOffsetY(element) + this[this.directionKey.dy] + this[this.directionKey.y] + parentPos.parentY;
      elements.push(element);
    }

    return elements;
  }
}
