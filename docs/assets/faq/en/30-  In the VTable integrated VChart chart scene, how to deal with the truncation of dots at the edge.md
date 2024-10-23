---
title: 8.  In the VTable integrated VChart chart scene, how to deal with the truncation of dots at the edge?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Title

In the VTable integrated VChart chart scene, how to deal with the truncation of dots at the edge?</br>
## Description

In the VTable integrated VChart chart scenario, how to avoid the edge points being truncated when drawing points on the chart.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/RUjJbYCjXoTh14xvUwgcDPTAncf.gif' alt='' width='1280' height='372'>

## Solution

Configure innerOffset on the axes axis. After adding it as above, there will be a certain distance between the elements on the chart and the edge of the table.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XtTLbGtHNoWltwxvjj5c0MOAn1g.gif' alt='' width='1280' height='312'>

## Code Example

```

const option = {
  axes: [
          {
            orient: 'left',
            type: 'linear',
            innerOffset: {
              top: 4,
              bottom: 4,
            }
          },
          {
            orient: 'bottom',
            type: 'band',
            innerOffset: {
              left: 4,
              right: 4,
            }
          }
        ]
  ...
}

const tableInstance = new VTable.ListTable(container, option);</br>
```
## Results

Online effect reference:https://visactor.io/vtable/demo/table-type/pivot-chart-scatter</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HHa6b0VRgoHT47xrWZrcvaDlnxf.gif' alt='' width='1047' height='580'>

## Related Documents

Related api：https://visactor.io/vtable/option/PivotTable#axes</br>
github：https://github.com/VisActor/VTable</br>



