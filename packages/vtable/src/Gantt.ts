import type { EventManager } from './event/event';
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
import type { StateManager } from './state/state';
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
import { generateGanttChartColumns } from './gantt-helper';

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
  constructor(container: HTMLElement, options?: GanttConstructorOptions) {
    this.options = options;
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

    this.scenegraph = new Scenegraph(this);
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
      if (key !== 'scales' && key !== 'barStyle') {
        listTable_options[key] = this.options[key];
      } else if (key === 'scales') {
        // debugger;
        const cols = generateGanttChartColumns(this.options.scales, this.options.minDate, this.options.maxDate);
      }
    }
    listTable_options.canvasWidth = this.options.infoTableWidth as number;
    listTable_options.canvasHeight = this.canvasHeight ?? this.tableNoFrameHeight;
    listTable_options.clearDOM = false;
    return listTable_options;
  }

  /**
   * 获取表格创建的DOM根节点
   */
  getElement(): HTMLElement {
    return this.element;
  }
}
