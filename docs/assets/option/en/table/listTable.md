{{ target: table-listTable }}

# ListTable

A basic table, configures the corresponding ListTableConstructorOptions type, specific configuration items are as follows:

{{ use: common-option-important(
    prefix = '#',
    tableType = 'listTable'
) }}

## records(Array)

tabular data.
Currently supported data formats, taking human information as an example:

```
[
  {"name": "Zhang San","age": 20,"sex": "male","phone": "123456789","address": "Haidian District, Beijing"},
  {"name": "Li Si","age": 30,"sex": "female","phone": "23456789","address": "Haidian District, Beijing"},
  {"name": "Wang Wu","age": 40,"sex": "male","phone": "3456789","address": "Haidian District, Beijing"}
]

{{ use: column-define( prefix = '#',) }}


## transpose(boolean) = false

Whether to transpose, default is false

## showHeader(boolean) = true

Whether to display the table header.


## pagination(IPagination)

Pagination configuration.

The basic table and VTable data analysis pivot table support paging, but the pivot combination chart does not support paging.

The specific types of IPagination are as follows:

### totalCount (number)

The total number of data items.

Not required! This field VTable in the pivot table will be automatically supplemented to help users obtain the total number of data items

### perPageCount (number)

Display the number of data items per page.

Note! The perPageCount in the pivot table will be automatically corrected to an integer multiple of the number of indicators.

### currentPage (number)
Current page number.

## multipleSort (boolean)
Enables sorting by multiple columns.

## sortState(SortState | SortState[])

Sorting state. SortState is defined as follows:

```

SortState {
/** Sorting criterion field \*/
field: string;
/** Sorting rule \*/
order: 'desc' | 'asc' | 'normal';
}

```


{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}
```

## hierarchyIndent(number)

When displayed as a tree structure, the indentation value of each layer of content.

## hierarchyExpandLevel(number)

When displayed as a tree structure, the number of levels is expanded by default. The default value is 1, which only displays the root node. If configured to `Infinity`, all nodes will be expanded.

## hierarchyTextStartAlignment(boolean) = false

Whether nodes at the same level are aligned by text, such as nodes without collapsed expansion icons and nodes with icons. Default is false

## headerHierarchyType('grid-tree')

Defines the hierarchy display mode for headers. When set to 'grid-tree', it enables tree-style expand/collapse functionality in the header structure.

## headerExpandLevel(number)

Sets the initial expansion level of headers. Defaults to 1.

## aggregation(Aggregation|CustomAggregation|Array|Function)

Data aggregation summary analysis configuration, global configuration, each column will have aggregation logic, it can also be configured in the column (columns) definition, the configuration in the column has a higher priority.

```
aggregation?:
    | Aggregation
    | CustomAggregation
    | (Aggregation | CustomAggregation)[]
    | ((args: {
        col: number;
        field: string;
      }) => Aggregation | CustomAggregation | (Aggregation | CustomAggregation)[] | null);
```

Among them:

```
type Aggregation = {
  aggregationType: AggregationType;
  showOnTop?: boolean;
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => string | number;
};

type CustomAggregation = {
  aggregationType: AggregationType.CUSTOM;
  aggregationFun: (values: any[], records: any[]) => any;
  showOnTop?: boolean;
  formatFun?: (value: number, col: number, row: number, table: BaseTableAPI) => string | number;
};
```

## showAggregationWhenEmpty(boolean)

Display aggregation result when data is empty.

## enableCheckboxCascade(boolean)

Enable group checkbox cascade function. The default is true.

## enableHeaderCheckboxCascade(boolean)

Enable header checkbox cascade function. The default is true.


## groupConfig(GroupConfig)

Group configuration.  

```
type GroupConfig = {
  /** Enable group display function, used to display the hierarchical structure of grouped fields in data. The value is the name of the grouped field, which can be configured with one field or an array of multiple fields. */
  groupBy: GroupByOption;
  /** Enable group title stick function. */
  enableTreeStickCell: boolean;
  /** Enable group title checkbox function. This configuration corresponds to the configuration of cellType: 'checkbox' in rowSeriesNumber. If you want to display the checkbox in the group name, you need to enable this configuration. The default is false */
  titleCheckbox: boolean;
  /** Custom group title. */
  titleFieldFormat: (record: any, col?: number, row?: number, table?: BaseTableAPI) => string;
  /** Custom group title layout. */
  titleCustomLayout: ICustomLayout;
};

export type GroupByOption = string | string[] | GroupConfig | GroupConfig[];

export type GroupConfig = {
  key: string;
  sort?: SortOrder;
};
type SortOrder = 'asc' | 'desc' | 'normal' | 'ASC' | 'DESC' | 'NORMAL';

```

### groupBy

Enable group display function, used to display the hierarchical structure of grouped fields in data. The value is the name of the grouped field, which can be configured with one field or an array of multiple fields.

### enableTreeStickCell

Enable group title stick function.

### titleCheckbox

Enable group title checkbox function. This configuration corresponds to the configuration of cellType: 'checkbox' in rowSeriesNumber. If you want to display the checkbox in the group name, you need to enable this configuration. The default is false

### titleFieldFormat

Custom group title.

### titleCustomLayout

Group title custom layout rendering.

## customComputeRowHeight(Function)

Code VTable internally calculates the row height. Users can customize the method for calculating row height.If number is returned, it is the line height, if auto is returned, it is the automatic line height, and undefined is the default line height.

```
customComputeRowHeight?: (computeArgs: { row: number; table: ListTableAPI }) => number|'auto'|undefined;
```

## tableSizeAntiJitter(boolean) = false

If the table jitter occurs, check whether the width and height of the upper dom container are caused by decimal numbers. If it is not guaranteed to be an integer, set this configuration item to true

## columnWidthConfig(Array)

Set column width based on key

```
  columnWidthConfig?: { key: string; width: number }[];
```

The key corresponds to the key defined in the specific configuration of each column in columns.