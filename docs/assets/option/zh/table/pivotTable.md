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
