---
category: examples
group: data-analysis
title: 透视维度小计总计动态更新
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-updateTotalData.gif
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.updateAggregationOnEditCell
---

# 透视分析——小计总计动态更新

透视分析表格数据汇总，dataConfig 中配置 totals 来设置行列维度的小计总计, 配置 updateAggregationOnEditCell 为 true 时，编辑单元格时会动态更新小计总计，默认值为false。

## 关键配置

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig` 
- `updateAggregationOnEditCell` 为 true 时，编辑单元格时会动态更新小计总计。

## 代码演示

```javascript livedemo template=vtable
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input', input_editor);
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
      indicators: ['TotalSales', 'OrderCount', 'AverageOrderSales', 'MaxOrderSales', 'MinOrderSales'],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      dataConfig: {
        updateAggregationOnEditCell: true,
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
          },
          {
            indicatorKey: 'MaxOrderSales', //指标名称
            field: 'Sales', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.MAX, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'MinOrderSales', //指标名称
            field: 'Sales', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.MIN, //计算类型
            formatFun: sumNumberFormat
          }
        ],
        totals: {
          row: {
            showGrandTotals: true,
            grandTotalLabel: '行总计'
          },
          column: {
            showGrandTotals: true,
            grandTotalLabel: '列总计'
          }
        }
      },
      editor: 'input',
      widthMode: 'autoWidth'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
  });

```
