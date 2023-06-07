import type { ColumnTypeOption } from './column';
import type { ColumnData } from './list-table/layout-map/api';
import type { CellType, FieldData, FieldDef } from './table-engine';

export type MaybePromise<T> = T | Promise<T>;

export type MaybeCall<T, A extends any[]> = T | ((...args: A) => T);

export type MaybePromiseOrUndefined = any | undefined | Promise<any | undefined>;
export type MaybePromiseOrCallOrUndefined = any | undefined | Promise<any | undefined> | ((...args: any) => any);
export type PromiseMaybeUndefOrCall<T, A extends any[]> = Promise<T | undefined> | ((...args: A) => T);
export type AnyFunction = (...args: any[]) => any;

export interface RectProps {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}

export interface CellPosition {
  col: number;
  row: number;
}

export type ColorsDef = string | (string | null)[];
export type LineWidthsDef = number | (number | null)[];
export type LineDashsDef = number[] | (number[] | null)[];
export type shadowColorsDef = { from: string; to: string } | ({ from: string; to: string } | null)[];
export type PaddingsDef = number | (number | null)[];
export type SortOption = boolean | ((v1: any, v2: any, order: SortOrder) => -1 | 0 | 1);
export type CellInfo = {
  col: number;
  row: number;
  caption?: string | (() => string) | undefined;
  /**维度名称 */
  field?: FieldDef;
  /**单元格行列表头paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /**单元格的位置 */
  cellRange?: RectProps;
  /**整条数据-原始数据 */
  originData?: any;
  /**format之后的值 */
  value?: FieldData;
  /**原始值 */
  dataValue?: FieldData;
  cellType?: CellType;
  columnType?: ColumnTypeOption;
};

export type ICellHeaderPaths = IListTableCellHeaderPaths | IPivotTableCellHeaderPaths;
export type IListTableCellHeaderPaths = {
  readonly colHeaderPaths?: {
    field: FieldDef;
    // caption: string | (() => string) | undefined;
  }[];
  readonly rowHeaderPaths?: {
    field: FieldDef;
    // caption: string | (() => string) | undefined;
  }[];
};
export type IPivotTableCellHeaderPaths = {
  /** 列表头各级path表头信息 */
  readonly colHeaderPaths?: {
    dimensionKey?: string;
    indicatorKey?: string;
    value?: string;
  }[];
  /** 行表头各级path表头信息 */
  readonly rowHeaderPaths?: {
    dimensionKey?: string;
    indicatorKey?: string;
    value?: string;
  }[];
};

export interface IDimensionInfo {
  dimensionKey?: string;
  value?: string;
  indicatorKey?: string;
  isPivotCorner?: boolean;
}

/**
 * 当前表格的交互状态：
 * Default 默认展示
 * grabing 拖拽中
 *   -Resize column 改变列宽
 *   -column move 调整列顺序
 *   -drag select 拖拽多选
 * Scrolling 滚动中
 */
export enum InteractionState {
  'default' = 'default',
  'grabing' = 'grabing',
  'scrolling' = 'scrolling'
}
/**
 * 单元格的高亮效果设置
 * single 单个单元格高亮
 * column 整列高亮
 * row 整行高量
 * cross 十字花 行列均高亮
 * none 无高亮
 */
export enum HighlightScope {
  'single' = 'single',
  'column' = 'column',
  'row' = 'row',
  'cross' = 'cross',
  'none' = 'none'
}

export type SortOrder = 'asc' | 'desc' | 'normal';
