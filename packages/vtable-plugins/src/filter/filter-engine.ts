import type * as VTable from '@visactor/vtable';
import type { FilterState } from './types';

/**
 * 筛选引擎，用于进行实际的筛选操作
 */
export class FilterEngine {
  filterFuncRule: (VTable.TYPES.FilterFuncRule & { fieldId?: string })[] = [];
  filterValueRule: VTable.TYPES.FilterValueRule[] = [];

  applyFilter(state: FilterState, table: VTable.ListTable | VTable.PivotTable) {
    const { filters } = state;
    this.filterFuncRule = [];
    this.filterValueRule = [];

    filters.forEach(filter => {
      if (!filter.enable) {
        return;
      }

      if (filter.type === 'byValue') {
        this.filterValueRule.push({
          filterKey: filter.id,
          filteredValues: filter.values
        });
      } else if (filter.type === 'byCondition') {
        this.filterFuncRule.push({
          filterFunc: filter.condition,
          fieldId: filter.id
        });
      }
    });

    table.updateFilterRules([...this.filterFuncRule, ...this.filterValueRule]);
  }

  clearAllFilter(table: VTable.ListTable | VTable.PivotTable) {
    this.filterFuncRule = [];
    this.filterValueRule = [];
    table.updateFilterRules([]);
  }

  clearFilter(table: VTable.ListTable | VTable.PivotTable, fieldId: string) {
    this.filterValueRule = this.filterValueRule.filter(rule => rule.filterKey !== fieldId);
    this.filterFuncRule = this.filterFuncRule.filter(rule => rule.fieldId !== fieldId);

    table.updateFilterRules([...this.filterFuncRule, ...this.filterValueRule]);
  }
}
