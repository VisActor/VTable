import type * as VTable from '@visactor/vtable';
import type { FilterState, FilterOperator, FilterConfig } from './types';

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
        // 为条件筛选生成过滤函数
        const filterFunc = this.createFilterFunction(filter);
        this.filterFuncRule.push({
          filterFunc,
          fieldId: filter.id
        });
      }
    });

    table.updateFilterRules([...this.filterFuncRule, ...this.filterValueRule]);
  }

  /**
   * 根据筛选配置创建筛选函数
   */
  private createFilterFunction(filter: FilterConfig): (record: any) => boolean {
    const { field, operator, condition } = filter;

    // 如果没有操作符或条件，返回一个总是通过的函数
    if (!operator || condition === undefined) {
      return () => true;
    }

    return (record: any) => {
      const value = record[field];

      if (value === null || value === undefined) {
        return false;
      }

      // 根据操作符生成对应的比较逻辑
      switch (operator) {
        case 'equals':
          return this.compareValues(value, condition) === 0;
        case 'notEquals':
          return this.compareValues(value, condition) !== 0;
        case 'greaterThan':
          return this.compareValues(value, condition) > 0;
        case 'lessThan':
          return this.compareValues(value, condition) < 0;
        case 'greaterThanOrEqual':
          return this.compareValues(value, condition) >= 0;
        case 'lessThanOrEqual':
          return this.compareValues(value, condition) <= 0;
        case 'contains':
          return String(value).toLowerCase().includes(String(condition).toLowerCase());
        case 'startsWith':
          return String(value).toLowerCase().startsWith(String(condition).toLowerCase());
        case 'endsWith':
          return String(value).toLowerCase().endsWith(String(condition).toLowerCase());
        default:
          return true;
      }
    };
  }

  /**
   * 比较两个值
   * 返回: -1 (value < condition), 0 (value === condition), 1 (value > condition)
   */
  private compareValues(value: any, condition: any): number {
    // 处理日期比较
    if (value instanceof Date && condition instanceof Date) {
      const valueTime = value.getTime();
      const conditionTime = condition.getTime();
      return valueTime === conditionTime ? 0 : valueTime > conditionTime ? 1 : -1;
    }

    // 处理数字比较
    if (typeof value === 'number' && typeof condition === 'number') {
      return value === condition ? 0 : value > condition ? 1 : -1;
    }

    // 处理布尔值比较
    if (typeof value === 'boolean' && typeof condition === 'boolean') {
      return value === condition ? 0 : -1;
    }

    // 处理字符串比较 (不区分大小写)
    const valueStr = String(value).toLowerCase();
    const conditionStr = String(condition).toLowerCase();
    return valueStr === conditionStr ? 0 : valueStr > conditionStr ? 1 : -1;
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
