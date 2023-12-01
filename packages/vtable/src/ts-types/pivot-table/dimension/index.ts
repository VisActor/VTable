import type { IImageDimension } from './image-dimension';
import type { ILinkDimension } from './link-dimension';
import type { ITextDimension } from './multilinetext-dimension';

export type IDimension = IRowDimension | IColumnDimension;
export type IRowDimension = ILinkDimension | IImageDimension | ITextDimension;
export type IColumnDimension = Omit<
  ILinkDimension | IImageDimension | ITextDimension,
  'width' | 'minWidth' | 'maxWidth'
>;
