import type { ColumnsDefine } from '@visactor/vtable';
import { register } from '@visactor/vtable';
import { Group, Image, Text } from '@visactor/vtable/es/vrender';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const date_input_editor = new DateInputEditor({});
const input_editor = new InputEditor({});
register.editor('input', input_editor);
register.editor('date-input', date_input_editor);
const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
export function createTable() {
  const records0 = [
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
      priority: 'P0',
      type: 'milestone'
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
    }
  ];

  const records = [];
  for (let i = 0; i < 100; i++) {
    records.push(...records0);
  }
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
      tableWidth: 400,
      minTableWidth: 100,
      maxTableWidth: 600,
      theme: {
        headerStyle: {
          borderColor: '#e1e4e8',
          borderLineWidth: 1,
          fontSize: 18,
          fontWeight: 'bold',
          color: 'red'
          // bgColor: '#EEF1F5'
        },
        bodyStyle: {
          borderColor: '#e1e4e8',
          borderLineWidth: [1, 0, 1, 0],
          fontSize: 16,
          color: '#4D4D4D',
          bgColor: '#FFF'
        }
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
      // backgroundColor: 'gray',
      // vertical: {
      //   lineWidth: 1,
      //   lineColor: '#e1e4e8'
      // },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    headerRowHeight: 60,
    rowHeight: 80,
    taskBar: {
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress',
      customLayout: (args: any) => {
        const colorLength = barColors.length;
        const { width, height, index, startDate, endDate, taskDays, progress, taskRecord, ganttInstance } = args;

        const container = new Group({
          width,
          height,
          fill: {
            gradient: 'linear',
            x0: 0,
            y0: 0,
            x1: 1,
            y1: 0,
            stops: [
              {
                offset: 0,
                color: barColors0[index % colorLength]
              },
              {
                offset: 0.5,
                color: barColors[index % colorLength]
              },
              {
                offset: 1,
                color: barColors0[index % colorLength]
              }
            ]
          },
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        });
        if (taskRecord.type === 'milestone') {
          return {
            rootContainer: undefined,
            renderDefaultBar: true
          };
        }
        const containerLeft = new Group({
          height,
          width: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around'
          // fill: 'red'
        });
        container.add(containerLeft);

        const icon0 = new Image({
          width: 50,
          height: 50,
          image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
          cornerRadius: 25
        });
        containerLeft.add(icon0);

        const containerRight = new Group({
          height,
          width: width - 60,
          display: 'flex',
          flexDirection: 'column'
          // alignItems: 'left'
        });
        container.add(containerRight);

        const bloggerName = new Text({
          text: taskRecord.title,
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: 'white',
          maxLineWidth: width - 60,
          boundsPadding: [10, 0, 0, 0]
        });
        containerRight.add(bloggerName);

        const days = new Text({
          text: `${taskDays}天`,
          fontSize: 13,
          fontFamily: 'sans-serif',
          fill: 'white',
          boundsPadding: [10, 0, 0, 0]
        });
        containerRight.add(days);
        return {
          rootContainer: container
          // renderDefaultBar: true
          // renderDefaultText: true
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
      },
      milestoneStyle: {
        width: 20
      }
    },
    timelineHeader: {
      backgroundColor: '#EEF1F5',
      colWidth: 50,
      verticalLine: {
        lineColor: 'red',
        lineWidth: 1,
        lineDash: [4, 2]
      },
      horizontalLine: {
        lineColor: 'green',
        lineWidth: 1,
        lineDash: [4, 2]
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
      visible: 'focus',
      width: 6,
      scrollSliderCornerRadius: 2,
      scrollSliderColor: '#5cb85c'
    }
  };
  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.on('scroll', e => {
    console.log('scroll', e);
  });

  ganttInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}
