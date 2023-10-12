import type { CheckboxStyleOption, IStyleOption, StylePropertyFunctionArg } from '../../ts-types';
import { Style } from './Style';
let defaultStyle: CheckboxStyle;

export class CheckboxStyle extends Style {
  // private _checked: boolean | ((args: StylePropertyFunctionArg) => boolean);
  // private _disable: boolean | ((args: StylePropertyFunctionArg) => boolean);

  static get DEFAULT(): CheckboxStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new CheckboxStyle());
  }
  constructor(style: CheckboxStyleOption = {}, bodyStyle: IStyleOption = {}) {
    super(style, bodyStyle);
    // this._checked = style.checked;
    // this._disable = style.disable;
  }
  // get checked(): boolean | ((args: StylePropertyFunctionArg) => boolean) {
  //   return this._checked;
  // }
  // set checked(value: boolean | ((args: StylePropertyFunctionArg) => boolean)) {
  //   this._checked = value;
  //   //this.doChangeStyle();
  // }
  // get disable(): boolean | ((args: StylePropertyFunctionArg) => boolean) {
  //   return this._disable;
  // }
  // set disable(value: boolean | ((args: StylePropertyFunctionArg) => boolean)) {
  //   this._disable = value;
  //   //this.doChangeStyle();
  // }
  clone(): CheckboxStyle {
    return new CheckboxStyle(this, null);
  }
}
