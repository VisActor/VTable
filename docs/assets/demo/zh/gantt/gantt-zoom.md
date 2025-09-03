---
category: examples
group: gantt
title: 甘特图智能缩放功能
cover:
link: gantt/zoom-scale
option: Gantt#zoomScale
---

# 甘特图智能缩放功能

甘特图的智能缩放功能提供了多级别的时间轴显示方案，能够根据缩放级别自动切换不同的时间刻度组合，让用户在不同的时间粒度下都能获得最佳的查看体验。该功能支持触控板缩放、鼠标滚轮缩放、API 缩放。

## 关键配置

- `zoomScale.enabled`: 启用智能缩放功能
- `zoomScale.levels`: 配置多级别时间刻度组合
- 鼠标滚轮缩放：按住 `Ctrl` 键并滚动鼠标滚轮进行缩放
- API 获得当前缩放状态：使用 `getCurrentZoomState` 提供的方法
- API 设置当前缩放状态：使用 `setZoomPosition` 提供的方法
- API 缩放：使用 `zoomScaleManager` 提供的缩放方法

## 代码演示

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;

const records = [
  {
    id: 1,
    title: '项目启动',
    start: '2024-07-01',
    end: '2024-07-05',
    progress: 100,
    children: [
      {
        id: 11,
        title: '项目启动会议',
        start: '2024-07-01',
        type: 'milestone',
        progress: 100
      },
      {
        id: 12,
        title: '需求收集',
        start: '2024-07-02',
        end: '2024-07-04',
        progress: 100
      },
      {
        id: 13,
        title: '项目计划制定',
        start: '2024-07-03',
        end: '2024-07-05',
        progress: 100
      }
    ]
  },
  {
    id: 2,
    title: '设计阶段',
    start: '2024-07-08',
    end: '2024-08-02',
    progress: 85,
    children: [
      {
        id: 21,
        title: '原型设计',
        start: '2024-07-08',
        end: '2024-07-18',
        progress: 100
      },
      {
        id: 22,
        title: 'UI/UX 设计',
        start: '2024-07-15',
        end: '2024-07-28',
        progress: 90
      },
      {
        id: 23,
        title: '技术架构设计',
        start: '2024-07-22',
        end: '2024-08-02',
        progress: 75
      },
      {
        id: 24,
        title: '设计评审',
        start: '2024-08-02',
        type: 'milestone',
        progress: 100
      }
    ]
  },
  {
    id: 3,
    title: '开发阶段',
    start: '2024-08-05',
    end: '2024-09-20',
    progress: 45,
    children: [
      {
        id: 31,
        title: '前端开发',
        start: '2024-08-05',
        end: '2024-09-10',
        progress: 60,
        children: [
          {
            id: 311,
            title: '页面框架搭建',
            start: '2024-08-05',
            end: '2024-08-12',
            progress: 100
          },
          {
            id: 312,
            title: '组件开发',
            start: '2024-08-13',
            end: '2024-08-28',
            progress: 80
          },
          {
            id: 313,
            title: '页面集成',
            start: '2024-08-29',
            end: '2024-09-10',
            progress: 30
          }
        ]
      },
      {
        id: 32,
        title: '后端开发',
        start: '2024-08-05',
        end: '2024-09-15',
        progress: 55,
        children: [
          {
            id: 321,
            title: '数据库设计',
            start: '2024-08-05',
            end: '2024-08-10',
            progress: 100
          },
          {
            id: 322,
            title: 'API 开发',
            start: '2024-08-11',
            end: '2024-09-05',
            progress: 70
          },
          {
            id: 323,
            title: '业务逻辑实现',
            start: '2024-08-20',
            end: '2024-09-15',
            progress: 40
          }
        ]
      },
      {
        id: 33,
        title: '移动端开发',
        start: '2024-08-12',
        end: '2024-09-20',
        progress: 25,
        children: [
          {
            id: 331,
            title: 'Android 开发',
            start: '2024-08-12',
            end: '2024-09-18',
            progress: 30
          },
          {
            id: 332,
            title: 'iOS 开发',
            start: '2024-08-15',
            end: '2024-09-20',
            progress: 20
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: '测试阶段',
    start: '2024-09-16',
    end: '2024-10-10',
    progress: 15,
    children: [
      {
        id: 41,
        title: '单元测试',
        start: '2024-09-16',
        end: '2024-09-25',
        progress: 40
      },
      {
        id: 42,
        title: '集成测试',
        start: '2024-09-23',
        end: '2024-10-02',
        progress: 20
      },
      {
        id: 43,
        title: '用户验收测试',
        start: '2024-09-30',
        end: '2024-10-08',
        progress: 0
      },
      {
        id: 44,
        title: '性能测试',
        start: '2024-10-01',
        end: '2024-10-05',
        progress: 0
      },
      {
        id: 45,
        title: '安全测试',
        start: '2024-10-03',
        end: '2024-10-07',
        progress: 0
      },
      {
        id: 46,
        title: '测试完成',
        start: '2024-10-10',
        type: 'milestone',
        progress: 0
      }
    ]
  },
  {
    id: 5,
    title: '部署上线',
    start: '2024-10-11',
    end: '2024-10-25',
    progress: 0,
    children: [
      {
        id: 51,
        title: '预发布环境部署',
        start: '2024-10-11',
        end: '2024-10-15',
        progress: 0
      },
      {
        id: 52,
        title: '生产环境准备',
        start: '2024-10-14',
        end: '2024-10-18',
        progress: 0
      },
      {
        id: 53,
        title: '数据迁移',
        start: '2024-10-16',
        end: '2024-10-20',
        progress: 0
      },
      {
        id: 54,
        title: '正式上线',
        start: '2024-10-21',
        end: '2024-10-22',
        progress: 0
      },
      {
        id: 55,
        title: '上线监控',
        start: '2024-10-22',
        end: '2024-10-25',
        progress: 0
      },
      {
        id: 56,
        title: '项目交付',
        start: '2024-10-25',
        type: 'milestone',
        progress: 0
      }
    ]
  },
  {
    id: 6,
    title: '运维支持',
    start: '2024-10-26',
    end: '2024-11-25',
    progress: 0,
    children: [
      {
        id: 61,
        title: '系统维护',
        start: '2024-10-26',
        end: '2024-11-15',
        progress: 0
      },
      {
        id: 62,
        title: '用户培训',
        start: '2024-10-28',
        end: '2024-11-05',
        progress: 0
      },
      {
        id: 63,
        title: '文档整理',
        start: '2024-11-01',
        end: '2024-11-10',
        progress: 0
      },
      {
        id: 64,
        title: '项目总结',
        start: '2024-11-20',
        end: '2024-11-25',
        progress: 0
      }
    ]
  },
  {
    id: 7,
    title: '市场推广',
    start: '2024-09-01',
    end: '2024-11-30',
    progress: 35
  },
  {
    id: 8,
    title: '用户调研',
    start: '2024-06-15',
    end: '2024-07-10',
    progress: 100
  },
  {
    id: 9,
    title: '竞品分析',
    start: '2024-06-20',
    end: '2024-07-15',
    progress: 100
  },
  {
    id: 10,
    title: '技术预研',
    start: '2024-06-25',
    end: '2024-07-20',
    progress: 90
  },
  {
    id: 11,
    title: '风险评估',
    start: '2024-07-10',
    end: '2024-07-25',
    progress: 85
  },
  {
    id: 12,
    title: '资源规划',
    start: '2024-07-05',
    end: '2024-07-30',
    progress: 95
  },
  {
    id: 13,
    title: '团队培训',
    start: '2024-08-01',
    end: '2024-08-15',
    progress: 70
  },
  {
    id: 14,
    title: '开发环境搭建',
    start: '2024-07-28',
    end: '2024-08-05',
    progress: 100
  },
  {
    id: 15,
    title: '代码规范制定',
    start: '2024-08-03',
    end: '2024-08-08',
    progress: 100
  },
  {
    id: 16,
    title: '第三方服务集成',
    start: '2024-08-20',
    end: '2024-09-10',
    progress: 60
  },
  {
    id: 17,
    title: '数据备份方案',
    start: '2024-09-05',
    end: '2024-09-20',
    progress: 40
  },
  {
    id: 18,
    title: '监控系统部署',
    start: '2024-09-25',
    end: '2024-10-15',
    progress: 20
  },
  {
    id: 19,
    title: '客户反馈收集',
    start: '2024-10-20',
    end: '2024-11-10',
    progress: 0
  },
  {
    id: 20,
    title: '版本迭代规划',
    start: '2024-11-01',
    end: '2024-11-30',
    progress: 0
  }
];

const columns = [
  {
    field: 'title',
    title: '任务名称',
    width: 250,
    tree: true
  },
  {
    field: 'start',
    title: '开始日期',
    width: 120
  },
  {
    field: 'end',
    title: '结束日期',
    width: 120
  },
  {
    field: 'progress',
    title: '进度(%)',
    width: 100
  }
];

const option = {
  records,
  taskListTable: {
    columns,
    tableWidth: 400,
    minTableWidth: 300,
    maxTableWidth: 600
  },
  // 智能缩放配置
  zoomScale: {
    enabled: true,
    levels: [
      // 级别0：月-周组合 (最粗糙)
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
              (date.startDate.getDate() +
                new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                7
            );
            return `Week ${weekNum}`;
          }
        }
      ],
      // 级别1：月-日组合
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
              (date.startDate.getDate() +
                new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                7
            );
            return `Week ${weekNum}`;
          }
        },
        {
          unit: 'day',
          step: 4,
          format: date => date.startDate.getDate().toString()
        }
      ],
      // 级别2：月-周-日组合
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
              (date.startDate.getDate() +
                new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                7
            );
            return `Week ${weekNum}`;
          }
        },
        {
          unit: 'day',
          step: 1,
          format: date => date.startDate.getDate().toString()
        }
      ],
      // 级别3：周-日-小时组合 (12小时)
      [
        {
          unit: 'week',
          step: 1,
          format: date => {
            const weekNum = Math.ceil(
              (date.startDate.getDate() +
                new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                7
            );
            return `Week ${weekNum}`;
          }
        },
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
          step: 12,
          format: date => {
            const startHour = date.startDate.getHours();
            const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
            return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
          }
        }
      ],
      // 级别4：日-小时组合 (6小时)
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
            const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
            return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
          }
        }
      ],
      // 级别5：日-小时组合 (1小时)
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
          step: 1,
          format: date => {
            const hour = date.startDate.getHours();
            return `${hour.toString().padStart(2, '0')}:00`;
          }
        }
      ]
    ]
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title}',
    labelTextStyle: {
      fontSize: 14,
      textAlign: 'left'
    },
    barStyle: {
      width: 24,
      barColor: '#4CAF50',
      completedBarColor: '#81C784',
      cornerRadius: 4
    }
  },
  timelineHeader: {
    colWidth: 60,
    backgroundColor: '#f8f9fa',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e9ecef'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e9ecef'
    }
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 1,
      borderColor: '#dee2e6',
      cornerRadius: 4
    },
    verticalSplitLineMoveable: true,
    verticalSplitLine: {
      lineColor: '#dee2e6',
      lineWidth: 2
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f1f3f4'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#f1f3f4'
    }
  },
  headerRowHeight: 50,
  rowHeight: 40,
  overscrollBehavior: 'none'
};

ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;

