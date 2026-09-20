import { Gantt } from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }

  const records = [
    { id: 1, title: 'Requirement review', startDate: '2024-07-01', endDate: '2024-07-03', progress: 30 },
    { id: 2, title: 'Interaction design', startDate: '2024-07-05', endDate: '2024-07-07', progress: 50 },
    { id: 3, title: 'Integration testing', startDate: '2024-07-09', endDate: '2024-07-11', progress: 70 }
  ];

  const ganttInstance = new Gantt(container, {
    records,
    taskListTable: {
      columns: [
        { field: 'title', title: 'Task', width: 180 },
        { field: 'startDate', title: 'Start', width: 110 },
        { field: 'endDate', title: 'End', width: 110 }
      ],
      tableWidth: 400
    },
    taskBar: {
      startDateField: 'startDate',
      endDateField: 'endDate',
      progressField: 'progress'
    },
    timelineHeader: {
      colWidth: 40,
      scales: [{ unit: 'day', step: 1, format: date => date.dateIndex.toString() }]
    },
    minDate: '2024-07-01',
    maxDate: '2024-07-31'
  });

  const button = document.createElement('button');
  button.textContent = 'Update last task dates';
  button.style.position = 'fixed';
  button.style.right = '16px';
  button.style.top = '16px';
  button.style.zIndex = '10';
  button.style.padding = '8px 12px';

  const status = document.createElement('div');
  status.id = 'issue-4534-status';
  status.textContent = 'Before: Jul 9 - Jul 11';
  status.style.position = 'fixed';
  status.style.right = '16px';
  status.style.top = '56px';
  status.style.zIndex = '10';
  status.style.padding = '6px 10px';
  status.style.background = '#fff';

  button.addEventListener('click', () => {
    ganttInstance.updateTaskRecord({ ...records[2], startDate: '2024-07-12', endDate: '2024-07-16' }, 2);
    const taskBar = ganttInstance.scenegraph.taskBar.getTaskBarNodeByIndex(2);
    status.textContent = `After: Jul 12 - Jul 16; x=${taskBar.attribute.x}; width=${taskBar.attribute.width}`;
  });

  document.body.appendChild(button);
  document.body.appendChild(status);
  window.ganttInstance = ganttInstance;
}
