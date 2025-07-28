---
категория: примеры
группа: data-analysis
заголовок: Indicator Aggregation Type
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-aggregation.png
ссылка: data_analysis/pivot_table_dataAnalysis
опция: PivotTable#dataConfig.aggregationRules
---

# Indicator Aggregation Type

To pivot analysis table data data filtering rules, configure aggregationRules in dataConfig.

## Ключевые Конфигурации

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` configures data rules，set aggregationRules

## Демонстрация кода

```javascript livedemo template=vtable
const sumNumberFormat = VTable.DataStatistics.numberFormat({
  prefix: '$'
});
const countNumberFormat = VTable.DataStatistics.numberFormat({
  digitsAfterDecimal: 0,
  thousandsSep: '',
  suffix: ' orders'
});
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
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
      indicators: ['TotalПродажи', 'OrderCount', 'AverageOrderПродажи'],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      dataConfig: {
        aggregationRules: [
          //As the basis for aggregate calculations, if the sales amount is not configured,
          //the cell content will be displayed by default according to the aggregate sum calculation.
          {
            indicatorKey: 'TotalПродажи', //Indicator name
            field: 'Продажи', //The field  which the indicator is based
            aggregationType: VTable.TYPES.AggregationType.SUM, //Calculation type
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'OrderCount', //Indicator name
            field: 'Продажи', //The field  which the indicator is based
            aggregationType: VTable.TYPES.AggregationType.COUNT, //Calculation type
            formatFun: countNumberFormat
          },
          {
            indicatorKey: 'AverageOrderПродажи', //Indicator name
            field: 'Продажи', //The field  which the indicator is based
            aggregationType: VTable.TYPES.AggregationType.AVG, //Calculation type
            formatFun: sumNumberFormat
          }
        ]
      },
      widthMode: 'autoWidth'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
