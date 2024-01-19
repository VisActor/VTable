import type { IRectGraphicAttribute } from '@src/vrender';
import { Rect as VRect } from '@src/vrender';
import { isArray } from '@visactor/vutils';

type IRectOption = {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IRectGraphicAttribute;

export class Rect extends VRect {
  constructor(options: IRectOption) {
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
