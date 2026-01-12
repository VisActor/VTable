/**
 * 电子表格事件类型定义
 *
 * 事件架构：
 * 1. Table 层事件 - 通过 VTableSheet.onTableEvent() 直接监听 VTable 原生事件
 * 2. WorkSheet 层事件 - 工作表级别的状态和操作事件（本文件定义）
 * 3. SpreadSheet 层事件 - 电子表格应用级别的事件（本文件定义）
 */

import type { CellCoord, CellRange, CellValue } from './base';

/**
 * ============================================
 * WorkSheet 层事件（待实现）
 * ============================================
 */

/**
 * WorkSheet 层事件类型枚举
 * 工作表级别的状态和操作事件
 *
 * 注意：这些事件由 WorkSheet 自身触发，不是从 tableInstance 中转
 */
export enum WorkSheetEventType {
  // ===== 工作表状态事件 =====
  /** 工作表被激活 */
  ACTIVATED = 'worksheet:activated',
  /** 工作表被停用 */
  DEACTIVATED = 'worksheet:deactivated',
  /** 工作表初始化完成 */
  READY = 'worksheet:ready',
  /** 工作表尺寸改变 */
  RESIZED = 'worksheet:resized',

  // ===== 公式相关事件 =====
  /** 公式计算开始 */
  FORMULA_CALCULATE_START = 'worksheet:formula_calculate_start',
  /** 公式计算结束 */
  FORMULA_CALCULATE_END = 'worksheet:formula_calculate_end',
  /** 公式计算错误 */
  FORMULA_ERROR = 'worksheet:formula_error',
  /** 公式依赖关系改变 */
  FORMULA_DEPENDENCY_CHANGED = 'worksheet:formula_dependency_changed',
  /** 单元格公式添加 */
  FORMULA_ADDED = 'worksheet:formula_added',
  /** 单元格公式移除 */
  FORMULA_REMOVED = 'worksheet:formula_removed',

  // ===== 数据操作事件 =====
  /** 数据加载完成 */
  DATA_LOADED = 'worksheet:data_loaded',
  /** 数据排序完成 */
  DATA_SORTED = 'worksheet:data_sorted',
  /** 数据筛选完成 */
  DATA_FILTERED = 'worksheet:data_filtered',
  /** 范围数据批量变更 */
  RANGE_DATA_CHANGED = 'worksheet:range_data_changed'
}

/**
 * ============================================
 * SpreadSheet 层事件（待实现）
 * ============================================
 */

/**
 * SpreadSheet 层事件类型枚举
 * 电子表格应用级别的事件
 */
export enum SpreadSheetEventType {
  // ===== 电子表格生命周期 =====
  /** 电子表格初始化完成 */
  READY = 'spreadsheet:ready',
  /** 电子表格销毁 */
  DESTROYED = 'spreadsheet:destroyed',
  /** 电子表格大小改变 */
  RESIZED = 'spreadsheet:resized',

  // ===== Sheet 管理事件 =====
  /** 添加新 Sheet */
  SHEET_ADDED = 'spreadsheet:sheet_added',
  /** 删除 Sheet */
  SHEET_REMOVED = 'spreadsheet:sheet_removed',
  /** 重命名 Sheet */
  SHEET_RENAMED = 'spreadsheet:sheet_renamed',
  /** 激活 Sheet（切换 Sheet） */
  SHEET_ACTIVATED = 'spreadsheet:sheet_activated',
  /** Sheet 顺序移动 */
  SHEET_MOVED = 'spreadsheet:sheet_moved',
  /** Sheet 显示/隐藏 */
  SHEET_VISIBILITY_CHANGED = 'spreadsheet:sheet_visibility_changed',

  // ===== 导入导出事件 =====
  /** 开始导入 */
  IMPORT_START = 'spreadsheet:import_start',
  /** 导入完成 */
  IMPORT_COMPLETED = 'spreadsheet:import_completed',
  /** 导入失败 */
  IMPORT_ERROR = 'spreadsheet:import_error',
  /** 开始导出 */
  EXPORT_START = 'spreadsheet:export_start',
  /** 导出完成 */
  EXPORT_COMPLETED = 'spreadsheet:export_completed',
  /** 导出失败 */
  EXPORT_ERROR = 'spreadsheet:export_error',

  // ===== 跨 Sheet 操作事件 =====
  /** 跨 Sheet 引用更新 */
  CROSS_SHEET_REFERENCE_UPDATED = 'spreadsheet:cross_sheet_reference_updated',
  /** 跨 Sheet 公式计算开始 */
  CROSS_SHEET_FORMULA_CALCULATE_START = 'spreadsheet:cross_sheet_formula_calculate_start',
  /** 跨 Sheet 公式计算结束 */
  CROSS_SHEET_FORMULA_CALCULATE_END = 'spreadsheet:cross_sheet_formula_calculate_end'
}

/**
 * ============================================
 * WorkSheet 层事件数据接口
 * ============================================
 */

/** 工作表激活事件数据 */
export interface WorkSheetActivatedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
}

/** 公式计算事件数据 */
export interface FormulaCalculateEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 计算的公式数量 */
  formulaCount?: number;
  /** 耗时（毫秒） */
  duration?: number;
}

/** 公式错误事件数据 */
export interface FormulaErrorEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 单元格位置 */
  cell: CellCoord & { sheet: string };
  /** 公式 */
  formula: string;
  /** 错误信息 */
  error: string | Error;
}

