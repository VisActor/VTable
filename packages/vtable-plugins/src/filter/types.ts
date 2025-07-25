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

export type FilterOperator =
  // 通用
  | 'equals'
  | 'notEquals'
  // 数值
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'notBetween'
  // 文本
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'notStartsWith'
  | 'endsWith'
  | 'notEndsWith'
  // 复选框 | 单选框
  | 'isChecked'
  | 'isUnchecked';

export interface OperatorOption {
  value: FilterOperator;
  label: string;
  category: FilterOperatorCategory;
}

export enum FilterOperatorCategory {
  ALL = 'all',
  TEXT = 'text',
  NUMBER = 'number',
  COLOR = 'color',
  CHECKBOX = 'checkbox',
  RADIO = 'radio'
}
