---
категория: примеры
группа: данные-analysis
заголовок: сводный Analysis Update Subtotal Total Using Editor
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-updateTotalданные.gif
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица#данныеConfig.updateAggregationOnEditCell
---

# сводный Analysis - Update Subtotal Total Using Editor

к summarize таблица данные в сводный analysis, configure totals в данныеConfig к set the total subtotal из the row и column dimensions, и configure updateAggregationOnEditCell к true к update the subtotal total when editing the cell.

## Ключевые Конфигурации

- `сводныйтаблица`
- `columns`
- `rows`
- `indicators`
- `данныеConfig`
- `updateAggregationOnEditCell` When updateAggregationOnEditCell is true, the subtotal total will be updated when editing the cell.

## код демонстрация

```javascript liveдемонстрация template=vтаблица
const input_editor = новый Vтаблица_editors.InputEditor();
Vтаблица.регистрация.editor('ввод', input_editor);
const sumNumberFormat = Vтаблица.данныеStatistics.numberFormat({
  prefix: '$'
});
const countNumberFormat = Vтаблица.данныеStatistics.numberFormat({
  digitsAfterDecimal: 0,
  thousandsSep: '',
  suffix: ' orders'
});
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Регион',
          заголовок: 'Регион',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Segment',
          заголовок: 'Segment',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      indicators: ['TotalПродажи', 'OrderCount', 'AverвозрастOrderПродажи', 'MaxOrderПродажи', 'MinOrderПродажи'],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      данныеConfig: {
        updateAggregationOnEditCell: true,
        aggregationRules: [
          //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
          {
            indicatorKey: 'TotalПродажи', //指标名称
            поле: 'Продажи', //指标依据字段
            aggregationType: Vтаблица.TYPES.AggregationType.SUM, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'OrderCount', //指标名称
            поле: 'Продажи', //指标依据字段
            aggregationType: Vтаблица.TYPES.AggregationType.COUNT, //计算类型
            formatFun: countNumberFormat
          },
          {
            indicatorKey: 'AverвозрастOrderПродажи', //指标名称
            поле: 'Продажи', //指标依据字段
            aggregationType: Vтаблица.TYPES.AggregationType.AVG, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'MaxOrderПродажи', //指标名称
            поле: 'Продажи', //指标依据字段
            aggregationType: Vтаблица.TYPES.AggregationType.MAX, //计算类型
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'MinOrderПродажи', //指标名称
            поле: 'Продажи', //指标依据字段
            aggregationType: Vтаблица.TYPES.AggregationType.MIN, //计算类型
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
      editor: 'ввод',
      ширинаMode: 'автоширина'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = таблицаInstance;
  });
```
