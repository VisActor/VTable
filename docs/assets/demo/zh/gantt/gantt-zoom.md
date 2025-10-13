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

- `timelineHeader.zoomScale.enabled`: 启用智能缩放功能
- `timelineHeader.zoomScale.levels`: 配置多级别时间刻度组合
- 鼠标滚轮缩放：按住 `Ctrl` 键并滚动鼠标滚轮进行缩放
- API 获得当前缩放状态：使用 `getCurrentZoomState` 提供的方法
- API 设置当前缩放状态：使用 `setZoomPosition` 提供的方法
- API 缩放：使用 `zoomScaleManager` 提供的缩放方法

## 代码演示

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;

// 强制清理所有可能存在的缩放控制面板
// 首先尝试调用之前可能存在的全局清理函数
if (typeof window.cleanupControls === 'function') {
  window.cleanupControls();
}

const existingControls = document.getElementById('zoom-controls');
if (existingControls) {
  existingControls.remove();
}

// 额外清理：查找所有可能的缩放控制面板
const allZoomControls = document.querySelectorAll('[id*="zoom-control"], .zoom-controls, [class*="zoom-control"]');
allZoomControls.forEach(element => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
});

// 清理可能残留在body中的悬浮元素
const floatingElements = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"][style*="right"]');
floatingElements.forEach(element => {
  // 检查是否包含缩放相关的文本内容
  if (
    element.textContent &&
    (element.textContent.includes('缩放') ||
      element.textContent.includes('放大') ||
      element.textContent.includes('缩小'))
  ) {
    element.remove();
  }
});

const records = [
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
    tableWidth: 200,
    minTableWidth: 200,
    maxTableWidth: 600
  },
  // 时间轴配置
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
    }
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

/**
 * 创建缩放控制按钮
 */
