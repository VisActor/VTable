import type { ITimelineScale } from './gantt-engine';

/**
 * ZoomScale 配置接口
 * 用于定义多级别的时间轴缩放系统
 */
export interface IZoomScale {
  /** 是否启用 ZoomScale 功能 */
  enabled?: boolean;

  /** 是否启用鼠标滚轮缩放 */
  enableMouseWheel?: boolean;

  /**
   * 最大放大限制：最精细级别（如小时）的最小列宽
   * 当达到这个列宽时，无法继续放大
   * 例如：30px 表示小时级别的列宽不能小于30px
   * 默认值：30
   */
  maxZoomInColumnWidth?: number;

  /**
   * 最大缩小限制：最粗糙级别（如月）的最大列宽
   * 当达到这个列宽时，无法继续缩小
   * 例如：150px 表示月级别的列宽不能大于150px
   * 默认值：150
   */
  maxZoomOutColumnWidth?: number;

  // 向后兼容：支持旧的属性名（已废弃，请使用新名称）
  /** @deprecated 请使用 maxZoomInColumnWidth */
  minColumnWidth?: number;
  /** @deprecated 请使用 maxZoomOutColumnWidth */
  maxColumnWidth?: number;

  /**
   * 级别定义：二维数组，每个级别是完整的 scales 组合
   * 例如：
   * [
   *   [{ unit: 'month', step: 1 }, { unit: 'week', step: 1 }],  // 级别0：月-周组合
   *   [{ unit: 'day', step: 1 }],                              // 级别1：日组合
   *   [{ unit: 'day', step: 1 }, { unit: 'hour', step: 1 }]   // 级别2：日-小时组合
   * ]
   */
  levels: ITimelineScale[][];
}

/**
 * 级别阈值信息
 * 用于级别选择算法
 */
export interface ILevelThreshold {
  /** 级别索引 */
  levelIndex: number;

  /** 该级别可用的最小 timePerPixel 值 */
  minTimePerPixel: number;

  /** 该级别可用的最大 timePerPixel 值 */
  maxTimePerPixel: number;

  /** 最小时间单位描述 */
  minUnit: string;

  /** 最小时间单位的毫秒数 */
  minUnitMs: number;
}
