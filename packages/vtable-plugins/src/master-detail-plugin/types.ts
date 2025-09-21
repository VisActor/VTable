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
  /** 懒加载loading图标配置 */
  lazyLoadingIcon?: {
    src?: string;
    width?: number;
    height?: number;
  };
  /** 懒加载回调函数 */
  onLazyLoad?: (
    eventData: LazyLoadEventData & {
      callback: (error: unknown, detailData: DetailTableOptions | null) => void;
    }
  ) => void;
}

/**
 * 子表checkbox状态接口
 */
export interface SubTableCheckboxState {
  checkedState: Record<string, Record<string | number, boolean | 'indeterminate'>>;
  headerCheckedState: Record<string | number, boolean | 'indeterminate'>;
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
  /** 懒加载状态管理 */
  lazyLoadingStates?: Map<number, 'loading' | 'loaded' | 'error'>;
  /** 懒加载Promise缓存，防止重复请求 */
  lazyLoadingPromises?: Map<number, Promise<unknown>>;
}

/**
 * 虚拟记录ID接口
 */
export interface VirtualRecordIds {
  topId: string;
  bottomId: string;
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
 * 懒加载事件数据接口
 */
export interface LazyLoadEventData {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 记录数据 */
  record: unknown;
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
