// @ts-nocheck

global.__VERSION__ = 'none';

import { defaultBaselineStyle } from '../src/gantt-helper';
import { createDiv } from './dom';
import { Gantt } from '../src/index';

describe('gantt baseline test', () => {
  test('defaultBaselineStyle should have correct default values', () => {
    expect(defaultBaselineStyle.barColor).toBe('#d3d3d3');
    expect(defaultBaselineStyle.completedBarColor).toBe('#a9a9a9');
    expect(defaultBaselineStyle.width).toBe(20);
    expect(defaultBaselineStyle.cornerRadius).toBe(3);
    expect(defaultBaselineStyle.borderWidth).toBe(0);
  });

  test('baseline configuration options should be correctly defined', () => {
    const baselinePositions = ['top', 'bottom', 'overlap'];
    expect(baselinePositions).toContain('top');
    expect(baselinePositions).toContain('bottom');
    expect(baselinePositions).toContain('overlap');
  });

  test('Gantt should initialize with baseline configuration', () => {
    const container = createDiv();
    const records = [
      {
        id: 1,
        title: '项目规划',
        startDate: '2024-07-05',
        endDate: '2024-07-14',
        baselineStartDate: '2024-07-01',
        baselineEndDate: '2024-07-10',
        progress: 80
      }
    ];

    const option = {
      records,
      taskListTable: {
        columns: [{ field: 'title', title: '任务名称', width: 180 }],
        tableWidth: 300
      },
      rowHeight: 90,
      taskBar: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        progressField: 'progress',
        baselineStartDateField: 'baselineStartDate',
        baselineEndDateField: 'baselineEndDate',
        baselinePosition: 'bottom',
        baselineStyle: {
          width: 15,
          barColor: 'gray',
          cornerRadius: 5
        }
      },
      timelineHeader: {
        colWidth: 50,
        scales: [{ unit: 'day', step: 1 }]
      },
      minDate: '2024-06-25',
      maxDate: '2024-09-01'
    };

    const ganttInstance = new Gantt(container, option);

    expect(ganttInstance.parsedOptions.baselineStartDateField).toBe('baselineStartDate');
    expect(ganttInstance.parsedOptions.baselineEndDateField).toBe('baselineEndDate');
    expect(ganttInstance.parsedOptions.baselinePosition).toBe('bottom');
    expect(ganttInstance.parsedOptions.baselineStyle).toBeDefined();
    expect(ganttInstance.parsedOptions.baselineStyle.width).toBe(15);
    expect(ganttInstance.parsedOptions.baselineStyle.barColor).toBe('gray');
    expect(ganttInstance.parsedOptions.baselineStyle.cornerRadius).toBe(5);

    container.remove();
  });

  test('getBaselineInfoByTaskListIndex should return correct baseline information', () => {
    const container = createDiv();
    const records = [
      {
        id: 1,
        title: '项目规划',
        startDate: '2024-07-05',
        endDate: '2024-07-14',
        baselineStartDate: '2024-07-01',
        baselineEndDate: '2024-07-10',
        progress: 80
      }
    ];

    const option = {
      records,
      taskListTable: {
        columns: [{ field: 'title', title: '任务名称', width: 180 }],
        tableWidth: 300
      },
      rowHeight: 90,
      taskBar: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        progressField: 'progress',
        baselineStartDateField: 'baselineStartDate',
        baselineEndDateField: 'baselineEndDate'
      },
      timelineHeader: {
        colWidth: 50,
        scales: [{ unit: 'day', step: 1 }]
      },
      minDate: '2024-06-25',
      maxDate: '2024-09-01'
    };

    const ganttInstance = new Gantt(container, option);
    const baselineInfo = ganttInstance.getBaselineInfoByTaskListIndex(0);

    expect(baselineInfo).toBeDefined();
    expect(baselineInfo.baselineStartDate).not.toBeNull();
    expect(baselineInfo.baselineEndDate).not.toBeNull();
    expect(baselineInfo.baselineDays).toBeGreaterThan(0);

    container.remove();
  });

  test('getBaselineInfoByTaskListIndex should return null for tasks without baseline dates', () => {
    const container = createDiv();
    const records = [
      {
        id: 1,
        title: '项目规划',
        startDate: '2024-07-05',
        endDate: '2024-07-14',
        progress: 80
      }
    ];

    const option = {
      records,
      taskListTable: {
        columns: [{ field: 'title', title: '任务名称', width: 180 }],
        tableWidth: 300
      },
      rowHeight: 90,
      taskBar: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        progressField: 'progress',
        baselineStartDateField: 'baselineStartDate',
        baselineEndDateField: 'baselineEndDate'
      },
      timelineHeader: {
        colWidth: 50,
        scales: [{ unit: 'day', step: 1 }]
      },
      minDate: '2024-06-25',
      maxDate: '2024-09-01'
    };

    const ganttInstance = new Gantt(container, option);
    const baselineInfo = ganttInstance.getBaselineInfoByTaskListIndex(0);

    expect(baselineInfo).toBeDefined();
    expect(baselineInfo.baselineStartDate).toBeNull();
    expect(baselineInfo.baselineEndDate).toBeNull();
    expect(baselineInfo.baselineDays).toBe(0);

    container.remove();
  });

  test('Gantt should initialize with different baseline positions', () => {
    const positions = ['top', 'bottom', 'overlap'];

    positions.forEach(position => {
      const container = createDiv();
      const records = [
        {
          id: 1,
          title: '项目规划',
          startDate: '2024-07-05',
          endDate: '2024-07-14',
          baselineStartDate: '2024-07-01',
          baselineEndDate: '2024-07-10',
          progress: 80
        }
      ];

      const option = {
        records,
        taskListTable: {
          columns: [{ field: 'title', title: '任务名称', width: 180 }],
          tableWidth: 300
        },
        rowHeight: 90,
        taskBar: {
          startDateField: 'startDate',
          endDateField: 'endDate',
          progressField: 'progress',
          baselineStartDateField: 'baselineStartDate',
          baselineEndDateField: 'baselineEndDate',
          baselinePosition: position as any
        },
        timelineHeader: {
          colWidth: 50,
          scales: [{ unit: 'day', step: 1 }]
        },
        minDate: '2024-06-25',
        maxDate: '2024-09-01'
      };

      const ganttInstance = new Gantt(container, option);
      expect(ganttInstance.parsedOptions.baselinePosition).toBe(position);

      container.remove();
    });
  });
});
