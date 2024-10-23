# 基础表格数据分析

目前支持的能力有排序，过滤，数据聚合计算。

# 数据排序

具体可参阅教程：https://visactor.io/vtable/guide/basic_function/sort/list_sort

# 数据过滤

基础表格组件通过接口`updateFilterRules`来设置数据过滤规则，支持值过滤和函数过滤。下面是过滤数据的用法示例：

```javascript
tableInstance.updateFilterRules([
  {
    filterKey: 'sex',
    filteredValues: ['boy']
  },
  {
    filterFunc: (record: Record<string, any>) => {
      return record.age > 30;
    }
  }
]);
```

在上述示例中，我们通过`filterKey`和`filteredValues`来设置值过滤，只显示性别为"boy"的数据；同时，我们使用了函数过滤，通过`filterFunc`来自定义过滤逻辑，只显示`age`字段即年龄大于 30 的数据。

具体示例：https://visactor.io/vtable/demo/list-table-data-analysis/list-table-data-filter

清除数据过滤规则的话，请将函数参数传空`tableInstance.updateFilterRules()`。

# 数据聚合

基础表格支持对数据进行聚合计算，每一列可以设置不同的聚合方式，包括求和、平均、最大值、最小值，以及自定义函数汇总逻辑。同一列可以设置多种聚合方式，聚合结果会展示在多行。

## 聚合计算类型

- 求和，设置`aggregationType`为`AggregationType.SUM`
- 平均，设置`aggregationType`为`AggregationType.AVG`
- 最大值，设置`aggregationType`为`AggregationType.MAX`
- 最小值，设置`aggregationType`为`AggregationType.MIN`
- 计数，设置`aggregationType`为`AggregationType.COUNT`
- 自定义函数，设置`aggregationType`为`AggregationType.CUSTOM`，通过`aggregationFun`来设置自定义的聚合逻辑

## 聚合值格式化函数

通过`formatFun`来设置聚合值的格式化函数，可以自定义聚合值的展示格式。

## 聚合结果展示位置

通过`showOnTop`来控制聚合结果的展示位置，默认为`false`，即聚合结果展示在 body 的底部。如果设置为`true`，则聚合结果展示在 body 的顶部。

注意：目前聚合值没有自定冻结能力，需要结合 bottomFrozonRowCount 来实现固定显示，另外尴尬的是目前还没有增加 topFrozonRowCount，所以建议可以先将聚合结果显示在 body 底部。后续会支持全面的冻结能力。

## 聚合配置

聚合配置可以在 `columns` 列定义中进行设置，也可以在表格全局 `option` 中配置中。

### 列定义中配置聚合方式

在列定义中，可以通过`aggregation`属性来配置聚合方式。下面是一个聚合配置的示例：

```javascript
columns: [
  {
    field: 'salary',
    title: 'salary',
    width: 100,
    aggregation: [
      {
        aggregationType: AggregationType.MAX,
        formatFun(value) {
          return '最高薪资:' + Math.round(value) + '元';
        }
      },
      {
        aggregationType: AggregationType.MIN,
        formatFun(value) {
          return '最低薪资:' + Math.round(value) + '元';
        }
      },
      {
        aggregationType: AggregationType.AVG,
        showOnTop: false,
        formatFun(value, col, row, table) {
          return '平均:' + Math.round(value) + '元 (共计' + table.recordsCount + '条数据)';
        }
      }
    ]
  }
];
```

在上述示例中，我们针对`salary`这一列设置了三种聚合方式：最大值、最小值和平均值。通过`aggregationType`来指定聚合方式，然后可以通过`formatFun`来自定义聚合结果的展示格式，通过`showOnTop`来控制将聚合结果展示在 body 的顶部还是底部。

### 表格全局配置聚合方式

除了在列定义中配置聚合方式，也可以在表格全局配置中进行设置。下面是一个全局配置的示例：

```javascript
aggregation(args) {
  if (args.col === 1) {
    return [
      {
        aggregationType: AggregationType.MAX,
        formatFun(value) {
          return '最大ID:' + Math.round(value) + '号';
        }
      },
      {
        aggregationType: AggregationType.MIN,
        showOnTop: false,
        formatFun(value, col, row, table) {
          return '最小ID:' + Math.round(value) + '号';
        }
      }
    ];
  }
  if (args.field === 'salary') {
    return [
      {
        aggregationType: AggregationType.MIN,
        formatFun(value) {
          return '最低薪资:' + Math.round(value) + '元';
        }
      },
      {
        aggregationType: AggregationType.AVG,
        showOnTop: false,
        formatFun(value, col, row, table) {
          return '平均薪资:' + Math.round(value) + '元 (共计' + table.recordsCount + '条数据)';
        }
      }
    ];
  }
  return null;
}
```

在上述示例中，我们通过全局配置的`aggregation`函数来设置聚合方式，根据不同的条件返回不同的聚合配置。例如，当`args.col === 1`时，我们设置了最大值和最小值的聚合方式；当`args.field === 'salary'`时，我们设置了最低值和平均值的聚合方式。

具体示例可参考：https://visactor.io/vtable/demo/list-table-data-analysis/list-table-aggregation-multiple

以上就是基础表格数据分析能力的教程文档，涵盖了数据过滤和数据聚合的配置和用法。希望这份文档能对你有所帮助！如有任何疑问，请随时提问。
