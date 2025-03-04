import * as columnStyleContents from '../body-helper/style';
import * as headerStyleContents from '../header-helper/style';
import { importStyle } from './style';
import * as style from '../tools/style';
import {
  type CellAddress,
  type CellRange,
  type TableEventHandlersEventArgumentMap,
  type TableEventHandlersReturnMap,
  type TableKeyboardOptions,
  type DropDownMenuHighlightInfo,
  type MenuListItem,
  type WidthModeDef,
  type ICustomRender,
  type ICellHeaderPaths,
  type HeaderData,
  type FullExtendStyle,
  type FieldDef,
  type ColumnTypeOption,
  type SortState,
  type IPagination,
  type ICustomLayout,
  type CellInfo,
  type CellStyle,
  type MenuInstanceType,
  type DropDownMenuOptions,
  type FieldFormat,
  type FieldData,
  type MaybePromiseOrUndefined,
  type MousePointerCellEvent,
  type DropDownMenuEventInfo,
  type HierarchyState,
  type FieldKeyDef,
  type CellLocation,
  type LayoutObjectId,
  type HeightModeDef,
  type ITableThemeDefine,
  InteractionState,
  Placement
} from '../ts-types';
import type {
  AnyFunction,
  CellAddressWithBound,
  ColorPropertyDefine,
  ColumnIconOption,
  ColumnSeriesNumber,
  IRowSeriesNumber,
  ColumnStyleOption,
  MappingRule,
  TableEventOptions,
  WidthAdaptiveModeDef,
  HeightAdaptiveModeDef,
  ListTableAPI,
  ColumnInfo,
  RowInfo,
  ListTableConstructorOptions
} from '../ts-types';
import { event, style as utilStyle } from '../tools/helper';

import { TABLE_EVENT_TYPE } from './TABLE_EVENT_TYPE';
import { EventHandler } from '../event/EventHandler';
import { EventTarget } from '../event/EventTarget';
import { NumberMap } from '../tools/NumberMap';
import { Rect } from '../tools/Rect';
import type { TableTheme } from '../themes/theme';
import { throttle2 } from '../tools/util';
import themes from '../themes';
import { Env } from '../tools/env';
import { Scenegraph } from '../scenegraph/scenegraph';
import { StateManager } from '../state/state';
import { EventManager } from '../event/event';
import { BodyHelper } from '../body-helper/body-helper';
import { HeaderHelper } from '../header-helper/header-helper';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { ITooltipHandler } from '../components/tooltip/TooltipHandler';
import type { CachedDataSource, DataSource } from '../data';
import type { IBoundsLike } from '@visactor/vutils';
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
import { measureTextBounds, textMeasure } from '../scenegraph/utils/text-measure';
import { getProp } from '../scenegraph/utils/get-prop';
import type {
  ColumnData,
  ColumnDefine,
  ColumnsDefine,
  ImageColumnDefine,
  IndicatorData,
  SeriesNumberColumnData
} from '../ts-types/list-table/layout-map/api';
import type { TooltipOptions } from '../ts-types/tooltip';
import { IconCache } from '../plugins/icons';
import {
  _applyColWidthLimits,
  _getScrollableVisibleRect,
  _setDataSource,
  _setRecords,
  _toPxWidth,
  checkHasColumnAutoWidth,
  createRootElement,
  getStyleTheme,
  updateRootElementPadding
} from './tableHelper';
import type { IMenuHandler } from '../components/menu/dom/MenuHandler';
import type {
  BaseTableAPI,
  BaseTableConstructorOptions,
  IBaseTableProtected,
  PivotTableProtected
} from '../ts-types/base-table';
import { FocusInput } from './FouseInput';
import { defaultPixelRatio } from '../tools/pixel-ratio';
import type { CreateLegend } from '../components/legend/create-legend';
import type { DataSet } from '@visactor/vdataset';
import { Title } from '../components/title/title';
import type { Chart } from '../scenegraph/graphic/chart';
import { setBatchRenderChartCount } from '../scenegraph/graphic/contributions/chart-render-helper';
import { isLeftOrRightAxis, isTopOrBottomAxis } from '../layout/chart-helper/get-axis-config';
import { NumberRangeMap } from '../layout/row-height-map';
import { ListTable } from '../ListTable';
import type { SimpleHeaderLayoutMap } from '../layout';
import { RowSeriesNumberHelper } from './row-series-number-helper';
import { hideCellSelectBorder, restoreCellSelectBorder } from '../scenegraph/select/update-select-border';
import type { ITextGraphicAttribute } from '@src/vrender';
import { ReactCustomLayout } from '../components/react/react-custom-layout';
import type { ISortedMapItem } from '../data/DataSource';
import { hasAutoImageColumn } from '../layout/layout-helper';
import { Factory } from './factory';
import {
  getCellAt,
  getCellAtRelativePosition,
  getColAt,
  getRowAt,
  getTargetColAt,
  getTargetColAtConsiderRightFrozen,
  getTargetRowAt,
  getTargetRowAtConsiderBottomFrozen
} from './utils/get-cell-position';
import { getCellStyle } from './style-helper';
import type { EditManager } from '../edit/edit-manager';
import { createReactContainer } from '../scenegraph/layout/frozen-react';
import { setIconColor } from '../icons';
import { TableAnimationManager } from './animation';
import type { ITableAnimationOption } from '../ts-types/animation/appear';
import { checkCellInSelect } from '../state/common/check-in-select';
import type { CustomCellStylePlugin, ICustomCellStylePlugin } from '../plugins/custom-cell-style';
import { isCellDisableSelect } from '../state/select/is-cell-select-highlight';
import { getCustomMergeCellFunc } from './utils/get-custom-merge-cell-func';
import { vglobal } from '@src/vrender';

const { toBoxArray } = utilStyle;
const { isTouchEvent } = event;
const rangeReg = /^\$(\d+)\$(\d+)$/;
importStyle();

