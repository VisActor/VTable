import type { Gantt } from '../Gantt';
import type { IZoomScale } from '../ts-types/zoom-scale';
import type { ITimelineScale } from '../ts-types/gantt-engine';
import { DataZoomIntegration, type DataZoomConfig } from './DataZoomIntegration';
import { GANTT_EVENT_TYPE } from '../ts-types/EVENT_TYPE';

/**
 * ZoomScale 管理器
 * 负责根据 millisecondsPerPixel 智能选择和切换时间轴级别
 */
export class ZoomScaleManager {
  private readonly gantt: Gantt;
  readonly config: IZoomScale;
  private currentLevelIndex: number = 0;
  private levelBoundaries: number[] = [];
  private globalMinMillisecondsPerPixel: number = 0;
  private globalMaxMillisecondsPerPixel: number = 0;
  private dataZoomIntegration: DataZoomIntegration | null = null;

  constructor(gantt: Gantt, config: IZoomScale) {
    this.gantt = gantt;

    const finalConfig: IZoomScale = {
      enabled: true,
      levels: [],
      ...config
    };

    this.config = finalConfig;

    // 初始化缩放限制的默认值
    this.initializeZoomLimits();

    this.sortLevelsByCoarseness();
    this.calculateGlobalMillisecondsPerPixelRange();
    this.calculateLevelBoundaries();
    this.updateZoomLimits();

    if (this.config.levels.length > 0) {
      const initialMillisecondsPerPixel = this.calculateInitialMillisecondsPerPixel();
      this.initializeWithMillisecondsPerPixel(initialMillisecondsPerPixel);
    }

    // 如果配置了 DataZoom，自动创建集成
    this.initializeDataZoomIfNeeded();
  }

  /**
   * 初始化缩放限制的默认值
   */
  private initializeZoomLimits(): void {
    const existingZoom = this.gantt.parsedOptions.zoom;
    const zoomScaleConfig = this.config;
    this.gantt.parsedOptions.zoom = {
      minMillisecondsPerPixel: existingZoom?.minMillisecondsPerPixel ?? zoomScaleConfig.minMillisecondsPerPixel ?? 1000,
      maxMillisecondsPerPixel:
        existingZoom?.maxMillisecondsPerPixel ?? zoomScaleConfig.maxMillisecondsPerPixel ?? 6000000,
      step: zoomScaleConfig.step ?? 0.015
    };
  }

