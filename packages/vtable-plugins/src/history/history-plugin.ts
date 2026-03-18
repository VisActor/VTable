import type { BaseTableAPI, ListTable, pluginsDefinition, TYPES } from '@visactor/vtable';
import { TABLE_EVENT_TYPE } from '@visactor/vtable';
import type { TableEventHandlersEventArgumentMap } from '@visactor/vtable/es/ts-types/events';
import { captureCellPreChangeContent, parseA1Notation, popCellPreChangeContent } from './formula';
import { replayCommand } from './replay';
import { captureSnapshot, cloneDeep, cloneRecord } from './snapshot';
import { resolveSheetKey } from './sheet-key';
import { FilterActionType } from '../filter/types';
import type {
  AddColumnCommand,
  AddRecordCommand,
  CellChange,
  CellCommand,
  ChangeHeaderPositionCommand,
  DeleteColumnCommand,
  DeleteRecordCommand,
  FilterCommand,
  HistoryCommand,
  HistoryPluginOptions,
  HistoryTransaction,
  MergeCellsCommand,
  ResizeColumnCommand,
  ResizeRowCommand,
  SortCommand,
  UpdateRecordCommand
} from './types';

/**
 * HistoryPlugin
 *
 * 目标：为 VTable / VTableSheet 提供可撤销/恢复（undo/redo）的历史栈管理。
 *
 * 设计要点：
 * - 以 “命令（HistoryCommand）” 作为最小回放单元；以 “事务（HistoryTransaction）” 作为一次 undo/redo 的原子操作。
 * - 通过监听 table 的运行时事件，把用户操作转换为命令并 push 到 undoStack。
 * - undo 时按逆序回放事务命令；redo 时按正序回放事务命令。
 * - 回放期间（isReplaying）会屏蔽事件采集，避免回放动作再次写入历史栈。
 */
export class HistoryPlugin implements pluginsDefinition.IVTablePlugin {
  /**
   * 插件唯一标识（pluginManager 用它做索引）。
   */
  id = 'history-plugin';
  /**
   * 插件名称（pluginManager 可用它做展示/检索）。
   */
  name = 'History';

  /**
   * 该插件关心的运行时事件列表。
   * VTable 会在这些事件发生时调用本插件的 run(...)。
   */
  runTime: any[] = [
    TABLE_EVENT_TYPE.BEFORE_INIT,
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
    TABLE_EVENT_TYPE.SORT_CLICK,
    TABLE_EVENT_TYPE.RESIZE_ROW,
    TABLE_EVENT_TYPE.RESIZE_ROW_END,
    TABLE_EVENT_TYPE.RESIZE_COLUMN,
    TABLE_EVENT_TYPE.RESIZE_COLUMN_END
  ];

  /**
   * 当前绑定的 table 实例（vtable-sheet 下为内部的 ListTable）。
   * 该插件只对 ListTable 生效。
   */
  private table: ListTable | null = null;
  /**
   * vtable-sheet 宿主对象引用（通过 table.__vtableSheet 注入）。
   * 用于访问公式引擎、worksheet eventManager 等。
   */
  private vtableSheet: any;
  /**
   * 当前表格对应的 sheetKey（vtable-sheet 多工作表场景）。
   * 该值会被缓存，避免频繁解析。
   */
  private resolvedSheetKey: string | undefined;

  /**
   * 撤销栈：栈顶为最近一次可撤销事务。
   */
  private undoStack: HistoryTransaction[] = [];
  /**
   * 重做栈：栈顶为最近一次可重做事务。
   * 新命令写入后会清空 redoStack。
   */
  private redoStack: HistoryTransaction[] = [];
  /**
   * 当前事务（可选）：用于把一组命令打包成一次 undo/redo。
   */
  private currentTransaction: HistoryTransaction | null = null;
  /**
   * 标记当前是否处于回放中（undo/redo 期间）。
   * 回放期间需要屏蔽事件采集，避免“回放导致的新事件”再次写入历史栈。
   */
  private isReplaying = false;

