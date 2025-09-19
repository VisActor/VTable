import type { ITimelineScale } from './gantt-engine';

/**
 * ZoomScale 配置接口
 * 用于定义多级别的时间轴缩放系统
 */
export interface IZoomScale {
  /** 是否启用 ZoomScale 功能 */
  enabled?: boolean;

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
