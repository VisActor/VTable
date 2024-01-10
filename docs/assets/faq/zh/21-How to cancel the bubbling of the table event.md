# 怎么取消表格mousedown事件的冒泡

## 问题描述

在我的业务场景中需要对表格整体进行拖拽来移动位置，但是如果鼠标点在单元格上拖拽会触发表格的框选交互，这样我就预期不进行整表拖拽了，当鼠标点在表格空白区域再响应整表拖拽行为。

基于这个需求背景，怎么判断是点击在了单元格上还是表格空白区域呢？

## 解决方案

在 VTable 中可以通过监听`mousedown_cell`事件来处理这个问题，不过需要注意的是VTable内部都是监听的pointer事件哦！

所以如果直接取消冒泡，也仅能取消pointerdown事件。
```
  tableInstance.on('mousedown_cell', arg => {
    arg.event.stopPropagation();
  });
```
所以需要再监听mousedown来判断组织事件，正确处理可以看下面示例：

## 代码示例

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

## 相关文档

- [教程](https://visactor.io/vtable/guide/Event/event_list)
- [github](https://github.com/VisActor/VTable)
