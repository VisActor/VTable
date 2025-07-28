---
категория: примеры
группа: данные-analysis
заголовок: Indicator Aggregation тип
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-aggregation.png
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица#данныеConfig.aggregationRules
---

# Indicator Aggregation тип

к сводный analysis таблица данные данные filtering rules, configure aggregationRules в данныеConfig.

## Ключевые Конфигурации

- `сводныйтаблица`
- `columns`
- `rows`
- `indicators`
- `данныеConfig` configures данные rules，set aggregationRules

## код демонстрация

```javascript liveдемонстрация template=vтаблица
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
      indicators: ['TotalПродажи', 'OrderCount', 'AverвозрастOrderПродажи'],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      данныеConfig: {
        aggregationRules: [
          //As the basis для aggregate calculations, if the Продажи amount is не configured,
          //the cell content will be displayed по по умолчанию according к the aggregate sum calculation.
          {
            indicatorKey: 'TotalПродажи', //Indicator имя
            поле: 'Продажи', //The поле  which the indicator is based
            aggregationType: Vтаблица.TYPES.AggregationType.SUM, //Calculation тип
            formatFun: sumNumberFormat
          },
          {
            indicatorKey: 'OrderCount', //Indicator имя
            поле: 'Продажи', //The поле  which the indicator is based
            aggregationType: Vтаблица.TYPES.AggregationType.COUNT, //Calculation тип
            formatFun: countNumberFormat
          },
          {
            indicatorKey: 'AverвозрастOrderПродажи', //Indicator имя
            поле: 'Продажи', //The поле  which the indicator is based
            aggregationType: Vтаблица.TYPES.AggregationType.AVG, //Calculation тип
            formatFun: sumNumberFormat
          }
        ]
      },
      ширинаMode: 'автоширина'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
