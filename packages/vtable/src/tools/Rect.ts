import { Bounds } from '@visactor/vutils';
import type { RectProps } from '../ts-types';

export class Rect implements RectProps {
  bounds: Bounds;
  constructor(left: number, top: number, width: number, height: number) {
    this.bounds = new Bounds();
    this.bounds.set(left, top, left + width, top + height);
  }

  static bounds(left: number, top: number, right: number, bottom: number): Rect {
    return new Rect(left, top, Math.round(right - left), Math.round(bottom - top));
  }

  get left(): number {
    return this.bounds.x1;
  }
  set left(left: number) {
    this.bounds.x1 = left;
  }
  get top(): number {
    return this.bounds.y1;
  }
  set top(top: number) {
    this.bounds.y1 = top;
  }
  get right(): number {
    return this.bounds.x2;
  }
  set right(right: number) {
    this.bounds.x2 = right;
  }
  get bottom(): number {
    return this.bounds.y2;
  }
  set bottom(bottom: number) {
    this.bounds.y2 = bottom;
  }
  get width(): number {
    return this.bounds.width();
  }
  set width(width: number) {
    this.bounds.x2 = this.bounds.x1 + width;
  }
  get height(): number {
    return this.bounds.height();
  }
  set height(height: number) {
    this.bounds.y2 = this.bounds.y1 + height;
  }

  offsetLeft(offset: number): void {
    this.bounds.translate(offset, 0);
  }
  offsetTop(offset: number): void {
    this.bounds.translate(0, offset);
  }
  copy(): Rect {
    return new Rect(this.left, this.top, this.width, this.height);
  }
  contains(another: Rect): boolean {
    return this.bounds.encloses(another.bounds);
  }
  inPoint(x: number, y: number): boolean {
    return this.bounds.contains(x, y);
  }
}
