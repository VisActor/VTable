import type { Either } from '../../../tools/helper';
import type { IChartColumnBodyDefine } from './chart-define';
import type { IImageColumnBodyDefine, IImageHeaderDefine } from './image-define';
import type { ILinkColumnBodyDefine, ILinkHeaderDefine } from './link-define';
import type { ITextColumnBodyDefine, ITextHeaderDefine } from './multilinetext-define';
import type { IProgressbarColumnBodyDefine } from './progressbar-define';
import type { ISparklineColumnBodyDefine } from './sparkline-define';

export type HeaderDefine = ITextHeaderDefine | ILinkHeaderDefine | IImageHeaderDefine;

export type ColumnBodyDefine =
  | ITextColumnBodyDefine
  | ILinkColumnBodyDefine
  | IImageColumnBodyDefine
  | ISparklineColumnBodyDefine
  | IProgressbarColumnBodyDefine
  | IChartColumnBodyDefine;
export type TextColumnDefine = ITextColumnBodyDefine & HeaderDefine;
export type LinkColumnDefine = ILinkColumnBodyDefine & HeaderDefine;
export type ImageColumnDefine = IImageColumnBodyDefine & HeaderDefine;
export type SparklineColumnDefine = ISparklineColumnBodyDefine & HeaderDefine;
export type ProgressbarColumnDefine = IProgressbarColumnBodyDefine & HeaderDefine;
export type ChartColumnDefine = IChartColumnBodyDefine & HeaderDefine;
// export type GroupColumnDefine = IChartColumnBodyDefine & HeaderDefine;
export type GroupColumnDefine = HeaderDefine & {
  columns: ColumnsDefine;
  hideColumnsSubHeader?: boolean;
};
export type ColumnDefine = Either<
  | TextColumnDefine
  | LinkColumnDefine
  | ImageColumnDefine
  | SparklineColumnDefine
  | ProgressbarColumnDefine
  | ChartColumnDefine,
  GroupColumnDefine
>;

// export type ColumnDefine = HeaderDefine & ColumnBodyDefine;

export type ColumnsDefine = ColumnDefine[];
