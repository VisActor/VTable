import { WrapText, type IWrapTextGraphicAttribute } from '@visactor/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { TagAttributes } from '@visactor/vrender-components';
import { isArray } from '@visactor/vutils';

type ITextOption = {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IWrapTextGraphicAttribute;

export class Text extends WrapText {
  constructor(options: ITextOption) {
    if (!options.textBaseline) {
      options.textBaseline = 'top';
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
    options.fill = options.fill ?? '#000';

    super(options);
  }
  getSize(table: BaseTableAPI) {
    this.AABBBounds.width();
  }
}
