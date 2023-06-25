import type { ElementOptions } from './element';
import { BaseElement } from './element';

type RectOptions = {
  width: number;
  height: number;
  lineWidth?: number;
  cornerRadius?: number;
  fill?: string | boolean;
  stroke?: string | boolean;
} & ElementOptions;

export class Rect extends BaseElement {
  type: 'rect' = 'rect';
  declare width: number;
  declare height: number;
  lineWidth: number;
  cornerRadius: number;
  radius: number;
  fill: string | boolean;
  stroke: string | boolean;

  constructor(options: RectOptions) {
    super(options);
    this.width = options.width;
    this.height = options.height;
    this.lineWidth = options.lineWidth || 0;
    this.cornerRadius = options.cornerRadius || 0;
    this.radius = this.cornerRadius;
    this.fill = options.fill || '#777';
    this.stroke = options.stroke || undefined;

    this.initLayoutSize();
  }
}
