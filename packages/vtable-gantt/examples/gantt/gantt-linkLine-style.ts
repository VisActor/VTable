import type { GanttConstructorOptions } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      id: 1,
      title: 'A',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-04',
      end: '2024-07-06',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'B',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'C',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-08',
      end: '2024-07-10',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 4,
      title: 'D',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-02',
      end: '2024-07-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 5,
      title: 'E',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-10',
      end: '2024-07-12',
      progress: 31,
      priority: 'P0'
    }
  ];
  const columns = [
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
      linkLineStyle: {
        lineColor: 'skyblue',
        lineWidth: 2
      },
      linkSelectedLineStyle: {
        shadowBlur: 2,
        shadowColor: 'blue',
        lineWidth: 3
      },
      links: [
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 1,
          linkedToTaskKey: 2,
          linkLineStyle: {
            lineColor: 'grey',
            lineWidth: 2
          }
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 2,
          linkedToTaskKey: 3,
          linkLineStyle: {
            lineColor: 'skyblue',
            lineWidth: 2
          }
        },
        {
          type: VTableGantt.TYPES.DependencyType.FinishToStart,
          linkedFromTaskKey: 4,
          linkedToTaskKey: 3
        }
      ],
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
    },
    headerRowHeight: 20,
    rowHeight: 50,

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
            width: 15,
            /** 任务条的颜色 */
            barColor: 'red',
            /** 已完成部分任务条的颜色 */
            completedBarColor: '#91e8e0',
            /** 任务条的圆角 */
            cornerRadius: 10
          };
        }
        return {
          width: 15,
          /** 任务条的颜色 */
          barColor: '#ee8800',
          /** 已完成部分任务条的颜色 */
          completedBarColor: '#91e8e0',
          /** 任务条的圆角 */
          cornerRadius: 1
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
      ]
    },
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
    eventOptions: {
      preventDefaultContextMenu: false
    },
    overscrollBehavior: 'none'
  };
  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.setRecords(records);

  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}
