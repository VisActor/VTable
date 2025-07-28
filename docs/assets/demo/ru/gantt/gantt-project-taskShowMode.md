---
категория: примеры
группа: гантт
заголовок: гантт Project Task показать Mode
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-project-показать-mode.gif
ссылка: гантт/гантт_task_show_mode
опция: гантт#tasksShowMode
---

# гантт Project Task показать Mode

в the above пример, the main purpose is к показать the effect из the `гантт#tasksShowMode` option. However, the `Project_Sub_Tasks_Inline` mode is special, so it is displayed separately. This mode requires setting the `тип` из the данные item к `project` к take effect.

## Key Configuration

- `гантт`
- `гантт#tasksShowMode`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
let ганттInstance;
const records = [
  {
    id: 0,
    имя: 'Planning',
    тип: 'project',
    children: [
      {
        id: 1,
        имя: 'Michael Smith 1',
        начало: '2024-11-15',
        конец: '2024-11-15',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      },
      {
        id: 2,
        имя: 'Emily 2',
        начало: '2024-11-17',
        конец: '2024-11-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 3,
        имя: 'Rramily 3',
        начало: '2024-11-19',
        конец: '2024-11-20',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 4,
        имя: 'Lichael Join 4',
        начало: '2024-11-21',
        конец: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      }
    ]
  },
  {
    id: 300,
    имя: 'Research',
     тип: 'project',
    children: [
      {
        id: 5,
        имя: 'Ryan 5',
        начало: '2024-11-18',
        конец: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
      }
    ]
  },
  {
    имя: 'Goal Setting',
    тип: 'project',
    children: [
      {
        id: 6,
        имя: 'Daniel Davis 6',
        начало: '2024-11-21',
        конец: '2024-11-22',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
      },
      {
        id: 7,
        имя: 'Lauren 7',
        начало: '2024-11-18',
        конец: '2024-11-19',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
      }
    ]
  },

  {
    имя: 'Strategy',
    тип: 'project',
    children: [
      {
        id: 8,
        имя: 'Tacarah Siller 8',
        начало: '2024-11-20',
        конец: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 9,
        имя: 'Camentew Olision 9',
        начало: '2024-11-25',
        конец: '2024-11-26',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      },
      {
        id: 10,
        имя: 'Sarah Miller 10',
        начало: '2024-11-17',
        конец: '2024-11-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 11,
        имя: 'Matthew Wilson 11',
        начало: '2024-11-22',
        конец: '2024-11-25',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      },
      {
        id: 12,
        имя: 'Grarah Poliller 12',
        начало: '2024-11-23',
        конец: '2024-11-24',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      }
    ]
  },
  {
    имя: 'Execution',
    тип: 'project',
    children: [
      {
        id: 13,
        имя: 'Ashley Taylor 13',
        начало: '2024-11-22',
        конец: '2024-11-25',

        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
      },
      {
        id: 14,
        имя: 'Megan 14',
        начало: '2024-11-27',
        конец: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
      },
      {
        id: 15,
        имя: 'David 15',
        начало: '2024-12-10',
        конец: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
      }
    ]
  },
  {
    имя: 'Monitoring',
    тип: 'project',
    children: [
      {
        id: 16,
        имя: 'Hannah 16',
        начало: '2024-11-20',
        конец: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 17,
        имя: 'Andrew 17',
        начало: '2024-12-02',
        конец: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      }
    ]
  },
  {
    имя: 'Reporting',
   тип: 'project',
    children: [
      {
        id: 18,
        имя: 'Joshua Anderson 18',
        начало: '2024-12-22',
        конец: '2024-12-28',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
      }
    ]
  },
  {
    имя: 'Process review',
   тип: 'project',
    children: [
      {
        id: 19,
        имя: 'Christopher Moore 19',
        начало: '2024-11-25',
        конец: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
      },
      {
        id: 20,
        имя: 'Emma 20',
        начало: '2024-12-01',
        конец: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
      }
    ]
  }
];

const columns = [
  {
    поле: 'имя',
    заголовок: 'PROCESS',
    ширина: 150,
    tree: true
  }
];
const option = {
  records,
  taskсписоктаблица: {
    columns: columns,
    тема: {
      bodyStyle: {
        bgColor: 'white',
        цвет: 'rgb(115 115 115)'
      },
      headerStyle: {
        цвет: 'white'
      }
    }
  },
  groupBy: true,
  tasksShowMode: Vтаблицагантт.TYPES.TasksShowMode.Project_Sub_Tasks_Inline,
  frame: {
    outerFrameStyle: {
      borderLineширина: 1,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLineMoveable: false
  },
  grid: {
    horizontalLine: {
      lineширина: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
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
    labelText: '{имя}',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      textAlign: 'центр',
      цвет: 'white'
    },
    barStyle: {
      ширина: 22,
      /** 任务条的颜色 */
      barColor: 'rgb(68 99 244)',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 15,
      borderColor: 'black',
      borderLineширина: 1
    }
  },
  dependency: {
    linkCreaтаблица: true,
    links: [
      {
        тип: Vтаблицагантт.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 1,
        linkedToTaskKey: 2
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: 2,
        linkedToTaskKey: 3
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 3,
        linkedToTaskKey: 5
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.FinishToFinish,
        linkedFromTaskKey: 5,
        linkedToTaskKey: 4
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 8,
        linkedToTaskKey: 9
      },
      {
        тип: Vтаблицагантт.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: 9,
        linkedToTaskKey: 10
      }
    ]
  },
  timelineHeader: {
    verticalLine: {
      lineColor: '#e1e4e8',
      lineширина: 1
    },
    horizontalLine: {
      lineColor: '#e1e4e8',
      lineширина: 1
    },
    backgroundColor: '#63a8ff',
    scales: [
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'white'
        }
      }
    ]
  },
  minDate: '2024-11-14',
  maxDate: '2024-12-31',

  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    видимый: 'никто',
    ширина: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;

```
