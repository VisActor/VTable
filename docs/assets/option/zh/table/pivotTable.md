{{ target: table-pivotTable }}

# PivotTable

透视表格，配置对应的类型 PivotTableConstructorOptions，具体配置项如下：

{{ use: common-option-important(
    prefix = '#',
    tableType = 'pivotTable'
) }}

## records(Array)

表格数据。
目前支持传入平坦化的数据格式，以北美大型超市销售情况为例：

```
[
  {
    "Category": "Technology",
    "Sales": "650.5600051879883",
    "City": "Amarillo"
  },
  {
    "Category": "Technology",
    "Profit": "94.46999931335449",
    "City": "Amarillo"
  },
  {
    "Category": "Furniture",
    "Quantity": "14",
    "City": "Amarillo"
  },
  {
    "Category": "Furniture",
    "Sales": "3048.5829124450684",
    "City": "Amarillo"
  },
  {
    "Category": "Furniture",
    "Profit": "-507.70899391174316",
    "City": "Amarillo"
  },
  {
    "Category": "Office Supplies",
    "Quantity": "60",
    "City": "Anaheim"
  }
]
```

## enableDataAnalysis(boolean)
透视表是否开启数据分析。 默认false

如果传入的数据records是明细数据，需要VTable做聚合分析则开启该配置将其设置为true。

如传入数据是经过聚合好的，为了提升性能这里设置为false，同时呢要求传入自己组织好的行头树结构columnTree和rowTree。
## dataConfig(IDataConfig)
数据分析相关配置 enableDataAnalysis开启后该配置才会有效。
```
/**
 * 数据处理配置
 */
export interface IDataConfig {
  aggregationRules?: AggregationRules; //按照行列维度聚合值计算规则；
  sortRules?: SortRules; //排序规则；
  filterRules?: FilterRules; //过滤规则；
  totals?: Totals; //小计或总计；
  /**
   * 目前mappding还不太好用  不建议使用  建议先用style
   */
  mappingRules?: MappingRules;
  derivedFieldRules?: DerivedFieldRules;
}
```

### aggregationRules(AggregationRules)
求指标的聚合方式；具体AggregationRules的定义如下：
```
export type AggregationRules = AggregationRule<AggregationType>[];

export interface AggregationRule<T extends AggregationType> {
  /** 区别于field 重新起个key值，供配置indicators使用 */
  indicatorKey: string;
  // 可以收集单个字段的聚合结果，或者收集多个字段的聚合结果
  field: T extends AggregationType.RECORD ? string[] | string : string;
  aggregationType: T;
  /**计算结果格式化 */
  formatFun?: (num: number) => string;
}
```
其中AggregationType聚合方式有如下6种，最常用的是SUM。RECORD类型主要是给透视图内部使用的。
```
export enum AggregationType {
  RECORD = 'RECORD',
  SUM = 'SUM',
  MIN = 'MIN',
  MAX = 'MAX',
  AVG = 'AVG',
  COUNT = 'COUNT',
  NONE = 'NONE'
}
```
### sortRules(SortRules)
排序规则配置，具体定义如下：
```
export type SortRules = SortRule[];
export type SortRule = SortTypeRule | SortByRule | SortByIndicatorRule | SortFuncRule;
```
其中排序规则支持四种方式：
1. SortTypeRule: 根据字段排序，如根据年份升序排列:`{"sortField": "Year", "sortType": "ASC"}`。
```
//1. 指定排序类型
export interface SortTypeRule {
  /**排序维度 */
  sortField: string;
  /**升序降序 ASC or DESC*/
  sortType?: SortType;
}
```
2. SortByRule:按维度成员指定排序，如根据地区维度值排列:`{"sortField": "Region", "sortBy": ["华南","华中","华北","中南","西南"]}`。
```
//2. 按维度成员指定排序
export interface SortByRule {
  /**排序维度 */
  sortField: string;
  /**根据指定具体顺序排序 */
  sortBy?: string[];
}
```
3. SortByIndicatorRule:根据指标值排序，如根据类别办公用下销售金额降序来排列地区维度值:`{sortField:'Region',sortByIndicator: "Sales", sortType: "DESC",query:['办公用品']}`。
```
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
```
4. SortFuncRule: 支持通过函数自定义排序规则，如根据计算后的指标值排序:`{"sortField": "Region", sortFunc: (a, b) => a.sales - b.sales}`。
```
//4. 自定义排序方法function
export interface SortFuncRule {
  /**排序维度 */
  sortField: string;
  /**自定义排序函数 */
  sortFunc?: (a: any, b: any) => number;
}
```
### filterRules(FilterRules)
数据过滤规则，具体类型定义：
```
export type FilterRules = FilterRule[];
```
过滤规则可设置多重，只有每一项过滤规则都满足的情况下数据才会被保留。
```
//#region 过滤规则
export interface FilterRule {
  filterKey?: string;
  filteredValues?: unknown[];
  filterFunc?: (row: Record<string, any>) => boolean;
}
```
### totals(Totals)
设置汇总，小计总计。
```
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
```