  /**
   * 最大保留历史事务数量（超过后会丢弃最早的）。
   */
  private maxHistory: number;
  /**
   * 是否启用命令压缩（比如连续编辑同一单元格合并为一条命令）。
   */
  private enableCompression: boolean;
  private onTransactionPushed?: HistoryPluginOptions['onTransactionPushed'];

  /**
   * 上一次快照的 columns（用于计算 add/delete column 的差异与回放）。
   */
  private prevColumnsSnapshot: TYPES.ColumnDefine[] | null = null;
  /**
   * 上一次快照的合并单元格配置（用于 merge/unmerge 的回放）。
   */
  private prevMergeSnapshot: TYPES.CustomMergeCellArray | undefined;
  /**
   * 上一次快照的 records（用于 update_record 的 oldRecords 生成等）。
   */
  private prevRecordsSnapshot: any[] | null = null;
  /**
   * 上一次快照的公式表（A1 -> formula），用于删除列撤销时恢复公式关系。
   */
  private prevFormulasSnapshot: Record<string, string> | null = null;
  /**
   * 上一次快照的“被用户调整过的行高”（key 为表格 rowIndex）。
   */
  private prevResizedRowHeightsSnapshot: Record<number, number> | null = null;
  /**
   * 上一次快照的“被用户调整过的列宽”（key 为表格 colIndex）。
   */
  private prevResizedColWidthsSnapshot: Record<number, number> | null = null;

  /**
   * 用于 sort 命令采集的“最近一次稳定排序状态”。
   * 注意：ListTable 在触发 SORT_CLICK 事件前可能会原地改写 internalProps.sortState，
   * 因此不能在 SORT_CLICK 回调里直接读取 internalProps.sortState 来作为 oldSortState，
   * 需要用该缓存值表示“排序前”的状态。
   */
  private lastKnownSortState: TYPES.SortState | TYPES.SortState[] | null = null;
  /**
   * sort 命令采集：一次排序开始时记录的 oldSortState（来自 lastKnownSortState）。
   */
  private sortStartSnapshot: TYPES.SortState | TYPES.SortState[] | null = null;
  /**
   * sort 命令采集：标记一次 SORT_CLICK 已发生，等待 DataSource 的 change_order 事件落盘命令。
   */
  private sortPending = false;
  /**
   * sort 事件监听是否已绑定（绑定在 table.dataSource 上）。
   */
  private sortEventBound = false;
  /**
   * DataSource change_order 事件订阅 id（用于解绑）。
   */
  private sortChangeOrderListenerId: any;

  /**
   * 单元格编辑前的内容缓存（key 形如 `${sheetKey}:${row}:${col}`）。
   * CHANGE_CELL_VALUE 先采集旧值，CHANGE_CELL_VALUES 再批量生成命令。
   */
  private cellPreChangeContent: Map<string, any> = new Map();
  /**
   * 公式缓存（用于处理 formula_added 这类“异步追加公式”的事件链）。
   */
  private formulaCache: Map<string, string | undefined> = new Map();
  /**
   * 公式事件是否已绑定（绑定在 worksheet.eventManager 上）。
   */
  private formulaEventBound = false;
  /**
   * worksheet.eventManager 引用，用于解绑 formula_added。
   */
  private formulaEventManager: any;
  /**
   * formula_added 的事件处理函数引用（用于解绑）。
   */
  private onFormulaAddedHandler: any;

  /**
   * 行高调整起始高度（RESIZE_ROW -> RESIZE_ROW_END 用于形成 oldHeight/newHeight）。
   */
  private resizeRowStartHeight: Map<number, number> = new Map();
  /**
   * 列宽调整起始宽度（RESIZE_COLUMN -> RESIZE_COLUMN_END 用于形成 oldWidth/newWidth）。
   */
  private resizeColStartWidth: Map<number, number> = new Map();

