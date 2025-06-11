import { extend, getIgnoreCase } from './tools/helper';
import { TableTheme } from './themes/theme-define';
import ganttSimplifyTheme from './themes/SIMPLIFY';
import arcoTheme from './themes/ARCO';
import darkTheme from './themes/DARK';
import defaultTheme from './themes/DEFAULT';
import brightTheme from './themes/BRIGHT';

export const SIMPLIFY = new TableTheme(ganttSimplifyTheme, ganttSimplifyTheme);
export const ARCO = new TableTheme(arcoTheme, arcoTheme);
export const DARK = new TableTheme(darkTheme, darkTheme);
export const DEFAULT = new TableTheme(defaultTheme, defaultTheme);
export const BRIGHT = new TableTheme(brightTheme, brightTheme);

const builtin: { [key: string]: TableTheme } = {
  SIMPLIFY,
  ARCO,
  DARK,
  DEFAULT,
  BRIGHT
};

export const theme = { TableTheme };

export function of(value: any | string | undefined | null): TableTheme | null {
  if (!value) {
    return null;
  }
  if (typeof value === 'string') {
    const t = getIgnoreCase(get(), value);
    if (t) {
      if (t instanceof TableTheme) {
        return t;
      }
      return new TableTheme(t, t);
    }
    return null;
  }
  if (value instanceof TableTheme) {
    return value;
  }
  return new TableTheme(value, value);
}

export function get(): { [key: string]: TableTheme } {
  // 这里可以扩展插件主题
  return extend(builtin, {});
}

export default {
  theme,
  of,
  get
};
