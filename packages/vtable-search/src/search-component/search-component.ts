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
  /**
   * @deprecated use focusHighlightCellStyle instead
   */
  focuseHighlightCellStyle?: VTable.TYPES.CellStyle;
  focusHighlightCellStyle?: VTable.TYPES.CellStyle;
  queryMethod?: (queryStr: string, value: string, option?: { col: number; row: number; table: IVTable }) => boolean;
  treeQueryMethod?: (queryStr: string, node: any, fieldsToSearch?: string[], option?: { table: IVTable }) => boolean;
  fieldsToSearch?: string[];
  scrollOption?: ITableAnimationOption;
  /**
   * 当开启时，搜索结果会自动滚动到视口范围内
   * @since 1.22.4
   */
  enableViewportScroll?: boolean;
  callback?: (queryResult: QueryResult, table: IVTable) => void;
};

const HighlightStyleId = '__search_component_highlight';
const FocusHighlightStyleId = '__search_component_focus';

const defaultHighlightCellStyle: Partial<VTable.TYPES.CellStyle> = {
  bgColor: 'rgba(255, 255, 0, 0.2)'
};

const defaultFocusHighlightCellStyle: Partial<VTable.TYPES.CellStyle> = {
  bgColor: 'rgba(255, 155, 0, 0.2)'
};

function defaultQueryMethod(queryStr: string, value: string) {
  return isValid(queryStr) && isValid(value) && value.toString().includes(queryStr);
}
function defaultTreeQueryMethod(queryStr: string, node: any, fieldsToSearch?: string[]) {
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
  focusHighlightCellStyle: Partial<VTable.TYPES.CellStyle>;
  queryMethod: (queryStr: string, value: string, option: { col: number; row: number; table: IVTable }) => boolean;
  treeQueryMethod: (queryStr: string, node: any, fieldsToSearch?: string[], option?: { table: IVTable }) => boolean;
  fieldsToSearch: string[];
  enableViewportScroll?: boolean;
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
    this.highlightCellStyle = option.highlightCellStyle || defaultHighlightCellStyle;
    this.focusHighlightCellStyle =
      // 兼容兜底处理，修复拼写错误的问题
      option.focusHighlightCellStyle || option.focuseHighlightCellStyle || defaultFocusHighlightCellStyle;
    this.queryMethod = option.queryMethod || defaultQueryMethod;
    this.treeQueryMethod = option.treeQueryMethod || defaultTreeQueryMethod;
    this.fieldsToSearch = option.fieldsToSearch || [];
    this.isTree = false;
    this.treeIndex = 0;
    this.callback = option.callback;
    this.scrollOption =
      option.scrollOption || ({ duration: 900, easing: 'quartIn' as EasingType } as ITableAnimationOption);
    this.enableViewportScroll = option.enableViewportScroll || false;
    this.table.registerCustomCellStyle(HighlightStyleId, this.highlightCellStyle as any);
    this.table.registerCustomCellStyle(FocusHighlightStyleId, this.focusHighlightCellStyle as any);
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
      this.updateCellStyle();

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

  /**
   * @description: 为查询结果项设置自定义单元格样式
   * @param {(typeof this.queryResult)[number]} resultItem 查询结果项
   * @param {boolean} highlight 是否高亮
   * @param {string} customStyleId 自定义样式ID
   */
  arrangeCustomCellStyle(
    resultItem: typeof this.queryResult[number],
    highlight: boolean = true,
    customStyleId: string = HighlightStyleId
  ) {
    const { col, row, range } = resultItem;
    this.table.arrangeCustomCellStyle(
      range
        ? { range }
        : {
            row,
            col
          },
      highlight ? customStyleId : null
    );
  }

  updateCellStyle(highlight: boolean = true) {
    if (!highlight) {
      // (this.queryResult || []).forEach(resultItem => {
      //   this.arrangeCustomCellStyle(resultItem, highlight);
      // });
      this.table.customCellStylePlugin.clearCustomCellStyleArrangement();
      (this.queryResult || []).forEach(resultItem => {
        this.table.scenegraph.updateCellContent(resultItem.col, resultItem.row);
      });
      this.table.scenegraph.updateNextFrame();
      return;
    }
    if (!this.queryResult) {
      return;
    }

    if (!this.table.hasCustomCellStyle(HighlightStyleId)) {
      this.table.registerCustomCellStyle(HighlightStyleId, this.highlightCellStyle as any);
    }
    if (!this.table.hasCustomCellStyle(FocusHighlightStyleId)) {
      this.table.registerCustomCellStyle(FocusHighlightStyleId, this.focusHighlightCellStyle as any);
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

      this.arrangeCustomCellStyle(
        {
          range
        },
        highlight,
        FocusHighlightStyleId
      );
    } else {
      // for (let i = 0; i < this.queryResult.length; i++) {
      //   this.arrangeCustomCellStyle(this.queryResult[i], highlight);
      // }
      for (let i = 0; i < this.queryResult.length; i++) {
        this.table.customCellStylePlugin.addCustomCellStyleArrangement(
          {
            col: this.queryResult[i].col,
            row: this.queryResult[i].row
          },
          HighlightStyleId
        );
        this.table.scenegraph.updateCellContent(this.queryResult[i].col, this.queryResult[i].row, true);
      }
      this.table.scenegraph.updateNextFrame();
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
          this.arrangeCustomCellStyle({ range });
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
        this.arrangeCustomCellStyle(
          {
            range
          },
          true,
          FocusHighlightStyleId
        );
      }
    } else {
      if (this.currentIndex !== -1) {
        // reset last focus
        this.arrangeCustomCellStyle(this.queryResult[this.currentIndex]);
      }
      this.currentIndex++;
      if (this.currentIndex >= this.queryResult.length) {
        this.currentIndex = 0;
      }
      const { col, row } = this.queryResult[this.currentIndex];

      this.arrangeCustomCellStyle(this.queryResult[this.currentIndex], true, FocusHighlightStyleId);

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
          this.arrangeCustomCellStyle({ range });
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
        this.arrangeCustomCellStyle({ range }, true, FocusHighlightStyleId);
      }
    } else {
      // 普通表格处理
      if (this.currentIndex !== -1) {
        this.arrangeCustomCellStyle(this.queryResult[this.currentIndex]);
      }

      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.queryResult.length - 1;
      }

      const { col, row } = this.queryResult[this.currentIndex];
      this.arrangeCustomCellStyle(this.queryResult[this.currentIndex], true, FocusHighlightStyleId);
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

      // 展开树形结构的父节点
      while (tmpNumber < tmp.length - 1) {
        tmpNumber++;
        const indexNumber = indexNumbers.slice(0, tmpNumber);

        // 跳过表头行
        while (this.table.isHeader(0, i)) {
          i++;
        }
        const row = this.getBodyRowIndexByRecordIndex(indexNumber) + i;

        const hierarchyState = this.table.getHierarchyState(this.treeIndex, row);
        if (hierarchyState !== 'expand') {
          this.table.toggleHierarchyState(this.treeIndex, row);
        }
      }

      const finalRow = this.getBodyRowIndexByRecordIndex(indexNumbers) + i;

      // 根据配置决定是否滚动表格
      this.table.scrollToRow(finalRow, this.scrollOption);

      // 根据配置决定是否滚动页面
      if (this.enableViewportScroll) {
        scrollVTableCellIntoView(this.table, { row: finalRow, col: this.treeIndex });
      }
    } else {
      const { col, row } = params;
      const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
      const { colStart, colEnd } = this.table.getBodyVisibleColRange();

      // 检查单元格是否在表格可视范围内
      const isInTableView = !(row <= rowStart || row >= rowEnd || col <= colStart || col >= colEnd);

      // 根据配置决定是否滚动表格
      if (!isInTableView) {
        this.table.scrollToCell({ col, row });
      }

      // 根据配置决定是否滚动页面
      if (this.enableViewportScroll) {
        scrollVTableCellIntoView(this.table, { row, col });
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
    this.updateCellStyle(false);
    this.queryStr = '';
    this.queryResult = [];
    this.currentIndex = -1;
  }
}

