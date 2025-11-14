import type { TYPES } from '@visactor/vtable';

export interface FilterOptions {
  /** 筛选器 ID，用于唯一标识筛选器 */
  id?: string;
  /** 筛选器图标 */
  filterIcon?: TYPES.ColumnIconOption;
  /** 筛选器激活图标 */
  filteringIcon?: TYPES.ColumnIconOption;
  /** 筛选功能启用钩子函数，返回指定列是否启用筛选功能 */
  enableFilter?: (field: number | string, column: TYPES.ColumnDefine) => boolean;
  /** 默认是否启用筛选（当 enableFilter 未定义时使用） */
  defaultEnabled?: boolean;
  /** 是否展示按条件筛选，按值筛选 UI */
  filterModes?: FilterMode[];
  /** 筛选器样式 */
  styles?: FilterStyles;
}

export type FilterMode = 'byValue' | 'byCondition';

export interface FilterState {
  filters: Map<string | number, FilterConfig>;
  // activeFilters: string[];  // 激活的筛选器的 ID 列表
}

export interface FilterConfig {
  enable: boolean; // 是否启用筛选
  field: string | number; // 对应表格列，同时作为筛选配置的唯一标识
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

/**
 * 筛选组件样式类型定义
 */

// 静态样式类型
interface StaticStyles {
  filterMenu?: Record<string, string>;
  filterPanel?: Record<string, string>;
  searchContainer?: Record<string, string>;
  searchInput?: Record<string, string>;
  optionsContainer?: Record<string, string>;
  optionItem?: Record<string, string>;
  optionLabel?: Record<string, string>;
  checkbox?: Record<string, string>;
  countSpan?: Record<string, string>;
  tabsContainer?: Record<string, string>;
  footerContainer?: Record<string, string>;
  clearLink?: Record<string, string>;
  conditionContainer?: Record<string, string>;
  formLabel?: Record<string, string>;
  operatorSelect?: Record<string, string>;
  rangeInputContainer?: Record<string, string>;
  addLabel?: Record<string, string>;
}

// 函数样式类型
interface FunctionStyles {
  tabStyle?: (isActive: boolean) => Record<string, string>;
  footerButton?: (isPrimary: boolean) => Record<string, string>;
  buttonStyle?: (isPrimary?: boolean) => Record<string, string>;
}

// 完整的筛选样式类型
export type FilterStyles = StaticStyles & FunctionStyles;
