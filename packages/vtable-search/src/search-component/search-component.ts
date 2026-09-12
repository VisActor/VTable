import type * as VTable from '@visactor/vtable';
import type { ITableAnimationOption } from '@visactor/vtable/src/ts-types';
import type { EasingType } from '@visactor/vtable/src/vrender';
import { isValid } from '@visactor/vutils';
type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;

export type QueryResultItem = {
  col?: number;
  row?: number;
  range?: VTable.TYPES.CellRange;
  value?: string;
  indexNumber?: number[];
  /** The table that owns this match. */
  table?: IVTable;
  /** A stable table instance identifier when the table exposes one. */
  tableId?: string;
  /** The owning master body row for a master-detail result. */
  parentRow?: number;
};

export type QueryResult = {
  queryStr: string;
  results: QueryResultItem[];
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
const searchStyleIds = new Set([HighlightStyleId, FocusHighlightStyleId]);
type SearchCellPosition =
  | { col: number; row: number }
  | {
      range: VTable.TYPES.CellRange;
    };

type SearchTableEntry = {
  table: IVTable;
  parentRow?: number;
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
  queryResult: QueryResultItem[];

  currentIndex: number;
  isTree: boolean;
  treeIndex: number;
  scrollOption: ITableAnimationOption;
  private resultTableMap = new WeakMap<object, IVTable>();
  private resultTreeMap = new WeakMap<object, boolean>();
  private resultParentRowMap = new WeakMap<object, number>();
  private resultTables = new Set<IVTable>();
  private tableIdMap = new WeakMap<object, string>();
  private searchStyleArrangementMap = new WeakMap<object, Map<string, any>>();
  private searchStyleArrangementArrays = new WeakMap<object, any[]>();
  private nextTableId = 1;

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

  private getSearchTableEntries(): SearchTableEntry[] {
    if (!this.isTableAvailable(this.table) || this.isMasterTableReleasing()) {
      return [];
    }
    const entries: SearchTableEntry[] = [{ table: this.table }];
    const seenTables = new Set<IVTable>(entries.map(entry => entry.table));
    const subTableInstances = (this.table as any).internalProps?.subTableInstances;
    if (subTableInstances && typeof subTableInstances.forEach === 'function') {
      subTableInstances.forEach((subTable: IVTable, parentRow: number) => {
        if (subTable && !seenTables.has(subTable) && this.isTableAvailable(subTable)) {
          entries.push({ table: subTable, parentRow });
          seenTables.add(subTable);
        }
      });
    }
    return entries;
  }

  private getSearchTables(): IVTable[] {
    return this.getSearchTableEntries().map(entry => entry.table);
  }

  private isTableAvailable(table: IVTable | undefined): table is IVTable {
    return !!table && !(table as any).isReleased && !this.isMasterTableReleasing(table) && !!(table as any).scenegraph;
  }

  private isMasterTableReleasing(table: IVTable = this.table): boolean {
    const internalProps = (table as any).internalProps;
    if (internalProps?._isReleasing !== true) {
      return false;
    }

    if (table !== this.table) {
      return true;
    }

    const pluginManager = (table as any).pluginManager;
    // The root table can retain this flag after its plugin is removed, so only honor it while the plugin is registered.
    return (
      typeof pluginManager?.getPluginByName === 'function' && !!pluginManager.getPluginByName('Master Detail Plugin')
    );
  }

  private getTableHierarchyType(table: IVTable): string | undefined {
    return (
      (table as any).rowHierarchyType ??
      (table as any).dataSource?.rowHierarchyType ??
      (table as any).options?.rowHierarchyType ??
      (table as any).internalProps?.layoutMap?.rowHierarchyType
    );
  }

  private isMasterDetailTable(table: IVTable = this.table): boolean {
    if ((table as any).options?.masterDetail === true || (table as any).internalProps?.masterDetail === true) {
      return true;
    }
    const pluginManager = (table as any).pluginManager;
    if (pluginManager?.getPluginByName?.('Master Detail Plugin')) {
      return true;
    }
    const subTableInstances = (table as any).internalProps?.subTableInstances;
    if (!subTableInstances || typeof subTableInstances.forEach !== 'function') {
      return false;
    }
    if (typeof subTableInstances.size === 'number' && subTableInstances.size > 0) {
      return true;
    }
    if (
      this.getTableHierarchyType(table) === 'grid' &&
      (typeof (table as any).getSubTableByRowIndex === 'function' ||
        typeof (table as any).getAllSubTableInstances === 'function')
    ) {
      return true;
    }
    return (
      typeof (table as any).getSubTableByRowIndex === 'function' ||
      typeof (table as any).getAllSubTableInstances === 'function'
    );
  }

  private isTreeTable(table: IVTable): boolean {
    if (this.isMasterDetailTable(table)) {
      return false;
    }
    const hierarchyType = this.getTableHierarchyType(table);
    if (hierarchyType) {
      return hierarchyType === 'tree' || hierarchyType === 'grid-tree';
    }
    return !!(table as any).options?.columns?.some((item: any) => item?.tree);
  }

  private getResultTable(resultItem: (typeof this.queryResult)[number]): IVTable | undefined {
    const table = resultItem.table ?? this.resultTableMap.get(resultItem as object);
    if (table) {
      return this.isTableAvailable(table) ? table : undefined;
    }
    return this.isTableAvailable(this.table) ? this.table : undefined;
  }

  private getResultParentRow(resultItem: (typeof this.queryResult)[number]): number | undefined {
    if (typeof resultItem.parentRow === 'number') {
      return resultItem.parentRow;
    }
    return this.resultParentRowMap.get(resultItem as object);
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
    this.resultTables.forEach(table => {
      if (this.isTableAvailable(table)) {
        tables.add(table);
      }
    });
    return Array.from(tables);
  }

  private getActiveSearchTableSet(): Set<IVTable> {
    const activeTables = new Set<IVTable>(this.getSearchTables());
    activeTables.add(this.table);
    return activeTables;
  }

  private isResultAvailable(resultItem: (typeof this.queryResult)[number], activeTables?: Set<IVTable>): boolean {
    const table = this.getResultTable(resultItem);
    const tables = activeTables || this.getActiveSearchTableSet();
    return !!table && tables.has(table) && this.isTableAvailable(table);
  }

  private pruneUnavailableResults(): void {
    if (!this.queryResult?.length) {
      return;
    }
    const activeTables = this.getActiveSearchTableSet();
    let hasUnavailableTable = false;
    for (const table of this.resultTables) {
      if (!activeTables.has(table) || !this.isTableAvailable(table)) {
        hasUnavailableTable = true;
        break;
      }
    }
    if (!hasUnavailableTable) {
      return;
    }

    const currentResult = this.currentIndex >= 0 ? this.queryResult[this.currentIndex] : undefined;
    const availableResults: QueryResultItem[] = [];
    for (const resultItem of this.queryResult) {
      if (this.isResultAvailable(resultItem, activeTables)) {
        availableResults.push(resultItem);
      }
    }
    if (availableResults.length === this.queryResult.length) {
      return;
    }
    this.queryResult = availableResults;
    if (!this.queryResult.length) {
      this.currentIndex = -1;
    } else if (currentResult) {
      const currentResultIndex = this.queryResult.indexOf(currentResult);
      this.currentIndex =
        currentResultIndex >= 0
          ? currentResultIndex
          : Math.min(Math.max(this.currentIndex, -1), this.queryResult.length - 1);
    } else if (this.currentIndex >= this.queryResult.length) {
      this.currentIndex = this.queryResult.length - 1;
    }
    this.resultTables = new Set<IVTable>();
    for (const resultItem of this.queryResult) {
      const table = this.getResultTable(resultItem);
      if (table) {
        this.resultTables.add(table);
      }
    }
  }

  private isTreeResult(resultItem: (typeof this.queryResult)[number]): boolean {
    return this.resultTreeMap.get(resultItem as object) ?? Array.isArray(resultItem.indexNumber);
  }

  private getTableId(table: IVTable): string {
    const explicitId = (table as any).id;
    if (typeof explicitId === 'string' && explicitId) {
      return explicitId;
    }
    const existingId = this.tableIdMap.get(table as object);
    if (existingId) {
      return existingId;
    }
    const generatedId = `search-table-${this.nextTableId++}`;
    this.tableIdMap.set(table as object, generatedId);
    return generatedId;
  }

  private addQueryResult(
    resultItem: (typeof this.queryResult)[number],
    table: IVTable,
    isTree = false,
    parentRow?: number
  ): void {
    resultItem.table = table;
    resultItem.tableId = this.getTableId(table);
    if (typeof parentRow === 'number') {
      resultItem.parentRow = parentRow;
      this.resultParentRowMap.set(resultItem as object, parentRow);
    }
    this.queryResult.push(resultItem);
    this.resultTableMap.set(resultItem as object, table);
    this.resultTreeMap.set(resultItem as object, isTree);
    this.resultTables.add(table);
  }

  private getResultCellPosition(resultItem: (typeof this.queryResult)[number]): SearchCellPosition | undefined {
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

  private getResultCell(resultItem: (typeof this.queryResult)[number]): { col: number; row: number } | undefined {
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

  private resetSearchStyleArrangementCache(table: IVTable): void {
    this.searchStyleArrangementMap.delete(table as object);
    this.searchStyleArrangementArrays.delete(table as object);
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

  private arrangeSearchCellStyle(table: IVTable, position: SearchCellPosition, customStyleId: string): void {
    const plugin = (table as any).customCellStylePlugin;
    const arrangements = plugin?.customCellStyleArrangement;
    const positionKey = this.getCellPositionKey(position);
    if (plugin && Array.isArray(arrangements) && positionKey) {
      let tableStyles = this.searchStyleArrangementMap.get(table as object);
      const cachedArrangements = this.searchStyleArrangementArrays.get(table as object);
      if (cachedArrangements !== arrangements) {
        tableStyles?.clear();
        this.searchStyleArrangementArrays.set(table as object, arrangements);
      }
      if (!tableStyles) {
        tableStyles = new Map<string, any>();
        this.searchStyleArrangementMap.set(table as object, tableStyles);
      }
      const existing = tableStyles.get(positionKey);
      if (existing && (existing.customStyleId == null || searchStyleIds.has(existing.customStyleId))) {
        existing.customStyleId = customStyleId;
        return;
      }
      const existingSearchArrangement = arrangements.find(
        (item: any) =>
          searchStyleIds.has(item?.customStyleId) && this.getCellPositionKey(item.cellPosition) === positionKey
      );
      if (existingSearchArrangement) {
        existingSearchArrangement.customStyleId = customStyleId;
        tableStyles.set(positionKey, existingSearchArrangement);
        return;
      }
      if (typeof plugin.addCustomCellStyleArrangement === 'function') {
        plugin.addCustomCellStyleArrangement(position as any, customStyleId);
        const currentArrangements = plugin.customCellStyleArrangement;
        const lastArrangement = Array.isArray(currentArrangements)
          ? currentArrangements[currentArrangements.length - 1]
          : undefined;
        const addedArrangement =
          lastArrangement &&
          searchStyleIds.has(lastArrangement.customStyleId) &&
          this.getCellPositionKey(lastArrangement.cellPosition) === positionKey
            ? lastArrangement
            : undefined;
        if (addedArrangement) {
          tableStyles.set(positionKey, addedArrangement);
        }
        return;
      }
      const addedArrangement = { cellPosition: position, customStyleId };
      arrangements.push(addedArrangement);
      tableStyles.set(positionKey, addedArrangement);
      return;
    }
    const arrange = (table as any).arrangeCustomCellStyle;
    if (typeof arrange === 'function') {
      arrange.call(table, position as any, customStyleId as any, true);
    } else if (typeof plugin?.arrangeCustomCellStyle === 'function') {
      plugin.arrangeCustomCellStyle(position as any, customStyleId as any, true);
    }
  }

  private clearSearchCellStyleAtPosition(table: IVTable, position: SearchCellPosition): void {
    const plugin = (table as any).customCellStylePlugin;
    const arrangements = plugin?.customCellStyleArrangement;
    const positionKey = this.getCellPositionKey(position);
    if (!Array.isArray(arrangements) || !positionKey) {
      return;
    }
    for (const item of arrangements) {
      if (searchStyleIds.has(item?.customStyleId) && this.getCellPositionKey(item.cellPosition) === positionKey) {
        item.customStyleId = null;
      }
    }
  }

  private clearSearchCellStyles(table: IVTable): Map<string, SearchCellPosition> {
    const plugin = (table as any).customCellStylePlugin;
    const positionsToRefresh = new Map<string, SearchCellPosition>();
    this.resetSearchStyleArrangementCache(table);
    const arrangements = plugin?.customCellStyleArrangement;
    if (!Array.isArray(arrangements)) {
      return positionsToRefresh;
    }
    const retainedArrangements: any[] = [];
    let hasSearchArrangement = false;
    for (const item of arrangements) {
      if (!searchStyleIds.has(item?.customStyleId)) {
        retainedArrangements.push(item);
        continue;
      }
      hasSearchArrangement = true;
      const position = item.cellPosition as SearchCellPosition;
      const key = this.getCellPositionKey(position);
      if (key) {
        positionsToRefresh.set(key, position);
      }
    }
    if (!hasSearchArrangement) {
      return positionsToRefresh;
    }

    if (retainedArrangements.length === 0 && typeof plugin.clearCustomCellStyleArrangement === 'function') {
      plugin.clearCustomCellStyleArrangement();
    } else if (typeof plugin.updateCustomCell === 'function' && Array.isArray(plugin.customCellStyle)) {
      plugin.updateCustomCell([...plugin.customCellStyle], retainedArrangements);
    } else {
      arrangements.splice(0, arrangements.length, ...retainedArrangements);
      plugin?._rebuildCustomCellStyleArrangementIndex?.call(plugin);
    }
    return positionsToRefresh;
  }

  private setSearchCellStyle(
    resultItem: (typeof this.queryResult)[number],
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
    if (customStyleId) {
      this.arrangeSearchCellStyle(table, position, customStyleId);
    } else {
      this.clearSearchCellStyleAtPosition(table, position);
    }
    this.refreshCellStyle(table, position);
    table.scenegraph.updateNextFrame();
  }

  private searchTable(table: IVTable, parentRow?: number): void {
    if (this.isTreeTable(table)) {
      this.searchTreeTable(table, parentRow);
      return;
    }

    const seenPositions = new Set<string>();
    const rowCount = typeof (table as any).rowCount === 'number' ? (table as any).rowCount : 0;
    const colCount = typeof (table as any).colCount === 'number' ? (table as any).colCount : 0;
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        if (this.skipHeader && table.isHeader(col, row)) {
          continue;
        }
        const value = table.getCellValue(col, row);
        if (!this.queryMethod(this.queryStr, value, { col, row, table })) {
          continue;
        }
        const mergeCell = table.getCellRange(col, row);
        const isMerged = mergeCell.start.col !== mergeCell.end.col || mergeCell.start.row !== mergeCell.end.row;
        const position = isMerged ? { range: mergeCell } : { col, row };
        const positionKey = this.getCellPositionKey(position);
        if (positionKey && seenPositions.has(positionKey)) {
          continue;
        }
        if (positionKey) {
          seenPositions.add(positionKey);
        }
        this.addQueryResult(
          isMerged
            ? {
                col: mergeCell.start.col,
                row: mergeCell.start.row,
                range: mergeCell,
                value
              }
            : { col, row, value },
          table,
          false,
          parentRow
        );
      }
    }
  }

  private getTableRecords(table: IVTable): any[] {
    const records =
      (table as any).records ?? (table as any).dataSource?.records ?? (table as any).internalProps?.records;
    return Array.isArray(records) ? records : [];
  }

  private searchTreeTable(table: IVTable, parentRow?: number): void {
    const records = this.getTableRecords(table);
    const treeCol = this.getTreeCol(table);
    const childrenKey = (table as any).options?.childrenKey || 'children';
    const seenResults = new Set<string>();

    const addTreeResult = (path: number[], col: number, value?: unknown) => {
      const key = `${path.join('.')}:${col}`;
      if (seenResults.has(key)) {
        return;
      }
      seenResults.add(key);
      this.addQueryResult(
        {
          indexNumber: path,
          col,
          value: isValid(value) ? value?.toString?.() ?? String(value) : undefined
        },
        table,
        true,
        parentRow
      );
    };

    const walk = (nodes: any[], path: number[]) => {
      nodes.forEach((item: any, idx: number) => {
        if (!item || typeof item !== 'object') {
          return;
        }
        const currentPath = [...path, idx];
        const searchFields =
          Array.isArray(this.fieldsToSearch) && this.fieldsToSearch.length > 0
            ? this.fieldsToSearch
            : Object.keys(item);
        let hitAnyField = false;
        searchFields.forEach(field => {
          const value = item[field];
          if (!isValid(value)) {
            return;
          }
          const col = this.getHeaderCellAddressByField(table, field)?.col ?? treeCol;
          if (this.queryMethod(this.queryStr, value, { col, row: 0, table })) {
            hitAnyField = true;
            addTreeResult(currentPath, col, value);
          }
        });

        if (
          !hitAnyField &&
          this.treeQueryMethod &&
          this.treeQueryMethod(this.queryStr, item, this.fieldsToSearch, { table })
        ) {
          addTreeResult(currentPath, treeCol);
        }

        const children = item[childrenKey];
        if (Array.isArray(children) && children.length > 0) {
          walk(children, currentPath);
        }
      });
    };

    walk(records, []);
  }

  private getHeaderOffset(table: IVTable): number {
    const configuredOffset = (table as any).columnHeaderLevelCount;
    if (typeof configuredOffset === 'number' && configuredOffset >= 0) {
      return configuredOffset;
    }
    let offset = 0;
    const rowCount = typeof (table as any).rowCount === 'number' ? (table as any).rowCount : Number.MAX_SAFE_INTEGER;
    while (offset < rowCount && table.isHeader(0, offset)) {
      offset++;
    }
    return offset;
  }

  private getHeaderCellAddressByField(table: IVTable, field: string): { col: number; row: number } | undefined {
    const layoutMap = (table as any).internalProps?.layoutMap;
    const address = layoutMap?.getHeaderCellAddressByField?.(field);
    if (address && typeof address.col === 'number') {
      return address;
    }

    let leafCol = 0;
    let found: { col: number; row: number } | undefined;
    const visitColumns = (columns: any[], depth: number) => {
      columns.forEach(column => {
        if (found) {
          return;
        }
        if (Array.isArray(column?.columns) && column.columns.length > 0) {
          visitColumns(column.columns, depth + 1);
        } else {
          if (column?.field === field) {
            found = { col: leafCol, row: depth };
          }
          leafCol++;
        }
      });
    };
    const columns = (table as any).options?.columns;
    if (Array.isArray(columns)) {
      visitColumns(columns, 0);
    }
    return found;
  }

  private getTreeCol(table: IVTable): number {
    const columns = (table as any)?.options?.columns;
    let treeColumn: any;
    let leafCol = 0;
    let treeLeafCol = 0;
    const visitColumns = (items: any[]) => {
      items.forEach(item => {
        if (Array.isArray(item?.columns) && item.columns.length > 0) {
          visitColumns(item.columns);
        } else {
          if (!treeColumn && item?.tree) {
            treeColumn = item;
            treeLeafCol = leafCol;
          }
          leafCol++;
        }
      });
    };
    if (Array.isArray(columns)) {
      visitColumns(columns);
    }
    const field = treeColumn?.field;
    if (typeof field === 'string' && field) {
      const address = this.getHeaderCellAddressByField(table, field);
      if (address && typeof address.col === 'number') {
        return address.col;
      }
    }
    return treeColumn ? treeLeafCol : 0;
  }

  private getVisibleTreeCell(resultItem: (typeof this.queryResult)[number]): { col: number; row: number } | undefined {
    if (!resultItem.indexNumber) {
      return undefined;
    }
    const table = this.getResultTable(resultItem);
    if (!table) {
      return undefined;
    }
    const rawIndex = this.getBodyRowIndexByRecordIndex(resultItem.indexNumber, table);
    if (rawIndex < 0) {
      return undefined;
    }
    return {
      col: typeof resultItem.col === 'number' ? resultItem.col : this.getTreeCol(table),
      row: rawIndex + this.getHeaderOffset(table)
    };
  }

  private clearRenderedCellStyles(targetTable: IVTable = this.table) {
    if (!this.isTableAvailable(targetTable)) {
      return;
    }
    const positionsToRefresh = this.clearSearchCellStyles(targetTable);
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
    this.isTree = this.isTreeTable(this.table);
    this.treeIndex = this.isTree ? this.getTreeCol(this.table) : 0;
    if (this.isTree) {
      this.searchTreeTable(this.table);
      for (const entry of this.getSearchTableEntries()) {
        if (entry.table !== this.table) {
          this.searchTable(entry.table, entry.parentRow);
        }
      }

      this.currentIndex = this.queryResult.length > 0 && this.isTreeResult(this.queryResult[0]) ? 0 : -1;

      if (this.currentIndex === 0) {
        this.jumpToResult(this.queryResult[0]);
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
    for (const entry of this.getSearchTableEntries()) {
      this.searchTable(entry.table, entry.parentRow);
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
    resultItem: (typeof this.queryResult)[number],
    highlight: boolean = true,
    customStyleId: string = HighlightStyleId
  ) {
    this.setSearchCellStyle(resultItem, highlight ? customStyleId : undefined);
  }

  updateCellStyle(highlight: boolean = true) {
    this.pruneUnavailableResults();
    if (!highlight) {
      this.getResultTables().forEach(table => {
        const positionsToRefresh = this.clearSearchCellStyles(table);
        positionsToRefresh.forEach(position => this.refreshCellStyle(table, position));
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
      const positionsToRefresh = this.clearSearchCellStyles(table);
      positionsToRefresh.forEach(position => this.refreshCellStyle(table, position));
    });

    for (let i = 0; i < this.queryResult.length; i++) {
      const resultItem = this.queryResult[i];
      const table = this.getResultTable(resultItem);
      const position = this.getResultCellPosition(resultItem);
      if (!table || !position || !(table as any).customCellStylePlugin) {
        continue;
      }
      this.arrangeSearchCellStyle(table, position, HighlightStyleId);
      this.refreshCellStyle(table, position);
    }

    if (this.currentIndex >= 0 && this.currentIndex < this.queryResult.length) {
      const resultItem = this.queryResult[this.currentIndex];
      const table = this.getResultTable(resultItem);
      const position = this.getResultCellPosition(resultItem);
      if (table && position && (table as any).customCellStylePlugin) {
        this.arrangeSearchCellStyle(table, position, FocusHighlightStyleId);
        this.refreshCellStyle(table, position);
      }
    }
    resultTables.forEach(table => {
      table.scenegraph.updateNextFrame();
    });
  }

  private jumpToResult(resultItem: (typeof this.queryResult)[number]): void {
    const table = this.getResultTable(resultItem);
    if (!table) {
      return;
    }
    if (this.isTreeResult(resultItem)) {
      this.jumpToCell({ IndexNumber: resultItem.indexNumber, col: resultItem.col }, table);
    } else {
      this.jumpToCell({ col: resultItem.col, row: resultItem.row }, table);
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

    this.jumpToResult(currentResult);
    if (previousResult) {
      this.arrangeCustomCellStyle(previousResult, true, HighlightStyleId);
    }
    this.arrangeCustomCellStyle(currentResult, true, FocusHighlightStyleId);

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

    this.jumpToResult(currentResult);
    if (previousResult) {
      this.arrangeCustomCellStyle(previousResult, true, HighlightStyleId);
    }
    this.arrangeCustomCellStyle(currentResult, true, FocusHighlightStyleId);

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

  private getMasterViewport(targetTable?: IVTable): { top: number; bottom: number } | undefined {
    const masterTable = this.table as any;
    const tableY = typeof masterTable.tableY === 'number' ? masterTable.tableY : 0;
    const viewBoxY = typeof masterTable.options?.viewBox?.y1 === 'number' ? masterTable.options.viewBox.y1 : 0;
    let top = tableY + viewBoxY;
    const height =
      typeof masterTable.tableNoFrameHeight === 'number'
        ? masterTable.tableNoFrameHeight
        : typeof masterTable.getVisibleRect === 'function'
        ? masterTable.getVisibleRect()?.height
        : undefined;
    if (typeof height !== 'number') {
      return undefined;
    }

    let bottom = top + height;
    if (targetTable && targetTable !== this.table) {
      const bodyRowIndex = this.getSubTableBodyRowIndex(targetTable);
      if (bodyRowIndex !== undefined) {
        const headerOffset = this.getHeaderOffset(this.table);
        const rowIndex = bodyRowIndex + headerOffset;
        const frozenRowCount =
          typeof masterTable.frozenRowCount === 'number' ? masterTable.frozenRowCount : headerOffset;
        const bottomFrozenRowCount =
          typeof masterTable.bottomFrozenRowCount === 'number' ? masterTable.bottomFrozenRowCount : 0;
        const rowCount = typeof masterTable.rowCount === 'number' ? masterTable.rowCount : 0;
        const frozenRowsHeight =
          typeof masterTable.getFrozenRowsHeight === 'function' ? masterTable.getFrozenRowsHeight() : 0;
        const bottomFrozenRowsHeight =
          typeof masterTable.getBottomFrozenRowsHeight === 'function' ? masterTable.getBottomFrozenRowsHeight() : 0;
        const isFrozenDataRow = rowIndex >= headerOffset && rowIndex < frozenRowCount;
        const isBottomFrozenDataRow = bottomFrozenRowCount > 0 && rowIndex >= rowCount - bottomFrozenRowCount;

        if (isFrozenDataRow) {
          bottom -= bottomFrozenRowsHeight;
        } else if (!isBottomFrozenDataRow) {
          top += frozenRowsHeight;
          bottom -= bottomFrozenRowsHeight;
        }
      }
    }
    return { top, bottom };
  }

  private getSubTableTargetRect(
    targetTable: IVTable,
    position?: SearchCellPosition
  ): { top: number; bottom: number } | undefined {
    if (position && typeof (targetTable as any).getCellRangeRelativeRect === 'function') {
      const range = this.getCellPositionRange(position);
      if (range) {
        const rect = (targetTable as any).getCellRangeRelativeRect(range);
        if (rect && typeof rect.top === 'number') {
          const bottom =
            typeof rect.bottom === 'number'
              ? rect.bottom
              : typeof rect.height === 'number'
              ? rect.top + rect.height
              : undefined;
          if (typeof bottom === 'number') {
            return { top: rect.top, bottom };
          }
        }
      }
    }
    const viewBox = (targetTable as any).options?.viewBox;
    if (viewBox && typeof viewBox.y1 === 'number' && typeof viewBox.y2 === 'number') {
      return { top: viewBox.y1, bottom: viewBox.y2 };
    }
    return undefined;
  }

  private isSubTableTargetVisible(targetTable: IVTable, position?: SearchCellPosition): boolean {
    const viewport = this.getMasterViewport(targetTable);
    const targetRect = this.getSubTableTargetRect(targetTable, position);
    if (!viewport || !targetRect) {
      return true;
    }
    const targetHeight = targetRect.bottom - targetRect.top;
    if (targetHeight >= viewport.bottom - viewport.top) {
      return targetRect.bottom > viewport.top && targetRect.top < viewport.bottom;
    }
    return targetRect.top >= viewport.top && targetRect.bottom <= viewport.bottom;
  }

  private ensureSubTableParentVisible(targetTable: IVTable, position?: SearchCellPosition): void {
    if (targetTable === this.table) {
      return;
    }
    const bodyRowIndex = this.getSubTableBodyRowIndex(targetTable);
    if (bodyRowIndex === undefined) {
      return;
    }
    const parentRow = bodyRowIndex + this.getHeaderOffset(this.table);
    const { rowStart, rowEnd } = this.table.getBodyVisibleRowRange();
    const isParentRowVisible = parentRow >= rowStart && parentRow <= rowEnd;
    if (!isParentRowVisible || !this.isSubTableTargetVisible(targetTable, position)) {
      this.table.scrollToCell({ row: parentRow });
      this.scrollSubTableTargetIntoMasterViewport(targetTable, position);
    }
  }

  private scrollSubTableTargetIntoMasterViewport(targetTable: IVTable, position?: SearchCellPosition): void {
    const viewport = this.getMasterViewport(targetTable);
    const targetRect = this.getSubTableTargetRect(targetTable, position);
    const masterTable = this.table as any;
    if (!viewport || !targetRect || typeof masterTable.scrollTop !== 'number') {
      return;
    }

    let scrollOffset = 0;
    if (targetRect.top < viewport.top) {
      scrollOffset = targetRect.top - viewport.top;
    } else if (targetRect.bottom > viewport.bottom) {
      scrollOffset = targetRect.bottom - viewport.bottom;
    }
    if (scrollOffset === 0) {
      return;
    }

    masterTable.scrollTop = Math.max(0, masterTable.scrollTop + scrollOffset);
    masterTable.render?.();
  }

  private findVisibleTreeBodyIndex(table: IVTable, targetPath: number[]): number {
    const records = this.getTableRecords(table);
    const treeCol = this.getTreeCol(table);
    const headerOffset = this.getHeaderOffset(table);
    let bodyIndex = 0;
    let foundIndex = -1;
    const walk = (nodes: any[], parentPath: number[]) => {
      nodes.forEach((node: any, index: number) => {
        if (foundIndex !== -1) {
          return;
        }
        const path = [...parentPath, index];
        if (path.length === targetPath.length && path.every((value, pathIndex) => value === targetPath[pathIndex])) {
          foundIndex = bodyIndex;
          return;
        }
        const row = bodyIndex + headerOffset;
        bodyIndex++;
        const children = node?.[(table as any).options?.childrenKey || 'children'];
        const hierarchyState = table.getHierarchyState?.(treeCol, row);
        if (Array.isArray(children) && (hierarchyState === 'expand' || hierarchyState === undefined)) {
          walk(children, path);
        }
      });
    };
    walk(records, []);
    return foundIndex;
  }

  private getTreeBodyIndex(table: IVTable, indexNumbers: number[]): number {
    let bodyIndex = this.getBodyRowIndexByRecordIndex(indexNumbers, table);
    const headerOffset = this.getHeaderOffset(table);
    const treeCol = this.getTreeCol(table);

    for (let depth = 1; depth < indexNumbers.length; depth++) {
      const parentPath = indexNumbers.slice(0, depth);
      bodyIndex = this.getBodyRowIndexByRecordIndex(parentPath, table);
      if (bodyIndex < 0) {
        bodyIndex = this.findVisibleTreeBodyIndex(table, parentPath);
      }
      if (bodyIndex < 0) {
        continue;
      }
      const row = bodyIndex + headerOffset;
      const hierarchyState = table.getHierarchyState?.(treeCol, row);
      if (hierarchyState !== 'expand') {
        table.toggleHierarchyState?.(treeCol, row);
      }
    }

    bodyIndex = this.getBodyRowIndexByRecordIndex(indexNumbers, table);
    if (bodyIndex < 0) {
      bodyIndex = this.findVisibleTreeBodyIndex(table, indexNumbers);
    }
    return bodyIndex;
  }

  jumpToCell(params: { col?: number; row?: number; IndexNumber?: number[] }, targetTable: IVTable = this.table) {
    if (Array.isArray(params.IndexNumber)) {
      const indexNumbers = [...params.IndexNumber];
      const finalBodyIndex = this.getTreeBodyIndex(targetTable, indexNumbers);
      if (finalBodyIndex < 0) {
        return;
      }
      const finalRow = finalBodyIndex + this.getHeaderOffset(targetTable);

      // 根据配置决定是否滚动表格
      const targetCol = typeof params.col === 'number' ? params.col : this.getTreeCol(targetTable);
      targetTable.scrollToCell({ row: finalRow, col: targetCol }, this.scrollOption);
      this.ensureSubTableParentVisible(targetTable, { col: targetCol, row: finalRow });

      // 根据配置决定是否滚动页面
      if (this.enableViewportScroll) {
        scrollVTableCellIntoView(targetTable, { row: finalRow, col: targetCol });
      }
    } else {
      const { col, row } = params;
      if (typeof col !== 'number' || typeof row !== 'number') {
        return;
      }
      const { rowStart, rowEnd } = targetTable.getBodyVisibleRowRange();
      const { colStart, colEnd } = targetTable.getBodyVisibleColRange();

      // 检查单元格是否在表格可视范围内
      const isInTableView = row >= rowStart && row <= rowEnd && col >= colStart && col <= colEnd;

      // 根据配置决定是否滚动表格
      if (!isInTableView) {
        targetTable.scrollToCell({ col, row });
      }
      this.ensureSubTableParentVisible(targetTable, { col, row });

      // 根据配置决定是否滚动页面
      if (this.enableViewportScroll) {
        scrollVTableCellIntoView(targetTable, { row, col });
      }
    }
  }
  getBodyRowIndexByRecordIndex(index: number | number[], targetTable: IVTable = this.table): number {
    if (Array.isArray(index) && index.length === 1) {
      index = index[0];
    }
    const dataSource = (targetTable as any).dataSource;
    if (typeof dataSource?.getTableIndex === 'function') {
      const tableIndex = dataSource.getTableIndex(index);
      return typeof tableIndex === 'number' ? tableIndex : -1;
    }
    const tableIndex = (targetTable as any).getTableIndexByRecordIndex?.(index as number);
    if (typeof tableIndex === 'number') {
      return tableIndex - this.getHeaderOffset(targetTable);
    }
    return -1;
  }
  clear() {
    // reset highlight cell style
    this.updateCellStyle(false);
    this.queryStr = '';
    this.queryResult = [];
    this.resultTableMap = new WeakMap<object, IVTable>();
    this.resultTreeMap = new WeakMap<object, boolean>();
    this.resultParentRowMap = new WeakMap<object, number>();
    this.resultTables.clear();
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

  // 获取单元格相对于表格可视区域的位置信息。该 API 同时包含 viewBox 偏移。
  const cellRange = table.getCellRange?.(cellInfo.col, cellInfo.row) || {
    start: cellInfo,
    end: cellInfo
  };
  const cellRect =
    typeof table.getCellRangeRelativeRect === 'function'
      ? table.getCellRangeRelativeRect(cellRange)
      : table.getCellRect(cellInfo.col, cellInfo.row);
  if (!cellRect) {
    return;
  }

  // 查找最近的可滚动父容器
  let scrollContainer: Element | null = tableEl.parentElement;
  while (scrollContainer) {
    const computedStyle = typeof getComputedStyle === 'function' ? getComputedStyle(scrollContainer) : undefined;
    const hasScroll = !!computedStyle && /(auto|scroll|overlay)/.test(computedStyle.overflowY);
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
