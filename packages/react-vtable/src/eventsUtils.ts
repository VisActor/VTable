import { ListTable, PivotTable, PivotChart } from '@visactor/vtable';
import type { IVTable } from './tables/base-table';
import type { TYPES } from '@visactor/vtable';

export type EventCallback<Params> = (params: Params) => void;

const EVENT_TYPE = {
  ...ListTable.EVENT_TYPE,
  ...PivotTable.EVENT_TYPE,
  ...PivotChart.EVENT_TYPE
};

export interface EventsProps {
  onClickCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['click_cell']>;
  onDblClickCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dblclick_cell']>;
  onMouseDownCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousedown_cell']>;
  onMouseUpCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseup_cell']>;
  onSelectedCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['selected_cell']>;
  onSelectedClear?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['selected_clear']>;
  onKeyDown?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['keydown']>;
  onMouseEnterTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_table']>;
  onMouseLeaveTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_table']>;
  onMouseDownTable?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousedown_table']>;
  onMouseMoveCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousemove_cell']>;
  onMouseEnterCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_cell']>;
  onMouseLeaveCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_cell']>;
  onContextMenuCell?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['contextmenu_cell']>;
  onResizeColumn?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['resize_column']>;
  onResizeColumnEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['resize_column_end']>;
  onChangeHeaderPosition?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['change_header_position']>;
  onSortClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['sort_click']>;
  onFreezeClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['freeze_click']>;
  onScroll?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['scroll']>;
  onDropdownMenuClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dropdown_menu_click']>;
  onMouseOverChartSymbol?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseover_chart_symbol']>;
  onDragSelectEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['drag_select_end']>;

  onDropdownIconClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dropdown_icon_click']>;
  onDropdownMenuClear?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dropdown_menu_clear']>;

  onTreeHierarchyStateChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['tree_hierarchy_state_change']>;

  onShowMenu?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['show_menu']>;
  onHideMenu?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['hide_menu']>;

  onIconClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['icon_click']>;

  onLegendItemClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_item_click']>;
  onLegendItemHover?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_item_hover']>;
  onLegendItemUnHover?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_item_unHover']>;
  onLegendChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['legend_change']>;

  onMouseEnterAxis?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseenter_axis']>;
  onMouseLeaveAxis?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mouseleave_axis']>;

  onCheckboxStateChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['checkbox_state_change']>;
  onRadioStateChange?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['radio_state_change']>;
  onAfterRender?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['after_render']>;
  onInitialized?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['initialized']>;

  // pivot table only
  onPivotSortClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['pivot_sort_click']>;
  onDrillMenuClick?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['drillmenu_click']>;

  // pivot chart only
  onVChartEventType?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['vchart_event_type']>;

  onChangCellValue?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['change_cell_value']>;

  onMousedownFillHandle?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['mousedown_fill_handle']>;
  onDragFillHandleEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['drag_fill_handle_end']>;
  onDblclickFillHandle?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['dblclick_fill_handle']>;

  onScrollVerticalEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['scroll_vertical_end']>;
  onScrollHorizontalEnd?: EventCallback<TYPES.TableEventHandlersEventArgumentMap['scroll_horizontal_end']>;
}