export abstract class BaseTable extends EventTarget implements BaseTableAPI {
  internalProps: IBaseTableProtected;
  showFrozenIcon = true;
  padding: { top: number; left: number; right: number; bottom: number };
  globalDropDownMenu?: MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[]);
  //画布绘制单元格的区域 不包括整体边框frame，所以比canvas的width和height要小一点（canvas的width包括了frame）
  tableNoFrameWidth: number;
  tableNoFrameHeight: number;
  tableX: number;
  tableY: number;
  _widthMode: WidthModeDef;
  _heightMode: HeightModeDef;
  _autoFillWidth: boolean;
  _autoFillHeight: boolean;
  _widthAdaptiveMode: WidthAdaptiveModeDef;
  _heightAdaptiveMode: HeightAdaptiveModeDef;
  customRender?: ICustomRender;

  canvasWidth?: number;
  canvasHeight?: number;

  _vDataSet?: DataSet;
  scenegraph: Scenegraph;
  stateManager: StateManager;
  eventManager: EventManager;
  editorManager: EditManager;
  animationManager: TableAnimationManager;
  _pixelRatio: number;

  // bottomFrozenRowCount: number = 0;
  // rightFrozenColCount: number = 0;
  /** 是否设置了canvas的宽高 */
  canvasSizeSeted?: boolean;
  static get EVENT_TYPE(): typeof TABLE_EVENT_TYPE {
    return TABLE_EVENT_TYPE;
  }
  /**
   * 用户配置的options 只读 勿直接修改
   */
  readonly options: BaseTableConstructorOptions;

  version = __VERSION__;

  pagination?: IPagination | undefined;

  /**
   * constructor
   *
   * @constructor
   * @param options Constructor options
   */
  // eslint-disable-next-line default-param-last
  id = `VTable${Date.now()}`;

  headerStyleCache: Map<string, any>;
  bodyStyleCache: Map<string, any>;
  bodyMergeTitleCache: Map<string, any>;
  bodyBottomStyleCache: Map<string, any>;
  container: HTMLElement;
  isReleased: boolean = false;
  _chartEventMap: Record<string, { query?: any; callback: AnyFunction }[]> = {};

  customCellStylePlugin?: CustomCellStylePlugin;

  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';

  reactCustomLayout?: ReactCustomLayout;
  _hasAutoImageColumn?: boolean;

  constructor(container: HTMLElement, options: BaseTableConstructorOptions = {}) {
    super();
    if (!container && options.mode !== 'node' && !options.canvas) {
      throw new Error("vtable's container is undefined");
    }

    // for image anonymous
    if (options.customConfig?.imageAnonymous === false) {
      vglobal.isImageAnonymous = false;
    }

    const {
      // rowCount = 0,
      // colCount = 0,
      frozenColCount = 0,
      unfreezeAllOnExceedsMaxWidth,
      frozenRowCount,
      defaultRowHeight = 40,
      defaultHeaderRowHeight,
      defaultColWidth = 80,
      defaultHeaderColWidth,
      widthMode = 'standard',
      heightMode = 'standard',
      autoFillWidth = false,
      autoFillHeight = false,
      widthAdaptiveMode = 'only-body',
      heightAdaptiveMode = 'only-body',
      keyboardOptions,
      eventOptions,
      rowSeriesNumber,
      // columnSeriesNumber,
      // disableRowHeaderColumnResize,
      columnResizeMode,
      rowResizeMode = 'none',
      resize,
      dragHeaderMode,
      // showHeader,
      // scrollBar,
      showFrozenIcon,
      allowFrozenColCount,
      padding,
      hover,
      menu,
      select: click,
      customRender,
      pixelRatio = defaultPixelRatio,
      renderChartAsync,
      renderChartAsyncBatchCount,

      mode,
      modeParams,
      canvasWidth,
      canvasHeight,
      overscrollBehavior,
      limitMinWidth,
      limitMinHeight,
      clearDOM = true
    } = options;
    this.container = container;
    this.options = options;
    this._widthMode = widthMode;
    this._heightMode = heightMode;
    this._widthAdaptiveMode = widthAdaptiveMode;
    this._heightAdaptiveMode = heightAdaptiveMode;
    this._autoFillWidth = autoFillWidth;
    this._autoFillHeight = autoFillHeight;
    this.customRender = customRender;
    this.padding = { top: 0, right: 0, left: 0, bottom: 0 };
    if (padding) {
      if (typeof padding === 'number') {
        this.padding.top = padding;
        this.padding.left = padding;
        this.padding.bottom = padding;
        this.padding.right = padding;
      } else {
        padding.top && (this.padding.top = padding.top);
        padding.bottom && (this.padding.bottom = padding.bottom);
        padding.left && (this.padding.left = padding.left);
        padding.right && (this.padding.right = padding.right);
      }
    }
    if (isValid(canvasHeight) && isValid(canvasWidth)) {
      this.canvasSizeSeted = true;
    }
    this.tableNoFrameWidth = 0;
    this.tableNoFrameHeight = 0;
    this.canvasWidth = isNumber(canvasWidth) ? canvasWidth : undefined;
    this.canvasHeight = isNumber(canvasHeight) ? canvasHeight : undefined;

    this.columnWidthComputeMode = options.columnWidthComputeMode ?? 'normal';

    const internalProps = (this.internalProps = {} as IBaseTableProtected);
    // style.initDocument(scrollBar);
    // showHeader !== undefined && (this.showHeader = showHeader);
    // scrollBar !== undefined && (this.scrollBar = scrollBar);
    showFrozenIcon !== undefined && (this.showFrozenIcon = showFrozenIcon);
    if (typeof allowFrozenColCount === 'number' && allowFrozenColCount <= 0) {
      this.showFrozenIcon = false;
    }
    //设置是否自动撑开的配置
    // internalProps.autoRowHeight = options.autoRowHeight ?? false;

    if (this.options.canvas) {
      if (Env.mode !== 'node') {
        internalProps.element = this.options.canvas.parentElement;
        internalProps.element.style.position = 'relative';
      }
      internalProps.focusControl = new FocusInput(this, internalProps.element);
      internalProps.canvas = this.options.canvas;
      internalProps.context = internalProps.canvas.getContext('2d')!;
    } else if (Env.mode !== 'node') {
      internalProps.element = createRootElement(this.padding);
      internalProps.focusControl = new FocusInput(this, internalProps.element);
      internalProps.canvas = document.createElement('canvas');
      internalProps.element.appendChild(internalProps.canvas);
      internalProps.context = internalProps.canvas.getContext('2d')!;

      if (options.customConfig?.createReactContainer) {
        createReactContainer(this);
      }
    }

    internalProps.handler = new EventHandler();
    if (isNumber(this.options.resizeTime)) {
      internalProps.handler.resizeTime = this.options.resizeTime;
    }

    internalProps.pixelRatio = pixelRatio;
    internalProps.frozenColCount = frozenColCount;
    internalProps.frozenRowCount = frozenRowCount;
    internalProps.unfreezeAllOnExceedsMaxWidth = unfreezeAllOnExceedsMaxWidth ?? true;

    internalProps.defaultRowHeight = defaultRowHeight;
    internalProps.defaultHeaderRowHeight = defaultHeaderRowHeight ?? defaultRowHeight; // defaultHeaderRowHeight没有设置取defaultRowHeight

    internalProps.defaultColWidth = defaultColWidth;
    internalProps.defaultHeaderColWidth = defaultHeaderColWidth ?? defaultColWidth;

    internalProps.keyboardOptions = keyboardOptions;
    internalProps.eventOptions = eventOptions;
    internalProps.rowSeriesNumber = rowSeriesNumber;
    // internalProps.columnSeriesNumber = columnSeriesNumber;

    internalProps.columnResizeMode = resize?.columnResizeMode ?? columnResizeMode;
    internalProps.rowResizeMode = resize?.rowResizeMode ?? rowResizeMode;
    internalProps.dragHeaderMode = dragHeaderMode ?? 'none';
    internalProps.renderChartAsync = renderChartAsync;
    setBatchRenderChartCount(renderChartAsyncBatchCount);
    internalProps.overscrollBehavior = overscrollBehavior ?? 'auto';
    internalProps._rowHeightsMap = new NumberRangeMap(this);
    internalProps._rowRangeHeightsMap = new Map();
    internalProps._colRangeWidthsMap = new Map();
    internalProps._widthResizedColMap = new Set();
    internalProps._heightResizedRowMap = new Set();

    this.colWidthsMap = new NumberMap();
    this.colContentWidthsMap = new NumberMap();
    this.colWidthsLimit = {};

    const that = this;
    internalProps.calcWidthContext = {
      _: internalProps,
      get full(): number {
        if (Env.mode === 'node') {
          return that.canvasWidth / (pixelRatio ?? 1);
        }
        return this._.canvas.width / ((this._.context as any).pixelRatio ?? window.devicePixelRatio);
      }
      // get em(): number {
      //   return getFontSize(this._.context, this._.theme.font).width;
      // }
    };

    internalProps.cellTextOverflows = {};
    internalProps.focusedTable = false;
    internalProps.theme = themes.of(options.theme ?? themes.DEFAULT); //原来在listTable文件中
    internalProps.theme.isPivot = this.isPivotTable();
    setIconColor(internalProps.theme.functionalIconsStyle);
    if (container) {
      // 先清空
      if (clearDOM) {
        container.innerHTML = '';
      }
      container.appendChild(internalProps.element);
      this._updateSize();
    } else {
      this._updateSize();
    }

    // this.options = options;
    // internalProps.theme = themes.of(options.theme ?? themes.DEFAULT);
    // internalProps.theme.isPivot = this.isPivotTable();
    internalProps.bodyHelper = new BodyHelper(this);
    internalProps.headerHelper = new HeaderHelper(this);
    internalProps.rowSeriesNumberHelper = new RowSeriesNumberHelper(this);

    internalProps.autoWrapText = options.autoWrapText;
    internalProps.enableLineBreak = options.enableLineBreak;

    internalProps.allowFrozenColCount = options.allowFrozenColCount ?? 0;
    internalProps.limitMaxAutoWidth = options.limitMaxAutoWidth ?? 450;
    internalProps.limitMinWidth =
      limitMinWidth !== null && limitMinWidth !== undefined
        ? typeof limitMinWidth === 'number'
          ? limitMinWidth
          : limitMinWidth
          ? 10
          : 0
        : 10;
    internalProps.limitMinHeight =
      limitMinHeight !== null && limitMinHeight !== undefined
        ? typeof limitMinHeight === 'number'
          ? limitMinHeight
          : limitMinHeight
          ? 10
          : 0
        : 10;
    // 生成scenegraph
    // this._vDataSet = new DataSet();
    this.scenegraph = new Scenegraph(this);
    this.stateManager = new StateManager(this);
    this.eventManager = new EventManager(this);
    this.animationManager = new TableAnimationManager(this);

    if (options.legends) {
      internalProps.legends = [];
      const createLegend = Factory.getFunction('createLegend') as CreateLegend;
      if (Array.isArray(options.legends)) {
        for (let i = 0; i < options.legends.length; i++) {
          internalProps.legends.push(createLegend(options.legends[i], this));
        }
        this.scenegraph.tableGroup.setAttributes({
          x: this.tableX,
          y: this.tableY
        });
      } else {
        internalProps.legends.push(createLegend(options.legends, this));
        this.scenegraph.tableGroup.setAttributes({
          x: this.tableX,
          y: this.tableY
        });
      }
    }

    //原有的toolTip提示框处理，主要在文字绘制不全的时候 出来全文本提示信息 需要加个字段设置是否有效
    internalProps.tooltip = Object.assign(
      {
        parentElement: this.getElement(),
        renderMode: 'html',
        isShowOverflowTextTooltip: false,
        confine: true,
        position: Placement.bottom
      },
      options.tooltip
    );
    if (internalProps.tooltip.renderMode === 'html') {
      const TooltipHandler = Factory.getComponent('tooltipHandler') as ITooltipHandler;
      TooltipHandler && (internalProps.tooltipHandler = new TooltipHandler(this, internalProps.tooltip.confine));
    }
    internalProps.menu = Object.assign(
      {
        renderMode: 'html'
      },
      options.menu
    );
    Array.isArray(options.menu?.dropDownMenuHighlight) &&
      this.setDropDownMenuHighlight(options.menu?.dropDownMenuHighlight);

    // 全局下拉菜单
    (Array.isArray(options.menu?.defaultHeaderMenuItems) ||
      typeof options.menu?.defaultHeaderMenuItems === 'function') &&
      (this.globalDropDownMenu = options.menu.defaultHeaderMenuItems);

    if (internalProps.menu.renderMode === 'html') {
      const MenuHandler = Factory.getComponent('menuHandler') as IMenuHandler;
      internalProps.menuHandler = new MenuHandler(this);
    }

    this.headerStyleCache = new Map();
    this.bodyStyleCache = new Map();
    this.bodyMergeTitleCache = new Map();
    this.bodyBottomStyleCache = new Map();

    internalProps.stick = { changedCells: new Map() };

    internalProps.customMergeCell = getCustomMergeCellFunc(options.customMergeCell);

    const CustomCellStylePlugin = Factory.getComponent('customCellStylePlugin') as ICustomCellStylePlugin;
    if (CustomCellStylePlugin) {
      this.customCellStylePlugin = new CustomCellStylePlugin(
        this,
        options.customCellStyle ?? [],
        options.customCellStyleArrangement ?? []
      );
    }
    this._adjustCanvasSizeByOption();
  }
  _adjustCanvasSizeByOption() {
    // 等宽高都进行了内部计算，判断如果配置了内容自动撑开表格，需要在这里赋值canvasWidth 和 canvasHeight
    if (this.options.canvasHeight === 'auto' || this.options.canvasWidth === 'auto') {
      setTimeout(() => {
        let canvasWidth;
        let canvasHeight;
        if (this.options.canvasHeight === 'auto') {
          let borderWidth = 0;
          if (this.theme.frameStyle?.innerBorder) {
            const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
            borderWidth += shadowWidths[1] ?? 0;
          } else if (this.theme.frameStyle) {
            const lineWidths = toBoxArray(this.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
            const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
            borderWidth +=
              (lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0) + ((lineWidths[2] ?? 0) + (shadowWidths[2] ?? 0));
          }
          canvasHeight =
            Math.min(
              this.options.maxCanvasHeight ? this.options.maxCanvasHeight - borderWidth : 20000,
              this.getAllRowsHeight()
            ) + borderWidth;
        } else {
          canvasHeight = this.canvasHeight;
        }
        if (this.options.canvasWidth === 'auto') {
          let borderWidth = 0;
          if (this.theme.frameStyle?.innerBorder) {
            const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
            borderWidth += shadowWidths[2] ?? 0;
          } else if (this.theme.frameStyle) {
            const lineWidths = toBoxArray(this.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
            const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
            borderWidth +=
              (lineWidths[1] ?? 0) + (shadowWidths[1] ?? 0) + ((lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0));
          }
          canvasWidth =
            Math.min(
              this.options.maxCanvasWidth ? this.options.maxCanvasWidth - borderWidth : 20000,
              this.getAllColsWidth()
            ) + borderWidth;
        } else {
          canvasWidth = this.canvasWidth;
        }

        this.setCanvasSize(canvasWidth, canvasHeight);
      }, 0);
    }
  }
  /** 节流绘制 */
  throttleInvalidate = throttle2(this.render.bind(this), 200);
  /**
   * Get table container.
   * @returns {HTMLElement} table container
   */
  getContainer(): HTMLElement {
    return this.container;
  }
  /**
   * 获取表格创建的DOM根节点
   */
  getElement(): HTMLElement {
    return this.internalProps.element;
  }
  /**
   * 获取canvas
   */
  get canvas(): HTMLCanvasElement {
    return this.internalProps.canvas;
  }
  setCanvasSize(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.options.canvasHeight = canvasHeight;
    this.options.canvasWidth = canvasWidth;
    this.resize();
  }
  resize() {
    this._updateSize();
    this.internalProps.legends?.forEach(legend => {
      legend?.resize();
    });
    if (this.internalProps.title) {
      this.internalProps.title.resize();
    }
    if (this.internalProps.emptyTip) {
      this.internalProps.emptyTip.resize();
    }
    // this.stateManager.checkFrozen();
    this.scenegraph.resize();
  }

  /**
   * Get the number of rows.
   */
  get rowCount(): number {
    return this.internalProps.rowCount;
  }
  /**
   * Set the number of rows.
   */
  set rowCount(rowCount: number) {
    this.internalProps.rowCount = rowCount;
  }
  /**
   * Get the number of columns.
   */
  get colCount(): number {
    return this.internalProps.colCount ?? 0;
  }
  /**
   * Set the number of columns.
   */
  set colCount(colCount: number) {
    this.internalProps.colCount = colCount;
  }
  /**
   * 注意 这个值和options.frozenColCount 不一样！options.frozenColCount是用户实际设置的; 这里获取的值是调整过:frozen的列过宽时 frozeCount为0
   */
  get frozenColCount(): number {
    return this.internalProps?.layoutMap?.frozenColCount ?? this.internalProps?.frozenColCount ?? 0;
  }
  /**
   * Set the number of frozen columns.
   */
  set frozenColCount(frozenColCount: number) {
    // 此情况将frozenColCount设为0（显示效果一致）
    if (frozenColCount >= this.colCount) {
      frozenColCount = 0;
    }
    // const oldFrozenColCount = this.internalProps.frozenColCount;
    this.internalProps.frozenColCount = frozenColCount;
    this.options.frozenColCount = frozenColCount;

    // 纠正frozenColCount的值;
    const maxFrozenWidth = this._getMaxFrozenWidth();
    // if (this.tableNoFrameWidth - this.getColsWidth(0, frozenColCount - 1) <= 120) {
    if (this.getColsWidth(0, frozenColCount - 1) > maxFrozenWidth) {
      if (this.internalProps.unfreezeAllOnExceedsMaxWidth) {
        this.internalProps.frozenColCount = 0;
      } else {
        const computedFrozenColCount = this._getComputedFrozenColCount(frozenColCount);
        this.internalProps.frozenColCount = computedFrozenColCount;
      }
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
  }
  /** 设置冻结的行数 */
  setFrozenColCount(frozenColCount: number) {
    if (frozenColCount >= this.colCount) {
      frozenColCount = 0;
    }
    // const oldFrozenColCount = this.internalProps.frozenColCount;
    this.internalProps.frozenColCount = frozenColCount;
    this.options.frozenColCount = frozenColCount;
    //纠正frozenColCount的值
    const maxFrozenWidth = this._getMaxFrozenWidth();
    // if (this.tableNoFrameWidth - this.getColsWidth(0, frozenColCount - 1) <= 120) {
    if (this.getColsWidth(0, frozenColCount - 1) > maxFrozenWidth) {
      if (this.internalProps.unfreezeAllOnExceedsMaxWidth) {
        this.internalProps.frozenColCount = 0;
      } else {
        const computedFrozenColCount = this._getComputedFrozenColCount(frozenColCount);
        this.internalProps.frozenColCount = computedFrozenColCount;
      }
    }

    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
  }
  /**
   * 和setFrozenColCount一样的逻辑 但保留options.frozenColCount不赋新值
   * 当冻结列的宽度过宽时调用该函数
   */
  _setFrozenColCount(frozenColCount: number) {
    // 此情况将frozenColCount设为0（显示效果一致）
    if (frozenColCount >= this.colCount) {
      frozenColCount = 0;
    }
    this.internalProps.frozenColCount = frozenColCount;
  }
  /**
   * 计算完前置状态后 重新计算判断列宽是否过大
   */
  _resetFrozenColCount() {
    if (this.options.frozenColCount) {
      if (this.tableNoFrameWidth - this.getColsWidth(0, this.options.frozenColCount - 1) <= 120) {
        this._setFrozenColCount(0);
      } else if (this.frozenColCount !== this.options.frozenColCount) {
        this._setFrozenColCount(this.options.frozenColCount); //frozenColCount从0恢复到原有的frozenColCount
      }
    }
  }
  /**
   * Get the number of frozen rows.
   */
  get frozenRowCount(): number {
    return this.internalProps?.layoutMap?.frozenRowCount ?? this.internalProps?.frozenRowCount ?? 0;
  }
  /**
   * Set the number of frozen rows.
   */
  set frozenRowCount(frozenRowCount: number) {
    this.internalProps.frozenRowCount = frozenRowCount;
    this.stateManager.setFrozenRow(this.internalProps.frozenRowCount);
  }

  get rightFrozenColCount(): number {
    return this.internalProps?.layoutMap?.rightFrozenColCount ?? this.internalProps?.rightFrozenColCount ?? 0;
  }

  set rightFrozenColCount(rightFrozenColCount: number) {
    this.scenegraph.dealWidthRightFrozen(rightFrozenColCount);
  }

  get bottomFrozenRowCount(): number {
    return this.internalProps?.layoutMap?.bottomFrozenRowCount ?? this.internalProps?.bottomFrozenRowCount ?? 0;
  }

  set bottomFrozenRowCount(bottomFrozenRowCount: number) {
    this.scenegraph.dealWidthBottomFrozen(bottomFrozenRowCount);
  }

  /**
   * Get the default row height.
   *
   */
  get defaultRowHeight(): number {
    if (isNumber(this.internalProps.defaultRowHeight)) {
      return this.internalProps.defaultRowHeight as number;
    }
    return 40;
  }
  /**
   * Set the default row height.
   */
  set defaultRowHeight(defaultRowHeight: number | 'auto') {
    this.internalProps.defaultRowHeight = defaultRowHeight;
    this.options.defaultRowHeight = defaultRowHeight;
  }
  /**
   * Get the default row height.
   *
   */
  get defaultHeaderRowHeight(): (number | 'auto') | (number | 'auto')[] {
    return this.internalProps.defaultHeaderRowHeight;
  }
  /**
   * Set the default row height.
   */
  set defaultHeaderRowHeight(defaultHeaderRowHeight: (number | 'auto') | (number | 'auto')[]) {
    this.internalProps.defaultHeaderRowHeight = defaultHeaderRowHeight;
    this.options.defaultHeaderRowHeight = defaultHeaderRowHeight;
  }
  /**
   * Get the default column width.
   */
  get defaultColWidth(): number {
    return this.internalProps.defaultColWidth;
  }
  /**
   * Set the default column width.
   */
  set defaultColWidth(defaultColWidth: number) {
    this.internalProps.defaultColWidth = defaultColWidth;
    this.options.defaultColWidth = defaultColWidth;
  }
  /**
   * Get the default column width.
   */
  get defaultHeaderColWidth(): (number | 'auto') | (number | 'auto')[] {
    return this.internalProps.defaultHeaderColWidth;
  }
  /**
   * Set the default column width.
   */
  set defaultHeaderColWidth(defaultHeaderColWidth: (number | 'auto') | (number | 'auto')[]) {
    this.internalProps.defaultHeaderColWidth = defaultHeaderColWidth;
    this.options.defaultHeaderColWidth = defaultHeaderColWidth;
  }
  /**
   * Get the columns width.  但这个可能和看到的宽度不一致 获取某一列的宽度请使用接口 getColWidth(1) 这个接口会根据maxWidth minWidth进行调整
   */
  get colWidthsMap(): NumberMap<string | number> {
    return this.internalProps._colWidthsMap;
  }
  /**
   * Set the columns width.
   */
  set colWidthsMap(colWidthsMap: NumberMap<string | number>) {
    this.internalProps._colWidthsMap = colWidthsMap;
  }
  /**
   * Get every colomn's content width. not care actual column width
   */
  get colContentWidthsMap(): NumberMap<string | number> {
    return this.internalProps._colContentWidthsMap;
  }
  /**
   * Set every colomn's content width.
   */
  set colContentWidthsMap(colContentWidthsMap: NumberMap<string | number>) {
    this.internalProps._colContentWidthsMap = colContentWidthsMap;
  }
  /**
   * Get the range columns width.
   */
  get _colRangeWidthsMap(): Map<string, number> {
    return this.internalProps._colRangeWidthsMap;
  }
  /**
   * Set the range columns width.
   */
  set _colRangeWidthsMap(_colRangeWidthsMap: Map<string, number>) {
    this.internalProps._colRangeWidthsMap = _colRangeWidthsMap;
  }
  /**
   * Get the range rows height.
   */
  get _rowRangeHeightsMap(): Map<string, number> {
    return this.internalProps._rowRangeHeightsMap;
  }
  /**
   * Set the range rows height.
   */
  set _rowRangeHeightsMap(_rowRangeHeightsMap: Map<string, number>) {
    this.internalProps._rowRangeHeightsMap = _rowRangeHeightsMap;
  }
  /**
   * Get the columns width.
   */
  get rowHeightsMap(): NumberRangeMap {
    return this.internalProps._rowHeightsMap;
  }
  /**
   * Set the columns width.
   */
  set rowHeightsMap(rowHeightsMap: NumberRangeMap) {
    this.internalProps._rowHeightsMap = rowHeightsMap;
  }
  /**
   * Get the columns width limit.
   */
  get colWidthsLimit(): {
    //存储各列的宽度限制
    [col: number]: {
      max?: string | number;
      min?: string | number;
    };
  } {
    return this.internalProps._colWidthsLimit;
  }
  /**
   * Set the columns width limit.
   */
  set colWidthsLimit(colWidthsLimit: {
    //存储各列的宽度限制
    [col: number]: {
      max?: string | number;
      min?: string | number;
    };
  }) {
    this.internalProps._colWidthsLimit = colWidthsLimit;
  }
  get keyboardOptions(): TableKeyboardOptions | null {
    return this.internalProps.keyboardOptions ?? null;
  }
  set keyboardOptions(keyboardOptions: TableKeyboardOptions | null) {
    this.internalProps.keyboardOptions = keyboardOptions ?? undefined;
  }
  get eventOptions(): TableEventOptions | null {
    return this.internalProps.eventOptions ?? null;
  }
  set eventOptions(eventOptions: TableEventOptions | null) {
    this.internalProps.eventOptions = eventOptions ?? undefined;
  }

  get widthMode(): WidthModeDef {
    return this._widthMode;
  }
  set widthMode(widthMode: WidthModeDef) {
    if (widthMode !== this._widthMode) {
      this._widthMode = widthMode;
      this.options.widthMode = widthMode;
    }
  }
  get heightMode(): HeightModeDef {
    return this._heightMode;
  }
  set heightMode(heightMode: HeightModeDef) {
    if (heightMode !== this._heightMode) {
      this._heightMode = heightMode;
      this.options.heightMode = heightMode;
    }
  }
  get autoFillWidth(): boolean {
    return this._autoFillWidth;
  }
  set autoFillWidth(autoFillWidth: boolean) {
    if (autoFillWidth !== this._autoFillWidth) {
      this._autoFillWidth = autoFillWidth;
    }
  }
  get autoFillHeight(): boolean {
    return this._autoFillHeight;
  }
  set autoFillHeight(autoFillHeight: boolean) {
    if (autoFillHeight !== this._autoFillHeight) {
      this._autoFillHeight = autoFillHeight;
    }
  }
  get widthAdaptiveMode(): WidthAdaptiveModeDef {
    return this._widthAdaptiveMode;
  }
  set widthAdaptiveMode(widthAdaptiveMode: WidthAdaptiveModeDef) {
    if (widthAdaptiveMode !== this._widthAdaptiveMode) {
      this._widthAdaptiveMode = widthAdaptiveMode;
    }
  }
  get heightAdaptiveMode(): HeightAdaptiveModeDef {
    return this._heightAdaptiveMode;
  }
  set heightAdaptiveMode(heightAdaptiveMode: HeightAdaptiveModeDef) {
    if (heightAdaptiveMode !== this._heightAdaptiveMode) {
      this._heightAdaptiveMode = heightAdaptiveMode;
    }
  }
  /**
   * 根据设置的列宽配置 计算列宽值
   * @param {string|number} width width definition
   * @returns {number} the pixels of width
   */
  _colWidthDefineToPxWidth(width: string | number): number {
    if (width === 'auto') {
      // hack for defaultWidht support 'auto'
      return 0;
    }
    return _toPxWidth(this, width);
  }

  _getMaxFrozenWidth(): number {
    const maxFrozenWidth = this.options.maxFrozenWidth ?? '80%';
    return _toPxWidth(this, maxFrozenWidth);
  }
  _getComputedFrozenColCount(frozenColCount: number): number {
    const maxFrozenWidth = this._getMaxFrozenWidth();
    let computedfrozenColCount = frozenColCount;
    while (this.getColsWidth(0, computedfrozenColCount - 1) > maxFrozenWidth) {
      computedfrozenColCount--;
      if (computedfrozenColCount <= 0) {
        break;
      }
    }
    return computedfrozenColCount;
  }
  /**
   * 获取列宽的最大最小限制
   * @param {number} col number of column
   * @returns {object|null} the column width limits
   * @private
   */
  private _getColWidthLimits(col: number): {
    min?: undefined;
    minDef?: undefined;
    max?: undefined;
    maxDef?: undefined;
  } | null {
    const limit = this.colWidthsLimit[col];
    if (!limit) {
      return null;
    }

    const result: {
      min?: number;
      max?: number;
      minDef?: string | number;
      maxDef?: string | number;
    } = {};

    if (limit.min) {
      result.min = _toPxWidth(this, limit.min);
      result.minDef = limit.min;
    }
    if (limit.max) {
      result.max = _toPxWidth(this, limit.max);
      result.maxDef = limit.max;
    }
    return result as never;
  }

  _adjustColWidth(col: number, orgWidth: number): number {
    const limits = this._getColWidthLimits(col);
    return Math.max(_applyColWidthLimits(limits, orgWidth), 0);
  }
  get pixelRatio(): number {
    return this.internalProps.pixelRatio;
  }
  /**
   * 设置像数比
   * @param pixelRatio
   */
  setPixelRatio(pixelRatio: number) {
    if (pixelRatio !== this.internalProps?.pixelRatio) {
      this.internalProps.pixelRatio = pixelRatio;
      const canvasWidth = this.canvasWidth;
      this.internalProps.calcWidthContext = {
        _: this.internalProps,
        get full(): number {
          if (Env.mode === 'node') {
            return canvasWidth / (pixelRatio ?? 1);
          }
          return this._.canvas.width / ((this._.context as any).pixelRatio ?? window.devicePixelRatio);
        }
      };
      this.scenegraph.setPixelRatio(pixelRatio);
    }
  }

  /**
   * 窗口尺寸发生变化 或者像数比变化
   * @return {void}
   */
  _updateSize(): void {
    //清除样式并获取大小
    const { padding } = this;

    let widthP = 0;
    let heightP = 0;
    this.tableX = 0;
    this.tableY = 0;

    if (this.options.canvas && this.options.viewBox) {
      widthP = this.options.viewBox.x2 - this.options.viewBox.x1;
      heightP = this.options.viewBox.y2 - this.options.viewBox.y1;
      // this.tableX = this.options.viewBox.x1;
      // this.tableY = this.options.viewBox.y1;
      if (this?.scenegraph?.stage) {
        if (this.options.viewBox) {
          (this.scenegraph.stage as any).setViewBox(this.options.viewBox, false);
        } else {
          this.scenegraph.stage.resize(widthP, heightP);
        }
      }
    } else if (Env.mode === 'browser') {
      const element = this.getElement();
      let widthWithoutPadding = 0;
      let heightWithoutPadding = 0;
      if (this.canvasSizeSeted) {
        widthWithoutPadding = this.canvasWidth;
        heightWithoutPadding = this.canvasHeight;
      } else {
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
          widthWithoutPadding = (widthWithoutPadding ?? 1) - (this.options.tableSizeAntiJitter ? 1 : 0);
          heightWithoutPadding = (heightWithoutPadding ?? 1) - (this.options.tableSizeAntiJitter ? 1 : 0);
        }
      }

      element.style.width = (widthWithoutPadding && `${widthWithoutPadding - padding.left - padding.right}px`) || '0px';
      element.style.height =
        (heightWithoutPadding && `${heightWithoutPadding - padding.top - padding.bottom}px`) || '0px';

      const { canvas } = this.internalProps;
      widthP = (canvas.parentElement?.offsetWidth ?? 1) - (this.options.tableSizeAntiJitter ? 1 : 0);
      heightP = (canvas.parentElement?.offsetHeight ?? 1) - (this.options.tableSizeAntiJitter ? 1 : 0);

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

    const width = Math.floor(widthP - style.getVerticalScrollBarSize(this.getTheme().scrollStyle));
    const height = Math.floor(heightP - style.getHorizontalScrollBarSize(this.getTheme().scrollStyle));

    if (this.internalProps.theme?.frameStyle) {
      //考虑表格整体边框的问题
      const lineWidths = toBoxArray(this.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
      const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
      if (this.theme.frameStyle?.innerBorder) {
        this.tableX = 0;
        this.tableY = 0;
        this.tableNoFrameWidth = width - (shadowWidths[1] ?? 0);
        this.tableNoFrameHeight = height - (shadowWidths[2] ?? 0);
      } else {
        this.tableX = (lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0);
        this.tableY = (lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0);
        this.tableNoFrameWidth =
          width - ((lineWidths[1] ?? 0) + (shadowWidths[1] ?? 0)) - ((lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0));
        this.tableNoFrameHeight =
          height - ((lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0)) - ((lineWidths[2] ?? 0) + (shadowWidths[2] ?? 0));
      }
    }
  }

  updateViewBox(newViewBox: IBoundsLike) {
    const oldWidth = this.options?.viewBox.x2 ?? 0 - this.options?.viewBox.x1 ?? 0;
    const oldHeight = this.options?.viewBox.y2 ?? 0 - this.options?.viewBox.y1 ?? 0;
    const newWidth = newViewBox.x2 - newViewBox.x1;
    const newHeight = newViewBox.y2 - newViewBox.y1;
    this.options.viewBox = newViewBox;
    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.resize();
    } else {
      (this.scenegraph.stage as any).setViewBox(this.options.viewBox, true);
    }
  }

  setViewBoxTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this.internalProps.modifiedViewBoxTransform = true;
    this.scenegraph.stage.window.setViewBoxTransform(a, b, c, d, e, f);
  }

  get rowHierarchyType(): 'grid' | 'tree' | 'grid-tree' {
    return 'grid';
  }

  // /**
  //  * Set all column width.
  //  * @param  {number[]} widths The column widths
  //  * @return {void}
  //  */
  // setColWidths(widths: number[]): void {
  //   widths.forEach((value, index) => this.setColWidth(index, value));
  // }
  /**
   * 获取指定列范围的总宽度
   * @param startCol
   * @param endCol
   * @returns
   */
  getColsWidth(startCol: number, endCol: number): number {
    if (startCol > endCol) {
      return 0;
    }
    startCol = Math.max(startCol, 0);
    endCol = Math.min(endCol, (this.colCount ?? Infinity) - 1); // endCol最大为this.colCount - 1，超过会导致width计算为NaN
    //通过缓存获取指定范围列宽
    const cachedColWidth = this._colRangeWidthsMap.get(`$${startCol}$${endCol}`);
    if (cachedColWidth !== null && cachedColWidth !== undefined) {
      return cachedColWidth;
    }

    //特殊处理 先尝试获取startCol->endCol-1的行高
    const cachedLowerColWidth = this._colRangeWidthsMap.get(`$${startCol}$${endCol - 1}`);
    if (cachedLowerColWidth !== null && cachedLowerColWidth !== undefined) {
      // const width = this.colWidthsMap.get(endCol);
      // let adjustW;
      // if (width) {
      //   adjustW =
      //     this.widthMode === 'adaptive' || (this as any).transpose
      //       ? Number(width)
      //       : this._adjustColWidth(endCol, this._colWidthDefineToPxWidth(width));
      // } else {
      // use default column width if no width in colWidthsMap
      const adjustW = this.getColWidth(endCol);
      // }
      const addWidth = cachedLowerColWidth + adjustW;
      // 合法地址存入缓存
      if (startCol >= 0 && endCol >= 0 && !Number.isNaN(addWidth)) {
        this._colRangeWidthsMap.set(`$${startCol}$${endCol}`, Math.round(addWidth));
      }
      return Math.round(addWidth);
    }

    let w = 0;
    for (let col = startCol; col <= endCol; col++) {
      w += this.getColWidth(col);
    }

    // this.colWidthsMap.each(startCol, endCol, (width, col) => {
    //   // adaptive模式下，不受max min配置影响，直接使用width
    //   w +=
    //     (this.widthMode === 'adaptive' || (this as any).transpose
    //       ? Number(width)
    //       : this._adjustColWidth(col, this._colWidthDefineToPxWidth(width))) - this.getColWidth(col);
    // });
    // for (let col = startCol; col <= endCol; col++) {
    //   if (this.colWidthsMap.has(col)) {
    //     continue;
    //   }
    //   const adj = this._adjustColWidth(col, this.internalProps.defaultColWidth as number);
    //   if (adj !== this.internalProps.defaultColWidth) {
    //     w += adj - (this.internalProps.defaultColWidth as number);
    //   }
    // }

    // 合法地址存入缓存
    if (startCol >= 0 && endCol >= 0) {
      this._colRangeWidthsMap.set(`$${startCol}$${endCol}`, Math.round(w));
    }
    return Math.round(w);
  }
  /**
   * 获取某一行的高度
   * @param row
   * @returns
   */
  getRowHeight(row: number): number {
    // return (
    //   this.rowHeightsMap.get(row) ||
    //   (this.isColumnHeader(0, row) || this.isCornerHeader(0, row)
    //     ? Array.isArray(this.defaultHeaderRowHeight)
    //       ? this.defaultHeaderRowHeight[row] ?? this.internalProps.defaultRowHeight
    //       : this.defaultHeaderRowHeight
    //     : this.internalProps.defaultRowHeight)
    //     );
    if (isValid(this.rowHeightsMap.get(row))) {
      if (this.options.customConfig?._disableColumnAndRowSizeRound) {
        const height = this.rowHeightsMap.get(row);
        let heightRange;
        if (row < this.frozenRowCount) {
          heightRange = this.rowHeightsMap.getSumInRange(0, row);
        } else if (row >= this.rowCount - this.bottomFrozenRowCount) {
          heightRange = this.rowHeightsMap.getSumInRange(row, this.rowCount - 1);
        } else {
          heightRange = this.rowHeightsMap.getSumInRange(this.frozenRowCount, row);
        }
        heightRange = Number(heightRange.toFixed(2)); // avoid precision problem
        // if heightRange number is int
        if (Number.isInteger(heightRange)) {
          return Math.ceil(height);
        }
        return Math.floor(height);
      }
      return this.rowHeightsMap.get(row);
    }
    const defaultHeight = this.getDefaultRowHeight(row);
    if (isNumber(defaultHeight)) {
      return defaultHeight;
    }
    return this.defaultRowHeight;
  }

  getDefaultColumnWidth(col: number) {
    // return col < this.rowHeaderLevelCount
    //   ? Array.isArray(this.defaultHeaderColWidth)
    //     ? this.defaultHeaderColWidth[col] ?? this.defaultColWidth
    //     : this.defaultHeaderColWidth
    //   : this.defaultColWidth;
    if (this.isRowHeader(col, 0) || this.isCornerHeader(col, 0)) {
      return Array.isArray(this.defaultHeaderColWidth)
        ? this.defaultHeaderColWidth[col] ?? this.defaultColWidth
        : this.defaultHeaderColWidth;
    } else if (this.isRightFrozenColumn(col, this.columnHeaderLevelCount)) {
      if (this.isPivotTable()) {
        return Array.isArray(this.defaultHeaderColWidth)
          ? this.defaultHeaderColWidth[this.rowHeaderLevelCount - this.rightFrozenColCount] ?? this.defaultColWidth
          : this.defaultHeaderColWidth;
      }
      return this.defaultColWidth;
    }
    return this.defaultColWidth;
  }

  getDefaultRowHeight(row: number) {
    if (this.isColumnHeader(0, row) || this.isCornerHeader(0, row) || this.isSeriesNumberInHeader(0, row)) {
      return Array.isArray(this.defaultHeaderRowHeight)
        ? this.defaultHeaderRowHeight[row] ?? this.internalProps.defaultRowHeight
        : this.defaultHeaderRowHeight;
    }
    if (this.isBottomFrozenRow(row)) {
      //底部冻结行默认取用了表头的行高  但针对非表头数据冻结的情况这里可能不妥
      return Array.isArray(this.defaultHeaderRowHeight)
        ? this.defaultHeaderRowHeight[
            this.columnHeaderLevelCount > 0 ? this.columnHeaderLevelCount - this.bottomFrozenRowCount : 0
          ] ?? this.internalProps.defaultRowHeight
        : this.defaultHeaderRowHeight;
    }
    return this.internalProps.defaultRowHeight;
  }
  /**
   * 设置某一行的高度
   * @param row
   * @returns
   */
  _setRowHeight(row: number, height: number, clearCache?: boolean): void {
    // this.rowHeightsMap.put(row, Math.round(height));
    this.rowHeightsMap.put(row, this.options.customConfig?._disableColumnAndRowSizeRound ? height : Math.round(height));
    // 清楚影响缓存
    if (clearCache) {
      this._clearRowRangeHeightsMap(row);
    }
  }

  setRowHeight(row: number, height: number) {
    this.scenegraph.setRowHeight(row, height);
    this.scenegraph.updateChartSizeForResizeRowHeight(row);
    this.internalProps._heightResizedRowMap.add(row); // add resize tag
  }

  /**
   * 获取指定行范围的总高度
   * @param startCol
   * @param endCol
   * @returns
   */
  getRowsHeight(startRow: number, endRow: number): number {
    if (startRow > endRow || this.rowCount === 0) {
      return 0;
    }
    startRow = Math.max(startRow, 0);
    endRow = Math.min(endRow, (this.rowCount ?? Infinity) - 1);

    let h = 0;
    const isDefaultRowHeightIsAuto = this.options.defaultRowHeight === 'auto';
    // autoRowHeight || all rows in header, use accumulation
    if (
      this.heightMode === 'standard' &&
      !this.options.customComputeRowHeight &&
      !this.autoFillHeight &&
      this.internalProps.layoutMap &&
      // endRow >= this.columnHeaderLevelCount &&
      // !this.bottomFrozenRowCount &&
      !this.hasAutoImageColumn() &&
      !isDefaultRowHeightIsAuto &&
      this.internalProps._heightResizedRowMap.size === 0
    ) {
      // part in header
      for (let i = startRow; i < Math.min(endRow + 1, this.columnHeaderLevelCount); i++) {
        h += this.getRowHeight(i);
      }
      // part in body
      if (endRow >= this.columnHeaderLevelCount) {
        h +=
          this.defaultRowHeight *
          (Math.min(endRow, this.rowCount - this.bottomFrozenRowCount - 1) -
            Math.max(this.columnHeaderLevelCount, startRow) +
            1);
      }
      // part in bottom frozen
      // last axis row height is default header row height in pivot chart
      for (let i = this.rowCount - this.bottomFrozenRowCount; i < endRow + 1; i++) {
        h += this.getRowHeight(i);
      }
    } else {
      if (this.options.customConfig?._disableColumnAndRowSizeRound) {
        // for (let i = startRow; i <= endRow; i++) {
        //   h += this.getRowHeight(i);
        // }
        const tempH = this.rowHeightsMap.getSumInRange(startRow, endRow);
        let heightRange;
        if (endRow < this.frozenRowCount) {
          heightRange = this.rowHeightsMap.getSumInRange(0, endRow);
        } else if (endRow >= this.rowCount - this.bottomFrozenRowCount) {
          heightRange = this.rowHeightsMap.getSumInRange(endRow, this.rowCount - 1);
        } else {
          heightRange = this.rowHeightsMap.getSumInRange(this.frozenRowCount, endRow);
        }
        heightRange = Number(heightRange.toFixed(2)); // avoid precision problem
        // if heightRange number is int
        if (Number.isInteger(heightRange)) {
          return Math.ceil(tempH);
        }
        return Math.floor(tempH);
      }
      h = this.rowHeightsMap.getSumInRange(startRow, endRow);
    }
    // if (this.options._disableColumnAndRowSizeRound) {
    //   // console.log(startRow, endRow, Number(h.toFixed(2)));
    //   // return Number(h.toFixed(2));
    //   return h;
    // }
    return Math.round(h);
  }
  /**
   * 根据列号获取列宽定义
   * @param {number} col column number
   * @returns {string|number} width definition
   * @private
   */
  getColWidthDefined(col: number): string | number {
    const { layoutMap } = this.internalProps;
    // const ctx = _getInitContext.call(table);
    if (this.widthMode === 'autoWidth') {
      return 'auto';
    }
    const { width } = layoutMap?.getColumnWidthDefined(col) ?? {};
    if (typeof width === 'number' && width <= 0) {
      // adaptive模式下，宽度可能为0
      return 0;
    } else if (width) {
      return width;
    }
    return this.getDefaultColumnWidth(col);
    // } else if (this.isRowHeader(col, 0) || this.isCornerHeader(col, 0)) {
    //   return Array.isArray(this.defaultHeaderColWidth)
    //     ? this.defaultHeaderColWidth[col] ?? this.defaultColWidth
    //     : this.defaultHeaderColWidth;
    // } else if (this.isRightFrozenColumn(col, this.columnHeaderLevelCount)) {
    //   if (this.isPivotTable()) {
    //     return Array.isArray(this.defaultHeaderColWidth)
    //       ? this.defaultHeaderColWidth[this.rowHeaderLevelCount - this.rightFrozenColCount] ?? this.defaultColWidth
    //       : this.defaultHeaderColWidth;
    //   }
    //   return this.defaultColWidth;
    // }
    // return this.defaultColWidth;
  }

  // setColWidthDefined(col: number, width: number) {
  //   const { layoutMap } = this.internalProps;
  //   const widthData = layoutMap?.getColumnWidthDefined(col) ?? {};
  //   widthData.width = width;
  // }

  getColWidthDefinedNumber(col: number): number {
    const width = this.getColWidthDefined(col);
    return this._adjustColWidth(col, this._colWidthDefineToPxWidth(width));
  }
  /** 判断某行是否应该计算行高 */
  isAutoRowHeight(row?: number): boolean {
    if (this.heightMode === 'autoHeight') {
      return true;
    } else if (this.options.customComputeRowHeight) {
      return true;
    } else if (row >= 0 && row < this.columnHeaderLevelCount) {
      return this.getDefaultRowHeight(row) === 'auto';
    }
    return false;
  }
  /**
   * 根据列号获取列宽定义
   * @param {number} col column number
   * @returns {string|number} width definition
   * @private
   */
  // getColWidthDefine(col: number): string | number {
  //   const width = this.colWidthsMap.get(col);
  //   if (typeof width === 'number' && width <= 0) {
  //     // adaptive模式下，宽度可能为0
  //     return 0;
  //   } else if (width) {
  //     return width;
  //   } else if (this.isRowHeader(col, 0) || this.isCornerHeader(col, 0)) {
  //     return Array.isArray(this.defaultHeaderColWidth)
  //       ? this.defaultHeaderColWidth[col] ?? this.defaultColWidth
  //       : this.defaultHeaderColWidth;
  //   } else if (this.isRightFrozenColumn(col, this.columnHeaderLevelCount)) {
  //     return Array.isArray(this.defaultHeaderColWidth)
  //       ? this.defaultHeaderColWidth[this.rowHeaderLevelCount - this.rightFrozenColCount] ?? this.defaultColWidth
  //       : this.defaultHeaderColWidth;
  //   }
  //   return this.defaultColWidth;
  // }

  /**
   * 根据列号 获取该列宽度
   * @param  {number} col column index
   * @return {number} column width
   */
  getColWidth(col: number): number {
    // const width = this.getColWidthDefine(col);
    const width = this.colWidthsMap.get(col) ?? this.getDefaultColumnWidth(col);
    if (
      (this.widthMode === 'adaptive' && typeof width === 'number') ||
      ((this as any).transpose && typeof width === 'number')
    ) {
      // adaptive模式下，colWidthsMap存储的都是像素数值，此时max min配置失效，直接返回像素值
      // transpose模式下，不受原有列max min配置影响，直接返回像素值
      return this._colWidthDefineToPxWidth(width);
    }
    return this._adjustColWidth(col, this._colWidthDefineToPxWidth(width));
  }
  /**
   * 设置某一行的高度
   * @param row
   * @returns
   */
  _setColWidth(col: number, width: string | number, clearCache?: boolean, skipCheckFrozen?: boolean): void {
    this.colWidthsMap.put(
      col,
      // typeof width === 'number' ? (this.options.customConfig?._disableColumnAndRowSizeRound ? width : Math.round(width)) : width
      typeof width === 'number' ? Math.round(width) : width
    );
    // 清楚影响缓存
    if (clearCache) {
      this._clearColRangeWidthsMap(col);
    }

    // 检查冻结情况
    if (!skipCheckFrozen) {
      this.stateManager.checkFrozen();
    }
  }

  setColWidth(col: number, width: number) {
    this.scenegraph.setColWidth(col, width);
    this.scenegraph.updateChartSizeForResizeColWidth(col);
    this.internalProps._widthResizedColMap.add(col); // add resize tag
  }

  /**
   * 清空含有指定col的缓存
   * @param col
   */
  _clearColRangeWidthsMap(col?: number): void {
    if (typeof col !== 'number') {
      this._colRangeWidthsMap.clear();
    } else {
      const keys = this._colRangeWidthsMap.keys();
      for (const key of keys) {
        const reg = rangeReg.exec(key);
        if (reg) {
          const start = Number(reg[1]);
          const end = Number(reg[2]);
          if (col >= start && col <= end) {
            this._colRangeWidthsMap.delete(key);
          }
        }
      }
    }
  }
  /**
   * 清空含有指定row的缓存
   * @param row
   */
  _clearRowRangeHeightsMap(row?: number): void {
    this.rowHeightsMap.clearRange();
    // if (typeof row !== 'number') {
    //   this._rowRangeHeightsMap.clear();
    // } else {
    //   const keys = this._rowRangeHeightsMap.keys();
    //   for (const key of keys) {
    //     const reg = rangeReg.exec(key);
    //     if (reg) {
    //       const start = Number(reg[1]);
    //       const end = Number(reg[2]);
    //       if (row >= start && row <= end) {
    //         this._rowRangeHeightsMap.delete(key);
    //       }
    //     }
    //   }
    // }
  }
  /**
   * 获取某一列内容的宽度 不关乎该列列宽值有多少
   * @param col
   * @returns
   */
  _getColContentWidth(col: number): number {
    return Number(this.colContentWidthsMap.get(col));
  }
  _setColContentWidth(col: number, width: string | number): void {
    this.colContentWidthsMap.put(col, width);
  }
  /**
   * 获取所有列的总高度
   * @returns
   */
  getAllRowsHeight(): number {
    if (this.internalProps.rowCount <= 0) {
      return 0;
    }
    const h = this.getRowsHeight(0, this.internalProps.rowCount - 1);
    return h;
  }
  /**
   * 获取所有行的总宽度
   * @returns
   */
  getAllColsWidth(): number {
    if (this.internalProps.colCount <= 0) {
      return 0;
    }
    const w = this.getColsWidth(0, this.internalProps.colCount - 1);
    return w;
  }

  /**
   * 根据列号 获取列宽最大值
   * @param  {number} col column index
   * @return {number} column max width
   */
  getMaxColWidth(col: number): number {
    const obj = this.colWidthsLimit[col];
    let max = (obj && obj.max) ?? Infinity;
    if (typeof max === 'string') {
      max = _toPxWidth(this, max);
    }
    return max;
  }
  /**
   * 根据列号 设置列宽最大值
   * @param  {number} col  column index
   * @param  {number} maxwidth column max width
   * @return {void}
   */
  setMaxColWidth(col: number, maxwidth: string | number): void {
    const obj = this.colWidthsLimit[col] || (this.colWidthsLimit[col] = {});
    obj.max = maxwidth;
  }
  /**
   *  根据列号 获取列宽最小值
   * @param  {number} col  column index
   * @return {number} column min width
   */
  getMinColWidth(col: number): number {
    const obj = this.colWidthsLimit[col];
    let min = (obj && obj.min) ?? 0;
    if (typeof min === 'string') {
      min = _toPxWidth(this, min);
    }
    return min;
  }
  /**
   * 根据列号 设置列宽最小值
   * @param  {number} col column index
   * @param  {number} minwidth column min width
   * @return {void}
   */
  setMinColWidth(col: number, minwidth: string | number): void {
    const obj = this.colWidthsLimit[col] || (this.colWidthsLimit[col] = {});
    obj.min = minwidth;
  }
  /**
   * 获取单元格的范围 返回值为Rect类型。不考虑是否为合并单元格的情况，坐标从0开始
   * @param {number} col column index
   * @param {number} row row index
   * @returns {Rect}
   */
  getCellRect(col: number, row: number): Rect {
    const isFrozenCell = this.isFrozenCell(col, row);

    let absoluteLeft;
    const width = this.getColWidth(col);
    if (isFrozenCell && isFrozenCell.col) {
      if (this.isRightFrozenColumn(col, row)) {
        if (this.getAllColsWidth() <= this.tableNoFrameWidth) {
          absoluteLeft = this.getColsWidth(0, col - 1) || 0;
        } else {
          absoluteLeft = this.tableNoFrameWidth - (this.getColsWidth(col, this.colCount - 1) ?? 0);
        }
      } else {
        absoluteLeft = this.getColsWidth(0, col - 1) || 0;
        // absoluteLeft += this.scrollLeft;
      }
    } else {
      absoluteLeft = this.getColsWidth(0, col - 1) || 0;
    }

    let absoluteTop;
    const height = this.getRowHeight(row);
    if (isFrozenCell && isFrozenCell.row) {
      if (this.isBottomFrozenRow(col, row)) {
        if (this.getAllRowsHeight() <= this.tableNoFrameHeight) {
          absoluteTop = this.getRowsHeight(0, row - 1);
        } else {
          absoluteTop = this.tableNoFrameHeight - (this.getRowsHeight(row, this.rowCount - 1) ?? 0);
        }
      } else {
        absoluteTop = this.getRowsHeight(0, row - 1);
        // absoluteTop += this.scrollTop;
      }
    } else {
      absoluteTop = this.getRowsHeight(0, row - 1);
    }
    return new Rect(Math.round(absoluteLeft), Math.round(absoluteTop), Math.round(width), Math.round(height));
  }
  /**
   * 获取指定单元格【按合并后的区域】的rect 整表坐标系中（即相对于单元格[0,0]左上角来算的）
   * @param col
   * @param row
   * @returns
   */
  getMergeCellRect(col: number, row: number): Rect {
    const cellRange = this.getCellRange(col, row);
    const absoluteLeft = this.getColsWidth(0, cellRange.start.col - 1) || 0; // startCol为0时，absoluteLeft计算为Nan
    const width = this.getColsWidth(cellRange.start.col, cellRange.end.col);
    const absoluteTop = this.getRowsHeight(0, cellRange.start.row - 1) || 0;
    const height = this.getRowsHeight(cellRange.start.row, cellRange.end.row);
    return new Rect(Math.round(absoluteLeft), Math.round(absoluteTop), Math.round(width), Math.round(height));
  }
  /**
   * 获取的位置是相对表格显示界面的左上角 情况滚动情况 如单元格已经滚出表格上方 则这个单元格的y将为负值
   * @param {number} col index of column, of the cell
   * @param {number} row index of row, of the cell
   * @returns {Rect} the rect of the cell.
   */
  getCellRelativeRect(col: number, row: number): Rect {
    const isFrozenCell = this.isFrozenCell(col, row);
    let relativeX = true;
    let relativeY = true;
    if (isFrozenCell?.col && isFrozenCell?.row) {
      relativeX = false;
      relativeY = false;
    } else if (isFrozenCell?.col) {
      relativeX = false;
    } else if (isFrozenCell?.row) {
      relativeY = false;
    }
    const cellRect = this.getCellRect(col, row);
    return this._toRelativeRect(cellRect, relativeX, relativeY);
  }
  /**
   * 获取的位置是相对表格显示界面的左上角
   * @param {number} range :CellRange | CellAddress 类型 可以传入单元格范围或者具体某个单元格 返回值是包括合并单元格的较大区域
   * @returns {Rect}
   */
  getCellRangeRelativeRect(range: CellRange | CellAddress): Rect {
    if ((<CellRange>range).start) {
      const isFrozenCell = this.isFrozenCell((<CellRange>range).start.col, (<CellRange>range).start.row);
      let relativeX = true;
      let relativeY = true;
      if (isFrozenCell?.col && isFrozenCell?.row) {
        relativeX = false;
        relativeY = false;
      } else if (isFrozenCell?.col) {
        relativeX = false;
      } else if (isFrozenCell?.row) {
        relativeY = false;
      }
      return this._toRelativeRect(
        this.getCellsRect(
          (<CellRange>range).start.col,
          (<CellRange>range).start.row,
          (<CellRange>range).end.col,
          (<CellRange>range).end.row
        ),
        relativeX,
        relativeY
      );
    }
    const cellRange = this.getCellRange((<CellAddress>range).col, (<CellAddress>range).row);
    const isFrozenCell = this.isFrozenCell((<CellAddress>range).col, (<CellAddress>range).row);
    let relativeX = true;
    let relativeY = true;
    if (isFrozenCell?.col && isFrozenCell?.row) {
      relativeX = false;
      relativeY = false;
    } else if (isFrozenCell?.col) {
      relativeX = false;
    } else if (isFrozenCell?.row) {
      relativeY = false;
    }
    return this._toRelativeRect(
      this.getCellsRect(cellRange.start.col, cellRange.start.row, cellRange.end.col, cellRange.end.row),
      relativeX,
      relativeY
    );
  }
  /**
   *  即仅视觉看到的位置 获取的位置是相对表格显示界面的左上角
   * @param {number} range :CellRange | CellAddress 类型
   * @returns {Rect} the visiable rect of the cell.可见矩形部分
   */
  getVisibleCellRangeRelativeRect(range: CellRange | CellAddress): Rect {
    let cellRange: CellRange;
    if ((<CellRange>range).start) {
      cellRange = <CellRange>range;
    } else {
      cellRange = this.getCellRange((<CellAddress>range).col, (<CellAddress>range).row);
    }
    return this._getVisiableRect(this.getCellRangeRelativeRect(range), cellRange);
  }
  /**
   * 调整relativeRectObj 计算可见部分的rect
   * @param relativeRectObj
   * @returns
   */
  _getVisiableRect(relativeRectObj: Rect, cellRange: CellRange): Rect {
    const targetLeft =
      cellRange.start.col >= this.frozenColCount
        ? Math.max(relativeRectObj.left, this.frozenColCount >= 1 ? this.getColsWidth(0, this.frozenColCount - 1) : 0)
        : relativeRectObj.left;
    const targetRight = Math.min(relativeRectObj.right, this.tableNoFrameWidth);
    const rect = relativeRectObj.copy();
    rect.left = targetLeft;
    rect.right = targetRight;

    const targetTop =
      cellRange.start.row >= this.frozenRowCount
        ? Math.max(relativeRectObj.top, this.frozenRowCount >= 1 ? this.getRowsHeight(0, this.frozenRowCount - 1) : 0)
        : relativeRectObj.top;
    const targetBottom = Math.min(relativeRectObj.bottom, this.tableNoFrameHeight);
    rect.top = targetTop;
    rect.bottom = targetBottom;
    return rect;
  }
  /**
   * 获取指定行列区域的Rect
   * @param {number} startCol
   * @param {number} startRow
   * @param {number} endCol
   * @param {number} endRow
   * @returns {Rect}
   */
  getCellsRect(startCol: number, startRow: number, endCol: number, endRow: number): Rect {
    let absoluteLeft = this.getColsWidth(0, startCol - 1) || 0; // startCol为0时，absoluteLeft计算为Nan
    let width = this.getColsWidth(startCol, endCol);
    const scrollLeft = this.scrollLeft;
    if (this.isLeftFrozenColumn(startCol) && this.isRightFrozenColumn(endCol)) {
      width = this.tableNoFrameWidth - (this.getColsWidth(startCol + 1, this.colCount - 1) ?? 0) - absoluteLeft;
      // width =
      //   this.tableNoFrameWidth -
      //   (this.getColsWidth(0, startCol - 1) ?? 0) -
      //   (this.getColsWidth(endCol + 1, this.colCount - 1) ?? 0);
    } else if (this.isLeftFrozenColumn(startCol) && !this.isLeftFrozenColumn(endCol)) {
      width = Math.max(width - scrollLeft, this.getColsWidth(startCol, this.frozenColCount - 1));
    } else if (!this.isRightFrozenColumn(startCol) && this.isRightFrozenColumn(endCol)) {
      absoluteLeft = Math.min(absoluteLeft - scrollLeft, this.tableNoFrameWidth - this.getRightFrozenColsWidth());
      width = this.tableNoFrameWidth - (this.getColsWidth(startCol + 1, this.colCount - 1) ?? 0) - absoluteLeft;
    } else if (this.isRightFrozenColumn(startCol)) {
      absoluteLeft = this.tableNoFrameWidth - (this.getColsWidth(startCol, this.colCount - 1) ?? 0);
    } else {
      // 范围全部在整体一块区域 如都在右侧冻结区域 都可以走这块逻辑
      // do nothing
    }

    let absoluteTop = this.getRowsHeight(0, startRow - 1);
    let height = this.getRowsHeight(startRow, endRow);
    const scrollTop = this.scrollTop;
    if (this.isTopFrozenRow(startRow) && this.isBottomFrozenRow(endRow)) {
      height = this.tableNoFrameHeight - (this.getRowsHeight(startRow + 1, this.rowCount - 1) ?? 0) - absoluteTop;
      // height =
      //   this.tableNoFrameHeight -
      //   (this.getRowsHeight(0, startRow - 1) ?? 0) -
      //   (this.getRowsHeight(endRow + 1, this.rowCount - 1) ?? 0);
    } else if (this.isTopFrozenRow(startRow) && !this.isTopFrozenRow(endRow)) {
      height = Math.max(height - scrollTop, this.getRowsHeight(startRow, this.frozenRowCount - 1));
    } else if (!this.isBottomFrozenRow(startRow) && this.isBottomFrozenRow(endRow)) {
      absoluteTop = Math.min(absoluteTop - scrollTop, this.tableNoFrameHeight - this.getBottomFrozenRowsHeight());
      height = this.tableNoFrameHeight - (this.getRowsHeight(startRow + 1, this.rowCount - 1) ?? 0) - absoluteTop;
    } else if (this.isBottomFrozenRow(startRow)) {
      absoluteTop = this.tableNoFrameHeight - (this.getRowsHeight(startRow, this.rowCount - 1) ?? 0);
    } else {
      // 范围全部在整体一块区域 如都在右侧冻结区域 都可以走这块逻辑
      // do nothing
    }
    return new Rect(Math.round(absoluteLeft), Math.round(absoluteTop), Math.round(width), Math.round(height));
  }
  /**
   * 获取指定区域的宽度
   * @param startCol
   * @param startRow
   * @param endCol
   * @param endRow
   * @returns
   */
  getCellsRectWidth(startCol: number, startRow: number, endCol: number, endRow: number): number {
    const isFrozenStartCell = this.isFrozenCell(startCol, startRow);
    const isFrozenEndCell = this.isFrozenCell(endCol, endRow);
    let width = this.getColsWidth(startCol, endCol);
    if (isFrozenStartCell && isFrozenStartCell.col) {
      const scrollLeft = this.scrollLeft;
      if (!isFrozenEndCell || !isFrozenEndCell.col) {
        width -= scrollLeft;
        width = Math.max(width, this.getColsWidth(startCol, this.frozenColCount - 1));
      }
    }
    return width;
  }
  /**
   * 获取行列范围range或者某个单元格所做合并大的范围range的rect范围
   * @param range
   * @returns
   */
  getCellRangeRect(range: CellRange | CellAddress): Rect {
    if ((<CellRange>range).start) {
      return this.getCellsRect(
        (<CellRange>range).start.col,
        (<CellRange>range).start.row,
        (<CellRange>range).end.col,
        (<CellRange>range).end.row
      );
    }
    const cellRange = this.getCellRange((<CellAddress>range).col, (<CellAddress>range).row);
    return this.getCellsRect(cellRange.start.col, cellRange.start.row, cellRange.end.col, cellRange.end.row);
  }
  /**
   * 获取行列范围range或者某个单元格所做合并大的范围range的宽度
   * @param range
   * @returns
   */
  getCellRangeRectWidth(range: CellRange | CellAddress): number {
    if ((<CellRange>range).start) {
      return this.getCellsRectWidth(
        (<CellRange>range).start.col,
        (<CellRange>range).start.row,
        (<CellRange>range).end.col,
        (<CellRange>range).end.row
      );
    }
    const cellRange = this.getCellRange((<CellAddress>range).col, (<CellAddress>range).row);
    return this.getCellsRectWidth(cellRange.start.col, cellRange.start.row, cellRange.end.col, cellRange.end.row);
  }
  /** 判断某个单元格个是否在冻结行或冻结列中 */
  isFrozenCell(
    col: number,
    row: number
  ): {
    row: boolean;
    col: boolean;
  } | null {
    const isFrozenRow = this.isFrozenRow(row);
    const isFrozenCol = this.isFrozenColumn(col);
    if (isFrozenRow || isFrozenCol) {
      return {
        row: isFrozenRow,
        col: isFrozenCol
      };
    }
    return null;
  }
  /**
   * 根据y值计算所在行
   * @param absoluteY
   * @returns
   */
  getRowAt(absoluteY: number): { top: number; row: number; bottom: number; height: number } {
    return getRowAt(absoluteY, this);
  }
  /**
   * 根据x值计算所在列
   * @param absoluteX
   * @returns
   */
  getColAt(absoluteX: number): { left: number; col: number; right: number; width: number } {
    return getColAt(absoluteX, this);
  }
  /**
   * 根据坐标值获取行列位置，index和rect范围
   * @param absoluteX
   * @param absoluteY
   * @returns
   */
  getCellAt(absoluteX: number, absoluteY: number): CellAddressWithBound {
    return getCellAt(absoluteX, absoluteY, this);
  }

  /**
   * 获取屏幕坐标对应的单元格信息，考虑滚动
   * @param this
   * @param relativeX 左边x值，相对于容器左上角，已考虑格滚动情况
   * @param relativeY 左边y值，相对于容器左上角，已考虑格滚动情况
   * @returns
   */
  getCellAtRelativePosition(relativeX: number, relativeY: number): CellAddressWithBound {
    return getCellAtRelativePosition(relativeX, relativeY, this);
  }
  /**
   * 检查行列号是否正确
   * @param col
   * @param row
   * @returns
   */
  _checkRowCol(col: number, row: number) {
    if (col >= 0 && col < this.colCount && row >= 0 && row < this.rowCount) {
      return true;
    }
    return false;
  }
  /**
   * 指定的行列如果在可视范围内，则不进行逻辑处理；如果不在可视范围需要滚动一定距离能将其显示出来
   * @param  {number} col The column index.
   * @param  {number} row The row index
   * @return {void}
   */
  _makeVisibleCell(col: number, row: number): void {
    if (this._checkRowCol(col, row)) {
      const isFrozenCell = this.isFrozenCell(col, row);
      if (isFrozenCell && isFrozenCell.col && isFrozenCell.row) {
        return;
      }
      const rect = this.getCellRect(col, row);
      const visibleRect = _getScrollableVisibleRect(this);
      if (visibleRect.contains(rect)) {
        return;
      }
      if (!isFrozenCell || !isFrozenCell.col) {
        if (this.getColsWidth(0, this.frozenColCount - 1) + rect.width > this.canvas.width) {
          // do nothing
          // 防止点击左右跳动
        } else if (rect.left < visibleRect.left) {
          this.scrollLeft -= visibleRect.left - rect.left;
        } else if (visibleRect.right < rect.right) {
          this.scrollLeft -= visibleRect.right - rect.right;
        }
      }
      if (!isFrozenCell || !isFrozenCell.row) {
        if (this.getRowsHeight(0, this.frozenRowCount - 1) + rect.height > this.canvas.height) {
          // do nothing
        } else if (rect.top < visibleRect.top) {
          this.scrollTop -= visibleRect.top - rect.top;
        } else if (visibleRect.bottom < rect.bottom) {
          this.scrollTop -= visibleRect.bottom - rect.bottom;
        }
      }
    }
  }

  /**
   * 重绘表格(同步绘制)
   */
  render(): void {
    this.scenegraph.renderSceneGraph();
  }
  /**
   * 异步重绘表格
   */
  renderAsync(): Promise<void> {
    this.scenegraph.updateNextFrame();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 0);
    });
  }
  /**
   * 转换成视觉相对table左上角的坐标 如滚动超出表格上方 y将为负值
   * @param absoluteRect
   * @returns
   */
  _toRelativeRect(absoluteRect: Rect, relativeX: boolean = true, relativeY: boolean = true): Rect {
    const rect = absoluteRect.copy();
    const visibleRect = this.getVisibleRect();
    rect.offsetLeft(this.tableX - (relativeX ? visibleRect.left : 0));
    rect.offsetTop(this.tableY - (relativeY ? visibleRect.top : 0));
    rect.offsetLeft(this.options.viewBox?.x1 ?? 0);
    rect.offsetTop(this.options.viewBox?.y1 ?? 0);
    return rect;
  }

  /**
   * 想象一张可以任意大的表格，呈现在我们眼前的只是其中一部分，那这个部分怎么来描述。
   * 如有滚动情况 scrollLeft为100，也就是往右滚动了100（左侧隐藏100）。_getVisibleRect获取到的Rect{_left: 100, _top: 0, _width: 1460, _height: 685}
   * @param table
   * @returns
   */
  getVisibleRect(): Rect {
    const { scrollTop, scrollLeft } = this;
    const width = this.tableNoFrameWidth;
    const height = this.tableNoFrameHeight;
    return new Rect(scrollLeft, scrollTop, width, height);
  }
  /**
   * 获取网格中完全可见的可滚动行数。不包括表头及冻结的行
   * @returns {number}
   */
  get visibleRowCount(): number {
    const { frozenRowCount } = this;
    const visibleRect = this.getVisibleRect();
    const visibleTop =
      frozenRowCount > 0 ? visibleRect.top + this.getRowsHeight(0, frozenRowCount - 1) : visibleRect.top;

    const initRow = this.getTargetRowAt(visibleTop);
    if (!initRow) {
      return 0;
    }
    const startRow = Math.max(initRow.top >= visibleTop ? initRow.row : initRow.row + 1, frozenRowCount);
    let absoluteTop = this.getRowsHeight(0, startRow - 1);
    let count = 0;
    const { rowCount } = this;
    for (let row = startRow; row < rowCount; row++) {
      const height = this.getRowHeight(row);
      const bottom = absoluteTop + height;
      if (visibleRect.bottom < bottom) {
        break;
      }
      count++;
      absoluteTop = bottom;
    }
    return count;
  }
  /** 获取表格body部分的显示单元格范围 */
  getBodyVisibleCellRange() {
    const { scrollTop, scrollLeft } = this;
    const frozenRowsHeight = this.getFrozenRowsHeight();
    const frozenColsWidth = this.getFrozenColsWidth();
    const bottomFrozenRowsHeight = this.getBottomFrozenRowsHeight();
    const rightFrozenColsWidth = this.getRightFrozenColsWidth();
    // 计算非冻结
    const { row: rowStart } = this.getRowAt(scrollTop + frozenRowsHeight + 1);
    const { col: colStart } = this.getColAt(scrollLeft + frozenColsWidth + 1);
    const rowEnd =
      this.getAllRowsHeight() > this.tableNoFrameHeight
        ? this.getRowAt(scrollTop + this.tableNoFrameHeight - 1 - bottomFrozenRowsHeight).row
        : this.rowCount - 1;
    const colEnd =
      this.getAllColsWidth() > this.tableNoFrameWidth
        ? this.getColAt(scrollLeft + this.tableNoFrameWidth - 1 - rightFrozenColsWidth).col
        : this.colCount - 1;
    if (colEnd < 0 || rowEnd < 0) {
      return null;
    }
    return { rowStart, colStart, rowEnd, colEnd };
  }
  /** 获取表格body部分的显示行号范围 */
  getBodyVisibleRowRange() {
    const { scrollTop } = this;
    const frozenRowsHeight = this.getFrozenRowsHeight();
    const bottomFrozenRowsHeight = this.getBottomFrozenRowsHeight();
    // 计算非冻结
    const { row: rowStart } = this.getRowAt(scrollTop + frozenRowsHeight + 1);
    const rowEnd =
      this.getAllRowsHeight() > this.tableNoFrameHeight
        ? this.getRowAt(scrollTop + this.tableNoFrameHeight - 1 - bottomFrozenRowsHeight).row
        : this.rowCount - 1;
    if (rowEnd < 0) {
      return null;
    }
    return { rowStart, rowEnd };
  }
  /** 获取表格body部分的显示列号范围 */
  getBodyVisibleColRange() {
    const { scrollLeft } = this;
    const frozenColsWidth = this.getFrozenColsWidth();
    const rightFrozenColsWidth = this.getRightFrozenColsWidth();
    // 计算非冻结
    const { col: colStart } = this.getColAt(scrollLeft + frozenColsWidth + 1);

    const colEnd =
      this.getAllColsWidth() > this.tableNoFrameWidth
        ? this.getColAt(scrollLeft + this.tableNoFrameWidth - 1 - rightFrozenColsWidth).col
        : this.colCount - 1;
    if (colEnd < 0) {
      return null;
    }
    return { colStart, colEnd };
  }
  /**
   * 获取表格中完全可见的可滚动列数。不包括表头及冻结的列
   * @returns {number}
   */
  get visibleColCount(): number {
    const { frozenColCount } = this;
    const visibleRect = this.getVisibleRect();
    const visibleLeft =
      frozenColCount > 0 ? visibleRect.left + this.getColsWidth(0, frozenColCount - 1) : visibleRect.left;

    const initCol = this.getTargetColAt(visibleLeft);
    if (!initCol) {
      return 0;
    }
    const startCol = Math.max(initCol.left >= visibleLeft ? initCol.col : initCol.col + 1, frozenColCount);
    let absoluteLeft = this.getColsWidth(0, startCol - 1);
    let count = 0;
    const { colCount } = this;
    for (let col = startCol; col < colCount; col++) {
      const width = this.getColWidth(col);
      const right = absoluteLeft + width;
      if (visibleRect.right < right) {
        break;
      }
      count++;
      absoluteLeft = right;
    }
    return count;
  }

  get scrollTop(): number {
    return this.stateManager.scroll.verticalBarPos;
  }
  set scrollTop(scrollTop: number) {
    this.stateManager.setScrollTop(scrollTop);
  }

  get scrollLeft(): number {
    return this.stateManager.scroll.horizontalBarPos;
  }
  set scrollLeft(scrollLeft: number) {
    this.stateManager.setScrollLeft(scrollLeft);
  }

  getScrollLeft() {
    return this.scrollLeft;
  }
  getScrollTop() {
    return this.scrollTop;
  }
  setScrollLeft(num: number) {
    this.scrollLeft = Math.ceil(num);
  }
  setScrollTop(num: number) {
    this.scrollTop = Math.ceil(num);
  }
  /**
   * 获取有省略文字的的单元格文本内容
   * cellTextOverflows存储了无法显示全文本的value，供toolTip使用
   * @param  {number} col column index.
   * @param  {number} row row index
   * @return {string | null}
   */
  getCellOverflowText(col: number, row: number): string | null {
    return this.scenegraph.getCellOverflowText(col, row);
  }
  /**
   * 添加析构逻辑
   * @param releaseObj
   */
  addReleaseObj(releaseObj: { release: () => void }): void {
    if (!releaseObj || !releaseObj.release || typeof releaseObj.release !== 'function') {
      throw new Error('not releaseObj!');
    }
    const releaseList = (this.internalProps.releaseList = this.internalProps.releaseList || []);
    releaseList.push(releaseObj);
  }
  private dispose() {
    this.release();
  }
  /**
   * Dispose the table instance.
   * @returns {void}
   */
  release(): void {
    const internalProps = this.internalProps;
    if (this.isReleased) {
      return;
    }
    internalProps.tooltipHandler?.release?.();
    internalProps.menuHandler?.release?.();
    IconCache.clearAll();

    super.release?.();
    internalProps.handler?.release?.();
    // internalProps.scrollable?.release?.();
    this.eventManager.release();
    internalProps.focusControl?.release?.();
    internalProps.legends?.forEach(legend => {
      legend?.release();
    });
    internalProps.title?.release();
    internalProps.title = null;
    internalProps.emptyTip?.release();
    internalProps.emptyTip = null;
    internalProps.layoutMap.release();
    if (internalProps.releaseList) {
      internalProps.releaseList.forEach(releaseObj => releaseObj?.release?.());
      internalProps.releaseList = null;
    }

    this.scenegraph.stage.release();
    this.scenegraph.proxy.release();

    internalProps.focusControl.release();
    const { parentElement } = internalProps.element;
    if (parentElement && !this.options.canvas) {
      parentElement.removeChild(internalProps.element);
    }
    (this as any).editorManager?.editingEditor?.onEnd?.();
    this.isReleased = true;
    this.scenegraph = null;
    this.internalProps = null;

    this.reactCustomLayout?.clearCache();
  }

  fireListeners<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    event: TableEventHandlersEventArgumentMap[TYPE]
  ): TableEventHandlersReturnMap[TYPE][] {
    return super.fireListeners(type, event);
  }

  /**
   * 更新options 目前只支持全量更新
   * @param options
   */
  updateOption(options: BaseTableConstructorOptions) {
    (this.options as BaseTable['options']) = options;
    this._hasAutoImageColumn = undefined;
    const {
      // rowCount = 0,
      // colCount = 0,
      frozenColCount = 0,
      unfreezeAllOnExceedsMaxWidth,
      // frozenRowCount = 0,
      defaultRowHeight = 40,
      defaultHeaderRowHeight,
      defaultColWidth = 80,
      defaultHeaderColWidth = 80,
      keyboardOptions,
      eventOptions,
      rowSeriesNumber,
      // columnSeriesNumber,
      // disableRowHeaderColumnResize,
      columnResizeMode,
      rowResizeMode = 'none',
      resize,
      dragHeaderMode,

      // scrollBar,
      showFrozenIcon,
      allowFrozenColCount,
      padding,
      hover,
      menu,
      select: click,
      pixelRatio,
      widthMode,
      heightMode,
      autoFillWidth,
      autoFillHeight,
      widthAdaptiveMode,
      heightAdaptiveMode,
      customRender,
      renderChartAsync,
      renderChartAsyncBatchCount,
      canvasWidth,
      canvasHeight,
      overscrollBehavior,
      limitMinWidth,
      limitMinHeight
    } = options;
    if (pixelRatio && pixelRatio !== this.internalProps.pixelRatio) {
      this.internalProps.pixelRatio = pixelRatio;
    }
    // 更新padding
    if (padding) {
      if (typeof padding === 'number') {
        this.padding.top = padding;
        this.padding.left = padding;
        this.padding.bottom = padding;
        this.padding.right = padding;
      } else {
        padding.top && (this.padding.top = padding.top);
        padding.bottom && (this.padding.bottom = padding.bottom);
        padding.left && (this.padding.left = padding.left);
        padding.right && (this.padding.right = padding.right);
      }
    }
    this.showFrozenIcon = typeof showFrozenIcon === 'boolean' ? showFrozenIcon : true;
    if (typeof allowFrozenColCount === 'number' && allowFrozenColCount <= 0) {
      this.showFrozenIcon = false;
    }

    this.widthMode = widthMode ?? 'standard';
    this.heightMode = heightMode ?? 'standard';
    this._widthAdaptiveMode = widthAdaptiveMode ?? 'only-body';
    this._heightAdaptiveMode = heightAdaptiveMode ?? 'only-body';
    this.autoFillWidth = autoFillWidth ?? false;
    this.autoFillHeight = autoFillHeight ?? false;
    this.customRender = customRender;
    this.canvasWidth = isNumber(canvasWidth) ? canvasWidth : undefined;
    this.canvasHeight = isNumber(canvasHeight) ? canvasHeight : undefined;
    // 更新protectedSpace
    const internalProps: IBaseTableProtected = this.internalProps;
    if (Env.mode !== 'node' && !options.canvas) {
      updateRootElementPadding(internalProps.element, this.padding);
    }

    this.columnWidthComputeMode = options.columnWidthComputeMode ?? 'normal';

    // internalProps.rowCount = rowCount;
    // internalProps.colCount = colCount;
    internalProps.frozenColCount = frozenColCount;
    internalProps.unfreezeAllOnExceedsMaxWidth = unfreezeAllOnExceedsMaxWidth ?? true;
    // internalProps.frozenRowCount = frozenRowCount;
    internalProps.defaultRowHeight = defaultRowHeight;
    internalProps.defaultHeaderRowHeight = defaultHeaderRowHeight ?? defaultRowHeight;
    internalProps.defaultColWidth = defaultColWidth;
    internalProps.defaultHeaderColWidth = defaultHeaderColWidth ?? defaultColWidth;
    internalProps.keyboardOptions = keyboardOptions;
    internalProps.eventOptions = eventOptions;
    internalProps.rowSeriesNumber = rowSeriesNumber;
    // internalProps.columnSeriesNumber = columnSeriesNumber;

    internalProps.columnResizeMode = resize?.columnResizeMode ?? columnResizeMode;
    internalProps.rowResizeMode = resize?.rowResizeMode ?? rowResizeMode;
    internalProps.dragHeaderMode = dragHeaderMode ?? 'none';
    internalProps.renderChartAsync = renderChartAsync;
    setBatchRenderChartCount(renderChartAsyncBatchCount);
    internalProps.overscrollBehavior = overscrollBehavior ?? 'auto';
    internalProps.cellTextOverflows = {};
    internalProps._rowHeightsMap = new NumberRangeMap(this);
    internalProps._rowRangeHeightsMap = new Map();
    internalProps._colRangeWidthsMap = new Map();

    internalProps._widthResizedColMap = new Set();
    internalProps._heightResizedRowMap = new Set();

    this.colWidthsMap = new NumberMap();
    this.colContentWidthsMap = new NumberMap();
    this.colWidthsLimit = {};

    internalProps.stick.changedCells.clear();

    internalProps.theme = themes.of(options.theme ?? themes.DEFAULT);
    internalProps.theme.isPivot = this.isPivotTable();
    setIconColor(internalProps.theme.functionalIconsStyle);
    this.scenegraph.updateStageBackground();
    // this._updateSize();
    //设置是否自动撑开的配置
    // internalProps.autoRowHeight = options.autoRowHeight ?? false;
    //是否统一设置为多行文本
    internalProps.autoWrapText = options.autoWrapText;
    internalProps.enableLineBreak = options.enableLineBreak;
    internalProps.allowFrozenColCount = options.allowFrozenColCount ?? 0;
    internalProps.limitMaxAutoWidth = options.limitMaxAutoWidth ?? 450;
    internalProps.limitMinWidth =
      limitMinWidth !== null && limitMinWidth !== undefined
        ? typeof limitMinWidth === 'number'
          ? limitMinWidth
          : limitMinWidth
          ? 10
          : 0
        : 10;
    internalProps.limitMinHeight =
      limitMinHeight !== null && limitMinHeight !== undefined
        ? typeof limitMinHeight === 'number'
          ? limitMinHeight
          : limitMinHeight
          ? 10
          : 0
        : 10;
    // 生成scenegraph
    // this._vDataSet = new DataSet();
    internalProps.legends?.forEach(legend => {
      legend?.release();
    });
    internalProps.title?.release();
    internalProps.title = null;
    internalProps.emptyTip?.release();
    internalProps.emptyTip = null;
    internalProps.layoutMap.release();
    this.scenegraph.clearCells();
    this.scenegraph.updateComponent();
    this.stateManager.updateOptionSetState();

    this._updateSize();
    // this.stateManager = new StateManager(this);
    // this.eventManager = new EventManager(this);
    this.eventManager.updateEventBinder();
    if (options.legends) {
      internalProps.legends = [];
      const createLegend = Factory.getFunction('createLegend') as CreateLegend;
      if (Array.isArray(options.legends)) {
        for (let i = 0; i < options.legends.length; i++) {
          internalProps.legends.push(createLegend(options.legends[i], this));
        }
        this.scenegraph.tableGroup.setAttributes({
          x: this.tableX,
          y: this.tableY
        });
      } else {
        internalProps.legends.push(createLegend(options.legends, this));
        this.scenegraph.tableGroup.setAttributes({
          x: this.tableX,
          y: this.tableY
        });
      }
    }
    // if (options.title) {
    //   internalProps.title = new Title(options.title, this);
    //   this.scenegraph.tableGroup.setAttributes({
    //     x: this.tableX,
    //     y: this.tableY
    //   });
    // }
    internalProps.tooltip = Object.assign(
      {
        parentElement: this.getElement(),
        renderMode: 'html',
        isShowOverflowTextTooltip: false,
        confine: true,
        position: Placement.bottom
      },
      options.tooltip
    );
    if (internalProps.tooltip.renderMode === 'html' && !internalProps.tooltipHandler) {
      const TooltipHandler = Factory.getComponent('tooltipHandler') as ITooltipHandler;
      internalProps.tooltipHandler = new TooltipHandler(this, internalProps.tooltip.confine);
    }

    internalProps.menu = Object.assign(
      {
        renderMode: 'html'
      },
      options.menu
    );

    Array.isArray(options.menu?.dropDownMenuHighlight) &&
      this.setDropDownMenuHighlight(options.menu?.dropDownMenuHighlight);

    // 全局下拉菜单
    (Array.isArray(options.menu?.defaultHeaderMenuItems) ||
      typeof options.menu?.defaultHeaderMenuItems === 'function') &&
      (this.globalDropDownMenu = options.menu.defaultHeaderMenuItems);

    if (internalProps.menu.renderMode === 'html' && !internalProps.menuHandler) {
      const MenuHandler = Factory.getComponent('menuHandler') as IMenuHandler;
      internalProps.menuHandler = new MenuHandler(this);
    }
    this.clearCellStyleCache();
    this.clearColWidthCache();
    this.clearRowHeightCache();

    internalProps.customMergeCell = getCustomMergeCellFunc(options.customMergeCell);

    this.customCellStylePlugin?.updateCustomCell(
      options.customCellStyle ?? [],
      options.customCellStyleArrangement ?? []
    );
    this._adjustCanvasSizeByOption();
  }
  /**
   * 重新创建场景树并重新渲染
   */
  renderWithRecreateCells() {
    this.internalProps.stick.changedCells.clear();
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.refreshHeader();
    this.internalProps.useOneRowHeightFillAll = false;
    this.scenegraph.clearCells();
    this.clearCellStyleCache();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    this.render();
  }
  /**
   * 获取固定行总高
   * @returns
   */
  getFrozenRowsHeight(): number {
    const height = this.getRowsHeight(0, this.frozenRowCount - 1);
    return height;
  }
  /**
   * 获取固定列总宽
   * @returns
   */
  getFrozenColsWidth(): number {
    const w = this.getColsWidth(0, this.frozenColCount - 1);
    return w;
  }
  /**
   * 获取底部冻结固定列总宽
   * @returns
   */
  getBottomFrozenRowsHeight(): number {
    if (this.bottomFrozenRowCount > 0) {
      // const height = this.getRowsHeight(this.rowCount - this.bottomFrozenRowCount, this.rowCount - 1);//替换成下面遍历获取高度，鉴于冻结数量有限。否则这里在初始化的时候ClipBodyGroupBeforeRenderContribution.drawShap就先走了这个计算，导致初始化时间加长，而后续计算行高列宽会清除这个计算结果，浪费了性能
      let height = 0;
      for (let row = this.rowCount - this.bottomFrozenRowCount; row <= this.rowCount - 1; row++) {
        height += this.getRowHeight(row);
      }
      return height;
    }
    return 0;
  }
  /**
   * 获取右侧冻结固定列总宽
   * @returns
   */
  getRightFrozenColsWidth(): number {
    if (this.rightFrozenColCount > 0) {
      // const width = this.getColsWidth(this.colCount - this.rightFrozenColCount, this.colCount - 1); // 同getBottomFrozenRowsHeight的原因
      let width = 0;
      for (let col = this.colCount - this.rightFrozenColCount; col <= this.colCount - 1; col++) {
        width += this.getColWidth(col);
      }
      return width;
    }
    return 0;
  }
  /**
   * 获取实际绘制范围的宽高，而非可绘制画布大小
   * @param table
   * @returns
   */
  getDrawRange(): Rect {
    //考虑表格整体边框的问题
    // const lineWidths = toBoxArray(this.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
    // const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
    const width = Math.min(this.tableNoFrameWidth, this.getAllColsWidth());
    const height = Math.min(this.tableNoFrameHeight, this.getAllRowsHeight());
    // Math.max(lineWidths[3] ?? 0, shadowWidths[3] ?? 0),
    // Math.max(lineWidths[1] ?? 0, shadowWidths[1] ?? 0),
    return new Rect(this.tableX, this.tableY, width, height);
  }

  /** @private  将鼠标坐标值 转换成表格坐标系中的坐标位置
   * isAddScroll默认为true 返回的xy 加上了scrollX和scrollY。如滚动后通过该方法计算出的坐标值是未滚动时的坐标
   */
  _getMouseAbstractPoint(
    evt: TouchEvent | MouseEvent | undefined,
    isAddScroll = true
  ): { x: number; y: number; inTable: boolean } {
    const table = this;
    let e: MouseEvent | Touch;
    if (!evt) {
      return { inTable: false, x: undefined, y: undefined };
    }
    if (isTouchEvent(evt)) {
      e = evt.changedTouches[0];
    } else {
      e = evt;
    }
    const clientX = e.clientX || e.pageX + window.scrollX;
    const clientY = e.clientY || e.pageY + window.scrollY;
    const rect = table.internalProps.canvas.getBoundingClientRect();
    let inTable = true;
    if (rect.right <= clientX) {
      inTable = false;
    }
    if (rect.bottom <= clientY) {
      inTable = false;
    }

    const currentWidth = rect.width;
    const originWidth = this.canvas.offsetWidth || currentWidth;
    const widthRatio = currentWidth / originWidth;

    const currentHeight = rect.height;
    const originHeight = this.canvas.offsetHeight || currentHeight;
    const heightRatio = currentHeight / originHeight;

    const x =
      (clientX - rect.left) / widthRatio + (isAddScroll ? table.scrollLeft : 0) - (this.options.viewBox?.x1 ?? 0);
    const y =
      (clientY - rect.top) / heightRatio + (isAddScroll ? table.scrollTop : 0) - (this.options.viewBox?.y1 ?? 0);
    const point = { x, y, inTable };

    if (this.internalProps.modifiedViewBoxTransform && this.scenegraph.stage.window.getViewBoxTransform()) {
      const transform = this.scenegraph.stage.window.getViewBoxTransform();
      transform.transformPoint(point, point);
    }
    return point;
  }
  getTheme() {
    return this.internalProps.theme;
  }

  /**
   * 根据x获取该位置所处列值
   * @param table
   * @param absoluteX
   * @returns
   */
  getTargetColAt(absoluteX: number): ColumnInfo | null {
    return getTargetColAt(absoluteX, this);
  }
  /**
   * 根据y获取该位置所处行值
   * @param table
   * @param absoluteX
   * @returns
   */
  getTargetRowAt(absoluteY: number): RowInfo | null {
    const targetRow = getTargetRowAt(absoluteY, this);
    if (targetRow) {
      targetRow.row = Math.min(targetRow.row, this.rowCount - 1);
    }
    return targetRow;
  }

  /**
   * 根据x获取该位置所处列值
   * @param table
   * @param absoluteX
   * @returns
   */
  getTargetColAtConsiderRightFrozen(absoluteX: number, isConsider: boolean): ColumnInfo | null {
    return getTargetColAtConsiderRightFrozen(absoluteX, isConsider, this);
  }

  /**
   * 根据y获取该位置所处行值
   * @param table
   * @param absoluteX
   * @returns
   */
  getTargetRowAtConsiderBottomFrozen(absoluteY: number, isConsider: boolean): RowInfo | null {
    return getTargetRowAtConsiderBottomFrozen(absoluteY, isConsider, this);
  }

  /**
   * 清除选中单元格
   */
  clearSelected() {
    this.stateManager.updateSelectPos(-1, -1);
  }
  /**
   * 选中单元格  和鼠标选中单元格效果一致
   * @param col
   * @param row
   * @param isShift 是否按住 shift 键
   * @param isCtrl 是否按住 ctrl 键
   * @param makeSelectCellVisible 是否让选中的单元格可见
   * @param skipBodyMerge 是否忽略合并单元格，默认 false针对合并单元自动扩大选取范围
   */
  selectCell(
    col: number,
    row: number,
    isShift?: boolean,
    isCtrl?: boolean,
    makeSelectCellVisible?: boolean,
    skipBodyMerge: boolean = false
  ) {
    const isHasSelected = !!this.stateManager.select.ranges?.length;
    this.stateManager.updateSelectPos(
      col,
      row,
      isShift,
      isCtrl,
      false,
      makeSelectCellVisible ?? this.options.select?.makeSelectCellVisible ?? true,
      skipBodyMerge
    );
    this.stateManager.endSelectCells(true, isHasSelected);
  }
  /**
   * 选中单元格区域，可设置多个区域同时选中
   * @param cellRanges: CellRange[]
   */
  selectCells(cellRanges: CellRange[]) {
    const { scrollLeft, scrollTop } = this;
    cellRanges.forEach((cellRange: CellRange, index: number) => {
      if (cellRange.start.col === cellRange.end.col && cellRange.start.row === cellRange.end.row) {
        this.stateManager.updateSelectPos(
          cellRange.start.col,
          cellRange.start.row,
          false,
          index >= 1,
          false,
          this.options.select?.makeSelectCellVisible ?? true,
          true
        );
      } else {
        this.stateManager.updateSelectPos(
          cellRange.start.col,
          cellRange.start.row,
          false,
          index >= 1,
          false,
          this.options.select?.makeSelectCellVisible ?? true,
          true
        );
        this.stateManager.updateInteractionState(InteractionState.grabing);
        this.stateManager.updateSelectPos(
          cellRange.end.col,
          cellRange.end.row,
          false,
          index >= 1,
          false,
          this.options.select?.makeSelectCellVisible ?? true,
          true
        );
      }
      this.stateManager.endSelectCells(false, false);
      this.stateManager.updateInteractionState(InteractionState.default);
    });
    // 选择后 会自动滚动到所选区域最后一行一列的位置 这里再设置回滚动前位置
    this.setScrollTop(scrollTop);
    this.setScrollLeft(scrollLeft);
  }
  abstract isListTable(): boolean;
  abstract isPivotTable(): boolean;
  abstract isPivotChart(): boolean;

  protected abstract _getSortFuncFromHeaderOption(
    columns: ColumnsDefine | undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): ((v1: any, v2: any, order: string) => 0 | 1 | -1) | undefined;
  abstract setRecords(records: Array<any>, option?: { sortState?: SortState | SortState[] }): void;
  abstract refreshHeader(): void;
  abstract refreshRowColCount(): void;
  abstract getHierarchyState(col: number, row: number): HierarchyState | null;
  abstract toggleHierarchyState(col: number, row: number, recalculateColWidths?: boolean): void;

  abstract getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo;
  abstract _moveHeaderPosition(
    source: CellAddress,
    target: CellAddress
  ): {
    sourceIndex: number;
    targetIndex: any;
    sourceSize: any;
    targetSize: any;
    moveType: 'column' | 'row';
  };
  /** @private */
  // abstract getFieldData(field: FieldDef | FieldFormat | undefined, col: number, row: number): FieldData;
  abstract getRecordShowIndexByCell(col: number, row: number): number;
  abstract getCellOriginRecord(col: number, row: number): MaybePromiseOrUndefined;
  abstract getCellRawRecord(col: number, row: number): MaybePromiseOrUndefined;
  abstract getCellValue(col: number, row: number, skipCustomMerge?: boolean): FieldData;
  abstract getCellOriginValue(col: number, row: number): FieldData;
  abstract getCellRawValue(col: number, row: number): FieldData;

  abstract getTableIndexByRecordIndex(recordIndex: number): number;
  abstract getTableIndexByField(field: FieldDef): number;
  abstract getCellAddrByFieldRecord(field: FieldDef, recordIndex: number): CellAddress;
  /**
   * 更新页码
   * @param pagination 要修改页码的信息
   */
  abstract updatePagination(pagination: IPagination): void;

  abstract _hasCustomRenderOrLayout(): boolean;

  get recordsCount() {
    return this.records?.length;
  }
  get allowFrozenColCount(): number {
    return this.internalProps.allowFrozenColCount;
  }

  /**
   * Get the number of cols that are row header.
   */
  get rowHeaderLevelCount(): number {
    return this.internalProps.layoutMap.rowHeaderLevelCount;
  }
  /**
   * Get the number of rows that are col header.
   */
  get columnHeaderLevelCount(): number {
    return this.internalProps.layoutMap.columnHeaderLevelCount;
  }
  /**
   * Get the records.
   */
  get records(): any {
    return this.internalProps.records;
  }
  /**
   * Get the data source.
   */
  get dataSource(): CachedDataSource | DataSource {
    return this.internalProps.dataSource;
  }
  /**
   * Set the data source from given
   */
  set dataSource(dataSource: CachedDataSource | DataSource) {
    // 清空单元格内容
    this.scenegraph.clearCells();
    _setDataSource(this, dataSource);
    this.refreshRowColCount();
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
    this.render();
  }
  /**
   * Get the autoWrapText.
   */
  get autoWrapText(): boolean {
    return this.internalProps.autoWrapText;
  }
  /**
   * Set the autoWrapText
   */
  set autoWrapText(autoWrapText: boolean) {
    this.internalProps.autoWrapText = autoWrapText;
    this.options.autoWrapText = autoWrapText;
  }
  /**
   * Get the enableLineBreak.
   */
  get enableLineBreak(): boolean {
    return this.internalProps.enableLineBreak;
  }
  /**
   * Set the enableLineBreak
   */
  set enableLineBreak(enableLineBreak: boolean) {
    this.internalProps.enableLineBreak = enableLineBreak;
    this.options.enableLineBreak = enableLineBreak;
  }
  updateAutoWrapText(autoWrapText: boolean) {
    if (this.internalProps.autoWrapText === autoWrapText) {
      return;
    }
    this.internalProps.autoWrapText = autoWrapText;
    this.options.autoWrapText = autoWrapText;
    this.scenegraph.clearCells();
    this.clearCellStyleCache();
    this.scenegraph.createSceneGraph();
    this.render();
    // }
  }

  /**
   * 获取当前使用的主题
   */
  get theme(): TableTheme {
    return this.internalProps.theme;
  }
  set theme(theme: TableTheme) {
    this.internalProps.theme = themes.of(theme ?? themes.DEFAULT);
    this.internalProps.theme.isPivot = this.isPivotTable();
    this.options.theme = theme;
    setIconColor(this.internalProps.theme.functionalIconsStyle);
  }
  /**
   * 设置主题
   */
  updateTheme(theme: ITableThemeDefine) {
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.internalProps.theme = themes.of(theme ?? themes.DEFAULT);
    this.internalProps.theme.isPivot = this.isPivotTable();
    setIconColor(this.internalProps.theme.functionalIconsStyle);
    this.options.theme = theme;
    this.scenegraph.updateComponent();
    this.scenegraph.updateStageBackground();
    this.scenegraph.clearCells();
    this.clearCellStyleCache();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    this.render();
  }

  /**
   * 根据行列号获取对应的字段名
   * @param  {number} col column index.
   * @param  {number} row row index.
   */
  getBodyField(col: number, row: number): FieldDef | undefined {
    return this.internalProps.layoutMap.getBody(col, row).field;
  }
  /**
   * 根据行列号获取配置
   * @param  {number} col column index.
   * @param  {number} row row index.
   * @return {ColumnDefine} The column define object.
   */
  getBodyColumnDefine(col: number, row: number): ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber {
    // TODO: 暂时修复透视表报错
    const body = this.internalProps.layoutMap.getBody(col, row);
    return body?.define;
  }

  getBodyColumnType(col: number, row: number): ColumnTypeOption {
    const cellType = this.internalProps.layoutMap.getBody(col, row)?.cellType ?? 'text';
    return getProp('cellType', { cellType }, col, row, this);
  }

  getCellType(col: number, row: number): ColumnTypeOption {
    let cellType;
    if (this.isSeriesNumberInHeader(col, row)) {
      return (this.internalProps.layoutMap as SimpleHeaderLayoutMap).getSeriesNumberHeader(col, row).cellType;
    } else if (this.isHeader(col, row)) {
      cellType = (this.internalProps.layoutMap.getHeader(col, row) as HeaderData).headerType;
    } else {
      cellType = this.internalProps.layoutMap.getBody(col, row).cellType;
    }
    return getProp('cellType', { cellType }, col, row, this);
  }

  /**
   * 根据行列号获取对应的字段名
   * @param  {number} col column index.
   * @param  {number} row row index.
   */
  getHeaderField(col: number, row: number): FieldDef {
    return this.internalProps.layoutMap.getHeaderField(col, row);
  }
  /**
   * 根据行列号获取配置
   * @param  {number} col column index.
   * @param  {number} row row index.
   * @return {ColumnDefine} The column define object.
   */
  getHeaderDefine(col: number, row: number): ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber {
    const hd = this.internalProps.layoutMap.getHeader(col, row);
    return hd?.define;
  }
  getCellLocation(col: number, row: number): CellLocation {
    const hdType = this.internalProps.layoutMap.getCellLocation(col, row);
    return hdType;
  }
  /**
   * 获取行列表头的路径
   * @param col
   * @param row
   * @returns 返回结构{
  colHeaderPaths?: any[];
  rowHeaderPaths?: any[];
}
   */
  getCellHeaderPaths(col: number, row: number): ICellHeaderPaths {
    const cellHeaderPaths = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
    return cellHeaderPaths;
  }
  /**
   * Get the headers define of the given column.
   * @param  {number} col The column index.
   * @return {*} The array of header define object.
   */
  getHeadersDefine(col: number, row: number): (ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber)[] {
    const headers = [];
    while (true) {
      const header = this.getHeaderDefine(col, row) as ColumnDefine;
      if (header && (header.field || (header as ColumnDefine).columns)) {
        headers.push(header);
      } else {
        break;
      }

      row++;
    }

    return headers;
  }
  _getHeaderLayoutMap(col: number, row: number): HeaderData | SeriesNumberColumnData {
    return this.internalProps.layoutMap.getHeader(col, row);
  }
  _getBodyLayoutMap(col: number, row: number): ColumnData | IndicatorData | SeriesNumberColumnData {
    return this.internalProps.layoutMap.getBody(col, row);
  }
  /** 获取绘制画布的canvas上下文 */
  getContext(): CanvasRenderingContext2D {
    return this.internalProps.context;
  }
  /**
   * 根据行列号获取整条数据记录
   * @param  {number} col col index.
   * @param  {number} row row index.
   * @return {object} record.
   */
  getRecordByCell(col: number, row: number): MaybePromiseOrUndefined {
    if (this.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    return this.getCellOriginRecord(col, row);
  }
  /** @deprecated 请使用getRecordByCell */
  getRecordByRowCol(col: number, row: number) {
    return this.getRecordByCell(col, row);
  }

  /**
   * 根据数据的索引获取应该显示在body的第几行
   * @param  {number} index The record index.
   */
  getRecordStartRowByRecordIndex(index: number): number {
    return this.internalProps.layoutMap.getRecordStartRowByRecordIndex(index);
  }
  /**
   * 根据给定的排序状态 获取对应的表格单元格信息
   * @param sortState
   * @returns
   */
  _getHeaderCellBySortState(sortState: SortState): CellAddress | undefined {
    const { layoutMap } = this.internalProps;
    const hd = layoutMap.headerObjects.find((col: any) => col && col.field === sortState.field);
    if (hd) {
      const headercell = layoutMap.getHeaderCellAdressById(hd.id as number);
      return headercell;
    }
    return undefined;
  }

  /**
   * 获取给定单元格的范围 如果是合并单元格,则返回合并单元格的范围
   */
  getCellRange(col: number, row: number): CellRange {
    if (this.internalProps.customMergeCell) {
      const customMerge = this.internalProps.customMergeCell(col, row, this);
      if (
        customMerge &&
        customMerge.range &&
        (isValid(customMerge.text) || customMerge.customLayout || customMerge.customRender)
      ) {
        return customMerge.range;
      }
    }
    return this.internalProps.layoutMap?.getCellRange(col, row);
  }

  hasCustomMerge() {
    return !!this.internalProps.customMergeCell;
  }

  getCustomMerge(col: number, row: number) {
    if (this.internalProps.customMergeCell) {
      const customMerge = this.internalProps.customMergeCell(col, row, this);
      if (
        customMerge &&
        customMerge.range &&
        (isValid(customMerge.text) || customMerge.customLayout || this.customRender)
      ) {
        if (customMerge.style) {
          const styleClass = this.internalProps.bodyHelper.getStyleClass('text');
          const style = customMerge.style;
          const fullStyle = <FullExtendStyle>columnStyleContents.of(
            style,
            this.theme.bodyStyle,
            {
              col,
              row,
              table: this,
              value: customMerge.text,
              dataValue: this.getCellOriginValue(col, row),
              cellHeaderPaths: this.getCellHeaderPaths(col, row)
            },
            styleClass,
            this.options.autoWrapText,
            this.theme
          );
          customMerge.style = fullStyle;
        }
        return customMerge;
      }
    }
    return undefined;
  }

  /**
   * 判断两个单元格是否是属于同一个合并区域
   * @param col
   * @param row
   * @param targetCol
   * @param targetRow
   * @returns
   */
  isCellRangeEqual(col: number, row: number, targetCol: number, targetRow: number): boolean {
    return this.internalProps.layoutMap.isCellRangeEqual(col, row, targetCol, targetRow);
  }
  /**
   * 根据行列号获取布局id
   * @param col
   * @param row
   * @returns
   */
  _getLayoutCellId(col: number, row: number): LayoutObjectId {
    return this.internalProps.layoutMap.getCellId(col, row);
  }
  /**
   * 获取表头的描述信息
   * @param col
   * @param row
   * @returns
   */
  getHeaderDescription(col: number, row: number): string | undefined {
    const field = this._getHeaderLayoutMap(col, row);
    const fieldDef = field?.define;
    const description = (fieldDef as ColumnDefine)?.description ?? (field as HeaderData)?.description;
    if (typeof description === 'function') {
      const arg: CellInfo = {
        col,
        row,
        value: this.getCellValue(col, row),
        dataValue: this.getCellOriginValue(col, row)
      };
      return description(arg);
    }
    return description;
  }

  setDropDownMenuHighlight(cells: DropDownMenuHighlightInfo[]): void {
    this.stateManager.setDropDownMenuHighlight(cells);
  }
  _dropDownMenuIsHighlight(colNow: number, rowNow: number, index: number): boolean {
    return this.stateManager.dropDownMenuIsHighlight(colNow, rowNow, index);
  }
  /** 判断单元格是否属于序号body部分 */
  isSeriesNumberInBody(col: number, row: number): boolean {
    return (
      this.internalProps.layoutMap &&
      (this.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInBody(col, row)
    );
  }
  /** 判断单元格是否属于序号表头部分 */
  isSeriesNumberInHeader(col: number, row: number): boolean {
    return (
      this.internalProps.layoutMap &&
      (this.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumberInHeader(col, row)
    );
  }
  /** 判断单元格是否属于表头部分 */
  isHeader(col: number, row: number): boolean {
    return this.internalProps.layoutMap && this.internalProps.layoutMap.isHeader(col, row);
  }
  /** 判断单元格是否属于列表头部分 */
  isColumnHeader(col: number, row: number): boolean {
    return this.internalProps.layoutMap?.isColumnHeader(col, row);
  }
  /** 判断单元格是否属于行表头部分 */
  isRowHeader(col: number, row: number): boolean {
    return this.internalProps.layoutMap?.isRowHeader(col, row);
  }
  /** 判断单元格是否属于角表头部分 */
  isCornerHeader(col: number, row: number): boolean {
    return this.internalProps.layoutMap?.isCornerHeader(col, row);
  }
  /**
   * 是否属于冻结左侧列
   * @param col
   * @param row 不传的话 只需要判断col，传入row的话非冻结角头部分的才返回true
   * @returns
   */
  isFrozenColumn(col: number, row?: number): boolean {
    return this.isLeftFrozenColumn(col, row) || this.isRightFrozenColumn(col, row);
  }
  /**
   * 是否属于冻结左侧列
   * @param col
   * @param row 不传的话 只需要判断col，传入row的话非冻结角头部分的才返回true
   * @returns
   */
  isLeftFrozenColumn(col: number, row?: number): boolean {
    return this.internalProps.layoutMap?.isFrozenColumn(col, row);
  }
  /**
   * 是否属于右侧冻结列
   * @param col
   * @param row 不传的话 只需要判断col，传入row的话非冻结角头部分的才返回true
   * @returns
   */
  isRightFrozenColumn(col: number, row?: number): boolean {
    return this.internalProps.layoutMap?.isRightFrozenColumn(col, row);
  }

  /**
   * 是否属于冻结顶部行
   * @param col 只传入col一个值的话 会被当做row
   * @param row 不传的话只需要判断col（其实会当做row）；传入两个值的话非冻结角头部分的才返回true
   * @returns
   */
  isFrozenRow(col: number, row?: number): boolean {
    return this.isTopFrozenRow(col, row) || this.isBottomFrozenRow(col, row);
  }
  /**
   * 是否属于冻结顶部行
   * @param col 只传入col一个值的话 会被当做row
   * @param row 不传的话只需要判断col（其实会当做row）；传入两个值的话非冻结角头部分的才返回true
   * @returns
   */
  isTopFrozenRow(col: number, row?: number): boolean {
    return this.internalProps.layoutMap?.isFrozenRow(col, row);
  }
  /**
   * 是否属于冻结底部行
   * @param col 只传入col一个值的话 会被当做row
   * @param row 不传的话只需要判断col（其实会当做row）；传入两个值的话非冻结角头部分的才返回true
   * @returns
   */
  isBottomFrozenRow(col: number, row?: number): boolean {
    return this.internalProps.layoutMap?.isBottomFrozenRow(col, row);
  }
  /** 获取单元格的基本信息 目前主要组织单元格信息给事件传递给用户的参数使用 */
  getCellInfo(col: number, row: number): Omit<MousePointerCellEvent, 'target'> {
    if (col >= 0 && row >= 0) {
      const colDef = this.isHeader(col, row) ? this.getHeaderDefine(col, row) : this.getBodyColumnDefine(col, row);
      return {
        col,
        row,
        field: this.getHeaderField(col, row),
        cellHeaderPaths: this.internalProps.layoutMap.getCellHeaderPaths(col, row),
        title: colDef?.title,
        cellType: this.getCellType(col, row),
        originData: this.getCellOriginRecord(col, row),
        cellRange: this.getCellRangeRelativeRect({ col, row }),
        value: this.getCellValue(col, row),
        dataValue: this.getCellOriginValue(col, row),
        cellLocation: this.getCellLocation(col, row),
        scaleRatio: this.canvas.getBoundingClientRect().width / this.canvas.offsetWidth
      };
    }
    return undefined;
  }
  /** @private */
  _hasField(field: FieldDef, col: number, row: number): boolean {
    if (field === null) {
      return false;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return false;
    }
    const index = table.getRecordShowIndexByCell(col, row);
    return table.internalProps.dataSource?.hasField(index, field);
  }
  /**
   * 获取单元格的样式 内部逻辑使用 获取到的样式并不是计算后的
   * @param col
   * @param row
   * @returns
   */
  _getCellStyle(col: number, row: number): FullExtendStyle {
    return getCellStyle(col, row, this);
  }
  clearCellStyleCache() {
    this.headerStyleCache.clear();
    this.bodyStyleCache.clear();
    this.bodyMergeTitleCache.clear();
    this.bodyBottomStyleCache.clear();

    // this._newRowHeightsMap.clear();
  }
  /**
   * 清除行高度缓存对象
   */
  clearRowHeightCache() {
    this.internalProps._rowHeightsMap.clear();
    this._clearRowRangeHeightsMap();
  }
  /**
   * 清除列宽度缓存对象
   */
  clearColWidthCache() {
    this.internalProps._colWidthsMap.clear();
    this._clearColRangeWidthsMap();
  }
  /**
   * 该列是否可调整列宽
   * @param col
   * @param row
   * @returns
   */
  _canResizeColumn(col: number, row: number): boolean {
    if (!(col >= 0 && row >= 0)) {
      return false;
    }
    if (this.isCellRangeEqual(col, row, col + 1, row)) {
      return false;
    }

    if (this.internalProps.columnResizeMode === 'none') {
      return false;
    } else if (this.internalProps.columnResizeMode === 'header') {
      // 判断表头
      if (!this.isHeader(col, row)) {
        return false;
      }
    } else if (this.internalProps.columnResizeMode === 'body') {
      // 判断内容
      if (this.isHeader(col, row)) {
        return false;
      }
    }

    // if (this.rightFrozenColCount && col >= this.colCount - this.rightFrozenColCount - 1) {
    //   // right frozen columns can not resize temply
    //   return false;
    // }

    const limit = this.colWidthsLimit[col];
    if (!limit || !limit.min || !limit.max) {
      return true;
    }
    return limit.max !== limit.min;
  }

  /**
   * 该列是否可调整列宽
   * @param col
   * @param row
   * @returns
   */
  _canResizeRow(col: number, row: number): boolean {
    if (!(col >= 0 && row >= 0)) {
      return false;
    }
    if (this.isCellRangeEqual(col, row, col, row + 1)) {
      return false;
    }

    if (this.internalProps.rowResizeMode === 'none') {
      return false;
    } else if (this.internalProps.rowResizeMode === 'header') {
      // 判断表头
      if (!this.isHeader(col, row)) {
        return false;
      }
    } else if (this.internalProps.rowResizeMode === 'body') {
      // 判断内容
      if (this.isHeader(col, row)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 选中位置是否可拖拽调整位置
   * @param col
   * @returns
   */
  _canDragHeaderPosition(col: number, row: number): boolean {
    if (
      this.isHeader(col, row) &&
      (this.stateManager.isSelected(col, row) ||
        (this.options.select?.headerSelectMode === 'body' &&
          checkCellInSelect(col, row, [
            this.getCellRange(this.stateManager.select.cellPos.col, this.stateManager.select.cellPos.row)
          ])) ||
        isCellDisableSelect(this, col, row))
    ) {
      if (this.internalProps.frozenColDragHeaderMode === 'disabled' && this.isFrozenColumn(col)) {
        return false;
      }
      if (this.stateManager.isSelected(col, row)) {
        const selectRange = this.stateManager.select.ranges[0];
        //判断是否整行或者整列选中
        if (this.isColumnHeader(col, row)) {
          if (selectRange.end.row !== this.rowCount - 1) {
            return false;
          }
        } else if (this.isRowHeader(col, row)) {
          if (selectRange.end.col !== this.colCount - 1) {
            return false;
          }
        } else {
          return false;
        }
      }
      const define = this.getHeaderDefine(col, row);
      if (!define) {
        return false;
      }
      if ((define as ColumnDefine).dragHeader === undefined) {
        if (this.internalProps.dragHeaderMode === 'all') {
          return true;
        } else if (this.internalProps.dragHeaderMode === 'column') {
          if (this.isColumnHeader(col, row)) {
            return true;
          }
        } else if (this.internalProps.dragHeaderMode === 'row') {
          if (this.isRowHeader(col, row)) {
            return true;
          }
        }
        return false;
      }
      return (define as ColumnDefine).dragHeader;
    }
    return false;
  }

  /**
   * 获取某个单元格所配置的所有图标
   */
  getCellIcons(col: number, row: number): ColumnIconOption[] {
    let icons;
    if (this.isHeader(col, row)) {
      icons = this.internalProps.headerHelper.getIcons(col, row);
    } else if ((this.internalProps.layoutMap as SimpleHeaderLayoutMap).isSeriesNumber(col, row)) {
      if (!(this.options as ListTableConstructorOptions).groupBy || !this.getCellRawRecord(col, row)?.vtableMerge) {
        const dragOrder = (this.internalProps.layoutMap as SimpleHeaderLayoutMap).getSeriesNumberBody(col, row)?.define
          ?.dragOrder;
        if (dragOrder) {
          icons = this.internalProps.rowSeriesNumberHelper.getIcons(col, row);
        }
      }
      const cellValue = this.getCellValue(col, row);
      const dataValue = this.getCellOriginValue(col, row);

      const ctx = this.internalProps.context;
      const cellIcon = this.internalProps.bodyHelper.getIcons(col, row, cellValue, dataValue, ctx);
      if (icons?.length > 0) {
        icons = icons.concat(cellIcon);
      } else if (cellIcon?.length > 0) {
        icons = cellIcon;
      }
    } else {
      const cellValue = this.getCellValue(col, row);
      const dataValue = this.getCellOriginValue(col, row);
      const ctx = this.internalProps.context;
      icons = this.internalProps.bodyHelper.getIcons(col, row, cellValue, dataValue, ctx);
    }
    return icons;
  }

  /** 指定某个单元格显示下拉菜单【内容可以自定义为menu数组或者dom】 */
  showDropDownMenu(col: number, row: number, dropDownMenuOptions?: DropDownMenuOptions) {
    let menuType: MenuInstanceType = 'dropdown-menu';
    if (dropDownMenuOptions) {
      menuType = Array.isArray(dropDownMenuOptions.content) ? 'dropdown-menu' : 'container';
    }
    if (this.internalProps.menu.renderMode === 'html') {
      this.stateManager.menu.isShow = true;
      this.internalProps.menuHandler._bindToCell(col, row, menuType, dropDownMenuOptions);
    }
    // this.stateManager.showDropDownMenu(col,row,) //最好和这个保持一致
  }
  /** 暂时只支持全局设置了tooltip.renderMode='html'，调用该接口才有效 */
  showTooltip(col: number, row: number, tooltipOptions?: TooltipOptions) {
    // this.drawHoverIconTooltip();
    if (this.internalProps.tooltip.renderMode === 'html') {
      this.internalProps.tooltipHandler._bindToCell(col, row, tooltipOptions);
    }
  }
  /**
   * 获取某个单元格的样式 供业务方调用
   * @param col
   * @param row
   */
  getCellStyle(col: number, row: number): CellStyle {
    const actStyle = this._getCellStyle(col, row);

    const theme = getStyleTheme(actStyle, this, col, row, getProp).theme;

    const { autoWrapText, lineClamp, textOverflow } = actStyle;

    return {
      textAlign: theme.text.textAlign,
      textBaseline: theme.text.textBaseline,
      bgColor: isBoolean(theme.group.fill)
        ? getProp('bgColor', actStyle, col, row, this)
        : (theme.group.fill as string),
      color: isBoolean(theme.text.fill) ? getProp('color', actStyle, col, row, this) : (theme.text.fill as string),
      strokeColor: isBoolean(theme.text.stroke)
        ? getProp('strokeColor', actStyle, col, row, this)
        : (theme.text.stroke as string),
      fontFamily: theme.text.fontFamily,
      fontSize: theme.text.fontSize,
      fontWeight: theme.text.fontWeight,
      fontVariant: theme.text.fontVariant,
      fontStyle: theme.text.fontStyle,
      lineHeight: theme.text.lineHeight as number,
      autoWrapText: autoWrapText ?? false,
      lineClamp: lineClamp ?? 'auto',
      textOverflow,
      borderColor: isBoolean(theme.group.stroke)
        ? getProp('borderColor', actStyle, col, row, this)
        : (theme.group.stroke as string | string[]),
      borderLineWidth: theme.group.lineWidth,
      borderLineDash: theme.group.lineDash,
      underline: !!theme.text.underline,
      // underlineColor: theme.text.underlineColor,
      underlineDash: theme.text.underlineDash,
      underlineOffset: theme.text.underlineOffset,
      lineThrough: !!theme.text.lineThrough,
      // lineThroughColor: theme.text.lineThroughColor,
      // lineThroughDash: (theme.text as any).lineThroughDash
      padding: theme._vtable.padding,
      underlineWidth: theme.text.underline,
      lineThroughLineWidth: theme.text.lineThrough,
      _strokeArrayWidth: (theme.group as any).strokeArrayWidth,
      _strokeArrayColor: (theme.group as any).strokeArrayColor,
      _linkColor: getProp('linkColor', actStyle, col, row, this)
    };
  }
  /**
   * 获取所有body单元格数据信息
   * @param colMaxCount 限制获取最多列数
   * @param rowMaxCount 限制获取最多行数
   * @returns CellInfo[][]
   */
  getAllBodyCells(colMaxCount?: number, rowMaxCount?: number): CellInfo[][] {
    const start = { col: this.rowHeaderLevelCount, row: this.columnHeaderLevelCount };
    const end = { col: this.colCount - 1, row: this.rowCount - 1 };
    return Array(Math.min(rowMaxCount ?? 2000, end.row - start.row + 1, this.rowCount))
      .fill(0)
      .map((_, i) =>
        Array(Math.min(colMaxCount ?? 2000, end.col - start.col + 1, this.colCount))
          .fill(0)
          .map((_, j) => this.getCellInfo(j + start.col, i + start.row))
      );
  }
  /**
   * 获取所有单元格数据信息
   * @param colMaxCount 限制获取最多列数
   * @param rowMaxCount 限制获取最多行数
   * @returns CellInfo[][]
   */
  getAllCells(colMaxCount?: number, rowMaxCount?: number): CellInfo[][] {
    const start = { col: 0, row: 0 };
    const end = { col: this.colCount - 1, row: this.rowCount - 1 };
    return Array(Math.min(rowMaxCount ?? 2000, end.row - start.row + 1, this.rowCount))
      .fill(0)
      .map((_, i) =>
        Array(Math.min(colMaxCount ?? 2000, end.col - start.col + 1, this.colCount))
          .fill(0)
          .map((_, j) => this.getCellInfo(j + start.col, i + start.row))
      );
  }
  /**
   * 获取所有列表头单元格数据信息
   * @returns CellInfo[][]
   */
  getAllColumnHeaderCells(): CellInfo[][] {
    const start = { col: this.rowHeaderLevelCount, row: 0 };
    const end = { col: this.colCount - 1, row: this.columnHeaderLevelCount - 1 };
    return Array(end.row - start.row + 1)
      .fill(0)
      .map((_, i) =>
        Array(end.col - start.col + 1)
          .fill(0)
          .map((_, j) => this.getCellInfo(j + start.col, i + start.row))
      );
  }
  /**
   * 获取所有行表头单元格数据信息
   * @returns CellInfo[][]
   */
  getAllRowHeaderCells(): CellInfo[][] {
    const start = { col: 0, row: this.columnHeaderLevelCount };
    const end = { col: this.rowHeaderLevelCount - 1, row: this.rowCount - 1 };
    return Array(end.row - start.row + 1)
      .fill(0)
      .map((_, i) =>
        Array(end.col - start.col + 1)
          .fill(0)
          .map((_, j) => this.getCellInfo(j + start.col, i + start.row))
      );
  }

  /**获取选中区域的内容 作为复制内容 */
  getCopyValue(): string | null {
    if (this.stateManager.select?.ranges?.length > 0) {
      const ranges = this.stateManager.select.ranges;
      let minCol = Math.min(ranges[0].start.col, ranges[0].end.col);
      let maxCol = Math.max(ranges[0].start.col, ranges[0].end.col);
      let minRow = Math.min(ranges[0].start.row, ranges[0].end.row);
      let maxRow = Math.max(ranges[0].start.row, ranges[0].end.row);
      ranges.forEach((a: CellRange) => {
        minCol = Math.min(minCol, a.start.col, a.end.col);
        maxCol = Math.max(maxCol, a.start.col, a.end.col);
        minRow = Math.min(minRow, a.start.row, a.end.row);
        maxRow = Math.max(maxRow, a.start.row, a.end.row);
        // return a.start.row - b.start.row || a.start.col - b.start.col
      });
      const isExistDataInRow = (r: number) => {
        let isExist = false;
        ranges.forEach((range: CellRange) => {
          const minRow = Math.min(range.start.row, range.end.row);
          const maxRow = Math.max(range.start.row, range.end.row);
          if (minRow <= r && maxRow >= r) {
            isExist = true;
          }
        });
        return isExist;
      };
      const isExistDataInCol = (c: number) => {
        let isExist = false;
        ranges.forEach((range: CellRange) => {
          const minCol = Math.min(range.start.col, range.end.col);
          const maxCol = Math.max(range.start.col, range.end.col);
          if (minCol <= c && maxCol >= c) {
            isExist = true;
          }
        });
        return isExist;
      };

      const getRangeExistDataInCell = (c: number, r: number) => {
        let isExistRange;
        ranges.forEach((range: CellRange) => {
          const minRow = Math.min(range.start.row, range.end.row);
          const maxRow = Math.max(range.start.row, range.end.row);
          const minCol = Math.min(range.start.col, range.end.col);
          const maxCol = Math.max(range.start.col, range.end.col);
          if (minCol <= c && maxCol >= c && minRow <= r && maxRow >= r) {
            isExistRange = range;
          }
        });
        return isExistRange;
      };
      const getCopyCellValue = (col: number, row: number, range?: CellRange): string | Promise<string> | void => {
        const cellRange = this.getCellRange(col, row);
        let copyStartCol = cellRange.start.col;
        let copyStartRow = cellRange.start.row;
        if (range) {
          const rangeMinCol = Math.min(range.start.col, range.end.col);
          const rangeMinRow = Math.min(range.start.row, range.end.row);
          copyStartCol = Math.max(rangeMinCol, cellRange.start.col);
          copyStartRow = Math.max(rangeMinRow, cellRange.start.row);
        }

        if (copyStartCol !== col || copyStartRow !== row) {
          return '';
        }

        const value = this.getCellValue(col, row);
        return value;
      };
      let copyValue = '';

      for (let r = minRow; r <= maxRow; r++) {
        const isExistData = isExistDataInRow(r);
        if (isExistData) {
          for (let c = minCol; c <= maxCol; c++) {
            const isExistDataCol = isExistDataInCol(c);
            if (isExistDataCol) {
              const range: CellRange | undefined = getRangeExistDataInCell(c, r);
              if (range) {
                const copyCellValue = getCopyCellValue(c, r, range);
                if (typeof Promise !== 'undefined' && copyCellValue instanceof Promise) {
                  //无法获取异步数据
                } else {
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  const strCellValue = isValid(copyCellValue) ? `${copyCellValue}` : '';
                  if (/^\[object .*\]$/.exec(strCellValue)) {
                    //object 对象忽略掉
                  } else {
                    copyValue += strCellValue;
                  }
                }
                if (c < range.end.col || c < maxCol) {
                  copyValue += '\t';
                }
              } else {
                copyValue += '\t';
              }
            }
          }
          if (r < maxRow) {
            copyValue += '\r\n';
          }
        }
      }

      if (this.options?.formatCopyValue) {
        copyValue = this.options.formatCopyValue(copyValue);
      }
      return copyValue;
    }
    return '';
  }

  /**获取选中区域的每个单元格详情 */
  getSelectedCellInfos(): CellInfo[][] | null {
    if (!this.stateManager.select?.ranges) {
      return null;
    }

    const ranges = this.stateManager.select.ranges;
    if (!ranges.length) {
      return [];
    }
    let minCol = Math.min(ranges[0].start.col, ranges[0].end.col);
    let maxCol = Math.max(ranges[0].start.col, ranges[0].end.col);
    let minRow = Math.min(ranges[0].start.row, ranges[0].end.row);
    let maxRow = Math.max(ranges[0].start.row, ranges[0].end.row);
    ranges.forEach((a: CellRange) => {
      minCol = Math.min(minCol, a.start.col, a.end.col);
      maxCol = Math.max(maxCol, a.start.col, a.end.col);
      minRow = Math.min(minRow, a.start.row, a.end.row);
      maxRow = Math.max(maxRow, a.start.row, a.end.row);
      // return a.start.row - b.start.row || a.start.col - b.start.col
    });
    const isExistDataInRow = (r: number) => {
      let isExist = false;
      ranges.forEach((range: CellRange) => {
        const minRow = Math.min(range.start.row, range.end.row);
        const maxRow = Math.max(range.start.row, range.end.row);
        if (minRow <= r && maxRow >= r) {
          isExist = true;
        }
      });
      return isExist;
    };
    const isExistDataInCol = (c: number) => {
      let isExist = false;
      ranges.forEach((range: CellRange) => {
        const minCol = Math.min(range.start.col, range.end.col);
        const maxCol = Math.max(range.start.col, range.end.col);
        if (minCol <= c && maxCol >= c) {
          isExist = true;
        }
      });
      return isExist;
    };

    const getRangeExistDataInCell = (c: number, r: number) => {
      let isExistRange;
      ranges.forEach((range: CellRange) => {
        const minRow = Math.min(range.start.row, range.end.row);
        const maxRow = Math.max(range.start.row, range.end.row);
        const minCol = Math.min(range.start.col, range.end.col);
        const maxCol = Math.max(range.start.col, range.end.col);
        if (minCol <= c && maxCol >= c && minRow <= r && maxRow >= r) {
          isExistRange = range;
        }
      });
      return isExistRange;
    };

    const cellInfoArray: CellInfo[][] = [];

    for (let r = minRow; r <= maxRow; r++) {
      const isExistData = isExistDataInRow(r);
      if (isExistData) {
        const cellInfoRow: CellInfo[] = [];
        for (let c = minCol; c <= maxCol; c++) {
          const isExistDataCol = isExistDataInCol(c);
          if (isExistDataCol) {
            const range: CellRange | undefined = getRangeExistDataInCell(c, r);
            if (range) {
              const cellInfo = this.getCellInfo(c, r);
              cellInfoRow.push(cellInfo);
            }
          }
        }
        cellInfoArray.push(cellInfoRow);
      }
    }
    return cellInfoArray;
  }
  getSelectedCellRanges(): CellRange[] {
    const ranges = this.stateManager.select.ranges;
    if (!ranges.length) {
      return [];
    }
    return cloneDeep(ranges);
  }

  /** 计算字体的宽度接口 */
  measureText(text: string, font: { fontSize: number; fontWeight: string | number; fontFamily: string }): ITextSize {
    return textMeasure.measureText(text, font);
  }

  measureTextBounds(attribute: ITextGraphicAttribute): AABBBounds {
    return measureTextBounds(attribute) as AABBBounds;
  }

  /** 获取单元格上定义的自定义渲染配置 */
  getCustomRender(col: number, row: number): ICustomRender {
    let customRender;
    if (this.getCellLocation(col, row) !== 'body') {
      const define = this.getHeaderDefine(col, row);
      customRender = (define as ColumnDefine)?.headerCustomRender;
    } else {
      const define = this.getBodyColumnDefine(col, row);
      customRender = (define as ColumnDefine)?.customRender || this.customRender;
    }
    return customRender;
  }
  /** 获取单元格上定义的自定义布局元素配置 */
  getCustomLayout(col: number, row: number): ICustomLayout {
    let customLayout;
    if (this.getCellLocation(col, row) !== 'body') {
      const define = this.getHeaderDefine(col, row);
      customLayout = (define as ColumnDefine)?.headerCustomLayout;
    } else {
      const define = this.getBodyColumnDefine(col, row);
      customLayout = (define as ColumnDefine)?.customLayout;
    }
    return customLayout;
  }

  hasAutoImageColumn() {
    if (this._hasAutoImageColumn === undefined) {
      this._hasAutoImageColumn = hasAutoImageColumn(this);
    }
    return this._hasAutoImageColumn;
  }

  /** 获取当前hover单元格的图表实例。这个方法hover实时获取有点缺陷：鼠标hover到单元格上触发了 chart.ts中的activate方法 但此时this.stateManager.hover?.cellPos?.col还是-1 */
  _getActiveChartInstance() {
    // 根据hover的单元格位置 获取单元格实例 拿到chart图元
    const cellGroup = this.scenegraph.getCell(
      this.stateManager.hover?.cellPos?.col,
      this.stateManager.hover?.cellPos?.row
    );
    return cellGroup?.getChildren()?.[0]?.type === 'chart'
      ? (cellGroup.getChildren()[0] as Chart).activeChartInstance
      : null;
  }

  /**
   * 判断单元格是否在显示区域
   * @param col
   * @param row
   */
  cellIsInVisualView(col: number, row: number) {
    const drawRange = this.getDrawRange();
    const rect = this.getCellRelativeRect(col, row);

    if (col < this.frozenColCount && row < this.frozenRowCount) {
      return true;
    }
    let colHeaderRangeRect;
    if (this.frozenRowCount >= 1) {
      colHeaderRangeRect = this.getCellRangeRelativeRect({
        start: {
          col: 0,
          row: 0
        },
        end: {
          col: this.colCount - 1,
          row: this.frozenRowCount - 1
        }
      });
    }
    let rowHeaderRangeRect;
    if (this.frozenColCount >= 1) {
      rowHeaderRangeRect = this.getCellRangeRelativeRect({
        start: {
          col: 0,
          row: 0
        },
        end: {
          col: this.frozenColCount - 1,
          row: this.rowCount - 1
        }
      });
    }
    let bottomFrozenRangeRect;
    if (this.bottomFrozenRowCount >= 1) {
      bottomFrozenRangeRect = this.getCellRangeRelativeRect({
        start: {
          col: 0,
          row: this.rowCount - this.bottomFrozenRowCount
        },
        end: {
          col: this.colCount - 1,
          row: this.rowCount - 1
        }
      });
    }
    let rightFrozenRangeRect;
    if (this.rightFrozenColCount >= 1) {
      rightFrozenRangeRect = this.getCellRangeRelativeRect({
        start: {
          col: this.colCount - this.rightFrozenColCount,
          row: 0
        },
        end: {
          col: this.colCount - 1,
          row: this.rowCount - 1
        }
      });
    }
    if (
      rect.top >= drawRange.top &&
      rect.bottom <= drawRange.bottom &&
      rect.left >= drawRange.left &&
      rect.right <= drawRange.right
    ) {
      // return true;
      if (this.isFrozenCell(col, row)) {
        return true;
      } else if (
        // body cell drawRange do not intersect colHeaderRangeRect&rowHeaderRangeRect
        rect.top >= (colHeaderRangeRect?.bottom ?? rect.top) &&
        rect.left >= (rowHeaderRangeRect?.right ?? rect.left) &&
        rect.bottom <= (bottomFrozenRangeRect?.top ?? rect.bottom) &&
        rect.right <= (rightFrozenRangeRect?.left ?? rect.right)
      ) {
        return true;
      }
    }
    return false;
  }

  getCustomMergeValue(col: number, row: number): string | undefined {
    if (this.internalProps.customMergeCell) {
      const customMerge = this.getCustomMerge(col, row);
      if (customMerge) {
        const { text } = customMerge;
        return text;
      }
    }
    return undefined;
  }

  /**
   * 导出表格中当前可视区域的图片
   * @returns base64图片
   */
  exportImg() {
    const c = this.scenegraph.stage.toCanvas();
    return c.toDataURL();
  }

  /**
   * 导出某个单元格图片
   * @returns base64图片
   */
  exportCellImg(col: number, row: number, options?: { disableBackground?: boolean; disableBorder?: boolean }) {
    const isInView = this.cellIsInVisualView(col, row);
    const { scrollTop, scrollLeft } = this;
    if (!isInView) {
      this.scrollToCell({ col, row });
    }
    const cellRect = this.getCellRelativeRect(col, row);

    // disable hover&select style
    if (this.stateManager.select?.ranges?.length > 0) {
      hideCellSelectBorder(this.scenegraph);
    }
    const { col: hoverCol, row: hoverRow } = this.stateManager.hover.cellPos;
    this.stateManager.updateHoverPos(-1, -1);
    // hide scroll bar
    this.scenegraph.component.hideVerticalScrollBar();
    this.scenegraph.component.hideHorizontalScrollBar();

    // hide border
    this.scenegraph.tableGroup.border.setAttribute('visible', false);

    // deal with options
    let oldFill;
    if (options?.disableBackground) {
      const cellGroup = this.scenegraph.getCell(col, row);
      oldFill = cellGroup.attribute.fill;
      cellGroup.setAttribute('fill', 'transparent');
    }
    let oldStroke;
    if (options?.disableBorder) {
      const cellGroup = this.scenegraph.getCell(col, row);
      oldStroke = cellGroup.attribute.stroke;
      cellGroup.setAttribute('stroke', false);
    }

    this.scenegraph.renderSceneGraph();
    let sizeOffset = 0;
    if (this.theme.cellBorderClipDirection === 'bottom-right') {
      sizeOffset = 1;
    }
    const c = this.scenegraph.stage.toCanvas(
      false,
      new AABBBounds().set(
        cellRect.left + this.tableX + 1,
        cellRect.top + this.tableY + 1,
        cellRect.right + this.tableX - sizeOffset,
        cellRect.bottom + this.tableY - sizeOffset
      )
    );
    if (!isInView) {
      this.setScrollTop(scrollTop);
      this.setScrollLeft(scrollLeft);
    }
    // return c.toDataURL('image/jpeg', 0.5);

    // restore border
    this.scenegraph.tableGroup.border.setAttribute('visible', true);

    // restore options
    if (oldFill) {
      const cellGroup = this.scenegraph.getCell(col, row);
      cellGroup.setAttribute('fill', oldFill);
    }
    if (oldStroke) {
      const cellGroup = this.scenegraph.getCell(col, row);
      cellGroup.setAttribute('stroke', oldStroke);
    }

    // restore hover&select style
    if (this.stateManager.select?.ranges?.length > 0) {
      restoreCellSelectBorder(this.scenegraph);
    }
    this.stateManager.updateHoverPos(hoverCol, hoverRow);

    this.scenegraph.updateNextFrame();

    return c.toDataURL();
  }

  /**
   * 导出某一片区域的图片
   * @returns base64图片
   */
  exportCellRangeImg(cellRange: CellRange) {
    const { scrollTop, scrollLeft } = this;
    const minCol = Math.min(cellRange.start.col, cellRange.end.col);
    const minRow = Math.min(cellRange.start.row, cellRange.end.row);
    const maxCol = Math.max(cellRange.start.col, cellRange.end.col);
    const maxRow = Math.max(cellRange.start.row, cellRange.end.row);
    const isInView = this.cellIsInVisualView(minCol, minRow);
    const isMaxCellInView = this.cellIsInVisualView(maxCol, maxRow);
    // 判断如果超出可视区域 做移动
    if (!isInView || !isMaxCellInView) {
      this.scrollToCell({ col: minCol, row: minRow });
    }

    const cellRect = this.getCellRangeRelativeRect({
      start: { col: minCol, row: minRow },
      end: { col: maxCol, row: maxRow }
    });

    // disable hover&select style
    if (this.stateManager.select?.ranges?.length > 0) {
      hideCellSelectBorder(this.scenegraph);
    }
    const { col: hoverCol, row: hoverRow } = this.stateManager.hover.cellPos;
    this.stateManager.updateHoverPos(-1, -1);
    // hide scroll bar
    this.scenegraph.component.hideVerticalScrollBar();
    this.scenegraph.component.hideHorizontalScrollBar();
    this.scenegraph.renderSceneGraph();

    const c = this.scenegraph.stage.toCanvas(
      false,
      new AABBBounds().set(
        cellRect.left + this.tableX + 1,
        cellRect.top + this.tableY + 1,
        cellRect.right + this.tableX,
        cellRect.bottom + this.tableY
      )
    );
    const base64Image = c.toDataURL();
    // 前面做的移动需要再复原
    if (!isInView || !isMaxCellInView) {
      this.setScrollTop(scrollTop);
      this.setScrollLeft(scrollLeft);
    }

    // restore hover&select style
    if (this.stateManager.select?.ranges?.length > 0) {
      restoreCellSelectBorder(this.scenegraph);
    }
    this.stateManager.updateHoverPos(hoverCol, hoverRow);

    return base64Image;
  }

  exportCanvas() {
    const c = this.scenegraph.stage.toCanvas();
    return c;
  }
  /**
   * 目前仅支持 node 环境，用于 node 端的图片导出
   * @returns
   */
  getImageBuffer(type: string = 'image/png') {
    if (this.options.mode !== 'node') {
      console.error(new TypeError('getImageBuffer() now only support node environment.'));
      return;
    }
    this.render();
    const stage = this.scenegraph.stage;
    if (stage) {
      const contentWidth = this.tableX + this.getAllColsWidth();
      const contentHeight = this.tableY + this.getAllRowsHeight();
      if (contentWidth >= this.canvasWidth && contentHeight >= this.canvasHeight) {
        stage.render();
        const buffer = stage.window.getImageBuffer(type);
        return buffer;
      }
      const newCanvas = this.scenegraph.stage.toCanvas(
        false,
        new AABBBounds().set(0, 0, Math.min(this.canvasWidth, contentWidth), Math.min(this.canvasHeight, contentHeight))
      );
      const buffer = (newCanvas as any).toBuffer(type);
      return buffer;
    }
    console.error(new ReferenceError(`stage is not defined`));

    return null;
  }
  /** 根据表格单元格的行列号 获取在body部分的列索引及行索引 */
  getBodyIndexByTableIndex(col: number, row: number) {
    return {
      col: col - this.rowHeaderLevelCount,
      row: row - this.columnHeaderLevelCount
    };
  }
  /** 根据body部分的列索引及行索引，获取单元格的行列号 */
  getTableIndexByBodyIndex(col: number, row: number) {
    return {
      col: col + this.rowHeaderLevelCount,
      row: row + this.columnHeaderLevelCount
    };
  }

  /**
   * 监听vchart事件
   * @param type vchart事件类型
   * @param listener vchart事件监听器
   * @returns 事件监听器id
   */
  onVChartEvent(type: string, callback: AnyFunction): void;
  onVChartEvent(type: string, query: any, callback: AnyFunction): void;
  onVChartEvent(type: string, query?: any, callback?: AnyFunction): void {
    if (!this._chartEventMap[type]) {
      this._chartEventMap[type] = [];
    }
    if (typeof query === 'function') {
      this._chartEventMap[type].push({ callback: query });
    } else {
      this._chartEventMap[type].push({ callback, query });
    }
  }

  offVChartEvent(type: string, callback?: AnyFunction): void {
    // delete this._chartEventMap[type];
    if (!this._chartEventMap[type]) {
      return;
    }
    if (callback) {
      this._chartEventMap[type] = this._chartEventMap[type].filter(e => e.callback !== callback);
    } else {
      this._chartEventMap[type] = [];
    }
  }
  /** 给activeChartInstance逐个绑定chart用户监听事件 */
  _bindChartEvent(activeChartInstance: any) {
    if (activeChartInstance) {
      for (const key in this._chartEventMap) {
        (this._chartEventMap[key] || []).forEach(e => {
          if (e.query) {
            activeChartInstance.on(key, e.query, e.callback);
          } else {
            activeChartInstance.on(key, e.callback);
          }
        });
      }
    }
  }
  changeRecordOrder(source: number, target: number) {
    //
  }
  hasCustomCellStyle(customStyleId: string): boolean {
    return this.customCellStylePlugin?.hasCustomCellStyle(customStyleId);
  }
  registerCustomCellStyle(customStyleId: string, customStyle: ColumnStyleOption | undefined | null) {
    this.customCellStylePlugin?.registerCustomCellStyle(customStyleId, customStyle);
  }

  arrangeCustomCellStyle(
    cellPos: { col?: number; row?: number; range?: CellRange },
    customStyleId: string,
    forceFastUpdate?: boolean
  ) {
    this.customCellStylePlugin?.arrangeCustomCellStyle(cellPos, customStyleId, forceFastUpdate);
  }
  isSeriesNumber(col: number, row: number): boolean {
    return this.internalProps.layoutMap.isSeriesNumber(col, row);
  }
  isHasSeriesNumber(): boolean {
    return this.internalProps.layoutMap?.leftRowSeriesNumberColumnCount > 0;
  }
  get leftRowSeriesNumberCount(): number {
    return this.internalProps.layoutMap?.leftRowSeriesNumberColumnCount ?? 0;
  }
  setMinMaxLimitWidth(setWidth: boolean = false) {
    const internalProps = this.internalProps;
    //设置列宽
    for (let col = 0; col < internalProps.layoutMap.columnWidths.length; col++) {
      if (this.internalProps._widthResizedColMap.has(col)) {
        continue;
      }
      const { width, minWidth, maxWidth } = internalProps.layoutMap.columnWidths?.[col] ?? {};
      // width 为 "auto" 时先不存储ColWidth
      if (
        setWidth &&
        width &&
        ((typeof width === 'string' && width !== 'auto') || (typeof width === 'number' && width > 0))
      ) {
        this._setColWidth(col, width);
      }
      if (minWidth && ((typeof minWidth === 'number' && minWidth > 0) || typeof minWidth === 'string')) {
        this.setMinColWidth(col, minWidth);
      }
      if (maxWidth && ((typeof maxWidth === 'number' && maxWidth > 0) || typeof maxWidth === 'string')) {
        this.setMaxColWidth(col, maxWidth);
      }
    }
  }
  setSortedIndexMap(field: FieldDef, filedMap: ISortedMapItem) {
    this.dataSource?.setSortedIndexMap(field, filedMap);
  }
  // startInertia() {
  //   startInertia(0, -1, 1, this.stateManager);
  // }

  checkReactCustomLayout() {
    if (!this.reactCustomLayout) {
      this.reactCustomLayout = new ReactCustomLayout(this);
    }
  }

  get bodyDomContainer() {
    return this.internalProps.bodyDomContainer;
  }
  get headerDomContainer() {
    return this.internalProps.headerDomContainer;
  }
  get frozenBodyDomContainer() {
    return this.internalProps.frozenBodyDomContainer;
  }
  get frozenHeaderDomContainer() {
    return this.internalProps.frozenHeaderDomContainer;
  }
  get rightFrozenBodyDomContainer() {
    return this.internalProps.rightFrozenBodyDomContainer;
  }
  get rightFrozenHeaderDomContainer() {
    return this.internalProps.rightFrozenHeaderDomContainer;
  }
  get frozenBottomDomContainer() {
    return this.internalProps.frozenBottomDomContainer;
  }
  get bottomDomContainer() {
    return this.internalProps.bottomDomContainer;
  }
  get rightFrozenBottomDomContainer() {
    return this.internalProps.rightFrozenBottomDomContainer;
  }
  /**
   * 显示移动列或移动行的高亮线  如果(col，row)单元格是列头 则显示高亮列线；  如果(col，row)单元格是行头 则显示高亮行线
   * @param col 在表头哪一列后显示高亮线
   * @param row 在表头哪一行后显示高亮线
   */
  showMoverLine(col: number, row: number) {
    this.scenegraph.component.showMoveCol(col, row, 0);
    this.scenegraph.renderSceneGraph();
  }
  /**
   * 隐藏掉移动列或移动行的高亮线
   * @param col
   * @param row
   */
  hideMoverLine(col: number, row: number) {
    this.scenegraph.component.hideMoveCol();
    this.scenegraph.renderSceneGraph();
  }
  /** 关闭表格的滚动 */
  disableScroll() {
    this.eventManager.disableScroll();
  }
  /** 开启表格的滚动 */
  enableScroll() {
    this.eventManager.enableScroll();
  }

  getGroupTitleLevel(col: number, row: number): number | undefined {
    return undefined;
  }

  // anmiation
  scrollToRow(row: number, animationOption?: ITableAnimationOption | boolean) {
    if (!animationOption) {
      this.scrollToCell({ row });
      return;
    }
    this.animationManager.scrollTo({ row }, animationOption);
  }
  scrollToCol(col: number, animationOption?: ITableAnimationOption | boolean) {
    if (!animationOption) {
      this.scrollToCell({ col });
      return;
    }
    this.animationManager.scrollTo({ col }, animationOption);
  }
  /**
   * 滚动到具体某个单元格位置
   * @param cellAddr 要滚动到的单元格位置
   * @param animationOption 动画配置
   */
  scrollToCell(cellAddr: { col?: number; row?: number }, animationOption?: ITableAnimationOption | boolean) {
    if (animationOption) {
      this.animationManager.scrollTo(cellAddr, animationOption);
      return;
    }
    const drawRange = this.getDrawRange();
    if (isValid(cellAddr.col) && cellAddr.col >= this.frozenColCount) {
      const frozenWidth = this.getFrozenColsWidth();
      const left = this.getColsWidth(0, cellAddr.col - 1);
      this.scrollLeft = Math.min(left - frozenWidth, this.getAllColsWidth() - drawRange.width);
    }
    if (isValid(cellAddr.row) && cellAddr.row >= this.frozenRowCount) {
      const frozenHeight = this.getFrozenRowsHeight();
      const top = this.getRowsHeight(0, cellAddr.row - 1);
      this.scrollTop = Math.min(top - frozenHeight, this.getAllRowsHeight() - drawRange.height);
    }
    this.render();
  }
  checkHasColumnAutoWidth(): boolean {
    return checkHasColumnAutoWidth(this);
  }
}