function createZoomControls(ganttInstance) {
  // 创建按钮容器
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'zoom-controls';
  controlsContainer.style.cssText = `
    position: fixed;
    bottom: 0px;
    left: 130px;
    display: flex;
    gap: 8px;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: Arial, sans-serif;
    min-width: 140px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  // 创建标题
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

  // 创建按钮容器
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  `;

  // 放大10%按钮
  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = '放大10%';
  zoomInBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomInBtn.onmouseover = () => {
    zoomInBtn.style.background = '#45a049';
  };
  zoomInBtn.onmouseout = () => {
    zoomInBtn.style.background = '#4CAF50';
  };
  zoomInBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(10);
      updateStatusDisplay();
    } else {
      console.warn('ZoomScaleManager 未启用');
    }
  };

  // 缩小10%按钮
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.textContent = '缩小10%';
  zoomOutBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomOutBtn.onmouseover = () => {
    zoomOutBtn.style.background = '#da190b';
  };
  zoomOutBtn.onmouseout = () => {
    zoomOutBtn.style.background = '#f44336';
  };
  zoomOutBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(-10);
      updateStatusDisplay();
    } else {
      console.warn('ZoomScaleManager 未启用');
    }
  };

  buttonsContainer.appendChild(zoomInBtn);
  buttonsContainer.appendChild(zoomOutBtn);
  controlsContainer.appendChild(buttonsContainer);

  // 缩放级别选择区域
  if (ganttInstance.zoomScaleManager) {
    const levelSelectorContainer = document.createElement('div');
    levelSelectorContainer.style.cssText = `
      background: #f9f9f9;
      padding: 8px;
      border-radius: 3px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
    `;

    const levelTitle = document.createElement('div');
    levelTitle.textContent = '缩放级别选择:';
    levelTitle.style.cssText = `
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 6px;
      color: #333;
    `;
    levelSelectorContainer.appendChild(levelTitle);

    // 获取级别配置
    const levels = ganttInstance.zoomScaleManager.config.levels;

    const radioGroup = document.createElement('div');
    radioGroup.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px;
    `;

    levels.forEach((level, index) => {
      const minUnit = ganttInstance.zoomScaleManager?.findMinTimeUnit(level);

      const radioContainer = document.createElement('label');
      radioContainer.style.cssText = `
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 10px;
        padding: 1px 3px;
        border-radius: 2px;
        transition: background-color 0.2s;
      `;
      radioContainer.onmouseover = () => {
        radioContainer.style.backgroundColor = '#e8f4fd';
      };
      radioContainer.onmouseout = () => {
        radioContainer.style.backgroundColor = 'transparent';
      };

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'zoomLevel';
      radio.value = index.toString();
      radio.style.cssText = `
        margin-right: 4px;
        transform: scale(0.8);
      `;

      // 检查当前级别
      if (index === ganttInstance.zoomScaleManager?.getCurrentLevel()) {
        radio.checked = true;
      }

      radio.onchange = () => {
        if (radio.checked) {
          // 切换到对应级别的中间状态
          ganttInstance.zoomScaleManager?.setZoomPosition({
            levelNum: index
          });
          updateStatusDisplay();
        }
      };

      const label = document.createElement('span');
      label.textContent = `L${index}: ${minUnit?.unit}×${minUnit?.step}`;
      label.style.cssText = `
        color: #555;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      radioContainer.appendChild(radio);
      radioContainer.appendChild(label);
      radioGroup.appendChild(radioContainer);
    });

    levelSelectorContainer.appendChild(radioGroup);
    controlsContainer.appendChild(levelSelectorContainer);

    // 监听缩放事件，更新单选按钮状态
    ganttInstance.on('zoom', () => {
      const currentLevel = ganttInstance.zoomScaleManager?.getCurrentLevel();
      const radios = radioGroup.querySelectorAll('input[name="zoomLevel"]');
      radios.forEach((radio, index) => {
        radio.checked = index === currentLevel;
      });
    });
  }

  // 状态显示区域
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

  // 更新状态显示的函数
  function updateStatusDisplay() {
    const currentMillisecondsPerPixel = ganttInstance.getCurrentMillisecondsPerPixel();
    const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
    const zoomConfig = ganttInstance.parsedOptions.zoom;

    let zoomScaleInfo = '';
    if (ganttInstance.zoomScaleManager) {
      const state = ganttInstance.zoomScaleManager.getCurrentZoomState();
      const currentLevel = ganttInstance.zoomScaleManager.getCurrentLevel();
      zoomScaleInfo = `
        <strong>ZoomScale状态:</strong><br>
        • 当前级别: ${currentLevel}<br>
        • 最小单位: ${state?.minUnit} × ${state?.step}<br>
        • 列宽: ${state?.currentColWidth}px<br>
      `;
    }

    const currentLevel = ganttInstance.zoomScaleManager?.getCurrentLevel() ?? 'N/A';

    statusDisplay.innerHTML = `
      <strong>状态:</strong><br>
      • 时间轴列宽: ${ganttInstance.parsedOptions.timelineColWidth.toFixed(1)}px<br>
      • 当前时间单位: ${scale?.unit} × ${scale?.step}<br>
      • 当前级别: ${currentLevel}<br>
      • MillisecondsPerPixel: ${currentMillisecondsPerPixel.toFixed(0)}<br>
      • 缩放范围: ${zoomConfig?.minMillisecondsPerPixel?.toFixed(0)} ~ ${zoomConfig?.maxMillisecondsPerPixel?.toFixed(
      0
    )}
    `;
  }

  // 初始化状态显示
  updateStatusDisplay();

  // 监听缩放事件，自动更新状态
  ganttInstance.on('zoom', () => {
    updateStatusDisplay();
  });

  // 将控制面板添加到页面
  document.body.appendChild(controlsContainer);

  // 返回控制面板元素，便于后续操作
  return controlsContainer;
}

// 创建缩放控制界面
const zoomControlsContainer = createZoomControls(ganttInstance);

// 全局清理函数
const cleanup = () => {
  // 清理我们创建的控制面板
  if (zoomControlsContainer && zoomControlsContainer.parentNode) {
    zoomControlsContainer.parentNode.removeChild(zoomControlsContainer);
  }

  // 额外保险：再次清理所有可能的残留元素
  const allControls = document.querySelectorAll('#zoom-controls, [id*="zoom-control"]');
  allControls.forEach(el => el.remove());

  // 清理悬浮元素
  const floatingElements = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"][style*="right"]');
  floatingElements.forEach(element => {
    if (
      element.textContent &&
      (element.textContent.includes('缩放') ||
        element.textContent.includes('放大') ||
        element.textContent.includes('缩小'))
    ) {
      element.remove();
    }
  });
};

// 多重清理保障
window.addEventListener('beforeunload', cleanup);
window.addEventListener('pagehide', cleanup);

// 重写release方法确保清理
const originalRelease = ganttInstance.release.bind(ganttInstance);
ganttInstance.release = function () {
  cleanup();
  window.removeEventListener('beforeunload', cleanup);
  window.removeEventListener('pagehide', cleanup);
  originalRelease();
};

// 在全局存储清理函数，以便其他地方也能调用
window.cleanupControls = cleanup;
```
