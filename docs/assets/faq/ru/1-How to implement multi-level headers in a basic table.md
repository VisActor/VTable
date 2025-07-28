# How to implement multi-level headers in a basic table (ListTable)?

## Question Description

How to construct such hierarchical structure to display in table header cells like: Department (Finance, Technology), Name (First Name, Last Name)?

![image](/vtable/faq/1-0.png)

## Solution

In VTable, the configuration option "columns" can be used to configure sub-items under "columns".

## Code Example

```javascript
{
  field: 'full name',
  title: 'Full name',
  columns: [
    {
      field: 'name',
      title: 'First Name',
      width: 120
    },
    {
      field: 'lastName',
      title: 'Last Name',
      width: 100
    }
  ]
},
```

## Results

- [Online demo](https://codesandbox.io/s/vtable-columns-nested-structure-4zwk43)

![result](/vtable/faq/1-1.png)

## Quote

- [List Table Demo](https://visactor.io/vtable/demo/table-type/list-table)
- [List Table Tutoria](https://visactor.io/vtable/guide/table_type/List_table/list_table_define_and_generate)
- [Related api](https://visactor.io/vtable/option/ListTable-columns-text#columns)
- [github](https://github.com/VisActor/VTable)
