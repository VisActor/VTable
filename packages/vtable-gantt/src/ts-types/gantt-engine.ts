import type { ColumnsDefine, TYPES, ListTableConstructorOptions } from '@visactor/vtable';
import type { Group } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';
export type LayoutObjectId = number | string;

export interface ITimelineDateInfo {
  days: number;
  endDate: Date;
  startDate: Date;
  title: string;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
}

export interface ITimelineHeaderStyle {
  padding?: number | number[];
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  strokeColor?: string;
  // backgroundColor?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // 设置单元格内文字的水平对齐方式
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // 设置单元格内文字的垂直对齐方式
  textStick?: boolean;
}
export interface IGrid {
  backgroundColor?: string;
  verticalLine?: ILineStyle;
  horizontalLine?: ILineStyle;
}
//#region gantt
export interface GanttConstructorOptions {
  /**
   * 数据集合
   */
  records?: any[];

  /** 左侧任务信息表格相关配置 */
  taskListTable?: {
    /** 左侧任务列表信息占用的宽度。如果设置为'auto'表示将所有列完全展示 */
    tableWidth?: 'auto' | number;
    /** 左侧任务列表 最小宽度 */
    minTableWidth?: number;
    /** 左侧任务列表 最大宽度 */
    maxTableWidth?: number;
  } & Omit<
    //ListTable表格可配置的属性
    ListTableConstructorOptions,
    | 'container'
    | 'records'
    | 'defaultHeaderRowHeight'
    | 'defaultRowHeight'
    | 'overscrollBehavior'
    | 'rowSeriesNumber'
    | 'scrollStyle'
    | 'pixelRatio'
    | 'title'
  >;
  /** 时间刻度 */
  timelineHeader: {
    backgroundColor?: string;
    colWidth?: number;
    /** 垂直间隔线样式 */
    verticalLine?: ILineStyle;
    /** 水平间隔线样式 */
    horizontalLine?: ILineStyle;
    scales: ITimelineScale[];
  };

  /** 任务条相关配置及样式 */
  taskBar?: {
    /** 任务开始日期对应的数据字段名 默认按'startDate' */
    startDateField?: string;
    /** 任务结束日期对应的数据字段名 默认按'endDate'  */
    endDateField?: string;
    /** 任务进度对应的数据字段名 */
    progressField?: string;
    /** 任务条展示文字。可以配置固定文本 或者 字符串模版`${fieldName}` */
    labelText?: ITaskBarLabelText;
    /** 任务条文字样式 */
    labelTextStyle?: ITaskBarLabelTextStyle;
    /** 任务条样式 */
    barStyle?: ITaskBarStyle;
    /** 自定义布局渲染 */
    customLayout?: ITaskBarCustomLayout;
    /** 任务条是否可调整大小 */
    resizable?: boolean;
    /** 任务条是否可移动 */
    moveable?: boolean;
    /** 任务条hover时的样式 */
    hoverBarStyle?: ITaskBarHoverStyle;
    /** 任务条选择时的样式 TODO */
    selectedBarStyle?: ITaskBarSelectedStyle;
    /** 任务条是否可选择，默认为true */
    selectable?: boolean;
    /** 任务条右键菜单 */
    menu?: {
      /** 右键菜单。代替原来的option.contextmenu */
      contextMenuItems?:
        | TYPES.MenuListItem[]
        | ((
            record: string,
            index: number,
            /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
            dateIndex: number,
            startDate: Date,
            endDate: Date
          ) => TYPES.MenuListItem[]);
    };
    /** 数据没有排期时，可通过创建任务条排期。默认为true */
    scheduleCreatable?: boolean;
    /** 针对没有分配日期的任务，可以显示出创建按钮 */
    scheduleCreation?: {
      buttonStyle: ILineStyle & {
        cornerRadius?: number;
        backgroundColor?: string;
      };
      /** 任务条创建按钮的自定义渲染 */
      customLayout?: ITaskCreationCustomLayout;
    };
  };
  /** 数据条目可唯一标识的字段名,默认为'id' */
  taskKeyField?: string;
  /** 任务之间的依赖关系 */
  dependency?: {
    links: ITaskLink[];
    linkLineStyle?: ILineStyle;
    linkLineCreatable?: boolean;
    linkLineSelectable?: boolean;
    linkLineSelectedStyle?: ITaskLinkSelectedStyle;
    /** 创建关联线的操作点 */
    linkLineCreatePointStyle: IPointStyle;
    /** 创建关联线的操作点响应状态效果 */
    linkLineCreatingPointStyle: IPointStyle;
    /** 创建关联线的操作线样式 */
    linkLineCreatingStyle?: ILineStyle;
  };
  /** 网格线配置 */
  grid?: IGrid;

  /** 整个外边框及横纵分割线配置。 */
  frame?: {
    outerFrameStyle: IFrameStyle;
    verticalSplitLine?: ILineStyle;
    horizontalSplitLine?: ILineStyle;
    verticalSplitLineMoveable?: boolean;
    //列调整宽度的直线
    verticalSplitLineHighlight?: ILineStyle;
  };

  /** 标记线配置 如果配置为true 会自动给今天做标记 */
  markLine?: boolean | IMarkLine | IMarkLine[];

