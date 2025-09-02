import type { Gantt } from '../Gantt';
import type { IZoomScale } from '../ts-types/zoom-scale';
import type { ITimelineScale } from '../ts-types/gantt-engine';

/**
 * ZoomScale 管理器
 * 负责根据 timePerPixel 智能选择和切换时间轴级别
 */
export class ZoomScaleManager {
  private readonly gantt: Gantt;
  readonly config: IZoomScale;
  private currentLevelIndex: number = 0;
  private levelBoundaries: number[] = [];
  private globalMinTimePerPixel: number = 0;
  private globalMaxTimePerPixel: number = 0;

  constructor(gantt: Gantt, config: IZoomScale) {
    this.gantt = gantt;

    const finalConfig: Required<IZoomScale> = {
      enabled: true,
      maxZoomInColumnWidth: 120,
      maxZoomOutColumnWidth: 150,
      ...config
    };

    this.config = finalConfig;

    this.sortLevelsByCoarseness();
    this.calculateGlobalTimePerPixelRange();
    this.calculateLevelBoundaries();
    this.updateZoomLimits();

    if (this.config.levels.length > 0) {
      const initialTimePerPixel = this.calculateInitialTimePerPixel();
      this.initializeWithTimePerPixel(initialTimePerPixel);
    }
  }

  /**
   * 对级别进行排序：从粗糙到精细
   */
  private sortLevelsByCoarseness(): void {
    if (this.config.levels.length <= 1) {
      return;
    }

    this.config.levels.sort((levelA, levelB) => {
      const minUnitA = this.findMinTimeUnit(levelA);
      const minUnitB = this.findMinTimeUnit(levelB);

      const unitMsA = this.getUnitMilliseconds(minUnitA.unit, minUnitA.step);
      const unitMsB = this.getUnitMilliseconds(minUnitB.unit, minUnitB.step);

      return unitMsB - unitMsA;
    });
  }

  /**
   * 计算全局 timePerPixel 范围
   */
  private calculateGlobalTimePerPixelRange(): void {
    const levels = this.config.levels;
    if (levels.length === 0) {
      return;
    }

    let maxMinUnit: ITimelineScale | null = null;
    let maxMinUnitMs = 0;
    let minMinUnit: ITimelineScale | null = null;
    let minMinUnitMs = Infinity;

    for (const level of levels) {
      const minUnit = this.findMinTimeUnit(level);
      const unitMs = this.getUnitMilliseconds(minUnit.unit, minUnit.step);

      if (unitMs > maxMinUnitMs) {
        maxMinUnitMs = unitMs;
        maxMinUnit = minUnit;
      }

      if (unitMs < minMinUnitMs) {
        minMinUnitMs = unitMs;
        minMinUnit = minUnit;
      }
    }

    if (!maxMinUnit || !minMinUnit) {
      console.error('ZoomScale: 无法找到有效的时间单位');
      return;
    }

    this.globalMinTimePerPixel = minMinUnitMs / this.config.maxZoomInColumnWidth;
    this.globalMaxTimePerPixel = maxMinUnitMs / this.config.maxZoomOutColumnWidth;

    // 确保 minTimePerPixel < maxTimePerPixel
    if (this.globalMinTimePerPixel > this.globalMaxTimePerPixel) {
      const temp = this.globalMinTimePerPixel;
      this.globalMinTimePerPixel = this.globalMaxTimePerPixel;
      this.globalMaxTimePerPixel = temp;
    }
  }

  /**
   * 计算级别边界
   */
  private calculateLevelBoundaries(): void {
    const levelCount = this.config.levels.length;
    if (levelCount === 0) {
      return;
    }

    this.levelBoundaries = [];
    const idealBoundaries: number[] = [];

    idealBoundaries[levelCount] = this.globalMinTimePerPixel;

    // 从精细级别开始计算理想边界
    for (let i = levelCount - 1; i >= 1; i--) {
      const currentLevel = this.config.levels[i];
      const currentMinUnit = this.findMinTimeUnit(currentLevel);
      const currentUnitMs = this.getUnitMilliseconds(currentMinUnit.unit, currentMinUnit.step);
      const minColWidth = this.getMinColWidthForUnit(currentMinUnit.unit, currentMinUnit.step);
      const idealBoundary = currentUnitMs / minColWidth;
      idealBoundaries[i] = idealBoundary;
    }

    idealBoundaries[0] = this.globalMaxTimePerPixel;
    this.levelBoundaries = [...idealBoundaries];

    // 调整边界确保递减顺序
    for (let i = 1; i < levelCount; i++) {
      if (this.levelBoundaries[i] >= this.levelBoundaries[i - 1]) {
        const prevBoundary = this.levelBoundaries[i - 1];
        const nextBoundary = this.levelBoundaries[i + 1] || this.globalMinTimePerPixel;
        this.levelBoundaries[i] = (prevBoundary + nextBoundary) / 2;
      }

      this.levelBoundaries[i] = Math.max(
        this.globalMinTimePerPixel,
        Math.min(this.globalMaxTimePerPixel, this.levelBoundaries[i])
      );
    }
  }

