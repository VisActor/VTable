import type { ColumnsDefine } from '@visactor/vtable';
import { register } from '@visactor/vtable';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
import { scale } from '@visactor/vutils';
import { DependencyType } from '../../src/ts-types';
const CONTAINER_ID = 'vTable';
const date_input_editor = new DateInputEditor({});
const input_editor = new InputEditor({});
register.editor('input', input_editor);
register.editor('date-input', date_input_editor);
export function createTable() {
  const records = [
    {
      id: '1',
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-30',
      end: '2024-08-14',
      progress: 31,
      priority: 'P0',
      type: 'project', // 任务为项目类型，
      children: [
        {
          id: '1-1',
          title: 'Scope Definition',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-24',
          end: '2024-08-04',
          progress: 60,
          priority: 'P0'
        },
        {
          id: '1-2',
          title: 'Requirements Analysis',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024/07/24',
          end: '2024/08/04',
          progress: 100,
          priority: 'P1'
        },
        {
          id: '1-3',
          title: 'Design Phase',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-24',
          end: '2024-08-04',
          progress: 90,
          priority: 'P0'
        },
        {
          id: '1-4',
          title: 'Implementation',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-24',
          end: '2024-08-04',
          progress: 31,
          priority: 'P0'
        },
        {
          id: '1-5',
          title: 'Testing',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024.07.06',
          end: '2024.07.08',
          progress: 60,
          priority: 'P0'
        }
      ]
    },
    {
      id: '2',
      title: 'Project Management',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0',
      type: 'project',
      children: [
        {
          id: '2-1',
          title: 'Planning',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-09',
          end: '2024-07-11',
          progress: 100,
          priority: 'P1',
          type: 'project',
          children: [
            {
              id: '2-1-1',
              title: 'Resource Allocation',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-24',
              end: '2024-08-04',
              progress: 31,
              priority: 'P0'
            },
            {
              id: '2-1-2',
              title: 'Timeline Preparation',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-06',
              end: '2024-07-08',
              progress: 60,
              priority: 'P0'
            },
            {
              id: '2-1-3',
              title: 'Budget Estimation',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-09',
              end: '2024-07-11',
              progress: 100,
              priority: 'P1'
            }
          ]
        },
        {
          id: '2-2',
          title: 'Execution',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-24',
          end: '2024-08-04',
          progress: 31,
          priority: 'P0',
          type: 'project',
          children: [
            {
              id: '2-2-1',
              title: 'Team Coordination',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-24',
              end: '2024-08-04',
              progress: 31,
              priority: 'P0'
            },
            {
              id: '2-2-2',
              title: 'Progress Tracking',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-06',
              end: '2024-07-08',
              progress: 60,
              priority: 'P0'
            },
            {
              id: '2-2-3',
              title: 'Issue Resolution',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-09',
              end: '2024-07-11',
              progress: 100,
              priority: 'P1'
            }
          ]
        },
        {
          id: '2-3',
          title: 'Monitoring',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-06',
          end: '2024-07-08',
          progress: 60,
          priority: 'P0'
        },
        {
          id: '2-4',
          title: 'Closing',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-09',
          end: '2024-07-11',
          progress: 100,
          priority: 'P1',
          children: [
            {
              id: '2-4-1',
              title: 'Final Review',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-24',
              end: '2024-08-04',
              progress: 31,
              priority: 'P0'
            },
            {
              id: '2-4-2',
              title: 'Documentation',
              developer: 'liufangfang.jane@bytedance.com',
              start: '2024-07-06',
              end: '2024-07-08',
              progress: 60,
              priority: 'P0'
            }
          ]
        }
      ]
    }
  ];

  const columns: ColumnsDefine = [
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
      tree: true,
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
    records,
    dependency: {
      linkDeletable: true,
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
    taskListTable: {
      headerEditor: 'input',
      columns: columns,
      tableWidth: 400,
      minTableWidth: 100,
      maxTableWidth: 600,
      hierarchyExpandLevel: 5,
      menu: {
        contextMenuItems: ['copy', 'paste', 'delete', '...']
      }
    },

    frame: {
      outerFrameStyle: {
        borderLineWidth: 2,
        borderColor: 'red',
        cornerRadius: 8
      },
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 3
      }
    },
    grid: {
      backgroundColor: 'gray',
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
      // horizontalLine: {
      //   lineWidth: 1,
      //   lineColor: '#e1e4e8'
      // }
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
        cornerRadius: 8,
        /** 任务条的边框 */
        borderWidth: 1,
        /** 边框颜色 */
        borderColor: 'black'
      },
      projectStyle: {
        barColor: 'pink',
        /** 已完成部分任务条的颜色 */
        completedBarColor: 'green',
        /** 任务条的圆角 */
        cornerRadius: 1,
        /** 任务条的边框 */
        borderWidth: 2,
        /** 边框颜色 */
        borderColor: 'yellow'
      }
    },
    timelineHeader: {
      verticalLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1
      },
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
            color: 'red',
            backgroundColor: '#EEF1F5'
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
            color: 'red',
            backgroundColor: '#EEF1F5'
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
    minDate: '2024-07-07',
    maxDate: '2024-10-15',
    markLine: [
      {
        date: '2024-07-17',
        style: {
          lineWidth: 1,
          lineColor: 'blue',
          lineDash: [8, 4]
        }
      },
      {
        date: '2024-08-17',
        style: {
          lineWidth: 2,
          lineColor: 'red',
          lineDash: [8, 4]
        }
      }
    ],
    rowSeriesNumber: {
      title: '行号',
      dragOrder: true,
      headerStyle: {
        bgColor: '#EEF1F5',

        borderColor: '#e1e4e8'
      },
      style: {
        borderColor: '#e1e4e8'
      }
    },
    scrollStyle: {
      scrollRailColor: 'RGBA(246,246,246,0.5)',
      visible: 'none',
      width: 6,
      scrollSliderCornerRadius: 2,
      scrollSliderColor: '#5cb85c'
    }
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

  ganttInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  // bindDebugTool(ganttInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
