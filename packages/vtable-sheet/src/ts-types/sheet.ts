import type { ISheetDefine } from './index';
import type { CellCoord, CellRange, CellValue } from './base';
import type { ListTableConstructorOptions } from '@visactor/vtable';

/** Sheet构造选项 */
export interface ISheetOptions extends Omit<ListTableConstructorOptions, 'records'> {
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
  /** 父组件实例 */
  parent?: any;
}

/** Sheet API 接口 */
export interface ISheetAPI {
  /** 获取单元格值 */
  getCellValue: (row: number, col: number) => CellValue;

  /** 设置单元格值 */
  setCellValue: (row: number, col: number, value: CellValue) => void;

  /** 根据地址获取单元格 */
  getCellByAddress: (address: string) => { coord: CellCoord; value: CellValue };

  /** 根据坐标获取地址 */
  addressFromCoord: (coord: CellCoord) => string;

  /** 根据地址获取坐标 */
  coordFromAddress: (address: string) => CellCoord;
  /** 获取当前选择 */
  getSelection: () => CellRange | null;

  /** 设置当前选择 */
  setSelection: (range: CellRange) => void;

  /** 获取数据 */
  getData: () => CellValue[][];

  /** 设置数据 */
  setData: (data: CellValue[][]) => void;

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
  getSheetAPI: (sheetKey: string) => ISheetAPI | null;

  /** 监听sheet变化 */
  onSheetChange: (callback: (sheets: ISheetDefine[]) => void) => void;

  /** 移除sheet变化监听 */
  offSheetChange: (callback: (sheets: ISheetDefine[]) => void) => void;

  /** 监听活动sheet变化 */
  onActiveSheetChange: (callback: (sheet: ISheetDefine) => void) => void;

  /** 移除活动sheet变化监听 */
  offActiveSheetChange: (callback: (sheet: ISheetDefine) => void) => void;
}
