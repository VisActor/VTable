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

  private getHeaderOffset(): number {
    let offset = 0;
    while (this.table.isHeader(0, offset)) {
      offset++;
    }
    return offset;
  }

  private getHeaderCellAddressByField(field: string): { col: number; row: number } | undefined {
    // PivotTable/ListTable share internal layoutMap API but it's not exposed on the public type.
    const layoutMap = (this.table as any).internalProps?.layoutMap;
    return layoutMap?.getHeaderCellAddressByField?.(field);
  }

  private getTreeCol(): number {
    const treeColumn = (this.table as any)?.options?.columns?.find((c: any) => c?.tree);
    const field = treeColumn?.field;
    if (typeof field === 'string' && field) {
      const addr = this.getHeaderCellAddressByField(field);
      if (addr && typeof addr.col === 'number') {
        return addr.col;
      }
    }
    // Fallback to previous behavior.
    return this.treeIndex;
  }

  private getVisibleTreeCell(resultItem: typeof this.queryResult[number]): { col: number; row: number } | undefined {
    if (!resultItem.indexNumber) {
      return undefined;
    }
    const rawIndex = this.getBodyRowIndexByRecordIndex(resultItem.indexNumber);
    if (rawIndex < 0) {
      return undefined;
    }
    return {
      col: typeof resultItem.col === 'number' ? resultItem.col : this.getTreeCol(),
      row: rawIndex + this.getHeaderOffset()
    };
  }

  private clearRenderedCellStyles() {
    const plugin = this.table.customCellStylePlugin;
    const cellsToRefresh: { col: number; row: number }[] = [];
    const arrangements = Array.from((plugin as any)?.customCellStyleArrangement || []);

    arrangements.forEach((item: any) => {
      const cellPosition = item?.cellPosition;
      if (typeof cellPosition?.col === 'number' && typeof cellPosition?.row === 'number') {
        cellsToRefresh.push({
          col: cellPosition.col,
          row: cellPosition.row
        });
      }
    });

    plugin.clearCustomCellStyleArrangement();
    cellsToRefresh.forEach(({ col, row }) => {
      this.table.scenegraph.updateCellContent(col, row, true);
    });
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
      const treeCol = this.getTreeCol();
      const walk = (nodes: any[], path: number[]) => {
        nodes.forEach((item: any, idx: number) => {
          const currentPath = [...path, idx]; // 当前节点的完整路径

          // 为了做到“单元格级别高亮”，优先按字段匹配并映射到具体列。
          const searchFields =
            Array.isArray(this.fieldsToSearch) && this.fieldsToSearch.length > 0
              ? this.fieldsToSearch
              : Object.keys(item);

          let hitAnyField = false;
          searchFields.forEach(field => {
            const value = item?.[field];
            if (!isValid(value)) {
              return;
            }
            const col = this.getHeaderCellAddressByField(field)?.col ?? treeCol;
            // row 在树形场景下要在展开后才能准确计算，这里传 0 仅用于自定义 queryMethod 的兼容参数。
            if (this.queryMethod(this.queryStr, value, { col, row: 0, table: this.table })) {
              hitAnyField = true;
              this.queryResult.push({
                indexNumber: currentPath,
                col,
                value: value?.toString?.() ?? String(value)
              });
            }
          });

          // 兼容旧用法：如果用户自定义 treeQueryMethod 命中但字段级别未命中，则至少高亮树列。
          if (
            !hitAnyField &&
            this.treeQueryMethod &&
            this.treeQueryMethod(this.queryStr, item, this.fieldsToSearch, { table: this.table })
          ) {
            this.queryResult.push({
              indexNumber: currentPath,
              col: treeCol
            });
          }

          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            walk(item.children, currentPath);
          }
        });
      };

      walk(this.table.records, []);
      // 同一节点同一列可能被多次命中（例如 fieldsToSearch 未限制且字段值重复），做一次简单去重
      const dedup = new Set<string>();
      this.queryResult = this.queryResult.filter(r => {
        const key = `${(r.indexNumber || []).join('.')}:${r.col ?? ''}`;
        if (dedup.has(key)) {
          return false;
        }
        dedup.add(key);
        return true;
      });

      this.currentIndex = this.queryResult.length > 0 ? 0 : -1;

      if (this.queryResult.length > 0) {
        this.jumpToCell({ IndexNumber: this.queryResult[0].indexNumber, col: this.queryResult[0].col ?? treeCol });
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

      return {
        index: this.currentIndex >= 0 ? this.currentIndex : 0,
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
      this.clearRenderedCellStyles();
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

    this.clearRenderedCellStyles();

    if (this.isTree) {
      if (!this.queryResult.length) {
        this.table.scenegraph.updateNextFrame();
        return;
      }

      // 先为所有命中节点打普通高亮
      for (let i = 0; i < this.queryResult.length; i++) {
        const cell = this.getVisibleTreeCell(this.queryResult[i]);
        if (!cell) {
          continue;
        }
        this.table.customCellStylePlugin.addCustomCellStyleArrangement(
          {
            col: cell.col,
            row: cell.row
          },
          HighlightStyleId
        );
        this.table.scenegraph.updateCellContent(cell.col, cell.row, true);
      }

      // 再为当前索引打焦点高亮
      if (this.currentIndex >= 0 && this.currentIndex < this.queryResult.length) {
        const cell = this.getVisibleTreeCell(this.queryResult[this.currentIndex]);
        if (cell) {
          this.table.customCellStylePlugin.addCustomCellStyleArrangement(
            {
              col: cell.col,
              row: cell.row
            },
            FocusHighlightStyleId
          );
          this.table.scenegraph.updateCellContent(cell.col, cell.row, true);
        }
      }

      this.table.scenegraph.updateNextFrame();
    } else {
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
      this.currentIndex++;
      if (this.currentIndex >= this.queryResult.length) {
        this.currentIndex = 0;
      }
      const { indexNumber, col } = this.queryResult[this.currentIndex];
      this.jumpToCell({ IndexNumber: indexNumber, col });
      this.updateCellStyle();
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
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.queryResult.length - 1;
      }

      const { indexNumber, col } = this.queryResult[this.currentIndex];
      this.jumpToCell({ IndexNumber: indexNumber, col });
      this.updateCellStyle();
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
      const targetCol = typeof params.col === 'number' ? params.col : this.getTreeCol();
      this.table.scrollToCell({ row: finalRow, col: targetCol }, this.scrollOption);

      // 根据配置决定是否滚动页面
      if (this.enableViewportScroll) {
        scrollVTableCellIntoView(this.table, { row: finalRow, col: targetCol });
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
