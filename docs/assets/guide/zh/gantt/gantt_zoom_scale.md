# 甘特图智能缩放

甘特图智能缩放功能提供了多级别的时间轴缩放能力，能够根据不同的缩放级别自动切换合适的时间刻度组合，为用户提供从宏观到微观的项目视图。

## 功能特性

- **多级别缩放**：支持定义多个缩放级别，每个级别对应不同的时间刻度组合
- **自动切换**：根据当前缩放状态自动选择最适合的时间刻度显示
- **平滑过渡**：在不同级别间切换时提供平滑的视觉过渡效果
- **交互式缩放**：支持鼠标滚轮缩放和程序化缩放控制
- **优先级覆盖**：启用后会覆盖 `timelineHeader.scales` 的静态配置

## 基本配置

### 启用智能缩放

```javascript
const ganttOptions = {
  // 其他配置...
  timelineHeader: {
    // 智能缩放配置
    zoomScale: {
      enabled: true, // 启用智能缩放功能
      levels: [
        // 级别配置数组
      ]
    }
  }
};
```

### 级别配置结构

每个级别是一个时间刻度数组，从粗粒度到细粒度排列：

```typescript
interface IZoomScale {
  enabled: boolean; // 是否启用智能缩放
  levels: ITimelineScale[][]; // 多级别时间刻度配置
}
```

## 级别设计示例

### 基础三级配置

```javascript
timelineHeader: {
  zoomScale: {
    enabled: true,
    levels: [
    // 级别0：月-周组合 (最粗糙，适合查看长期项目)
    [
      {
        unit: 'month',
        step: 1,
        format: date => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
        }
      },
      {
        unit: 'week',
        step: 1,
        format: date => {
          const weekNum = Math.ceil(
            (date.startDate.getDate() + new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) / 7
          );
          return `Week ${weekNum}`;
        }
      }
    ],

    // 级别1：月-周-日组合 (适合查看月度计划)
    [
      {
        unit: 'month',
        step: 1,
        format: date => {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
        }
      },
      {
        unit: 'week',
        step: 1,
        format: date => `Week ${Math.ceil(date.startDate.getDate() / 7)}`
      },
      {
        unit: 'day',
        step: 4,
        format: date => date.startDate.getDate().toString()
      }
    ],

    // 级别2：日-小时组合 (适合查看详细进度)
    [
      {
        unit: 'day',
        step: 1,
        format: date => {
          const day = date.startDate.getDate();
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${day} ${monthNames[date.startDate.getMonth()]}`;
        }
      },
      {
        unit: 'hour',
        step: 6,
        format: date => {
          const startHour = date.startDate.getHours();
          return `${startHour.toString().padStart(2, '0')}:00`;
        }
      }
    ]
  ]
  }
}
```

## API 使用方法

### 获取缩放管理器

```javascript
const zoomManager = ganttInstance.zoomScaleManager;
```

### 缩放操作

#### 1. 按百分比缩放

```javascript
// 放大10%
zoomManager.zoomByPercentage(10);

// 缩小10%
zoomManager.zoomByPercentage(-10);

// 指定缩放中心
zoomManager.zoomByPercentage(15, true, 300);
```

**参数说明：**

- `percentage` (number): 缩放百分比，正数放大，负数缩小
- `center` (boolean, 可选): 是否保持视图中心，默认为 true
- `centerX` (number, 可选): 缩放中心的 X 坐标，默认为视图中心

#### 2. 设置缩放状态

精确设置到指定的缩放状态，支持多种参数组合方式。

```javascript
// 方式1：通过级别编号设置
zoomManager.setZoomPosition({
  levelNum: 2, // 切换到级别2
  colWidth: 60 // 设置列宽为60px
});

// 方式2：通过时间单位设置
zoomManager.setZoomPosition({
  minUnit: 'day', // 最小时间单位为天
  step: 1, // 步长为1
  colWidth: 80 // 设置列宽为80px（可选）
});

