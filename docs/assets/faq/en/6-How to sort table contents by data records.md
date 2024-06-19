# VTable Usage Issue: How to sort table contents by data records?

## Question Description

The table is sorted according to certain column data. How to implement this requirement using VTable?

## Solution

In VTable, sorting function can be realized in three ways:

1. Implemented through UI in the table
   Configure the `sort` attribute in `columns`. It supports configuring `true` to use the default sorting rules. You can also configure a function to customize the sorting rules:

```javascript
// ......
columns: [
  {
    field: 'id',
    title: 'ID',
    width: 120,
    sort: true
  },
  {
    field: 'name',
    title: 'Name',
    width: 120,
    sort: (a, b) => {
      return a - b;
    }
  }
];
```

At this time, the sort button will be displayed on the header of the corresponding column:
![](/vtable/faq/6-0.png)
Click the sort button to switch among three states: no sorting, ascending sort and descending sort.

2. By configuring `sortState` in the initialization `option`
   After configuring the `sort` attribute in `columns`, you can configure the `sortState` attribute in `option`:

```javascript
sortState:{
    field: 'Category',
    order: 'asc'
}
```

field is the data source corresponding to sorting; order is the sorting rule, which supports asc ascending order, desc descending order and normal non-sorting.

3. Configure `sortState` through `updateSortState` api
   After configuring the `sort` attribute in `columns`, you can configure `sortState` at any time through the `updateSortState` api of the table instance to update the sorting effect:

```javascript
instance.updateSortState({
  field: 'id',
  order: 'desc'
});
```

## Results

[Online demo](https://codesandbox.io/s/vtable-sort-w869fk)

![result](/vtable/faq/6-1.png)

## Quote

- [Table Sort demo](https://visactor.io/vtable/demo/basic-functionality/sort)
- [Sort Tutorial](https://visactor.io/vtable/guide/basic_function/sort/list_sort)
- [github](https://github.com/VisActor/VTable)
