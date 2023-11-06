# How to merge cells with the same content in table component?

## Question Description

If there are multiple consecutive cells of the same data in a certain column of the table, these cells will be automatically merged and the content will be displayed in the center. How to achieve this effect on VTable?
![image](/vtable/faq/14-0.png)

## Solution

You can set `mergeCell` to true in columns, and cells with the same content before and after in the column will be automatically merged:

```javascript
const columns = [
  {
    // ......
    mergeCell: true
  }
];
```

## Code Example

```javascript
const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 80
  },
  {
    field: 'value',
    title: 'number',
    width: 100,
    mergeCell: true
  }
];
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns
};
new ListTable(document.getElementById('container'), option);
```

## Results

[Online demo](https://codesandbox.io/s/vtable-merge-cell-23wwmk)

![result](/vtable/faq/14-1.png)

## Quote

- [Merge Cell Demo](https://visactor.io/vtable/demo/basic-functionality/merge)
- [mergeCell api](https://visactor.io/vtable/option/ListTable-columns-text#mergeCell)
- [github](https://github.com/VisActor/VTable)
