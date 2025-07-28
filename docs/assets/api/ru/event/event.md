{{ target: table-events }}

# События

Список событий формы. Вы можете прослушивать необходимые события в соответствии с фактическими потребностями для реализации настраиваемой бизнес-логики.

Конкретные способы использования:
``
const tableInstance =новый VTable.ListTable(options);

const {
CLICK_CELL
} = VTable.ListTable.EVENT_TYPE;

tableInstance.на(CLICK_CELL, (args) => console.log(CLICK_CELL, args));
``

Поддерживаемые типы событий:

`TABLE_EVENT_TYPE = {
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
  прокрутка: 'прокрутка',
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
  // События, специфичные для сводной таблицы
   DRILLMENU_CLICK: 'drillmenu_click',
  ......
}`

## INITIALIZED

Triggered after successful initialization is completed

## AFTER_RENDER

Triggered after каждый rendering is completed

## onVChartEvent

Listen к vchart events, specific event types can refer к [VChart Events](https://visactor.io/vchart/api/API/event)

```
  /**
   * Listen к vchart events
   * @param тип vchart event тип
   * @param listener vchart event listener
   */
  onVChartEvent(тип: строка, listener: AnyFunction): void
```

## CLICK_CELL

Mouse нажать на cell event.

{{ use: MousePointerCellEvent() }}

## DBLCLICK_CELL

Mouse double-нажать cell event.

Refer к the параметр types introduced в the CLICK_CELL event для the параметр types из the event обратный вызов функция.

## MOUSEDOWN_CELL

Mouse press event на cell

Refer к the параметр types described в the CLICK_CELL event для the параметр types из the event обратный вызов функция.

## MOUSEUP_CELL

Cell mouse release event

Refer к the параметр types introduced в the CLICK_CELL event для the параметр types из the event обратный вызов функция.

## SELECTED_CELL

Cell selected state change event

{{ use: SelectedCellEvent() }}

## SELECTED_CLEAR

Cell selected state все be cleard, when нажать table's blank region, this event will be triggered.

## KEYDOWN

keystroke event

{{ use: KeydownEvent() }}

## MOUSEMOVE_CELL

Mouse over a cell event

Refer к the параметр types introduced в the CLICK_CELL event для the параметр types из the event обратный вызов функция (некоторые parameters may be omitted и can be obtained through the corresponding interfaces).

## MOUSEENTER_CELL

Mouse into cell event

Refer к the параметр types introduced в the CLICK_CELL event для the параметр types из the event обратный вызов функция. (некоторые parameters may be omitted и can be obtained through the corresponding interfaces).

## MOUSELEAVE_CELL

Mouse-out-из-cell event

Refer к the параметр types introduced в the CLICK_CELL event для the параметр types из the event обратный вызов функция. (некоторые parameters may be omitted и can be obtained through the corresponding interfaces).

## CONTEXTMENU_CELL

Cell право-нажать events

{{ use: MousePointerMultiCellEvent() }}

## MOUSEENTER_TABLE

This event is triggered when the mouse enters the table area

## MOUSELEAVE_TABLE

This event is triggered when the mouse leaves the table area.

## MOUSEDOWN_TABLE

This event is triggered when the mouse is pressed в the table area.

## RESIZE_COLUMN

Column ширина adjustment events.

Event обратный вызов функция параметр types.
``

{
col: число.
colWidth: число
}

``

## RESIZE_COLUMN_END

Column ширина adjustment конец event.

Event обратный вызов функция параметр types.
``

{
col: число.
colWidths: число[]
}

``

## RESIZE_ROW

Row высота adjustment events.

Event обратный вызов функция параметр types.
``

{
row: число;
rowHeight: число
}

``

## RESIZE_ROW_END

Row высота adjustment конец event.

Event обратный вызов функция параметр types.
``

{
row: число;
rowHeight: число
}

``

## CHANGE_HEADER_POSITION

Events для dragging table headers или rows к move positions

параметр тип из event обратный вызов функция:

```
{
  source: CellAddress;
  target: CellAddress
}

```

## CHANGE_HEADER_POSITION_FAIL

Events для dragging table headers или rows к move positions when failed

параметр тип из event обратный вызов функция:

```
{
  source: CellAddress;
  target: CellAddress
}

```

## CHANGE_HEADER_POSITION_START

перетаскивание the header или row к move the позиция к начало the event

параметр тип из event обратный вызов функция:

```
{
  col: число;
  row: число;
  x: число;
  y: число;
  backX: число;
  lineX: число;
  backY: число;
  lineY: число;
  event: Event;
};

```

## CHANGING_HEADER_POSITION

перетаскивание the header или перетаскивание the row к move the process event

параметр тип из event обратный вызов функция:

```
{
  col: число;
  row: число;
  x: число;
  y: число;
  backX: число;
  lineX: число;
  backY: число;
  lineY: число;
  event: Event;
};

```

## SORT_CLICK

нажать на the sort icon event. **ListTable proprietary event**

Event обратный вызов функция параметр types.

```
  {
    field: строка;
    order: 'asc' | 'desc' | 'normal';
     event: Event;
  }
```

## PIVOT_SORT_CLICK

Sort icon нажать event в the pivot table. **PivotTable proprietary events！**

Event обратный вызов функция параметр types.

```
    {
      col: число.
      row: число.
      order: 'asc' | 'desc' | 'normal'.
      dimensionInfo: IDimensionInfo[];
      cellLocation: CellLocation.
    }
```

Among them:
{{ use: common-IDimensionInfo()}}
{{ use: CellLocation()}}

## AFTER_SORT

after execute sort logic. **ListTable proprietary event**

Event обратный вызов функция параметр types.

```
  {
    field: строка;
    order: 'asc' | 'desc' | 'normal';
     event: Event;
  }
```

## FREEZE_CLICK

нажать на the fixed column icon к freeze или unfreeze the event.

Event обратный вызов функция параметр types.

```
{
  col: число;
  row: число
  fields: строка[];
  colCount: число;
}
```

## прокрутка

прокрутка form events.

Event обратный вызов функция параметр types.

```
    {
      scrollLeft: число;
      scrollTop: число;
      scrollWidth: число;
      scrollHeight: число;
      viewWidth: число;
      viewHeight: число;
    }
```

## SCROLL_HORIZONTAL_END

прокрутка horizontally к the право к конец the event

Event обратный вызов функция параметр types.

```
    {
    scrollLeft: число;
    scrollTop: число;
    scrollWidth: число;
    scrollHeight: число;
    viewWidth: число;
    viewHeight: число;
}
```

## SCROLL_VERTICAL_END

Vertical прокрутка bar scrolls к the конец позиция

Event обратный вызов функция параметр types.

```
    {
    scrollLeft: число;
    scrollTop: число;
    scrollWidth: число;
    scrollHeight: число;
    viewWidth: число;
    viewHeight: число;
}
```

## MOUSEOVER_CHART_SYMBOL

Mouse over mini-graph marker event

{{ use: MousePointerSparklineEvent() }}

## DRAG_SELECT_END

перетаскивание-и-отпускание boxed cell mouse release event

{{ use: MousePointerMultiCellEvent() }}

## DRILLMENU_CLICK

Drill-down кнопка нажать event. **Pivot table proprietary event**

{{ use: DrillMenuEventInfo() }}

## DROPDOWN_ICON_CLICK

нажать на the отпускание-down menu кнопка

{{ use: CellAddress() }}

## DROPDOWN_MENU_CLICK

The отпускание-down menu options нажать на the event

{{ use: DropDownMenuEventArgs() }}

## DROPDOWN_MENU_CLEAR

Clear отпускание-down menu event (clicking на other areas while the menu is displayed)

{{ use: CellAddress() }}

## TREE_HIERARCHY_STATE_CHANGE

Tree structure развернуть и свернуть нажать events

## SHOW_MENU

Displays menu events.

Event обратный вызов функция параметр types.

```
   {
      x: число.
      y: число.
      col: число.
      row: число.
      тип: 'выпадающий список' | 'contextmenu' | 'custom';
    }
```

## HIDE_MENU

скрыть menu events

## ICON_CLICK

icon icon нажать event.

Event обратный вызов функция параметр types.

```
    {
      name: строка;
      col: число.
      row: число.
      x: число.
      y: число.
      funcType?: IconFuncTypeEnum | строка;
      icon: Icon.
    }
```

## LEGEND_ITEM_CLICK

Legend item нажать event. **Legend exclusive event**

The параметр тип из the event обратный вызов функция:

```
   { model: любой; значение: любой; event: PointerEvent };
```

## LEGEND_ITEM_HOVER

Legend item навести event. **Legend exclusive event**

The параметр тип из the event обратный вызов функция:

```
   { model: любой; значение: любой; event: PointerEvent };
```

## LEGEND_ITEM_UNHOVER

Legend item навести к unhover events. **Legend exclusive event**

The параметр тип из the event обратный вызов функция:

```
   { model: любой; значение: любой; event: PointerEvent };
```

## LEGEND_CHANGE

цвет legend, размер legend, this event is triggered after the user operates the legend range. **Legend exclusive event**

параметр types из event обратный вызов функция:

```
   { model: любой; значение: любой; event: PointerEvent };
```

## MOUSEENTER_AXIS

The mouse enters the coordinate axis event. **Axis-specific events**

The параметр тип из the event обратный вызов функция:

```
 MousePointerCellEvent & { axisPosition: 'лево' | 'право' | 'верх' | 'низ' };
```

{{ use: MousePointerCellEvent() }}

## MOUSELEAVE_AXIS

The mouse leaves the axis event. **Axis-specific events**

The параметр тип из the event обратный вызов функция:
Same as **MOUSEENTER_AXIS**

## COPY_DATA

Cell content copy event.

параметр types из event обратный вызов функция:

```
 { cellRange: CellRange[]; copyData: строка };
```

## CHANGE_CELL_VALUE

Event that changes the cell значение.

параметр types из event обратный вызов функция:

```
{ col: число; row: число; rawValue: строка | число; currentValue: строка | число; changedValue: строка | число };
```

## CHECKBOX_STATE_CHANGE

Change the флажок state. **ListTable table exclusive event**

параметр types из event обратный вызов функция:

```
{
  col: число;
  row: число;
  alue: строка | число;
  dataValue: строка | число;
  checked: логический;
};
```

## RADIO_STATE_CHANGE

Change the переключатель state. **ListTable table exclusive event**

параметр types из event обратный вызов функция:

```
{
  col: число;
  row: число;
  alue: строка | число;
  dataValue: строка | число;
  radioIndexInCell: логический | число;
};
```

If there is only one переключатель кнопка в the cell, radioIndexInCell is из тип логический, indicating whether it is selected; if there are multiple переключатель buttons в the cell, radioIndexInCell is из тип число, indicating the index из the selected переключатель кнопка.

## SWITCH_STATE_CHANGE

Switch state change event. **ListTable table exclusive event**

параметр types из event обратный вызов функция:

```
{
col: число;
row: число;
значение: строка | число;
dataValue: строка | число;
checked: логический;
};

```

## BUTTON_CLICK

кнопка нажать event. **ListTable table exclusive event**

параметр types из event обратный вызов функция:

```
{
col: число;
row: число;
event: Event;
};
```

## EMPTY_TIP_CLICK

Empty data prompt нажать event.

## EMPTY_TIP_DBLCLICK

Empty data prompt double-нажать event.
