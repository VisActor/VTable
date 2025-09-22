import type { CellCoord, CellRange, CellValue } from './base';

/**
 * 工作表事件类型枚举
 *
 * @description 定义了VTableSheet组件支持的所有事件类型。
 * 使用枚举可以提供更好的类型提示和代码补全功能。
 *
 * @example
 * ```typescript
 * // 注册单元格选择事件
 * sheet.on(WorkSheetEventType.CELL_CLICK, (event) => {
 *   console.log(`选中单元格: 行${event.row}, 列${event.col}`);
 * });
 *
 * // 注册单元格值变化事件
 * sheet.on(WorkSheetEventType.CELL_VALUE_CHANGED, (event) => {
 *   console.log(`单元格值变化: 从 ${event.oldValue} 变为 ${event.newValue}`);
 * });
 * ```
 */
export enum WorkSheetEventType {
  // 单元格事件
  CELL_CLICK = 'cell-click',
  CELL_VALUE_CHANGED = 'cell-value-changed',

  // 选择范围事件
  SELECTION_CHANGED = 'selection-changed',
  SELECTION_END = 'selection-end'

  // // 工作表状态事件
  // SHEET_READY = 'sheet-ready',
  // SHEET_DESTROYED = 'sheet-destroyed',
  // SHEET_RESIZED = 'sheet-resized',

  // // 编辑相关事件
  // EDIT_START = 'edit-start',
  // EDIT_END = 'edit-end',
  // EDIT_CANCEL = 'edit-cancel',

  // // 数据事件
  // DATA_CHANGED = 'data-changed',
  // DATA_LOADED = 'data-loaded',
  // DATA_SORTED = 'data-sorted',
  // DATA_FILTERED = 'data-filtered'
}

/** 事件处理器类型 */
export type EventHandler = (...args: any[]) => void;

/**
 * 单元格选择事件参数
 *
 * @description 在用户选中单元格时触发。包含被选中单元格的行列信息、值和原始事件对象。
 *
 * @event WorkSheetEventType.CELL_CLICK
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.CELL_CLICK, (event: CellClickEvent) => {
 *   console.log(`选中单元格: 行${event.row}, 列${event.col}, 值: ${event.value}`);
 * });
 * ```
 */
export interface CellClickEvent {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 单元格内容 */
  value?: CellValue;
  /** 单元格DOM元素 */
  cellElement?: HTMLElement;
  /** 原始事件对象 */
  originalEvent?: MouseEvent | KeyboardEvent;
}

/**
 * 单元格值变更事件参数
 *
 * @description 在单元格值被修改时触发。包含被修改单元格的行列信息、旧值、新值等信息。
 * 可通过isUserAction判断是否由用户操作触发，通过isFormulaCalculation判断是否由公式计算触发。
 *
 * @event WorkSheetEventType.CELL_VALUE_CHANGED
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.CELL_VALUE_CHANGED, (event: CellValueChangedEvent) => {
 *   console.log(`单元格值变化: 行${event.row}, 列${event.col}, 从 ${event.oldValue} 变为 ${event.newValue}`);
 * });
 * ```
 */
export interface CellValueChangedEvent {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 新值 */
  newValue: CellValue;
  /** 旧值 */
  oldValue: CellValue;
  /** 单元格DOM元素 */
  cellElement?: HTMLElement;
  /** 是否由用户操作引起 */
  isUserAction?: boolean;
  /** 是否由公式计算引起 */
  isFormulaCalculation?: boolean;
}

/**
 * 选择范围变更事件参数
 *
 * @description 在选择范围变化时触发。包含选择区域信息、选中的单元格数组和原始事件对象。
 *
 * @event WorkSheetEventType.SELECTION_CHANGED
 * @event WorkSheetEventType.SELECTION_END
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.SELECTION_CHANGED, (event: SelectionChangedEvent) => {
 *   if (event.ranges && event.ranges.length > 0) {
 *     const range = event.ranges[0];
 *     console.log(`选择区域: 从 (${range.start.row}, ${range.start.col}) 到 (${range.end.row}, ${range.end.col})`);
 *   }
 * });
 * ```
 */
export interface SelectionChangedEvent {
  /** 选择区域 */
  ranges?: Array<{
    start: {
      row: number;
      col: number;
    };
    end: {
      row: number;
      col: number;
    };
  }>;
  /** 选择的单元格数据 */
  cells?: Array<
    Array<{
      row: number;
      col: number;
      value?: CellValue;
    }>
  >;
  /** 原始事件对象 */
  originalEvent?: MouseEvent | KeyboardEvent;
}

/**
 * 编辑开始事件参数
 *
 * @description 在用户开始编辑单元格时触发。包含编辑的单元格信息和当前值。
 *
 * @event WorkSheetEventType.EDIT_START
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.EDIT_START, (event: EditStartEvent) => {
 *   console.log(`开始编辑单元格: 行${event.row}, 列${event.col}, 当前值: ${event.value}`);
 * });
 * ```
 */
export interface EditStartEvent {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 当前值 */
  value: CellValue;
  /** 编辑器元素 */
  editorElement?: HTMLElement;
}

