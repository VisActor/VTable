# Gantt Chart Custom Rendering Capabilities

In this tutorial, we will introduce how to use the custom capabilities of @visactor/vtable-gantt to draw a Gantt chart.

## Preparation

Import custom graphic elements. Since the installed @visactor/vtable already includes the graphic element types of the VRender library, we can import them directly.

```javascript
import { Group, Image, Text, Tag } from '@visactor/vtable/es/vrender';
or;
import * as VRender from '@visactor/vtable/es/vrender';
```

## Custom Rendering of Left Task Information Table Cells

**Since the left side is a complete ListTable, you can directly refer to the [custom rendering tutorial](../custom_define/custom_layout) in ListTable.**

## Custom Rendering of Date Header

The specific configuration corresponds to the field [timelineHeader.scales.customLayout](<../../option/Gantt#timelineHeader.scales(Array<ITimelineScale>).customLayout>)

customLayout is a custom function:

```
 (args: TaskBarCustomLayoutArgumentType) => ITaskBarCustomLayoutObj;
```

### Parameter description

The function parameters are provided by the Gantt component and include the dimensions of the rendered task bar and date information. Specifically:

```
export type DateCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  /** The current date belongs to the nth position of the date scale. For example, the fourth quarter in a quarterly date returns 4. */
  dateIndex: number;
  title: string;
  startDate: Date;
  endDate: Date;
  days: number;
  ganttInstance: Gantt;
};
```

### returned value specification

The return value needs to include a VRender Group container object. This rootContainer should contain the specific content structure you want to display in the date header.

```
export type IDateCustomLayoutObj = {
  rootContainer: Group;
  renderDefaultText?: boolean; // 是否渲染正常非自定义的文本，默认false
};
```

Each VRender graphic element can be understood as a DOM tree structure, where each element has a parent container that can contain multiple child elements. Common graphic element types and their configurations can be found in the VRender [configuration documentation](https://visactor.io/vrender/option):

 <div style="width: 40%; text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-guide-vrender-graphic-overview.png" />
  <p>VRender Element Type</p>
</div>

### demo

You can refer to the demo:

```javascript livedemo template=vtable
// import * as VRender from '@visactor/vtable/es/vrender';

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const tools = VTableGantt.tools;

let ganttInstance;

const records = [
  {
    id: 1,
    title: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-24',
    end: '2024-07-26',
    progress: 31,
    priority: 'P0'
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
    id: 4,
    title: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 5,
    title: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    title: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    start: '2024-07-29',
    end: '2024-08-11',
    progress: 100,
    priority: 'P1'
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
      /** Task bar color */
      barColor: '#ee8800',
      /** Completed part of the task bar color */
      completedBarColor: '#91e8e0',
      /** Task bar corner radius */
      cornerRadius: 8,
      /** Task bar border */
      borderLineWidth: 1,
      /** Border color */
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
        rowHeight: 60,
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        customLayout: args => {
          const colorLength = barColors.length;
          const { width, height, index, startDate, endDate, days, dateIndex, title, ganttInstance } = args;
          console.log('week', index);
          const container = new VTableGantt.VRender.Group({
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
          const containerLeft = new VTableGantt.VRender.Group({
            height,
            width: 60,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around'
            // fill: 'red'
          });
          container.add(containerLeft);

          const avatar = new VTableGantt.VRender.Image({
            width: 50,
            height: 50,
            image:
              '<svg t="1722943462248" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5107" width="200" height="200"><path d="M866.462 137.846H768V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384H374.154V98.462c0-31.508-25.6-59.077-59.077-59.077-31.508 0-59.077 25.6-59.077 59.077v39.384h-98.462c-43.323 0-78.769 35.446-78.769 78.77v49.23c0 15.754 13.785 29.539 29.539 29.539h807.384c15.754 0 29.539-13.785 29.539-29.539v-49.23c0-43.324-35.446-78.77-78.77-78.77z m49.23 256H108.308c-15.754 0-29.539 13.785-29.539 29.539v482.461c0 43.323 35.446 78.77 78.77 78.77h708.923c43.323 0 78.769-35.447 78.769-78.77V423.385c0-15.754-13.785-29.539-29.539-29.539zM645.908 580.923L521.846 844.8c-5.908 13.785-19.692 21.662-35.446 21.662-21.662 0-37.415-17.724-37.415-35.447 0-3.938 1.969-9.846 3.938-15.753l104.37-224.493H407.63c-17.723 0-33.477-11.815-33.477-29.538 0-15.754 15.754-29.539 33.477-29.539h204.8c19.692 0 37.415 15.754 37.415 35.446 0 5.908-1.97 9.847-3.938 13.785z" fill="#1296db" p-id="5108"></path></svg>',
            cornerRadius: 25
          });
          containerLeft.add(avatar);

          const containerCenter = new VTableGantt.VRender.Group({
            height,
            width: width - 60,
            display: 'flex',
            flexDirection: 'column'
            // alignItems: 'left'
          });
          container.add(containerCenter);

          const weekNumber = new VTableGantt.VRender.Text({
            text: `Week ${title}`,
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            fill: 'white',
            textAlign: 'right',
            maxLineWidth: width - 60,
            boundsPadding: [10, 0, 0, 0]
          });
          containerCenter.add(weekNumber);

          const daysFromText = new VTableGantt.VRender.Text({
            text: `${tools.formatDate(startDate, 'mm/dd')}-${tools.formatDate(endDate, 'mm/dd')}`,
            fontSize: 13,
            fontFamily: 'sans-serif',
            fill: 'white',
            boundsPadding: [10, 0, 0, 0]
          });
          containerCenter.add(daysFromText);
          return {
            rootContainer: container
            // renderDefaultText: true
          };
        }
      },
      {
        unit: 'day',
        step: 1,
        rowHeight: 30,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          padding: 5,
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
      date: '2024/8/02',
      scrollToMarkLine: true,
      position: 'left',
      style: {
        lineColor: 'red',
        lineWidth: 1
      }
    }
  ],
  rowSeriesNumber: {
    title: 'Row Number',
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
ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;
```

## Custom Rendering of Task Bar

The specific configuration corresponds to the field [taskBar.customLayout](../../option/Gantt#taskBar.customLayout)

customLayout is a custom function:

```
 (args: TaskBarCustomLayoutArgumentType) => ITaskBarCustomLayoutObj;
```

### Parameter description

The function parameters are provided by the Gantt component and include the dimensions of the rendered task bar and task bar data information. Specifically:

```
export type TaskBarCustomLayoutArgumentType = {
  width: number;
  height: number;
  index: number;
  startDate: Date;
  endDate: Date;
  taskDays: number;
  progress: number;
  taskRecord: any;
  ganttInstance: Gantt;
};
```

### Return Value Description

The return value needs to include a VRender Group container object. This rootContainer should contain the specific content structure you want to display in the task bar.

```
export type ITaskBarCustomLayoutObj = {
  rootContainer: Group;
  renderDefaultBar?: boolean; // default false
  renderDefaultResizeIcon?: boolean; // default false
  renderDefaultText?: boolean; // default false
};
```

Each VRender graphic element can be understood as a DOM tree structure, where each element has a parent container that can contain multiple child elements. Common graphic element types and their configurations can be found in the VRender [configuration documentation](https://visactor.io/vrender/option):

 <div style="width: 40%; text-align: center;">
  <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-guide-vrender-graphic-overview.png" />
  <p>VRender Element Type</p>
</div>

### Custom Graphic Element Event Listeners

VRender graphic elements support event listeners, as shown in the following code logic:

```
      const avatar = new VTableGantt.VRender.Image({
        width: 50,
        height: 50,
        image: taskRecord.avatar,
        cornerRadius: 25
      });
      // 鼠标悬浮到头像上时，显示tooltip 显示负责人名字
      avatar.addEventListener('mouseenter',event => {
        console.log('enter');
        const containerRect = document.getElementById(CONTAINER_ID).getBoundingClientRect();
        debugger;
        const targetX=event.target.globalAABBBounds.x1;
        const targetY=event.target.globalAABBBounds.y1;
        showTooltip([taskRecord.developer],ganttInstance.taskTableWidth+ targetX+containerRect.left, targetY+containerRect.top+50);
      });
```

### demo

You can refer to the demo:

```javascript livedemo template=vtable
// import * as VRender from '@visactor/vtable/es/vrender';

const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#cccccc', '#e59a9c', '#d9d1a5', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#7f7f7f', '#d62728', '#bcbd22', '#9467bd'];
const tools = VTableGantt.tools;

let ganttInstance;

const records = [
  {
    id: 1,
    title: 'Task 1',
    developer: 'bear.xiong',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg',
    start: '2024-07-24',
    end: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    title: 'Task 2',
    developer: 'wolf.lang',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg',
    start: '07/30/2024',
    end: '08/04/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 3',
    developer: 'rabbit.tu',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg',
    start: '2024-08-04',
    end: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 1,
    title: 'Task 4',
    developer: 'cat.mao',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    title: 'Task 5',
    developer: 'bird.niao',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bird.jpeg',
    start: '2024-07-26',
    end: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    title: 'Task 6',
    developer: 'flower.hua',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg',
    start: '2024-07-29',
    end: '2024-08-11',
    progress: 100,
    priority: 'P1'
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
  rowHeight: 100,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    barStyle: {
      cornerRadius: 20
    },
    customLayout: args => {
      const colorLength = barColors.length;
      const { width, height, index, startDate, endDate, taskDays, progress, taskRecord, ganttInstance } = args;
      const container = new VTableGantt.VRender.Group({
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
      const containerLeft = new VTableGantt.VRender.Group({
        height,
        width: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
        // fill: 'red'
      });
      container.add(containerLeft);

      const avatar = new VTableGantt.VRender.Image({
        width: 50,
        height: 50,
        image: taskRecord.avatar,
        cornerRadius: 25
      });
      containerLeft.add(avatar);

      // 鼠标悬浮时，显示tooltip 显示负责人名字
      avatar.addEventListener('mouseenter', event => {
        console.log('enter');
        const containerRect = document.getElementById(CONTAINER_ID).getBoundingClientRect();
        debugger;
        const targetX = event.target.globalAABBBounds.x1;
        const targetY = event.target.globalAABBBounds.y1;
        showTooltip(
          [taskRecord.developer],
          ganttInstance.taskTableWidth + targetX + containerRect.left,
          targetY + containerRect.top + 50
        );
      });
      avatar.addEventListener('mouseleave', event => {
        console.log('leave');
        hideTooltip();
      });
      const containerCenter = new VTableGantt.VRender.Group({
        height,
        width: (width - 60) / 2,
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'left'
      });
      container.add(containerCenter);

      const title = new VTableGantt.VRender.Text({
        text: taskRecord.title,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: 'white',
        maxLineWidth: (width - 60) / 2,
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(title);

      const days = new VTableGantt.VRender.Text({
        text: `${taskDays}天`,
        fontSize: 13,
        fontFamily: 'sans-serif',
        fill: 'white',
        boundsPadding: [10, 0, 0, 0]
      });
      containerCenter.add(days);

      if (width >= 120) {
        const containerRight = new VTableGantt.VRender.Group({
          height,
          width: (width - 60) / 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center' // 垂直方向居中对齐
        });
        container.add(containerRight);

        const dateRange = new VTableGantt.VRender.Text({
          text: `${tools.formatDate(new Date(taskRecord.start), 'mm/dd')}-${tools.formatDate(
            new Date(taskRecord.end),
            'mm/dd'
          )}`,
          fontSize: 16,
          fontFamily: 'sans-serif',
          fill: 'white',
          alignSelf: 'flex-end',
          maxLineWidth: (width - 60) / 2,
          boundsPadding: [0, 10, 0, 0]
        });
        containerRight.add(dateRange);
      }
      return {
        rootContainer: container
        // renderDefaultBar: true
        // renderDefaultText: true
      };
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
        rowHeight: 40,
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        style: {
          textStick: true,
          fontSize: 20,
          padding: 5,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5'
        }
      },
      {
        unit: 'day',
        step: 1,
        rowHeight: 40,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          padding: 5,
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
      date: '2024/8/02',
      scrollToMarkLine: true,
      position: 'left',
      style: {
        lineColor: 'red',
        lineWidth: 1
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
ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;
ganttInstance.on('scroll', event => {
  hideTooltip();
});

const popup = document.createElement('div');
Object.assign(popup.style, {
  position: 'fixed',
  width: '300px',
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
});
function showTooltip(infoList, x, y) {
  popup.innerHTML = '';
  popup.id = 'popup';
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = 'Developer Information:';
  heading.style.margin = '0px';
  popup.appendChild(heading);
  for (let i = 0; i < infoList.length; i++) {
    const info = infoList[i];
    const info1 = document.createElement('p');
    info1.textContent = info;
    popup.appendChild(info1);
  }
  // 将弹出框添加到文档主体中
  document.body.appendChild(popup);
}

function hideTooltip() {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup);
  }
}
```
