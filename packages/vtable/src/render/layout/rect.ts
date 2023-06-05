import type { ElementOptions } from './element';
import { BaseElement } from './element';

type RectOptions = {
  width: number;
  height: number;
  lineWidth?: number;
  borderRadius?: number;
  fillColor?: string;
  strokeColor?: string;
} & ElementOptions;

export class Rect extends BaseElement {
  type: 'rect' = 'rect';
  declare width: number;
  declare height: number;
  lineWidth: number;
  borderRadius: number;
  radius: number;
  fillColor: string;
  strokeColor: string;

  constructor(options: RectOptions) {
    super(options);
    this.width = options.width;
    this.height = options.height;
    this.lineWidth = options.lineWidth || 0;
    this.borderRadius = options.borderRadius || 0;
    this.radius = this.borderRadius;
    this.fillColor = options.fillColor || '#777';
    this.strokeColor = options.strokeColor || undefined;

    this.initLayoutSize();
  }
}
