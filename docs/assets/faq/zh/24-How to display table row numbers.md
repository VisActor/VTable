---
title: 2. VTable使用问题：如何显示表格行号</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何在表格中每一行前，显示该行的序号。</br>


## 问题描述

通过配置，在表格第一列前加入一列，显示每一行的行号</br>


## 解决方案 

可在表格初始化的`option`中配置`rowSeriesNumber`。该配置项定义如下：</br>
```
interface IRowSeriesNumber {
  width?: number | 'auto'; // 显示行号列的宽度
  title?: string; // 行序号标题，默认为空
  format?: (col?: number, row?: number, table?: BaseTableAPI) => any; // 行序号格式化函数，默认为空，通过该配置可以将数值类型的序号转换为自定义序号，如使用 a,b,c...
  cellType?: 'text' | 'link' | 'image' | 'video' | 'checkbox';  // 行序号单元格类型，默认为text
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // body 单元格样式，可参考：[style](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Foption%2FListTable-columns-text%23style.bgColor)
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // 表头单元格样式，可参考： [headerStyle](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Foption%2FPivotTable-columns-text%23headerStyle.bgColor)
  /** 是否可拖拽顺序 */
  dragOrder?: boolean; // 是否可拖拽行序号顺序，默认为 false。如果设置为 true，会显示拖拽位置的图标，交互在该图标上可以拖拽来换位。如果需要替换该图标可以自行配置。可参考教程：[https://visactor.io/vtable/guide/custom_define/custom_icon](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fcustom_define%2Fcustom_icon) 中重置功能图标的章节。
}</br>
```


## 代码示例  

```
const option = {
  records: data,
  columns,
  widthMode: 'standard',
  rowSeriesNumber: {
    title: '序号',
    width: 'auto',
    headerStyle: {
      color: 'black',
      bgColor: 'pink'
    },
    style: {
      color: 'red'
    }
  }
};
const tableInstance = new VTable.ListTable(container, option);</br>
```
## 结果展示 

在线效果参考：https://www.visactor.io/vtable/demo/basic-functionality/row-series-number</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Z715bIZMoozEDSxXEO1cCjronRd.gif' alt='' width='709' height='403'>



## 相关文档

行序号demo：https://www.visactor.io/vtable/demo/basic-functionality/row-series-number</br>
相关api：https://www.visactor.io/vtable/option/ListTable#rowSeriesNumber</br>
github：https://github.com/VisActor/VTable</br>