// 创建简单的缩放控制按钮
function createZoomControls() {
  // 清理可能存在的旧按钮
  const existingControls = document.getElementById('zoom-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'zoom-controls';
  controlsContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 8px;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: Arial, sans-serif;
    min-width: 180px;
  `;

  // 标题
  const title = document.createElement('div');
  title.textContent = '缩放控制';
  title.style.cssText = `
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 8px;
    color: #333;
    text-align: center;
  `;
  controlsContainer.appendChild(title);

  // 按钮容器
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  `;

  // 放大按钮
  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = '放大';
  zoomInBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
  `;
  zoomInBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(10);
      updateStatusDisplay();
    }
  };

  // 缩小按钮
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.textContent = '缩小';
  zoomOutBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
  `;
  zoomOutBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(-10);
      updateStatusDisplay();
    }
  };

  buttonsContainer.appendChild(zoomInBtn);
  buttonsContainer.appendChild(zoomOutBtn);
  controlsContainer.appendChild(buttonsContainer);

  // 状态显示
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'zoom-status';
  statusDisplay.style.cssText = `
    background: #f5f5f5;
    padding: 8px;
    border-radius: 3px;
    font-size: 10px;
    line-height: 1.3;
    color: #666;
    border: 1px solid #ddd;
  `;
  controlsContainer.appendChild(statusDisplay);

  // 更新状态显示
  function updateStatusDisplay() {
    if (ganttInstance.zoomScaleManager) {
      const state = ganttInstance.zoomScaleManager.getCurrentZoomState();
      const currentLevel = ganttInstance.zoomScaleManager.getCurrentLevel();

      statusDisplay.innerHTML = `
        <strong>缩放状态:</strong><br>
        • 当前级别: ${currentLevel}<br>
        • 最小单位: ${state?.minUnit} × ${state?.step}<br>
        • 列宽: ${state?.currentColWidth}px<br>
        <br>
        <small>提示: 按住Ctrl键滚动鼠标滚轮可进行缩放</small>
      `;
    }
  }

  // 初始化状态显示
  updateStatusDisplay();

  // 监听缩放事件
  ganttInstance.on('zoom', () => {
    updateStatusDisplay();
  });

  document.body.appendChild(controlsContainer);
  return controlsContainer;
}

