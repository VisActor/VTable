---
категория: примеры
группа: гантт
заголовок: гантт Milestone
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/гантт-label-symbol.jpeg
ссылка: гантт/introduction
опция: гантт#taskBar.milestoneStyle
---

# гантт Milestone

Milestones в гантт графикs are used к mark important time points в a project. Unlike regular tasks that span over a period, milestones are represented по a distinctive diamond symbol. This пример демонстрацияnstrates milestones в different states, helping you better track key project points.

## Ключевые Конфигурации

- `гантт#taskBar.milestoneStyle`: Configure milestone styles such as размер, цвет, etc.
- Set `тип: 'milestone'` в данные к mark a task as milestone
- Milestone tasks only need к specify the `начало` time

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const records = [
  {
    id: '1',
    заголовок: '项目启动会议',
    начало: '2024-07-01',
    тип: 'milestone',
    progress: 100,
    parent: '0'
  },
  {
    id: '2',
    заголовок: '项目启动与规划',
    начало: '2024-07-01',
    конец: '2024-07-6',
    progress: 100,
    parent: '0'
  },
  {
    id: '3',
    заголовок: '需求评审完成',
    начало: '2024-07-6',
    тип: 'milestone',
    progress: 100,
    parent: '0'
  },
  {
    id: '4',
    заголовок: '技术方案设计',
    начало: '2024-07-6',
    конец: '2024-07-11',
    progress: 80,
    parent: '0'
  },
  {
    id: '5',
    заголовок: '开发环境搭建完成',
    начало: '2024-07-11',
    тип: 'milestone',
    progress: 100,
    parent: '0'
  },
  {
    id: '6',
    заголовок: '核心功能开发',
    начало: '2024-07-12',
    конец: '2024-07-18',
    progress: 60,
    parent: '0'
  },
  {
    id: '7',
    заголовок: 'Beta版本发布',
    начало: '2024-07-18',
    тип: 'milestone',
    progress: 0,
    parent: '0'
  },
  {
    id: '8',
    заголовок: '系统测试',
    начало: '2024-07-19',
    конец: '2024-07-23',
    progress: 60,
    parent: '0'
  },
  {
    id: '9',
    заголовок: '性能测试完成',
    начало: '2024-07-24',
    тип: 'milestone',
    progress: 0,
    parent: '0'
  },
  {
    id: '10',
    заголовок: '正式版本发布',
    начало: '2024-07-27',
    тип: 'milestone',
    progress: 0,
    parent: '0'
  }
];

const columns = [
  {
    поле: 'title',
    заголовок: '任务名称',
    ширина: 200,
    style: {
      fontFamily: 'PingFang SC',
      заполнение: [8, 16]
    }
  },
  {
    поле: 'progress',
    заголовок: '进度',
    ширина: 100,
    style: {
      fontFamily: 'PingFang SC',
      заполнение: [8, 16],
      textAlign: 'центр',
      цвет: значение => (значение >= 80 ? '#52c41a' : значение >= 30 ? '#1890ff' : '#595959')
    }
  }
];

const option = {
  records,
  taskсписоктаблица: {
    columns,
    таблицаширина: 280,
    minтаблицаширина: 100,
    maxтаблицаширина: 600,
    тема: {
      headerStyle: {
        borderColor: '#f0f0f0',
        fontSize: 13,
        fontFamily: 'PingFang SC',
        fontWeight: 500,
        цвет: '#262626',
        bgColor: '#fafafa',
        заполнение: [12, 16]
      },
      bodyStyle: {
        fontSize: 13,
        fontFamily: 'PingFang SC',
        цвет: '#595959',
        bgColor: '#ffffff',
        borderColor: '#f0f0f0',
        заполнение: [0, 16]
      }
    }
  },
  frame: {
    outerFrameStyle: {
      borderColor: '#ebedf0',
      borderLineширина: 1,
      cornerRadius: 12,
      заполнение: [1, 1, 1, 1]
    },
    verticalSplitLine: {
      lineColor: '#f0f0f0',
      lineширина: 1
    }
  },
  grid: {
    backgroundColor: '#fafaff',
    weekendBackgroundColor: 'rgba(94, 180, 245, 0.10)',
    verticalLine: {
      lineширина: 1,
      lineColor: '#f5f5f5'
    },
    horizontalLine: {
      lineширина: 1,
      lineColor: '#f5f5f5'
    }
  },
  headerRowвысота: 42,
  rowвысота: 40,
  taskBar: {
    startDateполе: 'начало',
    endDateполе: 'конец',
    progressполе: 'progress',
    moveable: true,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.2)'
    },
    labelText: '{title} {progress}%',
    labelTextStyle: {
      // заполнение: 2,
      fontFamily: 'Arial',
      fontSize: 16,
      textAlign: 'лево',
      textOverflow: 'ellipsis',
      цвет: 'rgb(240, 246, 251)'
    },
    barStyle: {
      ширина: 24,
      barColor: '#d6e4ff',
      completedBarColor: '#597ef7',
      cornerRadius: 12,
      borderLineширина: 2,
      borderColor: 'rgb(7, 88, 150)'
    },
    milestoneStyle: {
      ширина: 16,
      fillColor: значение => (значение.record.progress >= 100 ? '#597ef7' : '#d6e4ff'),
      borderColor: '#597ef7',
      borderLineширина: 0,
      labelText: '{title}',
      labelTextStyle: {
        fontSize: 16,
        цвет: 'rgb(1, 43, 75)'
      }
    }
  },
  timelineHeader: {
    colширина: 50,
    backgroundColor: '#fafafa',
    horizontalLine: {
      lineширина: 1,
      lineColor: '#f0f0f0'
    },
    verticalLine: {
      lineширина: 1,
      lineColor: '#f0f0f0'
    },
    scales: [
      {
        unit: 'week',
        step: 1,
        format(date) {
          возврат `第${date.dateIndex}周`;
        },
        style: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          textAlign: 'центр',
          textBaseline: 'середина',
          цвет: '#262626',
          заполнение: [8, 0]
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат date.dateIndex.toString();
        },
        style: {
          fontSize: 12,
          fontFamily: 'PingFang SC',
          textAlign: 'центр',
          textBaseline: 'середина',
          цвет: '#8c8c8c',
          заполнение: [8, 0]
        }
      }
    ]
  },
  markLine: [
    {
      date: '2024-07-11',
      style: {
        lineширина: 1,
        lineColor: 'blue',
        lineDash: [8, 4]
      }
    },
    {
      date: '2024-07-22',
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
    scrollRailColor: '#f5f5f5',
    видимый: 'навести',
    ширина: 5,
    scrollSliderColor: '#ccc',
    навести: {
      scrollSliderColor: '#bbb'
    }
  }
};

ганттInstance = новый Vтаблицагантт.гантт(document.getElementById(CONTAINER_ID), option);
window['ганттInstance'] = ганттInstance;
```
