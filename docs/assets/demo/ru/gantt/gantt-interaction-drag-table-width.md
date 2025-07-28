---
категория: примеры
группа: гантт
заголовок: гантт график Interaction - перетаскивание таблица ширина
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-interaction-перетаскивание-таблица-ширина-preview.gif
ссылка: гантт/introduction
опция: гантт#frame.verticalSplitLineMoveable
---

# гантт график Interaction - перетаскивание таблица ширина

This пример демонстрацияnstrates how к make the ширина из the лево task information таблица в the гантт график draggable. When the configuration item `frame.verticalSplitLineMoveable` is set к `true`, the vertical split line из the лево task information таблица can be dragged. If you want к highlight the цвет из the vertical split line when hovering, Вы можете configure `frame.verticalSplitLineHighlight`. к limit the range из the перетаскивание ширина, Вы можете configure `списоктаблица.minширина` и `списоктаблица.maxширина`.

## Key Configuration

-`гантт`

-`frame.verticalSplitLineMoveable` Whether the vertical split line is movable

-`frame.verticalSplitLineHighlight` Highlight line style when adjusting column ширина

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
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
        начало: '2024/07/25',
        конец: '2024/07/26',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 3,
        заголовок: 'Project Create',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024/07/27',
        конец: '2024/07/26',
        progress: 100,
        priority: 'P1'
      },
      {
        id: 3,
        заголовок: 'Develop feature 1',
        developer: 'liufangfang.jane@bytedance.com',
        начало: '2024/08/01',
        конец: '2024/08/15',
        progress: 0,
        priority: 'P1'
      }
    ]
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07/24/2024',
    конец: '08/04/2024',
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
        начало: '2024/07/24',
        конец: '2024/08/04',
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
    maxтаблицаширина: 600
  },
  grid: {
    verticalLine: {
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
    }
  },
  frame: {
    verticalSplitLineMoveable: true
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
