/**
 * Table 事件中转器
 * 核心功能：
 * 1. 在 VTableSheet 层注册事件监听器
 * 2. 在每个 WorkSheet 初始化时，自动绑定事件到其 tableInstance
 * 3. 当事件触发时，自动附带 sheetKey 信息
 */

import type { ListTable } from '@visactor/vtable';
import type VTableSheet from '../components/vtable-sheet';

type EventCallback = (...args: any[]) => void;

interface EventHandler {
  callback: EventCallback;
}

/**
 * 增强的事件对象，自动附带 sheetKey
 */
export interface EnhancedTableEvent {
  /** 触发事件的 sheet key */
  sheetKey: string;
  /** 原始 VTable 事件的所有属性 */
  [key: string]: any;
}

/**
 * Table 事件中转器类（用于 VTableSheet）
 *
 * 在 VTableSheet 层统一管理所有 sheet 的 table 事件
 * 当任何 sheet 触发事件时，自动附带 sheetKey 信息
 */
export class TableEventRelay {
  /** 事件映射表 - 存储用户注册的监听器 */
  private _tableEventMap: Record<string, EventHandler[]> = {};

  /** VTableSheet 引用 */
  private vtableSheet: VTableSheet;

  constructor(vtableSheet: VTableSheet) {
    this.vtableSheet = vtableSheet;
  }

  /**
   * 注册 Table 事件监听器（在 VTableSheet 层）
   *
   * 会监听所有 sheet 的 tableInstance 事件，并在回调时自动附带 sheetKey
   *
   * @example
   * ```typescript
   * // 在 VTableSheet 层注册
   * sheet.onTableEvent('click_cell', (event) => {
   *   // event.sheetKey 告诉你是哪个 sheet
   *   // event 的其他属性是原始 VTable 事件
   *   console.log(`Sheet ${event.sheetKey} 的单元格 [${event.row}, ${event.col}] 被点击`);
   * });
   * ```
   */
  onTableEvent(type: string, callback: EventCallback): void {
    if (!this._tableEventMap[type]) {
      this._tableEventMap[type] = [];
    }

    this._tableEventMap[type].push({ callback });

    // 为所有已存在的 sheet 绑定事件
    this.bindToAllSheets(type);
  }

  /**
   * 移除 Table 事件监听器
   *
   * @param type 事件类型
   * @param callback 回调函数（可选，不传则移除该类型的所有监听器）
   */
  offTableEvent(type: string, callback?: EventCallback): void {
    if (!this._tableEventMap[type]) {
      return;
    }

    if (!callback) {
      // 移除所有监听器
      delete this._tableEventMap[type];
      // 从所有 sheet 解绑
      this.unbindFromAllSheets(type);
    } else {
      // 移除特定监听器
      const index = this._tableEventMap[type].findIndex(h => h.callback === callback);
      if (index >= 0) {
        this._tableEventMap[type].splice(index, 1);

        if (this._tableEventMap[type].length === 0) {
          delete this._tableEventMap[type];
          // 从所有 sheet 解绑
          this.unbindFromAllSheets(type);
        }
      }
    }
  }

  /**
   * 为特定 sheet 绑定事件
   * 在 WorkSheet 初始化时调用
   *
   * @param sheetKey sheet 的 key
   * @param tableInstance VTable 的 ListTable 实例
   * @internal
   */
  bindSheetEvents(sheetKey: string, tableInstance: ListTable): void {
    // 为这个 sheet 绑定所有已注册的事件
    for (const eventType in this._tableEventMap) {
      this.bindSheetEvent(sheetKey, tableInstance, eventType);
    }
  }

  /**
   * 为特定 sheet 绑定单个事件类型
   *
   * @param sheetKey sheet 的 key
   * @param tableInstance VTable 的 ListTable 实例
   * @param eventType 事件类型
   * @private
   */
  private bindSheetEvent(sheetKey: string, tableInstance: ListTable, eventType: string): void {
    const handlers = this._tableEventMap[eventType] || [];

    handlers.forEach(handler => {
      // 创建包装函数，自动附带 sheetKey
      const wrappedCallback = (...args: any[]) => {
        // 增强事件对象，添加 sheetKey
        const enhancedEvent: EnhancedTableEvent = {
          sheetKey: sheetKey,
          ...args[0] // 原始事件对象的所有属性
        };

        // 调用用户的回调，传入增强后的事件对象
        handler.callback(enhancedEvent, ...args.slice(1));
      };

      // 保存包装函数的引用，用于后续解绑
      (handler as any)[`_wrapped_${sheetKey}`] = wrappedCallback;

      // 绑定到 tableInstance（VTable 的 on 方法不支持 query 参数）
      tableInstance.on(eventType as any, wrappedCallback);
    });
  }

  /**
   * 为所有已存在的 sheet 绑定事件
   * 在用户注册新事件时调用
   *
   * @param eventType 事件类型
   * @private
   */
  private bindToAllSheets(eventType: string): void {
    this.vtableSheet.workSheetInstances.forEach((worksheet, sheetKey) => {
      if (worksheet.tableInstance) {
        this.bindSheetEvent(sheetKey, worksheet.tableInstance, eventType);
      }
    });
  }

  /**
   * 从特定 sheet 解绑事件
   * 在 WorkSheet 销毁时调用
   *
   * @param sheetKey sheet 的 key
   * @param tableInstance VTable 的 ListTable 实例
   * @internal
   */
  unbindSheetEvents(sheetKey: string, tableInstance: ListTable): void {
    // 解绑所有事件
    for (const eventType in this._tableEventMap) {
      const handlers = this._tableEventMap[eventType] || [];

      handlers.forEach(handler => {
        const wrappedCallback = (handler as any)[`_wrapped_${sheetKey}`];
        if (wrappedCallback) {
          tableInstance.off(eventType as any, wrappedCallback);
          delete (handler as any)[`_wrapped_${sheetKey}`];
        }
      });
    }
  }

  /**
   * 从所有 sheet 解绑特定事件类型
   *
   * @param eventType 事件类型
   * @private
   */
  private unbindFromAllSheets(eventType: string): void {
    this.vtableSheet.workSheetInstances.forEach((worksheet, sheetKey) => {
      if (worksheet.tableInstance) {
        const handlers = this._tableEventMap[eventType] || [];
        handlers.forEach(handler => {
          const wrappedCallback = (handler as any)[`_wrapped_${sheetKey}`];
          if (wrappedCallback) {
            worksheet.tableInstance.off(eventType as any, wrappedCallback);
            delete (handler as any)[`_wrapped_${sheetKey}`];
          }
        });
      }
    });
  }

  /**
   * 获取所有已注册的事件类型
   */
  getRegisteredEventTypes(): string[] {
    return Object.keys(this._tableEventMap);
  }

  /**
   * 获取特定事件类型的监听器数量
   */
  getListenerCount(type: string): number {
    return this._tableEventMap[type]?.length || 0;
  }

  /**
   * 清除所有事件监听器
   */
  clearAllListeners(): void {
    // 从所有 sheet 解绑
    this.vtableSheet.workSheetInstances.forEach((worksheet, sheetKey) => {
      if (worksheet.tableInstance) {
        this.unbindSheetEvents(sheetKey, worksheet.tableInstance);
      }
    });

    this._tableEventMap = {};
  }
}
