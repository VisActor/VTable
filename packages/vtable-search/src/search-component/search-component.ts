import type * as VTable from '@visactor/vtable';
import { isValid } from '@visactor/vutils';

type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;

export type QueryResult = {
  queryStr: string;
  results: {
    col: number;
    row: number;
    value: string;
  }[];
};

export type SearchComponentOption = {
  table: IVTable;
  autoJump?: boolean;
  skipHeader?: boolean;
  highlightCellStyle?: VTable.TYPES.CellStyle;
  focuseHighlightCellStyle?: VTable.TYPES.CellStyle;
  queryMethod?: (queryStr: string, value: string, option?: { col: number; row: number; table: IVTable }) => boolean;
  callback?: (queryResult: QueryResult, table: IVTable) => void;
};

const defalutHightlightCellStyle: Partial<VTable.TYPES.CellStyle> = {
  bgColor: 'rgba(255, 255, 0, 0.2)'
};

const defalutFocusHightlightCellStyle: Partial<VTable.TYPES.CellStyle> = {
  bgColor: 'rgba(255, 155, 0, 0.2)'
};

function defalultQueryMethod(queryStr: string, value: string) {
  return isValid(queryStr) && isValid(value) && value.toString().includes(queryStr);
}

export class SearchComponent {
  table: IVTable;
  skipHeader: boolean;
  autoJump: boolean;
  highlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  focuseHighlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  queryMethod: (queryStr: string, value: string, option: { col: number; row: number; table: IVTable }) => boolean;
  callback?: (queryResult: QueryResult, table: IVTable) => void;

  queryStr: string;
  queryResult: {
    col: number;
    row: number;
    range?: VTable.TYPES.CellRange;
    value: string;
  }[];
  currentIndex: number;

  constructor(option: SearchComponentOption) {
    this.table = option.table;
    this.autoJump = option.autoJump || false;
    this.skipHeader = option.skipHeader || false;
    this.highlightCellStyle = option.highlightCellStyle || defalutHightlightCellStyle;
    this.focuseHighlightCellStyle = option.focuseHighlightCellStyle || defalutFocusHightlightCellStyle;
    this.queryMethod = option.queryMethod || defalultQueryMethod;
    this.callback = option.callback;

    this.table.registerCustomCellStyle('__search_component_highlight', this.highlightCellStyle as any);
    this.table.registerCustomCellStyle('__search_component_focuse', this.focuseHighlightCellStyle as any);
  }

  search(str: string) {
    this.clear();
    this.queryStr = str;

    if (!str) {
      return {
        index: 0,
        results: this.queryResult
      };
    }

    for (let row = 0; row < this.table.rowCount; row++) {
      for (let col = 0; col < this.table.colCount; col++) {
        if (this.skipHeader && this.table.isHeader(col, row)) {
          continue;
        }
        const value = this.table.getCellValue(col, row);
        if (this.queryMethod(this.queryStr, value, { col, row, table: this.table })) {
          // deal merge cell
          const mergeCell = this.table.getCellRange(col, row);
          if (mergeCell.start.col !== mergeCell.end.col || mergeCell.start.row !== mergeCell.end.row) {
            // find is cell already in queryResult
            let isIn = false;
            for (let i = this.queryResult.length - 1; i >= 0; i--) {
              if (this.queryResult[i].col === mergeCell.start.col && this.queryResult[i].row === mergeCell.start.row) {
                isIn = true;
                break;
              }
            }
            if (!isIn) {
              this.queryResult.push({
                col: mergeCell.start.col,
                row: mergeCell.start.row,
                range: mergeCell,
                value
              });
            }
          } else {
            this.queryResult.push({
              col,
              row,
              value
            });
          }
        }
      }
    }

    this.updateCellStyle();

    if (this.callback) {
      this.callback(
        {
          queryStr: this.queryStr,
          results: this.queryResult
        },
        this.table
      );
    }

    if (this.autoJump) {
      return this.next();
    }
    return {
      index: 0,
      results: this.queryResult
    };
  }

