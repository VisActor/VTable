---
категория: примеры
группа: data-analysis
заголовок: Сортировка Indicator
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-Сортировка-indicator.png
ссылка: data_analysis/pivot_table_dataAnalysis
опция: PivotTable#dataConfig.СортировкаRules
---

# Pivot analysis table is Сортировкаed by indicator value

The сводная таблица is Сортировкаed according to the dimension value of a certain dimension. СортировкаRules can be configured in dataConfig. Multiple Сортировкаing rules can be configured. The one configured first has a higher priority. In this example, the indicators indicator is configured with Сортировка:true, which will display a Сортировка icon in the header cell that displays the indicator name. Click the icon to Сортировка by indicator value.

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
            textStick: true,
            bgColor(arg) {
              if (arg.dataValue === 'Row Totals') {
                return '#ff9900';
              }
              return '#ECF1F5';
            }
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
          sort: true,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                return '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                return '#ff9900';
              }
              return undefined;
            }
          }
        },
        {
          indicatorKey: 'Продажи',
          title: 'Продажи',
          width: 'auto',
          sort: true,
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
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                return '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                return '#ff9900';
              }
              return undefined;
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
            },
            bgColor(arg) {
              const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
              if (rowHeaderPaths?.[1]?.value === 'Sub Totals') {
                return '#ba54ba';
              } else if (rowHeaderPaths?.[0]?.value === 'Row Totals') {
                return '#ff9900';
              }
              return undefined;
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'row'
      },
      dataConfig: {
        sortRules: [
          {
            sortField: 'Подкатегория',
            sortByIndicator: 'Продажи',
            sortType: VTable.TYPES.SortType.DESC,
            query: ['East', 'Consumer']
          },
          {
            sortField: 'Регион',
            sortBy: ['East', 'Central']
          }
        ]
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