// 创建缩放控制界面
const zoomControlsContainer = createZoomControls();

// 页面卸载时清理
const cleanup = () => {
  if (zoomControlsContainer && zoomControlsContainer.parentNode) {
    zoomControlsContainer.parentNode.removeChild(zoomControlsContainer);
  }
};

window.addEventListener('beforeunload', cleanup);

// 重写release方法确保清理
const originalRelease = ganttInstance.release.bind(ganttInstance);
ganttInstance.release = function () {
  cleanup();
  window.removeEventListener('beforeunload', cleanup);
  originalRelease();
};
```

## 缩放方法

启用 `zoomScale` 功能后，用户可以通过以下方式进行缩放：

- **放大**：按住 `Ctrl` 键，向上滚动鼠标滚轮或者双指放大
- **缩小**：按住 `Ctrl` 键，向下滚动鼠标滚轮或者双指缩小
- **缩放中心**：缩放会以鼠标指针位置为中心进行

## 配置详解

### zoomScale 配置结构

```typescript
interface IZoomScale {
  enabled: boolean; // 是否启用智能缩放
  levels: ITimelineScale[][]; // 多级别时间刻度配置
}
```

### 级别配置说明

每个级别是一个时间刻度数组，从粗粒度到细粒度排列：

- **级别 0**：月-周组合（最粗糙，适合查看长期项目）
- **级别 1**：月-周-日组合（适合查看月度计划）

```typescript
levels: [
  // 级别0：月-周组合 (最粗糙)
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
  // 级别1：月-日组合
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
    },
    {
      unit: 'day',
      step: 4,
      format: date => date.startDate.getDate().toString()
    }
  ]
];
```

## API 使用

### 获取缩放管理器

```javascript
const zoomManager = ganttInstance.zoomScaleManager;
```

### 获取缩放状态

#### 1. 获取详细缩放状态 - `getCurrentZoomState()`

获取当前缩放的详细信息。

```javascript
const state = zoomManager.getCurrentZoomState();
console.log('当前级别:', state.levelNum); // 级别索引
console.log('最小时间单位:', state.minUnit); // 最小时间单位
console.log('时间步长:', state.step); // 步长
console.log('列宽:', state.currentColWidth); // 当前列宽
```

**返回值类型：**

```typescript
interface ZoomState {
  levelNum: number; // 当前级别索引
  minUnit: string; // 最小时间单位
  step: number; // 时间步长
  currentColWidth: number; // 当前列宽
}
```

#### 2. 获取当前级别 - `getCurrentLevel()`

仅获取当前级别索引。

```javascript
const currentLevel = zoomManager.getCurrentLevel();
console.log('当前级别:', currentLevel); // 返回数字，如 0, 1, 2...
```

### 缩放操作方法

#### 1. 按百分比缩放 - `zoomByPercentage(percentage, center?, centerX?)`

根据全局缩放范围的百分比进行缩放，会自动选择合适的级别。

```javascript
// 基础用法
zoomManager.zoomByPercentage(10); // 放大10%
zoomManager.zoomByPercentage(-10); // 缩小10%

