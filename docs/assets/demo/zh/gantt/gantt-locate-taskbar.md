---
category: examples
group: gantt
title: 甘特图任务条定位（超出可视区提示）
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-basic-preview.png
link: gantt/Getting_Started
option: Gantt#taskBar
---

# 甘特图任务条定位（超出可视区提示）

当时间轴很长时，任务条可能不在当前可视区域内。本示例展示如何开启定位图标能力：当任务条横向超出可视区域时，在甘特图左右边缘显示定位图标；鼠标 hover 会高亮，点击后会自动滚动将任务条带入可视区域。

## 关键配置

- `taskBar.locateIcon: true`

## 代码演示

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;
const CONTAINER_ID = 'vTable';

const records = [
  { id: 1, title: '任务条在左侧不可见', start: '2024-02-05', end: '2024-02-20', progress: 20 },
  { id: 2, title: '任务条在左侧不可见', start: '2024-03-10', end: '2024-03-18', progress: 60 },
  { id: 5, title: '任务条在可见区', start: '2024-05-28', end: '2024-06-05', progress: 50 },
  { id: 3, title: '任务条在右侧不可见', start: '2024-10-05', end: '2024-10-20', progress: 40 },
  { id: 4, title: '任务条在右侧不可见', start: '2024-11-10', end: '2024-11-25', progress: 80 }
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

