---
title: 19. How can I increase the gap between adjacent sparklines in the VTable component?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

How can I increase the gap between adjacent sparklines in the VTable component?</br>
## Question Description

The mini graph in the product uses VTable, but the effect of generating the mini graph with data is that the users feel the distance between adjacent line segments is too close. How to adjust this spacing?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WCfcbEOuIoKc3JxEbmVcsbAsnIe.gif' alt='' width='1475' height='628'>

## Solution

First, it is necessary to clarify that the width and height of a cell include two parts: the padding margin and the content. The padding margin in the VTable is set to [10, 16, 10, 16] by default, and the row height of the VTable is 40px by default, with the top and bottom padding margins taking up 20px. Therefore, the height of the content is reduced to 20px.</br>
The top and bottom padding margins take up 20px, so the minimum distance between two adjacent  sparklines charts is also 20px. In other words, the minimum distance between two adjacent  sparklines charts is determined by the padding margin. In the official example, padding margin is adjusted to 20, and it is found that the line curve becomes a straight line after the adjustment. This is because the 40px row height is occupied by the padding margin, leaving no space for the line chart to stretch.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/AxaLbDVvMoViADxrhPxciAOLnDc.gif' alt='' width='945' height='266'>

So in this case, we need to increase the row height accordingly. The effect of setting defaultRowHeight to 60 is as follows:</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NzN8bMoTJoPtQWxRkYzcjSbqnde.gif' alt='' width='916' height='311'>



## Code Example

```
const records = [
  {
   'lineData':[50,20,20,40,60,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineData':[50,20,60,40,60,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineData':[50,50,20,40,10,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  },
  {
   'lineData':[70,20,20,40,60,50,70],
   'lineData2':[{x:1,y:1500},{x:2,y:1480},{x:3,y:1520},{x:4,y:1550},{x:5,y:1600}],
  }
];

const columns = [
  {
    field: 'lineData',
    title: 'sparkline',
    cellType: 'sparkline',
    width:300,
    style:{
      padding:20
    },
    sparklineSpec: {
        type: 'line',
        pointShowRule: 'none',
        smooth: true,
        line: {
          style: {
            stroke: '#2E62F1',
            strokeWidth: 2,
          },
        },
        point: {
          hover: {
              stroke: 'blue',
              strokeWidth: 1,
              fill: 'red',
              shape: 'circle',
              size: 4,
          },
          style: {
            stroke: 'red',
            strokeWidth: 1,
            fill: 'yellow',
            shape: 'circle',
            size: 2,
          },
        },
        crosshair: {
          style: {
            stroke: 'gray',
            strokeWidth: 1,
          },
        },
      },
  },
  {
    field: 'lineData2',
    title: 'sparkline 2',
    cellType: 'sparkline',
    width:300,
    style:{
      padding:20
    },
    sparklineSpec: {
        type: 'line', 
        xField: 'x',
        yField: 'y',
        pointShowRule: 'all',
        smooth: true,
        line: {
          style: {
            stroke: '#2E62F1',
            strokeWidth: 2,
          },
        },
      },
  },
];
const option = {
  records,
  columns,
  defaultRowHeight:60
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
</br>
```
## Result Display 

Just paste the code from the example directly into the official editor and it will be displayed.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HkPgbc4aLoaqczxnug8ccxZwnOQ.gif' alt='' width='916' height='311'>

## Relevant Documents 

Sparkline Usage Reference Demo：https://visactor.io/vtable/guide/cell_type/sparkline</br>
Style Usage Toturial：https://visactor.io/vtable/guide/theme_and_style/style</br>
Related api：https://visactor.io/vtable/option/ListTable-columns-sparkline#style.padding</br>
github：https://github.com/VisActor/VTable</br>

