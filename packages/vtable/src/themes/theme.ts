/* eslint-disable no-undef */
/* eslint-disable sort-imports */
import type {
  ColorPropertyDefine,
  ColorsDef,
  ColorsPropertyDefine,
  ColumnIconOption,
  FrameStyle,
  ITableThemeDefine,
  InteractionStyle,
  LineClamp,
  LineDashsDef,
  LineDashsPropertyDefine,
  LineWidthsDef,
  LineWidthsPropertyDefine,
  PartialTableThemeDefine,
  RequiredTableThemeDefine,
  TextOverflow,
  ThemeStyle,
  // menuStyle,
  TableFrameStyle,
  PaddingsPropertyDefine,
  ScrollStyle,
  CursorPropertyDefine,
  TooltipStyle,
  MarkedPropertyDefine,
  UnderlinePropertyDefine,
  LineDashPropertyDefine,
  LineThroughPropertyDefine,
  FontSizePropertyDefine,
  FontFamilyPropertyDefine,
  FontWeightPropertyDefine,
  FontVariantPropertyDefine,
  FontStylePropertyDefine,
  TextAlignType,
  TextBaselineType
} from '../ts-types';
import { getChainSafe } from '../tools/helper';
import { changeColor, ingoreNoneValueMerge, merge } from '../tools/util';
import {
  DEFAULTBGCOLOR,
  DEFAULTBORDERCOLOR,
  DEFAULTBORDERLINEDASH,
  DEFAULTBORDERLINEWIDTH,
  DEFAULTFONTCOLOR,
  DEFAULTFONTFAMILY,
  DEFAULTFONTSIZE
} from '../tools/global';
import { defalutPoptipStyle, getAxisStyle } from './component';
//private symbol
// const _ = getSymbol();

function getProp(obj: PartialTableThemeDefine, superObj: ITableThemeDefine, names: string[], defNames?: string[]): any {
  return (
    getChainSafe(obj, ...names) ??
    getChainSafe(superObj, ...names) ??
    (defNames && getChainSafe(obj, ...defNames)) ??
    (defNames && getChainSafe(superObj, ...defNames))
  );
}
export class TableTheme implements ITableThemeDefine {
  private internalTheme: {
    obj: PartialTableThemeDefine;
    superTheme: ITableThemeDefine;
  };
  private _defaultStyle: RequiredTableThemeDefine['defaultStyle'] | null = null;
  private _header: ITableThemeDefine['headerStyle'] | null = null;
  private _cornerHeader: ITableThemeDefine['cornerHeaderStyle'] | null = null;
  private _cornerRightTopCell: ITableThemeDefine['cornerRightTopCellStyle'] | null = null;
  private _cornerLeftBottomCell: ITableThemeDefine['cornerLeftBottomCellStyle'] | null = null;
  private _cornerRightBottomCell: ITableThemeDefine['cornerRightBottomCellStyle'] | null = null;
  private _rightFrozen: ITableThemeDefine['rightFrozenStyle'] | null = null;
  private _bottomFrozen: ITableThemeDefine['bottomFrozenStyle'] | null = null;
  private _rowHeader: ITableThemeDefine['rowHeaderStyle'] | null = null;
  private _body: ITableThemeDefine['bodyStyle'] | null = null;
  private _groupTitle: ITableThemeDefine['groupTitleStyle'] | null = null;
  private _scroll: ITableThemeDefine['scrollStyle'] | null = null;
  private _tooltip: ITableThemeDefine['tooltipStyle'] | null = null;
  private _frameStyle: ITableThemeDefine['frameStyle'] | null = null;
  private _columnResize: RequiredTableThemeDefine['columnResize'] | null = null;
  private _dragHeaderSplitLine: RequiredTableThemeDefine['dragHeaderSplitLine'] | null = null;
  private _frozenColumnLine: RequiredTableThemeDefine['frozenColumnLine'] | null = null;
  private _selectionStyle: RequiredTableThemeDefine['selectionStyle'] | null = null;

