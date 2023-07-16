import type { LineClamp, ITextStyleOption, IStyleOption } from '../../ts-types';
import { Style } from './Style';
import { defaults } from '../../tools/helper';

let defaultStyle: TextStyle;
export class TextStyle extends Style {
  private _autoWrapText?: boolean;
  private _lineClamp?: LineClamp;
  static get DEFAULT(): TextStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new TextStyle());
  }
  constructor(style: ITextStyleOption = {}, bodyStyle: ITextStyleOption = {}) {
    // super(defaults(style, { textBaseline: "top" }), bodyStyle);
    super(style, bodyStyle);
    this._autoWrapText = style?.autoWrapText ?? bodyStyle?.autoWrapText;
    this._lineClamp = style?.lineClamp ?? bodyStyle?.lineClamp;
  }
  clone(): TextStyle {
    return new TextStyle(this, null);
  }

  get lineClamp(): LineClamp | undefined {
    return this._lineClamp;
  }
  set lineClamp(lineClamp: LineClamp | undefined) {
    this._lineClamp = lineClamp;
    //this.doChangeStyle();
  }
  get autoWrapText(): boolean | undefined {
    return this._autoWrapText;
  }
  set autoWrapText(autoWrapText: boolean | undefined) {
    this._autoWrapText = autoWrapText;
    //this.doChangeStyle();
  }
}
