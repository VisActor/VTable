import * as VTable from '@visactor/vtable';
import { Group } from '@visactor/vtable/src/vrender';

/** 子表配置接口 - 继承 ListTableConstructorOptions */
export interface DetailGridOptions extends Partial<VTable.ListTableConstructorOptions> {
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
  /** 子表配置 - 可以是静态配置对象或动态配置函数 */
  detailGridOptions?: DetailGridOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions);
}

/**
 * 内部属性扩展接口
 */
export interface InternalProps {
  expandedRecordIndices: number[];
  subTableInstances: Map<number, VTable.ListTable>;
  originalRowHeights: Map<number, number>;
  _heightResizedRowMap: Set<number>;
  _tempExpandedRecordIndices?: number[];
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
  selectComp: { rect: any; fillhandle?: any; role: string };
}
