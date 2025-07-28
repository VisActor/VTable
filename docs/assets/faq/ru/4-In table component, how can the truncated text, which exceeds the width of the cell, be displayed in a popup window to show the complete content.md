# In table component, how can the truncated text, which exceeds the width of the cell, be displayed in a popup window to show the complete content?

## Question Description

In the table component, after using the fixed column width to limit the cell width, some text that exceeds the width will be omitted. How to realize that when the cell content is omitted, hover to the corresponding position, and a prompt box will pop up to display the complete content.

## Solution

VTable can configure `isShowOverflowTextTooltip` to realize hover pop-up poptip to display the complete text that has been omitted.

## Code Example

```javascript
const option: TYPES.ListTableConstructorOptions = {
  records,
  columns,
  tooltip: {
    isShowOverflowTextTooltip: true
  }
};

// 创建 VTable 实例
const vtableInstance = new VTable.ListTable(
  document.getElementById("container")!,
  option
);
```

## Results

[Online demo](https://codesandbox.io/s/vtable-showoverflowtexttooltip-qq597m)

![result](/vtable/faq/4-0.gif)

## Quote

- [Tooltip demo](https://visactor.io/vtable/demo/component/tooltip)
- [Tooltip Tutorial](https://visactor.io/vtable/guide/components/tooltip)
- [Related api](https://visactor.io/vtable/option/ListTable#tooltip.isShowOverflowTextTooltip)
- [github](https://github.com/VisActor/VTable)
