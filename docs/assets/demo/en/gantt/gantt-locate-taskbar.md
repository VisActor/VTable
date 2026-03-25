---
category: examples
group: gantt
title: Task Bar Locate (Offscreen Indicator)
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-locate-taskbar.gif
link: gantt/Getting_Started
option: Gantt#taskBar
---

# Task Bar Locate (Offscreen Indicator)

When the timeline is long, task bars may be outside the current viewport. This demo shows how to enable the locate icon feature: when a task bar is horizontally outside the viewport, an icon is displayed at the left/right edge of the gantt view; hover highlights it, and click scrolls the task bar into view.

## Key Option

- `taskBar.locateIcon: true`

## Live Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;

const records = [
  { id: 1, title: 'Offscreen on the left', start: '2024-02-05', end: '2024-02-20', progress: 20 },
  { id: 2, title: 'Offscreen on the left', start: '2024-03-10', end: '2024-03-18', progress: 60 },
  { id: 5, title: 'Visible in viewport', start: '2024-05-28', end: '2024-06-05', progress: 50 },
  { id: 3, title: 'Offscreen on the right', start: '2024-10-05', end: '2024-10-20', progress: 40 },
  { id: 4, title: 'Offscreen on the right', start: '2024-11-10', end: '2024-11-25', progress: 80 }
];

const columns = [
  { field: 'title', title: 'title', width: 160, sort: true },
  { field: 'start', title: 'start', width: 120, sort: true },
  { field: 'end', title: 'end', width: 120, sort: true },
  { field: 'progress', title: 'progress', width: 100, sort: true }
];

const option = {
  records,
  taskKeyField: 'id',
  taskListTable: {
    columns,
    tableWidth: 280,
    minTableWidth: 240,
    maxTableWidth: 600
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    locateIcon: true
  },
  minDate: '2024-01-01',
  maxDate: '2024-12-31',
  timelineHeader: {
    colWidth: 30,
    scales: [{ unit: 'day', step: 1 }]
  },
  scrollStyle: {
    visible: 'scrolling'
  },
  grid: {
    verticalLine: { lineWidth: 1, lineColor: '#e1e4e8' },
    horizontalLine: { lineWidth: 1, lineColor: '#e1e4e8' }
  }
};

ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;

setTimeout(() => {
  const x = ganttInstance.getXByTime(new Date('2024-06-01 00:00:00').getTime());
  ganttInstance.scrollLeft = x;
}, 0);
```

