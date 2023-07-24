import type { SortOrder } from './common';

//#region 总计小计
export interface TotalsStatus {
  isRowTotal: boolean;
  isRowSubTotal: boolean;
  isColTotal: boolean;
  isColSubTotal: boolean;
}

export enum AggregationType {
  RECORD = 'RECORD',
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  AVG = 'AVG',
  COUNT = 'COUNT'
}
export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC'
}
export interface CalcTotals {
  aggregationType?: AggregationType; // 聚合方式
  // calcFunc?: (query: Record<string, any>, arr: Record<string, any>[]) => number;
}

export interface Total {
  // 是否显示总计
  showGrandTotals: boolean;
  // 是否显示小计
  showSubTotals: boolean;
  // // 计算总计方法
  // calcGrandTotals?: CalcTotals;
  // // 计算小计方法
  // calcSubTotals?: CalcTotals;
  // 小计汇总维度定义
  subTotalsDimensions?: string[];
  // 默认'总计'
  grandTotalLabel?: string;
  // 默认'小计'
  subTotalLabel?: string;
}

export interface Totals {
  row?: Total;
  column?: Total;
}

//#endregion 总计小计

//#region 排序规则
// export interface SortRule {
//   //排序维度
//   sortField: string;
//   //以下均为排序方法
//   //1. 指定排序类型
//   sortType?: SortType;
//   //2. 按维度成员指定排序
//   sortBy?: string[];
//   //3. 按指标值排序
//   sortByIndicator?: string;
//   //如果按指标值排序，还需要指定另外一个（行或列）方向的底层维度成员具体值
//   query?: string[];
//   //4. 自定义排序方法function
//   sortFunc?: (a: any, b: any) => number;
// }
//以下均为排序方法
//1. 指定排序类型
export interface SortTypeRule {
  /**排序维度 */
  sortField: string;
  /**升序降序 ASC or DESC*/
  sortType?: SortType;
}
//2. 按维度成员指定排序
export interface SortByRule {
  /**排序维度 */
  sortField: string;
  /**根据指定具体顺序排序 */
  sortBy?: SortOrder[];
}
//3. 按指标值排序
export interface SortByIndicatorRule {
  /**排序维度 */
  sortField: string;
  /**排序根据某个指标值 */
  sortByIndicator?: string;
  /**如果按指标值排序，还需要指定另外一个（行或列）方向的底层维度成员具体值。例如按照办公用品下的纸张 ['办公用品', '纸张'] */
  query?: string[];
}
//4. 自定义排序方法function
export interface SortFuncRule {
  /**排序维度 */
  sortField: string;
  /**自定义排序函数 */
  sortFunc?: (a: any, b: any) => number;
}
//自定义排序方法参数
// export interface SortFuncParam extends SortRule {
//   data: Array<string | Record<string, any>>;
// }
export type SortRule = SortTypeRule | SortByRule | SortByIndicatorRule | SortFuncRule;
export type SortRules = SortRule[];
//#endregion 排序规则

//#region 过滤规则
export interface FilterRule {
  filterKey?: string;
  filteredValues?: unknown[];
  filterFunc?: (row: Record<string, any>) => boolean;
}
export type FilterRules = FilterRule[];
//#endregion 过滤规则

//#region 聚合规则
export interface AggregationRule<T extends AggregationType> {
  /** 区别于field 重新起个key值，供配置indicators使用 */
  indicatorKey: string;
  // 可以收集单个字段的聚合结果，或者收集多个字段的聚合结果
  field: T extends AggregationType.RECORD ? string[] | string : string;
  aggregationType: T;
  /**计算结果格式化 */
  formatFun?: (num: number) => string;
}
export type AggregationRules = AggregationRule<AggregationType>[];
//#endregion 聚合规则

//#region 映射规则
export interface MappingRule {
  label?: LabelMapping;
  symbol?: SymbolMapping;
  bgColor?: MappingFuncRule;
}
export type MappingRules = MappingRule[];
export interface LabelMapping {
  text?: MappingFuncRule;
  color?: MappingFuncRule;
}
export interface SymbolMapping {
  shape?: 'circle' | 'rect';
  color?: MappingFuncRule;
  size?: MappingFuncRule;
}

export type MappingFuncRule = {
  indicatorKey: string;
  mapping?: (table: any, value: number) => string;
};

//#endregion 映射规则
export interface DerivedFieldRule {
  fieldName?: string;
  derivedFunc?: (record: Record<string, any>) => any;
}
export type DerivedFieldRules = DerivedFieldRule[];
/**
 * 数据处理配置
 */
export interface IDataConfig {
  // rows: string[]; //行维度字段数组；
  // columns: string[]; //列维度字段数组；
  aggregationRules?: AggregationRules; //按照行列维度聚合值计算规则；
  // indicators?: string[]; //具体展示指标；
  // descriptions?: any[]; //字段标题及描述信息；
  sortRules?: SortRules; //排序规则；
  filterRules?: FilterRules; //过滤规则；
  totals?: Totals; //小计或总计；
  // indicatorsAsCol?: boolean;
  // hideIndicatorName?: boolean;

  mappingRules?: MappingRules;
  derivedFieldRules?: DerivedFieldRules;

  collectValuesBy?: Record<string, CollectValueBy>;
  isPivotChart?: boolean;
}

/** 在处理数据的过程中 去额外收集某个维度的维度值范围 可为离散值或者连续值范围 */
export type CollectValueBy = {
  // field: string;
  by: string[];
  /** 是否计算一个range范围 true的话对应的收集数据的结果为{max:number,min:number} */
  range?: boolean;
  /** 收集是按照sumBy字段相同的进行分组聚合 聚合结果求最大最小值；如果不设置该值 则按单条数据求最大最小值 */
  sumBy?: string[];
  /** 帮助计算列宽使用 如果是chart图表 收集的是xFiled的维度值 可以根据维度值的个数乘于图元宽度计算一个最优列宽*/
  type?: 'xField' | 'yField' | undefined;
};
export type CollectedValue = { max?: number; min?: number } | Set<string>;