/**
 * 编辑结束事件参数
 *
 * @description 在用户完成单元格编辑时触发。包含编辑的单元格信息、旧值和新值。
 * 可通过isCancelled判断编辑是否被取消。
 *
 * @event WorkSheetEventType.EDIT_END
 * @event WorkSheetEventType.EDIT_CANCEL
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.EDIT_END, (event: EditEndEvent) => {
 *   console.log(`完成编辑单元格: 行${event.row}, 列${event.col}, 从 ${event.oldValue} 变为 ${event.newValue}`);
 * });
 * ```
 */
export interface EditEndEvent {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 旧值 */
  oldValue: CellValue;
  /** 新值 */
  newValue: CellValue;
  /** 是否被取消 */
  isCancelled?: boolean;
}

/**
 * 工作表尺寸变更事件参数
 *
 * @description 在工作表尺寸变化时触发，如窗口调整。包含新的宽度和高度信息。
 *
 * @event WorkSheetEventType.SHEET_RESIZED
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.SHEET_RESIZED, (event: SheetResizedEvent) => {
 *   console.log(`工作表尺寸变化: 新宽度 ${event.width}, 新高度 ${event.height}`);
 * });
 * ```
 */
export interface SheetResizedEvent {
  /** 新宽度 */
  width: number;
  /** 新高度 */
  height: number;
  /** 旧宽度 */
  oldWidth?: number;
  /** 旧高度 */
  oldHeight?: number;
}

/**
 * 数据变更事件参数
 *
 * @description 在表格数据发生批量变更时触发。包含所有变更的单元格信息。
 * 可通过isUserAction判断是否由用户操作触发。
 *
 * @event WorkSheetEventType.DATA_CHANGED
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.DATA_CHANGED, (event: DataChangedEvent) => {
 *   console.log(`数据变化: 变更了 ${event.changes.length} 个单元格`);
 *   event.changes.forEach(change => {
 *     console.log(`  行${change.row}, 列${change.col}: ${change.oldValue} -> ${change.newValue}`);
 *   });
 * });
 * ```
 */
export interface DataChangedEvent {
  /** 变更内容 */
  changes: Array<{
    row: number;
    col: number;
    oldValue: CellValue;
    newValue: CellValue;
  }>;
  /** 是否由用户操作引起 */
  isUserAction?: boolean;
}

/**
 * 数据排序事件参数
 *
 * @description 在表格数据排序时触发。包含排序的列和排序方向信息。
 *
 * @event WorkSheetEventType.DATA_SORTED
 * @example
 * ```typescript
 * sheet.on(WorkSheetEventType.DATA_SORTED, (event: DataSortedEvent) => {
 *   console.log(`数据排序: 列 ${event.field}, 方向 ${event.order}`);
 * });
 * ```
 */
export interface DataSortedEvent {
  /** 排序的列 */
  field: string;
  /** 排序方向 */
  order: 'asc' | 'desc' | null;
  /** 排序函数 */
  orderFn?: Function;
}

/** 事件映射表 */
export interface IEventMap {
  // 使用枚举作为键
  [WorkSheetEventType.CELL_CLICK]: CellClickEvent;
  [WorkSheetEventType.CELL_VALUE_CHANGED]: CellValueChangedEvent;
  [WorkSheetEventType.SELECTION_CHANGED]: SelectionChangedEvent;
  [WorkSheetEventType.SELECTION_END]: SelectionChangedEvent;
  // [WorkSheetEventType.SHEET_READY]: void;
  // [WorkSheetEventType.SHEET_DESTROYED]: void;
  // [WorkSheetEventType.SHEET_RESIZED]: SheetResizedEvent;
  // [WorkSheetEventType.EDIT_START]: EditStartEvent;
  // [WorkSheetEventType.EDIT_END]: EditEndEvent;
  // [WorkSheetEventType.EDIT_CANCEL]: EditStartEvent;
  // [WorkSheetEventType.DATA_CHANGED]: DataChangedEvent;
  // [WorkSheetEventType.DATA_LOADED]: void;
  // [WorkSheetEventType.DATA_SORTED]: DataSortedEvent;
  // [WorkSheetEventType.DATA_FILTERED]: DataFilteredEvent;
}

/**
 * 事件管理器接口
 *
 * @description 管理VTableSheet的事件注册、触发和移除。
 * 支持使用WorkSheetEventType枚举或字符串字面量作为事件类型。
 *
 * @example
 * ```typescript
 * // 注册事件监听器
 * sheet.on(WorkSheetEventType.CELL_CLICK, (event) => {
 *   console.log(`选中单元格: 行${event.row}, 列${event.col}`);
 * });
 *
 * // 移除事件监听器
 * sheet.off(WorkSheetEventType.CELL_CLICK, handler);
 *
 * // 一次性事件监听器
 * sheet.once(WorkSheetEventType.CELL_VALUE_CHANGED, (event) => {
 *   console.log(`单元格值已变更`);
 * });
 * ```
 */
export interface IEventManager {
  /** 注册事件监听器 */
  on: <K extends keyof IEventMap>(event: K, handler: (payload: IEventMap[K]) => void) => void;

  /** 移除事件监听器 */
  off: <K extends keyof IEventMap>(event: K, handler: (payload: IEventMap[K]) => void) => void;

  /** 触发事件 */
  emit: <K extends keyof IEventMap>(event: K, payload: IEventMap[K]) => void;

  /** 一次性事件监听器 */
  once: <K extends keyof IEventMap>(event: K, handler: (payload: IEventMap[K]) => void) => void;

  /** 移除所有事件监听器 */
  removeAllListeners: () => void;
}
