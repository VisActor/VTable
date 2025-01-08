export interface EVENT_TYPES {
  /**
   * 滚动表格事件
   */
  SCROLL: 'scroll';
  /**
   * 改变日期范围事件
   */
  CHANGE_DATE_RANGE: 'change_date_range';
  /**
   * 点击任务条事件
   */
  CLICK_TASK_BAR: 'click_task_bar';
  /**
   * 右键点击任务条事件
   */
  CONTEXTMENU_TASK_BAR: 'contextmenu_task_bar';
  /**
   * 鼠标移入任务条事件
   */
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar';
  /**
   * 鼠标移出任务条事件
   */
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar';
  /**
   * 创建任务排期事件
   */
  CREATE_TASK_SCHEDULE: 'create_task_schedule';

  /**
   * 创建任务依赖关系
   */
  CREATE_DEPENDENCY_LINK: 'create_dependency_link';

  /**
   * 删除了任务依赖关系
   */
  DELETE_DEPENDENCY_LINK: 'delete_dependency_link';
  /**
   * 点击依赖关系连接点
   */
  CLICK_DEPENDENCY_LINK_POINT: 'click_dependency_link_point';
  /** 右键点击依赖关系 */
  CONTEXTMENU_DEPENDENCY_LINK: 'contextmenu_dependency_link';
}
/**
 * GanttChart event types
 */
export const GANTT_EVENT_TYPE: EVENT_TYPES = {
  SCROLL: 'scroll',
  CHANGE_DATE_RANGE: 'change_date_range',
  CLICK_TASK_BAR: 'click_task_bar',
  CONTEXTMENU_TASK_BAR: 'contextmenu_task_bar',
  MOUSEENTER_TASK_BAR: 'mouseenter_task_bar',
  MOUSELEAVE_TASK_BAR: 'mouseleave_task_bar',
  CREATE_TASK_SCHEDULE: 'create_task_schedule',
  CREATE_DEPENDENCY_LINK: 'create_dependency_link',
  DELETE_DEPENDENCY_LINK: 'delete_dependency_link',
  CLICK_DEPENDENCY_LINK_POINT: 'click_dependency_link_point',
  CONTEXTMENU_DEPENDENCY_LINK: 'contextmenu_dependency_link'
} as EVENT_TYPES;
