---
category: examples
group: data-analysis
title: 指标聚合方式
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-aggregation.png
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.aggregationRules
---

# 指标聚合方式

透视分析表格数据数据过滤规则，在 dataConfig 中配置 aggregationRules

## 关键配置

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` 配置数据分析规则，配置 aggregationRules

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
            indicatorKey: 'AverageOrderSales', //指标名称
            field: 'Sales', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.AVG, //计算类型
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
