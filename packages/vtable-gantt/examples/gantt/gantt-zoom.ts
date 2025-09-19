import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
// import { debug } from 'console';
const CONTAINER_ID = 'vTable';

export function createTable() {
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
      start: '2024-07-05',
      end: '2024-07-05',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/08',
      end: '2024/07/14',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-14',
      progress: 90,
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
      start: '2024-07-10',
      end: '2024-07-14',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-30',
      end: '2024-08-14',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/24',
      end: '2024/08/04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-04',
      end: '2024-08-04',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/24/2024',
      end: '08/04/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    }
  ];

  const columns = [
    // {
    //   field: 'id',
    //   title: 'ID',
    //   width: 80,
    //   sort: true
    // },
    {
      field: 'title',
      title: 'title',
      width: 200,
      sort: true
    },
    {
      field: 'start',
      title: 'start',
      width: 150,
      sort: true
    },
    {
      field: 'end',
      title: 'end',
      width: 150,
      sort: true
    },
    {
      field: 'priority',
      title: 'priority',
      width: 100,
      sort: true
    },

    {
      field: 'progress',
      title: 'progress',
      width: 200,
      sort: true
    }
  ];
  const option: GanttConstructorOptions = {
    records: [],
    taskListTable: {
      columns: columns,
      tableWidth: 100,
      minTableWidth: 100,
      maxTableWidth: 600
    },
    dependency: {
      links: [
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 2
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToFinish,
          linkedFromTaskKey: 2,
          linkedToTaskKey: 3
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 3,
          linkedToTaskKey: 4
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToFinish,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 5
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToFinish,
          linkedFromTaskKey: 5,
          linkedToTaskKey: 2
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 52,
          linkedToTaskKey: 1
        },
        {
          type: VTableGantt.TYPES.DependencyType.StartToStart,
          linkedFromTaskKey: 53,
          linkedToTaskKey: 3
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToFinish,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 54
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 5
        }
      ],
      // linkLineSelectable: false,
      linkSelectedLineStyle: {
        shadowBlur: 5, //阴影宽度
        shadowColor: 'red',
        lineColor: 'red',
        lineWidth: 1
      },
      linkCreatable: true
    },
    frame: {
      verticalSplitLineMoveable: true,
      outerFrameStyle: {
        borderLineWidth: 2,
        borderColor: 'red',
        cornerRadius: 8
      },
      verticalSplitLine: {
        lineWidth: 3,
        lineColor: '#e1e4e8'
      },
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 3
      }
    },
    grid: {
      // backgroundColor: 'gray',
      weekendBackgroundColor: 'yellow',
      verticalLine(args) {
        const dateIndex = args.date?.getDate();
        if (dateIndex === 20) {
          return {
            lineWidth: 1,
            lineColor: '#e1e4e8'
          };
        }
        return {
          lineWidth: 1,
          lineColor: 'red'
        };
      },
      verticalLineDependenceOnTimeScale: 'week',
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
      // weekendBackgroundColor: 'rgba(0,100,0,0.3)',
      // verticalBackgroundColor: ['#fbfbfc', '#fbfbf0', '#fbfbe0'] // args => (args.index % 2 === 0 ? '#fbfbfc' : '#fbfbf0')
      // rowBackgroundColor: ['rgba(33,44,255,0.2)', '#fbfbf0', '#fbfbe0'] //args => (args.index % 2 === 0 ? '#fbfbfc' : '#fbfbf0')
    },
    headerRowHeight: 60,
    rowHeight: 40,
    // ZoomScale 多级别缩放配置
    zoomScale: {
      enabled: true,
      levels: [
        // 级别0：月-周组合 (最粗糙)
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          }
        ],
        // 级别1：月-日组合
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 4,
            format: date => date.startDate.getDate().toString()
          }
        ],
        // 级别2：月-周-日组合
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 1,
            format: date => date.startDate.getDate().toString()
          }
        ],
        // 级别3：周-日-小时组合 (12小时)
        [
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 12,
            format: date => {
              const startHour = date.startDate.getHours();
              const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
              return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
            }
          }
        ],
        // 级别4：日-小时组合 (6小时)
        [
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 6,
            format: date => {
              const startHour = date.startDate.getHours();
              const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
              return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
            }
          }
        ],
        // 级别5：日-小时组合 (1小时)
        [
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 1,
            format: date => {
              const hour = date.startDate.getHours();
              return `${hour.toString().padStart(2, '0')}:00`;
            }
          }
        ]
      ]
    },
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress',
      labelText: '{title} {progress}%',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 16,
        textAlign: 'left'
      },
      barStyle(args) {
        if (args.taskRecord.title === 'Scope') {
          return {
            width: 30,
            /** 任务条的颜色 */
            barColor: 'red',
            /** 已完成部分任务条的颜色 */
            completedBarColor: '#91e8e0',
            /** 任务条的圆角 */
            cornerRadius: 10
          };
        }
        return {
          width: 20,
          /** 任务条的颜色 */
          barColor: '#ee8800',
          /** 已完成部分任务条的颜色 */
          completedBarColor: '#91e8e0',
          /** 任务条的圆角 */
          cornerRadius: 10
        };
      },
      selectedBarStyle: {
        shadowBlur: 5, //阴影宽度
        shadowOffsetX: 0, //x方向偏移
        shadowOffsetY: 0, //Y方向偏移
        shadowColor: 'black', //阴影颜色
        borderColor: 'red', //边框颜色
        borderLineWidth: 1 //边框宽度
      }
    },
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 60,
      scales: [
        {
          unit: 'month',
          step: 1
        },
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'sunday',
          format(date) {
            return `Week ${date.dateIndex}`;
          },

          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red'
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date) {
            return date.dateIndex.toString();
          },

          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red'
          }
        }
        // {
        //   unit: 'quarter',
        //   step: 1,
        //   format(date: TYPES.DateFormatArgumentType) {
        //     return '第' + date.index + '季度';
        //   }
        // }
      ]
    },
    // minDate: '2024-07-01',
    // maxDate: '2024-10-15',
    // markLine: [
    //   {
    //     date: '2024-07-17',
    //     style: {
    //       lineWidth: 1,
    //       lineColor: 'blue',
    //       lineDash: [8, 4]
    //     }
    //   },
    //   {
    //     date: '2024-08-17',
    //     position: 'middle',
    //     // scrollToMarkLine: true,
    //     style: {
    //       lineWidth: 2,
    //       lineColor: 'red',
    //       lineDash: [8, 4]
    //     }
    //   }
    // ],
    rowSeriesNumber: {
      title: '行号',
      dragOrder: true,
      headerStyle: {
        bgColor: '#EEF1F5',

        borderColor: '#e1e4e8'
      },
      style: {
        bgColor: 'gray',
        color: '#FFF',
        fontSize: 14
      }
    },
    scrollStyle: {
      visible: 'always'
    },
    eventOptions: {
      preventDefaultContextMenu: false
    },
    overscrollBehavior: 'none'
  };
  // columns:[
  //   {
  //     title:'2024-07',
  //     columns:[
  //       {
  //         title:'01'
  //       },
  //       {
  //         title:'02'
  //       },
  //       ...
  //     ]
  //   },
  //   ...
  // ]
  const existingControls = document.getElementById('zoom-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  (window as any).ganttInstance = ganttInstance;
  ganttInstance.setRecords(records);

  // 创建缩放控制按钮
  const zoomControlsContainer = createZoomControls(ganttInstance);

  const cleanup = () => {
    if (zoomControlsContainer && zoomControlsContainer.parentNode) {
      zoomControlsContainer.parentNode.removeChild(zoomControlsContainer);
    }
  };

  window.addEventListener('beforeunload', cleanup);

  const originalRelease = ganttInstance.release.bind(ganttInstance);
  ganttInstance.release = function () {
    cleanup();
    window.removeEventListener('beforeunload', cleanup);
    originalRelease();
  };

  ganttInstance.on('scroll', e => {
    console.log('scroll', e);
  });
  ganttInstance.on('zoom', args => {
    console.log('缩放事件:', args);

    // 获取当前时间单位信息
    const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
    console.log('当前时间单位:', {
      unit: scale?.unit,
      step: scale?.step,
      timelineColWidth: ganttInstance.parsedOptions.timelineColWidth.toFixed(1)
    });
  });
  ganttInstance.on('change_date_range', e => {
    console.log('change_date_range', e);
  });
  ganttInstance.on('mouseenter_task_bar', e => {
    console.log('mouseenter_taskbar', e);
  });
  ganttInstance.on('mouseleave_task_bar', e => {
    console.log('mouseleave_taskbar', e);
  });
  ganttInstance.on('click_task_bar', e => {
    console.log('click_task_bar', e);
  });
  ganttInstance.on('contextmenu_task_bar', e => {
    console.log('contextmenu_task_bar', e);
  });
  ganttInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  ganttInstance.taskListTableInstance?.on('change_header_position_start', e => {
    console.log('change_header_position_start ', e);
  });
  ganttInstance.taskListTableInstance?.on('changing_header_position', e => {
    console.log('changing_header_position ', e);
  });
  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}

