{{ target: table-pivotChart }}

# PivotChart

透视表格，配置对应的类型 PivotChartConstructorOptions，具体配置项如下：

{{ use: common-option-important(
    prefix = '#',
    tableType = 'pivotChart'
) }}

## records(Array)

表格数据。
目前支持的数据格式是，以北美大型超市销售情况为例：

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

## columnTree(Array)

列表头树，类型为:`(IDimensionHeaderNode|IIndicatorHeaderNode)[]`。其中 IDimensionHeaderNode 指的是维度非指标的维度值节点，IIndicatorHeaderNode 指的是指标名称节点。

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
  children?: (IDimensionHeaderNode|IIndicatorHeaderNode)[];
  /** 折叠状态 配合树形结构展示使用。注意：仅在rowTree中有效 */
  hierarchyState?: HierarchyState;
  /** 跨单元格合并显示该维度值，默认是1。如果表头层数最大是5，那么最末级剩下多大就合并多大层数的单元格 */
  levelSpan?: number;
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
  /** 跨单元格合并显示该维度值，默认是1。如果表头层数最大是5，那么最末级剩下多大就合并多大层数的单元格 */
  levelSpan?: number;
}
```

## rowTree(Array)

行表头树，结构同 columnTree。

{{ use: columns-dimension-define( prefix = '#',) }}

{{ use: rows-dimension-define( prefix = '#',) }}

## indicators(Array)

透视组合图中各个指标的具体配置，如样式，format，title 等，区别透视表，这里的指标类型仅支持配置 chart 类型。

{{ use: chart-indicator-type(
    prefix = '#') }}

## indicatorsAsCol(boolean) = true

指标显示在列上，默认是 true。如果配置为 false，则显示在行，指标以行展示

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

## renderChartAsync(boolean)

是否开启图表异步渲染

## renderChartAsyncBatchCount(number)

开启图表异步渲染，每批次渐进渲染图表个数，建议 5-10 个，具体可以视整体效果调整。默认值 5.

{{ use: common-option-secondary(
      prefix = '#',
      tableType = 'pivotChart'
  ) }}
