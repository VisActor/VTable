// import themes from './themes';
// import { createRootElement } from './core/tableHelper';
import { Scenegraph } from './scenegraph/scenegraph';
import { Env } from './env';
import type {
  ITaskBarStyle,
  GanttConstructorOptions,
  IGrid,
  ITimelineHeaderStyle,
  IMarkLine,
  ITaskBarLabelText,
  ITaskBarLabelTextStyle,
  IScrollStyle,
  IFrameStyle,
  ITableColumnsDefine,
  ITaskBarCustomLayout,
  ITimelineDateInfo,
  ITimelineScale,
  ILineStyle,
  ITaskCreationCustomLayout,
  ITaskLink,
  ITaskBarSelectedStyle,
  ITaskBarHoverStyle,
  ITaskLinkSelectedStyle,
  IPointStyle,
  TaskBarInteractionArgumentType,
  IEventOptions,
  IMilestoneStyle,
  IKeyboardOptions,
  IMarkLineCreateOptions
} from './ts-types';
import { TasksShowMode, TaskType, GANTT_EVENT_TYPE } from './ts-types';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import { themes, registerCheckboxCell, registerProgressBarCell, registerRadioCell, ListTable } from '@visactor/vtable';
import { EventManager } from './event/event-manager';
import { StateManager } from './state/state-manager';
import {
  computeRowsCountByRecordDate,
  computeRowsCountByRecordDateForCompact,
  convertProgress,
  createSplitLineAndResizeLine,
  DayTimes,
  findRecordByTaskKey,
  generateTimeLineDate,
  getHorizontalScrollBarSize,
  getVerticalScrollBarSize,
  initOptions,
  initProjectTaskTimes,
  updateOptionsWhenDateRangeChanged,
  updateOptionsWhenMarkLineChanged,
  updateOptionsWhenRecordChanged,
  updateOptionsWhenScaleChanged,
  updateSplitLineAndResizeLine
} from './gantt-helper';
import { EventTarget } from './event/EventTarget';
import {
  computeCountToTimeScale,
  createDateAtLastHour,
  createDateAtLastMillisecond,
  createDateAtLastMinute,
  createDateAtMidnight,
  formatDate,
  isPropertyWritable,
  parseDateFormat
} from './tools/util';
import { DataSource } from './data/DataSource';
import { isValid } from '@visactor/vutils';
import type { GanttTaskBarNode } from './scenegraph/gantt-node';
import { PluginManager } from './plugins/plugin-manager';
// import { generateGanttChartColumns } from './gantt-helper';
import { toBoxArray } from './tools/util';
import { ZoomScaleManager } from './zoom-scale';
export function createRootElement(padding: any, className: string = 'vtable-gantt'): HTMLElement {
  const element = document.createElement('div');
  element.setAttribute('tabindex', '0');
  element.classList.add(className);
  element.style.outline = 'none';
  element.style.margin = `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

  const width = (element.offsetWidth || element.parentElement?.offsetWidth || 1) - 1;
  const height = (element.offsetHeight || element.parentElement?.offsetHeight || 1) - 1;

  element.style.width = (width && `${width - padding.left - padding.right}px`) || '0px';
  element.style.height = (height && `${height - padding.top - padding.bottom}px`) || '0px';

  return element;
}
export class Gantt extends EventTarget {
  options: GanttConstructorOptions;
  container: HTMLElement;
  /** 相比于canvas的宽度  会减掉:右侧frame边框的宽度 以及中间分割线verticalSplitLine.lineWidth  */
  tableNoFrameWidth: number;
  /** 相比于canvas的宽度  会减掉:上面和下面frame边框的宽度 */
  tableNoFrameHeight: number;
  /** 真正展示gantt甘特图的其实位置 应该是等于中间分割线的宽度verticalSplitLine.lineWidth。
   * 分割线底部仍然是canvas 因为需要canvas绘制frame边框线
   * scenegraph中的tableGroup的 attr.x 会等于该值
   */
  tableX: number;
  tableY: number;
  scenegraph: Scenegraph;
  stateManager: StateManager;
  eventManager: EventManager;

  taskListTableInstance?: ListTable;

  canvas: HTMLCanvasElement;
  element: HTMLElement;
  verticalSplitResizeLine: HTMLDivElement;
  horizontalSplitLine: HTMLDivElement;
  context: CanvasRenderingContext2D;

  timeLineHeaderLevel: number;
  itemCount: number;
  drawHeight: number;
  headerHeight: number;
  gridHeight: number;

  pluginManager: PluginManager;

  parsedOptions: {
    timeLineHeaderRowHeights: number[];
    rowHeight: number;
    timelineColWidth: number;

    scrollStyle: IScrollStyle;
    // timelineHeaderStyle: ITimelineHeaderStyle;
    timelineHeaderVerticalLineStyle: ILineStyle;
    timelineHeaderHorizontalLineStyle: ILineStyle;
    timelineHeaderBackgroundColor: string;
    timelineHeaderStyles: ITimelineHeaderStyle[];
    sortedTimelineScales: (ITimelineScale & { timelineDates?: ITimelineDateInfo[] })[];
    reverseSortedTimelineScales: (ITimelineScale & { timelineDates?: ITimelineDateInfo[] })[];
    timeScaleIncludeHour: boolean;
    grid: IGrid;
    taskBarStyle: ITaskBarStyle | ((interactionArgs: TaskBarInteractionArgumentType) => ITaskBarStyle);
    taskBarMilestoneStyle: IMilestoneStyle;
    projectBarStyle: ITaskBarStyle | ((interactionArgs: TaskBarInteractionArgumentType) => ITaskBarStyle);
    /** 里程碑是旋转后的矩形，所以需要计算里程碑的对角线长度 */
    taskBarMilestoneHypotenuse: number;
    taskBarHoverStyle: ITaskBarHoverStyle;
    taskBarSelectedStyle: ITaskBarSelectedStyle;
    taskBarSelectable: boolean;
    taskBarLabelText: ITaskBarLabelText;
    taskBarMoveable: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);
    moveTaskBarToExtendDateRange: boolean;
    taskBarResizable:
      | boolean
      | [boolean, boolean]
      | ((interactionArgs: TaskBarInteractionArgumentType) => boolean | [boolean, boolean]);
    taskBarProgressAdjustable: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);
    taskBarDragOrder: boolean;
    taskBarLabelStyle: ITaskBarLabelTextStyle;
    taskBarCustomLayout: ITaskBarCustomLayout;
    taskBarCreatable: boolean | ((interactionArgs: TaskBarInteractionArgumentType) => boolean);
    taskBarCreationButtonStyle: ILineStyle & {
      cornerRadius?: number;
      backgroundColor?: string;
    };
    taskBarCreationCustomLayout: ITaskCreationCustomLayout;
    taskBarCreationMaxWidth: number;
    taskBarCreationMinWidth: number;
    outerFrameStyle: IFrameStyle;
    pixelRatio: number;
    tasksShowMode: TasksShowMode;
    projectSubTasksExpandable: boolean;

    startDateField: string;
    endDateField: string;
    progressField: string;
    minDate?: Date;
    maxDate?: Date;
    _minDateTime?: number;
    _maxDateTime?: number;
    markLine: IMarkLine[];
    scrollToMarkLineDate: Date;
    horizontalSplitLine: ILineStyle;
    verticalSplitLine: ILineStyle;
    verticalSplitLineHighlight: ILineStyle;
    verticalSplitLineMoveable?: boolean;
    overscrollBehavior: 'auto' | 'none';
    dateFormat?:
      | 'yyyy-mm-dd'
      | 'dd-mm-yyyy'
      | 'mm/dd/yyyy'
      | 'yyyy/mm/dd'
      | 'dd/mm/yyyy'
      | 'yyyy.mm.dd'
      | 'dd.mm.yyyy'
      | 'mm.dd.yyyy';

    taskKeyField: string;
    dependencyLinks?: ITaskLink[];
    dependencyLinkCreatable: boolean;
    dependencyLinkSelectable: boolean;
    dependencyLinkDeletable: boolean;
    dependencyLinkLineStyle: ILineStyle;
    dependencyLinkSelectedLineStyle: ITaskLinkSelectedStyle;
    dependencyLinkLineCreatePointStyle: IPointStyle;
    dependencyLinkLineCreatingPointStyle: IPointStyle;
    dependencyLinkLineCreatingStyle?: ILineStyle;
    underlayBackgroundColor: string;
    eventOptions: IEventOptions;
    keyboardOptions: IKeyboardOptions;
    markLineCreateOptions: IMarkLineCreateOptions;

    zoom?: {
      // 是否启用鼠标滚轮缩放
      enableMouseWheel?: boolean;
      // 最小时间每像素值（最大放大）
      minTimePerPixel?: number;
      // 最大时间每像素值（最大缩小）
      maxTimePerPixel?: number;
      // 缩放步长
      step?: number;
    };
  } = {} as any;

  //  时间缩放基准 - 每像素代表多少毫秒
  private timePerPixel: number;
  zoomScaleManager?: ZoomScaleManager;

  /**
   * 重新计算时间相关的尺寸参数
   * 注意：当启用 zoomScale 时，此方法不再用于动态调整 unit/step，
   * 只用于根据当前 timePerPixel 重新计算 timelineColWidth
   */
  recalculateTimeScale(): void {
    // 获取当前的主时间刻度
    const primaryScale = this.parsedOptions.reverseSortedTimelineScales[0];
    if (!primaryScale) {
      return;
    }

    // 根据当前 scale 的 unit 和 step 计算每个单元格应该占用的毫秒数
    let msPerStep: number;
    switch (primaryScale.unit as string) {
      case 'second':
        msPerStep = 1000 * primaryScale.step;
        break;
      case 'minute':
        msPerStep = 60 * 1000 * primaryScale.step;
        break;
      case 'hour':
        msPerStep = 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'day':
        msPerStep = 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'week':
        msPerStep = 7 * 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'month':
        msPerStep = 30 * 24 * 60 * 60 * 1000 * primaryScale.step; // 近似30天
        break;
      case 'quarter':
        msPerStep = 90 * 24 * 60 * 60 * 1000 * primaryScale.step; // 近似90天
        break;
      case 'year':
        msPerStep = 365 * 24 * 60 * 60 * 1000 * primaryScale.step; // 近似365天
        break;
      default:
        msPerStep = 24 * 60 * 60 * 1000 * primaryScale.step; // 默认为天
    }

    // 计算新的 timelineColWidth
    const newTimelineColWidth = msPerStep / this.timePerPixel;

    // 更新 parsedOptions
    this.parsedOptions.timelineColWidth = newTimelineColWidth;

    // 重新生成时间线日期映射
    this._generateTimeLineDateMap();

    // 更新尺寸和重新渲染
    if (this.scenegraph) {
      this._updateSize();
      this.scenegraph.refreshAll();
    }

    // 调试信息（仅在非 zoomScale 模式下显示详细信息）
    if (!this.zoomScaleManager) {
      const msPerDay = 24 * 60 * 60 * 1000;
      const pixelsPerDay = msPerDay / this.timePerPixel;
      console.log('📊 传统缩放模式:', {
        timePerPixel: this.timePerPixel.toFixed(0),
        pixelsPerDay: pixelsPerDay.toFixed(1),
        unit: primaryScale.unit,
        step: primaryScale.step,
        newTimelineColWidth: newTimelineColWidth.toFixed(1)
      });
    }
  }

  /**
   * 缩放方法
   * @param factor 缩放因子，大于1表示放大
   * @param keepCenter 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomByFactor(factor: number, keepCenter: boolean = true, centerX?: number): void {
    // 应用 timePerPixel 限制（由 ZoomScaleManager 根据 minColumnWidth/maxColumnWidth 计算）
    const minTimePerPixel = this.parsedOptions.zoom?.minTimePerPixel ?? 200000;
    const maxTimePerPixel = this.parsedOptions.zoom?.maxTimePerPixel ?? 3000000;

    // 记录旧值用于视图中心保持和事件触发
    const oldTimePerPixel = this.timePerPixel;
    const oldWidth = this.parsedOptions.timelineColWidth;

    // 🎯 动态调整缩放步长，让缩放在不同级别下都保持平滑
    const currentTimePerPixel = this.timePerPixel;
    let adjustedFactor = factor;

    // 根据当前的 timePerPixel 级别动态调整缩放因子
    // timePerPixel 越小（放大越多），需要更大的缩放因子来产生明显的视觉变化
    const baseTimePerPixel = 1440000; // 基准值：60px/day
    const zoomRatio = Math.log(currentTimePerPixel / baseTimePerPixel) / Math.log(2);

    // 缩放因子调整：timePerPixel 越小，调整幅度越大
    // 关键：在高放大级别下，放大和缩小都需要增强效果
    if (currentTimePerPixel < baseTimePerPixel) {
      // 高放大状态：放大和缩小都需要增强缩放效果，但不要过于激进
      const enhancement = Math.pow(1.2, -zoomRatio); // 从1.5改为1.2，减缓增强强度
      adjustedFactor = Math.pow(factor, enhancement);
    } else {
      // 正常/缩小状态：适当减缓缩放效果，避免跳跃过快
      const dampening = Math.pow(0.9, zoomRatio); // 从0.8改为0.9，减少减缓程度
      adjustedFactor = Math.pow(factor, dampening);
    }

    // factor > 1 = 放大 → timePerPixel 变小
    const newTimePerPixel = this.timePerPixel / adjustedFactor;

    // 应用限制
    this.timePerPixel = Math.max(minTimePerPixel, Math.min(maxTimePerPixel, newTimePerPixel));

    // 🔑 新增：检查是否需要切换级别
    if (this.zoomScaleManager) {
      const targetLevel = this.zoomScaleManager.findOptimalLevel(this.timePerPixel);
      const currentLevel = this.zoomScaleManager.getCurrentLevel();

      if (targetLevel !== currentLevel) {
        // 切换级别：zoomScaleManager会调用updateScales，自动处理所有更新
        this.zoomScaleManager.switchToLevel(targetLevel);
      } else {
        // 级别未变：使用现有的时间刻度重计算逻辑
        this.recalculateTimeScale();
      }
    } else {
      // 未启用zoomScale：完全使用原有逻辑
      this.recalculateTimeScale();
    }

    // 处理视图中心保持
    if (keepCenter) {
      if (centerX === undefined) {
        centerX = this.scenegraph.width / 2;
      }

      // 计算中心点对应的时间位置
      const centerTimePosition = (this.stateManager.scroll.horizontalBarPos + centerX) * oldTimePerPixel;

      // 调整滚动位置以保持中心点
      const newScrollLeft = centerTimePosition / this.timePerPixel - centerX;
      this.stateManager.setScrollLeft(newScrollLeft);
    }

    // 触发缩放事件
    if (this.hasListeners(GANTT_EVENT_TYPE.ZOOM)) {
      this.fireListeners(GANTT_EVENT_TYPE.ZOOM, {
        oldWidth,
        newWidth: this.parsedOptions.timelineColWidth,
        scale: oldTimePerPixel / this.timePerPixel,
        oldTimePerPixel,
        newTimePerPixel: this.timePerPixel
      });
    }
  }

  /**
   * 放大时间轴
   * @param factor 缩放因子，大于1表示放大
   * @param center 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomIn(factor: number = 1.1, center: boolean = true, centerX?: number): void {
    this.zoomByFactor(factor, center, centerX);
  }

  /**
   * 缩小时间轴
   * @param factor 缩放因子，小于1表示缩小
   * @param center 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomOut(factor: number = 0.9, center: boolean = true, centerX?: number): void {
    this.zoomByFactor(factor, center, centerX);
  }
  /** 左侧任务表格的整体宽度 比表格实例taskListTableInstance的tableNoFrameWidth会多出左侧frame边框的宽度  */
  taskTableWidth: number;
  taskTableColumns: ITableColumnsDefine;

  records: any[];
  data: DataSource;
  constructor(container: HTMLElement, options: GanttConstructorOptions) {
    super();
    this.container = container;
    this.options = options;

    this.taskTableWidth =
      typeof options?.taskListTable?.tableWidth === 'number' ? options?.taskListTable?.tableWidth : -1; //-1 只是作为标记  后续判断该值进行自动计算宽度
    this.taskTableColumns = options?.taskListTable?.columns ?? [];
    this.records = options?.records ?? [];

    // 🔑 优先初始化 ZoomScaleManager，让它接管 scales 设置
    if (options.zoomScale?.enabled) {
      this.zoomScaleManager = new ZoomScaleManager(this, options.zoomScale);
      // ZoomScaleManager 已经设置了初始 scales，现在需要排序
      this._sortScales();
    } else {
      // 只有未启用 zoomScale 时才使用原有的 scales
      this._sortScales();
    }

    initOptions(this);

    // 初始化timePerPixel - 默认60px = 1天
    this.timePerPixel = (24 * 60 * 60 * 1000) / 60; // 1440000ms/px

    // 初始化项目任务时间
    initProjectTaskTimes(this);
    this.data = new DataSource(this);
    this._generateTimeLineDateMap();

    this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length;
    this.element = createRootElement({ top: 0, right: 0, left: 0, bottom: 0 }, 'vtable-gantt');
    // this.element.style.top = '0px';
    this.element.style.left = this.taskTableWidth !== -1 ? `${this.taskTableWidth}px` : '0px';

    this.canvas = document.createElement('canvas');
    this.element.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d')!;
    if (container) {
      (container as HTMLElement).appendChild(this.element);
      this._updateSize();
    } else {
      this._updateSize();
    }
    this._generateListTable();
    this._syncPropsFromTable();

    createSplitLineAndResizeLine(this);

    this.scenegraph = new Scenegraph(this);
    this.stateManager = new StateManager(this);
    this.eventManager = new EventManager(this);

    this.scenegraph.afterCreateSceneGraph();
    this._scrollToMarkLine();
    this.pluginManager = new PluginManager(this, options);

    // 🎯 在所有组件初始化完成后，根据timePerPixel重新计算列宽
    this.recalculateTimeScale();
  }

  renderTaskBarsTable() {
    this.scenegraph.updateNextFrame();
  }
  /**
   * 窗口尺寸发生变化 或者像数比变化
   * @return {void}
   */
  _updateSize(): void {
    let widthP = 0;
    let heightP = 0;

    if (Env.mode === 'browser') {
      const element = this.getElement();
      let widthWithoutPadding = 0;
      let heightWithoutPadding = 0;
      if (element.parentElement) {
        const computedStyle = element.parentElement.style || window.getComputedStyle(element.parentElement); // 兼容性处理
        widthWithoutPadding =
          element.parentElement.offsetWidth -
          parseInt(computedStyle.paddingLeft || '0px', 10) -
          parseInt(computedStyle.paddingRight || '0px', 10);
        heightWithoutPadding =
          element.parentElement.offsetHeight -
          parseInt(computedStyle.paddingTop || '0px', 10) -
          parseInt(computedStyle.paddingBottom || '0px', 20);
      }
      const width1 = (widthWithoutPadding ?? 1) - 1 - this.taskTableWidth;
      const height1 = (heightWithoutPadding ?? 1) - 1;

      element.style.width = (width1 && `${width1}px`) || '0px';
      element.style.height = (height1 && `${height1}px`) || '0px';

      const { canvas } = this;

      widthP = canvas.parentElement?.offsetWidth ?? 1;
      heightP = canvas.parentElement?.offsetHeight ?? 1;

      //style 与 width，height相同
      if (this?.scenegraph?.stage) {
        this.scenegraph.stage.resize(widthP, heightP);
      } else {
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.width = widthP;
        canvas.height = heightP;

        canvas.style.width = `${widthP}px`;
        canvas.style.height = `${heightP}px`;
      }
    } else if (Env.mode === 'node') {
      // widthP = this.canvasWidth - 1;
      // heightP = this.canvasHeight - 1;
    }
    const width = Math.floor(widthP - getVerticalScrollBarSize(this.parsedOptions.scrollStyle));
    const height = Math.floor(heightP - getHorizontalScrollBarSize(this.parsedOptions.scrollStyle));
    this.tableNoFrameWidth = widthP;
    this.tableNoFrameHeight = Math.floor(heightP);
    if (this.parsedOptions.outerFrameStyle) {
      //考虑表格整体边框的问题
      const [top, right, bottom, left] = toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0); // toBoxArray(this.parsedOptions.frameStyle?.borderLineWidth ?? [null]);
      this.tableX =
        this.taskTableColumns.length >= 1 || this.options?.rowSeriesNumber
          ? this.parsedOptions.verticalSplitLine.lineWidth ?? 0
          : left;
      this.tableY = top;
      this.tableNoFrameWidth = Math.min(width - right - this.tableX, this.getAllDateColsWidth());

      this.tableNoFrameHeight = height - top - bottom;
    }
  }
  _updateListTableSize(taskListTableInstance: ListTable) {
    if (!taskListTableInstance) {
      return;
    }
    if (this.options?.taskListTable?.tableWidth === 'auto' || this.taskTableWidth === -1) {
      // 归一化边框宽度
      const [top, right, bottom, left] = toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0);
      this.taskTableWidth = taskListTableInstance.getAllColsWidth() + right;
      if (this.options?.taskListTable?.maxTableWidth) {
        this.taskTableWidth = Math.min(this.options?.taskListTable?.maxTableWidth, this.taskTableWidth);
      }
      if (this.options?.taskListTable?.minTableWidth) {
        this.taskTableWidth = Math.max(this.options?.taskListTable?.minTableWidth, this.taskTableWidth);
      }
      this.element.style.left = this.taskTableWidth !== -1 ? `${this.taskTableWidth}px` : '0px';
      taskListTableInstance.setCanvasSize(this.taskTableWidth, this.tableNoFrameHeight + top + bottom);
      this._updateSize();
    }

    if (taskListTableInstance.columnHeaderLevelCount > 1) {
      if (taskListTableInstance.columnHeaderLevelCount === this.parsedOptions.timeLineHeaderRowHeights.length) {
        for (let i = 0; i < taskListTableInstance.columnHeaderLevelCount; i++) {
          taskListTableInstance.setRowHeight(i, this.parsedOptions.timeLineHeaderRowHeights[i]);
        }
      } else {
        const newRowHeight = this.getAllHeaderRowsHeight() / taskListTableInstance.columnHeaderLevelCount;
        for (let i = 0; i < taskListTableInstance.columnHeaderLevelCount; i++) {
          taskListTableInstance.setRowHeight(i, newRowHeight);
        }
      }
    }
  }
  _generateListTable() {
    if (this.taskTableColumns.length >= 1 || this.options?.rowSeriesNumber) {
      const listTableOption = this._generateListTableOptions();
      this.taskListTableInstance = new ListTable(this.container, listTableOption);
      this._updateListTableSize(this.taskListTableInstance);
    }
  }
  _generateListTableOptions() {
    const listTable_options: ListTableConstructorOptions = {};
    const needPutInListTableKeys = [
      'container',
      'records',
      'rowSeriesNumber',
      'overscrollBehavior',
      'pixelRatio',
      'eventOptions'
    ];
    for (const key of needPutInListTableKeys) {
      if (key in this.options) {
        (listTable_options as any)[key] = (this.options as any)[key];
      }
    }
    listTable_options.defaultRowHeight = this.options.rowHeight;
    if (this.options.taskListTable) {
      for (const key in this.options.taskListTable) {
        (listTable_options as any)[key] = (this.options.taskListTable as any)[key];
        if (key === 'columns') {
          (listTable_options as any)[key][(listTable_options as any)[key].length - 1].disableColumnResize = true;
          if (
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact
          ) {
            for (let i = 0; i < (listTable_options as any).columns.length; i++) {
              if ((listTable_options as any).columns[i].tree) {
                (listTable_options as any).columns[i].tree = false;
              }
            }
          }
        }
        // For Project_Sub_Tasks_Inline mode, we keep tree functionality
        // This is because we want to maintain the expand/collapse functionality for project tasks
        if (
          key === 'hierarchyExpandLevel' &&
          (this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange ||
            this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact)
        ) {
          delete listTable_options[key];
        }
      }
      // For Project_Sub_Tasks_Inline mode, we keep hierarchyExpandLevel
    }

    // lineWidthArr[1] = 0;
    //Object.assign浅拷贝 会直接覆盖第一层属性 。theme.ARCO.extends 其中extends不能连续调用，且赋值也只是第一层
    if (this.options.taskListTable?.theme) {
      listTable_options.theme = this.options.taskListTable?.theme;
      if (listTable_options.theme.bodyStyle && !isPropertyWritable(listTable_options.theme, 'bodyStyle')) {
        //测试是否使用了主题 使用了主题配置项不可写。
        listTable_options.theme = (this.options.taskListTable?.theme as themes.TableTheme).extends(
          (this.options.taskListTable?.theme as themes.TableTheme).getExtendTheme()
        ); //防止将原主题如DARK ARCO的属性改掉
        const extendThemeOption = (listTable_options.theme as themes.TableTheme).getExtendTheme();
        (listTable_options.theme as themes.TableTheme).clearBodyStyleCache(); // listTable_options.theme.bodyStyle  获取过需要清除缓存
        if (!listTable_options.theme.headerStyle?.bgColor) {
          if (!extendThemeOption.headerStyle) {
            extendThemeOption.headerStyle = { bgColor: this.parsedOptions.timelineHeaderBackgroundColor };
          } else if (!extendThemeOption.headerStyle.bgColor) {
            extendThemeOption.headerStyle.bgColor = this.parsedOptions.timelineHeaderBackgroundColor;
          }
        }
        if (extendThemeOption.bodyStyle) {
          extendThemeOption.bodyStyle.frameStyle = {
            borderLineWidth: [this.parsedOptions.horizontalSplitLine?.lineWidth ?? 0, 0, 0, 0],
            borderColor: this.parsedOptions.horizontalSplitLine?.lineColor
          };
        } else {
          extendThemeOption.bodyStyle = {
            frameStyle: {
              borderLineWidth: [this.parsedOptions.horizontalSplitLine?.lineWidth ?? 0, 0, 0, 0],
              borderColor: this.parsedOptions.horizontalSplitLine?.lineColor
            }
          };
        }
        extendThemeOption.cellInnerBorder = false;
        const [top, right, bottom, left] = toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0);
        extendThemeOption.frameStyle = Object.assign({}, this.parsedOptions.outerFrameStyle, {
          shadowBlur: 0,
          cornerRadius: [
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineWidth: [top, 0, bottom, left]
        });
        extendThemeOption.scrollStyle = Object.assign(
          {},
          this.options.taskListTable?.theme?.scrollStyle,
          this.parsedOptions.scrollStyle,
          {
            verticalVisible: 'none'
          }
        );
        // 将拖拽列宽旁边的数字标签隐藏掉 VTable后续需要增加这样一个配置 就把这里hack的方式替换掉 TODO
        extendThemeOption.columnResize = Object.assign(
          {
            labelColor: 'rgba(0,0,0,0)',
            labelBackgroundFill: 'rgba(0,0,0,0)'
          },
          extendThemeOption?.columnResize
        );
        if (!extendThemeOption.underlayBackgroundColor) {
          extendThemeOption.underlayBackgroundColor = this.parsedOptions.underlayBackgroundColor;
        }
      } else {
        if (!listTable_options.theme.headerStyle) {
          listTable_options.theme.headerStyle = { bgColor: this.parsedOptions.timelineHeaderBackgroundColor };
        } else if (!listTable_options.theme.headerStyle.bgColor) {
          listTable_options.theme.headerStyle.bgColor = this.parsedOptions.timelineHeaderBackgroundColor;
        }
        listTable_options.theme.headerStyle = Object.assign(
          {},
          themes.DEFAULT.headerStyle,
          { bgColor: this.parsedOptions.timelineHeaderBackgroundColor },
          this.options.taskListTable?.theme?.headerStyle
        );
        listTable_options.theme.bodyStyle = Object.assign(
          {},
          themes.DEFAULT.bodyStyle,
          this.options.taskListTable?.theme?.bodyStyle,
          {
            frameStyle: {
              borderLineWidth: [this.parsedOptions.horizontalSplitLine?.lineWidth ?? 0, 0, 0, 0],
              borderColor: this.parsedOptions.horizontalSplitLine?.lineColor
            }
          }
        );
        listTable_options.theme.cellInnerBorder = false;
        const [top, right, bottom, left] = toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0);
        listTable_options.theme.frameStyle = Object.assign({}, this.parsedOptions.outerFrameStyle, {
          cornerRadius: [
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineWidth: [top, 0, bottom, left]
        });
        listTable_options.theme.scrollStyle = Object.assign(
          {},
          this.options.taskListTable?.theme?.scrollStyle,
          this.parsedOptions.scrollStyle,
          {
            verticalVisible: 'none'
          }
        );
        listTable_options.theme.columnResize = Object.assign(
          {
            labelColor: 'rgba(0,0,0,0)',
            labelBackgroundFill: 'rgba(0,0,0,0)'
          },
          this.options.taskListTable?.theme?.columnResize
        );
        if (!listTable_options.theme.underlayBackgroundColor) {
          listTable_options.theme.underlayBackgroundColor = this.parsedOptions.underlayBackgroundColor;
        }
      }
    } else {
      const [top, right, bottom, left] = toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0);
      listTable_options.theme = {
        scrollStyle: Object.assign({}, this.options.taskListTable?.theme?.scrollStyle, this.parsedOptions.scrollStyle, {
          verticalVisible: 'none'
        }),
        headerStyle: Object.assign(
          {},
          themes.DEFAULT.headerStyle,
          {
            bgColor: this.parsedOptions.timelineHeaderBackgroundColor
          },
          this.options.taskListTable?.theme?.headerStyle
        ),
        bodyStyle: Object.assign({}, themes.DEFAULT.bodyStyle, this.options.taskListTable?.theme?.bodyStyle, {
          frameStyle: {
            borderLineWidth: [this.parsedOptions.horizontalSplitLine?.lineWidth ?? 0, 0, 0, 0],
            borderColor: this.parsedOptions.horizontalSplitLine?.lineColor
          }
        }),
        cellInnerBorder: false,
        frameStyle: Object.assign({}, this.parsedOptions.outerFrameStyle, {
          cornerRadius: [
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineWidth: [top, 0, bottom, left]
        }),
        columnResize: Object.assign(
          {
            labelColor: 'rgba(0,0,0,0)',
            labelBackgroundFill: 'rgba(0,0,0,0)'
          },
          this.options.taskListTable?.theme?.columnResize
        ),
        underlayBackgroundColor: this.parsedOptions.underlayBackgroundColor
      };
    }

    listTable_options.canvasWidth = this.taskTableWidth as number;
    listTable_options.canvasHeight = this.canvas.height;
    listTable_options.defaultHeaderRowHeight = this.getAllHeaderRowsHeight();
    if (this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate) {
      listTable_options.customComputeRowHeight = (args: { row: number; table: ListTable }) => {
        const { row, table } = args;
        const record = table.getRecordByRowCol(0, row);
        if (record) {
          return (record.children?.length || 1) * this.parsedOptions.rowHeight;
        }
      };
      listTable_options.defaultRowHeight = 'auto';
      listTable_options.customConfig = { forceComputeAllRowHeight: true };
    } else if (this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Compact) {
      listTable_options.customComputeRowHeight = (args: { row: number; table: ListTable }) => {
        const { row, table } = args;
        const record = table.getRecordByRowCol(0, row);
        if (record) {
          return computeRowsCountByRecordDateForCompact(this, record) * this.parsedOptions.rowHeight;
        }
      };
      listTable_options.defaultRowHeight = 'auto';
      listTable_options.customConfig = { forceComputeAllRowHeight: true };
    } else if (this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange) {
      listTable_options.customComputeRowHeight = (args: { row: number; table: ListTable }) => {
        const { row, table } = args;
        const record = table.getRecordByRowCol(0, row);
        if (record) {
          return computeRowsCountByRecordDate(this, record) * this.parsedOptions.rowHeight;
        }
      };
      listTable_options.defaultRowHeight = 'auto';
      listTable_options.customConfig = { forceComputeAllRowHeight: true };
    } else {
      listTable_options.defaultRowHeight = this.options.rowHeight ?? 40;
    }
    listTable_options.clearDOM = false;
    return listTable_options;
  }

  /**
   * 获取表格创建的DOM根节点
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * 获取创建gantt传入的容器
   */
  getContainer(): HTMLElement {
    return this.element.parentElement;
  }

  _sortScales() {
    const { timelineHeader } = this.options;
    if (timelineHeader) {
      const timelineScales = timelineHeader.scales;
      const sortOrder = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second'];
      if (timelineScales.length === 1) {
        if (
          timelineScales[0].unit === 'hour' ||
          timelineScales[0].unit === 'minute' ||
          timelineScales[0].unit === 'second'
        ) {
          this.parsedOptions.timeScaleIncludeHour = true;
        }
      }
      const orderedScales = timelineScales.slice().sort((a, b) => {
        if (a.unit === 'hour' || a.unit === 'minute' || a.unit === 'second') {
          this.parsedOptions.timeScaleIncludeHour = true;
        }
        const indexA = sortOrder.indexOf(a.unit);
        const indexB = sortOrder.indexOf(b.unit);
        if (indexA === -1) {
          return 1;
        } else if (indexB === -1) {
          return -1;
        }
        return indexA - indexB;
      });
      const reverseOrderedScales = timelineScales.slice().sort((a, b) => {
        const indexA = sortOrder.indexOf(a.unit);
        const indexB = sortOrder.indexOf(b.unit);
        if (indexA === -1) {
          return 1;
        } else if (indexB === -1) {
          return -1;
        }
        return indexB - indexA;
      });

      this.parsedOptions.sortedTimelineScales = orderedScales;
      this.parsedOptions.reverseSortedTimelineScales = reverseOrderedScales;
    }
  }

  _generateTimeLineDateMap() {
    if (this.parsedOptions.minDate && this.parsedOptions.maxDate) {
      // const startDate = createDateAtMidnight(this.parsedOptions.minDate);
      // const endDate = createDateAtMidnight(this.parsedOptions.maxDate);

      // const colWidthIncludeDays = 1000000;
      // Iterate over each scale
      for (const scale of this.parsedOptions.reverseSortedTimelineScales) {
        // Generate the sub-columns for each step within the scale
        // const timelineDates: any[] = [];
        scale.timelineDates = generateTimeLineDate(
          // this.parsedOptions.timeScaleIncludeHour
          //   ? new Date(this.parsedOptions.minDate)
          //   : createDateAtMidnight(this.parsedOptions.minDate, true),
          // this.parsedOptions.timeScaleIncludeHour
          //   ? this.parsedOptions.maxDate
          //   : createDateAtLastHour(this.parsedOptions.maxDate, true),
          new Date(this.parsedOptions.minDate),
          this.parsedOptions.maxDate,
          scale
        );
      }
    }
  }
  getRowHeightByIndex(index: number) {
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getRowHeight(index + this.taskListTableInstance.columnHeaderLevelCount);
    }
    return this.parsedOptions.rowHeight;
  }
  getRowsHeightByIndex(startIndex: number, endIndex: number) {
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getRowsHeight(
        startIndex + this.taskListTableInstance.columnHeaderLevelCount,
        endIndex + this.taskListTableInstance.columnHeaderLevelCount
      );
    }
    return this.parsedOptions.rowHeight * (endIndex - startIndex + 1);
  }
  getAllRowsHeight() {
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getAllRowsHeight();
    }
    return this.getAllHeaderRowsHeight() + this.itemCount * this.parsedOptions.rowHeight;
  }
  getAllHeaderRowsHeight() {
    // if (Array.isArray(this.parsedOptions.timeLineHeaderRowHeights)) {
    return this.parsedOptions.timeLineHeaderRowHeights.reduce((acc, curr, index) => {
      if (this.parsedOptions.sortedTimelineScales[index].visible === false) {
        return acc;
      }
      return acc + curr;
    }, 0);
    // }
    // return (this.parsedOptions.timeLineHeaderRowHeights as number) * this.timeLineHeaderLevel;
  }
  getAllDateColsWidth() {
    return (
      this.parsedOptions.timelineColWidth *
      (this.parsedOptions.reverseSortedTimelineScales[0].timelineDates?.length ?? 0)
    );
  }

  getAllTaskBarsHeight() {
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getRowsHeight(
        this.taskListTableInstance.columnHeaderLevelCount,
        this.taskListTableInstance.rowCount - 1
      );
    }
    return this.itemCount * this.parsedOptions.rowHeight;
  }
  /**
   * 通过任务显示的index获取数据记录的index
   * @param showIndex 显示index
   * @returns
   */
  getRecordIndexByTaskShowIndex(showIndex: number): number | number[] {
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getRecordIndexByCell(
        0,
        this.taskListTableInstance.columnHeaderLevelCount + showIndex
      );
    }
    return showIndex;
  }
  getTaskShowIndexByRecordIndex(index: number | number[]) {
    return this.taskListTableInstance.getBodyRowIndexByRecordIndex(index);
  }
  /**
   *
   * @param taskShowIndex 任务显示的index，从0开始
   * @param sub_task_index 子任务的index, 当taskShowMode是sub_tasks_*模式时，会传入sub_task_index。如果是tasks_separate模式，sub_task_index传入undefined。
   * 如果模式Project_Sub_Tasks_Inline时，传入的sub_task_index是一个数组，数组的第一个元素是父任务的index，第二个元素是子任务的index,依次类推算是各层子任务的path。
   * @returns 具体的task record数据
   */
  getRecordByIndex(taskShowIndex: number, sub_task_index?: number | number[]) {
    if (this.taskListTableInstance) {
      if (isValid(sub_task_index)) {
        const record = this.taskListTableInstance.getRecordByCell(
          0,
          taskShowIndex + this.taskListTableInstance.columnHeaderLevelCount
        );

        if (Array.isArray(sub_task_index)) {
          const recordIndex = this.getRecordIndexByTaskShowIndex(taskShowIndex);
          const parentIndexLength = Array.isArray(recordIndex) ? recordIndex.length : 1;
          const new_sub_task_index = [...sub_task_index];
          //从new_sub_task_index中删除前面parentIndexLength的元素
          new_sub_task_index.splice(0, parentIndexLength);
          let currentRecord = record;
          while (new_sub_task_index.length > 0) {
            const index = new_sub_task_index.shift();
            currentRecord = currentRecord?.children?.[index];
          }
          return currentRecord;
        }
        return record?.children?.[sub_task_index];
      }
      return this.taskListTableInstance.getRecordByCell(
        0,
        taskShowIndex + this.taskListTableInstance.columnHeaderLevelCount
      );
    }
    return this.records[taskShowIndex];
  }

  _refreshTaskBar(taskShowIndex: number, sub_task_index?: number) {
    // this.taskListTableInstance.updateRecords([record], [index]);
    this.scenegraph.taskBar.updateTaskBarNode(taskShowIndex, sub_task_index);
    this.scenegraph.refreshRecordLinkNodes(
      taskShowIndex,
      undefined,
      this.scenegraph.taskBar.getTaskBarNodeByIndex(taskShowIndex, sub_task_index) as GanttTaskBarNode
    );
    this.scenegraph.updateNextFrame();
  }
  _updateRecordToListTable(record: any, index: number | number[]) {
    // const indexs = this.taskListTableInstance.getRecordIndexByCell(
    //   0,
    //   index + this.taskListTableInstance.columnHeaderLevelCount
    // );
    // if (!Array.isArray(index)) {
    //   index = this.taskListTableInstance.getRecordIndexByCell(
    //     0,
    //     index + this.taskListTableInstance.columnHeaderLevelCount
    //   );
    // }
    // if (this.taskListTableInstance.rowHierarchyType === 'tree' && typeof index === 'number') {
    //   //如果是树形结构 需要获取数据源对应的索引
    //   index = this.taskListTableInstance.getRecordIndexByCell(
    //     0,
    //     index + this.taskListTableInstance.columnHeaderLevelCount
    //   );
    // }
    this.taskListTableInstance.updateRecords([record], [index]);
  }
  /**
   * 获取指定index处任务数据的具体信息
   * @param taskShowIndex 任务显示的index，从0开始
   * @param sub_task_index 子任务的index, 当taskShowMode是sub_tasks_*模式时，会传入sub_task_index。如果是tasks_separate模式，sub_task_index传入undefined。
   * 如果模式Project_Sub_Tasks_Inline时，传入的sub_task_index是一个数组，数组的第一个元素是父任务的index，第二个元素是子任务的index,依次类推算是各层子任务的path。
   * @returns 当前任务信息
   */
  getTaskInfoByTaskListIndex(
    taskShowIndex: number,
    sub_task_index?: number | number[]
  ): {
    taskRecord: any;
    /** 废弃，请直接使用startDate和endDate来计算 */
    taskDays: number;
    startDate: Date;
    endDate: Date;
    progress: number;
  } {
    const taskRecord = this.getRecordByIndex(taskShowIndex, sub_task_index);
    const isMilestone = taskRecord?.type;
    const startDateField = this.parsedOptions.startDateField;
    const endDateField = this.parsedOptions.endDateField;
    const progressField = this.parsedOptions.progressField;
    const rawDateStartDateTime = createDateAtMidnight(taskRecord?.[startDateField]).getTime();
    const rawDateEndDateTime = createDateAtMidnight(taskRecord?.[endDateField]).getTime();
    if (
      (isMilestone && !taskRecord?.[startDateField]) ||
      (!isMilestone &&
        (rawDateEndDateTime < this.parsedOptions._minDateTime ||
          rawDateStartDateTime > this.parsedOptions._maxDateTime ||
          !taskRecord?.[startDateField] ||
          !taskRecord?.[endDateField]))
    ) {
      return {
        taskDays: 0,
        progress: 0,
        startDate: null,
        endDate: null,
        taskRecord
      };
    }

    const progress = convertProgress(taskRecord[progressField]);
    let startDate;
    let endDate;
    if (this.parsedOptions.timeScaleIncludeHour) {
      startDate = createDateAtMidnight(
        Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime)
      );
      endDate = createDateAtLastMillisecond(
        Math.max(Math.min(this.parsedOptions._maxDateTime, rawDateEndDateTime), this.parsedOptions._minDateTime),
        true
      );
      // const minTimeSaleIsSecond = this.parsedOptions.reverseSortedTimelineScales[0].unit === 'second';
    } else {
      startDate = createDateAtMidnight(
        Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime),
        true
      );
      endDate = createDateAtLastHour(
        Math.max(Math.min(this.parsedOptions._maxDateTime, rawDateEndDateTime), this.parsedOptions._minDateTime),
        true
      );
    }
    const taskDays = (endDate.getTime() - startDate.getTime() + 1) / (1000 * 60 * 60 * 24);
    return {
      taskRecord,
      taskDays,
      startDate,
      endDate,
      progress
    };
  }

  /**
   * 更新任务的开始日期
   * @param startDate 新的开始日期
   * @param index 对应的一定是左侧表格body的index
   * @param sub_task_index 子任务的index, 当taskShowMode是sub_tasks_*模式时，会传入sub_task_index。如果是tasks_separate模式，sub_task_index传入undefined。
   * 如果模式Project_Sub_Tasks_Inline时，传入的sub_task_index是一个数组，数组的第一个元素是父任务的index，第二个元素是子任务的index,依次类推算是各层子任务的path。
   */
  _updateStartDateToTaskRecord(startDate: Date, index: number, sub_task_index?: number | number[]) {
    const taskRecord = this.getRecordByIndex(index, sub_task_index);
    const startDateField = this.parsedOptions.startDateField;
    const dateFormat = this.parsedOptions.dateFormat ?? parseDateFormat(taskRecord[startDateField]);
    const newStartDate = formatDate(startDate, dateFormat);
    taskRecord[startDateField] = newStartDate;

    if (!isValid(sub_task_index)) {
      //子任务不是独占左侧表格一行的情况
      const indexs = this.getRecordIndexByTaskShowIndex(index);
      this._updateRecordToListTable(taskRecord, indexs);
      // 递归更新父级project任务的时间范围
      if (Array.isArray(indexs)) {
        this.stateManager.updateProjectTaskTimes(indexs);
      }
    } else if (Array.isArray(sub_task_index)) {
      // 递归更新父级project任务的时间范围
      this.stateManager.updateProjectTaskTimes(sub_task_index);
    }
  }

  _updateEndDateToTaskRecord(endDate: Date, index: number, sub_task_index?: number) {
    const taskRecord = this.getRecordByIndex(index, sub_task_index);
    const endDateField = this.parsedOptions.endDateField;
    const dateFormat = this.parsedOptions.dateFormat ?? parseDateFormat(taskRecord[endDateField]);

    const newEndDate = formatDate(endDate, dateFormat);
    taskRecord[endDateField] = newEndDate;
    if (!isValid(sub_task_index)) {
      //子任务不是独占左侧表格一行的情况
      const indexs = this.getRecordIndexByTaskShowIndex(index);
      this._updateRecordToListTable(taskRecord, indexs);
      // 递归更新父级project任务的时间范围
      if (Array.isArray(indexs)) {
        this.stateManager.updateProjectTaskTimes(indexs);
      }
    } else if (Array.isArray(sub_task_index)) {
      // 递归更新父级project任务的时间范围
      this.stateManager.updateProjectTaskTimes(sub_task_index);
    }
  }

  _updateStartEndDateToTaskRecord(startDate: Date, endDate: Date, index: number, sub_task_index?: number) {
    const taskRecord = this.getRecordByIndex(index, sub_task_index);
    const startDateField = this.parsedOptions.startDateField;
    const endDateField = this.parsedOptions.endDateField;
    const dateFormat = this.parsedOptions.dateFormat ?? parseDateFormat(taskRecord[startDateField]);
    const newStartDate = formatDate(startDate, dateFormat);
    taskRecord[startDateField] = newStartDate;
    const newEndDate = formatDate(endDate, dateFormat);
    taskRecord[endDateField] = newEndDate;
    if (!isValid(sub_task_index)) {
      const indexs = this.getRecordIndexByTaskShowIndex(index);
      //子任务不是独占左侧表格一行的情况
      this._updateRecordToListTable(taskRecord, indexs);
      // 递归更新父级project任务的时间范围
      if (Array.isArray(indexs)) {
        this.stateManager.updateProjectTaskTimes(indexs);
      }
    } else if (Array.isArray(sub_task_index)) {
      // 递归更新父级project任务的时间范围
      this.stateManager.updateProjectTaskTimes(sub_task_index);
    }
  }

  /**
   * 更新任务进度
   * @param progress 进度
   * @param index 对应的一定是左侧表格body的index
   * @param sub_task_index 子任务的index, 当taskShowMode是sub_tasks_*模式时，会传入sub_task_index。如果是tasks_separate模式，sub_task_index传入undefined。
   */
  _updateProgressToTaskRecord(progress: number, index: number, sub_task_index?: number) {
    const taskRecord = this.getRecordByIndex(index, sub_task_index);
    const progressField = this.parsedOptions.progressField;
    if (progressField) {
      taskRecord[progressField] = progress;
      const indexs = this.getRecordIndexByTaskShowIndex(index);
      this._updateRecordToListTable(taskRecord, indexs);
      this._refreshTaskBar(index, sub_task_index);
    }
  }

  /**
   * 拖拽任务条或者调整任务条尺寸修改日期更新到数据中
   * @param updateDateType
   * @param days
   * @param index
   */
  _dragOrderTaskRecord(
    source_index: number,
    source_sub_task_index: number,
    target_index: number,
    target_sub_task_index: number
  ) {
    // const source_taskRecord = this.getRecordByIndex(source_index, source_sub_task_index);
    this.data.adjustOrder(source_index, source_sub_task_index, target_index, target_sub_task_index);
  }
  // 定义多个函数签名
  /** 更新数据信息
   * 如果TasksShowModes是 tasks_separate 模式 则需要传入task_index即可
   * 如果TasksShowModes是 sub_tasks_*** 模式 则需要传入task_index和sub_task_index
   */
  updateTaskRecord(record: any, task_index: number | number[]): void;
  updateTaskRecord(record: any, task_index: number, sub_task_index: number): void;
  updateTaskRecord(record: any, task_index: number | number[], sub_task_index?: number) {
    if (isValid(sub_task_index)) {
      const index = typeof task_index === 'number' ? task_index : task_index[0];
      this._updateRecordToListTable(record, [index, sub_task_index]);
      this._refreshTaskBar(index, sub_task_index);
      return;
    }
    if (Array.isArray(task_index)) {
      const index = (task_index as number[])[0];
      const sub_index = (task_index as number[])[1];
      // this._updateRecordToListTable(record, isValid(sub_index) ? [index, sub_index] : index);
      this._updateRecordToListTable(record, task_index);
      this._refreshTaskBar(index, sub_index);
      return;
    }
    let recordIndexs: number | number[] = task_index;
    if (this.taskListTableInstance.rowHierarchyType === 'tree') {
      //如果是树形结构 需要获取数据源对应的索引
      recordIndexs = this.taskListTableInstance.getRecordIndexByCell(
        0,
        task_index + this.taskListTableInstance.columnHeaderLevelCount
      );
    }
    this._updateRecordToListTable(record, recordIndexs);
    this._refreshTaskBar(task_index, undefined);
  }

  /**
   * 设置像数比
   * @param pixelRatio
   */
  setPixelRatio(pixelRatio: number) {
    this.taskListTableInstance?.setPixelRatio(pixelRatio);
    this.parsedOptions.pixelRatio = pixelRatio;
    this.scenegraph.setPixelRatio(pixelRatio);
  }
  updateTasksShowMode(tasksShowMode: TasksShowMode) {
    this.options.tasksShowMode = tasksShowMode;
    this.updateOption(this.options);
  }
  _resize() {
    this._updateSize();
    this.taskListTableInstance?.setCanvasSize(
      this.taskTableWidth,
      this.tableNoFrameHeight +
        toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0)[0] +
        toBoxArray(this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0)[2]
    );
    this._syncPropsFromTable();
    this.scenegraph.resize();
    updateSplitLineAndResizeLine(this);
  }
  _syncPropsFromTable() {
    this.itemCount = this.taskListTableInstance
      ? this.taskListTableInstance.rowCount - this.taskListTableInstance.columnHeaderLevelCount
      : this.records.length;
    this.headerHeight = this.getAllHeaderRowsHeight();
    this.drawHeight = Math.min(this.getAllRowsHeight(), this.tableNoFrameHeight);
    this.gridHeight = this.drawHeight - this.headerHeight;
  }
  /** 获取绘制画布的canvas上下文 */
  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  release(): void {
    super.release?.();
    this.eventManager.release();
    this.taskListTableInstance?.release();
    const { parentElement } = this.element;
    if (parentElement) {
      parentElement.removeChild(this.element);
      this.verticalSplitResizeLine && parentElement.removeChild(this.verticalSplitResizeLine);
      this.horizontalSplitLine && parentElement.removeChild(this.horizontalSplitLine);
    }
    this.scenegraph = null;
    this.pluginManager.release();
  }

  updateOption(options: GanttConstructorOptions) {
    (this.parsedOptions as any) = {};
    this.options = options;

    this.taskTableWidth =
      typeof options?.taskListTable?.tableWidth === 'number' ? options?.taskListTable?.tableWidth : -1; //-1 只是作为标记  后续判断该值进行自动计算宽度
    this.taskTableColumns = options?.taskListTable?.columns ?? [];
    this.records = options?.records ?? [];

    this._sortScales();
    initOptions(this);
    this.data.setRecords(this.records);
    this._generateTimeLineDateMap();
    this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length;
    this._updateSize();
    if (this.taskListTableInstance) {
      const listTableOption = this._generateListTableOptions();
      this.taskListTableInstance.updateOption(listTableOption);
      this._updateListTableSize(this.taskListTableInstance);
    }
    this._syncPropsFromTable();
    this.scenegraph.updateStageBackground();
    this.element.style.left = this.taskTableWidth !== -1 ? `${this.taskTableWidth}px` : '0px';

    updateSplitLineAndResizeLine(this);
    this.scenegraph.updateSceneGraph();

    this.scenegraph.afterCreateSceneGraph();
    this._scrollToMarkLine();
  }
  setRecords(records: any[]) {
    this.records = records;
    this.data.setRecords(records);
    updateOptionsWhenRecordChanged(this);
    this.taskListTableInstance.setRecords(records);
    this._syncPropsFromTable();
    this._generateTimeLineDateMap();
    this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length;
    this._updateSize();
    this.scenegraph.refreshAll();
    this.verticalSplitResizeLine.style.height = this.drawHeight + 'px'; //'100%';
    const left = this.stateManager.scroll.horizontalBarPos;
    const top = this.stateManager.scroll.verticalBarPos;
    this.scenegraph.setX(-left);
    this.scenegraph.setY(-top);
  }
  updateScales(scales: ITimelineScale[]) {
    const oldScalesLength = this.parsedOptions.sortedTimelineScales.length;
    const gantt = this;
    this.options.timelineHeader.scales = scales;
    this._sortScales();
    updateOptionsWhenScaleChanged(gantt);
    this._generateTimeLineDateMap();
    this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length;
    this.scenegraph.refreshAll();
    updateSplitLineAndResizeLine(this);
    if (this.taskListTableInstance) {
      if (this.taskListTableInstance.columnHeaderLevelCount === this.parsedOptions.timeLineHeaderRowHeights.length) {
        for (let i = 0; i < this.taskListTableInstance.columnHeaderLevelCount; i++) {
          this.taskListTableInstance.setRowHeight(i, this.parsedOptions.timeLineHeaderRowHeights[i]);
        }
      } else {
        const newRowHeight = this.getAllHeaderRowsHeight() / this.taskListTableInstance.columnHeaderLevelCount;
        for (let i = 0; i < this.taskListTableInstance.columnHeaderLevelCount; i++) {
          this.taskListTableInstance.setRowHeight(i, newRowHeight);
        }
      }
    }
    if (oldScalesLength !== scales.length) {
      this._resize();
    }
  }
  /** 更新日期范围 */
  updateDateRange(minDate: string, maxDate: string) {
    this.options.minDate = minDate;
    this.options.maxDate = maxDate;
    updateOptionsWhenDateRangeChanged(this);
    this._generateTimeLineDateMap();
    this._updateSize();
    this.scenegraph.refreshAll();
    this._scrollToMarkLine();
  }
  /** 更新markLine标记线 */
  updateMarkLine(markLine: IMarkLine[]) {
    this.options.markLine = markLine;
    updateOptionsWhenMarkLineChanged(this);
    this.scenegraph.markLine.refresh();
    this.scenegraph.renderSceneGraph();
  }
  /** 增加markLine标记线 */
  addMarkLine(markLine: IMarkLine) {
    this.options.markLine = [...(this.parsedOptions.markLine as IMarkLine[]), markLine];
    updateOptionsWhenMarkLineChanged(this);
    this.scenegraph.markLine.refresh();
    this.scenegraph.renderSceneGraph();
    this.scenegraph.updateNextFrame();
  }
  /** 更新当前的markLine标记线 */
  updateCurrentMarkLine(markLine: IMarkLine) {
    const currentMarkLineIndex = (this.parsedOptions.markLine as IMarkLine[]).findIndex(
      item => item.date === markLine.date
    );
    if (currentMarkLineIndex === -1) {
      return;
    }
    this.options.markLine = [
      ...this.parsedOptions.markLine.slice(0, currentMarkLineIndex),
      { ...(this.options.markLine as IMarkLine[])[currentMarkLineIndex], ...markLine },
      ...this.parsedOptions.markLine.slice(currentMarkLineIndex + 1)
    ];
    updateOptionsWhenMarkLineChanged(this);
    this.scenegraph.markLine.refresh();
    this.scenegraph.renderSceneGraph();
    this.scenegraph.updateNextFrame();
  }
  /** 滚动到scrollToMarkLineDate所指向的日期 */
  _scrollToMarkLine() {
    if (this.parsedOptions.scrollToMarkLineDate && this.parsedOptions.minDate) {
      const minDate = this.parsedOptions.minDate;
      const { unit, step } = this.parsedOptions.reverseSortedTimelineScales[0];
      const count = computeCountToTimeScale(this.parsedOptions.scrollToMarkLineDate, minDate, unit, step);
      const targetDayDistance = count * this.parsedOptions.timelineColWidth;
      const left = targetDayDistance - this.tableNoFrameWidth / 2;
      this.stateManager.setScrollLeft(left);
    }
  }

  scrollToMarkLine(date: Date) {
    if (!date || !this.parsedOptions.minDate) {
      return;
    }
    const minDate = this.parsedOptions.minDate;
    const { unit, step } = this.parsedOptions.reverseSortedTimelineScales[0];
    const count = computeCountToTimeScale(date, minDate, unit, step);
    const targetDayDistance = count * this.parsedOptions.timelineColWidth;
    const left = targetDayDistance - this.tableNoFrameWidth / 2;
    this.stateManager.setScrollLeft(left);
  }

  addLink(link: ITaskLink) {
    this.parsedOptions.dependencyLinks.push(link);
    this.scenegraph.dependencyLink.initLinkLine(this.parsedOptions.dependencyLinks.length - 1);
    this.scenegraph.updateNextFrame();
  }
  deleteLink(link: ITaskLink) {
    if (this.parsedOptions.dependencyLinkDeletable) {
      const index = this.parsedOptions.dependencyLinks.findIndex(
        item =>
          item.type === link.type &&
          item.linkedFromTaskKey === link.linkedFromTaskKey &&
          item.linkedToTaskKey === link.linkedToTaskKey
      );
      if (index !== -1) {
        const link = this.parsedOptions.dependencyLinks[index];
        this.parsedOptions.dependencyLinks.splice(index, 1);
        this.scenegraph.dependencyLink.deleteLink(link);
        this.scenegraph.updateNextFrame();
      }
    }
  }
  get scrollTop(): number {
    return this.stateManager.scrollTop;
  }
  set scrollTop(value: number) {
    this.stateManager.setScrollTop(value);
  }
  get scrollLeft(): number {
    return this.stateManager.scrollLeft;
  }
  set scrollLeft(value: number) {
    this.stateManager.setScrollLeft(value);
  }
  /** 获取任务条的位置。相对应甘特图表左上角的位置。 */
  getTaskBarRelativeRect(index: number) {
    const taskBarNode = this.scenegraph.taskBar.getTaskBarNodeByIndex(index);
    const left =
      taskBarNode.attribute.x +
      this.taskListTableInstance.tableNoFrameWidth +
      this.taskListTableInstance.tableX +
      this.tableX -
      this.scrollLeft;
    const top = taskBarNode.attribute.y + this.tableY + this.headerHeight - this.scrollTop;
    const width = taskBarNode.attribute.width;
    const height = taskBarNode.attribute.height;
    return {
      left,
      top,
      width,
      height
    };
  }
  // getMinScaleUnitToDays() {
  //   const minScale = this.parsedOptions.reverseSortedTimelineScales[0];
  //   const minScaleUnit = minScale.unit;
  //   const minScaleStep = minScale.step ?? 1;
  //   if (minScaleUnit === 'day') {
  //     return minScaleStep;
  //   } else if (minScaleUnit === 'week') {
  //     return 7 * minScaleStep;
  //   } else if (minScaleUnit === 'month') {
  //     return 30 * minScaleStep;
  //   } else if (minScaleUnit === 'quarter') {
  //     return 90 * minScaleStep;
  //   } else if (minScaleUnit === 'year') {
  //     return 365 * minScaleStep;
  //   } else if (minScaleUnit === 'hour') {
  //     return (1 / 24) * minScaleStep;
  //   } else if (minScaleUnit === 'minute') {
  //     return (1 / 24 / 60) * minScaleStep;
  //   } else if (minScaleUnit === 'second') {
  //     return (1 / 24 / 60 / 60) * minScaleStep;
  //   }
  //   return 1;
  // }

  getDateColWidth(dateIndex: number) {
    return this.parsedOptions.timelineColWidth;
  }
  getDateColsWidth(startDateIndex: number, endDateIndex: number) {
    return (endDateIndex - startDateIndex + 1) * this.parsedOptions.timelineColWidth;
  }

  getDateRangeByIndex(index: number) {
    const minScale = this.parsedOptions.reverseSortedTimelineScales[0];
    if (index < minScale.timelineDates.length) {
      const startDate = minScale.timelineDates[index].startDate;
      const endDate = minScale.timelineDates[index].endDate;
      return {
        startDate,
        endDate
      };
    }
    return null;
  }

  parseTimeFormat(date: string) {
    return parseDateFormat(date);
  }

  getTaskBarStyle(task_index: number, sub_task_index?: number | number[]) {
    const { startDate, endDate, taskRecord } = this.getTaskInfoByTaskListIndex(task_index, sub_task_index);
    let style;
    if (taskRecord.type === TaskType.PROJECT) {
      style = this.parsedOptions.projectBarStyle;
    } else {
      style = this.parsedOptions.taskBarStyle;
    }
    if (typeof style === 'function') {
      const args = {
        index: task_index,
        startDate,
        endDate,
        taskRecord,
        ganttInstance: this
      };
      return style(args);
    }
    return style;
  }

  /**
   * 格式化日期
   * @param date 日期对象或字符串
   * @param format 格式字符串
   * @returns 格式化后的日期字符串
   */
  formatDate(date: Date | string, format: string) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDate(dateObj, format);
  }

  // 🔑 新增：ZoomScale 公共 API
  getCurrentZoomScaleLevel(): number {
    return this.zoomScaleManager?.getCurrentLevel() ?? -1;
  }

  switchToZoomScaleLevel(levelIndex: number): boolean {
    return this.zoomScaleManager?.switchToLevel(levelIndex) ?? false;
  }

  getZoomScaleLevelsCount(): number {
    return this.zoomScaleManager?.getLevelCount() ?? 0;
  }

  isZoomScaleEnabled(): boolean {
    return !!this.zoomScaleManager;
  }

  getZoomScaleConfig() {
    return this.zoomScaleManager?.getConfig();
  }

  getZoomScaleLevelThresholds() {
    return this.zoomScaleManager?.getLevelThresholds();
  }

  getCurrentTimePerPixel(): number {
    return this.timePerPixel;
  }
}
