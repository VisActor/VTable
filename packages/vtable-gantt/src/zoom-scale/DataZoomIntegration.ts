import type { Gantt } from '../Gantt';
import { DataZoom, createStage } from '@visactor/vtable/es/vrender';

export interface DataZoomConfig {
  /** DataZoom 容器 ID（可选，如果不提供会自动从 Gantt 实例获取） */
  containerId?: string;
  /** DataZoom 初始开始位置 (0-1) */
  start?: number;
  /** DataZoom 初始结束位置 (0-1) */
  end?: number;
  /** DataZoom 宽度 */
  width?: number;
  /** DataZoom 高度 */
  height?: number;
  /** X 坐标 */
  x?: number;
  /** Y 坐标 */
  y?: number;
  /** 事件触发延迟时间 */
  delayTime?: number;
}

export interface DataZoomLimits {
  minRangeRatio: number;
  maxRangeRatio: number;
  minTimePerPixel: number;
  maxTimePerPixel: number;
}

/**
 * DataZoom 与 Gantt 集成管理器
 * 负责 DataZoom 组件与 Gantt 图表的双向同步
 */
export class DataZoomIntegration {
  private gantt: Gantt;
  private dataZoom: DataZoom;
  private stage: any;
  private canvas: HTMLCanvasElement;
  private isUpdatingFromDataZoom = false;
  private isUpdatingFromGantt = false;
  private lastDataZoomState = { start: 0.2, end: 0.5 };
  private cleanupCallbacks: (() => void)[] = [];
  private resizeTimeout: NodeJS.Timeout | null = null;

  constructor(gantt: Gantt, config: DataZoomConfig) {
    this.gantt = gantt;
    this.initializeDataZoom(config);
    this.setupEventListeners();
    this.updateDataZoomLimits();
    this.syncInitialPosition();
  }

  /**
   * 获取容器 ID
   */
  private getContainerId(providedId?: string): string {
    if (providedId) {
      return providedId;
    }

    // 尝试从 Gantt 实例获取容器 ID
    const ganttContainer = (this.gantt as any).container;
    if (ganttContainer?.id) {
      return ganttContainer.id;
    }

    // 尝试从 DOM 中查找 Gantt 容器
    const ganttElements = document.querySelectorAll(
      '[id*="gantt"], [id*="table"], [class*="gantt"], [class*="vtable"]'
    );
    if (ganttElements.length > 0) {
      const element = ganttElements[0] as HTMLElement;
      if (element.id) {
        return element.id;
      }
    }

    // 生成默认 ID
    return 'vTable';
  }

