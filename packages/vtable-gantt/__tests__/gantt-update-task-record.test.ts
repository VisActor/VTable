// @ts-nocheck

global.__VERSION__ = 'none';

import { Gantt } from '../src';
import { createDiv, removeDom } from './dom';

describe('gantt updateTaskRecord', () => {
  test('updates the task bar position and width after changing task dates', () => {
    const container = createDiv();
    container.style.width = '900px';
    container.style.height = '400px';

    const records = [
      { id: 1, title: 'Task 1', startDate: '2024-07-01', endDate: '2024-07-03', progress: 10 },
      { id: 2, title: 'Task 2', startDate: '2024-07-05', endDate: '2024-07-07', progress: 20 },
      { id: 3, title: 'Task 3', startDate: '2024-07-09', endDate: '2024-07-11', progress: 30 }
    ];

    const gantt = new Gantt(container, {
      records,
      taskListTable: {
        columns: [
          { field: 'title', title: 'title', width: 160 },
          { field: 'startDate', title: 'startDate', width: 120 },
          { field: 'endDate', title: 'endDate', width: 120 }
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
        scales: [{ unit: 'day', step: 1 }]
      },
      minDate: '2024-07-01',
      maxDate: '2024-07-31'
    });

    try {
      const originalTaskBar = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(2);
      expect(originalTaskBar.attribute.x).toBe(320);
      expect(originalTaskBar.attribute.width).toBe(120);

      gantt.updateTaskRecord({ ...records[2], startDate: '2024-07-12', endDate: '2024-07-16' }, 2);

      const updatedTaskBar = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(2);
      expect(gantt.getRecordByIndex(2)).toMatchObject({
        startDate: '2024-07-12',
        endDate: '2024-07-16'
      });
      expect(updatedTaskBar).not.toBe(originalTaskBar);
      expect(updatedTaskBar.attribute.x).toBe(440);
      expect(updatedTaskBar.attribute.width).toBe(200);
    } finally {
      gantt.release?.();
      removeDom(container);
    }
  });
});
