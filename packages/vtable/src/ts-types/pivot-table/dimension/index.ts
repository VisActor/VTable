import type { IImageDimension } from './image-dimension';
import type { ILinkDimension } from './link-dimension';
import type { ITextDimension } from './multilinetext-dimension';

export type IDimension = ILinkDimension | IImageDimension | ITextDimension;
