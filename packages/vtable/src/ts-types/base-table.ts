import type { IBoundsLike, ITextSize } from '@visactor/vutils';
import type {
  RectProps,
  MaybePromiseOrUndefined,
  ICellHeaderPaths,
  CellInfo,
  CustomCellStyle,
  CustomCellStyleArrangement,
  IDimensionInfo
} from './common';
import type {
  TableEventListener,
  TableEventHandlersEventArgumentMap,
  TableEventHandlersReturnMap,
  EventListenerId,
  MousePointerCellEvent
} from './events';
import type { MenuListItem, DropDownMenuEventInfo, DropDownMenuHighlightInfo } from './menu';
import type { CellStyle } from './style-define';
import type { ColumnIconOption } from './icon';
import type {
  ColumnData,
  ColumnDefine,
  ColumnsDefine,
  HeaderData,
  IndicatorData,
  SeriesNumberColumnData
} from './list-table/layout-map/api';
export type { HeaderData } from './list-table/layout-map/api';
import type { TableTheme } from '../themes/theme';
import type { ICustomRender } from './customElement';
import type { LayoutObjectId } from './table-engine';
import type { Rect } from '../tools/Rect';
import type { Scenegraph } from '../scenegraph/scenegraph';
import type { StateManager } from '../state/state';
import type { EventManager } from '../event/event';
import type {
  CellAddress,
  CellRange,
  CellLocation,
  ColumnTypeOption,
  DataSourceAPI,
  FieldData,
  FieldDef,
  FieldFormat,
  FullExtendStyle,
  HeaderValues,
  HeightModeDef,
  HierarchyState,
  IPivotTableDataConfig,
  IPagination,
  ITableThemeDefine,
  SortState,
  TableKeyboardOptions,
  WidthModeDef,
  IHeaderTreeDefine,
  IDimension,
  IIndicator,
  StickCell,
  CustomMergeCell,
  CustomMerge,
  IColumnDimension,
  IRowDimension,
  TableEventOptions,
  IPivotChartDataConfig,
  IListTableDataConfig,
  IRowSeriesNumber,
  ColumnSeriesNumber,
  ColumnStyleOption,
  WidthAdaptiveModeDef,
  HeightAdaptiveModeDef,
  ColumnInfo,
  RowInfo,
  CellAddressWithBound,
  Placement,
  CustomMergeCellFunc
} from '.';
import type { TooltipOptions } from './tooltip';
import type { IWrapTextGraphicAttribute } from '../scenegraph/graphic/text';
import type { ICustomLayout } from './customLayout';
import type { CachedDataSource, DataSource } from '../data';
import type { MenuHandler } from '../components/menu/dom/MenuHandler';
import type { PivotHeaderLayoutMap } from '../layout/pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../layout';
import type { TooltipHandler } from '../components/tooltip/TooltipHandler';
import type { BodyHelper } from '../body-helper/body-helper';
import type { HeaderHelper } from '../header-helper/header-helper';
import type { EventHandler } from '../event/EventHandler';
import type { NumberMap } from '../tools/NumberMap';
import type { FocusInput } from '../core/FouseInput';
import type { ITableLegendOption } from './component/legend';
import type { DataSet } from '@visactor/vdataset';
import type { Title } from '../components/title/title';
import type { ITitle } from './component/title';
import type { DiscreteTableLegend } from '../components/legend/discrete-legend/discrete-legend';
import type { ContinueTableLegend } from '../components/legend/continue-legend/continue-legend';
import type { NumberRangeMap } from '../layout/row-height-map';
import type { RowSeriesNumberHelper } from '../core/row-series-number-helper';
import type { ReactCustomLayout } from '../components/react/react-custom-layout';
import type { ISortedMapItem } from '../data/DataSource';
import type { IAnimationAppear, ITableAnimationOption } from './animation/appear';
import type { IEmptyTip } from './component/empty-tip';
import type { EmptyTip } from '../components/empty-tip/empty-tip';
import type { EditManager } from '../edit/edit-manager';
import type { TableAnimationManager } from '../core/animation';
import type { CustomCellStylePlugin } from '../plugins/custom-cell-style';

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
  unfreezeAllOnExceedsMaxWidth: boolean;
  allowFrozenColCount: number;

  frozenRowCount: number;
  rightFrozenColCount: number;
  bottomFrozenRowCount: number;
  defaultRowHeight: number | 'auto';
  /**表头默认行高 可以按逐行设置 如果没有就取defaultRowHeight */
  defaultHeaderRowHeight: (number | 'auto') | (number | 'auto')[];
  defaultColWidth: number;
  defaultHeaderColWidth: (number | 'auto') | (number | 'auto')[];
  // font?: string;
  // underlayBackgroundColor?: string;
  keyboardOptions?: TableKeyboardOptions;
  eventOptions?: TableEventOptions;
  rowSeriesNumber?: IRowSeriesNumber;
  columnSeriesNumber?: ColumnSeriesNumber[];
  // disableRowHeaderColumnResize?: boolean;
  /**
   *@deprecated 请使用resize.columnResizeType
   */
  columnResizeMode?: 'all' | 'none' | 'header' | 'body';
  /**
   *@deprecated 请使用resize.rowResizeType
   */
  rowResizeMode?: 'all' | 'none' | 'header' | 'body';
  /**
   *@deprecated 请使用resize.columnResizeType
   */
  columnResizeType?: 'column' | 'indicator' | 'all' | 'indicatorGroup';
  /**
   *@deprecated 请使用resize.rowResizeType
   */
  rowResizeType?: 'row' | 'indicator' | 'all' | 'indicatorGroup';
  /** 控制拖拽表头移动位置顺序开关 */
  dragHeaderMode?: 'all' | 'none' | 'column' | 'row';
  /** 拖拽表头移动位置 针对冻结部分的规则
   * "disabled"（禁止调整冻结列位置）：不允许其他列的表头移入冻结列，也不允许冻结列移出，冻结列保持不变。
   * "adjustFrozenCount"（根据交互结果调整冻结数量）：允许其他列的表头移入冻结列，及冻结列移出，并根据拖拽的动作调整冻结列的数量。当其他列的表头被拖拽进入冻结列位置时，冻结列数量增加；当其他列的表头被拖拽移出冻结列位置时，冻结列数量减少。
   * "fixedFrozenCount"（可调整冻结列，并维持冻结数量不变）：允许自由拖拽其他列的表头移入或移出冻结列位置，同时保持冻结列的数量不变。
   */
  frozenColDragHeaderMode?: 'disabled' | 'adjustFrozenCount' | 'fixedFrozenCount';
  cachedRecordsRowHeightMap: NumberMap<string | number>; //存储每一条记录对应行的行高，只有当设置为自动换行随内容撑开才会起作用
  // headerRowHeightsMap: NumberMap<number>; //目前是用来存储了表头各行的高度，从headerRowHeight计算而来，headerRowHeight可以设置为数组的形式
  _rowHeightsMap: NumberRangeMap; //存储数据条目每行高度
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

  _widthResizedColMap: Set<number | string>; //记录下被手动调整过列宽的列号
  _heightResizedRowMap: Set<number>; //记录下被手动调整过行高的行号

  bodyHelper: BodyHelper;
  headerHelper: HeaderHelper;
  rowSeriesNumberHelper: RowSeriesNumberHelper;

  cellTextOverflows: { [at: string]: string };
  // headerDescriptions: { [at: string]: string };
  focusedTable: boolean;

  // scroll: {
  //   left: number;
  //   top: number;
  // };
  releaseList?: { release: () => void }[] | null;
  theme: TableTheme;
  transpose?: boolean; //是否转置
  // autoRowHeight?: boolean; //是否自动撑开高度 对于设置了autoWrapText的multilineText的列生效
  pixelRatio?: number;
  /** 下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失*/
  menu: {
    /** 代替原来的option.menuType */
    renderMode?: 'canvas' | 'html';
    /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownMenu*/
    defaultHeaderMenuItems?:
      | MenuListItem[]
      | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[]);
    /** 右键菜单。代替原来的option.contextmenu */
    contextMenuItems?:
      | MenuListItem[]
      | ((field: FieldDef, row: number, col: number, table?: BaseTableAPI) => MenuListItem[]);
    /** 设置选中状态的菜单。代替原来的option.dropDownMenuHighlight  */
    dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
    parentElement?: HTMLElement;
  };
  /** 提示弹框的相关配置。消失时机：显示后鼠标移动到指定区域外或者进入新的单元格后自动消失*/
  tooltip: {
    parentElement: HTMLElement;
    renderMode: 'html' | 'canvas';
    /** 代替原来hover:isShowTooltip配置 */
    isShowOverflowTextTooltip: boolean | ((col: number, row: number, table: BaseTableAPI) => boolean);
    /** 缩略文字提示框 延迟消失时间 */
    overflowTextTooltipDisappearDelay?: number;
    /** 弹框是否需要限定在表格区域内 */
    confine: boolean;
    position: Placement;
  };

  dataSourceEventIds?: EventListenerId[];
  // headerEvents?: EventListenerId[];
  layoutMap: SimpleHeaderLayoutMap | PivotHeaderLayoutMap;
  headerValues?: HeaderValues;
  tooltipHandler: TooltipHandler;

  // headerRowHeight: number[] | number;//移到了BaseTable
  sortState: SortState | SortState[];
  multipleSort?: boolean;

  dataSource: DataSource | CachedDataSource;
  records?: any;
  allowRangePaste: boolean;
  //重新思考逻辑：如果为false，行高按设置的rowHeight；如果设置为true，则按lineHeight及是否自动换行综合计算行高 2021.11.19 by：lff

  autoWrapText?: boolean;
  enableLineBreak?: boolean;

  menuHandler: MenuHandler;

  /**
   * 计算列宽时 指定最大列宽 可设置boolean或者具体的值 默认为450
   */
  limitMaxAutoWidth?: boolean | number;

  /**
   * 限制列宽最小值。
   */
  limitMinWidth?: number;

  limitMinHeight?: number;

  title?: Title;
  legends?: (DiscreteTableLegend | ContinueTableLegend)[];

  emptyTip?: EmptyTip;
  //是否开启图表异步渲染
  renderChartAsync?: boolean;
  // // 开启图表异步渲染 每批次渐进渲染图表个数
  // renderChartAsyncBatchCount?: number;

  stick: { changedCells: Map<string, StickCell> };

  customMergeCell?: CustomMergeCellFunc;
  /**
   * 'auto':和浏览器滚动行为一致 表格滚动到顶部/底部时 触发浏览器默认行为;
   *  设置为 'none' 时, 表格滚动到顶部/底部时, 不再触发父容器滚动
   * */
  overscrollBehavior?: 'auto' | 'none';

  modifiedViewBoxTransform?: boolean;
  // react component container
  bodyDomContainer?: HTMLElement;
  headerDomContainer?: HTMLElement;
  frozenBodyDomContainer?: HTMLElement;
  frozenHeaderDomContainer?: HTMLElement;
  rightFrozenBodyDomContainer?: HTMLElement;
  rightFrozenHeaderDomContainer?: HTMLElement;
  frozenBottomDomContainer?: HTMLElement;
  bottomDomContainer?: HTMLElement;
  rightFrozenBottomDomContainer?: HTMLElement;

  // 已使用一行的高度填充所有行
  useOneRowHeightFillAll?: boolean;

  // 启用树形结构数据内的merge配置
  enableTreeNodeMerge?: boolean;

  _oldRowCount?: number;
  _oldColCount?: number;
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
  frozenRowCount?: number;
  rightFrozenColCount?: number;
  bottomFrozenRowCount?: number;
  /** 最大冻结宽度，固定值 or 百分比。默认为'80%' */
  maxFrozenWidth?: number | string;
  /** 超过最大冻结宽度后是否全部解冻，默认true */
  unfreezeAllOnExceedsMaxWidth?: boolean;

  // /** 待实现 TODO */
  // frozenRowCount?: number;
  /** 可冻结列数，表示前多少列会出现冻结操作按钮 基本表格生效 */
  allowFrozenColCount?: number;
  /**
   * 默认行高. 默认 40
   */
  defaultRowHeight?: number | 'auto';
  /** 列表头默认行高 可以按逐行设置 如果没有就取defaultRowHeight */
  defaultHeaderRowHeight?: (number | 'auto') | (number | 'auto')[];
  /**
   * 默认列宽. 默认 80
   */
  defaultColWidth?: number;
  /** 行表头默认列宽 可以按逐列设置 如果没有就取defaultColWidth */
  defaultHeaderColWidth?: (number | 'auto') | (number | 'auto')[];
  /** 快捷键功能设置 */
  keyboardOptions?: TableKeyboardOptions;
  excelOptions?: {
    fillHandle?: boolean;
  };
  /** 事件触发相关设置 */
  eventOptions?: TableEventOptions;
  /**
   * Canvas container
   */
  container?: HTMLElement | null;

  /**
   * 调整列宽 可操作范围。'all' | 'none' | 'header' | 'body'; 整列间隔线|禁止调整|只能在表头处间隔线|只能在body间隔线
   */
  columnResizeMode?: 'all' | 'none' | 'header' | 'body';
  rowResizeMode?: 'all' | 'none' | 'header' | 'body';
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
    highlightMode?: 'cross' | 'column' | 'row' | 'cell';
    /** 不响应鼠标hover交互 */
    disableHover?: boolean;
    /** 单独设置表头不响应鼠标hover交互 */
    disableHeaderHover?: boolean;
    /** 单独设置坐标轴不响应鼠标hover交互 */
    disableAxisHover?: boolean;
  };
  /** 选择单元格交互配置 */
  select?: {
    /** 高亮范围模式：十字交叉 整列 整行 或者单个单元格。默认`cell` */
    highlightMode?: 'cross' | 'column' | 'row' | 'cell';
    /** 点击表头单元格效果
     * 'inline': 点击行表头则整行选中，选择列表头则整列选中；
     * 'cell': 仅仅选择当前点击的表头单元格；
     * 'body': 不选择表头，点击行表头则选择该行所有 body 单元格，点击列表头则选择该列所有 body 单元格。
     */
    headerSelectMode?: 'inline' | 'cell' | 'body';
    /** 不响应鼠标select交互 */
    disableSelect?: boolean | ((col: number, row: number, table: BaseTableAPI) => boolean);
    /** 单独设置表头不响应鼠标select交互 */
    disableHeaderSelect?: boolean;
    /** 点击空白区域是否取消选中 */
    blankAreaClickDeselect?: boolean;
    /** 点击外部区域是否取消选中 */
    outsideClickDeselect?: boolean; //
    /**  禁止拖拽框选 */
    disableDragSelect?: boolean;
    /** 是否在选择多行或多列时高亮范围 */
    highlightInRange?: boolean;
    /** 是否将选中的单元格自动滚动到视口内 默认为true */
    makeSelectCellVisible?: boolean;
  };
  /** 下拉菜单的相关配置。消失时机：显示后点击菜单区域外自动消失*/
  menu?: {
    /** 代替原来的option.menuType  html目前实现较完整 先默认html渲染方式*/
    renderMode?: 'canvas' | 'html';
    /** 内置下拉菜单的全局设置项 目前只针对基本表格有效 会对每个表头单元格开启默认的下拉菜单功能。代替原来的option.dropDownMenu*/
    defaultHeaderMenuItems?:
      | MenuListItem[]
      | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[]);
    /** 右键菜单。代替原来的option.contextmenu */
    contextMenuItems?:
      | MenuListItem[]
      | ((field: string, row: number, col: number, table?: BaseTableAPI) => MenuListItem[]);
    /** 设置选中状态的菜单。代替原来的option.dropDownMenuHighlight  */
    dropDownMenuHighlight?: DropDownMenuHighlightInfo[];
    parentElement?: HTMLElement;
  };
  /** tooltip相关配置 */
  tooltip?: {
    parentElement?: HTMLElement;
    /** html目前实现较完整 先默认html渲染方式 */
    renderMode?: 'html'; // 目前暂不支持canvas方案
    /** 是否显示缩略文字提示框。 代替原来hover:isShowTooltip配置 暂时需要将renderMode配置为html才能显示，canvas的还未开发*/
    isShowOverflowTextTooltip?: boolean | ((col: number, row: number, table: BaseTableAPI) => boolean);
    /** 缩略文字提示框 延迟消失时间 */
    overflowTextTooltipDisappearDelay?: number;
    /** 是否将 tooltip 框限制在画布区域内，默认开启。针对renderMode:"html"有效 */
    confine?: boolean;
    position?: Placement;
  };
  /**
   * Theme
   */
  theme?: ITableThemeDefine;
  /** 宽度模式 */
  widthMode?: 'standard' | 'adaptive' | 'autoWidth';
  /** 高度模式 */
  heightMode?: 'standard' | 'adaptive' | 'autoHeight';
  /** 当列宽度不能占满容器时，是否需要自动拉宽来填充容器的宽度。默认false */
  autoFillWidth?: boolean;
  /** 当行高度不能占满容器时，是否需要自动拉高来填充容器的高度。默认false */
  autoFillHeight?: boolean;

  /** adaptive 模式下宽度的适应策略 **/
  widthAdaptiveMode?: WidthAdaptiveModeDef;
  /** adaptive 模式下高度的适应策略 **/
  heightAdaptiveMode?: HeightAdaptiveModeDef;
  /** 当配置adaptive模式时，默认true，即在计算每行行高的基础上去等比拉伸行高撑满容器宽度的。如果不需要计算行高用默认行高撑满的话请配置为false */
  autoHeightInAdaptiveMode?: boolean;

  // /** 行高是否根据内容来计算 */
  // autoRowHeight?: boolean;
  /** 设备的像素比 不配的话默认获取window.devicePixelRatio */
  pixelRatio?: number;
  /** 自定义渲染 函数形式*/
  customRender?: ICustomRender;
  /** 开启自动换行 默认false */
  autoWrapText?: boolean;
  /** 是否处理换行符 */
  enableLineBreak?: boolean;
  /** 单元格中可显示最大字符数 默认200 */
  maxCharactersNumber?: number; //
  // /** toolip最大字符数 */
  // maxTooltipCharactersNumber?: number;
  /** 最大可操作条目数 如copy操作可复制出最大数据条目数 */
  maxOperatableRecordCount?: number;
  /**
   * 计算列宽时 指定最大列宽 可设置boolean或者具体的值 默认为450。手动拖拽列宽的话不收这个限制
   */
  limitMaxAutoWidth?: boolean | number;
  /**
   * 限制列宽最小值。如设置为true 则拖拽改变列宽时限制列宽最小为10px，设置为false则不进行限制。默认为10px
   */
  limitMinWidth?: boolean | number;
  limitMinHeight?: boolean | number;

  // maximum number of data items maintained in table instance
  maintainedDataCount?: number;

  legends?: ITableLegendOption | ITableLegendOption[];
  title?: ITitle;
  emptyTip?: true | IEmptyTip;
  /** 是否开启图表异步渲染 */
  renderChartAsync?: boolean;
  /** 开启图表异步渲染 每批次渐进渲染图表个数  默认是5个 */
  renderChartAsyncBatchCount?: number;

  customMergeCell?: CustomMergeCell;

  // #region for nodejs
  mode?: 'node' | 'browser';
  modeParams?: any;
  canvasWidth?: number | 'auto';
  canvasHeight?: number | 'auto';
  maxCanvasWidth?: number;
  maxCanvasHeight?: number;

  // #endregion
  /**
   * 'auto':和浏览器滚动行为一致 表格滚动到顶部/底部时 触发浏览器默认行为;
   *  设置为 'none' 时, 表格滚动到顶部/底部时, 不再触发父容器滚动
   * */
  overscrollBehavior?: 'auto' | 'none';

  // resize response time
  resizeTime?: number;

  canvas?: HTMLCanvasElement;
  viewBox?: IBoundsLike;
  chartOption?: any;
  disableInteraction?: boolean;

  // 渲染时的 spec 改变
  specFormat?: (
    spec: any,
    chartInstance: any,
    chart: any
  ) => { needFormatSpec: boolean; spec?: any; updateSpec?: boolean };
  // chart 单元格 的 spec 生成时的转换
  specTransformInCell?: (spec: any, col: number, row: number) => any;

  beforeRender?: (stage: any) => void;
  afterRender?: (stage: any) => void;
  rowSeriesNumber?: IRowSeriesNumber;
  // columnSeriesNumber?: ColumnSeriesNumber[];
  customCellStyle?: CustomCellStyle[];
  customCellStyleArrangement?: CustomCellStyleArrangement[];

  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';
  clearDOM?: boolean;
  customConfig?: {
    /** xTable对于没有配置autoWrapText并且有'\n'的文本，在计算行高是会当做一行处理，但是在渲染时会解析'\n'；显示效果就是单元格高度为一行文本高度，只显示第一个'\n'前的文字，后面显示'...'；multilinesForXTable配置实现和该功能对齐的样式 */
    multilinesForXTable?: boolean;
    /** 这里可以配置为false 来走flatDataToObject的数据处理逻辑 而不走dataset的分析 */
    enableDataAnalysis?: boolean;
    /** 禁用行高列宽计算取整数逻辑 对齐xTable */
    _disableColumnAndRowSizeRound?: boolean;
    imageMargin?: number;
    // 是否创建react custom container
    createReactContainer?: boolean;
    // adaptive 模式下优先缩小迷你图
    shrinkSparklineFirst?: boolean;

    // 行列移动不更新表格
    notUpdateInColumnRowMove?: boolean;

    // 表格是否限制内容高度
    limitContentHeight?: boolean;

    // 图片资源请求时是否使用anonymous模式
    imageAnonymous?: boolean;
  }; // 部分特殊配置，兼容xTable等作用

  animationAppear?: boolean | IAnimationAppear;

  renderOption?: any;

  formatCopyValue?: (value: string) => string;
  customComputeRowHeight?: (computeArgs: { row: number; table: BaseTableAPI }) => number | 'auto' | undefined;
  /** 当表格出现抖动情况，请排查是否上层dom容器的宽高是小数引起的。如果不能保证是整数，请配置这个配置项为true */
  tableSizeAntiJitter?: boolean;

  /**
   * @deprecated 请使用resize.disableDblclickAutoResizeColWidth
   */
  disableDblclickAutoResizeColWidth?: boolean;

  /** resize交互配置 **/
  resize?: {
    /**
     * 调整列宽 可操作范围。'all' | 'none' | 'header' | 'body'; 整列间隔线|禁止调整|只能在表头处间隔线|只能在body间隔线
     */
    columnResizeMode?: 'all' | 'none' | 'header' | 'body';
    rowResizeMode?: 'all' | 'none' | 'header' | 'body';
    /** 是否禁用双击列边框自动调整列宽 **/
    disableDblclickAutoResizeColWidth?: boolean;
  };
}
export interface BaseTableAPI {
  id: string;
  /** 数据总条目数 */
  recordsCount: number;
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

