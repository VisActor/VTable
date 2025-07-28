---
категория: примеры
группа: Cell тип
заголовок: график тип Use в сводныйтаблица
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/график.png
ссылка: cell_type/график
опция: сводныйтаблица-indicators-график#cellType
---

# график тип Use в сводныйтаблица

Combine the vграфик график library с rendering into таблицаs к enrich visual display forms и improve multi-график rendering Производительность.

## Ключевые Конфигурации

- `Vтаблица.регистрация.графикModule('vграфик', Vграфик)` регистрация the графикing library для графикing, currently supports Vграфик
- `cellType: 'график'` Specify the тип график
- `cellType: 'vграфик'` Specify the регистрацияed график library имя
- `графикSpec: {}` график specs

## код демонстрация

```javascript liveдемонстрация template=vтаблица
Vтаблица.регистрация.графикModule('vграфик', Vграфик);
const records = [];
для (let i = 1; i <= 10; i++) {
  для (let j = 1; j <= 10; j++) {
    const record = {
      Регион: 'Регион' + i
    };
    record['Категория'] = 'Категория' + j;
    record.areaграфик = [
      { x: '0', тип: 'A', y: 900 + i + j },
      { x: '1', тип: 'A', y: '707' },
      { x: '2', тип: 'A', y: '832' },
      { x: '3', тип: 'A', y: '726' },
      { x: '4', тип: 'A', y: '756' },
      { x: '5', тип: 'A', y: '777' },
      { x: '6', тип: 'A', y: '689' },
      { x: '7', тип: 'A', y: '795' },
      { x: '8', тип: 'A', y: '889' },
      { x: '9', тип: 'A', y: '757' },
      { x: '0', тип: 'B', y: '773' },
      { x: '1', тип: 'B', y: '785' },
      { x: '2', тип: 'B', y: '635' },
      { x: '3', тип: 'B', y: '813' },
      { x: '4', тип: 'B', y: '678' },
      { x: '5', тип: 'B', y: '796' },
      { x: '6', тип: 'B', y: '652' },
      { x: '7', тип: 'B', y: '623' },
      { x: '8', тип: 'B', y: '649' },
      { x: '9', тип: 'B', y: '630' }
    ];

    record.lineграфик = [
      { x: '0', тип: 'A', y: 900 + i + j },
      { x: '1', тип: 'A', y: '707' },
      { x: '2', тип: 'A', y: '832' },
      { x: '3', тип: 'A', y: '726' },
      { x: '4', тип: 'A', y: '756' },
      { x: '5', тип: 'A', y: '777' },
      { x: '6', тип: 'A', y: '689' },
      { x: '7', тип: 'A', y: '795' },
      { x: '8', тип: 'A', y: '889' },
      { x: '9', тип: 'A', y: '757' },
      { x: '0', тип: 'B', y: 500 },
      { x: '1', тип: 'B', y: '785' },
      { x: '2', тип: 'B', y: '635' },
      { x: '3', тип: 'B', y: '813' },
      { x: '4', тип: 'B', y: '678' },
      { x: '5', тип: 'B', y: '796' },
      { x: '6', тип: 'B', y: '652' },
      { x: '7', тип: 'B', y: '623' },
      { x: '8', тип: 'B', y: '649' },
      { x: '9', тип: 'B', y: '630' }
    ];
    records.push(record);
  }
}

const option = {
  records,
  defaultRowвысота: 200,
  defaultHeaderRowвысота: 50,
  indicators: [
    {
      indicatorKey: 'lineграфик',
      заголовок: 'Продажи trend график',
      headerStyle: {
        цвет: 'blue'
        // bgColor: 'yellow',
      },
      cellType: 'график',
      графикModule: 'vграфик',
      ширина: 300,
      графикSpec: {
        тип: 'common',
        series: [
          {
            тип: 'line',
            данные: {
              id: 'данные'
            },
            xполе: 'x',
            yполе: 'y',
            seriesполе: 'тип'
          }
        ],
        axes: [
          { orient: 'лево', range: { min: 0 } },
          { orient: 'низ', label: { видимый: true }, тип: 'band' }
        ]
      }
    },
    {
      indicatorKey: 'areaграфик',
      заголовок: 'Прибыль trend график',
      headerStyle: {
        цвет: 'green'
      },
      cellType: 'график',
      графикModule: 'vграфик',
      ширина: 300,
      графикSpec: {
        тип: 'common',
        series: [
          {
            тип: 'area',
            данные: {
              id: 'данные'
            },
            xполе: 'x',
            yполе: 'y',
            seriesполе: 'тип',
            point: {
              style: {
                fillOpaГород: 1,
                strхорошоeширина: 0
              },
              state: {
                навести: {
                  fillOpaГород: 0.5,
                  strхорошоe: 'blue',
                  strхорошоeширина: 2
                },
                selected: {
                  fill: 'red'
                }
              }
            },
            area: {
              style: {
                fillOpaГород: 0.3,
                strхорошоe: '#000',
                strхорошоeширина: 4
              },
              state: {
                навести: {
                  fillOpaГород: 1
                },
                selected: {
                  fill: 'red',
                  fillOpaГород: 1
                }
              }
            }
          }
        ],
        axes: [
          { orient: 'лево', range: { min: 0 } },
          { orient: 'низ', label: { видимый: true }, тип: 'band' }
        ]
      }
    }
  ],
  columnTree: [
    {
      dimensionKey: 'Регион',
      значение: 'Регион1',
      children: [
        {
          indicatorKey: 'areaграфик'
        },
        {
          indicatorKey: 'lineграфик'
        }
      ]
    },
    {
      dimensionKey: 'Регион',
      значение: 'Регион2',
      children: [
        {
          indicatorKey: 'areaграфик'
        },
        {
          indicatorKey: 'lineграфик'
        }
      ]
    },
    {
      dimensionKey: 'Регион',
      значение: 'Регион3',
      children: [
        {
          indicatorKey: 'areaграфик'
        },
        {
          indicatorKey: 'lineграфик'
        }
      ]
    }
  ],
  rowTree: [
    {
      dimensionKey: 'Категория',
      значение: 'Категория1'
    },
    {
      dimensionKey: 'Категория',
      значение: 'Категория2'
    },
    {
      dimensionKey: 'Категория',
      значение: 'Категория3'
    },
    {
      dimensionKey: 'Категория',
      значение: 'Категория4'
    }
  ],
  corner: {
    titleOnDimension: 'row'
  },
  dragпорядок: {
     dragHeaderMode: 'все'
  }
};
const таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```
