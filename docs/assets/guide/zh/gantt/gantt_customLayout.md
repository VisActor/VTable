# 甘特图自定义渲染能力

在本教程中，我们将介绍如何使用 @visactor/vtable-gantt 的自定义能力绘制甘特图。

**因为左侧是一个完整的ListTable，所以可直接参照在ListTable中[自定义渲染教程](https://visactor.io/vtable/guide/custom_define/custom_layout)。**

## 准备工作

导入自定义图元内容，因为安装的@visactor/vtable已经包含了渲染引擎VRender库的图元类型，我们可以直接从中导入。

```javascript
import { Group, Image, Text,Tag } from '@visactor/vtable/es/vrender';
or
import * as VRender from '@visactor/vtable/es/vrender';
```

## 自定义渲染日期表头

具体配置对应的字段[timelineHeader.scales.customLayout](../../option/Gantt#timelineHeader.scales(Array<ITimelineScale>).customLayout)


```javascript livedemo template=vtable

// import * as VRender from '@visactor/vtable/es/vrender';

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const tools=VTableGantt.tools;

let tableInstance;

const records = [
  {
    id: 1,
    title: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-24',
    end: '2024-07-26',
    progress: 31,
    priority: 'P0',
  },
  {
    id: 2,
    title: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    start: '07/24/2024',
    end: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-04',
    end: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    title: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    title: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-29',
    end: '2024-08-11',
    progress: 100,
    priority: 'P1',
  }
];

const columns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    sort: true,
    tree: true,
    editor: 'input'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  }
];
const option = {
  overscrollBehavior: 'none',
  records,
  taskListTable: {
    columns,
    tableWidth: 250,
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
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineWidth: 3
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 40,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title}  complete {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left',
      textOverflow: 'ellipsis'
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
    }
  },
  timelineHeader: {
    colWidth: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        rowHeight:60,
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        customLayout:(args)=>{
            const colorLength = barColors.length;
            const { width, height, index, startDate, endDate, days, dateIndex, title, ganttInstance } = args;
            console.log('week', index);
            const container = new VRender.Group({
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
              image:
                '<svg t="1722943462248" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5107" width="200" height="200"><path d="M866.462 137.846H768V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384H374.154V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384h-98.462c-43.323 0-78.769 35.446-78.769 78.77v49.23c0 15.754 13.785 29.539 29.539 29.539h807.384c15.754 0 29.539-13.785 29.539-29.539v-49.23c0-43.324-35.446-78.77-78.77-78.77z m49.23 256H108.308c-15.754 0-29.539 13.785-29.539 29.539v482.461c0 43.323 35.446 78.77 78.77 78.77h708.923c43.323 0 78.769-35.447 78.769-78.77V423.385c0-15.754-13.785-29.539-29.539-29.539zM645.908 580.923L521.846 844.8c-5.908 13.785-19.692 21.662-35.446 21.662-21.662 0-37.415-17.724-37.415-35.447 0-3.938 1.969-9.846 3.938-15.753l104.37-224.493H407.63c-17.723 0-33.477-11.815-33.477-29.538 0-15.754 15.754-29.539 33.477-29.539h204.8c19.692 0 37.415 15.754 37.415 35.446 0 5.908-1.97 9.847-3.938 13.785z" fill="#1296db" p-id="5108"></path></svg>',
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

            const weekNumber = new VRender.Text({
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

            const daysFromText = new VRender.Text({
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
        rowHeight:30,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          padding:5,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      "date": "2024/8/02",
      "scrollToMarkLine": true,
      "position": "left",
      "style": {
          "lineColor": "red",
          "lineWidth": 1
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
tableInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```

## 自定义渲染任务条taskBar

具体配置对应的字段[timelineHeader.scales.customLayout](../../option/Gantt#timelineHeader.scales(Array<ITimelineScale>).customLayout)


```javascript livedemo template=vtable

// import * as VRender from '@visactor/vtable/es/vrender';

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const tools=VTableGantt.tools;

let tableInstance;

const records = [
  {
    id: 1,
    title: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-24',
    end: '2024-07-26',
    progress: 31,
    priority: 'P0',
  },
  {
    id: 2,
    title: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    start: '07/24/2024',
    end: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-08-04',
    end: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    title: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    title: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-29',
    end: '2024-08-11',
    progress: 100,
    priority: 'P1',
  }
];

const columns = [
  {
    field: 'title',
    title: 'title',
    width: 'auto',
    sort: true,
    tree: true,
    editor: 'input'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'date-input'
  }
];
const option = {
  overscrollBehavior: 'none',
  records,
  taskListTable: {
    columns,
    tableWidth: 250,
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
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineWidth: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineWidth: 3
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 40,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title}  complete {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'left',
      textOverflow: 'ellipsis'
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
    }
  },
  timelineHeader: {
    colWidth: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        rowHeight:60,
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        customLayout:(args)=>{
            const colorLength = barColors.length;
            const { width, height, index, startDate, endDate, days, dateIndex, title, ganttInstance } = args;
            console.log('week', index);
            const container = new VRender.Group({
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
              image:
                '<svg t="1722943462248" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5107" width="200" height="200"><path d="M866.462 137.846H768V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384H374.154V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384h-98.462c-43.323 0-78.769 35.446-78.769 78.77v49.23c0 15.754 13.785 29.539 29.539 29.539h807.384c15.754 0 29.539-13.785 29.539-29.539v-49.23c0-43.324-35.446-78.77-78.77-78.77z m49.23 256H108.308c-15.754 0-29.539 13.785-29.539 29.539v482.461c0 43.323 35.446 78.77 78.77 78.77h708.923c43.323 0 78.769-35.447 78.769-78.77V423.385c0-15.754-13.785-29.539-29.539-29.539zM645.908 580.923L521.846 844.8c-5.908 13.785-19.692 21.662-35.446 21.662-21.662 0-37.415-17.724-37.415-35.447 0-3.938 1.969-9.846 3.938-15.753l104.37-224.493H407.63c-17.723 0-33.477-11.815-33.477-29.538 0-15.754 15.754-29.539 33.477-29.539h204.8c19.692 0 37.415 15.754 37.415 35.446 0 5.908-1.97 9.847-3.938 13.785z" fill="#1296db" p-id="5108"></path></svg>',
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

            const weekNumber = new VRender.Text({
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

            const daysFromText = new VRender.Text({
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
        rowHeight:30,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          padding:5,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      "date": "2024/8/02",
      "scrollToMarkLine": true,
      "position": "left",
      "style": {
          "lineColor": "red",
          "lineWidth": 1
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
tableInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
