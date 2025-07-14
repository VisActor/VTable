/** 过滤条件类型 */
export enum FilterType {
  /** 值列表过滤 */
  VALUE_LIST = 'valueList',
  /** 条件过滤 */
  CONDITION = 'condition'
}

/** 过滤条件操作符 */
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  BETWEEN = 'between'
}

/** 值列表过滤定义 */
export interface IValueListFilter {
  /** 类型 */
  type: FilterType.VALUE_LIST;
  /** 值列表 */
  values: any[];
  /** 是否排除 */
  exclude?: boolean;
}

/** 条件过滤定义 */
export interface IConditionFilter {
  type: FilterType.CONDITION;
  operator: FilterOperator;
  value: any;
  value2?: any; // 用于between操作符
}

/** 过滤定义 */
export type Filter = IValueListFilter | IConditionFilter;

/** 列过滤定义 */
export interface IColumnFilter {
  columnKey: string;
  filter: Filter;
}

/** 过滤管理器接口 */
export interface IFilterManager {
  /** 设置列过滤器 */
  setFilter: (columnKey: string, filter: Filter) => void;

  /** 获取列过滤器 */
  getFilter: (columnKey: string) => Filter | null;

  /** 移除列过滤器 */
  removeFilter: (columnKey: string) => void;

  /** 应用过滤器 */
  applyFilters: () => void;

  /** 重置所有过滤器 */
  resetFilters: () => void;

  /** 获取过滤后的数据 */
  getFilteredData: () => any[][];

  /** 获取所有过滤器 */
  getAllFilters: () => IColumnFilter[];

  /** 获取过滤状态 */
  getFilterState: () => { [columnKey: string]: boolean };

  /** 监听过滤变化 */
  onFilterChange: (callback: (filters: IColumnFilter[]) => void) => void;

  /** 移除过滤变化监听 */
  offFilterChange: (callback: (filters: IColumnFilter[]) => void) => void;
}
