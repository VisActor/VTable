---
title: 11. VTable使用问题：如何实现拖拽调整行高</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何实现拖拽调整行高</br>


## 问题描述

拖拽单元格底部边框，调整该行的行高</br>


## 解决方案 

`option`中的`rowResizeMode`配置可以开启或关闭行高调整功能：</br>
*  `all`: 整列包括表头和 body 处的单元格均可调整列宽/行高</br>
*  `none`: 禁止调整列宽/行高</br>
*  `header`: 只能在表头处单元调整列宽/行高</br>
*  `body`: 只能在 body 单元格调整列宽/行高</br>
`rowResizeType`配置控制了调整作用范围：</br>
*  `column`/`row`：默认值，仅调整当前列/行的宽度；</br>
*  `indicator`：相同指标列的列宽/行高一并调整；</br>
*  `all`：所有列的列宽/行高一并调整；</br>
*  `indicatorGroup`：同一组的指标列一并调整，如东北维度值下有两个指标为：销售额和利润，当调整销售额的列宽时，利润列也会进行调整；</br>


## 代码示例  

```
const option = {
  rowResizeType: 'row',
  rowResizeMode: 'all',
  // ......
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID),option);</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/LuJibaHWsobVcgxYgBbc88YGnRd.gif' alt='' width='1336' height='792'>

完整示例：https://www.visactor.io/vtable/demo/interaction/resize-row-height</br>


## 相关文档

行高列宽调整：https://www.visactor.io/vtable/guide/interaction/resize_column_width</br>
相关api：https://www.visactor.io/vtable/option/ListTable#rowResizeMode</br>
github：https://github.com/VisActor/VTable</br>



