# Getting Started

In this tutorial, we will introduce how to use @visactor/vtable-gantt to draw a simple Gantt chart.

## Getting @visactor/vtable-gantt

**Please note that @visactor/vtable-gantt is built on @visactor/vtable, so you need to install @visactor/vtable first to use @visactor/vtable-gantt.**

You can get it in the following ways:

### Using NPM Package

First, you need to install it in the root directory of your project using the following commands:

```sh

# Install using npm
npm install @visactor/vtable
npm install @visactor/vtable-gantt

# Install using yarn
yarn add @visactor/vtable
yarn add @visactor/vtable-gantt
```

### Using CDN

You can also get the built vtable-gantt file through CDN.

```html
<script src="https://unpkg.com/@visactor/vtable-gantt/dist/vtable-gantt.min.js"></script>
<script>
  const ganttInstance = new VTableGantt.Gantt(domContainer, option);
</script>
```

If you need to use the related functions of VTable or VRender, such as editing cells or custom rendering, please note that you should use VTableGantt.VTable and VTableGantt.VRender.

To introduce the ability of VTable, such as:

```
// Register icon or editor
VTableGantt.VTable.register.***
// Reference the theme of VTable
VTableGantt.VTable.themes.***
// Reference the custom rendering element of VTable
VTableGantt.VTable.CustomLayout.***
```

To introduce the ability of VRender to achieve custom rendering, such as:

```
// Use the Group element
VTableGantt.VRender.Group()
```

## Importing VTableGantt

### Importing via NPM Package

At the top of your JavaScript file, use `import` to bring in vtable-gantt:

```js
import { Gantt } from '@visactor/vtable-gantt';

const ganttInstance = new Gantt(domContainer, option);
```

### Importing via script tag

By directly adding a `<script>` tag in the HTML file, import the built vtable-gantt file:

```html
<script src="https://unpkg.com/@visactor/vtable-gantt/dist/vtable-gantt.min.js"></script>
<script>
  const ganttInstance = new VTableGantt.Gantt(domContainer, option);
</script>
```

## Drawing a Simple Gantt Chart

Before drawing, we need to prepare a DOM container with width and height for VTableGantt, and this container must be relatively positioned, i.e., its position must be set to 'absolute' or 'relative'.

**Please ensure that the container's width and height values are integers, as VTable's internal logic uses the container's offsetWidth, offsetHeight, clientWidth, and clientHeight properties. If the container's width and height are decimals, it may cause errors in the values taken, potentially leading to table jitter issues.**

```html
<body>
  <div id="tableContainer" style="position: absolute; width: 600px;height:400px;"></div>
</body>
```

Next, we create a `Gantt` instance and pass in the Gantt chart configuration options:

```javascript livedemo template=vtable
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
    //rightFrozenColCount: 1
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
        format(date) {
          return `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          strokeColor: 'black',
          textAlign: 'right',
          textBaseline: 'bottom',
          backgroundColor: '#EEF1F5',
          textStick: true
          // padding: [0, 30, 0, 20]
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

At this point, you have successfully drawn a simple Gantt chart!

I hope this tutorial helps you learn how to use Gantt. Next, you can delve into the various configuration options of vtable-gantt to customize more diverse table effects.
