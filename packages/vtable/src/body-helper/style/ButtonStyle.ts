import type { IStyleOption, ButtonStyleOption } from '../../ts-types';
import { Style } from '../style';
import type { ButtonStyle as ButtonStyleThemeOption } from '../../ts-types/column/style';

let defaultStyle: ButtonStyle;

export class ButtonStyle extends Style {
  private _buttonColor: string;
  private _buttonBorderColor: string;
  private _buttonLineWidth: number;
  private _buttonBorderRadius: number;
  private _buttonHoverColor: string;
  private _buttonHoverBorderColor: string;
  private _buttonTextHoverColor: string;
  private _buttonDisableColor: string;
  private _buttonDisableBorderColor: string;
  private _buttonTextDisableColor: string;
  private _buttonTextHoverBorderColor: string;
  private _buttonPadding: number;

  static get DEFAULT(): ButtonStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new ButtonStyle());
  }

  constructor(
    style: ButtonStyleOption = {},
    headerStyle: ButtonStyleOption = {},
    buttonThemeStyle: ButtonStyleThemeOption = {}
  ) {
    super(style, headerStyle);

    this._buttonColor = (style?.buttonStyle?.buttonColor ?? buttonThemeStyle?.buttonColor) || '#165DFF';
    this._buttonBorderColor =
      (style?.buttonStyle?.buttonBorderColor ?? buttonThemeStyle?.buttonBorderColor) || '#165DFF';
    this._buttonLineWidth = (style?.buttonStyle?.buttonLineWidth ?? buttonThemeStyle?.buttonLineWidth) || 1;
    this._buttonBorderRadius = (style?.buttonStyle?.buttonBorderRadius ?? buttonThemeStyle?.buttonBorderRadius) || 2;
    this._buttonHoverColor = (style?.buttonStyle?.buttonHoverColor ?? buttonThemeStyle?.buttonHoverColor) || '#4080FF';
    this._buttonHoverBorderColor =
      (style?.buttonStyle?.buttonHoverBorderColor ?? buttonThemeStyle?.buttonHoverBorderColor) || '#4080FF';
    this._buttonTextHoverColor = style?.buttonStyle?.buttonTextHoverColor ?? buttonThemeStyle?.buttonTextHoverColor;
    this._buttonDisableColor =
      (style?.buttonStyle?.buttonDisableColor ?? buttonThemeStyle?.buttonDisableColor) || '#94bfff';
    this._buttonDisableBorderColor =
      (style?.buttonStyle?.buttonDisableBorderColor ?? buttonThemeStyle?.buttonDisableBorderColor) || '#94bfff';
    this._buttonTextDisableColor =
      style?.buttonStyle?.buttonTextDisableColor ?? buttonThemeStyle?.buttonTextDisableColor;
    this._buttonPadding = (style?.buttonStyle?.buttonPadding ?? buttonThemeStyle?.buttonPadding) || 10;
  }

  get buttonColor(): string {
    return this._buttonColor;
  }
  set buttonColor(buttonColor: string) {
    this._buttonColor = buttonColor;
  }

  get buttonBorderColor(): string {
    return this._buttonBorderColor;
  }
  set buttonBorderColor(buttonBorderColor: string) {
    this._buttonBorderColor = buttonBorderColor;
  }

  get buttonLineWidth(): number {
    return this._buttonLineWidth;
  }
  set buttonLineWidth(buttonLineWidth: number) {
    this._buttonLineWidth = buttonLineWidth;
  }

  get buttonBorderRadius(): number {
    return this._buttonBorderRadius;
  }
  set buttonBorderRadius(buttonBorderRadius: number) {
    this._buttonBorderRadius = buttonBorderRadius;
  }

  get buttonHoverColor(): string {
    return this._buttonHoverColor;
  }
  set buttonHoverColor(buttonHoverColor: string) {
    this._buttonHoverColor = buttonHoverColor;
  }

  get buttonHoverBorderColor(): string {
    return this._buttonHoverBorderColor;
  }
  set buttonHoverBorderColor(buttonHoverBorderColor: string) {
    this._buttonHoverBorderColor = buttonHoverBorderColor;
  }

  get buttonTextHoverColor(): string {
    return this._buttonTextHoverColor;
  }
  set buttonTextHoverColor(buttonTextHoverColor: string) {
    this._buttonTextHoverColor = buttonTextHoverColor;
  }

  get buttonDisableColor(): string {
    return this._buttonDisableColor;
  }
  set buttonDisableColor(buttonDisableColor: string) {
    this._buttonDisableColor = buttonDisableColor;
  }

  get buttonDisableBorderColor(): string {
    return this._buttonDisableBorderColor;
  }
  set buttonDisableBorderColor(buttonDisableBorderColor: string) {
    this._buttonDisableBorderColor = buttonDisableBorderColor;
  }

  get buttonTextDisableColor(): string {
    return this._buttonTextDisableColor;
  }
  set buttonTextDisableColor(buttonTextDisableColor: string) {
    this._buttonTextDisableColor = buttonTextDisableColor;
  }

  get buttonTextHoverBorderColor(): string {
    return this._buttonTextHoverBorderColor;
  }
  set buttonTextHoverBorderColor(buttonTextHoverBorderColor: string) {
    this._buttonTextHoverBorderColor = buttonTextHoverBorderColor;
  }

  get buttonPadding(): number {
    return this._buttonPadding;
  }
  set buttonPadding(buttonPadding: number) {
    this._buttonPadding = buttonPadding;
  }

  getStyle(style: IStyleOption): ButtonStyle {
    return new ButtonStyle(style, this);
  }

  clone(): ButtonStyle {
    return new ButtonStyle(this);
  }
}
