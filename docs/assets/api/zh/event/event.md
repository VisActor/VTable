{{ target: table-events }}

# events

表格事件列表，可以根据实际需要，监听所需事件，实现自定义业务。

具体使用方式：

```
  const tableInstance =new VTable.ListTable(options);

  const {
      CLICK_CELL
    } = VTable.ListTable.EVENT_TYPE;

  tableInstance.on(CLICK_CELL, (args) => console.log(CLICK_CELL, args));
```

支持的事件类型：

```
TABLE_EVENT_TYPE = {
  CLICK_CELL: 'click_cell',
  DBLCLICK_CELL: 'dblclick_cell',
  MOUSEDOWN_CELL: 'mousedown_cell',
  MOUSEUP_CELL: 'mouseup_cell',
  SELECTED_CELL: 'selected_cell',
  SELECTED_CLEAR: 'selected_clear',
  KEYDOWN: 'keydown',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTMENU_CELL: 'contextmenu_cell',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEDOWN_TABLE: 'mousedown_table',
  RESIZE_COLUMN: 'resize_column',
  RESIZE_COLUMN_END: 'resize_column_end',
  RESIZE_ROW: 'resize_row',
  RESIZE_ROW_END: 'resize_row_end',
  CHANGE_HEADER_POSITION: 'change_header_position',
  CHANGE_HEADER_POSITION_START: 'change_header_position_start',
  CHANGING_HEADER_POSITION: 'changing_header_position',
  CHANGE_HEADER_POSITION_FAIL: 'changing_header_position_fail',
  SORT_CLICK: 'sort_click',
  PIVOT_SORT_CLICK: 'pivot_sort_click',
  AFTER_SORT: 'after_sort',
  FREEZE_CLICK: 'freeze_click',
  SCROLL: 'scroll',
  SCROLL_HORIZONTAL_END: 'scroll_horizontal_end',
  SCROLL_VERTICAL_END: 'scroll_vertical_end',
  DROPDOWN_MENU_CLICK: 'dropdown_menu_click',
  MOUSEOVER_CHART_SYMBOL: 'mouseover_chart_symbol',
  DRAG_SELECT_END: 'drag_select_end',
  DROPDOWN_ICON_CLICK: 'dropdown_icon_click',
  DROPDOWN_MENU_CLEAR: 'dropdown_menu_clear',
  TREE_HIERARCHY_STATE_CHANGE: 'tree_hierarchy_state_change',
  SHOW_MENU: 'show_menu',
  HIDE_MENU: 'hide_menu',
  ICON_CLICK: 'icon_click',
  // 透视表特有事件
  DRILLMENU_CLICK: 'drillmenu_click',
  ......
}
```

## INITIALIZED

成功初始化完成后触发

## AFTER_RENDER

每次渲染完成后触发

## onVChartEvent

