import type { ITimelineScale } from './gantt-engine';

/**
 * DataZoom 配置接口
 */
export interface IDataZoomConfig {
  /** 是否启用 DataZoom */
  enabled?: boolean;
  /** DataZoom 容器 ID（可选，如果不提供会自动从 Gantt 实例获取） */
  containerId?: string;
  /** DataZoom 宽度（默认自动使用 Gantt 时间轴区域宽度，即容器宽度减去左侧表头宽度） */
  width?: number;
  /** DataZoom 高度 */
  height?: number;
  /** X 坐标（相对于容器左侧，默认排除左侧表头宽度，与时间轴内容区域对齐） */
  x?: number;
  /** Y 坐标（相对于容器底边界的偏移，正值向下，默认 0） */
  y?: number;
  /** 事件触发延迟时间 */
  delayTime?: number;
}

/**
 * ZoomScale 配置接口
 * 用于定义多级别的时间轴缩放系统
 */
export interface IZoomScale {
  /** 是否启用 ZoomScale 功能 */
  enabled?: boolean;

  /** DataZoom 集成配置 */
  dataZoom?: IDataZoomConfig;

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
