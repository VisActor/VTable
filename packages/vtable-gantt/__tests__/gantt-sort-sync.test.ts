// @ts-nocheck

global.__VERSION__ = 'none';

import { Gantt } from '../src';
import { createDiv, removeDom } from './dom';

describe('gantt sort sync', () => {
  test('task bar nodes should bind sorted records after table sort', async () => {
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
          { field: 'title', title: 'title', width: 160, sort: true },
          { field: 'startDate', title: 'startDate', width: 120, sort: true }
        ],
        tableWidth: 320
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
      minDate: '2024-06-25',
      maxDate: '2024-07-20'
    });

    try {
      gantt.taskListTableInstance.updateSortState({ field: 'startDate', order: 'desc' });
      await new Promise(resolve => setTimeout(resolve, 250));

      const firstVisibleRecord = gantt.getRecordByIndex(0);
      const firstTaskBarNode = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(0);

      expect(firstVisibleRecord.id).toBe(3);
      expect(firstTaskBarNode.record.id).toBe(firstVisibleRecord.id);
      expect(firstTaskBarNode.record.startDate).toBe(firstVisibleRecord.startDate);
    } finally {
      gantt.release?.();
      removeDom(container);
    }
  });

  test('task bar nodes should refresh when date update changes sorted row order', async () => {
    const container = createDiv();
    container.style.width = '900px';
    container.style.height = '400px';

    const records = [
      { id: 101, title: '需求评审', startDate: '2024-02-05', endDate: '2024-02-12', progress: 20 },
      { id: 102, title: '交互设计', startDate: '2024-03-10', endDate: '2024-03-18', progress: 35 },
      { id: 103, title: '接口联调', startDate: '2024-05-28', endDate: '2024-06-05', progress: 50 },
      { id: 104, title: '灰度验证', startDate: '2024-10-05', endDate: '2024-10-20', progress: 65 },
      { id: 105, title: '正式上线', startDate: '2024-11-10', endDate: '2024-11-25', progress: 80 }
    ];

    const gantt = new Gantt(container, {
      records,
      taskKeyField: 'id',
      taskListTable: {
        columns: [
          { field: 'title', title: 'title', width: 160, sort: true },
          { field: 'startDate', title: 'startDate', width: 120, sort: true }
        ],
        tableWidth: 320
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
      minDate: '2024-01-01',
      maxDate: '2024-12-31'
    });

    try {
      gantt.taskListTableInstance.updateSortState({ field: 'startDate', order: 'desc' });
      await new Promise(resolve => setTimeout(resolve, 250));

      expect(gantt.getRecordByIndex(0).id).toBe(105);
      expect(gantt.scenegraph.taskBar.getTaskBarNodeByIndex(0).record.id).toBe(105);

      gantt._updateStartEndDateToTaskRecord(new Date('2024-09-19'), new Date('2024-10-04'), 0);
      await new Promise(resolve => setTimeout(resolve, 250));

      expect(gantt.getRecordByIndex(0).id).toBe(104);
      expect(gantt.scenegraph.taskBar.getTaskBarNodeByIndex(0).record.id).toBe(104);
      expect(gantt.getRecordByIndex(1).id).toBe(105);
      expect(gantt.scenegraph.taskBar.getTaskBarNodeByIndex(1).record.id).toBe(105);
    } finally {
      gantt.release?.();
      removeDom(container);
    }
  });
});
