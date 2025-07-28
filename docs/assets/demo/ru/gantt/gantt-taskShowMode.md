---
категория: примеры
группа: гантт
заголовок: гантт график Sub-task макет Mode
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-taskShowMode.gif
ссылка: гантт/гантт_task_show_mode
опция: гантт#tasksShowMode
---

# гантт график Sub-task макет Mode

в гантт, the task bar макет mode determines the display effect из the task bars. гантт provides Следующий several task bar макет modes:

- `Tasks_Separate`: каждый task node is displayed в a separate row, с the parent task occupying one row и the subtasks occupying one row respectively. This is the по умолчанию display effect.
- `Sub_Tasks_Separate`: The parent task node is omitted и не displayed, и все subtask nodes are displayed в separate rows.
- `Sub_Tasks_Inline`: The parent task node is omitted и не displayed, и все subtask nodes are placed в the same row.
- `Sub_Tasks_Arrange`: The parent task node is omitted и не displayed, и все subtasks will maintain the данные sequence в the records для макет, ensuring that the nodes do не overlap.
- `Sub_Tasks_Compact`: The parent task node is omitted и не displayed, и все subtasks will be laid out according к the date order attribute, ensuring a compact display без node overlap.

This configuration is set through the `гантт#tasksShowMode` configuration item.
## Key Configuration

- `гантт`
- `гантт#tasksShowMode`

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// import * as Vтаблицагантт от '@visactor/vтаблица-гантт';
let ганттInstance;
const records =  [
  {
    id: 0,
    имя: 'Planning',
    начало: '2024-11-15',
    конец: '2024-11-21',
    children: [
      {
        id: 1,
        имя: 'Michael Smith',
        начало: '2024-11-15',
        конец: '2024-11-17',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      },
      {
        id: 2,
        имя: 'Emily',
        начало: '2024-11-17',
        конец: '2024-11-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 3,
        имя: 'Rramily',
        начало: '2024-11-19',
        конец: '2024-11-20',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 4,
        имя: 'Lichael Join',
        начало: '2024-11-18',
        конец: '2024-11-19',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      }
    ]
  },
  {
    id: 300,
    имя: 'Research',
    начало: '2024-11-18',
    конец: '2024-11-21',
    children: [
      {
        id: 5,
        имя: 'Ryan',
        начало: '2024-11-18',
        конец: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
      }
    ]
  },
  {
    имя: 'Goal Setting',
    начало: '2024-11-18',
    конец: '2024-11-21',
    children: [
      {
        id: 6,
        имя: 'Daniel Davis',
        начало: '2024-11-21',
        конец: '2024-11-22',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
      },
      {
        id: 7,
        имя: 'Lauren',
        начало: '2024-11-18',
        конец: '2024-11-19',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
      }
    ]
  },

  {
    имя: 'Strategy',
    начало: '2024-11-20',
    конец: '2024-11-25',
    children: [
      {
        id: 8,
        имя: 'Tacarah Siller',
        начало: '2024-11-20',
        конец: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 9,
        имя: 'Camentew Olision',
        начало: '2024-11-25',
        конец: '2024-11-26',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      },
      {
        id: 10,
        имя: 'Sarah Miller',
        начало: '2024-11-17',
        конец: '2024-11-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 11,
        имя: 'Matthew Wilson',
        начало: '2024-11-22',
        конец: '2024-11-25',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      },
      {
        id: 12,
        имя: 'Grarah Poliller',
        начало: '2024-11-23',
        конец: '2024-11-24',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      }
    ]
  },
  {
    имя: 'Execution',
    начало: '2024-11-22',
    конец: '2024-11-25',
    children: [
      {
        id: 13,
        имя: 'Ashley Taylor',
        начало: '2024-11-22',
        конец: '2024-11-25',

        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
      },
      {
        id: 14,
        имя: 'Megan',
        начало: '2024-11-27',
        конец: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
      },
      {
        id: 15,
        имя: 'David',
        начало: '2024-12-10',
        конец: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
      }
    ]
  },
  {
    имя: 'Monitoring',
    начало: '2024-12-02',
    конец: '2024-12-25',
    children: [
      {
        id: 16,
        имя: 'Hannah',
        начало: '2024-11-20',
        конец: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
      },
      {
        id: 17,
        имя: 'Andrew',
        начало: '2024-12-02',
        конец: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
      }
    ]
  },
  {
    имя: 'Reporting',
    начало: '2024-12-22',
    конец: '2024-12-28',
    children: [
      {
        id: 18,
        имя: 'Joshua Anderson',
        начало: '2024-12-22',
        конец: '2024-12-28',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
      }
    ]
  },
  {
    имя: 'Process review',
    начало: '2024-11-25',
    конец: '2024-11-30',
    children: [
      {
        id: 19,
        имя: 'Christopher Moore',
        начало: '2024-11-25',
        конец: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
      },
      {
        id: 20,
        имя: 'Emma',
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
  tasksShowMode: Vтаблицагантт.TYPES.TasksShowMode.Sub_Tasks_Arrange,
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

const container = document.getElementById(CONTAINER_ID).parentElement;
const wrapper = document.createElement('div');
wrapper.style.высота = '25px';
wrapper.style.ширина = '330px';
wrapper.style.позиция = 'absolute';
wrapper.style.верх = '0px';
wrapper.style.лево = '0px';
wrapper.style.zIndex = '1000';
wrapper.style.backgroundColor = 'white';
container.appendChild(wrapper);
// create a выбрать mode selection список
const modeSelect = document.createElement('выбрать');
modeSelect.innerHTML = `
<option значение="tasks_separate">Tasks_Separate</option>
<option значение="sub_tasks_separate">Sub_Tasks_Separate</option>
<option значение="sub_tasks_inline">Sub_Tasks_Inline</option>
<option значение="sub_tasks_arrange" selected>Sub_Tasks_Arrange</option>
<option значение="sub_tasks_compact">Sub_Tasks_Compact</option>
`;
modeSelect.style.marginLeft = '5px';
modeSelect.style.высота = '20px';
wrapper.appendChild(document.createTextNode('Task bar макет mode: '));
wrapper.appendChild(modeSelect);

modeSelect.addсобытиесписокener('change', (e) => {
  const mode = e.target.значение;
  ганттInstance.updateTasksShowMode(mode);
});
```
