import type { FieldData } from './table-engine';
import type { RectProps } from './common';
import type { BaseTableAPI } from './base-table';
import type { TextAlignType, TextBaselineType } from './style-define';
export interface CustomRenderFunctionArg<TypedTable = BaseTableAPI> {
  row: number;
  col: number;
  table: TypedTable;
  /**format之后的值 */
  value: FieldData;
  /**原始值 */
  dataValue: FieldData;
  rect?: RectProps;
  originCol?: number;
  originRow?: number;
}
interface baseElement {
  elementKey?: string;
  x: number | string | ((value: string) => number | string);
  y: number | string | ((value: string) => number | string);
  dx?: number;
  dy?: number;
  // clickable?: boolean; // @dispose
  pickable?: boolean;
  cursor?: string;
  name?: string;
}
export interface TextElement extends baseElement {
  type: 'text';
  text: string | ((value: string) => string);
  stroke?: string | ((value: string) => string);
  fill?: string | ((value: string) => string);
  color?: string | ((value: string) => string);
  lineWidth?: number;
  fontSize?: number | ((value: string) => number);
  fontFamily?: string | ((value: string) => string);
  fontWeight?: string | number | ((value: string) => string | number);
  fontVariant?: string;
  fontStyle?: string;
  ellipsis?: boolean | string;
  maxLineWidth?: number;
  textAlign?: TextAlignType;
  textBaseline?: TextBaselineType;
  lineHeight?: number;
  underline?: number;
  underlineDash?: number[];
  underlineOffset?: number;
  lineThrough?: number;
  heightLimit?: number;
  lineClamp?: number;
  width?: number;
  height?: number;
  background?: {
    fill?: string;
    expandY?: number;
    expandX?: number;
    cornerRadius?: number;
  };
}
export interface LineElement extends Omit<baseElement, 'x' | 'y'> {
  type: 'line';
  stroke?: string | ((value: string) => string);
  points: { x: number; y: number }[];
  lineWidth?: number;
}

export interface RectElement extends baseElement {
  type: 'rect';
  width: number | string | ((value: string) => number | string);
  height: number | string | ((value: string) => number | string);
  stroke?: string | ((value: string) => string);
  fill?: string | ((value: string) => string);
  radius?: number | string | ((value: string) => number | string);
}

export interface CircleElement extends baseElement {
  type: 'circle';
  radius: number | string | ((value: string) => number | string);
  // radian?: number | string | ((value: string) => number | string);
  stroke?: string | ((value: string) => string);
  fill?: string | ((value: string) => string);
}
export interface ArcElement extends baseElement {
  type: 'arc';
  radius: number | string | ((value: string) => number | string);
  startAngle?: number | ((value: string) => number);
  endAngle?: number | ((value: string) => number);
  // clockWise?: boolean;
  stroke?: string | ((value: string) => string);
  fill?: string | ((value: string) => string);
}
export interface IconElement extends baseElement {
  type: 'icon';
  svg: string | ((value: string) => string);
  width: number | string | ((value: string) => number | string);
  height: number | string | ((value: string) => number | string);
  hover?: {
    x: number | string;
    y: number | string;
    width: number | string | ((value: string) => number | string);
    height: number | string | ((value: string) => number | string);
    bgColor: string;
    radius?: number;
  };
}
export interface ImageElement extends baseElement {
  type: 'image';
  src: string | ((value: string) => string);
  width: number | string | ((value: string) => number | string);
  height: number | string | ((value: string) => number | string);
  hover?: {
    x: number | string;
    y: number | string;
    width: number | string | ((value: string) => number | string);
    height: number | string | ((value: string) => number | string);
    bgColor: string;
    radius?: number;
  };
  shape?: 'circle' | 'square';
}
export type ICustomRenderElement =
  | TextElement
  | RectElement
  | CircleElement
  | IconElement
  | ImageElement
  | ArcElement
  | LineElement;
export type ICustomRenderElements = Array<ICustomRenderElement>;

export type ICustomRenderFuc<T = BaseTableAPI> = (args: CustomRenderFunctionArg<T>) => ICustomRenderObj;

export type ICustomRenderObj = {
  /** 配置出来的类型集合 */
  elements: ICustomRenderElements;
  /** 期望单元格的高度 */
  expectedHeight: number;
  /** 期望单元格的宽度 */
  expectedWidth: number;
  /**
   * 是否还需要默认渲染内容 只有配置true才绘制 默认 不绘制
   */
  renderDefault?: boolean;
};

export type ICustomRender<T = BaseTableAPI> = ICustomRenderFuc<T> | ICustomRenderObj;
