import type { BaseTableAPI, ListTable, pluginsDefinition, TYPES } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEventHandlersEventArgumentMap } from '@visactor/vtable/es/ts-types/events';
import { captureCellPreChangeContent, parseA1Notation, popCellPreChangeContent } from './formula';
import { replayCommand } from './replay';
import { captureSnapshot, cloneDeep, cloneRecord } from './snapshot';
import { resolveSheetKey } from './sheet-key';
import type {
  AddColumnCommand,
  AddRecordCommand,
  CellChange,
  CellCommand,
  ChangeHeaderPositionCommand,
  DeleteColumnCommand,
  DeleteRecordCommand,
  HistoryCommand,
  HistoryPluginOptions,
  HistoryTransaction,
  MergeCellsCommand,
  ResizeColumnCommand,
  ResizeRowCommand,
  UpdateRecordCommand
} from './types';

export class HistoryPlugin implements pluginsDefinition.IVTablePlugin {
  id = 'history-plugin';
  name = 'History';

  runTime: any[] = [
    TABLE_EVENT_TYPE.INITIALIZED,
    TABLE_EVENT_TYPE.BEFORE_KEYDOWN,
    TABLE_EVENT_TYPE.CHANGE_CELL_VALUE,
    TABLE_EVENT_TYPE.CHANGE_CELL_VALUES,
    TABLE_EVENT_TYPE.PASTED_DATA,
    TABLE_EVENT_TYPE.MERGE_CELLS,
    TABLE_EVENT_TYPE.UNMERGE_CELLS,
    TABLE_EVENT_TYPE.ADD_RECORD,
    TABLE_EVENT_TYPE.DELETE_RECORD,
    TABLE_EVENT_TYPE.UPDATE_RECORD,
    TABLE_EVENT_TYPE.ADD_COLUMN,
    TABLE_EVENT_TYPE.DELETE_COLUMN,
    TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION,
    TABLE_EVENT_TYPE.RESIZE_ROW,
    TABLE_EVENT_TYPE.RESIZE_ROW_END,
    TABLE_EVENT_TYPE.RESIZE_COLUMN,
    TABLE_EVENT_TYPE.RESIZE_COLUMN_END
  ];

  private table: ListTable | null = null;
  private vtableSheet: any;
  private resolvedSheetKey: string | undefined;

  private undoStack: HistoryTransaction[] = [];
  private redoStack: HistoryTransaction[] = [];
  private currentTransaction: HistoryTransaction | null = null;
  private isReplaying = false;

  private maxHistory: number;
  private enableCompression: boolean;

  private prevColumnsSnapshot: TYPES.ColumnDefine[] | null = null;
  private prevMergeSnapshot: TYPES.CustomMergeCellArray | undefined;
  private prevRecordsSnapshot: any[] | null = null;
  private prevFormulasSnapshot: Record<string, string> | null = null;
  private prevResizedRowHeightsSnapshot: Record<number, number> | null = null;
  private prevResizedColWidthsSnapshot: Record<number, number> | null = null;

  private cellPreChangeContent: Map<string, any> = new Map();
  private formulaCache: Map<string, string | undefined> = new Map();
  private formulaEventBound = false;
  private formulaEventManager: any;
  private onFormulaAddedHandler: any;

  private resizeRowStartHeight: Map<number, number> = new Map();
  private resizeColStartWidth: Map<number, number> = new Map();

  constructor(options?: HistoryPluginOptions) {
    this.id = options?.id ?? this.id;
    this.maxHistory = options?.maxHistory ?? 100;
    this.enableCompression = options?.enableCompression ?? true;
  }

