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
  IPointStyle
} from './ts-types';
import { TasksShowMode } from './ts-types';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import { themes, registerCheckboxCell, registerProgressBarCell, registerRadioCell, ListTable } from '@visactor/vtable';
import { EventManager } from './event/event-manager';
import { StateManager } from './state/state-manager';
import {
  convertProgress,
  createSplitLineAndResizeLine,
  DayTimes,
  findRecordByTaskKey,
  generateTimeLineDate,
  getHorizontalScrollBarSize,
  getVerticalScrollBarSize,
  initOptions,
  updateSplitLineAndResizeLine
} from './gantt-helper';
import { EventTarget } from './event/EventTarget';
import { createDateAtMidnight, formatDate, isPropertyWritable, parseDateFormat } from './tools/util';
import { DataSource } from './data/DataSource';
import { isValid } from '@visactor/vutils';
// import { generateGanttChartColumns } from './gantt-helper';
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

  parsedOptions: {
    timeLineHeaderRowHeights: number[];
    rowHeight: number;
    timelineColWidth: number;
    colWidthPerDay: number; //分配给每日的宽度

    scrollStyle: IScrollStyle;
    // timelineHeaderStyle: ITimelineHeaderStyle;
    timelineHeaderVerticalLineStyle: ILineStyle;
    timelineHeaderHorizontalLineStyle: ILineStyle;
    timelineHeaderBackgroundColor: string;
    timelineHeaderStyles: ITimelineHeaderStyle[];
    sortedTimelineScales: (ITimelineScale & { timelineDates?: ITimelineDateInfo[] })[];
    reverseSortedTimelineScales: (ITimelineScale & { timelineDates?: ITimelineDateInfo[] })[];
    grid: IGrid;
    taskBarStyle: ITaskBarStyle;
    taskBarHoverStyle: ITaskBarHoverStyle;
    taskBarSelectedStyle: ITaskBarSelectedStyle;
    taskBarSelectable: boolean;
    taskBarLabelText: ITaskBarLabelText;
    taskBarMoveable: boolean;
    taskBarResizable: boolean;
    taskBarDragOrder: boolean;
    taskBarLabelStyle: ITaskBarLabelTextStyle;
    taskBarCustomLayout: ITaskBarCustomLayout;
    taskBarCreatable: boolean;
    taskBarCreationButtonStyle: ILineStyle & {
      cornerRadius?: number;
      backgroundColor?: string;
    };
    taskBarCreationCustomLayout: ITaskCreationCustomLayout;

    outerFrameStyle: IFrameStyle;
    pixelRatio: number;
    tasksShowMode: TasksShowMode;

    startDateField: string;
    endDateField: string;
    progressField: string;
    minDate: Date;
    maxDate: Date;
    _minDateTime: number;
    _maxDateTime: number;
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
    dependencyLinkLineStyle: ILineStyle;
    dependencyLinkSelectedLineStyle: ITaskLinkSelectedStyle;
    dependencyLinkLineCreatePointStyle: IPointStyle;
    dependencyLinkLineCreatingPointStyle: IPointStyle;
    dependencyLinkLineCreatingStyle?: ILineStyle;
    underlayBackgroundColor: string;
  } = {} as any;
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

    this._sortScales();
    initOptions(this);
    this.data = new DataSource(this);
    this._generateTimeLineDateMap();

    this.timeLineHeaderLevel = this.parsedOptions.sortedTimelineScales.length;
    this.element = createRootElement({ top: 0, right: 0, left: 0, bottom: 0 }, 'vtable-gantt');
    // this.element.style.top = '0px';
    this.element.style.left = this.taskTableWidth ? `${this.taskTableWidth}px` : '0px';

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
      const lineWidth = this.parsedOptions.outerFrameStyle?.borderLineWidth; // toBoxArray(this.parsedOptions.frameStyle?.borderLineWidth ?? [null]);
      this.tableX =
        this.taskTableColumns.length >= 1 || this.options?.rowSeriesNumber
          ? this.parsedOptions.verticalSplitLine.lineWidth ?? 0
          : lineWidth;
      this.tableY = lineWidth;
      this.tableNoFrameWidth = Math.min(width - lineWidth - this.tableX, this._getAllColsWidth());

      this.tableNoFrameHeight = height - lineWidth * 2;
    }
  }
  _generateListTable() {
    if (this.taskTableColumns.length >= 1 || this.options?.rowSeriesNumber) {
      const listTableOption = this._generateListTableOptions();
      this.taskListTableInstance = new ListTable(this.container, listTableOption);

      if (this.options?.taskListTable?.tableWidth === 'auto' || this.taskTableWidth === -1) {
        this.taskTableWidth =
          this.taskListTableInstance.getAllColsWidth() + this.parsedOptions.outerFrameStyle.borderLineWidth;
        if (this.options?.taskListTable?.maxTableWidth) {
          this.taskTableWidth = Math.min(this.options?.taskListTable?.maxTableWidth, this.taskTableWidth);
        }
        if (this.options?.taskListTable?.minTableWidth) {
          this.taskTableWidth = Math.max(this.options?.taskListTable?.minTableWidth, this.taskTableWidth);
        }
        this.element.style.left = this.taskTableWidth ? `${this.taskTableWidth}px` : '0px';
        this.taskListTableInstance.setCanvasSize(
          this.taskTableWidth,
          this.tableNoFrameHeight + this.parsedOptions.outerFrameStyle.borderLineWidth * 2
        );
        this._updateSize();
      }

      if (this.taskListTableInstance.columnHeaderLevelCount > 1) {
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
    }
  }
  _generateListTableOptions() {
    const listTable_options: ListTableConstructorOptions = {};
    const needPutInListTableKeys = ['container', 'records', 'rowSeriesNumber', 'overscrollBehavior', 'pixelRatio'];
    for (const key in this.options) {
      if (needPutInListTableKeys.indexOf(key) >= 0) {
        listTable_options[key] = this.options[key];
      }
    }
    for (const key in this.options.taskListTable) {
      listTable_options[key] = this.options.taskListTable[key];
      if (key === 'columns') {
        listTable_options[key][listTable_options[key].length - 1].disableColumnResize = true;
        if (
          this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
          this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate
        ) {
          for (let i = 0; i < listTable_options.columns.length; i++) {
            if (listTable_options.columns[i].tree) {
              listTable_options.columns[i].tree = false;
            }
          }
        }
      }
      if (
        key === 'hierarchyExpandLevel' &&
        (this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline ||
          this.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate)
      ) {
        delete listTable_options[key];
      }
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
        extendThemeOption.frameStyle = Object.assign({}, this.parsedOptions.outerFrameStyle, {
          shadowBlur: 0,
          cornerRadius: [
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineWidth: [
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0,
            0,
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0,
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0
          ]
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
        listTable_options.theme.frameStyle = Object.assign({}, this.parsedOptions.outerFrameStyle, {
          cornerRadius: [
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0,
            0,
            0,
            this.parsedOptions.outerFrameStyle?.cornerRadius ?? 0
          ],
          borderLineWidth: [
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0,
            0,
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0,
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0
          ]
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
          borderLineWidth: [
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0,
            0,
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0,
            this.parsedOptions.outerFrameStyle?.borderLineWidth ?? 0
          ]
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
        return (record.children?.length || 1) * this.parsedOptions.rowHeight;
      };
      listTable_options.defaultRowHeight = 'auto';
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
      const sortOrder = ['year', 'quarter', 'month', 'week', 'day'];
      const orderedScales = timelineScales.slice().sort((a, b) => {
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
    const startDate = createDateAtMidnight(this.parsedOptions.minDate);
    const endDate = createDateAtMidnight(this.parsedOptions.maxDate);
    let colWidthIncludeDays = 1000000;
    // Iterate over each scale
    for (const scale of this.parsedOptions.reverseSortedTimelineScales) {
      // Generate the sub-columns for each step within the scale
      const currentDate = createDateAtMidnight(startDate);
      // const timelineDates: any[] = [];
      scale.timelineDates = generateTimeLineDate(currentDate, endDate, scale);
    }

    const firstScale = this.parsedOptions.reverseSortedTimelineScales[0];
    const { unit, step } = firstScale;
    if (unit === 'day') {
      colWidthIncludeDays = step;
    } else if (unit === 'month') {
      colWidthIncludeDays = 30;
    } else if (unit === 'week') {
      colWidthIncludeDays = 7;
    } else if (unit === 'quarter') {
      colWidthIncludeDays = 90;
    } else if (unit === 'year') {
      colWidthIncludeDays = 365;
    }
    this.parsedOptions.colWidthPerDay = this.parsedOptions.timelineColWidth / colWidthIncludeDays;
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
      return acc + curr;
    }, 0);
    // }
    // return (this.parsedOptions.timeLineHeaderRowHeights as number) * this.timeLineHeaderLevel;
  }
  _getAllColsWidth() {
    return (
      this.parsedOptions.colWidthPerDay *
      (Math.ceil(
        Math.abs(
          createDateAtMidnight(this.parsedOptions.maxDate).getTime() -
            createDateAtMidnight(this.parsedOptions.minDate).getTime()
        ) /
          (1000 * 60 * 60 * 24)
      ) +
        1)
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
  getTaskShowIndexByRecordIndex(index: number | number[]) {
    return this.taskListTableInstance.getBodyRowIndexByRecordIndex(index);
  }
  getRecordByIndex(taskShowIndex: number, sub_task_index?: number) {
    if (isValid(sub_task_index)) {
      return this.records[taskShowIndex]?.children?.[sub_task_index];
    }
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getRecordByRowCol(
        0,
        taskShowIndex + this.taskListTableInstance.columnHeaderLevelCount
      );
    }
    return this.records[taskShowIndex];
  }

  _refreshTaskBar(taskShowIndex: number) {
    // this.taskListTableInstance.updateRecords([record], [index]);
    this.scenegraph.taskBar.updateTaskBarNode(taskShowIndex);
    this.scenegraph.updateNextFrame();
  }
  _updateRecordToListTable(record: any, index: number) {
    const indexs = this.taskListTableInstance.getRecordIndexByCell(
      0,
      index + this.taskListTableInstance.columnHeaderLevelCount
    );
    this.taskListTableInstance.updateRecords([record], [indexs]);
  }
  /**
   * 获取指定index处任务数据的具体信息
   * @param index
   * @returns 当前任务信息
   */
  getTaskInfoByTaskListIndex(
    taskShowIndex: number,
    sub_task_index?: number
  ): {
    taskRecord: any;
    taskDays: number;
    startDate: Date;
    endDate: Date;
    progress: number;
  } {
    const taskRecord = this.getRecordByIndex(taskShowIndex, sub_task_index);
    const startDateField = this.parsedOptions.startDateField;
    const endDateField = this.parsedOptions.endDateField;
    const progressField = this.parsedOptions.progressField;
    const rawDateStartDateTime = createDateAtMidnight(taskRecord?.[startDateField]).getTime();
    const rawDateEndDateTime = createDateAtMidnight(taskRecord?.[endDateField]).getTime();
    if (
      rawDateEndDateTime < this.parsedOptions._minDateTime ||
      rawDateStartDateTime > this.parsedOptions._maxDateTime ||
      !taskRecord?.[startDateField] ||
      !taskRecord?.[endDateField]
    ) {
      return {
        taskDays: 0,
        progress: 0,
        startDate: null,
        endDate: null,
        taskRecord
      };
    }
    const startDate = createDateAtMidnight(
      Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime)
    );
    const endDate = createDateAtMidnight(
      Math.max(Math.min(this.parsedOptions._maxDateTime, rawDateEndDateTime), this.parsedOptions._minDateTime)
    );
    const progress = convertProgress(taskRecord[progressField]);
    const taskDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return {
      taskRecord,
      taskDays,
      startDate,
      endDate,
      progress
    };
  }
  // /**
  //  * 获取指定index处任务数据的具体信息
  //  * @param index
  //  * @returns 当前任务信息
  //  */
  // getTaskInfoByTaskListIndexs(
  //   taskShowIndex: number,
  //   subTaskIndex: number
  // ): {
  //   taskRecord: any;
  //   taskDays: number;
  //   startDate: Date;
  //   endDate: Date;
  //   progress: number;
  // } {
  //   const taskParentRecord = this.getRecordByIndex(taskShowIndex);
  //   if (taskParentRecord.children?.length) {
  //     const taskRecord = taskParentRecord.children[subTaskIndex];
  //     const startDateField = this.parsedOptions.startDateField;
  //     const endDateField = this.parsedOptions.endDateField;
  //     const progressField = this.parsedOptions.progressField;
  //     const rawDateStartDateTime = createDateAtMidnight(taskRecord?.[startDateField]).getTime();
  //     const rawDateEndDateTime = createDateAtMidnight(taskRecord?.[endDateField]).getTime();
  //     if (
  //       rawDateEndDateTime < this.parsedOptions._minDateTime ||
  //       rawDateStartDateTime > this.parsedOptions._maxDateTime ||
  //       !taskRecord?.[startDateField] ||
  //       !taskRecord?.[endDateField]
  //     ) {
  //       return {
  //         taskDays: 0,
  //         progress: 0,
  //         startDate: null,
  //         endDate: null,
  //         taskRecord
  //       };
  //     }
  //     const startDate = createDateAtMidnight(
  //       Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime)
  //     );
  //     const endDate = createDateAtMidnight(
  //       Math.max(Math.min(this.parsedOptions._maxDateTime, rawDateEndDateTime), this.parsedOptions._minDateTime)
  //     );
  //     const progress = convertProgress(taskRecord[progressField]);
  //     const taskDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  //     return {
  //       taskRecord,
  //       taskDays,
  //       startDate,
  //       endDate,
  //       progress
  //     };
  //   }
  //   return {
  //     taskDays: 0,
  //     progress: 0,
  //     startDate: null,
  //     endDate: null,
  //     taskRecord: null
  //   };
  // }
  /**
   * 拖拽任务条或者调整任务条尺寸修改日期更新到数据中
   * @param updateDateType
   * @param days
   * @param index
   */
  _updateDateToTaskRecord(
    updateDateType: 'move' | 'start-move' | 'end-move',
    days: number,
    index: number,
    sub_task_index?: number
  ) {
    const taskRecord = this.getRecordByIndex(index, sub_task_index);
    const startDateField = this.parsedOptions.startDateField;
    const endDateField = this.parsedOptions.endDateField;
    const dateFormat = this.parsedOptions.dateFormat ?? parseDateFormat(taskRecord[startDateField]);
    const startDate = createDateAtMidnight(taskRecord[startDateField]);
    const endDate = createDateAtMidnight(taskRecord[endDateField]);
    if (updateDateType === 'move') {
      const newStartDate = formatDate(createDateAtMidnight(days * DayTimes + startDate.getTime()), dateFormat);
      const newEndDate = formatDate(createDateAtMidnight(days * DayTimes + endDate.getTime()), dateFormat);
      taskRecord[startDateField] = newStartDate;
      taskRecord[endDateField] = newEndDate;
    } else if (updateDateType === 'start-move') {
      const newStartDate = formatDate(createDateAtMidnight(days * DayTimes + startDate.getTime()), dateFormat);
      taskRecord[startDateField] = newStartDate;
    } else if (updateDateType === 'end-move') {
      const newEndDate = formatDate(createDateAtMidnight(days * DayTimes + endDate.getTime()), dateFormat);
      taskRecord[endDateField] = newEndDate;
    }
    if (!isValid(sub_task_index)) {
      //子任务不是独占左侧表格一行的情况
      this._updateRecordToListTable(taskRecord, index);
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
  /** 目前不支持树形tree的情况更新单条数据 需要的话目前可以setRecords。 */
  updateTaskRecord(record: any, index: number) {
    //const taskRecord = this.getRecordByIndex(index);
    this._updateRecordToListTable(record, index);
    this._refreshTaskBar(index);
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

  _resize() {
    this._updateSize();
    this.taskListTableInstance?.setCanvasSize(
      this.taskTableWidth,
      this.tableNoFrameHeight + this.parsedOptions.outerFrameStyle.borderLineWidth * 2
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
  }
  setRecords(records: any[]) {
    this.records = records;
    this.taskListTableInstance.setRecords(records);
    this._syncPropsFromTable();
    this.verticalSplitResizeLine.style.height = this.drawHeight + 'px'; //'100%';
    this.scenegraph.refreshTaskBarsAndGrid();
    const left = this.stateManager.scroll.horizontalBarPos;
    const top = this.stateManager.scroll.verticalBarPos;
    this.scenegraph.setX(-left);
    this.scenegraph.setY(-top);
  }
  updateScales(scales: ITimelineScale[]) {
    const gantt = this;
    this.options.timelineHeader.scales = scales;
    this._sortScales();
    initOptions(gantt);
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
  }
  /** 滚动到scrollToMarkLineDate所指向的日期 */
  _scrollToMarkLine() {
    if (this.parsedOptions.scrollToMarkLineDate) {
      const minDate = this.parsedOptions.minDate;
      const targetDayDistance =
        ((this.parsedOptions.scrollToMarkLineDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) *
        this.parsedOptions.colWidthPerDay;
      const left = targetDayDistance - this.tableNoFrameWidth / 2;
      this.stateManager.setScrollLeft(left);
    }
  }

  addLink(link: ITaskLink) {
    this.parsedOptions.dependencyLinks.push(link);
    this.scenegraph.dependencyLink.initLinkLine(this.parsedOptions.dependencyLinks.length - 1);
    this.scenegraph.updateNextFrame();
  }
  deleteLink(link: ITaskLink) {
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
