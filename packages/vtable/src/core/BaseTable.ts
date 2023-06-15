import * as columnStyleContents from '../body-helper/style';
import * as headerStyleContents from '../header-helper/style';
import { importStyle } from './style';
import * as style from '../tools/style';
import type {
  CellAddress,
  CellRange,
  TableEventHandlersEventArgumentMap,
  TableEventHandlersReturnMap,
  TableKeyboardOptions,
  DropDownMenuHighlightInfo,
  MenuListItem,
  WidthModeDef,
  ICustomRender,
  ICellHeaderPaths,
  HeaderData,
  FullExtendStyle,
  FieldDef,
  ColumnTypeOption,
  SortState,
  IPagerConf,
  ICustomLayout,
  CellInfo,
  CellStyle,
  MenuInstanceType,
  DropDownMenuOptions,
  FieldFormat,
  FieldData,
  MaybePromiseOrUndefined,
  MousePointerCellEvent,
  DropDownMenuEventInfo,
  HierarchyState,
  FieldKeyDef,
  CellType,
  LayoutObjectId
} from '../ts-types';
import type { ColumnIconOption } from '../ts-types';
import { event, style as utilStyle } from '../tools/helper';

import { TABLE_EVENT_TYPE } from './TABLE_EVENT_TYPE';
import { EventHandler } from '../event/EventHandler';
import { EventTarget } from '../event/EventTarget';
import { NumberMap } from '../tools/NumberMap';
import { Rect } from '../tools/Rect';
import type { TableTheme } from '../themes/theme';
import { defaultOrderFn, isValid, throttle2 } from '../tools/util';
import themes from '../themes';
import { Env } from '../tools/env';
import { Scenegraph } from '../scenegraph/scenegraph';
import { StateManeger } from '../state/state';
import { EventManeger } from '../event/event';
import { BodyHelper } from '../body-helper/body-helper';
import { HeaderHelper } from '../header-helper/header-helper';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import { TooltipHandler } from '../tooltip/TooltipHandler';
import type { CachedDataSource, DataSource } from '../data';
import type { IWrapTextGraphicAttribute } from '@visactor/vrender';
import { isBoolean, type ITextSize } from '@visactor/vutils';
import { WrapText } from '../scenegraph/graphic/text';
import { textMeasure } from '../scenegraph/utils/measure-text';
import { getProp } from '../scenegraph/utils/get-prop';
import type { ColumnData, ColumnDefine, ColumnsDefine, IndicatorData } from '../ts-types/list-table/layout-map/api';
import type { TooltipOptions } from '../ts-types/tooltip';
import { IconCache } from '../plugins/icons';
import {
  _applyColWidthLimits,
  _getScrollableVisibleRect,
  _getTargetFrozenColAt,
  _getTargetFrozenRowAt,
  _setDataSource,
  _setRecords,
  _toPxWidth,
  createRootElement,
  getStyleTheme,
  isAutoDefine,
  updateRootElementPadding
} from './tableHelper';
import { MenuHandler } from '../menu/dom/MenuHandler';
import type { BaseTableAPI, BaseTableConstructorOptions, IBaseTableProtected } from '../ts-types/base-table';
import { FocusInput } from './FouseInput';
import { defaultPixelRatio } from '../tools/pixel-ratio';
const { toBoxArray } = utilStyle;
const { isTouchEvent } = event;
const rangeReg = /^\$(\d+)\$(\d+)$/;
importStyle();
export abstract class BaseTable extends EventTarget implements BaseTableAPI {
  internalProps: IBaseTableProtected;
  showPin = true;
  showSort = true;
  padding: { top: number; left: number; right: number; bottom: number };
  globalDropDownMenu?: MenuListItem[];
  //画布绘制单元格的区域 不包括整体边框frame，所以比canvas的width和height要小一点（canvas的width包括了frame）
  tableNoFrameWidth: number;
  tableNoFrameHeight: number;
  tableX: number;
  tableY: number;
  _widthMode: WidthModeDef;
  customRender?: ICustomRender;

  canvasWidth?: number;
  canvasHeight?: number;

  scenegraph: Scenegraph;
  stateManeger?: StateManeger;
  eventManeger?: EventManeger;
  _pixelRatio: number;

  _cellToBeInvalidatedNextFrame: Set<string>;
  _willNextFrameInvalidate: boolean;

  static get EVENT_TYPE(): typeof TABLE_EVENT_TYPE {
    return TABLE_EVENT_TYPE;
  }
  /**
   * 用户配置的options 只读 勿直接修改
   */
  readonly options: BaseTableConstructorOptions;

  version = __VERSION__;

  pagerConf?: IPagerConf | undefined;

  /**
   * constructor
   *
   * @constructor
   * @param options Constructor options
   */
  // eslint-disable-next-line default-param-last
  id = `VTable${Date.now()}`;