/**
 * 创建缩放控制按钮
 */
function createZoomControls(ganttInstance: Gantt) {
  // 创建按钮容器
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'zoom-controls';
  controlsContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 8px;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: Arial, sans-serif;
    min-width: 180px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  // 创建标题
  const title = document.createElement('div');
  title.textContent = '缩放控制';
  title.style.cssText = `
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 8px;
    color: #333;
    text-align: center;
  `;
  controlsContainer.appendChild(title);

  // 创建按钮容器
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  `;

  // 放大10%按钮
  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = '放大10%';
  zoomInBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomInBtn.onmouseover = () => {
    zoomInBtn.style.background = '#45a049';
  };
  zoomInBtn.onmouseout = () => {
    zoomInBtn.style.background = '#4CAF50';
  };
  zoomInBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(10);
      updateStatusDisplay();
    } else {
      // eslint-disable-next-line no-console
      console.warn('ZoomScaleManager 未启用');
    }
  };

  // 缩小10%按钮
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.textContent = '缩小10%';
  zoomOutBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomOutBtn.onmouseover = () => {
    zoomOutBtn.style.background = '#da190b';
  };
  zoomOutBtn.onmouseout = () => {
    zoomOutBtn.style.background = '#f44336';
  };
  zoomOutBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(-10);
      updateStatusDisplay();
    } else {
      // eslint-disable-next-line no-console
      console.warn('ZoomScaleManager 未启用');
    }
  };

  buttonsContainer.appendChild(zoomInBtn);
  buttonsContainer.appendChild(zoomOutBtn);
  controlsContainer.appendChild(buttonsContainer);

  // 获取状态按钮
  const getStatusBtn = document.createElement('button');
  getStatusBtn.textContent = '获取缩放状态';
  getStatusBtn.style.cssText = `
    padding: 6px 8px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    margin-bottom: 8px;
    transition: background-color 0.2s;
  `;
  getStatusBtn.onmouseover = () => {
    getStatusBtn.style.background = '#0b7dda';
  };
  getStatusBtn.onmouseout = () => {
    getStatusBtn.style.background = '#2196F3';
  };
  getStatusBtn.onclick = () => {
    updateStatusDisplay();
    // eslint-disable-next-line no-console
    console.log('当前缩放状态已更新');
  };
  controlsContainer.appendChild(getStatusBtn);

  // 缩放级别选择区域
  if (ganttInstance.zoomScaleManager) {
    const levelSelectorContainer = document.createElement('div');
    levelSelectorContainer.style.cssText = `
      background: #f9f9f9;
      padding: 8px;
      border-radius: 3px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
    `;

    const levelTitle = document.createElement('div');
    levelTitle.textContent = '缩放级别选择:';
    levelTitle.style.cssText = `
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 6px;
      color: #333;
    `;
    levelSelectorContainer.appendChild(levelTitle);

    // 获取级别配置
    const levels = ganttInstance.zoomScaleManager.config.levels;

    const radioGroup = document.createElement('div');
    radioGroup.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px;
    `;

    levels.forEach((level, index) => {
      const minUnit = ganttInstance.zoomScaleManager?.findMinTimeUnit(level);

      const radioContainer = document.createElement('label');
      radioContainer.style.cssText = `
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 10px;
        padding: 1px 3px;
        border-radius: 2px;
        transition: background-color 0.2s;
      `;
      radioContainer.onmouseover = () => {
        radioContainer.style.backgroundColor = '#e8f4fd';
      };
      radioContainer.onmouseout = () => {
        radioContainer.style.backgroundColor = 'transparent';
      };

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'zoomLevel';
      radio.value = index.toString();
      radio.style.cssText = `
        margin-right: 4px;
        transform: scale(0.8);
      `;

      // 检查当前级别
      if (index === ganttInstance.zoomScaleManager?.getCurrentLevel()) {
        radio.checked = true;
      }

      radio.onchange = () => {
        if (radio.checked) {
          // 切换到对应级别的中间状态
          ganttInstance.zoomScaleManager?.setZoomPosition({
            levelNum: index
          });
          updateStatusDisplay();
        }
      };

      const label = document.createElement('span');
      label.textContent = `L${index}: ${minUnit?.unit}×${minUnit?.step}`;
      label.style.cssText = `
        color: #555;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      radioContainer.appendChild(radio);
      radioContainer.appendChild(label);
      radioGroup.appendChild(radioContainer);
    });

    levelSelectorContainer.appendChild(radioGroup);
    controlsContainer.appendChild(levelSelectorContainer);

    // 监听缩放事件，更新单选按钮状态
    ganttInstance.on('zoom', () => {
      const currentLevel = ganttInstance.zoomScaleManager?.getCurrentLevel();
      const radios = radioGroup.querySelectorAll('input[name="zoomLevel"]');
      radios.forEach((radio, index) => {
        (radio as HTMLInputElement).checked = index === currentLevel;
      });
    });
  }

  // 状态显示区域
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'zoom-status';
  statusDisplay.style.cssText = `
    background: #f5f5f5;
    padding: 8px;
    border-radius: 3px;
    font-size: 10px;
    line-height: 1.3;
    color: #666;
    border: 1px solid #ddd;
  `;
  controlsContainer.appendChild(statusDisplay);

  // 更新状态显示的函数
  function updateStatusDisplay() {
    const currentTimePerPixel = ganttInstance.getCurrentTimePerPixel();
    const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
    const zoomConfig = ganttInstance.parsedOptions.zoom;

    let zoomScaleInfo = '';
    if (ganttInstance.zoomScaleManager) {
      const state = ganttInstance.zoomScaleManager.getCurrentZoomState();
      const currentLevel = ganttInstance.zoomScaleManager.getCurrentLevel();
      zoomScaleInfo = `
        <strong>ZoomScale状态:</strong><br>
        • 当前级别: ${currentLevel}<br>
        • 最小单位: ${state?.minUnit} × ${state?.step}<br>
        • 列宽: ${state?.currentColWidth}px<br>
      `;
    }

    statusDisplay.innerHTML = `
      <strong>缩放状态:</strong><br>
      • TimePerPixel: ${currentTimePerPixel.toFixed(0)}<br>
      • 时间轴列宽: ${ganttInstance.parsedOptions.timelineColWidth.toFixed(1)}px<br>
      • 当前时间单位: ${scale?.unit} × ${scale?.step}<br>
      • 缩放范围: ${zoomConfig?.minTimePerPixel?.toFixed(0)} ~ ${zoomConfig?.maxTimePerPixel?.toFixed(0)}<br>
      ${zoomScaleInfo}
    `;
  }

  // 初始化状态显示
  updateStatusDisplay();

  // 监听缩放事件，自动更新状态
  ganttInstance.on('zoom', () => {
    updateStatusDisplay();
  });

  // 将控制面板添加到页面
  document.body.appendChild(controlsContainer);

  // 返回控制面板元素，便于后续操作
  return controlsContainer;
}
