---
title: 27. How to implement dimension drill-down function when using VTable pivot table component?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
### Problem title

How to implement dimension drill-down function when using VTable pivot table component?</br>
### Problem Description

Does the VTable pivot table support drill-down interaction on the front end?</br>
### Solution

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/YTbFbQC6ro595qxQoPRcMvEQnRe.gif' alt='' width='949' height='787'>

Configuring this will give you an icon and listen for events ([https://visactor.io/vtable/api/events#DRILLMENU_CLICK](https%3A%2F%2Fvisactor.io%2Fvtable%2Fapi%2Fevents%23DRILLMENU_CLICK)). Call the interface `updateOption` to update the full configuration after obtaining new data.</br>
## Code Example

You can refer to the official demo: [https://visactor.io/vtable/demo/data-analysis/pivot-analysis-table-drill](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fdata-analysis%2Fpivot-analysis-table-drill).</br>
Key configuration for drillDown:</br>
```
const option = {
  records: data,
  rows: [
    {
      dimensionKey: 'Category',
      title: 'Category',
      drillDown: true,
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: 'Region',
      title: 'Region',
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  indicators: ...
};</br>
```
After configuration, the drill-down icon is displayed, and the click event of the icon `drillmenu_click` is listened. In the event processing logic, `updateOption` is called to update the configuration, and the configured drill-down icon changes to the drill-up icon drillUp.</br>
```
tableInstance.on('drillmenu_click', args => {
  if (args.drillDown) {
    if (args.dimensionKey === 'Category') {
      tableInstance.updateOption({
        records: newData,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            drillUp: true,
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          },
          {
            dimensionKey: 'Sub-Category',
            title: 'Sub-Catogery',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        columns: ...,
        indicators: ...
      });
    }
  }</br>
```


## Result Display

Here is the official website example effect:</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BvoGbUvh5ooF8gxTdv0cG5QDn0f.gif' alt='' width='1492' height='1016'>

## 相关文档

Tutorial on using drill-down and drill-through in pivot tables: https://visactor.io/vtable/guide/data_analysis/pivot_table_dataAnalysis</br>
Demo of using Drill Down and Drill Through in pivot tables: https://visactor.io/vtable/demo/data-analysis/pivot-analysis-table-drill?open_in_browser=true</br>
Related APIs: https://visactor.io/vtable/option/PivotTable-columns-text#drillDown</br>
https://visactor.io/vtable/api/events?open_in_browser=true#DRILLMENU_CLICK</br>
github：https://github.com/VisActor/VTable</br>

