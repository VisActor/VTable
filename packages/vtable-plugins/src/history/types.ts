import type { ListTable, TYPES } from '@visactor/vtable';

export interface HistoryPluginOptions {
  id?: string;
  maxHistory?: number;
  enableCompression?: boolean;
  onTransactionPushed?: (args: { tx: HistoryTransaction; sheetKey?: string; table?: ListTable }) => void;
}

// 命令是 HistoryPlugin 最小回放单元；事务（transaction）是一次 undo/redo 的原子操作。
export type HistoryCommandType =
  | 'cell'
  | 'cells'
  | 'merge_cells'
  | 'filter'
  | 'sort'
  | 'add_record'
  | 'delete_record'
  | 'update_record'
  | 'add_column'
  | 'delete_column'
  | 'change_header_position'
  | 'resize_row'
  | 'resize_column';

export interface CellChange {
  row: number;
  col: number;
  oldContent: any;
  newContent: any;
}

export interface BaseCommand {
  type: HistoryCommandType;
  sheetKey?: string;
}

export interface CellCommand extends BaseCommand {
  type: 'cell' | 'cells';
  cells: CellChange[];
}

export interface MergeCellsCommand extends BaseCommand {
  type: 'merge_cells';
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
  oldCustomMergeCell: any;
  newCustomMergeCell: any;
}

export interface FilterCommand extends BaseCommand {
  type: 'filter';
  pluginId: string;
  oldSnapshot: any;
  newSnapshot: any;
}

export interface SortCommand extends BaseCommand {
  type: 'sort';
  oldSortState: TYPES.SortState | TYPES.SortState[] | null;
  newSortState: TYPES.SortState | TYPES.SortState[] | null;
}

export interface AddRecordCommand extends BaseCommand {
  type: 'add_record';
  records: any[];
  recordIndex?: number | number[];
  recordCount: number;
  rawInsertIndex?: number;
  anchorBefore?: any;
  anchorAfter?: any;
}

export interface DeleteRecordCommand extends BaseCommand {
  type: 'delete_record';
  records: any[];
  recordIndexs: (number | number[])[];
  deletedRowHeights?: Record<number, number>;
  oldCustomMergeCell?: any;
  newCustomMergeCell?: any;
}

export interface UpdateRecordCommand extends BaseCommand {
  type: 'update_record';
  oldRecords: any[];
  newRecords: any[];
  recordIndexs: (number | number[])[];
}

export interface AddColumnCommand extends BaseCommand {
  type: 'add_column';
  columnIndex: number;
  columnCount: number;
  columns: TYPES.ColumnDefine[];
}

export interface DeleteColumnCommand extends BaseCommand {
  type: 'delete_column';
  deleteColIndexs: number[];
  columns: TYPES.ColumnDefine[];
  // 仅二维数组 records 场景需要：恢复被 splice 掉的列值。
  deletedRecordValues?: any[][];
  // vtable-sheet 场景需要：恢复被删除列上的公式关系（A1 -> formula）。
  deletedFormulas?: Record<string, string>;
  deletedColWidths?: Record<number, number>;
}

export interface ChangeHeaderPositionCommand extends BaseCommand {
  type: 'change_header_position';
  moving: 'column' | 'row';
  sourceIndex: number;
  targetIndex: number;
}

export interface ResizeRowCommand extends BaseCommand {
  type: 'resize_row';
  row: number;
  oldHeight: number;
  newHeight: number;
}

export interface ResizeColumnCommand extends BaseCommand {
  type: 'resize_column';
  col: number;
  oldWidth: number;
  newWidth: number;
}

export type HistoryCommand =
  | CellCommand
  | MergeCellsCommand
  | FilterCommand
  | SortCommand
  | AddRecordCommand
  | DeleteRecordCommand
  | UpdateRecordCommand
  | AddColumnCommand
  | DeleteColumnCommand
  | ChangeHeaderPositionCommand
  | ResizeRowCommand
  | ResizeColumnCommand;

export interface HistoryTransaction {
  commands: HistoryCommand[];
}
