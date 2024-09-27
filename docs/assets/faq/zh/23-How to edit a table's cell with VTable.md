---
title: 1. VTable编辑表格如何修改触发时机？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

可编辑表格能否在点击时直接进入编辑状态，而不是双击某一个单元格后才能进行可编辑？</br>


## 问题描述

在编辑表格场景中，双击进入编辑会显得操作繁琐笨重，需要直接进入编辑状态。</br>


## 解决方案 

可在表格初始化的`option`中配置`editCellTrigger`为`click`。该配置项定义如下：</br>
```
/** 编辑触发时机:双击事件 | 单击事件 | api手动开启编辑。默认为双击'doubleclick' */
editCellTrigger?: 'doubleclick' | 'click' | 'api';</br>
```


## 代码示例  

```
  const option = {
    records,
    columns,
    autoWrapText: true,
    limitMaxAutoWidth: 600,
    heightMode: 'autoHeight',
    editCellTrigger: 'click' // 设置编辑触发时机
  };
  const tableInstance = new VTable.ListTable(container, option);</br>
```
## 结果展示 

在线效果参考：https://visactor.io/vtable/demo/edit/edit-cell</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ZaUtbuL5jozN25xt4YucM9XgnHe.gif' alt='' width='2136' height='970'>



## 相关文档

编辑表格demo：https://visactor.io/vtable/demo/edit/edit-cell</br>
编辑表格教程：https://visactor.io/vtable/guide/edit/edit_cell</br>
相关api：https://visactor.io/vtable/option/ListTable#editCellTrigger</br>
github：https://github.com/VisActor/VTable</br>



