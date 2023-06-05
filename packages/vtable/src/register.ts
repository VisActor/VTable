import { icons as iconPlugins } from './plugins/icons';
import { themes as themePlugins } from './plugins/themes';
import { chartTypes as chartTypePlugins } from './plugins/chartTypes';
import type { ColumnIconOption, ITableThemeDefine } from './ts-types';

function register(obj: { [key: string]: any }, name: string, value: any): any {
  const old = obj[name];
  obj[name] = value;
  return old;
}

export function theme(name: string, theme?: ITableThemeDefine): ITableThemeDefine {
  if (theme !== null && theme !== undefined) {
    return register(themePlugins, name, theme);
  }
  return themePlugins[name];
}
export function icon(name: string, icon?: ColumnIconOption): ColumnIconOption {
  if (icon !== null && icon !== undefined) {
    return register(iconPlugins, name, icon);
  }
  return iconPlugins[name];
}
export function chartType(name: string, chartType?: any): any {
  if (chartType !== null && chartType !== undefined) {
    return register(chartTypePlugins, name, chartType);
  }
  return chartTypePlugins[name];
}
// 清理注册的全局theme icon chartType
function clear(obj: any) {
  for (const key in obj) {
    delete obj[key];
  }
}
/**
 * 清理注册的全局theme icon chartType
 */
export function clearAll() {
  clear(themePlugins);
  clear(iconPlugins);
  clear(chartTypePlugins);
}
