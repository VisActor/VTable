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
