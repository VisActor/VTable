
# v1.7.0

2024-08-30

**🆕 新增功能**

- **@visactor/vtable-gantt**: 新增甘特图 gantt chart


# v1.0.0

2024-05-21

**💥 Breaking change**

- **@visactor/vtable**: 透视表如果之前用户传入了rowTree和columnTree，在此用法下，getCellOriginRecord接口返回结果由之前对象变为数组结构，并且之前没有做默认聚合目前会使用SUM聚会规则进行数据计算，如果想取消数值计算规则可以为指标指定聚合规则为NONE。

配置示例，也可以参考[教程](https://visactor.io/vtable/guide/data_analysis/pivot_table_dataAnalysis)：
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
          indicatorKey: 'sales', //指标名称
          field: 'sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.NONE, //不做聚合 匹配到其中对应数据获取其对应field的值
        }
      ]
}

```

**🆕 新增功能**

- **@visactor/vtable**: 自定义树形表头customTree可以和透视分析能力结合使用 [#1644](https://github.com/VisActor/VTable/issues/1644)
- **@visactor/vtable**: 在 rowTree & columnTree 中加入virtual option [#1644](https://github.com/VisActor/VTable/issues/1644)



[更多详情请查看 v1.0.0](https://github.com/VisActor/VTable/releases/tag/v1.0.0)
