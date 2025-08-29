/**
 * 基础类型定义
 */

/** 单元格坐标 */
export interface CellCoord {
  row: number;
  col: number;
}

/** 单元格范围 */
export interface CellRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

/** 选择模式 */
export enum SelectionMode {
  CELL = 'cell',
  ROW = 'row',
  COLUMN = 'column',
  RANGE = 'range'
}

/** 通用样式定义 */
export interface IStyle {
  [key: string]: string | number | boolean | undefined;
}

/** 单元格值类型 */
export type CellValue = string | number | boolean | null | undefined;

/** 单元格地址 */
export interface CellAddress extends CellCoord {
  sheetId: string;
}

/** 工具栏项配置 */
export interface IToolbarItem {
  id: string;
  icon?: string;
  text?: string;
  tooltip?: string;
  disabled?: boolean;
  visible?: boolean;
  onClick?: () => void;
}

export enum MainMenuItemKey {
  /** 需要插件支持，请在plugins中配置 ExcelImportPlugin */
  IMPORT = 'import',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_CSV = 'export-current-sheet-csv',
  /** 需要插件支持，请在plugins中配置 TableExportPlugin */
  EXPORT_CURRENT_SHEET_XLSX = 'export-current-sheet-xlsx'
}
export interface MainMenuItem {
  /** 菜单项名称 */
  name: string;
  /** 菜单项唯一标识，如果配置了menuKey，点击菜单项时，会匹配内置逻辑（如配置了onclick,仍然优先匹配onclick） */
  menuKey?: MainMenuItemKey;
  /** 菜单项描述 */
  description?: string;
  /** 菜单项点击回调 */
  onClick?: () => void;
  /** 子菜单项 */
  items?: MainMenuItem[];
}
