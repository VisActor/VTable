import type { CheckboxStyleOption, IStyleOption } from '../../ts-types';
import { Style } from './Style';
import type { CheckboxStyle as CheckboxStyleThemeOption } from '../../ts-types/column/style';

let defaultStyle: CheckboxStyle;

export class CheckboxStyle extends Style {
  private _size: number;
  private _spaceBetweenTextAndIcon: number;

  private _defaultFill?: string;
  private _defaultStroke?: string;
  private _disableFill?: string;
  private _checkedFill?: string;
  private _checkedStroke?: string;
  private _disableCheckedFill?: string;
  private _disableCheckedStroke?: string;

  private _checkIconImage?: string;
  private _indeterminateIconImage?: string;

  static get DEFAULT(): CheckboxStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new CheckboxStyle());
  }
  constructor(
    style: CheckboxStyleOption = {},
    headerStyle: CheckboxStyleOption = {},
    checkboxThemeStyle: CheckboxStyleThemeOption = {}
  ) {
    super(style, headerStyle);
    this._size = (style?.size ?? headerStyle?.size ?? checkboxThemeStyle?.size) || 14;
    this._spaceBetweenTextAndIcon =
      (style?.spaceBetweenTextAndIcon ??
        headerStyle?.spaceBetweenTextAndIcon ??
        checkboxThemeStyle?.spaceBetweenTextAndIcon) ||
      8;

    this._defaultFill = style?.checkboxStyle?.defaultFill ?? checkboxThemeStyle?.defaultFill;
    this._defaultStroke = style?.checkboxStyle?.defaultStroke ?? checkboxThemeStyle?.defaultStroke;
    this._disableFill = style?.checkboxStyle?.disableFill ?? checkboxThemeStyle?.disableFill;
    this._checkedFill = style?.checkboxStyle?.checkedFill ?? checkboxThemeStyle?.checkedFill;
    this._checkedStroke = style?.checkboxStyle?.checkedStroke ?? checkboxThemeStyle?.checkedStroke;
    this._disableCheckedFill = style?.checkboxStyle?.disableCheckedFill ?? checkboxThemeStyle?.disableCheckedFill;
    this._disableCheckedStroke = style?.checkboxStyle?.disableCheckedStroke ?? checkboxThemeStyle?.disableCheckedStroke;

    this._checkIconImage = style?.checkboxStyle?.checkIconImage ?? checkboxThemeStyle?.checkIconImage;
    this._indeterminateIconImage =
      style?.checkboxStyle?.indeterminateIconImage ?? checkboxThemeStyle?.indeterminateIconImage;
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
  get defaultFill(): string {
    return this._defaultFill;
  }
  set defaultFill(defaultFill: string) {
    this._defaultFill = defaultFill;
  }
  get defaultStroke(): string {
    return this._defaultStroke;
  }
  set defaultStroke(defaultStroke: string) {
    this._defaultStroke = defaultStroke;
  }
  get disableFill(): string {
    return this._disableFill;
  }
  set disableFill(disableFill: string) {
    this._disableFill = disableFill;
  }
  get checkedFill(): string {
    return this._checkedFill;
  }
  set checkedFill(checkedFill: string) {
    this._checkedFill = checkedFill;
  }
  get checkedStroke(): string {
    return this._checkedStroke;
  }
  set checkedStroke(checkedStroke: string) {
    this._checkedStroke = checkedStroke;
  }
  get disableCheckedFill(): string {
    return this._disableCheckedFill;
  }
  set disableCheckedFill(disableCheckedFill: string) {
    this._disableCheckedFill = disableCheckedFill;
  }
  get disableCheckedStroke(): string {
    return this._disableCheckedStroke;
  }
  set disableCheckedStroke(disableCheckedStroke: string) {
    this._disableCheckedStroke = disableCheckedStroke;
  }
  get checkIconImage(): string {
    return this._checkIconImage;
  }
  set checkIconImage(checkIconImage: string) {
    this._checkIconImage = checkIconImage;
  }
  get indeterminateIconImage(): string {
    return this._indeterminateIconImage;
  }
  set indeterminateIconImage(indeterminateIconImage: string) {
    this._indeterminateIconImage = indeterminateIconImage;
  }
  getStyle(style: IStyleOption): CheckboxStyle {
    return new CheckboxStyle(style, this);
  }
  clone(): CheckboxStyle {
    return new CheckboxStyle(this);
  }
}
