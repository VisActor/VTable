import type { ColumnsDefine, TYPES, ListTableConstructorOptions } from '@visactor/vtable';
import type { Group } from '@visactor/vtable/es/vrender';
import type { Gantt } from '../Gantt';
export type LayoutObjectId = number | string;
import type { IGanttPlugin } from '../plugins/interface';
import type { IZoomScale } from './zoom-scale';
export interface ITimelineDateInfo {
  days: number;
  endDate: Date;
  startDate: Date;
  title: string;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  unit: 'year' | 'month' | 'quarter' | 'week' | 'day' | 'hour' | 'minute' | 'second';
  step: number;
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
  /** 需要按数据行设置不同背景色 */
  horizontalBackgroundColor?: string[] | ((args: GridHorizontalLineStyleArgumentType) => string);
  /** 需要按日期列设置不同背景色 */
  verticalBackgroundColor?: string[] | ((args: GridVerticalLineStyleArgumentType) => string);
  /** 周末背景色 */
  weekendBackgroundColor?: string;

  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
  /** 竖线依赖的日期刻度。默认为timelineHeader中scales中的最小时间粒度 */
  verticalLineDependenceOnTimeScale?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second';
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
    /**
     * ZoomScale 多级别缩放配置（优先级高于 timelineHeader.scales）
     * 当启用时，会根据缩放级别自动切换不同的 scales 组合
     */
    zoomScale?: IZoomScale;
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
    barStyle?: ITaskBarStyle | ((args: TaskBarInteractionArgumentType) => ITaskBarStyle);
    milestoneStyle?: IMilestoneStyle;
    projectStyle?: ITaskBarStyle | ((args: TaskBarInteractionArgumentType) => ITaskBarStyle);
    /** 自定义布局渲染 */
    customLayout?: ITaskBarCustomLayout;
    /** 任务条是否可调整大小 */
    resizable?:
      | boolean
      | [boolean, boolean]
      | ((interactionArgs: TaskBarInteractionArgumentType) => boolean | [boolean, boolean]);
    /** 任务条是否可移动 */
    moveable?: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);
    /** 任务进度是否可调整 */
    progressAdjustable?: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);
    /** 任务条拖拽超出当前日期范围时自动扩展日期范围 */
    moveToExtendDateRange?: boolean;
    /** 任务条是否可以被拖拽来改变顺序 */
    dragOrder?: boolean;
    /** 任务条hover时的样式 */
    hoverBarStyle?: ITaskBarHoverStyle;
    /** 任务条选择时的样式 TODO */
    selectedBarStyle?: ITaskBarSelectedStyle;
    /** 任务条是否可选择，默认为true */
    selectable?: boolean;
    /** 任务条是否裁剪溢出部分 */
    clip?: boolean;
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
    scheduleCreatable?: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);
    /** 针对没有分配日期的任务，可以显示出创建按钮 */
    scheduleCreation?: {
      buttonStyle?: ILineStyle & {
        cornerRadius?: number;
        backgroundColor?: string;
      };
      /** 任务条创建按钮的自定义渲染 */
      customLayout?: ITaskCreationCustomLayout;
      /** 任务条创建按钮的最大宽度 */
      maxWidth?: number;
      /** 任务条创建按钮的最小宽度 */
      minWidth?: number;
    };
  };
  /** 数据条目可唯一标识的字段名,默认为'id' */
  taskKeyField?: string;
  /** 任务之间的依赖关系 */
  dependency?: {
    links: ITaskLink[];
    linkLineStyle?: ILineStyle;
    linkCreatable?: boolean;
    linkSelectable?: boolean;
    linkDeletable?: boolean;
    linkSelectedLineStyle?: ITaskLinkSelectedStyle;
    /** 创建关联线的操作点 */
    linkCreatePointStyle?: IPointStyle;
    /** 创建关联线的操作点响应状态效果 */
    linkCreatingPointStyle?: IPointStyle;
    /** 创建关联线的操作线样式 */
    linkCreatingLineStyle?: ILineStyle;
    /** 依赖关系线拐点与任务条的距离 默认20 */
    distanceToTaskBar?: number;
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
  groupBy?: true | string | string[];
  /** 展示嵌套结构数据时的模式，默认为full。*/
  tasksShowMode?: TasksShowMode;
  /**
   * 当使用Project_Sub_Tasks_Inline模式时，控制是否启用项目子任务的展开/收起功能
   * 默认值为true
   * 当设置为true（默认值）时，项目节点可以展开/收起其子任务
   * 当设置为false时，项目节点将始终以内联方式显示其子任务，没有展开/收起功能
   */
  projectSubTasksExpandable?: boolean;
  eventOptions?: IEventOptions;
  keyboardOptions?: IKeyboardOptions;
  markLineCreateOptions?: IMarkLineCreateOptions;
  plugins?: IGanttPlugin[];
}
/**
 * IBarLabelText
 * 可以配置固定文本 或者 ${fieldName} 或者自定义函数
 */
