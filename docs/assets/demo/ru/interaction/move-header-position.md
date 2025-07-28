---
категория: примеры
группа: Interaction
заголовок: Move header position
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/move-header-position.gif
порядок: 4-5
ссылка: interaction/drag_header
опция: ListTable#dragOrder.dragHeaderMode
---

# Move header position

Click the header to select a row or column, and drag and drop to move.

## Ключевые Конфигурации

- `dragHeaderMode` Drag and drop the entire row or column of the header to change the position, and опцияal configuration items:`'all' | 'none' | 'header' | 'body'`, the default is`none`

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
          value: 'Akron'
        },
        {
          dimensionKey: 'Город',
          value: 'Albuquerque'
        },
        {
          dimensionKey: 'Город',
          value: 'Alexandria'
        },
        {
          dimensionKey: 'Город',
          value: 'Allen'
        },
        {
          dimensionKey: 'Город',
          value: 'Allentown'
        },
        {
          dimensionKey: 'Город',
          value: 'Altoona'
        },
        {
          dimensionKey: 'Город',
          value: 'Amarillo'
        },
        {
          dimensionKey: 'Город',
          value: 'Anaheim'
        },
        {
          dimensionKey: 'Город',
          value: 'Andover'
        },
        {
          dimensionKey: 'Город',
          value: 'Ann Arbor'
        },
        {
          dimensionKey: 'Город',
          value: 'Antioch'
        },
        {
          dimensionKey: 'Город',
          value: 'Apopka'
        },
        {
          dimensionKey: 'Город',
          value: 'Apple Valley'
        },
        {
          dimensionKey: 'Город',
          value: 'Appleton'
        },
        {
          dimensionKey: 'Город',
          value: 'Arlington'
        },
        {
          dimensionKey: 'Город',
          value: 'Arlington Heights'
        },
        {
          dimensionKey: 'Город',
          value: 'Arvada'
        },
        {
          dimensionKey: 'Город',
          value: 'Asheville'
        },
        {
          dimensionKey: 'Город',
          value: 'Athens'
        },
        {
          dimensionKey: 'Город',
          value: 'Atlanta'
        },
        {
          dimensionKey: 'Город',
          value: 'Atlantic Город'
        },
        {
          dimensionKey: 'Город',
          value: 'Auburn'
        },
        {
          dimensionKey: 'Город',
          value: 'Aurora'
        },
        {
          dimensionKey: 'Город',
          value: 'Austin'
        },
        {
          dimensionKey: 'Город',
          value: 'Avondale'
        },
        {
          dimensionKey: 'Город',
          value: 'Bakersfield'
        },
        {
          dimensionKey: 'Город',
          value: 'Baltimore'
        },
        {
          dimensionKey: 'Город',
          value: 'Bangor'
        },
        {
          dimensionKey: 'Город',
          value: 'Bartlett'
        },
        {
          dimensionKey: 'Город',
          value: 'Bayonne'
        },
        {
          dimensionKey: 'Город',
          value: 'Baytown'
        },
        {
          dimensionKey: 'Город',
          value: 'Beaumont'
        },
        {
          dimensionKey: 'Город',
          value: 'Bedford'
        },
        {
          dimensionKey: 'Город',
          value: 'Belleville'
        },
        {
          dimensionKey: 'Город',
          value: 'Bellevue'
        },
        {
          dimensionKey: 'Город',
          value: 'Bellingham'
        },
        {
          dimensionKey: 'Город',
          value: 'Bethlehem'
        },
        {
          dimensionKey: 'Город',
          value: 'Beverly'
        },
        {
          dimensionKey: 'Город',
          value: 'Billings'
        },
        {
          dimensionKey: 'Город',
          value: 'Bloomington'
        },
        {
          dimensionKey: 'Город',
          value: 'Boca Raton'
        },
        {
          dimensionKey: 'Город',
          value: 'Boise'
        },
        {
          dimensionKey: 'Город',
          value: 'Bolingbrook'
        },
        {
          dimensionKey: 'Город',
          value: 'Bossier Город'
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
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            return '$' + Number(value).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
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
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            else return '--';
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
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
          format: value => {
            return '$' + Number(value).toFixed(2);
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
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
      widthMode: 'standard',
      dragOrder: {
        dragHeaderMode: 'column'
      }
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
