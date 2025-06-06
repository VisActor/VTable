import { icons as iconPlugins } from './icons';
import { themes as themePlugins } from './themes/themes';
import { chartTypes as chartTypePlugins } from './chartModule';
import type { ColumnIconOption, ITableThemeDefine } from './ts-types';
import type { IEditor } from '@visactor/vtable-editors';
import { editors } from './edit/editors';
import type { Aggregator } from './ts-types/dataset/aggregation';
import { registeredAggregators } from './ts-types/dataset/aggregation';

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
export function chartModule(name: string, chartModule?: any): any {
  if (chartModule !== null && chartModule !== undefined) {
    return register(chartTypePlugins, name, chartModule);
  }
  return chartTypePlugins[name];
}
export function editor(name: string, editor?: IEditor): IEditor {
  if (editor !== null && editor !== undefined) {
    return register(editors, name, editor);
  }
  return editors[name];
}
export function aggregator(
  aggregationType: string,
  aggregation: {
    new (args: { key: string; field: string; formatFun?: any }): Aggregator;
  }
) {
  if (aggregation !== null && aggregation !== undefined) {
    register(registeredAggregators, aggregationType, aggregation);
  }
}
// 清理注册的全局theme icon chartModule
function clear(obj: any) {
  for (const key in obj) {
    delete obj[key];
  }
}
/**
 * 清理注册的全局theme icon chartModule
 */
export function clearAll() {
  clear(themePlugins);
  clear(iconPlugins);
  clear(chartTypePlugins);
  clear(editors);
  clear(registeredAggregators);
}
