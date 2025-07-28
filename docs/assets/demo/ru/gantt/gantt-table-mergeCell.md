---
категория: примеры
группа: гантт
заголовок: cellMerge в гантт
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-таблица-mergeCell.png
ссылка: базовый_function/merge_cell
опция: списоктаблица-columns-текст#mergeCell
---

# cellMerge в гантт

в гантт, if the task имяs are the same, the visual effect из parent tasks containing subtasks can be achieved through cell merging. This can be done по setting the `mergeCell` property в `списоктаблица#columns`.

## Key Configuration

- `гантт`
- `Vтаблица#списоктаблица#Column#mergeCell`

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
const barColors0 = ['#aecde6', '#c6a49a', '#ffb582', '#eec1de', '#b3d9b3', '#d9d1a5', '#cccccc', '#e59a9c', '#c9bede'];
const barColors = ['#1f77b4', '#8c564b', '#ff7f0e', '#e377c2', '#2ca02c', '#bcbd22', '#7f7f7f', '#d62728', '#9467bd'];
const bgColors = [
  'rgba(174,205,230,0.4)',
  'rgba(198,164,154,0.4)',
  'rgba(255,181,130,0.4)',
  'rgba(238,193,222,0.4)',
  'rgba(179,217,179,0.4)',
  'rgba(217,209,165,0.4)',
  'rgba(204,204,204,0.4)',
  'rgba(229,154,156,0.4)',
  'rgba(201,190,222,0.4)'
];

let ганттInstance;
const records = [
  {
    id: 1,
    имя: 'Michael Smith',
    начало: '2024-11-15',
    конец: '2024-11-17',
    parentTask: 'Planning',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
  },
  {
    id: 2,
    имя: 'Emily',
    начало: '2024-11-17',
    конец: '2024-11-18',
    parentTask: 'Planning',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
  },

  {
    id: 3,
    имя: 'Rramily',
    начало: '2024-11-19',
    конец: '2024-11-20',
    parentTask: 'Planning',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
  },
  {
    id: 4,
    имя: 'Lichael Join',
    начало: '2024-11-18',
    конец: '2024-11-19',
    parentTask: 'Planning',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
  },

  {
    id: 5,
    имя: 'Ryan',
    начало: '2024-11-18',
    конец: '2024-11-21',
    parentTask: 'Research',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
  },
  {
    id: 6,
    имя: 'Daniel Davis',
    начало: '2024-11-21',
    конец: '2024-11-22',
    parentTask: 'Goal Setting',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
  },
  {
    id: 7,
    имя: 'Lauren',
    начало: '2024-11-18',
    конец: '2024-11-19',
    parentTask: 'Goal Setting',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
  },
  {
    id: 8,
    имя: 'Tacarah Siller',
    начало: '2024-11-20',
    конец: '2024-11-21',
    parentTask: 'Strategy',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
  },
  {
    id: 9,
    имя: 'Camentew Olision',
    начало: '2024-11-25',
    конец: '2024-11-26',
    parentTask: 'Strategy',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
  },
  {
    id: 10,
    имя: 'Sarah Miller',
    начало: '2024-11-17',
    конец: '2024-11-18',
    parentTask: 'Strategy',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
  },
  {
    id: 11,
    имя: 'Matthew Wilson',
    начало: '2024-11-22',
    конец: '2024-11-25',
    parentTask: 'Strategy',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
  },
  {
    id: 12,
    имя: 'Grarah Poliller',
    начало: '2024-11-23',
    конец: '2024-11-24',
    parentTask: 'Strategy',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
  },
  {
    id: 13,
    имя: 'Ashley Taylor',
    начало: '2024-11-22',
    конец: '2024-11-25',
    parentTask: 'Execution',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
  },
  {
    id: 14,
    имя: 'Megan',
    начало: '2024-11-27',
    конец: '2024-11-30',
    parentTask: 'Execution',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
  },
  {
    id: 15,
    имя: 'David',
    начало: '2024-12-10',
    конец: '2024-12-18',
    parentTask: 'Execution',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
  },
  {
    id: 16,
    имя: 'Hannah',
    начало: '2024-11-20',
    конец: '2024-11-30',
    parentTask: 'Monitoring',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/bear.jpg'
  },
  {
    id: 17,
    имя: 'Andrew',
    начало: '2024-12-02',
    конец: '2024-12-18',
    parentTask: 'Monitoring',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/wolf.jpg'
  },
  {
    id: 18,
    имя: 'Joshua Anderson',
    начало: '2024-12-22',
    конец: '2024-12-28',
    parentTask: 'Reporting',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/rabbit.jpg'
  },
  {
    id: 19,
    имя: 'Christopher Moore',
    начало: '2024-11-25',
    конец: '2024-11-30',
    parentTask: 'Process review',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/cat.jpg'
  },
  {
    id: 20,
    имя: 'Emma',
    начало: '2024-12-01',
    конец: '2024-12-18',
    parentTask: 'Process review',
    avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/пользовательский-render/flower.jpg'
  }
];