  /**
   * 初始化 DataZoom 组件
   */
  private initializeDataZoom(config: DataZoomConfig): void {
    // 自动获取容器 ID
    const containerId = this.getContainerId(config.containerId);
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`DataZoom container with ID "${containerId}" not found`);
    }

    // 获取容器的实际宽度和位置信息
    const containerRect = container.getBoundingClientRect();
    // 计算 DataZoom 的默认宽度：容器宽度减去左侧表头宽度
    const taskTableWidth = this.gantt.taskTableWidth || 0;
    const defaultWidth = (containerRect.width || 1000) - taskTableWidth;

    // 计算默认 x 坐标，排除左侧表头宽度
    const defaultX = this.gantt.taskTableWidth || 0;

    const {
      start = 0.2,
      end = 0.5,
      width = defaultWidth, // 默认使用容器宽度
      height = 30,
      x = defaultX, // 默认排除左侧表头宽度，与时间轴内容区域对齐
      y = 0, // 默认贴着容器底部
      delayTime = 10
    } = config;

    // 将 DataZoom 添加到容器的父级，这样可以显示在容器外部
    const parentContainer = container.parentElement;
    if (!parentContainer) {
      throw new Error(`DataZoom container "${containerId}" has no parent element`);
    }

    // 确保父容器有相对定位
    const parentStyle = window.getComputedStyle(parentContainer);
    if (parentStyle.position === 'static') {
      parentContainer.style.position = 'relative';
    }

    // 创建独立的 Canvas 和 Stage
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dataZoomCanvas';
    this.canvas.width = width;
    this.canvas.height = height;

    // 获取父容器的位置信息
    const parentRect = parentContainer.getBoundingClientRect();

    // 计算相对于父容器的偏移
    const relativeLeft = containerRect.left - parentRect.left + x;
    const relativeTop = containerRect.bottom - parentRect.top + y;

    this.canvas.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      position: absolute;
      top: ${relativeTop}px;
      left: ${relativeLeft}px;
      z-index: 1000;
      pointer-events: auto;
    `;

    parentContainer.appendChild(this.canvas);

    this.stage = createStage({
      canvas: this.canvas,
      width,
      height,
      autoRender: true
    });

    // 创建 DataZoom 实例
    this.dataZoom = new DataZoom({
      start,
      end,
      position: { x: 0, y: 0 },
      size: { width, height },
      showDetail: false, // 恒定为 false，不允许用户配置
      delayTime,
      backgroundChartStyle: {
        line: { visible: true, stroke: '#ddd' },
        area: { visible: true, fill: '#f5f5f5' }
      },
      startHandlerStyle: { fill: '#1976d2', size: 8 },
      endHandlerStyle: { fill: '#1976d2', size: 8 },
      middleHandlerStyle: {
        visible: true,
        background: { style: { fill: 'rgba(25,118,210,0.1)' } }
      }
    });

    this.stage.defaultLayer.add(this.dataZoom as any);
    this.stage.render();

    this.lastDataZoomState = { start, end };
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // DataZoom 变化时同步到 Gantt
    const dataZoomChangeHandler = (event: any) => {
      if (this.isUpdatingFromGantt) {
        return;
      }

      this.isUpdatingFromDataZoom = true;

      let start = event.start ?? event.detail?.start ?? event.currentTarget?.attribute?.start;
      let end = event.end ?? event.detail?.end ?? event.currentTarget?.attribute?.end;

      if (start === undefined || end === undefined) {
        start = this.dataZoom.attribute.start;
        end = this.dataZoom.attribute.end;
      }

      if (start !== undefined && end !== undefined && !isNaN(start) && !isNaN(end)) {
        this.applyDataZoomRangeToGantt(start, end);
      }

      setTimeout(() => {
        this.isUpdatingFromDataZoom = false;
      }, 50);
    };

    this.dataZoom.addEventListener('change', dataZoomChangeHandler);
    this.cleanupCallbacks.push(() => {
      this.dataZoom.removeEventListener('change', dataZoomChangeHandler);
    });

    // Gantt 滚动时同步到 DataZoom
    const ganttScrollHandler = (event: any) => {
      if (this.isUpdatingFromDataZoom) {
        return;
      }
      if (event.scrollDirection !== 'horizontal') {
        return;
      }

      this.isUpdatingFromGantt = true;
      const boundaries = this.getGanttViewBoundaries();
      this.dataZoom.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);

      // 强制重新渲染
      this.stage.render();

      setTimeout(() => {
        // 重新启用 DataZoom 的 change 事件
        this.dataZoom.setAttribute('disableTriggerEvent', false);
        this.isUpdatingFromGantt = false;
      }, 10);
    };

    this.gantt.addEventListener('scroll', ganttScrollHandler);
    this.cleanupCallbacks.push(() => {
      this.gantt.removeEventListener('scroll', ganttScrollHandler);
    });

    // 窗口大小变化时的响应式更新
    const windowResizeHandler = () => {
      // 使用防抖避免频繁更新
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.updateResponsive();
        // 重新计算限制，因为视口宽度可能发生变化
        this.updateDataZoomLimits();
      }, 150);
    };

    window.addEventListener('resize', windowResizeHandler);
    this.cleanupCallbacks.push(() => {
      window.removeEventListener('resize', windowResizeHandler);
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
    });

    // 监听 Gantt 的缩放事件，重新计算限制并同步 DataZoom 位置
    const ganttZoomHandler = () => {
      // 延迟更新，避免与缩放操作冲突
      setTimeout(() => {
        // 重新计算限制
        this.updateDataZoomLimits();
        // 同步 DataZoom 位置到当前 Gantt 视图
        if (!this.isUpdatingFromDataZoom) {
          this.syncToDataZoom();
        }
      }, 100);
    };

    this.gantt.addEventListener('zoom', ganttZoomHandler);
    this.cleanupCallbacks.push(() => {
      this.gantt.removeEventListener('zoom', ganttZoomHandler);
    });
  }

  /**
   * 计算 DataZoom 的合理范围限制
   */
  private calculateDataZoomLimits(): DataZoomLimits {
    // 获取 Gantt 的缩放限制
    let minTimePerPixel: number;
    let maxTimePerPixel: number;

    if (this.gantt.zoomScaleManager) {
      minTimePerPixel = this.gantt.zoomScaleManager.getGlobalMinTimePerPixel?.() || 1000;
      maxTimePerPixel = this.gantt.zoomScaleManager.getGlobalMaxTimePerPixel?.() || 6000000;
    } else {
      minTimePerPixel = this.gantt.parsedOptions.zoom?.minTimePerPixel ?? 1000;
      maxTimePerPixel = this.gantt.parsedOptions.zoom?.maxTimePerPixel ?? 6000000;
    }

    // 获取关键参数
    const viewportWidth = this.gantt.tableNoFrameWidth; // 视口宽度（像素）
    const totalTimeRange = this.gantt.parsedOptions._maxDateTime - this.gantt.parsedOptions._minDateTime; // 总时间范围

    // 计算 minSpan：当使用 minTimePerPixel 时，视口能显示的时间范围占总时间的比例
    const minViewTimeRange = minTimePerPixel * viewportWidth; // 最小缩放时视口显示的时间范围
    const minRangeRatio = Math.min(1.0, minViewTimeRange / totalTimeRange);

    // 计算 maxSpan：当使用 maxTimePerPixel 时，视口能显示的时间范围占总时间的比例
    const maxViewTimeRange = maxTimePerPixel * viewportWidth; // 最大缩放时视口显示的时间范围
    const maxRangeRatio = Math.min(1.0, maxViewTimeRange / totalTimeRange);

    // 确保逻辑正确：minSpan < maxSpan
    const finalMinRangeRatio = Math.min(minRangeRatio, maxRangeRatio);
    const finalMaxRangeRatio = Math.max(minRangeRatio, maxRangeRatio);

    return {
      minRangeRatio: finalMinRangeRatio,
      maxRangeRatio: finalMaxRangeRatio,
      minTimePerPixel,
      maxTimePerPixel
    };
  }

  /**
   * 更新 DataZoom 的范围限制
   */
  private updateDataZoomLimits(): void {
    const limits = this.calculateDataZoomLimits();

    // 设置 DataZoom 的范围限制
    this.dataZoom.setAttributes({
      minSpan: limits.minRangeRatio,
      maxSpan: limits.maxRangeRatio
    });

    // 强制更新 DataZoom
    this.stage.render();
  }

  /**
   * 获取 Gantt 视图边界信息
   */
  private getGanttViewBoundaries() {
    const scrollLeft = this.gantt.stateManager.scrollLeft;
    const totalWidth = this.gantt.getAllDateColsWidth();
    const viewportWidth = this.gantt.tableNoFrameWidth;

    const startRatio = Math.max(0, Math.min(1, scrollLeft / totalWidth));
    const endRatio = Math.max(0, Math.min(1, (scrollLeft + viewportWidth) / totalWidth));

    return {
      scrollLeft,
      totalWidth,
      viewportWidth,
      startRatio,
      endRatio
    };
  }

  /**
   * 将 DataZoom 范围应用到 Gantt 视图
   */
  private applyDataZoomRangeToGantt(start: number, end: number): void {
    if (start === undefined || end === undefined || isNaN(start) || isNaN(end)) {
      return;
    }

    // 更新状态记录
    this.lastDataZoomState = { start, end };

    // 获取当前 Gantt 的基础信息
    const currentViewportWidth = this.gantt.tableNoFrameWidth;
    const currentTimePerPixel = this.gantt.getCurrentTimePerPixel();
    const rangeRatio = end - start;

    // 根据 DataZoom 范围计算目标 timePerPixel
    const totalTimeRange = this.gantt.parsedOptions._maxDateTime - this.gantt.parsedOptions._minDateTime;
    const selectedTimeRange = totalTimeRange * rangeRatio;
    const targetTimePerPixel = selectedTimeRange / currentViewportWidth;

    // 应用新的 timePerPixel
    if (Math.abs(targetTimePerPixel - currentTimePerPixel) > currentTimePerPixel * 0.01) {
      if (this.gantt.zoomScaleManager) {
        const targetLevel = this.gantt.zoomScaleManager.findOptimalLevel(targetTimePerPixel);
        const currentLevel = this.gantt.zoomScaleManager.getCurrentLevel();

        if (targetLevel !== currentLevel) {
          this.gantt.zoomScaleManager.switchToLevel(targetLevel);
        }

        this.gantt.setTimePerPixel(targetTimePerPixel);
      } else {
        this.gantt.setTimePerPixel(targetTimePerPixel);
      }
    }

    // 重新计算滚动位置
    const newTotalWidth = this.gantt.getAllDateColsWidth();
    const targetScrollLeft = start * newTotalWidth;
    this.gantt.stateManager.setScrollLeft(targetScrollLeft);
  }

  /**
   * 同步初始位置
   */
  private syncInitialPosition(): void {
    setTimeout(() => {
      const boundaries = this.getGanttViewBoundaries();
      if (boundaries.startRatio > 0 || boundaries.endRatio < 1) {
        this.dataZoom.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
      }
    }, 100);
  }

  /**
   * 手动同步 DataZoom 到 Gantt 当前视图
   */
  syncToGantt(): void {
    const start = this.dataZoom.attribute.start || 0;
    const end = this.dataZoom.attribute.end || 1;
    this.applyDataZoomRangeToGantt(start, end);
  }

  /**
   * 手动同步 Gantt 当前视图到 DataZoom
   */
  syncToDataZoom(): void {
    const boundaries = this.getGanttViewBoundaries();

    this.dataZoom.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
  }

  /**
   * 私有方法：同步 DataZoom 范围到 Gantt（带状态控制）
   */
  private syncToGanttWithState(start: number, end: number): void {
    this.isUpdatingFromDataZoom = true;
    this.applyDataZoomRangeToGantt(start, end);
    setTimeout(() => {
      this.isUpdatingFromDataZoom = false;
    }, 50);
  }

  /**
   * 设置 DataZoom 的范围
   */
  setRange(start: number, end: number): void {
    this.dataZoom.setStartAndEnd(start, end);
  }

  /**
   * 获取 DataZoom 当前范围
   */
  getRange(): { start: number; end: number } {
    return {
      start: this.dataZoom.attribute.start || 0,
      end: this.dataZoom.attribute.end || 1
    };
  }

  /**
   * 更新 DataZoom 尺寸
   */
  resize(width?: number, height?: number): void {
    // 如果没有提供宽度，自动计算：容器宽度减去左侧表头宽度
    if (width === undefined) {
      const containerId = this.getContainerId();
      const container = document.getElementById(containerId);
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const taskTableWidth = this.gantt.taskTableWidth || 0;
        width = (containerRect.width || 1000) - taskTableWidth;
      } else {
        width = 1000;
      }
    }

    if (height === undefined) {
      height = 30;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.stage.resize(width, height);
    this.dataZoom.setAttributes({
      size: { width, height }
    });

    // 强制重新渲染
    this.stage.render();
  }

  /**
   * 响应式更新 DataZoom 大小和位置
   * 当容器大小或位置发生变化时调用
   */
  updateResponsive(): void {
    const containerId = this.getContainerId();
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }

    // 保存当前的 DataZoom 状态
    const currentStart = this.dataZoom.attribute.start;
    const currentEnd = this.dataZoom.attribute.end;

    const containerRect = container.getBoundingClientRect();
    // 计算新宽度：容器宽度减去左侧表头宽度
    const taskTableWidth = this.gantt.taskTableWidth || 0;
    const newWidth = (containerRect.width || 1000) - taskTableWidth;

    // 更新宽度
    this.resize(newWidth);

    // 更新位置（保持与时间轴内容区域对齐，排除左侧表头）
    const defaultX = this.gantt.taskTableWidth || 0;
    this.updatePosition(defaultX, 0);

    // 确保 DataZoom 状态保持一致
    this.dataZoom.setStartAndEnd(currentStart, currentEnd);

    // 同步到 Gantt（可能因为宽度变化导致时间轴需要重新计算）
    setTimeout(() => {
      this.syncToGanttWithState(currentStart, currentEnd);
    }, 50);
  }

  /**
   * 更新 DataZoom 位置
   * 当容器位置发生变化时调用
   */
  updatePosition(x?: number, y?: number): void {
    const containerId = this.getContainerId();
    const container = document.getElementById(containerId);
    const parentContainer = container?.parentElement;

    if (!container || !parentContainer) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const parentRect = parentContainer.getBoundingClientRect();

    const relativeLeft = containerRect.left - parentRect.left + (x ?? 0);
    const relativeTop = containerRect.bottom - parentRect.top + (y ?? 0);

    this.canvas.style.left = `${relativeLeft}px`;
    this.canvas.style.top = `${relativeTop}px`;
  }

  /**
   * 销毁 DataZoom 集成
   */
  destroy(): void {
    // 清理事件监听器
    this.cleanupCallbacks.forEach(cleanup => cleanup());
    this.cleanupCallbacks = [];

    // 清理 DataZoom canvas
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    // 清理 stage
    if (this.stage) {
      this.stage.release();
    }
  }
}
