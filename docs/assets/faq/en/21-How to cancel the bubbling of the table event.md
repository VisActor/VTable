# How to cancel the bubbling of the table mousedown event

## Problem Description

In my business scenario, I need to drag the entire table to move the position. However, if the mouse point is dragged on the cell, it will trigger the box selection interaction of the table. In this way, I do not expect to drag the entire table. When the mouse point is clicked, Then respond to the entire table dragging behavior in the blank area of the table.

Based on this demand background, how to determine whether the click is on a cell or a blank area of the table?

## solution

This problem can be handled in VTable by listening to the `mousedown_cell` event, but it should be noted that VTable internally listens to pointer events!

Therefore, if you cancel bubbling directly, you can only cancel the pointerdown event.
```
  tableInstance.on('mousedown_cell', arg => {
    arg.event.stopPropagation();
  });
```
Therefore, you need to listen to mousedown again to determine the organization event. For correct processing, you can see the following example:

## Code Example

```javascript
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
  let isPointerDownOnTable = false;
  tableInstance.on('mousedown_cell', arg => {
    isPointerDownOnTable = true;
    setTimeout(() => {
      isPointerDownOnTable = false;
    }, 0);
    arg.event?.stopPropagation();
  });
  tableInstance.getElement().addEventListener('mousedown', e => {
    if (isPointerDownOnTable) {
      e.stopPropagation();
    }
  });
```

## Related documents

- [Tutorial](https://visactor.io/vtable/guide/Event/event_list)
- [github](https://github.com/VisActor/VTable)