  private _axisStyle: RequiredTableThemeDefine['axisStyle'] | null = null;
  private _checkboxStyle: RequiredTableThemeDefine['checkboxStyle'] | null = null;
  private _radioStyle: RequiredTableThemeDefine['radioStyle'] | null = null;
  private _switchStyle: RequiredTableThemeDefine['switchStyle'] | null = null;
  private _buttonStyle: RequiredTableThemeDefine['buttonStyle'] | null = null;
  private _textPopTipStyle: RequiredTableThemeDefine['textPopTipStyle'] | null = null;
  private _internalIconsStyle: RequiredTableThemeDefine['functionalIconsStyle'] | null = null;
  isPivot: boolean = false;
  name: string = '';
  constructor(obj: PartialTableThemeDefine | ITableThemeDefine, superTheme: ITableThemeDefine) {
    this.internalTheme = {
      obj,
      superTheme
    };
    this.name = getProp(obj, superTheme, ['name']);
  }
  /** gantt _generateListTableOptions 使用更方法 */
  getExtendTheme(): PartialTableThemeDefine | ITableThemeDefine {
    return this.internalTheme.obj;
  }
  /** gantt _generateListTableOptions 使用更方法 */
  clearBodyStyleCache() {
    this._body = null;
  }
  get font(): string {
    const { obj, superTheme } = this.internalTheme;
    return getProp(obj, superTheme, ['font'], ['bodyStyle', 'font']);
  }
  get underlayBackgroundColor(): string {
    const { obj, superTheme } = this.internalTheme;
    return getProp(obj, superTheme, ['underlayBackgroundColor']);
  }

  get cellInnerBorder(): boolean {
    const { obj, superTheme } = this.internalTheme;
    return getProp(obj, superTheme, ['cellInnerBorder']) ?? true;
  }

  get cellBorderClipDirection(): 'top-left' | 'bottom-right' {
    const { obj, superTheme } = this.internalTheme;
    return getProp(obj, superTheme, ['cellBorderClipDirection']) ?? 'top-left';
  }

  get _contentOffset(): number {
    const { obj, superTheme } = this.internalTheme;
    return getProp(obj, superTheme, ['_contentOffset']) ?? 0;
  }

  get defaultStyle(): RequiredTableThemeDefine['defaultStyle'] {
    // const defaultStyle = getProp(obj, superTheme, ["defaultStyle"]);
    const that = this;
    if (!this._defaultStyle) {
      const { obj, superTheme } = this.internalTheme;
      const defaultStyle: ThemeStyle = ingoreNoneValueMerge({}, superTheme.defaultStyle, obj.defaultStyle);
      this._defaultStyle = {
        get fontSize(): FontSizePropertyDefine {
          return defaultStyle.fontSize ?? DEFAULTFONTSIZE;
        },
        get fontFamily(): FontFamilyPropertyDefine {
          return defaultStyle.fontFamily ?? DEFAULTFONTFAMILY;
        },
        get fontWeight(): FontWeightPropertyDefine | undefined {
          return defaultStyle.fontWeight;
        },
        get fontVariant(): FontVariantPropertyDefine | undefined {
          return defaultStyle.fontVariant;
        },
        get fontStyle(): FontStylePropertyDefine | undefined {
          return defaultStyle.fontStyle;
        },
        get bgColor(): ColorPropertyDefine {
          return defaultStyle.bgColor ?? DEFAULTBGCOLOR;
        },
        get color(): ColorPropertyDefine {
          return defaultStyle.color ?? DEFAULTFONTCOLOR;
        },
        get borderColor(): ColorsPropertyDefine {
          return defaultStyle.borderColor ?? DEFAULTBORDERCOLOR;
        },
        get borderLineWidth(): LineWidthsPropertyDefine | undefined {
          return defaultStyle.borderLineWidth ?? DEFAULTBORDERLINEWIDTH;
        },
        get borderLineDash(): LineDashsPropertyDefine | undefined {
          return defaultStyle.borderLineDash ?? DEFAULTBORDERLINEDASH;
        },
        get hover(): InteractionStyle | undefined {
          if (defaultStyle.hover) {
            return {
              get cellBgColor(): ColorPropertyDefine | undefined {
                return defaultStyle.hover?.cellBgColor ?? undefined;
              },
              // get cellBorderColor(): ColorsPropertyDefine | undefined {
              //   return defaultStyle.hover?.cellBorderColor ?? undefined;
              // },
              // get cellBorderLineWidth(): LineWidthsPropertyDefine | undefined {
              //   return defaultStyle.hover?.cellBorderLineWidth ?? undefined;
              // },
              get inlineColumnBgColor(): ColorPropertyDefine | undefined {
                return (
                  defaultStyle.hover?.inlineColumnBgColor ??
                  (defaultStyle.hover?.cellBgColor && typeof defaultStyle.hover?.cellBgColor === 'string'
                    ? changeColor(defaultStyle.hover?.cellBgColor, 0.1, false)
                    : undefined) ??
                  undefined
                );
              },
              get inlineRowBgColor(): ColorPropertyDefine | undefined {
                return (
                  defaultStyle.hover?.inlineRowBgColor ??
                  (defaultStyle.hover?.cellBgColor && typeof defaultStyle.hover?.cellBgColor === 'string'
                    ? changeColor(defaultStyle.hover?.cellBgColor, 0.1, false)
                    : undefined) ??
                  undefined
                );
              }
            };
          }
          return undefined;
        },
        get select(): InteractionStyle | undefined {
          if (defaultStyle.select) {
            return {
              get inlineColumnBgColor(): ColorPropertyDefine | undefined {
                return (
                  defaultStyle.select?.inlineColumnBgColor ??
                  that.selectionStyle?.inlineColumnBgColor ??
                  (that.selectionStyle?.cellBgColor && typeof that.selectionStyle.cellBgColor === 'string'
                    ? changeColor(that.selectionStyle.cellBgColor, 0.1, false)
                    : undefined) ??
                  undefined
                );
              },
              get inlineRowBgColor(): ColorPropertyDefine | undefined {
                return (
                  defaultStyle.select?.inlineRowBgColor ??
                  that.selectionStyle.inlineRowBgColor ??
                  (that.selectionStyle?.cellBgColor && typeof that.selectionStyle.cellBgColor === 'string'
                    ? changeColor(that.selectionStyle.cellBgColor, 0.1, false)
                    : undefined) ??
                  undefined
                );
              }
            };
          }
          return undefined;
        },
        get padding(): PaddingsPropertyDefine {
          return defaultStyle.padding ?? [10, 16, 10, 16];
        },
        get textAlign(): TextAlignType {
          return defaultStyle.textAlign ?? 'left';
        },
        get textBaseline(): TextBaselineType {
          return defaultStyle.textBaseline ?? 'middle';
        },
        get textOverflow(): TextOverflow {
          return defaultStyle.textOverflow ?? 'ellipsis';
        },
        get lineHeight(): number {
          return defaultStyle.lineHeight;
        },
        get autoWrapText(): boolean {
          return defaultStyle.autoWrapText ?? false;
        },
        get lineClamp(): LineClamp {
          return defaultStyle.lineClamp ?? 'auto';
        },
        get linkColor(): ColorPropertyDefine {
          return defaultStyle.linkColor ?? '#3772ff';
        },
        get cursor(): CursorPropertyDefine {
          return defaultStyle.cursor ?? 'auto';
        },
        get marked(): MarkedPropertyDefine {
          return defaultStyle.marked ?? false;
        },
        get underline(): UnderlinePropertyDefine {
          return defaultStyle.underline ?? false;
        },
        get underlineColor(): ColorPropertyDefine | undefined {
          return defaultStyle.underlineColor; // 不需要默认值 绘制中已处理默认用文字颜色
        },
        get underlineDash(): LineDashPropertyDefine | undefined {
          return defaultStyle.underlineDash;
        },
        get underlineOffset(): number | undefined {
          return defaultStyle.underlineOffset;
        },
        get lineThrough(): LineThroughPropertyDefine | undefined {
          return defaultStyle.lineThrough ?? false;
        },
        get lineThroughColor(): ColorPropertyDefine | undefined {
          return defaultStyle.lineThroughColor; // 不需要默认值 绘制中已处理默认用文字颜色
        },
        get lineThroughDash(): LineDashPropertyDefine | undefined {
          return defaultStyle.lineThroughDash;
        }
      };
    }
    return this._defaultStyle;
  }

