import type VTableSheet from '../components/vtable-sheet';
import type { ISheetDefine } from '../ts-types';
import { replayCommand } from '@visactor/vtable-plugins';
import type { HistoryTransaction } from '@visactor/vtable-plugins';

// 工作簿层撤销/恢复管理器：负责跨 sheet 的结构操作历史，并将单 sheet 的表格编辑（HistoryTransaction）统一纳入工作簿事务。
type WorkbookHistoryCommand =
  | {
      type: 'table_tx';
      sheetKey: string;
      tx: HistoryTransaction;
    }
  | {
      type: 'sheet_add';
      sheet: ISheetDefine;
      orderBefore: string[];
      orderAfter: string[];
      activeBefore: string | undefined;
      activeAfter: string | undefined;
    }
  | {
      type: 'sheet_remove';
      sheet: ISheetDefine;
      orderBefore: string[];
      orderAfter: string[];
      activeBefore: string | undefined;
      activeAfter: string | undefined;
    }
  | {
      type: 'sheet_rename';
      sheetKey: string;
      oldTitle: string;
      newTitle: string;
    }
  | {
      type: 'sheet_reorder';
      orderBefore: string[];
      orderAfter: string[];
    };

type WorkbookHistoryTx = { commands: WorkbookHistoryCommand[] };

function cloneJson<T>(input: T): T {
  return JSON.parse(JSON.stringify(input)) as T;
}

function cloneSafe<T>(input: T): T {
  // table_tx 内部对象可能被后续编辑污染，入栈时做深拷贝，确保 undo/redo 回放是稳定的快照。
  const sc = (globalThis as any).structuredClone as ((v: any) => any) | undefined;
  if (typeof sc === 'function') {
    try {
      return sc(input);
    } catch {}
  }
  return cloneJson(input);
}

export class WorkbookHistoryManager {
  private sheet: VTableSheet;
  private undoStack: WorkbookHistoryTx[] = [];
  private redoStack: WorkbookHistoryTx[] = [];
  private currentTransaction: WorkbookHistoryTx | null = null;
  private maxHistory: number;
  private enabled = true;
  isReplaying = false;

  constructor(sheet: VTableSheet, options?: { maxHistory?: number }) {
    this.sheet = sheet;
    this.maxHistory = options?.maxHistory ?? 100;
  }

  suspend(): void {
    this.enabled = false;
  }

  resume(): void {
    this.enabled = true;
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

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentTransaction = null;
  }

  updateOptions(options: { maxHistory?: number }): void {
    if (options.maxHistory != null) {
      this.maxHistory = options.maxHistory;
      this.trimHistory();
    }
  }

  undo(): void {
    if (this.undoStack.length === 0) {
      return;
    }
    const tx = this.undoStack.pop()!;
    this.isReplaying = true;
    // 回放期间置标，HistoryPlugin 会跳过事件采集，避免回放回流导致历史栈污染。
    (this.sheet as any).__workbookHistoryReplaying = true;
    try {
      for (let i = tx.commands.length - 1; i >= 0; i--) {
        this.applyCommand(tx.commands[i], 'undo');
      }
    } finally {
      this.isReplaying = false;
      (this.sheet as any).__workbookHistoryReplaying = false;
    }
    this.redoStack.push(tx);
  }

  redo(): void {
    if (this.redoStack.length === 0) {
      return;
    }
    const tx = this.redoStack.pop()!;
    this.isReplaying = true;
    (this.sheet as any).__workbookHistoryReplaying = true;
    try {
      for (const cmd of tx.commands) {
        this.applyCommand(cmd, 'redo');
      }
    } finally {
      this.isReplaying = false;
      (this.sheet as any).__workbookHistoryReplaying = false;
    }
    this.undoStack.push(tx);
  }

  recordTableTransaction(args: { sheetKey?: string; tx: HistoryTransaction }): void {
    if (!this.enabled || this.isReplaying) {
      return;
    }
    const sheetKey = args.sheetKey ?? this.getActiveSheetKey();
    if (!sheetKey) {
      return;
    }
    const cmd: WorkbookHistoryCommand = {
      type: 'table_tx',
      sheetKey,
      tx: cloneSafe(args.tx)
    };
    this.pushCommand(cmd);
  }

  addSheet(args: { sheet: ISheetDefine; activate?: boolean }): void {
    if (!this.enabled || this.isReplaying) {
      this.addSheetInternal(args.sheet, args.activate);
      return;
    }
    const orderBefore = this.getSheetOrder();
    const activeBefore = this.getActiveSheetKey();
    this.startTransaction();
    try {
      this.addSheetInternal(args.sheet, args.activate);
      const orderAfter = this.getSheetOrder();
      const activeAfter = this.getActiveSheetKey();
      const cmd: WorkbookHistoryCommand = {
        type: 'sheet_add',
        sheet: cloneSafe(args.sheet),
        orderBefore,
        orderAfter,
        activeBefore,
        activeAfter
      };
      this.pushCommand(cmd);
    } finally {
      this.endTransaction();
    }
  }

