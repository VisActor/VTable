import type { EasingType } from '@visactor/vtable/es/vrender';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type * as VTable from '@visactor/vtable';
function isInteger(value: number) {
  return Math.floor(value) === value;
}

export interface ITableCarouselAnimationPluginOptions {
  id?: string;
  rowCount?: number;
  colCount?: number;
  animationDuration?: number;
  animationDelay?: number;
  animationEasing?: EasingType;
  autoPlay?: boolean;
  autoPlayDelay?: number;

  customDistRowFunction?: (row: number, table: BaseTableAPI) => { distRow: number; animation?: boolean } | undefined;
  customDistColFunction?: (col: number, table: BaseTableAPI) => { distCol: number; animation?: boolean } | undefined;
}

export class TableCarouselAnimationPlugin implements VTable.plugins.IVTablePlugin {
  id = `table-carousel-animation-${Date.now()}`;
  name = 'Table Carousel Animation';
  runTime = [TABLE_EVENT_TYPE.INITIALIZED];
  table: BaseTableAPI;

  rowCount: number;
  colCount: number;
  animationDuration: number;
  animationDelay: number;
  animationEasing: EasingType;

  playing: boolean;
  row: number;
  col: number;
  willUpdateRow: boolean = false;
  willUpdateCol: boolean = false;
  autoPlay: boolean;
  autoPlayDelay: number;

  customDistRowFunction?: (row: number, table: BaseTableAPI) => { distRow: number; animation?: boolean } | undefined;
  customDistColFunction?: (col: number, table: BaseTableAPI) => { distCol: number; animation?: boolean } | undefined;
  constructor(options: ITableCarouselAnimationPluginOptions = {}) {
    this.id = options.id ?? this.id;
    this.rowCount = options?.rowCount ?? undefined;
    this.colCount = options?.colCount ?? undefined;
    this.animationDuration = options?.animationDuration ?? 500;
    this.animationDelay = options?.animationDelay ?? 1000;
    this.animationEasing = options?.animationEasing ?? 'linear';
    this.autoPlay = options?.autoPlay ?? false;
    this.autoPlayDelay = options?.autoPlayDelay ?? 0;
    this.customDistColFunction = options.customDistColFunction;
    this.customDistRowFunction = options.customDistRowFunction;
  }
  run(...args: any[]) {
    if (!this.table) {
      this.table = args[2] as BaseTableAPI;
    }
    this.reset();

    if (this.autoPlay) {
      setTimeout(() => {
        this.play();
      }, this.autoPlayDelay);
    }
  }

  reset() {
    this.playing = false;
    this.row = this.table.frozenRowCount;
    this.col = this.table.frozenColCount;
  }

  play() {
    if (!this.table) {
      throw new Error('table is not initialized');
    }
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
  release() {
    // do nothing
  }
}
