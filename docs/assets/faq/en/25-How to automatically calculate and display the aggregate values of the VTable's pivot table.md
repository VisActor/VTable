---
title: How to automatically calculate and display the aggregate values of the VTable's pivot table?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Title

How to automatically calculate and display the aggregate values of the VTable's pivot table?</br>
## Description

Why is the aggregate node data not displayed after the pivot table is set to display in tree structure?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/DhKzbArAKohl8lx6QwicFeRWnvb.gif' alt='' width='701' height='639'>

## Solution 

Aggregation rules need to be configured so that data can be automatically aggregated during data analysis and the aggregated value can be used as the display value of the parent cell.</br>
## Code Example

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
## Results

Online effect reference:https://visactor.io/vtable/demo/table-type/pivot-analysis-table-tree</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/TfUKbUwmVoaKt4xhLw3c4aONnxx.gif' alt='' width='1338' height='416'>

## Related Documents

Tree Table Demo：https://visactor.io/vtable/demo/table-type/pivot-analysis-table-tree</br>
Tutorial on pivot table data analysis：https://visactor.io/vtable/guide/data_analysis/pivot_table_dataAnalysis</br>
Related api：https://visactor.io/vtable/option/PivotTable#dataConfig.totals</br>
github：https://github.com/VisActor/VTable</br>

