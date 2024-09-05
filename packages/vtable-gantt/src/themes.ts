// /* eslint-disable sort-imports */
// import { extend, getIgnoreCase } from './tools/helper';
// import darkTheme from './themes/DARK';
// import brightTheme from './themes/BRIGHT';
// import arcoTheme from './themes/ARCO';
// import defaultTheme from './themes/DEFAULT';
// import materialDesignTheme from './themes/SIMPLIFY';
// import { themes as plugins } from './plugins/themes';
// import { TableTheme } from './themes/theme';
// import type { ITableThemeDefine } from './ts-types';
// export const DARK = new TableTheme(darkTheme, darkTheme);
// export const BRIGHT = new TableTheme(brightTheme, brightTheme);
// export const ARCO = new TableTheme(arcoTheme, arcoTheme);
// export const DEFAULT = new TableTheme(defaultTheme, defaultTheme);
// export const SIMPLIFY = new TableTheme(materialDesignTheme, materialDesignTheme);

// const builtin: { [key: string]: TableTheme } = {
//   DEFAULT,
//   SIMPLIFY,
//   ARCO,
//   DARK,
//   BRIGHT
// };
// // let defTheme = DEFAULT;
// export const theme = { TableTheme };
// export function of(value: ITableThemeDefine | string | undefined | null): TableTheme | null {
//   if (!value) {
//     return null;
//   }
//   if (typeof value === 'string') {
//     const t = getIgnoreCase(get(), value);
//     if (t) {
//       if (t instanceof TableTheme) {
//         return t;
//       }
//       return new TableTheme(t, t);
//     }
//     return null;
//   }
//   if (value instanceof TableTheme) {
//     return value;
//   }
//   return new TableTheme(value, value);
// }

// export function get(): { [key: string]: TableTheme } {
//   return extend(builtin, plugins);
// }
// export { ITableThemeDefine };
// export default {
//   DARK,
//   BRIGHT,
//   ARCO,
//   DEFAULT,
//   SIMPLIFY,
//   theme,
//   of,
//   get
// };