/** 公式添加/移除事件数据 */
export interface FormulaChangeEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 单元格位置 */
  cell: CellCoord;
  /** 公式内容 */
  formula?: string;
}

/** 数据加载事件数据 */
export interface DataLoadedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 行数 */
  rowCount: number;
  /** 列数 */
  colCount: number;
}

/** 范围数据变更事件数据 */
export interface RangeDataChangedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 变更范围 */
  range: CellRange;
  /** 变更的单元格数据 */
  changes: Array<{
    row: number;
    col: number;
    oldValue: CellValue;
    newValue: CellValue;
  }>;
}

/**
 * ============================================
 * SpreadSheet 层事件数据接口
 * ============================================
 */

/** Sheet 添加事件数据 */
export interface SheetAddedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** Sheet 索引 */
  index: number;
}

/** Sheet 移除事件数据 */
export interface SheetRemovedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** 原 Sheet 索引 */
  index: number;
}

/** Sheet 重命名事件数据 */
export interface SheetRenamedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 旧标题 */
  oldTitle: string;
  /** 新标题 */
  newTitle: string;
}

/** Sheet 激活事件数据 */
export interface SheetActivatedEvent {
  /** 新激活的 Sheet Key */
  sheetKey: string;
  /** 新激活的 Sheet 标题 */
  sheetTitle: string;
  /** 之前激活的 Sheet Key */
  previousSheetKey?: string;
  /** 之前激活的 Sheet 标题 */
  previousSheetTitle?: string;
}

/** Sheet 移动事件数据 */
export interface SheetMovedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 旧索引 */
  fromIndex: number;
  /** 新索引 */
  toIndex: number;
}

/** Sheet 可见性改变事件数据 */
export interface SheetVisibilityChangedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 是否可见 */
  visible: boolean;
}

/** 导入事件数据 */
export interface ImportEvent {
  /** 导入的文件类型 */
  fileType: 'xlsx' | 'xls' | 'csv';
  /** 导入的 Sheet 数量 */
  sheetCount?: number;
  /** 错误信息（如果有） */
  error?: string | Error;
}

/** 导出事件数据 */
export interface ExportEvent {
  /** 导出的文件类型 */
  fileType: 'xlsx' | 'csv';
  /** 导出的 Sheet 数量 */
  sheetCount?: number;
  /** 是否导出所有 Sheet */
  allSheets: boolean;
  /** 错误信息（如果有） */
  error?: string | Error;
}

/** 跨 Sheet 引用更新事件数据 */
export interface CrossSheetReferenceEvent {
  /** 源 Sheet Key */
  sourceSheetKey: string;
  /** 目标 Sheet Keys */
  targetSheetKeys: string[];
  /** 影响的公式数量 */
  affectedFormulaCount: number;
}

/**
 * ============================================
 * 事件映射表（待实现时使用）
 * ============================================
 */

/** WorkSheet 层事件映射 */
export interface WorkSheetEventMap {
  [WorkSheetEventType.ACTIVATED]: WorkSheetActivatedEvent;
  [WorkSheetEventType.DEACTIVATED]: WorkSheetActivatedEvent;
  [WorkSheetEventType.READY]: WorkSheetActivatedEvent;
  [WorkSheetEventType.FORMULA_CALCULATE_START]: FormulaCalculateEvent;
  [WorkSheetEventType.FORMULA_CALCULATE_END]: FormulaCalculateEvent;
  [WorkSheetEventType.FORMULA_ERROR]: FormulaErrorEvent;
  [WorkSheetEventType.FORMULA_ADDED]: FormulaChangeEvent;
  [WorkSheetEventType.FORMULA_REMOVED]: FormulaChangeEvent;
  [WorkSheetEventType.DATA_LOADED]: DataLoadedEvent;
  [WorkSheetEventType.RANGE_DATA_CHANGED]: RangeDataChangedEvent;
}

/** SpreadSheet 层事件映射 */
export interface SpreadSheetEventMap {
  [SpreadSheetEventType.READY]: void;
  [SpreadSheetEventType.DESTROYED]: void;
  [SpreadSheetEventType.RESIZED]: { width: number; height: number };
  [SpreadSheetEventType.SHEET_ADDED]: SheetAddedEvent;
  [SpreadSheetEventType.SHEET_REMOVED]: SheetRemovedEvent;
  [SpreadSheetEventType.SHEET_RENAMED]: SheetRenamedEvent;
  [SpreadSheetEventType.SHEET_ACTIVATED]: SheetActivatedEvent;
  [SpreadSheetEventType.SHEET_MOVED]: SheetMovedEvent;
  [SpreadSheetEventType.SHEET_VISIBILITY_CHANGED]: SheetVisibilityChangedEvent;
  [SpreadSheetEventType.IMPORT_START]: ImportEvent;
  [SpreadSheetEventType.IMPORT_COMPLETED]: ImportEvent;
  [SpreadSheetEventType.IMPORT_ERROR]: ImportEvent;
  [SpreadSheetEventType.EXPORT_START]: ExportEvent;
  [SpreadSheetEventType.EXPORT_COMPLETED]: ExportEvent;
  [SpreadSheetEventType.EXPORT_ERROR]: ExportEvent;
  [SpreadSheetEventType.CROSS_SHEET_REFERENCE_UPDATED]: CrossSheetReferenceEvent;
  [SpreadSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_START]: void;
  [SpreadSheetEventType.CROSS_SHEET_FORMULA_CALCULATE_END]: void;
}
