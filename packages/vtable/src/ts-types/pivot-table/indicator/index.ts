import type { IChartColumnIndicator } from './chart-indicator';
import type { IImageColumnIndicator, IImageHeaderIndicator } from './image-indicator';
import type { ILinkColumnIndicator, ILinkHeaderIndicator } from './link-indicator';
import type { ITextColumnIndicator, ITextHeaderIndicator } from './multilinetext-indicator';
import type { IProgressbarColumnIndicator } from './progress-indicator';
import type { ISparklineColumnIndicator } from './sparkline-indicator';

export type HeaderIndicator = ILinkHeaderIndicator | IImageHeaderIndicator | ITextHeaderIndicator;

export type ColumnIndicator =
  | ILinkColumnIndicator
  | IImageColumnIndicator
  | ISparklineColumnIndicator
  | IProgressbarColumnIndicator
  | IChartColumnIndicator
  | ITextColumnIndicator;

export type IIndicator = HeaderIndicator & ColumnIndicator;

export type IChartIndicator = HeaderIndicator & IChartColumnIndicator;
