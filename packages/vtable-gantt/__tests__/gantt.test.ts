// @ts-nocheck
import { Gantt } from '../src/Gantt';
import { TasksShowMode, TaskType } from '../src/ts-types';

describe('Gantt initialization', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should initialize with basic configuration', () => {
    const options = {
      records: [
        {
          id: 1,
          name: 'Task 1',
          startDate: '2024-01-01',
          endDate: '2024-01-05'
        }
      ],
      minDate: '2024-01-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        scales: [{ unit: 'day', step: 1 }]
      }
    };

    const gantt = new Gantt(container, options);
    expect(gantt).toBeTruthy();
    expect(gantt.records).toHaveLength(1);
    expect(gantt.parsedOptions.minDate).toBeTruthy();
    expect(gantt.parsedOptions.maxDate).toBeTruthy();
  });

  test('should handle task show modes', () => {
    const options = {
      records: [
        {
          id: 1,
          name: 'Project 1',
          startDate: '2024-01-01',
          endDate: '2024-01-10',
          type: TaskType.PROJECT,
          children: [
            {
              id: 2,
              name: 'Task 1',
              startDate: '2024-01-01',
              endDate: '2024-01-05'
            }
          ]
        }
      ],
      tasksShowMode: TasksShowMode.Sub_Tasks_Inline,
      minDate: '2024-01-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        scales: [{ unit: 'day', step: 1 }]
      }
    };

    const gantt = new Gantt(container, options);
    expect(gantt.parsedOptions.tasksShowMode).toBe(TasksShowMode.Sub_Tasks_Inline);
  });
});

describe('Timeline operations', () => {
  let container;
  let gantt;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const options = {
      records: [],
      minDate: '2024-01-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        scales: [
          { unit: 'month', step: 1 },
          { unit: 'day', step: 1 }
        ]
      }
    };
    gantt = new Gantt(container, options);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should update date range', () => {
    gantt.updateDateRange('2024-02-01', '2024-03-31');
    expect(gantt.parsedOptions.minDate.getMonth()).toBe(1); // February
    expect(gantt.parsedOptions.maxDate.getMonth()).toBe(2); // March
  });

  test('should update timeline scales', () => {
    const newScales = [
      { unit: 'week', step: 1 },
      { unit: 'day', step: 1 }
    ];
    gantt.updateScales(newScales);
    expect(gantt.parsedOptions.sortedTimelineScales).toHaveLength(2);
    expect(gantt.parsedOptions.sortedTimelineScales[0].unit).toBe('day');
    expect(gantt.parsedOptions.sortedTimelineScales[1].unit).toBe('week');
  });
});

describe('Task operations', () => {
  let container;
  let gantt;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const options = {
      records: [
        {
          id: 1,
          name: 'Task 1',
          startDate: '2024-01-01',
          endDate: '2024-01-05'
        }
      ],
      minDate: '2024-01-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        scales: [{ unit: 'day', step: 1 }]
      }
    };
    gantt = new Gantt(container, options);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should get task info by index', () => {
    const taskInfo = gantt.getTaskInfoByTaskListIndex(0);
    expect(taskInfo.startDate).toBeTruthy();
    expect(taskInfo.endDate).toBeTruthy();
    expect(taskInfo.taskRecord).toBeTruthy();
  });

  test('should update task record', () => {
    const updatedTask = {
      id: 1,
      name: 'Updated Task 1',
      startDate: '2024-01-02',
      endDate: '2024-01-06'
    };
    gantt.updateTaskRecord(updatedTask, 0);
    const taskInfo = gantt.getTaskInfoByTaskListIndex(0);
    expect(taskInfo.taskRecord.name).toBe('Updated Task 1');
  });
});

describe('Gantt date formatting', () => {
  let container;
  let gantt;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const options = {
      records: [],
      minDate: '2024-01-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        scales: [{ unit: 'day', step: 1 }]
      }
    };
    gantt = new Gantt(container, options);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should format dates consistently', () => {
    const date = new Date('2024-01-15'); // 2024-01-15
    expect(gantt.formatDate(date, 'yyyy-mm-dd')).toBe('2024-01-15');
    expect(gantt.formatDate('2024-01-15', 'yyyy-mm-dd')).toBe('2024-01-15');
  });

  test('formatDate should handle different format patterns', () => {
    const date = new Date('2024-01-15'); // 2024-01-15
    expect(gantt.formatDate(date, 'dd/mm/yyyy')).toBe('15/01/2024');
    expect(gantt.formatDate(date, 'mm.dd.yyyy')).toBe('01.15.2024');
  });

  test('formatDate should handle time formats', () => {
    const dateWithTime = new Date('2024-01-15 14:30:45'); // 2024-01-15 14:30:45
    expect(gantt.formatDate(dateWithTime, 'yyyy-mm-dd hh:mm:ss')).toBe('2024-01-15 14:30:45');
  });
});
