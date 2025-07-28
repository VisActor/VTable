---
категория: примеры
группа: данные-analysis
заголовок: пользовательский Aggregator Types для сводный таблицаs
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-analysis-пользовательскийAggregator.png
ссылка: данные_analysis/сводный_таблица_данныеAnalysis
опция: сводныйтаблица#данныеConfig.aggregationRules
---

# сводный Analysis - пользовательский Aggregator тип

сводный analysis таблицаs can perform aggregation calculations на сводный таблица metrics through the aggregationRules configuration item в the данныеConfig. в addition к the built-в aggregation types such as SUM, COUNT, AVERвозраст, MAX, и MIN, пользовательский aggregation types are also supported. к use пользовательский aggregation types, you need к первый define a пользовательский aggregation class that inherits от the built-в Aggregator class, регистрация it к Vтаблица, и then implement the aggregation logic в the пользовательский aggregation class.

## Ключевые Конфигурации

- `сводныйтаблица`
- `columns`
- `rows`
- `indicators`
- `данныеConfig.aggregationRules` configures the aggregation полеs

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
class AvgPriceAggregator extends Vтаблица.TYPES.Aggregator {
  Продажи_sum = 0;
  number_sum = 0;
  constructor(config) {
    super(config);
    this.key = config.key;
    this.formatFun = config.formatFun;
  }
  push(record) {
    if (record) {
      if (record.isAggregator) {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }

      if (record.isAggregator) {
        this.Продажи_sum += record.Продажи_sum;
        this.number_sum += record.number_sum;
      } else {
        record.Продажи && (this.Продажи_sum += parseFloat(record.Продажи));
        record.Количество && (this.number_sum += parseFloat(record.Количество));
      }
    }
    this.clearCacheValue();
  }

  clearCacheValue() {
    this._formatedValue = undefined;
  }
  значение() {
    возврат this.records?.length >= 1 ? this.Продажи_sum / this.number_sum : undefined;
  }
  reset() {
    super.reset();
    this.Продажи_sum = 0;
    this.number_sum = 0;
  }
}
Vтаблица.регистрация.aggregator('avgPrice', AvgPriceAggregator);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.данныеValue === 'Row Totals') {
                возврат '#ff9900';
              }
              возврат '#ECF1F5';
            }
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.данныеValue === 'Sub Totals') {
                возврат '#ba54ba';
              }
              возврат '#ECF1F5';
            }
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
      indicators: [
        {
          indicatorKey: 'AvgPrice(Calculatedполе)',
          заголовок: 'AvgPrice',
          ширина: 'авто',
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          }
        },
        { indicatorKey: 'AvgPrice(пользовательскийAggregator)', заголовок: 'AvgPrice пользовательскийAggregator', ширина: 'авто' }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      данныеConfig: {
        aggregationRules: [
          {
            indicatorKey: 'AvgPrice(пользовательскийAggregator)',
            aggregationType: 'avgPrice',
            поле: ['Продажи', 'Количество'] // полеs used для aggregation calculation logic
          }
        ],
        calculatedполеRules: [
          {
            key: 'AvgPrice(Calculatedполе)',
            dependIndicatorKeys: ['Количество', 'Продажи'],
            calculateFun: dependValue => {
              возврат dependValue.Продажи / dependValue.Количество;
            }
          }
        ],
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Категория'],
            grandTotalLabel: 'Row Totals',
            subTotalLabel: 'Sub Totals'
          },
          column: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Регион'],
            grandTotalLabel: 'Column Totals',
            subTotalLabel: 'Sub Totals'
          }
        }
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
