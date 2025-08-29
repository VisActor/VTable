import type * as VTable from '@visactor/vtable';
import type { ITableAnimationOption } from '@visactor/vtable/src/ts-types';
import type { EasingType } from '@visactor/vtable/src/vrender';
import { isValid } from '@visactor/vutils';
type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;

export type QueryResult = {
  queryStr: string;
  results: {
    col?: number;
    row?: number;
    value?: string;
    indexNumber?: number[];
  }[];
};

export type SearchComponentOption = {
  table: IVTable;
  autoJump?: boolean;
  skipHeader?: boolean;
  highlightCellStyle?: VTable.TYPES.CellStyle;
  focuseHighlightCellStyle?: VTable.TYPES.CellStyle;
  queryMethod?: (queryStr: string, value: string, option?: { col: number; row: number; table: IVTable }) => boolean;
  treeQueryMethod?: (queryStr: string, node: any, fieldsToSearch?: string[], option?: { table: IVTable }) => boolean;
  fieldsToSearch?: string[];
  scrollOption?: ITableAnimationOption;
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
function defalultTreeQueryMethod(queryStr: string, node: any, fieldsToSearch?: string[]) {
  if (!isValid(queryStr)) {
    return false;
  }

  // 如果没有传 fieldsToSearch，则用 node 的全部 key
  const searchFields = Array.isArray(fieldsToSearch) && fieldsToSearch.length > 0 ? fieldsToSearch : Object.keys(node);

  return searchFields.some(field => isValid(node?.[field]) && node[field].toString().includes(queryStr));
}
export class SearchComponent {
  table: IVTable;
  skipHeader: boolean;
  autoJump: boolean;
  highlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  focuseHighlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  queryMethod: (queryStr: string, value: string, option: { col: number; row: number; table: IVTable }) => boolean;
  treeQueryMethod: (queryStr: string, node: any, fieldsToSearch?: string[], option?: { table: IVTable }) => boolean;
  fieldsToSearch: string[];

  callback?: (queryResult: QueryResult, table: IVTable) => void;

  queryStr: string;
  queryResult: {
    col?: number;
    row?: number;
    range?: VTable.TYPES.CellRange;
    value?: string;
    indexNumber?: number[];
  }[];

  currentIndex: number;
  isTree: boolean;
  treeIndex: number;
  scrollOption: ITableAnimationOption;

  constructor(option: SearchComponentOption) {
    this.table = option.table;
    this.autoJump = option.autoJump || false;
    this.skipHeader = option.skipHeader || false;
    this.highlightCellStyle = option.highlightCellStyle || defalutHightlightCellStyle;
    this.focuseHighlightCellStyle = option.focuseHighlightCellStyle || defalutFocusHightlightCellStyle;
    this.queryMethod = option.queryMethod || defalultQueryMethod;
    this.treeQueryMethod = option.treeQueryMethod || defalultTreeQueryMethod;
    this.fieldsToSearch = option.fieldsToSearch || [];
    this.isTree = false;
    this.treeIndex = 0;
    this.callback = option.callback;
    this.scrollOption =
      option.scrollOption || ({ duration: 900, easing: 'quartIn' as EasingType } as ITableAnimationOption);
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
    this.isTree = this.table.options.columns.some((item: any) => item.tree);
    this.treeIndex = this.isTree ? this.table.options.columns.findIndex((item: any) => item.tree) : 0;
    if (this.isTree) {
      // 如果传入单一节点也能处理
      const colEnd = this.table.colCount;
      const walk = (nodes: any[], path: number[]) => {
        nodes.forEach((item: any, idx: number) => {
          const currentPath = [...path, idx]; // 当前节点的完整路径

          // 保持你的 treeQueryMethod 调用方式（this 上下文来自定义环境）
          if (this.treeQueryMethod(this.queryStr, item, this.fieldsToSearch, { table: this.table })) {
            this.queryResult.push({
              indexNumber: currentPath,
              range: {
                start: { row: null, col: 0 },
                end: { row: null, col: colEnd }
              }
            });
          }

          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            walk(item.children, currentPath);
          }
        });
      };

      walk(this.table.records, []);
      if (this.queryResult.length > 0) {
        this.jumpToCell({ IndexNumber: this.queryResult[0].indexNumber });
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
      this.updateCellStyle(true);

      // if (this.autoJump) {
      //   return this.next();
      // }
      this.currentIndex = 0;

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
    this.updateCellStyle(true);

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
    if (highlight == null) {
      if (this.queryResult?.length) {
        this.queryResult.forEach(({ range }) => {
          if (range) {
            this.table.arrangeCustomCellStyle(
              { range },
              '' // 或者 null，看API是否允许
            );
          }
        });
      }
      return;
    }
    if (!this.queryResult) {
      return;
    }

    if (!this.table.hasCustomCellStyle('__search_component_highlight')) {
      this.table.registerCustomCellStyle('__search_component_highlight', this.highlightCellStyle as any);
    }
    if (!this.table.hasCustomCellStyle('__search_component_focuse')) {
      this.table.registerCustomCellStyle('__search_component_focuse', this.focuseHighlightCellStyle as any);
    }
    if (this.isTree) {
      const { range, indexNumber } = this.queryResult[0];

      let i = 0;

      // 如果是表头就往下偏移
      while (this.table.isHeader(0, i)) {
        i++;
      }
      const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;
      range.start.row = row;
      range.end.row = row;

      this.table.arrangeCustomCellStyle(
        {
          range
        },
        highlight ? '__search_component_focuse' : null
      );
    } else {
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
  }

  next() {
    if (!this.queryResult.length) {
      return {
        index: 0,
        results: this.queryResult
      };
    }
    if (this.isTree) {
      if (this.currentIndex !== -1) {
        const { range, indexNumber } = this.queryResult[this.currentIndex];

        if (range) {
          let i = 0;

          // 如果是表头就往下偏移
          while (this.table.isHeader(0, i)) {
            i++;
          }
          const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;
          range.start.row = row;
          range.end.row = row;
          this.table.arrangeCustomCellStyle(
            {
              range
            },
            '__search_component_highlight'
          );
        }
      }

      this.currentIndex++;
      if (this.currentIndex >= this.queryResult.length) {
        this.currentIndex = 0;
      }
      const { range, indexNumber } = this.queryResult[this.currentIndex];
      this.jumpToCell({ IndexNumber: indexNumber });

      if (range) {
        let i = 0;

        // 如果是表头就往下偏移
        while (this.table.isHeader(0, i)) {
          i++;
        }
        const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;
        range.start.row = row;
        range.end.row = row;
        this.table.arrangeCustomCellStyle(
          {
            range
          },
          '__search_component_focuse'
        );
      }
    } else {
      if (this.currentIndex !== -1) {
        const { col, row, range } = this.queryResult[this.currentIndex];

        // reset last focus
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

      this.jumpToCell({ col, row });
    }

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

    if (this.isTree) {
      // 先取消当前高亮
      if (this.currentIndex !== -1) {
        const { range, indexNumber } = this.queryResult[this.currentIndex];
        if (range) {
          let i = 0;
          while (this.table.isHeader(0, i)) {
            i++;
          }
          const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;
          range.start.row = row;
          range.end.row = row;
          this.table.arrangeCustomCellStyle({ range }, '__search_component_highlight');
        }
      }

      // 索引向前
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.queryResult.length - 1;
      }

      // 焦点样式
      const { range, indexNumber } = this.queryResult[this.currentIndex];
      this.jumpToCell({ IndexNumber: indexNumber });

      if (range) {
        let i = 0;
        while (this.table.isHeader(0, i)) {
          i++;
        }
        const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;
        range.start.row = row;
        range.end.row = row;
        this.table.arrangeCustomCellStyle({ range }, '__search_component_focuse');
      }
    } else {
      // 普通表格处理
      if (this.currentIndex !== -1) {
        const { col, row, range } = this.queryResult[this.currentIndex];
        if (range) {
          this.table.arrangeCustomCellStyle({ range }, '__search_component_highlight');
        } else {
          this.table.arrangeCustomCellStyle({ col, row }, '__search_component_highlight');
        }
      }

      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.queryResult.length - 1;
      }

      const { col, row, range } = this.queryResult[this.currentIndex];
      if (range) {
        this.table.arrangeCustomCellStyle({ range }, '__search_component_focuse');
      } else {
        this.table.arrangeCustomCellStyle({ col, row }, '__search_component_focuse');
      }

      this.jumpToCell({ col, row });
    }

    return {
      index: this.currentIndex,
      results: this.queryResult
    };
  }

  jumpToCell(params: { col?: number; row?: number; IndexNumber?: number[] }) {
    if (this.isTree) {
      const { IndexNumber } = params;
      const indexNumbers = [...IndexNumber];

      const tmp = [...indexNumbers];
      let tmpNumber = 0;
      let i = 0;

      while (tmpNumber < tmp.length - 1) {
        tmpNumber++;
        const indexNumber = indexNumbers.slice(0, tmpNumber);

        // 如果是表头就往下偏移
        while (this.table.isHeader(0, i)) {
          i++;
        }
        const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;

        const hierarchyState = this.table.getHierarchyState(this.treeIndex, row);

        if (hierarchyState !== 'expand') {
          this.table.toggleHierarchyState(this.treeIndex, row);
        }
      }
      this.table.scrollToRow(this.getBodyRowIndexByRecordIndex(indexNumbers) + i, this.scrollOption);
    } else {
      const { col, row } = params;
      // if focus cell out of screen, jump to cell
      const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
      const { colStart, colEnd } = this.table.getBodyVisibleColRange();
      if (row <= rowStart || row >= rowEnd || col <= colStart || col >= colEnd) {
        this.table.scrollToCell({ col, row });
      }
    }
  }
  getBodyRowIndexByRecordIndex(index: number | number[]): number {
    if (Array.isArray(index) && index.length === 1) {
      index = index[0];
    }
    return this.table.dataSource.getTableIndex(index);
  }
  clear() {
    // reset highlight cell style
    this.updateCellStyle(null);
    this.queryStr = '';
    this.queryResult = [];
    this.currentIndex = -1;
  }
}
