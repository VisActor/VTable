---
category: examples
group: gantt
title: Gantt Baseline Bar
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-baseline-preview.png
link: gantt/gantt_baseline
option: Gantt#taskBar.baselineStartDateField
---

# Gantt Baseline Bar

This example shows how to configure baselines for tasks and control drawing via `baselinePosition`, and `baselineStyle`. See guide: [Gantt Baseline](../../guide/gantt/gantt_baseline).

## Key Options

- `taskBar.baselineStartDateField` / `taskBar.baselineEndDateField`
- `taskBar.baselineStyle`

## Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;
  const records = [
    {
      id: 1,
      title: '项目规划',
      developer: '张三',
      startDate: '2024-07-05',
      endDate: '2024-07-14',
      baselineStartDate: '2024-07-01',
      baselineEndDate: '2024-07-10',
      progress: 80
    },
    {
      id: 2,
      title: '需求分析',
      developer: '李四',
      startDate: '2024-07-08',
      endDate: '2024-07-12',
      baselineStartDate: '2024-07-03',
      baselineEndDate: '2024-07-08',
      progress: 100
    },
    {
      id: 3,
      title: '设计阶段',
      developer: '王五',
      startDate: '2024-07-15',
      endDate: '2024-07-25',
      baselineStartDate: '2024-07-11',
      baselineEndDate: '2024-07-20',
      progress: 40
    },
    {
      id: 4,
      title: '开发阶段',
      developer: '赵六',
      startDate: '2024-07-20',
      endDate: '2024-08-10',
      baselineStartDate: '2024-07-18',
      baselineEndDate: '2024-08-05',
      progress: 30
    },
    {
      id: 5,
      title: '测试阶段',
      developer: '钱七',
      startDate: '2024-08-05',
      endDate: '2024-08-20',
      baselineStartDate: '2024-08-01',
      baselineEndDate: '2024-08-15',
      progress: 0
    },
    {
      id: 6,
      title: '部署上线',
      developer: '孙八',
      startDate: '2024-08-18',
      endDate: '2024-08-25',
      baselineStartDate: '2024-08-15',
      baselineEndDate: '2024-08-22',
      progress: 0
    }
  ];

  const columns = [
    {
      field: 'title',
      title: '任务名称',
      width: 80
    },
    {
      field: 'developer',
      title: '负责人',
      width: 80
    },
    {
      field: 'progress',
      title: '进度',
      width: 80,
      format: (val) => `${val}%`
    }
  ];

  const option = {
    records,
    taskListTable: {
      columns: columns,
      tableWidth: 'auto',
      minTableWidth: 100,
      maxTableWidth: 500
    },
    headerRowHeight: 50,
    rowHeight: 90,
    taskBar: {
      startDateField: 'startDate',
      endDateField: 'endDate',
      progressField: 'progress',
      baselineStartDateField: 'baselineStartDate',
      baselineEndDateField: 'baselineEndDate',
      // baselinePosition: 'top',
      labelText: '{title}',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        color: '#ffffff'
      },
      barStyle: {
        // paddingTop: 50,
        width: 25,
        barColor: '#3498db',
        completedBarColor: '#27ae60',
        cornerRadius: 5
      },
      baselineStyle: {
        // paddingTop: 0,
        width: 15,
        barColor: 'gray',
        cornerRadius: 5
      }
    },
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 50,
      scales: [
        {
          unit: 'month',
          step: 1
        },
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'monday',
          format(date) {
            return `W${date.dateIndex}`;
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date) {
            return date.dateIndex.toString();
          }
        }
      ]
    },
    minDate: '2024-06-25',
    maxDate: '2024-09-01',
    grid: {
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    overscrollBehavior: 'none'
  };
ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;

```

