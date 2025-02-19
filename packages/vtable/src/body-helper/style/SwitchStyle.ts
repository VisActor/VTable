import type { IStyleOption, SwitchStyleOption } from '../../ts-types';
import { Style } from '../style';
import type { SwitchStyle as SwitchStyleThemeOption } from '../../ts-types/column/style';

let defaultStyle: SwitchStyle;

export class SwitchStyle extends Style {
  private _spaceBetweenTextAndCircle: number;
  private _circleRadius: number;
  private _boxWidth: number;
  private _boxHeight: number;
  private _checkedFill: string;
  private _uncheckedFill: string;
  private _disableCheckedFill: string;
  private _disableUncheckedFill: string;
  private _circleFill: string;

  static get DEFAULT(): SwitchStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new SwitchStyle());
  }
  constructor(
    style: SwitchStyleOption = {},
    headerStyle: SwitchStyleOption = {},
    switchThemeStyle: SwitchStyleThemeOption = {}
  ) {
    super(style, headerStyle);

    this._spaceBetweenTextAndCircle =
      (style?.spaceBetweenTextAndCircle ??
        headerStyle?.spaceBetweenTextAndCircle ??
        switchThemeStyle?.spaceBetweenTextAndCircle) ||
      6;
    this._circleRadius = (style?.switchStyle?.circleRadius ?? switchThemeStyle?.circleRadius) || 8;
    this._boxWidth = (style?.switchStyle?.boxWidth ?? switchThemeStyle?.boxWidth) || 40;
    this._boxHeight = (style?.switchStyle?.boxHeight ?? switchThemeStyle?.boxHeight) || 24;
    this._checkedFill = (style?.switchStyle?.checkedFill ?? switchThemeStyle?.checkedFill) || '#165DFF';
    this._uncheckedFill = (style?.switchStyle?.uncheckedFill ?? switchThemeStyle?.uncheckedFill) || '#c9cdd4';
    this._disableCheckedFill =
      (style?.switchStyle?.disableCheckedFill ?? switchThemeStyle?.disableCheckedFill) || '#94bfff';
    this._disableUncheckedFill =
      (style?.switchStyle?.disableUncheckedFill ?? switchThemeStyle?.disableUncheckedFill) || '#f2f3f5';
    this._circleFill = (style?.switchStyle?.circleFill ?? switchThemeStyle?.circleFill) || '#FFF';
  }

  get spaceBetweenTextAndCircle(): number {
    return this._spaceBetweenTextAndCircle;
  }
  set spaceBetweenTextAndCircle(spaceBetweenTextAndCircle: number) {
    this._spaceBetweenTextAndCircle = spaceBetweenTextAndCircle;
  }
  get circleRadius(): number {
    return this._circleRadius;
  }
  set circleRadius(circleRadius: number) {
    this._circleRadius = circleRadius;
  }
  get boxWidth(): number {
    return this._boxWidth;
  }
  set boxWidth(boxWidth: number) {
    this._boxWidth = boxWidth;
  }
  get boxHeight(): number {
    return this._boxHeight;
  }
  set boxHeight(boxHeight: number) {
    this._boxHeight = boxHeight;
  }
  get checkedFill(): string {
    return this._checkedFill;
  }
  set checkedFill(checkedFill: string) {
    this._checkedFill = checkedFill;
  }
  get uncheckedFill(): string {
    return this._uncheckedFill;
  }
  set uncheckedFill(uncheckedFill: string) {
    this._uncheckedFill = uncheckedFill;
  }
  get disableCheckedFill(): string {
    return this._disableCheckedFill;
  }
  set disableCheckedFill(disableCheckedFill: string) {
    this._disableCheckedFill = disableCheckedFill;
  }
  get disableUncheckedFill(): string {
    return this._disableUncheckedFill;
  }
  set disableUncheckedFill(disableUncheckedFill: string) {
    this._disableUncheckedFill = disableUncheckedFill;
  }
  get circleFill(): string {
    return this._circleFill;
  }
  set circleFill(circleFill: string) {
    this._circleFill = circleFill;
  }
  getStyle(style: IStyleOption): SwitchStyle {
    return new SwitchStyle(style, this);
  }
  clone(): SwitchStyle {
    return new SwitchStyle(this);
  }
}
