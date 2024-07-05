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
import type { Scenegraph } from './scenegraph/scenegraph';
import type { StateManager } from './state/state';
import { Env } from './tools/env';
import { extend } from './tools/helper';
import type { GanttConstructorOptions, ListTableConstructorOptions } from './ts-types';
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
  internalProps: IBaseTableProtected;

  headerStyleCache: any;
  bodyStyleCache: any;
  bodyBottomStyleCache: any;
  listTableInstance: ListTable;
  constructor(container: HTMLElement, options?: GanttConstructorOptions) {
    this.options = options;
    const listTableOption = this.generateListTableOptions();
    this.listTableInstance = new ListTable(container, listTableOption);
    // if (Env.mode === 'node') {
    //   options = container as GanttConstructorOptions;
    //   container = null;
    // } else if (!(container instanceof HTMLElement)) {
    //   options = container as GanttConstructorOptions;
    //   if ((container as GanttConstructorOptions).container) {
    //     container = (container as GanttConstructorOptions).container;
    //   } else {
    //     container = null;
    //   }
    // }
    // const {
    //   defaultRowHeight = 40,
    //   defaultHeaderRowHeight,
    //   defaultColWidth = 80,
    //   defaultHeaderColWidth,

    //   rowSeriesNumber,

    //   dragHeader,

    //   overscrollBehavior
    // } = options;
    // this.container = container as HTMLElement;
    // this.options = options;

    // this.tableNoFrameWidth = 0;
    // this.tableNoFrameHeight = 0;

    // const internalProps = (this.internalProps = {} as IBaseTableProtected);

    // if (Env.mode !== 'node') {
    //   const padding = { top: 0, right: 0, left: 0, bottom: 0 };
    //   internalProps.element = createRootElement(padding);
    //   internalProps.canvas = document.createElement('canvas');
    //   internalProps.element.appendChild(internalProps.canvas);
    //   internalProps.context = internalProps.canvas.getContext('2d')!;
    // }

    // internalProps.handler = new EventHandler();

    // internalProps.defaultRowHeight = defaultRowHeight;
    // internalProps.defaultHeaderRowHeight = defaultHeaderRowHeight ?? defaultRowHeight; // defaultHeaderRowHeight没有设置取defaultRowHeight

    // internalProps.defaultColWidth = defaultColWidth;
    // internalProps.defaultHeaderColWidth = defaultHeaderColWidth ?? defaultColWidth;

    // internalProps.rowSeriesNumber = rowSeriesNumber;
    // // internalProps.columnSeriesNumber = columnSeriesNumber;
    // internalProps.overscrollBehavior = overscrollBehavior ?? 'auto';
    // internalProps._rowHeightsMap = new NumberRangeMap(this as any);
    // internalProps._rowRangeHeightsMap = new Map();
    // internalProps._colRangeWidthsMap = new Map();
    // internalProps._widthResizedColMap = new Set();
    // internalProps._heightResizedRowMap = new Set();

    // internalProps._colWidthsMap = new NumberMap();

    // // internalProps.calcWidthContext = {
    // //   _: internalProps,
    // //   get full(): number {
    // //     if (Env.mode === 'node') {
    // //       return canvasWidth / (pixelRatio ?? 1);
    // //     }
    // //     return this._.canvas.width / ((this._.context as any).pixelRatio ?? window.devicePixelRatio);
    // //   }
    // //   // get em(): number {
    // //   //   return getFontSize(this._.context, this._.theme.font).width;
    // //   // }
    // // };

    // internalProps.cellTextOverflows = {};
    // internalProps.focusedTable = false;
    // internalProps.theme = themes.of(options.theme ?? themes.DEFAULT); //原来在listTable文件中

    // if (container) {
    //   (container as HTMLElement).appendChild(internalProps.element);
    //   // this._updateSize();
    // } else {
    //   // this._updateSize();
    // }

    // this.options = options;

    // internalProps.bodyHelper = new BodyHelper(this as any);
    // internalProps.headerHelper = new HeaderHelper(this as any);
    // internalProps.rowSeriesNumberHelper = new RowSeriesNumberHelper(this as any);

    // this.scenegraph = new Scenegraph(this as any);
    // this.stateManager = new StateManager(this as any);
    // this.eventManager = new EventManager(this as any);

    // this.headerStyleCache = new Map();
    // this.bodyStyleCache = new Map();
    // this.bodyBottomStyleCache = new Map();

    // internalProps.stick = { changedCells: new Map() };

    // this.internalProps.headerHelper.setTableColumnsEditor();

    // if (Env.mode !== 'node') {
    //   this.editorManager = new EditManeger(this as any);
    // }
    // this.refreshHeader();
    // this.internalProps.useOneRowHeightFillAll = false;

    // if (options.dataSource) {
    //   _setDataSource(this, options.dataSource);
    // } else if (options.records) {
    //   this.setRecords(options.records as any, { sortState: internalProps.sortState });
    // } else {
    //   this.setRecords([]);
    // }
    // if (options.title) {
    //   internalProps.title = new Title(options.title, this);
    //   this.scenegraph.resize();
    // }
    // if (this.options.emptyTip) {
    //   if (this.internalProps.emptyTip) {
    //     this.internalProps.emptyTip.resetVisible();
    //   } else {
    //     this.internalProps.emptyTip = new EmptyTip(this.options.emptyTip, this);
    //     this.internalProps.emptyTip.resetVisible();
    //   }
    // }
    // //为了确保用户监听得到这个事件 这里做了异步 确保vtable实例已经初始化完成
    // setTimeout(() => {
    //   this.fireListeners(TABLE_EVENT_TYPE.INITIALIZED, null);
    // }, 0);
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

    return listTable_options;
  }
}
