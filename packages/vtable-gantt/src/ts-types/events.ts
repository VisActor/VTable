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
}

export interface TableEventHandlersReturnMap {
  scroll: void;
}
