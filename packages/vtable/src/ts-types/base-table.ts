import type { ITextSize } from '@visactor/vutils';
import type { RectProps, MaybePromiseOrUndefined, ICellHeaderPaths, CellInfo } from './common';
import type {
  AnyListener,
  TableEventHandlersEventArgumentMap,
  TableEventHandlersReturnMap,
  EventListenerId,
  MousePointerCellEvent
} from './events';
import type { MenuListItem, DropDownMenuEventInfo, DropDownMenuHighlightInfo } from './menu';
import type { CellStyle } from './style-define';
import type { ColumnIconOption } from './icon';
import type { ColumnData, ColumnDefine, ColumnsDefine, HeaderData, IndicatorData } from './list-table/layout-map/api';
export type { HeaderData } from './list-table/layout-map/api';
import type { TableTheme } from '../themes/theme';
import type { ICustomRender } from './customElement';
export type LayoutObjectId = number | string;
import type { Rect } from '../tools/Rect';
import type { Scenegraph } from '../scenegraph/scenegraph';
import type { StateManeger } from '../state/state';
import type { EventManeger } from '../event/event';
import type {
  CellAddress,
  CellRange,
  CellType,
  ColumnTypeOption,
  DataSourceAPI,
  FieldData,
  FieldDef,
  FieldFormat,
  FullExtendStyle,
  HeaderValues,
  HierarchyState,
  IDataConfig,
  IPagerConf,
  ITableThemeDefine,
  SortState,
  TableKeyboardOptions,
  WidthModeDef
} from '.';
import type { TooltipOptions } from './tooltip';
import type { IWrapTextGraphicAttribute } from '../scenegraph/graphic/text';
import type { ICustomLayout } from './customLayout';
import type { CachedDataSource, DataSource } from '../data';
import type { MenuHandler } from '../menu/dom/MenuHandler';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../layout';
import type { PivoLayoutMap } from '../layout/pivot-layout';
import type { TooltipHandler } from '../tooltip/TooltipHandler';
import type { BodyHelper } from '../body-helper/body-helper';
import type { HeaderHelper } from '../header-helper/header-helper';
import type { EventHandler } from '../event/EventHandler';
import type { NumberMap } from '../tools/NumberMap';
import type { FocusInput } from '../core/FouseInput';

export interface IBaseTableProtected {
  element: HTMLElement;
  // scrollable: Scrollable;
  handler: EventHandler;
  focusControl: FocusInput;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  rowCount: number;
  colCount: number;
  frozenColCount: number;
  allowFrozenColCount: number;

  frozenRowCount: number;
  defaultRowHeight: number;
  /**表头默认行高 可以按逐行设置 如果没有就取defaultRowHeight */
  defaultHeaderRowHeight: number | number[];
  defaultColWidth: number;
  defaultHeaderColWidth: number | number[];
  // font?: string;
  // underlayBackgroundColor?: string;
  keyboardOptions?: TableKeyboardOptions;

  // disableRowHeaderColumnResize?: boolean;
  // 列宽调整模式（全列调整；全列不可调整；仅表头单元格可调整；仅内容单元格可调整）
  columnResizeMode?: 'all' | 'none' | 'header' | 'body';
  /** 控制拖拽表头移动位置顺序开关 */
  dragHeaderMode?: 'all' | 'none' | 'column' | 'row';

  cachedRecordsRowHeightMap: NumberMap<string | number>; //存储每一条记录对应行的行高，只有当设置为自动换行随内容撑开才会起作用
  // headerRowHeightsMap: NumberMap<number>; //目前是用来存储了表头各行的高度，从headerRowHeight计算而来，headerRowHeight可以设置为数组的形式
  _rowHeightsMap: NumberMap<number>; //存储数据条目每行高度
  _colWidthsMap: NumberMap<string | number>; //存储各列的宽度
  _colContentWidthsMap: NumberMap<string | number>; //存储各列的内容宽度
  _colWidthsLimit: {
    //存储各列的宽度限制
    [col: number]: {
      max?: string | number;
      min?: string | number;
    };
  };
  calcWidthContext: {
    _: IBaseTableProtected;
    full: number;
    // em: number;
  };

  _rowRangeHeightsMap: Map<string, number>; //存储指定行范围的总高度
  _colRangeWidthsMap: Map<string, number>; //存储指定列范围的总宽度

