import type { Sheet } from '../core/Sheet';
import type { CellRange } from '../ts-types';

/**
 * 动作类型关于撤销/重做
 */
interface Action {
  type: string;
  undo: () => void;
  redo: () => void;
}

export class StateManager {
  /** Sheet实例 */
  private sheet: Sheet;
  /** 撤销栈 */
  private undoStack: Action[] = [];
  /** 重做栈 */
  private redoStack: Action[] = [];
  /** 最大撤销栈大小 */
  private maxUndoStackSize = 100;
  /** 当前选择 */
  private currentSelection: CellRange | null = null;
  /** 是否正在编辑 */
  private isEditing = false;
  /** 正在编辑的单元格 */
  private editingCell: { row: number; col: number } | null = null;

  constructor(sheet: Sheet) {
    this.sheet = sheet;
  }

  /**
   * 将新动作推入撤销栈
   * @param action 要推入的动作
   */
  pushAction(action: Action): void {
    this.undoStack.push(action);

    // 清空重做栈
    this.redoStack = [];

    // 限制撤销栈大小
    if (this.undoStack.length > this.maxUndoStackSize) {
      this.undoStack.shift();
    }
  }

  /**
   * 撤销最后一个动作
   */
  undo(): void {
    //   if (this.undoStack.length === 0) {
    //     return;
    //   }
    //   const action = this.undoStack.pop()!;
    //   action.undo();
    //   this.redoStack.push(action);
    //   // Fire undo event
    //   this.sheet.fire('undo', action.type);
    // }
    // /**
    //  * Redoes the last undone action
    //  */
    // redo(): void {
    //   if (this.redoStack.length === 0) {
    //     return;
    //   }
    //   const action = this.redoStack.pop()!;
    //   action.redo();
    //   this.undoStack.push(action);
    //   // Fire redo event
    //   this.sheet.fire('redo', action.type);
    // }
  }

  /**
   * 获取当前选择
   * @returns 当前选择
   */
  getSelection(): CellRange | null {
    return this.currentSelection;
  }

  /**
   * 设置当前选择
   * @param range 选择范围
   */
  setSelection(range: CellRange): void {
    const oldSelection = this.currentSelection;
    this.currentSelection = range;

    // // Fire selection change event
    // this.sheet.fire('selectionChanged', {
    //   oldSelection,
    //   newSelection: range
    // });
  }

  /**
   * 检查是否正在编辑单元格
   * @returns 是否正在编辑单元格
   */
  isEditingCell(): boolean {
    return this.isEditing;
  }

  /**
   * 获取正在编辑的单元格
   * @returns 正在编辑的单元格
   */
  getEditingCell(): { row: number; col: number } | null {
    return this.editingCell;
  }

  /**
   * 开始编辑单元格
   * @param row 行索引
   * @param col 列索引
   */
  startEditing(row: number, col: number): void {
    if (this.isEditing) {
      this.stopEditing();
    }

    this.isEditing = true;
    this.editingCell = { row, col };

    // // Fire edit start event
    // this.sheet.fire('editStart', { row, col });
  }

  /**
   * 停止编辑当前单元格
   * @param cancel 是否取消编辑（丢弃更改）
   */
  stopEditing(cancel = false): void {
    if (!this.isEditing || !this.editingCell) {
      return;
    }

    const { row, col } = this.editingCell;
    this.isEditing = false;
    this.editingCell = null;

    // // Fire edit stop event
    // this.sheet.fire('editStop', { row, col, cancel });
  }

  /**
   * 创建单元格值更改动作
   * @param row 行索引
   * @param col 列索引
   * @param oldValue 旧单元格值
   * @param newValue 新单元格值
   */
  createCellValueChangeAction(row: number, col: number, oldValue: any, newValue: any): Action {
    return {
      type: 'cellValueChange',
      undo: () => {
        this.sheet.setCellValue(row, col, oldValue);
      },
      redo: () => {
        this.sheet.setCellValue(row, col, newValue);
      }
    };
  }

  /**
   * 创建行插入动作
   * @param index 行索引
   * @param data 行数据
   */
  createInsertRowAction(index: number, data: any[]): Action {
    return {
      type: 'insertRow',
      undo: () => {
        this.sheet.deleteRow(index);
      },
      redo: () => {
        this.sheet.insertRow(index, data);
      }
    };
  }

  /**
   * 创建列插入动作
   * @param index 列索引
   * @param data 列数据
   */
  createInsertColumnAction(index: number, data: any[]): Action {
    return {
      type: 'insertColumn',
      undo: () => {
        this.sheet.deleteColumn(index);
      },
      redo: () => {
        this.sheet.insertColumn(index, data);
      }
    };
  }

  /**
   * 创建行删除动作
   * @param index 行索引
   * @param data 行数据（用于恢复）
   */
  createDeleteRowAction(index: number, data: any[]): Action {
    return {
      type: 'deleteRow',
      undo: () => {
        this.sheet.insertRow(index, data);
      },
      redo: () => {
        this.sheet.deleteRow(index);
      }
    };
  }

  /**
   * 创建列删除动作
   * @param index 列索引
   * @param data 列数据（用于恢复）
   */
  createDeleteColumnAction(index: number, data: any[]): Action {
    return {
      type: 'deleteColumn',
      undo: () => {
        this.sheet.insertColumn(index, data);
      },
      redo: () => {
        this.sheet.deleteColumn(index);
      }
    };
  }
}
