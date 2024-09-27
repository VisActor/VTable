---
title: 28. 使用VTable表格组件用到了复选框Checkbox，怎么手动更新状态？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

使用VTable表格组件用到了复选框Checkbox，怎么手动更新状态？</br>
## 问题描述

请问VTable的ListTable有没有手动设置复选框checkbox的方式，以及如何清空所有checkbox的选中状态？</br>
## 解决方案 

### 调用接口更新状态

可以调用接口`setCellCheckboxState`。 该接口的可以设置单元格的 checkbox 状态，定义如下：</br>
```
setCellCheckboxState(col: number, row: number, checked: boolean) => void</br>
```
参数说明：</br>
*  col: 列号</br>
*  row: 行号</br>
*  checked: 是否选中</br>
如` tableInstance.``setCellCheckboxState(0,3,true)` 即将位置为（0,3）的单元格的Checkbox状态设置为选中状态，官网demo修改后效果如下：https://visactor.io/vtable/demo/cell-type/checkbox</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/T9Aqbqg8CoQCsNxBGOPceLE1nTg.gif' alt='' width='2172' height='702'>

### 批量更新状态

第二个问题批量的话，目前还没有专门的接口可以重置所有的复选框状态。但是可以通过重置数据调用`setRecords`或者更新列配置信息调用`updateColumns`来达到更新所有复选框状态的目标。</br>
1. 通过更新列配置</br>
将列配置中添加checked为true或者false，即可设置整列状态。不过数据records中有表示状态的字段则以数据为准。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/X4lobBLhUoBXspxeo2mcZm6hnAg.gif' alt='' width='2256' height='1302'>

1. 通过更新records数据源来批量设置复选框状态，这种用法需要在records中对应的复选框取值字段都明确指定。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/VLC9bEV39osOr8xyM8acVYyenEg.gif' alt='' width='3456' height='882'>

## 相关文档

复选框类型用法教程：https://visactor.io/vtable/guide/cell_type/checkbox</br>
复选框demo：https://visactor.io/vtable/demo/cell-type/checkbox</br>
相关api：https://visactor.io/vtable/option/ListTable-columns-checkbox#cellType</br>
https://visactor.io/vtable/api/Methods#setCellCheckboxState</br>
github：https://github.com/VisActor/VTable</br>

