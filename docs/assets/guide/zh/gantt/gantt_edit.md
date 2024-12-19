# 甘特图编辑能力

在本教程中，我们将介绍如何使用 @visactor/vtable-gantt 的编辑能力。

**因为左侧是一个完整的 ListTable，所以可直接参照在 ListTable 中[编辑教程](../edit/edit_cell)。**

# 使用步骤

## 1. 引用 VTable 的编辑器包：

### 使用 NPM 包

首先，确保已经正确安装了 VTable 库@visactor/vtable 和相关的编辑器包@visactor/vtable-editors。你可以使用以下命令来安装它们：

```shell

# 使用 npm 安装
npm install @visactor/vtable-editors

# 使用 yarn 安装
yarn add @visactor/vtable-editors
```

在代码中引入所需类型的编辑器模块：

```javascript
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
```

### 使用 CDN

你还可以通过 CDN 获取构建好的 VTable-Editor 文件。

```html
<script src="https://unpkg.com/@visactor/vtable-editors@latest/dist/vtable-editors.min.js"></script>
<script>
  const inputEditor = new VTable.editors.InputEditor();
</script>
```

## 2. 创建编辑器：

VTable-ediotrs 库中目前提供了四种编辑器类型，包括文本输入框、多行文本输入框、日期选择器、下拉列表等。你可以根据需要选择合适的编辑器。(下拉列表编辑器效果还在优化中，目前比较丑哈)

以下是创建编辑器的示例代码：

```javascript
const inputEditor = new InputEditor();
const textAreaEditor = new TextAreaEditor();
const dateInputEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['女', '男'] });
```

在上面的示例中，我们创建了一个文本输入框编辑器(`InputEditor`)、一个多行文本框编辑器(`TextAreaEditor`)、 一个日期选择器编辑器(`DateInputEditor`)和一个下拉列表编辑器(`ListEditor`)。你可以根据实际需求选择适合的编辑器类型。

## 3. 注册并使用编辑器：

在使用编辑器前，需要将编辑器实例注册到 VTable 中：

```javascript
// import * as VTable from '@visactor/vtable';
// 注册编辑器到VTable
VTableGantt.VTable.register.editor('name-editor', inputEditor);
VTableGantt.VTable.register.editor('name-editor2', inputEditor2);
VTableGantt.VTable.register.editor('textArea-editor', textAreaEditor);
VTableGantt.VTable.register.editor('number-editor', numberEditor);
VTableGantt.VTable.register.editor('date-editor', dateInputEditor);
VTableGantt.VTable.register.editor('list-editor', listEditor);
```

接下来需要再 columns 配置中指定使用的编辑器：

```javascript
columns: [
  { title: 'name', field: 'name', editor(args)=>{
    if(args.row%2 === 0)
      return 'name-editor';
    else
      return 'name-editor2';
  } },
  { title: 'age', field: 'age', editor: 'number-editor' },
  { title: 'gender', field: 'gender', editor: 'list-editor' },
  { title: 'address', field: 'address', editor: 'textArea-editor' },
  { title: 'birthday', field: 'birthDate', editor: 'date-editor' },
]
```

在左侧任务列表表格中，用户可以通过`双击`（或者其他交互方式）单元格来开始编辑。

# 示例

```javascript livedemo template=vtable
let ganttInstance;
// 使用时需要引入插件包@visactor/vtable-editors
// import * as VTable_editors from '@visactor/vtable-editors';
// 正常使用方式 const input_editor = new VTable.editors.InputEditor();
// 官网编辑器中将 VTable.editors重命名成了VTable_editors
const input_editor = new VTable_editors.InputEditor();
const date_input_editor = new VTable_editors.DateInputEditor();
VTableGantt.VTable.register.editor('inputEditor', input_editor);
VTableGantt.VTable.register.editor('dateEditor', date_input_editor);
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
    start: '2024-07-31',
    end: '2024-08-06',
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
    editor: 'inputEditor'
  },
  {
    field: 'start',
    title: 'start',
    width: 'auto',
    sort: true,
    editor: 'dateEditor'
  },
  {
    field: 'end',
    title: 'end',
    width: 'auto',
    sort: true,
    editor: 'dateEditor'
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

如果有自定义编辑的需求，请参考完整的教程文档：[编辑教程](../edit/edit_cell)。

目前，编辑只支持在任务列表表格中进行。任务条的编辑能力只支持拖拽宽度和拖拽位置，目前还不支持直接在任务条上进行编辑。
