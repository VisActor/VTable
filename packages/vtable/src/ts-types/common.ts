import type { Style } from '../body-helper/style';
import type { ColumnStyleOption, ColumnTypeOption } from './column';
import type { ColumnData } from './list-table/layout-map/api';
import type { CellLocation, CellRange, FieldData, FieldDef } from './table-engine';
import type { Rect } from '../tools/Rect';
import type { BaseTableAPI } from './base-table';

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
export type MergeCellOption =
  | boolean
  | ((
      v1: any,
      v2: any,
      extraArgs: {
        source: CellPosition;
        target: CellPosition;
        table: BaseTableAPI;
      }
    ) => boolean);
export type BaseCellInfo = {
  row: number;
  col: number;
  /**format之后的值 */
  value: FieldData;
  /**原始值 */
  dataValue: FieldData;
};
export type MergeCellInfo = {
  colStart: number;
  colEnd: number;
  rowStart: number;
  rowEnd: number;
};
export type CellInfo = {
  col: number;
  row: number;
  title?: string | (() => string) | undefined;
  /**维度名称 */
  field?: FieldDef;
  /**单元格行列表头paths */
  cellHeaderPaths?: ICellHeaderPaths;
  /**单元格的位置 */
  cellRange?: Rect;
  /**整条数据-原始数据 */
  originData?: any;
  /**format之后的值 */
  value?: FieldData;
  /**原始值 */
  dataValue?: FieldData;
  cellLocation?: CellLocation;
  cellType?: ColumnTypeOption;
};

export type ICellHeaderPaths = IListTableCellHeaderPaths | IPivotTableCellHeaderPaths;
export type IListTableCellHeaderPaths = {
  readonly colHeaderPaths?: {
    field: FieldDef;
    // title: string | (() => string) | undefined;
  }[];
  readonly rowHeaderPaths?: {
    field: FieldDef;
    // title: string | (() => string) | undefined;
  }[];
  cellLocation: CellLocation;
};
export type IPivotTableCellHeaderPaths = {
  /** 列表头各级path表头信息 */
  readonly colHeaderPaths?: IDimensionInfo[];
  /** 行表头各级path表头信息 */
  readonly rowHeaderPaths?: IDimensionInfo[];
  cellLocation: CellLocation;
};

export interface IDimensionInfo {
  dimensionKey?: string;
  value?: string;
  indicatorKey?: string;
  isPivotCorner?: boolean;
  virtual?: boolean;
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

export type SortOrder = 'asc' | 'desc' | 'normal' | 'ASC' | 'DESC' | 'NORMAL';

export type CustomCellStyle = {
  id: string;
  style: ColumnStyleOption;
};

export type CustomCellStyleArrangement = {
  cellPosition: {
    col?: number;
    row?: number;
    range?: CellRange;
  };
  customStyleId: string;
};
