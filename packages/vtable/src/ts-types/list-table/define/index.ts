import type { Either } from '../../../tools/helper';
import type { ICompositeColumnBodyDefine } from './composite-define';
import type { IChartColumnBodyDefine } from './chart-define';
import type { ICheckboxColumnBodyDefine, ICheckboxHeaderDefine } from './checkbox-define';
import type { IImageColumnBodyDefine, IImageHeaderDefine } from './image-define';
import type { ILinkColumnBodyDefine, ILinkHeaderDefine } from './link-define';
import type { ITextColumnBodyDefine, ITextHeaderDefine } from './multilinetext-define';
import type { IProgressbarColumnBodyDefine } from './progressbar-define';
import type { ISparklineColumnBodyDefine } from './sparkline-define';
import type { IRadioColumnBodyDefine } from './radio-define';
import type { ISwitchColumnBodyDefine } from './switch-define';
import type { IButtonColumnBodyDefine } from './button-define';

export type HeaderDefine = IImageHeaderDefine | ILinkHeaderDefine | ICheckboxHeaderDefine | ITextHeaderDefine;

/**
 * 内置列 body 类型联合
 * 保留原有导出，方便使用者直接引用
 */
export type BuiltinColumnBodyDefine =
  | ILinkColumnBodyDefine
  | IImageColumnBodyDefine
  | ISparklineColumnBodyDefine
  | IProgressbarColumnBodyDefine
  | ICheckboxColumnBodyDefine
  | IRadioColumnBodyDefine
  | IChartColumnBodyDefine
  | ITextColumnBodyDefine
  | ISwitchColumnBodyDefine
  | IButtonColumnBodyDefine;

/**
 * 用户扩展的列 body 类型映射表。
 *
 * 使用者可以通过 module augmentation 扩展：
 * ```typescript
 * declare module '@visactor/vtable/es/ts-types' {
 *   interface CustomColumnBodyDefineMap {
 *     myCustom: IMyCustomColumnBodyDefine;
 *   }
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomColumnBodyDefineMap {}

/**
 * 所有 ColumnBodyDefine 的最终联合：
 * - 内置列 body
 * - 用户通过 CustomColumnBodyDefineMap 扩展的列 body
 */
export type ColumnBodyDefine = BuiltinColumnBodyDefine | CustomColumnBodyDefineMap[keyof CustomColumnBodyDefineMap];

export type TextColumnDefine = ITextColumnBodyDefine & HeaderDefine;
export type LinkColumnDefine = ILinkColumnBodyDefine & HeaderDefine;
export type ImageColumnDefine = IImageColumnBodyDefine & HeaderDefine;
export type SparklineColumnDefine = ISparklineColumnBodyDefine & HeaderDefine;
export type ProgressbarColumnDefine = IProgressbarColumnBodyDefine & HeaderDefine;
export type CheckboxColumnDefine = ICheckboxColumnBodyDefine & HeaderDefine;
export type RadioColumnDefine = IRadioColumnBodyDefine & HeaderDefine;
export type ChartColumnDefine = IChartColumnBodyDefine & HeaderDefine;
export type CompositeColumnDefine = ICompositeColumnBodyDefine & HeaderDefine;
export type SwitchColumnDefine = ISwitchColumnBodyDefine & HeaderDefine;
export type ButtonColumnDefine = IButtonColumnBodyDefine & HeaderDefine;

/**
 * 内置的「普通列」定义联合，不含分组列
 */
export type BuiltinSimpleColumnDefine =
  | LinkColumnDefine
  | ImageColumnDefine
  | SparklineColumnDefine
  | ProgressbarColumnDefine
  | CheckboxColumnDefine
  | RadioColumnDefine
  | ChartColumnDefine
  | TextColumnDefine
  | CompositeColumnDefine
  | SwitchColumnDefine
  | ButtonColumnDefine;

/**
 * 用户扩展的完整列定义映射表。
 *
 * 使用者可以通过 module augmentation 扩展：
 * ```typescript
 * declare module '@visactor/vtable/es/ts-types' {
 *   interface CustomColumnDefineMap {
 *     myCustomColumn: MyCustomColumnDefine;
 *   }
 * }
 * ```
 *  其中 MyCustomColumnDefine 一般形如：
 * ```typescript
 * type MyCustomColumnDefine = IMyCustomColumnBodyDefine & HeaderDefine;
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomColumnDefineMap {}

export type GroupColumnDefine = HeaderDefine & {
  columns: ColumnsDefine;
  hideColumnsSubHeader?: boolean;
};

/**
 * 所有「普通列」(simple column) 的最终联合：
 * - 内置列定义
 * - 用户扩展列定义
 */
export type SimpleColumnDefine = BuiltinSimpleColumnDefine | CustomColumnDefineMap[keyof CustomColumnDefineMap];

/**
 * 最终导出的 ColumnDefine：
 * - Either<普通列, 分组列>
 */
export type ColumnDefine = Either<SimpleColumnDefine, GroupColumnDefine>;

export type ColumnsDefine = ColumnDefine[];