const columns = [
  {
    поле: 'parentTask',
    заголовок: 'Task',
    ширина: 100,
    mergeCell: true,
    editor: 'ввод',
    style: {
      bgColor: '#EEF1F5',
      цвет: '#141414',
      fontWeight: 'bold',
      fontSize: 16,
      автоWrapText: true
    }
  },
  {
    поле: 'имя',
    заголовок: 'Master',
    ширина: 100,
    editor: 'ввод'
  },
  {
    поле: 'начало',
    заголовок: 'начало',
    ширина: 100,
    сортировка: true,
    editor: 'date-ввод'
  },
  {
    поле: 'конец',
    заголовок: 'конец',
    ширина: 100,
    сортировка: true,
    editor: 'date-ввод'
  }
];
const option = {
  records,
  taskсписоктаблица: {
    columns: columns,
    minтаблицаширина: 100,
    hierarchyExpandLevel: 5,
    меню: {
      contextменюItems: ['copy', 'paste', 'delete', '...']
    },
    тема: {
      bodyStyle: {
        заполнение: 5,
        цвет(args) {
          const { row } = args;
          const bgColor = barColors[(row - 1) % 9];
          возврат bgColor;
        },
        bgColor(args) {
          const { row } = args;
          const bgColor = bgColors[(row - 1) % 9];
          возврат bgColor;
        }
      },
      headerStyle: {
        цвет: 'white'
      }
    }
  },
  groupBy: true,
  tasksShowMode: Vтаблицагантт.TYPES.TasksShowMode.Tasks_Separate,
  frame: {
    outerFrameStyle: {
      borderLineширина: 1,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLineMoveable: false
  },
  grid: {
    horizontalBackgroundColor: bgColors,
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
  rowвысота: 60,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    labelText: '{имя}',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево'
    },
    barStyle: {
      ширина: 50,
      /** 任务条的颜色 */
      barColor: '#ee8800',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 25
    },
    пользовательскиймакет: args => {
      const colorLength = barColors.length;
      const { ширина, высота, index, startDate, endDate, taskDays, progress, taskRecord, ганттInstance } = args;
      const container = новый Vтаблицагантт.VRender.Group({
        ширина,
        высота,
        fill: {
          gradient: 'linear',
          x0: 0,
          y0: 0,
          x1: 1,
          y1: 0,
          stops: [
            {
              offset: 0,
              цвет: barColors0[index % colorLength]
            },
            {
              offset: 0.5,
              цвет: barColors[index % colorLength]
            },
            {
              offset: 1,
              цвет: barColors0[index % colorLength]
            }
          ]
        },
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap'
      });
      const containerLeft = новый Vтаблицагантт.VRender.Group({
        высота,
        ширина: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'центр',
        justifyContent: 'space-around'
        // fill: 'red'
      });
      container.add(containerLeft);

      const иконка0 = новый Vтаблицагантт.VRender.Imвозраст({
        ширина: 40,
        высота: 40,
        imвозраст: taskRecord.avatar,
        cornerRadius: 20
      });
      containerLeft.add(иконка0);

      const containerRight = новый Vтаблицагантт.VRender.Group({
        высота,
        ширина: ширина - 60,
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'лево'
      });
      container.add(containerRight);

      const bloggerимя = новый Vтаблицагантт.VRender.текст({
        текст: taskRecord.имя + ' ' + taskRecord.id,
        fontSize: 16,
        fontFamily: 'sans-serif',
        fill: 'white',
        maxLineширина: ширина - 60,
        boundsPadding: [10, 0, 0, 0]
      });
      containerRight.add(bloggerимя);

      const days = новый Vтаблицагантт.VRender.текст({
        текст: `${taskDays}天`,
        fontSize: 13,
        fontFamily: 'sans-serif',
        fill: 'white',
        boundsPadding: [10, 0, 0, 0]
      });
      containerRight.add(days);
      возврат {
        rootContainer: container
      };
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
    colширина: 100,
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
