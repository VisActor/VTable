import type { ColorPropertyDefine } from '.';
import type { Either } from '../tools/helper';
import type { BaseTableAPI } from './base-table';

//#region 总计小计
export interface TotalsStatus {
  isRowTotal: boolean;
  isRowSubTotal: boolean;
  isColTotal: boolean;
  isColSubTotal: boolean;
}

export enum AggregationType {
  RECORD = 'RECORD',
  NONE = 'NONE', //不做聚合 只获取其中一条数据作为节点的record 取其field
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  AVG = 'AVG',
  COUNT = 'COUNT',
  CUSTOM = 'CUSTOM',
  RECALCULATE = 'RECALCULATE'
}
export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
  NORMAL = 'NORMAL',
  desc = 'desc',
  asc = 'asc',
  normal = 'normal'
}
export interface CalcTotals {
  aggregationType?: AggregationType; // 聚合方式
  // calcFunc?: (query: Record<string, any>, arr: Record<string, any>[]) => number;
}

export interface Total {
  /** 是否显示总计; 如果配置了total对象，showGrandTotals默认false */
  showGrandTotals: boolean;
  /** 是否显示小计;  如果配置了total对象，showSubTotals默认为true */
  showSubTotals: boolean;

  // // 计算总计方法
  // calcGrandTotals?: CalcTotals;
  // // 计算小计方法
  // calcSubTotals?: CalcTotals;
  /** 小计汇总维度定义 */
  subTotalsDimensions?: string[];
  /** 汇总节点显示名称  默认'总计' */
  grandTotalLabel?: string;
  /** 汇总节点显示名称  默认'小计' */
  subTotalLabel?: string;
}

export interface Totals {
  row?: Total & {
    /** 总计显示在上 默认false */
    showGrandTotalsOnTop?: boolean;
    /** 小计显示在上 默认false */
    showSubTotalsOnTop?: boolean;
  };
  column?: Total & {
    /** 总计显示在左 默认false */
    showGrandTotalsOnLeft?: boolean;
    /** 小计显示在左 默认false */
    showSubTotalsOnLeft?: boolean;
  };
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
  /**升序降序 ASC or DESC*/
  sortType?: SortType;
  /**根据指定具体顺序排序 */
  sortBy?: string[];
}
//3. 按指标值排序
export interface SortByIndicatorRule {
  /**排序维度 */
  sortField: string;
  /**升序降序 ASC or DESC*/
  sortType?: SortType;
  /**排序根据某个指标值 */
  sortByIndicator?: string;
  /**如果按指标值排序，还需要指定另外一个（行或列）方向的底层维度成员具体值。例如按照办公用品下的纸张 ['办公用品', '纸张'] */
  query?: string[];
}
//4. 自定义排序方法function
export interface SortFuncRule {
  /**排序维度 */
  sortField: string;
  /**升序降序 ASC or DESC*/
  sortType?: SortType;
  /**自定义排序函数 */
  sortFunc?: (a: any, b: any, sortType: SortType) => number;
}
//自定义排序方法参数
// export interface SortFuncParam extends SortRule {
//   data: Array<string | Record<string, any>>;
// }
export type SortRule = SortTypeRule | SortByRule | SortByIndicatorRule | SortFuncRule;
export type SortRules = SortRule[];
//#endregion 排序规则

//#region 过滤规则
export interface FilterFuncRule {
  filterFunc?: (row: Record<string, any>) => boolean;
}
export interface FilterValueRule {
  filterKey?: string;
  filteredValues?: unknown[];
}
export type FilterRules = Either<FilterFuncRule, FilterValueRule>[];
//#endregion 过滤规则

//#region 聚合规则
export interface AggregationRule<T extends AggregationType> {
  /** 区别于field 重新起个key值，供配置indicators使用 */
  indicatorKey: string;
  // 可以收集单个字段的聚合结果，或者收集多个字段的聚合结果
  field: string[] | string;
  aggregationType: string | T;
  /** aggregationType 配置为 AggregationType.CUSTOM 时，需要配置 aggregationFun。*/
  aggregationFun?: T extends AggregationType.CUSTOM ? (values: any[], records: any[]) => any : undefined;
  /**计算结果格式化 */
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => number | string;
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
  mapping?: ColorPropertyDefine;
};

