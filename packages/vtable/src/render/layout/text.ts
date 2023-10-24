import type { TextAlignType, TextBaselineType } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ElementOptions } from './element';
import { BaseElement } from './element';

type TextOptions = {
  text: string;
  fill?: string | boolean;
  color?: string | boolean;
  stroke?: string | boolean;
  lineWidth: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontVariant?: string;
  fontStyle?: string;
  ellipsis?: boolean | string;
  maxLineWidth?: number;
  textAlign?: TextAlignType;
  textBaseline?: TextBaselineType;
  lineHeight?: number;
  underline?: number;
  lineThrough?: number;
  heightLimit?: number;
  lineClamp?: number;
} & ElementOptions;

export class Text extends BaseElement {
  type: 'text' = 'text';
  text: string;
  fill: string | boolean;
  color?: string | boolean;
  stroke?: string | boolean;
  lineWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight?: string | number;
  fontVariant?: string;
  fontStyle?: string;
  ellipsis?: boolean | string;
  maxLineWidth?: number;
  textAlign?: TextAlignType;
  textBaseline?: TextBaselineType;
  lineHeight?: number;
  underline?: number;
  lineThrough?: number;
  heightLimit?: number;
  lineClamp?: number;

  constructor(options: TextOptions) {
    super(options);
    this.text = options.text;
    this.fontSize = options.fontSize || 12;
    this.fontFamily = options.fontFamily || 'Arial,sans-serif';
    this.fill = options.color || options.fill || 'black';
    this.textBaseline = options.textBaseline || 'top';
    this.textAlign = options.textAlign || 'left';

    options.stroke && (this.stroke = options.stroke);
    options.lineWidth && (this.lineWidth = options.lineWidth);
    options.fontWeight && (this.fontWeight = options.fontWeight);
    options.fontVariant && (this.fontVariant = options.fontVariant);
    options.fontStyle && (this.fontStyle = options.fontStyle);
    options.ellipsis && (this.ellipsis = options.ellipsis);
    options.maxLineWidth && (this.maxLineWidth = options.maxLineWidth);
    options.lineHeight && (this.lineHeight = options.lineHeight);
    options.underline && (this.underline = options.underline);
    options.lineThrough && (this.lineThrough = options.lineThrough);
    options.heightLimit && (this.heightLimit = options.heightLimit);
    options.lineClamp && (this.lineClamp = options.lineClamp);
  }

  getSize(table: BaseTableAPI) {
    const { width, height } = table.measureText(this.text, {
      fontSize: this.fontSize,
      fontWeight: this.fontWeight,
      fontFamily: this.fontFamily
    });
    this.width = width;
    this.height = height;
    this.initLayoutSize();

    if (this.background) {
      this.dx += this.background.expandX || 0;
      this.dy += this.background.expandY || 0;
    }
  }
}
