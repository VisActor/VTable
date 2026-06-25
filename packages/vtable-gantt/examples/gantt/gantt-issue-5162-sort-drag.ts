import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions } from '../../src/index';
import { Gantt } from '../../src/index';

const CONTAINER_ID = 'vTable';

function createTips(container: HTMLElement) {
  const tips = document.createElement('div');
  tips.style.cssText = [
    'margin: 12px 0',
    'padding: 12px 16px',
    'border: 1px solid #d9e2f2',
    'border-radius: 6px',
    'background: #f7faff',
    'font-family: Arial, sans-serif',
    'font-size: 13px',
    'line-height: 20px',
    'color: #1f2329'
  ].join(';');
  tips.innerHTML = [
    '<strong>Issue #5162 Repro</strong><br>',
    '1. 点击左侧 start 列排序，切到 desc。<br>',
    '2. 拖动排序后的第一行或第二行任务条，观察控制台输出。<br>',
    '3. 再次排序或调用 <code>window.ganttIssue5162.logMapping()</code> 查看可见行与任务条绑定是否一致。'
  ].join('');
  container.appendChild(tips);
}

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  container.innerHTML = '';
  createTips(container);

  const records = [
    { id: 101, title: '需求评审', owner: 'Alice', start: '2024-02-05', end: '2024-02-12', progress: 20 },
    { id: 102, title: '交互设计', owner: 'Bob', start: '2024-03-10', end: '2024-03-18', progress: 35 },
    { id: 103, title: '接口联调', owner: 'Carol', start: '2024-05-28', end: '2024-06-05', progress: 50 },
    { id: 104, title: '灰度验证', owner: 'David', start: '2024-10-05', end: '2024-10-20', progress: 65 },
    { id: 105, title: '正式上线', owner: 'Eve', start: '2024-11-10', end: '2024-11-25', progress: 80 }
  ];

  const columns: ColumnsDefine = [
    { field: 'title', title: 'title', width: 160, sort: true },
    { field: 'owner', title: 'owner', width: 120, sort: true },
    { field: 'start', title: 'start', width: 120, sort: true },
    { field: 'end', title: 'end', width: 120, sort: true },
    { field: 'progress', title: 'progress', width: 100, sort: true }
  ];

  const option: GanttConstructorOptions = {
    records,
    taskListTable: {
      columns,
      tableWidth: 360,
      minTableWidth: 280,
      maxTableWidth: 640
    },
    taskKeyField: 'id',
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress',
      moveable: true,
      labelText: '{title}'
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

  const ganttInstance = new Gantt(container, option);
  (window as any).ganttInstance = ganttInstance;

  const logMapping = () => {
    const rows = records.map((_, index) => {
      const visibleRecord = ganttInstance.getRecordByIndex(index);
      const taskBarNode = ganttInstance.scenegraph.taskBar.getTaskBarNodeByIndex(index);
      return {
        row: index,
        visibleId: visibleRecord?.id,
        visibleTitle: visibleRecord?.title,
        taskBarRecordId: taskBarNode?.record?.id,
        taskBarRecordTitle: taskBarNode?.record?.title
      };
    });
    console.table(rows);
    return rows;
  };

  (window as any).ganttIssue5162 = {
    gantt: ganttInstance,
    sortByStartDesc: () => ganttInstance.taskListTableInstance?.updateSortState({ field: 'start', order: 'desc' }),
    sortByStartAsc: () => ganttInstance.taskListTableInstance?.updateSortState({ field: 'start', order: 'asc' }),
    logMapping,
    logRecords: () => {
      console.table(ganttInstance.records);
      return ganttInstance.records;
    }
  };

  ganttInstance.taskListTableInstance?.on('after_sort', () => {
    console.log('[issue-5162] after_sort');
    logMapping();
  });

  ganttInstance.on('move_end_task_bar', e => {
    console.log('[issue-5162] move_end_task_bar', e);
    logMapping();
    console.table(ganttInstance.records);
  });

  setTimeout(() => {
    const x = ganttInstance.getXByTime(new Date('2024-06-01 00:00:00').getTime());
    ganttInstance.scrollLeft = x;
  }, 0);
}
