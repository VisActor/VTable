---
категория: примеры
группа: гантт
заголовок: гантт Dependency Link Line
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-dependency-link-line.gif
ссылка: гантт/introduction
опция: гантт#taskBar
---

# гантт Dependency Link Line

гантт график dependency lines are lines used в the гантт график к represent the dependency relationships between tasks. They can help users better understand the relationships between tasks и help users сортировка и schedule tasks.

## Key Configuration

- `гантт`
- `гантт#dependency.links` configures the данные из the dependencies between task bars
- `гантт#dependency.linkLineStyle` configures the style из the dependency line
- `гантт#dependency.linkLineSelectedStyle` configures the style из the dependency line when it is selected

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
let ганттInstance;
const records = [
  {
    id: 1,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-15',
    конец: '2024-07-16',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-16',
    конец: '2024-07-17',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-18',
    конец: '2024-07-19',
    progress: 90,
    priority: 'P0'
  },
  {
    id: 4,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024/07/17',
    конец: '2024/07/18',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 5,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07/19/2024',
    конец: '07/20/2024',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 7,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 8,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024.07.06',
    конец: '2024.07.08',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 9,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024/07/09',
    конец: '2024/07/11',
    progress: 100,
    priority: 'P1'
  },
  {
    id: 10,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '07.24.2024',
    конец: '08.04.2024',
    progress: 31,
    priority: 'P0'
  },

  {
    id: 11,
    заголовок: 'Software Development',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-24',
    конец: '2024-08-04',
    progress: 31,
    priority: 'P0'
  },
  {
    id: 12,
    заголовок: 'Scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-06',
    конец: '2024-07-08',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 13,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-09',
    конец: '2024-07-11',
    progress: 100,
    priority: 'P1'
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: 'title',
    ширина: 'авто',
    tree: true
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 'авто',
    editor: 'date-ввод'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 'авто',
    editor: 'date-ввод'
  },
  {
    поле: 'priority',
    заголовок: 'priority',
    ширина: 'авто',
    editor: 'ввод'
  },
  {
    поле: 'progress',
    заголовок: 'progress',
    ширина: 'авто',
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
  records,
  taskсписоктаблица: {
    columns: columns,
    таблицаширина: 400,
    minтаблицаширина: 100,
    maxтаблицаширина: 600
  },
  dependency: {
    links: [
      {
        тип: Vтаблицагантт.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: 1,
        linkedToTaskKey: 2
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.StartToFinish,
        linkedFromTaskKey: 2,
        linkedToTaskKey: 3
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 3,
        linkedToTaskKey: 4
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.FinishToFinish,
        linkedFromTaskKey: 4,
        linkedToTaskKey: 5
      }
    ],
    // linkSelecтаблица: false,
    linkSelectedLineStyle: {
      shadowBlur: 5, //阴影宽度
      shadowColor: 'red',
      lineColor: 'red',
      lineширина: 1
    }
  },
  frame: {
    verticalSplitLineMoveable: true,
    outerFrameStyle: {
      borderLineширина: 2,
      borderColor: 'red',
      cornerRadius: 8
    },
    verticalSplitLine: {
      lineширина: 3,
      lineColor: '#e1e4e8'
    },
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
  headerRowвысота: 60,
  rowвысота: 40,

  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    labelText: '{title} {progress}%',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево'
    },
    barStyle: {
      ширина: 20,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 10
    },
    selectedBarStyle: {
      shadowBlur: 5, //阴影宽度
      shadowOffsetX: 0, //x方向偏移
      shadowOffsetY: 0, //Y方向偏移
      shadowColor: 'black', //阴影颜色
      borderColor: 'red', //边框颜色
      borderLineширина: 1 //边框宽度
    }
  },
  timelineHeader: {
    verticalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    backgroundColor: '#EEF1F5',
    colширина: 60,
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
          цвет: 'red'
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
          цвет: 'red'
        }
      }
    ]
  },
  minDate: '2024-07-14',
  maxDate: '2024-10-15',

  rowSeriesNumber: {
    заголовок: '行号',
    dragпорядок: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8'
    },
    style: {
      цвет: '#000',
      fontSize: 14
    }
  },
  scrollStyle: {
    видимый: 'scrolling'
  },
  overscrollBehavior: 'никто'
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
```
