{{ target: table-events }}

# events

Form event list, you can listen to the required events according to the actual needs, to achieve customized business.

Specific ways to use it:
``
const tableInstance =new VTable.ListTable(options);

const {
CLICK_CELL
} = VTable.ListTable.EVENT_TYPE;

tableInstance.on(CLICK_CELL, (args) => console.log(CLICK_CELL, args));
``

Supported event types:

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
  CHANGE_HEADER_POSITION: 'change_header_position',
  SORT_CLICK: 'sort_click',
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
  // Pivot table-specific events
   DRILLMENU_CLICK: 'drillmenu_click',
  PIVOT_SORT_CLICK: 'pivot_sort_click'
}`

## INITIALIZED

Triggered after successful initialization is completed

## AFTER_RENDER

Triggered after each rendering is completed

## onVChartEvent

Listen to vchart events, specific event types can refer to [VChart Events](https://visactor.io/vchart/api/API/event)

```
  /**
   * Listen to vchart events
   * @param type vchart event type
   * @param listener vchart event listener
   */
  onVChartEvent(type: string, listener: AnyFunction): void
```

## CLICK_CELL

Mouse click on cell event.

{{ use: MousePointerCellEvent() }}

## DBLCLICK_CELL

Mouse double-click cell event.

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSEDOWN_CELL

Mouse press event on cell

Refer to the parameter types described in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSEUP_CELL

Cell mouse release event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## SELECTED_CELL

Cell selected state change event

{{ use: SelectedCellEvent() }}

## SELECTED_CLEAR

Cell selected state all be cleard, when click table's blank region, this event will be triggered.

## KEYDOWN

keystroke event

{{ use: KeydownEvent() }}

## MOUSEMOVE_CELL

Mouse over a cell event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSEENTER_CELL

Mouse into cell event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSELEAVE_CELL

Mouse-out-of-cell event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## CONTEXTMENU_CELL

Cell right-click events

{{ use: MousePointerMultiCellEvent() }}

## MOUSEENTER_TABLE

This event is triggered when the mouse enters the table area

## MOUSELEAVE_TABLE

This event is triggered when the mouse leaves the table area.

## MOUSEDOWN_TABLE

This event is triggered when the mouse is pressed in the table area.

## RESIZE_COLUMN

Column width adjustment events.

Event callback function parameter types.
``

{
col: number.
colWidth: number
}

``

## RESIZE_COLUMN_END

Column width adjustment end event.

Event callback function parameter types.
``

{
col: number.
columns: number[]
}

``

## CHANGE_HEADER_POSITION

Events for dragging the table header to move its position

Event callback function parameter types.
``
{
source: CellAddress.
target: CellAddress
}

``

## SORT_CLICK

Click on the sort icon event.

Event callback function parameter types.
`  {
    field: string;
    order: 'asc' | 'desc' | 'normal'.
  }`

## FREEZE_CLICK

Click on the fixed column icon to freeze or unfreeze the event.

Event callback function parameter types.
`{
  col: number;
  row: number
  fields: string[];
  colCount: number;
}`

## SCROLL

Scroll form events.

Event callback function parameter types.
`    {
      scrollLeft: number;
      scrollTop: number;
      scrollWidth: number;
      scrollHeight: number;
      viewWidth: number;
      viewHeight: number;
    }`

## SCROLL_HORIZONTAL_END

Scroll horizontally to the right to end the event

Event callback function parameter types.
`    {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    viewWidth: number;
    viewHeight: number;
}`

## SCROLL_VERTICAL_END

Vertical scroll bar scrolls to the end position

Event callback function parameter types.
`    {
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    viewWidth: number;
    viewHeight: number;
}`

## MOUSEOVER_CHART_SYMBOL

Mouse over mini-graph marker event

{{ use: MousePointerSparklineEvent() }}

## DRAG_SELECT_END

Drag-and-drop boxed cell mouse release event

{{ use: MousePointerMultiCellEvent() }}

## DRILLMENU_CLICK

Drill-down button click event. **Pivot table proprietary event**

{{ use: DrillMenuEventInfo() }}

## DROPDOWN_ICON_CLICK

Click on the drop-down menu button

{{ use: CellAddress() }}

## DROPDOWN_MENU_CLICK

The drop-down menu options click on the event

{{ use: DropDownMenuEventArgs() }}

## DROPDOWN_MENU_CLEAR

Clear drop-down menu event (clicking on other areas while the menu is displayed)

{{ use: CellAddress() }}

## TREE_HIERARCHY_STATE_CHANGE

Tree structure expand and collapse click events

## SHOW_MENU

Displays menu events.

Event callback function parameter types.
`    {
      x: number.
      y: number.
      col: number.
      row: number.
      type: 'dropDown' | 'contextmenu' | 'custom';
    }`

## HIDE_MENU

Hide menu events

## ICON_CLICK

icon icon click event.

Event callback function parameter types.
`    {
      name: string;
      col: number.
      row: number.
      x: number.
      y: number.
      funcType?: IconFuncTypeEnum | string;
      icon: Icon.
    }`

## PIVOT_SORT_CLICK

Sort icon click event in the pivot table. **PivotTable proprietary events！**

Event callback function parameter types.
`    {
      col: number.
      row: number.
      order: 'asc' | 'desc' | 'normal'.
      dimensionInfo: IDimensionInfo[];
      cellLocation: CellLocation.
    }`
Among them:
{{ use: common-IDimensionInfo()}}
{{ use: CellLocation()}}

## LEGEND_ITEM_CLICK

Legend item click event. **Legend exclusive event**

The parameter type of the event callback function:

```
   { model: any; value: any; event: PointerEvent };
