# 透视数据分析

下图中一共有四个业务维度：地区、省份、年份、季度，看数指标：销售额，利润。
 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/pivot-analysis.png" />
    <p>透视表结构说明</p>
  </div>
针对图中销售数据，位置在单元格[5, 5]，即列5行5的数据：代表了2016年Q2季度下东北地区黑龙江省的销售利润值。也就是对应到行维度值：['东北', '黑龙江']，列维度：['2016', '2016-Q2']，指标：'利润'。接下来将介绍如何用VTable实现这种多维表格。

# VTable实现多维表格
## 概念映射到配置项
上图透视表的配置如下：
```
const option={
  rows:['region','province'], //行维度
  columns:['year','quarter'], //列维度
  indicators:['sales','profit'], //指标
  enableDataAnalysis: true, //是否开启数据分析功能
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
|配置项|类型|描述|
|:----|:----|:----|
|rows|(IRowDimension \| string)[]|行维度字段数组，用于解析出对应的维度成员|
|columns|(IColumnDimension \| string)[]|列维度字段数组，用于解析出对应的维度成员|
|indicators|(IIndicator \| string)[]|具体展示指标|
|dataConfig.aggregationRules|aggregationRule[]|按照行列维度聚合值计算规则|
|dataConfig.derivedFieldRules|DerivedFieldRule[]|派生字段|
|dataConfig.sortRules|sortRule[]|排序规则|
|dataConfig.filterRules|filterRule[]|过滤规则|
|dataConfig.totals|totalRule[]|小计或总计|

dataConfig配置定义：
```
/**
 * 数据处理配置
 */
export interface IDataConfig {
  aggregationRules?: AggregationRules; //按照行列维度聚合值计算规则；
  sortRules?: SortRules; //排序规则；
  filterRules?: FilterRules; //过滤规则；
  totals?: Totals; //小计或总计；
  derivedFieldRules?: DerivedFieldRules; //派生字段定义
  ...
}
```
dataConfig 应用举例：
### 1. 数据汇总规则 
[option说明](../../../option/PivotTable#dataConfig.totals)
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
### 2. 排序规则
[option说明](../../../option/PivotTable#dataConfig.sortRules)
配置示例：
```
    sortRules: [
        {
          sortField: 'city',
          sortByIndicator: 'sales',
          sortType: VTable.TYPES.SortType.DESC,
          query: ['办公用品', '笔']
        } as VTable.TYPES.SortByIndicatorRule
      ]

```

如果需要修改排序规则 透视表可以使用接口 `updateSortRules`。

具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-sort-dimension
### 3. 过滤规则
[option说明](../../../option/PivotTable#dataConfig.filterRules)
配置示例：
```
filterRules: [
        {
          filterFunc: (record: Record<string, any>) => {
            return record.province !== '四川省' || record.category !== '家具';
          }
        }
      ]
```
具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-filter
### 4. 聚合方式
[option说明](../../../option/PivotTable#dataConfig.aggregationRules)
配置示例：
```
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
        }
      ]
```
具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-aggregation
### 5. 派生字段
[option说明](../../../option/PivotTable#dataConfig.derivedFieldRules)
配置示例：
```
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
```
具体示例：https://visactor.io/vtable/demo/data-analysis/pivot-analysis-derivedField
## 数据分析过程
依赖配置：维度，指标及dataConfig。
### 遍历数据的流程：
遍历一遍records，解析出行列表头维度值用于展示表头单元格，将records中所有数据分配到对应的行列路径集合中并计算出body部分指标单元格的聚合值。
 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/data-analysis-process.png" />
    <p>数据分析过程</p>
  </div>

### 数据维度tree
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

### 自定义维度树
虽然具有分析能力的多维表格可以自动分析各个维度的维度值组成行列表头的树形结构，并且可以根据`dataConfig.sortRules`进行排序，但具有复杂业务逻辑的场景还是期望可以能够**自定义行列表头维度值**及顺序。那么可以通过rowTree和columnTree来实现这些业务需求场景。
- enableDataAnalysis需设置为false来关闭VTable内部聚合数据的分析，提升一定的性能。

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
    //enableDataAnalysis:true,
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
VTable官网示例：https://visactor.io/vtable/demo/table-type/pivot-table.

自定义树的复杂在于组建行列维度树，可酌情根据业务场景来选择使用，如果具有复杂的排序、汇总或分页规则可选择使用自定义方式。

**注意：如果选择自定义树的配置方式将不开启VTable内部的数据聚合能力，即匹配到的数据条目中的某一条作为单元格指标值。**