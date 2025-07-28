---
category: examples
group: data-analysis
title: Indicator Aggregation Type
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-aggregation.png
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.aggregationRules
---

# Indicator Aggregation Type

To pivot analysis table data data filtering rules, configure aggregationRules in dataConfig.

## Key Configurations

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` configures data rules，set aggregationRules

## Code demo

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
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region',
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
      indicators: ['TotalSales', 'OrderCount', 'AverageOrderSales'],
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
            indicatorKey: 'TotalSales', //Indicator name
            field: 'Sales', //The field  which the indicator is based
            aggregationType: VTable.TYPES.AggregationType.SUM, //Calculation type
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'OrderCount', //Indicator name
            field: 'Sales', //The field  which the indicator is based
            aggregationType: VTable.TYPES.AggregationType.COUNT, //Calculation type
            formatFun: countNumberFormat
          },
          {
            indicatorKey: 'AverageOrderSales', //Indicator name
            field: 'Sales', //The field  which the indicator is based
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
