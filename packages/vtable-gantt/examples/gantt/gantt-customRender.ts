import type { ColumnsDefine } from '@visactor/vtable';
import { register, VRender, CustomLayout } from '@visactor/vtable';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const date_input_editor = new DateInputEditor({});
const input_editor = new InputEditor({});
register.editor('input', input_editor);
register.editor('date-input', date_input_editor);
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
export function createTable() {
  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-30',
      end: '2024-08-14',
      progress: 31,
      priority: 'P0',
      children: [
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
        }
      ]
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
      priority: 'P1',
      children: [
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
        }
      ]
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
      priority: 'P0',
      children: [
        {
          id: 3,
          title: 'Determine project scope',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-09',
          end: '2024-07-11',
          progress: 100,
          priority: 'P1',
          children: [
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
          ]
        },
        {
          id: 1,
          title: 'Software Development',
          developer: 'liufangfang.jane@bytedance.com',
          start: '2024-07-24',
          end: '2024-08-04',
          progress: 31,
          priority: 'P0',
          children: [
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
          ]
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
          priority: 'P1',
          children: [
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
            }
          ]
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
      ]
    },

    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1',
      children: [
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
        }
      ]
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0',
      children: [
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
        }
      ]
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
      priority: 'P1',
      children: [
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
        }
      ]
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0',
      children: [
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
        }
      ]
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
      sort: true,
      tree: true,
      editor: 'input'
    },
    {
      field: 'start',
      title: 'start',
      width: 150,
      sort: true,
      editor: 'date-input'
    },
    {
      field: 'end',
      title: 'end',
      width: 150,
      sort: true,
      editor: 'date-input'
    },
    {
      field: 'priority',
      title: 'priority',
      width: 100,
      sort: true,
      editor: 'input'
    },
    {
      field: 'progress',
      title: 'progress',
      width: 200,
      sort: true,
      headerStyle: {
        borderColor: '#e1e4e8'
      },
      style: {
        borderColor: '#e1e4e8',
        color: 'green'
      },
      editor: 'input'
    }
  ];
  const option: GanttConstructorOptions = {
    records,
    taskListTable: {
      columns: columns,
      width: 400,
      minWidth: 100,
      maxWidth: 600,
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: [1, 0, 1, 0],
        fontSize: 16,
        color: '#4D4D4D',
        bgColor: '#FFF'
      }
    },
    resizeLineStyle: {
      lineColor: 'green',
      lineWidth: 3
    },
    timelineColWidth: 60,
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    frameStyle: {
      borderLineWidth: 2,
      borderColor: 'red',
      cornerRadius: 8
    },
    gridStyle: {
      // backgroundColor: 'gray',
      // vertical: {
      //   lineWidth: 1,
      //   lineColor: '#e1e4e8'
      // },
      horizontal: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    defaultHeaderRowHeight: 60,
    defaultRowHeight: 80,
    timelineHeaderStyle: {
      borderColor: '#e1e4e8',
      borderWidth: 1,
      fontSize: 10,
      fontWeight: 'bold',
      color: 'red',
      backgroundColor: '#EEF1F5'
    },
    taskBar: {
      customRender: (args: any) => {
        const colorLength = barColors.length;
        const { width, height, index, startDate, endDate, taskDays, progress, taskRecord, ganttInstance } = args;
        const container = new VRender.Group({
          width,
          height,
          fill: barColors[index % colorLength],
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        });
        const containerLeft = new VRender.Group({
          height,
          width: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around'
          // fill: 'red'
        });
        container.add(containerLeft);

        const icon0 = new VRender.Image({
          width: 50,
          height: 50,
          image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
          cornerRadius: 25
        });
        containerLeft.add(icon0);

        const containerRight = new VRender.Group({
          height,
          width: width - 60,
          display: 'flex',
          flexDirection: 'column'
          // alignItems: 'left'
        });
        container.add(containerRight);

        const bloggerName = new VRender.Text({
          text: taskRecord.title,
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: 'white',
          maxLineWidth: width - 60,
          boundsPadding: [10, 0, 0, 0]
        });
        containerRight.add(bloggerName);

        const days = new VRender.Text({
          text: `${taskDays}天`,
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'white',
          boundsPadding: [10, 0, 0, 0]
        });
        containerRight.add(days);
        return {
          rootContainer: container,
          renderDefaultBar: true
        };
      },
      labelText: '{title} {progress}%',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 16,
        textAlign: 'right',
        textOverflow: 'ellipsis',
        padding: [0, 20],
        textBaseline: 'bottom'
      },
      barStyle: {
        width: 60,
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
      }
    },
    timelineScales: [
      // {
      //   unit: 'year',
      //   step: 1,
      //   format(date: TYPES.DateFormatArgumentType) {
      //     return `${date.dateIndex}`;
      //   }
      // },

      // {
      //   unit: 'month',
      //   step: 1,
      //   format(date: TYPES.DateFormatArgumentType) {
      //     return date.dateIndex + '月';
      //   }
      // },
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date: TYPES.DateFormatArgumentType) {
          return `Week ${date.dateIndex}`;
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date: TYPES.DateFormatArgumentType) {
          return date.dateIndex;
        }
      }
      // {
      //   unit: 'quarter',
      //   step: 1,
      //   format(date: TYPES.DateFormatArgumentType) {
      //     return '第' + date.dateIndex + '季度';
      //   }
      // }
    ],
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
      visible: 'scrolling',
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
  const tableInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = tableInstance;
  tableInstance.on('scroll', e => {
    console.log('scroll', e);
  });

  tableInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  // bindDebugTool(tableInstance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });
}
