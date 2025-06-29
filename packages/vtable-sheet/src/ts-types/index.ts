import type {
  ColumnDefine,
  ListTableAPI,
  ListTableConstructorOptions,
  CellAddress,
  HeaderDefine
} from '@visactor/vtable';

export interface FormulaCell {
  sheet: string;
  row: number;
  col: number;
}

export interface FormulaResult {
  value: any;
  error?: any;
}

/**
 * Cell data type enum
 */
export enum CellDataType {
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  FORMULA = 'formula'
}

/**
 * Selection mode enum
 */
export enum SelectionMode {
  CELL = 'cell',
  ROW = 'row',
  COLUMN = 'column',
  RANGE = 'range'
}

/**
 * Cell coordinates interface
 */
export interface CellCoord {
  row: number;
  col: number;
}

/**
 * Cell range interface
 */
export interface CellRange {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

/**
 * Cell value changed event
 */
export interface CellValueChangedEvent {
  row: number;
  col: number;
  oldValue: any;
  newValue: any;
  cellAddress?: string; // A1 format
}

/**
 * Formula calculation options
 */
export interface FormulaOptions {
  /**
   * Whether to enable formula calculations
   */
  enabled: boolean;

  /**
   * Custom formula functions
   */
  customFunctions?: Record<string, Function>;
}

/**
 * Sheet API interface
 */
export interface SheetAPI {
  /**
   * Get cell value at specified coordinates
   */
  getCellValue: (row: number, col: number) => any;

  /**
   * Set cell value at specified coordinates
   */
  setCellValue: (row: number, col: number, value: any) => void;

  /**
   * Get cell in A1 format
   */
  getCellByAddress: (address: string) => { row: number; col: number; value: any };

  /**
   * Convert row/col to A1 notation
   */
  addressFromCoord: (row: number, col: number) => string;

  /**
   * Convert A1 notation to row/col
   */
  coordFromAddress: (address: string) => CellCoord;

  /**
   * Get the current selection
   */
  getSelection: () => CellRange | null;

  /**
   * Set the current selection
   */
  setSelection: (range: CellRange) => void;

  /**
   * Insert a row at the specified index
   */
  insertRow: (index: number, data?: any[]) => void;

  /**
   * Insert a column at the specified index
   */
  insertColumn: (index: number, data?: any[]) => void;

  /**
   * Delete a row at the specified index
   */
  deleteRow: (index: number) => void;

  /**
   * Delete a column at the specified index
   */
  deleteColumn: (index: number) => void;

  /**
   * Import data from CSV
   */
  importFromCSV: (csv: string) => void;

  /**
   * Export data to CSV
   */
  exportToCSV: () => string;

  /**
   * Undo the last operation
   */
  undo: () => void;

  /**
   * Redo the last undone operation
   */
  redo: () => void;
  getData: () => any[][];
}

/**
 * 单个sheet的配置
 */
export interface SheetDefine {
  /** 标题 */
  sheetTitle: string;
  /** 唯一标识 */
  sheetKey: string;
  /** 列数 */
  columnCount?: number;
  /** 行数 */
  rowCount?: number;
  /** 表头定义 可以没有*/
  columns?: Omit<ColumnDefine, 'field'>[];
  /** 数据 */
  data?: (string | number | boolean | null)[][] | Record<string, any>[];
  /** 是否是当前活动sheet */
  active?: boolean;
  /** 单元格样式 */
  cellStyles?: Record<string, any>;
  /** 行样式 */
  rowStyles?: Record<string, any>;
  /** 列样式 */
  columnStyles?: Record<string, any>;
  /** 冻结行数 */
  frozenRowCount?: number;
  /** 冻结列数 */
  frozenColCount?: number;
  /** 是否显示表头 */
  showHeader?: boolean;
}

/**
 * VTableSheet配置
 */
export interface VTableSheetOptions {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /** Sheet列表 */
  sheets: SheetDefine[];
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示公式栏 */
  showFormulaBar?: boolean;
  /** 是否显示sheet切换栏 */
  showSheetTab?: boolean;
  /** 主题 */
  theme?: string | object;
  /** 默认行高 */
  defaultRowHeight?: number;
  /** 默认列宽 */
  defaultColWidth?: number;
}

/**
 * 单元格公式定义
 */
export interface CellFormula {
  /** 公式内容 */
  formula: string;
  /** 计算后的值 */
  value: any;
  /** 依赖的单元格 */
  dependencies: CellAddress[];
}

/**
 * 公式管理器接口
 */
export interface IFormulaManager {
  /** 注册公式 */
  registerFormula: (cell: CellAddress, formula: string) => void;
  /** 获取公式 */
  getFormula: (cell: CellAddress) => CellFormula | null;
  /** 计算公式 */
  evaluateFormula: (formula: string, context?: any) => any;
  /** 更新公式依赖单元格的值 */
  updateDependencies: (cell: CellAddress) => void;
  /** 获取依赖某个单元格的所有单元格 */
  getDependentCells: (cell: CellAddress) => CellAddress[];
  /** 检查循环依赖 */
  checkCircularDependency: (cell: CellAddress, formula: string) => boolean;
  /** 获取所有公式 */
  getAllFormulas: () => Record<string, CellFormula>;
  /** 导出公式 */
  exportFormulas: () => Record<string, string>;
  /** 导入公式 */
  importFormulas: (formulas: Record<string, string>) => void;
}

/**
 * 过滤条件类型
 */
export enum FilterType {
  /** 值列表过滤 */
  VALUE_LIST = 'valueList',
  /** 条件过滤 */
  CONDITION = 'condition'
}

/**
 * 过滤条件操作符
 */
export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'notEquals',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
  BETWEEN = 'between'
}

/**
 * 过滤值列表定义
 */
export interface ValueListFilter {
  type: FilterType.VALUE_LIST;
  values: any[];
  exclude?: boolean;
}

/**
 * 条件过滤定义
 */
export interface ConditionFilter {
  type: FilterType.CONDITION;
  operator: FilterOperator;
  value: any;
  value2?: any; // 用于between操作符
}

/**
 * 过滤定义
 */
export type Filter = ValueListFilter | ConditionFilter;

/**
 * 列过滤定义
 */
export interface ColumnFilter {
  columnKey: string;
  filter: Filter;
}

/**
 * 过滤管理器接口
 */
export interface IFilterManager {
  /** 设置列过滤器 */
  setFilter: (columnKey: string, filter: Filter) => void;
  /** 获取列过滤器 */
  getFilter: (columnKey: string) => Filter | null;
  /** 移除列过滤器 */
  removeFilter: (columnKey: string) => void;
  /** 应用过滤器 */
  applyFilters: () => void;
  /** 重置所有过滤器 */
  resetFilters: () => void;
  /** 获取过滤后的数据 */
  getFilteredData: () => any[][];
  /** 获取所有过滤器 */
  getAllFilters: () => ColumnFilter[];
}

/**
 * Sheet管理器接口
 */
export interface ISheetManager {
  /** 获取当前活动sheet */
  getActiveSheet: () => SheetDefine;
  /** 设置活动sheet */
  setActiveSheet: (sheetKey: string) => void;
  /** 添加sheet */
  addSheet: (sheet: SheetDefine) => void;
  /** 移除sheet */
  removeSheet: (sheetKey: string) => void;
  /** 重命名sheet */
  renameSheet: (sheetKey: string, newTitle: string) => void;
  /** 获取所有sheet */
  getAllSheets: () => SheetDefine[];
  /** 获取指定sheet */
  getSheet: (sheetKey: string) => SheetDefine | null;
  /** 获取sheet数量 */
  getSheetCount: () => number;
}
