---
категория: примеры
группа: Interaction
заголовок: Adjust column ширина
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/изменение размера-col-ширина.gif
порядок: 4-4
ссылка: '/interaction/resize_column_ширина'
опция: списоктаблица#columnResizeMode
---

# Adjust column ширина

The mouse style для adjusting the column ширина appears when the mouse is placed на the column spacer, и the column ширина can be adjusted по dragging.

## Ключевые Конфигурации

- `columnResizeMode: 'все' | 'никто' | 'header' | 'body'` Specify the Регион where the column ширина can be adjusted
- `columnResizeType: 'column' | 'indicator' | 'все' | 'indicatorGroup'` Adjust the effective range из the column ширина, configurable items:

  - Column: adjust the column ширина к adjust only the текущий column
  - Indicator: Columns corresponding к the same Metirc will be adjusted when adjusting the column ширина
  - indicatorгруппа: Adjust the ширина из все Metirc columns under the same parent Dimension
  - все: все column ширинаs are adjusted

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
          значение: 'Akron'
        },
        {
          dimensionKey: 'Город',
          значение: 'Albuquerque'
        },
        {
          dimensionKey: 'Город',
          значение: 'Alexandria'
        },
        {
          dimensionKey: 'Город',
          значение: 'Allen'
        },
        {
          dimensionKey: 'Город',
          значение: 'Allentown'
        },
        {
          dimensionKey: 'Город',
          значение: 'Altoona'
        },
        {
          dimensionKey: 'Город',
          значение: 'Amarillo'
        },
        {
          dimensionKey: 'Город',
          значение: 'Anaheim'
        },
        {
          dimensionKey: 'Город',
          значение: 'Andover'
        },
        {
          dimensionKey: 'Город',
          значение: 'Ann Arbor'
        },
        {
          dimensionKey: 'Город',
          значение: 'Antioch'
        },
        {
          dimensionKey: 'Город',
          значение: 'Apopka'
        },
        {
          dimensionKey: 'Город',
          значение: 'Apple Valley'
        },
        {
          dimensionKey: 'Город',
          значение: 'Appleton'
        },
        {
          dimensionKey: 'Город',
          значение: 'Arlington'
        },
        {
          dimensionKey: 'Город',
          значение: 'Arlington высотаs'
        },
        {
          dimensionKey: 'Город',
          значение: 'Arvada'
        },
        {
          dimensionKey: 'Город',
          значение: 'Asheville'
        },
        {
          dimensionKey: 'Город',
          значение: 'Athens'
        },
        {
          dimensionKey: 'Город',
          значение: 'Atlanta'
        },
        {
          dimensionKey: 'Город',
          значение: 'Atlantic Город'
        },
        {
          dimensionKey: 'Город',
          значение: 'Auburn'
        },
        {
          dimensionKey: 'Город',
          значение: 'Aurora'
        },
        {
          dimensionKey: 'Город',
          значение: 'Austin'
        },
        {
          dimensionKey: 'Город',
          значение: 'Avondale'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bakersполе'
        },
        {
          dimensionKey: 'Город',
          значение: 'Baltimore'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bangor'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bartlett'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bayonne'
        },
        {
          dimensionKey: 'Город',
          значение: 'Baytown'
        },
        {
          dimensionKey: 'Город',
          значение: 'Beaumont'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bedford'
        },
        {
          dimensionKey: 'Город',
          значение: 'Belleville'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bellevue'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bellingham'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bethlehem'
        },
        {
          dimensionKey: 'Город',
          значение: 'Beverly'
        },
        {
          dimensionKey: 'Город',
          значение: 'Billings'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bloomington'
        },
        {
          dimensionKey: 'Город',
          значение: 'Boca Raton'
        },
        {
          dimensionKey: 'Город',
          значение: 'Boise'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bolingbroхорошо'
        },
        {
          dimensionKey: 'Город',
          значение: 'Bossier Город'
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
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: значение => {
            возврат '$' + число(значение).toFixed(2);
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
          format: значение => {
            if (значение) возврат '$' + число(значение).toFixed(2);
            else возврат '--';
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
          format: значение => {
            возврат '$' + число(значение).toFixed(2);
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
      изменение размера: {
        columnResizeMode: 'header'
        //columnResizeType:'все',
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
