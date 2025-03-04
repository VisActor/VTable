import type { EasingType, IRect } from '@src/vrender';
import { DefaultTimeline, DefaultTicker, Animate, ACustomAnimate, createRect, Generator } from '@src/vrender';
import type { BaseTableAPI } from '../ts-types/base-table';
import { isBoolean, isNumber } from '@visactor/vutils';
import type { ITableAnimationOption } from '../ts-types/animation/appear';

function isInteger(value: number) {
  return Math.floor(value) === value;
}
class Animateaaa extends ACustomAnimate<any> {
  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    if (this.from.x !== this.to.x) {
      const x = end ? this.to.x : this.from.x + Math.floor((this.to.x - this.from.x) * ratio);
      this.params.table.scrollLeft = x;
    }
    if (this.from.y !== this.to.y) {
      const y = end ? this.to.y : this.from.y + Math.floor((this.to.y - this.from.y) * ratio);
      this.params.table.scrollTop = y;
    }
  }
}

export class TableAnimationManager {
  table: BaseTableAPI;
  timeline: DefaultTimeline;
  ticker: DefaultTicker;
  animation: Animate;
  tempGraphic: IRect;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.timeline = new DefaultTimeline();
    // this.ticker = new DefaultTicker([this.timeline]);
    this.ticker = new DefaultTicker();
    this.ticker.addTimeline(this.timeline);
    const TICKER_FPS = 60;
    this.ticker.setFPS(TICKER_FPS);
    // no use, for avoid error in vrender animation
    this.tempGraphic = createRect({});
  }

  scrollTo(position: { col?: number; row?: number }, animationOption?: ITableAnimationOption | true) {
    const from = {
      x: this.table.scrollLeft,
      y: this.table.scrollTop
    };

    const { col, row } = position;
    let colInt = col;
    let rowInt = row;
    let colDecimal;
    let rowDecimal;
    if (isNumber(col) && !isInteger(col)) {
      colInt = Math.floor(col);
      colDecimal = col - colInt;
    }
    if (isNumber(row) && !isInteger(row)) {
      rowInt = Math.floor(row);
      rowDecimal = row - rowInt;
    }
    const cellRect = this.table.getCellRect(colInt ?? 0, rowInt ?? 0);
    let { left, top } = cellRect;

    // deal with decimal
    if (colDecimal) {
      left += colDecimal * cellRect.width;
    }
    if (rowDecimal) {
      top += rowDecimal * cellRect.height;
    }

    const to = {
      x: isNumber(col) ? left - this.table.getFrozenColsWidth() : this.table.scrollLeft,
      y: isNumber(row) ? top - this.table.getFrozenRowsHeight() : this.table.scrollTop
    };
    const duration = !isBoolean(animationOption) ? animationOption?.duration ?? 3000 : animationOption ? 3000 : 0;
    const easing = !isBoolean(animationOption) ? animationOption?.easing ?? 'linear' : animationOption ? 'linear' : '';

    const animation = new Animate(Generator.GenAutoIncrementId(), this.timeline).bind(this.tempGraphic).play(
      new Animateaaa(from, to, duration, easing, {
        graphic: this.tempGraphic,
        table: this.table
      })
    );
    // this.timeline.addAnimate(animation);
    this.ticker.start();
  }

  clear() {
    this.timeline.clear();
    this.ticker.stop();
  }
}
