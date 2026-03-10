// @ts-nocheck

global.__VERSION__ = 'none';

import { createDiv } from './dom';
import { Gantt } from '../src/index';

describe('gantt weekend column width', () => {
  test('weekendColWidth should override day cell width', () => {
    const container = createDiv();
    const option = {
      records: [
        {
          id: 1,
          title: '任务',
          startDate: '2024-07-01',
          endDate: '2024-07-02',
          progress: 50
        }
      ],
      taskListTable: {
        columns: [{ field: 'title', title: '任务名称', width: 180 }],
        tableWidth: 300
      },
      timelineHeader: {
        colWidth: 50,
        weekendColWidth: 10,
        scales: [{ unit: 'day', step: 1 }]
      },
      minDate: '2024-07-01',
      maxDate: '2024-07-07'
    };
    const gantt = new Gantt(container, option);

    const minScale = gantt.parsedOptions.reverseSortedTimelineScales[0];
    const dates = minScale.timelineDates;
    expect(dates.length).toBe(7);

    let sum = 0;
    for (let i = 0; i < dates.length; i++) {
      const day = dates[i].startDate.getDay();
      const w = gantt.getDateColWidth(i);
      sum += w;
      if (day === 0 || day === 6) {
        expect(w).toBe(10);
      } else {
        expect(w).toBe(50);
      }
    }
    expect(gantt.getAllDateColsWidth()).toBe(sum);
    expect(sum).toBe(5 * 50 + 2 * 10);

    gantt.release?.();
    container.remove();
  });

  test('hideWeekend should collapse weekend columns to zero width', () => {
    const container = createDiv();
    const option = {
      records: [
        {
          id: 1,
          title: '任务',
          startDate: '2024-07-01',
          endDate: '2024-07-08',
          progress: 50
        }
      ],
      taskListTable: {
        columns: [{ field: 'title', title: '任务名称', width: 180 }],
        tableWidth: 300
      },
      timelineHeader: {
        colWidth: 50,
        hideWeekend: true,
        scales: [{ unit: 'day', step: 1 }]
      },
      minDate: '2024-07-01',
      maxDate: '2024-07-08'
    };
    const gantt = new Gantt(container, option);

    const minScale = gantt.parsedOptions.reverseSortedTimelineScales[0];
    const dates = minScale.timelineDates;
    expect(dates.length).toBe(8);

    const mondayAfterWeekend = new Date('2024-07-08 00:00:00').getTime();
    const xAtMondayStart = gantt.getXByTime(mondayAfterWeekend);
    expect(xAtMondayStart).toBe(5 * 50);

    const totalWidth = gantt.getAllDateColsWidth();
    expect(totalWidth).toBe(6 * 50);

    gantt.release?.();
    container.remove();
  });
});