监听 vchart 事件，具体事件类型可参考[VChart 事件](https://visactor.io/vchart/api/API/event)

```
  /**
   * 监听vchart事件
   * @param type vchart事件类型
   * @param listener vchart事件监听器
   */
  onVChartEvent(type: string, listener: AnyFunction): void
```

## CLICK_CELL

鼠标点击单元格事件。

{{ use: MousePointerCellEvent() }}

## DBLCLICK_CELL

鼠标双击单元格事件。

事件回调函数的参数类型请参考 CLICK_CELL 事件中介绍的参数类型。

## MOUSEDOWN_CELL

单元格上鼠标按下事件

事件回调函数的参数类型请参考 CLICK_CELL 事件中介绍的参数类型。

## MOUSEUP_CELL

单元格鼠标松开事件

事件回调函数的参数类型请参考 CLICK_CELL 事件中介绍的参数类型。

## SELECTED_CELL

单元格选中状态改变事件

{{ use: SelectedCellEvent() }}

## SELECTED_CLEAR

当鼠标点击到表格空白区域，所有选择单元格将被取消，会触发这个事件

## KEYDOWN

键盘按下事件

{{ use: KeydownEvent() }}

## MOUSEMOVE_CELL

鼠标在某个单元格上移动事件

事件回调函数的参数类型请参考 CLICK_CELL 事件中介绍的参数类型（会有个别参数缺省，可以通过相应的接口自行获取）。

## MOUSEENTER_CELL

鼠标进入单元格事件

事件回调函数的参数类型请参考 CLICK_CELL 事件中介绍的参数类型（会有个别参数缺省，可以通过相应的接口自行获取）。

## MOUSELEAVE_CELL

鼠标离开单元格事件

事件回调函数的参数类型请参考 CLICK_CELL 事件中介绍的参数类型（会有个别参数缺省，可以通过相应的接口自行获取）。

## CONTEXTMENU_CELL

单元格右键事件

{{ use: MousePointerMultiCellEvent() }}

## MOUSEENTER_TABLE

鼠标进入表格区域触发该事件

## MOUSELEAVE_TABLE

鼠标离开表格区域触发该事件

## MOUSEDOWN_TABLE

鼠标在表格区域按下触发该事件

## RESIZE_COLUMN

列宽调整事件。

事件回调函数的参数类型:

```

  {
    col: number;
    colWidth: number
  }

```

## RESIZE_COLUMN_END

列宽调整结束事件。

事件回调函数的参数类型:

```

  {
    col: number;
    colWidths: number[]
  }

```

## RESIZE_ROW

列宽调整事件。

事件回调函数的参数类型:

```

  {
    row: number;
    rowHeight: number
  }

```

## RESIZE_ROW_END

列宽调整结束事件。

事件回调函数的参数类型:

```

  {
    row: number;
    rowHeight: number
  }

```

## CHANGE_HEADER_POSITION

拖拽表头或者行来移动位置的事件

事件回调函数的参数类型:

```
  {
    source: CellAddress;
    target: CellAddress
  }

```

## CHANGE_HEADER_POSITION_FAIL

拖拽表头或者行来移动位置的失败事件

事件回调函数的参数类型:

```
  {
    source: CellAddress;
    target: CellAddress
  }

```

## CHANGE_HEADER_POSITION_START

拖拽表头或者拖拽行来移动位置开始事件

事件回调函数的参数类型:

```
  {
    col: number;
    row: number;
    x: number;
    y: number;
    backX: number;
    lineX: number;
    backY: number;
    lineY: number;
    event: Event;
  };

```

## CHANGING_HEADER_POSITION

拖拽表头或者拖拽行移动过程事件

事件回调函数的参数类型:

```
  {
    col: number;
    row: number;
    x: number;
    y: number;
    backX: number;
    lineX: number;
    backY: number;
    lineY: number;
    event: Event;
  };

```

## SORT_CLICK

点击排序图标事件。**ListTable 专有事件**

事件回调函数的参数类型:

```
  {
    field: string;
    order: 'asc' | 'desc' | 'normal';
     event: Event;
  }
```

## PIVOT_SORT_CLICK

透视表中排序图标点击事件。**PivotTable 透视表专有事件**

事件回调函数的参数类型:

```

    {
      col: number;
      row: number;
      order: 'asc' | 'desc' | 'normal';
      dimensionInfo: IDimensionInfo[];
      cellLocation: CellLocation;
    }

```

其中：
{{ use: common-IDimensionInfo()}}
{{ use: CellLocation()}}

## AFTER_SORT

执行完排序事件。**ListTable 专有事件**
事件回调函数的参数类型:

```
  {
    field: string;
    order: 'asc' | 'desc' | 'normal';
    event: Event;
  }
```

## FREEZE_CLICK

点击固定列图标冻结或者解冻事件。

事件回调函数的参数类型:

```

{
col: number;
row: number;
fields: string[];
colCount: number
}

```

## SCROLL

滚动表格事件。

事件回调函数的参数类型:

```

    {
      scrollLeft: number;
      scrollTop: number;
      scrollWidth: number;
      scrollHeight: number;
      viewWidth: number;
      viewHeight: number;
    }

```

## SCROLL_HORIZONTAL_END

横向滚动到右侧结束事件

事件回调函数的参数类型:

```

    {
      scrollLeft: number;
      scrollTop: number;
      scrollWidth: number;
      scrollHeight: number;
      viewWidth: number;
      viewHeight: number;
    }

```

## SCROLL_VERTICAL_END

竖向滚动条滚动到底部事件

事件回调函数的参数类型:

```

    {
      scrollLeft: number;
      scrollTop: number;
      scrollWidth: number;
      scrollHeight: number;
      viewWidth: number;
      viewHeight: number;
    }

```

## MOUSEOVER_CHART_SYMBOL

鼠标经过迷你图标记事件

{{ use: MousePointerSparklineEvent() }}

## DRAG_SELECT_END

拖拽框选单元格鼠标松开事件

{{ use: MousePointerMultiCellEvent() }}

## DRILLMENU_CLICK

下钻按钮点击事件。**透视表专有事件**

{{ use: DrillMenuEventInfo() }}

## DROPDOWN_ICON_CLICK

点击下拉菜单按钮

{{ use: CellAddress() }}

## DROPDOWN_MENU_CLICK

下拉菜单选项的点击事件。

{{ use: DropDownMenuEventArgs() }}

## DROPDOWN_MENU_CLEAR

清空下拉菜单事件（菜单显示时点击其他区域）

{{ use: CellAddress() }}

## TREE_HIERARCHY_STATE_CHANGE

树形结构展开收起的点击事件

## SHOW_MENU

显示菜单事件。

事件回调函数的参数类型:

```

    {
      x: number;
      y: number;
      col: number;
      row: number;
      type: 'dropDown' | 'contextmenu' | 'custom';
    }

```

## HIDE_MENU

隐藏菜单事件

## ICON_CLICK

icon 图标点击事件。

事件回调函数的参数类型:

```

    {
      name: string;
      col: number;
      row: number;
      x: number;
      y: number;
      funcType?: IconFuncTypeEnum | string;
      icon: Icon;
    }

```

## LEGEND_ITEM_CLICK

图例项点击事件。**图例专有事件**

事件回调函数的参数类型:

```

{ model: any; value: any; event: PointerEvent };

```

## LEGEND_ITEM_HOVER

图例项 hover 事件。**图例专有事件**

事件回调函数的参数类型:

```

{ model: any; value: any; event: PointerEvent };

```

## LEGEND_ITEM_UNHOVER

图例项 hover 到 unhover 事件。**图例专有事件**

事件回调函数的参数类型:

```

{ model: any; value: any; event: PointerEvent };

```

## LEGEND_CHANGE

颜色图例，尺寸图例，用户操作图例范围后触发该事件。**图例专有事件**

事件回调函数的参数类型:

```

{ model: any; value: any; event: PointerEvent };

```

## MOUSEENTER_AXIS

鼠标进入到坐标轴上事件。**坐标轴专有事件**

事件回调函数的参数类型:

```

MousePointerCellEvent & { axisPosition: 'left' | 'right' | 'top' | 'bottom' };

```

{{ use: MousePointerCellEvent() }}

## MOUSELEAVE_AXIS

鼠标离开坐标轴事件。**坐标轴专有事件**

事件回调函数的参数类型:
同**MOUSEENTER_AXIS**

## COPY_DATA

单元格内容复制事件。

事件回调函数的参数类型:

```

{ cellRange: CellRange[]; copyData: string };

```

## CHANGE_CELL_VALUE

更改单元格值的事件。

事件回调函数的参数类型:

```

{ col: number; row: number; rawValue: string | number;currentValue: string | number; changedValue: string | number };

```

## CHECKBOX_STATE_CHANGE

更改 checkbox 复选框状态。**ListTable 表格专有事件**

事件回调函数的参数类型:

```

{
col: number;
row: number;
value: string | number;
dataValue: string | number;
checked: boolean;
};

```

## RADIO_STATE_CHANGE

更改 radio 单选框状态。**ListTable 表格专有事件**

事件回调函数的参数类型:

```

{
col: number;
row: number;
value: string | number;
dataValue: string | number;
radioIndexInCell: boolean | number;
};

```

如果单元格中只有一个单选框，radioIndexInCell 为 boolean 类型，表示是否选中；如果单元格中有多个单选框，radioIndexInCell 为 number 类型，表示选中的单选框的索引。

## SWITCH_STATE_CHANGE

switch 状态改变事件。**ListTable 表格专有事件**

事件回调函数的参数类型:

```

{
col: number;
row: number;
value: string | number;
dataValue: string | number;
checked: boolean;
};

```

## BUTTON_CLICK

按钮点击事件。**ListTable 表格专有事件**

事件回调函数的参数类型:

```

{
col: number;
row: number;
event: Event;
};

```

## EMPTY_TIP_CLICK

空数据提示点击事件。

## EMPTY_TIP_DBLCLICK

空数据提示双击事件。
