import type { IArcGraphicAttribute } from '@src/vrender';
import { Arc as VArc } from '@src/vrender';
import { isArray } from '@visactor/vutils';

type IArcOption = {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IArcGraphicAttribute;

export class Arc extends VArc {
  constructor(options: IArcOption) {
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
