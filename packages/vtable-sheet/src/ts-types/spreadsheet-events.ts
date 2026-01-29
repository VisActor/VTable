/**
 * 电子表格事件类型定义
 *
 * 统一事件架构：
 * 所有事件通过统一的 VTableSheetEventType 枚举定义
 * 用户只需使用 on() 和 off() 方法，无需区分事件层级
 * 事件命名使用下划线格式，移除不必要的前缀区分
 */

import type { CellCoord, CellRange, CellValue } from './base';

/**
 * 排序信息接口
 */
export interface SortInfo {
  /** 排序字段 */
  field: string;
  /** 排序方向 */
  order: 'asc' | 'desc';
  /** 排序的列索引 */
  col: number;
}

/**
 * 筛选信息接口
 */
export interface FilterInfo {
  /** 筛选的列 */
  col: number;
  /** 筛选条件 */
  conditions: FilterCondition[];
}

/**
 * 筛选条件
 */
export interface FilterCondition {
  /** 条件类型 */
  type: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  /** 条件值 */
  value: string | number | [number, number];
}

/**
 * 范围接口
 */
export interface Range {
  /** 起始行 */
  startRow: number;
  /** 结束行 */
  endRow: number;
  /** 起始列 */
  startCol: number;
  /** 结束列 */
  endCol: number;
}

/**
 * 统一的 VTableSheet 事件类型枚举
 * 包含所有工作表和电子表格级别的事件
 *
 * 命名规范：
 * - 使用下划线命名法 (snake_case)
 * - 按功能模块分组
 * - 避免冗余前缀，保持简洁
 *
 * 注意：新增事件时，请同步更新以下常量定义
 */
export enum VTableSheetEventType {
  // ===== 公式相关事件 =====
  /** 公式计算开始 */
  FORMULA_CALCULATE_START = 'formula_calculate_start',
  /** 公式计算结束 */
  FORMULA_CALCULATE_END = 'formula_calculate_end',
  /** 公式计算错误 */
  FORMULA_ERROR = 'formula_error',
  /** 公式依赖关系改变 */
  FORMULA_DEPENDENCY_CHANGED = 'formula_dependency_changed',
  /** 单元格公式添加 */
  FORMULA_ADDED = 'formula_added',
  /** 单元格公式移除 */
  FORMULA_REMOVED = 'formula_removed',

  // ===== 数据操作事件 =====
  /** 数据加载完成 */
  DATA_LOADED = 'data_loaded',

  // ===== 电子表格生命周期 =====
  /** 电子表格初始化完成 */
  SPREADSHEET_READY = 'spreadsheet_ready',
  /** 电子表格销毁 */
  SPREADSHEET_DESTROYED = 'spreadsheet_destroyed',
  /** 电子表格大小改变 */
  SPREADSHEET_RESIZED = 'spreadsheet_resized',

  // ===== Sheet 管理事件 =====
  /** 添加新 Sheet */
  SHEET_ADDED = 'sheet_added',
  /** 删除 Sheet */
  SHEET_REMOVED = 'sheet_removed',
  /** 重命名 Sheet */
  SHEET_RENAMED = 'sheet_renamed',
  /** 激活 Sheet（切换 Sheet） */
  SHEET_ACTIVATED = 'sheet_activated',
  /** Sheet 停用 */
  SHEET_DEACTIVATED = 'sheet_deactivated',
  /** Sheet 顺序移动 */
  SHEET_MOVED = 'sheet_moved',
  /** Sheet 显示/隐藏 */
  SHEET_VISIBILITY_CHANGED = 'sheet_visibility_changed',

  // ===== 导入导出事件 =====
  /** 开始导入 */
  IMPORT_START = 'import_start',
  /** 导入完成 */
  IMPORT_COMPLETED = 'import_completed',
  /** 导入失败 */
  IMPORT_ERROR = 'import_error',
  /** 开始导出 */
  EXPORT_START = 'export_start',
  /** 导出完成 */
  EXPORT_COMPLETED = 'export_completed',
  /** 导出失败 */
  EXPORT_ERROR = 'export_error',

  // ===== 跨 Sheet 操作事件 =====
  /** 跨 Sheet 引用更新 */
  CROSS_SHEET_REFERENCE_UPDATED = 'cross_sheet_reference_updated',
  /** 跨 Sheet 公式计算开始 */
  CROSS_SHEET_FORMULA_CALCULATE_START = 'cross_sheet_formula_calculate_start',
  /** 跨 Sheet 公式计算结束 */
  CROSS_SHEET_FORMULA_CALCULATE_END = 'cross_sheet_formula_calculate_end'
}

/**
 * ============================================
 * 事件定义集中化管理
 * 新增事件时只需要修改这里
 * ============================================
 */

/** WorkSheet 层支持的事件类型列表 */
export const WORKSHEET_EVENT_TYPES = [
  'formula_calculate_start',
  'formula_calculate_end',
  'formula_error',
  'formula_dependency_changed',
  'formula_added',
  'formula_removed',
  'data_loaded',
  'data_sorted',
  'data_filtered'
] as const;

