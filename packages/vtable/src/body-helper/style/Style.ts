/* eslint-disable no-undef */
import type {
  ColorPropertyDefine,
  ColumnStyle,
  IStyleOption,
  TextOverflow,
  UnderlinePropertyDefine,
  LineThroughPropertyDefine,
  LineDashPropertyDefine,
  ColorsPropertyDefine,
  PaddingsPropertyDefine,
  CursorPropertyDefine,
  LineWidthsPropertyDefine,
  LineDashsPropertyDefine,
  MarkedPropertyDefine,
  FontSizePropertyDefine,
  FontFamilyPropertyDefine,
  FontWeightPropertyDefine,
  FontVariantPropertyDefine,
  FontStylePropertyDefine,
  TextAlignType,
  TextBaselineType
} from '../../ts-types';
let defaultStyle: Style;
import { EventTarget } from '../../event/EventTarget';
const STYLE_EVENT_TYPE = {
  CHANGE_STYLE: 'change_style' as const
};

export class Style extends EventTarget implements ColumnStyle {
  private _color?: ColorPropertyDefine;
  private _strokeColor?: ColorPropertyDefine;
  private _fontSize?: FontSizePropertyDefine;
  private _fontFamily?: FontFamilyPropertyDefine;
  private _fontWeight?: FontWeightPropertyDefine;
  private _fontVariant?: FontVariantPropertyDefine;
  private _fontStyle?: FontStylePropertyDefine;
  private _padding?: PaddingsPropertyDefine;
  private _defaultPadding: PaddingsPropertyDefine = [10, 16, 10, 16];
  private _textStick: boolean | 'vertical' | 'horizontal';
  private _textStickBaseOnAlign: boolean;
  private _textOverflow?: TextOverflow;
  private _textAlign?: TextAlignType;
  private _textBaseline?: TextBaselineType;
  private _bgColor?: ColorPropertyDefine;
  private _borderColor?: ColorsPropertyDefine;
  private _lineHeight?: number;
  private _underline?: UnderlinePropertyDefine;
  private _underlineColor?: ColorPropertyDefine;
  private _underlineDash?: LineDashPropertyDefine;
  private _underlineOffset?: number;
  private _lineThrough?: LineThroughPropertyDefine;
  private _lineThroughColor?: ColorPropertyDefine;
  private _lineThroughDash?: LineDashPropertyDefine;
  private _linkColor?: ColorPropertyDefine;
  private _cursor?: CursorPropertyDefine;
  private _borderLineWidth?: LineWidthsPropertyDefine;
  private _borderLineDash?: LineDashsPropertyDefine;
  private _marked?: MarkedPropertyDefine;
  static get EVENT_TYPE(): { CHANGE_STYLE: 'change_style' } {
    return STYLE_EVENT_TYPE;
  }
  static get DEFAULT(): Style {
    return defaultStyle ? defaultStyle : (defaultStyle = new Style());
  }
  constructor(style: IStyleOption = {}, bodyStyle: IStyleOption = {}) {
    super();
    this._textAlign = style?.textAlign ?? bodyStyle?.textAlign; //|| "left";
    this._textBaseline = style?.textBaseline ?? bodyStyle?.textBaseline; //|| "middle";
    this._color = style?.color ?? bodyStyle?.color;
    this._strokeColor = style?.strokeColor ?? bodyStyle?.strokeColor;
    // icon为文字前后可添加的图表
    this._fontSize = style.fontSize ?? bodyStyle?.fontSize;
    this._fontFamily = style.fontFamily ?? bodyStyle?.fontFamily;
    this._fontWeight = style.fontWeight ?? bodyStyle?.fontWeight;
    this._fontVariant = style.fontVariant ?? bodyStyle?.fontVariant;
    this._fontStyle = style.fontStyle ?? bodyStyle?.fontStyle;
    //修改不能设置为0的情况
    this._padding = style?.padding ?? bodyStyle?.padding ?? this._defaultPadding;
    this._borderColor = style?.borderColor ?? bodyStyle?.borderColor;
    this._textOverflow = style?.textOverflow ?? bodyStyle?.textOverflow; //|| "clip";
    this._textStick = style.textStick ?? bodyStyle?.textStick ?? false;
    this._textStickBaseOnAlign = style.textStickBaseOnAlign ?? bodyStyle?.textStickBaseOnAlign ?? false;
    this._bgColor = style?.bgColor ?? bodyStyle?.bgColor;
    this._lineHeight = style?.lineHeight ?? bodyStyle?.lineHeight;
    this._underline = style?.underline ?? bodyStyle?.underline;
    this._underlineColor = style?.underlineColor ?? bodyStyle?.underlineColor;
    this._underlineDash = style?.underlineDash ?? bodyStyle?.underlineDash;
    this._underlineOffset = style?.underlineOffset ?? bodyStyle?.underlineOffset;
    this._lineThrough = style?.lineThrough ?? bodyStyle?.lineThrough;
    this._lineThroughColor = style?.lineThroughColor ?? bodyStyle?.lineThroughColor;
    this._lineThroughDash = style?.lineThroughDash ?? bodyStyle?.lineThroughDash;
    this._linkColor = style?.linkColor ?? bodyStyle?.linkColor;
    this._cursor = style.cursor ?? bodyStyle?.cursor;
    this._borderLineWidth = style.borderLineWidth ?? bodyStyle?.borderLineWidth;
    this._borderLineDash = style.borderLineDash ?? bodyStyle?.borderLineDash;
    this._marked = style.marked ?? bodyStyle?.marked;
  }
  get color(): ColorPropertyDefine | undefined {
    return this._color;
  }
  set color(color: ColorPropertyDefine | undefined) {
    this._color = color;
    // this.doChangeStyle();
  }
  get strokeColor(): ColorPropertyDefine | undefined {
    return this._strokeColor;
  }
  set strokeColor(strokeColor: ColorPropertyDefine | undefined) {
    this._strokeColor = strokeColor;
    // this.doChangeStyle();
  }
  get fontSize(): FontSizePropertyDefine | undefined {
    return this._fontSize;
  }
  set fontSize(fontSize: FontSizePropertyDefine | undefined) {
    this._fontSize = fontSize;
    // this.doChangeStyle();
  }
  get fontFamily(): FontFamilyPropertyDefine | undefined {
    return this._fontFamily;
  }
  set fontFamily(fontFamily: FontFamilyPropertyDefine | undefined) {
    this._fontFamily = fontFamily;
    // this.doChangeStyle();
  }
  get fontWeight(): FontWeightPropertyDefine | undefined {
    return this._fontWeight;
  }
  set fontWeight(fontWeight: FontWeightPropertyDefine | undefined) {
    this._fontWeight = fontWeight;
    // this.doChangeStyle();
  }
  get fontVariant(): FontVariantPropertyDefine | undefined {
    return this._fontVariant;
  }
  set fontVariant(fontVariant: FontVariantPropertyDefine | undefined) {
    this._fontVariant = fontVariant;
    // this.doChangeStyle();
  }
  get fontStyle(): FontStylePropertyDefine | undefined {
    return this._fontStyle;
  }
  set fontStyle(fontStyle: FontStylePropertyDefine | undefined) {
    this._fontStyle = fontStyle;
    // this.doChangeStyle();
  }
  get padding(): PaddingsPropertyDefine | undefined {
    return this._padding;
  }
  set padding(padding: PaddingsPropertyDefine | undefined) {
    this._padding = padding;
    // this.doChangeStyle();
  }
  get textOverflow(): TextOverflow | undefined {
    return this._textOverflow;
  }
  set textOverflow(textOverflow: TextOverflow | undefined) {
    this._textOverflow = textOverflow;
    // this.doChangeStyle();
  }
  get bgColor(): ColorPropertyDefine | undefined {
    return this._bgColor;
  }
  set bgColor(bgColor: ColorPropertyDefine | undefined) {
    this._bgColor = bgColor;
    // this.doChangeStyle();
  }
  get borderColor(): ColorsPropertyDefine | undefined {
    return this._borderColor;
  }
  set borderColor(borderColor: ColorsPropertyDefine | undefined) {
    this._borderColor = borderColor;
    // this.doChangeStyle();
  }
  get textStick(): boolean | 'vertical' | 'horizontal' {
    return this._textStick;
  }
  set textStick(textStick: boolean | 'vertical' | 'horizontal') {
    this._textStick = textStick;
    // this.doChangeStyle();
  }
  get textStickBaseOnAlign(): boolean {
    return this._textStickBaseOnAlign;
  }
  set textStickBaseOnAlign(textStickBaseOnAlign: boolean) {
    this._textStickBaseOnAlign = textStickBaseOnAlign;
    // this.doChangeStyle();
  }
  get textAlign(): TextAlignType | undefined {
    return this._textAlign;
  }
  set textAlign(textAlign: TextAlignType | undefined) {
    this._textAlign = textAlign;
    // this.doChangeStyle();
  }
  get textBaseline(): TextBaselineType | undefined {
    return this._textBaseline;
  }
  set textBaseline(textBaseline: TextBaselineType | undefined) {
    this._textBaseline = textBaseline;
    // this.doChangeStyle();
  }
  get lineHeight(): number | undefined {
    return this._lineHeight;
  }
  set lineHeight(lineHeight: number | undefined) {
    this._lineHeight = lineHeight;
    // this.doChangeStyle();
  }
  get underline(): UnderlinePropertyDefine | undefined {
    return this._underline;
  }
  set underline(underline: UnderlinePropertyDefine | undefined) {
    this._underline = underline;
    // this.doChangeStyle();
  }
  get underlineColor(): ColorPropertyDefine | undefined {
    return this._underlineColor;
  }
  set underlineColor(underlineColor: ColorPropertyDefine | undefined) {
    this._underlineColor = underlineColor;
    // this.doChangeStyle();
  }
  get underlineDash(): LineDashPropertyDefine | undefined {
    return this._underlineDash;
  }
  set underlineDash(underlineDash: LineDashPropertyDefine | undefined) {
    this._underlineDash = underlineDash;
    // this.doChangeStyle();
  }
  get underlineOffset(): number | undefined {
    return this._underlineOffset;
  }
  set underlineOffset(underlineOffset: number | undefined) {
    this._underlineOffset = underlineOffset;
  }
  get lineThrough(): LineThroughPropertyDefine | undefined {
    return this._lineThrough;
  }
  set lineThrough(lineThrough: LineThroughPropertyDefine | undefined) {
    this._lineThrough = lineThrough;
    // this.doChangeStyle();
  }
  get lineThroughColor(): ColorPropertyDefine | undefined {
    return this._lineThroughColor;
  }
  set lineThroughColor(lineThroughColor: ColorPropertyDefine | undefined) {
    this._lineThroughColor = lineThroughColor;
    // this.doChangeStyle();
  }
  get lineThroughDash(): LineDashPropertyDefine | undefined {
    return this._lineThroughDash;
  }
  set lineThroughDash(lineThroughDash: LineDashPropertyDefine | undefined) {
    this._lineThroughDash = lineThroughDash;
    // this.doChangeStyle();
  }
  get linkColor(): ColorPropertyDefine | undefined {
    return this._linkColor;
  }
  set linkColor(linkColor: ColorPropertyDefine | undefined) {
    this._linkColor = linkColor;
    // this.doChangeStyle();
  }
  get cursor(): CursorPropertyDefine | undefined {
    return this._cursor;
  }
  set cursor(cursor: CursorPropertyDefine | undefined) {
    this._cursor = cursor;
    // this.doChangeStyle();
  }
  get borderLineWidth(): LineWidthsPropertyDefine | undefined {
    return this._borderLineWidth;
  }
  set borderLineWidth(borderLineWidth: LineWidthsPropertyDefine | undefined) {
    this._borderLineWidth = borderLineWidth;
    // this.doChangeStyle();
  }
  get borderLineDash(): LineDashsPropertyDefine | undefined {
    return this._borderLineDash;
  }
  set borderLineDash(borderLineDash: LineDashsPropertyDefine | undefined) {
    this._borderLineDash = borderLineDash;
    // this.doChangeStyle();
  }
  get marked(): MarkedPropertyDefine | undefined {
    return this._marked;
  }
  set marked(marked: MarkedPropertyDefine | undefined) {
    this._marked = marked;
    // this.doChangeStyle();
  }
  // doChangeStyle(): void {
  //   this.fireListeners(STYLE_EVENT_TYPE.CHANGE_STYLE, null);
  // }
  clone(): Style {
    return new Style(this, null);
  }
}
