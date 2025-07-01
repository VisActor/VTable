import type { EasingType } from '@visactor/vtable/es/vrender';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';

function isInteger(value: number) {
  return Math.floor(value) === value;
}

export interface ICarouselAnimationPluginOptions {
  rowCount?: number;
  colCount?: number;
  animationDuration?: number;
  animationDelay?: number;
  animationEasing?: EasingType;
  replaceScrollAction?: boolean;

  customDistRowFunction?: (row: number, table: BaseTableAPI) => { distRow: number; animation?: boolean } | undefined;
  customDistColFunction?: (col: number, table: BaseTableAPI) => { distCol: number; animation?: boolean } | undefined;
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
  willUpdateRow: boolean = false;
  willUpdateCol: boolean = false;

  customDistRowFunction?: (row: number, table: BaseTableAPI) => { distRow: number; animation?: boolean } | undefined;
  customDistColFunction?: (col: number, table: BaseTableAPI) => { distCol: number; animation?: boolean } | undefined;
  constructor(table: BaseTableAPI, options?: ICarouselAnimationPluginOptions) {
    this.table = table;

    this.rowCount = options?.rowCount ?? undefined;
    this.colCount = options?.colCount ?? undefined;
    this.animationDuration = options?.animationDuration ?? 500;
    this.animationDelay = options?.animationDelay ?? 1000;
    this.animationEasing = options?.animationEasing ?? 'linear';
    this.replaceScrollAction = options?.replaceScrollAction ?? false;

    this.customDistColFunction = options.customDistColFunction;
    this.customDistRowFunction = options.customDistRowFunction;

    this.reset();
    this.init();
  }

  init() {
    if (this.replaceScrollAction) {
      this.table.disableScroll();

      this.table.scenegraph.stage.addEventListener('wheel', this.onScrollEnd.bind(this));
    }
  }

  reset() {
    this.playing = false;
    this.row = this.table.frozenRowCount;
    this.col = this.table.frozenColCount;
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

    if (this.rowCount && !this.willUpdateRow) {
      this.updateRow();
    } else if (this.colCount && !this.willUpdateCol) {
      this.updateCol();
    }
  }

  pause() {
    this.playing = false;
  }

  updateRow() {
    if (!this.playing || this.table.isReleased) {
      return;
    }

    let animation = true;
    const customRow = this.customDistRowFunction && this.customDistRowFunction(this.row, this.table);
    if (customRow) {
      this.row = customRow.distRow;
      animation = customRow.animation ?? true;
    } else if (isInteger(this.row) && this.table.scenegraph.proxy.screenTopRow !== this.row) {
      this.row = this.table.frozenRowCount;
      animation = false;
    } else if (!isInteger(this.row) && this.table.scenegraph.proxy.screenTopRow !== Math.floor(this.row)) {
      this.row = this.table.frozenRowCount;
      animation = false;
    } else {
      this.row += this.rowCount;
    }
    this.table.scrollToRow(
      this.row,
      animation ? { duration: this.animationDuration, easing: this.animationEasing } : undefined
    );
    this.willUpdateRow = true;
    setTimeout(
      () => {
        this.willUpdateRow = false;
        this.updateRow();
      },
      // animation ? this.animationDuration + this.animationDelay : 0
      this.animationDuration + this.animationDelay
    );
  }

  updateCol() {
    if (!this.playing || this.table.isReleased) {
      return;
    }

    let animation = true;
    const customCol = this.customDistColFunction && this.customDistColFunction(this.col, this.table);
    if (customCol) {
      this.col = customCol.distCol;
      animation = customCol.animation ?? true;
    } else if (isInteger(this.col) && this.table.scenegraph.proxy.screenLeftCol !== this.col) {
      this.col = this.table.frozenColCount;
      animation = false;
    } else if (!isInteger(this.col) && this.table.scenegraph.proxy.screenLeftCol !== Math.floor(this.col)) {
      this.col = this.table.frozenColCount;
      animation = false;
    } else {
      this.col += this.colCount;
    }

    this.table.scrollToCol(
      this.col,
      animation ? { duration: this.animationDuration, easing: this.animationEasing } : undefined
    );

    this.willUpdateCol = true;
    setTimeout(
      () => {
        this.willUpdateCol = false;
        this.updateCol();
      },
      // animation ? this.animationDuration + this.animationDelay : 0
      this.animationDuration + this.animationDelay
    );
  }
}
