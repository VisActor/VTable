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

The basic table and VTable data analysis pivot table (enableDataAnalysis=true) support paging, but the pivot combination chart does not support paging.

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

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}
```
