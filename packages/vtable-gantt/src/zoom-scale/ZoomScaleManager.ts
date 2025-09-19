import type { Gantt } from '../Gantt';
import type { IZoomScale, ILevelThreshold } from '../ts-types/zoom-scale';
import type { ITimelineScale } from '../ts-types/gantt-engine';

/**
 * ZoomScale 管理器
 * 负责根据 timePerPixel 智能选择和切换时间轴级别
 */
export class ZoomScaleManager {
  private gantt: Gantt;
  private config: IZoomScale;
  private currentLevelIndex: number = 0;
  private levelThresholds: ILevelThreshold[] = [];

  constructor(gantt: Gantt, config: IZoomScale) {
    this.gantt = gantt;
    // 向后兼容处理
    const finalConfig = {
      enabled: true,
      enableMouseWheel: true,
      maxZoomInColumnWidth: 30, // 最大放大时的最小列宽
      maxZoomOutColumnWidth: 150, // 最大缩小时的最大列宽
      ...config
    };

    this.config = finalConfig;

    // 计算所有级别的阈值
    this.calculateLevelThresholds();

    // 根据级别阈值自动设置 zoom 的 minTimePerPixel 和 maxTimePerPixel
    this.updateZoomLimits();

    // 初始化：根据默认 timePerPixel 选择合适的初始级别
    // 因为此时 gantt 的 parsedOptions 等还未初始化完成
    if (this.config.levels.length > 0) {
      // 使用默认的 timePerPixel (1440000ms/px, 即60px=1天) 来选择初始级别
      const defaultTimePerPixel = (24 * 60 * 60 * 1000) / 60; // 1440000ms/px
      const initialLevel = this.findOptimalLevel(defaultTimePerPixel);
      this.setInitialLevel(initialLevel);
    }
  }

  /**
   * 计算所有级别的 timePerPixel 使用范围
   */
  private calculateLevelThresholds(): void {
    const levels = this.config.levels;
    const globalMinWidth = this.config.maxZoomInColumnWidth!; // 全局最小列宽
    const globalMaxWidth = this.config.maxZoomOutColumnWidth!; // 全局最大列宽

    this.levelThresholds = [];

    for (let i = 0; i < levels.length; i++) {
      const level = levels[i];
      const minUnit = this.findMinTimeUnit(level);
      const msPerMinUnit = this.getUnitMilliseconds(minUnit.unit, minUnit.step);

      // 根据时间单位类型确定该级别的实际最小宽度
      const levelMinWidth = this.getMinWidthForTimeUnit(minUnit.unit, minUnit.step, globalMinWidth);
      const levelMaxWidth = globalMaxWidth;

      // 该级别的 timePerPixel 使用范围
      const minTimePerPixel = msPerMinUnit / levelMaxWidth; // 列宽最大时
      const maxTimePerPixel = msPerMinUnit / levelMinWidth; // 列宽最小时（考虑显示需求）

      this.levelThresholds.push({
        levelIndex: i,
        minTimePerPixel,
        maxTimePerPixel,
        minUnit: `${minUnit.unit}*${minUnit.step}`,
        minUnitMs: msPerMinUnit
      });
    }
  }

  /**
   * 根据级别阈值自动更新 zoom 的 minTimePerPixel 和 maxTimePerPixel
   */
  private updateZoomLimits(): void {
    if (this.levelThresholds.length === 0) {
      return;
    }

    // 找到所有级别的最小和最大 timePerPixel 值
    const allMinTimePerPixel = this.levelThresholds.map(t => t.minTimePerPixel);
    const allMaxTimePerPixel = this.levelThresholds.map(t => t.maxTimePerPixel);

    const globalMinTimePerPixel = Math.min(...allMinTimePerPixel);
    const globalMaxTimePerPixel = Math.max(...allMaxTimePerPixel);

    // 更新 gantt 的 parsedOptions，确保 zoom 对象存在
    if (!this.gantt.parsedOptions.zoom) {
      this.gantt.parsedOptions.zoom = {};
    }
    this.gantt.parsedOptions.zoom.minTimePerPixel = globalMinTimePerPixel;
    this.gantt.parsedOptions.zoom.maxTimePerPixel = globalMaxTimePerPixel;
  }

  /**
   * 初始化时设置级别
   */
  private setInitialLevel(levelIndex: number): void {
    if (levelIndex < 0 || levelIndex >= this.config.levels.length) {
      console.error(`ZoomScale: 无效的初始级别索引 ${levelIndex}`);
      return;
    }

    const levelScales = this.config.levels[levelIndex];
    if (!levelScales || levelScales.length === 0) {
      console.error(`ZoomScale: 初始级别 ${levelIndex} 没有配置 scales`);
      return;
    }

    // 直接设置到 gantt.options.timelineHeader.scales
    this.gantt.options.timelineHeader.scales = [...levelScales];
    this.currentLevelIndex = levelIndex;
  }

