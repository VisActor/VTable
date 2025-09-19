# Gantt + DataZoom 集成核心技术方案

## 1. Gantt Zoom 核心机制

### 1.1 核心概念

- **timePerPixel**：每像素代表的毫秒数，是 Gantt 缩放的核心指标
- **ZoomScaleManager**：智能级别管理器，根据 timePerPixel 自动切换时间刻度级别
- **timelineColWidth**：时间轴列宽 = msPerStep / timePerPixel

### 1.2 缩放工作流程

```
用户操作(滚轮/API) → 计算新timePerPixel → ZoomScaleManager选择最佳级别
→ 切换时间刻度组合 → recalculateTimeScale() → 重新渲染
```

### 1.3 关键代码逻辑

```typescript
// 核心计算公式
const msPerStep = getUnitMilliseconds(scale.unit, scale.step);
const timelineColWidth = msPerStep / this.timePerPixel;

// 缩放级别切换
const targetLevel = zoomScaleManager.findOptimalLevel(newTimePerPixel);
if (targetLevel !== currentLevel) {
  zoomScaleManager.switchToLevel(targetLevel);
}
gantt.setTimePerPixel(newTimePerPixel);
```

## 2. DataZoom 核心能力

### 2.1 核心特性

- **0-1 比例系统**：start/end 表示选择范围比例
- **原生拖拽交互**：左右手柄 + 中间拖拽 + 框选
- **预览图表**：背景显示数据分布（折线图/面积图）
- **事件系统**：change 事件通知范围变化

### 2.2 关键接口

```typescript
class DataZoom {
  setPreviewData(data: any[]): void;                    // 设置预览数据
  setPreviewPointsX/Y/X1/Y1(callback): void;           // 坐标映射函数
  setStartAndEnd(start: number, end: number): void;     // 程序化设置范围
  addEventListener('change', callback): void;           // 监听范围变化
  readonly state: { start: number; end: number };      // 当前状态
}
```

## 3. 集成核心策略

### 3.1 数据层：时间线预览数据生成

```typescript
class GanttTimelineDataProvider {
  generatePreviewData(sampleCount = 200): TimelineDataPoint[] {
    // 从项目时间范围均匀采样
    // 计算每个时间点的任务数量/工作负载
    // 返回 DataZoom 需要的预览数据
  }

  timeToRatio(time: Date): number {
    return (time.getTime() - projectStart) / projectDuration;
  }

  ratioToTime(ratio: number): Date {
    return new Date(projectStart + ratio * projectDuration);
  }
}
```

### 3.2 映射层：坐标系转换

```typescript
class GanttDataZoomCoordinateMapper {
  setupCoordinateMapping(): void {
    dataZoom.setPreviewPointsX(d => this.timeToPixel(d.timestamp));
    dataZoom.setPreviewPointsY(d => this.taskCountToPixel(d.taskCount));
    dataZoom.setPreviewPointsX1(d => this.timeToPixel(d.timestamp));
    dataZoom.setPreviewPointsY1(d => this.getBaseline());
  }
}
```

### 3.3 控制层：双向同步

```typescript
class GanttDataZoomController {
  constructor(gantt, options) {
    // DataZoom → Gantt：范围变化时更新 Gantt 视图
    dataZoom.addEventListener('change', e => {
      const startTime = this.ratioToTime(e.start);
      const endTime = this.ratioToTime(e.end);
      this.updateGanttTimeWindow(startTime, endTime);
    });

    // Gantt → DataZoom：滚动时同步 DataZoom 选择范围
    gantt.addEventListener('scroll', e => {
      const visibleRange = this.calculateVisibleTimeRange();
      const startRatio = this.timeToRatio(visibleRange.start);
      const endRatio = this.timeToRatio(visibleRange.end);
      dataZoom.setStartAndEnd(startRatio, endRatio);
    });
  }

  updateGanttTimeWindow(startTime: Date, endTime: Date): void {
    // 计算新的 timePerPixel 以适应选择的时间窗口
    const duration = endTime.getTime() - startTime.getTime();
    const ganttWidth = gantt.tableNoFrameWidth;
    const newTimePerPixel = duration / ganttWidth;

    // 应用新的 timePerPixel（触发 ZoomScaleManager 级别切换）
    gantt.setTimePerPixel(newTimePerPixel);

    // 滚动到新的开始位置
    const scrollLeft = this.calculateScrollPositionForTime(startTime);
    gantt.stateManager.setScrollLeft(scrollLeft);
  }
}
```

## 4. 集成配置

### 4.1 Gantt 配置扩展

```typescript
interface GanttConstructorOptions {
  dataZoom?: {
    enabled: boolean;
    height?: number; // 默认 40px
    initialStart?: number; // 默认 0
    initialEnd?: number; // 默认 1
    previewSampleCount?: number; // 默认 200
    enableRealTimeUpdate?: boolean; // 默认 true
    enableScrollSync?: boolean; // 默认 true
    theme?: 'default' | 'light' | 'dark';
  };
}
```

### 4.2 集成到 Gantt 主类

```typescript
class Gantt {
  dataZoomController?: GanttDataZoomController;

  constructor(container, options) {
    // ... 现有初始化逻辑

    if (options.dataZoom?.enabled) {
      this.initDataZoom(options.dataZoom);
    }
  }

  private initDataZoom(options: GanttDataZoomOptions): void {
    this.dataZoomController = new GanttDataZoomController(this, {
      ...options,
      position: { x: 20, y: this.tableNoFrameHeight - options.height - 20 },
      width: Math.max(400, this.tableNoFrameWidth - 40)
    });
  }
}
```

## 5. 核心优势

### 5.1 技术优势

- **无缝集成**：DataZoom 直接控制 Gantt 的 timePerPixel，完全复用现有缩放逻辑
- **智能级别切换**：DataZoom 范围变化自动触发 ZoomScaleManager 选择最佳时间刻度
- **双向同步**：DataZoom 和 Gantt 滚动/缩放状态实时同步
- **高性能**：预览数据采样 + 缓存，支持大项目

### 5.2 用户体验

- **直观导航**：可视化时间线预览，快速定位项目任意时间段
- **任务密度可视化**：一眼看出项目忙碌/空闲时段
- **精确控制**：拖拽手柄精确调整时间范围
- **原生交互**：充分利用 DataZoom 成熟的拖拽/框选能力

## 6. 实现要点

1. **DataZoom 不改变 Gantt 缩放逻辑**：只是提供另一种控制 timePerPixel 的方式
2. **时间范围映射**：项目时间范围 ↔ DataZoom 0-1 比例 ↔ 像素坐标
3. **预览数据生成**：从 Gantt 任务数据按时间采样生成任务密度分布
4. **事件同步**：DataZoom change → 更新 Gantt；Gantt scroll → 更新 DataZoom
5. **布局集成**：DataZoom 作为 Gantt scenegraph 的子组件渲染

这个方案的核心是让 DataZoom 成为控制 Gantt timePerPixel 的另一种交互方式，完全复用现有的缩放和级别切换逻辑。
