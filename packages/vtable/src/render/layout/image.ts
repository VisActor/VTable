import { isString } from '../../tools/util';
import type { ElementOptions } from './element';
import { BaseElement } from './element';
import * as registerIcons from '../../icons';
import type { ColumnIconOption } from '../../ts-types';

type ImageOptions = {
  width: number;
  height: number;
  src?: string;
  shape?: 'circle' | 'square';
} & ElementOptions;

export class Image extends BaseElement {
  declare id: string;
  type: 'image' = 'image';
  declare width: number;
  declare height: number;
  src: string;
  cursor?: string;
  cache?: ColumnIconOption;
  shape?: 'circle' | 'square';
  constructor(options: ImageOptions) {
    super(options);
    // options中的配置可以覆盖cache
    this.width = options.width ?? this.width;
    this.height = options.height ?? this.height;
    this.src = options.src ?? this.src;
    this.shape = options.shape ?? this.shape;
    this.initLayoutSize();
  }
}