export type ITaskBarLabelText = string; //| string[] | ((args: any) => string | string[]);
export interface ITimelineScale {
  rowHeight?: number;
  unit: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second';
  step: number;
  startOfWeek?: 'sunday' | 'monday';
  customLayout?: IDateCustomLayout;
  style?: ITimelineHeaderStyle;
  format?: (date: DateFormatArgumentType) => string;
  visible?: boolean;
}
export interface ITaskBarLabelTextStyle {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  /** 当文字显示在任务条外侧时的颜色，默认为黑色 */
  outsideColor?: string;
  textAlign?: 'center' | 'end' | 'left' | 'right' | 'start'; // 设置单元格内文字的水平对齐方式
  textOverflow?: string;
  textBaseline?: 'alphabetic' | 'bottom' | 'middle' | 'top'; // 设置单元格内文字的垂直对齐方式
  padding?: number | number[];
  /** 相对于任务条文字方位位置，可选值：'left', 'top', 'right', 'bottom'，分别代表左、上、右、下四个方向 */
  orient?: 'left' | 'top' | 'right' | 'bottom';
  /** 只有当文本在 taskbar 中容纳不下时，会根据该方位将文本显示在任务条旁边。当配置 orient 时，该配置无效 */
  orientHandleWithOverflow?: 'left' | 'top' | 'right' | 'bottom';
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
  /**@deprecated 请配置borderLineWidth */
  borderWidth?: number;

  /** 任务条的边框宽度 */
  borderLineWidth?: number;
  /** 边框颜色 */
  borderColor?: string;

  /** 任务条的最小尺寸 */
  minSize?: number;
}
export interface IMilestoneStyle {
  /** 里程碑边框颜色 */
  borderColor?: string;
  /** 里程碑边框宽度 */
  borderLineWidth?: number;
  /** 里程碑填充颜色 */
  fillColor?: string;
  /** 里程碑正方形圆角 */
  cornerRadius?: number;
  /** 里程碑默认是个正方形，这个width配置正方形的边长 */
  width?: number;
  /** 里程碑展示文字。可以配置固定文本 或者 字符串模版`${fieldName}` */
  labelText?: ITaskBarLabelText;
  /** 里程碑文字样式 */
  labelTextStyle?: ITaskBarLabelTextStyle;
  // /** 里程碑图标 */
  // icon?: string;
  /** 文字相对于里程碑的位置 */
  textOrient?: 'left' | 'top' | 'right' | 'bottom';
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
  content?: string;
  contentStyle?: {
    color?: string;
    fontSize?: number;
    fontWeight?: string;
    lineHeight?: number;
    backgroundColor?: string;
    cornerRadius?: number | number[];
  };
  style?: ILineStyle;
  /** 标记线显示在日期列下的位置 默认为'left' */
  position?: 'left' | 'right' | 'middle' | 'date';
  /** 自动将日期范围内 包括改标记线 */
  scrollToMarkLine?: boolean;
}
export type ITableColumnsDefine = ColumnsDefine;
export type IFrameStyle = {
  borderColor?: string;
  borderLineWidth?: number | number[];
  borderLineDash?: number[];
  cornerRadius?: number;
};

