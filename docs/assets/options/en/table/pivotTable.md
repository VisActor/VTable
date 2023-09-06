{{ target: table-pivotTable }}

# PivotTable

Pivot table, configure the corresponding type PivotTableConstructorOptions, with specific options as follows:

{{ use: common-option-important(
    prefix = '#',
    tableType = 'pivotTable'
) }}

## records(Array)

tabular data.
Currently, it supports incoming flattened data formats, taking the sales of large supermarkets in North America as an example:

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

Column header tree, type: `IDimensionHeaderNode|IIndicatorHeaderNode[]`. Among them, IDimensionHeaderNode refers to the dimension value node of non-indicator dimensions, and IIndicatorHeaderNode refers to the indicator name node.

** Specific configuration of IDimensionHeaderNode is as follows: **

```
export interface IDimensionHeaderNode {
  /**
   * Unique identifier of the dimension, corresponding to the field name in the dataset
   */
  dimensionKey: string | number;
  /** Dimension member value */
  value: string;
  /** The tree structure of the sub-dimensions under the member */
  children?: IDimensionHeaderNode|IIndicatorHeaderNode[];
  /** Collapse status Used with tree structure display. Note: only valid in rowTree */
  hierarchyState?: HierarchyState;
}
```

** Specific configuration of IIndicatorHeaderNode is as follows: **

```
export interface IIndicatorHeaderNode {
  /**
   * The key value of the indicator corresponds to the field name in the dataset
   */
  indicatorKey: string | number;
  /**
   * Indicator name, such as: "Sales Amount", "example", corresponding to the value displayed in the cell. Optional, if not filled in, the value will be taken from the corresponding configuration in indicators
   */
  value?: string;
}
```

## rowTree(Array)

Row header tree, with a structure similar to columnTree.

{{ use: columns-dimension-define( prefix = '#',) }}

{{ use: rows-dimension-define( prefix = '#',) }}

{{ use: indicators-define( prefix = '#',) }}

## rowHierarchyType('grid' | 'tree')

Hierarchy display style for dimensional structure, flat or tree.

[Flat Example](../examples/table-type/pivot-table) [Tree Example](../examples/table-type/pivot-table-tree)

## rowExpandLevel(number)

Initial expansion level. In addition to configuring the expansion level of the unified node here, you can also set the expansion status of each node with the configuration item `hierarchyState`.

## rowHierarchyIndent(number)

If tree display is set, the indentation distance of content displayed in the child cell compared to its parent cell content.

## indicatorTitle(string)

Indicator title used to display the value in the corner header

## corner(Object)

Corner header configuration and custom styles.
{{ use: pivot-corner-define( prefix = '###',) }}

## hideIndicatorName(boolean) = false

Whether to hide the indicator name

## showRowHeader(boolean) = true

Whether to display the row header.

## showColumnHeader(boolean) = true

Whether to display the column header.

## rowHeaderTitle(Object)

Add a row in the row header to display the dimension name, which can be customized or display the title combined name

{{ use: pivot-header-title( prefix = '###',) }}

## columnHeaderTitle(Object)

Add a row in the column header to display the dimension name, which can be customized or display the title combined name

{{ use: pivot-header-title( prefix = '###',) }}

## columnResizeType(string)

The range of effects when adjusting column width, configurable options:

- `column`: Adjusting the column width only adjusts the current column
- `indicator`: When adjusting the column width, the corresponding columns of the same indicator will be adjusted
- `indicatorGroup`: Adjust the width of all indicator columns under the same parent dimension
- `all`: All column widths are adjusted

## pivotSortState(Array)

Set the sorting state, only corresponding to the display effect of the button without data sorting logic

```
 {
    dimensions: IDimensionInfo[];
    order: 'desc' | 'asc' | 'normal';
  }[];
```

- dimensions Set the dimensions to be sorted, which is an array of IDimensionInfo type.

{{ use: common-IDimensionInfo()}}

- order specifies the sorting method, which can be 'desc' (descending), 'asc' (ascending) or 'normal' (unsorted).

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'pivotTable'
) }}
