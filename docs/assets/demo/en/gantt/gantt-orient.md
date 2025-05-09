---
category: examples
group: gantt
title: Gantt Style — Text Not Hidden
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/gantt-label-text.gif
link: gantt/introduction
option: Gantt#taskBar
---

# Gantt Style - Text Not Hidden

This example demonstrates the style configuration of not hiding taskbar text.

## Key Configuration

- `orient` Text orientation relative to the taskbar. Optional values: `left`, `top`, `right`, `bottom`, representing the four directions respectively.
- `orientHandleWithOverflow` Specifies the taskbar text orientation when the label cannot fit within the taskbar. Ignored if `orient` is explicitly set.

## Code Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;
const records = [
  {
    id: 1,
    title: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-24',
    end: '2024-07-28',
    progress: 100,
    priority: 'P0'
  },
  {
    id: 2,
    title: 'Project Feature Review',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-25',
    end: '2024-07-27',
    progress: 90,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Project Create',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-29',
    end: '2024-07-31',
    progress: 40,
    priority: 'P1'
  },
  {
    id: 4,
    title: 'Develop feature 1',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-30',
    end: '2024-08-10',
    progress: 30,
    priority: 'P1'
  },
  {
    id: 5,
    title: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-01',
    end: '2024-08-05',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    title: 'Project Status Review',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-06',
    end: '2024-08-08',
    progress: 10,
    priority: 'P0'
  },
  {
    id: 7,
    title: 'Feature Testing',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-09',
    end: '2024-08-15',
    progress: 70,
    priority: 'P1'
  },
  {
    id: 8,
    title: 'Project Complete',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-01',
    end: '2024-08-10',
    progress: 70,
    priority: 'P0'
  }
];

const columns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    sort: true,
    tree: true,
    editor: 'input'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'priority',
    title: 'priority',
    width: 'auto',
    sort: true,
    editor: 'input'
  },
  {
    field: 'progress',
    title: 'progress',
    width: 'auto',
    sort: true,
    headerStyle: {
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8',
      color: 'green'
    },
    editor: 'input'
  }
];
const option = {
  overscrollBehavior: 'none',
  records,
  taskListTable: {
    columns,
    tableWidth: 250,
    minTableWidth: 100,
    maxTableWidth: 600,
    theme: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: [1, 0, 1, 0],
        fontSize: 16,
        color: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
    //rightFrozenColCount: 1
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLineMoveable: true,
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    }
  },
  grid: {
    weekendBackgroundColor: '#f8f8f8',
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 40,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    // resizable: false,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title} {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left',
      textOverflow: 'visible',
      orientHandleWithOverflow: 'right',
      outsideColor: '#333333'
    },
    barStyle: {
      width: 20,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8,
      /** 任务条的边框 */
      borderLineWidth: 1,
      /** 边框颜色 */
      borderColor: 'black'
    },
    milestoneStyle: {
      borderColor: 'red',
      borderLineWidth: 1,
      fillColor: 'green',
      width: 15
    }
  },
  timelineHeader: {
    colWidth: 50,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5',
          textStick: true
          // padding: [0, 30, 0, 20]
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
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
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'scrolling',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;
```