//#endregion 映射规则

//#region 派生字段规则
export interface DerivedFieldRule {
  fieldName?: string;
  derivedFunc?: (record: Record<string, any>) => any;
}
export type DerivedFieldRules = DerivedFieldRule[];
//#endregion 派生字段规则

//#region 计算字段规则
export interface CalculateddFieldRule {
  /** 唯一标识，可以当做新指标的key，用于配置在 indicators 中在透视表中展示。 */
  key: string;
  /** 计算字段依赖的指标，可以是在 records 中具体对应的指标字段 or 不是数据records 中的字段
   * 如果依赖的指标不在 records 中，则需要在 aggregationRules 中明确配置，具体指明聚合规则和 indicatorKey 以在 dependIndicatorKeys 所使用。 */
  dependIndicatorKeys: string[];
  /** 计算字段的计算函数，依赖的指标值作为参数传入，返回值作为计算字段的值。   */
  calculateFun?: (dependFieldsValue: any) => any;
}

export type CalculateddFieldRules = CalculateddFieldRule[];
//#endregion 计算字段规则

/**
 * 基本表数据处理配置
 */
export interface IListTableDataConfig {
  groupByRules?: string[]; //按照行列维度分组规则；
  // aggregationRules?: AggregationRules; //按照行列维度聚合值计算规则；
  // sortRules?: SortTypeRule | SortByRule | SortFuncRule; //排序规则 不能简单的将sortState挪到这里 sort的规则在column中配置的；
  filterRules?: FilterRules; //过滤规则；
  // totals?: Totals; //小计或总计；
  // derivedFieldRules?: DerivedFieldRules;
}
/**
 * 透视表数据处理配置
 */
export interface IPivotTableDataConfig {
  aggregationRules?: AggregationRules; //按照行列维度聚合值计算规则；
  sortRules?: SortRules; //排序规则；
  filterRules?: FilterRules; //过滤规则；
  totals?: Totals; //小计或总计；
  /**
   * 目前mappding还不太好用  不建议使用  建议先用style
   */
  mappingRules?: MappingRules;
  derivedFieldRules?: DerivedFieldRules;
  calculatedFieldRules?: CalculateddFieldRules;
}

/**
 * 透视图数据处理配置
 */
export interface IPivotChartDataConfig extends IPivotTableDataConfig {
  /**
   * PivotChart专有
   */
  collectValuesBy?: Record<string, CollectValueBy>;
  /**
   * PivotChart专有
   */
  isPivotChart?: boolean;
  /**
   * PivotChart专有
   */
  dimensionSortArray?: string[];
}

/** 在处理数据的过程中 去额外收集某个维度的维度值范围 可为离散值或者连续值范围 */
export type CollectValueBy = {
  /** 要收集的字段按什么进行分组 */
  by: string[];
  /** 是否计算一个range范围 true的话对应的收集数据的结果为{max:number,min:number} */
  range?: boolean;
  /** 收集是按照sumBy字段相同的进行分组聚合 聚合结果求最大最小值；如果不设置该值 则按单条数据求最大最小值 */
  sumBy?: string[];
  /** 帮助计算列宽使用 如果是chart图表 收集的是xFiled的维度值 可以根据维度值的个数乘于图元宽度计算一个最优列宽*/
  type?: 'xField' | 'yField' | undefined;
  /** 如果是收集的离散值，离散值的排序依据 */
  sortBy?: string[];
  /** chartSpec中设置了markLine autoRange的情况 考虑扩展轴范围 */
  extendRange?: number | 'sum' | 'max';
};
export type CollectedValue = { max?: number; min?: number } | Array<string>;

//#region 提供给基本表格的类型
export type Aggregation = {
  aggregationType: AggregationType;
  showOnTop?: boolean;
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => string | number;
};

export type CustomAggregation = {
  aggregationType: AggregationType.CUSTOM;
  aggregationFun: (values: any[], records: any[]) => any;
  showOnTop?: boolean;
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => string | number;
};
//#endregion
