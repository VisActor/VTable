# VTable PivotTable 配置

> PivotTable 继承 BaseTableConstructorOptions（见 base-table-options.md），以下仅列出 PivotTable 专有配置。
> 维度/指标/表头树详细定义见 pivot-types.md。

## PivotTableConstructorOptions

```typescript
/** 透视表配置 */
export interface PivotTableConstructorOptions extends BaseTableConstructorOptions {
  /** 行维度定义（详见 pivot-types.md） */
  rows?: IRowDimension[];
  /** 列维度定义（详见 pivot-types.md） */
  columns?: IColumnDimension[];
  /** 指标定义（详见 pivot-types.md） */
  indicators?: (IIndicator | string)[];
  /** 行维度树（自定义结构，详见 pivot-types.md） */
  rowTree?: IHeaderTreeDefine[];
  /** 列维度树（自定义结构，详见 pivot-types.md） */
  columnTree?: IHeaderTreeDefine[];
  /** 角表头定义（详见 pivot-types.md） */
  corner?: ICornerDefine;
  /** 指标在行还是列方向显示 */
  indicatorsAsCol?: boolean;
  /** 指标标题 */
  indicatorTitle?: string;
  /** 是否隐藏指标名 */
  hideIndicatorName?: boolean;
  /** 行层级缩进 */
  rowHierarchyIndent?: number;
  /** 行层级类型 */
  rowHierarchyType?: 'grid' | 'tree';
  /** 行默认展开层级 */
  rowExpandLevel?: number;
  /** 行表头中维度文字与树结构对齐 */
  rowHierarchyTextStartAlignment?: boolean;
  /** 数据分析配置 */
  dataConfig?: IDataConfig;
  /** 是否开启数据懒加载 */
  enableDataAnalysis?: boolean;
  /** 补全指标节点 */
  supplementIndicatorNodes?: boolean;
  /** 全局编辑器 */
  editor?: string | IEditor | ((args: BaseCellInfo & { table: any }) => string | IEditor);
  /** 全局表头编辑器 */
  headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: any }) => string | IEditor);
  /** 编辑触发方式 */
  editCellTrigger?: 'doubleclick' | 'click' | 'api' | 'keydown' | ('doubleclick' | 'click' | 'api' | 'keydown')[];
  /** 分页 */
  pagination?: IPagination;
}
```

## 数据分析配置

```typescript
/** 数据分析配置 */
export interface IDataConfig {
  /** 聚合规则 */
  aggregationRules?: AggregationRule<AggregationType>[];
  /** 排序规则 */
  sortRules?: SortRule[];
  /** 过滤规则 */
  filterRules?: FilterRule[];
  /** 小计/合计配置 */
  totals?: Totals;
  /** 派生字段 */
  derivedFieldRules?: DerivedFieldRule[];
  /** 收集值 */
  collectValuesBy?: Record<string, CollectValueBy>;
  /** 是否为透视图模式 */
  isPivotChart?: boolean;
}
```

## 聚合规则

```typescript
/** 聚合规则 */
export interface AggregationRule<T extends AggregationType> {
  /** 指标字段 */
  indicatorKey: string;
  /** 聚合方式 */
  aggregationType: T;
  /** 聚合源字段 */
  field?: string | string[];
  /** 自定义聚合函数（当 aggregationType 为 CUSTOM 时） */
  aggregationFun?: (values: any[], records: any[]) => any;
}

/** 聚合类型 */
export type AggregationType = 'SUM' | 'COUNT' | 'MAX' | 'MIN' | 'AVG' | 'NONE' | 'CUSTOM' | 'RECALCULATE';
```

## 排序规则

```typescript
/** 排序规则 */
export interface SortRule {
  /** 排序维度 */
  sortField: string;
  /** 自然排序方向 */
  sortType?: 'ASC' | 'DESC';
  /** 按指定指标排序 */
  sortByIndicator?: string;
  /** 自定义排序值列表 */
  sortBy?: string[];
  /** 自定义排序函数 */
  sortFunc?: (a: any, b: any) => number;
}
```

## 过滤规则

```typescript
/** 过滤规则 */
export interface FilterRule {
  /** 过滤字段 */
  filterField?: string;
  /** 过滤值列表 */
  filteredValues?: any[];
  /** 自定义过滤函数 */
  filterFunc?: (record: any) => boolean;
}
```

## 合计 / 小计配置

```typescript
/** 合计 / 小计配置 */
export interface Totals {
  row?: TotalConfig;
  column?: TotalConfig;
}

export interface TotalConfig {
  /** 是否显示合计 */
  showGrandTotals?: boolean;
  /** 是否显示小计 */
  showSubTotals?: boolean;
  /** 合计文字 */
  grandTotalLabel?: string;
  /** 小计文字 */
  subTotalLabel?: string;
  /** 合计在前 */
  grandTotalsFirst?: boolean;
  /** 小计在前 */
  subTotalsFirst?: boolean;
}
```

## 依赖类型说明

```typescript
/** 派生字段规则 */
export interface DerivedFieldRule {
  /** 派生字段名 */
  fieldName: string;
  /** 依赖字段 */
  dependFields?: string[];
  /** 派生函数 */
  derivedFunc?: (record: any) => any;
}

/** 收集值配置 */
export interface CollectValueBy {
  /** 按哪个字段收集 */
  by: string;
  /** 收集类型 */
  type?: 'xField' | 'yField' | 'seriesField';
  /** 排序方向 */
  sortType?: 'ASC' | 'DESC';
  /** 排序回调 */
  sortFunc?: (a: any, b: any) => number;
}

/** 分页配置 */
export interface IPagination {
  totalCount?: number;
  perPageCount: number;
  currentPage?: number;
}

/** 编辑器接口（见 list-table-options.md） */
export interface IEditor {
  onStart: (context: EditContext) => void;
  onEnd: () => void;
  getValue: () => any;
  isEditorElement?: (target: HTMLElement) => boolean;
}

/** 单元格基础信息 */
export interface BaseCellInfo {
  col: number;
  row: number;
  dataValue: any;
  value: any;
}
```
