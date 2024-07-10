import {
  AABBBounds,
  isNumber,
  isBoolean,
  isFunction,
  type ITextSize,
  isValid,
  merge,
  cloneDeep
} from '@visactor/vutils';
import themes from './themes';
import { BaseTable } from './core';
import { createRootElement } from './core/tableHelper';
import { EventHandler } from './event/EventHandler';
import { Scenegraph } from './gantt/scenegraph';
import { Env } from './tools/env';
import { extend } from './tools/helper';
import type { GanttConstructorOptions, ITableThemeDefine, ListTableConstructorOptions } from './ts-types';
import type { IBaseTableProtected } from './ts-types/base-table';
import { NumberRangeMap } from './layout/row-height-map';
import { NumberMap } from './tools/NumberMap';
import { BodyHelper } from './body-helper/body-helper';
import { HeaderHelper } from './header-helper/header-helper';
import { RowSeriesNumberHelper } from './core/row-series-number-helper';
import type { EditManeger } from './edit/edit-manager';
import { SimpleHeaderLayoutMap } from './layout';
import { ListTable } from './ListTable';
import { title } from 'process';
import { EventManager } from './gantt/event-manager';
import { StateManager } from './gantt/state-manager';
// import { generateGanttChartColumns } from './gantt-helper';

export class Gantt {
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
  editorManager: EditManeger;
  // internalProps: IBaseTableProtected;

  headerStyleCache: any;
  bodyStyleCache: any;
  bodyBottomStyleCache: any;
  listTableInstance: ListTable;

  canvas: HTMLCanvasElement;
  element: HTMLElement;
  context: CanvasRenderingContext2D;
  theme: ITableThemeDefine;
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
  constructor(container: HTMLElement, options?: GanttConstructorOptions) {
    this.options = options;
    this.theme = options.theme ?? themes.DEFAULT;
    this.headerRowHeight = options?.defaultHeaderRowHeight ?? 40;
    this.rowHeight = options?.defaultRowHeight ?? 40;
    this.timelineColWidth = options?.timelineColWidth ?? 60;
    this._orderScales();
    this._generateTimeLineDateMap();
    this.headerLevel = this.orderedScales.length;
    this.element = createRootElement({ top: 0, right: 0, left: 0, bottom: 0 }, 'vtable-gantt');
    this.element.style.top = '0px';
    this.element.style.left = this.options.infoTableWidth ? `${this.options.infoTableWidth}px` : '0px';
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
    this.listTableInstance = new ListTable(container, listTableOption);
    this.itemCount = this.listTableInstance.rowCount - this.listTableInstance.columnHeaderLevelCount;
    this.drawHeight = this.listTableInstance.getDrawRange().height;
    this.headerHeight = this.headerRowHeight * this.headerLevel;
    this.gridHeight = this.drawHeight - this.headerHeight;
    this.eventManager = new EventManager(this);
    this.stateManager = new StateManager(this);
    this.scenegraph = new Scenegraph(this);
    this.scenegraph.afterCreateSceneGraph();
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

    this.tableNoFrameWidth = widthP - (this.options.infoTableWidth as number);
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
      if (key === 'infoTableColumns') {
        listTable_options.columns = this.options.infoTableColumns;
        // debugger;
        // const cols = generateGanttChartColumns(this.options.timelineScales, this.options.minDate, this.options.maxDate);
      } else if (key !== 'timelineScales' && key !== 'barStyle') {
        listTable_options[key] = this.options[key];
      }
    }
    listTable_options.canvasWidth = this.options.infoTableWidth as number;
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
    const startDate = new Date(this.options.minDate);
    const endDate = new Date(this.options.maxDate);
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
          Math.abs(new Date(this.options.maxDate).getTime() - new Date(this.options.minDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ) +
          1) +
      <number>this.options.infoTableWidth
    );
  }

  getFrozenRowsHeight() {
    return this.headerRowHeight * this.headerLevel;
  }
}
