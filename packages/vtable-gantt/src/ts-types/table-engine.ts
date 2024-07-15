import type { ColumnsDefine, TYPES } from '@visactor/vtable';
export type LayoutObjectId = number | string;

export interface CellAddress {
  col: number;
  row: number;
}
export interface CellAddressWithBound {
  col: number;
  row: number;
  rect?: TYPES.RectProps;
  x?: number;
  y?: number;
}
export interface CellRange {
  start: CellAddress;
  end: CellAddress;
}
export type TimelineHeaderStyle = {
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
};
export type GridStyle = {
  vertical: {
    lineColor?: string;
    lineWidth?: number;
  };
  horizontal: {
    lineColor?: string;
    lineWidth?: number;
  };
};
//#region gantt
export interface GanttConstructorOptions {
  container?: HTMLElement;
  /**
   * 数据集合
   */
  records?: any[];
  /** 时间刻度 */
  timelineScales: {
    unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
    step: number;
    format: (date: Date) => string;
  }[];
  /** 定义列 */
  taskTableColumns?: ColumnsDefine; // (string | IDimension)[];
  taskTableWidth?: 'auto' | number;
  gridStyle?: GridStyle;
  timelineHeaderStyle?: TimelineHeaderStyle;
  /** 时间刻度对应的字段名 */
  startField: string;
  /** 时间刻度对应的字段名 */
  endField: string;
  /** 指定整个甘特图的最小日期 */
  minDate?: string;
  /** 指定整个甘特图的最大日期 不设置的话用默认规则*/
  maxDate?: string;

  // /** 设置的表格主题 */
  // theme?: TableTheme;
  /** 设置任务条样式 可以设置多组 依次循环使用 */
  barStyle?: IBarStyleOption[]; // 参考https://lightcharts.bytedance.net/charts/doc/options#series.gantt.barStyle
  scrollStyle?: TYPES.ScrollStyle;
  defaultHeaderRowHeight?: number;
  defaultRowHeight?: number;
  timelineColWidth?: number;

  rowSeriesNumber?: TYPES.IRowSeriesNumber;
  dragHeader?: boolean;

  /**
   * 'auto':和浏览器滚动行为一致 表格滚动到顶部/底部时 触发浏览器默认行为;
   *  设置为 'none' 时, 表格滚动到顶部/底部时, 不再触发父容器滚动
   * */
  overscrollBehavior?: 'auto' | 'none';

  // taskTableTheme?: ITableThemeDefine;
}

export type IBarStyleOption = {
  /** 任务条的颜色 */
  barColor?: string;
  /** 已完成部分任务条的颜色 */
  barColor2?: string;
  /** 任务条的宽度 */
  width?: number;
  /** 任务条的圆角 */
  cornerRadius?: number;
  /** 任务条的边框 */
  borderWidth?: number;
  /** 边框颜色 */
  borderColor?: string;
  fontFamily?: string;
  fontSize?: number;
};
//#endregion