  run(...args: [TableEventHandlersEventArgumentMap[keyof TableEventHandlersEventArgumentMap], any, BaseTableAPI]) {
    const eventArgs = args[0] as any;
    const runtime = args[1] as any;
    const table = args[2] as ListTable;

    if (!table) {
      return;
    }
    if (!this.table) {
      this.table = table;
      this.vtableSheet = (table as any).__vtableSheet;
      const state = this.getSnapshotState();
      const sheetKey = this.getSheetKey();
      captureSnapshot(table, state, {
        formulaManager: this.vtableSheet?.formulaManager,
        sheetKey
      });
      this.setSnapshotState(state);
    }

    this.ensureFormulaEventBindings();

    if (this.isReplaying) {
      return;
    }

    switch (runtime) {
      case TABLE_EVENT_TYPE.INITIALIZED:
        break;
      case TABLE_EVENT_TYPE.BEFORE_KEYDOWN:
        this.handleBeforeKeydown(eventArgs);
        break;
      case TABLE_EVENT_TYPE.CHANGE_CELL_VALUE:
        this.handleChangeCellValue(eventArgs);
        break;
      case TABLE_EVENT_TYPE.CHANGE_CELL_VALUES:
        this.handleChangeCellValues(eventArgs);
        break;
      case TABLE_EVENT_TYPE.PASTED_DATA:
        break;
      case TABLE_EVENT_TYPE.MERGE_CELLS:
        this.handleMergeCells(eventArgs);
        break;
      case TABLE_EVENT_TYPE.UNMERGE_CELLS:
        this.handleUnmergeCells(eventArgs);
        break;
      case TABLE_EVENT_TYPE.ADD_RECORD:
        this.handleAddRecord(eventArgs);
        break;
      case TABLE_EVENT_TYPE.DELETE_RECORD:
        this.handleDeleteRecord(eventArgs);
        break;
      case TABLE_EVENT_TYPE.UPDATE_RECORD:
        this.handleUpdateRecord(eventArgs);
        break;
      case TABLE_EVENT_TYPE.ADD_COLUMN:
        this.handleAddColumn(eventArgs);
        break;
      case TABLE_EVENT_TYPE.DELETE_COLUMN:
        this.handleDeleteColumn(eventArgs);
        break;
      case TABLE_EVENT_TYPE.CHANGE_HEADER_POSITION:
        this.handleChangeHeaderPosition(eventArgs);
        break;
      case TABLE_EVENT_TYPE.RESIZE_ROW:
        this.handleResizeRow(eventArgs);
        break;
      case TABLE_EVENT_TYPE.RESIZE_ROW_END:
        this.handleResizeRowEnd(eventArgs);
        break;
      case TABLE_EVENT_TYPE.RESIZE_COLUMN:
        this.handleResizeColumn(eventArgs);
        break;
      case TABLE_EVENT_TYPE.RESIZE_COLUMN_END:
        this.handleResizeColumnEnd(eventArgs);
        break;
      default:
        break;
    }

    if (this.table) {
      const state = this.getSnapshotState();
      const sheetKey = this.getSheetKey();
      captureSnapshot(this.table, state, {
        formulaManager: this.vtableSheet?.formulaManager,
        sheetKey
      });
      this.setSnapshotState(state);
    }
  }

  startTransaction(): void {
    if (this.currentTransaction) {
      return;
    }
    this.currentTransaction = { commands: [] };
  }

  endTransaction(): void {
    if (!this.currentTransaction || this.currentTransaction.commands.length === 0) {
      this.currentTransaction = null;
      return;
    }
    this.pushTransaction(this.currentTransaction);
    this.currentTransaction = null;
  }

  undo(): void {
    if (!this.table || this.undoStack.length === 0) {
      return;
    }
    const transaction = this.undoStack.pop()!;
    this.isReplaying = true;
    try {
      for (let i = transaction.commands.length - 1; i >= 0; i--) {
        this.applyCommand(transaction.commands[i], 'undo');
      }
    } finally {
      this.isReplaying = false;
    }
    this.redoStack.push(transaction);
    if (this.table) {
      const state = this.getSnapshotState();
      const sheetKey = this.getSheetKey();
      captureSnapshot(this.table, state, {
        formulaManager: this.vtableSheet?.formulaManager,
        sheetKey
      });
      this.setSnapshotState(state);
    }
  }

  redo(): void {
    if (!this.table || this.redoStack.length === 0) {
      return;
    }
    const transaction = this.redoStack.pop()!;
    this.isReplaying = true;
    try {
      for (const cmd of transaction.commands) {
        this.applyCommand(cmd, 'redo');
      }
    } finally {
      this.isReplaying = false;
    }
    this.undoStack.push(transaction);
    if (this.table) {
      const state = this.getSnapshotState();
      const sheetKey = this.getSheetKey();
      captureSnapshot(this.table, state, {
        formulaManager: this.vtableSheet?.formulaManager,
        sheetKey
      });
      this.setSnapshotState(state);
    }
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentTransaction = null;
  }

