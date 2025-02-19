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

export type ColumnBodyDefine =
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
// export type GroupColumnDefine = IChartColumnBodyDefine & HeaderDefine;
export type GroupColumnDefine = HeaderDefine & {
  columns: ColumnsDefine;
  hideColumnsSubHeader?: boolean;
};
export type ColumnDefine = Either<
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
  | ButtonColumnDefine,
  GroupColumnDefine
>;

// export type ColumnDefine = HeaderDefine & ColumnBodyDefine;

export type ColumnsDefine = ColumnDefine[];
