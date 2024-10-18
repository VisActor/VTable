import type { EasingType } from '@src/vrender';
import type { BaseTableAPI } from '../ts-types/base-table';

export interface ICarouselAnimationPluginOptions {
  rowCount?: number;
  colCount?: number;
  animationDuration?: number;
  animationDelay?: number;
  animationEasing?: EasingType;
  replaceScrollAction?: boolean;
}

export class CarouselAnimationPlugin {
  table: BaseTableAPI;

  rowCount: number;
  colCount: number;
  animationDuration: number;
  animationDelay: number;
  animationEasing: EasingType;
  replaceScrollAction: boolean;

  playing: boolean;
  row: number;
  col: number;
  constructor(table: BaseTableAPI, options?: ICarouselAnimationPluginOptions) {
    this.table = table;

    this.rowCount = options?.rowCount ?? undefined;
    this.colCount = options?.colCount ?? undefined;
    this.animationDuration = options?.animationDuration ?? 500;
    this.animationDelay = options?.animationDelay ?? 1000;
    this.animationEasing = options?.animationEasing ?? 'linear';
    this.replaceScrollAction = options?.replaceScrollAction ?? false;

    this.playing = false;
    this.row = table.frozenRowCount;
    this.col = table.frozenColCount;

    this.init();
  }

  init() {
    if (this.replaceScrollAction) {
      this.table.disableScroll();

      this.table.scenegraph.stage.addEventListener('wheel', this.onScrollEnd.bind(this));
    }
  }

  onScrollEnd(e: Event) {
    if (this.rowCount) {
      if ((e as any).deltaY > 0) {
        this.row += this.rowCount;
        this.row = Math.min(this.row, this.table.rowCount - this.table.frozenRowCount);
      } else if ((e as any).deltaY < 0) {
        this.row -= this.rowCount;
        this.row = Math.max(this.row, this.table.frozenRowCount);
      }
      this.table.scrollToRow(this.row, { duration: this.animationDuration, easing: this.animationEasing });
    } else if (this.colCount) {
      if ((e as any).deltaX > 0) {
        this.col += this.colCount;
        this.col = Math.min(this.col, this.table.colCount - this.table.frozenColCount);
      } else if ((e as any).deltaX < 0) {
        this.col -= this.colCount;
        this.col = Math.max(this.col, this.table.frozenColCount);
      }
      this.table.scrollToCol(this.col, { duration: this.animationDuration, easing: this.animationEasing });
    }
  }

  play() {
    this.playing = true;

    if (this.rowCount) {
      this.updateRow();
    } else if (this.colCount) {
      this.updateCol();
    }
  }

  pause() {
    this.playing = false;
  }

  updateRow() {
    if (!this.playing) {
      return;
    }
    if (this.table.scenegraph.proxy.screenTopRow !== this.row) {
      this.row = this.table.frozenRowCount;
    } else {
      this.row += this.rowCount;
    }
    this.table.scrollToRow(this.row, { duration: this.animationDuration, easing: this.animationEasing });
    setTimeout(() => {
      this.updateRow();
    }, this.animationDuration + this.animationDelay);
  }

  updateCol() {
    if (!this.playing) {
      return;
    }
    if (this.table.scenegraph.proxy.screenLeftCol !== this.col) {
      this.col = this.table.frozenColCount;
    } else {
      this.col += this.colCount;
    }

    this.table.scrollToCol(this.col, { duration: this.animationDuration, easing: this.animationEasing });
    setTimeout(() => {
      this.updateCol();
    }, this.animationDuration + 50);
  }
}
