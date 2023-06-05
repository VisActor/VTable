import type { IChartColumnIndicator } from './chart-indicator';
import type { IImageColumnIndicator, IImageHeaderIndicator } from './image-indicator';
import type { ILinkColumnIndicator, ILinkHeaderIndicator } from './link-indicator';
import type { ITextColumnIndicator, ITextHeaderIndicator } from './multilinetext-indicator';
import type { IProgressbarColumnIndicator } from './progress-indicator';
import type { ISparklineColumnIndicator } from './sparkline-indicator';

export type HeaderIndicator = Partial<ITextHeaderIndicator | ILinkHeaderIndicator | IImageHeaderIndicator>;

export type ColumnIndicator = Partial<
  | ITextColumnIndicator
  | ILinkColumnIndicator
  | IImageColumnIndicator
  | ISparklineColumnIndicator
  | IProgressbarColumnIndicator
  | IChartColumnIndicator
>;

export type IIndicator = HeaderIndicator & ColumnIndicator;
export type IIndicatorCustom = IIndicator;
