export interface EVENT_TYPES {
  /**
   * 滚动表格事件
   */
  SCROLL: 'scroll';
  CHANGE_DATE_RANGE: 'change_date_range';
  CLICK_TASK_BAR: 'click_task_bar';
  MOUSE_ENTER_TASK_BAR: 'mouseenter_taskbar';
  MOUSE_LEAVE_TASK_BAR: 'mouseleave_taskbar';
}
/**
 * Table event types
 */
export const GANTT_EVENT_TYPE: EVENT_TYPES = {
  SCROLL: 'scroll',
  CHANGE_DATE_RANGE: 'change_date_range',
  CLICK_TASK_BAR: 'click_task_bar',
  MOUSE_ENTER_TASK_BAR: 'mouseenter_taskbar',
  MOUSE_LEAVE_TASK_BAR: 'mouseleave_taskbar'
} as EVENT_TYPES;
