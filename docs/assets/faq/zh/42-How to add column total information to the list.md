---
title: 20. VTable使用问题：如何在列表中加入列总计信息</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何在列表中加入列总计信息</br>


## 问题描述

在列表中，希望可以显示一列的总计信息，如求和、平均等。</br>


## 解决方案 

VTable提供了`aggregation`配置，用于配置表格中的数据聚合规则和展示位置，可以在option中配置`aggregation`指定聚合的全局规则，也可以在每个column中配置`aggregation`指定该列的聚合规则。`aggregation`中需要配置以下属性：</br>
*  aggregationType: </br>
*  求和，设置`aggregationType`为`AggregationType.SUM`</br>
*  平均，设置`aggregationType`为`AggregationType.AVG`</br>
*  最大值，设置`aggregationType`为`AggregationType.MAX`</br>
*  最小值，设置`aggregationType`为`AggregationType.MIN`</br>
*  计数，设置`aggregationType`为`AggregationType.COUNT`</br>
*  自定义函数，设置`aggregationType`为`AggregationType.CUSTOM`，通过`aggregationFun`来设置自定义的聚合逻辑</br>
*  aggregationFun: `aggregationType`为`AggregationType.CUSTOM`时自定义聚合逻辑</br>
*  showOnTop: 控制聚合结果的展示位置，默认为`false`，即聚合结果展示在 body 的底部。如果设置为`true`，则聚合结果展示在 body 的顶部。</br>
*  formatFun: 设置聚合值的格式化函数，可以自定义聚合值的展示格式。</br>


## 代码示例  

```
const options = {
    //......
    columns: [
      {
        aggregation: [
          {
            aggregationType: VTable.TYPES.AggregationType.MAX,
            // showOnTop: true,
            formatFun(value) {
              return '最高薪资:' + Math.round(value) + '元';
            }
          }
        ]
      },
      // ......
    ]
};</br>
```


## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MoaBbenpUo981mx39BbcMXwKnbR.gif' alt='' width='1690' height='1064'>

示例代码：https://www.visactor.io/vtable/demo/list-table-data-analysis/list-table-aggregation-multiple</br>
## 相关文档

基础表格数据分析教程：https://www.visactor.io/vtable/guide/data_analysis/list_table_dataAnalysis</br>
相关api：https://www.visactor.io/vtable/option/ListTable#aggregation</br>
github：https://github.com/VisActor/VTable</br>



