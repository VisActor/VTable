---
title: 3. VTable透视分析表聚合值怎么自动计算并显示？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable透视分析表聚合值怎么自动计算并显示？</br>
## 问题描述

透视分析表设置树形结构展示后，聚合节点数据为什么不显示？</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/JWUxb8k2JofsM0xSO38cvN0inZd.gif' alt='' width='701' height='639'>

## 解决方案 

需要配置上汇总规则，才会在数据分析时自动聚合数据就算聚合值作为父级单元格的展示值。</br>
## 代码示例  

```
  dataConfig: {
    totals: {
        row: {
          showSubTotals: true,
          subTotalsDimensions: ['Category'],
          subTotalLabel: 'subtotal'
        }
      }
  },</br>
```
## 结果展示 

在线效果参考：https://visactor.io/vtable/demo/table-type/pivot-analysis-table-tree</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/E2d4bsoQJoBdBUxbS6FcsPYAngc.gif' alt='' width='1338' height='416'>



## 相关文档

树形表格demo：https://visactor.io/vtable/demo/table-type/pivot-analysis-table-tree</br>
透视表数据分析教程：https://visactor.io/vtable/guide/data_analysis/pivot_table_dataAnalysis</br>
相关api：https://visactor.io/vtable/option/PivotTable#dataConfig.totals</br>
github：https://github.com/VisActor/VTable</br>