  /**
   * Filter 相关绑定是否已完成。
   *
   * FilterPlugin 的筛选状态变更不一定会映射成 TABLE_EVENT_TYPE（例如点击筛选面板的应用/清除），
   * 因此 HistoryPlugin 需要自行“订阅 FilterPlugin 的状态变化”并把快照差异转成可 undo/redo 的命令。
   */
  private filterEventBound = false;
  /**
   * FilterPlugin.filterStateManager 的订阅取消函数（如果 subscribe 可用）。
   *
   * 用于捕获来自 UI/交互产生的 filter action（APPLY_FILTERS/CLEAR_ALL_FILTERS/REMOVE_FILTER/DISABLE_FILTER）。
   */
  private filterUnsubscribe: (() => void) | null = null;
  /**
   * 最近一次已知的 filter snapshot（用于生成 oldSnapshot/newSnapshot）。
   *
   * 由于 FilterPlugin 的状态变更可能来自：
   * - 直接调用 filter.applyFilterSnapshot（声明式设置）
   * - UI 触发的 filterStateManager action
   * 这里缓存一个“上一帧”快照，用来在变化发生时构造历史命令的差异。
   */
  private filterSnapshotCache: any;
  /**
   * FilterPlugin 的 plugin id（用于回放时从 pluginManager 定位到同一个插件实例）。
   */
  private filterPluginId: string | undefined;
  /**
   * FilterPlugin 实例引用（用于在解绑时恢复被包裹的 applyFilterSnapshot）。
   */
  private filterPluginRef: any;
  /**
   * FilterPlugin.applyFilterSnapshot 的原始实现（被 ensureFilterEventBindings 包裹前的函数）。
   *
   * 我们包裹 applyFilterSnapshot 的目的：
   * - 捕获“声明式 snapshot 设置”带来的状态变化，并确保一定能生成一条 filter 历史命令；
   * - 避免只依赖 stateManager.subscribe（初始化时机/未就绪时可能漏记）。
   */
  private filterApplySnapshotOriginal: any;
  /**
   * applyFilterSnapshot 包裹函数执行中的保护标记。
   *
   * 作用：
   * - 避免包裹 applyFilterSnapshot 时，内部又触发 stateManager.subscribe 导致重复入栈；
   * - 在包裹函数 finally 中统一更新 filterSnapshotCache，保持 old/new 计算正确。
   */
  private filterApplyingSnapshot = false;

  /**
   * @param options 插件配置：maxHistory / enableCompression 等。
   */
  constructor(options?: HistoryPluginOptions) {
    this.id = options?.id ?? this.id;
    this.maxHistory = options?.maxHistory ?? 100;
    this.enableCompression = options?.enableCompression ?? false;
    this.onTransactionPushed = options?.onTransactionPushed;
  }

