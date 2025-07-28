
# v1.7.0

2024-08-30

**🆕 New feature**

- **@visactor/vtable-gantt**: add gantt chart

# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vtable**: If the user has previously passed in rowTree and columnTree for the pivot table, under this usage, the result returned by the getCellOriginRecord interface changes from the previous object to an array structure, and if no default aggregation was previously performed, the SUM aggregation rule will be used for data calculation. If you want to cancel the numerical calculation rule, you can specify the aggregation rule as NONE for the indicator.

Configuration examples, you can also refer to [Tutorial](https://visactor.io/vtable/guide/data_analysis/pivot_table_dataAnalysis)：
```
records:[{
  region: '中南',
  province: '广西',
  year: '2016',
  quarter: '2016-Q1',
  sales: 'NULL',
  profit: 1546
}],
dataConfig:{
    aggregationRules: [
        {
          indicatorKey: 'sales', 
          field: 'sales', 
          aggregationType: VTable.TYPES.AggregationType.NONE, 
        }
      ]
}

```
**🆕 New feature**

- **@visactor/vtable**: rows and tree can  combined use  [#1644](https://github.com/VisActor/VTable/issues/1644)
- **@visactor/vtable**: add virtual option for rowTree and columnTree [#1644](https://github.com/VisActor/VTable/issues/1644)



[more detail about v1.0.0](https://github.com/VisActor/VTable/releases/tag/v1.0.0)
