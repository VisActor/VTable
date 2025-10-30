# гантт график Editing Capabilities

в this tutorial, we will introduce how к use the editing capabilities из @visactor/vтаблица-гантт.

**Since the лево side is a complete списоктаблица, Вы можете directly refer к the [editing tutorial](../edit/edit_cell) в списоктаблица.**

# Steps к Use

## 1. Import the Vтаблица editor packвозраст:

### Using NPM Packвозраст

первый, make sure that the Vтаблица library @visactor/vтаблица и the related editor packвозраст @visactor/vтаблица-editors are correctly installed. Вы можете use Следующий commands к install them:

```shell
# Install using npm
npm install @visactor/vтаблица-editors

# Install using yarn
yarn add @visactor/vтаблица-editors
```

Import the обязательный types из editor modules в the код:

```javascript
import { DateInputEditor, InputEditor, списокEditor, TextAreaEditor } от '@visactor/vтаблица-editors';
```

### Using CDN

Вы можете also get the built Vтаблица-Editor files through CDN.

```html
<script src="https://unpkg.com/@visactor/vтаблица-editors@latest/dist/vтаблица-editors.min.js"></script>
<script>
  const inputEditor = новый Vтаблица.editors.InputEditor();
</script>
```

## 2. Create Editors:

The Vтаблица-editors library currently provides four types из editors, including текст ввод box, multi-line текст ввод box, date picker, и отпускание-down список. Вы можете choose the appropriate editor according к your needs. (The отпускание-down список editor is still being optimized и currently loхорошоs quite ugly, haha)

Here is an пример код для creating editors:

```javascript
const inputEditor = новый InputEditor();
const textAreaEditor = новый TextAreaEditor();
const dateInputEditor = новый DateInputEditor();
const списокEditor = новый списокEditor({ values: ['Female', 'Male'] });
```

в the above пример, we created a текст ввод box editor (`InputEditor`), a multi-line текст box editor (`TextAreaEditor`), a date picker editor (`DateInputEditor`), и a отпускание-down список editor (`списокEditor`). Вы можете choose the appropriate editor тип according к your actual needs.

## 3. регистрация и Use Editors:

Before using the editors, you need к регистрация the editor instances к Vтаблица:

```javascript
// import * as Vтаблица от '@visactor/vтаблица';
// регистрация editors к Vтаблица
Vтаблицагантт.Vтаблица.регистрация.editor('имя-editor', inputEditor);
Vтаблицагантт.Vтаблица.регистрация.editor('имя-editor2', inputEditor2);
Vтаблицагантт.Vтаблица.регистрация.editor('textArea-editor', textAreaEditor);
Vтаблицагантт.Vтаблица.регистрация.editor('число-editor', numberEditor);
Vтаблицагантт.Vтаблица.регистрация.editor('date-editor', dateInputEditor);
Vтаблицагантт.Vтаблица.регистрация.editor('список-editor', списокEditor);
```

следующий, specify the editor к be used в the columns configuration:

```javascript
columns: [
  { заголовок: 'имя', поле: 'имя', editor(args)=>{
    if(args.row%2 === 0)
      возврат 'имя-editor';
    else
      возврат 'имя-editor2';
  } },
  { заголовок: 'возраст', поле: 'возраст', editor: 'число-editor' },
  { заголовок: 'пол', поле: 'пол', editor: 'список-editor' },
  { заголовок: 'address', поле: 'address', editor: 'textArea-editor' },
  { заголовок: 'birthday', поле: 'birthDate', editor: 'date-editor' },
]
```

в the лево task список таблица, users can начало editing по `double-Нажатьing` (или other interaction методы) the cell.

# пример

```javascript liveдемонстрация template=vтаблица
let ганттInstance;
// When using, you need к import the plugin packвозраст @visactor/vтаблица-editors
// import * as Vтаблица_editors от '@visactor/vтаблица-editors';
// Normal usвозраст: const input_editor = новый Vтаблица.editors.InputEditor();
// в the official editor, Vтаблица.editors is reимяd к Vтаблица_editors
const input_editor = новый Vтаблица_editors.InputEditor();
const date_input_editor = новый Vтаблица_editors.DateInputEditor();
Vтаблицагантт.Vтаблица.регистрация.editor('inputEditor', input_editor);
Vтаблицагантт.Vтаблица.регистрация.editor('dateEditor', date_input_editor);
const records = [
  {
    id: 1,
    заголовок: 'Task 1',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-07-26',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Task 2',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-31',
    конец: '2024-08-06',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Task 3',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-04',
    конец: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 4,
    заголовок: 'Task 4',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 5,
    заголовок: 'Task 5',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    заголовок: 'Task 6',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-29',
    конец: '2024-08-11',
    progress: 100,
    priority: 'P1'
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 'авто',
    сортировка: true,
    tree: true,
    editor: 'inputEditor'
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 'авто',
    сортировка: true,
    editor: 'dateEditor'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 'авто',
    сортировка: true,
    editor: 'dateEditor'
  }
];
const option = {
  overscrollBehavior: 'никто',
  records,
  taskсписоктаблица: {
    columns,
    таблицаширина: 250,
    minтаблицаширина: 100,
    maxтаблицаширина: 600,
    тема: {
      headerStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: 1,
        fontSize: 18,
        fontWeight: 'bold',
        цвет: 'red',
        bgColor: '#EEF1F5'
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineширина: [1, 0, 1, 0],
        fontSize: 16,
        цвет: '#4D4D4D',
        bgColor: '#FFF'
      }
    }
    //rightFrozenColCount: 1
  },
  frame: {
    outerFrameStyle: {
      borderLineширина: 2,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    verticalSplitLineMoveable: true,
    verticalSplitLineHighlight: {
      lineColor: 'green',
      lineширина: 3
    }
  },
  grid: {
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowвысота: 40,
  rowвысота: 40,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    resizable: true,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title}  complete {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево',
      textOverflow: 'ellipsis'
    },
    barStyle: {
      ширина: 20,
      /** цвет из the task bar */
      barColor: '#ee8800',
      /** цвет из the completed part из the task bar */
      completedBarColor: '#91e8e0',
      /** Corner radius из the task bar */
      cornerRadius: 8,
      /** граница из the task bar */
      borderLineширина: 1,
      /** граница цвет */
      borderColor: 'black'
    }
  },
  timelineHeader: {
    colширина: 100,
    backgroundColor: '#EEF1F5',
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5',
          textStick: true
          // заполнение: [0, 30, 0, 20]
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'white',
          strхорошоeColor: 'black',
          textAlign: 'право',
          textBaseline: 'низ',
          backgroundColor: '#EEF1F5'
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024/8/02',
      scrollToMarkLine: true,
      позиция: 'лево',
      style: {
        lineColor: 'red',
        lineширина: 1
      }
    }
  ],
  rowSeriesNumber: {
    заголовок: 'Row число',
    dragпорядок: true,
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
    видимый: 'scrolling',
    ширина: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
```

If you have пользовательский editing needs, please refer к the complete tutorial Документация: [Editing Tutorial](../edit/edit_cell).

Currently, editing is only supported в the task список таблица. The editing capabilities из the task bar only support dragging the ширина и позиция, и direct editing на the task bar is не yet supported.
