import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions } from '../../src/index';
import { Gantt } from '../../src/index';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    { id: 1, title: '任务条在左侧不可见', start: '2024-02-05', end: '2024-02-20', progress: 20 },
    { id: 2, title: '任务条在左侧不可见', start: '2024-03-10', end: '2024-03-18', progress: 60 },
    { id: 5, title: '任务条在可见区', start: '2024-05-28', end: '2024-06-05', progress: 50 },
    { id: 3, title: '任务条在右侧不可见', start: '2024-10-05', end: '2024-10-20', progress: 40 },
    { id: 4, title: '任务条在右侧不可见', start: '2024-11-10', end: '2024-11-25', progress: 80 }
  ];

  const columns: ColumnsDefine = [
    { field: 'title', title: 'title', width: 160, sort: true },
    { field: 'start', title: 'start', width: 120, sort: true },
    { field: 'end', title: 'end', width: 120, sort: true },
    { field: 'progress', title: 'progress', width: 100, sort: true }
  ];

  const option: GanttConstructorOptions = {
    records,
    taskListTable: {
      columns,
      tableWidth: 280,
      minTableWidth: 240,
      maxTableWidth: 600
    },
    taskKeyField: 'id',
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
      // backgroundColor: 'gray',
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    }
  };

  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  (window as any).ganttInstance = ganttInstance;

  setTimeout(() => {
    const x = ganttInstance.getXByTime(new Date('2024-06-01 00:00:00').getTime());
    ganttInstance.scrollLeft = x;
  }, 0);
}
