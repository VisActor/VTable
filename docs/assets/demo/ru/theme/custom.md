---
категория: примеры
группа: Theme
заголовок: Theme - custom
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom.png
порядок: 6-6
ссылка: theme_and_style/theme
опция: ListTable#theme.bodyStyle.bgColor
---

# Form Theme -custom

Custom Theme

## Ключевые Конфигурации

- `theme` Configure Theme Name or Customize Theme Style

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: 'Город',
          value: 'Aberdeen'
        },
        {
          dimensionKey: 'Город',
          value: 'Abilene'
        },
        {
          dimensionKey: 'Город',
          value: 'Bowling Green'
        },
        {
          dimensionKey: 'Город',
          value: 'Boynton Beach'
        },
        {
          dimensionKey: 'Город',
          value: 'Bozeman'
        },
        {
          dimensionKey: 'Город',
          value: 'Brentwood'
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Категория',
          value: 'Office Supplies',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Technology',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        },
        {
          dimensionKey: 'Категория',
          value: 'Furniture',
          children: [
            {
              indicatorKey: 'Количество'
            },
            {
              indicatorKey: 'Продажи'
            },
            {
              indicatorKey: 'Прибыль'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Город',
          title: 'Город',
          headerStyle: {
            textStick: true
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
          showSort: false
        },
        {
          indicatorKey: 'Продажи',
          title: 'Продажи',
          width: 'auto',
          showSort: false,
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            else return '--';
          }
        },
        {
          indicatorKey: 'Прибыль',
          title: 'Прибыль',
          width: 'auto',
          showSort: false,
          format: value => {
            return Number(value).toFixed(2);
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      widthMode: 'standard',
      theme: {
        defaultStyle: {
          borderLineWidth: 0
        },
        headerStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineWidth: [0, 0, 1, 0]
          }
        },
        rowHeaderStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineWidth: [0, 1, 0, 0]
          }
        },
        cornerHeaderStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineWidth: [0, 1, 1, 0]
          }
        }
      }
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