  updateZoomLimits(): void {
    if (!this.gantt.parsedOptions.zoom) {
      this.gantt.parsedOptions.zoom = {};
    }
    this.gantt.parsedOptions.zoom.minTimePerPixel = this.globalMinTimePerPixel;
    this.gantt.parsedOptions.zoom.maxTimePerPixel = this.globalMaxTimePerPixel;
  }

  private calculateInitialTimePerPixel(): number {
    return this.globalMinTimePerPixel + (this.globalMaxTimePerPixel - this.globalMinTimePerPixel) * 0.4;
  }

  private initializeWithTimePerPixel(timePerPixel: number): void {
    if (this.config.levels.length === 0) {
      return;
    }
    const optimalLevel = this.findOptimalLevel(timePerPixel);
    this.setInitialLevel(optimalLevel);
  }

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

    this.gantt.options.timelineHeader.scales = [...levelScales];
    this.currentLevelIndex = levelIndex;
  }

  /**
   * 根据 timePerPixel 找到最合适的级别
   */
  findOptimalLevel(timePerPixel: number): number {
    const clampedTimePerPixel = Math.max(
      this.globalMinTimePerPixel,
      Math.min(this.globalMaxTimePerPixel, timePerPixel)
    );

    for (let i = 0; i < this.levelBoundaries.length - 1; i++) {
      if (clampedTimePerPixel <= this.levelBoundaries[i] && clampedTimePerPixel > this.levelBoundaries[i + 1]) {
        return i;
      }
    }

    return this.config.levels.length - 1;
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
      return true;
    }

    const levelScales = this.config.levels[levelIndex];
    if (!levelScales || levelScales.length === 0) {
      console.error(`ZoomScale: 级别 ${levelIndex} 没有配置 scales`);
      return false;
    }

    try {
      this.gantt.updateScales([...levelScales]);
      this.currentLevelIndex = levelIndex;
      this.gantt.recalculateTimeScale();
      return true;
    } catch (error) {
      console.error('ZoomScale: 切换级别时发生错误', error);
      return false;
    }
  }

  findMinTimeUnit(scales: ITimelineScale[]): ITimelineScale {
    let minUnit = scales[0];
    let minUnitMs = this.getUnitMilliseconds(minUnit.unit, minUnit.step);

    for (const scale of scales) {
      const unitMs = this.getUnitMilliseconds(scale.unit, scale.step);
      if (unitMs < minUnitMs) {
        minUnitMs = unitMs;
        minUnit = scale;
      }
    }

    return minUnit;
  }

  private getUnitMilliseconds(unit: string, step: number): number {
    const unitMs: Record<string, number> = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    };

    return (unitMs[unit] || unitMs.day) * step;
  }

  private getMinColWidthForUnit(unit: string, step: number): number {
    switch (unit) {
      case 'hour':
        return step > 1 ? 120 : 60;
      case 'minute':
        return 80;
      case 'second':
        return 100;
      case 'day':
      case 'week':
      case 'month':
      case 'quarter':
      case 'year':
      default:
        return 60;
    }
  }

  getCurrentLevel(): number {
    return this.currentLevelIndex;
  }

  getInitialTimePerPixel(): number {
    return this.calculateInitialTimePerPixel();
  }

  /**
   * 获取当前缩放位置的层级状态
   */
  getCurrentZoomState() {
    if (this.config.levels.length === 0) {
      return null;
    }

    const currentLevel = this.config.levels[this.currentLevelIndex];
    const minUnit = this.findMinTimeUnit(currentLevel);
    const currentTimePerPixel = this.gantt.getCurrentTimePerPixel();
    const unitMs = this.getUnitMilliseconds(minUnit.unit, minUnit.step);
    const currentColWidth = unitMs / currentTimePerPixel;

    return {
      minUnit: minUnit.unit,
      step: minUnit.step,
      levelNum: this.currentLevelIndex,
      currentColWidth: Math.round(currentColWidth * 10) / 10
    };
  }

  /**
   * 设置当前缩放位置
   */
  setZoomPosition(params: { minUnit?: string; step?: number; levelNum?: number; colWidth?: number }): boolean {
    if (this.config.levels.length === 0) {
      return false;
    }

    const { minUnit, step, levelNum, colWidth } = params;

    // 确定目标级别
    let targetLevelIndex: number | null = null;

    // 模式1：通过 minUnit + step 确定级别
    if (minUnit !== undefined && step !== undefined) {
      targetLevelIndex = this.findLevelByMinUnit(minUnit, step);
      if (targetLevelIndex === null) {
        console.warn(`ZoomScale: 找不到 ${minUnit}*${step} 对应的级别`);
        return false;
      }
    }
    // 模式2：通过 levelNum 确定级别
    else if (levelNum !== undefined) {
      if (levelNum < 0 || levelNum >= this.config.levels.length) {
        console.warn(`ZoomScale: 无效的级别索引 ${levelNum}`);
        return false;
      }
      targetLevelIndex = levelNum;
    } else {
      console.warn('ZoomScale: 必须提供 (minUnit+step) 或 levelNum');
      return false;
    }

    let targetTimePerPixel: number;

    if (colWidth !== undefined) {
      const targetLevel = this.config.levels[targetLevelIndex];
      const targetMinUnit = this.findMinTimeUnit(targetLevel);
      const unitMs = this.getUnitMilliseconds(targetMinUnit.unit, targetMinUnit.step);
      targetTimePerPixel = unitMs / colWidth;

      const upperBoundary = this.levelBoundaries[targetLevelIndex];
      const lowerBoundary = this.levelBoundaries[targetLevelIndex + 1];

      if (targetTimePerPixel < lowerBoundary || targetTimePerPixel > upperBoundary) {
        targetTimePerPixel = (upperBoundary + lowerBoundary) / 2;
      }
    } else {
      const upperBoundary = this.levelBoundaries[targetLevelIndex];
      const lowerBoundary = this.levelBoundaries[targetLevelIndex + 1];
      targetTimePerPixel = (upperBoundary + lowerBoundary) / 2;
    }

    if (targetLevelIndex !== this.currentLevelIndex) {
      this.switchToLevel(targetLevelIndex);
    }

    this.gantt.setTimePerPixel(targetTimePerPixel);

    return true;
  }

  /**
   * 根据 minUnit 和 step 查找对应的级别索引
   */
  private findLevelByMinUnit(unit: string, step: number): number | null {
    for (let i = 0; i < this.config.levels.length; i++) {
      const level = this.config.levels[i];
      const minUnit = this.findMinTimeUnit(level);
      if (minUnit.unit === unit && minUnit.step === step) {
        return i;
      }
    }
    return null;
  }

  /**
   * 放大时间轴
   * @param factor 缩放因子，大于1表示放大
   * @param center 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomIn(factor: number = 1.1, center: boolean = true, centerX?: number): void {
    this.gantt.zoomByFactor(factor, center, centerX);
  }

  /**
   * 缩小时间轴
   * @param factor 缩放因子，小于1表示缩小
   * @param center 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomOut(factor: number = 0.9, center: boolean = true, centerX?: number): void {
    this.gantt.zoomByFactor(factor, center, centerX);
  }

  /**
   * 基于全局范围的百分比缩放
   * @param percentage 缩放百分比 (0-100)，正数表示放大，负数表示缩小
   * @param center 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomByPercentage(percentage: number, center: boolean = true, centerX?: number): void {
    const currentTimePerPixel = this.gantt.getCurrentTimePerPixel();
    const totalRange = this.globalMaxTimePerPixel - this.globalMinTimePerPixel;
    const deltaTimePerPixel = (totalRange * percentage) / 100;

    const targetTimePerPixel = currentTimePerPixel - deltaTimePerPixel;

    let centerTimePosition: number | undefined;
    if (center && this.gantt.scenegraph) {
      if (centerX === undefined) {
        centerX = this.gantt.scenegraph.width / 2;
      }
      centerTimePosition = (this.gantt.stateManager.scroll.horizontalBarPos + centerX) * currentTimePerPixel;
    }

    const targetLevel = this.findOptimalLevel(targetTimePerPixel);
    const currentLevel = this.getCurrentLevel();

    if (targetLevel !== currentLevel) {
      this.switchToLevel(targetLevel);
    }

    this.gantt.setTimePerPixel(targetTimePerPixel);

    if (centerTimePosition !== undefined && centerX !== undefined) {
      const newScrollLeft = centerTimePosition / this.gantt.getCurrentTimePerPixel() - centerX;
      this.gantt.stateManager.setScrollLeft(newScrollLeft);
    }
  }
}
