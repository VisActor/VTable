import type { ICompositeDimension } from './composite-dimension';
import type { IAudioDimension, IImageDimension } from './image-dimension';
import type { ILinkDimension } from './link-dimension';
import type { ITextDimension } from './multilinetext-dimension';

export type IDimension = IRowDimension | IColumnDimension;
export type IRowDimension = ILinkDimension | IImageDimension | IAudioDimension | ITextDimension | ICompositeDimension;
type OmitColumnWidth<T> = T extends unknown ? Omit<T, 'width' | 'minWidth' | 'maxWidth'> : never;
export type IColumnDimension = OmitColumnWidth<
  ILinkDimension | IImageDimension | IAudioDimension | ITextDimension | ICompositeDimension
>;
