---
категория: примеры
группа: gantt
заголовок: Gantt Milestone
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/gantt-label-symbol.jpeg
ссылка: gantt/introduction
опция: Gantt#taskBar.milestoneStyle
---

# Gantt Milestone

Milestones in Gantt charts are used to mark important time points in a project. Unlike regular tasks that span over a period, milestones are represented by a distinctive diamond symbol. This example demonstrates milestones in different states, helping you better track key project points.

## Ключевые Конфигурации

- `Gantt#taskBar.milestoneStyle`: Configure milestone styles such as size, color, etc.
- Set `type: 'milestone'` in data to mark a task as milestone
- Milestone tasks only need to specify the `start` time

## Code Demo

```javascript livedemo template=vtable
const records = [
  {
    id: '1',
    title: '项目启动会议',
    start: '2024-07-01',
    type: 'milestone',
    progress: 100,
    parent: '0'
  },
  {
    id: '2',
    title: '项目启动与规划',
    start: '2024-07-01',
    end: '2024-07-6',
    progress: 100,
    parent: '0'
  },
  {
    id: '3',
    title: '需求评审完成',
    start: '2024-07-6',
    type: 'milestone',
    progress: 100,
    parent: '0'
  },
  {
    id: '4',
    title: '技术方案设计',
    start: '2024-07-6',
    end: '2024-07-11',
    progress: 80,
    parent: '0'
  },
  {
    id: '5',
    title: '开发环境搭建完成',
    start: '2024-07-11',
    type: 'milestone',
    progress: 100,
    parent: '0'
  },
  {
    id: '6',
    title: '核心功能开发',
    start: '2024-07-12',
    end: '2024-07-18',
    progress: 60,
    parent: '0'
  },
  {
    id: '7',
    title: 'Beta版本发布',
    start: '2024-07-18',
    type: 'milestone',
    progress: 0,
    parent: '0'
  },
  {
    id: '8',
    title: '系统测试',
    start: '2024-07-19',
    end: '2024-07-23',
    progress: 60,
    parent: '0'
  },
  {
    id: '9',
    title: '性能测试完成',
    start: '2024-07-24',
    type: 'milestone',
    progress: 0,
    parent: '0'
  },
  {
    id: '10',
    title: '正式版本发布',
    start: '2024-07-27',
    type: 'milestone',
    progress: 0,
    parent: '0'
  }
];

const columns = [
  {
    field: 'title',
    title: '任务名称',
    width: 200,
    style: {
      fontFamily: 'PingFang SC',
      padding: [8, 16]
    }
  },
  {
    field: 'progress',
    title: '进度',
    width: 100,
    style: {
      fontFamily: 'PingFang SC',
      padding: [8, 16],
      textAlign: 'center',
      color: value => (value >= 80 ? '#52c41a' : value >= 30 ? '#1890ff' : '#595959')
    }
  }
];

const option = {
  records,
  taskListTable: {
    columns,
    tableWidth: 280,
    minTableWidth: 100,
    maxTableWidth: 600,
    theme: {
      headerStyle: {
        borderColor: '#f0f0f0',
        fontSize: 13,
        fontFamily: 'PingFang SC',
        fontWeight: 500,
        color: '#262626',
        bgColor: '#fafafa',
        padding: [12, 16]
      },
      bodyStyle: {
        fontSize: 13,
        fontFamily: 'PingFang SC',
        color: '#595959',
        bgColor: '#ffffff',
        borderColor: '#f0f0f0',
        padding: [0, 16]
      }
    }
  },
  frame: {
    outerFrameStyle: {
      borderColor: '#ebedf0',
      borderLineWidth: 1,
      cornerRadius: 12,
      padding: [1, 1, 1, 1]
    },
    verticalSplitLine: {
      lineColor: '#f0f0f0',
      lineWidth: 1
    }
  },
  grid: {
    backgroundColor: '#fafaff',
    weekendBackgroundColor: 'rgba(94, 180, 245, 0.10)',
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f5f5f5'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#f5f5f5'
    }
  },
  headerRowHeight: 42,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.2)'
    },
    labelText: '{title} {progress}%',
    labelTextStyle: {
      // padding: 2,
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left',
      textOverflow: 'ellipsis',
      color: 'rgb(240, 246, 251)'
    },
    barStyle: {
      width: 24,
      barColor: '#d6e4ff',
      completedBarColor: '#597ef7',
      cornerRadius: 12,
      borderLineWidth: 2,
      borderColor: 'rgb(7, 88, 150)'
    },
    milestoneStyle: {
      width: 16,
      fillColor: value => (value.record.progress >= 100 ? '#597ef7' : '#d6e4ff'),
      borderColor: '#597ef7',
      borderLineWidth: 0,
      labelText: '{title}',
      labelTextStyle: {
        fontSize: 16,
        color: 'rgb(1, 43, 75)'
      }
    }
  },
  timelineHeader: {
    colWidth: 50,
    backgroundColor: '#fafafa',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#f0f0f0'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f0f0f0'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        format(date) {
          return `第${date.dateIndex}周`;
        },
        style: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          textAlign: 'center',
          textBaseline: 'middle',
          color: '#262626',
          padding: [8, 0]
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          textAlign: 'center',
          textBaseline: 'middle',
          color: '#8c8c8c',
          padding: [8, 0]
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024-07-11',
      style: {
        lineWidth: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-07-22',
      style: {
        lineWidth: 2,
        lineColor: 'red',
        lineDash: [8, 4]
      }
    }
  ],
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8'
    }
  },
  scrollStyle: {
    scrollRailColor: '#f5f5f5',
    visible: 'hover',
    width: 5,
    scrollSliderColor: '#ccc',
    hover: {
      scrollSliderColor: '#bbb'
    }
  }
};

ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;
```