  /**
   * 初始化 DataZoom 集成（如果需要）
   */
  private initializeDataZoomIfNeeded(): void {
    const dataZoomConfig = this.config.dataZoomAxis;
    if (!dataZoomConfig?.enabled) {
      return;
    }

    // 设置默认值（width 和 x 会在 DataZoomIntegration 中自动处理）
    const finalConfig: DataZoomConfig = {
      containerId: dataZoomConfig.containerId, // 可选，让 DataZoomIntegration 自动处理
      width: dataZoomConfig.width, // 如果未设置，会自动使用容器宽度
      height: dataZoomConfig.height ?? 30,
      x: dataZoomConfig.x, // 如果未设置，会自动与容器左侧对齐
      y: dataZoomConfig.y ?? 0, // 默认贴着容器底部
      delayTime: dataZoomConfig.delayTime ?? 10
    };

    try {
      this.dataZoomIntegration = new DataZoomIntegration(this.gantt, finalConfig);
    } catch (error) {
      console.error('ZoomScaleManager: 创建 DataZoom 集成失败', error);
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
   * 计算全局 millisecondsPerPixel 范围
   */
  private calculateGlobalMillisecondsPerPixelRange(): void {
    const levels = this.config.levels;
    if (levels.length === 0) {
      return;
    }

    const maxZoomInColumnWidth = 120;
    const maxZoomOutColumnWidth = 150;

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

    this.globalMinMillisecondsPerPixel = minMinUnitMs / maxZoomInColumnWidth;
    this.globalMaxMillisecondsPerPixel = maxMinUnitMs / maxZoomOutColumnWidth;

    // 确保 minMillisecondsPerPixel < maxMillisecondsPerPixel
    if (this.globalMinMillisecondsPerPixel > this.globalMaxMillisecondsPerPixel) {
      const temp = this.globalMinMillisecondsPerPixel;
      this.globalMinMillisecondsPerPixel = this.globalMaxMillisecondsPerPixel;
      this.globalMaxMillisecondsPerPixel = temp;
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

    idealBoundaries[levelCount] = this.globalMinMillisecondsPerPixel;

    // 从精细级别开始计算理想边界
    for (let i = levelCount - 1; i >= 1; i--) {
      const currentLevel = this.config.levels[i];
      const currentMinUnit = this.findMinTimeUnit(currentLevel);
      const currentUnitMs = this.getUnitMilliseconds(currentMinUnit.unit, currentMinUnit.step);
      const minColWidth = this.getMinColWidthForUnit(currentMinUnit.unit, currentMinUnit.step);
      const idealBoundary = currentUnitMs / minColWidth;
      idealBoundaries[i] = idealBoundary;
    }

    idealBoundaries[0] = this.globalMaxMillisecondsPerPixel;
    this.levelBoundaries = [...idealBoundaries];

    // 调整边界确保递减顺序
    for (let i = 1; i < levelCount; i++) {
      if (this.levelBoundaries[i] >= this.levelBoundaries[i - 1]) {
        const prevBoundary = this.levelBoundaries[i - 1];
        const nextBoundary = this.levelBoundaries[i + 1] || this.globalMinMillisecondsPerPixel;
        this.levelBoundaries[i] = (prevBoundary + nextBoundary) / 2;
      }

      this.levelBoundaries[i] = Math.max(
        this.globalMinMillisecondsPerPixel,
        Math.min(this.globalMaxMillisecondsPerPixel, this.levelBoundaries[i])
      );
    }
  }

  updateZoomLimits(): void {
    if (!this.gantt.parsedOptions.zoom) {
      this.gantt.parsedOptions.zoom = {};
    }
    this.gantt.parsedOptions.zoom.minMillisecondsPerPixel = this.globalMinMillisecondsPerPixel;
    this.gantt.parsedOptions.zoom.maxMillisecondsPerPixel = this.globalMaxMillisecondsPerPixel;
  }

  /**
   * 获取全局最小 millisecondsPerPixel
   */
  getGlobalMinMillisecondsPerPixel(): number {
    return this.globalMinMillisecondsPerPixel;
  }

  /**
   * 获取全局最大 millisecondsPerPixel
   */
  getGlobalMaxMillisecondsPerPixel(): number {
    return this.globalMaxMillisecondsPerPixel;
  }

  private calculateInitialMillisecondsPerPixel(): number {
    return (
      this.globalMinMillisecondsPerPixel +
      (this.globalMaxMillisecondsPerPixel - this.globalMinMillisecondsPerPixel) * 0.4
    );
  }

  private initializeWithMillisecondsPerPixel(millisecondsPerPixel: number): void {
    if (this.config.levels.length === 0) {
      return;
    }
    const optimalLevel = this.findOptimalLevel(millisecondsPerPixel);
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
   * 根据 millisecondsPerPixel 找到最合适的级别
   */
  findOptimalLevel(millisecondsPerPixel: number): number {
    const clampedMillisecondsPerPixel = Math.max(
      this.globalMinMillisecondsPerPixel,
      Math.min(this.globalMaxMillisecondsPerPixel, millisecondsPerPixel)
    );

    for (let i = 0; i < this.levelBoundaries.length - 1; i++) {
      if (
        clampedMillisecondsPerPixel <= this.levelBoundaries[i] &&
        clampedMillisecondsPerPixel > this.levelBoundaries[i + 1]
      ) {
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

  getInitialMillisecondsPerPixel(): number {
    return this.calculateInitialMillisecondsPerPixel();
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
    const currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
    const unitMs = this.getUnitMilliseconds(minUnit.unit, minUnit.step);
    const currentColWidth = unitMs / currentMillisecondsPerPixel;

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

    let targetMillisecondsPerPixel: number;

    if (colWidth !== undefined) {
      const targetLevel = this.config.levels[targetLevelIndex];
      const targetMinUnit = this.findMinTimeUnit(targetLevel);
      const unitMs = this.getUnitMilliseconds(targetMinUnit.unit, targetMinUnit.step);
      targetMillisecondsPerPixel = unitMs / colWidth;

      const upperBoundary = this.levelBoundaries[targetLevelIndex];
      const lowerBoundary = this.levelBoundaries[targetLevelIndex + 1];

      if (targetMillisecondsPerPixel < lowerBoundary || targetMillisecondsPerPixel > upperBoundary) {
        targetMillisecondsPerPixel = (upperBoundary + lowerBoundary) / 2;
      }
    } else {
      const upperBoundary = this.levelBoundaries[targetLevelIndex];
      const lowerBoundary = this.levelBoundaries[targetLevelIndex + 1];
      targetMillisecondsPerPixel = (upperBoundary + lowerBoundary) / 2;
    }

    if (targetLevelIndex !== this.currentLevelIndex) {
      this.switchToLevel(targetLevelIndex);
    }

    this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel);

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
    const currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
    const totalRange = this.globalMaxMillisecondsPerPixel - this.globalMinMillisecondsPerPixel;
    const deltaMillisecondsPerPixel = (totalRange * percentage) / 100;

    const targetMillisecondsPerPixel = currentMillisecondsPerPixel - deltaMillisecondsPerPixel;

    let centerTimePosition: number | undefined;
    if (center && this.gantt.scenegraph) {
      if (centerX === undefined) {
        centerX = this.gantt.scenegraph.width / 2;
      }
      centerTimePosition = (this.gantt.stateManager.scroll.horizontalBarPos + centerX) * currentMillisecondsPerPixel;
    }

    const targetLevel = this.findOptimalLevel(targetMillisecondsPerPixel);
    const currentLevel = this.getCurrentLevel();

    if (targetLevel !== currentLevel) {
      this.switchToLevel(targetLevel);
    }

    this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel);

    if (centerTimePosition !== undefined && centerX !== undefined) {
      const newScrollLeft = centerTimePosition / this.gantt.getCurrentMillisecondsPerPixel() - centerX;
      this.gantt.stateManager.setScrollLeft(newScrollLeft);
    }
  }

  /**
   * 获取 DataZoom 集成实例
   * @returns DataZoom 集成实例，如果未启用则返回 null
   */
  getDataZoomIntegration(): DataZoomIntegration | null {
    return this.dataZoomIntegration;
  }

  /**
   * 创建 DataZoom 集成
   * @param config DataZoom 配置
   * @returns DataZoom 集成实例
   */
  createDataZoomIntegration(config: DataZoomConfig): DataZoomIntegration {
    // 如果已经有通过配置创建的实例，先销毁它
    if (this.dataZoomIntegration) {
      console.warn('ZoomScaleManager: 已存在 DataZoom 集成实例，将被替换');
      this.dataZoomIntegration.destroy();
    }

    this.dataZoomIntegration = new DataZoomIntegration(this.gantt, config);
    return this.dataZoomIntegration;
  }

  /**
   * 销毁 DataZoom 集成
   */
  destroyDataZoomIntegration(): void {
    if (this.dataZoomIntegration) {
      this.dataZoomIntegration.destroy();
      this.dataZoomIntegration = null;
    }
  }

  /**
   * 响应式更新 DataZoom
   * 当 Gantt 容器大小发生变化时调用
   */
  updateDataZoomResponsive(): void {
    if (this.dataZoomIntegration) {
      this.dataZoomIntegration.updateResponsive();
    }
  }

  /**
   * 重新计算时间相关的尺寸参数
   * 用于根据当前 millisecondsPerPixel 重新计算 timelineColWidth
   * （从 Gantt.ts 移动到这里）
   */
  recalculateTimeScale(): void {
    // 获取当前的主时间刻度
    const primaryScale = this.gantt.parsedOptions.reverseSortedTimelineScales[0];
    if (!primaryScale) {
      return;
    }

    // 根据当前 scale 的 unit 和 step 计算每个单元格应该占用的毫秒数
    let msPerStep: number;
    switch (primaryScale.unit as string) {
      case 'second':
        msPerStep = 1000 * primaryScale.step;
        break;
      case 'minute':
        msPerStep = 60 * 1000 * primaryScale.step;
        break;
      case 'hour':
        msPerStep = 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'day':
        msPerStep = 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'week':
        msPerStep = 7 * 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'month':
        msPerStep = 30 * 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'quarter':
        msPerStep = 90 * 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      case 'year':
        msPerStep = 365 * 24 * 60 * 60 * 1000 * primaryScale.step;
        break;
      default:
        msPerStep = 24 * 60 * 60 * 1000 * primaryScale.step;
    }
    const newTimelineColWidth = msPerStep / this.gantt.getCurrentMillisecondsPerPixel();

    this.gantt.parsedOptions.timelineColWidth = newTimelineColWidth;

    // 重新生成时间线日期映射
    this.gantt._generateTimeLineDateMap();

    // 更新尺寸和重新渲染
    if (this.gantt.scenegraph) {
      this.gantt._updateSize();
      this.gantt.scenegraph.refreshAll();
    }
  }

  /**
   * 缩放方法，用于滚轮和双指缩放
   * （从 Gantt.ts 移动到这里）
   * @param factor 缩放因子，大于1表示放大
   * @param keepCenter 是否保持视图中心不变
   * @param centerX 缩放中心点X坐标
   */
  zoomByFactor(factor: number, keepCenter: boolean = true, centerX?: number): void {
    const minMillisecondsPerPixel = this.gantt.parsedOptions.zoom?.minMillisecondsPerPixel ?? 200000;
    const maxMillisecondsPerPixel = this.gantt.parsedOptions.zoom?.maxMillisecondsPerPixel ?? 3000000;

    const oldMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
    const oldWidth = this.gantt.parsedOptions.timelineColWidth;

    // 在级别切换前先计算中心时间位置
    let centerTimePosition: number | undefined;
    if (keepCenter) {
      if (centerX === undefined) {
        centerX = this.gantt.scenegraph.width / 2;
      }
      // 计算中心点对应的绝对时间位置
      const scrollOffsetMs = (this.gantt.stateManager.scroll.horizontalBarPos + centerX) * oldMillisecondsPerPixel;
      centerTimePosition = this.gantt.parsedOptions._minDateTime + scrollOffsetMs;
    }

    const currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
    let adjustedFactor = factor;

    const baseMillisecondsPerPixel = 1440000;
    const zoomRatio = Math.log(currentMillisecondsPerPixel / baseMillisecondsPerPixel) / Math.log(2);

    if (currentMillisecondsPerPixel < baseMillisecondsPerPixel) {
      const enhancement = Math.pow(1.2, -zoomRatio);
      adjustedFactor = Math.pow(factor, enhancement);
    } else {
      const dampening = Math.pow(0.9, zoomRatio);
      adjustedFactor = Math.pow(factor, dampening);
    }

    const newMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel() / adjustedFactor;
    const clampedMillisecondsPerPixel = Math.max(
      minMillisecondsPerPixel,
      Math.min(maxMillisecondsPerPixel, newMillisecondsPerPixel)
    );
    this.gantt.setMillisecondsPerPixel(clampedMillisecondsPerPixel);

    const targetLevel = this.findOptimalLevel(clampedMillisecondsPerPixel);
    const currentLevel = this.getCurrentLevel();

    if (targetLevel !== currentLevel) {
      this.switchToLevel(targetLevel);
    } else {
      this.recalculateTimeScale();
    }

    // 在级别切换和重新计算后再调整视图中心
    if (keepCenter && centerTimePosition !== undefined && centerX !== undefined) {
      const actualMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
      // 计算中心时间相对于新minDate的偏移量
      const newMinDateTime = this.gantt.parsedOptions._minDateTime;
      const timeOffsetFromNewMin = centerTimePosition - newMinDateTime;
      const newScrollLeft = timeOffsetFromNewMin / actualMillisecondsPerPixel - centerX;
      this.gantt.stateManager.setScrollLeft(newScrollLeft);
    }

    // 触发缩放事件
    if (this.gantt.hasListeners(GANTT_EVENT_TYPE.ZOOM)) {
      const actualMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
      this.gantt.fireListeners(GANTT_EVENT_TYPE.ZOOM, {
        oldWidth,
        newWidth: this.gantt.parsedOptions.timelineColWidth,
        scale: oldMillisecondsPerPixel / actualMillisecondsPerPixel,
        oldMillisecondsPerPixel,
        newMillisecondsPerPixel: actualMillisecondsPerPixel
      });
    }
  }
}
