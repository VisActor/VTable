import type { ITaskLink } from './gantt-engine';

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
    record: any;
    event: Event;
  };
  mouseleave_task_bar: {
    /** 第几条数据 */
    index: number;
    record: any;
    event: Event;
  };
  click_task_bar: {
    /** 第几条数据 */
    index: number;
    record: any;
    event: Event;
  };
  change_date_range: {
    /** 第几条数据 */
    index: number;
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
    event: Event;
    /** 第几条数据 */
    index: number;
    /** 改变后的起始日期 */
    startDate: Date;
    /** 改变后的结束日期 */
    endDate: Date;
    /** 改变后的数据条目 */
    record: any;
  };
  create_dependency_link: {
    event: Event;
    /** 依赖信息 */
    link: ITaskLink;
  };
}

export interface TableEventHandlersReturnMap {
  scroll: void;
  mouseenter_task_bar: void;
  mouseleave_task_bar: void;
  click_task_bar: void;
  change_date_range: void;
  create_task_schedule: void;
  create_dependency_link: void;
}
