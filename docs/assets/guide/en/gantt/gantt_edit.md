# Gantt Chart Editing Capabilities

In this tutorial, we will introduce how to use the editing capabilities of @visactor/vtable-gantt.

**Since the left side is a complete ListTable, you can directly refer to the [editing tutorial](../edit/edit_cell) in ListTable.**

# Steps to Use

## 1. Import the VTable editor package:

### Using NPM Package

First, make sure that the VTable library @visactor/vtable and the related editor package @visactor/vtable-editors are correctly installed. You can use the following commands to install them:

```shell
# Install using npm
npm install @visactor/vtable-editors

# Install using yarn
yarn add @visactor/vtable-editors
```

Import the required types of editor modules in the code:

```javascript
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
```

### Using CDN

You can also get the built VTable-Editor files through CDN.

```html
<script src="https://unpkg.com/@visactor/vtable-editors@latest/dist/vtable-editors.min.js"></script>
<script>
  const inputEditor = new VTable.editors.InputEditor();
</script>
```

## 2. Create Editors:

The VTable-editors library currently provides four types of editors, including text input box, multi-line text input box, date picker, and drop-down list. You can choose the appropriate editor according to your needs. (The drop-down list editor is still being optimized and currently looks quite ugly, haha)

Here is an example code for creating editors:

```javascript
const inputEditor = new InputEditor();
const textAreaEditor = new TextAreaEditor();
const dateInputEditor = new DateInputEditor();
const listEditor = new ListEditor({ values: ['Female', 'Male'] });
```

In the above example, we created a text input box editor (`InputEditor`), a multi-line text box editor (`TextAreaEditor`), a date picker editor (`DateInputEditor`), and a drop-down list editor (`ListEditor`). You can choose the appropriate editor type according to your actual needs.

## 3. Register and Use Editors:

Before using the editors, you need to register the editor instances to VTable:

```javascript
// import * as VTable from '@visactor/vtable';
// Register editors to VTable
VTableGantt.VTable.register.editor('name-editor', inputEditor);
VTableGantt.VTable.register.editor('name-editor2', inputEditor2);
VTableGantt.VTable.register.editor('textArea-editor', textAreaEditor);
VTableGantt.VTable.register.editor('number-editor', numberEditor);
VTableGantt.VTable.register.editor('date-editor', dateInputEditor);
VTableGantt.VTable.register.editor('list-editor', listEditor);
```

Next, specify the editor to be used in the columns configuration:

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

In the left task list table, users can start editing by `double-clicking` (or other interaction methods) the cell.

# Example

```javascript livedemo template=vtable
let ganttInstance;
// When using, you need to import the plugin package @visactor/vtable-editors
// import * as VTable_editors from '@visactor/vtable-editors';
// Normal usage: const input_editor = new VTable.editors.InputEditor();
// In the official editor, VTable.editors is renamed to VTable_editors
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
      /** Color of the task bar */
      barColor: '#ee8800',
      /** Color of the completed part of the task bar */
      completedBarColor: '#91e8e0',
      /** Corner radius of the task bar */
      cornerRadius: 8,
      /** Border of the task bar */
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

If you have custom editing needs, please refer to the complete tutorial documentation: [Editing Tutorial](../edit/edit_cell).

Currently, editing is only supported in the task list table. The editing capabilities of the task bar only support dragging the width and position, and direct editing on the task bar is not yet supported.
