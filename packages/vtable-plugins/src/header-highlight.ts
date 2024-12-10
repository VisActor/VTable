import type { CellRange } from '@visactor/vtable/es/ts-types';
import type { BaseTableAPI } from '@visactor/vtable/es/ts-types/base-table';

export interface IHeaderHighlightPluginOptions {
  rowHighlight?: boolean;
  colHighlight?: boolean;
  colHighlightBGColor?: string;
  colHighlightColor?: string;
  rowHighlightBGColor?: string;
  rowHighlightColor?: string;
}

export class HeaderHighlightPlugin {
  table: BaseTableAPI;
  options: IHeaderHighlightPluginOptions;
  colHeaderRange?: CellRange;
  rowHeaderRange?: CellRange;
  constructor(table: BaseTableAPI, options?: IHeaderHighlightPluginOptions) {
    this.table = table;
    this.options = options;

    this.registerStyle();
    this.bindEvent();
  }

  registerStyle() {
    this.table.registerCustomCellStyle('col-highlight', {
      bgColor: this.options?.colHighlightBGColor ?? '#82b2f5',
      color: this.options?.colHighlightColor ?? '#FFF'
    });

    this.table.registerCustomCellStyle('row-highlight', {
      bgColor: this.options?.rowHighlightBGColor ?? '#82b2f5',
      color: this.options?.rowHighlightColor ?? '#FFF'
    });
  }

  bindEvent() {
    this.table.on('selected_cell', () => {
      this.updateHighlight();
    });

    this.table.on('selected_clear', () => {
      this.clearHighlight();
    });

    this.table.on('mousemove_table', () => {
      if (this.table.stateManager.select.selecting) {
        this.updateHighlight();
      }
    });
  }

  clearHighlight() {
    this.colHeaderRange && this.table.arrangeCustomCellStyle({ range: this.colHeaderRange }, undefined, true);
    this.rowHeaderRange && this.table.arrangeCustomCellStyle({ range: this.rowHeaderRange }, undefined, true);

    // clear range
    this.colHeaderRange = undefined;
    this.rowHeaderRange = undefined;
  }

  updateHighlight() {
    if (this.options?.colHighlight === false && this.options?.rowHighlight === false) {
      return;
    }
    const selectRanges = this.table.getSelectedCellRanges();
    if (selectRanges.length === 0) {
      this.clearHighlight();
      return;
    }

    const selectRange = selectRanges[0];
    const rowSelectRange = [selectRange.start.row, selectRange.end.row];
    rowSelectRange.sort((a, b) => a - b); // sort
    const colSelectRange = [selectRange.start.col, selectRange.end.col];
    colSelectRange.sort((a, b) => a - b); // sort

    let colHeaderRange: CellRange;
    let rowHeaderRange: CellRange;
    if (this.table.isPivotTable()) {
      colHeaderRange = {
        start: {
          col: colSelectRange[0],
          row: 0
        },
        end: {
          col: colSelectRange[1],
          row: this.table.columnHeaderLevelCount - 1
        }
      };
      rowHeaderRange = {
        start: {
          col: 0,
          row: rowSelectRange[0]
        },
        end: {
          col: this.table.rowHeaderLevelCount - 1,
          row: rowSelectRange[1]
        }
      };
    } else if (this.table.internalProps.transpose) {
      rowHeaderRange = {
        start: {
          col: 0,
          row: rowSelectRange[0]
        },
        end: {
          col: this.table.rowHeaderLevelCount - 1,
          row: rowSelectRange[1]
        }
      };
    } else {
      colHeaderRange = {
        start: {
          col: colSelectRange[0],
          row: 0
        },
        end: {
          col: colSelectRange[1],
          row: this.table.columnHeaderLevelCount - 1
        }
      };
      if (this.table.internalProps.rowSeriesNumber) {
        rowHeaderRange = {
          start: {
            col: 0,
            row: rowSelectRange[0]
          },
          end: {
            col: 0,
            row: rowSelectRange[1]
          }
        };
      }
    }

    if (this.options?.colHighlight !== false && !isSameRange(this.colHeaderRange, colHeaderRange)) {
      this.colHeaderRange && this.table.arrangeCustomCellStyle({ range: this.colHeaderRange }, undefined);
      colHeaderRange && this.table.arrangeCustomCellStyle({ range: colHeaderRange }, 'col-highlight');
      this.colHeaderRange = colHeaderRange;
    }

    if (this.options?.rowHighlight !== false && !isSameRange(this.rowHeaderRange, rowHeaderRange)) {
      this.rowHeaderRange && this.table.arrangeCustomCellStyle({ range: this.rowHeaderRange }, undefined);
      rowHeaderRange && this.table.arrangeCustomCellStyle({ range: rowHeaderRange }, 'row-highlight');
      this.rowHeaderRange = rowHeaderRange;
    }
  }
}

function isSameRange(a: CellRange | undefined, b: CellRange | undefined) {
  if (a === undefined && b === undefined) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  return (
    a.start.col === b.start.col && a.start.row === b.start.row && a.end.col === b.end.col && a.end.row === b.end.row
  );
}