行或列方法分别设置汇总规则：
```
export interface Total {
  // 是否显示总计
  showGrandTotals: boolean;
  // 是否显示小计
  showSubTotals: boolean;
  // 小计汇总维度定义
  subTotalsDimensions?: string[];
  // 默认'总计'
  grandTotalLabel?: string;
  // 默认'小计'
  subTotalLabel?: string;
}
```
### derivedFieldRules(DerivedFieldRules)
增加派生字段
```
export type DerivedFieldRules = DerivedFieldRule[];
```
具体作用是为源数据生产新字段的方式，由用户自定义，这个功能主要是给每条数据新增了一个字段，这个字段可以用到其他数据规则中，如sort或者作为指标或者作为columns中的某一次维度。
```
export interface DerivedFieldRule {
  fieldName?: string;
  derivedFunc?: (record: Record<string, any>) => any;
}
```
## columnTree(Array)

列表头树，类型为:`IDimensionHeaderNode|IIndicatorHeaderNode[]`。其中 IDimensionHeaderNode 指的是维度非指标的维度值节点，IIndicatorHeaderNode 指的是指标名称节点。

** IDimensionHeaderNode 具体配置项如下：**

```
export interface IDimensionHeaderNode {
  /**
   * 维度的唯一标识，对应数据集的字段名称
   */
  dimensionKey: string | number;
  /** 维度成员值 */
  value: string;
  /** 维度成员下的子维度树结构 */
  children?: IDimensionHeaderNode|IIndicatorHeaderNode[];
  /** 折叠状态 配合树形结构展示使用。注意：仅在rowTree中有效 */
  hierarchyState?: HierarchyState;
}
```

** IIndicatorHeaderNode 具体配置项如下：**

```
export interface IIndicatorHeaderNode {
  /**
   * 指标的key值 对应数据集的字段名
   */
  indicatorKey: string | number;
  /**
   * 指标名称 如：“销售额”，“例如”， 对应到单元格显示的值。可不填，不填的话 从indicators的对应配置中取值显示
   */
  value?: string;
}
```

## rowTree(Array)

行表头树，结构同 columnTree。

{{ use: columns-dimension-define( prefix = '#',) }}

{{ use: rows-dimension-define( prefix = '#',) }}

{{ use: indicators-define( prefix = '#',) }}

## rowHierarchyType('grid' | 'tree')

层级维度结构显示形式，平铺还是树形结构。

[平铺示例](../demo/table-type/pivot-table) [树形示例](../demo/table-type/pivot-table-tree)

{{ use: extension-rows-dimension-define( prefix = '#',) }}
## rowExpandLevel(number)

初始化展开层数。除了这里可以配置统一节点的展开层数，还可以结合配置项`hierarchyState`设置每个结点的展开状态。

## rowHierarchyIndent(number)

如果设置了树形展示，子节点单元格中显示内容相比其父节点内容的缩进距离。

## indicatorTitle(string)

指标标题 用于显示到角头的值

## corner(Object)

角表头各项配置及样式自定义。
{{ use: pivot-corner-define( prefix = '###',) }}

## hideIndicatorName(boolean) = false

是否隐藏指标名称

## showRowHeader(boolean) = true

是否显示行表头。

## showColumnHeader(boolean) = true

是否显示列表头。

## rowHeaderTitle(Object)

行表头最上层增加一行来显示维度名称 可以自定义或者显示 title 组合名

{{ use: pivot-header-title( prefix = '###',) }}

## columnHeaderTitle(Object)

列表头最上层增加一行来显示维度名称 可以自定义或者显示 title 组合名

{{ use: pivot-header-title( prefix = '###',) }}

## columnResizeType(string)

调整列宽的生效范围，可配置项：

- `column`: 调整列宽只调整当前列
- `indicator`: 调整列宽时对应相同指标的列都会被调整
- `indicatorGroup`: 调整同父级维度下所有指标列的宽度
- `all`： 所有列宽都被调整

## pivotSortState(Array)

设置排序状态，只对应按钮展示效果 无数据排序逻辑

```
 {
    dimensions: IDimensionInfo[];
    order: 'desc' | 'asc' | 'normal';
  }[];
```

- dimensions 设置要排序的维度信息，是一个 IDimensionInfo 类型的数组。

{{ use: common-IDimensionInfo()}}

- order 指定排序方式，可以是 'desc'（降序）、'asc'（升序）或 'normal'（不排序）。

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'pivotTable'
) }}

## editor (string|Object|Function)

全局配置单元格编辑器
```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```
其中IEditor是@visactor/vtable-editors中定义的编辑器接口，具体可以参看源码：https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts。

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}
