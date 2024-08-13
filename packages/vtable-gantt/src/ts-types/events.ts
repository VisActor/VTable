export type TableEventListener<TYPE extends keyof TableEventHandlersEventArgumentMap> = (
  args: TableEventHandlersEventArgumentMap[TYPE]
) => TableEventHandlersReturnMap[TYPE]; //AnyFunction;
export type EventListenerId = number;

export interface TableEventHandlersEventArgumentMap {
  scroll: {
    scrollLeft: number;
    scrollTop: number;
    // scrollWidth: number;
    // scrollHeight: number;
    // viewWidth: number;
    // viewHeight: number;
    scrollDirection: 'horizontal' | 'vertical';
    scrollRatioX?: number;
    scrollRatioY?: number;
  };
  mouseenter_taskbar: {
    index: number;
    record: any;
    event: Event;
  };
  mouseleave_taskbar: {
    index: number;
    record: any;
    event: Event;
  };
  click_task_bar: {
    index: number;
    record: any;
    event: Event;
  };
  change_date_range: {
    index: number;
    startDate: Date;
    endDate: Date;
    oldStartDate: Date;
    oldEndDate: Date;
    record: any;
  };
}

export interface TableEventHandlersReturnMap {
  scroll: void;
  mouseenter_taskbar: void;
  mouseleave_taskbar: void;
  click_task_bar: void;
  change_date_range: void;
}
