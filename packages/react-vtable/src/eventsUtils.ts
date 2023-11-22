import { ListTable, PivotTable, PivotChart } from '@visactor/vtable';
import type { IVTable } from './tables/base-table';
import type { TableEventHandlersEventArgumentMap } from '@visactor/vtable/src/ts-types';

export type EventCallback<Params> = (params: Params) => void;

const EVENT_TYPE = {
  ...ListTable.EVENT_TYPE,
  ...PivotTable.EVENT_TYPE,
  ...PivotChart.EVENT_TYPE
};

export interface EventsProps {
  onClickCell?: EventCallback<TableEventHandlersEventArgumentMap['click_cell']>;
  onDblClickCell?: EventCallback<TableEventHandlersEventArgumentMap['dblclick_cell']>;
  onMouseDownCell?: EventCallback<TableEventHandlersEventArgumentMap['mousedown_cell']>;
  onMouseUpCell?: EventCallback<TableEventHandlersEventArgumentMap['mouseup_cell']>;
  onSelectedCell?: EventCallback<TableEventHandlersEventArgumentMap['selected_cell']>;
  onKeyDown?: EventCallback<TableEventHandlersEventArgumentMap['keydown']>;
  onMouseEnterTable?: EventCallback<TableEventHandlersEventArgumentMap['mouseenter_table']>;
  onMouseLeaveTable?: EventCallback<TableEventHandlersEventArgumentMap['mouseleave_table']>;
  onMouseMoveCell?: EventCallback<TableEventHandlersEventArgumentMap['mousemove_cell']>;
  onMouseEnterCell?: EventCallback<TableEventHandlersEventArgumentMap['mouseenter_cell']>;
  onMouseLeaveCell?: EventCallback<TableEventHandlersEventArgumentMap['mouseleave_cell']>;
  onContextMenuCell?: EventCallback<TableEventHandlersEventArgumentMap['contextmenu_cell']>;
  onResizeColumn?: EventCallback<TableEventHandlersEventArgumentMap['resize_column']>;
  onResizeColumnEnd?: EventCallback<TableEventHandlersEventArgumentMap['resize_column_end']>;
  onChangeHeaderPosition?: EventCallback<TableEventHandlersEventArgumentMap['change_header_position']>;
  onSortClick?: EventCallback<TableEventHandlersEventArgumentMap['sort_click']>;
  onFreezeClick?: EventCallback<TableEventHandlersEventArgumentMap['freeze_click']>;
  onScroll?: EventCallback<TableEventHandlersEventArgumentMap['scroll']>;
  onDropdownMenuClick?: EventCallback<TableEventHandlersEventArgumentMap['dropdown_menu_click']>;
  onMouseOverChartSymbol?: EventCallback<TableEventHandlersEventArgumentMap['mouseover_chart_symbol']>;
  onDragSelectEnd?: EventCallback<TableEventHandlersEventArgumentMap['drag_select_end']>;

  onDropdownIconClick?: EventCallback<TableEventHandlersEventArgumentMap['dropdown_icon_click']>;
  onDropdownMenuClear?: EventCallback<TableEventHandlersEventArgumentMap['dropdown_menu_clear']>;

  onTreeHierarchyStateChange?: EventCallback<TableEventHandlersEventArgumentMap['tree_hierarchy_state_change']>;

  onShowMenu?: EventCallback<TableEventHandlersEventArgumentMap['show_menu']>;
  onHideMenu?: EventCallback<TableEventHandlersEventArgumentMap['hide_menu']>;

  onIconClick?: EventCallback<TableEventHandlersEventArgumentMap['icon_click']>;

  onLegendItemClick?: EventCallback<TableEventHandlersEventArgumentMap['legend_item_click']>;
  onLegendItemHover?: EventCallback<TableEventHandlersEventArgumentMap['legend_item_hover']>;
  onLegendItemUnHover?: EventCallback<TableEventHandlersEventArgumentMap['legend_item_unHover']>;
  onLegendChange?: EventCallback<TableEventHandlersEventArgumentMap['legend_change']>;

  onMouseEnterAxis?: EventCallback<TableEventHandlersEventArgumentMap['mouseenter_axis']>;
  onMouseLeaveAxis?: EventCallback<TableEventHandlersEventArgumentMap['mouseleave_axis']>;

  onCheckboxStateChange?: EventCallback<TableEventHandlersEventArgumentMap['checkbox_state_change']>;
  onAfterRender?: EventCallback<TableEventHandlersEventArgumentMap['after_render']>;
  onInitialized?: EventCallback<TableEventHandlersEventArgumentMap['initialized']>;

  // pivot table only
  onPivotSortClick?: EventCallback<TableEventHandlersEventArgumentMap['pivot_sort_click']>;
  onDrillMenuClick?: EventCallback<TableEventHandlersEventArgumentMap['drillmenu_click']>;

  // pivot chart only
  onVChartEventType?: EventCallback<TableEventHandlersEventArgumentMap['vchart_event_type']>;
}

export const TABLE_EVENTS = {
  onClickCell: EVENT_TYPE.CLICK_CELL,
  onDblClickCell: EVENT_TYPE.DBLCLICK_CELL,
  onMouseDownCell: EVENT_TYPE.MOUSEDOWN_CELL,
  onMouseUpCell: EVENT_TYPE.MOUSEUP_CELL,
  onSelectedCell: EVENT_TYPE.SELECTED_CELL,
  onKeyDown: EVENT_TYPE.KEYDOWN,
  onMouseEnterTable: EVENT_TYPE.MOUSEENTER_TABLE,
  onMouseLeaveTable: EVENT_TYPE.MOUSELEAVE_TABLE,
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
  onAfterRender: EVENT_TYPE.AFTER_RENDER,
  onInitialized: EVENT_TYPE.INITIALIZED,

  // pivot table only
  onPivotSortClick: EVENT_TYPE.PIVOT_SORT_CLICK,
  onDrillMenuClick: EVENT_TYPE.DRILLMENU_CLICK,

  // pivot chart only
  onVChartEventType: EVENT_TYPE.VCHART_EVENT_TYPE
};

export const TABLE_EVENTS_KEYS = Object.keys(TABLE_EVENTS);

export const findEventProps = <T extends EventsProps>(
  props: T,
  supportedEvents: Record<string, string> = TABLE_EVENTS
): EventsProps => {
  const result: EventsProps = {};

  Object.keys(props).forEach(key => {
    if (supportedEvents[key]) {
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
        table.on(supportedEvents[eventKey] as keyof TableEventHandlersEventArgumentMap, newEventProps[eventKey]);
      }
    });
  }

  return true;
};
