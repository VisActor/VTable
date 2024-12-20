# 快速上手

在本教程中，我们将介绍如何使用 @visactor/vtable-gantt 绘制一个简单的甘特图。

## 获取 @visactor/vtable-gantt

**需要注意的是 @visactor/vtable-gantt 是基于 @visactor/vtable 构建的，所以你需要先安装 @visactor/vtable 才能使用 @visactor/vtable-gantt。**

你可以通过以下几种方式获取

### 使用 NPM 包

首先，你需要在项目根目录下使用以下命令安装：

```sh

# 使用 npm 安装
npm install @visactor/vtable
npm install @visactor/vtable-gantt

# 使用 yarn 安装
yarn add @visactor/vtable
yarn add @visactor/vtable-gantt
```

### 使用 CDN

你还可以通过 CDN 获取构建好的 vtable-gantt 文件。

```html
<script src="https://unpkg.com/@visactor/vtable-gantt/dist/vtable-gantt.min.js"></script>
<script>
  const ganttInstance = new VTableGantt.Gantt(domContainer, option);
</script>
```

如果需要用到 VTable 或者 VRender 的相关功能如编辑单元格或者自定义渲染，需要注意请使用 VTableGantt.VTable 和 VTableGantt.VRender。

引入 VTable 的能力，如：

```
// 注册图标或编辑器
VTableGantt.VTable.register.***
// 引用VTable的主题
VTableGantt.VTable.themes.***
// 引用VTable的自定义渲染元素
VTableGantt.VTable.CustomLayout.***
```

引入 VRender 的图元来实现自定义渲染，如：

```
// 使用图元Group
VTableGantt.VRender.Group()
```

## 引入 VTableGantt

### 通过 NPM 包引入

在 JavaScript 文件顶部使用 `import` 引入 vtable-gantt：

```js
import { Gantt } from '@visactor/vtable-gantt';

const ganttInstance = new Gantt(domContainer, option);
```

### 使用 script 标签引入

通过直接在 HTML 文件中添加 `<script>` 标签，引入构建好的 vtable-gantt 文件：

```html
<script src="https://unpkg.com/@visactor/vtable-gantt/dist/vtable-gantt.min.js"></script>
<script>
  const ganttInstance = new VTableGantt.Gantt(domContainer, option);
</script>
```

## 绘制一个简单的甘特图

在绘图前我们需要为 VTableGantt 准备一个具备高宽的 DOM 容器，且这个容器可以相对定位，即需要设置 position 为 'absolute' 或者 'relative'。

**请务必保证容器的宽高值为整数，VTable 内部逻辑中会用到容器的 offsetWidth、offsetHeight、clientWidth、clientHeight 属性，如果容器的 width 和 height 为小数会造成取值有误差，可能产生表格抖动问题。**

```html
<body>
  <div id="tableContainer" style="position: absolute; width: 600px;height:400px;"></div>
</body>
```

接下来，我们创建一个 `Gantt` 实例，传入甘特图配置项：

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
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8,
      /** 任务条的边框 */
      borderLineWidth: 1,
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
```

至此，你已经成功绘制出了一个简单的甘特图！

希望这篇教程对你学习如何使用 Gantt 有所帮助。接下来可以深入了解 vtable-gantt 的各种配置选项，定制出更加丰富多样的表格效果。