```

## LEGEND_ITEM_HOVER

Legend item hover event. **Legend exclusive event**

The parameter type of the event callback function:

```
   { model: any; value: any; event: PointerEvent };
```

## LEGEND_ITEM_UNHOVER

Legend item hover to unhover events. **Legend exclusive event**

The parameter type of the event callback function:

```
   { model: any; value: any; event: PointerEvent };
```

## LEGEND_CHANGE

Color legend, size legend, this event is triggered after the user operates the legend range. **Legend exclusive event**

Parameter types of event callback function:

```
   { model: any; value: any; event: PointerEvent };
```

## MOUSEENTER_AXIS

The mouse enters the coordinate axis event. **Axis-specific events**

The parameter type of the event callback function:

```
 MousePointerCellEvent & { axisPosition: 'left' | 'right' | 'top' | 'bottom' };
```

{{ use: MousePointerCellEvent() }}

## MOUSELEAVE_AXIS

The mouse leaves the axis event. **Axis-specific events**

The parameter type of the event callback function:
Same as **MOUSEENTER_AXIS**

## COPY_DATA

Cell content copy event.

Parameter types of event callback function:

```
 { cellRange: CellRange[]; copyData: string };
```

## CHANGE_CELL_VALUE

Event that changes the cell value.

Parameter types of event callback function:

```
{ col: number; row: number; rawValue: string | number; currentValue: string | number; changedValue: string | number };
```

## CHECKBOX_STATE_CHANGE

Change the checkbox state. **ListTable table exclusive event**

Parameter types of event callback function:

```
{
  col: number;
  row: number;
  alue: string | number;
  dataValue: string | number;
  checked: boolean;
};
```

## RADIO_STATE_CHANGE

Change the radio state. **ListTable table exclusive event**

Parameter types of event callback function:

```
{
  col: number;
  row: number;
  alue: string | number;
  dataValue: string | number;
  radioIndexInCell: boolean | number;
};
```

If there is only one radio button in the cell, radioIndexInCell is of type boolean, indicating whether it is selected; if there are multiple radio buttons in the cell, radioIndexInCell is of type number, indicating the index of the selected radio button.
