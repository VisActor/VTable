---
категория: примеры
группа: data-analysis
заголовок: Pivot Analysis Update Subtotal Total Using Editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-updateTotalData.gif
ссылка: data_analysis/pivot_table_dataAnalysis
опция: PivotTable#dataConfig.updateAggregationOnEditCell
---

# Pivot Analysis - Update Subtotal Total Using Editor

To summarize table data in pivot analysis, configure totals in dataConfig to set the total subtotal of the row and column dimensions, and configure updateAggregationOnEditCell to true to update the subtotal total when editing the cell.

## Ключевые Конфигурации

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig`
- `updateAggregationOnEditCell` When updateAggregationOnEditCell is true, the subtotal total will be updated when editing the cell.

## Демонстрация кода

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
      indicators: ['TotalПродажи', 'OrderCount', 'AverageOrderПродажи', 'MaxOrderПродажи', 'MinOrderПродажи'],
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
            indicatorKey: 'TotalПродажи', //指标名称
            field: 'Продажи', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.SUM, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'OrderCount', //指标名称
            field: 'Продажи', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.COUNT, //计算类型
            formatFun: countNumberFormat
          },
          {
            indicatorKey: 'AverageOrderПродажи', //指标名称
            field: 'Продажи', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.AVG, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'MaxOrderПродажи', //指标名称
            field: 'Продажи', //指标依据字段
            aggregationType: VTable.TYPES.AggregationType.MAX, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'MinOrderПродажи', //指标名称
            field: 'Продажи', //指标依据字段
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
