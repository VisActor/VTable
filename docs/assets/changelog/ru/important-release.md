
# v1.7.0

2024-08-30

**🆕 новый feature**

- **@visactor/vтаблица-гантт**: add гантт график

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vтаблица**: If the user has previously passed в rowTree и columnTree для the сводный таблица, under this usвозраст, the result returned по the getCellOriginRecord интерфейс changes от the предыдущий объект к an массив structure, и if no по умолчанию aggregation was previously performed, the SUM aggregation rule will be used для данные calculation. If you want к отмена the numerical calculation rule, Вы можете specify the aggregation rule as никто для the indicator.

Configuration примеры, Вы можете also refer к [Tutorial](https://visactor.io/vтаблица/guide/данные_analysis/сводный_таблица_данныеAnalysis)：
```
records:[{
  Регион: '中南',
  province: '广西',
  year: '2016',
  quarter: '2016-Q1',
  Продажи: 'null',
  Прибыль: 1546
}],
данныеConfig:{
    aggregationRules: [
        {
          indicatorKey: 'Продажи', 
          поле: 'Продажи', 
          aggregationType: Vтаблица.TYPES.AggregationType.никто, 
        }
      ]
}

```
**🆕 новый feature**

- **@visactor/vтаблица**: rows и tree can  combined use  [#1644](https://github.com/VisActor/Vтаблица/issues/1644)
- **@visactor/vтаблица**: add virtual option для rowTree и columnTree [#1644](https://github.com/VisActor/Vтаблица/issues/1644)



[more detail about v1.0.0](https://github.com/VisActor/Vтаблица/Релизs/tag/v1.0.0)