  bottomFrozenRowCount: number;
  rightFrozenColCount: number;
  /** 当前表格默认表头行高 */
  defaultHeaderRowHeight: (number | 'auto') | (number | 'auto')[];
  /** 当前表格默认行高 */
  defaultRowHeight: number;
  /** 当前表格默认列宽 */
  defaultColWidth: number;
  /** 当前表格默认表头列宽 */
  defaultHeaderColWidth: (number | 'auto') | (number | 'auto')[];
  /** 当前表格快捷键设置 */
  keyboardOptions: TableKeyboardOptions | null;
  /** 当前表格事件相关设置 */
  eventOptions: TableEventOptions | null;
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
  globalDropDownMenu?: MenuListItem[] | ((args: { row: number; col: number; table: BaseTableAPI }) => MenuListItem[]);
  /** 设置的全局自定义渲染函数 */
  customRender?: ICustomRender;

  /** 表格数据管理对象 */
  dataSource: DataSourceAPI;
  /** 设置的表格主题 */
  theme: TableTheme;
  /** 可允许设置冻结的最大列数 */
  allowFrozenColCount: number;

  /** 存储内部用到的属性 变量等 */
  internalProps: IBaseTableProtected;
  /** 分页信息 */
  pagination?: IPagination;

  /** 表格偏移像素值 水平方向 */
  tableX: number;
  /** 表格偏移像素值 垂直方向 */
  tableY: number;
  /** 表格宽度模式 */
  widthMode: WidthModeDef;
  /** 表格宽度模式 */
  heightMode: HeightModeDef;
  /** 当列宽度不能占满容器时，是否需要自动拉宽来填充容器的宽度。默认false */
  autoFillWidth: boolean;
  /** 当行高度不能占满容器时，是否需要自动拉高来填充容器的高度。默认false */
  autoFillHeight?: boolean;

