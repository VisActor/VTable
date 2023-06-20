import type { BaseTableAPI } from '../../ts-types/base-table';

export type ElementOptions = {
  id?: string;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  background?: {
    // fill?: boolean;
    // stroke?: boolean;
    stroke?: string | boolean;
    fill?: string | boolean;
    lineWidth?: number;
    cornerRadius?: number;
    expandX?: number;
    expandY?: number;
  };
};

// Element用作基础布局，图元继承Element
export class BaseElement {
  type: string;
  id?: string;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  marginBottom: number;
  layoutWidth: number;
  layoutHeight: number;
  dx = 0;
  dy = 0;
  background?: {
    // fill?: boolean;
    // stroke?: boolean;
    stroke?: string | boolean;
    fill?: string | boolean;
    lineWidth?: number;
    cornerRadius?: number;
    expandX?: number;
    expandY?: number;
  };

  constructor(options: ElementOptions) {
    this.id = options.id;
    this.marginLeft = options.marginLeft ?? 0;
    this.marginRight = options.marginRight ?? 0;
    this.marginTop = options.marginTop ?? 0;
    this.marginBottom = options.marginBottom ?? 0;
    this.background = options.background || undefined;
  }

  getSize(table: BaseTableAPI) {
    this.initLayoutSize();
  }

  initLayoutSize() {
    this.layoutWidth = this.width + this.marginLeft + this.marginRight;
    this.layoutHeight = this.height + this.marginTop + this.marginBottom;

    if (this.background) {
      this.layoutWidth += (this.background.expandX || 0) * 2;
      this.layoutHeight += (this.background.expandY || 0) * 2;
    }

    this.dx = this.marginLeft;
    this.dy = this.marginTop;
  }
}