  /**
   * VTable 插件协议入口：由 VTable 在运行时事件触发时调用。
   *
   * @param args
   * - args[0] 事件参数（不同 runtime 对应不同 shape）
   * - args[1] runtime（事件类型）
   * - args[2] table 实例
   *
   * 行为：
   * - 首次绑定 table / vtableSheet，并初始化快照状态与 lastKnownSortState。
   * - 确保公式事件与排序事件已绑定（仅绑定一次）。
   * - 如果 isReplaying 为 true，直接返回，避免回放再入栈。
   * - 根据 runtime 分发到对应 handler，生成并 push 命令。
   * - 每次事件后刷新快照，用于下一次计算 old/new 差异。
   */
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
      if (runtime !== TABLE_EVENT_TYPE.BEFORE_INIT && (table as any).internalProps?.dataSource) {
        const state = this.getSnapshotState();
        const sheetKey = this.getSheetKey();
        captureSnapshot(table, state, {
          formulaManager: this.vtableSheet?.formulaManager,
          sheetKey
        });
        this.setSnapshotState(state);
        this.lastKnownSortState = this.normalizeSortState((table as any).internalProps?.sortState);
      }
    } else if (!this.vtableSheet) {
      this.vtableSheet = (table as any).__vtableSheet;
    }

    this.ensureFilterEventBindings();
    if (runtime === TABLE_EVENT_TYPE.BEFORE_INIT) {
      return;
    }
    this.ensureFormulaEventBindings();
    this.ensureSortEventBindings();

    const workbookReplaying = (this.table as any)?.__vtableSheet?.__workbookHistoryReplaying;
    if (this.isReplaying || workbookReplaying) {
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
      case TABLE_EVENT_TYPE.SORT_CLICK:
        this.handleSortClick(eventArgs);
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

  /**
   * 开始一个事务：后续 pushCommand 会写入 currentTransaction.commands，
   * 直到 endTransaction() 才一次性压入 undoStack。
   */
  startTransaction(): void {
    if (this.currentTransaction) {
      return;
    }
    this.currentTransaction = { commands: [] };
  }

  /**
   * 结束当前事务：若事务内无命令则丢弃；否则压入 undoStack 并清空 redoStack。
   */
  endTransaction(): void {
    if (!this.currentTransaction || this.currentTransaction.commands.length === 0) {
      this.currentTransaction = null;
      return;
    }
    this.pushTransaction(this.currentTransaction);
    this.currentTransaction = null;
  }

  /**
   * 撤销一次：弹出 undoStack 栈顶事务，并按逆序回放其命令。
   * 回放完成后将该事务压入 redoStack。
   */
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

  /**
   * 重做一次：弹出 redoStack 栈顶事务，并按正序回放其命令。
   * 回放完成后将该事务压入 undoStack。
   */
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
  /**
   * 清空历史：会清空 undo/redo，并中止当前事务。
   */

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.currentTransaction = null;
  }
  /**
   * 动态更新插件配置。
   */

  updateOptions(options: Partial<HistoryPluginOptions>): void {
    if (options.maxHistory != null) {
      this.maxHistory = options.maxHistory;
      this.trimHistory();
    }
    if (options.enableCompression != null) {
      this.enableCompression = options.enableCompression;
    }
    if (options.onTransactionPushed) {
      this.onTransactionPushed = options.onTransactionPushed;
    }
  }

  /**
   * 释放插件：解绑事件、清空栈与缓存，并断开与 table/vtableSheet 的引用。
   */
  release(): void {
    this.clear();
    this.unbindFormulaEvents();
    this.unbindSortEvents();
    this.unbindFilterEvents();
    this.table = null;
    this.vtableSheet = null;
    this.resolvedSheetKey = undefined;
    this.prevColumnsSnapshot = null;
    this.prevMergeSnapshot = undefined;
    this.prevRecordsSnapshot = null;
    this.prevFormulasSnapshot = null;
    this.prevResizedRowHeightsSnapshot = null;
    this.prevResizedColWidthsSnapshot = null;
    this.lastKnownSortState = null;
    this.sortStartSnapshot = null;
    this.sortPending = false;
    this.sortEventBound = false;
    this.sortChangeOrderListenerId = undefined;
    this.cellPreChangeContent.clear();
    this.formulaCache.clear();
    this.resizeRowStartHeight.clear();
    this.resizeColStartWidth.clear();
    this.filterEventBound = false;
    this.filterUnsubscribe = null;
    this.filterSnapshotCache = undefined;
    this.filterPluginId = undefined;
  }

  private ensureFilterEventBindings(): void {
    if (!this.table) {
      return;
    }
    const pm = (this.table as any).pluginManager;
    const filterPlugin =
      pm?.getPlugin?.('filter') ??
      pm?.getPluginByName?.('Filter') ??
      pm?.getPlugin?.('filter-plugin') ??
      pm?.getPluginByName?.('filter-plugin');
    if (!filterPlugin?.getFilterSnapshot || !filterPlugin?.applyFilterSnapshot) {
      return;
    }

    /**
     * 绑定策略（两个入口互补）：
     * 1) 包裹 filter.applyFilterSnapshot：
     *    - 任何“声明式设置 snapshot”都会经过这里；
     *    - 可以直接比较 oldSnapshot/newSnapshot 并 push 一条 filter 命令；
     *    - 不依赖 filterStateManager.subscribe 的就绪时机。
     *
     * 2) 订阅 filter.filterStateManager（如果可用）：
     *    - 覆盖 UI 交互（例如筛选面板点击“确认/清除”）触发的 action；
     *    - 通过 action.type 过滤出真正会改变筛选状态的动作，再根据快照差异 push 命令。
     */
    if (!this.filterEventBound) {
      this.filterEventBound = true;
      this.filterPluginRef = filterPlugin;
      this.filterPluginId = filterPlugin.id ?? 'filter';
      this.filterSnapshotCache = cloneDeep(filterPlugin.getFilterSnapshot());
    }

    if (!this.filterApplySnapshotOriginal) {
      this.filterApplySnapshotOriginal = filterPlugin.applyFilterSnapshot?.bind(filterPlugin);
      if (this.filterApplySnapshotOriginal) {
        filterPlugin.applyFilterSnapshot = (snapshot: any): any => {
          if (this.isReplaying) {
            return this.filterApplySnapshotOriginal(snapshot);
          }
          const oldSnapshot = this.filterSnapshotCache ?? filterPlugin.getFilterSnapshot();
          this.filterApplyingSnapshot = true;
          try {
            return this.filterApplySnapshotOriginal(snapshot);
          } finally {
            this.filterApplyingSnapshot = false;
            const newSnapshot = filterPlugin.getFilterSnapshot();
            if (JSON.stringify(oldSnapshot) !== JSON.stringify(newSnapshot)) {
              const cmd: FilterCommand = {
                type: 'filter',
                sheetKey: this.getSheetKey(),
                pluginId: this.filterPluginId ?? 'filter',
                oldSnapshot,
                newSnapshot
              };
              this.pushCommand(cmd as any as HistoryCommand);
              this.filterSnapshotCache = cloneDeep(newSnapshot);
            } else {
              this.filterSnapshotCache = cloneDeep(newSnapshot);
            }
          }
        };
      }
    }

    const stateManager = filterPlugin?.filterStateManager;
    if (!this.filterUnsubscribe && stateManager?.subscribe) {
      this.filterUnsubscribe = stateManager.subscribe((_state: any, action: any) => {
        if (this.isReplaying) {
          return;
        }
        if (this.filterApplyingSnapshot) {
          this.filterSnapshotCache = cloneDeep(filterPlugin.getFilterSnapshot());
          return;
        }

        const t = action?.type;
        if (
          t !== FilterActionType.APPLY_FILTERS &&
          t !== FilterActionType.CLEAR_ALL_FILTERS &&
          t !== FilterActionType.REMOVE_FILTER &&
          t !== FilterActionType.DISABLE_FILTER
        ) {
          return;
        }

        const oldSnapshot = this.filterSnapshotCache ?? filterPlugin.getFilterSnapshot();
        const newSnapshot = filterPlugin.getFilterSnapshot();
        if (JSON.stringify(oldSnapshot) === JSON.stringify(newSnapshot)) {
          return;
        }

        const cmd: FilterCommand = {
          type: 'filter',
          sheetKey: this.getSheetKey(),
          pluginId: this.filterPluginId ?? 'filter',
          oldSnapshot,
          newSnapshot
        };
        this.pushCommand(cmd as any as HistoryCommand);
        this.filterSnapshotCache = cloneDeep(newSnapshot);
      });
    }
  }

  private unbindFilterEvents(): void {
    /**
     * 解绑策略：
     * - 取消 stateManager.subscribe（如果曾订阅）
     * - 恢复被包裹的 filter.applyFilterSnapshot 原始实现
     * - 清空缓存/标记，确保 release 后不会继续响应旧实例事件
     */
    this.filterUnsubscribe?.();
    this.filterUnsubscribe = null;
    this.filterEventBound = false;
    if (this.filterPluginRef && this.filterApplySnapshotOriginal) {
      this.filterPluginRef.applyFilterSnapshot = this.filterApplySnapshotOriginal;
    }
    this.filterPluginRef = null;
    this.filterApplySnapshotOriginal = null;
    this.filterApplyingSnapshot = false;
  }

  /**
   * 获取当前 sheetKey（vtable-sheet 场景）。
   * 内部使用 resolveSheetKey 做缓存更新。
   */
  private getSheetKey(): string | undefined {
    const resolved = resolveSheetKey({
      vtableSheet: this.vtableSheet,
      table: this.table,
      cached: this.resolvedSheetKey
    });
    this.resolvedSheetKey = resolved.cached;
    return resolved.sheetKey;
  }

  /**
   * 读取当前快照 state（用于 captureSnapshot 的输入/输出）。
   */
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

  /**
   * 写入快照 state（captureSnapshot 后调用）。
   */
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

  /**
   * 压入一个事务到 undoStack（并清空 redoStack）。
   */
  private pushTransaction(tx: HistoryTransaction): void {
    // console.trace('pushTransaction');
    if (tx.commands.length === 0) {
      return;
    }
    this.undoStack.push(tx);
    this.redoStack = [];
    this.trimHistory();
    if (this.onTransactionPushed && !this.isReplaying) {
      const workbookReplaying = (this.table as any)?.__vtableSheet?.__workbookHistoryReplaying;
      if (!workbookReplaying) {
        this.onTransactionPushed({ tx, sheetKey: this.getSheetKey(), table: this.table ?? undefined });
      }
    }
  }

  /**
   * 修剪历史栈：保证 undoStack 不超过 maxHistory。
   */
  private trimHistory(): void {
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.splice(0, this.undoStack.length - this.maxHistory);
    }
  }

  /**
   * 压入一条命令：
   * - 若当前存在事务，则追加到事务中；
   * - 否则以单命令事务的形式压入 undoStack。
   */
  private pushCommand(cmd: HistoryCommand): void {
    if (this.currentTransaction) {
      this.currentTransaction.commands.push(cmd);
      return;
    }
    this.pushTransaction({ commands: [cmd] });
  }

  /**
   * 记录外部命令：用于其他插件/业务侧主动插入命令到历史栈。
   */
  recordExternalCommand(cmd: HistoryCommand): void {
    if (this.isReplaying) {
      return;
    }
    this.pushCommand(cmd);
  }

  /**
   * 单元格变更压缩：用于“连续编辑同一格”的场景，把最新 newContent 合并进上一条 cell/cells 命令。
   */
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

  /**
   * 键盘快捷键：监听 Ctrl/Cmd + Z / Y。
   * - Ctrl/Cmd + Z：undo
   * - Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y：redo
   * 会在公式输入/编辑器激活时跳过，避免干扰输入。
   */
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
      const workbookHistory = this.vtableSheet?.getWorkbookHistoryManager?.();
      if (e.shiftKey) {
        workbookHistory ? workbookHistory.redo() : this.redo();
      } else {
        workbookHistory ? workbookHistory.undo() : this.undo();
      }
      e.preventDefault();
      e.stopPropagation();
    } else if (key === 'y') {
      const workbookHistory = this.vtableSheet?.getWorkbookHistoryManager?.();
      workbookHistory ? workbookHistory.redo() : this.redo();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * 单格编辑“变更前”采集：用于在 CHANGE_CELL_VALUES 阶段拿到 oldContent。
   * CHANGE_CELL_VALUE 事件通常在编辑开始/值即将改变时触发。
   */
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

  /**
   * 单元格批量变更：生成 cells 命令并入栈。
   * 处理逻辑：
   * - 根据 preChangeContent 取 oldContent，fallback 使用 currentValue
   * - 对公式输入/显示值等场景做过滤，避免重复记录
   * - 如果允许压缩，尝试合并到上一条命令
   */
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

  /**
   * 绑定 vtable-sheet 的公式事件（worksheet.eventManager）。
   * 当前用于监听 formula_added，把“公式变更”也纳入历史栈。
   */
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

  /**
   * 绑定排序事件（DataSource.change_order）。
   * 采集时机：
   * - SORT_CLICK：记录 oldSortState（来自 lastKnownSortState），并设置 sortPending=true
   * - change_order：排序数据真正发生变化后触发，在这里落盘 sort 命令，并更新 lastKnownSortState
   *
   * 这样设计的原因：
   * - ListTable 在 fire SORT_CLICK 前可能已经原地改写 internalProps.sortState，
   *   不能依赖 SORT_CLICK 时读取 internalProps.sortState 来当 oldSortState。
   */
  private ensureSortEventBindings(): void {
    if (!this.table || this.sortEventBound) {
      return;
    }
    const ds: any = (this.table as any).internalProps?.dataSource;
    if (!ds?.on || !ds?.off) {
      return;
    }
    this.sortEventBound = true;
    this.sortChangeOrderListenerId = ds.on('change_order', () => {
      if (this.isReplaying || !this.table || !this.sortPending) {
        return;
      }
      const sheetKey = this.getSheetKey();
      const oldSortState = this.sortStartSnapshot;
      this.sortStartSnapshot = null;
      this.sortPending = false;
      const newSortState = this.normalizeSortState((this.table as any).internalProps?.sortState);
      if (JSON.stringify(oldSortState) === JSON.stringify(newSortState)) {
        this.lastKnownSortState = newSortState;
        return;
      }
      const cmd: SortCommand = {
        type: 'sort',
        sheetKey,
        oldSortState: oldSortState as any,
        newSortState: newSortState as any
      };
      this.pushCommand(cmd);
      this.lastKnownSortState = newSortState;
    });
  }

  /**
   * 解绑 DataSource 的排序事件监听。
   */
  private unbindSortEvents(): void {
    if (!this.sortEventBound) {
      return;
    }
    const ds: any = (this.table as any)?.internalProps?.dataSource;
    try {
      if (ds?.off && this.sortChangeOrderListenerId) {
        ds.off(this.sortChangeOrderListenerId);
      }
    } catch {
    } finally {
      this.sortEventBound = false;
      this.sortChangeOrderListenerId = undefined;
      this.sortPending = false;
      this.sortStartSnapshot = null;
    }
  }

  /**
   * 解绑 worksheet 的公式事件监听。
   */
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

  /**
   * 合并单元格配置深拷贝：避免引用被后续修改污染历史命令。
   */
  private cloneMergeConfig(input: any): any {
    if (Array.isArray(input)) {
      return input.map(i => cloneDeep(i));
    }
    return input;
  }

  /**
   * 判断两个合并配置是否一致（用于去重：避免重复入栈）。
   */
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

  /**
   * merge_cells 事件处理：抽象到 handleMergeConfigChanged。
   */
  private handleMergeCells(eventArgs: TableEventHandlersEventArgumentMap['merge_cells']): void {
    this.handleMergeConfigChanged(eventArgs);
  }

  /**
   * unmerge_cells 事件处理：抽象到 handleMergeConfigChanged。
   */
  private handleUnmergeCells(eventArgs: TableEventHandlersEventArgumentMap['unmerge_cells']): void {
    this.handleMergeConfigChanged(eventArgs);
  }

  /**
   * 合并配置变更统一处理：对比 prevMergeSnapshot 与当前 table.options.customMergeCell，
   * 生成 merge_cells 命令入栈。
   */
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

  /**
   * 添加行：记录新增 records 与插入位置。
   */
  private handleAddRecord(eventArgs: TableEventHandlersEventArgumentMap['add_record']): void {
    const sheetKey = this.getSheetKey();
    const cmd: AddRecordCommand = {
      type: 'add_record',
      sheetKey,
      records: Array.isArray(eventArgs.records) ? eventArgs.records.slice() : [],
      recordIndex: eventArgs.recordIndex,
      recordCount: eventArgs.recordCount ?? (Array.isArray(eventArgs.records) ? eventArgs.records.length : 0)
    };
    if (this.table && typeof eventArgs.recordIndex === 'number') {
      const start = eventArgs.recordIndex;
      const count = cmd.recordCount;
      const ds: any = (this.table as any)?.internalProps?.dataSource;
      const rawRecords: any[] | undefined = ds?.dataSourceObj?.records;
      const viewRecords = (this.table as any).records as any[];
      if (Array.isArray(viewRecords) && viewRecords.length) {
        cmd.anchorBefore = start > 0 ? viewRecords[start - 1] : undefined;
        cmd.anchorAfter = viewRecords[start + count];
      }
      if (Array.isArray(rawRecords) && Array.isArray(viewRecords)) {
        let rawInsertIndex = rawRecords.length;
        if (viewRecords.length === 0) {
          rawInsertIndex = rawRecords.length;
        } else if (start <= 0) {
          const first = viewRecords[0];
          const idx = rawRecords.indexOf(first);
          rawInsertIndex = idx >= 0 ? idx : 0;
        } else if (start >= viewRecords.length) {
          const last = viewRecords[viewRecords.length - 1];
          const idx = rawRecords.indexOf(last);
          rawInsertIndex = idx >= 0 ? idx + 1 : rawRecords.length;
        } else {
          const prev = viewRecords[start - 1];
          const idx = rawRecords.indexOf(prev);
          rawInsertIndex = idx >= 0 ? idx + 1 : rawRecords.length;
        }
        cmd.rawInsertIndex = rawInsertIndex;
      }
    }
    this.pushCommand(cmd);
  }

  /**
   * 删除行：记录被删除的 records 与 index 列表；必要时记录被删除行的自定义行高与合并配置快照。
   */
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

  /**
   * 更新行：从 prevRecordsSnapshot 生成 oldRecords，与本次 newRecords / recordIndexs 形成 update_record 命令。
   */
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

  /**
   * 添加列：从 columns 快照中提取新增列定义，生成 add_column 命令。
   */
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

  /**
   * 删除列：记录被删除的列定义、二维数组 records 场景下被 splice 掉的列值、
   * 以及 vtable-sheet 场景下被删除列对应的公式与列宽信息，生成 delete_column 命令。
   */
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

  /**
   * 调整表头位置（拖拽列/行顺序）：记录 sourceIndex/targetIndex 与移动类型（row/column）。
   */
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

  /**
   * 把内部 sortState 归一化为可序列化且稳定的结构。
   * - 过滤掉 order=normal 的项（等价于“不参与排序”）
   * - 多列排序时返回数组；单列排序时返回对象；无排序时返回 null
   */
  private normalizeSortState(input: any): TYPES.SortState | TYPES.SortState[] | null {
    if (!input) {
      return null;
    }
    if (Array.isArray(input)) {
      const list = input
        .filter(Boolean)
        .map((s: any) => ({ field: s.field, order: s.order }))
        .filter((s: any) => typeof s.field !== 'undefined' && s.order && s.order !== 'normal');
      return list.length ? (list as any) : null;
    }
    const s = input as any;
    if (typeof s.field === 'undefined' || !s.order || s.order === 'normal') {
      return null;
    }
    return { field: s.field, order: s.order } as any;
  }

  /**
   * SORT_CLICK：记录排序开始前的 oldSortState（来自 lastKnownSortState），并标记 sortPending。
   * 实际的命令落盘在 DataSource.change_order 回调里完成。
   *
   * 同时设置一个 0ms 的兜底清理：如果用户在 SORT_CLICK 回调里返回 false 取消了排序，
   * 则不会有 change_order 事件，此时要清空 sortPending/sortStartSnapshot 防止污染后续操作。
   */
  private handleSortClick(_eventArgs: TableEventHandlersEventArgumentMap['sort_click']): void {
    if (!this.table) {
      return;
    }
    this.sortStartSnapshot = this.lastKnownSortState;
    this.sortPending = true;
    setTimeout(() => {
      if (this.sortPending) {
        this.sortPending = false;
        this.sortStartSnapshot = null;
      }
    }, 0);
  }

  /**
   * RESIZE_ROW：记录起始行高（用于 end 阶段计算 oldHeight/newHeight）。
   */
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

  /**
   * RESIZE_ROW_END：生成 resize_row 命令入栈。
   */
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

  /**
   * RESIZE_COLUMN：记录起始列宽（用于 end 阶段计算 oldWidth/newWidth）。
   */
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

  /**
   * RESIZE_COLUMN_END：生成 resize_column 命令入栈。
   */
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

  /**
   * 回放单条命令：统一委托给 replayCommand（集中管理回放逻辑）。
   */
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

  /**
   * 按“引用匹配”删除记录：用于 add_record 撤销时找不到确定 index 的场景。
   * 注意：要求 table.records 与命令中 records 仍然保持引用一致。
   */
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
