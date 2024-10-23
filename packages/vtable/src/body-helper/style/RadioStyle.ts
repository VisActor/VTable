import type { RadioStyleOption, IStyleOption } from '../../ts-types';
import { Style } from './Style';
import type { RadioStyle as RadioStyleThemeOption } from '../../ts-types/column/style';

let defaultStyle: RadioStyle;

export class RadioStyle extends Style {
  private _size: number;
  private _spaceBetweenTextAndIcon: number;
  private _spaceBetweenRadio: number;

  private _outerRadius?: number;
  private _innerRadius?: number;

  private _defaultFill?: string;
  private _defaultStroke?: string;
  private _disableFill?: string;
  private _checkedFill?: string;
  private _checkedStroke?: string;
  private _disableCheckedFill?: string;
  private _disableCheckedStroke?: string;

  static get DEFAULT(): RadioStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new RadioStyle());
  }
  constructor(
    style: RadioStyleOption = {},
    headerStyle: RadioStyleOption = {},
    radioThemeStyle: RadioStyleThemeOption = {}
  ) {
    super(style, headerStyle);
    this._size = (style?.size ?? headerStyle?.size ?? radioThemeStyle?.size) || 14;
    this._spaceBetweenTextAndIcon =
      (style?.spaceBetweenTextAndIcon ??
        headerStyle?.spaceBetweenTextAndIcon ??
        radioThemeStyle?.spaceBetweenTextAndIcon) ||
      8;
    this._spaceBetweenRadio =
      (style?.spaceBetweenRadio ?? headerStyle?.spaceBetweenRadio ?? radioThemeStyle?.spaceBetweenRadio) || 2;

    this._innerRadius = style?.radioStyle?.innerRadius ?? radioThemeStyle?.innerRadius;
    this._outerRadius = style?.radioStyle?.outerRadius ?? radioThemeStyle?.outerRadius;

    this._defaultFill = style?.radioStyle?.defaultFill ?? radioThemeStyle?.defaultFill;
    this._defaultStroke = style?.radioStyle?.defaultStroke ?? radioThemeStyle?.defaultStroke;
    this._disableFill = style?.radioStyle?.disableFill ?? radioThemeStyle?.disableFill;
    this._checkedFill = style?.radioStyle?.checkedFill ?? radioThemeStyle?.checkedFill;
    this._checkedStroke = style?.radioStyle?.checkedStroke ?? radioThemeStyle?.checkedStroke;
    this._disableCheckedFill = style?.radioStyle?.disableCheckedFill ?? radioThemeStyle?.disableCheckedFill;
    this._disableCheckedStroke = style?.radioStyle?.disableCheckedStroke ?? radioThemeStyle?.disableCheckedStroke;
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
  get spaceBetweenRadio(): number {
    return this._spaceBetweenRadio;
  }
  set spaceBetweenRadio(spaceBetweenRadio: number) {
    this._spaceBetweenRadio = spaceBetweenRadio;
  }
  get innerRadius(): number {
    return this._innerRadius;
  }
  set innerRadius(innerRadius: number) {
    this._innerRadius = innerRadius;
  }
  get outerRadius(): number {
    return this._outerRadius;
  }
  set outerRadius(outerRadius: number) {
    this._outerRadius = outerRadius;
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
  getStyle(style: IStyleOption): RadioStyle {
    return new RadioStyle(style, this);
  }
  clone(): RadioStyle {
    return new RadioStyle(this);
  }
}
