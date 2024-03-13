import type {
  ColorPropertyDefine,
  IStyleOption,
  ProgressBarStyleOption,
  StylePropertyFunctionArg
} from '../../ts-types';
import { Style } from './Style';
let defaultStyle: ProgressBarStyle;
const DEFAULT_BAR_COLOR = (args: StylePropertyFunctionArg): string => {
  const num = args.value;
  if (Number(num) > 80) {
    return '#20a8d8';
  }
  if (Number(num) > 50) {
    return '#4dbd74';
  }
  if (Number(num) > 20) {
    return '#ffc107';
  }
  return '#f86c6b';
};
export class ProgressBarStyle extends Style {
  private _showBar: boolean | ((args: StylePropertyFunctionArg) => boolean);
  private _barColor: ColorPropertyDefine;
  private _barBgColor: ColorPropertyDefine;
  private _barPositiveColor: ColorPropertyDefine;
  private _barNegativeColor: ColorPropertyDefine;
  private _barAxisColor: ColorPropertyDefine;
  private _barHeight: number | string;
  private _barBottom: number | string;
  private _barPadding: (number | string)[];
  private _showBarMark: boolean;
  private _barMarkPositiveColor: ColorPropertyDefine;
  private _barMarkNegativeColor: ColorPropertyDefine;
  private _barMarkWidth: number;
  private _barMarkPosition: 'right' | 'bottom';
  private _barRightToLeft: boolean;

  static get DEFAULT(): ProgressBarStyle {
    return defaultStyle ? defaultStyle : (defaultStyle = new ProgressBarStyle());
  }
  constructor(style: ProgressBarStyleOption = {}, bodyStyle: IStyleOption = {}) {
    super(style, bodyStyle);
    this._showBar = style.showBar ?? true;
    this._barColor = style.barColor ?? DEFAULT_BAR_COLOR;
    this._barPositiveColor = style.barPositiveColor ?? '#4dbd74';
    this._barNegativeColor = style.barNegativeColor ?? '#f86c6b';
    this._barAxisColor = style.barAxisColor ?? 'black';
    this._barBgColor = style.barBgColor;
    this._barHeight = style.barHeight ?? 3;
    this._barHeight = style.barHeight ?? 3;
    this._barBottom = style.barBottom ?? 0;
    this._barPadding = style.barPadding ?? [0, 0, 0, 0];
    this._showBarMark = style.showBarMark ?? false;
    this._barMarkPositiveColor = style.barMarkPositiveColor ?? '#4dbd74';
    this._barMarkNegativeColor = style.barMarkNegativeColor ?? '#f86c6b';
    this._barMarkWidth = style.barMarkWidth ?? 2;
    this._barMarkPosition = style.barMarkPosition ?? 'right';
    this._barRightToLeft = style.barRightToLeft ?? false;
  }
  get showBar(): boolean | ((args: StylePropertyFunctionArg) => boolean) {
    return this._showBar;
  }
  set showBar(value: boolean | ((args: StylePropertyFunctionArg) => boolean)) {
    this._showBar = value;
    //this.doChangeStyle();
  }
  get barColor(): ColorPropertyDefine {
    return this._barColor;
  }
  set barColor(barColor: ColorPropertyDefine) {
    this._barColor = barColor;
    //this.doChangeStyle();
  }
  get barBgColor(): ColorPropertyDefine {
    return this._barBgColor;
  }
  set barBgColor(barBgColor: ColorPropertyDefine) {
    this._barBgColor = barBgColor;
    //this.doChangeStyle();
  }
  get barHeight(): number | string {
    return this._barHeight;
  }
  set barHeight(barHeight: number | string) {
    this._barHeight = barHeight;
    //this.doChangeStyle();
  }
  get barBottom(): number | string {
    return this._barBottom;
  }
  set barBottom(barBottom: number | string) {
    this._barBottom = barBottom;
    //this.doChangeStyle();
  }
  get barPositiveColor(): ColorPropertyDefine {
    return this._barPositiveColor;
  }
  set barPositiveColor(barPositiveColor: ColorPropertyDefine) {
    this._barPositiveColor = barPositiveColor;
    //this.doChangeStyle();
  }
  get barNegativeColor(): ColorPropertyDefine {
    return this._barNegativeColor;
  }
  set barNegativeColor(barNegativeColor: ColorPropertyDefine) {
    this._barNegativeColor = barNegativeColor;
    //this.doChangeStyle();
  }
  get barAxisColor(): ColorPropertyDefine {
    return this._barAxisColor;
  }
  set barAxisColor(barAxisColor: ColorPropertyDefine) {
    this._barAxisColor = barAxisColor;
    //this.doChangeStyle();
  }
  get barPadding(): (number | string)[] {
    return this._barPadding;
  }
  set barPadding(barPadding: (number | string)[]) {
    this._barPadding = barPadding;
    //this.doChangeStyle();
  }
  get showBarMark(): boolean {
    return this._showBarMark;
  }
  set showBarMark(value: boolean) {
    this._showBarMark = value;
    //this.doChangeStyle();
  }
  get barMarkPositiveColor(): ColorPropertyDefine {
    return this._barMarkPositiveColor;
  }
  set barMarkPositiveColor(value: ColorPropertyDefine) {
    this._barMarkPositiveColor = value;
    //this.doChangeStyle();
  }
  get barMarkNegativeColor(): ColorPropertyDefine {
    return this._barMarkNegativeColor;
  }
  set barMarkNegativeColor(value: ColorPropertyDefine) {
    this._barMarkNegativeColor = value;
    //this.doChangeStyle();
  }
  get barMarkWidth(): number {
    return this._barMarkWidth;
  }
  set barMarkWidth(value: number) {
    this._barMarkWidth = value;
    //this.doChangeStyle();
  }
  get barMarkPosition(): 'right' | 'bottom' {
    return this._barMarkPosition;
  }
  set barMarkPosition(value: 'right' | 'bottom') {
    this._barMarkPosition = value;
    //this.doChangeStyle();
  }
  get barRightToLeft(): boolean {
    return this._barRightToLeft;
  }
  set barRightToLeft(value: boolean) {
    this._barRightToLeft = value;
    //this.doChangeStyle();
  }
  clone(): ProgressBarStyle {
    return new ProgressBarStyle(this, null);
  }
}