  updateCellStyle(highlight: boolean = true) {
    if (!this.queryResult) {
      return;
    }
    if (!this.table.hasCustomCellStyle('__search_component_highlight')) {
      this.table.registerCustomCellStyle('__search_component_highlight', this.highlightCellStyle as any);
    }
    if (!this.table.hasCustomCellStyle('__search_component_focuse')) {
      this.table.registerCustomCellStyle('__search_component_focuse', this.focuseHighlightCellStyle as any);
    }
    for (let i = 0; i < this.queryResult.length; i++) {
      const { col, row, range } = this.queryResult[i];
      if (range) {
        this.table.arrangeCustomCellStyle(
          {
            range
          },
          highlight ? '__search_component_highlight' : null
        );
      } else {
        this.table.arrangeCustomCellStyle(
          {
            col,
            row
          },
          highlight ? '__search_component_highlight' : null
        );
      }
    }
  }

  next() {
    if (!this.queryResult.length) {
      return {
        index: 0,
        results: this.queryResult
      };
    }
    if (this.currentIndex !== -1) {
      // reset last focus
      const { col, row, range } = this.queryResult[this.currentIndex];
      if (range) {
        this.table.arrangeCustomCellStyle(
          {
            range
          },
          '__search_component_highlight'
        );
      } else {
        this.table.arrangeCustomCellStyle(
          {
            col,
            row
          },
          '__search_component_highlight'
        );
      }
    }
    this.currentIndex++;
    if (this.currentIndex >= this.queryResult.length) {
      this.currentIndex = 0;
    }
    const { col, row, range } = this.queryResult[this.currentIndex];
    // this.table.arrangeCustomCellStyle({ col, row }, '__search_component_focuse');
    if (range) {
      this.table.arrangeCustomCellStyle(
        {
          range
        },
        '__search_component_focuse'
      );
    } else {
      this.table.arrangeCustomCellStyle(
        {
          col,
          row
        },
        '__search_component_focuse'
      );
    }

    this.jumpToCell(col, row);

    return {
      index: this.currentIndex,
      results: this.queryResult
    };
  }

  prev() {
    if (!this.queryResult.length) {
      return {
        index: 0,
        results: this.queryResult
      };
    }
    if (this.currentIndex !== -1) {
      // reset last focus
      // this.table.arrangeCustomCellStyle(
      //   {
      //     col: this.queryResult[this.currentIndex].col,
      //     row: this.queryResult[this.currentIndex].row
      //   },
      //   '__search_component_highlight'
      // );
      const { col, row, range } = this.queryResult[this.currentIndex];
      if (range) {
        this.table.arrangeCustomCellStyle(
          {
            range
          },
          '__search_component_highlight'
        );
      } else {
        this.table.arrangeCustomCellStyle(
          {
            col,
            row
          },
          '__search_component_highlight'
        );
      }
    }
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.queryResult.length - 1;
    }
    const { col, row, range } = this.queryResult[this.currentIndex];
    // this.table.arrangeCustomCellStyle({ col, row }, '__search_component_focuse');
    if (range) {
      this.table.arrangeCustomCellStyle(
        {
          range
        },
        '__search_component_focuse'
      );
    } else {
      this.table.arrangeCustomCellStyle(
        {
          col,
          row
        },
        '__search_component_focuse'
      );
    }

    this.jumpToCell(col, row);

    return {
      index: this.currentIndex,
      results: this.queryResult
    };
  }

  jumpToCell(col: number, row: number) {
    // if focus cell out of screen, jump to cell
    const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
    const { colStart, colEnd } = this.table.getBodyVisibleColRange();
    if (row <= rowStart || row >= rowEnd || col <= colStart || col >= colEnd) {
      this.table.scrollToCell({ col, row });
    }
  }

  clear() {
    // reset highlight cell style
    this.updateCellStyle(null);
    this.queryStr = '';
    this.queryResult = [];
    this.currentIndex = -1;
  }
}
