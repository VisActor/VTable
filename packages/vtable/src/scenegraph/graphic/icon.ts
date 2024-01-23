import type { IImageGraphicAttribute } from '@src/vrender';
import { Image } from '@src/vrender';
import type { IIconBase } from '../../ts-types';

export interface IIconGraphicAttribute extends IImageGraphicAttribute {
  backgroundWidth?: number;
  backgroundHeight?: number;
  backgroundColor?: string;
  visibleTime?: string;
  funcType?: string;
  hoverImage?: string | HTMLImageElement | HTMLCanvasElement;
  originImage?: string | HTMLImageElement | HTMLCanvasElement;
  // margin?: [number, number, number, number];
  marginLeft?: number;
  marginRight?: number;
  shape?: 'circle' | 'square';
  interactive?: boolean;
}

export class Icon extends Image {
  declare attribute: IIconGraphicAttribute;
  role?: string;
  tooltip?: IIconBase['tooltip'];

  // eslint-disable-next-line no-useless-constructor
  constructor(params: IIconGraphicAttribute) {
    super(params);

    if (this.attribute.visibleTime === 'mouseenter_cell' || this.attribute.visibleTime === 'click_cell') {
      this.attribute.opacity = 0;
    }

    if (this.attribute.hoverImage) {
      this.attribute.originImage = this.attribute.image;
    }

    // if (this.attribute.margin) {
    //   this.attribute.boundsPadding = this.attribute.margin;
    //   this.attribute.dx = this.attribute.margin[3] ?? 0;
    // }
  }

  get backgroundWidth(): number {
    return this.attribute.backgroundWidth ?? this.attribute.width ?? 0;
  }

  get backgroundHeight(): number {
    return this.attribute.backgroundHeight ?? this.attribute.height ?? 0;
  }

  // protected tryUpdateAABBBounds() {
  //   super.tryUpdateAABBBounds();
  //   // 扩大范围
  //   const { width, height } = this.attribute;
  //   const { backgroundWidth = width, backgroundHeight = height } = this.attribute;
  //   const expandX = (backgroundWidth - width) / 2;
  //   const expandY = (backgroundHeight - height) / 2;
  //   this._AABBBounds.expand([expandY, expandX, expandY, expandX]);

  //   return this._AABBBounds;
  // }
}
