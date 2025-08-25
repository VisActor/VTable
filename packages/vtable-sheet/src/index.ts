import VTableSheet from './components/vtable-sheet';
import SheetManager from './managers/sheet-manager';
import { FormulaManager } from './managers/formula-manager';
import { FilterManager } from './managers/filter-manager';
import * as tools from './tools';
import type { ISheetDefine, IVTableSheetOptions } from './ts-types';
import * as TYPES from './ts-types';
export const version = '1.0.0';

// 添加防止重复计算的节流实现
class FormulaThrottle {
  private static instance: FormulaThrottle;
  private recalcTimer: number | null = null;
  private pendingRecalc = false;
  private throttleDelay = 150; // ms

  static getInstance(): FormulaThrottle {
    if (!FormulaThrottle.instance) {
      FormulaThrottle.instance = new FormulaThrottle();
    }
    return FormulaThrottle.instance;
  }

  /**
   * 节流方式调用公式重建和重新计算
   * @param formulaManager 公式管理器实例
   */
  throttledRebuildAndRecalculate(formulaManager: FormulaManager): void {
    if (!formulaManager) {
      return;
    }

    // 如果有定时器正在等待，直接返回
    if (this.recalcTimer !== null) {
      this.pendingRecalc = true;
      return;
    }

    // 如果没有待处理的重新计算，执行一次，然后设置定时器
    if (!this.pendingRecalc) {
      try {
        formulaManager.rebuildAndRecalculate();
      } catch (e) {
        console.warn('Error during formula rebuild and recalculate:', e);
      }
    }

    this.pendingRecalc = false;
    this.recalcTimer = window.setTimeout(() => {
      this.recalcTimer = null;
      if (this.pendingRecalc) {
        try {
          formulaManager.rebuildAndRecalculate();
          this.pendingRecalc = false;
        } catch (e) {
          console.warn('Error during formula rebuild and recalculate in timer:', e);
        }
      }
    }, this.throttleDelay);
  }

  /**
   * 立即执行一次计算，并取消任何待处理的计算
   * @param formulaManager 公式管理器实例
   */
  immediateRebuildAndRecalculate(formulaManager: FormulaManager): void {
    if (!formulaManager) {
      return;
    }

    // 清除任何待处理的计时器
    if (this.recalcTimer !== null) {
      window.clearTimeout(this.recalcTimer);
      this.recalcTimer = null;
    }

    this.pendingRecalc = false;

    try {
      formulaManager.rebuildAndRecalculate();
    } catch (e) {
      console.warn('Error during immediate formula rebuild and recalculate:', e);
    }
  }
}

/**
 * @namespace VTableSheet
 */
export { tools, VTableSheet, SheetManager, FormulaManager, FilterManager, FormulaThrottle };

export type { ISheetDefine, IVTableSheetOptions };
export { TYPES };
export default VTableSheet;
