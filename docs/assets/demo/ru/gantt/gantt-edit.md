---
категория: примеры
группа: гантт
заголовок: гантт график данные Editing
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-edit-preview.gif
ссылка: гантт/гантт_edit
опция: гантт#taskсписоктаблица.columns
---

# гантт график данные Editing

This пример демонстрацияnstrates the usвозраст из данные editing в the гантт график. Currently, editing is only supported для the лево task information таблица, и the право гантт график does не support editing yet. для specific usвозраст, please refer к the tutorial: [гантт график данные Editing](../../guide/гантт/гантт_edit)

## Key Configuration

- `гантт`
- `taskсписоктаблица` configures the лево task information таблица
- `Vтаблица.регистрация.editor` регистрацияs the editor
- `editor` sets the регистрацияed editor имя

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
// 使用时需要引入插件包@visactor/vтаблица-editors
// import * as Vтаблица_editors от '@visactor/vтаблица-editors';
// 正常使用方式 const input_editor = новый Vтаблица.editors.InputEditor();
// 官网编辑器中将 Vтаблица.editors重命名成了Vтаблица_editors
const input_editor = новый Vтаблица_editors.InputEditor();
const date_input_editor = новый Vтаблица_editors.DateInputEditor();
Vтаблицагантт.Vтаблица.регистрация.editor('ввод', input_editor);
Vтаблицагантт.Vтаблица.регистрация.editor('date-ввод', date_input_editor);
let ганттInstance;
const records = [
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-15',
    progress: 31,
    priority: 'P0',
    children: [
      {
        id: 2,
        заголовок: 'Project Feature Review',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-07-24',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-25',
        конец: '2024-07-26',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 3,
        заголовок: 'Project Create',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-27',
        конец: '2024-07-26',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 3,
        заголовок: 'Develop feature 1',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-08-01',
        конец: '2024-08-15',
        progress: 0,
        priority: 'P1'
      }
    ]
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-01',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 100,
    priority: 'P1',
    children: [
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-08-01',
        конец: '2024-08-01',
        progress: 90,
        priority: 'P0'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-30',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024.07.26',
        конец: '2024.07.08',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '07.24.2024',
        конец: '08.04.2024',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-16',
        конец: '2024-07-18',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-08-09',
        конец: '2024-09-11',
        progress: 100,
        priority: 'P1'
      }
    ]
  },

  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-26',
    конец: '2024-07-28',
    progress: 60,
    priority: 'P0',
    children: [
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1',
        children: [
          {
            id: 1,
            заголовок: 'Software Development',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-24',
            конец: '2024-08-04',
            progress: 31,
            priority: 'P0'
          },
          {
            id: 2,
            заголовок: 'Scope',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-26',
            конец: '2024-07-28',
            progress: 60,
            priority: 'P0'
          },
          {
            id: 3,
            заголовок: 'Determine project scope',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-29',
            конец: '2024-07-31',
            progress: 100,
            priority: 'P1'
          }
        ]
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0',
        children: [
          {
            id: 1,
            заголовок: 'Software Development',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-24',
            конец: '2024-08-04',
            progress: 31,
            priority: 'P0'
          },
          {
            id: 2,
            заголовок: 'Scope',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-06',
            конец: '2024-07-08',
            progress: 60,
            priority: 'P0'
          },
          {
            id: 3,
            заголовок: 'Determine project scope',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-29',
            конец: '2024-07-31',
            progress: 100,
            priority: 'P1'
          }
        ]
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-26',
        конец: '2024-07-28',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1',
        children: [
          {
            id: 1,
            заголовок: 'Software Development',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-24',
            конец: '2024-08-04',
            progress: 31,
            priority: 'P0'
          },
          {
            id: 2,
            заголовок: 'Scope',
            developer: 'liufangfang.jane@bytedance.com',
            начало: '2024-07-06',
            конец: '2024-07-08',
            progress: 60,
            priority: 'P0'
          }
        ]
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-26',
        конец: '2024-07-28',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1'
      }
    ]
  },

  {
    id: 3,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-29',
    конец: '2024-07-31',
    progress: 100,
    priority: 'P1',
    children: [
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-23',
        конец: '2024-07-28',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-30',
        конец: '2024-08-14',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 60,
        priority: 'P0'
      }
    ]
  },
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 31,
    priority: 'P0',
    children: [
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-08-04',
        конец: '2024-08-04',
        progress: 90,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '07/24/2024',
        конец: '08/04/2024',
        progress: 60,
        priority: 'P0'
      }
    ]
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-27',
    конец: '2024-07-28',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-29',
    конец: '2024-07-31',
    progress: 100,
    priority: 'P1',
    children: [
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '07.24.2024',
        конец: '08.04.2024',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-26',
        конец: '2024-07-28',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-08-09',
        конец: '2024-09-11',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-26',
        конец: '2024-07-28',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-26',
        конец: '2024-07-28',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1'
      }
    ]
  },
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 31,
    priority: 'P0',
    children: [
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 1,
        заголовок: 'Software Development',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-24',
        конец: '2024-08-04',
        progress: 31,
        priority: 'P0'
      },
      {
        id: 2,
        заголовок: 'Scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024.07.06',
        конец: '2024.07.08',
        progress: 60,
        priority: 'P0'
      },
      {
        id: 3,
        заголовок: 'Determine project scope',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024-07-29',
        конец: '2024-07-31',
        progress: 100,
        priority: 'P1'
      }
    ]
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 'авто',
    сортировка: true,
    tree: true,
    editor: 'ввод'
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 'авто',
    сортировка: true,
    editor: 'date-ввод'
  },
  {
    поле: 'priority',
    заголовок: 'priority',
    ширина: 'авто',
    сортировка: true,
    editor: 'ввод'
  },
  {
    поле: 'progress',
    заголовок: 'progress',
    ширина: 'авто',
    сортировка: true,
    headerStyle: {
      borderColor: '#e1e4e8'
    },
    style: {
      borderColor: '#e1e4e8',
      цвет: 'green'
    },
    editor: 'ввод'
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
    // backgroundColor: 'gray',
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
    // resizable: false,
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)'
    },
    labelText: '{title} {progress}%',
    labelTextStyle: {
      // заполнение: 2,
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево',
      textOverflow: 'ellipsis'
    },
    barStyle: {
      ширина: 20,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8,
      /** 任务条的边框 */
      borderLineширина: 1,
      /** 边框颜色 */
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
      date: '2024-07-28',
      style: {
        lineширина: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-08-17',
      style: {
        lineширина: 2,
        lineColor: 'red',
        lineDash: [8, 4]
      }
    }
  ],
  rowSeriesNumber: {
    заголовок: '行号',
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
