import type * as VTable from '@visactor/vtable';
import type { Group } from '@visactor/vtable/src/vrender';

/** 子表配置接口 - 继承 ListTableConstructorOptions */
export interface DetailTableOptions extends VTable.ListTableConstructorOptions {
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}

/**
 * 主从表插件配置选项
 */
export interface MasterDetailPluginOptions {
  id?: string;
  /** 是否启用checkbox级联功能 - 控制主从表之间的复选框联动，默认为 true */
  enableCheckboxCascade?: boolean;
  /** 子表配置 - 可以是静态配置对象或动态配置函数 */
  detailTableOptions?: DetailTableOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailTableOptions);
}

/**
 * 子表checkbox状态接口
 */
export interface SubTableCheckboxState {
  checkedState: Record<string, Record<string | number, boolean | 'indeterminate'>>;
  headerCheckedState: Record<string | number, boolean | 'indeterminate'>;
}

/**
 * 子表事件类型常量
 */
export const SUB_TABLE_EVENT_TYPE = {
  /** 子表行展开事件 */
  SUB_TABLE_ROW_EXPANDED: 'sub_table_row_expanded',
  /** 子表行收起事件 */
  SUB_TABLE_ROW_COLLAPSED: 'sub_table_row_collapsed',
  /** 子表行收起但是不改变RealRecordIndex事件 */
  SUB_TABLE_ROW_COLLAPSED_NO_REALRECORDINDEX: 'sub_table_row_collapsed_no_realrecordindex',
  /** 子表销毁事件 */
  SUB_TABLE_DESTROYED: 'sub_table_destroyed',
  /** 子表渲染完成事件 */
  SUB_TABLE_RENDERED: 'sub_table_rendered'
} as const;

/**
 * 子表事件信息接口
 */
export interface SubTableEventInfo {
  /** 事件类型 */
  eventType: keyof typeof SUB_TABLE_EVENT_TYPE;
  /** 主表行索引 */
  masterRowIndex: number;
  /** 记录索引 */
  recordIndex?: number | number[];
  /** 主表数据 */
  masterData?: unknown;
  /** 子表实例 */
  subTable?: VTable.ListTable;
  /** 子表配置 */
  subTableOptions?: DetailTableOptions;
  /** 原始浏览器事件（如果有） */
  event?: Event;
}

/**
 * 内部属性扩展接口
 */
export interface InternalProps {
  expandedRecordIndices: (number | number[])[];
  subTableInstances: Map<number, VTable.ListTable>;
  originalRowHeights: Map<number, number>;
  _tempExpandedRecordIndices?: (number | number[])[];
  subTableCheckboxStates?: Map<number, SubTableCheckboxState>;
}

/**
 * 事件数据接口
 */
export interface CellContentWidthEventData {
  col: number;
  row: number;
  distWidth: number;
  cellHeight: number;
  detaX: number;
  autoRowHeight: boolean;
  needUpdateRowHeight: boolean;
  cellGroup: Group;
  padding: [number, number, number, number];
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
}

export interface SelectBorderHeightEventData {
  startRow: number;
  endRow: number;
  currentHeight: number;
  selectComp: { rect: unknown; fillhandle?: unknown; role: string };
}

/**
 * 懒加载状态枚举
 */
export type LazyLoadState = 'loading' | 'loaded' | 'error';

/**
 * 记录索引类型 - 支持单个数字或数字数组
 */
export type RecordIndexType = number | number[];

/**
 * 工具函数：比较两个记录索引是否相等
 */
export function recordIndexEquals(a: RecordIndexType, b: RecordIndexType): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
  // 一个是数字，一个是数组的情况
  if (typeof a === 'number' && Array.isArray(b)) {
    return b.length === 1 && b[0] === a;
  }
  if (Array.isArray(a) && typeof b === 'number') {
    return a.length === 1 && a[0] === b;
  }
  return false;
}

/**
 * 工具函数：检查记录索引数组中是否包含指定索引
 */
export function includesRecordIndex(array: (number | number[])[], target: RecordIndexType): boolean {
  return array.some(item => recordIndexEquals(item, target));
}

/**
 * 工具函数：在记录索引数组中查找指定索引的位置
 */
export function findRecordIndexPosition(array: (number | number[])[], target: RecordIndexType): number {
  return array.findIndex(item => recordIndexEquals(item, target));
}
