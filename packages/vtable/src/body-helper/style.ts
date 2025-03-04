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
import type { TableTheme } from '../themes/theme';
import { CheckboxStyle } from './style/CheckboxStyle';
import { RadioStyle } from './style/RadioStyle';
import { SwitchStyle } from './style/SwitchStyle';
import { ButtonStyle } from './style/ButtonStyle';

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
  globalAutoWrapText: boolean,
  theme: TableTheme
): FullExtendStyle {
  if (columnStyle || bodyStyle) {
    if (columnStyle instanceof Style) {
      return columnStyle;
    } else if (typeof columnStyle === 'function') {
      return of(columnStyle(styleArg), bodyStyle, styleArg, StyleClassDef, globalAutoWrapText, theme);
    }
    if (!columnStyle) {
      columnStyle = {};
    }
    if (globalAutoWrapText && !isValid((columnStyle as any).autoWrapText)) {
      (columnStyle as any).autoWrapText = true;
    }
    if (StyleClassDef === CheckboxStyle) {
      return new CheckboxStyle(columnStyle ?? {}, (bodyStyle ?? {}) as any, (theme.checkboxStyle ?? {}) as any);
    } else if (StyleClassDef === RadioStyle) {
      return new RadioStyle(columnStyle ?? {}, (bodyStyle ?? {}) as any, (theme.radioStyle ?? {}) as any);
    } else if (StyleClassDef === SwitchStyle) {
      return new SwitchStyle(columnStyle ?? {}, (bodyStyle ?? {}) as any, (theme.switchStyle ?? {}) as any);
    } else if (StyleClassDef === ButtonStyle) {
      return new ButtonStyle(columnStyle ?? {}, (bodyStyle ?? {}) as any, (theme.buttonStyle ?? {}) as any);
    }
    return new StyleClassDef((columnStyle ?? {}) as any, (bodyStyle ?? {}) as any);
  }
  return StyleClassDef.DEFAULT;
}