  bodyHelper: BodyHelper;
  headerHelper: HeaderHelper;

  cellTextOverflows: { [at: string]: string };
  // headerDescriptions: { [at: string]: string };
  focusedTable: boolean;

  config:
    | {
        [name: string]: any;
      }
    | undefined;
  // scroll: {
  //   left: number;
  //   top: number;
  // };
  disposables?: { dispose: () => void }[] | null;
  theme: TableTheme;
  transpose?: boolean; //是否转置
  autoRowHeight?: boolean; //是否自动撑开高度 对于设置了autoWrapText的multilineText的列生效
  pixelRatio?: number;
  /** 下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失*/
  menu: {
    /** 代替原来的option.menuType */
    renderMode?: 'canvas' | 'html';
    /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownMenu*/
    defaultHeaderMenuItems?: MenuListItem[];
    /** 右键菜单。代替原来的option.contextmenu */
    contextMenuItems?: MenuListItem[] | ((field: FieldDef, row: number) => MenuListItem[]);
    /** 设置选中状态的菜单。代替原来的option.dropDownMenuHighlight  */
    dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
  };
  /** 提示弹框的相关配置。消失时机：显示后鼠标移动到指定区域外或者进入新的单元格后自动消失*/
  tooltip: {
    renderMode: 'html' | 'canvas';
    /** 代替原来hover:isShowTooltip配置 */
    isShowOverflowTextTooltip: boolean;
    /** 弹框是否需要限定在表格区域内 */
    confine: boolean;
  };

  dataSourceEventIds?: EventListenerId[];
  headerEvents?: EventListenerId[];
  layoutMap: PivotHeaderLayoutMap | SimpleHeaderLayoutMap | PivoLayoutMap;
  headerValues?: HeaderValues;
  tooltipHandler: TooltipHandler;

  // headerRowHeight: number[] | number;//移到了BaseTable
  sortState: SortState | SortState[];

  dataSource: DataSource | CachedDataSource;
  records?: any[] | null;
  allowRangePaste: boolean;
  //重新思考逻辑：如果为false，行高按设置的rowHeight；如果设置为true，则按lineHeight及是否自动换行综合计算行高 2021.11.19 by：lff

  autoWrapText?: boolean;

  menuHandler: MenuHandler;

  /**
   * 计算列宽时 指定最大列宽 可设置boolean或者具体的值 默认为450
   */
  limitMaxAutoWidth?: boolean | number;
}
export interface BaseTableConstructorOptions {
  // /** 指定表格的行数 */
  // rowCount?: number;

  // /** 指定表格的列数 */
  // colCount?: number;
  /**
   * 当前需要冻结的列数 基本表格生效
   */
  frozenColCount?: number;
  // /** 待实现 TODO */
  // frozenRowCount?: number;
  /** 可冻结列数，表示前多少列会出现冻结操作按钮 基本表格生效 */
  allowFrozenColCount?: number;
  /**
   * 默认行高. 默认 40
   */
  defaultRowHeight?: number;
  /** 列表头默认行高 可以按逐行设置 如果没有就取defaultRowHeight */
  defaultHeaderRowHeight?: number | number[];
  /**
   * 默认列宽. 默认 80
   */
  defaultColWidth?: number;
  /** 行表头默认列宽 可以按逐列设置 如果没有就取defaultColWidth */
  defaultHeaderColWidth?: number | number[];
  /** 快捷键功能设置 */
  keyboardOptions?: TableKeyboardOptions;
  /**
   * Canvas parent element
   */
  parentElement?: HTMLElement | null;

  /**
   * 调整列宽 可操作范围。'all' | 'none' | 'header' | 'body'; 整列间隔线|禁止调整|只能在表头处间隔线|只能在body间隔线
   */
  columnResizeMode?: 'all' | 'none' | 'header' | 'body';
  /** 控制拖拽表头移动位置顺序开关 */
  dragHeaderMode?: 'all' | 'none' | 'column' | 'row';
  /**
   * 是否显示固定列图钉 基本表格生效
   */
  showFrozenIcon?: boolean;

