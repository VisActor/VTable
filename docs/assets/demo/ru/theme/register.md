---
категория: примеры
группа: Theme
заголовок: Theme -register
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/register.png
порядок: 6-7
ссылка: theme_and_style/theme
опция: ListTable#theme.bodyStyle.bgColor
---

# Form Theme -register

Register a custom theme globally

## Ключевые Конфигурации

- `VTable.register.theme` Registering themes globally
- `theme: xxx` Specify the name of the registered theme

## Демонстрация кода

```javascript livedemo template=vtable
VTable.register.theme('themeRegisterOne', {
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
});
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
      theme: 'themeRegisterOne'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
