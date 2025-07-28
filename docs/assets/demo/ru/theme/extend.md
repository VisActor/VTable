---
категория: примеры
группа: тема
заголовок: тема -extends
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/extend.png
порядок: 6-5
ссылка: тема_and_style/тема
опция: списоктаблица#тема.bodyStyle.bgColor
---

# таблица тема -extends

Extend и modify based на a certain тема built into the компонент

## Ключевые Конфигурации

- `Vтаблица.темаs.ARCO.extends` Configure тема имя или пользовательскийize тема Style

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
            возврат число(значение).toFixed(2);
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
        titleOnDimension: 'column',
        headerStyle: {
          textStick: true
        }
      },
      indicatorзаголовок: 'indicators',
      ширинаMode: 'standard',
      тема: Vтаблица.темаs.ARCO.extends({
        defaultStyle: {
          borderLineширина: 0
        },
        headerStyle: {
          bgColor: '#a881e1',
          borderColor: 'white',
          fontWeight: 'normal',
          цвет: 'white'
        },
        rowHeaderStyle: {
          bgColor: '#eae1fa',
          borderColor: 'white',
          borderLineширина: 1,
          fontWeight: 'normal'
        },
        cornerHeaderStyle: {
          bgColor: '#a881e1',
          fontWeight: 'normal',
          цвет: 'white'
        },
        bodyStyle: {
          borderColor: '#f1e8fe',
          borderLineширина: 1,
          bgColor: args => {
            if (args.row & 1) {
              возврат '#f8f5fe';
            }
            возврат '#FDFDFD';
          }
        }
      })
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
