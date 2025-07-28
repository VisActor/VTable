# сводный данные analysis

в the figure below, there are four business dimensions: Регион, province, year, quarter, и indicators: Продажи, Прибыль.

 <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/сводный-analysis.png" />
    <p>сводный таблица structure description</p>
  </div>
Regarding the Продажи данные в the figure, the location is в cell [5, 5], that is, the данные в column 5 и row 5: represents the Продажи Прибыль значение из Heilongjiang Province в the Northeast Регион в the Q2 quarter из 2016. That is к say, it corresponds к the row dimension значение: ['Northeast', 'Heilongjiang'], the column dimension: ['2016', '2016-Q2'], и the indicator: 'Прибыль'. следующий, we will introduce how к use Vтаблица к implement this multi-dimensional таблица.

# Vтаблица implements multi-dimensional таблицаs

## Concept mapping к configuration items

The configuration из the сводный таблица above is as follows:

```
const option={
  rows:['Регион','province'], //row dimensions
  columns:['year','quarter'], //column dimensions
  indicators:['Продажи','Прибыль'], //Indicators //Whether к включить данные analysis функция
  records:[ //данные source。 If summary данные is passed в, use user incoming данные
    {
      Регион:'东北',
      province:'黑龙江',
      year:'2016',
      quarter:'2016-Q1',
      Продажи:1243,
      Прибыль:546
    },
    ...
  ]
}
```

This configuration is the simplest configuration для multidimensional таблицаs. As the functional requirements become more complex, various configurations can be added для каждый функция point к meet the needs.

## данные analysis related configuration:

| Configuration item              | тип                           | Description                                                                         |
| :------------------------------ | :----------------------------- | :---------------------------------------------------------------------------------- |
| rows                            | (IRowDimension \| строка)[]    | Row dimension поле массив, used к parse out the corresponding dimension members    |
| columns                         | (IColumnDimension \| строка)[] | Column dimension поле массив, used к parse out the corresponding dimension members |
| indicators                      | (IIndicator \| строка)[]       | Specific display indicators                                                         |
| данныеConfig.aggregationRules     | aggregationRule[]              | Aggregation значение calculation rules according к row и column dimensions          |
| данныеConfig.derivedполеRules    | DerivedполеRule[]             | Derived полеs                                                                      |
| данныеConfig.сортировкаRules            | сортировкаRule[]                     | сортировка rules                                                                          |
| данныеConfig.filterRules          | filterRule[]                   | Filter Rules                                                                        |
| данныеConfig.totals               | totalRule[]                    | Subtotal или total                                                                   |
| данныеConfig.calculatedполеRules | CalculateddполеRule[]         | calculated полеs                                                                   |

данныеConfig configuration definition:

```
/**
 * данные processing configuration
 */
export интерфейс IданныеConfig {
  aggregationRules?: AggregationRules; //Calculate the aggregated values according к row и column dimensions; по по умолчанию, все indicator values will be calculated по summing them up.
  сортировкаRules?: сортировкаRules; //排序规则；
  filterRules?: FilterRules; //过滤规则；
  totals?: Totals; //小计或总计；
  derivedполеRules?: DerivedполеRules; //派生字段定义
  ...
}
```

данныеConfig application пример:

### 1. Totals

#### Vтаблица к calculate subtotals configuration:

[option description](../../option/сводныйтаблица#данныеConfig.totals)

Configuration пример:

```
данныеConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
          grandTotalLabel: 'row total',
          subTotalLabel: 'Subtotal',
          showGrandTotalsOnTop: true //totals показать на верх
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['quarter'],
          grandTotalLabel: 'column total',
          subTotalLabel: 'Subtotal'
        }
      }
    },
```

Online демонстрация：https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-total

#### пользовательский summary данные

If you need к пользовательскийize summary данные, you do не want Vтаблица к calculate the subtotals. в addition к the above configuration, you also need к include the corresponding summary данные в the данные passed к Vтаблица. в this way, Vтаблица will analyze it internally и display it as summary данные instead из using Vтаблица's summary значение.

<div style="ширина: 50%; текст-align: центр;">
<img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/пользовательский-total-демонстрация.png" />
<p>пользовательский subtotal total sample код</p>
</div>

Specific пример: https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-пользовательский-total

### 2. сортировкаing rules

Vтаблица's сводный таблица supports four сортировкаing методы: natural сортировкаing из dimension values, specified dimension значение order, indicator значение сортировкаing, и пользовательский сортировкаing.

для definitions, please refer к:

[option description](../../option/сводныйтаблица#данныеConfig.сортировкаRules) [Usвозраст tutorial](../../guide/базовый_function/сортировка/сводный_сортировка)

Следующий is an пример из the indicator значение сортировкаing configuration:

```
данныеConfig: {
    сортировкаRules: [
        {
          сортировкаполе: 'Город',
          сортировкаByIndicator: 'Продажи',
          сортировкаType: Vтаблица.TYPES.сортировкаType.DESC,
          query: ['office supplies', 'pen']
        } as Vтаблица.TYPES.сортировкаByIndicatorRule
      ]
}
```

If you need к modify the сортировкаing rules из the сводный таблица, Вы можете use the интерфейс `updateсортировкаRules`.

Online демонстрация：https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-сортировка-dimension

### 3. Filter rules

[option description](../../option/сводныйтаблица#данныеConfig.filterRules)

Configuration пример:

```
данныеConfig: {
  filterRules: [
        {
          filterFunc: (record: Record<строка, любой>) => {
            возврат record.province !== 'Sichuan Province' || record.Категория !== 'Furniture';
          }
        }
      ]
}
```

Online демонстрация：https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-filter

### 4. Aggregation method

по по умолчанию, все indicator values are calculated в the `SUM` way. If you don't want this по умолчанию calculation method, Вы можете modify it по configuring `aggregationRules`.

в general, indicators should be из тип `число` so that internal calculations can be performed.

If the indicator is a строка тип или `null`, и needs к be displayed в the cell, Вы можете configure `aggregationType` as `Vтаблица.TYPES.AggregationType.никто` к display the original значение из the данные source поле; или Вы можете use the `getCellOriginRecord` интерфейс в the indicator format функция к obtain the данные source entry corresponding к the cell, и then perform special processing.

If you use пользовательский rendering `пользовательскиймакет` и want к get все the данные `records` corresponding к the cell в the `пользовательскиймакет` функция, Вы можете configure `aggregationType` as `Vтаблица.TYPES.AggregationType.RECORD`.

[option description](../../option/сводныйтаблица#данныеConfig.aggregationRules)

#### Configuration пример:

```
данныеConfig: {
    aggregationRules: [
        //The basis для doing aggregate calculations, such as Продажи. If there is no configuration, the cell content will be displayed по по умолчанию based на the aggregate sum calculation result.
        {
          indicatorKey: 'TotalПродажи', //Indicator имя
          поле: 'Продажи', //Indicator based на поле
          aggregationType: Vтаблица.TYPES.AggregationType.SUM, //Calculation тип
          formatFun: sumNumberFormat
        },
        {
          indicatorKey: 'OrderCount', //Indicator имя
          поле: 'Продажи', //Indicator based на поле
          aggregationType: Vтаблица.TYPES.AggregationType.COUNT, //Computation тип
          formatFun: countNumberFormat
        },
        {
          indicatorKey: 'AverвозрастOrderПродажи', //Indicator имя
          поле: 'Продажи', //Indicator based на поле
          aggregationType: Vтаблица.TYPES.AggregationType.AVG, //Computation тип
        },
        {
          indicatorKey: 'MaxOrderПродажи', //Indicator имя
          поле: 'Продажи', //Indicator based на поле
          aggregationType: Vтаблица.TYPES.AggregationType.MAX, //Computation тип , caculate max значение
        },
        {
          indicatorKey: 'OrderПродажиValue', //Indicator имя
          поле: 'Продажи', //Indicator based на поле
          aggregationType: Vтаблица.TYPES.AggregationType.никто, //don't aggregate
        },
        {
          indicatorKey: 'orderRecords', //Indicator имя
          поле: 'Продажи', //Indicator based на поле
          aggregationType: Vтаблица.TYPES.AggregationType.RECORD, //don't aggregate. Match все the corresponding данные as the значение из the cell
        },
        {
          indicatorKey: 'пользовательский Aggregation функция', //Indicator имя
          поле: 'Продажи', //Indicator based поле
          aggregationType: Vтаблица.TYPES.AggregationType.пользовательский, //пользовательский aggregation тип requires configuration из пользовательский функция aggregationFun
          aggregationFun(values, records) {
            возврат values.reduce((pre, cur) => pre + cur, 0) / values.length;
          }
        },
        {
          indicatorKey: 'Averвозраст Product Price (регистрацияed Aggregation Class)', //Indicator имя
          поле: 'Продажи', //Indicator based поле
          aggregationType: 'avgPrice', //регистрацияed aggregation тип
        }
      ]
}
```

Online демонстрация：https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-aggregation

#### 特殊聚合类型使用说明

**Special Note:**

1. AggregationType.никто The usвозраст scenario из the indicator без aggregation is mainly used к display the original данные obtained according к the данные record ввод по the user, such as:

```
records:[{
  Регион: 'Central South',
  province: 'Guangxi',
  year: '2016',
  quarter: '2016-Q1',
  Продажи: 'null',
  Прибыль: 1546
}],
данныеConfig:{
  aggregationRules:[
  {
    indicatorKey: 'Продажи', //Indicator имя
    поле: 'Продажи', //Indicator based поле
    aggregationType: Vтаблица.TYPES.AggregationType.никто, //Do не perform aggregation. Match the corresponding данные к obtain the значение из the corresponding поле.
  }]
}
```
  в this данные record, the Продажи indicator is a non-numeric значение. If the product requirement is к directly display `"null"` в the таблица cell, then the aggregation rule can be set к `Vтаблица.TYPES.AggregationType.никто`, so that Vтаблица's internal will не perform aggregation calculations, but directly take the `Продажи` поле значение as the display значение из the cell.

  2. AggregationType.RECORD usвозраст scenario is mainly used к match все данные based на the user's ввод данные record и use it as the display данные из the cell. Usвозраст scenarios include: needing к collect данные sets для mini-график displays, specific демонстрация see: https://visactor.io/vтаблица/демонстрация/cell-тип/сводный-sparkline

#### пользовательский Aggregation тип Introduction

к declare a пользовательский aggregation class, you need к inherit the internal тип `Vтаблица.TYPES.Aggregator`, и then регистрация it к Vтаблица through `Vтаблица.регистрация.aggregator`.

Here is an пример из a пользовательский aggregation class:

```
// Implement a пользовательский aggregation тип к calculate the averвозраст product price
class AvgPriceAggregator extends Vтаблица.TYPES.Aggregator {
  Продажи_sum: число = 0;
  number_sum: число = 0;
  constructor(config: { key: строка; поле: строка; formatFun?: любой }) {
    super(config);
    this.key = config.key;
    this.formatFun = config.formatFun;
  }
  push(record: любой): void {
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
        record.число && (this.number_sum += parseFloat(record.число));
      }
    }
    this.clearCacheValue();
  }
  deleteRecord: (record: любой) => void;
  updateRecord: (oldRecord: любой, newRecord: любой) => void;
  recalculate: () => любой;
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
// регистрация the aggregation тип к Vтаблица
Vтаблица.регистрация.aggregator('avgPrice', AvgPriceAggregator);
// Usвозраст after registration, в данныеConfig.aggregationRules, configure aggregationType as `avgPrice`.
const option={
  ...
  данныеConfig: {
    aggregationRules: [
        {
          indicatorKey: 'Averвозраст Product Price (регистрацияed Aggregation Class)', //Indicator имя
          поле: 'Продажи', //Indicator based поле
          aggregationType: 'avgPrice', //регистрацияed aggregation тип 
        }
      ]
  }
}
```

Vтаблица's internal aggregation rules код address: https://github.com/VisActor/Vтаблица/blob/develop/packвозрастs/vтаблица/src/ts-types/данныеset/aggregation.ts, can be referred к!

The методы that need к be implemented для the aggregation тип are:
- constructor: The constructor функция, used к initialize the aggregator.
- push: Add данные records к the aggregator, used к calculate the aggregated значение.
- deleteRecord: Delete records от the aggregator и update the aggregated значение, called по Vтаблица's delete интерфейс deleteRecords.
- updateRecord: Update данные records и update the aggregated значение, called по the updateRecords интерфейс.
- recalculate: Recalculate the aggregated значение, currently called по the method из copying и pasting cell values.
- значение: Get the aggregated значение.
- reset: Reset the aggregator.

If you feel that методы that do не need к be implemented can be written as empty functions.

### 5. Derive поле

[option description](../../option/сводныйтаблица#данныеConfig.derivedполеRules)

Configuration пример:

```
данныеConfig: {
    derivedполеRules: [
      {
        полеимя: 'Year',
        derivedFunc: Vтаблица.данныеStatistics.dateFormat('Дата Заказа', '%y', true),
      },
      {
        полеимя: 'Month',
        derivedFunc: Vтаблица.данныеStatistics.dateFormat('Дата Заказа', '%n', true),
      }
    ]
}
```

Online демонстрация：https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-derivedполе

### 6. сводный таблица calculated полеs

[option description](../../option/сводныйтаблица#данныеConfig.calculatedполеRules)

Configuration пример:

```
данныеConfig: {
  calculatedполеRules:[
    {
      key: 'AvgPrice',
      dependIndicatorKeys: ['Количество', 'Продажи'],
      calculateFun: dependValue => {
        возврат dependValue.Продажи / dependValue.Количество;
      }
    }
  ],
}
```

Configuration explanation:

- key: The key unique identifier из the calculated поле, which can be used as a новый indicator и configured в indicators для display в the сводный таблица.
- dependIndicatorKeys: The indicators that the calculated поле depends на, which can be the corresponding indicator полеs в records. If the dependent indicator is не в records, it needs к be configured в aggregationRules, specifying the aggregation rules и indicatorKey к be used в dependIndicatorKeys.
- calculateFun: the calculation функция из the calculated поле, the функция параметр is the значение из the dependent indicator.

Specific пример: https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-calculatedполе

## данные analysis process

Dependent configuration: dimensions, indicators и данныеConfig.

### The process из traversing данные:

Traverse the records once, parse the row header dimension значение к display the header cell, distribute все данные в the records к the corresponding row и column path set, и calculate the aggregate значение из the body part indicator cell.

 <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/данные-analysis-process.png" />
    <p>данные analysis process</p>
  </div>

### данные dimension tree

According к the above traversed structure, a dimension tree will be generated, от which the значение из the cell и the original данные entry из the значение can be found.

 <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/dimension-tree.png" />
    <p>Organize dimension tree к aggregate данные</p>
  </div>
  After analysis и calculation из record grouping и aggregation, the corresponding relationship between the cell данные в the таблица и the records данные source is finally presented:
   <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/recordsToCell.png" />
    <p>Correspondence between данные source entries и cells</p>
  </div>

### пользовательский header structure ширина dimension tree

Although multi-dimensional таблицаs с analytical capabilities can автоmatically analyze the dimension values из каждый dimension к form a tree structure из row и column headers, и can be сортировкаed according к `данныеConfig.сортировкаRules`, scenarios с complex business logic still expect к be able к **пользовательскийize Row column header dimension значение ** и order. Then these business requirement scenarios can be realized through rowTree и columnTree.

   <div style="ширина: 80%; текст-align: центр;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/пользовательский-tree.png" />
    <p>пользовательский rowTree columnTree</p>
  </div>

пользовательский tree configuration:

```
const option = {
    rowTree: [{
        dimensionKey: 'Регион',
        значение: '中南',
        children: [
            {
                dimensionKey: 'province',
                значение: '广东',
            },
            {
                dimensionKey: 'province',
                значение: '广西',
            }
        ]
    },
    {
        dimensionKey: 'Регион',
        значение: '华东',
        children: [
            {
                dimensionKey: 'province',
                значение: '上海',
            },
            {
                dimensionKey: 'province',
                значение: '山东',
            }
        ]
    }],
    columnTree: [{
        dimensionKey: 'year',
        значение: '2016',
        children: [
            {
                dimensionKey: 'quarter',
                значение: '2016-Q1',
                children: [
                    {
                        indicatorKey: 'Продажи',
                        значение: 'Продажи'
                    },
                    {
                        indicatorKey: 'Прибыль',
                        значение: 'Прибыль'
                    }
                ]
            },
            {
                dimensionKey: 'quarter',
                значение: '2016-Q2',
                children: [
                    {
                        indicatorKey: 'Продажи',
                        значение: 'Продажи'
                    },
                    {
                        indicatorKey: 'Прибыль',
                        значение: 'Прибыль'
                    }
                ]
            }
        ]
    }],
    indicators: ['Продажи', 'Прибыль'],

    corner: {
        titleOnDimension: 'никто'
    },
    records: [
        {
            Регион: '中南',
            province: '广东',
            year: '2016',
            quarter: '2016-Q1',
            Продажи: 1243,
            Прибыль: 546
        },
        {
            Регион: '中南',
            province: '广东',
            year: '2016',
            quarter: '2016-Q2',
            Продажи: 2243,
            Прибыль: 169
        }, {
            Регион: '中南',
            province: '广西',
            year: '2016',
            quarter: '2016-Q1',
            Продажи: 3043,
            Прибыль: 1546
        },
        {
            Регион: '中南',
            province: '广西',
            year: '2016',
            quarter: '2016-Q2',
            Продажи: 1463,
            Прибыль: 609
        },
        {
            Регион: '华东',
            province: '上海',
            year: '2016',
            quarter: '2016-Q1',
            Продажи: 4003,
            Прибыль: 1045
        },
        {
            Регион: '华东',
            province: '上海',
            year: '2016',
            quarter: '2016-Q2',
            Продажи: 5243,
            Прибыль: 3169
        }, {
            Регион: '华东',
            province: '山东',
            year: '2016',
            quarter: '2016-Q1',
            Продажи: 4543,
            Прибыль: 3456
        },
        {
            Регион: '华东',
            province: '山东',
            year: '2016',
            quarter: '2016-Q2',
            Продажи: 6563,
            Прибыль: 3409
        }
    ]
};
```

Vтаблица official website пример: https://visactor.io/vтаблица/демонстрация/таблица-тип/сводный-таблица.

The complexity из the пользовательский tree lies в the formation из the row, column и dimension trees. Вы можете choose к use it according к the business scenario. If you have complex сортировкаing, aggregation или paging rules, Вы можете choose к use a пользовательский method.

## Other related configurations

### Drilling up и down

We only provide the display из the drill-down download Кнопка. If you need this capability, you need к combine событиеs и interfaces к implement the relevant logic yourself.

Add the drillDown configuration item к the dimension configuration rows или columns к display the download Кнопка, списокen к the иконка Кнопка Нажать событие `drillменю_Нажать`, determine whether к drill down или roll up the dimension according к the событие параметр `drillDown` или `drillUp`, determine the dimension к drill down или drill up according к the параметр `dimensionKey`, add или delete it к rows или columns, obtain the данные source corresponding к the новый dimension level, и call the интерфейс `updateOption` к update the новый option к the таблица.

Specific демонстрация: https://visactor.io/vтаблица/демонстрация/данные-analysis/сводный-analysis-таблица-drill

## Related interfaces

### getCellOriginRecord

It can help к obtain the original данные entry corresponding к the cell aggregate значение.