  padding?:
    | {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      }
    | number;
  /** hover交互配置 */
  hover?: {
    /** hover交互响应模式：十字交叉 整列 整行 或者单个单元格 */
    highlightMode: 'cross' | 'column' | 'row' | 'cell';
    /** 不响应鼠标hover交互 */
    disableHover?: boolean;
    /** 单独设置表头不响应鼠标hover交互 */
    disableHeaderHover?: boolean;
  };
  /** 选择单元格交互配置 */
  select?: {
    /** 不响应鼠标select交互 */
    disableSelect?: boolean;
    /** 单独设置表头不响应鼠标select交互 */
    disableHeaderSelect?: boolean;
  };
  /** 下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失*/
  menu?: {
    /** 代替原来的option.menuType  html目前实现较完整 先默认html渲染方式*/
    renderMode?: 'canvas' | 'html';
    /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownMenu*/
    defaultHeaderMenuItems?: MenuListItem[];
    /** 右键菜单。代替原来的option.contextmenu */
    contextMenuItems?: MenuListItem[] | ((field: string, row: number) => MenuListItem[]);
    /** 设置选中状态的菜单。代替原来的option.dropDownMenuHighlight  */
    dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
  };
  /** tooltip相关配置 */
  tooltip?: {
    /** html目前实现较完整 先默认html渲染方式 */
    renderMode?: 'html'; // 目前暂不支持canvas方案
    /** 代替原来hover:isShowTooltip配置 暂时需要将renderMode配置为html才能显示，canvas的还未开发*/
    isShowOverflowTextTooltip?: boolean;
    /** 是否将 tooltip 框限制在画布区域内，默认开启。针对renderMode:"html"有效 */
    confine?: boolean;
  };
  /**
   * Theme
   */
  theme?: ITableThemeDefine;
  /** 宽度模式 */
  widthMode?: 'standard' | 'adaptive' | 'autoWidth' | 'standard-aeolus';
  /** 行高是否根据内容来计算 */
  autoRowHeight?: boolean;
  /** 设备的像素比 不配的话默认获取window.devicePixelRatio */
  pixelRatio?: number;
  /** 自定义渲染 函数形式*/
  customRender?: ICustomRender;
  /**
   * 传入用户实例化的数据对象 目前不完善
   */
  dataSource?: DataSource;
  /**
   * 数据集合
   */
  records?: any[];
  /** 开启自动换行 默认false */
  autoWrapText?: boolean;
  /** 单元格中可显示最大字符数 默认200 */
  maxCharactersNumber?: number; //
  /** toolip最大字符数 */
  maxTooltipCharactersNumber?: number;
  /** 最大可操作条目数 如copy操作可复制出最大数据条目数 */
  maxOperatableRecordCount?: number;
  /**
   * 计算列宽时 指定最大列宽 可设置boolean或者具体的值 默认为450
   */
  limitMaxAutoWidth?: boolean | number;

  // maximum number of data items maintained in table instance
  maintainedDataCount?: number;
}
export interface BaseTableAPI {
  /** 表格的行数 */
  rowCount: number;
  /** 表格的列数 */
  colCount: number;
  /** 表格除去外层frame后的宽度 */
  tableNoFrameWidth: number;
  /** 表格除去外层frame后的高度 */
  tableNoFrameHeight: number;
  /** 表格的冻结行数 包括表头在内 */
  frozenRowCount: number;
  /** 表格的冻结列数 包括表头在内 */
  frozenColCount: number;
  /** 当前表格默认表头行高 */
  defaultHeaderRowHeight: number | number[];
  /** 当前表格默认行高 */
  defaultRowHeight: number;
  /** 当前表格默认列宽 */
  defaultColWidth: number;
  /** 当前表格默认表头列宽 */
  defaultHeaderColWidth: number | number[];
  /** 当前表格快捷键设置 */
  keyboardOptions: TableKeyboardOptions | null;
  /**
   * 是否显示图钉
   */
  showFrozenIcon: boolean;
  readonly canvas: HTMLCanvasElement;
  /** 表格可视区域的行数 */
  readonly visibleRowCount: number;
  /** 表格可视区域的列数 */
  readonly visibleColCount: number;
  /** 表格滚动值left */
  scrollLeft: number;
  /** 表格滚动值top */
  scrollTop: number;
  /** 用户设置的options 不要修改这个这个 */
  options: BaseTableConstructorOptions;
  /** 设置的全局下拉菜单列表项配置 */
  globalDropDownMenu?: MenuListItem[];
  /** 设置的全局自定义渲染函数 */
  customRender?: ICustomRender;
  /** 表格数据 */
  records: any[] | null;
  /** 表格数据管理对象 */
  dataSource: DataSourceAPI;
  /** 设置的表格主题 */
  theme: TableTheme;
  /** 可允许设置冻结的最大列数 */
  allowFrozenColCount: number;

