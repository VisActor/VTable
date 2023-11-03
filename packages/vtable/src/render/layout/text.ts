import type { IWrapTextGraphicAttribute } from '@visactor/vrender';
import { WrapText } from '@visactor/vrender';
import type { TextAlignType, TextBaselineType } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ElementOptions } from './element';
import { BaseElement } from './element';
import type { TagAttributes } from '@visactor/vrender-components';
import { Tag } from '@visactor/vrender-components';
import { isArray } from '@visactor/vutils';

type ITextOption = {
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
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IWrapTextGraphicAttribute;

export class Text extends Tag {
  constructor(options: ITextOption) {
    if (!options.textBaseline) {
      options.textBaseline = 'top';
    }
    const isPaddingNumber = isArray(options.boundsPadding);
    const padding = [
      options.marginTop ?? (isPaddingNumber ? options.boundsPadding[0] : options.boundsPadding) ?? 0,
      options.marginRight ?? (isPaddingNumber ? options.boundsPadding[1] : options.boundsPadding) ?? 0,
      options.marginBottom ??
        (isPaddingNumber ? options.boundsPadding[2] ?? options.boundsPadding[0] : options.boundsPadding) ??
        0,
      options.marginLeft ??
        (isPaddingNumber ? options.boundsPadding[3] ?? options.boundsPadding[1] : options.boundsPadding) ??
        0
    ];
    const tagAttributes: TagAttributes = {
      text: options.text,
      textStyle: options,
      panel: {
        visible: !!options.background,
        fill: (options?.background as any)?.fill,
        stroke: (options?.background as any)?.stroke,
        lineWidth: (options?.background as any)?.lineWidth,
        cornerRadius: (options?.background as any)?.cornerRadius
      },
      boundsPadding: padding
    };
    super(tagAttributes);
  }
  getSize(table: BaseTableAPI) {
    this.AABBBounds.width();
  }
}
