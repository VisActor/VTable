import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import { Gantt, VTable } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
import { DependencyType } from '../../src/ts-types';
import { HierarchyState } from '../../../vtable/src/ts-types';
const CONTAINER_ID = 'vTable';
const date_input_editor = new DateInputEditor({});
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
VTable.register.editor('date-input', date_input_editor);
export function createTable() {
  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-15',
      end: '2024-07-16',
      progress: 31,
      priority: 'P0',
      // hierarchyState: 'expand',
      children: [
        {
          id: 2,
          title: 'Scope',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-16',
          end: '2024-07-17',
          progress: 60,
          priority: 'P0'
        },
        {
          id: 3,
          title: 'Software Development',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-18',
          end: '2024-07-19',
          progress: 90,
          priority: 'P0'
        },
        {
          id: 4,
          title: 'Determine project scope',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024/07/17',
          end: '2024/07/18',
          progress: 100,
          priority: 'P1'
        }
      ]
    },
    {
      id: 5,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/19/2024',
      end: '07/20/2024',
      progress: 60,
      priority: 'P0',
      // hierarchyState: 'expand',
      children: [
        {
          id: 52,
          title: 'Scope',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-16',
          end: '2024-07-17',
          progress: 60,
          priority: 'P0'
        },
        {
          id: 53,
          title: 'Software Development',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-18',
          end: '2024-07-19',
          progress: 90,
          priority: 'P0'
        },
        {
          id: 54,
          title: 'Determine project scope',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024/07/17',
          end: '2024/07/18',
          progress: 100,
          priority: 'P1'
        }
      ]
    },
    {
      id: 6,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 12,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 13,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    }
  ];

  const columns: ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      tree: true,
      sort: true
    },
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
      editor: 'date-input',
      sort: true
    },
    {
      field: 'end',
      title: 'end',
      width: 150,
      editor: 'date-input',
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
    records,
    taskListTable: {
      columns: columns,
      tableWidth: 400,
      minTableWidth: 100,
      maxTableWidth: 600
    },
    dependency: {
      links: [
        {
          type: DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 2
        },
        {
          type: DependencyType.StartToFinish,
          linkedFromTaskKey: 2,
          linkedToTaskKey: 3
        },
        {
          type: DependencyType.StartToStart,
          linkedFromTaskKey: 3,
          linkedToTaskKey: 4
        },
        {
          type: DependencyType.FinishToFinish,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 5
        },
        {
          type: DependencyType.StartToFinish,
          linkedFromTaskKey: 5,
          linkedToTaskKey: 2
        },
        {
          type: DependencyType.StartToStart,
          linkedFromTaskKey: 52,
          linkedToTaskKey: 1
        },
        {
          type: DependencyType.StartToStart,
          linkedFromTaskKey: 53,
          linkedToTaskKey: 3
        },
        {
          type: DependencyType.FinishToFinish,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 54
        },
        {
          type: DependencyType.FinishToStart,
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
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    headerRowHeight: 60,
    rowHeight: 40,

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
      barStyle: {
        width: 20,
        /** 任务条的颜色 */
        barColor: '#ee8800',
        /** 已完成部分任务条的颜色 */
        completedBarColor: '#91e8e0',
        /** 任务条的圆角 */
        cornerRadius: 10
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
          unit: 'week',
          step: 1,
          startOfWeek: 'sunday',
          format(date: TYPES.DateFormatArgumentType) {
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
          format(date: TYPES.DateFormatArgumentType) {
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
    minDate: '2024-07-01',
    maxDate: '2024-10-15',
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
  ganttInstance.on('create_task_schedule', e => {
    console.log('create_task_schedule', e);
  });

  ganttInstance.on('create_dependency_link', e => {
    console.log('create_dependency_link', e);
  });
  ganttInstance.listTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });

  // bindDebugTool(ganttInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
