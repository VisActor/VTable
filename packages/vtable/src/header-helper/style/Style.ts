import type {
  ColorPropertyDefine,
  ColorsPropertyDefine,
  ColumnStyle,
  IStyleOption,
  TextOverflow,
  UnderlinePropertyDefine,
  LineThroughPropertyDefine,
  LineDashPropertyDefine,
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
const EVENT_TYPE = {
  CHANGE_STYLE: 'change_style'
};
export class Style extends EventTarget implements ColumnStyle {
  private _color?: ColorPropertyDefine;
  private _strokeColor?: ColorPropertyDefine;
  private _fontSize?: FontSizePropertyDefine;
  private _fontFamily?: FontFamilyPropertyDefine;
  private _fontWeight?: FontWeightPropertyDefine;
  private _fontVariant?: FontVariantPropertyDefine;
  private _fontStyle?: FontStylePropertyDefine;
  private _textOverflow: TextOverflow;
  private _padding: PaddingsPropertyDefine | undefined;
  private _defaultPadding: PaddingsPropertyDefine = [10, 16, 10, 16];
  private _textStick: boolean | 'vertical' | 'horizontal';
  private _textStickBaseOnAlign: boolean;
  private _marked: MarkedPropertyDefine;
  // eslint-disable-next-line no-undef
  private _textAlign: TextAlignType;
  // eslint-disable-next-line no-undef
  private _textBaseline: TextBaselineType;
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

  // private _tag?: TagPropertyDefine;
  // private _tagFont?: FontPropertyDefine;
  // private _tagColor?: ColorPropertyDefine;
  // private _tagBgColor?: ColorPropertyDefine;
  // private _tagMargin?: number | string | (number | string)[];

  private _cursor?: CursorPropertyDefine;
  private _borderLineWidth?: LineWidthsPropertyDefine;
  private _borderLineDash?: LineDashsPropertyDefine;
  static get EVENT_TYPE(): { CHANGE_STYLE: string } {
    return EVENT_TYPE;
  }
  static get DEFAULT(): Style {
    return defaultStyle ? defaultStyle : (defaultStyle = new Style());
  }
  constructor(style: IStyleOption = {}, headerStyle: IStyleOption = {}) {
    super();
    this._color = style.color ?? headerStyle?.color;
    this._strokeColor = style?.strokeColor ?? headerStyle?.strokeColor;
    // icon为文字前后可添加的图标
    // this._icon = style.icon;
    this._fontSize = style.fontSize ?? headerStyle?.fontSize;
    this._fontFamily = style.fontFamily ?? headerStyle?.fontFamily;
    this._fontWeight = style.fontWeight ?? headerStyle?.fontWeight;
    this._fontVariant = style.fontVariant ?? headerStyle?.fontVariant;
    this._fontStyle = style.fontStyle ?? headerStyle?.fontStyle;
    this._textOverflow = (style.textOverflow ?? headerStyle?.textOverflow) || 'ellipsis';
    this._textStick = style.textStick ?? headerStyle?.textStick ?? false;
    this._textStickBaseOnAlign = style.textStickBaseOnAlign ?? headerStyle?.textStickBaseOnAlign ?? false;
    this._marked = style.marked ?? headerStyle?.marked ?? false;
    this._textAlign = (style.textAlign ?? headerStyle?.textAlign) || 'left';
    this._textBaseline = (style.textBaseline ?? headerStyle?.textBaseline) || 'middle';
    this._bgColor = style.bgColor ?? headerStyle?.bgColor;
    this._padding = style.padding ?? headerStyle?.padding ?? this._defaultPadding;
    this._borderColor = style.borderColor ?? headerStyle?.borderColor;
    this._lineHeight = style.lineHeight ?? headerStyle?.lineHeight;
    this._underline = style.underline ?? headerStyle?.underline;
    this._underlineColor = style.underlineColor ?? headerStyle?.underlineColor;
    this._underlineDash = style.underlineDash ?? headerStyle?.underlineDash;
    this._underlineOffset = style.underlineOffset ?? headerStyle?.underlineOffset;
    this._lineThrough = style.lineThrough ?? headerStyle?.lineThrough;
    this._lineThroughColor = style.lineThroughColor ?? headerStyle?.lineThroughColor;
    this._lineThroughDash = style.lineThroughDash ?? headerStyle?.lineThroughDash;
    this._linkColor = style.linkColor ?? headerStyle?.linkColor;

    // this._tag = style.tag ?? headerStyle?.tag;
    // this._tagFont = style.tagFont ?? headerStyle?.tagFont;
    // this._tagColor = style.tagColor ?? headerStyle?.tagColor;
    // this._tagBgColor = style.tagBgColor ?? headerStyle?.tagBgColor;
    // this._tagMargin = style.tagMargin ?? headerStyle?.tagMargin;
    this._cursor = style.cursor ?? headerStyle?.cursor;
    this._borderLineWidth = style.borderLineWidth ?? headerStyle?.borderLineWidth;
    this._borderLineDash = style.borderLineDash ?? headerStyle?.borderLineDash;
  }
  get bgColor(): ColorPropertyDefine | undefined {
    return this._bgColor;
  }
  set bgColor(bgColor: ColorPropertyDefine | undefined) {
    this._bgColor = bgColor;
    //this.doChangeStyle();
  }
  get color(): ColorPropertyDefine | undefined {
    return this._color;
  }
  set color(color: ColorPropertyDefine | undefined) {
    this._color = color;
    //this.doChangeStyle();
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
    //this.doChangeStyle();
  }
  get fontFamily(): FontFamilyPropertyDefine | undefined {
    return this._fontFamily;
  }
  set fontFamily(fontFamily: FontFamilyPropertyDefine | undefined) {
    this._fontFamily = fontFamily;
    //this.doChangeStyle();
  }
  get fontWeight(): FontWeightPropertyDefine | undefined {
    return this._fontWeight;
  }
  set fontWeight(fontWeight: FontWeightPropertyDefine | undefined) {
    this._fontWeight = fontWeight;
    //this.doChangeStyle();
  }
  get fontVariant(): FontVariantPropertyDefine | undefined {
    return this._fontVariant;
  }
  set fontVariant(fontVariant: FontVariantPropertyDefine | undefined) {
    this._fontVariant = fontVariant;
    //this.doChangeStyle();
  }
  get fontStyle(): FontStylePropertyDefine | undefined {
    return this._fontStyle;
  }
  set fontStyle(fontStyle: FontStylePropertyDefine | undefined) {
    this._fontStyle = fontStyle;
    //this.doChangeStyle();
  }
  get textOverflow(): TextOverflow {
    return this._textOverflow;
  }
  set textOverflow(textOverflow: TextOverflow) {
    this._textOverflow = textOverflow;
    //this.doChangeStyle();
  }
  get padding(): PaddingsPropertyDefine | undefined {
    return this._padding ?? this._defaultPadding;
  }
  set padding(padding: PaddingsPropertyDefine | undefined) {
    this._padding = padding;
    //this.doChangeStyle();
  }
  get borderColor(): ColorsPropertyDefine | undefined {
    return this._borderColor;
  }
  set borderColor(borderColor: ColorsPropertyDefine | undefined) {
    this._borderColor = borderColor;
    //this.doChangeStyle();
  }
  get textStick(): boolean | 'vertical' | 'horizontal' {
    return this._textStick;
  }
  set textStick(textStick: boolean | 'vertical' | 'horizontal') {
    this._textStick = textStick;
    //this.doChangeStyle();
  }
  get textStickBaseOnAlign(): boolean {
    return this._textStickBaseOnAlign;
  }
  set textStickBaseOnAlign(textStickBaseOnAlign: boolean) {
    this._textStickBaseOnAlign = textStickBaseOnAlign;
    // this.doChangeStyle();
  }
  get marked(): MarkedPropertyDefine | undefined {
    return this._marked;
  }
  set marked(marked: MarkedPropertyDefine | undefined) {
    this._marked = marked;
    //this.doChangeStyle();
  }
  // eslint-disable-next-line no-undef
  get textAlign(): TextAlignType {
    return this._textAlign;
  }
  // eslint-disable-next-line no-undef
  set textAlign(textAlign: TextAlignType) {
    this._textAlign = textAlign;
    //this.doChangeStyle();
  }
  // eslint-disable-next-line no-undef
  get textBaseline(): TextBaselineType {
    return this._textBaseline;
  }
  // eslint-disable-next-line no-undef
  set textBaseline(textBaseline: TextBaselineType) {
    this._textBaseline = textBaseline;
    //this.doChangeStyle();
  }
  get lineHeight(): number | undefined {
    return this._lineHeight;
  }
  set lineHeight(lineHeight: number | undefined) {
    this._lineHeight = lineHeight;
    //this.doChangeStyle();
  }
  get underline(): UnderlinePropertyDefine | undefined {
    return this._underline;
  }
  set underline(underline: UnderlinePropertyDefine | undefined) {
    this._underline = underline;
    //this.doChangeStyle();
  }
  get underlineColor(): ColorPropertyDefine | undefined {
    return this._underlineColor;
  }
  set underlineColor(underlineColor: ColorPropertyDefine | undefined) {
    this._underlineColor = underlineColor;
    //this.doChangeStyle();
  }
  get underlineDash(): LineDashPropertyDefine | undefined {
    return this._underlineDash;
  }
  set underlineDash(underlineDash: LineDashPropertyDefine | undefined) {
    this._underlineDash = underlineDash;
    //this.doChangeStyle();
  }

  get underlineOffset(): number | undefined {
    return this._underlineOffset;
  }
  set underlineOffset(underlineOffset: number | undefined) {
    this._underlineOffset = underlineOffset;
    //this.doChangeStyle();
  }

  get lineThrough(): LineThroughPropertyDefine | undefined {
    return this._lineThrough;
  }
  set lineThrough(lineThrough: LineThroughPropertyDefine | undefined) {
    this._lineThrough = lineThrough;
    //this.doChangeStyle();
  }
  get lineThroughColor(): ColorPropertyDefine | undefined {
    return this._lineThroughColor;
  }
  set lineThroughColor(lineThroughColor: ColorPropertyDefine | undefined) {
    this._lineThroughColor = lineThroughColor;
    //this.doChangeStyle();
  }
  get lineThroughDash(): LineDashPropertyDefine | undefined {
    return this._lineThroughDash;
  }
  set lineThroughDash(lineThroughDash: LineDashPropertyDefine | undefined) {
    this._lineThroughDash = lineThroughDash;
    //this.doChangeStyle();
  }
  get linkColor(): ColorPropertyDefine | undefined {
    return this._linkColor;
  }
  set linkColor(linkColor: ColorPropertyDefine | undefined) {
    this._linkColor = linkColor;
    //this.doChangeStyle();
  }
  // get tag(): TagPropertyDefine | undefined {
  //   return this._tag;
  // }
  // set tag(tag: TagPropertyDefine | undefined) {
  //   this._tag = tag;
  //   //this.doChangeStyle();
  // }
  // get tagFont(): FontPropertyDefine | undefined {
  //   return this._tagFont;
  // }
  // set tagFont(tagFont: FontPropertyDefine | undefined) {
  //   this._tagFont = tagFont;
  //   //this.doChangeStyle();
  // }
  // get tagColor(): ColorPropertyDefine | undefined {
  //   return this._tagColor;
  // }
  // set tagColor(tagColor: ColorPropertyDefine | undefined) {
  //   this._tagColor = tagColor;
  //   //this.doChangeStyle();
  // }
  // get tagBgColor(): ColorPropertyDefine | undefined {
  //   return this._tagBgColor;
  // }
  // set tagBgColor(tagBgColor: ColorPropertyDefine | undefined) {
  //   this._tagBgColor = tagBgColor;
  //   //this.doChangeStyle();
  // }
  // get tagMargin(): number | string | (number | string)[] | undefined {
  //   return this._tagMargin;
  // }
  // set tagMargin(tagMargin: number | string | (number | string)[] | undefined) {
  //   this._tagMargin = tagMargin;
  //   //this.doChangeStyle();
  // }
  get cursor(): CursorPropertyDefine | undefined {
    return this._cursor;
  }
  set cursor(cursor: CursorPropertyDefine | undefined) {
    this._cursor = cursor;
    //this.doChangeStyle();
  }
  get borderLineWidth(): LineWidthsPropertyDefine | undefined {
    return this._borderLineWidth;
  }
  set borderLineWidth(borderLineWidth: LineWidthsPropertyDefine | undefined) {
    this._borderLineWidth = borderLineWidth;
    //this.doChangeStyle();
  }
  get borderLineDash(): LineDashsPropertyDefine | undefined {
    return this._borderLineDash;
  }
  set borderLineDash(borderLineDash: LineDashsPropertyDefine | undefined) {
    this._borderLineDash = borderLineDash;
    //this.doChangeStyle();
  }
  // doChangeStyle(): void {
  //   this.fireListeners(EVENT_TYPE.CHANGE_STYLE);
  // }
  clone(): Style {
    return new Style(this);
  }
}
