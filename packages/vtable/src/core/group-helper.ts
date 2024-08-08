import { isArray, isString } from '@visactor/vutils';
import type { GroupByOption } from '../ts-types';

export function getGroupByDataConfig(groupByOption: GroupByOption) {
  // no sort temply
  if (isString(groupByOption)) {
    return { groupByRules: [groupByOption] };
  }
  if (isArray(groupByOption)) {
    const groupByRules = groupByOption.map(item => {
      if (isString(item)) {
        return item;
      }
      return item.key;
    });
    return { groupByRules };
  }

  return {};
}
