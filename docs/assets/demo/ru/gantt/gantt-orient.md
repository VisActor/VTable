---
категория: примеры
группа: гантт
заголовок: гантт Style — текст не скрытый
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/гантт-label-текст.gif
ссылка: гантт/introduction
опция: гантт#taskBar
---

# гантт Style - текст не скрытый

This пример демонстрацияnstrates the style configuration из не hiding taskbar текст.

## Key Configuration

- `orient` текст orientation relative к the taskbar. необязательный values: `лево`, `верх`, `право`, `низ`, representing the four directions respectively.
- `orientHandleWithOverflow` Specifies the taskbar текст orientation when the label cannot fit within the taskbar. Ignored if `orient` is explicitly set.

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
    конец: '2024-07-28',
    progress: 100,
    priority: 'P0'
  },
  {
    id: 2,
    заголовок: 'Project Feature Review',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-25',
    конец: '2024-07-27',
    progress: 90,
    priority: 'P0'
  },
  {
    id: 3,
    заголовок: 'Project Create',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-29',
    конец: '2024-07-31',
    progress: 40,
    priority: 'P1'
  },
  {
    id: 4,
    заголовок: 'Develop feature 1',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-07-30',
    конец: '2024-08-10',
    progress: 30,
    priority: 'P1'
  },
  {
    id: 5,
    заголовок: 'Determine project scope',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-01',
    конец: '2024-08-05',
    progress: 60,
    priority: 'P0'
  },
  {
    id: 6,
    заголовок: 'Project Status Review',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-06',
    конец: '2024-08-08',
    progress: 10,
    priority: 'P0'
  },
  {
    id: 7,
    заголовок: 'Feature Testing',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-09',
    конец: '2024-08-15',
    progress: 70,
    priority: 'P1'
  },
  {
    id: 8,
    заголовок: 'Project Complete',
    developer: 'liufangfang.jane@bytedance.com',
    начало: '2024-08-01',
    конец: '2024-08-10',
    progress: 70,
    priority: 'P0'
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
    verticalSplitLineMoveable: true,
    verticalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    },
    horizontalSplitLine: {
      lineColor: '#e1e4e8',
      lineширина: 3
    }
  },
  grid: {
    weekendBackgroundColor: '#f8f8f8',
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
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево',
      textOverflow: 'видимый',
      orientHandleWithOverflow: 'право',
      outsideColor: '#333333'
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
    },
    milestoneStyle: {
      borderColor: 'red',
      borderLineширина: 1,
      fillColor: 'green',
      ширина: 15
    }
  },
  timelineHeader: {
    colширина: 50,
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
