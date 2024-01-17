import type { IImageGraphicAttribute } from '@src/vrender';
import { Image as VImage } from '@src/vrender';
import { isArray } from '@visactor/vutils';

type IImageOptions = {
  src?: string;
  shape?: 'circle' | 'square';
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IImageGraphicAttribute;
export class Image extends VImage {
  constructor(options: IImageOptions) {
    if (options.src) {
      options.image = options.src;
    }
    if (options.shape === 'circle') {
      options.cornerRadius = options.width / 2;
    }

    const isPaddingNumber = isArray(options.boundsPadding);
    const padding = [
      options.marginTop ?? (isPaddingNumber ? options.boundsPadding[0] : options.boundsPadding) ?? 0,
      options.marginRight ?? (isPaddingNumber ? options.boundsPadding[1] : options.boundsPadding) ?? 0,
      options.marginBottom ??
        (isPaddingNumber ? options.boundsPadding[2] ?? options.boundsPadding[0] : options.boundsPadding) ??
        0,
      options.marginLeft ??
        (isPaddingNumber ? options.boundsPadding[3] ?? options.boundsPadding[1] : options.boundsPadding) ??
        0
    ];
    options.boundsPadding = padding;

    super(options);
  }
}
