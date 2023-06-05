import type {
  CellAddress,
  CellRange,
  ColumnIconOption,
  ColumnStyle,
  ColumnStyleOption,
  // ColumnTypeOption,
  FieldDef,
  FieldFormat,
  HeaderStyleOption,
  LayoutObjectId,
  MenuListItem,
  IPivotTableCellHeaderPaths,
  CellInfo,
  // ICustomRenderFuc,
  // ICustomRenderObj,
  PivotInfo,
  FieldKeyDef,
  CustomRenderFunctionArg,
  SparklineSpec,
  HierarchyState
} from '../../';

import type { HeaderDefine, ColumnDefine, ColumnBodyDefine } from '../define';

// todo: 修改引用这些类型的路径
export type {
  HeaderDefine,
  ColumnDefine,
  ColumnBodyDefine,
  ColumnsDefine,
  LinkColumnDefine,
  ChartColumnDefine,
  ImageColumnDefine,
  SparklineColumnDefine,
  ProgressbarColumnDefine,
  TextColumnDefine,
  GroupColumnDefine
} from '../define';

/**
 * layout中组织表头的信息类  和HeaderDefine对应
 */
export interface HeaderData extends WidthData {
  id: LayoutObjectId;
  caption?: string | (() => string);
  /** @deprecated
   * 已废除该配置 标题中显示图标 现在请使用headerIcon进行配置
   */
  captionIcon?: ColumnIconOption;
  headerIcon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
  icons?: (string | ColumnIconOption)[] | ((args: CellInfo) => (string | ColumnIconOption)[]);

  field: FieldDef;
  fieldKey?: FieldKeyDef;
  fieldFormat?: FieldFormat;
  style?: HeaderStyleOption | ColumnStyle | null | undefined;
  headerType: 'text' | 'link' | 'image' | 'video'; // headerType.BaseHeader;
  define: ColumnDefine;
  // sortIconPosition?: RectProps;
  // pinIconPosition?: RectProps;
  /**存储图标的位置 坐标及宽高 是包括了boxWidth boxWidth 共getHitIcon方法使用 计算是否命中图标*/
  // iconPositionList?: { [key in IconFuncTypeEnum]?: RectProps & { icon: ColumnIconOption } };
  dropDownMenu?: MenuListItem[];
  pivotInfo?: PivotInfo;
  /**
   * 维度层级level 从0开始：第0层 第1层
   */
  hierarchyLevel?: number;
  /**
   * 维度总层级数
   */
  dimensionTotalLevel?: number;
  /**
   * 层级展开or折叠状态
   */
  hierarchyState?: HierarchyState;
  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';

  showSort?: boolean;

  /**
   * 表头描述 鼠标hover会提示该信息
   */
  description?: string | ((args: CellInfo) => string);
}

export interface WidthData {
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';
}
/**
 * layout中组织body列的信息类  和ColumnDefine对应
 */
export interface ColumnData extends WidthData {
  id: LayoutObjectId;
  field: FieldDef;
  fieldKey?: FieldKeyDef;
  fieldFormat?: FieldFormat;
  // icon?: ColumnIconOption | ColumnIconOption[];
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);

  columnType: 'text' | 'link' | 'image' | 'video' | 'sparkline' | 'progressbar' | 'chart'; //BaseColumn<T, any>;
  /** 如果是绘制图表库组件的图表类型 需要将注入的组件名称 写到chartType */
  chartType?: string;
  /** 如果是绘制图表库组件的图表类型 统一图表配置chartSpec */
  chartSpec?: any | ((arg0: CellInfo) => any);
  sparklineSpec?: SparklineSpec | ((arg0: CellInfo) => SparklineSpec);
  style: ColumnStyleOption | null | undefined;
  define: ColumnDefine;
  templateLink?: string;
  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';
  /**存储图标的位置 坐标及宽高 是包括了boxWidth boxWidth 共getHitIcon方法使用 计算是否命中图标*/
  // iconPositionList?: { [key in IconFuncTypeEnum]?: RectProps & { icon: ColumnIconOption } };
  /**
   * 是否禁用调整列宽,如果是转置表格或者是透视表的指标是行方向指定 那该配置不生效
   */
  disableColumnResize?: boolean;
}

