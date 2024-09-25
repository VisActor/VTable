---
title: VTable usage issue: How to add column total information to the list</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to add column total information to the list</br>


## Problem description

In the list, you hope to display the total information of a column, such as sum, average, etc.</br>


## Solution

VTable provides `aggregation `configuration for configuring data aggregation rules and display positions in the table. You can configure `aggregation `to specify global rules for aggregation in options, or configure `aggregation `to specify aggregation rules for each column. The following properties need to be configured in `aggregation `:</br>
*  aggregationType: </br>
*  Sum, set `aggregationType `to `AggregationType. SUM`</br>
*  Average, set `aggregationType `to `AggregationType. AVG`</br>
*  Maximum value, set `aggregationType `to `AggregationType. MAX`</br>
*  Minimum, set `aggregationType `to `AggregationType. MIN`</br>
*  Count, set `aggregationType `to `AggregationType. COUNT`</br>
*  Custom function, set `aggregationType `to `AggregationType. CUSTOM `, set custom aggregation logic through `aggregationFun `</br>
*  aggregationFun: Custom aggregation logic when `aggregationType is AggregationType. CUSTOM `</br>
*  showOnTop: Controls the display position of the aggregated results. The default is `false `, which means the aggregated results are displayed at the bottom of the body. If set to `true `, the aggregated results are displayed at the top of the body.</br>
*  FormatFun: Set the formatting function of aggregate values, and customize the display format of aggregate values.</br>


## Code example

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


## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VN6mb0xWNoVFvMxpCSPcjpBhndf.gif' alt='' width='1690' height='1064'>

Example code: https://www.visactor.io/vtable/demo/list-table-data-analysis/list-table-aggregation-multiple</br>
## Related Documents

Basic Table Data Analysis Tutorial: https://www.visactor.io/vtable/guide/data_analysis/list_table_dataAnalysis</br>
Related api: https://www.visactor.io/vtable/option/ListTable#aggregation</br>
github：https://github.com/VisActor/VTable</br>



