import type { IImageGraphicAttribute } from '@src/vrender';
import { Image } from '@src/vrender';
import { isArray, isString } from '@visactor/vutils';
import * as registerIcons from '../../icons';
import type { ColumnIconOption } from '../../ts-types';

type IIconOptions = {
  width: number;
  height: number;
  svg?: string;
  iconName?: string;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IImageGraphicAttribute;

export class Icon extends Image {
  declare id: string;
  svg: string;
  iconName: string;
  cache?: ColumnIconOption;

  constructor(options: IIconOptions) {
    let cache;
    if (isString(options.iconName)) {
      const regedIcons = registerIcons.get();
      cache = regedIcons[options.iconName];
      if (cache) {
        options.width = options.width ?? cache.width;
        options.height = options.height ?? cache.height;
        options.svg = (cache as any).svg;
        options.cursor = (cache as any).cursor;
      }
    }
    if (options.svg) {
      options.image = options.svg;
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
    this.cache = cache;
  }
}
