import type { CheckboxStyleOption, IStyleOption } from '../../ts-types';
import { Style } from './Style';

let defaultStyle: CheckboxStyle;

export class CheckboxStyle extends Style {
  // private _imageSizing?: 'keep-aspect-ratio';
  // private _imageAutoSizing?: boolean;
  // private _margin: number;
  static get DEFAULT(): CheckboxStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new CheckboxStyle());
  }
  constructor(style: CheckboxStyleOption = {}, headerStyle: IStyleOption = {}) {
    super(style, headerStyle);
  }
  // get margin(): number {
  //   return this._margin;
  // }
  // set margin(margin: number) {
  //   this._margin = margin;
  //   this.doChangeStyle();
  // }
  clone(): CheckboxStyle {
    return new CheckboxStyle(this);
  }
}
