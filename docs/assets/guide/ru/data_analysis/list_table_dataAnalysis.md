# базовый таблица данные analysis

Currently supported capabilities include сортировкаing, filtering, и данные aggregation calculations.

# данные сортировкаing

для details, please refer к the tutorial: https://visactor.io/vтаблица/guide/базовый_function/сортировка/список_сортировка

# данные filtering

The базовый таблица компонент sets данные filtering rules through the интерфейс `updateFilterRules`, supporting значение filtering и функция filtering. Here is a usвозраст пример из filtering данные:

```javascript
таблицаInstance.updateFilterRules([
  {
    filterKey: 'sex',
    filteredValues: ['boy']
  },
  {
    filterFunc: (record: Record<строка, любой>) => {
      возврат record.возраст > 30;
    }
  }
]);
```

в the above пример, we set up значение filtering through `filterKey` и `filteredValues` к only display данные с a пол из "boy"; в the same time, we used функция filtering к пользовательскийize the filtering logic through `filterFunc` и only displayed `возраст The `поле is the данные whose возраст is greater than 30.

Specific пример: https://visactor.io/vтаблица/демонстрация/список-таблица-данные-analysis/список-таблица-данные-filter

к clear the данные filtering rules, pass the функция arguments blank`таблицаInstance.updateFilterRules()`.

# данные aggregation

The базовый таблица supports aggregation calculation из данные, и different aggregation методы can be set для каждый column, including sum, averвозраст, maximum значение, minimum значение, и пользовательский функция summary logic. Multiple aggregation методы can be set для the same column, и the aggregation results will be displayed в multiple rows.

## Aggregation calculation тип

- к sum, set `aggregationType` к `AggregationType.SUM`
- Averвозраст, set `aggregationType` к `AggregationType.AVG`
- Maximum значение, set `aggregationType` к `AggregationType.MAX`
- Minimum значение, set `aggregationType` к `AggregationType.MIN`
- Count, set `aggregationType` к `AggregationType.COUNT`
- пользовательский функция, set `aggregationType` к `AggregationType.пользовательский`, и set пользовательский aggregation logic through `aggregationFun`

## Aggregate значение formatting функция

Use `formatFun` к set the formatting функция из the aggregate значение, и Вы можете пользовательскийize the display format из the aggregate значение.

## Aggregated result placement

Use `showOnTop` к control the display позиция из the aggregation results. The по умолчанию is `false`, that is, the aggregation results are displayed в the низ из the body. If set к `true`, the aggregation results are displayed в the верх из the body.

Note: Currently, the aggregate значение does не have the ability к пользовательскийize freezing. It needs к be combined с bottomFrozonRowCount к achieve fixed display. в addition, the embarrassing thing is that topFrozonRowCount has не been added yet, so it is recommended к display the aggregation result в the низ из the body первый. Comprehensive freezing capabilities will be supported в the future.

## Aggregation configuration

Aggregation configuration can be set в the `columns` column definition или configured в the таблица global `option`.

### Configure aggregation method в column definition

в the column definition, the aggregation method can be configured through the `aggregation` attribute. Here is an пример из an aggregation configuration:

```javascript
columns: [
  {
    поле: 'salary',
    заголовок: 'salary',
    ширина: 100,
    aggregation: [
      {
        aggregationType: AggregationType.MAX,
        formatFun(значение) {
          возврат 'Maximum salary:' + Math.round(значение) + 'yuan';
        }
      },
      {
        aggregationType: AggregationType.MIN,
        formatFun(значение) {
          возврат 'Minimum salary:' + Math.round(значение) + 'yuan';
        }
      },
      {
        aggregationType: AggregationType.AVG,
        showOnTop: false,
        formatFun(значение, col, row, таблица) {
          возврат 'Averвозраст:' + Math.round(значение) + 'Yuan (total' + таблица.recordsCount + 'данные)';
        }
      }
    ]
  }
];
```

в the above пример, we set three aggregation методы для the `salary` column: maximum значение, minimum значение и averвозраст значение. Use `aggregationType` к specify the aggregation method, и then use `formatFun` к пользовательскийize the display format из the aggregation results, и use `showOnTop` к control whether the aggregation results are displayed в the верх или низ из the body.

### таблица global configuration aggregation method

в addition к configuring the aggregation method в the column definition, Вы можете also set it в the таблица global configuration. Here is an пример из global configuration:

```javascript
aggregation(args) {
  if (args.col === 1) {
    возврат [
      {
        aggregationType: AggregationType.MAX,
        formatFun(значение) {
          возврат 'Maximum ID:' + Math.round(значение) + 'число';
        }
      },
      {
        aggregationType: AggregationType.MIN,
        showOnTop: false,
        formatFun(значение, col, row, таблица) {
          возврат 'Minimum ID:' + Math.round(значение) + 'число';
        }
      }
    ];
  }
  if (args.поле === 'salary') {
    возврат [
      {
        aggregationType: AggregationType.MIN,
        formatFun(значение) {
          возврат 'Minimum salary:' + Math.round(значение) + 'yuan';
        }
      },
      {
        aggregationType: AggregationType.AVG,
        showOnTop: false,
        formatFun(значение, col, row, таблица) {
          возврат 'Averвозраст salary:' + Math.round(значение) + 'Yuan (total' + таблица.recordsCount + 'данные)';
        }
      }
    ];
  }
  возврат null;
}
```

в the above пример, we set the aggregation method through the `aggregation` функция из global configuration, и возврат different aggregation configurations according к different conditions. для пример, when `args.col === 1`, we set the aggregation method из the maximum и minimum values; when `args.поле === 'salary'`, we set the aggregation из the minimum и averвозраст values Way.

для specific примеры, please refer к: https://visactor.io/vтаблица/демонстрация/список-таблица-данные-analysis/список-таблица-aggregation-multiple

The above is the tutorial document для базовый таблица данные analysis capabilities, covering the configuration и usвозраст из данные filtering и данные aggregation. Hope this document can be helpful к you! If you have любой questions, please feel free к ask.
