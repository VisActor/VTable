import type { ColumnDefine } from '@visactor/vtable';
import { TYPES as VTableTypes, themes as VTableThemes } from '@visactor/vtable';
import type { CellValue, IStyle, MainMenuItem } from './base';
import type { IFilterState } from './filter';
import type { TableSeriesNumberOptions, ImportResult } from '@visactor/vtable-plugins';
import type { SortState } from '@visactor/vtable/es/ts-types';
export { VTableThemes, VTableTypes, ImportResult };
/** 筛选配置 */
export interface IFilterConfig {
  /** 指定筛选器支持的筛选模式（按值、按条件、或两者） */
  filterModes?: ('byValue' | 'byCondition')[];
}

/** 扩展的列定义，添加筛选相关配置 */
export interface IColumnDefine extends Omit<ColumnDefine, 'field'> {
  /** 是否启用筛选功能 */
  filter?: boolean;
}

/** Sheet定义 */
export interface ISheetDefine {
  /** 标题 */
  sheetTitle: string;
  /** 唯一标识 */
  sheetKey: string;
  /** 列数 */
  columnCount?: number;
  /** 行数 */
  rowCount?: number;
  /** 表头定义 */
  columns?: IColumnDefine[];
  /** 数据 */
  data?: (CellValue[] | null)[];
  /** 是否是当前活动sheet TODO 是不是放到外层更好*/
  active?: boolean;
  cellMerge?: VTableTypes.CustomMergeCellArray;
  /** 冻结行数 */
  frozenRowCount?: number;
  /** 冻结列数 */
  frozenColCount?: number;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 是否将第一行作为表头 */
  firstRowAsHeader?: boolean;
  /** 公式定义 */
  formulas?: Record<string, string>;
  /** 筛选配置 - 支持简单布尔值或详细配置对象 */
  filter?: boolean | IFilterConfig;
  /** 筛选状态 - 保存当前的筛选条件和状态 */
  filterState?: IFilterState;
  /** 排序状态 */
  sortState?: SortState[] | SortState | null;
  /** 主题 */
  theme?: IThemeDefine;
  /** 列宽配置 */
  columnWidthConfig?: {
    key: string | number;
    width: number;
  }[];
  /** 行高配置 */
  rowHeightConfig?: {
    key: number;
    height: number;
  }[];
  dragOrder?: {
    enableDragColumnOrder?: boolean;
    enableDragRowOrder?: boolean;
  };
}
export interface IThemeDefine {
  rowSeriesNumberCellStyle?: TableSeriesNumberOptions['rowSeriesNumberCellStyle'];
  colSeriesNumberCellStyle?: TableSeriesNumberOptions['colSeriesNumberCellStyle'];
  /** TODO 表格以外部分的主题 */
  menuStyle?: {
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    padding?: number[];
    bgColor?: string;
  };
  tableTheme: VTableThemes.ITableThemeDefine;
}
/** VTableSheet配置 */
export interface IVTableSheetOptions {
  /** Sheet列表 */
  sheets: ISheetDefine[];
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示公式栏 */
  showFormulaBar?: boolean;
  /** 是否显示sheet切换栏 */
  showSheetTab?: boolean;
  /** 插件 */
  VTablePluginModules?: {
    module: any;
    moduleOptions?: any;
    /** vtable-sheet逻辑中使用到的插件，可以通过这个配置来禁用掉 */
    disabled?: boolean;
  }[];

  /** 主菜单 */
  mainMenu?: {
    /** 是否显示 */
    show?: boolean;
    /** 菜单项 */
    items?: MainMenuItem[];
  };
  /** 主题 */
  theme?: IThemeDefine;
  /** 默认行高 */
  defaultRowHeight?: number;
  /** 默认列宽 */
  defaultColWidth?: number;
  /** 拖拽列顺序和行顺序配置 如果sheets中单独配置过，这个配置会被忽略*/
  dragOrder?: {
    enableDragColumnOrder?: boolean;
    enableDragRowOrder?: boolean;
  };
}
export * from './base';
export * from './event';
export * from './formula';
export * from './filter';
export * from './sheet';
export * from './spreadsheet-events';
