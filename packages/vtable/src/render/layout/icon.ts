import { isString } from '@visactor/vutils';
import type { ElementOptions } from './element';
import { BaseElement } from './element';
import * as registerIcons from '../../icons';
import type { ColumnIconOption } from '../../ts-types';

type IconOptions = {
  width: number;
  height: number;
  svg?: string;
  iconName?: string;
} & ElementOptions;

export class Icon extends BaseElement {
  declare id: string;
  type: 'icon' = 'icon';
  declare width: number;
  declare height: number;
  svg: string;
  iconName: string;
  cursor?: string;
  cache?: ColumnIconOption;

  constructor(options: IconOptions) {
    super(options);
    this.iconName = options.iconName;
    if (isString(this.iconName)) {
      const regedIcons = registerIcons.get();
      const cache = regedIcons[this.iconName];
      if (cache) {
        this.cache = cache;
        this.width = cache.width;
        this.height = cache.height;
        this.svg = (cache as any).svg;
        this.cursor = (cache as any).cursor;
      }
    }

    // options中的配置可以覆盖cache
    this.width = options.width ?? this.width;
    this.height = options.height ?? this.height;
    this.svg = options.svg ?? this.svg;

    this.initLayoutSize();
  }
}
