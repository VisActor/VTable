// import themes from './themes';
// import { createRootElement } from './core/tableHelper';
import { Scenegraph } from './scenegraph/scenegraph';
import { Env } from './env';
import type { IBarStyle, GanttConstructorOptions, IGridStyle, ITimelineHeaderStyle, IMarkLine } from './ts-types';
import type { ListTableConstructorOptions, TYPES } from '@visactor/vtable';
import { ListTable } from '@visactor/vtable';
import { EventManager } from './event/event-manager';
import { StateManager } from './state/state-manager';
import { DayTimes, generateMarkLine, syncScrollStateFromTable } from './gantt-helper';
import { EventTarget } from './event/EventTarget';
import { formatDate, parseDateFormat } from './tools/util';
// import { generateGanttChartColumns } from './gantt-helper';
export function createRootElement(padding: any, className: string = 'vtable'): HTMLElement {
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
  // internalProps: IBaseTableProtected;

  headerStyleCache: any;
  bodyStyleCache: any;
  bodyBottomStyleCache: any;
  listTableInstance?: ListTable;

  canvas: HTMLCanvasElement;
  element: HTMLElement;
  context: CanvasRenderingContext2D;
  headerRowHeight: number;
  rowHeight: number;
  timelineColWidth: number;
  colWidthPerDay: number; //分配给每日的宽度

  orderedScales: any;
  reverseOrderedScales: any;
  headerLevel: number;
  itemCount: number;
  drawHeight: number;
  headerHeight: number;
  gridHeight: number;

  scrollStyle: TYPES.ScrollStyle;
  timelineHeaderStyle: ITimelineHeaderStyle;
  gridStyle: IGridStyle;
  barStyle: IBarStyle;
  startDateField: string;
  endDateField: string;
  progressField: string;
  minDate: Date;
  maxDate: Date;
  taskTableWidth: number;
  taskTableColumns: TYPES.ColumnsDefine;
  markLine: IMarkLine[];
  records: any[];
  constructor(container: HTMLElement, options?: GanttConstructorOptions) {
    super();
    this.options = options;
    this.headerRowHeight = options?.defaultHeaderRowHeight ?? 40;
    this.rowHeight = options?.defaultRowHeight ?? 40;
    this.timelineColWidth = options?.timelineColWidth ?? 60;
    this.startDateField = options?.startDateField ?? 'startDate';
    this.endDateField = options?.endDateField ?? 'endDate';
    this.progressField = options?.progressField ?? 'progress';
    this.minDate = options?.minDate ? new Date(options?.minDate) : new Date(2024, 1, 1);
    this.maxDate = options?.maxDate ? new Date(options?.maxDate) : new Date(2025, 1, 1);
    this.taskTableWidth = typeof options?.taskTableWidth === 'number' ? options?.taskTableWidth : 100;
    this.taskTableColumns = options?.taskTableColumns ?? [];
    this.records = options?.records ?? [];
    this.scrollStyle = Object.assign(
      {},
      {
        scrollRailColor: 'rgba(100, 100, 100, 0.2)',
        scrollSliderColor: 'rgba(100, 100, 100, 0.5)',
        scrollSliderCornerRadius: 4,
        width: 10,
        visible: 'always',
        hoverOn: true,
        barToSide: false
      },
      options?.scrollStyle
    );
    this.timelineHeaderStyle = Object.assign(
      {},
      {
        borderColor: 'gray',
        borderWidth: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        backgroundColor: '#fff'
      },
      options?.timelineHeaderStyle
    );
    this.gridStyle = Object.assign(
      {},
      {
        backgroundColor: '#fff',
        vertical: {
          lineColor: 'red',
          lineWidth: 1
        },
        horizontal: {
          lineColor: 'blue',
          lineWidth: 1
        }
      },
      options?.gridStyle
    );
    this.barStyle = Object.assign(
      {},
      {
        barColor: 'blue',
        /** 已完成部分任务条的颜色 */
        barColor2: 'gray',
        /** 任务条的宽度 */
        width: this.rowHeight,
        /** 任务条的圆角 */
        cornerRadius: 3,
        /** 任务条的边框 */
        borderWidth: 1,
        /** 边框颜色 */
        borderColor: 'red',
        fontFamily: 'Arial',
        fontSize: 14
      },
      options?.barStyle
    );
    this.markLine = generateMarkLine(options?.markLine);

    this._orderScales();
    this._generateTimeLineDateMap();
    this.headerLevel = this.orderedScales.length;
    this.element = createRootElement({ top: 0, right: 0, left: 0, bottom: 0 }, 'vtable-gantt');
    this.element.style.top = '0px';
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
    const listTableOption = this.generateListTableOptions();
    if (this.taskTableColumns.length >= 1) {
      this.listTableInstance = new ListTable(container, listTableOption);
    }
    this.itemCount = this.records.length;
    this.headerHeight = this.headerRowHeight * this.headerLevel;
    this.drawHeight = Math.min(this.headerHeight + this.rowHeight * this.itemCount, this.tableNoFrameHeight);
    this.gridHeight = this.drawHeight - this.headerHeight;
    this.scenegraph = new Scenegraph(this);
    this.stateManager = new StateManager(this);
    this.eventManager = new EventManager(this);

    this.scenegraph.afterCreateSceneGraph();
    syncScrollStateFromTable(this);
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
      const width1 = widthWithoutPadding ?? 1 - 1;
      const height1 = heightWithoutPadding ?? 1 - 1;

      element.style.width = (width1 && `${width1}px`) || '0px';
      element.style.height = (height1 && `${height1}px`) || '0px';

      const { canvas } = this;
      widthP = canvas.parentElement?.offsetWidth ?? 1 - 1;
      heightP = canvas.parentElement?.offsetHeight ?? 1 - 1;

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

    // const width = Math.floor(widthP - style.getScrollBarSize(this.getTheme().scrollStyle));
    // const height = Math.floor(heightP - style.getScrollBarSize(this.getTheme().scrollStyle));

    this.tableNoFrameWidth = widthP - (this.taskTableWidth as number);
    this.tableNoFrameHeight = Math.floor(heightP);
    // if (this.internalProps.theme?.frameStyle) {
    //   //考虑表格整体边框的问题
    //   const lineWidths = [0, 0, 0, 0]; //toBoxArray(this.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
    //   const shadowWidths = [0, 0, 0, 0]; // toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
    //   if (this.theme.frameStyle?.innerBorder) {
    //     this.tableX = 0;
    //     this.tableY = 0;
    //     this.tableNoFrameWidth = width - (shadowWidths[1] ?? 0);
    //     this.tableNoFrameHeight = height - (shadowWidths[2] ?? 0);
    //   } else {
    //     this.tableX = (lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0);
    //     this.tableY = (lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0);
    //     this.tableNoFrameWidth =
    //       width - ((lineWidths[1] ?? 0) + (shadowWidths[1] ?? 0)) - ((lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0));
    //     this.tableNoFrameHeight =
    //       height - ((lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0)) - ((lineWidths[2] ?? 0) + (shadowWidths[2] ?? 0));
    //   }
    // }
  }
  generateListTableOptions() {
    const listTable_options: ListTableConstructorOptions = {};
    for (const key in this.options) {
      if (key === 'taskTableColumns') {
        listTable_options.columns = this.options.taskTableColumns;
        // debugger;
      } else if (key !== 'timelineScales' && key !== 'barStyle') {
        listTable_options[key] = this.options[key];
      }
    }
    listTable_options.theme = {
      scrollStyle: {
        verticalVisible: 'none'
      },
      headerStyle: {
        bgColor: this.timelineHeaderStyle.backgroundColor
      }
    };
    listTable_options.canvasWidth = this.taskTableWidth as number;
    listTable_options.canvasHeight = this.canvasHeight ?? this.tableNoFrameHeight;
    listTable_options.defaultHeaderRowHeight = this.headerRowHeight * this.headerLevel;
    listTable_options.clearDOM = false;
    return listTable_options;
  }

  /**
   * 获取表格创建的DOM根节点
   */
  getElement(): HTMLElement {
    return this.element;
  }

  _orderScales() {
    const { timelineScales } = this.options;
    if (timelineScales) {
      const order = ['year', 'quarter', 'month', 'week', 'day'];
      const orderedScales = timelineScales.slice().sort((a, b) => {
        const indexA = order.indexOf(a.unit);
        const indexB = order.indexOf(b.unit);
        if (indexA === -1) {
          return 1;
        } else if (indexB === -1) {
          return -1;
        }
        return indexA - indexB;
      });
      const reverseOrderedScales = timelineScales.slice().sort((a, b) => {
        const indexA = order.indexOf(a.unit);
        const indexB = order.indexOf(b.unit);
        if (indexA === -1) {
          return 1;
        } else if (indexB === -1) {
          return -1;
        }
        return indexB - indexA;
      });

      this.orderedScales = orderedScales;
      this.reverseOrderedScales = reverseOrderedScales;
    }
  }

  _generateTimeLineDateMap() {
    const startDate = new Date(this.minDate);
    const endDate = new Date(this.maxDate);
    let colWidthIncludeDays = 1000000;
    // Iterate over each scale
    for (const scale of this.reverseOrderedScales) {
      const { unit, step, format } = scale;
      const timelineDates: any[] = [];
      scale.timelineDates = timelineDates;
      // Generate the sub-columns for each step within the scale
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        if (unit === 'day') {
          const formattedDate = format(currentDate);
          const columnTitle = formattedDate || currentDate.getDate().toString();
          const dayCellConfig = {
            days: step,
            start: currentDate,
            end: new Date(currentDate.getTime() + step * 24 * 60 * 60 * 1000),
            title: columnTitle
          };
          timelineDates.push(dayCellConfig);
          currentDate.setDate(currentDate.getDate() + step);
        } else if (unit === 'month') {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1;
          const end = new Date(year, month + step - 1, 0);
          if (end.getTime() > endDate.getTime()) {
            end.setDate(endDate.getDate());
          }
          const start = currentDate;
          const formattedDate = format(month);
          const columnTitle = formattedDate || month;
          const dayCellConfig = {
            days: Math.ceil(Math.abs(end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
            start,
            end,
            title: columnTitle
          };

          timelineDates.push(dayCellConfig);
          currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + step, 1);
        }
      }
    }

    const firstScale = this.reverseOrderedScales[0];
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
    this.colWidthPerDay = this.timelineColWidth / colWidthIncludeDays;
  }
  getAllRowsHeight() {
    return this.headerRowHeight * this.headerLevel + this.itemCount * this.rowHeight;
  }
  getAllColsWidth() {
    return (
      this.colWidthPerDay *
      (Math.ceil(
        Math.abs(new Date(this.maxDate).getTime() - new Date(this.minDate).getTime()) / (1000 * 60 * 60 * 24)
      ) +
        1)
    );
  }

  getAllGridHeight() {
    return this.itemCount * this.rowHeight;
  }

  getFrozenRowsHeight() {
    return this.headerRowHeight * this.headerLevel;
  }

  getRecordByIndex(index: number) {
    if (this.listTableInstance) {
      return this.listTableInstance.getRecordByRowCol(0, index + this.listTableInstance.columnHeaderLevelCount);
    }
    return this.records[index];
  }

  updateRecord(record: any, index: number) {
    this.listTableInstance.updateRecords([record], [index]);
  }
  updateRecordToListTable(record: any, index: number) {
    this.listTableInstance.updateRecords([record], [index]);
  }
  getTaskInfoByTaskListIndex(index: number) {
    const taskRecord = this.getRecordByIndex(index);
    const startDateField = this.startDateField;
    const endDateField = this.endDateField;
    const progressField = this.progressField;
    const startDate = new Date(taskRecord[startDateField]);
    const endDate = new Date(taskRecord[endDateField]);
    const progress = taskRecord[progressField];
    const taskDays = Math.ceil(Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return {
      taskDays,
      startDate,
      endDate,
      progress
    };
  }

  updateDateToTaskRecord(updateDateType: 'move' | 'start-move' | 'end-move', days: number, index: number) {
    const taskRecord = this.getRecordByIndex(index);
    const startDateField = this.startDateField;
    const endDateField = this.endDateField;
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
}
