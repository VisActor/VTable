---
title: VTable usage issue: How to implement drag-and-drop adjustment of line-height</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to implement drag-and-drop adjustment of line-height</br>


## Problem description

Drag the bottom border of the cell to adjust the line-height of the row.</br>


## Solution

`Option `in the `rowResizeMode `configuration can enable or disable the line-height adjustment function:</br>
*  `All `: The entire column, including the cells at the head and body, can adjust the column width/line-height</br>
*  `None `: Cannot adjust column width/line-height</br>
*  `Header `: Column width/line-height can only be adjusted in the header unit</br>
*  `Body `: Column width/line-height can only be adjusted in body cells</br>
`rowResizeType `configuration controls the scope of adjustment:</br>
*  `Column `/ `row `: Default value, only adjust the width of the current column/row;</br>
*  `Indicator `: Adjust the column width/line-height of the same indicator column together;</br>
*  `All `: Adjust the column width/line-height of all columns together;</br>
*  `Indicator Group `: The indicator column of the same group is adjusted together. For example, there are two indicators under the northeast dimension value: sales and profit. When adjusting the column width of sales, the profit column will also be adjusted.</br>


## Code example

```
const option = {
  rowResizeType: 'row',
  rowResizeMode: 'all',
  // ......
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID),option);</br>
```
## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XboMbfwN7ouBLKxxgJdc833pn1c.gif' alt='' width='1336' height='792'>

Complete example: https://www.visactor.io/vtable/demo/interaction/resize-row-height</br>


## Related Documents

Line-height column width adjustment: https://www.visactor.io/vtable/guide/interaction/resize_column_width</br>
Related api: https://www.visactor.io/vtable/option/ListTable#rowResizeMode</br>
github：https://github.com/VisActor/VTable</br>



