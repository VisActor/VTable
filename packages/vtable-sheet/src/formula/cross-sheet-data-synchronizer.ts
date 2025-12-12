/**
 * 跨sheet数据同步器
 * 处理不同sheet之间的数据同步和更新通知
 */

import type { FormulaCell } from '../ts-types/formula';
import type { FormulaEngine } from './formula-engine';
import type { CrossSheetFormulaManager } from './cross-sheet-formula-manager';

export interface DataChangeEvent {
  sheet: string;
  cells: FormulaCell[];
  oldValues: any[];
  newValues: any[];
  timestamp: number;
}

export interface SyncOptions {
  immediate: boolean;
  batchSize: number;
  timeout: number;
}

export class CrossSheetDataSynchronizer {
  private formulaEngine: FormulaEngine;
  private crossSheetManager: CrossSheetFormulaManager;

  // 数据变更队列
  private changeQueue: DataChangeEvent[] = [];

  // 同步状态
  private isSyncing = false;
  private syncTimer: NodeJS.Timeout | null = null;

  // 同步选项
  private options: SyncOptions = {
    immediate: false,
    batchSize: 100,
    timeout: 50 // 50ms批处理
  };

  // 事件监听器
  private listeners: Map<string, Set<(event: DataChangeEvent) => void>> = new Map();

  constructor(formulaEngine: FormulaEngine, crossSheetManager: CrossSheetFormulaManager) {
    this.formulaEngine = formulaEngine;
    this.crossSheetManager = crossSheetManager;
  }

  /**
   * 注册数据变更
   */
  registerDataChange(sheet: string, cells: FormulaCell[], oldValues: any[], newValues: any[]): void {
    const event: DataChangeEvent = {
      sheet,
      cells,
      oldValues,
      newValues,
      timestamp: Date.now()
    };

    this.changeQueue.push(event);

    if (this.options.immediate) {
      this.processChanges();
    } else {
      this.scheduleSync();
    }
  }

  /**
   * 调度同步
   */
  private scheduleSync(): void {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
    }

    this.syncTimer = setTimeout(() => {
      this.processChanges();
    }, this.options.timeout);
  }

  /**
   * 处理数据变更
   */
  private async processChanges(): Promise<void> {
    if (this.isSyncing || this.changeQueue.length === 0) {
      return;
    }

    this.isSyncing = true;

    try {
      // 批量处理变更
      const batch = this.changeQueue.splice(0, this.options.batchSize);

      // 按sheet分组处理
      const changesBySheet = this.groupChangesBySheet(batch);

      for (const [targetSheet, changes] of changesBySheet.entries()) {
        await this.syncSheetChanges(targetSheet, changes);
      }

      // 触发事件
      for (const event of batch) {
        this.emitDataChange(event);
      }
    } catch (error) {
      console.error('Error processing cross-sheet data changes:', error);
    } finally {
      this.isSyncing = false;

      // 如果还有剩余的变更，继续处理
      if (this.changeQueue.length > 0) {
        this.scheduleSync();
      }
    }
  }

  /**
   * 按sheet分组变更
   */
  private groupChangesBySheet(events: DataChangeEvent[]): Map<string, DataChangeEvent[]> {
    const groups = new Map<string, DataChangeEvent[]>();

    for (const event of events) {
      const existing = groups.get(event.sheet) || [];
      existing.push(event);
      groups.set(event.sheet, existing);
    }

    return groups;
  }

  /**
   * 同步指定sheet的变更
   */
  private async syncSheetChanges(targetSheet: string, changes: DataChangeEvent[]): Promise<void> {
    // 收集所有变化的单元格
    const allChangedCells: FormulaCell[] = [];
    const allOldValues: any[] = [];
    const allNewValues: any[] = [];

    for (const change of changes) {
      allChangedCells.push(...change.cells);
      allOldValues.push(...change.oldValues);
      allNewValues.push(...change.newValues);
    }

    // 使用跨sheet管理器更新引用
    await this.crossSheetManager.updateCrossSheetReferences(targetSheet, allChangedCells);
  }

  /**
   * 获取跨sheet依赖关系
   */
  getCrossSheetDependencies(): Map<string, string[]> {
    const dependencies = new Map<string, string[]>();

    const allSheets = this.formulaEngine.getAllSheets();
    for (const sheetInfo of allSheets) {
      const deps = this.crossSheetManager.getCrossSheetDependencies(sheetInfo.key);
      const targetSheets = deps.map(dep => dep.precedentSheet);
      dependencies.set(sheetInfo.key, targetSheets);
    }

    return dependencies;
  }

  /**
   * 验证跨sheet引用的完整性
   */
  validateCrossSheetReferences(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const allSheets = this.formulaEngine.getAllSheets();

    for (const sheetInfo of allSheets) {
      const validation = this.crossSheetManager.validateCrossSheetReferences(sheetInfo.key);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }

      // 检查循环依赖
      const circularDeps = this.detectCircularDependencies(sheetInfo.key, new Set());
      if (circularDeps.length > 0) {
        errors.push(`Circular dependency detected in sheet ${sheetInfo.key}: ${circularDeps.join(' -> ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 检测循环依赖
   */
  private detectCircularDependencies(sheet: string, visited: Set<string>): string[] {
    if (visited.has(sheet)) {
      return [sheet];
    }

    visited.add(sheet);
    const dependencies = this.crossSheetManager.getCrossSheetDependencies(sheet);

    for (const dep of dependencies) {
      const cycle = this.detectCircularDependencies(dep.precedentSheet, new Set(visited));
      if (cycle.length > 0) {
        return [sheet, ...cycle];
      }
    }

    return [];
  }

  /**
   * 添加数据变更监听器
   */
  addDataChangeListener(sheet: string, listener: (event: DataChangeEvent) => void): void {
    if (!this.listeners.has(sheet)) {
      this.listeners.set(sheet, new Set());
    }
    this.listeners.get(sheet)!.add(listener);
  }

  /**
   * 移除数据变更监听器
   */
  removeDataChangeListener(sheet: string, listener: (event: DataChangeEvent) => void): void {
    const listeners = this.listeners.get(sheet);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(sheet);
      }
    }
  }

  /**
   * 触发数据变更事件
   */
  private emitDataChange(event: DataChangeEvent): void {
    const listeners = this.listeners.get(event.sheet);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in data change listener:', error);
        }
      }
    }

    // 也触发全局监听器
    const globalListeners = this.listeners.get('*');
    if (globalListeners) {
      for (const listener of globalListeners) {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in global data change listener:', error);
        }
      }
    }
  }

  /**
   * 强制立即同步
   */
  async forceSync(): Promise<void> {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
      this.syncTimer = null;
    }

    await this.processChanges();
  }

  /**
   * 清除同步队列
   */
  clearSyncQueue(): void {
    this.changeQueue = [];
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * 获取同步状态
   */
  getSyncStatus(): {
    pendingChanges: number;
    isSyncing: boolean;
    lastSyncTime: number | null;
  } {
    return {
      pendingChanges: this.changeQueue.length,
      isSyncing: this.isSyncing,
      lastSyncTime:
        this.changeQueue.length > 0 ? this.changeQueue[this.changeQueue.length - 1]?.timestamp || null : null
    };
  }

  /**
   * 更新同步选项
   */
  updateSyncOptions(options: Partial<SyncOptions>): void {
    this.options = { ...this.options, ...options };
  }

  /**
   * 销毁同步器
   */
  destroy(): void {
    this.clearSyncQueue();
    this.listeners.clear();
    this.crossSheetManager.clearCache();
  }
}
