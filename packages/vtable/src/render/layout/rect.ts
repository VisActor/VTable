import type { ElementOptions } from './element';
import { BaseElement } from './element';

type RectOptions = {
  width: number;
  height: number;
  lineWidth?: number;
  borderRadius?: number;
  fill?: string | boolean;
  stroke?: string | boolean;
} & ElementOptions;

export class Rect extends BaseElement {
  type: 'rect' = 'rect';
  declare width: number;
  declare height: number;
  lineWidth: number;
  borderRadius: number;
  radius: number;
  fill: string | boolean;
  stroke: string | boolean;

  constructor(options: RectOptions) {
    super(options);
    this.width = options.width;
    this.height = options.height;
    this.lineWidth = options.lineWidth || 0;
    this.borderRadius = options.borderRadius || 0;
    this.radius = this.borderRadius;
    this.fill = options.fill || '#777';
    this.stroke = options.stroke || undefined;

    this.initLayoutSize();
  }
}
