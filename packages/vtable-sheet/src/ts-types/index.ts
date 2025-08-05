export * from './base';
export * from './event';
export * from './formula';
export * from './filter';
export * from './sheet';

import type { ColumnDefine, TYPES } from '@visactor/vtable';
import type { CellValue, IStyle, MainMenuItem, MenuKey } from './base';

/** 筛选配置 */
export interface IFilterConfig {
  /** 筛选图标配置 */
  filterIcon?: ColumnDefine['headerIcon'];
  /** 筛选激活状态图标配置 */
  filteringIcon?: ColumnDefine['headerIcon'];
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
  cellMerge?: TYPES.CustomMergeCellArray;
  /** 单元格样式 */
  cellStyles?: Record<string, IStyle>;
  /** 行样式 */
  rowStyles?: Record<string, IStyle>;
  /** 列样式 */
  columnStyles?: Record<string, IStyle>;
  /** 冻结行数 */
  frozenRowCount?: number;
  /** 冻结列数 */
  frozenColCount?: number;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 公式定义 */
  formulas?: Record<string, string>;
  /** 筛选配置 - 支持简单布尔值或详细配置对象 */
  filter?: boolean | IFilterConfig;
}

/** 数据管理器接口 */
export interface IDataManager {
  /** 获取数据 */
  getData: () => CellValue[][];
  /** 设置数据 */
  setData: (data: CellValue[][]) => void;
  /** 获取列索引 */
  getColumnIndex: (columnKey: string) => number;
}

/** 状态管理器接口 */
export interface IStateManager {
  /** 设置状态 */
  setState: (state: { [key: string]: any }) => void;
  /** 获取状态 */
  getState: (key: string) => any;
}

/** VTableSheet配置 */
export interface IVTableSheetOptions {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** Sheet列表 */
  sheets: ISheetDefine[];
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示公式栏 */
  showFormulaBar?: boolean;
  /** 是否显示sheet切换栏 */
  showSheetTab?: boolean;
  /** 插件 */
  pluginModules?: {
    module: any;
    moduleOptions?: any;
  }[];

  /** 主菜单 */
  mainMenu?: {
    /** 是否显示 */
    show?: boolean;
    /** 菜单项 */
    items?: MainMenuItem[];
  };
  /** 主题 */
  theme?: string | Record<string, any>;
  /** 默认行高 */
  defaultRowHeight?: number;
  /** 默认列宽 */
  defaultColWidth?: number;
  /** 是否允许编辑 */
  editable?: boolean;
  /** 是否显示网格线 */
  showGridLines?: boolean;
  /** 是否显示行号 */
  showRowNumbers?: boolean;
  /** 是否允许拖拽调整大小 */
  allowResize?: boolean;
  /** 是否允许排序 */
  allowSort?: boolean;
  /** 是否允许过滤 */
  allowFilter?: boolean;
  /** 是否允许选择 */
  allowSelection?: boolean;
  /** 是否允许复制粘贴 */
  allowClipboard?: boolean;
  /** 是否允许撤销重做 */
  allowUndo?: boolean;
}
