import { isValid } from '../tools/util';
import type { FullExtendStyle, HeaderStyleOption, StylePropertyFunctionArg } from '../ts-types';
import { TextHeaderStyle } from './style/MultilineTextHeaderStyle';
// import { SortHeaderStyle } from "./style/SortHeaderStyle";
import { Style } from './style/Style';

export { Style, TextHeaderStyle };

export function of(
  headerStyle: HeaderStyleOption,
  defaultHeaderStyle: HeaderStyleOption,
  styleArg: StylePropertyFunctionArg,
  StyleClass: typeof Style,
  globalAutoWrapText: boolean
): FullExtendStyle {
  if (headerStyle || defaultHeaderStyle) {
    if (headerStyle instanceof Style) {
      return headerStyle;
    } else if (typeof headerStyle === 'function') {
      return of(headerStyle(styleArg), defaultHeaderStyle, styleArg, StyleClass, globalAutoWrapText);
    }
    if (!headerStyle) {
      headerStyle = {};
    }
    if (globalAutoWrapText && !isValid((headerStyle as any).autoWrapText)) {
      (headerStyle as any).autoWrapText = true;
    }
    return new StyleClass(headerStyle ?? {}, (defaultHeaderStyle ?? {}) as any);
  }
  return StyleClass.DEFAULT;
}
