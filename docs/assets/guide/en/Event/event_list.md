# Event event

## introduce

Table event list, you can listen to the required events according to actual needs, and realize custom business.

The specific return data of the event can be actually tested to observe whether it meets the business needs, or communicate with us.

For a more comprehensive list of events, please refer to: https://visactor.io/vtable/api/events

| Name                                       | Event Name                                          | Description                                                                                                            |
| :----------------------------------------- | :-------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| Life cycle event: initialization completed | INITIALIZED                                         | Life cycle event: triggered after successful initialization is completed                                               |
| Rendering Complete                         | AFTER_RENDER                                        | Triggered every time rendering is completed                                                                            |
| Listen to chart events                     | Same as the events specified in the vchart tutorial | Embed the chart in the table and use it when you need to listen to chart events. Using method `onVChartEvent` not `on` |
| Click                                      | CLICK_CELL                                          | Cell Click Event                                                                                                       |
| Double Click                               | DBLCLICK_CELL                                       | Cell Double Click Event                                                                                                |
| Right Click                                | CONTEXTMENU_CELL                                    | Cell Right Click Event                                                                                                 |
| Keyboard Press                             | CLICK_CELL                                          | Keyboard Press Events                                                                                                  |
| mouse down                                 | MOUSEDOWN_CELL                                      | cell mouse down event                                                                                                  |
| mouse release                              | MOUSEUP_CELL                                        | cell mouse release event                                                                                               |
| Select state change                        | SELECTED_CELL                                       | Cell select state change event                                                                                         |
| Select state be cleared                    | SELECTED_CLEAR                                      | Cell select state all be cleared event                                                                                 |
| mouse entry                                | MOUSEENTER_CELL                                     | mouse entry cell event                                                                                                 |
| mouse movement                             | MOUSEMOVE_CELL                                      | mouse movement event on a cell                                                                                         |
| mouse leave                                | MOUSELEAVE_CELL                                     | mouse leave cell event                                                                                                 |
| Drag Column Width                          | RESIZE_COLUMN                                       | Column Width Adjustment Event                                                                                          |
| Drag and drop column width end             | RESIZE_COLUMN_END                                   | column width adjustment end event                                                                                      |
| Drag Row Height                            | RESIZE_ROW                                          | Row Height Adjustment Event                                                                                            |
| Drag and drop row height end               | RESIZE_ROW_END                                      | row height adjustment end event                                                                                        |
| Drag header                                | CHANGE_HEADER_POSITION                              | Drag header to move position event                                                                                     |
| Click to sort                              | SORT_CLICK                                          | Click to sort icon event                                                                                               |
| After sort                                 | AFTER_SORT                                          | Execute after sorting event                                                                                            |
| Click Fixed Column                         | FREEZE_CLICK                                        | Click Fixed Column Icon Event                                                                                          |
| Scroll                                     | SCROLL                                              | Scroll Table Events                                                                                                    |
| Click the drop-down icon                   | DROPDOWNMENU_CLICK                                  | Click the drop-down menu icon event                                                                                    |
| Click on the drop-down menu                | MENU_CLICK                                          | Click on the drop-down menu Events                                                                                     |
| Mouse over miniature                       | MOUSEOVER_CHART_SYMBOL                              | Mouse over miniature mark events                                                                                       |
| Drag and drop box to select mouse release  | DRAG_SELECT_END                                     | Drag and drop box to select cell mouse release event                                                                   |
| drill button click                         | DRILLMENU_CLICK                                     | drill button click event                                                                                               |
| Pivot Table Tree Show Collapse             | TREE_HIERARCHY_STATE_CHANGE                         | Pivot Table Tree Show Collapse State Change Events                                                                     |
| Keys                                       | KEYDOWN                                             | Keyboard Press Events                                                                                                  |
| Legend item click event                    | LEGEND_ITEM_CLICK                                   | Mouse clicks on an item in the legend                                                                                  |
| Legend item hover                          | LEGEND_ITEM_HOVER                                   | Mouse hover an item in the legend                                                                                      |
| Legend item unhover                        | LEGEND_ITEM_UNHOVER                                 | Legend item when mouse leaves hover                                                                                    |
| The mouse enters the coordinate axis       | MOUSEENTER_AXIS                                     | The mouse enters the coordinate axis component                                                                         |
| mouse leaves the axis                      | MOUSELEAVE_AXIS                                     | mouse leaves the axis component                                                                                        |
| Listen to copy                             | COPY_DATA                                           | This event is triggered when a cell is copied using the shortcut key                                                   |
| The mouse enters the table area            | MOUSEENTER_TABLE                                    | This event is triggered when the mouse enters the table area                                                           |
| The mouse leaves the table area            | MOUSELEAVE_TABLE                                    | This event is triggered when the mouse leaves the table area                                                           |
| Mouse down                                 | MOUSEDOWN_TABLE                                     | This event is triggered when the mouse is pressed in the table area                                                    |

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
        RESIZE_ROW,
        SCROLL,
        SCROLL_VERTICAL_END,
        SCROLL_HORIZONTAL_END,
        CHANGED_VALUE,
        FREEZE_CLICK,
        SORT_CLICK,
        AFTER_SORT,
        DROPDOWN_MENU_CLICK,
        CONTEXTMENU_CELL,
      } = VTable.ListTable.EVENT_TYPE;
      const tableInstance =new ListTable(options);
      tableInstance.on(CLICK_CELL, (...args) => console.log(CLICK_CELL, args));