export interface IndicatorData extends WidthData {
  id: LayoutObjectId;
  field: string | number;
  /**
   * 唯一标识一种指标
   */
  indicatorKey: string;
  // fieldKey: FieldKeyDef;
  fieldFormat?: FieldFormat;
  columnType: 'text' | 'link' | 'image' | 'video' | 'sparkline' | 'progressbar' | 'chart'; //BaseColumn<T, any>;
  chartType?: string;
  chartSpec?: any | ((arg0: CustomRenderFunctionArg) => any);
  style?: ColumnStyleOption | null | undefined;
  define: ColumnDefine;
  // headerIcon?:
  //   | (string | ColumnIconOption)[]
  //   | ((args: CellInfo) => (string | ColumnIconOption)[]);
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
  sparklineSpec?: SparklineSpec | ((arg0: CustomRenderFunctionArg) => SparklineSpec);
  /**
   * 是否禁用调整列宽,如果是转置表格或者是透视表的指标是行方向指定 那该配置不生效
   */
  disableColumnResize?: boolean;
}

// Simple header

// export interface GroupHeaderDefine extends HeaderDefine {
//   columns: HeadersDefine;
//   hideColumnsSubHeader?: boolean;
//   dropDownMenu?: MenuListItem[];
// }
// type Either<X, Y> =
//   | ({
//       [KX in keyof X]: X[KX];
//     } & {
//       [KY in Exclude<keyof Y, keyof X>]?: never;
//     })
//   | ({
//       [KY in keyof Y]: Y[KY];
//     } & {
//       [KX in Exclude<keyof X, keyof Y>]?: never;
//     });
// export type HeaderColumnDefine = Either<GroupHeaderDefine, ColumnDefine>;
// export type HeadersDefine = HeaderColumnDefine[];

// Advanced layout

// export interface HeaderCellDefine extends HeaderDefine {
//   colSpan?: number;
//   rowSpan?: number;
// }
export type HeaderCellDefine = HeaderDefine & {
  colSpan?: number;
  rowSpan?: number;
};

// export interface CellDefine extends ColumnDefine {
//   colSpan?: number;
//   rowSpan?: number;
// }

export type CellDefine = ColumnBodyDefine & {
  colSpan?: number;
  rowSpan?: number;
};

export type ArrayLayoutDefine = CellDefine[][];
/** @internal */
interface LayoutMapAPI {
  readonly headerLevelCount: number;
  readonly rowHeaderLevelCount: number;
  readonly columnHeaderLevelCount: number;
  readonly bodyRowCount: number;
  readonly colCount: number | undefined;
  readonly rowCount: number | undefined;
  readonly columnWidths: WidthData[];
  readonly headerObjects: HeaderData[];
  readonly columnObjects: ColumnData[] | IndicatorData[];
  // transpose: boolean;
  // showHeader: boolean;
  isHeader: (col: number, row: number) => boolean;
  // isHeaderNode(col: number, row: number): boolean; //是否为叶子表头
  /**获取单元格header对象 包括field style type 等 */
  getHeader: (col: number, row: number) => HeaderData;
  /**获取对应header的field  */
  getHeaderField: (col: number, row: number) => FieldDef;
  // getHeaderFieldKey(col: number, row: number): FieldKeyDef;
  /**获取单元格column对象 包括field style type 等 */
  getBody: (col: number, row: number) => ColumnData | IndicatorData;
  /**获取单元格标识key */
  getCellId: (col: number, row: number) => LayoutObjectId;
  getCellRange: (col: number, row: number) => CellRange;
  // getCellRangeTranspose(col: number, row: number): CellRange;
  getBodyLayoutRangeById: (id: LayoutObjectId) => CellRange;
  getHeaderCellAdress: (id: number) => CellAddress | undefined;
  getHeaderCellAddressByField: (field: string) => CellAddress | undefined;
  getRecordIndexByRow: (col: number, row: number) => number;
  getRecordStartRowByRecordIndex: (index: number) => number;
}

export type { LayoutMapAPI };
