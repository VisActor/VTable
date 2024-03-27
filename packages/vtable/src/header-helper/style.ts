import { isValid } from '@visactor/vutils';
import type { FullExtendStyle, HeaderStyleOption, StylePropertyFunctionArg } from '../ts-types';
import { TextHeaderStyle } from './style/MultilineTextHeaderStyle';
// import { SortHeaderStyle } from "./style/SortHeaderStyle";
import { Style } from './style/Style';
import type { TableTheme } from '../themes/theme';
import { CheckboxStyle } from './style/CheckboxStyle';

export { Style, TextHeaderStyle };

export function of(
  headerStyle: HeaderStyleOption,
  defaultHeaderStyle: HeaderStyleOption,
  styleArg: StylePropertyFunctionArg,
  StyleClass: typeof Style,
  globalAutoWrapText: boolean,
  theme: TableTheme
): FullExtendStyle {
  if (headerStyle || defaultHeaderStyle) {
    if (headerStyle instanceof Style) {
      return headerStyle;
    } else if (typeof headerStyle === 'function') {
      return of(headerStyle(styleArg), defaultHeaderStyle, styleArg, StyleClass, globalAutoWrapText, theme);
    }
    if (!headerStyle) {
      headerStyle = {};
    }
    if (globalAutoWrapText && !isValid((headerStyle as any).autoWrapText)) {
      (headerStyle as any).autoWrapText = true;
    }
    if (StyleClass === CheckboxStyle) {
      return new CheckboxStyle(
        headerStyle ?? {},
        (defaultHeaderStyle ?? {}) as any,
        (theme.checkboxStyle ?? {}) as any
      );
    }
    return new StyleClass(headerStyle ?? {}, (defaultHeaderStyle ?? {}) as any);
  }
  return StyleClass.DEFAULT;
}
