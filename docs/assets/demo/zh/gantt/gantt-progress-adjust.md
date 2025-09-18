---
category: examples
group: gantt
title: 甘特图交互——任务条进度调整
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/gannt-percentage-change.gif
link: gantt/introduction
option: Gantt#taskBar.progressAdjustable
---

# 甘特图交互——任务条进度调整

该示例展示了如何通过拖拽进度手柄来调整甘特图任务的完成进度。用户可以通过悬停在任务条上显示的三角形进度手柄，拖拽调整任务的进度百分比。

感谢示例贡献者：[ziwen](https://github.com/FoundDream)

## 功能特点

- **可视化进度调整**：通过拖拽三角形手柄直观地调整任务进度
- **实时数据同步**：进度更新后自动同步到左侧表格显示
- **进度事件监听**：支持监听进度更新事件，获取详细的变更信息
- **视觉反馈**：提供清晰的悬停效果和拖拽指示

## 关键配置

- `Gantt`
- `Gantt#taskBar.progressAdjustable` 任务条进度是否可调整。默认为 false

## 代码演示

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;
const records = [
  {
    id: 1,
    title: '前端开发',
    developer: 'Alice',
    start: '2024-07-15',
    end: '2024-08-15',
    progress: 45,
    priority: 'P0',
    type: 'task'
  },
  {
    id: 2,
    title: '后端开发',
    developer: 'Bob',
    start: '2024-07-20',
    end: '2024-08-20',
    progress: 75,
    priority: 'P0',
    type: 'task'
  },
  {
    id: 3,
    title: 'UI设计',
    developer: 'Carol',
    start: '2024-07-10',
    end: '2024-07-25',
    progress: 90,
    priority: 'P1',
    type: 'task'
  },
  {
    id: 4,
    title: '测试阶段',
    developer: 'David',
    start: '2024-08-01',
    end: '2024-08-10',
    progress: 25,
    priority: 'P2',
    type: 'task'
  },
  {
    id: 5,
    title: '项目管理',
    developer: 'Eve',
    start: '2024-07-12',
    end: '2024-08-25',
    progress: 60,
    priority: 'P0',
    type: 'project',
    children: [
      {
        id: '5-1',
        title: '需求分析',
        developer: 'Frank',
        start: '2024-07-12',
        end: '2024-07-18',
        progress: 100,
        priority: 'P0',
        type: 'task'
      },
      {
        id: '5-2',
        title: '架构设计',
        developer: 'Grace',
        start: '2024-07-19',
        end: '2024-07-26',
        progress: 80,
        priority: 'P0',
        type: 'task'
      },
      {
        id: '5-3',
        title: '代码审查',
        developer: 'Henry',
        start: '2024-08-15',
        end: '2024-08-22',
        progress: 15,
        priority: 'P1',
        type: 'task'
      }
    ]
  }
];

const columns = [
  {
    field: 'title',
    title: '任务名称',
    width: 120,
    sort: true,
    tree: true
  },
  {
    field: 'developer',
    title: '负责人',
    width: 80,
    sort: true
  },
  {
    field: 'start',
    title: '开始日期',
    width: 100,
    sort: true
  },
  {
    field: 'end',
    title: '结束日期',
    width: 100,
    sort: true
  },
  {
    field: 'progress',
    title: '进度',
    width: 80,
    sort: true,
    headerStyle: {
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8',
      color: 'green'
    }
  },
  {
    field: 'priority',
    title: '优先级',
    width: 80,
    sort: true
  }
];

const option = {
  records,
  taskListTable: {
    columns: columns,
    tableWidth: 500,
    minTableWidth: 300,
    maxTableWidth: 800
  },
  tasksShowMode: 'sub_tasks_separate',
  frame: {
    verticalSplitLineMoveable: true,
    outerFrameStyle: {
      borderLineWidth: 1,
      borderColor: '#e5e7eb',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineWidth: 2,
      lineColor: '#d1d5db'
    },
    verticalSplitLineHighlight: {
      lineColor: '#3b82f6',
      lineWidth: 2
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f3f4f6'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#f3f4f6'
    }
  },
  headerRowHeight: 50,
  rowHeight: 35,
  taskBar: {
    selectable: true,
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} ({progress}%)',
    labelTextStyle: {
      fontFamily: 'Arial, sans-serif',
      fontSize: 12,
      textAlign: 'left',
      color: '#24292f'
    },
    barStyle: {
      width: 24,
      barColor: '#3b82f6',
      completedBarColor: '#10b981',
      cornerRadius: 6,
      borderWidth: 1,
      borderColor: '#e5e7eb'
    },
    progressAdjustable: true
  },
  timelineHeader: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#d1d5db'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#d1d5db'
    },
    backgroundColor: '#f9fafb',
    colWidth: 40,
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          return `第 ${date.dateIndex} 周`;
        },
        style: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#111827',
          textAlign: 'center',
          backgroundColor: '#f9fafb'
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 14,
          color: '#374151',
          textAlign: 'center',
          backgroundColor: '#f9fafb'
        }
      }
    ]
  },
  minDate: '2024-07-01',
  maxDate: '2024-09-30',
  markLine: [
    {
      date: '2024-07-28',
      style: {
        lineWidth: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-08-17',
      style: {
        lineWidth: 2,
        lineColor: 'red',
        lineDash: [8, 4]
      }
    }
  ],
  rowSeriesNumber: {
    title: '#',
    width: 50,
    headerStyle: {
      bgColor: '#f9fafb',
      borderColor: '#d1d5db'
    },
    style: {
      borderColor: '#d1d5db'
    }
  },
  scrollStyle: {
    visible: 'scrolling',
    width: 8,
    scrollRailColor: '#f3f4f6',
    scrollSliderColor: '#d1d5db'
  },
  overscrollBehavior: 'none'
};

ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;
```
