import type { ColumnsDefine } from '@visactor/vtable';
import * as VTable from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
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
      progress: 60,
      priority: 'P0',
      type: 'milestone'
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
      id: 4,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-14',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 5,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/14/2024',
      end: '07/24/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 6,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-10',
      end: '2024-07-14',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 7,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 8,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 9,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 10,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 11,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 12,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 13,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 14,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 15,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 16,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 17,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 18,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 19,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 20,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
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
    theme: VTableGantt.themes.SIMPLIFY,
    taskListTable: {
      columns: columns,
      tableWidth: 400,
      minTableWidth: 100,
      maxTableWidth: 600,
      theme: VTable.themes.SIMPLIFY,
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
    headerRowHeight: 60,
    rowHeight: 40,
    timelineHeader: {
      scales: [
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
      ]
    },
    scrollStyle: {
      visible: 'scrolling'
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
  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.setRecords(records);

  ganttInstance.on('scroll', e => {
    console.log('scroll', e);
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
