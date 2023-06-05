import { Style } from './Style';
import { defaults } from '../../tools/helper';
import type { IStyleOption } from '../../ts-types';

let defaultStyle: NumberStyle;
export class NumberStyle extends Style {
  static get DEFAULT(): NumberStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new NumberStyle());
  }
  constructor(style: IStyleOption = {}, bodyStyle: IStyleOption = {}) {
    super(style, bodyStyle);
  }
  clone(): NumberStyle {
    return new NumberStyle(this, null);
  }
}
