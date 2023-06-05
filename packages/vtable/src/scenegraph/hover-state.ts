export class HoverState {
  highlightMode: 'cross' | 'column' | 'row' | 'cell';
  disableHover: boolean;
  disableHeaderHover: boolean;
  cell: { row: number; col: number };
  _state: any;
  table: any;

  constructor(table: any) {
    this.highlightMode = 'cell';
    this.cell = { row: -1, col: -1 };
    this.disableHeaderHover = false;
    this.table = table;
  }

  get state() {
    return this._state;
  }

  set state(state) {
    if (
      state &&
      this._state &&
      (state.address.col !== this._state.address.col || state.address.row !== this._state.address.row)
    ) {
      this.table.scenegraph.update(
        this.table.scenegraph.getCell(this._state.address.col, this._state.address.row),
        state.address.col,
        state.address.row,
        0,
        'fill',
        'normal'
      );

      this.table.scenegraph.update(
        this.table.scenegraph.getCell(state.address.col, state.address.row),
        state.address.col,
        state.address.row,
        0,
        'fill',
        '#c8daf6'
      );

      this._state = state;
    } else if (!state && this._state) {
      this.table.scenegraph.update(
        this.table.scenegraph.getCell(this._state.address.col, this._state.address.row),
        this._state.address.col,
        this._state.address.row,
        0,
        'fill',
        'normal'
      );

      this._state = state;
    } else if (state && !this._state) {
      this.table.scenegraph.update(
        this.table.scenegraph.getCell(state.address.col, state.address.row),
        state.address.col,
        state.address.row,
        0,
        'fill',
        '#c8daf6'
      );

      this._state = state;
    }
  }
}
