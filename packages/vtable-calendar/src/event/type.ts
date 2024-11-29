import type { MousePointerCellEvent } from '@visactor/vtable';
import type { IEventData } from '../custom/custom-handler';
import type { SelectedCellEvent } from '@visactor/vtable/es/ts-types';

export interface CalendarEvents {
  /**
   * 日期点击事件
   */
  CALENDAR_DATE_CLICK: 'calendar_date_click';
  /**
   * 日期选中状态改变事件
   */
  SELECTED_DATE: 'selected_date';
  /**
   * 日期选中状态改变事件
   */
  SELECTED_DATE_CLEAR: 'selected_date_clear';
  /**
   * 拖拽框选日期鼠标松开事件
   */
  DRAG_SELECT_DATE_END: 'drag_select_date_end';
  /**
   * 自定义事件点击事件
   */
  CALENDAR_CUSTOM_EVENT_CLICK: 'calendar_custom_event_click';
}

/**
 * Calendar event types
 */
export const CALENDAR_EVENT_TYPE: CalendarEvents = {
  CALENDAR_DATE_CLICK: 'calendar_date_click',
  SELECTED_DATE: 'selected_date',
  SELECTED_DATE_CLEAR: 'selected_date_clear',
  DRAG_SELECT_DATE_END: 'drag_select_date_end',
  CALENDAR_CUSTOM_EVENT_CLICK: 'calendar_custom_event_click'
} as CalendarEvents;

export interface CalendarEventHandlersEventArgumentMap {
  calendar_date_click: { date: Date; tableEvent: MousePointerCellEvent };
  selected_date: { date: Date; tableEvent: SelectedCellEvent };
  selected_date_clear: void;
  drag_select_date_end: { dates: Date[]; tableEvent: MousePointerCellEvent };
  calendar_custom_event_click: { date: Date; tableEvent: MousePointerCellEvent; customEvent: IEventData };
}

export interface CalendarEventHandlersReturnMap {
  calendar_date_click: void;
  selected_date: void;
  selected_date_clear: void;
  drag_select_date_end: void;
  calendar_custom_event_click: void;
}

export type CalendarEventListener<TYPE extends keyof CalendarEventHandlersEventArgumentMap> = (
  args: CalendarEventHandlersEventArgumentMap[TYPE]
) => CalendarEventHandlersReturnMap[TYPE]; //AnyFunction;
