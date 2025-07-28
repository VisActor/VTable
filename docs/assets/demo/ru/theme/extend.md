---
категория: примеры
группа: Theme
заголовок: Theme -extends
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/extend.png
порядок: 6-5
ссылка: theme_and_style/theme
опция: ListTable#theme.bodyStyle.bgColor
---

# Table Theme -extends

Extend and modify based on a certain Theme built into the компонент

## Ключевые Конфигурации

- `VTable.themes.ARCO.extends` Configure Theme Name or Customize Theme Style

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
            return Number(value).toFixed(2);
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
        titleOnDimension: 'column',
        headerStyle: {
          textStick: true
        }
      },
      indicatorTitle: 'indicators',
      widthMode: 'standard',
      theme: VTable.themes.ARCO.extends({
        defaultStyle: {
          borderLineWidth: 0
        },
        headerStyle: {
          bgColor: '#a881e1',
          borderColor: 'white',
          fontWeight: 'normal',
          color: 'white'
        },
        rowHeaderStyle: {
          bgColor: '#eae1fa',
          borderColor: 'white',
          borderLineWidth: 1,
          fontWeight: 'normal'
        },
        cornerHeaderStyle: {
          bgColor: '#a881e1',
          fontWeight: 'normal',
          color: 'white'
        },
        bodyStyle: {
          borderColor: '#f1e8fe',
          borderLineWidth: 1,
          bgColor: args => {
            if (args.row & 1) {
              return '#f8f5fe';
            }
            return '#FDFDFD';
          }
        }
      })
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
