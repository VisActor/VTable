import { isEqual } from '@visactor/vutils';
import type { ITableThemeDefine } from '../ts-types/theme';
import type { TableTheme } from './theme-define';

export const themes: { [key: string]: TableTheme } = {};

/**
 * 判断 TableTheme 实例（通过 getExtendTheme 等可访问的 API）
 */
function isTableTheme(theme: unknown): theme is TableTheme {
  return !!theme && typeof (theme as TableTheme).getExtendTheme === 'function';
}

/**
 * 将主题配置提取为可比较的普通对象，用于深度对比
 * - TableTheme: 递归提取 extend + superTheme 链
 * - ITableThemeDefine: 直接返回（支持嵌套对象、数组、函数按引用比较）
 */
function getThemeComparableConfig(theme: ITableThemeDefine | TableTheme): unknown {
  if (isTableTheme(theme)) {
    const extend = theme.getExtendTheme();
    const internal = (theme as unknown as { internalTheme?: { superTheme?: ITableThemeDefine | TableTheme } })
      .internalTheme;
    const superTheme = internal?.superTheme;
    return {
      name: theme.name,
      extend,
      superTheme: superTheme ? getThemeComparableConfig(superTheme) : undefined
    };
  }
  return theme;
}

export function tableThemeIsChanged(
  prevTableTheme: ITableThemeDefine | undefined,
  newTableTheme: ITableThemeDefine | undefined
): boolean {
  if (!prevTableTheme && !newTableTheme) {
    return false;
  }
  if (!prevTableTheme && newTableTheme) {
    return true;
  }
  if (prevTableTheme && !newTableTheme) {
    return true;
  }
  if (prevTableTheme === newTableTheme) {
    return false;
  }
  const prev = prevTableTheme as ITableThemeDefine | TableTheme;
  const next = newTableTheme as ITableThemeDefine | TableTheme;
  const prevConfig = getThemeComparableConfig(prev);
  const newConfig = getThemeComparableConfig(next);
  return !isEqual(prevConfig, newConfig);
}
