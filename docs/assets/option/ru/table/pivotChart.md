{{ target: table-pivotChart }}

#PivotChart

Pivot table, configure the corresponding type PivotChartConstructorOptions, the specific configuration items are as follows:

{{ use: common-option-important(
    prefix = '#',
    tableType = 'pivotChart'
) }}

## records(Array)

tabular data.
The currently supported data formats are, taking the sales of large supermarkets in North America as an example:

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

List header tree, type:`(IDimensionHeaderNode|IIndicatorHeaderNode)[]`. Among them, IDimensionHeaderNode refers to the dimension value node of the dimension non-indicator, and IIndicatorHeaderNode refers to the indicator name node.

** The specific configuration items of IDimensionHeaderNode are as follows:**

```
export interface IDimensionHeaderNode {
  /**
   * The unique identifier of the dimension, corresponding to the field name of the dataset
   */
  dimensionKey: string | number;
  /** dimension member value */
  value: string;
  /** Subdimension tree structure under dimension members. */
  children?: (IDimensionHeaderNode|IIndicatorHeaderNode)[] ;
  /** The collapsed state is used with the tree structure display. Note: only valid in rowTree */
  hierarchyState?: HierarchyState;
  /** Merge display of this dimension value across cells, default is 1. If the maximum number of header levels is 5, then the last level will merge as many cells as there are levels left. */
  levelSpan?: number;
}
```

** IIndicatorHeaderNode specific configuration items are as follows:**

```
export interface IIndicatorHeaderNode {
  /**
   * The key value of the indicator corresponds to the field name of the data set
   */
  indicatorKey: string | number;
  /**
   * Indicator names such as: "sales", "for example", correspond to the value displayed in the cell. You can leave it blank, if you don’t fill it in, take the value from the corresponding configuration of the indicators and display it
   */
  value?: string;
  /** Merge display of this dimension value across cells, default is 1. If the maximum number of header levels is 5, then the last level will merge as many cells as there are levels left. */
  levelSpan?: number;
}
```

##rowTree(Array)

Row header tree, same structure as columnTree.

{{ use: columns-dimension-define( prefix = '#',) }}

{{ use: rows-dimension-define( prefix = '#',) }}

## indicators(Array)

The specific configuration of each indicator in the perspective combination chart, such as style, format, title, etc., is different from the pivot table. The indicator type here only supports the configuration of the chart type.

{{ use: chart-indicator-type(
    prefix = '#') }}

## indicatorsAsCol(boolean) = true

The indicator is displayed on the column, default is true. If configured to false, it will be displayed in rows and the indicator will be displayed in rows.

## indicatorTitle(string)

indicator header for displaying the value to the corner header

## corner(Object)

The configuration and style customization of the corner table header.
{{ use: pivot-corner-define( prefix = '###',) }}

## hideIndicatorName(boolean) = false

Whether to hide the indicator name

## showRowHeader(boolean) = true

Whether to display row headers.

## showColumnHeader(boolean) = true

Whether to show column headers.

##rowHeaderTitle(Object)

Add a line to the top of the row header to display the dimension name, which can be customized or display the combination name of title

{{ use: pivot-header-title( prefix = '###',) }}

## columnHeaderTitle(Object)

Add a line to the top of the column header to display the dimension name, which can be customized or display the combination name of title

{{ use: pivot-header-title( prefix = '###',) }}

## renderChartAsync(boolean)

Whether to enable asynchronous rendering of charts

## renderChartAsyncBatchCount(number)

Turn on asynchronous rendering of charts. The number of progressively rendered charts in each batch is recommended to be 5-10. The details can be adjusted depending on the overall effect. Default value is 5.

{{ use: common-option-secondary(
      prefix = '#',
      tableType = 'pivotChart'
  ) }}
