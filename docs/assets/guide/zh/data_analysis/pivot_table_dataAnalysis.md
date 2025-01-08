# 透视数据分析

下图中一共有四个业务维度：地区、省份、年份、季度，看数指标：销售额，利润。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/pivot-analysis.png" />
    <p>透视表结构说明</p>
  </div>
针对图中销售数据，位置在单元格[5, 5]，即列5行5的数据：代表了2016年Q2季度下东北地区黑龙江省的销售利润值。也就是对应到行维度值：['东北', '黑龙江']，列维度：['2016', '2016-Q2']，指标：'利润'。接下来将介绍如何用VTable实现这种多维表格。

# VTable 实现多维表格

## 概念映射到配置项

上图透视表的配置如下：

```
const option={
  rows:['region','province'], //行维度
  columns:['year','quarter'], //列维度
  indicators:['sales','profit'], //指标 //是否开启数据分析功能
  records:[ //数据源 如果传入了汇总数据则使用用户传入数据
    {
      region:'东北',
      province:'黑龙江',
      year:'2016',
      quarter:'2016-Q1',
      sales:1243,
      profit:546
    },
    ...
  ]
}
```

该配置是多维表格最简配置。随着对功能要求的复杂性可以针对各功能点来添加各项配置来满足需求。

## 数据分析相关配置：

| 配置项                          | 类型                           | 描述                                     |
| :------------------------------ | :----------------------------- | :--------------------------------------- |
| rows                            | (IRowDimension \| string)[]    | 行维度字段数组，用于解析出对应的维度成员 |
| columns                         | (IColumnDimension \| string)[] | 列维度字段数组，用于解析出对应的维度成员 |
| indicators                      | (IIndicator \| string)[]       | 具体展示指标                             |
| dataConfig.aggregationRules     | aggregationRule[]              | 按照行列维度聚合值计算规则               |
| dataConfig.derivedFieldRules    | DerivedFieldRule[]             | 派生字段                                 |
| dataConfig.sortRules            | sortRule[]                     | 排序规则                                 |
| dataConfig.filterRules          | filterRule[]                   | 过滤规则                                 |
| dataConfig.totals               | totalRule[]                    | 小计或总计                               |
| dataConfig.calculatedFieldRules | CalculateddFieldRule[]         | 计算字段                                 |

dataConfig 配置定义：

```
/**
 * 数据处理配置
 */
export interface IDataConfig {
  aggregationRules?: AggregationRules; //按照行列维度聚合值计算规则；默认所有指标值都会按照加和SUM的方式计算
  sortRules?: SortRules; //排序规则；
  filterRules?: FilterRules; //过滤规则；
  totals?: Totals; //小计或总计；
  derivedFieldRules?: DerivedFieldRules; //派生字段定义
  ...
}
```

dataConfig 应用举例：

### 1. 数据汇总规则

#### VTable 来计算小计总计配置：

