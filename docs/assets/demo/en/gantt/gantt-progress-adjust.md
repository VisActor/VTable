---
category: examples
group: gantt
title: Gantt Interaction——Task Bar Progress Adjustment
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/gannt-percentage-change.gif
link: gantt/introduction
option: Gantt#taskBar.progressAdjustable
---

# Gantt Interaction——Task Bar Progress Adjustment

This example demonstrates how to adjust the completion progress of Gantt chart tasks by dragging the progress handle. Users can hover over task bars to reveal a triangular progress handle and drag it to adjust the task's progress percentage.

Thanks to the contributor: [ziwen](https://github.com/FoundDream)

## Key Features

- **Visual Progress Adjustment**: Intuitively adjust task progress by dragging the triangular handle
- **Real-time Data Sync**: Progress updates automatically sync to the left table display
- **Progress Event Listening**: Support for listening to progress update events with detailed change information
- **Visual Feedback**: Clear hover effects and drag indicators

## Key Configuration

- `Gantt`
- `Gantt#taskBar.progressAdjustable` Task bar progress is adjustable. The default is false

## Code Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;

const records = [
  {
    id: 1,
    title: 'Frontend Development',
    developer: 'Alice',
    start: '2024-07-15',
    end: '2024-08-15',
    progress: 45,
    priority: 'P0',
    type: 'task'
  },
  {
    id: 2,
    title: 'Backend Development',
    developer: 'Bob',
    start: '2024-07-20',
    end: '2024-08-20',
    progress: 75,
    priority: 'P0',
    type: 'task'
  },
  {
    id: 3,
    title: 'UI Design',
    developer: 'Carol',
    start: '2024-07-10',
    end: '2024-07-25',
    progress: 90,
    priority: 'P1',
    type: 'task'
  },
  {
    id: 4,
    title: 'Testing Phase',
    developer: 'David',
    start: '2024-08-01',
    end: '2024-08-10',
    progress: 25,
    priority: 'P2',
    type: 'task'
  },
  {
    id: 5,
    title: 'Project Management',
    developer: 'Eve',
    start: '2024-07-12',
    end: '2024-08-25',
    progress: 60,
    priority: 'P0',
    type: 'project',
    children: [
      {
        id: '5-1',
        title: 'Requirements Analysis',
        developer: 'Frank',
        start: '2024-07-12',
        end: '2024-07-18',
        progress: 100,
        priority: 'P0',
        type: 'task'
      },
      {
        id: '5-2',
        title: 'Architecture Design',
        developer: 'Grace',
        start: '2024-07-19',
        end: '2024-07-26',
        progress: 80,
        priority: 'P0',
        type: 'task'
      },
      {
        id: '5-3',
        title: 'Code Review',
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
    title: 'Task Name',
    width: 120,
    sort: true,
    tree: true
  },
  {
    field: 'developer',
    title: 'Developer',
    width: 80,
    sort: true
  },
  {
    field: 'start',
    title: 'Start Date',
    width: 100,
    sort: true
  },
  {
    field: 'end',
    title: 'End Date',
    width: 100,
    sort: true
  },
  {
    field: 'progress',
    title: 'Progress',
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
    title: 'Priority',
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
          return `Week ${date.dateIndex}`;
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
