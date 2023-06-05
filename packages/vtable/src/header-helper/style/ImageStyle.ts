import type { IImageStyleOption, IStyleOption } from '../../ts-types';
import { Style } from './Style';

let defaultStyle: ImageStyle;

export class ImageStyle extends Style {
  // private _imageSizing?: 'keep-aspect-ratio';
  // private _imageAutoSizing?: boolean;
  // private _margin: number;
  static get DEFAULT(): ImageStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new ImageStyle());
  }
  constructor(style: IImageStyleOption = {}, headerStyle: IStyleOption = {}) {
    super(style, headerStyle);
    this.textAlign = (style.textAlign ?? headerStyle?.textAlign) || 'center';
    // this._imageSizing = style.imageSizing;
    // this._imageAutoSizing = style.imageAutoSizing;
    // this._margin = style.margin || 4;
  }
  // get margin(): number {
  //   return this._margin;
  // }
  // set margin(margin: number) {
  //   this._margin = margin;
  //   this.doChangeStyle();
  // }
  clone(): ImageStyle {
    return new ImageStyle(this);
  }
}
