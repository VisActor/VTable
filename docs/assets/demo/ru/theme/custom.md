---
категория: примеры
группа: тема
заголовок: тема - пользовательский
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский.png
порядок: 6-6
ссылка: тема_and_style/тема
опция: списоктаблица#тема.bodyStyle.bgColor
---

# Form тема -пользовательский

пользовательский тема

## Ключевые Конфигурации

- `тема` Configure тема имя или пользовательскийize тема Style

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rowTree: [
        {
          dimensionKey: 'Город',
          значение: 'Aberdeen'
        },
        {
          dimensionKey: 'Город',
          значение: 'Abilene'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bowling Green'
        },
        {
          dimensionKey: 'Город',
          значение: 'Boynton Beach'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bozeman'
        },
        {
          dimensionKey: 'Город',
          значение: 'Brentwood'
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Категория',
          значение: 'Office Supplies',
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
          значение: 'Technology',
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
          значение: 'Furniture',
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
          заголовок: 'Город',
          headerStyle: {
            textStick: true
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
          showсортировка: false
        },
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          format: значение => {
            if (значение) возврат '$' + число(значение).toFixed(2);
            else возврат '--';
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          format: значение => {
            возврат число(значение).toFixed(2);
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      ширинаMode: 'standard',
      тема: {
        defaultStyle: {
          borderLineширина: 0
        },
        headerStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineширина: [0, 0, 1, 0]
          }
        },
        rowHeaderStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineширина: [0, 1, 0, 0]
          }
        },
        cornerHeaderStyle: {
          frameStyle: {
            borderColor: 'blue',
            borderLineширина: [0, 1, 1, 0]
          }
        }
      }
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
