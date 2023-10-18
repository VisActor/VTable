---
category: examples
group: data-analysis
title: Indicator Aggregation Type
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-aggregation.png
link: '../guide/table_type/Pivot_table/pivot_table_dataAnalysis'
---

# Indicator Aggregation Type

To pivot analysis table data data filtering rules, configure aggregationRules in dataConfig.

## Key Configurations

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `enableDataAnalysis` turns on pivot data analysis
- `dataConfig` configures data rules，set aggregationRules
## 代码演示

```javascript livedemo template=vtable
const sumNumberFormat = VTable.DataStatistics.numberFormat({
  prefix: '$'
});
const countNumberFormat = VTable.DataStatistics.numberFormat({
  digitsAfterDecimal: 0,
  thousandsSep: '',
  suffix: ' orders'
});
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
  records:data,
  "rows": [
      {
         "dimensionKey": "Category",
          "title": "Category",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
      {
         "dimensionKey": "Sub-Category",
          "title": "Sub-Catogery",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
  ],
  "columns": [
      {
         "dimensionKey": "Region",
          "title": "Region",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
      {
         "dimensionKey": "Segment",
          "title": "Segment",
          "headerStyle": {
              "textStick": true
          },
          "width": "auto",
      },
  ],
  indicators: ['TotalSales', 'OrderCount', 'AveragePrice'],
  "corner": {
      "titleOnDimension": "row",
      "headerStyle": {
          "textStick": true
      }
  },
  dataConfig: {
    aggregationRules: [
        //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
        {
          indicatorKey: 'TotalSales', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.SUM, //计算类型
          formatFun: sumNumberFormat
        },
        {
          indicatorKey: 'OrderCount', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.COUNT, //计算类型
          formatFun: countNumberFormat
        },
        {
          indicatorKey: 'AveragePrice', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.AVG, //计算类型
          formatFun: sumNumberFormat
        }
      ]
  },
  enableDataAnalysis: true,
  widthMode:'autoWidth'
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
})
```
