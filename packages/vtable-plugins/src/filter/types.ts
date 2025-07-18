import type * as VTable from '@visactor/vtable';

export interface FilterOptions {
  id?: string;
  filterIcon?: VTable.TYPES.ColumnIconOption;
  filteringIcon?: VTable.TYPES.ColumnIconOption;
}

export interface FilterState {
  filters: Map<string, FilterConfig>;
  // activeFilters: string[];  // 激活的筛选器的 ID 列表
}

export interface FilterConfig {
  id: string; // 列筛选设置的唯一标识，用来区分不同的列筛选设置
  enable: boolean;
  field: string; // 对应表格列
  type: 'byValue' | 'byCondition'; // 筛选类型
  values?: any[]; // 按值筛选时的值列表
  operator?: FilterOperator; // 按条件筛选时的操作符
  condition?: any; // 按条件筛选时的具体条件
}

export enum FilterActionType {
  ADD_FILTER,
  REMOVE_FILTER,
  UPDATE_FILTER,
  ENABLE_FILTER,
  DISABLE_FILTER,
  CLEAR_ALL_FILTERS,
  APPLY_FILTERS
}

export interface FilterAction {
  type: FilterActionType;
  payload: any;
}

export interface ValueFilterOptionDom {
  id: string;
  originalValue: any;
  itemContainer: HTMLDivElement;
  checkbox: HTMLInputElement;
  countSpan: HTMLSpanElement;
}

export interface ColumnDefinition {
  field: string;
  title: string;
  dataType: 'string' | 'number' | 'boolean' | 'date';
}

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual';
