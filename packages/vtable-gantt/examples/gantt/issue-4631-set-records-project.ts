import type { GanttConstructorOptions } from '../../src';
import { Gantt, TYPES } from '../../src';

const CONTAINER_ID = 'vTable';

const projectRecords = [
  {
    id: 2,
    name: 'Planning',
    type: 'project',
    children: [
      { id: 3, name: 'Design', start: '2024-11-15', end: '2024-11-18' },
      { id: 4, name: 'Review', start: '2024-11-12', end: '2024-11-20' }
    ]
  }
];

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }
  const status = document.createElement('div');
  const updateButton = document.createElement('button');

  status.style.cssText = 'height: 32px; line-height: 32px; font: 14px sans-serif;';
  updateButton.textContent = 'Set project records';
  updateButton.style.cssText = 'margin-bottom: 8px; padding: 6px 12px; cursor: pointer;';
  container.parentElement?.insertBefore(status, container);
  container.parentElement?.insertBefore(updateButton, container);

  const options: GanttConstructorOptions = {
    records: [{ id: 1, name: 'Initial task', start: '2024-11-01', end: '2024-11-02' }],
    taskListTable: {
      columns: [
        { field: 'name', title: 'Task', width: 160, tree: true },
        { field: 'start', title: 'Start', width: 110 },
        { field: 'end', title: 'End', width: 110 }
      ],
      tableWidth: 380
    },
    tasksShowMode: TYPES.TasksShowMode.Tasks_Separate,
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      labelText: '{name}'
    },
    timelineHeader: {
      colWidth: 50,
      scales: [
        { unit: 'week', step: 1, startOfWeek: 'monday' },
        { unit: 'day', step: 1 }
      ]
    },
    minDate: '2024-11-01',
    maxDate: '2024-11-30'
  };

  const ganttInstance = new Gantt(container, options);
  window.ganttInstance = ganttInstance;

  const updateRecords = () => {
    ganttInstance.setRecords(projectRecords);
    const project = ganttInstance.records[0];
    status.textContent = `Project range: ${project.start ?? 'missing'} - ${project.end ?? 'missing'}`;
  };

  updateButton.addEventListener('click', updateRecords);
  updateRecords();
}
