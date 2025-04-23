import type { FederatedPointerEvent } from '@visactor/vtable/es/vrender';
import type { IMarkLine, ITaskLink, ITimelineDateInfo } from './gantt-engine';
import type { IPosition } from './common';

export type TableEventListener<TYPE extends keyof TableEventHandlersEventArgumentMap> = (
  args: TableEventHandlersEventArgumentMap[TYPE]
) => TableEventHandlersReturnMap[TYPE]; //AnyFunction;
export type EventListenerId = number;

export interface TableEventHandlersEventArgumentMap {
  scroll: {
    scrollLeft: number;
    scrollTop: number;
    scrollDirection: 'horizontal' | 'vertical';
    scrollRatioX?: number;
    scrollRatioY?: number;
  };

  mouseenter_task_bar: {
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  };
  mouseleave_task_bar: {
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  };
  click_task_bar: {
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  };
  contextmenu_task_bar: {
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    record: any;
    event: Event;
    federatedEvent: FederatedPointerEvent;
  };
  change_date_range: {
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    /** 改变后的起始日期 */
    startDate: Date;
    /** 改变后的结束日期 */
    endDate: Date;
    /** 改变前的起始日期 */
    oldStartDate: Date;
    /** 改变前的结束日期 */
    oldEndDate: Date;
    /** 改变后的数据条目 */
    record: any;
  };
  create_task_schedule: {
    federatedEvent: FederatedPointerEvent;
    event: Event;
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    /** 改变后的起始日期 */
    startDate: string;
    /** 改变后的结束日期 */
    endDate: string;
    /** 改变后的数据条目 */
    record: any;
    /** 如果是子任务模式，父级数据信息 */
    parentRecord?: any;
  };
  create_dependency_link: {
    federatedEvent: FederatedPointerEvent;
    event: Event;
    /** 依赖信息 */
    link: ITaskLink;
  };
  delete_dependency_link: {
    event: KeyboardEvent;
    /** 依赖信息 */
    link: ITaskLink;
  };
  click_dependency_link_point: {
    event: Event;
    /** 点击的是起始点还是结束点 */
    point: 'start' | 'end';
    /** 第几条数据 */
    index: number;
    sub_task_index?: number;
    record: any;
  };
  contextmenu_dependency_link: {
    federatedEvent: FederatedPointerEvent;
    event: Event;
    /** 依赖信息 */
    link: ITaskLink;
  };
  click_markline_create: {
    event: Event;
    data: ITimelineDateInfo;
    position: IPosition;
  };
  click_markline_content: {
    event: Event;
    data: IMarkLine;
    position: IPosition;
  };

  // 添加缩放事件参数
  zoom: {
    /** 缩放前的列宽 */
    oldWidth: number;
    /** 缩放后的列宽 */
    newWidth: number;
    /** 缩放比例 (newWidth / oldWidth) */
    scale: number;
  };
}

export interface TableEventHandlersReturnMap {
  scroll: void;
  mouseenter_task_bar: void;
  mouseleave_task_bar: void;
  click_task_bar: void;
  contextmenu_task_bar: void;
  change_date_range: void;
  create_task_schedule: void;
  create_dependency_link: void;
  delete_dependency_link: void;
  click_dependency_link_point: void; // 注意：这个在原接口中缺失，我添加了它
  contextmenu_dependency_link: void;
  click_markline_create: void;
  click_markline_content: void;

  // 添加缩放事件返回类型
  zoom: void;
}