  get cornerHeaderStyle(): ITableThemeDefine['cornerHeaderStyle'] {
    if (!this._cornerHeader) {
      const { obj, superTheme } = this.internalTheme;
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        superTheme.cornerHeaderStyle,
        obj.cornerHeaderStyle // ?? obj.headerStyle
      );
      this._cornerHeader = this.getStyle(header);
    }
    return this._cornerHeader;
  }
  get cornerRightTopCellStyle(): ITableThemeDefine['cornerRightTopCellStyle'] {
    if (!this._cornerRightTopCell) {
      const { obj, superTheme } = this.internalTheme;
      if (!superTheme.cornerRightTopCellStyle && !obj.cornerRightTopCellStyle) {
        return this._cornerRightTopCell;
      }
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        superTheme.cornerRightTopCellStyle,
        obj.cornerRightTopCellStyle // ?? obj.headerStyle
      );
      this._cornerRightTopCell = this.getStyle(header);
    }
    return this._cornerRightTopCell;
  }
  get cornerLeftBottomCellStyle(): ITableThemeDefine['cornerLeftBottomCellStyle'] {
    if (!this._cornerLeftBottomCell) {
      const { obj, superTheme } = this.internalTheme;
      if (!superTheme.cornerLeftBottomCellStyle && !obj.cornerLeftBottomCellStyle) {
        return this._cornerLeftBottomCell;
      }
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        superTheme.cornerLeftBottomCellStyle,
        obj.cornerLeftBottomCellStyle // ?? obj.headerStyle
      );
      this._cornerLeftBottomCell = this.getStyle(header);
    }
    return this._cornerLeftBottomCell;
  }
  get cornerRightBottomCellStyle(): ITableThemeDefine['cornerRightBottomCellStyle'] {
    if (!this._cornerRightBottomCell) {
      const { obj, superTheme } = this.internalTheme;
      if (!superTheme.cornerRightBottomCellStyle && !obj.cornerRightBottomCellStyle) {
        return this._cornerRightBottomCell;
      }
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        superTheme.cornerRightBottomCellStyle,
        obj.cornerRightBottomCellStyle // ?? obj.headerStyle
      );
      this._cornerRightBottomCell = this.getStyle(header);
    }
    return this._cornerRightBottomCell;
  }
  get rightFrozenStyle(): ITableThemeDefine['rightFrozenStyle'] {
    if (!this._rightFrozen) {
      const { obj, superTheme } = this.internalTheme;
      if (!superTheme.rightFrozenStyle && !obj.rightFrozenStyle) {
        return this._rightFrozen;
      }
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        this.rowHeaderStyle,
        superTheme.rightFrozenStyle,
        obj.rightFrozenStyle // ?? obj.headerStyle
      );
      this._rightFrozen = this.getStyle(header);
    }
    return this._rightFrozen;
  }
  get bottomFrozenStyle(): ITableThemeDefine['bottomFrozenStyle'] {
    if (!this._bottomFrozen) {
      const { obj, superTheme } = this.internalTheme;
      if (!superTheme.bottomFrozenStyle && !obj.bottomFrozenStyle) {
        return this._bottomFrozen;
      }
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        this.headerStyle,
        superTheme.bottomFrozenStyle,
        obj.bottomFrozenStyle // ?? obj.headerStyle
      );
      this._bottomFrozen = this.getStyle(header);
    }
    return this._bottomFrozen;
  }
  get rowHeaderStyle(): ITableThemeDefine['rowHeaderStyle'] {
    if (!this._rowHeader) {
      const { obj, superTheme } = this.internalTheme;
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        superTheme.rowHeaderStyle,
        obj.rowHeaderStyle ?? (this.isPivot ? null : obj.headerStyle) // not for pivot
      );
      this._rowHeader = this.getStyle(header);
    }
    return this._rowHeader;
  }
  get headerStyle(): ITableThemeDefine['headerStyle'] {
    if (!this._header) {
      const { obj, superTheme } = this.internalTheme;
      // const header = getProp(obj, superTheme, ["header"]);
      const header: ThemeStyle = ingoreNoneValueMerge({}, this.defaultStyle, superTheme.headerStyle, obj.headerStyle);
      this._header = this.getStyle(header);
    }
    return this._header;
  }
  get bodyStyle(): ITableThemeDefine['bodyStyle'] {
    if (!this._body) {
      const { obj, superTheme } = this.internalTheme;
      // const body = getProp(obj, superTheme, ["body"]);
      const body: ThemeStyle = ingoreNoneValueMerge({}, this.defaultStyle, superTheme.bodyStyle, obj.bodyStyle);
      this._body = this.getStyle(body);
    }

    return this._body;
  }

  get groupTitleStyle(): ITableThemeDefine['groupTitleStyle'] {
    if (!this._groupTitle) {
      const { obj, superTheme } = this.internalTheme;
      if (!superTheme.groupTitleStyle && !obj.groupTitleStyle) {
        return this._groupTitle;
      }
      const groupTitle: ThemeStyle = ingoreNoneValueMerge(
        {},
        this.defaultStyle,
        superTheme.groupTitleStyle,
        obj.groupTitleStyle
      );
      this._groupTitle = this.getStyle(groupTitle);
    }

    return this._groupTitle;
  }

  get frameStyle(): ITableThemeDefine['frameStyle'] {
    if (!this._frameStyle) {
      const { obj, superTheme } = this.internalTheme;
      const frameStyle: TableFrameStyle = ingoreNoneValueMerge({}, superTheme.frameStyle, obj.frameStyle);
      this._frameStyle = {
        get borderColor(): ColorsDef | undefined {
          return frameStyle.borderColor;
        },
        get borderLineWidth(): LineWidthsDef | undefined {
          return frameStyle.borderLineWidth;
        },
        get borderLineDash(): LineDashsDef | undefined {
          return frameStyle.borderLineDash;
        },
        get innerBorder(): boolean | undefined {
          return frameStyle.innerBorder;
        },
        get shadowBlur(): number {
          return frameStyle.shadowBlur;
        },
        get shadowColor(): string {
          return frameStyle.shadowColor;
        },
        get shadowOffsetX(): number {
          return frameStyle.shadowOffsetX;
        },
        get shadowOffsetY(): number {
          return frameStyle.shadowOffsetY;
        },
        get cornerRadius(): number | [number, number, number, number] {
          return frameStyle.cornerRadius;
        }
      };
    }
    return this._frameStyle;
  }
  get scrollStyle(): ITableThemeDefine['scrollStyle'] {
    if (!this._scroll) {
      const { obj, superTheme } = this.internalTheme;
      const scroll: ScrollStyle = ingoreNoneValueMerge({}, superTheme.scrollStyle, obj.scrollStyle);
      this._scroll = {
        get scrollSliderColor(): string | undefined {
          return scroll.scrollSliderColor ?? '#C0C0C0';
        },
        get scrollSliderCornerRadius(): number | undefined {
          return scroll.scrollSliderCornerRadius;
        },
        get scrollRailColor(): string | undefined {
          return scroll.scrollRailColor;
        },
        get visible(): 'always' | 'scrolling' | 'none' | 'focus' {
          return scroll.visible ?? 'scrolling';
        },
        get verticalVisible(): 'always' | 'scrolling' | 'none' | 'focus' {
          return scroll.verticalVisible;
        },
        get horizontalVisible(): 'always' | 'scrolling' | 'none' | 'focus' {
          return scroll.horizontalVisible;
        },
        get width(): number | undefined {
          return scroll.width ?? 7;
        },
        get hoverOn(): boolean | undefined {
          return scroll.hoverOn ?? true;
        },
        get barToSide(): boolean | undefined {
          return scroll.barToSide ?? false;
        },
        get horizontalPadding(): number | [number, number, number, number] {
          return scroll.horizontalPadding ?? 0;
        },
        get verticalPadding(): number | [number, number, number, number] {
          return scroll.verticalPadding ?? 0;
        }
      };
    }

    return this._scroll;
  }
  get tooltipStyle(): ITableThemeDefine['tooltipStyle'] {
    if (!this._tooltip) {
      const { obj, superTheme } = this.internalTheme;
      const tooltip: TooltipStyle = ingoreNoneValueMerge({}, superTheme.tooltipStyle, obj.tooltipStyle);
      this._tooltip = {
        get fontFamily(): string | undefined {
          return tooltip.fontFamily ?? DEFAULTFONTFAMILY;
        },
        get fontSize(): number | undefined {
          return tooltip.fontSize ?? DEFAULTFONTSIZE;
        },
        get bgColor(): string | undefined {
          return tooltip.bgColor ?? '#000';
        },
        get padding(): number[] {
          return tooltip.padding ?? [6, 8];
        },
        get color(): string | undefined {
          return tooltip.color ?? '#FFF';
        },
        get maxWidth(): number | undefined {
          return tooltip.maxWidth;
        },
        get maxHeight(): number | undefined {
          return tooltip.maxHeight;
        }
      };
    }

    return this._tooltip;
  }

  /**
   * resize 分割线样式
   */
  get columnResize(): RequiredTableThemeDefine['columnResize'] {
    if (!this._columnResize) {
      const { obj, superTheme } = this.internalTheme;
      const columnResize: RequiredTableThemeDefine['columnResize'] = ingoreNoneValueMerge(
        {},
        superTheme.columnResize,
        obj.columnResize
      );
      this._columnResize = {
        get lineColor(): ColorPropertyDefine {
          return columnResize.lineColor ?? '#416EFF';
        },
        get bgColor(): ColorPropertyDefine {
          return columnResize.bgColor ?? '#D9E2FF';
        },
        get lineWidth(): number {
          return columnResize.lineWidth ?? 1;
        },
        get width(): number {
          return columnResize.width ?? columnResize.lineWidth + 2;
        },
        get resizeHotSpotSize(): number {
          return columnResize.resizeHotSpotSize ?? 16;
        },
        get labelColor(): string {
          return columnResize.labelColor ?? '#FFF';
        },
        get labelFontSize(): number {
          return columnResize.labelFontSize ?? 10;
        },
        get labelFontFamily(): string {
          return columnResize.labelFontFamily ?? 'sans-serif';
        },
        get labelBackgroundFill(): string {
          return columnResize.labelBackgroundFill ?? '#3073F2';
        },
        get labelBackgroundCornerRadius(): number {
          return columnResize.labelBackgroundCornerRadius ?? 5;
        },
        get labelVisible(): boolean {
          return columnResize.labelVisible ?? true;
        },
        get visibleOnHover(): boolean {
          return columnResize.visibleOnHover ?? false;
        }
      };
    }
    return this._columnResize;
  }
  /**
   * 移位 分割线样式
   */
  get dragHeaderSplitLine(): RequiredTableThemeDefine['dragHeaderSplitLine'] {
    if (!this._dragHeaderSplitLine) {
      const { obj, superTheme } = this.internalTheme;
      const dragHeaderSplitLine: RequiredTableThemeDefine['dragHeaderSplitLine'] = ingoreNoneValueMerge(
        {},
        superTheme.dragHeaderSplitLine,
        obj.dragHeaderSplitLine
      );
      this._dragHeaderSplitLine = {
        get lineColor(): ColorPropertyDefine {
          return dragHeaderSplitLine.lineColor ?? 'blue';
        },
        // get bgColor(): ColorPropertyDefine {
        //   return dragHeaderSplitLine.bgColor ?? dragHeaderSplitLine.lineColor;
        // },
        get lineWidth(): number {
          return dragHeaderSplitLine.lineWidth ?? 2;
        },
        // get width(): number {
        //   return dragHeaderSplitLine.width ?? dragHeaderSplitLine.lineWidth;
        // },
        get shadowBlockColor(): string {
          return dragHeaderSplitLine.shadowBlockColor ?? 'rgba(204,204,204,0.3)';
        }
      };
    }
    return this._dragHeaderSplitLine;
  }
  get frozenColumnLine(): RequiredTableThemeDefine['frozenColumnLine'] {
    // const { obj, superTheme } = this.internalTheme;
    // const that = this;
    // const frozenColumnLine = getProp(obj, superTheme, [
    //   "frozenColumnLine",
    // ]);
    if (!this._frozenColumnLine) {
      const { obj, superTheme } = this.internalTheme;
      const frozenColumnLine: RequiredTableThemeDefine['frozenColumnLine'] = ingoreNoneValueMerge(
        {},
        superTheme.frozenColumnLine,
        obj.frozenColumnLine
      );
      this._frozenColumnLine = {
        get shadow(): { width: number; startColor: string; endColor: string } | undefined {
          if (frozenColumnLine.shadow) {
            return {
              get width(): number {
                return frozenColumnLine.shadow?.width ?? 24;
              },
              get startColor(): string {
                return frozenColumnLine.shadow?.startColor ?? 'rgba(00, 24, 47, 0.06)';
              },
              get endColor(): string {
                return frozenColumnLine.shadow?.endColor ?? 'rgba(00, 24, 47, 0)';
              }
            };
          }
          return undefined;
        },
        get border():
          | {
              lineColor: ColorPropertyDefine;
              bgColor?: ColorPropertyDefine;
              lineWidth: number;
              width?: number;
            }
          | undefined {
          if (frozenColumnLine.border) {
            return {
              get lineColor(): ColorPropertyDefine {
                return frozenColumnLine.border?.lineColor ?? 'rgba(00, 24, 47, 0.06)';
              },
              get bgColor(): ColorPropertyDefine {
                return (
                  frozenColumnLine.border?.bgColor ?? frozenColumnLine.border?.lineColor ?? 'rgba(00, 24, 47, 0.06)'
                );
              },
              get lineWidth(): number {
                return frozenColumnLine.border?.lineWidth ?? 4;
              },
              get width(): number {
                return frozenColumnLine.border?.width ?? frozenColumnLine.border?.lineWidth ?? 4;
              }
            };
          }
          return undefined;
        }
      };
    }
    return this._frozenColumnLine;
  }
  get selectionStyle(): RequiredTableThemeDefine['selectionStyle'] {
    if (!this._selectionStyle) {
      const { obj, superTheme } = this.internalTheme;
      const selectionStyle: RequiredTableThemeDefine['selectionStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.selectionStyle,
        obj.selectionStyle
      );
      this._selectionStyle = {
        get cellBgColor(): string | undefined {
          return selectionStyle?.cellBgColor ?? 'rgba(0, 0, 255,0.1)';
        },
        get cellBorderColor(): string | undefined {
          return selectionStyle?.cellBorderColor ?? '#3073f2';
        },
        get cellBorderLineWidth(): number | undefined {
          return selectionStyle?.cellBorderLineWidth ?? 2;
        },
        get inlineColumnBgColor(): string | undefined {
          return selectionStyle?.inlineColumnBgColor;
        },
        get inlineRowBgColor(): string | undefined {
          return selectionStyle?.inlineRowBgColor;
        },
        get selectionFillMode(): 'overlay' | 'replace' {
          return selectionStyle?.selectionFillMode ?? 'overlay';
        }
      };
    }
    return this._selectionStyle;
  }

  get axisStyle(): RequiredTableThemeDefine['axisStyle'] {
    if (!this._axisStyle) {
      const { obj, superTheme } = this.internalTheme;
      const axisStyle: RequiredTableThemeDefine['axisStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.axisStyle,
        obj.axisStyle
      );
      this._axisStyle = getAxisStyle(axisStyle);
    }
    return this._axisStyle;
  }

  get checkboxStyle(): RequiredTableThemeDefine['checkboxStyle'] {
    if (!this._checkboxStyle) {
      const { obj, superTheme } = this.internalTheme;
      const checkboxStyle: RequiredTableThemeDefine['checkboxStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.checkboxStyle,
        obj.checkboxStyle
      );
      this._checkboxStyle = checkboxStyle;
    }
    return this._checkboxStyle;
  }

  get radioStyle(): RequiredTableThemeDefine['radioStyle'] {
    if (!this._radioStyle) {
      const { obj, superTheme } = this.internalTheme;
      const radioStyle: RequiredTableThemeDefine['radioStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.radioStyle,
        obj.radioStyle
      );
      this._radioStyle = radioStyle;
    }
    return this._radioStyle;
  }

  get switchStyle(): RequiredTableThemeDefine['switchStyle'] {
    if (!this._switchStyle) {
      const { obj, superTheme } = this.internalTheme;
      const switchStyle: RequiredTableThemeDefine['switchStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.switchStyle,
        obj.switchStyle
      );
      this._switchStyle = switchStyle;
    }
    return this._switchStyle;
  }

  get buttonStyle(): RequiredTableThemeDefine['buttonStyle'] {
    if (!this._buttonStyle) {
      const { obj, superTheme } = this.internalTheme;
      const buttonStyle: RequiredTableThemeDefine['buttonStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.buttonStyle,
        obj.buttonStyle
      );
      this._buttonStyle = buttonStyle;
    }
    return this._buttonStyle;
  }

  get textPopTipStyle(): RequiredTableThemeDefine['textPopTipStyle'] {
    if (!this._textPopTipStyle) {
      const { obj, superTheme } = this.internalTheme;
      const textPopTipStyle: RequiredTableThemeDefine['textPopTipStyle'] = ingoreNoneValueMerge(
        {},
        defalutPoptipStyle,
        superTheme.textPopTipStyle,
        obj.textPopTipStyle
      );
      this._textPopTipStyle = textPopTipStyle;
    }
    return this._textPopTipStyle;
  }

  get functionalIconsStyle(): RequiredTableThemeDefine['functionalIconsStyle'] {
    if (!this._internalIconsStyle) {
      const { obj, superTheme } = this.internalTheme;
      const functionalIconsStyle: RequiredTableThemeDefine['functionalIconsStyle'] = ingoreNoneValueMerge(
        {},
        superTheme.functionalIconsStyle,
        obj.functionalIconsStyle
      );
      this._internalIconsStyle = functionalIconsStyle;
    }
    return this._internalIconsStyle;
  }

  hasProperty(names: string[]): boolean {
    const { obj, superTheme } = this.internalTheme;
    return hasThemeProperty(obj, names) || hasThemeProperty(superTheme, names);
  }
  extends(obj: PartialTableThemeDefine): TableTheme {
    return new TableTheme(
      ingoreNoneValueMerge({}, obj),
      ingoreNoneValueMerge(this.internalTheme.superTheme, this.internalTheme.obj)
    );
  }
  private getStyle(style: ThemeStyle) {
    const that = this;
    return {
      get fontSize(): FontSizePropertyDefine | undefined {
        return style.fontSize;
      },
      get fontFamily(): FontFamilyPropertyDefine | undefined {
        return style.fontFamily;
      },
      get fontWeight(): FontWeightPropertyDefine | undefined {
        return style.fontWeight;
      },
      get fontVariant(): FontVariantPropertyDefine | undefined {
        return style.fontVariant;
      },
      get fontStyle(): FontStylePropertyDefine | undefined {
        return style.fontStyle;
      },
      get bgColor(): ColorPropertyDefine | undefined {
        return style.bgColor;
      },
      get color(): ColorPropertyDefine | undefined {
        return style.color;
      },
      get strokeColor(): ColorPropertyDefine | undefined {
        return style.strokeColor;
      },
      get borderColor(): ColorsPropertyDefine | undefined {
        return style.borderColor;
      },
      get borderLineWidth(): LineWidthsPropertyDefine | undefined {
        return style.borderLineWidth;
      },
      get borderLineDash(): LineDashsPropertyDefine | undefined {
        return style.borderLineDash;
      },
      get hover(): InteractionStyle | undefined {
        if (style.hover) {
          return {
            get cellBgColor(): ColorPropertyDefine | undefined {
              return style.hover?.cellBgColor ?? undefined;
            },
            get inlineColumnBgColor(): ColorPropertyDefine | undefined {
              return (
                style.hover?.inlineColumnBgColor ??
                (style.hover?.cellBgColor && typeof style.hover?.cellBgColor === 'string'
                  ? changeColor(style.hover?.cellBgColor, 0.1, false)
                  : undefined) ??
                undefined
              );
            },
            get inlineRowBgColor(): ColorPropertyDefine | undefined {
              return (
                style.hover?.inlineRowBgColor ??
                (style.hover?.cellBgColor && typeof style.hover?.cellBgColor === 'string'
                  ? changeColor(style.hover?.cellBgColor, 0.1, false)
                  : undefined) ??
                undefined
              );
            }
          };
        }
        return undefined;
      },
      get select(): InteractionStyle | undefined {
        // if (style.select) {
        return {
          get inlineColumnBgColor(): ColorPropertyDefine | undefined {
            return (
              style.select?.inlineColumnBgColor ??
              that.selectionStyle?.inlineColumnBgColor ??
              (that.selectionStyle?.cellBgColor && typeof that.selectionStyle.cellBgColor === 'string'
                ? changeColor(that.selectionStyle.cellBgColor, 0.1, false)
                : undefined) ??
              undefined
            );
          },
          get inlineRowBgColor(): ColorPropertyDefine | undefined {
            return (
              style.select?.inlineRowBgColor ??
              that.selectionStyle.inlineRowBgColor ??
              (that.selectionStyle?.cellBgColor && typeof that.selectionStyle.cellBgColor === 'string'
                ? changeColor(that.selectionStyle.cellBgColor, 0.1, false)
                : undefined) ??
              undefined
            );
          },
          get cellBgColor(): ColorPropertyDefine | undefined {
            if (that.selectionStyle.selectionFillMode === 'replace') {
              return style.select?.cellBgColor ?? that.selectionStyle.cellBgColor ?? undefined;
            }
            return undefined;
          }
        };
        // }
        // return undefined;
      },

      get frameStyle(): FrameStyle | undefined {
        if (style.frameStyle) {
          return {
            get borderColor(): ColorsDef | undefined {
              return style.frameStyle?.borderColor ?? undefined;
            },
            get borderLineWidth(): LineWidthsDef | undefined {
              return style.frameStyle?.borderLineWidth ?? undefined;
            },
            get borderLineDash(): LineDashsDef | undefined {
              return style.frameStyle?.borderLineDash ?? undefined;
            }
          };
        }
        return undefined;
      },
      get padding(): PaddingsPropertyDefine | undefined {
        return style.padding;
      },
      get textAlign(): TextAlignType | undefined {
        return style.textAlign;
      },
      get textBaseline(): TextBaselineType | undefined {
        return style.textBaseline;
      },
      get textOverflow(): TextOverflow | undefined {
        return style.textOverflow;
      },
      get lineHeight(): number | undefined {
        return style.lineHeight;
      },
      get autoWrapText(): boolean | undefined {
        return style.autoWrapText;
      },
      get lineClamp(): LineClamp | undefined {
        return style.lineClamp;
      },
      get linkColor(): ColorPropertyDefine | undefined {
        return style.linkColor;
      },
      get cursor(): CursorPropertyDefine | undefined {
        return style.cursor;
      },
      get textStick(): boolean | 'vertical' | 'horizontal' | undefined {
        return style.textStick;
      },
      get marked(): MarkedPropertyDefine | undefined {
        return style.marked;
      },
      get underline(): UnderlinePropertyDefine {
        return style.underline ?? false;
      },
      get underlineColor(): ColorPropertyDefine | undefined {
        return style.underlineColor; // 不需要默认值 绘制中已处理默认用文字颜色
      },
      get underlineDash(): LineDashPropertyDefine | undefined {
        return style.underlineDash;
      },
      get underlineOffset(): number | undefined {
        return style.underlineOffset;
      },
      get lineThrough(): LineThroughPropertyDefine | undefined {
        return style.lineThrough ?? false;
      },
      get lineThroughColor(): ColorPropertyDefine | undefined {
        return style.lineThroughColor; // 不需要默认值 绘制中已处理默认用文字颜色
      },
      get lineThroughDash(): LineDashPropertyDefine | undefined {
        return style.lineThroughDash;
      }
    };
  }
}

function hasThemeProperty(obj: PartialTableThemeDefine, names: string[]): boolean {
  if (obj instanceof TableTheme) {
    return obj.hasProperty(names);
  }

  let o: any = obj;
  if (!o) {
    return false;
  }
  for (let index = 0; index < names.length; index++) {
    const name = names[index];
    o = o[name];
    if (!o) {
      return false;
    }
  }
  return !!o;
}
