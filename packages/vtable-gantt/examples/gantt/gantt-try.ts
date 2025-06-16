import type { ColumnsDefine } from '@visactor/vtable';
import { register } from '@visactor/vtable';
import type { GanttConstructorOptions } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '@visactor/vtable/src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-04 08:30:00',
      end: '2024-07-04 17:30:00',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-04 00:00:00',
      end: '2024-07-04 17:00:00',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-04 18:00:00',
      end: '2024-07-05 07:00:00',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 4,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06 10:00:00',
      end: '2024-07-06 17:30:00',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 5,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
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
  const option = {
    records,
    taskListTable: {
      // columns: columns,
      // tableWidth: 400,
      // minTableWidth: 100,
      // maxTableWidth: 600
    },
    resizeLineStyle: {
      lineColor: 'green',
      lineWidth: 3
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
    defaultHeaderRowHeight: 60,
    defaultRowHeight: 40,
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
        cornerRadius: 8
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
      colWidth: 20,
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
            color: 'red',
            backgroundColor: '#EEF1F5'
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
            color: 'red',
            backgroundColor: '#EEF1F5'
          }
        },
        {
          unit: 'hour',
          step: 2,
          style: {
            fontSize: 10,
          }
        },
        {
          unit: 'quarter',
          step: 1,
          format(date) {
            return '第' + date.index + '季度';
          }
        }
      ]
    },
    minDate: '2024-07-03',
    maxDate: '2024-07-15',
    scrollStyle: {
      visible: 'scrolling'
    },
    overscrollBehavior: 'none'
  };

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
