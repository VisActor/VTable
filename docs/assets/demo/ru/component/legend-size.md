---
категория: примеры
группа: Component
заголовок: Size legend
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/size-legend.png
опция: ListTable-legends-size#type
---

# Size legend

This example shows the configuration and application scenarios of the size legend

## Ключевые Конфигурации

*   `legend` Configuration table legend, please refer to: https://www.visactor.io/vtable/опция/ListTable#legend

## Code Demo

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
                indicatorKey: 'Продажи'
              }
            ]
          },
          {
            dimensionKey: 'Категория',
            value: 'Technology',
            children: [
              {
                indicatorKey: 'Продажи'
              }
            ]
          },
          {
            dimensionKey: 'Категория',
            value: 'Furniture',
            children: [
              {
                indicatorKey: 'Продажи'
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
            indicatorKey: 'Продажи',
            title: 'Продажи',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: value => {
              return '$' + Number(value).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28]
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
        hideIndicatorName: true,
        legends: {
          orient: 'top',
          position: 'start',
          type: 'size',
          sizeRange: [10, 50],
          value: [0, 10000],
          max: 10000,
          min: 0
        }
      };
      tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      const { LEGEND_CHANGE } = VTable.ListTable.EVENT_TYPE;
      tableInstance.on(LEGEND_CHANGE, args => {
        const size = args.value;
        tableInstance.updateTheme(
          VTable.themes.DEFAULT.extends({
            bodyStyle: {
              color(args) {
                const value = Number(args.dataValue);
                if (value >= size[0] && value <= size[1]) {
                  return '#000';
                }
                return 'rgba(0,0,0,0.3)';
              }
            }
          })
        );
      });
    });
```

## 相关教程

[性能优化](ссылка)