export type ITableStyle = TYPES.ThemeStyle;
export type IRowSeriesNumber = TYPES.IRowSeriesNumber;
export type IScrollStyle = TYPES.ScrollStyle;
export type IEventOptions = TYPES.TableEventOptions;

export interface IKeyboardOptions {
  /** 当按下del按键是否删除连线 默认为false */
  deleteLinkOnDel?: boolean;
  /** 当按下back按键是否删除连线 默认为false */
  deleteLinkOnBack?: boolean;
}
export type DateFormatArgumentType = {
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  startDate: Date;
  endDate: Date;
};
export type TaskBarInteractionArgumentType = {
  taskRecord: any;
  index: number;
  subIndex?: number;
  startDate: Date;
  endDate: Date;
  ganttInstance: Gantt;
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
  rootContainer?: Group;
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

export type GridVerticalLineStyleArgumentType = {
  /** 竖线是第几条线*/
  index: number;
  /** 当期日期属于该日期刻度的第几位。如季度日期中第四季度 返回4。 */
  dateIndex: number;
  /** 如果是竖线，date代表分割线指向的具体时间点 */
  date?: Date;
  ganttInstance: Gantt;
};

export type GridHorizontalLineStyleArgumentType = {
  /** 横线是第几条线 也代表了左侧表格的body行号 */
  index: number;
  ganttInstance: Gantt;
};

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
  /** 依赖线的起始任务唯一标识。如果是tree树形结构的数据 设置数组的话 查找性能会更高 */
  linkedFromTaskKey?: string | number | (string | number)[];
  /** 依赖的终止目标任务唯一标识。如果是tree树形结构的数据 设置数组的话 查找性能会更高 */
  linkedToTaskKey?: string | number | (string | number)[];
  /** 依赖线的样式 */
  linkLineStyle?: ILineStyle;
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
export enum TasksShowMode {
  /** 每一个任务节点用单独一行来展示，父任务占用一行，子任务分别占用一行。这是默认的显示效果 */
  Tasks_Separate = 'tasks_separate',
  /** 省去父任务节点不展示，并把所有子任务的节点都放到同一行来展示。 */
  Sub_Tasks_Inline = 'sub_tasks_inline',
  /** 省去父任务节点不展示，且所有子任务的节点分别用一行展示。*/
  Sub_Tasks_Separate = 'sub_tasks_separate',
  /** 省去父任务节点不展示，且所有子任务会维持records中的数据顺序布局，并保证节点不重叠展示 */
  Sub_Tasks_Arrange = 'sub_tasks_arrange',
  /** 省去父任务节点不展示，且所有子任务会按照日期早晚的属性来布局，并保证节点不重叠的紧凑型展示 */
  Sub_Tasks_Compact = 'sub_tasks_compact',
  /** 数据标记为project的节点，会把所有子任务的节点都放到和主任务的同一行来展示。其他节点则保持默认的显示效果即Tasks_Separate */
  Project_Sub_Tasks_Inline = 'project_sub_tasks_inline'
}
/**
 * 任务类型枚举，用于区分不同类型的任务
 */
export enum TaskType {
  TASK = 'task', // record没有指明type的 会默认使用TASK
  PROJECT = 'project',
  MILESTONE = 'milestone'
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

export type IMarkLineCreateOptions = {
  markLineCreatable: boolean;
  markLineCreationHoverToolTip?: {
    position?: 'top' | 'bottom';
    tipContent?: string;
    style?: {
      contentStyle?: any;
      panelStyle?: any;
    };
  };
  markLineCreationStyle?: {
    fill?: string;
    size?: number;
    iconSize?: number;
    svg?: string;
  };
};
