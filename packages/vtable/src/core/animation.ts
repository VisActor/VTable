import type { EasingType, IRect } from '@src/vrender';
import { DefaultTimeline, DefaultTicker, Animate, ACustomAnimate, createRect } from '@src/vrender';
import type { BaseTableAPI } from '../ts-types/base-table';
import { isBoolean, isNumber } from '@visactor/vutils';

export type ITableAnimationOption = {
  duration?: number;
  easing?: EasingType;
};

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
    this.ticker = new DefaultTicker([this.timeline]);
    // no use, for avoid error in vrender animation
    this.tempGraphic = createRect({});
  }

  scrollTo(position: { col?: number; row?: number }, animationOption?: ITableAnimationOption | true) {
    const from = {
      x: this.table.scrollLeft,
      y: this.table.scrollTop
    };
    const cellRect = this.table.getCellRect(position.col ?? 0, position.row ?? 0);
    const to = {
      x: isNumber(position.col) ? cellRect.left - this.table.getFrozenColsWidth() : this.table.scrollLeft,
      y: isNumber(position.row) ? cellRect.top - this.table.getFrozenRowsHeight() : this.table.scrollTop
    };
    const duration = !isBoolean(animationOption) ? animationOption?.duration ?? 3000 : animationOption ? 3000 : 0;
    const easing = !isBoolean(animationOption) ? animationOption?.easing ?? 'linear' : animationOption ? 'linear' : '';

    const animation = new Animate().bind(this.tempGraphic).play(
      new Animateaaa(from, to, duration, easing, {
        graphic: this.tempGraphic,
        table: this.table
      })
    );
    this.timeline.addAnimate(animation);
    this.ticker.start();
  }

  clear() {
    this.timeline.clear();
    this.ticker.stop();
  }
}
