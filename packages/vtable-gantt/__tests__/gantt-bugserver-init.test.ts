// @ts-nocheck

global.__VERSION__ = 'none';

import { createDiv } from './dom';
import { Gantt } from '../src/index';

describe('bugserver gantt initialization', () => {
  test('initializes gantt with mixed date formats and top-level columns', () => {
    const container = createDiv();
    container.style.width = '800px';
    container.style.height = '400px';

    const records = [
      {
        id: 1,
        title: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        start: '2024-07-04',
        end: '2024-07-14',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        title: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        start: '07/14/2024',
        end: '07/24/2024',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        title: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        start: '2024.07.06',
        end: '2024.07.08',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 4,
        title: 'Release',
        developer: 'liufangfang.jane@bytedance.com',
        start: '2024/07/24',
        end: '2024/08/04',
        progress: 90,
        priority: 'P0'
      }
    ];

    const columns = [
      { field: 'title', title: 'title', width: 200, sort: true },
      { field: 'start', title: 'start', width: 150, sort: true },
      { field: 'end', title: 'end', width: 150, sort: true },
      { field: 'priority', title: 'priority', width: 100, sort: true },
      { field: 'progress', title: 'progress', width: 200, sort: true }
    ];

    const gantt = new Gantt(container, {
      records,
      columns,
      defaultHeaderRowHeight: 60,
      defaultRowHeight: 40,
      taskBar: {
        startDateField: 'start',
        endDateField: 'end',
        progressField: 'progress',
        labelText: '{title} {progress}%',
        barStyle: {
          width: 20,
          barColor: '#ee8800',
          completedBarColor: '#91e8e0',
          cornerRadius: 8,
          borderWidth: 1,
          borderColor: 'black'
        }
      },
      timelineHeader: {
        colWidth: 60,
        scales: [
          { unit: 'week', step: 1, startOfWeek: 'sunday' },
          { unit: 'day', step: 1 }
        ]
      },
      minDate: '2024-07-05',
      maxDate: '2024-10-15',
      markLine: [
        {
          date: '2024-07-17',
          style: {
            lineWidth: 1,
            lineColor: 'blue',
            lineDash: [8, 4]
          }
        }
      ],
      scrollStyle: {
        visible: 'scrolling'
      },
      overscrollBehavior: 'none'
    });

    expect(gantt.scenegraph.stage).toBeDefined();

    gantt.release?.();
    container.remove();
  });
});
