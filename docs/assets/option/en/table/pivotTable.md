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
## enableDataAnalysis(boolean)
Whether the pivot table enables data analysis. Default false.

If the incoming data records are detailed data and VTable is required for aggregate analysis, enable this configuration.

If the incoming data is aggregated, in order to improve performance, it is set to false and columnTree and rowTree are required to be passed in.
## dataConfig(IDataConfig)
Data analysis related configuration This configuration will be effective only after enableDataAnalysis is turned on.
```
/**
 * Data processing configuration
 */
export interface IDataConfig {
  aggregationRules?: AggregationRules; //Aggregation value calculation rules according to row and column dimensions;
  sortRules?: SortRules; //Sort rules;
  filterRules?: FilterRules; //Filter rules;
  totals?: Totals; //Subtotal or total;
  /**
   * At present, mapping is not easy to use. It is not recommended to use it. It is recommended to use style first.
   */
  mappingRules?: MappingRules;
  derivedFieldRules?: DerivedFieldRules;
}
```

### aggregationRules(AggregationRules)
Find the aggregation method of indicators; the specific definition of AggregationRules is as follows:
```
export type AggregationRules = AggregationRule<AggregationType>[];

export interface AggregationRule<T extends AggregationType> {
  /** Different from field, re-create the key value for use by configuring indicators */
  indicatorKey: string;
  // You can collect the aggregate results of a single field, or collect the aggregate results of multiple fields
  field: T extends AggregationType.RECORD ? string[] | string : string;
  aggregationType: T;
  /**Formatting calculation results */
  formatFun?: (num: number) => string;
}
```
Among them, the AggregationType aggregation methods include the following 6 types, the most commonly used one is SUM. The RECORD type is mainly used internally by perspectives.
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
Sorting rule configuration, specifically defined as follows:
```
export type SortRules = SortRule[];
export type SortRule = SortTypeRule | SortByRule | SortByIndicatorRule | SortFuncRule;
```
The sorting rules support four methods:
1. SortTypeRule: Sort by field, such as ascending order by year: `{"sortField": "Year", "sortType": "ASC"}`.
```
//1. Specify the sorting type
export interface SortTypeRule {
  /**Sort dimensions */
  sortField: string;
  /**Ascending order Descending order ASC or DESC*/
  sortType?: SortType;
}
```
2. SortByRule: Sort by dimension members specified, such as sorting by region dimension value: `{"sortField": "Region", "sortBy": ["South China", "Central China", "North China", "Central South", "Southwest China" "]}`.
```
//2. Sort by dimension member specification
export interface SortByRule {
  /**Sort dimensions */
  sortField: string;
  /** Sort according to the specified order */
  sortBy?: string[];
}
```
3. SortByIndicatorRule: Sort according to the indicator value, such as sorting the regional dimension values in descending order according to the sales amount under the category office supplies: `{sortField:'Region',sortByIndicator: "Sales", sortType: "DESC",query:['Office supplies ']}`.
```
//3. Sort by indicator value
export interface SortByIndicatorRule {
  /**Sort dimensions */
  sortField: string;
  /**Ascending order Descending order ASC or DESC*/
  sortType?: SortType;
  /** Sort according to a certain indicator value */
  sortByIndicator?: string;
  /**If you sort by indicator value, you also need to specify the specific value of the underlying dimension member in another (row or column) direction. For example, according to the paper under office supplies ['office supplies', 'paper'] */
  query?: string[];
}
```
4. SortFuncRule: supports custom sorting rules through functions, such as sorting based on calculated indicator values: `{"sortField": "Region", sortFunc: (a, b) => a.sales - b.sales}`.
```
//4. Custom sorting method function
export interface SortFuncRule {
  /**Sort dimensions */
  sortField: string;
  /**Custom sorting function */
  sortFunc?: (a: any, b: any) => number;
}
```
### filterRules(FilterRules)
Data filtering rules, specific type definition:
```
export type FilterRules = FilterRule[];
```
Multiple filtering rules can be set, and data will be retained only if each filtering rule is met.
```
//#region filter rules
export interface FilterRule {
  filterKey?: string;
  filteredValues?: unknown[];
  filterFunc?: (row: Record<string, any>) => boolean;
}
```
### totals(Totals)
Set up totals, subtotals, and grand totals.
```
export interface Totals {
  row?: Total & {
    showGrandTotalsOnTop?: boolean;
    showSubTotalsOnTop?: boolean;
  };
  column?: Total & {
    showGrandTotalsOnLeft?: boolean;
    showSubTotalsOnLeft?: boolean;
  };
}
```

Row or column methods set summary rules respectively:
```
export interface Total {
  // Whether to display the total
  showGrandTotals: boolean;
  // Whether to display subtotals
  showSubTotals: boolean;
  // Subtotal summary dimension definition
  subTotalsDimensions?: string[];
  //Default 'total'
  grandTotalLabel?: string;
  //Default 'Subtotal'
  subTotalLabel?: string;
}
```
### derivedFieldRules(DerivedFieldRules)
Add derived fields
```
export type DerivedFieldRules = DerivedFieldRule[];
```
The specific function is to generate new fields for source data, which is customized by the user. This function mainly adds a new field to each piece of data. This field can be used in other data rules, such as sort or as indicators or columns. of a certain dimension.
```
export interface DerivedFieldRule {
  fieldName?: string;
  derivedFunc?: (record: Record<string, any>) => any;
}
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

[Flat Example](../demo/table-type/pivot-table) [Tree Example](../demo/table-type/pivot-table-tree)

{{ use: extension-rows-dimension-define( prefix = '#',) }}

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

## editor (string|Object|Function)

Global configuration cell editor
```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```
Among them, IEditor is the editor interface defined in @visactor/vtable-editors. For details, please refer to the source code: https://github.com/VisActor/VTable/blob/main/packages/vtable-editors/src/types.ts .

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}
```
