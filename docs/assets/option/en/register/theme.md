{{ target: register-theme }}

# theme.register

Form event list, you can listen to the required events according to the actual needs, to achieve customized business.

Specific ways to use it:
``
const tableInstance =new VTable.ListTable(options);

const {
CLICK_CELL
} = VTable.ListTable.EVENT_TYPE;

tableInstance.on(CLICK_CELL, (args) => console.log(CLICK_CELL, args));
``

Supported event types（not all）:

`TABLE_EVENT_TYPE = {
  CLICK_CELL: 'click_cell',
  DBLCLICK_CELL: 'dblclick_cell',
  MOUSEDOWN_CELL: 'mousedown_cell',
  MOUSEUP_CELL: 'mouseup_cell',
  SELECTED_CELL: 'selected_cell',
  KEYDOWN: 'keydown',
  MOUSEENTER_TABLE: 'mouseenter_table',
  MOUSELEAVE_TABLE: 'mouseleave_table',
  MOUSEMOVE_CELL: 'mousemove_cell',
  MOUSEENTER_CELL: 'mouseenter_cell',
  MOUSELEAVE_CELL: 'mouseleave_cell',
  CONTEXTMENU_CELL: 'contextmenu_cell',
  RESIZE_COLUMN: 'resize_column',
  RESIZE_COLUMN_END: 'resize_column_end',
  RESIZE_ROW: 'resize_row',
  RESIZE_ROW_END: 'resize_row_end',
  CHANGE_HEADER_POSITION: 'change_header_position',
  SORT_CLICK: 'sort_click',
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
  // Pivot table-specific events
   DRILLMENU_CLICK: 'drillmenu_click',
  PIVOT_SORT_CLICK: 'pivot_sort_click'
}`

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

Refer to the parameter types described in the CLICK_CELL event for the parameter types of the event callback function.

## SELECTED_CELL

Cell selected state change event

{{ use: SelectedCellEvent() }}

## KEYDOWN

keystroke event

{{ use: KeydownEvent() }}

## MOUSEENTER_TABLE

Mouse over form event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSELEAVE_TABLE

Mouse off form event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSEMOVE_CELL

Mouse over a cell event

Refer to the parameter types introduced in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSEENTER_CELL

Mouse into cell event

Refer to the parameter types described in the CLICK_CELL event for the parameter types of the event callback function.

## MOUSELEAVE_CELL

Mouse-out-of-cell event

Refer to the parameter types described in the CLICK_CELL event for the parameter types of the event callback function.

## CONTEXTMENU_CELL

Cell right-click events

{{ use: MousePointerMultiCellEvent() }}

## RESIZE_COLUMN

Column width adjustment events.

Event callback function parameter types.
``

{
col: number;
colWidth: number
}

``

## RESIZE_COLUMN_END

Column width adjustment end event.

Event callback function parameter types.
``

{
col: number;
colWidths: number[]
}

``

## RESIZE_ROW

Row height adjustment events.

Event callback function parameter types.
``

{
row: number;
rowHeight: number
}

``

## RESIZE_ROW_END

Row height adjustment end event.

Event callback function parameter types.
``

{
row: number;
rowHeight: number
}

``

## CHANGE_HEADER_POSITION

Drag and drop the table header to move the position of the event

Parameter types for event callback functions.
``
{
source: CellAddress.
target: CellAddress
}

``

## SORT_CLICK

Click on the sort icon event.

Parameter types for event callback functions.
`  {
    field: string;
    order: 'asc' | 'desc' | 'normal';
    event: Event;
  }`

## AFTER_SORT

After sorting event.
Parameter types for event callback functions.
`{
  order: 'asc' | 'desc' | 'normal';
  field: string;
  event: Event;
}`

## FREEZE_CLICK

Click on the fixed column icon to freeze or unfreeze the event.

Event callback function parameter types.
`{
  col: number;
  row: number;
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

## DROPDOWN_MENU_CLICK

Click the drop-down menu icon event.

{{ use: DropDownMenuEventArgs() }}

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

Sort icon click event in the pivot table.

Parameter types for event callback functions.
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
