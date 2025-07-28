---
категория: примеры
группа: Cell тип
заголовок: список таблица integrated график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-график.png
ссылка: cell_type/график
опция: списоктаблица-columns-график#cellType
---

# список таблица integrated график

Combine vграфик график library и render it into таблицаs к enrich visual display forms и improve multi-график rendering Производительность. This пример refers к vграфик’s bar progress bar. для details, please refer к: https://visactor.io/vграфик/демонстрация/progress/linear-progress-с-target-значение

## Ключевые Конфигурации

- `Vтаблица.регистрация.графикModule('vграфик', Vграфик)` регистрацияs the график library для drawing графикs. Currently supports Vграфик
- `cellType: 'график'` specifies the тип график
- `графикModule: 'vграфик'` specifies the регистрацияed график library имя
- `графикSpec: {}` график spec

## код демонстрация

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
const records = [
  {
    projectимя: 'Project No.1',
    startTime: '2023/5/1',
    endTime: '2023/5/10',
    estimateDays: 10,
    goal: 0.6,
    progress: [
      {
        значение: 0.5,
        label: '50%',
        goal: 0.6
      }
    ],
    master: 'Julin'
  },
  {
    projectимя: 'Project No.2',
    startTime: '2023/5/1',
    endTime: '2023/5/5',
    estimateDays: 5,
    goal: 0.5,
    progress: [
      {
        значение: 0.5,
        label: '50%',
        goal: 0.5
      }
    ],
    master: 'Jack'
  },
  {
    projectимя: 'Project No.3',
    startTime: '2023/5/7',
    endTime: '2023/5/8',
    estimateDays: 3,
    goal: 0.2,
    progress: [
      {
        значение: 0.3,
        label: '30%',
        goal: 0.2
      }
    ],
    master: 'Mary'
  },
  {
    projectимя: 'Project No.4',
    startTime: '2023/5/11',
    endTime: '2023/5/12',
    estimateDays: 2,
    goal: 0.8,
    progress: [
      {
        значение: 0.9,
        label: '90%',
        goal: 0.8
      }
    ],
    master: 'Porry'
  },
  {
    projectимя: 'Project No.5',
    startTime: '2023/5/0',
    endTime: '2023/5/10',
    estimateDays: 2,
    goal: 1,
    progress: [
      {
        значение: 0.8,
        label: '80%',
        goal: 1
      }
    ],
    master: 'Sheery'
  }
];
const columns = [
  {
    поле: 'projectимя',
    заголовок: 'Project имя',
    ширина: 'авто',
    style: {
      цвет: '#ff689d',
      fontWeight: 'bold'
    }
  },
  {
    поле: 'progress',
    заголовок: 'Schedule',
    ширина: 300,
    cellType: 'график',
    графикModule: 'vграфик',
    style: {
      заполнение: 1
    },
    графикSpec: {
      тип: 'linearProgress',
      progress: {
        style: {
          fill: '#32a645',
          lineCap: ''
        }
      },
      данные: {
        id: 'id0'
      },
      direction: 'horizontal',
      xполе: 'значение',
      yполе: 'label',
      seriesполе: 'тип',
      cornerRadius: 20,
      bandширина: 12,
      заполнение: 10,
      axes: [
        {
          orient: 'право',
          тип: 'band',
          domainLine: { видимый: false },
          tick: { видимый: false },
          label: {
            formatMethod: val => val,
            style: {
              fontSize: 14,
              fontWeight: 'bold',
              fill: '#32a645'
            }
          },
          maxширина: '60%' // 配置坐标轴的最大空间
        },
        {
          orient: 'низ',
          label: { видимый: true, inside: true },
          тип: 'linear',
          видимый: false,
          grid: {
            видимый: false
          }
        }
      ],
      extensionMark: [
        {
          тип: 'rule',
          данныеId: 'id0',
          видимый: true,
          style: {
            x: (datum, ctx, elements, данныеView) => {
              debugger;
              возврат ctx.valueToX([datum.goal]);
            },
            y: (datum, ctx, elements, данныеView) => {
              возврат ctx.valueToY([datum.label]) - 5;
            },
            x1: (datum, ctx, elements, данныеView) => {
              возврат ctx.valueToX([datum.goal]);
            },
            y1: (datum, ctx, elements, данныеView) => {
              возврат ctx.valueToY([datum.label]) + 5;
            },
            strхорошоe: 'red',
            lineширина: 2
          }
        },
        {
          тип: 'symbol',
          данныеId: 'id0',
          видимый: true,
          style: {
            symbolType: 'triangleDown',
            x: (datum, ctx, elements, данныеView) => {
              возврат ctx.valueToX([datum.goal]);
            },
            y: (datum, ctx, elements, данныеView) => {
              возврат ctx.valueToY([datum.label]) - 10;
            },
            размер: 15,
            scaleY: 0.5,
            fill: 'red'
          }
        }
      ]
    }
  },
  {
    поле: 'goal',
    заголовок: 'Target',
    ширина: 'авто',
    полеFormat(rec) {
      возврат rec.goal * 100 + '%';
    },
    style: {
      цвет: 'red',
      fontWeight: 'bold'
    }
  },
  {
    поле: 'startTime',
    заголовок: 'начало Time',
    ширина: 'авто'
  },
  {
    поле: 'endTime',
    заголовок: 'конец Time',
    ширина: 'авто'
  },
  {
    поле: 'master',
    заголовок: 'Master',
    ширина: 'авто',
    style: {
      цвет: 'purple',
      fontWeight: 'bold'
    }
  }
];

const option = {
  records,
  columns,
  ширинаMode: 'standard',
  навести: {
    highlightMode: 'cross'
  },
  defaultRowвысота: 60,
  автоFillширина: true
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
