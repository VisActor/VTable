---
категория: примеры
группа: table-type
заголовок: Pivot analysis table (indicators are displayed in rows)
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-table-indicator-row.png
ссылка: data_analysis/pivot_table_dataAnalysis
опция: PivotTable#indicatorsAsCol
---

# Pivot analysis table indicators are displayed in rows

Pivot analysis table indicators are displayed in rows, configure indicatorsAsCol to false

## Ключевые Конфигурации

- `PivotTable` table type
- `columns` column dimension configuration
- `rows` row dimension configuration
- `indicators` indicator configuration
- `indicatorsAsCol` sets whether indicators are displayed in columns or rows. The default is to display them in columns.
- `indicatorTitle` is the indicator name displayed in the header
- `dataConfig` configures data rules, опцияal configuration items

## Демонстрация кода

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Город',
          title: 'Город',
          headerStyle: {
            textStick: true
          }
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
            fontWeight: 'normal',
            color: 'purple'
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
            fontWeight: 'normal',
            color: 'red'
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
            fontWeight: 'normal',
            color: 'green'
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
      indicatorTitle: 'indicators title',
      indicatorsAsCol: false,
      dataConfig: {
        sortRules: [
          {
            sortField: 'Категория',
            sortBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ]
      },
      defaultHeaderColWidth: [120, 'auto'],
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