[option 说明](../../option/PivotTable#dataConfig.totals)

配置示例：

```
dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['province'],
          grandTotalLabel: '行总计',
          subTotalLabel: '小计',
          showGrandTotalsOnTop: true //汇总值显示在上
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['quarter'],
          grandTotalLabel: '列总计',
          subTotalLabel: '小计'
        }
      }
    },
```

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-total

#### 自定义汇总数据

如果需要自定义汇总数据，不期望 VTable 来计算小计总计值。除了需要配置上述配置外，还需要传入 VTable 的数据中需要包含对应的汇总数据。这样 VTable 内部会分析将其作为汇总数据而不使用 VTable 的汇总值来展示

 <div style="width: 50%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/custom-total-demo.png" />
    <p>自定义小计总计示例代码</p>
  </div>

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-custom-total

### 2. 排序规则

VTable 的透视表支持四种排序方式：维度值自然排序、指定维度值顺序，指标值排序、自定义排序。

定义可以参考：

[option 说明](../../option/PivotTable#dataConfig.sortRules) [使用教程](../../guide/basic_function/sort/pivot_sort)

指标值排序配置示例如下：

```
dataConfig: {
    sortRules: [
        {
          sortField: 'city',
          sortByIndicator: 'sales',
          sortType: VTable.TYPES.SortType.DESC,
          query: ['办公用品', '笔']
        } as VTable.TYPES.SortByIndicatorRule
      ]
}
```

如果需要修改排序规则 透视表可以使用接口 `updateSortRules`。

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-sort-dimension

### 3. 过滤规则

[option 说明](../../option/PivotTable#dataConfig.filterRules)

配置示例：

```
dataConfig: {
  filterRules: [
        {
          filterFunc: (record: Record<string, any>) => {
            return record.province !== '四川省' || record.category !== '家具';
          }
        }
      ]
}
```

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-filter

### 4. 聚合方式

默认所有指标值都会按照加和 `SUM` 的方式计算，如果不想这个默认的计算方式，可以通过配置 `aggregationRules` 来修改。

通常情况下指标应该是 `number` 类型，这样内部才能进行计算。

如果指标是字符串型或者 `null`，需要配置 `aggregationType` 为 `VTable.TYPES.AggregationType.NONE` 来显示数据源字段的原始值。

如果用到了自定义渲染 `customLayout`，在 `customLayout` 函数中想获取单元格对应的所有数据 `records`，可以配置 `aggregationType` 为 `VTable.TYPES.AggregationType.RECORD`。

[option 说明](../../option/PivotTable#dataConfig.aggregationRules)

#### 配置示例：

```
dataConfig: {
    aggregationRules: [
        //做聚合计算的依据，如销售额如果没有配置则默认按聚合sum计算结果显示单元格内容
        {
          indicatorKey: 'TotalSales', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.SUM, //计算类型
          formatFun: sumNumberFormat
        },
        {
          indicatorKey: 'OrderCount', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.COUNT, //计算类型 求数量
          formatFun: countNumberFormat
        },
        {
          indicatorKey: 'AverageOrderSales', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.AVG, //计算类型  求平均
        },
        {
          indicatorKey: 'MaxOrderSales', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.MAX, //计算类型 求最大
        },
        {
          indicatorKey: 'OrderSalesValue', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.NONE, //不做聚合 匹配到其中对应数据获取其对应field的值
        },
        {
          indicatorKey: 'orderRecords', //指标名称
          field: 'Sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.RECORD, //不做聚合 匹配到其中对应的全部数据作为单元格的值
        },
        {
          indicatorKey: '自定义聚合函数', //指标名称
          field: 'sales', //指标依据字段
          aggregationType: VTable.TYPES.AggregationType.CUSTOM, //自定义聚合类型 需要同时配置自定义函数aggregationFun
          aggregationFun(values, records) {
            return values.reduce((pre, cur) => pre + cur, 0) / values.length;
          }
        },
        {
          indicatorKey: '商品均价（注册聚合类）', //指标名称
          field: 'sales', //指标依据字段
          aggregationType: 'avgPrice', //自己注册的聚合类型 
        }
      ]
}
```

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-aggregation

#### 特殊聚合类型使用说明

**特别提示：**

1. AggregationType.NONE 指标不做聚合的使用场景主要用于根据用户传入数据 record 获取的原始数据进行展示，如：

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

  其中该条数据 record 中 sales 指标是个非数值型的值，如果产品需求要将`"NULL"`直接显示到表格单元格中，那么可以设置聚合规则为`VTable.TYPES.AggregationType.NONE`，这样 VTable 的内部不会进行聚合计算，而是直接取`sales`字段值作为单元格展示值。

2. AggregationType.RECORD 使用场景主要用于根据用户传入数据 record 匹配到所有数据，将其作为单元格的展示数据，用法场景如：需要搜集数据集作为迷你图展示，具体 demo 见：https://visactor.io/vtable/demo/cell-type/pivot-sparkline

#### 自定义聚合类型介绍

声明一个自定义聚合类，需要继承内部类型 `VTable.TYPES.Aggregator`，然后通过 `VTable.register.aggregator` 注册到 VTable 中。

如下是一个自定义聚合类的示例：

```
// 实现一个计算商品平均价格的聚合类型
class AvgPriceAggregator extends VTable.TYPES.Aggregator {
  sales_sum: number = 0;
  number_sum: number = 0;
  constructor(config: { key: string; field: string; formatFun?: any }) {
    super(config);
    this.key = config.key;
    this.formatFun = config.formatFun;
  }
  push(record: any): void {
    if (record) {
      if (record.isAggregator) {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }

      if (record.isAggregator) {
        this.sales_sum += record.sales_sum;
        this.number_sum += record.number_sum;
      } else {
        record.sales && (this.sales_sum += parseFloat(record.sales));
        record.number && (this.number_sum += parseFloat(record.number));
      }
    }
    this.clearCacheValue();
  }
  deleteRecord: (record: any) => void;
  updateRecord: (oldRecord: any, newRecord: any) => void;
  recalculate: () => any;
  clearCacheValue() {
    this._formatedValue = undefined;
  }
  value() {
    return this.records?.length >= 1 ? this.sales_sum / this.number_sum : undefined;
  }
  reset() {
    super.reset();
    this.sales_sum = 0;
    this.number_sum = 0;
  }
}
// 将聚合类型注册到VTable中
VTable.register.aggregator('avgPrice', AvgPriceAggregator);
// 注册后的使用，在dataConfig.aggregationRules中配置aggregationType为`avgPrice`。
const option={
  ...
  dataConfig: {
    aggregationRules: [
        {
          indicatorKey: '商品均价（注册聚合类）', //指标名称
          field: 'sales', //指标依据字段
          aggregationType: 'avgPrice', //自己注册的聚合类型 
        }
      ]
  }
}
```

VTable内部的几种聚合规则代码地址：https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/ts-types/dataset/aggregation.ts，可予以参考！

其中聚合类型需要实现的几个方法分别为：
- constructor：构造函数，用于初始化聚合器。
- push：将数据记录添加到聚合器中，用于计算聚合值。
- deleteRecord：从聚合器中删除记录，并更新聚合值，调用vtable的删除接口deleteRecords会调用该接口。
- updateRecord：更新数据记录，并更新聚合值，调用接口updateRecords会调用该接口。
- recalculate：重新计算聚合值，目前复制粘贴单元格值会调用该方法。
- value：获取聚合值。
- reset：重置聚合器。

如果觉得无需实现的方法写个空函数即可。

### 5. 派生字段

[option 说明](../../option/PivotTable#dataConfig.derivedFieldRules)

配置示例：

```
dataConfig: {
    derivedFieldRules: [
      {
        fieldName: 'Year',
        derivedFunc: VTable.DataStatistics.dateFormat('Order Date', '%y', true),
      },
      {
        fieldName: 'Month',
        derivedFunc: VTable.DataStatistics.dateFormat('Order Date', '%n', true),
      }
    ]
}
```

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-derivedField

### 6. 透视表计算字段

[option 说明](../../option/PivotTable#dataConfig.calculatedFieldRules)

配置示例：

```
     dataConfig: {
        calculatedFieldRules: [
          {
            key: 'AvgPrice',
            dependIndicatorKeys: ['Quantity', 'Sales'],
            calculateFun: dependValue => {
              return dependValue.Sales / dependValue.Quantity;
            }
          }
        ],
     }
```

配置解释说明：

- key: 计算字段的 key 唯一标识，可以当做新指标，用于配置在 indicators 中在透视表中展示。
- dependIndicatorKeys：计算字段依赖的指标，可以是在 records 中具体对应的指标字段。如果依赖的指标不在 records 中，则需要在 aggregationRules 中配置，具体指明聚合规则和 indicatorKey 以在 dependIndicatorKeys 所使用。
- calculateFun：计算字段的计算函数，依赖的指标值作为参数传入，返回值作为计算字段的值。

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-calculatedField

## 数据分析过程

依赖配置：维度，指标及 dataConfig。

### 遍历数据的流程：

遍历一遍 records，解析出行列表头维度值用于展示表头单元格，将 records 中所有数据分配到对应的行列路径集合中并计算出 body 部分指标单元格的聚合值。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/data-analysis-process.png" />
    <p>数据分析过程</p>
  </div>

### 数据维度 tree

根据上述遍历的结构，将产生一棵维度树，从这棵树可以查找到单元格的值及值的原始数据条目。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/dimension-tree.png" />
    <p>组织维度树聚合数据</p>
  </div>
  经过对record分组聚合的分析计算，最终呈现到表格中单元格数据和records数据源的对应关系：
   <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/recordsToCell.png" />
    <p>数据源条目和单元格的对应关系</p>
  </div>

### 自定义表头维度树

虽然具有分析能力的多维表格可以自动分析各个维度的维度值组成行列表头的树形结构，并且可以根据`dataConfig.sortRules`进行排序，但具有复杂业务逻辑的场景还是期望可以能够**自定义行列表头维度值**及顺序。那么可以通过 rowTree 和 columnTree 来实现这些业务需求场景。

   <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/custom-tree.png" />
    <p>custom rowTree columnTree</p>
  </div>

自定义树的配置：

```
const option = {
    rowTree: [{
        dimensionKey: 'region',
        value: '中南',
        children: [
            {
                dimensionKey: 'province',
                value: '广东',
            },
            {
                dimensionKey: 'province',
                value: '广西',
            }
        ]
    },
    {
        dimensionKey: 'region',
        value: '华东',
        children: [
            {
                dimensionKey: 'province',
                value: '上海',
            },
            {
                dimensionKey: 'province',
                value: '山东',
            }
        ]
    }],
    columnTree: [{
        dimensionKey: 'year',
        value: '2016',
        children: [
            {
                dimensionKey: 'quarter',
                value: '2016-Q1',
                children: [
                    {
                        indicatorKey: 'sales',
                        value: 'sales'
                    },
                    {
                        indicatorKey: 'profit',
                        value: 'profit'
                    }
                ]
            },
            {
                dimensionKey: 'quarter',
                value: '2016-Q2',
                children: [
                    {
                        indicatorKey: 'sales',
                        value: 'sales'
                    },
                    {
                        indicatorKey: 'profit',
                        value: 'profit'
                    }
                ]
            }
        ]
    }],
    indicators: ['sales', 'profit'],

    corner: {
        titleOnDimension: 'none'
    },
    records: [
        {
            region: '中南',
            province: '广东',
            year: '2016',
            quarter: '2016-Q1',
            sales: 1243,
            profit: 546
        },
        {
            region: '中南',
            province: '广东',
            year: '2016',
            quarter: '2016-Q2',
            sales: 2243,
            profit: 169
        }, {
            region: '中南',
            province: '广西',
            year: '2016',
            quarter: '2016-Q1',
            sales: 3043,
            profit: 1546
        },
        {
            region: '中南',
            province: '广西',
            year: '2016',
            quarter: '2016-Q2',
            sales: 1463,
            profit: 609
        },
        {
            region: '华东',
            province: '上海',
            year: '2016',
            quarter: '2016-Q1',
            sales: 4003,
            profit: 1045
        },
        {
            region: '华东',
            province: '上海',
            year: '2016',
            quarter: '2016-Q2',
            sales: 5243,
            profit: 3169
        }, {
            region: '华东',
            province: '山东',
            year: '2016',
            quarter: '2016-Q1',
            sales: 4543,
            profit: 3456
        },
        {
            region: '华东',
            province: '山东',
            year: '2016',
            quarter: '2016-Q2',
            sales: 6563,
            profit: 3409
        }
    ]
};
```

VTable 官网示例：https://visactor.io/vtable/demo/table-type/pivot-table.

自定义树的复杂在于组建行列维度树，可酌情根据业务场景来选择使用，如果具有复杂的排序、汇总或分页规则可选择使用自定义方式。

## 其他相关配置

### 上钻下钻

我们只提供了上钻下载按钮的展示，如果需要该能力需要结合事件和接口自行实现相关逻辑。

在维度配置 rows 或者 columns 中加上 drillDown 的配置项来显示下载按钮，监听点击图标按钮事件`drillmenu_click`,根据事件参数`drillDown` 或者 `drillUp`来确定是维度下钻还是上卷，根据参数`dimensionKey`确定下钻或上钻的维度，将其添加或者删除到 rows 或者 columns 中，并获取新维度层级对应数据源，并调用接口`updateOption`将新的 option 更新至表格。

具体 demo：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-table-drill

## 相关接口

### getCellOriginRecord

可以帮助获取单元格聚合值对应的原始数据条目。