  /** adaptive 模式下宽度的适应策略 **/
  widthAdaptiveMode: WidthAdaptiveModeDef;
  /** adaptive 模式下高度的适应策略 **/
  heightAdaptiveMode: HeightAdaptiveModeDef;

  isReleased: boolean;

  // rowHeightsMap: NumberMap<number>;
  rowHeightsMap: NumberRangeMap;
  colWidthsMap: NumberMap<string | number>;

  on: <TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    listener: TableEventListener<TYPE> //(event: TableEventHandlersEventArgumentMap[TYPE]) => TableEventHandlersReturnMap[TYPE]
  ) => EventListenerId;
  // &(<T extends keyof TableEventHandlersEventArgumentMap>(type: string, listener: AnyListener<T>) => EventListenerId);

  _vDataSet?: DataSet;
  /** 场景树对象 */
  scenegraph: Scenegraph;
  /** 状态管理模块 */
  stateManager: StateManager;
  /** 事件管理模块 */
  eventManager: EventManager;
  /** 动画管理模块 */
  animationManager: TableAnimationManager;

  editorManager: EditManager;
  /** 行表头的层数 */
  rowHeaderLevelCount: number;
  /** 列表头的层数 */
  columnHeaderLevelCount: number;

  canvasWidth?: number;
  canvasHeight?: number;

  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';

  _rowRangeHeightsMap: Map<string, number>;
  _colRangeWidthsMap: Map<string, number>;
  canvasSizeSeted?: boolean;

  pixelRatio: number;

  /** 获取表格绘制的范围 不包括frame的宽度 */
  getDrawRange: () => Rect;
  /** 将鼠标坐标值 转换成表格坐标系中的坐标位置 */
  _getMouseAbstractPoint: (
    evt: TouchEvent | MouseEvent | undefined,
    isAddScroll?: boolean
  ) => { x: number; y: number; inTable: boolean };
  getElement: () => HTMLElement;
  getContainer: () => HTMLElement;

  setFrozenColCount: (count: number) => void;
  _setFrozenColCount: (count: number) => void;
  _updateSize: () => void;

  render: () => void;
  throttleInvalidate: () => void;
  getRowHeight: (row: number) => number;
  getDefaultRowHeight: (row: number) => number | 'auto';
  getDefaultColumnWidth: (col: number) => number | 'auto';
  _setRowHeight: (row: number, height: number, clearCache?: boolean) => void;
  setRowHeight: (row: number, height: number) => void;
  getColWidth: (col: number) => number;
  getColWidthDefined: (col: number) => string | number;
  // setColWidthDefined: (col: number, width: number) => void;
  getColWidthDefinedNumber: (col: number) => number;
  // getColWidthDefine: (col: number) => string | number;
  _setColWidth: (col: number, width: number | string, clearCache?: boolean, skipCheckFrozen?: boolean) => void;
  setColWidth: (col: number, width: number) => void;
  _getColContentWidth: (col: number) => number;
  _setColContentWidth: (col: number, width: number | string, clearCache?: boolean) => void;
  getMaxColWidth: (col: number) => number;
  setMaxColWidth: (col: number, maxwidth: string | number) => void;
  getMinColWidth: (col: number) => number;
  setMinColWidth: (col: number, minwidth: string | number) => void;
  getCellRect: (col: number, row: number) => Rect;
  getCellRelativeRect: (col: number, row: number) => Rect;
  getCellsRect: (startCol: number, startRow: number, endCol: number, endRow: number) => Rect;
  getCellRangeRect: (cellRange: CellRange | CellAddress) => Rect;
  getCellRangeRelativeRect: (cellRange: CellRange | CellAddress) => Rect;
  getVisibleCellRangeRelativeRect: (cellRange: CellRange | CellAddress) => Rect;
  isFrozenCell: (col: number, row: number) => { row: boolean; col: boolean } | null;
  getRowAt: (absoluteY: number) => { top: number; row: number; bottom: number };
  getColAt: (absoluteX: number) => { left: number; col: number; right: number };
  getCellAt: (absoluteX: number, absoluteY: number) => CellAddressWithBound;
  getCellAtRelativePosition: (absoluteX: number, absoluteY: number) => CellAddressWithBound;
  _makeVisibleCell: (col: number, row: number) => void;
  // setFocusCursor(col: number, row: number): void;
  // focusCell(col: number, row: number): void;
  getCellOverflowText: (col: number, row: number) => string | null;
  getColsWidth: (startCol: number, endCol: number) => number;
  getRowsHeight: (startRow: number, endRow: number) => number;

  release: () => void;
  addReleaseObj: (releaseObj: { release: () => void }) => void;
  _getCellStyle: (col: number, row: number) => FullExtendStyle;
  clearCellStyleCache: () => void;

  getFrozenRowsHeight: () => number;
  getFrozenColsWidth: () => number;
  getBottomFrozenRowsHeight: () => number;
  getRightFrozenColsWidth: () => number;
  selectCell: (
    col: number,
    row: number,
    isShift?: boolean,
    isCtrl?: boolean,
    makeSelectCellVisible?: boolean,
    skipBodyMerge?: boolean
  ) => void;
  selectCells: (cellRanges: CellRange[]) => void;
  getAllRowsHeight: () => number;
  getAllColsWidth: () => number;

  off: (id: EventListenerId) => void;
  getBodyField: (col: number, row: number) => FieldDef | undefined;
  /**
   * 根据单元格获取对应的源数据
   * @param col
   * @param row
   * @returns
   */
  getRecordByCell: (col: number, row: number) => MaybePromiseOrUndefined;
  /**
   * 根据数据源的index 获取显示到表格中的index 行号或者列号（与转置相关）。注：ListTable特有接口
   * @param recordIndex
   */
  getTableIndexByRecordIndex: (recordIndex: number) => number;
  /**
   * 根据数据源的field 获取显示到表格中的index 行号或者列号（与转置相关）。注：ListTable特有接口
   * @param recordIndex
   */
  getTableIndexByField: (field: FieldDef) => number;
  /**
   * 根据数据源中的index和field获取单元格行列号。注：ListTable特有接口
   * @param field
   * @param recordIndex
   * @returns
   */
  getCellAddrByFieldRecord: (field: FieldDef, recordIndex: number) => CellAddress;
  getRecordShowIndexByCell: (col: number, row: number) => number;
  getRecordStartRowByRecordIndex: (index: number) => number;

  getHeaderField: (col: number, row: number) => any | undefined;

  _getHeaderCellBySortState: (sortState: SortState) => CellAddress | undefined;
  getHeaderDefine: (col: number, row: number) => ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber;
  _getHeaderLayoutMap: (col: number, row: number) => HeaderData | SeriesNumberColumnData;
  getContext: () => CanvasRenderingContext2D;
  getCellRange: (col: number, row: number) => CellRange;
  _resetFrozenColCount: () => void;
  isCellRangeEqual: (col: number, row: number, targetCol: number, targetRow: number) => boolean;
  _getLayoutCellId: (col: number, row: number) => LayoutObjectId;
  _getBodyLayoutMap: (col: number, row: number) => ColumnData | IndicatorData | SeriesNumberColumnData;
  getBodyColumnDefine: (col: number, row: number) => ColumnDefine | IRowSeriesNumber | ColumnSeriesNumber;
  getBodyColumnType: (col: number, row: number) => ColumnTypeOption;
  getCellType: (col: number, row: number) => ColumnTypeOption;
  fireListeners: <TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    event: TableEventHandlersEventArgumentMap[TYPE]
  ) => TableEventHandlersReturnMap[TYPE][];

  //更新分页
  updatePagination: (cof: IPagination) => void;
  //hover

  getHeaderDescription: (col: number, row: number) => string | undefined;
  /** 获取单元格展示值 */
  getCellValue: (col: number, row: number, skipCustomMerge?: boolean) => string | null;
  /** 获取单元格展示数据的format前的值 */
  getCellOriginValue: (col: number, row: number) => any;
  /** 获取单元格展示数据源最原始值 */
  getCellRawValue: (col: number, row: number) => FieldData;
  /** 获取单元格展示数据的format前的record源数据 */
  getCellOriginRecord: (col: number, row: number) => MaybePromiseOrUndefined;
  /** 获取单元格展示源数据 */
  getCellRawRecord: (col: number, row: number) => MaybePromiseOrUndefined;

  _dropDownMenuIsHighlight: (col: number, row: number, index: number) => boolean;
  // bindEvents(): void;
  refreshRowColCount: () => void;
  // getFieldData: (field: FieldDef | FieldFormat | undefined, col: number, row: number) => FieldData;
  _hasField: (field: FieldDef, col: number, row: number) => boolean;
  getCellHeaderPaths: (col: number, row: number) => ICellHeaderPaths;
  getCellLocation: (col: number, row: number) => CellLocation;
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

  _canDragHeaderPosition: (col: number, row: number) => boolean;

  isHeader: (col: number, row: number) => boolean;

  isColumnHeader: (col: number, row: number) => boolean;

  isCornerHeader: (col: number, row: number) => boolean;

  isRowHeader: (col: number, row: number) => boolean;

  getCopyValue: () => string;

  getSelectedCellInfos: () => CellInfo[][];
  getSelectedCellRanges: () => CellRange[];
  getCellInfo: (col: number, row: number) => Omit<MousePointerCellEvent, 'target'>;

  showTooltip: (col: number, row: number, tooltipOptions?: TooltipOptions) => void;

  measureText: (
    text: string,
    font: { fontSize: number; fontWeight?: string | number; fontFamily: string }
  ) => ITextSize;

  _canResizeColumn: (col: number, row: number) => boolean;
  _canResizeRow: (col: number, row: number) => boolean;

  getCustomRender: (col: number, row: number) => ICustomRender;
  getCustomLayout: (col: number, row: number) => ICustomLayout;
  isListTable: () => boolean;
  isPivotTable: (() => boolean) & (() => boolean);
  isPivotChart: (() => boolean) & (() => boolean);
  _clearColRangeWidthsMap: (col?: number) => void;
  _clearRowRangeHeightsMap: (row?: number) => void;
  clearRowHeightCache: () => void;
  clearColWidthCache: () => void;
  toggleHierarchyState: (col: number, row: number) => void;

  resize: () => void;
  /** 直接设置canvas的宽高 不根据容器宽高来决定表格的尺寸 */
  setCanvasSize: (width: number, height: number) => void;
  getMergeCellRect: (col: number, row: number) => Rect;

  getTargetColAt: (absoluteX: number) => ColumnInfo | null;
  getTargetRowAt: (absoluteY: number) => RowInfo | null;
  getTargetColAtConsiderRightFrozen: (absoluteX: number, isConsider: boolean) => ColumnInfo | null;
  getTargetRowAtConsiderBottomFrozen: (absoluteY: number, isConsider: boolean) => RowInfo | null;
  renderWithRecreateCells: () => void;
  //#endregion  tableAPI

  _adjustColWidth: (col: number, orgWidth: number) => number;
  _colWidthDefineToPxWidth: (width: string | number) => number;
  isFrozenColumn: (col: number, row?: number) => boolean;
  isLeftFrozenColumn: (col: number, row?: number) => boolean;
  isRightFrozenColumn: (col: number, row?: number) => boolean;
  isFrozenRow: (col: number, row?: number) => boolean;
  isTopFrozenRow: (col: number, row?: number) => boolean;
  isBottomFrozenRow: (col: number, row?: number) => boolean;

  hasCustomMerge: () => boolean;
  getCustomMerge: (col: number, row: number) => undefined | (Omit<CustomMerge, 'style'> & { style?: FullExtendStyle });
  /** 获取表格body部分的显示单元格范围 */
  getBodyVisibleCellRange: () => { rowStart: number; colStart: number; rowEnd: number; colEnd: number };
  /** 获取表格body部分的显示列号范围 */
  getBodyVisibleColRange: () => { colStart: number; colEnd: number };
  /** 获取表格body部分的显示行号范围 */
  getBodyVisibleRowRange: () => { rowStart: number; rowEnd: number };

  _hasCustomRenderOrLayout: () => boolean;
  /** 根据表格单元格的行列号 获取在body部分的列索引及行索引 */
  getBodyIndexByTableIndex: (col: number, row: number) => CellAddress;
  /** 根据body部分的列索引及行索引，获取单元格的行列号 */
  getTableIndexByBodyIndex: (col: number, row: number) => CellAddress;
  /**
   * 滚动到具体某个单元格位置
   * @param cellAddr 要滚动到的单元格位置
   */
  scrollToCell: (cellAddr: { col?: number; row?: number }, animationOption?: ITableAnimationOption | boolean) => void;
  scrollToRow: (row: number, animationOption?: ITableAnimationOption | boolean) => void;
  scrollToCol: (col: number, animationOption?: ITableAnimationOption | boolean) => void;
  registerCustomCellStyle: (customStyleId: string, customStyle: ColumnStyleOption | undefined | null) => void;
  arrangeCustomCellStyle: (cellPos: { col?: number; row?: number; range?: CellRange }, customStyleId: string) => void;
  /** 是否有列是自动计算列宽 */
  checkHasColumnAutoWidth: () => boolean;
  _moveHeaderPosition: (
    source: CellAddress,
    target: CellAddress
  ) => {
    sourceIndex: number;
    targetIndex: any;
    sourceSize: any;
    targetSize: any;
    moveType: 'column' | 'row';
  };
  changeRecordOrder: (source: number, target: number) => void;
  isSeriesNumber: (col: number, row?: number) => boolean;
  isHasSeriesNumber: () => boolean;
  leftRowSeriesNumberCount: number;
  isAutoRowHeight: (row?: number) => boolean;

  reactCustomLayout?: ReactCustomLayout;
  checkReactCustomLayout: (removeAllContainer: () => void) => void;
  setSortedIndexMap: (field: FieldDef, filedMap: ISortedMapItem) => void;

  exportImg: () => string;
  exportCellImg: (
    col: number,
    row: number,
    options?: { disableBackground?: boolean; disableBorder?: boolean }
  ) => string;
  exportCellRangeImg: (cellRange: CellRange) => string;
  exportCanvas: () => HTMLCanvasElement;
  setPixelRatio: (pixelRatio: number) => void;

  bodyDomContainer?: HTMLElement;
  headerDomContainer?: HTMLElement;
  frozenBodyDomContainer?: HTMLElement;
  frozenHeaderDomContainer?: HTMLElement;
  rightFrozenBodyDomContainer?: HTMLElement;
  rightFrozenHeaderDomContainer?: HTMLElement;
  frozenBottomDomContainer?: HTMLElement;
  bottomDomContainer?: HTMLElement;
  rightFrozenBottomDomContainer?: HTMLElement;

  showMoverLine: (col: number, row: number) => void;
  hideMoverLine: (col: number, row: number) => void;
  /** 关闭表格的滚动 */
  disableScroll: () => void;
  /** 开启表格的滚动 */
  enableScroll: () => void;

  customCellStylePlugin?: CustomCellStylePlugin;
  headerStyleCache: Map<string, any>;
  bodyBottomStyleCache: Map<string, any>;
  bodyStyleCache: Map<string, any>;
  bodyMergeTitleCache: Map<string, any>;
  isSeriesNumberInBody: (col: number, row: number) => boolean;
  getGroupTitleLevel: (col: number, row: number) => number | undefined;
  _getMaxFrozenWidth: () => number;
  _getComputedFrozenColCount: (frozenColCount: number) => number;
}
export interface ListTableProtected extends IBaseTableProtected {
  /** 表格数据 */
  records: any[] | null;
  dataConfig?: IListTableDataConfig;
  columns: ColumnsDefine;
  layoutMap: SimpleHeaderLayoutMap;
  columnWidthConfig?: {
    key: string;
    width: number;
  }[];
}

