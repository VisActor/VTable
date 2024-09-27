import type { IRect } from 'src/vrender';
import { DefaultTimeline, DefaultTicker, Animate, ACustomAnimate, createRect } from '@visactor/vrender-core';
import type { BaseTableAPI } from '../ts-types/base-table';

class Animateaaa extends ACustomAnimate<any> {
  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    // debugger;
    // console.log(end, ratio, out);
    const y = end ? this.to.y : this.from.y + Math.floor((this.to.y - this.from.y) * ratio);
    this.params.table.scrollTop = y;
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
    // this.animation = new Animate().bind(this.tempGraphic);
  }

  scrollToRow(row: number) {
    const from = {
      y: this.table.scrollTop
    };
    const to = {
      y: this.table.getCellRect(0, row).top
    };
    const animation = new Animate().bind(this.tempGraphic).play(
      new Animateaaa(from, to, 3000, 'linear', {
        graphic: this.tempGraphic,
        table: this.table
      })
    );
    this.timeline.addAnimate(animation);
    this.ticker.start();
  }
}
