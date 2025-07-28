# VTable Usage Issue: How to customize the content of a tooltip in a pop-up box?

## Question Description

When hovering the mouse over a cell, I want to display contextual information about that cell, and I want the tooltip box to have a completely customized style. How can I achieve this using VTable?

## Solution

One flexible approach is to listen to the `mouseenter_cell` and `mouseleave_cell` events of the VTable instance. Show or hide the custom DOM elements accordingly, and calculate the position to display the tooltip based on the `cellRange` parameter from the VTable event. Demo: https://visactor.io/vtable/demo/component/tooltip_custom_content

## Code Example

```javascript
tableInstance.on('mouseenter_cell', args => {
  const { cellRange, col, row } = args;
  showTooltip(cellRange); //yourself function
});
tableInstance.on('mouseleave_cell', args => {
  const { cellRange, col, row } = args;
  hideTooltip(); //yourself function
});
```

## Results

[Online demo](https://visactor.io/vtable/demo/component/tooltip_custom_content)

![result](/vtable/faq/5-0.png)

## Quote

- [Table tooltip demo](https://visactor.io/vtable/demo/component/tooltip_custom_content)
- [Tooltip Tutorial](https://visactor.io/vtable/guide/components/tooltip)
- [github](https://github.com/VisActor/VTable)
