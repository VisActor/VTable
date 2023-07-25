import type { ITextStyleOption, LineClamp } from '../../ts-types';
import { Style } from './Style';

let defaultStyle: TextHeaderStyle;
export class TextHeaderStyle extends Style {
  private _autoWrapText?: boolean;
  private _lineClamp?: LineClamp;
  static get DEFAULT(): TextHeaderStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new TextHeaderStyle());
  }
  constructor(style: ITextStyleOption = {}, headerStyle: ITextStyleOption = null) {
    super(style, headerStyle);
    this._autoWrapText = style?.autoWrapText ?? headerStyle?.autoWrapText;
    this._lineClamp = style?.lineClamp ?? headerStyle?.lineClamp;
  }
  clone(): TextHeaderStyle {
    return new TextHeaderStyle(this, null);
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