// 指定缩放中心
zoomManager.zoomByPercentage(15, true, 300); // 以X坐标300为中心放大15%
```

**参数说明：**

- `percentage` (number): 缩放百分比，正数放大，负数缩小
- `center` (boolean, 可选): 是否保持视图中心，默认为 true
- `centerX` (number, 可选): 缩放中心的 X 坐标，默认为视图中心

#### 2. 设置缩放状态 - `setZoomPosition(params)`

精确设置到指定的缩放状态，支持多种参数组合。

```javascript
// 方式1：通过级别编号和列宽设置
zoomManager.setZoomPosition({
  levelNum: 2, // 切换到级别2
  colWidth: 60 // 设置列宽为60px
});

// 方式2：通过时间单位和步长设置
zoomManager.setZoomPosition({
  minUnit: 'day', // 最小时间单位为天
  step: 1, // 步长为1
  colWidth: 80 // 设置列宽为80px（可选）
});

// 方式3：仅切换级别（使用级别的中间状态）
zoomManager.setZoomPosition({
  levelNum: 3
});
```

**参数说明：**

- `levelNum` (number, 可选): 目标级别索引
- `minUnit` (string, 可选): 最小时间单位 ('year', 'month', 'week', 'day', 'hour', 'minute', 'second')
- `step` (number, 可选): 时间步长
- `colWidth` (number, 可选): 目标列宽，如果不指定则使用级别的中间状态

**返回值：** boolean - 操作是否成功

## 最佳实践

### 1. 级别设计原则

- **从粗到细**：级别 0 应该是最粗糙的时间刻度，级别越高越精细
- **合理过渡**：相邻级别之间的时间粒度差异不宜过大
- **实用性优先**：根据实际场景设计合适的时间刻度组合
- **合理的级别数量**：建议控制在 3-6 个级别
