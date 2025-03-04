import type { TagAttributes } from '@src/vrender';
import { Tag as VTag } from '@src/vrender';
import { isArray } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';

type ITagOption = {
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & TagAttributes;

export class Tag extends VTag {
  constructor(options: ITagOption) {
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
  getSize(table: BaseTableAPI) {
    this.AABBBounds.width();
  }
}
