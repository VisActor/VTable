import { isValid } from '@visactor/vutils';
import type {
  ColumnStyle,
  ColumnStyleOption,
  FullExtendStyle,
  IImageStyleOption,
  ITextStyleOption,
  IStyleOption,
  StylePropertyFunctionArg
} from '../ts-types';

import { ImageStyle } from './style/ImageStyle';
import { TextStyle } from './style/MultilineTextStyle';
import { NumberStyle } from './style/NumberStyle';
import { Style } from './style/Style';

const { EVENT_TYPE } = Style;
export {
  EVENT_TYPE,
  Style,
  NumberStyle,
  ImageStyle,
  TextStyle,
  // types
  IStyleOption,
  IImageStyleOption,
  ITextStyleOption
};
export function of(
  columnStyle: ColumnStyleOption,
  bodyStyle: ColumnStyleOption,
  styleArg: StylePropertyFunctionArg,
  StyleClassDef: typeof Style = Style,
  globalAutoWrapText: boolean
): FullExtendStyle {
  if (columnStyle || bodyStyle) {
    if (columnStyle instanceof Style) {
      return columnStyle;
    } else if (typeof columnStyle === 'function') {
      return of(columnStyle(styleArg), bodyStyle, styleArg, StyleClassDef, globalAutoWrapText);
    }
    if (!columnStyle) {
      columnStyle = {};
    }
    if (globalAutoWrapText && !isValid((columnStyle as any).autoWrapText)) {
      (columnStyle as any).autoWrapText = true;
    }

    return new StyleClassDef((columnStyle ?? {}) as any, (bodyStyle ?? {}) as any);
  }
  return StyleClassDef.DEFAULT;
}