  /**
   * 核心算法：根据当前 timePerPixel 找到最合适的级别
   */
  findOptimalLevel(timePerPixel: number): number {
    // 遍历所有级别，找到 timePerPixel 落在范围内的级别
    for (const threshold of this.levelThresholds) {
      if (timePerPixel >= threshold.minTimePerPixel && timePerPixel <= threshold.maxTimePerPixel) {
        return threshold.levelIndex;
      }
    }

    // 如果没有精确匹配，找最接近的级别
    return this.findClosestLevel(timePerPixel);
  }

  /**
   * 切换到指定级别
   */
  switchToLevel(levelIndex: number): boolean {
    if (levelIndex < 0 || levelIndex >= this.config.levels.length) {
      console.error(`ZoomScale: 无效的级别索引 ${levelIndex}`);
      return false;
    }

    if (this.currentLevelIndex === levelIndex) {
      return true; // 已经是当前级别，无需切换
    }

    const levelScales = this.config.levels[levelIndex];
    if (!levelScales || levelScales.length === 0) {
      console.error(`ZoomScale: 级别 ${levelIndex} 没有配置 scales`);
      return false;
    }

    try {
      this.gantt.updateScales([...levelScales]);

      this.currentLevelIndex = levelIndex;

      // 级别切换后需要重新计算 timelineColWidth
      // updateScales 不会自动更新 colWidth，需要手动调用
      this.gantt.recalculateTimeScale();

      return true;
    } catch (error) {
      console.error('ZoomScale: 切换级别时发生错误', error);
      return false;
    }
  }

  /**
   * 找到级别中的最小时间单位
   */
  private findMinTimeUnit(scales: ITimelineScale[]): ITimelineScale {
    const unitOrder = ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];
    let minScale = scales[0];

    scales.forEach(scale => {
      const currentIndex = unitOrder.indexOf(scale.unit);
      const minIndex = unitOrder.indexOf(minScale.unit);

      if (currentIndex < minIndex || (currentIndex === minIndex && scale.step < minScale.step)) {
        minScale = scale;
      }
    });

    return minScale;
  }

  /**
   * 根据时间单位类型确定最小显示宽度
   * 考虑不同格式的显示需求
   */
  private getMinWidthForTimeUnit(unit: string, step: number, globalMinWidth: number): number {
    switch (unit) {
      case 'hour':
        // 小时格式需要更多宽度来显示 "xx:xx~xx:xx" 或 "xx:xx"
        if (step > 1) {
          return Math.max(globalMinWidth, 270);
        }
        return Math.max(globalMinWidth, 200);

      case 'minute':
        return Math.max(globalMinWidth, 240);
      case 'day':
        // 优化天到小时的显示宽度
        if (step === 1) {
          return Math.max(globalMinWidth, 240);
        }
      case 'week':
      case 'month':
      case 'quarter':
      case 'year':
      default:
        // 其他时间单位使用全局最小宽度
        return globalMinWidth;
    }
  }

  /**
   * 获取时间单位的毫秒数
   */
  private getUnitMilliseconds(unit: string, step: number = 1): number {
    const MS_PER_UNIT = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000, // 近似值
      quarter: 90 * 24 * 60 * 60 * 1000, // 近似值
      year: 365 * 24 * 60 * 60 * 1000 // 近似值
    };

    const unitMs = MS_PER_UNIT[unit as keyof typeof MS_PER_UNIT] || MS_PER_UNIT.day;
    return unitMs * step;
  }

  /**
   * 找最接近的级别（当没有精确匹配时）
   */
  private findClosestLevel(timePerPixel: number): number {
    let closestIndex = 0;
    let minDistance = Infinity;

    for (const threshold of this.levelThresholds) {
      // 计算到该级别理想 timePerPixel 的距离
      const idealTimePerPixel = (threshold.minTimePerPixel + threshold.maxTimePerPixel) / 2;
      const distance = Math.abs(timePerPixel - idealTimePerPixel);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = threshold.levelIndex;
      }
    }

    return closestIndex;
  }

  // 公共 API
  getCurrentLevel(): number {
    return this.currentLevelIndex;
  }

  getLevelCount(): number {
    return this.config.levels.length;
  }

  getLevelScales(index: number): ITimelineScale[] | null {
    return this.config.levels[index] ? [...this.config.levels[index]] : null;
  }

  getConfig(): IZoomScale {
    return { ...this.config };
  }

  getLevelThresholds(): ILevelThreshold[] {
    return [...this.levelThresholds];
  }
}
