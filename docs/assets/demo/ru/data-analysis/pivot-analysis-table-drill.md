---
категория: примеры
группа: данные-analysis
заголовок: сводный analysis таблица drill down и drill up
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-таблица-drill.gif
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица-columns-текст#drillDown
---

# сводный analysis таблица drill down и drill up

Add the drillDown configuration item к the dimension configuration rows или columns к display the download Кнопка, списокen к the иконка Кнопка Нажать событие `drillменю_Нажать`, determine whether к drill down или roll up the dimension according к the событие параметр `drillDown` или `drillUp`, determine the dimension к drill down или drill up according к the параметр `dimensionKey`, add или delete it к rows или columns, obtain the данные source corresponding к the новый dimension level, и call the интерфейс `updateOption` к update the новый option к the таблица.

в the демонстрация пример below, if you навести the mouse over the row dimension, a drill-down Кнопка will appear. Нажатьing it will add `Sub-Категория` к the row dimension.

## Ключевые Конфигурации

- `сводныйтаблица` таблица тип
- `columns` column dimension configuration
- `columns.drillDown` dimension drill-down configuration
- `columns.drillUp` dimension drill-up configuration
- `rows` row dimension configuration
- `indicators` indicator configuration

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
const данные = [
  {
    Регион: 'Central',
    категория: 'Furniture',
    Количество: '16'
  },
  {
    Регион: 'Central',
    категория: 'Furniture',
    Количество: '4'
  },
  {
    Регион: 'Central',
    категория: 'Office Supplies',
    Продажи: '37.90399980545044'
  },
  {
    Регион: 'Central',
    категория: 'Office Supplies',
    Продажи: '62.22999954223633'
  },
  {
    Регион: 'Central',
    категория: 'Technology',
    Количество: '10'
  },
  {
    Регион: 'Central',
    категория: 'Technology',
    Количество: '4'
  },
  {
    Регион: 'East',
    категория: 'Furniture',
    Количество: '7'
  },
  {
    Регион: 'East',
    категория: 'Furniture',
    Количество: '18'
  },
  {
    Регион: 'East',
    категория: 'Office Supplies',
    Количество: '7'
  },
  {
    Регион: 'East',
    категория: 'Office Supplies',
    Количество: '17'
  },
  {
    Регион: 'East',
    категория: 'Office Supplies',
    Количество: '7'
  },
  {
    Регион: 'East',
    категория: 'Office Supplies',
    Количество: '17'
  },
  {
    Регион: 'South',
    категория: 'Furniture',
    Количество: '4'
  },
  {
    Регион: 'South',
    категория: 'Furniture',
    Количество: '6'
  },
  {
    Регион: 'South',
    категория: 'Technology',
    Прибыль: '4.361999988555908'
  },
  {
    Регион: 'South',
    категория: 'Technology',
    Прибыль: '280.58800506591797'
  }
];
const option = {
  records: данные,
  rows: [
    {
      dimensionKey: 'Категория',
      заголовок: 'Категория',
      drillDown: true,
      headerStyle: {
        textStick: true
      },
      ширина: 'авто'
    }
  ],
  columns: [
    {
      dimensionKey: 'Регион',
      заголовок: 'Регион',
      headerStyle: {
        textStick: true
      },
      ширина: 'авто'
    }
  ],
  indicators: [
    {
      indicatorKey: 'Количество',
      заголовок: 'Количество',
      ширина: 'авто',
      showсортировка: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      style: {
        заполнение: [16, 28, 16, 28],
        цвет(args) {
          if (args.данныеValue >= 0) возврат 'black';
          возврат 'red';
        }
      }
    },
    {
      indicatorKey: 'Продажи',
      заголовок: 'Продажи',
      ширина: 'авто',
      showсортировка: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: rec => {
        возврат '$' + число(rec).toFixed(2);
      },
      style: {
        заполнение: [16, 28, 16, 28],
        цвет(args) {
          if (args.данныеValue >= 0) возврат 'black';
          возврат 'red';
        }
      }
    },
    {
      indicatorKey: 'Прибыль',
      заголовок: 'Прибыль',
      ширина: 'авто',
      showсортировка: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: rec => {
        возврат '$' + число(rec).toFixed(2);
      },
      style: {
        заполнение: [16, 28, 16, 28],
        цвет(args) {
          if (args.данныеValue >= 0) возврат 'black';
          возврат 'red';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      textStick: true
    }
  },
  ширинаMode: 'standard'
};
таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
window['таблицаInstance'] = таблицаInstance;
const newданные = [
  {
    Регион: 'Central',
    категория: 'Furniture',
    Количество: '16',
    'Sub-Категория': 'Chairs'
  },
  {
    Регион: 'Central',
    категория: 'Furniture',
    Количество: '4',
    'Sub-Категория': 'таблицаs'
  },
  {
    Регион: 'Central',
    категория: 'Office Supplies',
    Продажи: '37.90399980545044',
    'Sub-Категория': 'Paper'
  },
  {
    Регион: 'Central',
    категория: 'Office Supplies',
    Продажи: '62.22999954223633',
    'Sub-Категория': 'Appliances'
  },
  {
    Регион: 'Central',
    категория: 'Technology',
    Количество: '10',
    'Sub-Категория': 'Phones'
  },
  {
    Регион: 'Central',
    категория: 'Technology',
    Количество: '4',
    'Sub-Категория': 'Accessories'
  },
  {
    Регион: 'East',
    категория: 'Furniture',
    Количество: '7',
    'Sub-Категория': 'Boхорошоcases'
  },
  {
    Регион: 'East',
    категория: 'Furniture',
    Количество: '18',
    'Sub-Категория': 'Furnishings'
  },
  {
    Регион: 'East',
    категория: 'Office Supplies',
    Количество: '7',
    'Sub-Категория': 'Paper'
  },
  {
    Регион: 'East',
    категория: 'Office Supplies',
    Количество: '17',
    'Sub-Категория': 'Binders'
  },
  {
    Регион: 'South',
    категория: 'Furniture',
    Количество: '4',
    'Sub-Категория': 'Furnishings'
  },
  {
    Регион: 'South',
    категория: 'Furniture',
    Количество: '6',
    'Sub-Категория': 'таблицаs'
  },
  {
    Регион: 'South',
    категория: 'Technology',
    Прибыль: '4.361999988555908',
    'Sub-Категория': 'Accessories'
  },
  {
    Регион: 'South',
    категория: 'Technology',
    Прибыль: '280.58800506591797',
    'Sub-Категория': 'Phones'
  }
];
таблицаInstance.на('drillменю_Нажать', args => {
  if (args.drillDown) {
    if (args.dimensionKey === 'Категория') {
      таблицаInstance.updateOption({
        records: newданные,
        rows: [
          {
            dimensionKey: 'Категория',
            заголовок: 'Категория',
            drillUp: true,
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          },
          {
            dimensionKey: 'Sub-Категория',
            заголовок: 'Sub-Catogery',
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          }
        ],
        columns: [
          {
            dimensionKey: 'Регион',
            заголовок: 'Регион',
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          }
        ],
        indicators: [
          {
            indicatorKey: 'Количество',
            заголовок: 'Количество',
            ширина: 'авто',
            showсортировка: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            style: {
              заполнение: [16, 28, 16, 28],
              цвет(args) {
                if (args.данныеValue >= 0) возврат 'black';
                возврат 'red';
              }
            }
          },
          {
            indicatorKey: 'Продажи',
            заголовок: 'Продажи',
            ширина: 'авто',
            showсортировка: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              возврат '$' + число(rec).toFixed(2);
            },
            style: {
              заполнение: [16, 28, 16, 28],
              цвет(args) {
                if (args.данныеValue >= 0) возврат 'black';
                возврат 'red';
              }
            }
          },
          {
            indicatorKey: 'Прибыль',
            заголовок: 'Прибыль',
            ширина: 'авто',
            showсортировка: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              возврат '$' + число(rec).toFixed(2);
            },
            style: {
              заполнение: [16, 28, 16, 28],
              цвет(args) {
                if (args.данныеValue >= 0) возврат 'black';
                возврат 'red';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textStick: true
          }
        },
        ширинаMode: 'standard'
      });
    }
  } else if (args.drillUp) {
    if (args.dimensionKey === 'Категория') {
      таблицаInstance.updateOption({
        records: данные,
        rows: [
          {
            dimensionKey: 'Категория',
            заголовок: 'Категория',
            drillDown: true,
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          }
        ],
        columns: [
          {
            dimensionKey: 'Регион',
            заголовок: 'Регион',
            headerStyle: {
              textStick: true
            },
            ширина: 'авто'
          }
          //  {
          //    "dimensionKey": "Order Year",
          //     "title": "Order Year",
          //     "headerStyle": {
          //         "textStick": true
          //     },
          //     "ширина": "авто",
          // },
        ],
        indicators: [
          {
            indicatorKey: 'Количество',
            заголовок: 'Количество',
            ширина: 'авто',
            showсортировка: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            style: {
              заполнение: [16, 28, 16, 28],
              цвет(args) {
                if (args.данныеValue >= 0) возврат 'black';
                возврат 'red';
              }
            }
          },
          {
            indicatorKey: 'Продажи',
            заголовок: 'Продажи',
            ширина: 'авто',
            showсортировка: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              возврат '$' + число(rec).toFixed(2);
            },
            style: {
              заполнение: [16, 28, 16, 28],
              цвет(args) {
                if (args.данныеValue >= 0) возврат 'black';
                возврат 'red';
              }
            }
          },
          {
            indicatorKey: 'Прибыль',
            заголовок: 'Прибыль',
            ширина: 'авто',
            showсортировка: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              возврат '$' + число(rec).toFixed(2);
            },
            style: {
              заполнение: [16, 28, 16, 28],
              цвет(args) {
                if (args.данныеValue >= 0) возврат 'black';
                возврат 'red';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textStick: true
          }
        },
        ширинаMode: 'standard'
      });
    }
  }
});
```