  updateOptions(options: Partial<HistoryPluginOptions>): void {
    if (options.maxHistory != null) {
      this.maxHistory = options.maxHistory;
      this.trimHistory();
    }
    if (options.enableCompression != null) {
      this.enableCompression = options.enableCompression;
    }
  }

  release(): void {
    this.clear();
    this.unbindFormulaEvents();
    this.table = null;
    this.vtableSheet = null;
    this.resolvedSheetKey = undefined;
    this.prevColumnsSnapshot = null;
    this.prevMergeSnapshot = undefined;
    this.prevRecordsSnapshot = null;
    this.prevFormulasSnapshot = null;
    this.prevResizedRowHeightsSnapshot = null;
    this.prevResizedColWidthsSnapshot = null;
    this.cellPreChangeContent.clear();
    this.formulaCache.clear();
    this.resizeRowStartHeight.clear();
    this.resizeColStartWidth.clear();
  }

  private getSheetKey(): string | undefined {
    const resolved = resolveSheetKey({
      vtableSheet: this.vtableSheet,
      table: this.table,
      cached: this.resolvedSheetKey
    });
    this.resolvedSheetKey = resolved.cached;
    return resolved.sheetKey;
  }

  private getSnapshotState() {
    return {
      prevColumnsSnapshot: this.prevColumnsSnapshot,
      prevMergeSnapshot: this.prevMergeSnapshot,
      prevRecordsSnapshot: this.prevRecordsSnapshot,
      prevFormulasSnapshot: this.prevFormulasSnapshot,
      prevResizedRowHeightsSnapshot: this.prevResizedRowHeightsSnapshot,
      prevResizedColWidthsSnapshot: this.prevResizedColWidthsSnapshot
    };
  }

  private setSnapshotState(next: {
    prevColumnsSnapshot: any;
    prevMergeSnapshot: any;
    prevRecordsSnapshot: any;
    prevFormulasSnapshot?: any;
    prevResizedRowHeightsSnapshot?: any;
    prevResizedColWidthsSnapshot?: any;
  }) {
    this.prevColumnsSnapshot = next.prevColumnsSnapshot;
    this.prevMergeSnapshot = next.prevMergeSnapshot;
    this.prevRecordsSnapshot = next.prevRecordsSnapshot;
    this.prevFormulasSnapshot = next.prevFormulasSnapshot ?? null;
    this.prevResizedRowHeightsSnapshot = next.prevResizedRowHeightsSnapshot ?? null;
    this.prevResizedColWidthsSnapshot = next.prevResizedColWidthsSnapshot ?? null;
  }

  private pushTransaction(tx: HistoryTransaction): void {
    console.trace('pushTransaction');
    if (tx.commands.length === 0) {
      return;
    }
    this.undoStack.push(tx);
    this.redoStack = [];
    this.trimHistory();
  }