export const TABLE_EVENTS = {
  onClickCell: EVENT_TYPE.CLICK_CELL,
  onDblClickCell: EVENT_TYPE.DBLCLICK_CELL,
  onMouseDownCell: EVENT_TYPE.MOUSEDOWN_CELL,
  onMouseUpCell: EVENT_TYPE.MOUSEUP_CELL,
  onSelectedCell: EVENT_TYPE.SELECTED_CELL,
  onSelectedClear: EVENT_TYPE.SELECTED_CLEAR,
  onKeyDown: EVENT_TYPE.KEYDOWN,
  onMouseEnterTable: EVENT_TYPE.MOUSEENTER_TABLE,
  onMouseLeaveTable: EVENT_TYPE.MOUSELEAVE_TABLE,
  onMouseDownTable: EVENT_TYPE.MOUSEDOWN_TABLE,
  onMouseMoveCell: EVENT_TYPE.MOUSEMOVE_CELL,
  onMouseEnterCell: EVENT_TYPE.MOUSEENTER_CELL,
  onMouseLeaveCell: EVENT_TYPE.MOUSELEAVE_CELL,
  onContextMenuCell: EVENT_TYPE.CONTEXTMENU_CELL,
  onResizeColumn: EVENT_TYPE.RESIZE_COLUMN,
  onResizeColumnEnd: EVENT_TYPE.RESIZE_COLUMN_END,
  onChangeHeaderPosition: EVENT_TYPE.CHANGE_HEADER_POSITION,
  onSortClick: EVENT_TYPE.SORT_CLICK,
  onFreezeClick: EVENT_TYPE.FREEZE_CLICK,
  onScroll: EVENT_TYPE.SCROLL,
  onDropdownMenuClick: EVENT_TYPE.DROPDOWN_MENU_CLICK,
  onMouseOverChartSymbol: EVENT_TYPE.MOUSEOVER_CHART_SYMBOL,
  onDragSelectEnd: EVENT_TYPE.DRAG_SELECT_END,

  onDropdownIconClick: EVENT_TYPE.DROPDOWN_ICON_CLICK,
  onDropdownMenuClear: EVENT_TYPE.DROPDOWN_MENU_CLEAR,

  onTreeHierarchyStateChange: EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE,

  onShowMenu: EVENT_TYPE.SHOW_MENU,
  onHideMenu: EVENT_TYPE.HIDE_MENU,

  onIconClick: EVENT_TYPE.ICON_CLICK,

  onLegendItemClick: EVENT_TYPE.LEGEND_ITEM_CLICK,
  onLegendItemHover: EVENT_TYPE.LEGEND_ITEM_HOVER,
  onLegendItemUnHover: EVENT_TYPE.LEGEND_ITEM_UNHOVER,
  onLegendChange: EVENT_TYPE.LEGEND_CHANGE,

  onMouseEnterAxis: EVENT_TYPE.MOUSEENTER_AXIS,
  onMouseLeaveAxis: EVENT_TYPE.MOUSELEAVE_AXIS,

  onCheckboxStateChange: EVENT_TYPE.CHECKBOX_STATE_CHANGE,
  onRadioStateChange: EVENT_TYPE.RADIO_STATE_CHANGE,
  onAfterRender: EVENT_TYPE.AFTER_RENDER,
  onInitialized: EVENT_TYPE.INITIALIZED,

  // pivot table only
  onPivotSortClick: EVENT_TYPE.PIVOT_SORT_CLICK,
  onDrillMenuClick: EVENT_TYPE.DRILLMENU_CLICK,

  // pivot chart only
  onVChartEventType: EVENT_TYPE.VCHART_EVENT_TYPE,

  onChangCellValue: EVENT_TYPE.CHANGE_CELL_VALUE,
  onMousedownFillHandle: EVENT_TYPE.MOUSEDOWN_FILL_HANDLE,
  onDragFillHandleEnd: EVENT_TYPE.DRAG_FILL_HANDLE_END,
  onDblclickFillHandle: EVENT_TYPE.DBLCLICK_FILL_HANDLE,
  onScrollVerticalEnd: EVENT_TYPE.SCROLL_VERTICAL_END,
  onScrollHorizontalEnd: EVENT_TYPE.SCROLL_HORIZONTAL_END
};

export const TABLE_EVENTS_KEYS = Object.keys(TABLE_EVENTS);

export const findEventProps = <T extends EventsProps>(
  props: T,
  supportedEvents: Record<string, string> = TABLE_EVENTS
): EventsProps => {
  const result: EventsProps = {};

  Object.keys(props).forEach(key => {
    if (supportedEvents[key] && props[key]) {
      result[key] = props[key];
    }
  });

  return result;
};

export const bindEventsToTable = <T>(
  table: IVTable,
  newProps?: T | null,
  prevProps?: T | null,
  supportedEvents: Record<string, string> = TABLE_EVENTS
) => {
  if ((!newProps && !prevProps) || !table) {
    return false;
  }

  const prevEventProps = prevProps ? findEventProps(prevProps, supportedEvents) : null;
  const newEventProps = newProps ? findEventProps(newProps, supportedEvents) : null;

  if (prevEventProps) {
    Object.keys(prevEventProps).forEach(eventKey => {
      if (!newEventProps || !newEventProps[eventKey] || newEventProps[eventKey] !== prevEventProps[eventKey]) {
        table.off(supportedEvents[eventKey], prevProps[eventKey]);
      }
    });
  }

  if (newEventProps) {
    Object.keys(newEventProps).forEach(eventKey => {
      if (!prevEventProps || !prevEventProps[eventKey] || prevEventProps[eventKey] !== newEventProps[eventKey]) {
        table.on(supportedEvents[eventKey] as keyof TYPES.TableEventHandlersEventArgumentMap, newEventProps[eventKey]);
      }
    });
  }

  return true;
};