  removeSheet(sheetKey: string): void {
    if (!this.enabled || this.isReplaying) {
      this.removeSheetInternal(sheetKey);
      return;
    }
    const sheetDefine = this.sheet.getSheetManager().getSheet(sheetKey);
    if (!sheetDefine) {
      return;
    }
    const orderBefore = this.getSheetOrder();
    const activeBefore = this.getActiveSheetKey();
    this.startTransaction();
    try {
      this.removeSheetInternal(sheetKey);
      const orderAfter = this.getSheetOrder();
      const activeAfter = this.getActiveSheetKey();
      const cmd: WorkbookHistoryCommand = {
        type: 'sheet_remove',
        sheet: cloneSafe(sheetDefine),
        orderBefore,
        orderAfter,
        activeBefore,
        activeAfter
      };
      this.pushCommand(cmd);
    } finally {
      this.endTransaction();
    }
  }

  renameSheet(sheetKey: string, newTitle: string): void {
    const sheetDefine = this.sheet.getSheetManager().getSheet(sheetKey);
    if (!sheetDefine) {
      return;
    }
    const oldTitle = sheetDefine.sheetTitle;
    if (!this.enabled || this.isReplaying) {
      this.renameSheetInternal(sheetKey, newTitle);
      return;
    }
    this.startTransaction();
    try {
      this.renameSheetInternal(sheetKey, newTitle);
      const cmd: WorkbookHistoryCommand = { type: 'sheet_rename', sheetKey, oldTitle, newTitle };
      this.pushCommand(cmd);
    } finally {
      this.endTransaction();
    }
  }

  reorderSheet(sourceKey: string, targetKey: string, position: 'left' | 'right'): void {
    if (!this.enabled || this.isReplaying) {
      this.sheet.getSheetManager().reorderSheet(sourceKey, targetKey, position);
      this.sheet.updateSheetTabs();
      this.sheet.updateSheetMenu();
      return;
    }
    const orderBefore = this.getSheetOrder();
    this.startTransaction();
    try {
      this.sheet.getSheetManager().reorderSheet(sourceKey, targetKey, position);
      this.sheet.updateSheetTabs();
      this.sheet.updateSheetMenu();
      const orderAfter = this.getSheetOrder();
      const cmd: WorkbookHistoryCommand = { type: 'sheet_reorder', orderBefore, orderAfter };
      this.pushCommand(cmd);
    } finally {
      this.endTransaction();
    }
  }

  private pushTransaction(tx: WorkbookHistoryTx): void {
    if (!tx.commands.length) {
      return;
    }
    this.undoStack.push(tx);
    this.redoStack = [];
    this.trimHistory();
  }

  private pushCommand(cmd: WorkbookHistoryCommand): void {
    if (this.currentTransaction) {
      this.currentTransaction.commands.push(cmd);
      return;
    }
    this.pushTransaction({ commands: [cmd] });
  }

