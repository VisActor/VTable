import type { ElementOptions } from './element';
import { BaseElement } from './element';

type SectorOptions = {
  radius: number;
  startDegree?: number;
  endDegree?: number;
  clockWise?: boolean;
  lineWidth?: number;
  fill?: string | boolean;
  stroke?: string | boolean;
} & ElementOptions;

export class Sector extends BaseElement {
  type: 'arc' = 'arc';
  radius: number;
  startDegree = 0;
  endDegree = 360;
  clockWise = true;
  lineWidth: number;
  fill: string | boolean;
  stroke: string | boolean;

  constructor(options: SectorOptions) {
    super(options);
    this.radius = options.radius;
    this.startDegree = options.startDegree;
    this.endDegree = options.endDegree;
    this.clockWise = options.clockWise;
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
