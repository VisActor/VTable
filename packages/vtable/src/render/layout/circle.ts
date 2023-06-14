import type { ElementOptions } from './element';
import { BaseElement } from './element';

type CircleOptions = {
  radius: number;
  radian?: number;
  lineWidth?: number;
  fill?: string | boolean;
  stroke?: string | boolean;
} & ElementOptions;

export class Circle extends BaseElement {
  type: 'circle' = 'circle';
  radius: number;
  radian: number;
  lineWidth: number;
  fill: string | boolean;
  stroke: string | boolean;

  constructor(options: CircleOptions) {
    super(options);
    this.radius = options.radius;
    this.radian = options.radian;
    this.lineWidth = options.lineWidth;
    this.fill = options.fill;
    this.stroke = options.stroke;

    this.width = this.radius * 2;
    this.height = this.radius * 2;

    this.initLayoutSize();

    this.dx += this.radius;
    this.dy += this.radius;
  }
}
