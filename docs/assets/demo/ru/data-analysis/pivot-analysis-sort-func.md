---
категория: примеры
группа: data-analysis
заголовок: Сортировка Function
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-Сортировка-func.png
ссылка: data_analysis/pivot_table_dataAnalysis
опция: PivotTable#dataConfig.СортировкаRules
---

# Custom Сортировкаing of pivot analysis table

The сводная таблица is Сортировкаed according to the dimension value of a certain dimension. СортировкаRules can be configured in dataConfig. Multiple Сортировкаing rules can be configured. The one configured first has a higher priority.

## Ключевые Конфигурации

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` configures data rules, опцияal configuration items

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Категория',
          title: 'Категория',
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
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment',
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
      dataConfig: {
        sortRules: [
          {
            sortField: 'Подкатегория',
            sortFunc: (a, b) => {
              const indexA = SubКатегорияOrder.indexOf(a);
              const indexB = SubКатегорияOrder.indexOf(b);
              return (indexA === -1 ? 100 : indexA) > (indexB === -1 ? 100 : indexB) ? 1 : -1;
            }
          }
        ]
      },
      widthMode: 'standard'
    };
    const SubКатегорияOrder = [
      'Chairs',
      'Tables',
      'Furnishings',
      'Bookcases',
      'Labels',
      'Paper',
      'Technology',
      'Appliances',
      'Art'
    ];
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
