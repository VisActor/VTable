# How can the table column width show different effects according to the number of data columns?

## Question Description

When using VTable table library to display report data, if the total number of columns is not enough to support the width of the entire container, I think it can automatically widen to adapt to the container size, but when the total width of the column is larger than the container width, you can scroll horizontally. How can this effect be achieved?

## Solution

Based on your question, my understanding is that you want to dynamically adjust the width mode based on the total column width of the data. In VTable, the width mode widthMode has:

- standard sets the width of each column according to the with setting
- autoWidth automatically calculates column width based on cell content
- adaptive scales according to the width of the container to fill the width of the container.
  That is, if the number of columns is too small to cover the container, you want the adaptive effect. If the total column width exceeds the container width, you want the standard or autoWidth effect. There are two ways to do this:

1. You can use the interface of the VTable instance, getAllColsWidth, to get the total column width and the width of the container for comparison, and then change the widthMode according to the situation.
2. A relatively trouble-free way, VTable provides a very optimized configuration item `autoFillWidth`. Configuring this can perfectly achieve the effect you want. There is also a corresponding height setting `autoFillWidth`.

![](/vtable/faq/13-0.png)

## Code Example

```javascript
const option = {
  records,
  columns,
  limitMaxAutoWidth: 800,
  autoFillWidth: true
  // widthMode: "autoWidth",
  // heightMode: "autoHeight"
};
```

## Results

[Online demo](https://codesandbox.io/s/vtable-autfillwidth-6kz69n)

![result](/vtable/faq/13-1.png)

## Quote

- [Column width Tutorial](https://visactor.io/vtable/guide/basic_function/row_height_column_width)
- [Related api](https://visactor.io/vtable/option/ListTable#autoFillWidth)
- [github](https://github.com/VisActor/VTable)
