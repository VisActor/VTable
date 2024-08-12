// import themes from './themes';
// import { createRootElement } from './core/tableHelper';
import { Scenegraph } from './scenegraph/scenegraph';
import { Env } from './env';
import type {
  ITaskBarStyle,
  GanttConstructorOptions,
  IGridStyle,
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
  ILineStyle
} from './ts-types';
import type { ListTableConstructorOptions, TYPES } from '@visactor/vtable';
import { ListTable, themes } from '@visactor/vtable';
import { EventManager } from './event/event-manager';
import { StateManager } from './state/state-manager';
import {
  convertProgress,
  DayTimes,
  generateTimeLineDate,
  getHorizontalScrollBarSize,
  getVerticalScrollBarSize,
  initOptions
} from './gantt-helper';
import { EventTarget } from './event/EventTarget';
import { formatDate, getWeekNumber, parseDateFormat, toBoxArray } from './tools/util';
import { DataSource } from './data/DataSource';
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
  canvasWidth?: number;
  canvasHeight?: number;
  tableNoFrameWidth: number;
  tableNoFrameHeight: number;
  tableX: number;
  tableY: number;
  scenegraph: Scenegraph;
  stateManager: StateManager;
  eventManager: EventManager;

  taskListTableInstance?: ListTable;

  canvas: HTMLCanvasElement;
  element: HTMLElement;
  resizeLine: HTMLDivElement;
  horizontalSplitLine: HTMLDivElement;
  context: CanvasRenderingContext2D;

  sortedTimelineScales: (ITimelineScale & { timelineDates?: ITimelineDateInfo[] })[];
  reverseSortedTimelineScales: (ITimelineScale & { timelineDates?: ITimelineDateInfo[] })[];
  headerLevel: number;
  itemCount: number;
  drawHeight: number;
  headerHeight: number;
  gridHeight: number;

  parsedOptions: {
    headerRowHeight: number | number[];
    rowHeight: number;
    timelineColWidth: number;
    colWidthPerDay: number; //分配给每日的宽度

    scrollStyle: IScrollStyle;
    // timelineHeaderStyle: ITimelineHeaderStyle;
    timelineHeaderVerticalLineStyle: ILineStyle;
    timelineHeaderHorizontalLineStyle: ILineStyle;
    timelineHeaderBackgroundColor: string;
    timelineHeaderStyles: ITimelineHeaderStyle[];
    gridStyle: IGridStyle;
    taskBarStyle: ITaskBarStyle;
    taskBarHoverStyle: ITaskBarStyle & { barOverLayColor?: string };
    taskBarSelectionStyle: ITaskBarStyle & { barOverLayColor?: string };
    taskBarLabelText: ITaskBarLabelText;
    taskBarMoveable: boolean;
    taskBarResizable: boolean;
    taskBarLabelStyle: ITaskBarLabelTextStyle;
    taskBarCustomLayout: ITaskBarCustomLayout;
    outerFrameStyle: IFrameStyle;
    pixelRatio: number;

    startDateField: string;
    endDateField: string;
    progressField: string;
    minDate: Date;
    maxDate: Date;
    _minDateTime: number;
    _maxDateTime: number;
    markLine: IMarkLine[];
    horizontalSplitLine: ILineStyle;
    verticalSplitLine: ILineStyle;
    verticalSplitLineHighlight: ILineStyle;
    verticalSplitLineMoveable?: boolean;
    overscrollBehavior: 'auto' | 'none';
  } = {} as any;

  taskTableWidth: number;
  taskTableColumns: ITableColumnsDefine;

  records: any[];
  data: DataSource;
  constructor(container: HTMLElement, options?: GanttConstructorOptions) {
    super();
    this.container = container;
    this.options = options;

    this.taskTableWidth = typeof options?.taskListTable?.width === 'number' ? options?.taskListTable?.width : 100;
    this.taskTableColumns = options?.taskListTable?.columns ?? [];
    this.records = options?.records ?? [];

    initOptions(this);
    this.data = new DataSource(this);
    this._sortScales();
    this._generateTimeLineDateMap();
    this.headerLevel = this.sortedTimelineScales.length;
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

    this._createSplitLineAndResizeLine();
    this.scenegraph = new Scenegraph(this);
    this.stateManager = new StateManager(this);
    this.eventManager = new EventManager(this);

    this.scenegraph.afterCreateSceneGraph();
  }

  renderTaskTable() {
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
      widthP = this.canvasWidth - 1;
      heightP = this.canvasHeight - 1;
    }
    const width = Math.floor(widthP - getVerticalScrollBarSize(this.parsedOptions.scrollStyle));
    const height = Math.floor(heightP - getHorizontalScrollBarSize(this.parsedOptions.scrollStyle));

    this.tableNoFrameWidth = widthP;
    this.tableNoFrameHeight = Math.floor(heightP);
    if (this.parsedOptions.outerFrameStyle) {
      //考虑表格整体边框的问题
      const lineWidth = this.parsedOptions.outerFrameStyle?.borderLineWidth; // toBoxArray(this.parsedOptions.frameStyle?.borderLineWidth ?? [null]);
      this.tableX = lineWidth;
      this.tableY = lineWidth;
      this.tableNoFrameWidth = width - lineWidth;

      this.tableNoFrameHeight = height - lineWidth * 2;
    }
  }
  _generateListTable() {
    if (this.taskTableColumns.length >= 1) {
      const listTableOption = this._generateListTableOptions();
      this.taskListTableInstance = new ListTable(this.container, listTableOption);

      if (this.options?.taskListTable?.width === 'auto') {
        this.taskTableWidth = this.taskListTableInstance.getAllColsWidth() + this.taskListTableInstance.tableX * 2;
        if (this.options?.taskListTable?.maxWidth) {
          this.taskTableWidth = Math.min(this.options?.taskListTable?.maxWidth, this.taskTableWidth);
        }
        if (this.options?.taskListTable?.minWidth) {
          this.taskTableWidth = Math.max(this.options?.taskListTable?.minWidth, this.taskTableWidth);
        }
        this.element.style.left = this.taskTableWidth ? `${this.taskTableWidth}px` : '0px';
        this.taskListTableInstance.setCanvasSize(
          this.taskTableWidth,
          this.tableNoFrameHeight + this.parsedOptions.outerFrameStyle.borderLineWidth * 2
        );
        this._updateSize();
      }

      if (this.taskListTableInstance.columnHeaderLevelCount > 1) {
        if (
          Array.isArray(this.parsedOptions.headerRowHeight) &&
          this.taskListTableInstance.columnHeaderLevelCount === this.parsedOptions.headerRowHeight.length
        ) {
          for (let i = 0; i < this.taskListTableInstance.columnHeaderLevelCount; i++) {
            this.taskListTableInstance.setRowHeight(i, this.parsedOptions.headerRowHeight[i]);
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
    const needPutInListTableKeys = ['container', 'records', 'pixelRatio', 'overscrollBehavior', 'pixelRatio'];
    for (const key in this.options) {
      if (needPutInListTableKeys.indexOf(key) >= 0) {
        listTable_options[key] = this.options[key];
      }
    }
    for (const key in this.options.taskListTable) {
      listTable_options[key] = this.options.taskListTable[key];
      if (key === 'columns') {
        listTable_options[key][listTable_options[key].length - 1].disableColumnResize = true;
      }
    }
    // lineWidthArr[1] = 0;
    listTable_options.theme = {
      scrollStyle: Object.assign({}, this.parsedOptions.scrollStyle, {
        verticalVisible: 'none'
      }),
      headerStyle: Object.assign(
        {},
        themes.DEFAULT.headerStyle,
        {
          bgColor: this.parsedOptions.timelineHeaderBackgroundColor
        },
        this.options.taskListTable.headerStyle
      ),
      cellInnerBorder: false,
      frameStyle: Object.assign({}, this.parsedOptions.outerFrameStyle, {
        cornerRadius: this.parsedOptions.outerFrameStyle.cornerRadius, //[this.parsedOptions.frameStyle.cornerRadius, 0, 0, this.parsedOptions.frameStyle.cornerRadius],
        borderLineWidth: [
          this.parsedOptions.outerFrameStyle.borderLineWidth,
          0,
          this.parsedOptions.outerFrameStyle.borderLineWidth,
          this.parsedOptions.outerFrameStyle.borderLineWidth
        ]
      }),
      bodyStyle: Object.assign({}, themes.DEFAULT.bodyStyle, this.options.taskListTable.bodyStyle)
    } as ListTableConstructorOptions.theme;
    listTable_options.canvasWidth = this.taskTableWidth as number;
    listTable_options.canvasHeight = this.canvasHeight ?? this.canvas.height;
    listTable_options.defaultHeaderRowHeight = this.getAllHeaderRowsHeight();
    listTable_options.defaultRowHeight = this.parsedOptions.rowHeight;
    listTable_options.clearDOM = false;
    return listTable_options;
  }
  _createSplitLineAndResizeLine() {
    if (this.parsedOptions.horizontalSplitLine) {
      this.horizontalSplitLine = document.createElement('div');
      this.horizontalSplitLine.style.position = 'absolute';
      this.horizontalSplitLine.style.top = this.getAllHeaderRowsHeight() + 'px';
      this.horizontalSplitLine.style.left = this.tableY + 'px';
      this.horizontalSplitLine.style.height = (this.parsedOptions.horizontalSplitLine.lineWidth ?? 2) + 'px';
      this.horizontalSplitLine.style.width = this.tableNoFrameHeight + this.taskTableWidth + 'px'; //'100%';
      this.horizontalSplitLine.style.backgroundColor = this.parsedOptions.horizontalSplitLine.lineColor;
      this.horizontalSplitLine.style.zIndex = '100';
      this.horizontalSplitLine.style.userSelect = 'none';
      this.horizontalSplitLine.style.opacity = '1';
      (this.container as HTMLElement).appendChild(this.horizontalSplitLine);
    }
    if (this.taskListTableInstance) {
      this.resizeLine = document.createElement('div');
      this.resizeLine.style.position = 'absolute';
      this.resizeLine.style.top = this.tableY + 'px';
      this.resizeLine.style.left = this.taskTableWidth ? `${this.taskTableWidth - 7}px` : '0px';
      this.resizeLine.style.width = '14px';
      this.resizeLine.style.height = this.drawHeight + 'px'; //'100%';
      this.resizeLine.style.backgroundColor = 'rgba(0,0,0,0)';
      this.resizeLine.style.zIndex = '100';
      this.parsedOptions.verticalSplitLineMoveable && (this.resizeLine.style.cursor = 'col-resize');
      this.resizeLine.style.userSelect = 'none';
      this.resizeLine.style.opacity = '1';

      const verticalSplitLine = document.createElement('div');
      verticalSplitLine.style.position = 'absolute';
      verticalSplitLine.style.top = '0px';
      verticalSplitLine.style.left = `${(14 - this.parsedOptions.verticalSplitLine.lineWidth) / 2}px`;
      verticalSplitLine.style.width = this.parsedOptions.verticalSplitLine.lineWidth + 'px';
      verticalSplitLine.style.height = '100%';
      verticalSplitLine.style.backgroundColor = this.parsedOptions.verticalSplitLine.lineColor;
      verticalSplitLine.style.zIndex = '100';
      verticalSplitLine.style.userSelect = 'none';
      verticalSplitLine.style.pointerEvents = 'none';
      // verticalSplitLine.style.opacity = '0';
      verticalSplitLine.style.transition = 'background-color 0.3s';
      this.resizeLine.appendChild(verticalSplitLine);

      if (this.parsedOptions.verticalSplitLineHighlight) {
        const highlightLine = document.createElement('div');
        highlightLine.style.position = 'absolute';
        highlightLine.style.top = '0px';
        highlightLine.style.left = `${(14 - this.parsedOptions.verticalSplitLineHighlight.lineWidth ?? 2) / 2}px`;
        highlightLine.style.width = (this.parsedOptions.verticalSplitLineHighlight.lineWidth ?? 2) + 'px';
        highlightLine.style.height = '100%';
        highlightLine.style.backgroundColor = this.parsedOptions.verticalSplitLineHighlight.lineColor;
        highlightLine.style.zIndex = '100';
        highlightLine.style.cursor = 'col-resize';
        highlightLine.style.userSelect = 'none';
        highlightLine.style.pointerEvents = 'none';
        highlightLine.style.opacity = '0';
        highlightLine.style.transition = 'background-color 0.3s';
        this.resizeLine.appendChild(highlightLine);
      }
      (this.container as HTMLElement).appendChild(this.resizeLine);
    }
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

      this.sortedTimelineScales = orderedScales;
      this.reverseSortedTimelineScales = reverseOrderedScales;
    }
  }

  _generateTimeLineDateMap() {
    const startDate = new Date(this.parsedOptions.minDate);
    const endDate = new Date(this.parsedOptions.maxDate);
    let colWidthIncludeDays = 1000000;
    // Iterate over each scale
    for (const scale of this.reverseSortedTimelineScales) {
      // Generate the sub-columns for each step within the scale
      const currentDate = new Date(startDate);
      // const timelineDates: any[] = [];
      scale.timelineDates = generateTimeLineDate(currentDate, endDate, scale);
    }

    const firstScale = this.reverseSortedTimelineScales[0];
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
  getAllRowsHeight() {
    return this.getAllHeaderRowsHeight() + this.itemCount * this.parsedOptions.rowHeight;
  }
  getAllHeaderRowsHeight() {
    if (Array.isArray(this.parsedOptions.headerRowHeight)) {
      return this.parsedOptions.headerRowHeight.reduce((acc, curr, index) => {
        return acc + curr;
      }, 0);
    }
    return (this.parsedOptions.headerRowHeight as number) * this.headerLevel;
  }
  getAllColsWidth() {
    return (
      this.parsedOptions.colWidthPerDay *
      (Math.ceil(
        Math.abs(new Date(this.parsedOptions.maxDate).getTime() - new Date(this.parsedOptions.minDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) +
        1)
    );
  }

  getAllGridHeight() {
    return this.itemCount * this.parsedOptions.rowHeight;
  }

  getRecordByIndex(index: number) {
    if (this.taskListTableInstance) {
      return this.taskListTableInstance.getRecordByRowCol(0, index + this.taskListTableInstance.columnHeaderLevelCount);
    }
    return this.records[index];
  }

  redrawRecord(index: number) {
    // this.listTableInstance.updateRecords([record], [index]);
    this.scenegraph.taskBar.updateTaskBarNode(index);
    this.scenegraph.updateNextFrame();
  }
  updateRecordToListTable(record: any, index: number) {
    this.taskListTableInstance.updateRecords([record], [index]);
  }
  /**
   * 获取指定index处任务数据的具体信息
   * @param index
   * @returns 当前任务信息
   */
  getTaskInfoByTaskListIndex(index: number): {
    taskRecord: any;
    taskDays: number;
    startDate: Date;
    endDate: Date;
    progress: number;
  } {
    const taskRecord = this.getRecordByIndex(index);
    const startDateField = this.parsedOptions.startDateField;
    const endDateField = this.parsedOptions.endDateField;
    const progressField = this.parsedOptions.progressField;
    const rawDateStartDateTime = new Date(taskRecord[startDateField]).getTime();
    const rawDateEndDateTime = new Date(taskRecord[endDateField]).getTime();
    if (
      rawDateEndDateTime < this.parsedOptions._minDateTime ||
      rawDateStartDateTime > this.parsedOptions._maxDateTime
    ) {
      return {
        taskDays: 0,
        progress: 0,
        startDate: null,
        endDate: null,
        taskRecord
      };
    }
    const startDate = new Date(
      Math.min(Math.max(this.parsedOptions._minDateTime, rawDateStartDateTime), this.parsedOptions._maxDateTime)
    );
    const endDate = new Date(
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
  /**
   * 拖拽任务条或者调整任务条尺寸修改日期更新到数据中
   * @param updateDateType
   * @param days
   * @param index
   */
  _updateDateToTaskRecord(updateDateType: 'move' | 'start-move' | 'end-move', days: number, index: number) {
    const taskRecord = this.getRecordByIndex(index);
    const startDateField = this.parsedOptions.startDateField;
    const endDateField = this.parsedOptions.endDateField;
    const dateFormat = parseDateFormat(taskRecord[startDateField]);
    const startDate = new Date(taskRecord[startDateField]);
    const endDate = new Date(taskRecord[endDateField]);
    if (updateDateType === 'move') {
      const newStartDate = formatDate(new Date(days * DayTimes + startDate.getTime()), dateFormat);
      const newEndDate = formatDate(new Date(days * DayTimes + endDate.getTime()), dateFormat);
      taskRecord[startDateField] = newStartDate;
      taskRecord[endDateField] = newEndDate;
    } else if (updateDateType === 'start-move') {
      const newStartDate = formatDate(new Date(days * DayTimes + startDate.getTime()), dateFormat);
      taskRecord[startDateField] = newStartDate;
    } else if (updateDateType === 'end-move') {
      const newEndDate = formatDate(new Date(days * DayTimes + endDate.getTime()), dateFormat);
      taskRecord[endDateField] = newEndDate;
    }
    this.updateRecordToListTable(taskRecord, index);
  }
  /** TODO */
  updateTaskRecord(index: number, record: any) {
    //const taskRecord = this.getRecordByIndex(index);
    this.updateRecordToListTable(record, index);
  }

  /**
   * 设置像数比
   * @param pixelRatio
   */
  setPixelRatio(pixelRatio: number) {
    this.parsedOptions.pixelRatio = pixelRatio;
    this.scenegraph.setPixelRatio(pixelRatio);
  }

  _resize() {
    this._updateSize();
    this.taskListTableInstance.setCanvasSize(
      this.taskTableWidth,
      this.tableNoFrameHeight + this.parsedOptions.outerFrameStyle.borderLineWidth * 2
    );
    this._syncPropsFromTable();
    this.scenegraph.resize();
  }
  _syncPropsFromTable() {
    this.itemCount = this.taskListTableInstance
      ? this.taskListTableInstance.rowCount - this.taskListTableInstance.columnHeaderLevelCount
      : this.records.length;
    this.headerHeight = this.getAllHeaderRowsHeight();
    this.drawHeight = Math.min(
      this.headerHeight + this.parsedOptions.rowHeight * this.itemCount,
      this.tableNoFrameHeight
    );
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
    }
    this.scenegraph = null;
  }
  setRecords(records: any[]) {
    this.records = records;
    this.taskListTableInstance.setRecords(records);
    this._syncPropsFromTable();
    this.resizeLine.style.height = this.drawHeight + 'px'; //'100%';
    this.scenegraph.refreshTaskBarsAndGrid();
    const left = this.stateManager.scroll.horizontalBarPos;
    const top = this.stateManager.scroll.verticalBarPos;
    this.scenegraph.setX(-left);
    this.scenegraph.setY(-top);
  }
}
