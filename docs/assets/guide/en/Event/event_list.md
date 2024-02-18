# Event event

## introduce

Table event list, you can listen to the required events according to actual needs, and realize custom business.

The specific return data of the event can be actually tested to observe whether it meets the business needs, or communicate with us.

For a more comprehensive list of events, please refer to: https://visactor.io/vtable/api/events

| Name | Event Name | Description |
|:----|:----|:----|
|Life cycle event: initialization completed|INITIALIZED|Life cycle event: triggered after successful initialization is completed|
|Rendering Complete|AFTER\_RENDER|Triggered every time rendering is completed|
|Listen to chart events|Same as the events specified in the vchart tutorial|Embed the chart in the table and use it when you need to listen to chart events. Using method `onVChartEvent` not `on`|
| Click | CLICK\_CELL | Cell Click Event |
| Double Click | DBLCLICK\_CELL | Cell Double Click Event |
| Right Click | CONTEXTMENU\_CELL | Cell Right Click Event |
| Keyboard Press | CLICK\_CELL | Keyboard Press Events |
| mouse down | MOUSEDOWN\_CELL | cell mouse down event |
| mouse release | MOUSEUP\_CELL | cell mouse release event |
| Select state change | SELECTED\_CELL | Cell select state change event |
| mouse entry | MOUSEENTER\_CELL | mouse entry cell event |
| mouse movement | MOUSEMOVE\_CELL | mouse movement event on a cell |
| mouse leave | MOUSELEAVE\_CELL | mouse leave cell event |
| Drag Column Width | RESIZE\_COLUMN | Column Width Adjustment Event |
| Drag and drop column width end | RESIZE\_COLUMN\_END | column width adjustment end event |
| Drag header | CHANGE\_HEADER\_POSITION | Drag header to move position event |
| Click to sort | SORT\_CLICK | Click to sort icon event |
| Click Fixed Column | FREEZE\_CLICK | Click Fixed Column Icon Event |
| Scroll | SCROLL | Scroll Table Events |
| Click the drop-down icon | DROPDOWNMENU\_CLICK | Click the drop-down menu icon event |
| Click on the drop-down menu | MENU\_CLICK | Click on the drop-down menu Events |
| Mouse over miniature | MOUSEOVER\_CHART\_SYMBOL | Mouse over miniature mark events |
| Drag and drop box to select mouse release | DRAG\_SELECT\_END | Drag and drop box to select cell mouse release event |
| drill button click | DRILLMENU\_CLICK | drill button click event |
| Pivot Table Tree Show Collapse | TREE\_HIERARCHY\_STATE\_CHANGE | Pivot Table Tree Show Collapse State Change Events |
| Keys | KEYDOWN | Keyboard Press Events |
|Legend item click event|LEGEND\_ITEM\_CLICK|Mouse clicks on an item in the legend|
|Legend item hover|LEGEND\_ITEM\_HOVER|Mouse hover an item in the legend|
|Legend item unhover|LEGEND\_ITEM\_UNHOVER|Legend item when mouse leaves hover|
|The mouse enters the coordinate axis|MOUSEENTER\_AXIS|The mouse enters the coordinate axis component|
|mouse leaves the axis|MOUSELEAVE\_AXIS|mouse leaves the axis component|
|Listen to copy|COPY\_DATA|This event is triggered when a cell is copied using the shortcut key|

## Event monitoring method

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
