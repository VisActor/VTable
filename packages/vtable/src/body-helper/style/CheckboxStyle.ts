import type { CheckboxStyleOption, IStyleOption } from '../../ts-types';
import { Style } from './Style';

let defaultStyle: CheckboxStyle;

export class CheckboxStyle extends Style {
  private _size: number;
  private _spaceBetweenTextAndIcon: number;
  static get DEFAULT(): CheckboxStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new CheckboxStyle());
  }
  constructor(style: CheckboxStyleOption = {}, headerStyle: CheckboxStyleOption = {}) {
    super(style, headerStyle);
    this._size = (style.size ?? headerStyle?.size) || 14;
    this._spaceBetweenTextAndIcon = (style.spaceBetweenTextAndIcon ?? headerStyle?.spaceBetweenTextAndIcon) || 8;
  }
  get size(): number {
    return this._size;
  }
  set size(size: number) {
    this._size = size;
  }
  get spaceBetweenTextAndIcon(): number {
    return this._spaceBetweenTextAndIcon;
  }
  set spaceBetweenTextAndIcon(spaceBetweenTextAndIcon: number) {
    this._spaceBetweenTextAndIcon = spaceBetweenTextAndIcon;
  }
  clone(): CheckboxStyle {
    return new CheckboxStyle(this);
  }
}