/** SpreadSheet 层支持的事件类型列表 */
export const SPREADSHEET_EVENT_TYPES = [
  'spreadsheet_ready',
  'spreadsheet_destroyed',
  'spreadsheet_resized',
  'sheet_added',
  'sheet_removed',
  'sheet_renamed',
  'sheet_activated',
  'sheet_deactivated',
  'sheet_moved',
  'sheet_visibility_changed',
  'import_start',
  'import_completed',
  'import_error',
  'export_start',
  'export_completed',
  'export_error',
  'cross_sheet_reference_updated',
  'cross_sheet_formula_calculate_start',
  'cross_sheet_formula_calculate_end'
] as const;

// /** 所有支持的事件类型 */
// export const ALL_EVENT_TYPES = [...WORKSHEET_EVENT_TYPES, ...SPREADSHEET_EVENT_TYPES] as const;

// /** 事件类型类型定义 */
// export type WorkSheetEventType = (typeof WORKSHEET_EVENT_TYPES)[number];
// export type SpreadSheetEventType = (typeof SPREADSHEET_EVENT_TYPES)[number];
// export type AllEventType = (typeof ALL_EVENT_TYPES)[number];

/**
 * ============================================
 * 统一事件数据接口
 * ============================================
 */

/** 工作表激活事件数据 */
export interface SheetActivatedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** 之前激活的 Sheet Key */
  previousSheetKey?: string;
  /** 之前激活的 Sheet 标题 */
  previousSheetTitle?: string;
}

/** 工作表尺寸改变事件数据 */
export interface SheetResizedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
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

/** 公式依赖关系改变事件数据 */
export interface FormulaDependencyChangedEvent {
  /** Sheet Key */
  sheetKey: string;
}

/** 数据排序事件数据 */
export interface DataSortedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 排序信息 */
  sortInfo: SortInfo;
}

/** 数据筛选事件数据 */
export interface DataFilteredEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 筛选信息 */
  filterInfo: FilterInfo;
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

/** 工作表添加事件数据 */
export interface SheetAddedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** Sheet 索引 */
  index: number;
}

/** 工作表移除事件数据 */
export interface SheetRemovedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** Sheet 标题 */
  sheetTitle: string;
  /** 原 Sheet 索引 */
  index: number;
}

/** 工作表重命名事件数据 */
export interface SheetRenamedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 旧标题 */
  oldTitle: string;
  /** 新标题 */
  newTitle: string;
}

/** 工作表移动事件数据 */
export interface SheetMovedEvent {
  /** Sheet Key */
  sheetKey: string;
  /** 旧索引 */
  fromIndex: number;
  /** 新索引 */
  toIndex: number;
}

/** 工作表可见性改变事件数据 */
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
 * SpreadSheet 事件映射
 */
export interface SpreadSheetEventMap {
  spreadsheet_ready: undefined;
  spreadsheet_destroyed: undefined;
  spreadsheet_resized: { width: number; height: number };
  sheet_added: SheetAddedEvent;
  sheet_removed: SheetRemovedEvent;
  sheet_renamed: SheetRenamedEvent;
  sheet_activated: SheetActivatedEvent;
  sheet_deactivated: SheetActivatedEvent;
  sheet_moved: SheetMovedEvent;
  sheet_visibility_changed: SheetVisibilityChangedEvent;
  import_start: ImportEvent;
  import_completed: ImportEvent;
  import_error: ImportEvent;
  export_start: ExportEvent;
  export_completed: ExportEvent;
  export_error: ExportEvent;
  cross_sheet_reference_updated: CrossSheetReferenceEvent;
  cross_sheet_formula_calculate_start: undefined;
  cross_sheet_formula_calculate_end: undefined;
}

/**
 * WorkSheet 事件映射
 */
export interface WorkSheetEventMap {
  formula_calculate_start: FormulaCalculateEvent;
  formula_calculate_end: FormulaCalculateEvent;
  formula_error: FormulaErrorEvent;
  formula_dependency_changed: FormulaDependencyChangedEvent;
  formula_added: FormulaChangeEvent;
  formula_removed: FormulaChangeEvent;
  data_loaded: DataLoadedEvent;
  sheet_added: SheetAddedEvent;
  sheet_removed: SheetRemovedEvent;
  sheet_renamed: SheetRenamedEvent;
  sheet_moved: SheetMovedEvent;
  sheet_activated: SheetActivatedEvent;
  sheet_deactivated: SheetActivatedEvent;
  sheet_visibility_changed: SheetVisibilityChangedEvent;
  import_start: ImportEvent;
  import_completed: ImportEvent;
  import_error: ImportEvent;
  export_start: ExportEvent;
  export_completed: ExportEvent;
  export_error: ExportEvent;
  cross_sheet_reference_updated: CrossSheetReferenceEvent;
  cross_sheet_formula_calculate_start: undefined;
  cross_sheet_formula_calculate_end: undefined;
}
