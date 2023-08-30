# 事件 event

## 介绍

表格事件列表，可以根据实际需要，监听所需事件，实现自定义业务。

事件具体的回传数据可进行实际测试来观察是否满足业务需求，或者跟我们沟通对接。

|名称|事件名|描述|
|:----|:----|:----|
|点击|CLICK\_CELL|单元格点击事件|
|双击|DBLCLICK\_CELL|单元格双击事件|
|右键|CONTEXTMENU\_CELL|单元格右键事件|
|键盘按下|CLICK\_CELL|键盘按下事件|
|鼠标按下|MOUSEDOWN\_CELL|单元格鼠标按下事件|
|鼠标松开|MOUSEUP\_CELL|单元格鼠标松开事件|
|选中状态改变|SELECTED\_CELL|单元格选中状态改变事件|
|鼠标进入|MOUSEENTER\_CELL|鼠标进入单元格事件|
|鼠标经过|MOUSEOVER\_CELL|鼠标经过单元格事件\[目前仅支持单元格为单元，内部元素不能触发相应的mouseover和mouseout，建议使用MOUSEENTER\_CELL]|
|鼠标移动|MOUSEMOVE\_CELL|鼠标在某个单元格上移动事件|
|鼠标离开|MOUSELEAVE\_CELL|鼠标离开单元格事件|
|拖拽列宽|RESIZE\_COLUMN|列宽调整事件|
|拖拽列宽结束|RESIZE\_COLUMN\_END|列宽调整结束事件|
|拖拽表头|CHANGE\_HEADER\_POSITION|拖拽表头移动位置的事件|
|点击排序|SORT\_CLICK|点击排序图标事件|
|点击固定列|FREEZE\_CLICK|点击固定列图标事件|
|滚动|SCROLL|滚动表格事件|
|点击下拉图标|DROPDOWNMENU\_CLICK|点击下拉菜单图标事件|
|点击下拉菜单|MENU\_CLICK|点击下拉菜单事件|
|鼠标经过迷你图|MOUSEOVER\_CHART\_SYMBOL|鼠标经过迷你图标记事件|
|拖拽框选鼠标松开|DRAG\_SELECT\_END|拖拽框选单元格鼠标松开事件|
|下钻按钮点击|DRILLMENU\_CLICK|下钻按钮点击事件|
|透视表树形展示收起|TREE\_HIERARCHY\_STATE\_CHANGE|透视表树形结构展示收起状态改变事件|
|按键|KEYDOWN|键盘按下事件|

## 事件监听方式

```
const {
    CLICK_CELL,
    DBLCLICK_CELL,
    DBLTAP_CELL,
    MOUSEDOWN_CELL,
    MOUSEUP_CELL,
    SELECTED_CELL,
    KEYDOWN,
    MOUSEMOVE_CELL,
    MOUSEENTER_CELL,
    MOUSELEAVE_CELL,
    MOUSEOVER_CELL,
    MOUSEOUT_CELL,
    INPUT_CELL,
    PASTE_CELL,
    RESIZE_COLUMN,
    SCROLL,
    CHANGED_VALUE,
    FREEZE_CLICK,
    SORT_CLICK,
    DROPDOWNMENU_CLICK,
    CONTEXTMENU_CELL,
  } = VTable.ListGrid.EVENT_TYPE;
  const tableInstance =new ListGrid(options);
  tableInstance.listen(CLICK_CELL, (...args) => console.log(CLICK_CELL, args));
```
