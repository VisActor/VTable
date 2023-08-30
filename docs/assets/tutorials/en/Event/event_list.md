# Event event

## introduce

Table event list, you can listen to the required events according to actual needs, and realize custom business.

The specific return data of the event can be actually tested to observe whether it meets the business needs, or communicate with us.

| Name | Event Name | Description |
|:----|:----|:----|
| Click | CLICK\_CELL | Cell Click Event |
| Double Click | DBLCLICK\_CELL | Cell Double Click Event |
| Right Click | CONTEXTMENU\_CELL | Cell Right Click Event |
| Keyboard Press | CLICK\_CELL | Keyboard Press Events |
| mouse down | MOUSEDOWN\_CELL | cell mouse down event |
| mouse release | MOUSEUP\_CELL | cell mouse release event |
| Select state change | SELECTED\_CELL | Cell select state change event |
| mouse entry | MOUSEENTER\_CELL | mouse entry cell event |
| Mouse over | MOUSEOVER\_CELL | Mouse over cell event \[Currently only cells are supported as cells, and internal elements cannot trigger the corresponding mouseover and mouseout. It is recommended to use MOUSEENTER\_CELL] |
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
      const vtableInstance =new ListGrid(options);
      vtableInstance.listen(CLICK_CELL, (...args) => console.log(CLICK_CELL, args));
