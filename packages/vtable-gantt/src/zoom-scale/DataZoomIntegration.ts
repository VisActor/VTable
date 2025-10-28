import type { Gantt } from '../Gantt';
import { DataZoom, createStage, vglobal } from '@visactor/vtable/es/vrender';

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
  minMillisecondsPerPixel: number;
  maxMillisecondsPerPixel: number;
}

/**
 * DataZoom 与 Gantt 集成管理器
 * 负责 DataZoom 组件与 Gantt 图表的双向同步
 */
export class DataZoomIntegration {
  private gantt: Gantt;
  private dataZoomAxis: DataZoom;
  private stage: any;
  private canvas: HTMLCanvasElement;
  private isUpdatingFromDataZoom = false;
  private isUpdatingFromGantt = false;
  private lastDataZoomState = { start: 0.2, end: 0.5 };
  private cleanupCallbacks: (() => void)[] = [];
  private resizeTimeout: NodeJS.Timeout | null = null;
  private isInitializing = true;

  constructor(gantt: Gantt, config: DataZoomConfig) {
    this.gantt = gantt;
    this.initializeDataZoom(config);
    this.setupEventListeners();
    this.updateDataZoomLimits();
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

    // 获取甘特图容器（VTable 容器）
    const ganttContainer = this.gantt.container as HTMLElement;
    if (!ganttContainer) {
      throw new Error('Gantt container not found');
    }

    // 计算 DataZoom 的默认宽度：甘特图容器宽度减去左侧表头宽度
    const taskTableWidth = this.gantt.taskTableWidth || 0;
    const ganttContainerWidth = ganttContainer.offsetWidth || 1000;
    const defaultWidth = ganttContainerWidth - taskTableWidth;

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

    // 确保 VTable 容器有相对定位
    const containerStyle = window.getComputedStyle(ganttContainer);
    if (containerStyle.position === 'static') {
      ganttContainer.style.position = 'relative';
    }

    const dataZoomWrapper = document.createElement('div');
    dataZoomWrapper.id = 'dataZoomWrapper';
    dataZoomWrapper.style.cssText = `
      width: 100%;
      height: ${height}px;
      position: absolute;
      bottom: ${y}px;
      left: 0px;
      background: transparent;
      overflow: visible;
      pointer-events: none;
      z-index: 1000;
    `;

    // 创建独立的 Canvas 和 Stage
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dataZoomCanvas';
    this.canvas.width = width;
    this.canvas.height = height;

    this.canvas.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      position: absolute;
      top: 0px;
      left: ${x}px;
      pointer-events: auto;
    `;

    // 将 Canvas 添加到包装器，再将包装器添加到 VTable 容器
    dataZoomWrapper.appendChild(this.canvas);
    ganttContainer.appendChild(dataZoomWrapper);

    this.stage = createStage({
      canvas: this.canvas,
      width,
      height,
      autoRender: true
    });

    // 创建 DataZoom 实例
    this.dataZoomAxis = new DataZoom({
      start,
      end,
      position: { x: 0, y: 0 },
      size: { width, height: height - 1 },
      showDetail: false,
      delayTime,
      brushSelect: false,
      backgroundChartStyle: {
        line: { visible: true, stroke: '#ddd' },
        area: { visible: true, fill: '#f5f5f5' }
      },
      startHandlerStyle: {
        symbolType:
          'M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3\n' +
          'C-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1' +
          'v-2.6\nC-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,' +
          '0-0.1,0-0.1v-2.6\nC0.3-1.4,0.3-1.4,0.3-1.4z;',
        fill: '#fff',
        size: config.width ?? 30,
        stroke: '#c2c8cf',
        lineWidth: 1
      },
      endHandlerStyle: {
        symbolType:
          'M-0.5-2.4h0.9c0.4,0,0.7,0.3,0.7,0.7v3.3c0,0.4-0.3,0.7-0.7,0.7h-0.9c-0.4,0-0.7-0.3-0.7-0.7v-3.3\n' +
          'C-1.2-2-0.9-2.4-0.5-2.4z M-0.4-1.4L-0.4-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,0-0.1,0-0.1' +
          'v-2.6\nC-0.4-1.4-0.4-1.4-0.4-1.4z M0.3-1.4L0.3-1.4c0,0,0,0.1,0,0.1v2.6c0,0.1,0,0.1,0,0.1l0,0c0,0,' +
          '0-0.1,0-0.1v-2.6\nC0.3-1.4,0.3-1.4,0.3-1.4z;',
        fill: '#fff',
        size: config.width ?? 30,
        stroke: '#c2c8cf',
        lineWidth: 1
      },
      middleHandlerStyle: {
        visible: false
      }
    });

    this.stage.defaultLayer.add(this.dataZoomAxis as any);

    vglobal.getRequestAnimationFrame()(() => {
      if (this.isInitializing) {
        const boundaries = this.getGanttViewBoundaries();
        this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
        this.isInitializing = false;
      }
      this.stage.render();
    });

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
        start = this.dataZoomAxis.attribute.start;
        end = this.dataZoomAxis.attribute.end;
      }

      if (start !== undefined && end !== undefined && !isNaN(start) && !isNaN(end)) {
        this.applyDataZoomRangeToGantt(start, end);
      }

      setTimeout(() => {
        this.isUpdatingFromDataZoom = false;
      }, 50);
    };

    this.dataZoomAxis.addEventListener('change', dataZoomChangeHandler);
    this.cleanupCallbacks.push(() => {
      this.dataZoomAxis.removeEventListener('change', dataZoomChangeHandler);
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
      this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);

      this.stage.render();

      setTimeout(() => {
        this.dataZoomAxis.setAttribute('disableTriggerEvent', false);
        this.isUpdatingFromGantt = false;
      }, 10);
    };

    this.gantt.addEventListener('scroll', ganttScrollHandler);
    this.cleanupCallbacks.push(() => {
      this.gantt.removeEventListener('scroll', ganttScrollHandler);
    });

    // 窗口大小变化时的响应式更新
    const windowResizeHandler = () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        this.updateResponsive();
        this.updateDataZoomLimits();
      }, 50);
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
      setTimeout(() => {
        this.updateDataZoomLimits();
        // 同步 DataZoom 位置到当前 Gantt 视图
        if (!this.isUpdatingFromDataZoom) {
          this.syncToDataZoom();
        }
      }, 50);
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
    let minMillisecondsPerPixel: number;
    let maxMillisecondsPerPixel: number;

    if (this.gantt.zoomScaleManager) {
      minMillisecondsPerPixel = this.gantt.zoomScaleManager.getGlobalMinMillisecondsPerPixel?.() || 1000;
      maxMillisecondsPerPixel = this.gantt.zoomScaleManager.getGlobalMaxMillisecondsPerPixel?.() || 6000000;
    } else {
      minMillisecondsPerPixel = this.gantt.parsedOptions.zoom?.minMillisecondsPerPixel ?? 1000;
      maxMillisecondsPerPixel = this.gantt.parsedOptions.zoom?.maxMillisecondsPerPixel ?? 6000000;
    }

    // 获取关键参数
    const viewportWidth = this.gantt.tableNoFrameWidth; // 视口宽度（像素）
    const totalTimeRange = this.gantt.parsedOptions._maxDateTime - this.gantt.parsedOptions._minDateTime; // 总时间范围

    // 计算 minSpan：当使用 minMillisecondsPerPixel 时，视口能显示的时间范围占总时间的比例
    const minViewTimeRange = minMillisecondsPerPixel * viewportWidth; // 最小缩放时视口显示的时间范围
    const minRangeRatio = Math.min(1.0, minViewTimeRange / totalTimeRange);

    // 计算 maxSpan：当使用 maxMillisecondsPerPixel 时，视口能显示的时间范围占总时间的比例
    const maxViewTimeRange = maxMillisecondsPerPixel * viewportWidth; // 最大缩放时视口显示的时间范围
    const maxRangeRatio = Math.min(1.0, maxViewTimeRange / totalTimeRange);

    // 确保逻辑正确：minSpan < maxSpan
    const finalMinRangeRatio = Math.min(minRangeRatio, maxRangeRatio);
    const finalMaxRangeRatio = Math.max(minRangeRatio, maxRangeRatio);

    return {
      minRangeRatio: finalMinRangeRatio,
      maxRangeRatio: finalMaxRangeRatio,
      minMillisecondsPerPixel,
      maxMillisecondsPerPixel
    };
  }

  /**
   * 更新 DataZoom 的范围限制
   */
  private updateDataZoomLimits(): void {
    const limits = this.calculateDataZoomLimits();

    this.dataZoomAxis.setAttributes({
      minSpan: limits.minRangeRatio,
      maxSpan: limits.maxRangeRatio
    });

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
    const currentMillisecondsPerPixel = this.gantt.getCurrentMillisecondsPerPixel();
    const rangeRatio = end - start;

    // 根据 DataZoom 范围计算目标 millisecondsPerPixel
    const totalTimeRange = this.gantt.parsedOptions._maxDateTime - this.gantt.parsedOptions._minDateTime;
    const selectedTimeRange = totalTimeRange * rangeRatio;
    const targetMillisecondsPerPixel = selectedTimeRange / currentViewportWidth;

    // 应用新的 millisecondsPerPixel
    if (Math.abs(targetMillisecondsPerPixel - currentMillisecondsPerPixel) > currentMillisecondsPerPixel * 0.01) {
      if (this.gantt.zoomScaleManager) {
        const targetLevel = this.gantt.zoomScaleManager.findOptimalLevel(targetMillisecondsPerPixel);
        const currentLevel = this.gantt.zoomScaleManager.getCurrentLevel();

        if (targetLevel !== currentLevel) {
          this.gantt.zoomScaleManager.switchToLevel(targetLevel);
        }

        this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel);
      } else {
        this.gantt.setMillisecondsPerPixel(targetMillisecondsPerPixel);
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
        this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
      }
    }, 100);
  }

  /**
   * 手动同步 DataZoom 到 Gantt 当前视图
   */
  syncToGantt(): void {
    const start = this.dataZoomAxis.attribute.start || 0;
    const end = this.dataZoomAxis.attribute.end || 1;
    this.applyDataZoomRangeToGantt(start, end);
  }

  /**
   * 手动同步 Gantt 当前视图到 DataZoom
   */
  syncToDataZoom(): void {
    const boundaries = this.getGanttViewBoundaries();

    this.dataZoomAxis.setStartAndEnd(boundaries.startRatio, boundaries.endRatio);
  }

  /**
   * 私有方法：同步 DataZoom 范围到 Gantt
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
    this.dataZoomAxis.setStartAndEnd(start, end);
  }

  /**
   * 获取 DataZoom 当前范围
   */
  getRange(): { start: number; end: number } {
    return {
      start: this.dataZoomAxis.attribute.start || 0,
      end: this.dataZoomAxis.attribute.end || 1
    };
  }

  /**
   * 更新 DataZoom 尺寸
   */
  resize(width?: number, height?: number): void {
    if (width === undefined) {
      // 使用甘特图容器而不是外部容器来计算宽度
      const ganttContainer = this.gantt.container as HTMLElement;
      if (ganttContainer) {
        const taskTableWidth = this.gantt.taskTableWidth || 0;
        width = ganttContainer.offsetWidth - taskTableWidth;
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
    this.dataZoomAxis.setAttributes({
      size: { width, height: height - 1 }
    });

    // 强制重新渲染
    this.stage.render();
  }

  /**
   * 响应式更新 DataZoom 大小和位置
   * 当容器大小或位置发生变化时调用
   */
  updateResponsive(): void {
    const ganttContainer = this.gantt.container as HTMLElement;
    if (!ganttContainer) {
      return;
    }

    // 计算新宽度：甘特图容器宽度减去左侧表头宽度
    const taskTableWidth = this.gantt.taskTableWidth || 0;
    const newWidth = ganttContainer.offsetWidth - taskTableWidth;

    this.resize(newWidth);

    // 更新位置（保持与时间轴内容区域对齐，排除左侧表头）
    const defaultX = this.gantt.taskTableWidth || 0;
    this.updatePosition(defaultX, 0);

    // 重新同步 DataZoom 状态，因为视图宽度变化会影响时间范围的显示比例
    setTimeout(() => {
      this.syncToDataZoom();
    }, 10);
  }

  /**
   * 更新 DataZoom 位置
   * 当容器位置发生变化时调用
   */
  updatePosition(x?: number, y?: number): void {
    const xPos = x ?? this.gantt.taskTableWidth ?? 0;
    this.canvas.style.left = `${xPos}px`;
  }

  /**
   * 销毁 DataZoom 集成
   */
  destroy(): void {
    this.cleanupCallbacks.forEach(cleanup => cleanup());
    this.cleanupCallbacks = [];

    // 清理包装器和 Canvas
    if (this.canvas && this.canvas.parentNode) {
      const wrapper = this.canvas.parentNode as HTMLElement;
      if (wrapper && wrapper.id === 'dataZoomWrapper' && wrapper.parentNode) {
        // 移除整个包装器
        wrapper.parentNode.removeChild(wrapper);
      } else {
        // 如果没有包装器，直接移除 Canvas
        wrapper.removeChild(this.canvas);
      }
    }

    if (this.stage) {
      this.stage.release();
    }
  }
}
