---
категория: примеры
группа: Business
заголовок: Trend таблица
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/trend.png
порядок: 9-4
---

# Trend таблица

This пример analyzes Продажи данные в different time granularities и month-на-month ratios, и uses a mini-line график к показать product Продажи trends от 2020-2021.

## Ключевые Конфигурации

- `indicators[x].иконка` Display different иконкаs based на Продажи значение к indicate rise и fall

- `indicators[x].cellType` Set к sparkline к display miniatures

## код демонстрация

```javascript liveдемонстрация template=vтаблица
функция generateLineданные1(count) {
  const lineданные = [];
  для (let i = 0; i < count; i++) {
    lineданные.push({ x: i, y: Math.floor(Math.random() * 500) });
  }
  возврат lineданные;
}

const option = {
  rowTree: [
    {
      dimensionKey: 'order_данные',
      значение: 'Order число'
    },
    {
      dimensionKey: 'order_данные',
      значение: 'Прибыль Amount'
    },
    {
      dimensionKey: 'order_данные',
      значение: 'Продажи Amount'
    },
    {
      dimensionKey: 'order_данные',
      значение: 'Transportation Cost'
    }
  ],
  columnTree: [
    {
      dimensionKey: 'time',
      значение: '2020',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2021',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2020Q1',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2020Q2',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2020Q3',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2020Q4',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2021Q1',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2021Q2',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2021Q3',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: '2021Q4',
      children: [
        {
          indicatorKey: 'данные'
        },
        {
          indicatorKey: 'ratio'
        }
      ]
    },
    {
      dimensionKey: 'time',
      значение: 'line',
      children: [
        {
          indicatorKey: 'lineданные',
          значение: 'Trend '
        }
      ]
    }
  ],
  rows: [
    {
      dimensionKey: 'order_данные',
      заголовок: 'Order данные',
      headerStyle: {
        textStick: true
      },
      ширина: '100',
      showсортировка: false
    }
  ],
  columns: [
    {
      dimensionKey: 'time',
      заголовок: 'Quarter',
      ширина: '200',
      showсортировка: false,
      headerStyle: {
        textAlign: 'центр',
        borderLineширина: args => {
          const { col, row } = args;
          const cellHeaderPaths = args.таблица.getCellHeaderPaths(args.col, args.row);
          if (
            cellHeaderPaths.colHeaderPaths[0].значение === '2020Q1' ||
            cellHeaderPaths.colHeaderPaths[0].значение === '2021Q1' ||
            cellHeaderPaths.colHeaderPaths[0].значение === 'line'
          )
            возврат [0, 0, 0, 1];
          возврат [0, 0, 0, 0];
        }
      }
    },
    {
      dimensionKey: 'year',
      заголовок: 'Year',
      ширина: '200',
      showсортировка: false,
      headerStyle: {
        textAlign: 'центр'
      }
    }
  ],
  indicators: [
    {
      indicatorKey: 'данные',
      значение: 'данные',
      ширина: 'авто',
      style: {
        textAlign: 'право',
        borderLineширина: args => {
          const cellHeaderPaths = args.таблица.getCellHeaderPaths(args.col, args.row);
          if (
            cellHeaderPaths.colHeaderPaths[0].значение === '2020Q1' ||
            cellHeaderPaths.colHeaderPaths[0].значение === '2021Q1'
          )
            возврат [0, 0, 0, 1];
          возврат [0, 0, 0, 0];
        },
        заполнение: [8, 5, 8, 20]
      }
    },
    {
      indicatorKey: 'ratio',
      заголовок: '环比',
      ширина: 'авто',
      format: значение => {
        if (значение) возврат значение * 100 + '%';
        возврат '-';
      },
      иконка: args => {
        const { данныеValue } = args;
        if (данныеValue > 0) {
          возврат {
            тип: 'svg',
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/up-arrow.svg',
            ширина: 12,
            высота: 12,
            имя: 'up-green',
            positionType: Vтаблица.TYPES.иконкаPosition.inlineEnd
          };
        } else if (данныеValue < 0)
          возврат {
            тип: 'svg',
            svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/down-arrow.svg',
            ширина: 14,
            высота: 14,
            имя: 'down-red',
            positionType: Vтаблица.TYPES.иконкаPosition.inlineEnd
          };
        возврат '';
      },
      style: {
        textAlign: 'лево',
        borderLineширина: [0, 0, 0, 0],
        заполнение: [8, 20, 8, 5],
        цвет: args => {
          const { данныеValue } = args;
          if (данныеValue > 0) возврат 'green';
          возврат 'red';
        }
      }
    },
    {
      indicatorKey: 'lineданные',
      заголовок: 'Trend ',
      ширина: '300',
      cellType: 'sparkline',
      sparklineSpec: {
        тип: 'line',
        xполе: 'x',
        yполе: 'y',
        pointShowRule: 'никто',
        smooth: true,
        line: {
          style: {
            strхорошоe: '#2E62F1',
            strхорошоeширина: 2
            // interpolate: 'monotone',
          }
        },
        point: {
          навести: {
            strхорошоe: 'blue',
            strхорошоeширина: 1,
            fill: 'red',
            shape: 'circle',
            размер: 4
          },
          style: {
            strхорошоe: 'red',
            strхорошоeширина: 1,
            fill: 'yellow',
            shape: 'circle',
            размер: 2
          }
        },
        crosshair: {
          style: {
            strхорошоe: 'gray',
            strхорошоeширина: 1
          }
        }
      },
      style: {
        textAlign: 'лево',
        borderLineширина: [0, 1, 0, 1],
        заполнение: [8, 0, 8, 5]
      }
    }
  ],
  corner: {
    titleOnDimension: 'никто',
    headerStyle: {
      цвет: 'red'
    }
  },
  showColumnHeader: true,
  showRowHeader: true,
  hideIndicatorимя: true,
  records: [
    {
      order_данные: 'Order число',
      time: '2020',
      данные: 12304,
      ratio: 0.11
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2020',
      данные: 102504,
      ratio: 0.11
    },
    {
      order_данные: 'Продажи Amount',
      time: '2020',
      данные: 202504,
      ratio: 0.11
    },
    {
      order_данные: 'transportation Cost',
      time: '2020',
      данные: 6504,
      ratio: 0.11
    },
    {
      order_данные: 'Order число',
      time: '2021',
      данные: 19304,
      ratio: -0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2021',
      данные: 302504,
      ratio: -0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2020',
      данные: 302504,
      ratio: 0.11
    },
    {
      order_данные: 'Transportation Cost',
      time: '2021',
      данные: 9504,
      ratio: -0.12
    },
    {
      order_данные: 'Order число',
      time: '2020Q1',
      данные: 2304
      // "ratio":0.12
    },
    {
      order_данные: 'Order число',
      time: '2020Q2',
      данные: 2504,
      ratio: 0.12
    },
    {
      order_данные: 'Order число',
      time: '2020Q3',
      данные: 2904,
      ratio: 0.12
    },
    {
      order_данные: 'Order число',
      time: '2020Q4',
      данные: 2704,
      ratio: -0.08
    },
    {
      order_данные: 'Order число',
      time: '2021Q1',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Order число',
      time: '2021Q2',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Order число',
      time: '2021Q3',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Order число',
      time: '2021Q4',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2020Q1',
      данные: 2304
      // "ratio":0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2020Q2',
      данные: 2504,
      ratio: 0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2020Q3',
      данные: 2904,
      ratio: 0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2020Q4',
      данные: 2704,
      ratio: -0.08
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2021Q1',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2021Q2',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2021Q3',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Прибыль Amount',
      time: '2021Q4',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2020Q1',
      данные: 2304
      // "ratio":0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2020Q2',
      данные: 2504,
      ratio: 0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2020Q3',
      данные: 2904,
      ratio: 0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2020Q4',
      данные: 2704,
      ratio: -0.08
    },
    {
      order_данные: 'Продажи Amount',
      time: '2021Q1',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2021Q2',
      данные: 5304,
      ratio: 0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2021Q3',
      данные: 3304,
      ratio: 0.12
    },
    {
      order_данные: 'Продажи Amount',
      time: '2021Q4',
      данные: 3304,
      ratio: 0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2020Q1',
      данные: 2304
      // "ratio":0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2020Q2',
      данные: 2504,
      ratio: 0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2020Q3',
      данные: 2904,
      ratio: 0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2020Q4',
      данные: 2704,
      ratio: -0.08
    },
    {
      order_данные: 'Transportation Cost',
      time: '2021Q1',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2021Q2',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2021Q3',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Transportation Cost',
      time: '2021Q4',
      данные: 2304,
      ratio: 0.12
    },
    {
      order_данные: 'Order число',
      time: 'line',
      lineданные: generateLineданные1(30)
    },
    {
      order_данные: 'Прибыль Amount',
      time: 'line',
      lineданные: generateLineданные1(30)
    },
    {
      order_данные: 'Продажи Amount',
      time: 'line',
      lineданные: generateLineданные1(30)
    },
    {
      order_данные: 'Transportation Cost',
      time: 'line',
      lineданные: generateLineданные1(30)
    }
  ],
  тема: {
    headerStyle: {
      frameStyle: {
        borderColor: 'green',
        borderLineширина: [0, 0, 2, 0]
      },
      borderLineширина: [0, 1, 0, 1]
    },
    rowHeaderStyle: {
      borderLineширина: 0,
      frameStyle: {
        borderColor: 'red',
        borderLineширина: [0, 2, 0, 0]
      }
    },
    cornerHeaderStyle: {
      frameStyle: {
        borderColor: [null, 'red', 'green', null],
        borderLineширина: [0, 2, 2, 0]
      },
      borderColor: [null, null, null, null]
    }
  },
  defaultColширина: 200,
  изменение размера: {
    columnResizeType: 'indicatorGroup'
  }
};
const таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
```

## Related Tutorials

[Производительность optimization](link)
