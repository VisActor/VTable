import type { CellRange } from '@visactor/vtable/es/ts-types';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { BaseTableAPI, plugins } from '@visactor/vtable';
interface IHeaderHighlightPluginOptions {
  rowHighlight?: boolean;
  colHighlight?: boolean;
  colHighlightBGColor?: string;
  colHighlightColor?: string;
  rowHighlightBGColor?: string;
  rowHighlightColor?: string;
}

export class HighlightHeaderPlugin implements plugins.IVTablePlugin {
  id = 'highlight-header';
  name = 'Highlight Header';
  type: 'layout' = 'layout';
  runTime = [
    TABLE_EVENT_TYPE.INITIALIZED,
    TABLE_EVENT_TYPE.SELECTED_CLEAR,
    TABLE_EVENT_TYPE.SELECTED_CELL,
    TABLE_EVENT_TYPE.MOUSEMOVE_TABLE
  ];
  table: BaseTableAPI;
  pluginOptions: IHeaderHighlightPluginOptions;
  colHeaderRanges: CellRange[] = [];
  rowHeaderRanges: CellRange[] = [];
  constructor(pluginOptions: IHeaderHighlightPluginOptions) {
    this.pluginOptions = pluginOptions;
  }
  run(...args: any[]) {
    // const eventArgs = args[0];
    const runTime = args[1];
    const table: BaseTableAPI = args[2];
    this.table = table;
    if (runTime === TABLE_EVENT_TYPE.SELECTED_CLEAR) {
      this.clearHighlight();
    } else if (runTime === TABLE_EVENT_TYPE.SELECTED_CELL) {
      this.updateHighlight();
    } else if (runTime === TABLE_EVENT_TYPE.MOUSEMOVE_TABLE) {
      this.updateHighlight();
    } else if (runTime === TABLE_EVENT_TYPE.INITIALIZED) {
      this.registerStyle();
    }
  }

  registerStyle() {
    this.table.registerCustomCellStyle('col-highlight', {
      bgColor: this.pluginOptions?.colHighlightBGColor ?? '#82b2f5',
      color: this.pluginOptions?.colHighlightColor ?? '#FFF'
    });

    this.table.registerCustomCellStyle('row-highlight', {
      bgColor: this.pluginOptions?.rowHighlightBGColor ?? '#82b2f5',
      color: this.pluginOptions?.rowHighlightColor ?? 'yellow'
    });
  }

  clearHighlight() {
    if (this.colHeaderRanges) {
      this.colHeaderRanges.forEach(range => {
        this.table.arrangeCustomCellStyle({ range }, undefined);
      });
    }
    if (this.rowHeaderRanges) {
      this.rowHeaderRanges.forEach(range => {
        this.table.arrangeCustomCellStyle({ range }, undefined);
      });
    }
    // clear range
    this.colHeaderRanges = [];
    this.rowHeaderRanges = [];
  }

  updateHighlight() {
    if (this.pluginOptions?.colHighlight === false && this.pluginOptions?.rowHighlight === false) {
      return;
    }
    const selectRanges = this.table.getSelectedCellRanges();
    if (selectRanges.length < 2) {
      this.clearHighlight();
      // return;
    }
    for (let i = 0; i < selectRanges.length; i++) {
      const selectRange = selectRanges[i];
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

      if (
        this.pluginOptions?.colHighlight !== false &&
        !this.colHeaderRanges.find(range => isSameRange(range, colHeaderRange))
      ) {
        // this.colHeaderRanges && this.table.arrangeCustomCellStyle({ range: this.colHeaderRanges }, undefined);
        colHeaderRange && this.table.arrangeCustomCellStyle({ range: colHeaderRange }, 'col-highlight');
        this.colHeaderRanges.push(colHeaderRange);
      }

      if (
        this.pluginOptions?.rowHighlight !== false &&
        !this.rowHeaderRanges.find(range => isSameRange(range, rowHeaderRange))
      ) {
        // this.rowHeaderRanges && this.table.arrangeCustomCellStyle({ range: this.rowHeaderRanges }, undefined);
        rowHeaderRange && this.table.arrangeCustomCellStyle({ range: rowHeaderRange }, 'row-highlight');
        this.rowHeaderRanges.push(rowHeaderRange);
      }
    }
  }
  release() {
    this.rowHeaderRanges = [];
    this.colHeaderRanges = [];
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
