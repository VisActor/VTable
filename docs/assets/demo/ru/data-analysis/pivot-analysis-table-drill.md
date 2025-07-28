---
категория: примеры
группа: data-analysis
заголовок: Pivot analysis table drill down and drill up
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-table-drill.gif
ссылка: data_analysis/pivot_table_dataAnalysis
опция: PivotTable-columns-text#drillDown
---

# Pivot analysis table drill down and drill up

Add the drillDown configuration item to the dimension configuration rows or columns to display the download button, listen to the icon button click событие `drillmenu_click`, determine whether to drill down or roll up the dimension according to the событие parameter `drillDown` or `drillUp`, determine the dimension to drill down or drill up according to the parameter `dimensionKey`, add or delete it to rows or columns, obtain the data source corresponding to the new dimension level, and call the interface `updateOption` to update the new опция to the table.

In the demo example below, if you hover the mouse over the row dimension, a drill-down button will appear. Clicking it will add `Sub-Category` to the row dimension.

## Ключевые Конфигурации

- `PivotTable` table type
- `columns` column dimension configuration
- `columns.drillDown` dimension drill-down configuration
- `columns.drillUp` dimension drill-up configuration
- `rows` row dimension configuration
- `indicators` indicator configuration

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
const data = [
  {
    Регион: 'Central',
    Категория: 'Furniture',
    Количество: '16'
  },
  {
    Регион: 'Central',
    Категория: 'Furniture',
    Количество: '4'
  },
  {
    Регион: 'Central',
    Категория: 'Office Supplies',
    Продажи: '37.90399980545044'
  },
  {
    Регион: 'Central',
    Категория: 'Office Supplies',
    Продажи: '62.22999954223633'
  },
  {
    Регион: 'Central',
    Категория: 'Technology',
    Количество: '10'
  },
  {
    Регион: 'Central',
    Категория: 'Technology',
    Количество: '4'
  },
  {
    Регион: 'East',
    Категория: 'Furniture',
    Количество: '7'
  },
  {
    Регион: 'East',
    Категория: 'Furniture',
    Количество: '18'
  },
  {
    Регион: 'East',
    Категория: 'Office Supplies',
    Количество: '7'
  },
  {
    Регион: 'East',
    Категория: 'Office Supplies',
    Количество: '17'
  },
  {
    Регион: 'East',
    Категория: 'Office Supplies',
    Количество: '7'
  },
  {
    Регион: 'East',
    Категория: 'Office Supplies',
    Количество: '17'
  },
  {
    Регион: 'South',
    Категория: 'Furniture',
    Количество: '4'
  },
  {
    Регион: 'South',
    Категория: 'Furniture',
    Количество: '6'
  },
  {
    Регион: 'South',
    Категория: 'Technology',
    Прибыль: '4.361999988555908'
  },
  {
    Регион: 'South',
    Категория: 'Technology',
    Прибыль: '280.58800506591797'
  }
];
const option = {
  records: data,
  rows: [
    {
      dimensionKey: 'Категория',
      title: 'Категория',
      drillDown: true,
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: 'Регион',
      title: 'Регион',
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
  widthMode: 'standard'
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
const newData = [
  {
    Регион: 'Central',
    Категория: 'Furniture',
    Количество: '16',
    'Подкатегория': 'Chairs'
  },
  {
    Регион: 'Central',
    Категория: 'Furniture',
    Количество: '4',
    'Подкатегория': 'Tables'
  },
  {
    Регион: 'Central',
    Категория: 'Office Supplies',
    Продажи: '37.90399980545044',
    'Подкатегория': 'Paper'
  },
  {
    Регион: 'Central',
    Категория: 'Office Supplies',
    Продажи: '62.22999954223633',
    'Подкатегория': 'Appliances'
  },
  {
    Регион: 'Central',
    Категория: 'Technology',
    Количество: '10',
    'Подкатегория': 'Phones'
  },
  {
    Регион: 'Central',
    Категория: 'Technology',
    Количество: '4',
    'Подкатегория': 'Accessories'
  },
  {
    Регион: 'East',
    Категория: 'Furniture',
    Количество: '7',
    'Подкатегория': 'Bookcases'
  },
  {
    Регион: 'East',
    Категория: 'Furniture',
    Количество: '18',
    'Подкатегория': 'Furnishings'
  },
  {
    Регион: 'East',
    Категория: 'Office Supplies',
    Количество: '7',
    'Подкатегория': 'Paper'
  },
  {
    Регион: 'East',
    Категория: 'Office Supplies',
    Количество: '17',
    'Подкатегория': 'Binders'
  },
  {
    Регион: 'South',
    Категория: 'Furniture',
    Количество: '4',
    'Подкатегория': 'Furnishings'
  },
  {
    Регион: 'South',
    Категория: 'Furniture',
    Количество: '6',
    'Подкатегория': 'Tables'
  },
  {
    Регион: 'South',
    Категория: 'Technology',
    Прибыль: '4.361999988555908',
    'Подкатегория': 'Accessories'
  },
  {
    Регион: 'South',
    Категория: 'Technology',
    Прибыль: '280.58800506591797',
    'Подкатегория': 'Phones'
  }
];
tableInstance.on('drillmenu_click', args => {
  if (args.drillDown) {
    if (args.dimensionKey === 'Категория') {
      tableInstance.updateOption({
        records: newData,
        rows: [
          {
            dimensionKey: 'Категория',
            title: 'Категория',
            drillUp: true,
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          },
          {
            dimensionKey: 'Подкатегория',
            title: 'Sub-Catogery',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Регион',
            title: 'Регион',
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
        widthMode: 'standard'
      });
    }
  } else if (args.drillUp) {
    if (args.dimensionKey === 'Категория') {
      tableInstance.updateOption({
        records: data,
        rows: [
          {
            dimensionKey: 'Категория',
            title: 'Категория',
            drillDown: true,
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Регион',
            title: 'Регион',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
          //  {
          //    "dimensionKey": "Order Year",
          //     "title": "Order Year",
          //     "headerStyle": {
          //         "textStick": true
          //     },
          //     "width": "auto",
          // },
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
        widthMode: 'standard'
      });
    }
  }
});
```