  /** 指定整个甘特图的最小日期 */
  minDate?: string;
  /** 指定整个甘特图的最大日期 不设置的话用默认规则*/
  maxDate?: string;

  /** 顶部表头部分默认行高。如果想按表头层级依次配置，请配置到timelineHeader.scale中 */
  headerRowHeight?: number;

  /** 数据默认行高 */
  rowHeight?: number;

  /** 行号配置 */
  rowSeriesNumber?: IRowSeriesNumber;

  /**
   * 'auto':和浏览器滚动行为一致 表格滚动到顶部/底部时 触发浏览器默认行为;
   *  设置为 'none' 时, 表格滚动到顶部/底部时, 不再触发父容器滚动
   * */
  overscrollBehavior?: 'auto' | 'none';

  scrollStyle?: IScrollStyle;

  pixelRatio?: number;
  dateFormat?:
    | 'yyyy-mm-dd'
    | 'dd-mm-yyyy'
    | 'mm/dd/yyyy'
    | 'yyyy/mm/dd'
    | 'dd/mm/yyyy'
    | 'yyyy.mm.dd'
    | 'dd.mm.yyyy'
    | 'mm.dd.yyyy';

  /** 表格绘制范围外的canvas上填充的颜色 */
  underlayBackgroundColor?: string;
}
/**
 * IBarLabelText
 * 可以配置固定文本 或者 ${fieldName} 或者自定义函数
 */
export type ITaskBarLabelText = string; //| string[] | ((args: any) => string | string[]);
export interface ITimelineScale {
  rowHeight?: number;
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
  step: number;
  startOfWeek?: 'sunday' | 'monday';
  customLayout?: IDateCustomLayout;
  style?: ITimelineHeaderStyle;
  format?: (date: DateFormatArgumentType) => string;
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
  // /** 任务条的边框 */
  // borderWidth?: number;
  // /** 边框颜色 */
  // borderColor?: string;
}
export type ILineStyle = {
  lineColor?: string;
  lineWidth?: number;
  lineDash?: number[];
};
export type IPointStyle = {
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
  radius?: number;
};
export interface IMarkLine {
  date: string;
  style?: ILineStyle;
  /** 标记线显示在日期列下的位置 默认为'left' */
  position?: 'left' | 'right' | 'middle';
  /** 自动将日期范围内 包括改标记线 */
  scrollToMarkLine?: boolean;
}
export type ITableColumnsDefine = ColumnsDefine;
export type IFrameStyle = {
  borderColor?: string;
  borderLineWidth?: number;
  borderLineDash?: number[];
  cornerRadius?: number;
};

export type ITableStyle = TYPES.ThemeStyle;
export type IRowSeriesNumber = TYPES.IRowSeriesNumber;
export type IScrollStyle = TYPES.ScrollStyle;
export type DateFormatArgumentType = {
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  startDate: Date;
  endDate: Date;
};
export type TaskBarCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  startDate: Date;
  endDate: Date;
  taskDays: number;
  progress: number;
  taskRecord: any;
  ganttInstance: Gantt;
};
export type ITaskBarCustomLayoutObj = {
  rootContainer: Group;
  renderDefaultBar?: boolean; // 默认false
  renderDefaultResizeIcon?: boolean; // 默认false
  renderDefaultText?: boolean; // 默认false
};
export type ITaskBarCustomLayout = (args: TaskBarCustomLayoutArgumentType) => ITaskBarCustomLayoutObj; //CustomLayout

export type DateCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  title: string;
  startDate: Date;
  endDate: Date;
  days: number;
  ganttInstance: Gantt;
};
export type IDateCustomLayoutObj = {
  rootContainer: Group;
  renderDefaultText?: boolean; // 默认false
};
export type IDateCustomLayout = (args: DateCustomLayoutArgumentType) => IDateCustomLayoutObj;

export type TaskCreationCustomLayoutArgumentType = {
  width: number;
  height: number;
  // index: number;
  ganttInstance: Gantt;
};
export type ITaskCreationCustomLayoutObj = {
  rootContainer: Group;
};
export type ITaskCreationCustomLayout = (args: TaskCreationCustomLayoutArgumentType) => ITaskCreationCustomLayoutObj;

export type ITaskLink = {
  /** 依赖的类型 */
  type: DependencyType;
  linkedFromTaskKey?: string | number;
  linkedToTaskKey?: string | number;
};

export type ITaskLinkSelectedStyle = ILineStyle & {
  shadowBlur?: number; //阴影宽度
  shadowOffset?: number; //偏移
  shadowColor?: string; //阴影颜色
};
export enum DependencyType {
  FinishToStart = 'finish_to_start',
  StartToStart = 'start_to_start',
  FinishToFinish = 'finish_to_finish',
  StartToFinish = 'start_to_finish'
}
export type ITaskBarSelectedStyle = {
  shadowBlur?: number; //阴影宽度
  shadowOffsetX?: number; //x方向偏移
  shadowOffsetY?: number; //Y方向偏移
  shadowColor?: string; //阴影颜色
  borderColor?: string; //边框颜色
  borderLineWidth?: number;
};
export type ITaskBarHoverStyle = {
  /** 任务条的圆角 */
  cornerRadius?: number;
  barOverlayColor?: string;
};
//#endregion
