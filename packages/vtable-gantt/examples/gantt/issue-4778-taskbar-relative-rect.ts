import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions } from '../../src/index';
import { Gantt } from '../../src/index';
import { TasksShowMode, TaskType } from '../../src/ts-types';

const CONTAINER_ID = 'vTable';

const createStatusBar = () => {
  const container = document.getElementById(CONTAINER_ID)!;
  const status = document.createElement('div');
  status.id = 'issue4778Status';
  status.style.cssText = 'height: 32px; line-height: 32px; font-size: 13px; color: #333;';
  status.textContent = 'Click "Check getTaskBarRelativeRect" to verify issue #4778.';

  const button = document.createElement('button');
  button.textContent = 'Check getTaskBarRelativeRect';
  button.style.cssText = 'margin: 0 0 8px 8px;';
  button.onclick = () => checkRects();

  container.parentElement?.insertBefore(status, container);
  status.appendChild(button);
};

const isValidRect = (rect: any) =>
  rect &&
  Number.isFinite(rect.left) &&
  Number.isFinite(rect.top) &&
  Number.isFinite(rect.width) &&
  Number.isFinite(rect.height);

const checkRects = () => {
  const ganttInstance = (window as any).ganttInstance as Gantt;
  const status = document.getElementById('issue4778Status')!;
  let emptyRect: any;
  let firstChildRect: any;
  let secondChildRect: any;

  try {
    emptyRect = ganttInstance.getTaskBarRelativeRect(1);
    firstChildRect = ganttInstance.getTaskBarRelativeRect(0, [0, 0]);
    secondChildRect = ganttInstance.getTaskBarRelativeRect(0, [0, 1]);
  } catch (err) {
    status.textContent = `FAIL | ${(err as Error).message}`;
    return status.textContent;
  }

  const pass =
    emptyRect === null &&
    isValidRect(firstChildRect) &&
    isValidRect(secondChildRect) &&
    firstChildRect.left !== secondChildRect.left;

  status.textContent = `${pass ? 'PASS' : 'FAIL'} | empty=${JSON.stringify(emptyRect)}, first=${JSON.stringify(
    firstChildRect
  )}, second=${JSON.stringify(secondChildRect)}`;
  return status.textContent;
};

export function createTable() {
  const records = [
    {
      id: 1,
      title: 'Collapsed project with inline subtasks',
      type: TaskType.PROJECT,
      children: [
        { id: 11, title: 'Sub task A', start: '2024-07-01', end: '2024-07-04', progress: 30 },
        { id: 12, title: 'Sub task B', start: '2024-07-08', end: '2024-07-12', progress: 60 }
      ]
    },
    {
      id: 2,
      title: 'Empty task row'
    }
  ];

  const columns: ColumnsDefine = [
    { field: 'title', title: 'title', width: 220 },
    { field: 'start', title: 'start', width: 120 },
    { field: 'end', title: 'end', width: 120 },
    { field: 'progress', title: 'progress', width: 100 }
  ];

  const option: GanttConstructorOptions = {
    records,
    taskListTable: {
      columns,
      tableWidth: 260
    },
    taskKeyField: 'id',
    tasksShowMode: TasksShowMode.Project_Sub_Tasks_Inline,
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress'
    },
    minDate: '2024-07-01',
    maxDate: '2024-07-20',
    timelineHeader: {
      colWidth: 36,
      scales: [{ unit: 'day', step: 1 }]
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

  createStatusBar();
  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  (window as any).ganttInstance = ganttInstance;
  (window as any).issue4778Run = checkRects;
}
