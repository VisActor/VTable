# How to specify the width of a column and enable automatic line wrapping in a table component?

## Question Description

Specify the width of a column in a table, and enable automatic line wrapping based on the width limit, while allowing the height of the cells to be determined by the actual number of content lines.How can I achieve this effect?

![](/vtable/faq/2-0.png)

## Solution

Add the following configuration to the table options.

```javascript
heightMode: 'autoHeight', // the height of each row is determined by the content and will expand accordingly.
autoWrapText: true, // Enable automatic line wrapping.
```

## Code Example

```javascript
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns,
  heightMode: 'autoHeight',
  autoWrapText: true
};
```

## Results

[Online demo](https://codesandbox.io/s/vtable-autoheight-dktrk4)

![result](/vtable/faq/2-1.gif)

## Quote

- [github](https://github.com/VisActor/VTable)
