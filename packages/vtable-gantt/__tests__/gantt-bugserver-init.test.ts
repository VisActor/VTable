// @ts-nocheck

global.__VERSION__ = 'none';

import { createDiv } from './dom';
import { Gantt } from '../src/index';
import { defaultPixelRatio } from '../src/tools/pixel-ratio';

describe('bugserver gantt initialization', () => {
  function findFirstMarkLineShape(gantt) {
    let result;
    function walk(node) {
      if (!node || result) {
        return;
      }
      if (node.type === 'line') {
        result = node;
        return;
      }
      const children = node.children || node._children;
      children?.forEach?.(child => walk(child));
    }
    walk(gantt.scenegraph.markLine.markLIneContainer);
    return result;
  }

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

  test('recomputes markLine function style when refreshed after zoom scale changes', () => {
    const container = createDiv();
    container.style.width = '800px';
    container.style.height = '400px';
    const calls = [];

    const gantt = new Gantt(container, {
      records: [
        { id: 1, title: 'Task 1', start: '2024-07-05', end: '2024-07-10' },
        { id: 2, title: 'Task 2', start: '2024-07-11', end: '2024-07-15' }
      ],
      columns: [{ field: 'title', title: 'title', width: 200 }],
      taskBar: {
        startDateField: 'start',
        endDateField: 'end'
      },
      timelineHeader: {
        colWidth: 30,
        scales: [
          { unit: 'week', step: 1, startOfWeek: 'sunday' },
          { unit: 'day', step: 1 }
        ]
      },
      minDate: '2024-07-01',
      maxDate: '2024-07-31',
      markLine: [
        {
          date: '2024-07-17',
          style: {
            lineColor: 'blue',
            lineWidth: ({ timelineColWidth }) => {
              calls.push(timelineColWidth);
              return timelineColWidth > 60 ? 6 : 2;
            }
          }
        }
      ]
    });

    expect(findFirstMarkLineShape(gantt).attribute.lineWidth).toBe(2);

    gantt.parsedOptions.timelineColWidth = 80;
    gantt.scenegraph.markLine.refresh();

    expect(findFirstMarkLineShape(gantt).attribute.lineWidth).toBe(6);
    expect(calls).toContain(30);
    expect(calls).toContain(80);

    gantt.release?.();
    container.remove();
  });

  test('initializes the gantt stage with the configured pixel ratio', () => {
    const container = createDiv();
    container.style.width = '1600px';
    container.style.height = '800px';

    const gantt = new Gantt(container, {
      pixelRatio: 3,
      records: [
        { id: 101, title: '需求评审', owner: 'Alice', start: '2024-12-05', end: '2024-12-12', progress: 20 },
        { id: 102, title: '交互设计', owner: 'Bob', start: '2024-12-10', end: '2024-12-18', progress: 35 }
      ],
      taskListTable: {
        columns: [
          { field: 'title', title: 'title', width: 160, sort: true },
          { field: 'owner', title: 'owner', width: 80, sort: true },
          { field: 'start', title: 'start', width: 120, sort: true }
        ],
        tableWidth: 360,
        minTableWidth: 280,
        maxTableWidth: 640
      },
      taskKeyField: 'id',
      taskBar: {
        startDateField: 'start',
        endDateField: 'end',
        progressField: 'progress',
        moveable: true,
        labelText: '{title}'
      },
      minDate: '2024-12-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        colWidth: 30,
        scales: [{ unit: 'day', step: 1 }]
      },
      scrollStyle: {
        visible: 'scrolling'
      }
    });

    expect((gantt.scenegraph.stage as any).window.dpr).toBe(gantt.parsedOptions.pixelRatio);
    expect(gantt.canvas.width).toBe(parseFloat(gantt.canvas.style.width) * gantt.parsedOptions.pixelRatio);
    expect(gantt.canvas.height).toBe(parseFloat(gantt.canvas.style.height) * gantt.parsedOptions.pixelRatio);

    gantt.release?.();
    container.remove();
  });

  test('uses the browser pixel ratio by default for gantt owned canvas', () => {
    const container = createDiv();
    container.style.width = '800px';
    container.style.height = '200px';

    const gantt = new Gantt(container, {
      records: [
        {
          id: 1,
          title: '项目规划',
          developer: '张三',
          startDate: '2024-07-05',
          endDate: '2024-07-14',
          baselineStartDate: '2024-07-01',
          baselineEndDate: '2024-07-10',
          progress: 80
        },
        {
          id: 2,
          title: '需求分析',
          developer: '李四',
          startDate: '2024-07-08',
          endDate: '2024-07-12',
          baselineStartDate: '2024-07-03',
          baselineEndDate: '2024-07-08',
          progress: 100
        }
      ],
      taskListTable: {
        columns: [
          { field: 'title', title: '任务名称', width: 80 },
          { field: 'developer', title: '负责人', width: 80 },
          { field: 'progress', title: '进度', width: 80, format: (val: number) => `${val}%` }
        ],
        tableWidth: 'auto',
        minTableWidth: 100,
        maxTableWidth: 500
      },
      headerRowHeight: 50,
      rowHeight: 90,
      taskBar: {
        startDateField: 'startDate',
        endDateField: 'endDate',
        progressField: 'progress',
        baselineStartDateField: 'baselineStartDate',
        baselineEndDateField: 'baselineEndDate',
        labelText: '{title}',
        barStyle: {
          width: 25,
          barColor: '#3498db',
          completedBarColor: '#27ae60',
          cornerRadius: 5
        },
        baselineStyle: {
          width: 15,
          barColor: 'gray',
          cornerRadius: 5
        }
      },
      timelineHeader: {
        colWidth: 50,
        scales: [
          { unit: 'month', step: 1 },
          { unit: 'week', step: 1, startOfWeek: 'monday' },
          { unit: 'day', step: 1 }
        ]
      },
      minDate: '2024-06-30',
      maxDate: '2024-09-01'
    });

    expect(gantt.parsedOptions.pixelRatio).toBe(defaultPixelRatio);
    expect((gantt.scenegraph.stage as any).window.dpr).toBe(defaultPixelRatio);
    expect(gantt.canvas.width).toBe(parseFloat(gantt.canvas.style.width) * defaultPixelRatio);
    expect(gantt.canvas.height).toBe(parseFloat(gantt.canvas.style.height) * defaultPixelRatio);

    gantt.release?.();
    container.remove();
  });

  test('keeps gantt owned canvas scaled after task table split resize', () => {
    const container = createDiv();
    container.style.width = '800px';
    container.style.height = '400px';

    const gantt = new Gantt(container, {
      pixelRatio: 2,
      records: [
        { id: 1, title: 'Software Development', start: '2024-07-15', end: '2024-07-16', progress: 31 },
        { id: 2, title: 'Scope', start: '2024-07-16', end: '2024-07-17', progress: 60 },
        { id: 3, title: 'Determine project scope', start: '2024/07/17', end: '2024/07/18', progress: 100 }
      ],
      taskListTable: {
        columns: [
          { field: 'title', title: 'title', width: 200, sort: true },
          { field: 'start', title: 'start', width: 150, sort: true }
        ],
        tableWidth: 400,
        minTableWidth: 100,
        maxTableWidth: 600
      },
      frame: {
        verticalSplitLineMoveable: true,
        outerFrameStyle: {
          borderLineWidth: 2,
          borderColor: 'red',
          cornerRadius: 8
        }
      },
      headerRowHeight: 60,
      rowHeight: 40,
      taskBar: {
        startDateField: 'start',
        endDateField: 'end',
        progressField: 'progress',
        labelText: '{title} {progress}%'
      },
      timelineHeader: {
        colWidth: 60,
        scales: [
          { unit: 'week', step: 1, startOfWeek: 'sunday' },
          { unit: 'day', step: 1 }
        ]
      },
      minDate: '2024-07-14',
      maxDate: '2024-10-15',
      rowSeriesNumber: {
        title: '行号',
        dragOrder: true
      }
    });

    const stateManager = gantt.stateManager as any;
    stateManager.resizeTableWidth.resizing = true;
    stateManager.resizeTableWidth.lastX = 400;

    stateManager.dealResizeTableWidth({ pageX: 350 } as MouseEvent);

    expect(gantt.taskTableWidth).toBe(350);
    expect((gantt.scenegraph.stage as any).window.dpr).toBe(gantt.parsedOptions.pixelRatio);
    expect(gantt.canvas.width).toBe(parseFloat(gantt.canvas.style.width) * gantt.parsedOptions.pixelRatio);
    expect(gantt.canvas.height).toBe(parseFloat(gantt.canvas.style.height) * gantt.parsedOptions.pixelRatio);

    gantt.release?.();
    container.remove();
  });

  test('shows clipped task label poptip on hover after owned canvas DPR setup', () => {
    const container = createDiv();
    container.style.width = '600px';
    container.style.height = '400px';

    const gantt = new Gantt(container, {
      records: [
        {
          id: 1,
          title: 'Software Development',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-04 08:30:00',
          end: '2024-07-04 12:29:59',
          progress: 31,
          priority: 'P0'
        },
        {
          id: 2,
          title: 'Scope',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-04 00:30:00',
          end: '2024-07-04 17:59:59',
          progress: 60,
          priority: 'P0'
        }
      ],
      taskListTable: {
        columns: [
          { field: 'title', title: 'title', width: 200, sort: true },
          { field: 'start', title: 'start', width: 150, sort: true },
          { field: 'end', title: 'end', width: 150, sort: true }
        ],
        tableWidth: 100,
        minTableWidth: 100,
        maxTableWidth: 600
      },
      headerRowHeight: 40,
      rowHeight: 40,
      taskBar: {
        selectable: false,
        startDateField: 'start',
        endDateField: 'end',
        progressField: 'progress',
        labelText: '{title} {progress}%',
        labelTextStyle: {
          fontFamily: 'Arial',
          fontSize: 16,
          textAlign: 'left'
        },
        barStyle: {
          width: 20,
          barColor: '#ee8800',
          completedBarColor: '#91e8e0',
          cornerRadius: 10
        }
      },
      timelineHeader: {
        colWidth: 30,
        scales: [
          { unit: 'year', step: 3, style: { textStick: true } },
          { unit: 'month', step: 1, style: { textStick: true } },
          { unit: 'quarter', step: 1, style: { textStick: true } },
          { unit: 'week', step: 2, startOfWeek: 'sunday', style: { textStick: true } },
          { unit: 'day', step: 2 },
          { unit: 'hour', step: 1 }
        ]
      },
      minDate: '2024-07-03 18:00:00',
      maxDate: '2024-07-25',
      rowSeriesNumber: {
        title: '行号',
        dragOrder: true
      },
      scrollStyle: {
        visible: 'scrolling'
      }
    });

    const taskBarNode = gantt.scenegraph.taskBar.getTaskBarNodeByIndex(0) as any;
    const label = taskBarNode.textLabel;

    const poptipPlugin = gantt.scenegraph.stage.pluginService.findPluginsByName('poptipForText')[0] as any;

    expect(label).toBeDefined();
    expect(label.cliped).toBe(true);
    expect(poptipPlugin).toBeDefined();

    poptipPlugin.poptip({ target: label });
    gantt.scenegraph.stage.render();

    const interactiveLayer = gantt.scenegraph.stage.getLayer('_builtin_interactive') as any;
    expect(interactiveLayer?.getChildren().some((child: any) => child.name === 'poptip')).toBe(true);

    gantt.release?.();
    container.remove();
  });

  test('initializes the data zoom stage with the configured pixel ratio', () => {
    const container = createDiv();
    container.style.width = '1600px';
    container.style.height = '800px';

    const gantt = new Gantt(container, {
      pixelRatio: 3,
      records: [
        { id: 101, title: '需求评审', owner: 'Alice', start: '2024-12-05', end: '2024-12-12', progress: 20 },
        { id: 102, title: '交互设计', owner: 'Bob', start: '2024-12-10', end: '2024-12-18', progress: 35 }
      ],
      taskListTable: {
        columns: [
          { field: 'title', title: 'title', width: 160, sort: true },
          { field: 'owner', title: 'owner', width: 80, sort: true },
          { field: 'start', title: 'start', width: 120, sort: true }
        ],
        tableWidth: 360,
        minTableWidth: 280,
        maxTableWidth: 640
      },
      taskKeyField: 'id',
      taskBar: {
        startDateField: 'start',
        endDateField: 'end',
        progressField: 'progress',
        moveable: true,
        labelText: '{title}'
      },
      minDate: '2024-12-01',
      maxDate: '2024-12-31',
      timelineHeader: {
        colWidth: 30,
        scales: [{ unit: 'day', step: 1 }],
        zoomScale: {
          enabled: true,
          levels: []
        }
      },
      scrollStyle: {
        visible: 'scrolling'
      }
    });

    const dataZoom = gantt.zoomScaleManager.createDataZoomIntegration({
      width: 400,
      height: 30,
      x: 360,
      y: 0
    });

    expect((dataZoom as any).stage.window.dpr).toBe(gantt.parsedOptions.pixelRatio);
    expect((dataZoom as any).canvas.width).toBe(400 * gantt.parsedOptions.pixelRatio);
    expect((dataZoom as any).canvas.height).toBe(30 * gantt.parsedOptions.pixelRatio);

    gantt.release?.();
    container.remove();
  });
});
