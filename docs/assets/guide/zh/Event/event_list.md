# 事件 event

## 介绍

表格事件列表，可以根据实际需要，监听所需事件，实现自定义业务。

事件具体的回传数据可进行实际测试来观察是否满足业务需求，或者跟我们沟通对接。

比较全面的事件列表请参考：https://visactor.io/vtable/api/events

|名称|事件名|描述|
|:----|:----|:----|
|生命周期事件：完成初始化|INITIALIZED|生命周期事件：成功初始化完成后触发|
|渲染完成|AFTER\_RENDER|每次渲染完成触发|
|监听图表事件|同vchart教程中规定的事件|表格中嵌入图表，需要监听图表事件的情况使用。使用方法`onVChartEvent`非`on`|
|点击|CLICK\_CELL|单元格点击事件|
|双击|DBLCLICK\_CELL|单元格双击事件|
|右键|CONTEXTMENU\_CELL|单元格右键事件|
|键盘按下|CLICK\_CELL|键盘按下事件|
|鼠标按下|MOUSEDOWN\_CELL|单元格鼠标按下事件|
|鼠标松开|MOUSEUP\_CELL|单元格鼠标松开事件|
|选中状态改变|SELECTED\_CELL|单元格选中状态改变事件|
|鼠标进入|MOUSEENTER\_CELL|鼠标进入单元格事件|
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
|图例项点击事件|LEGEND\_ITEM\_CLICK|鼠标点击图例中某一项|
|图例项hover|LEGEND\_ITEM\_HOVER|鼠标hover图例中某一项|
|图例项unhover|LEGEND\_ITEM\_UNHOVER|鼠标离开hover的图例项|
|鼠标进入坐标轴|MOUSEENTER\_AXIS|鼠标进入坐标轴组件|
|鼠标离开坐标轴|MOUSELEAVE\_AXIS|鼠标离开坐标轴组件|
|监听复制|COPY\_DATA|当使用快捷键复制单元格后触发该事件|


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
    MOUSEOUT_CELL,
    INPUT_CELL,
    PASTE_CELL,
    RESIZE_COLUMN,
    SCROLL,
    CHANGED_VALUE,
    FREEZE_CLICK,
    SORT_CLICK,
    DROPDOWN_MENU_CLICK,
    CONTEXTMENU_CELL,
  } = VTable.ListTable.EVENT_TYPE;
  const tableInstance =new ListTable(options);
  tableInstance.on(CLICK_CELL, (...args) => console.log(CLICK_CELL, args));
```
