import type { IColumnDefine, IFilterConfig, ISheetDefine, SheetKeyboardShortcutPolicy } from './index';
import type { CellCoord, CellRange, CellValue } from './base';
import type { ListTableConstructorOptions } from '@visactor/vtable';

/** Sheet构造选项 */
export interface IWorkSheetOptions extends Omit<ListTableConstructorOptions, 'records' | 'columns'> {
  /** Sheet的唯一标识 */
  sheetKey: string;
  /** Sheet的标题 */
  sheetTitle: string;
  /** 容器元素 */
  container: HTMLElement;
  /** 数据 */
  data?: any[][];
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 是否将第一行作为表头 */
  firstRowAsHeader?: boolean;
  /** 筛选配置 */
  filter?: boolean;
  /** 列定义 */
  columns?: (IColumnDefine & { field: string | number })[];
  /** 该 sheet 的最终编辑能力开关（由全局 editable + sheetDefine.editable 合并得出） */
  editable?: boolean;
  /** 该 sheet 的最终快捷键策略（由全局 + sheet 级策略合并后下发） */
  keyboardShortcutPolicy?: SheetKeyboardShortcutPolicy;
}

/** Sheet API 接口 */
export interface IWorkSheetAPI {
  /** 获取单元格值 */
  getCellValue: (col: number, row: number) => CellValue;

  /** 设置单元格值 */
  setCellValue: (col: number, row: number, value: CellValue) => void;

  /** 根据地址获取单元格 */
  getCellByAddress: (address: string) => { coord: CellCoord; value: CellValue };

  /** 根据坐标获取地址 */
  addressFromCoord: (coord: CellCoord) => string;

  /** 根据地址获取坐标 */
  coordFromAddress: (address: string) => CellCoord;
  /** 获取当前选择 */
  getSelection: () => CellRange | null;

  /** 获取数据 */
  getData: () => CellValue[][];

  /** 获取行数 */
  getRowCount: () => number;

  /** 获取列数 */
  getColumnCount: () => number;
}

/** Sheet管理器接口 */
export interface ISheetManager {
  /** 获取当前活动sheet */
  getActiveSheet: () => ISheetDefine | null;

  /** 设置活动sheet */
  setActiveSheet: (sheetKey: string) => void;

  /** 添加sheet */
  addSheet: (sheet: ISheetDefine) => void;

  /** 移除sheet */
  removeSheet: (sheetKey: string) => void;

  /** 重命名sheet */
  renameSheet: (sheetKey: string, newTitle: string) => void;

  /** 获取所有sheet */
  getAllSheets: () => ISheetDefine[];

  /** 获取指定sheet */
  getSheet: (sheetKey: string) => ISheetDefine | null;

  /** 获取sheet数量 */
  getSheetCount: () => number;

  /** 获取sheet API */
  getSheetAPI: (sheetKey: string) => IWorkSheetAPI | null;

  /** 监听sheet变化 */
  onSheetChange: (callback: (sheets: ISheetDefine[]) => void) => void;

  /** 移除sheet变化监听 */
  offSheetChange: (callback: (sheets: ISheetDefine[]) => void) => void;

  /** 监听活动sheet变化 */
  onActiveSheetChange: (callback: (sheet: ISheetDefine) => void) => void;

  /** 移除活动sheet变化监听 */
  offActiveSheetChange: (callback: (sheet: ISheetDefine) => void) => void;
}
