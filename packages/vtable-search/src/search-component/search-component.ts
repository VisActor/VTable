import type * as VTable from '@visactor/vtable';

type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;

type QueryResult = {
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
  queryMethod?: (queryStr: string, value: string) => boolean;
  callback?: (queryResult: QueryResult, table: IVTable) => void;
};

const defalutHightlightCellStyle: Partial<VTable.TYPES.CellStyle> = {
  bgColor: 'rgba(255, 255, 0, 0.2)'
};

const defalutFocusHightlightCellStyle: Partial<VTable.TYPES.CellStyle> = {
  bgColor: 'rgba(255, 155, 0, 0.2)'
};

function defalultQueryMethod(queryStr: string, value: string) {
  return value.includes(queryStr);
}

export class SearchComponent {
  table: IVTable;
  skipHeader: boolean;
  autoJump: boolean;
  highlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  focuseHighlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  queryMethod: (queryStr: string, value: string) => boolean;
  callback?: (queryResult: QueryResult, table: IVTable) => void;

  queryStr: string;
  queryResult: {
    col: number;
    row: number;
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
  }

  search(str: string) {
    this.clear();
    this.queryStr = str;

    for (let col = 0; col < this.table.colCount; col++) {
      for (let row = 0; row < this.table.rowCount; row++) {
        if (this.skipHeader && this.table.isHeader(col, row)) {
          continue;
        }
        const value = this.table.getCellValue(col, row);
        if (this.queryMethod(this.queryStr, value)) {
          this.queryResult.push({
            col,
            row,
            value
          });
        }
      }
    }

    this.updateCellStyle();

    if (this.autoJump) {
      this.next();
    }

    if (this.callback) {
      this.callback(
        {
          queryStr: this.queryStr,
          results: this.queryResult
        },
        this.table
      );
    }
  }

  updateCellStyle() {
    for (let i = 0; i < this.queryResult.length; i++) {
      const { col, row } = this.queryResult[i];
      this.table.customUpdateCellStyle(col, row, this.highlightCellStyle);
    }
  }

  next() {
    if (!this.queryResult.length) {
      return;
    }
    if (this.currentIndex !== -1) {
      // reset last focus
      this.table.customUpdateCellStyle(
        this.queryResult[this.currentIndex].col,
        this.queryResult[this.currentIndex].row,
        this.highlightCellStyle
      );
    }
    this.currentIndex++;
    if (this.currentIndex >= this.queryResult.length) {
      this.currentIndex = 0;
    }
    const { col, row } = this.queryResult[this.currentIndex];
    this.table.customUpdateCellStyle(col, row, this.focuseHighlightCellStyle);
  }

  prev() {
    if (!this.queryResult.length) {
      return;
    }
    if (this.currentIndex !== -1) {
      // reset last focus
      this.table.customUpdateCellStyle(
        this.queryResult[this.currentIndex].col,
        this.queryResult[this.currentIndex].row,
        this.highlightCellStyle
      );
    }
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.queryResult.length - 1;
    }
    const { col, row } = this.queryResult[this.currentIndex];
    this.table.customUpdateCellStyle(col, row, this.focuseHighlightCellStyle);
  }

  clear() {
    this.queryStr = '';
    this.queryResult = [];
    this.currentIndex = -1;
  }
}