export interface PivotTableProtected extends IBaseTableProtected {
  /** 表格数据 */
  records: any[] | undefined;
  recordsIsTwoDimensionalArray?: boolean;
  layoutMap: PivotHeaderLayoutMap;
  dataConfig?: IPivotTableDataConfig;

  /** 列表头树型结构 */
  columnTree?: IHeaderTreeDefine[];
  /** 行表头树型结构 */
  rowTree?: IHeaderTreeDefine[];
  /** 定义行上各个维度具体配置项和样式定义 */
  rows?: (IRowDimension | string)[]; // (string | IDimension)[]; 后续支持数据分析的透视表 支持string配置
  /** 定义列上各个维度具体配置项和样式定义 */
  columns?: (IColumnDimension | string)[]; // (string | IDimension)[];
  /** 定义指标具体配置项和样式定义 包含表头和body的定义*/
  indicators?: (IIndicator | string)[]; // (string | IIndicator)[];

  columnWidthConfig?: {
    dimensions: IDimensionInfo[];
    width: number;
  }[];
  columnWidthConfigForRowHeader?: {
    dimensions: IDimensionInfo[];
    width: number;
  }[];
}
export interface PivotChartProtected extends IBaseTableProtected {
  /** 表格数据 */
  records: any[] | Record<string, any[]>;
  layoutMap: PivotHeaderLayoutMap;
  dataConfig?: IPivotChartDataConfig;
  columnTree?: IHeaderTreeDefine[];
  /** 行表头维度结构 */
  rowTree?: IHeaderTreeDefine[];
  /** 定义行上各个维度具体配置项和样式定义 */
  rows?: (IRowDimension | string)[]; // (string | IDimension)[]; 后续支持数据分析的透视表 支持string配置
  /** 定义列上各个维度具体配置项和样式定义 */
  columns?: (IColumnDimension | string)[]; // (string | IDimension)[];
  /** 定义指标具体配置项和样式定义 包含表头和body的定义*/
  indicators?: (IIndicator | string)[]; // (string | IIndicator)[];
}