  private trimHistory(): void {
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.splice(0, this.undoStack.length - this.maxHistory);
    }
  }

  private applyCommand(cmd: WorkbookHistoryCommand, direction: 'undo' | 'redo'): void {
    switch (cmd.type) {
      case 'sheet_add': {
        if (direction === 'undo') {
          this.removeSheetInternal(cmd.sheet.sheetKey);
          this.setSheetOrder(cmd.orderBefore);
          if (cmd.activeBefore) {
            this.sheet.activateSheet(cmd.activeBefore);
          }
        } else {
          this.addSheetInternal(cmd.sheet, false);
          this.setSheetOrder(cmd.orderAfter);
          if (cmd.activeAfter) {
            this.sheet.activateSheet(cmd.activeAfter);
          }
        }
        break;
      }
      case 'sheet_remove': {
        if (direction === 'undo') {
          this.addSheetInternal(cmd.sheet, false);
          this.setSheetOrder(cmd.orderBefore);
          if (!this.sheet.getWorkSheetInstance(cmd.sheet.sheetKey)) {
            const restored = this.sheet.createWorkSheetInstance(cmd.sheet);
            restored.getElement().style.display = 'none';
            this.sheet.setWorkSheetInstance(cmd.sheet.sheetKey, restored);
          }
          if (cmd.activeBefore) {
            this.sheet.activateSheet(cmd.activeBefore);
          }
        } else {
          this.removeSheetInternal(cmd.sheet.sheetKey);
          this.setSheetOrder(cmd.orderAfter);
          if (cmd.activeAfter) {
            this.sheet.activateSheet(cmd.activeAfter);
          }
        }
        break;
      }
      case 'sheet_rename': {
        const nextTitle = direction === 'undo' ? cmd.oldTitle : cmd.newTitle;
        this.renameSheetInternal(cmd.sheetKey, nextTitle);
        break;
      }
      case 'sheet_reorder': {
        this.setSheetOrder(direction === 'undo' ? cmd.orderBefore : cmd.orderAfter);
        break;
      }
      case 'table_tx': {
        this.applyTableTransaction(cmd.sheetKey, cmd.tx, direction);
        break;
      }
      default:
        break;
    }
  }

  private addSheetInternal(sheetDefine: ISheetDefine, activate?: boolean): void {
    this.sheet.getSheetManager().addSheet(sheetDefine);
    if (activate) {
      this.sheet.activateSheet(sheetDefine.sheetKey);
    } else {
      this.sheet.updateSheetTabs();
      this.sheet.updateSheetMenu();
    }
  }

  private removeSheetInternal(sheetKey: string): void {
    const instance = this.sheet.getWorkSheetInstance(sheetKey);
    if (instance) {
      instance.release();
      this.sheet.deleteWorkSheetInstance(sheetKey);
    }

    const active = this.getActiveSheetKey();
    const newActiveSheetKey = this.sheet.getSheetManager().removeSheet(sheetKey);
    try {
      this.sheet.getFormulaManager().removeSheet(sheetKey);
    } catch {}

    if (newActiveSheetKey && newActiveSheetKey !== active) {
      this.sheet.activateSheet(newActiveSheetKey);
    }
    this.sheet.updateSheetTabs();
    this.sheet.updateSheetMenu();
  }

  private renameSheetInternal(sheetKey: string, newTitle: string): void {
    this.sheet.getSheetManager().renameSheet(sheetKey, newTitle);
    this.sheet.getWorkSheetInstance(sheetKey)?.setTitle(newTitle);
    this.sheet.getFormulaManager().updateSheetTitle(sheetKey, newTitle);
    this.sheet.updateSheetTabs();
    this.sheet.updateSheetMenu();
  }

  private applyTableTransaction(sheetKey: string, tx: HistoryTransaction, direction: 'undo' | 'redo'): void {
    const ws = this.ensureWorkSheetInstance(sheetKey);
    // 用户可能已经切换到其他 sheet；当撤销/恢复的目标 transaction 属于另一个 sheet 时，先切回对应 sheet 再回放更符合预期。
    if (ws && this.getActiveSheetKey() !== sheetKey) {
      this.sheet.activateSheet(sheetKey);
    }
    const table: any = ws?.tableInstance;
    if (!table) {
      return;
    }
    const vtableSheet: any = this.sheet as any;
    const apply = (cmd: any, dir: 'undo' | 'redo') => {
      replayCommand({
        table,
        vtableSheet,
        cmd,
        direction: dir,
        deleteRecordsByReference: (records: any[]) => {
          const tableRecords = (table.records || []) as any[];
          const indexs: number[] = [];
          records.forEach(rec => {
            const idx = tableRecords.indexOf(rec);
            if (idx >= 0) {
              indexs.push(idx);
            }
          });
          if (indexs.length && table.deleteRecords) {
            table.deleteRecords(indexs);
          }
        }
      });
    };

    if (direction === 'undo') {
      for (let i = tx.commands.length - 1; i >= 0; i--) {
        apply(tx.commands[i], 'undo');
      }
    } else {
      for (let i = 0; i < tx.commands.length; i++) {
        apply(tx.commands[i], 'redo');
      }
    }
  }

  private ensureWorkSheetInstance(sheetKey: string): any {
    const existing = this.sheet.getWorkSheetInstance(sheetKey);
    if (existing) {
      return existing;
    }
    const def = this.sheet.getSheetManager().getSheet(sheetKey);
    if (!def) {
      return undefined;
    }
    const instance = this.sheet.createWorkSheetInstance(def);
    instance.getElement().style.display = 'none';
    this.sheet.setWorkSheetInstance(sheetKey, instance);
    return instance;
  }

  private getSheetOrder(): string[] {
    return this.sheet
      .getSheetManager()
      .getAllSheets()
      .map(s => s.sheetKey);
  }

  private setSheetOrder(order: string[]): void {
    const all = this.sheet.getSheetManager().getAllSheets();
    const map = new Map(all.map(s => [s.sheetKey, s] as const));
    const next: ISheetDefine[] = [];
    order.forEach(key => {
      const s = map.get(key);
      if (s) {
        next.push(s);
      }
    });
    if (next.length === all.length) {
      this.sheet.getSheetManager().sortSheets(next);
      this.sheet.updateSheetTabs();
      this.sheet.updateSheetMenu();
    }
  }

  private getActiveSheetKey(): string | undefined {
    return this.sheet.getSheetManager().getActiveSheet()?.sheetKey;
  }
}
