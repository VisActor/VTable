import { isArray, isString } from '@visactor/vutils';
import type { GroupByOption } from '../ts-types';

export function getGroupByDataConfig(groupByOption: GroupByOption, addRecordRule: 'Array' | 'Object') {
  // no sort temply
  if (isString(groupByOption)) {
    return { groupByRules: [groupByOption], addRecordRule };
  }
  if (isArray(groupByOption)) {
    const groupByRules = groupByOption.map(item => {
      if (isString(item)) {
        return item;
      }
      return item.key;
    });
    return { groupByRules, addRecordRule };
  }

  return { addRecordRule };
}