  headerStyleCache: any;
  bodyStyleCache: any;
  constructor(options: BaseTableConstructorOptions = {}) {
    super();
    const {
      // rowCount = 0,
      // colCount = 0,
      frozenColCount = 0,
      // frozenRowCount = 0,
      defaultRowHeight = 40,
      defaultHeaderRowHeight,
      defaultColWidth = 80,
      defaultHeaderColWidth,
      widthMode = 'standard',
      keyboardOptions,
      parentElement,
      // disableRowHeaderColumnResize,
      columnResizeMode,
      dragHeaderMode,
      // showHeader,
      // scrollBar,
      showPin,
      allowFrozenColCount,
      padding,
      hover,
      menu,
      select: click,
      customRender,
      pixelRatio = defaultPixelRatio
    } = options;
    this.options = options;
    this._widthMode = widthMode;
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

    this.tableNoFrameWidth = 0;
    this.tableNoFrameHeight = 0;

    const internalProps = (this.internalProps = {} as IBaseTableProtected);
    // style.initDocument(scrollBar);
    // showHeader !== undefined && (this.showHeader = showHeader);
    // scrollBar !== undefined && (this.scrollBar = scrollBar);
    showPin !== undefined && (this.showPin = showPin);
    if (typeof allowFrozenColCount === 'number' && allowFrozenColCount <= 0) {
      this.showPin = false;
    }
    //设置是否自动撑开的配置
    internalProps.autoRowHeight = options.autoRowHeight ?? false;

    internalProps.handler = new EventHandler();
    internalProps.element = createRootElement(this.padding);
    internalProps.focusControl = new FocusInput(this, internalProps.element);

    internalProps.pixelRatio = pixelRatio;
    internalProps.canvas = document.createElement('canvas');
    internalProps.element.appendChild(internalProps.canvas);

    internalProps.context = internalProps.canvas.getContext('2d')!;

    internalProps.frozenColCount = frozenColCount;

    internalProps.defaultRowHeight = defaultRowHeight;
    internalProps.defaultHeaderRowHeight = defaultHeaderRowHeight ?? defaultRowHeight; // defaultHeaderRowHeight没有设置取defaultRowHeight

    internalProps.defaultColWidth = defaultColWidth;
    internalProps.defaultHeaderColWidth = defaultHeaderColWidth ?? defaultColWidth;

    internalProps.keyboardOptions = keyboardOptions;

    internalProps.columnResizeMode = columnResizeMode;
    internalProps.dragHeaderMode = dragHeaderMode;

    /////
    internalProps._rowHeightsMap = new NumberMap();
    internalProps._rowRangeHeightsMap = new Map();
    internalProps._colRangeWidthsMap = new Map();
    this.colWidthsMap = new NumberMap();
    this.colContentWidthsMap = new NumberMap();
    this.colWidthsLimit = {};

    internalProps.calcWidthContext = {
      _: internalProps,
      get full(): number {
        return this._.canvas.width / ((this._.context as any).pixelRatio ?? window.devicePixelRatio);
      }
      // get em(): number {
      //   return getFontSize(this._.context, this._.theme.font).width;
      // }
    };

    internalProps.cellTextOverflows = {};
    internalProps.focusedTable = false;

    internalProps.theme = themes.of(options.theme ?? themes.DEFAULT); //原来在listTable文件中

    // internalProps.element.appendChild(internalProps.scrollable.getElement());

    if (parentElement) {
      //先清空
      parentElement.innerHTML = '';
      parentElement.appendChild(internalProps.element);
      this._updateSize();
    } else {
      this._updateSize();
    }

    this._cellToBeInvalidatedNextFrame = new Set(); // for all
    this._willNextFrameInvalidate = false;

    this.options = options;
    internalProps.theme = themes.of(options.theme ?? themes.DEFAULT);
    internalProps.bodyHelper = new BodyHelper(this);
    internalProps.headerHelper = new HeaderHelper(this);

    internalProps.autoWrapText = options.autoWrapText;

    internalProps.allowFrozenColCount = options.allowFrozenColCount ?? internalProps.colCount;
    internalProps.limitMaxAutoWidth = options.limitMaxAutoWidth ?? 450;

    // 生成scenegraph
    this.scenegraph = new Scenegraph(this);
    this.stateManeger = new StateManeger(this);
    this.eventManeger = new EventManeger(this);

    //原有的toolTip提示框处理，主要在文字绘制不全的时候 出来全文本提示信息 需要加个字段设置是否有效
    internalProps.tooltip = Object.assign(
      {
        renderMode: 'html',
        isShowOverflowTextTooltip: false,
        confine: true
      },
      options.tooltip
    );
    if (internalProps.tooltip.renderMode === 'html') {
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
    Array.isArray(options.menu?.defaultHeaderMenuItems) &&
      (this.globalDropDownMenu = options.menu.defaultHeaderMenuItems);

    if (internalProps.menu.renderMode === 'html') {
      internalProps.menuHandler = new MenuHandler(this);
    }

    this.headerStyleCache = new Map();
    this.bodyStyleCache = new Map();
  }
  /** 节流绘制 */
  throttleInvalidate = throttle2(this.invalidate.bind(this), 200);
  /**
   * Get parent element.
   * @returns {HTMLElement} parent element container
   */
  getParentElement(): HTMLElement {
    return this.options.parentElement;
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
    return this.internalProps.frozenColCount ?? 0;
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
    //纠正frozenColCount的值
    if (this.tableNoFrameWidth - this.getColsWidth(0, frozenColCount - 1) <= 120) {
      this.internalProps.frozenColCount = 0;
    }
    this.stateManeger.setFrozenCol(this.internalProps.frozenColCount);
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
    if (this.tableNoFrameWidth - this.getColsWidth(0, frozenColCount - 1) <= 120) {
      this.internalProps.frozenColCount = 0;
    }
    this.stateManeger.setFrozenCol(this.internalProps.frozenColCount);
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
    return this.internalProps.frozenRowCount ?? 0;
  }
  /**
   * Set the number of frozen rows.
   */
  set frozenRowCount(frozenRowCount: number) {
    this.internalProps.frozenRowCount = frozenRowCount;
    // this.options.frozenRowCount = frozenRowCount;
  }
  /**
   * Get the default row height.
   *
   */
  get defaultRowHeight(): number {
    return this.internalProps.defaultRowHeight;
  }
  /**
   * Set the default row height.
   */
  set defaultRowHeight(defaultRowHeight: number) {
    this.internalProps.defaultRowHeight = defaultRowHeight;
    this.options.defaultRowHeight = defaultRowHeight;
  }
  /**
   * Get the default row height.
   *
   */
  get defaultHeaderRowHeight(): number | number[] {
    return this.internalProps.defaultHeaderRowHeight;
  }
  /**
   * Set the default row height.
   */
  set defaultHeaderRowHeight(defaultHeaderRowHeight: number | number[]) {
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
  get defaultHeaderColWidth(): number | number[] {
    return this.internalProps.defaultHeaderColWidth;
  }
  /**
   * Set the default column width.
   */
  set defaultHeaderColWidth(defaultHeaderColWidth: number | number[]) {
    this.internalProps.defaultHeaderColWidth = defaultHeaderColWidth;
    this.options.defaultHeaderColWidth = defaultHeaderColWidth;
  }
  /**
   * Get the columns width.
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
  get rowHeightsMap(): NumberMap<number> {
    return this.internalProps._rowHeightsMap;
  }
  /**
   * Set the columns width.
   */
  set rowHeightsMap(rowHeightsMap: NumberMap<number>) {
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

  get widthMode(): WidthModeDef {
    return this._widthMode;
  }
  set widthMode(widthMode: WidthModeDef) {
    if (widthMode !== this._widthMode) {
      this._widthMode = widthMode;
    }
  }

  /**
   * 根据设置的列宽配置 计算列宽值
   * @param {string|number} width width definition
   * @returns {number} the pixels of width
   * @private
   */
  private _colWidthDefineToPxWidth(width: string | number): number {
    if (isAutoDefine(width)) {
      return _toPxWidth(this, this._calculateAutoColWidthExpr());
    }
    return _toPxWidth(this, width);
  }

  /**
   * 计算列宽为auto情况下的宽度.
   * @returns {string}
   * @private
   */
  private _calculateAutoColWidthExpr(): string {
    const fullWidth = this.internalProps.calcWidthContext.full;
    let sumMin = 0;
    const others: (string | number)[] = [];
    let autoCount = 0;
    const hasLimitsOnAuto = [];
    for (let col = 0; col < this.internalProps.colCount; col++) {
      const def = this.getColWidthDefine(col);
      const limits = this._getColWidthLimits(col);

      if (isAutoDefine(def)) {
        if (limits) {
          hasLimitsOnAuto.push(limits);
          if (limits.min) {
            sumMin += limits.min;
          }
        }
        autoCount++;
      } else {
        let expr = def;
        if (limits) {
          const orgWidth = _toPxWidth(this, expr);
          const newWidth = _applyColWidthLimits(limits, orgWidth);
          if (orgWidth !== newWidth) {
            expr = `${newWidth}px`;
          }
          sumMin += newWidth;
        }
        others.push(expr);
      }
      if (sumMin > fullWidth) {
        return '0px';
      }
    }
    if (hasLimitsOnAuto.length && others.length) {
      const autoPx =
        (fullWidth - _toPxWidth(this, `calc(${others.map(c => (typeof c === 'number' ? `${c}px` : c)).join(' + ')})`)) /
        autoCount;
      hasLimitsOnAuto.forEach(limits => {
        if (limits.min && autoPx < limits.min) {
          others.push(limits.minDef);
          autoCount--;
        } else if (limits.max && limits.max < autoPx) {
          others.push(limits.maxDef);
          autoCount--;
        }
      });
      if (autoCount <= 0) {
        return `${autoPx}px`;
      }
    }
    if (others.length) {
      const strDefs: string[] = [];
      let num = 0;
      others.forEach(c => {
        if (typeof c === 'number') {
          num += c;
        } else {
          strDefs.push(c);
        }
      });
      strDefs.push(`${num}px`);
      return `calc((100% - (${strDefs.join(' + ')})) / ${autoCount})`;
    }
    return `${100 / autoCount}%`;
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

  private _adjustColWidth(col: number, orgWidth: number): number {
    const limits = this._getColWidthLimits(col);
    return Math.max(_applyColWidthLimits(limits, orgWidth), 0);
  }

  /**
   * 设置像数比
   * @param pixelRatio
   */
  setPixelRatio(pixelRatio: number) {
    this.internalProps.pixelRatio = pixelRatio;
    this.scenegraph.setPixelRatio(pixelRatio);
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

    if (Env.mode === 'browser') {
      const element = this.getElement();

      const width1 = element.parentElement?.offsetWidth ?? 1 - 1;
      const height1 = element.parentElement?.offsetHeight ?? 1 - 1;

      element.style.width = (width1 && `${width1 - padding.left - padding.right}px`) || '0px';
      element.style.height = (height1 && `${height1 - padding.top - padding.bottom}px`) || '0px';

      const { canvas } = this.internalProps;
      canvas.style.width = '';
      canvas.style.height = '';

      widthP = canvas.parentElement?.offsetWidth ?? 1 - 1;
      heightP = canvas.parentElement?.offsetHeight ?? 1 - 1;
      canvas.width = widthP;
      canvas.height = heightP;

      //style 与 width，height相同
      canvas.style.width = `${widthP}px`;
      canvas.style.height = `${heightP}px`;
    } else if (Env.mode === 'node') {
      widthP = this.canvasWidth - 1;
      heightP = this.canvasHeight - 1;
    }

    const width = Math.floor(widthP - style.getScrollBarSize(this.getTheme().scrollStyle));
    const height = Math.floor(heightP - style.getScrollBarSize(this.getTheme().scrollStyle));

    if (this.internalProps.theme?.frameStyle) {
      //考虑表格整体边框的问题
      const lineWidths = toBoxArray(this.internalProps.theme.frameStyle?.borderLineWidth ?? [null]);
      const shadowWidths = toBoxArray(this.internalProps.theme.frameStyle?.shadowBlur ?? [0]);
      this.tableX = (lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0);
      this.tableY = (lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0);
      this.tableNoFrameWidth =
        width - ((lineWidths[1] ?? 0) + (shadowWidths[1] ?? 0)) - ((lineWidths[3] ?? 0) + (shadowWidths[3] ?? 0));
      this.tableNoFrameHeight =
        height - ((lineWidths[0] ?? 0) + (shadowWidths[0] ?? 0)) - ((lineWidths[2] ?? 0) + (shadowWidths[2] ?? 0));
    }
  }

  get rowHierarchyType(): 'grid' | 'tree' {
    return 'grid';
  }

  /**
   * Set all column width.
   * @param  {number[]} widths The column widths
   * @return {void}
   */
  setColWidths(widths: number[]): void {
    widths.forEach((value, index) => this.setColWidth(index, value));
  }
  /**
   * 获取指定列范围的总宽度
   * @param startCol
   * @param endCol
   * @returns
   */
  getColsWidth(startCol: number, endCol: number): number {
    endCol = Math.min(endCol, this.colCount - 1); // endCol最大为this.colCount - 1，超过会导致width计算为NaN
    //通过缓存获取指定范围列宽
    const cachedColWidth = this._colRangeWidthsMap.get(`$${startCol}$${endCol}`);
    if (cachedColWidth !== null && cachedColWidth !== undefined) {
      return cachedColWidth;
    }

    //特殊处理 先尝试获取startCol->endCol-1的行高
    const cachedLowerColWidth = this._colRangeWidthsMap.get(`$${startCol}$${endCol - 1}`);
    if (cachedLowerColWidth !== null && cachedLowerColWidth !== undefined) {
      const width = this.colWidthsMap.get(endCol);
      let adjustW;
      if (width) {
        adjustW =
          this.widthMode === 'adaptive' || (this as any).transpose
            ? Number(width)
            : this._adjustColWidth(endCol, this._colWidthDefineToPxWidth(width));
      } else {
        adjustW = 0;
      }
      const addWidth = cachedLowerColWidth + adjustW;
      // 合法地址存入缓存
      if (startCol >= 0 && endCol >= 0 && !Number.isNaN(addWidth)) {
        this._colRangeWidthsMap.set(`$${startCol}$${endCol}`, Math.round(addWidth));
      }
      return Math.round(addWidth);
    }

    let w = 0;
    for (let col = startCol; col <= endCol; col++) {
      w +=
        this.isRowHeader(col, 0) || this.isCornerHeader(col, 0)
          ? Array.isArray(this.defaultHeaderColWidth)
            ? this.defaultHeaderColWidth[col] ?? this.internalProps.defaultColWidth
            : this.defaultHeaderColWidth
          : this.internalProps.defaultColWidth;
    }

    this.colWidthsMap.each(startCol, endCol, (width, col) => {
      // adaptive模式下，不受max min配置影响，直接使用width
      w +=
        (this.widthMode === 'adaptive' || (this as any).transpose
          ? Number(width)
          : this._adjustColWidth(col, this._colWidthDefineToPxWidth(width))) -
        (this.isRowHeader(col, 0) || this.isCornerHeader(col, 0)
          ? Array.isArray(this.defaultHeaderColWidth)
            ? this.defaultHeaderColWidth[col] ?? this.internalProps.defaultColWidth
            : this.defaultHeaderColWidth
          : this.internalProps.defaultColWidth);
    });
    for (let col = startCol; col <= endCol; col++) {
      if (this.colWidthsMap.has(col)) {
        continue;
      }
      const adj = this._adjustColWidth(col, this.internalProps.defaultColWidth);
      if (adj !== this.internalProps.defaultColWidth) {
        w += adj - this.internalProps.defaultColWidth;
      }
    }

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
    return (
      this.rowHeightsMap.get(row) ||
      (this.isColumnHeader(0, row) || this.isCornerHeader(0, row)
        ? Array.isArray(this.defaultHeaderRowHeight)
          ? this.defaultHeaderRowHeight[row] ?? this.internalProps.defaultRowHeight
          : this.defaultHeaderRowHeight
        : this.internalProps.defaultRowHeight)
    );
  }
  /**
   * 设置某一行的高度
   * @param row
   * @returns
   */
  setRowHeight(row: number, height: number, clearCache?: boolean): void {
    this.rowHeightsMap.put(row, Math.round(height));
    // 清楚影响缓存
    if (clearCache) {
      this._clearRowRangeHeightsMap(row);
    }
  }
  /**
   * 批量设置行高 这个值只可设置在computeRowsHeight函数中
   * @param rowStart 起始行
   * @param rowEnd 结束行号
   * @param height 统一高度值
   */
  fillRowsHeight(rowStart: number, rowEnd: number, rowHeight: number): void {
    for (let row = rowStart; row <= rowEnd; row++) {
      this.rowHeightsMap.put(row, Math.round(rowHeight));
      this._rowRangeHeightsMap.set(
        `$0$${row}`,
        Math.round((this._rowRangeHeightsMap.get(`$0$${row - 1}`) ?? 0) + rowHeight)
      ); //按照逻辑这里去缓存值$0$${row - 1} 一定是有的（除第一行外）
    }
  }
  /**
   * 获取指定行范围的总高度
   * @param startCol
   * @param endCol
   * @returns
   */
  getRowsHeight(startRow: number, endRow: number): number {
    //通过缓存获取指定范围行高
    const cachedRowHeight = this._rowRangeHeightsMap.get(`$${startRow}$${endRow}`);
    if (cachedRowHeight !== null && cachedRowHeight !== undefined) {
      return cachedRowHeight;
    }
    //特殊处理 先尝试获取startRow->endRow-1的行高
    const cachedLowerRowHeight = this._rowRangeHeightsMap.get(`$${startRow}$${endRow - 1}`);
    if (cachedLowerRowHeight !== null && cachedLowerRowHeight !== undefined) {
      const height = Math.round(
        cachedLowerRowHeight +
          (this.rowHeightsMap.get(endRow) ??
            (this.isColumnHeader(0, endRow) || this.isCornerHeader(0, endRow)
              ? Array.isArray(this.defaultHeaderRowHeight)
                ? this.defaultHeaderRowHeight[endRow] ?? this.internalProps.defaultRowHeight
                : this.defaultHeaderRowHeight
              : this.internalProps.defaultRowHeight))
      );
      if (startRow >= 0 && endRow >= 0) {
        this._rowRangeHeightsMap.set(`$${startRow}$${endRow}`, Math.round(height));
      }
      return height;
    }

    let h = 0;
    for (let i = startRow; i <= endRow; i++) {
      h +=
        this.rowHeightsMap.get(i) ||
        (this.isColumnHeader(0, i) || this.isCornerHeader(0, i)
          ? Array.isArray(this.defaultHeaderRowHeight)
            ? this.defaultHeaderRowHeight[i] ?? this.internalProps.defaultRowHeight
            : this.defaultHeaderRowHeight
          : this.internalProps.defaultRowHeight);
    }
    if (startRow >= 0 && endRow >= 0 && h > 0) {
      this._rowRangeHeightsMap.set(`$${startRow}$${endRow}`, Math.round(h));
    }
    // }
    return Math.round(h);
  }
  /**
   * 根据列号获取列宽定义
   * @param {number} col column number
   * @returns {string|number} width definition
   * @private
   */
  getColWidthDefine(col: number): string | number {
    const width = this.colWidthsMap.get(col);
    if (typeof width === 'number' && width <= 0) {
      // adaptive模式下，宽度可能为0
      return 0;
    } else if (width) {
      return width;
    } else if (this.isRowHeader(col, 0) || this.isCornerHeader(col, 0)) {
      return Array.isArray(this.defaultHeaderColWidth)
        ? this.defaultHeaderColWidth[col] ?? this.defaultColWidth
        : this.defaultHeaderColWidth;
    }
    return this.defaultColWidth;
  }

  /**
   * 根据列号 获取该列宽度
   * @param  {number} col column index
   * @return {number} column width
   */
  getColWidth(col: number): number {
    const width = this.getColWidthDefine(col);
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
  setColWidth(col: number, width: string | number, clearCache?: boolean, skipCheckFrozen?: boolean): void {
    this.colWidthsMap.put(col, typeof width === 'number' ? Math.round(width) : width);
    // 清楚影响缓存
    if (clearCache) {
      this._clearColRangeWidthsMap(col);
    }

    // 检查冻结情况
    if (!skipCheckFrozen) {
      this.stateManeger.checkFrozen();
    }
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
   * @param col
   */
  _clearRowRangeHeightsMap(row: number): void {
    const keys = this._rowRangeHeightsMap.keys();
    for (const key of keys) {
      const reg = rangeReg.exec(key);
      if (reg) {
        const start = Number(reg[1]);
        const end = Number(reg[2]);
        if (row >= start && row <= end) {
          this._rowRangeHeightsMap.delete(key);
        }
      }
    }
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

    let absoluteLeft = this.getColsWidth(0, col - 1) || 0;
    const width = this.getColWidth(col);
    if (isFrozenCell && isFrozenCell.col) {
      absoluteLeft += this.scrollLeft;
    }

    let absoluteTop = this.getRowsHeight(0, row - 1);
    const height = this.getRowHeight(row);
    if (isFrozenCell && isFrozenCell.row) {
      absoluteTop += this.scrollTop;
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
   * 获取的位置是相对表格显示界面的左上角 情况滚动情况 如单元格已经滚出表格上方 则这个单元格的x将为负值
   * @param {number} col index of column, of the cell
   * @param {number} row index of row, of the cell
   * @returns {Rect} the rect of the cell.
   */
  getCellRelativeRect(col: number, row: number): Rect {
    return this._toRelativeRect(this.getCellRect(col, row));
  }
  /**
   * 获取的位置是相对表格显示界面的左上角
   * @param {number} range :CellRange | CellAddress 类型 可以传入单元格范围或者具体某个单元格 返回值是包括合并单元格的较大区域
   * @returns {Rect}
   */
  getCellRangeRelativeRect(range: CellRange | CellAddress): Rect {
    if ((<CellRange>range).start) {
      return this._toRelativeRect(
        this.getCellsRect(
          (<CellRange>range).start.col,
          (<CellRange>range).start.row,
          (<CellRange>range).end.col,
          (<CellRange>range).end.row
        )
      );
    }
    const cellRange = this.getCellRange((<CellAddress>range).col, (<CellAddress>range).row);
    return this._toRelativeRect(
      this.getCellsRect(cellRange.start.col, cellRange.start.row, cellRange.end.col, cellRange.end.row)
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
    const isFrozenStartCell = this.isFrozenCell(startCol, startRow);
    const isFrozenEndCell = this.isFrozenCell(endCol, endRow);

    let absoluteLeft = this.getColsWidth(0, startCol - 1) || 0; // startCol为0时，absoluteLeft计算为Nan
    let width = this.getColsWidth(startCol, endCol);
    if (isFrozenStartCell && isFrozenStartCell.col) {
      const scrollLeft = this.scrollLeft;
      absoluteLeft += scrollLeft;
      if (!isFrozenEndCell || !isFrozenEndCell.col) {
        width -= scrollLeft;
        width = Math.max(width, this.getColsWidth(startCol, this.frozenColCount - 1));
      }
    }
    let absoluteTop = this.getRowsHeight(0, startRow - 1);
    let height = this.getRowsHeight(startRow, endRow);
    if (isFrozenStartCell && isFrozenStartCell.row) {
      const scrollTop = this.scrollTop;
      absoluteTop += scrollTop;
      if (!isFrozenEndCell || !isFrozenEndCell.row) {
        height -= scrollTop;
        height = Math.max(height, this.getRowsHeight(startRow, this.frozenRowCount - 1));
      }
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
    const { frozenRowCount, frozenColCount } = this.internalProps;
    const isFrozenRow = frozenRowCount > 0 && row < frozenRowCount;
    const isFrozenCol = frozenColCount > 0 && col < frozenColCount;
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
    const frozen = _getTargetFrozenRowAt(this, absoluteY);
    if (frozen) {
      return frozen;
    }
    let row = this.getTargetRowAt(absoluteY);
    if (!row) {
      row = {
        top: -1,
        row: -1,
        bottom: -1,
        height: -1
      };
    }
    return row;
  }
  /**
   * 根据x值计算所在列
   * @param absoluteX
   * @returns
   */
  getColAt(absoluteX: number): { left: number; col: number; right: number; width: number } {
    const frozen = _getTargetFrozenColAt(this, absoluteX);
    if (frozen) {
      return frozen;
    }
    let col = this.getTargetColAt(absoluteX);
    if (!col) {
      col = {
        left: -1,
        col: -1,
        right: -1,
        width: 1
      };
    }
    return col;
  }
  /**
   * 根据坐标值获取行列位置，index和rect范围
   * @param absoluteX
   * @param absoluteY
   * @returns
   */
  getCellAt(absoluteX: number, absoluteY: number): CellAddress {
    const rowInfo = this.getRowAt(absoluteY);
    const { row, top, bottom, height } = rowInfo;
    const colInfo = this.getColAt(absoluteX);
    const { col, left, right, width } = colInfo;
    const rect = {
      left,
      right,
      top,
      bottom,
      width,
      height
    };
    return {
      row,
      col,
      rect
    };
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
   * 重绘表格
   */
  invalidate(): void {
    this.scenegraph.renderSceneGraph();
  }
  /**
   * 转换成视觉相对table左上角的坐标 如滚动超出表格上方 y将为负值
   * @param absoluteRect
   * @returns
   */
  _toRelativeRect(absoluteRect: Rect): Rect {
    const rect = absoluteRect.copy();
    const visibleRect = this.getVisibleRect();
    rect.offsetLeft(-visibleRect.left);
    rect.offsetTop(-visibleRect.top);
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
    return this.stateManeger.scroll.verticalBarPos;
  }
  set scrollTop(scrollTop: number) {
    this.stateManeger.setScrollTop(scrollTop);
  }

  get scrollLeft(): number {
    return this.stateManeger.scroll.horizontalBarPos;
  }
  set scrollLeft(scrollLeft: number) {
    this.stateManeger.setScrollLeft(scrollLeft);
  }

  getScrollLeft() {
    return this.scrollLeft;
  }
  getScrollTop() {
    return this.scrollTop;
  }
  setScrollLeft(num: number) {
    this.scrollLeft = num;
  }
  setScrollTop(num: number) {
    this.scrollTop = num;
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
   * @param disposable
   */
  addDisposable(disposable: { dispose: () => void }): void {
    if (!disposable || !disposable.dispose || typeof disposable.dispose !== 'function') {
      throw new Error('not disposable!');
    }
    const disposables = (this.internalProps.disposables = this.internalProps.disposables || []);
    disposables.push(disposable);
  }
  /**
   * Dispose the table instance.
   * @returns {void}
   */
  dispose(): void {
    const internalProps = this.internalProps;
    internalProps.tooltipHandler?.dispose?.();
    internalProps.menuHandler?.dispose?.();
    IconCache.clearAll();

    super.dispose?.();
    internalProps.handler?.dispose?.();
    // internalProps.scrollable?.dispose?.();
    internalProps.focusControl?.dispose?.();
    if (internalProps.disposables) {
      internalProps.disposables.forEach(disposable => disposable?.dispose?.());
      internalProps.disposables = null;
    }

    this.scenegraph.stage.release();

    const { parentElement } = internalProps.element;
    if (parentElement) {
      parentElement.removeChild(internalProps.element);
    }
  }

  fireListeners<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    ...event: TableEventHandlersEventArgumentMap[TYPE]
  ): TableEventHandlersReturnMap[TYPE][] {
    return super.fireListeners(type, ...event);
  }

  /**
   * 更新options 目前只支持全量更新
   * @param options
   */
  updateOption(options: BaseTableConstructorOptions) {
    (this.options as BaseTable['options']) = options;
    const {
      // rowCount = 0,
      // colCount = 0,
      frozenColCount = 0,
      // frozenRowCount = 0,
      defaultRowHeight = 40,
      defaultHeaderRowHeight,
      defaultColWidth = 80,
      defaultHeaderColWidth = 80,
      keyboardOptions,
      // disableRowHeaderColumnResize,
      columnResizeMode,
      dragHeaderMode,
      // scrollBar,
      showPin,
      allowFrozenColCount,
      padding,
      hover,
      menu,
      select: click,
      pixelRatio,
      widthMode
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

    // 更新hover/click状态

    // 更新基础组件显示状态
    // (showHeader!=undefined) &&(this.showHeader = showHeader);
    // (showPin!=undefined) &&(this.showPin = showPin);
    // (showSort!=undefined) &&(this.showSort = showSort);
    // style.initDocument(scrollBar);
    // this.showHeader = typeof showHeader === 'boolean' ? showHeader : true;
    // this.scrollBar = typeof scrollBar === 'boolean' ? scrollBar : true;
    this.showPin = typeof showPin === 'boolean' ? showPin : true;
    if (typeof allowFrozenColCount === 'number' && allowFrozenColCount <= 0) {
      this.showPin = false;
    }

    this.widthMode = widthMode ?? 'standard';
    // 更新protectedSpace
    const internalProps: IBaseTableProtected = this.internalProps;
    if (Env.mode !== 'node') {
      updateRootElementPadding(internalProps.element, this.padding);
    }
    // internalProps.rowCount = rowCount;
    // internalProps.colCount = colCount;
    internalProps.frozenColCount = frozenColCount;
    // internalProps.frozenRowCount = frozenRowCount;
    internalProps.defaultRowHeight = defaultRowHeight;
    internalProps.defaultHeaderRowHeight = defaultHeaderRowHeight ?? defaultRowHeight;
    internalProps.defaultColWidth = defaultColWidth;
    internalProps.defaultHeaderColWidth = defaultHeaderColWidth ?? defaultColWidth;
    internalProps.keyboardOptions = keyboardOptions;

    internalProps.columnResizeMode = columnResizeMode;
    internalProps.dragHeaderMode = dragHeaderMode;

    internalProps.cellTextOverflows = {};

    internalProps.theme = themes.of(options.theme ?? themes.DEFAULT);

    //设置是否自动撑开的配置
    internalProps.autoRowHeight = options.autoRowHeight ?? false;
    //是否统一设置为多行文本
    internalProps.autoWrapText = options.autoWrapText;
    internalProps.allowFrozenColCount = options.allowFrozenColCount ?? internalProps.colCount;
    internalProps.limitMaxAutoWidth = options.limitMaxAutoWidth ?? 450;
    internalProps.tooltip = Object.assign(
      {
        renderMode: 'html',
        isShowOverflowTextTooltip: false,
        confine: true
      },
      options.tooltip
    );
    if (internalProps.tooltip.renderMode === 'html' && !internalProps.tooltipHandler) {
      internalProps.tooltipHandler = new TooltipHandler(this, internalProps.tooltip.confine);
    }

    internalProps.menu = Object.assign(
      {
        renderMode: 'html'
      },
      options.menu
    );
    if (internalProps.menu.renderMode === 'html' && !internalProps.menuHandler) {
      internalProps.menuHandler = new MenuHandler(this);
    }
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
  ): { x: number; y: number } | null {
    const table = this;
    let e: MouseEvent | Touch;
    if (!evt) {
      return null;
    }
    if (isTouchEvent(evt)) {
      e = evt.changedTouches[0];
    } else {
      e = evt;
    }
    const clientX = e.clientX || e.pageX + window.scrollX;
    const clientY = e.clientY || e.pageY + window.scrollY;
    const rect = table.internalProps.canvas.getBoundingClientRect();
    if (rect.right <= clientX) {
      return null;
    }
    if (rect.bottom <= clientY) {
      return null;
    }

    const currentWidth = rect.width;
    const originWidth = this.canvas.offsetWidth || currentWidth;
    const widthRatio = currentWidth / originWidth;

    const currentHeight = rect.height;
    const originHeight = this.canvas.offsetHeight || currentHeight;
    const heightRatio = currentHeight / originHeight;

    const x = (clientX - rect.left) / widthRatio + (isAddScroll ? table.scrollLeft : 0) - table.tableX;
    const y = (clientY - rect.top) / heightRatio + (isAddScroll ? table.scrollTop : 0) - table.tableY;
    return { x, y };
  }
  _getCellEventArgsSet<EVT extends TouchEvent | MouseEvent>(
    e: EVT
  ): {
    abstractPos?: { x: number; y: number };
    cell?: CellAddress;
    eventArgs?: CellAddress & { event: EVT; related?: CellAddress };
  } {
    //将滚动值考虑进去，转换鼠标坐标值
    const abstractPos = this._getMouseAbstractPoint(e);
    if (!abstractPos) {
      return {};
    }
    const cell = this.getCellAt(abstractPos.x, abstractPos.y);
    if (cell.col < 0 || cell.row < 0) {
      return {
        abstractPos,
        cell
      };
    }
    const eventArgs = {
      col: cell.col,
      row: cell.row,
      event: e,
      rect: cell.rect
    };
    return {
      abstractPos,
      cell,
      eventArgs
    };
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
  getTargetColAt(absoluteX: number): { col: number; left: number; right: number; width: number } | null {
    if (absoluteX === 0) {
      return { left: 0, col: 0, right: 0, width: 0 };
    }
    const findBefore = (
      startCol: number,
      startRight: number
    ): {
      left: number;
      col: number;
      right: number;
      width: number;
    } | null => {
      let right = startRight;
      for (let col = startCol; col >= 0; col--) {
        const width = this.getColWidth(col);
        const left = right - width;
        if (Math.round(left) <= Math.round(absoluteX) && Math.round(absoluteX) < Math.round(right)) {
          return {
            left,
            col,
            right,
            width
          };
        }
        right = left;
      }
      return null;
    };
    const findAfter = (
      startCol: number,
      startRight: number
    ): {
      left: number;
      col: number;
      right: number;
      width: number;
    } | null => {
      let left = startRight - this.getColWidth(startCol);
      const { colCount } = this.internalProps;
      for (let col = startCol; col < colCount; col++) {
        const width = this.getColWidth(col);
        const right = left + width;
        if (Math.round(left) <= Math.round(absoluteX) && Math.round(absoluteX) < Math.round(right)) {
          return {
            left,
            col,
            right,
            width
          };
        }
        left = right;
      }
      return null;
    };
    //计算这个位置处是第几行
    const candCol = this.computeTargetColByX(absoluteX);
    const right = this.getColsWidth(0, candCol);
    if (absoluteX >= right) {
      return findAfter(candCol, right);
    }
    return findBefore(candCol, right);
  }
  /**
   * 根据y获取该位置所处行值
   * @param table
   * @param absoluteX
   * @returns
   */
  getTargetRowAt(absoluteY: number): { row: number; top: number; bottom: number; height: number } | null {
    if (absoluteY === 0) {
      return { top: 0, row: 0, bottom: 0, height: 0 };
    }

    const findBefore = (
      startRow: number,
      startBottom: number
    ): {
      top: number;
      row: number;
      bottom: number;
      height: number;
    } | null => {
      let bottom = startBottom;
      for (let row = startRow; row >= 0; row--) {
        const height = this.getRowHeight(row);
        const top = bottom - height;
        if (Math.round(top) <= Math.round(absoluteY) && Math.round(absoluteY) < Math.round(bottom)) {
          return {
            top,
            row,
            bottom,
            height
          };
        }
        bottom = top;
      }
      return null;
    };
    const findAfter = (
      startRow: number,
      startBottom: number
    ): {
      top: number;
      row: number;
      bottom: number;
      height: number;
    } | null => {
      let top = startBottom - this.getRowHeight(startRow);
      const { rowCount } = this.internalProps;
      for (let row = startRow; row < rowCount; row++) {
        const height = this.getRowHeight(row);
        const bottom = top + height;
        if (Math.round(top) <= Math.round(absoluteY) && Math.round(absoluteY) < Math.round(bottom)) {
          return {
            top,
            row,
            bottom,
            height
          };
        }
        top = bottom;
      }
      return null;
    };
    // const candRow = Math.min(
    //   Math.ceil(absoluteY / this.internalProps.defaultRowHeight),
    //   this.rowCount - 1
    // );
    //计算这个位置处是第几行
    const candRow = this.computeTargetRowByY(absoluteY);
    const bottom = this.getRowsHeight(0, candRow);
    if (absoluteY >= bottom) {
      return findAfter(candRow, bottom);
    }
    return findBefore(candRow, bottom);
  }
  /**
   * 根据y值（包括了scroll的）计算所在行
   * @param this
   * @param absoluteY 左边y值，包含了scroll滚动距离
   * @returns
   */
  private computeTargetRowByY(absoluteY: number): number {
    //此方式效率太低，借助缓存，或者大约计算出一个值
    // this.rowHeightsMap.each(0, this.rowCount - 1, (height: number, row: number): boolean | void => {
    //   h += height || this.internalProps.defaultRowHeight;
    //   if (h > absoluteY) {
    //     targetRow = row;
    //     return false;
    //   }
    // });
    //使用二分法计算出row
    if (this._rowRangeHeightsMap.get(`$0$${this.rowCount - 1}`)) {
      let startRow = 0;
      let endRow = this.rowCount - 1;
      while (endRow - startRow > 1) {
        const midRow = Math.floor((startRow + endRow) / 2);
        if (absoluteY < this._rowRangeHeightsMap.get(`$0$${midRow}`)) {
          endRow = midRow;
        } else if (absoluteY > this._rowRangeHeightsMap.get(`$0$${midRow}`)) {
          startRow = midRow;
        } else {
          return midRow;
        }
      }
      return endRow;
      // if (this._rowRangeHeightsMap.get[`$0$${endRow}`] === absoluteY) return endRow;
      // if (this._rowRangeHeightsMap.get[`$0$${startRow}`] === absoluteY) return startRow;
    }
    //否则使用defaultRowHeight大约计算一个row
    return Math.min(Math.ceil(absoluteY / this.internalProps.defaultRowHeight), this.rowCount - 1);
  }
  /**
   * 根据x值（包括了scroll的）计算所在列 主要借助colRangeWidthsMap缓存来提高计算效率
   * @param this
   * @param absoluteX 左边x值，包含了scroll滚动距离
   * @returns
   */
  private computeTargetColByX(absoluteX: number): number {
    //使用二分法计算出col
    if (this._colRangeWidthsMap.get(`$0$${this.colCount - 1}`)) {
      let startCol = 0;
      let endCol = this.colCount - 1;
      while (endCol - startCol > 1) {
        const midCol = Math.floor((startCol + endCol) / 2);
        if (absoluteX < this._colRangeWidthsMap.get(`$0$${midCol}`)) {
          endCol = midCol;
        } else if (absoluteX > this._colRangeWidthsMap.get(`$0$${midCol}`)) {
          startCol = midCol;
        } else {
          return midCol;
        }
      }
      return endCol;
    }
    //否则使用defaultColWidth大约计算一个col
    return Math.min(Math.ceil(absoluteX / this.internalProps.defaultColWidth), this.colCount - 1);
  }
  /**
   * 清除选中单元格
   */
  clearSelected() {
    this.stateManeger.updateSelectPos(-1, -1);
  }
  /**
   * 选中单元格  和鼠标选中单元格效果一致
   * @param col
   * @param row
   */
  selectCell(col: number, row: number) {
    this.stateManeger.updateSelectPos(col, row);
    this.stateManeger.endSelectCells();
  }

  abstract isListTable(): boolean;
  abstract isPivotTable(): boolean;

  protected abstract getSortFuncFromHeaderOption(
    columns: ColumnsDefine | undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): ((v1: any, v2: any, order: string) => 0 | 1 | -1) | undefined;
  abstract refreshHeader(): void;
  abstract refreshRowColCount(): void;
  abstract getHierarchyState(col: number, row: number): HierarchyState | null;
  abstract toggleHierarchyState(col: number, row: number): void;
  abstract hasHierarchyTreeHeader(): boolean;
  abstract getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo;
  abstract moveHeaderPosition(source: CellAddress, target: CellAddress): boolean;
  /** @private */
  abstract getFieldData(field: FieldDef | FieldFormat | undefined, col: number, row: number): FieldData;
  abstract getRecordIndexByRow(col: number, row: number): number;
  abstract getCellOriginRecord(col: number, row: number): MaybePromiseOrUndefined;
  abstract getCellValue(col: number, row: number): FieldData;
  abstract getCellOriginValue(col: number, row: number): FieldData;
  /**
   * 更新页码
   * @param cof 修改页码
   */
  updatePager(cof: IPagerConf): void {
    if (this.pagerConf) {
      typeof cof.currentPage === 'number' && cof.currentPage >= 0 && (this.pagerConf.currentPage = cof.currentPage);
      cof.perPageCount && (this.pagerConf.perPageCount = cof.perPageCount || this.pagerConf.perPageCount);
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      this.dataSource.updatePager(this.pagerConf);
      this.refreshRowColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.invalidate();
    }
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
  get records(): any[] | null {
    return this.internalProps.records || null;
  }
  /**
   * Get the data source.
   */
  get dataSource(): DataSource | CachedDataSource {
    return this.internalProps.dataSource;
  }
  /**
   * Set the data source from given
   */
  set dataSource(dataSource: DataSource | CachedDataSource) {
    // 清空单元格内容
    this.scenegraph.clearCells();
    _setDataSource(this, dataSource);
    this.refreshRowColCount();
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
    this.invalidate();
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
    if (this.internalProps.autoWrapText === autoWrapText) {
      return;
    }
    this.internalProps.autoWrapText = autoWrapText;
    this.options.autoWrapText = autoWrapText;
    if (this.internalProps.layoutMap) {
      //后面如果修改是否转置
      this.refreshHeader();
      // if (this.internalProps.autoRowHeight) this.computeRowsHeight();
      this.invalidate();
    }
  }

  /**
   * 获取当前使用的主题
   */
  get theme(): TableTheme {
    return this.internalProps.theme;
  }
  /**
   * 设置主题
   */
  set theme(theme: TableTheme) {
    const t = themes.of(theme);
    this.internalProps.theme = t ? t : themes.DEFAULT;
    this.options.theme = theme;
    this._updateSize();
    this._resetFrozenColCount();
    this.invalidate();
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
  getBodyColumnDefine(col: number, row: number): ColumnDefine {
    // TODO: 暂时修复透视表报错
    const body = this.internalProps.layoutMap.getBody(col, row);
    return body?.define;
  }

  getBodyColumnType(col: number, row: number): ColumnTypeOption {
    return this.internalProps.layoutMap.getBody(col, row).columnType;
  }
  /**
   * 根据行列号获取对应的字段名
   * @param  {number} col column index.
   * @param  {number} row row index.
   */
  getHeaderField(col: number, row: number): FieldDef {
    return this.internalProps.layoutMap.getHeaderField(col, row);
  }
  getHeaderFieldKey(col: number, row: number): FieldDef {
    return this.internalProps.layoutMap.getHeaderFieldKey(col, row);
  }
  /**
   * 根据行列号获取配置
   * @param  {number} col column index.
   * @param  {number} row row index.
   * @return {ColumnDefine} The column define object.
   */
  getHeaderDefine(col: number, row: number): ColumnDefine {
    const hd = this.internalProps.layoutMap.getHeader(col, row);
    return hd?.define;
  }
  getCellType(col: number, row: number): CellType {
    const hdType = this.internalProps.layoutMap.getCellType(col, row);
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
  getHeadersDefine(col: number, row: number): ColumnDefine[] {
    const headers = [];
    while (true) {
      const header = this.getHeaderDefine(col, row);
      if (header && (header.field || header.columns)) {
        headers.push(header);
      } else {
        break;
      }

      row++;
    }

    return headers;
  }
  _getHeaderLayoutMap(col: number, row: number): HeaderData {
    return this.internalProps.layoutMap.getHeader(col, row);
  }
  _getBodyLayoutMap(col: number, row: number): ColumnData | IndicatorData {
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
  getRecordByRowCol(col: number, row: number): MaybePromiseOrUndefined {
    if (this.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    return this.internalProps.dataSource?.get(this.getRecordIndexByRow(col, row));
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
    let hd;
    if (sortState.fieldKey) {
      hd = layoutMap.headerObjects.find((col: any) => col && col.fieldKey === sortState.fieldKey);
    } else {
      hd = layoutMap.headerObjects.find((col: any) => col && col.field === sortState.field);
    }
    if (hd) {
      const headercell = layoutMap.getHeaderCellAdress(hd.id as number);
      return headercell;
    }
    return undefined;
  }

  /**
   * 获取给定单元格的范围 如果是合并单元格,则返回合并单元格的范围
   */
  getCellRange(col: number, row: number): CellRange {
    return this.internalProps.layoutMap.getCellRange(col, row);
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
    const description = fieldDef?.description ?? field?.description;
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
  /**
   * 设置表格数据 及排序状态
   * @param records
   * @param sort
   */
  setRecords(records: Array<any>, sort?: SortState | SortState[]): void {
    const time = typeof window !== 'undefined' ? window.performance.now() : 0;
    // 清空单元格内容
    this.scenegraph.clearCells();

    //重复逻辑抽取updateWidthHeight
    if (sort !== undefined) {
      (this as any).sortState = sort;
      this.stateManeger.setSortState((this as any).sortState as SortState);
    }
    if (records) {
      _setRecords(this, records);
      if ((this as any).sortState) {
        let order: any;
        let field: any;
        let fieldKey: any;
        if (Array.isArray((this as any).sortState)) {
          if ((this as any).sortState.length !== 0) {
            ({ order, field, fieldKey } = (this as any).sortState?.[0]);
          }
        } else {
          ({ order, field, fieldKey } = (this as any).sortState as SortState);
        }
        // 根据sort规则进行排序
        if (order && field && order !== 'normal') {
          const sortFunc = this.getSortFuncFromHeaderOption(undefined, field, fieldKey);
          // 如果sort传入的信息不能生成正确的sortFunc，直接更新表格，避免首次加载无法正常显示内容
          let hd;
          if (fieldKey) {
            hd = this.internalProps.layoutMap.headerObjects.find((col: any) => col && col.fieldKey === fieldKey);
          } else {
            hd = this.internalProps.layoutMap.headerObjects.find((col: any) => col && col.field === field);
          }
          hd?.define?.sort && this.dataSource.sort(hd.field, order, sortFunc ?? defaultOrderFn);
        }
      }
      this.refreshRowColCount();
    } else {
      _setRecords(this, records);
    }

    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
    this.invalidate();
    console.log('setRecords cost time:', (typeof window !== 'undefined' ? window.performance.now() : 0) - time);
  }
  setDropDownMenuHighlight(cells: DropDownMenuHighlightInfo[]): void {
    this.stateManeger.setDropDownMenuHighlight(cells);
  }
  _dropDownMenuIsHighlight(colNow: number, rowNow: number, index: number): boolean {
    return this.stateManeger.dropDownMenuIsHighlight(colNow, rowNow, index);
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
  /** 获取单元格的基本信息 目前主要组织单元格信息给事件传递给用户的参数使用 */
  getCellInfo(col: number, row: number): MousePointerCellEvent {
    const colDef = this.isHeader(col, row) ? this.getHeaderDefine(col, row) : this.getBodyColumnDefine(col, row);
    return {
      col,
      row,
      field: this.getHeaderField(col, row),
      cellHeaderPaths: this.internalProps.layoutMap.getCellHeaderPaths(col, row),
      caption: colDef.caption,
      columnType: colDef.columnType
        ? typeof colDef.columnType === 'string'
          ? colDef.columnType
          : 'progressbar'
        : 'text',
      originData: this.getCellOriginRecord(col, row),
      cellRange: this.getCellRangeRelativeRect({ col, row }),
      value: this.getCellValue(col, row),
      dataValue: this.getCellOriginValue(col, row),
      cellType: this.getCellType(col, row),
      scaleRatio: this.canvas.getBoundingClientRect().width / this.canvas.offsetWidth
    };
  }
  /** @private */
  _hasField(field: FieldDef, col: number, row: number): boolean {
    if (field == null) {
      return false;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return false;
    }
    const index = table.getRecordIndexByRow(col, row);
    return table.internalProps.dataSource.hasField(index, field);
  }
  /**
   * 获取单元格的样式 内部逻辑使用 获取到的样式并不是计算后的
   * @param col
   * @param row
   * @returns
   */
  _getCellStyle(col: number, row: number): FullExtendStyle {
    const { layoutMap } = this.internalProps;
    const isHeader = layoutMap.isHeader(col, row);
    if (isHeader) {
      let cacheStyle = this.headerStyleCache.get(`${col}-${row}`);
      if (cacheStyle) {
        return cacheStyle;
      }
      const hd = layoutMap.getHeader(col, row);
      // const styleClass = hd.headerType.StyleClass; //BaseHeader文件
      const styleClass = this.internalProps.headerHelper.getStyleClass(hd.headerType);
      const { style } = hd;
      cacheStyle = <FullExtendStyle>headerStyleContents.of(
        style,
        layoutMap.isColumnHeader(col, row)
          ? this.theme.headerStyle
          : layoutMap.isRowHeader(col, row)
          ? this.theme.rowHeaderStyle
          : this.theme.cornerHeaderStyle,
        {
          col,
          row,
          table: this as BaseTableAPI,
          value: this.getCellValue(col, row),
          dataValue: this.getCellOriginValue(col, row),
          cellHeaderPaths: this.getCellHeaderPaths(col, row)
        },
        styleClass,
        this.options.autoWrapText
      );
      this.headerStyleCache.set(`${col}-${row}`, cacheStyle);
      return cacheStyle;
    }
    let cacheKey;
    //如果是主体部分，获取相应的style
    if (
      (this.isListTable() && !(this as any).transpose) ||
      (this.isPivotTable() && (this.internalProps.layoutMap as PivotHeaderLayoutMap).indicatorsAsCol)
    ) {
      cacheKey = col;
    } else {
      cacheKey = row;
    }
    let cacheStyle = this.bodyStyleCache.get(cacheKey);
    if (cacheStyle) {
      return cacheStyle;
    }
    const column = layoutMap.getBody(col, row);
    // const styleClass = column?.columnType?.StyleClass; //BaseColumn文件
    const styleClass = this.internalProps.bodyHelper.getStyleClass(column.columnType);
    const style = column?.style;
    cacheStyle = <FullExtendStyle>columnStyleContents.of(
      style,
      this.theme.bodyStyle,
      {
        col,
        row,
        table: this,
        value: this.getCellValue(col, row),
        dataValue: this.getCellOriginValue(col, row),
        cellHeaderPaths: this.getCellHeaderPaths(col, row)
      },
      styleClass,
      this.options.autoWrapText
    );
    this.bodyStyleCache.set(cacheKey, cacheStyle);
    return cacheStyle;
  }
  /**
   * 该列是否可调整列宽
   * @param col
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

    const limit = this.colWidthsLimit[col];
    if (!limit || !limit.min || !limit.max) {
      return true;
    }
    return limit.max !== limit.min;
  }
  /**
   * 选中位置是否可拖拽调整位置
   * @param col
   * @returns
   */
  _canDragHeaderPosition(col: number, row: number): boolean {
    if (this.isHeader(col, row) && this.stateManeger.isSelected(col, row)) {
      const selectRange = this.stateManeger.select.ranges[0];
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
      const define = this.getHeaderDefine(col, row);
      if (define.dragHeader === undefined) {
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
      return define.dragHeader;
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
      this.stateManeger.menu.isShow = true;
      this.internalProps.menuHandler._bindToCell(col, row, menuType, dropDownMenuOptions);
    }
    // this.stateManeger.showDropDownMenu(col,row,) //最好和这个保持一致
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
      fontFamily: theme.text.fontFamily,
      fontSize: theme.text.fontSize,
      fontWeight: theme.text.fontWeight,
      fontVariant: theme.text.fontVariant,
      fontStyle: theme.text.fontStyle,
      lineHeight: theme.text.lineHeight,
      autoWrapText: autoWrapText ?? false,
      lineClamp: lineClamp ?? 'auto',
      textOverflow,
      borderColor: isBoolean(theme.group.stroke)
        ? getProp('borderColor', actStyle, col, row, this)
        : (theme.group.stroke as string),
      borderLineWidth: theme.group.lineWidth,
      borderLineDash: theme.group.lineDash,
      underline: !!theme.text.underline,
      // underlineColor: theme.text.underlineColor,
      // underlineDash: theme.text.underlineDash,
      lineThrough: !!theme.text.lineThrough,
      // lineThroughColor: theme.text.lineThroughColor,
      // lineThroughDash: (theme.text as any).lineThroughDash
      padding: theme._vtable.padding,
      underlineWidth: theme.text.underline,
      lineThroughLineWidth: theme.text.lineThrough
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
  /**
   * 滚动到具体某个单元格位置
   * @param cellAddr 要滚动到的单元格位置
   */
  scrollToCell(cellAddr: { col?: number; row?: number }) {
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
    this.invalidate();
  }

  /**获取选中区域的内容 作为复制内容 */
  getCopyValue(): string {
    const ranges = this.stateManeger.select.ranges;
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
                const strCellValue = `${copyCellValue}`;
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
        copyValue += '\n';
      }
    }
    return copyValue;
  }

  /**获取选中区域的每个单元格详情 */
  getSelectedCellInfos(): CellInfo[][] {
    const ranges = this.stateManeger.select.ranges;
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
  /** 计算字体的宽度接口 */
  measureText(text: string, font: { fontSize: number; fontFamily: string }): ITextSize {
    return textMeasure.measureText(text, font);
  }
  measureTextBounds(attributes: IWrapTextGraphicAttribute): ITextSize {
    const text = new WrapText(attributes);
    return {
      width: text.AABBBounds.width(),
      height: text.AABBBounds.height()
    };
  }
  /** 获取单元格上定义的自定义渲染配置 */
  getCustomRender(col: number, row: number): ICustomRender {
    let customRender;
    if (this.getCellType(col, row) !== 'body') {
      const define = this.getHeaderDefine(col, row);
      customRender = define?.headerCustomRender;
    } else {
      const define = this.getBodyColumnDefine(col, row);
      customRender = define?.customRender || this.customRender;
    }
    return customRender;
  }
  /** 获取单元格上定义的自定义布局元素配置 */
  getCustomLayout(col: number, row: number): ICustomLayout {
    let customLayout;
    if (this.getCellType(col, row) !== 'body') {
      const define = this.getHeaderDefine(col, row);
      customLayout = define?.headerCustomLayout;
    } else {
      const define = this.getBodyColumnDefine(col, row);
      customLayout = define?.customLayout;
    }
    return customLayout;
  }
}
