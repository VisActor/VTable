import type { ColumnsDefine, TYPES, VRender } from '@visactor/vtable';
export type LayoutObjectId = number | string;

export interface ITimelineHeaderStyle {
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
}
export interface IGridStyle {
  backgroundColor?: string;
  vertical?: {
    lineColor?: string;
    lineWidth?: number;
  };
  horizontal?: {
    lineColor?: string;
    lineWidth?: number;
  };
}
//#region gantt
export interface GanttConstructorOptions {
  container?: HTMLElement;
  /**
   * 数据集合
   */
  records?: any[];
  /** 时间刻度 */
  timelineScales: ITimelineScale[];

  /** 时间刻度对应的字段名 */
  startDateField: string;
  /** 时间刻度对应的字段名 */
  endDateField: string;
  /** 进度对应的字段名 */
  progressField: string;
  /** 指定整个甘特图的最小日期 */
  minDate?: string;
  /** 指定整个甘特图的最大日期 不设置的话用默认规则*/
  maxDate?: string;
  defaultHeaderRowHeight?: number;
  defaultRowHeight?: number;
  timelineColWidth?: number;

  rowSeriesNumber?: IRowSeriesNumber;
  dragHeader?: boolean;

  /**
   * 'auto':和浏览器滚动行为一致 表格滚动到顶部/底部时 触发浏览器默认行为;
   *  设置为 'none' 时, 表格滚动到顶部/底部时, 不再触发父容器滚动
   * */
  overscrollBehavior?: 'auto' | 'none';

  markLine?: boolean | IMarkLine | IMarkLine[];
  // /** 设置的表格主题 */
  // theme?: TableTheme;
  /** 设置任务条样式 可以设置多组 依次循环使用 */
  taskBar?: {
    labelText?: ITaskBarLabelText;
    labelTextStyle?: ITaskBarLabelTextStyle;
    barStyle?: ITaskBarStyle;
    customRender?: ITaskBarCustomRender;
  };

  taskListTable?: {
    /** 定义列 */
    columns?: ColumnsDefine; // (string | IDimension)[];
    /** 左侧任务列表信息占用的宽度。如果设置为'auto'表示将所有列完全展示 */
    width?: 'auto' | number;
    headerStyle?: ITableStyle;
    bodyStyle?: ITableStyle;
    /** 左侧任务列表 最小宽度 */
    minWidth?: number;
    /** 左侧任务列表 最大宽度 */
    maxWidth?: number;
  };
  gridStyle?: IGridStyle;
  timelineHeaderStyle?: ITimelineHeaderStyle;
  scrollStyle?: IScrollStyle;

  frameStyle: IFrameStyle;
  pixelRatio?: number;

  //列调整宽度的直线
  resizeLineStyle?: IResizeLineStyle;
  // taskTableTheme?: ITableThemeDefine;
}
/**
 * IBarLabelText
 * 可以配置固定文本 或者 ${fieldName} 或者自定义函数
 */
export type ITaskBarLabelText = string; //| string[] | ((args: any) => string | string[]);
export interface ITimelineScale {
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
  startOfWeek?: 'sunday' | 'monday';
  format: (date: DateFormatArgumentType) => string | number;
}
export interface ITaskBarLabelTextStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // 设置单元格内文字的水平对齐方式
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // 设置单元格内文字的垂直对齐方式
  padding?: number | number[];
}
export interface ITaskBarStyle {
  /** 任务条的颜色 */
  barColor?: string;
  /** 已完成部分任务条的颜色 */
  completedBarColor?: string;
  /** 任务条的宽度 */
  width?: number;
  /** 任务条的圆角 */
  cornerRadius?: number;
  /** 任务条的边框 */
  borderWidth?: number;
  /** 边框颜色 */
  borderColor?: string;
}
export interface IMarkLine {
  date?: string;
  style?: {
    lineColor?: string;
    lineWidth?: number;
    lineDash?: number[];
  };
}
export type ITableColumnsDefine = ColumnsDefine;
export type IFrameStyle = {
  borderColor?: string;
  borderLineWidth?: number;
  borderLineDash?: number[];
  cornerRadius?: number;
};
export type IResizeLineStyle = {
  lineColor: string; //线的颜色
  lineWidth: number; //线的宽度
};
export type ITableStyle = TYPES.ThemeStyle;
export type IRowSeriesNumber = TYPES.IRowSeriesNumber;
export type IScrollStyle = TYPES.ScrollStyle;
export type DateFormatArgumentType = { dateIndex: number; dateStart: Date; dateEnd: Date };
export type ITaskBarCustomRender = ITaskBarCustomRenderObj | ((args: any) => ITaskBarCustomRenderObj); //CustomLayout
export type ITaskBarCustomRenderObj = {
  rootContainer: VRender.Container;
  renderDefaultBar?: boolean; // 默认false
  renderDefaultText?: boolean; // 默认false
};

//#endregion