  /** 存储内部用到的属性 变量等 */
  internalProps: IBaseTableProtected;
  /** 分页信息 */
  pagerConf?: IPagerConf;

  /** 表格偏移像素值 水平方向 */
  tableX: number;
  /** 表格偏移像素值 垂直方向 */
  tableY: number;
  /** 表格宽度模式 */
  widthMode: WidthModeDef;

  listen: (<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    listener: (...event: TableEventHandlersEventArgumentMap[TYPE]) => TableEventHandlersReturnMap[TYPE]
  ) => EventListenerId) &
    ((type: string, listener: AnyListener) => EventListenerId);

  /** 场景树对象 */
  scenegraph: Scenegraph;
  /** 状态管理模块 */
  stateManeger?: StateManeger;
  /** 事件管理模块 */
  eventManeger?: EventManeger;
  /** 行表头的层数 */
  rowHeaderLevelCount: number;
  /** 列表头的层数 */
  columnHeaderLevelCount: number;
  /** 获取表格绘制的范围 不包括frame的宽度 */
  getDrawRange: () => Rect;
  /** 将鼠标坐标值 转换成表格坐标系中的坐标位置 */
  _getMouseAbstractPoint: (
    evt: TouchEvent | MouseEvent | undefined,
    isAddScroll?: boolean
  ) => { x: number; y: number } | null;
  getElement: () => HTMLElement;
  getParentElement: () => HTMLElement;

  setFrozenColCount: (count: number) => void;
  _setFrozenColCount: (count: number) => void;
  _updateSize: () => void;

  invalidate: () => void;
  throttleInvalidate: () => void;
  getRowHeight: (row: number) => number;
  setRowHeight: (row: number, height: number, clearCache?: boolean) => void;
  getColWidth: (col: number) => number;
  setColWidth: (col: number, width: number | string, clearCache?: boolean, skipCheckFrozen?: boolean) => void;
  _getColContentWidth: (col: number) => number;
  _setColContentWidth: (col: number, width: number | string, clearCache?: boolean) => void;
  getMaxColWidth: (col: number) => number;
  setMaxColWidth: (col: number, maxwidth: string | number) => void;
  getMinColWidth: (col: number) => number;
  setMinColWidth: (col: number, minwidth: string | number) => void;
  getCellRect: (col: number, row: number) => RectProps;
  getCellRelativeRect: (col: number, row: number) => RectProps;
  getCellsRect: (startCol: number, startRow: number, endCol: number, endRow: number) => RectProps;
  getCellRangeRect: (cellRange: CellRange | CellAddress) => RectProps;
  getCellRangeRelativeRect: (cellRange: CellRange | CellAddress) => RectProps;
  getVisibleCellRangeRelativeRect: (cellRange: CellRange | CellAddress) => RectProps;
  isFrozenCell: (col: number, row: number) => { row: boolean; col: boolean } | null;
  getRowAt: (absoluteY: number) => { top: number; row: number; bottom: number };
  getColAt: (absoluteX: number) => { left: number; col: number; right: number };
  getCellAt: (absoluteX: number, absoluteY: number) => CellAddress;
  _makeVisibleCell: (col: number, row: number) => void;
  // setFocusCursor(col: number, row: number): void;
  // focusCell(col: number, row: number): void;
  getCellOverflowText: (col: number, row: number) => string | null;
  getColsWidth: (startCol: number, endCol: number) => number;
  getRowsHeight: (startRow: number, endRow: number) => number;

  dispose: () => void;
  addDisposable: (disposable: { dispose: () => void }) => void;
  _getCellStyle: (col: number, row: number) => FullExtendStyle;

  getFrozenRowsHeight: () => number;
  getFrozenColsWidth: () => number;
  selectCell: (col: number, row: number) => void;

  getAllRowsHeight: () => number;
  getAllColsWidth: () => number;

  unlisten: (id: EventListenerId) => void;
  getBodyField: (col: number, row: number) => FieldDef | undefined;
  getRecordByRowCol: (col: number, row: number) => MaybePromiseOrUndefined;
  getRecordIndexByRow: (col: number, row: number) => number;
  getRecordStartRowByRecordIndex: (index: number) => number;

  getHeaderField: (col: number, row: number) => any | undefined;
  getHeaderFieldKey: (col: number, row: number) => any | undefined;

  _getHeaderCellBySortState: (sortState: SortState) => CellAddress | undefined;
  getHeaderDefine: (col: number, row: number) => ColumnDefine;
  _getHeaderLayoutMap: (col: number, row: number) => HeaderData;
  getContext: () => CanvasRenderingContext2D;
  getCellRange: (col: number, row: number) => CellRange;
  _resetFrozenColCount: () => void;
  isCellRangeEqual: (col: number, row: number, targetCol: number, targetRow: number) => boolean;
  _getLayoutCellId: (col: number, row: number) => LayoutObjectId;
  _getBodyLayoutMap: (col: number, row: number) => ColumnData | IndicatorData;
  getBodyColumnDefine: (col: number, row: number) => ColumnDefine;
  getBodyColumnType: (col: number, row: number) => ColumnTypeOption;
  fireListeners: <TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    ...event: TableEventHandlersEventArgumentMap[TYPE]
  ) => TableEventHandlersReturnMap[TYPE][];

  //更新分页
  updatePager: (cof: IPagerConf) => void;
  //hover

  getHeaderDescription: (col: number, row: number) => string | undefined;

  getCellValue: (col: number, row: number) => string | null;
  getCellOriginValue: (col: number, row: number) => any;
  getCellOriginRecord: (col: number, row: number) => MaybePromiseOrUndefined;
  _dropDownMenuIsHighlight: (col: number, row: number, index: number) => boolean;
  // bindEvents(): void;
  refreshRowColCount: () => void;
  getFieldData: (field: FieldDef | FieldFormat | undefined, col: number, row: number) => FieldData;
  _hasField: (field: FieldDef, col: number, row: number) => boolean;
  getCellHeaderPaths: (col: number, row: number) => ICellHeaderPaths;
  getCellType: (col: number, row: number) => CellType;
  // isHitIcon(col: number, row: number, x: number, y: number, iconType: IconFuncTypeEnum): boolean;
  getCellIcons: (col: number, row: number) => ColumnIconOption[];

  getMenuInfo: (col: number, row: number, type: string) => DropDownMenuEventInfo;
  /**
   * 获取某个单元格的样式 共业务方调用
   * @param col
   * @param row
   */
  getCellStyle: (col: number, row: number) => CellStyle; //  计算后style

  getHierarchyState: (col: number, row: number) => HierarchyState | null;

  hasHierarchyTreeHeader: () => boolean;

  _canDragHeaderPosition: (col: number, row: number) => boolean;

  isHeader: (col: number, row: number) => boolean;

  isColumnHeader: (col: number, row: number) => boolean;

  isCornerHeader: (col: number, row: number) => boolean;

  isRowHeader: (col: number, row: number) => boolean;

  getCopyValue: () => string;

  getSelectedCellInfos: () => CellInfo[][];
  getCellInfo: (col: number, row: number) => MousePointerCellEvent;

  showTooltip: (col: number, row: number, tooltipOptions?: TooltipOptions) => void;

  measureText: (text: string, font: { fontSize: number; fontFamily: string }) => ITextSize;
  measureTextBounds: (attributes: IWrapTextGraphicAttribute) => ITextSize;

  _canResizeColumn: (col: number, row: number) => boolean;

  getCustomRender: (col: number, row: number) => ICustomRender;
  getCustomLayout: (col: number, row: number) => ICustomLayout;
  isListTable: () => boolean;
  isPivotTable: (() => boolean) & (() => boolean);

  _clearColRangeWidthsMap: (col?: number) => void;

  //#endregion  tableAPI
}
export interface ListTableProtected extends IBaseTableProtected {
  columns: ColumnsDefine;
  layoutMap: SimpleHeaderLayoutMap;
}

export interface PivotTableProtected extends IBaseTableProtected {
  layoutMap: PivotHeaderLayoutMap | PivoLayoutMap;
  dataConfig?: IDataConfig;
  /**
   * 透视表 传入数据是透视后的嵌套层级结构 还是需要进行汇总计算的平坦数据
   */
  enableDataAnalysis?: boolean;
}
