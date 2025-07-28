---
категория: примеры
группа: базовый возможности
заголовок: Freeze Row
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/frozen-row.gif
ссылка: базовый_function/frozen_column_row
опция: списоктаблица#frozenRowCount
---

# Freeze Row

в order к keep these key information rows видимый throughout the horizontal прокрутка, we need к "freeze" these rows.

## Ключевые Конфигурации

- `frozenRowCount` The число из frozen rows (including header), по умолчанию is the число из header rows

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Город',
          заголовок: 'Город',
          headerStyle: {
            textStick: true,
            цвет: args => {
              if (args.row < 4) {
                возврат 'red';
              }
              возврат '#000';
            },
            bgColor: args => {
              if (args.row < 4) {
                возврат 'rgba(255, 0, 0, 0.1)';
              }
              возврат '#fff';
            }
          },
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
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
            },
            bgColor: args => {
              if (args.row < 4) {
                возврат 'rgba(255, 0, 0, 0.1)';
              }
              возврат '#fff';
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
            },
            bgColor: args => {
              if (args.row < 4) {
                возврат 'rgba(255, 0, 0, 0.1)';
              }
              возврат '#fff';
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
            },
            bgColor: args => {
              if (args.row < 4) {
                возврат 'rgba(255, 0, 0, 0.1)';
              }
              возврат '#fff';
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
      данныеConfig: {
        сортировкаRules: [
          {
            сортировкаполе: 'Категория',
            сортировкаBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ]
      },
      ширинаMode: 'standard',
      frozenRowCount: 4
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