function scrollVTableCellIntoView(table: IVTable, cellInfo: { row: number; col: number }): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  const tableEl = table.getElement?.() || table.container;
  if (!tableEl) {
    return;
  }

  // 获取单元格在表格中的位置信息
  const cellRect = table.getCellRect(cellInfo.col, cellInfo.row);
  if (!cellRect) {
    return;
  }

  // 查找最近的可滚动父容器
  let scrollContainer: Element | null = tableEl.parentElement;
  while (scrollContainer) {
    const computedStyle = getComputedStyle(scrollContainer);
    const hasScroll = /(auto|scroll|overlay)/.test(computedStyle.overflowY);
    const canScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;

    if (hasScroll && canScroll) {
      break;
    }

    // 向上查找父元素，包括 Shadow DOM 情况
    scrollContainer = scrollContainer.parentElement || (scrollContainer.getRootNode?.() as ShadowRoot)?.host || null;
  }

  // 如果没找到可滚动容器，使用 document
  if (!scrollContainer) {
    scrollContainer = document.scrollingElement || document.documentElement;
  }

  const scrollContainerEl = scrollContainer as HTMLElement;

  // 计算单元格在滚动容器中的绝对位置
  const tableRect = tableEl.getBoundingClientRect();
  const containerRect = scrollContainerEl.getBoundingClientRect();

  // 表格相对于滚动容器的位置
  const tableOffsetTop = tableRect.top - containerRect.top + scrollContainerEl.scrollTop;

  // 单元格在滚动容器中的绝对位置
  const cellTop = tableOffsetTop + cellRect.top;
  const cellBottom = cellTop + cellRect.height;
  const containerHeight = scrollContainerEl.clientHeight;
  const scrollTop = scrollContainerEl.scrollTop;

  // 检查单元格是否完全可见
  const isFullyVisible = cellTop >= scrollTop && cellBottom <= scrollTop + containerHeight;

  if (!isFullyVisible) {
    // 计算新的滚动位置
    let newScrollTop: number;

    if (cellTop < scrollTop) {
      // 单元格在上方，滚动到单元格顶部
      newScrollTop = cellTop;
    } else {
      // 单元格在下方，滚动到单元格底部对齐容器底部
      newScrollTop = cellBottom - containerHeight;
    }

    // 确保滚动位置不小于 0
    scrollContainerEl.scrollTop = Math.max(0, newScrollTop);
  }
}
