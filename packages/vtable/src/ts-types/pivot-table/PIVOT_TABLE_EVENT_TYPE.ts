import type { TableEvents } from '../../core/TABLE_EVENT_TYPE';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';
import { extend } from '../../tools/helper';

export interface PivotTableEvents extends TableEvents {
  /**
   * 透视表中排序图标点击事件
   */
  PIVOT_SORT_CLICK: 'pivot_sort_click';
  /**
   * 下钻按钮点击事件
   */
  DRILLMENU_CLICK: 'drillmenu_click';
}

export interface PivotChartEvents extends TableEvents {
  /**
   * 代理vchart中的事件
   */
  VCHART_EVENT_TYPE: 'vchart_event_type';
}
export const PIVOT_TABLE_EVENT_TYPE: PivotTableEvents = extend(TABLE_EVENT_TYPE, {
  PIVOT_SORT_CLICK: 'pivot_sort_click' as const,
  DRILLMENU_CLICK: 'drillmenu_click' as const
});
export const PIVOT_CHART_EVENT_TYPE: PivotChartEvents = extend(TABLE_EVENT_TYPE, {
  VCHART_EVENT_TYPE: 'vchart_event_type' as const
});
