import type { BaseTableAPI } from './base-table';
import type { ColorsDef, ICellHeaderPaths, LineDashsDef, LineWidthsDef, PaddingsDef } from './common';
import type { ColumnIconOption } from './icon';
import type { FieldData } from './table-engine';

// ****** TextStyle Options *******
export type TextOverflow = string /* a char */; //设置一行的省略形式，另外还有clip。如果autoWrapText设置了自动换行，这个无效
export type LineClamp = number | 'auto'; //设置单元格显示的行数，如果不设置的话 默认全部展示直到超过了显示范围，会截断暂时文本，如果设置了auto，显示不了的文本会出现省略号
export type TextAlignType = 'center' | 'end' | 'left' | 'right' | 'start'; // 设置单元格内文字的水平对齐方式
export type TextBaselineType = 'alphabetic' | 'bottom' | 'middle' | 'top'; // 设置单元格内文字的垂直对齐方式

export interface StylePropertyFunctionArg {
  row: number;
  col: number;
  /** 表格实例 */
  table: BaseTableAPI;
  /**有format的话 格式化后或者计算后的值 */
  value?: FieldData;
  /**原始值 */
  dataValue?: FieldData;
  /** progressbar类型特有，表示当前数值在总体数据范围的比例 */
  percentile?: number;
  /** 单元格的表头路径信息 */
  cellHeaderPaths?: ICellHeaderPaths;
}
export type ColorPropertyDefine =
  | string
  | ((args: StylePropertyFunctionArg) => string)
  | ((args: StylePropertyFunctionArg) => CanvasGradient)
  | ((args: StylePropertyFunctionArg) => CanvasPattern);

export type ColorsPropertyDefine =
  | ColorPropertyDefine
  | (string | null)[]
  | ((args: StylePropertyFunctionArg) => (string | null)[]);

export type LineWidthPropertyDefine = number | ((args: StylePropertyFunctionArg) => number);

export type LineWidthsPropertyDefine =
  | LineWidthPropertyDefine
  | (number | null)[]
  | ((args: StylePropertyFunctionArg) => (number | null)[]);

export type LineDashPropertyDefine = Array<number> | ((args: StylePropertyFunctionArg) => Array<number>);

export type LineDashsPropertyDefine =
  | LineDashPropertyDefine
  | (Array<number> | null)[]
  | ((args: StylePropertyFunctionArg) => (Array<number> | null)[]);

// export type FontPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);
export type FontSizePropertyDefine = number | ((args: StylePropertyFunctionArg) => number);
export type FontFamilyPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);
export type FontWeightPropertyDefine = string | number | ((args: StylePropertyFunctionArg) => string | number);
export type FontVariantPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);
export type FontStylePropertyDefine = string | ((args: StylePropertyFunctionArg) => string);

export type TagPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);

export type CursorPropertyDefine = string | ((args: StylePropertyFunctionArg) => string);

export type IconPropertyDefine =
  | string
  | ColumnIconOption
  | ((args: StylePropertyFunctionArg) => string | ColumnIconOption);

export type UnderlinePropertyDefine = boolean | ((args: StylePropertyFunctionArg) => boolean);
export type LineThroughPropertyDefine = boolean | ((args: StylePropertyFunctionArg) => boolean);

export type PaddingPropertyDefine = number | ((args: StylePropertyFunctionArg) => number);

export type PaddingsPropertyDefine =
  | PaddingPropertyDefine
  | (number | null)[]
  | ((args: StylePropertyFunctionArg) => (number | null)[]);

export type MarkedPropertyDefine = boolean | ((args: StylePropertyFunctionArg) => boolean);

export type CellStyle = {
  textAlign: CanvasTextAlign;
  padding: PaddingsDef;
  textBaseline: CanvasTextBaseline;
  color: CanvasRenderingContext2D['fillStyle'];
  strokeColor?: CanvasRenderingContext2D['fillStyle'];
  bgColor: CanvasRenderingContext2D['fillStyle'];
  // font: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string | number;
  fontVariant: string;
  fontStyle: string;
  // lineHeight: string | number;
  lineHeight: number;
  autoWrapText: boolean;
  lineClamp: LineClamp;
  textOverflow: TextOverflow;
  borderColor: ColorsDef;
  borderLineWidth: LineWidthsDef;
  borderLineDash: LineDashsDef;
  underline: boolean;
  // underlineColor: CanvasRenderingContext2D['strokeStyle'];
  underlineWidth: number;
  underlineDash: number[];
  underlineOffset: number;
  lineThrough: boolean;
  // lineThroughColor: CanvasRenderingContext2D['strokeStyle'];
  // lineThroughDash: number[];
  lineThroughLineWidth: number;

  _strokeArrayWidth: number[];
  _strokeArrayColor: string[];
  _linkColor: CanvasRenderingContext2D['fillStyle'];
};
