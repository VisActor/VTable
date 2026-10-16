// @ts-nocheck

global.__VERSION__ = 'none';

import { Gantt } from '../src';

describe('gantt setRecords', () => {
  test('recalculates project task dates from new child records', () => {
    const gantt = {
      records: [],
      options: {},
      parsedOptions: {
        startDateField: 'start',
        endDateField: 'end',
        dateFormat: 'yyyy-mm-dd',
        reverseSortedTimelineScales: [{ unit: 'day', step: 1 }],
        sortedTimelineScales: [{ unit: 'day', step: 1 }]
      },
      data: {
        setRecords: jest.fn()
      },
      taskListTableInstance: {
        records: [],
        setRecords(records) {
          this.records = records;
        }
      },
      _syncPropsFromTable: jest.fn(),
      _generateTimeLineDateMap: jest.fn(),
      _updateSize: jest.fn(),
      scenegraph: {
        refreshAll: jest.fn(),
        setX: jest.fn(),
        setY: jest.fn()
      },
      verticalSplitResizeLine: { style: {} },
      drawHeight: 400,
      stateManager: {
        scroll: {
          horizontalBarPos: 0,
          verticalBarPos: 0
        }
      }
    };

    const nextRecords = [
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

    Gantt.prototype.setRecords.call(gantt, nextRecords);

    expect(gantt.records[0].start).toBe('2024-11-12');
    expect(gantt.records[0].end).toBe('2024-11-20');
    expect(gantt.taskListTableInstance.records[0].start).toBe('2024-11-12');
    expect(gantt.taskListTableInstance.records[0].end).toBe('2024-11-20');
  });
});
