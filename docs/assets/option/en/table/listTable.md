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

## editor (string|Object|Function)

Global configuration cell editor
```
editor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
```
Among them, IEditor is the editor interface defined in @visactor/vtable-editors. For details, please refer to the source code: https://github.com/VisActor/VTable/blob/feat/editCell/packages/vtable-editors/src/types.ts .

${prefix} headerEditor (string|Object|Function)

Global configuration for the editor of the display title in the table header
```
headerEditor?: string | IEditor | ((args: BaseCellInfo & { table: BaseTableAPI }) => string | IEditor);
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

## frozenColDragHeaderMode(string) = 'fixedFrozenCount'

Drag the table header to move the position. Rules for frozen parts. The default is fixedFrozenCount.

- "disabled" (disables adjusting the position of frozen columns): Do not allow other column header drag operations to involve frozen columns, and frozen columns remain unchanged.
- "adjustFrozenCount" (adjust the number of frozen columns based on the interaction results): Allow the header drag operation of other columns to involve the frozen column part, and adjust the number of frozen columns based on the dragging action. When the headers of other columns are dragged into the frozen column position, the number of frozen columns increases; when the headers of other columns are dragged out of the frozen column position, the number of frozen columns decreases.
- "fixedFrozenCount" (can adjust frozen columns and keep the number of frozen columns unchanged): Allows you to freely drag the headers of other columns into or out of the frozen column position while keeping the number of frozen columns unchanged.