// 方式3：仅切换级别（使用级别的中间状态）
zoomManager.setZoomPosition({
  levelNum: 1
});
```

**参数类型：**

```typescript
interface SetZoomPositionParams {
  levelNum?: number; // 目标级别索引
  minUnit?: string; // 最小时间单位
  step?: number; // 时间步长
  colWidth?: number; // 目标列宽
}
```

**参数说明：**

- `levelNum` (number, 可选)：目标级别索引，从 0 开始，对应 `levels` 数组中的位置

  - 当指定 `levelNum` 时，会切换到对应级别
  - 如果同时指定 `colWidth`，会在该级别内调整到指定列宽
  - 如果不指定 `colWidth`，会使用该级别的中间状态列宽

- `minUnit` (string, 可选)：最小时间单位，可选值：

  - `'year'`：年
  - `'month'`：月
  - `'week'`：周
  - `'day'`：日
  - `'hour'`：小时
  - `'minute'`：分钟
  - `'second'`：秒

- `step` (number, 可选)：时间步长，表示每个最小单位包含的数量

  - 例如：`minUnit: 'day', step: 2` 表示每 2 天为一个显示单元
  - 必须与 `minUnit` 配合使用

- `colWidth` (number, 可选)：目标列宽，单位为像素
  - 影响时间轴的显示密度
  - 建议范围：40-200px

**返回值：** `boolean` - 操作是否成功

**使用示例：**

```javascript
// 快速切换到周视图
const success = zoomManager.setZoomPosition({
  minUnit: 'week',
  step: 1,
  colWidth: 80
});

if (success) {
  console.log('缩放设置成功');
} else {
  console.log('缩放设置失败，可能参数不匹配任何级别');
}
```

### 状态查询

#### 获取详细缩放状态

获取当前缩放的详细信息，包含级别、时间单位、步长和列宽等完整状态。

```javascript
const state = zoomManager.getCurrentZoomState();
console.log('当前级别:', state.levelNum);
console.log('最小时间单位:', state.minUnit);
console.log('时间步长:', state.step);
console.log('列宽:', state.currentColWidth);
```

**返回值类型：**

```typescript
interface ZoomState {
  levelNum: number; // 当前级别索引，从0开始
  minUnit: string; // 最小时间单位 ('year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second')
  step: number; // 时间步长，表示每个最小单位包含的数量
  currentColWidth: number; // 当前列宽，单位为像素
}
```

**返回值说明：**

- `levelNum`：当前激活的缩放级别索引，对应 `levels` 数组中的位置
- `minUnit`：当前级别中最细粒度的时间单位，用于确定时间轴的最小显示单元
- `step`：最小时间单位的步长，例如 `step: 2` 且 `minUnit: 'day'` 表示每 2 天为一个显示单元
- `currentColWidth`：当前时间轴列的宽度，影响时间轴的显示密度

#### 获取当前级别

```javascript
const currentLevel = zoomManager.getCurrentLevel();
console.log('当前级别:', currentLevel);
```

## 交互方式

### 鼠标滚轮缩放和触控板缩放

启用智能缩放后，用户可以通过以下方式进行交互：

- **放大**：按住 `Ctrl` 键，向上滚动鼠标滚轮或者双指放大
- **缩小**：按住 `Ctrl` 键，向下滚动鼠标滚轮或者双指缩小
- **缩放中心**：缩放会以鼠标指针位置为中心进行

### 程序化控制

除了鼠标交互外，还可以通过 API 进行程序化控制，适用于：

- 自定义缩放按钮
- 快捷键绑定
- 自动缩放逻辑
- 状态同步

## 最佳实践

### 1. 级别设计原则

- **从粗到细**：级别 0 应该是最粗糙的时间刻度，级别越高越精细
- **合理过渡**：相邻级别之间的时间粒度差异不宜过大
- **实用性优先**：根据实际场景设计合适的时间刻度组合
- **合理的级别数量**：建议控制在 3-6 个级别

### 2. 时间刻度选择

根据项目周期选择合适的时间刻度：

- **长期项目**（几个月到几年）：年-季度-月 或 月-周
- **中期项目**（几周到几个月）：月-周-日
- **短期项目**（几天到几周）：周-日-小时
- **精细任务**（几小时到几天）：日-小时-分钟

### 3. 性能优化

- 避免过多的级别配置，以免影响切换性能
- 合理设置时间刻度的步长，避免过于密集的显示
- 在大数据量场景下，优先使用较粗的时间粒度

### 4. 用户体验

- 提供直观的缩放控制界面
- 显示当前缩放状态信息
- 支持快速跳转到特定级别
- 保持缩放操作的一致性和可预期性

## 事件监听

可以监听缩放相关的事件来实现自定义逻辑：

```javascript
// 监听缩放事件
ganttInstance.on('zoom', args => {
  console.log('缩放事件:', args);

  // 获取当前时间单位信息
  const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
  console.log('当前时间单位:', {
    unit: scale?.unit,
    step: scale?.step,
    timelineColWidth: ganttInstance.parsedOptions.timelineColWidth
  });
});
```

通过智能缩放功能，可以为用户提供更灵活、更直观的甘特图查看体验，支持从项目全貌到任务细节的无缝切换。