  private trimHistory(): void {
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.splice(0, this.undoStack.length - this.maxHistory);
    }
  }

  private pushCommand(cmd: HistoryCommand): void {
    if (this.currentTransaction) {
      this.currentTransaction.commands.push(cmd);
      return;
    }
    this.pushTransaction({ commands: [cmd] });
  }

  private tryCompressCellChange(change: CellChange, sheetKey?: string): boolean {
    if (!this.enableCompression) {
      return false;
    }
    const targetTx = this.currentTransaction || this.undoStack[this.undoStack.length - 1];
    if (!targetTx || targetTx.commands.length === 0) {
      return false;
    }
    const last = targetTx.commands[targetTx.commands.length - 1];
    if ((last.type === 'cell' || last.type === 'cells') && last.sheetKey === sheetKey) {
      const cells = (last as CellCommand).cells;
      if (cells.length === 1 && cells[0].row === change.row && cells[0].col === change.col) {
        cells[0].newContent = change.newContent;
        return true;
      }
    }
    return false;
  }

  private handleBeforeKeydown(eventArgs: TableEventHandlersEventArgumentMap['before_keydown']): void {
    const e = eventArgs.event;
    if (!e || !this.table) {
      return;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;
    if (!isCtrlOrMeta) {
      return;
    }

    const formulaManager = this.vtableSheet?.formulaManager;
    if (formulaManager?.formulaWorkingOnCell) {
      return;
    }
    if (this.table.editorManager?.editingEditor) {
      return;
    }

    const key = e.key.toLowerCase();
    if (key === 'z') {
      if (e.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      e.preventDefault();
      e.stopPropagation();
    } else if (key === 'y') {
      this.redo();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  private handleChangeCellValue(eventArgs: TableEventHandlersEventArgumentMap['change_cell_value']): void {
    captureCellPreChangeContent({
      sheetKey: this.getSheetKey(),
      row: eventArgs.row,
      col: eventArgs.col,
      currentValue: eventArgs.currentValue,
      formulaManager: this.vtableSheet?.formulaManager,
      store: this.cellPreChangeContent
    });
  }

  private handleChangeCellValues(eventArgs: TableEventHandlersEventArgumentMap['change_cell_values']): void {
    if (!this.table) {
      return;
    }
    const sheetKey = this.getSheetKey();
    const formulaManager = this.vtableSheet?.formulaManager;
    const cells: CellChange[] = eventArgs.values
      .map(v => {
        const oldContent = popCellPreChangeContent({
          sheetKey,
          row: v.row,
          col: v.col,
          fallbackOldContent: v.currentValue,
          store: this.cellPreChangeContent
        });
        const normalizedOld = oldContent == null ? '' : oldContent;
        const normalizedNew = v.changedValue == null ? '' : v.changedValue;
        return { row: v.row, col: v.col, oldContent: normalizedOld, newContent: normalizedNew };
      })
      .filter(c => {
        if (c.oldContent === c.newContent) {
          return false;
        }
        if (!sheetKey || !formulaManager?.getCellFormula || !formulaManager?.getCellValue) {
          return true;
        }
        if (typeof c.newContent === 'string' && c.newContent.startsWith('=')) {
          return false;
        }
        const formula = formulaManager.getCellFormula({ sheet: sheetKey, row: c.row, col: c.col });
        if (!formula) {
          return true;
        }
        const result = formulaManager.getCellValue({ sheet: sheetKey, row: c.row, col: c.col });
        const display = result?.error ? '#ERROR!' : result?.value;
        if (display === c.newContent) {
          return false;
        }
        if (display != null && c.newContent != null && String(display) === String(c.newContent)) {
          return false;
        }
        return true;
      });

    if (!cells.length) {
      return;
    }

    if (sheetKey && cells.length === 1 && this.tryCompressCellChange(cells[0], sheetKey)) {
      return;
    }

    const cmd: CellCommand = { type: 'cells', sheetKey, cells };
    this.pushCommand(cmd);
  }

  private ensureFormulaEventBindings(): void {
    if (!this.table || !this.vtableSheet || this.formulaEventBound) {
      return;
    }
    const sheetKey = this.getSheetKey();
    if (!sheetKey) {
      return;
    }
    const worksheet =
      this.vtableSheet.getWorkSheetByKey?.(sheetKey) ?? this.vtableSheet.workSheetInstances?.get?.(sheetKey);
    const eventManager = (worksheet as any)?.eventManager;
    if (!eventManager?.on || !eventManager?.off) {
      return;
    }

    this.formulaEventBound = true;
    this.formulaEventManager = eventManager;

    this.onFormulaAddedHandler = (event: any) => {
      if (this.isReplaying) {
        return;
      }
      const cell = event?.cell;
      const formula = event?.formula;
      if (!cell || typeof cell.row !== 'number' || typeof cell.col !== 'number') {
        return;
      }
      if (typeof formula !== 'string' || !formula.length) {
        return;
      }
      const normalized = formula.startsWith('=') ? formula : `=${formula}`;
      const key = `${sheetKey}:${cell.row}:${cell.col}`;
      const prev = this.formulaCache.get(key);
      const oldContent: any = popCellPreChangeContent({
        sheetKey,
        row: cell.row,
        col: cell.col,
        fallbackOldContent: typeof prev !== 'undefined' ? prev : '',
        store: this.cellPreChangeContent
      });

      if (oldContent === normalized) {
        this.formulaCache.set(key, normalized);
        return;
      }

      const cmd: CellCommand = {
        type: 'cells',
        sheetKey,
        cells: [{ row: cell.row, col: cell.col, oldContent, newContent: normalized }]
      };
      this.pushCommand(cmd);
      this.formulaCache.set(key, normalized);
    };

    eventManager.on('formula_added', this.onFormulaAddedHandler);
  }

  private unbindFormulaEvents(): void {
    if (!this.formulaEventBound || !this.formulaEventManager) {
      return;
    }
    try {
      if (this.onFormulaAddedHandler) {
        this.formulaEventManager.off('formula_added', this.onFormulaAddedHandler);
      }
    } catch {
      // ignore
    } finally {
      this.formulaEventBound = false;
      this.formulaEventManager = undefined;
      this.onFormulaAddedHandler = undefined;
    }
  }

  private cloneMergeConfig(input: any): any {
    if (Array.isArray(input)) {
      return input.map(i => cloneDeep(i));
    }
    return input;
  }

  private isSameMergeConfig(a: any, b: any): boolean {
    const normalize = (v: any) => {
      if (v == null) {
        return [];
      }
      if (Array.isArray(v)) {
        return v;
      }
      return v;
    };
    const aa = normalize(a);
    const bb = normalize(b);
    if (aa === bb) {
      return true;
    }
    if (Array.isArray(aa) && Array.isArray(bb)) {
      if (aa.length !== bb.length) {
        return false;
      }
      for (let i = 0; i < aa.length; i++) {
        const ra = aa[i]?.range;
        const rb = bb[i]?.range;
        if (
          !ra ||
          !rb ||
          ra.start?.col !== rb.start?.col ||
          ra.start?.row !== rb.start?.row ||
          ra.end?.col !== rb.end?.col ||
          ra.end?.row !== rb.end?.row ||
          aa[i]?.text !== bb[i]?.text
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private handleMergeCells(eventArgs: TableEventHandlersEventArgumentMap['merge_cells']): void {
    this.handleMergeConfigChanged(eventArgs);
  }

  private handleUnmergeCells(eventArgs: TableEventHandlersEventArgumentMap['unmerge_cells']): void {
    this.handleMergeConfigChanged(eventArgs);
  }

  private handleMergeConfigChanged(eventArgs: {
    startCol: number;
    startRow: number;
    endCol: number;
    endRow: number;
  }): void {
    if (!this.table) {
      return;
    }
    const { startCol, startRow, endCol, endRow } = eventArgs;
    const before = this.cloneMergeConfig(this.prevMergeSnapshot);
    const after = this.cloneMergeConfig((this.table as any).options?.customMergeCell);
    if (this.isSameMergeConfig(before, after)) {
      return;
    }

    const cmd: MergeCellsCommand = {
      type: 'merge_cells',
      sheetKey: this.getSheetKey(),
      startCol,
      startRow,
      endCol,
      endRow,
      oldCustomMergeCell: before,
      newCustomMergeCell: after
    };
    this.pushCommand(cmd);
  }

  private handleAddRecord(eventArgs: TableEventHandlersEventArgumentMap['add_record']): void {
    const sheetKey = this.getSheetKey();
    const cmd: AddRecordCommand = {
      type: 'add_record',
      sheetKey,
      records: Array.isArray(eventArgs.records) ? eventArgs.records.slice() : [],
      recordIndex: eventArgs.recordIndex,
      recordCount: eventArgs.recordCount ?? (Array.isArray(eventArgs.records) ? eventArgs.records.length : 0)
    };
    this.pushCommand(cmd);
  }

  private handleDeleteRecord(eventArgs: TableEventHandlersEventArgumentMap['delete_record']): void {
    const sheetKey = this.getSheetKey();
    const recordIndexs = Array.isArray(eventArgs.recordIndexs)
      ? ((eventArgs.recordIndexs as (number | number[])[]).slice() as (number | number[])[])
      : [eventArgs.recordIndexs as any];

    let deletedRowHeights: Record<number, number> | undefined;
    if (this.table && this.prevResizedRowHeightsSnapshot) {
      const headerCount = (this.table as any).transpose
        ? (this.table as any).rowHeaderLevelCount
        : (this.table as any).columnHeaderLevelCount;
      recordIndexs.forEach(idx => {
        if (typeof idx !== 'number') {
          return;
        }
        const rowIndex = idx + (headerCount ?? 0);
        const height = this.prevResizedRowHeightsSnapshot?.[rowIndex];
        if (typeof height === 'number') {
          if (!deletedRowHeights) {
            deletedRowHeights = {};
          }
          deletedRowHeights[idx] = height;
        }
      });
    }

    const oldCustomMergeCell = this.cloneMergeConfig(this.prevMergeSnapshot);
    const newCustomMergeCell = this.cloneMergeConfig((this.table as any)?.options?.customMergeCell);

    const cmd: DeleteRecordCommand = {
      type: 'delete_record',
      sheetKey,
      records: Array.isArray(eventArgs.records) ? eventArgs.records.slice() : [],
      recordIndexs,
      deletedRowHeights,
      oldCustomMergeCell,
      newCustomMergeCell
    };
    this.pushCommand(cmd);
  }

  private handleUpdateRecord(eventArgs: TableEventHandlersEventArgumentMap['update_record']): void {
    if (!this.table) {
      return;
    }
    const sheetKey = this.getSheetKey();
    const recordIndexs = (eventArgs.recordIndexs || []) as (number | number[])[];
    const newRecords = Array.isArray(eventArgs.records) ? eventArgs.records.slice() : [];

    if (!this.prevRecordsSnapshot || !Array.isArray(this.prevRecordsSnapshot) || !recordIndexs.length) {
      return;
    }

    const oldRecords: any[] = [];
    recordIndexs.forEach(idx => {
      if (typeof idx === 'number') {
        const rec = this.prevRecordsSnapshot![idx];
        oldRecords.push(rec !== undefined ? cloneRecord(rec) : undefined);
      } else {
        oldRecords.push(undefined);
      }
    });

    const cmd: UpdateRecordCommand = { type: 'update_record', sheetKey, oldRecords, newRecords, recordIndexs };
    this.pushCommand(cmd);
  }

  private handleAddColumn(eventArgs: TableEventHandlersEventArgumentMap['add_column']): void {
    if (!this.table) {
      return;
    }
    const sheetKey = this.getSheetKey();
    const { columnIndex, columnCount, columns } = eventArgs;
    const addedColumns = (columns as TYPES.ColumnDefine[])
      .slice(columnIndex, columnIndex + columnCount)
      .map(c => cloneDeep(c));
    const cmd: AddColumnCommand = { type: 'add_column', sheetKey, columnIndex, columnCount, columns: addedColumns };
    this.pushCommand(cmd);
  }

  private handleDeleteColumn(eventArgs: TableEventHandlersEventArgumentMap['delete_column']): void {
    if (!this.table) {
      return;
    }
    const sheetKey = this.getSheetKey();
    const deleteColIndexs = (eventArgs.deleteColIndexs || []).slice();
    const deletedColumnsFromEvent = (eventArgs as any).deletedColumns as TYPES.ColumnDefine[] | undefined;
    const prevColumns = this.prevColumnsSnapshot || [];
    const deletedColumns: TYPES.ColumnDefine[] = Array.isArray(deletedColumnsFromEvent)
      ? deletedColumnsFromEvent.map(c => cloneDeep(c))
      : [];
    if (!deletedColumns.length) {
      deleteColIndexs.forEach(idx => {
        if (idx >= 0 && idx < prevColumns.length) {
          deletedColumns.push(cloneDeep(prevColumns[idx]));
        }
      });
    }

    let deletedRecordValues: any[][] | undefined = (eventArgs as any).deletedRecordValues as any[][] | undefined;
    if (!Array.isArray(deletedRecordValues) || !deletedRecordValues.length) {
      deletedRecordValues = undefined;
      if (Array.isArray(this.prevRecordsSnapshot) && this.prevRecordsSnapshot.length) {
        deletedRecordValues = this.prevRecordsSnapshot.map(rec => {
          if (Array.isArray(rec)) {
            return deleteColIndexs.map(idx => rec[idx]);
          }
          return [];
        });
        if (deletedRecordValues.every(v => v.length === 0)) {
          deletedRecordValues = undefined;
        }
      }
    }

    let deletedFormulas: Record<string, string> | undefined;
    if (this.prevFormulasSnapshot && deleteColIndexs.length) {
      const entries = Object.entries(this.prevFormulasSnapshot);
      entries.forEach(([cellRef, formula]) => {
        const parsed = parseA1Notation(cellRef);
        if (parsed && deleteColIndexs.includes(parsed.col)) {
          if (!deletedFormulas) {
            deletedFormulas = {};
          }
          deletedFormulas[cellRef] = formula;
        }
      });
    }

    let deletedColWidths: Record<number, number> | undefined;
    if (this.prevResizedColWidthsSnapshot && deleteColIndexs.length) {
      deleteColIndexs.forEach(idx => {
        const w = this.prevResizedColWidthsSnapshot?.[idx];
        if (typeof w === 'number') {
          if (!deletedColWidths) {
            deletedColWidths = {};
          }
          deletedColWidths[idx] = w;
        }
      });
    }

    const cmd: DeleteColumnCommand = {
      type: 'delete_column',
      sheetKey,
      deleteColIndexs,
      columns: deletedColumns,
      deletedRecordValues,
      deletedFormulas,
      deletedColWidths
    };
    this.pushCommand(cmd);
  }

  private handleChangeHeaderPosition(eventArgs: TableEventHandlersEventArgumentMap['change_header_position']): void {
    const sheetKey = this.getSheetKey();
    const moving = eventArgs.movingColumnOrRow ?? 'column';
    const sourceIndex = moving === 'column' ? eventArgs.source.col : eventArgs.source.row;
    const targetIndex = moving === 'column' ? eventArgs.target.col : eventArgs.target.row;

    const cmd: ChangeHeaderPositionCommand = {
      type: 'change_header_position',
      sheetKey,
      moving,
      sourceIndex,
      targetIndex
    };
    this.pushCommand(cmd);
  }

  private handleResizeRow(eventArgs: TableEventHandlersEventArgumentMap['resize_row']): void {
    if (!this.table) {
      return;
    }
    const row = eventArgs.row;
    if (!this.resizeRowStartHeight.has(row)) {
      const oldHeight = (this.table as any).getRowHeight?.(row);
      if (typeof oldHeight === 'number') {
        this.resizeRowStartHeight.set(row, oldHeight);
      }
    }
  }

  private handleResizeRowEnd(eventArgs: TableEventHandlersEventArgumentMap['resize_row_end']): void {
    if (!this.table) {
      return;
    }
    const sheetKey = this.getSheetKey();
    const row = eventArgs.row;
    const newHeight = eventArgs.rowHeight;
    const oldHeight = this.resizeRowStartHeight.get(row) ?? newHeight;
    this.resizeRowStartHeight.delete(row);

    if (typeof oldHeight === 'number' && typeof newHeight === 'number' && oldHeight === newHeight) {
      return;
    }
    const cmd: ResizeRowCommand = { type: 'resize_row', sheetKey, row, oldHeight, newHeight };
    this.pushCommand(cmd);
  }

  private handleResizeColumn(eventArgs: TableEventHandlersEventArgumentMap['resize_column']): void {
    if (!this.table) {
      return;
    }
    const col = eventArgs.col;
    if (!this.resizeColStartWidth.has(col)) {
      const oldWidth = (this.table as any).getColWidth?.(col);
      if (typeof oldWidth === 'number') {
        this.resizeColStartWidth.set(col, oldWidth);
      }
    }
  }

  private handleResizeColumnEnd(eventArgs: TableEventHandlersEventArgumentMap['resize_column_end']): void {
    if (!this.table) {
      return;
    }
    const sheetKey = this.getSheetKey();
    const col = eventArgs.col;
    const colWidths = eventArgs.colWidths || [];
    const newWidth = colWidths[col] ?? (this.table as any).getColWidth?.(col);
    const oldWidth = this.resizeColStartWidth.get(col) ?? newWidth;
    this.resizeColStartWidth.delete(col);

    if (typeof oldWidth === 'number' && typeof newWidth === 'number' && oldWidth === newWidth) {
      return;
    }
    const cmd: ResizeColumnCommand = { type: 'resize_column', sheetKey, col, oldWidth, newWidth };
    this.pushCommand(cmd);
  }

  private applyCommand(cmd: HistoryCommand, direction: 'undo' | 'redo'): void {
    if (!this.table) {
      return;
    }
    replayCommand({
      table: this.table,
      vtableSheet: this.vtableSheet,
      cmd,
      direction,
      deleteRecordsByReference: (records: any[]) => this.deleteRecordsByReference(records)
    });
  }

  private deleteRecordsByReference(records: any[]): void {
    if (!this.table || !records?.length) {
      return;
    }
    const tableRecords = (this.table.records || []) as any[];
    const indexs: number[] = [];
    records.forEach(rec => {
      const idx = tableRecords.indexOf(rec);
      if (idx >= 0) {
        indexs.push(idx);
      }
    });
    if (indexs.length && (this.table as any).deleteRecords) {
      (this.table as any).deleteRecords(indexs);
    }
  }
}
