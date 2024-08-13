export interface EVENT_TYPES {
  /**
   * 滚动表格事件
   */
  SCROLL: 'scroll';
  CHANGE_DATE_RANGE: 'change_date_range';
  CLICK_TASK_BAR: 'click_task_bar';
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar';
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar';
}
/**
 * Table event types
 */
export const GANTT_EVENT_TYPE: EVENT_TYPES = {
  SCROLL: 'scroll',
  CHANGE_DATE_RANGE: 'change_date_range',
  CLICK_TASK_BAR: 'click_task_bar',
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar',
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar'
} as EVENT_TYPES;
