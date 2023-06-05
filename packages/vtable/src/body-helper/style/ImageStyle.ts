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
  constructor(style: IImageStyleOption = {}, bodyStyle: IStyleOption = {}) {
    super(style, bodyStyle);
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
    return new ImageStyle(this, null);
  }
}
