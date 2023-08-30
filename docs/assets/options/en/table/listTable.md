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

## pagerConf(IPagerConf)

Pagination configuration. The specific type of IPagerConf is as follows:

### totalCount (number)
Total number of data records.

### perPageCount (number)
Number of data records displayed per page.

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

{{ use: common-option-secondary(
    prefix = '#',
    tableType = 'listTable'
) }}
```
