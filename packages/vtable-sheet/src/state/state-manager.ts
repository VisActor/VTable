import type { Sheet } from '../core/Sheet';
import type { CellRange } from '../ts-types';

/**
 * Action type for the undo/redo stack
 */
interface Action {
  type: string;
  undo: () => void;
  redo: () => void;
}

/**
 * Manages state and undo/redo history for the Sheet component
 */
export class StateManager {
  private sheet: Sheet;
  private undoStack: Action[] = [];
  private redoStack: Action[] = [];
  private maxUndoStackSize = 100;
  private currentSelection: CellRange | null = null;
  private isEditing = false;
  private editingCell: { row: number; col: number } | null = null;

  /**
   * Creates a new StateManager instance
   * @param sheet The Sheet instance
   */
  constructor(sheet: Sheet) {
    this.sheet = sheet;
  }

  /**
   * Pushes a new action to the undo stack
   * @param action Action to push
   */
  pushAction(action: Action): void {
    this.undoStack.push(action);

    // Clear redo stack when a new action is performed
    this.redoStack = [];

    // Limit undo stack size
    if (this.undoStack.length > this.maxUndoStackSize) {
      this.undoStack.shift();
    }
  }

  /**
   * Undoes the last action
   */
  undo(): void {
    if (this.undoStack.length === 0) {
      return;
    }

    const action = this.undoStack.pop()!;
    action.undo();
    this.redoStack.push(action);

    // Fire undo event
    this.sheet.fire('undo', action.type);
  }

  /**
   * Redoes the last undone action
   */
  redo(): void {
    if (this.redoStack.length === 0) {
      return;
    }

    const action = this.redoStack.pop()!;
    action.redo();
    this.undoStack.push(action);

    // Fire redo event
    this.sheet.fire('redo', action.type);
  }

  /**
   * Gets the current cell selection
   */
  getSelection(): CellRange | null {
    return this.currentSelection;
  }

  /**
   * Sets the current cell selection
   * @param range Selection range
   */
  setSelection(range: CellRange): void {
    const oldSelection = this.currentSelection;
    this.currentSelection = range;

    // Fire selection change event
    this.sheet.fire('selectionChanged', {
      oldSelection,
      newSelection: range
    });
  }

  /**
   * Checks if a cell is currently being edited
   */
  isEditingCell(): boolean {
    return this.isEditing;
  }

  /**
   * Gets the cell currently being edited
   */
  getEditingCell(): { row: number; col: number } | null {
    return this.editingCell;
  }

  /**
   * Starts editing a cell
   * @param row Row index
   * @param col Column index
   */
  startEditing(row: number, col: number): void {
    if (this.isEditing) {
      this.stopEditing();
    }

    this.isEditing = true;
    this.editingCell = { row, col };

    // Fire edit start event
    this.sheet.fire('editStart', { row, col });
  }

  /**
   * Stops editing the current cell
   * @param cancel Whether to cancel editing (discard changes)
   */
  stopEditing(cancel = false): void {
    if (!this.isEditing || !this.editingCell) {
      return;
    }

    const { row, col } = this.editingCell;
    this.isEditing = false;
    this.editingCell = null;

    // Fire edit stop event
    this.sheet.fire('editStop', { row, col, cancel });
  }

  /**
   * Creates a cell value change action
   * @param row Row index
   * @param col Column index
   * @param oldValue Old cell value
   * @param newValue New cell value
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
   * Creates a row insert action
   * @param index Row index
   * @param data Row data
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
   * Creates a column insert action
   * @param index Column index
   * @param data Column data
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
   * Creates a row delete action
   * @param index Row index
   * @param data Row data (for restoration)
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
   * Creates a column delete action
   * @param index Column index
   * @param data Column data (for restoration)
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
