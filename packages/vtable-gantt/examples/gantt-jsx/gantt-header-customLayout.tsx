import type { ColumnsDefine } from '@visactor/vtable';
import { register, jsx } from '@visactor/vtable';
import { VGroup, VText, VImage, Group, Text, Image } from '@visactor/vtable/es/vrender';
import { DateInputEditor, InputEditor } from '@visactor/vtable-editors';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { Gantt, tools } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
import type { DateCustomLayoutArgumentType } from '../../src/ts-types';
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
      }
    },
    timelineHeader: {
      scales: [
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'sunday',
          format(date: TYPES.DateFormatArgumentType) {
            return `Week ${date.dateIndex}`;
          },
          customLayout: (args: DateCustomLayoutArgumentType) => {
            const colorLength = barColors.length;
            const { width, height, index, startDate, endDate, days, dateIndex, title, ganttInstance } = args;
            console.log('week', index);
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
                    color: barColors0[dateIndex % colorLength]
                  },
                  {
                    offset: 0.5,
                    color: barColors[dateIndex % colorLength]
                  },
                  {
                    offset: 1,
                    color: barColors0[dateIndex % colorLength]
                  }
                ]
              },
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap'
            });
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
              image:
                '<svg t="1722943462248" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5107" width="200" height="200"><path d="M866.462 137.846H768V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384H374.154V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384h-98.462c-43.323 0-78.769 35.446-78.769 78.77v49.23c0 15.754 13.785 29.539 29.539 29.539h807.384c15.754 0 29.539-13.785 29.539-29.539v-49.23c0-43.324-35.446-78.77-78.77-78.77z m49.23 256H108.308c-15.754 0-29.539 13.785-29.539 29.539v482.461c0 43.323 35.446 78.77 78.77 78.77h708.923c43.323 0 78.769-35.447 78.769-78.77V423.385c0-15.754-13.785-29.539-29.539-29.539zM645.908 580.923L521.846 844.8c-5.908 13.785-19.692 21.662-35.446 21.662-21.662 0-37.415-17.724-37.415-35.447 0-3.938 1.969-9.846 3.938-15.753l104.37-224.493H407.63c-17.723 0-33.477-11.815-33.477-29.538 0-15.754 15.754-29.539 33.477-29.539h204.8c19.692 0 37.415 15.754 37.415 35.446 0 5.908-1.97 9.847-3.938 13.785z" fill="#1296db" p-id="5108"></path></svg>',
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

            const weekNumber = new Text({
              text: `Week ${title}`,
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fill: 'white',
              textAlign: 'right',
              maxLineWidth: width - 60,
              boundsPadding: [10, 0, 0, 0]
            });
            containerRight.add(weekNumber);

            const daysFromText = new Text({
              text: `${tools.formatDate(startDate, 'mm/dd')}-${tools.formatDate(endDate, 'mm/dd')}`,
              fontSize: 13,
              fontFamily: 'sans-serif',
              fill: 'white',
              boundsPadding: [10, 0, 0, 0]
            });
            containerRight.add(daysFromText);
            return {
              rootContainer: container
              //renderDefaultText: true
            };
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date: TYPES.DateFormatArgumentType) {
            return date.dateIndex.toString() + 'th';
          },
          customLayout: (args: any) => {
            const colorLength = barColors.length;
            const { width, height, index, startDate, endDate, days, title, ganttInstance } = args;
            const weekNumberofYear = tools.getWeekNumber(startDate);
            console.log(startDate, weekNumberofYear, index);
            const rootContainer = (
              <VGroup
                attribute={{
                  width: width,
                  height,
                  fill: barColors[weekNumberofYear % colorLength],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <VText
                  attribute={{
                    text: title,
                    fontSize: 18,
                    fontWeight: 'bold',
                    fontFamily: 'sans-serif',
                    fill: 'white',
                    maxLineWidth: width,
                    boundsPadding: [0, 0, 0, 0]
                  }}
                ></VText>
              </VGroup>
            );

            return {
              rootContainer
              //renderDefaultText: true
            };
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
