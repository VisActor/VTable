---
категория: примеры
группа: Основные Функции
заголовок: Freeze Row
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/frozen-row.gif
ссылка: basic_function/frozen_column_row
опция: ListTable#frozenRowCount
---

# Freeze Row

In порядок to keep these key information rows visible throughout the horizontal scroll, we need to "freeze" these rows.

## Ключевые Конфигурации

- `frozenRowCount` The number of frozen rows (including header), default is the number of header rows

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Город',
          title: 'Город',
          headerStyle: {
            textStick: true,
            color: args => {
              if (args.row < 4) {
                return 'red';
              }
              return '#000';
            },
            bgColor: args => {
              if (args.row < 4) {
                return 'rgba(255, 0, 0, 0.1)';
              }
              return '#fff';
            }
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Категория',
          title: 'Категория',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Количество',
          title: 'Количество',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor: args => {
              if (args.row < 4) {
                return 'rgba(255, 0, 0, 0.1)';
              }
              return '#fff';
            }
          }
        },
        {
          indicatorKey: 'Продажи',
          title: 'Продажи',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor: args => {
              if (args.row < 4) {
                return 'rgba(255, 0, 0, 0.1)';
              }
              return '#fff';
            }
          }
        },
        {
          indicatorKey: 'Прибыль',
          title: 'Прибыль',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor: args => {
              if (args.row < 4) {
                return 'rgba(255, 0, 0, 0.1)';
              }
              return '#fff';
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
      dataConfig: {
        sortRules: [
          {
            sortField: 'Категория',
            sortBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ]
      },
      widthMode: 'standard',
      frozenRowCount: 4
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
