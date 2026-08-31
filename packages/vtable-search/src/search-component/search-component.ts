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
type SearchCellPosition =
  | { col: number; row: number }
  | {
      range: VTable.TYPES.CellRange;
    };

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
  private resultTableMap = new WeakMap<object, IVTable>();
  private resultTreeMap = new WeakMap<object, boolean>();

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

  private getSearchTables(): IVTable[] {
    const tables: IVTable[] = this.isTableAvailable(this.table) ? [this.table] : [];
    const subTableInstances = (this.table as any).internalProps?.subTableInstances;
    if (subTableInstances && typeof subTableInstances.forEach === 'function') {
      subTableInstances.forEach((subTable: IVTable) => {
        if (subTable && subTable !== this.table && this.isTableAvailable(subTable)) {
          tables.push(subTable);
        }
      });
    }
    return tables;
  }

  private isTableAvailable(table: IVTable | undefined): table is IVTable {
    return !!table && !(table as any).isReleased && !!(table as any).scenegraph;
  }

  private getResultTable(resultItem: typeof this.queryResult[number]): IVTable | undefined {
    const table = this.resultTableMap.get(resultItem as object);
    if (table) {
      return this.isTableAvailable(table) ? table : undefined;
    }
    return this.isTableAvailable(this.table) ? this.table : undefined;
  }

  private getResultTables(): IVTable[] {
    const activeTables = new Set<IVTable>(this.getSearchTables());
    activeTables.add(this.table);
    const tables = new Set<IVTable>();
    activeTables.forEach(table => {
      if (this.isTableAvailable(table)) {
        tables.add(table);
      }
    });
    this.queryResult?.forEach(resultItem => {
      const table = this.resultTableMap.get(resultItem as object);
      if (table && activeTables.has(table) && this.isTableAvailable(table)) {
        tables.add(table);
      }
    });
    return Array.from(tables);
  }

  private pruneUnavailableResults(): void {
    if (!this.queryResult?.length) {
      return;
    }
    const activeTables = new Set<IVTable>(this.getSearchTables());
    activeTables.add(this.table);
    const availableResults = this.queryResult.filter(resultItem => {
      const table = this.resultTableMap.get(resultItem as object) || this.table;
      return activeTables.has(table) && this.isTableAvailable(table);
    });
    if (availableResults.length === this.queryResult.length) {
      return;
    }
    this.queryResult = availableResults;
    if (!this.queryResult.length) {
      this.currentIndex = -1;
    } else if (this.currentIndex >= this.queryResult.length) {
      this.currentIndex = this.queryResult.length - 1;
    }
  }

  private isTreeResult(resultItem: typeof this.queryResult[number]): boolean {
    return this.resultTreeMap.get(resultItem as object) ?? Array.isArray(resultItem.indexNumber);
  }

  private addQueryResult(resultItem: typeof this.queryResult[number], table: IVTable, isTree = false): void {
    this.queryResult.push(resultItem);
    this.resultTableMap.set(resultItem as object, table);
    this.resultTreeMap.set(resultItem as object, isTree);
  }

  private getResultCellPosition(resultItem: typeof this.queryResult[number]): SearchCellPosition | undefined {
    if (this.isTreeResult(resultItem)) {
      return this.getVisibleTreeCell(resultItem);
    }
    if (resultItem.range) {
      return {
        range: resultItem.range
      };
    }
    if (typeof resultItem.col === 'number' && typeof resultItem.row === 'number') {
      return {
        col: resultItem.col,
        row: resultItem.row
      };
    }
    return undefined;
  }

  private getResultCell(resultItem: typeof this.queryResult[number]): { col: number; row: number } | undefined {
    const position = this.getResultCellPosition(resultItem);
    if (!position) {
      return undefined;
    }
    return 'range' in position ? position.range.start : position;
  }

  private getCellPositionRange(position: any): VTable.TYPES.CellRange | undefined {
    if (position?.range) {
      return position.range;
    }
    if (typeof position?.col === 'number' && typeof position?.row === 'number') {
      return {
        start: { col: position.col, row: position.row },
        end: { col: position.col, row: position.row }
      };
    }
    return undefined;
  }

  private getCellPositionKey(position: any): string | undefined {
    const range = this.getCellPositionRange(position);
    if (!range) {
      return undefined;
    }
    return `${range.start.col}:${range.start.row}:${range.end.col}:${range.end.row}`;
  }

  private refreshCellStyle(table: IVTable, position: SearchCellPosition | any): void {
    const range = this.getCellPositionRange(position);
    if (!range) {
      return;
    }
    for (let col = range.start.col; col <= range.end.col; col++) {
      for (let row = range.start.row; row <= range.end.row; row++) {
        table.scenegraph.updateCellContent(col, row, true);
      }
    }
  }

  private rebuildCustomCellStyleArrangement(plugin: any, arrangements: any[]): void {
    if (!plugin) {
      return;
    }
    const currentArrangements = plugin.customCellStyleArrangement;
    if (Array.isArray(currentArrangements)) {
      currentArrangements.length = 0;
      currentArrangements.push(...arrangements);
    } else {
      plugin.customCellStyleArrangement = arrangements;
    }
    const rebuildIndex = plugin._rebuildCustomCellStyleArrangementIndex;
    if (typeof rebuildIndex === 'function') {
      rebuildIndex.call(plugin);
    }
  }

  private setSearchCellStyle(
    resultItem: typeof this.queryResult[number],
    customStyleId: string | undefined = HighlightStyleId
  ): void {
    const table = this.getResultTable(resultItem);
    if (!this.isTableAvailable(table)) {
      return;
    }
    const position = this.getResultCellPosition(resultItem);
    if (!position) {
      return;
    }
    const plugin = (table as any).customCellStylePlugin;
    if (!plugin) {
      return;
    }
    const searchStyleIds = new Set([HighlightStyleId, FocusHighlightStyleId]);
    const arrangements = Array.from(plugin.customCellStyleArrangement || []);
    const positionKey = this.getCellPositionKey(position);
    const retainedArrangements = arrangements.filter((item: any) => {
      return !(searchStyleIds.has(item?.customStyleId) && this.getCellPositionKey(item?.cellPosition) === positionKey);
    });
    if (customStyleId) {
      retainedArrangements.push({
        cellPosition: position,
        customStyleId
      });
    }
    this.rebuildCustomCellStyleArrangement(plugin, retainedArrangements);
    this.refreshCellStyle(table, position);
    table.scenegraph.updateNextFrame();
  }

  private searchTable(table: IVTable): void {
    for (let row = 0; row < table.rowCount; row++) {
      for (let col = 0; col < table.colCount; col++) {
        if (this.skipHeader && table.isHeader(col, row)) {
          continue;
        }
        const value = table.getCellValue(col, row);
        if (this.queryMethod(this.queryStr, value, { col, row, table })) {
          const mergeCell = table.getCellRange(col, row);
          if (mergeCell.start.col !== mergeCell.end.col || mergeCell.start.row !== mergeCell.end.row) {
            let isIn = false;
            for (let i = this.queryResult.length - 1; i >= 0; i--) {
              const resultTable = this.getResultTable(this.queryResult[i]);
              if (
                resultTable === table &&
                !this.isTreeResult(this.queryResult[i]) &&
                this.queryResult[i].col === mergeCell.start.col &&
                this.queryResult[i].row === mergeCell.start.row
              ) {
                isIn = true;
                break;
              }
            }
            if (!isIn) {
              this.addQueryResult(
                {
                  col: mergeCell.start.col,
                  row: mergeCell.start.row,
                  range: mergeCell,
                  value
                },
                table
              );
            }
          } else {
            this.addQueryResult(
              {
                col,
                row,
                value
              },
              table
            );
          }
        }
      }
    }
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

  private clearRenderedCellStyles(targetTable: IVTable = this.table) {
    const plugin = (targetTable as any).customCellStylePlugin;
    if (!plugin || !this.isTableAvailable(targetTable)) {
      return;
    }
    const positionsToRefresh = new Map<string, SearchCellPosition>();
    const arrangements = Array.from((plugin as any)?.customCellStyleArrangement || []);
    const searchStyleIds = new Set([HighlightStyleId, FocusHighlightStyleId]);
    const searchArrangements = arrangements.filter((item: any) => searchStyleIds.has(item?.customStyleId));

    if (!searchArrangements.length) {
      return;
    }

    searchArrangements.forEach((item: any) => {
      const cellPosition = item?.cellPosition;
      const key = this.getCellPositionKey(cellPosition);
      if (key) {
        positionsToRefresh.set(key, cellPosition);
      }
    });

    const retainedArrangements = arrangements.filter((item: any) => !searchStyleIds.has(item?.customStyleId));
    if (retainedArrangements.length === 0) {
      plugin.clearCustomCellStyleArrangement();
      this.rebuildCustomCellStyleArrangement(plugin, []);
    } else {
      this.rebuildCustomCellStyleArrangement(plugin, retainedArrangements);
    }

    positionsToRefresh.forEach(position => this.refreshCellStyle(targetTable, position));
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
              this.addQueryResult(
                {
                  indexNumber: currentPath,
                  col,
                  value: value?.toString?.() ?? String(value)
                },
                this.table,
                true
              );
            }
          });

          // 兼容旧用法：如果用户自定义 treeQueryMethod 命中但字段级别未命中，则至少高亮树列。
          if (
            !hitAnyField &&
            this.treeQueryMethod &&
            this.treeQueryMethod(this.queryStr, item, this.fieldsToSearch, { table: this.table })
          ) {
            this.addQueryResult(
              {
                indexNumber: currentPath,
                col: treeCol
              },
              this.table,
              true
            );
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
        if (!this.isTreeResult(r)) {
          return true;
        }
        const key = `${(r.indexNumber || []).join('.')}:${r.col ?? ''}`;
        if (dedup.has(key)) {
          return false;
        }
        dedup.add(key);
        return true;
      });

      this.getSearchTables()
        .filter(table => table !== this.table)
        .forEach(table => this.searchTable(table));

      this.currentIndex = this.queryResult.length > 0 && this.isTreeResult(this.queryResult[0]) ? 0 : -1;

      if (this.currentIndex === 0) {
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

      if (this.autoJump && this.currentIndex === -1 && this.queryResult.length > 0) {
        return this.next();
      }

      return {
        index: this.currentIndex >= 0 ? this.currentIndex : 0,
        results: this.queryResult
      };
    }
    this.getSearchTables().forEach(table => this.searchTable(table));
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
    this.setSearchCellStyle(resultItem, highlight ? customStyleId : undefined);
  }

  updateCellStyle(highlight: boolean = true) {
    this.pruneUnavailableResults();
    if (!highlight) {
      this.getResultTables().forEach(table => {
        this.clearRenderedCellStyles(table);
        table.scenegraph.updateNextFrame();
      });
      return;
    }
    if (!this.queryResult) {
      return;
    }

    const resultTables = this.getResultTables();
    resultTables.forEach(table => {
      if (!table.hasCustomCellStyle(HighlightStyleId)) {
        table.registerCustomCellStyle(HighlightStyleId, this.highlightCellStyle as any);
      }
      if (!table.hasCustomCellStyle(FocusHighlightStyleId)) {
        table.registerCustomCellStyle(FocusHighlightStyleId, this.focusHighlightCellStyle as any);
      }
      this.clearRenderedCellStyles(table);
    });

    for (let i = 0; i < this.queryResult.length; i++) {
      const resultItem = this.queryResult[i];
      const table = this.getResultTable(resultItem);
      const position = this.getResultCellPosition(resultItem);
      if (!table || !position) {
        continue;
      }
      table.customCellStylePlugin.addCustomCellStyleArrangement(position as any, HighlightStyleId);
      this.refreshCellStyle(table, position);
    }

    if (this.currentIndex >= 0 && this.currentIndex < this.queryResult.length) {
      const resultItem = this.queryResult[this.currentIndex];
      const table = this.getResultTable(resultItem);
      const position = this.getResultCellPosition(resultItem);
      if (table && position) {
        table.customCellStylePlugin.addCustomCellStyleArrangement(position as any, FocusHighlightStyleId);
        this.refreshCellStyle(table, position);
      }
    }
    resultTables.forEach(table => {
      this.rebuildCustomCellStyleArrangement(
        (table as any).customCellStylePlugin,
        Array.from((table as any).customCellStylePlugin?.customCellStyleArrangement || [])
      );
      table.scenegraph.updateNextFrame();
    });
  }

  private jumpToResult(resultItem: typeof this.queryResult[number]): void {
    if (this.isTreeResult(resultItem)) {
      this.jumpToCell({ IndexNumber: resultItem.indexNumber, col: resultItem.col });
    } else {
      const table = this.getResultTable(resultItem);
      if (table) {
        this.jumpToCell({ col: resultItem.col, row: resultItem.row }, table);
      }
    }
  }

  next() {
    this.pruneUnavailableResults();
    if (!this.queryResult.length) {
      return {
        index: 0,
        results: this.queryResult
      };
    }
    const previousIndex = this.currentIndex;
    this.currentIndex++;
    if (this.currentIndex >= this.queryResult.length) {
      this.currentIndex = 0;
    }
    const previousResult = previousIndex >= 0 ? this.queryResult[previousIndex] : undefined;
    const currentResult = this.queryResult[this.currentIndex];

    if (this.isTreeResult(currentResult) || (previousResult && this.isTreeResult(previousResult))) {
      this.jumpToResult(currentResult);
      this.updateCellStyle();
    } else {
      if (previousResult) {
        // reset last focus
        this.arrangeCustomCellStyle(previousResult);
      }
      this.arrangeCustomCellStyle(currentResult, true, FocusHighlightStyleId);
      this.jumpToResult(currentResult);
    }

    return {
      index: this.currentIndex,
      results: this.queryResult
    };
  }

  prev() {
    this.pruneUnavailableResults();
    if (!this.queryResult.length) {
      return {
        index: 0,
        results: this.queryResult
      };
    }

    const previousIndex = this.currentIndex;
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.queryResult.length - 1;
    }
    const previousResult = previousIndex >= 0 ? this.queryResult[previousIndex] : undefined;
    const currentResult = this.queryResult[this.currentIndex];

    if (this.isTreeResult(currentResult) || (previousResult && this.isTreeResult(previousResult))) {
      this.jumpToResult(currentResult);
      this.updateCellStyle();
    } else {
      if (previousResult) {
        this.arrangeCustomCellStyle(previousResult);
      }
      this.arrangeCustomCellStyle(currentResult, true, FocusHighlightStyleId);
      this.jumpToResult(currentResult);
    }

    return {
      index: this.currentIndex,
      results: this.queryResult
    };
  }

  private getSubTableBodyRowIndex(targetTable: IVTable): number | undefined {
    const subTableInstances = (this.table as any).internalProps?.subTableInstances;
    if (!subTableInstances || typeof subTableInstances.forEach !== 'function') {
      return undefined;
    }
    let bodyRowIndex: number | undefined;
    subTableInstances.forEach((subTable: IVTable, rowIndex: number) => {
      if (subTable === targetTable) {
        bodyRowIndex = rowIndex;
      }
    });
    return bodyRowIndex;
  }

  jumpToCell(params: { col?: number; row?: number; IndexNumber?: number[] }, targetTable: IVTable = this.table) {
    if (Array.isArray(params.IndexNumber)) {
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
      if (targetTable !== this.table) {
        const bodyRowIndex = this.getSubTableBodyRowIndex(targetTable);
        if (bodyRowIndex !== undefined) {
          const parentRow = bodyRowIndex + ((this.table as any).columnHeaderLevelCount || 0);
          const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
          const isParentRowVisible = parentRow >= rowStart && parentRow <= rowEnd;
          if (!isParentRowVisible) {
            this.table.scrollToCell({ col: 0, row: parentRow });
          }
        }
      }
      const { rowStart, rowEnd } = targetTable.getBodyVisibleRowRange();
      const { colStart, colEnd } = targetTable.getBodyVisibleColRange();

      // 检查单元格是否在表格可视范围内
      const isInTableView = !(row <= rowStart || row >= rowEnd || col <= colStart || col >= colEnd);

      // 根据配置决定是否滚动表格
      if (!isInTableView) {
        targetTable.scrollToCell({ col, row });
      }

      // 根据配置决定是否滚动页面
      if (this.enableViewportScroll) {
        scrollVTableCellIntoView(targetTable, { row, col });
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
    this.resultTableMap = new WeakMap<object, IVTable>();
    this.resultTreeMap = new WeakMap<object, boolean>();
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
