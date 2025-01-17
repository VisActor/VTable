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

## frozenColDragHeaderMode(string) = 'fixedFrozenCount'

Drag the table header to move the position. Rules for frozen parts. The default is fixedFrozenCount.

- "disabled" (disables adjusting the position of frozen columns): The headers of other columns are not allowed to be moved into the frozen column, nor are the frozen columns allowed to be moved out. The frozen column remains unchanged.
- "adjustFrozenCount" (adjust the number of frozen columns based on the interaction results): allows the headers of other columns to move into the frozen column, and the frozen column to move out, and adjusts the number of frozen columns based on the dragging action. When the headers of other columns are dragged into the frozen column position, the number of frozen columns increases; when the headers of other columns are dragged out of the frozen column position, the number of frozen columns decreases.
- "fixedFrozenCount" (can adjust frozen columns and keep the number of frozen columns unchanged): Allows you to freely drag the headers of other columns into or out of the frozen column position while keeping the number of frozen columns unchanged.

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

## groupBy(string|string[])

Enable the group display function to display the hierarchical structure of the group fields in the data. The value is the group field name, which can be configured as one field or an array of multiple fields.

## enableTreeStickCell(boolean) = false

Enable the group title sticking function.

## groupTitleFieldFormat(Function)

Customize the group title.

## groupTitleCustomLayout(CustomLayout)

Customize the group title layout.

## customComputeRowHeight(Function)

Code VTable internally calculates the row height. Users can customize the method for calculating row height.If number is returned, it is the line height, if auto is returned, it is the automatic line height, and undefined is the default line height.

```
customComputeRowHeight?: (computeArgs: { row: number; table: ListTableAPI }) => number|'auto'|undefined;
```

## tableSizeAntiJitter(boolean) = false

If the table jitter occurs, check whether the width and height of the upper dom container are caused by decimal numbers. If it is not guaranteed to be an integer, set this configuration item to true
