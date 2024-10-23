---
title: 30. VTable表格组件的编辑单元格能力使用问题：编辑器怎么配置，是否可以复用？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件的编辑单元格能力使用问题：编辑器怎么配置，是否可以复用？</br>
## 问题描述

业务场景中表格有很多列，如果每一列都需要配置一个编辑器的话，会比较繁琐，请问是否有简单的方式来定义呢？</br>
## 解决方案 

可以根据具体业务复用程度来决定采用哪种方式配置编辑器：</br>
1. 全局只配置一个编辑器，所有单元格都用得上：</br>
```
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
const option={
  editor: new InputEditor()
}</br>
```
配置之后，可以点击所有的单元格进行编辑</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OttmbyCePoYErLxW3tNc1TVtn4c.gif' alt='' width='2372' height='874'>

1. 如果某几个列可以复用同样的编辑器，可以在`columns`列配置中声明相同的`editor`名字、</br>
```
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
const input_editor = new InputEditor();
VTable.register.editor('input-editor', input_editor);

const option={
  columns:[
      {field:'id',title: 'ID'},
      {field:'name',title: 'NAME',editor:'input-editor'},
      {field:'address',title: 'ADDRESS',editor:'input-editor'},
  ]
}</br>
```
配置后会发现该列单元格都可以进行编辑了。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/UbM2bx1WtowagGxHCtmc70QEni3.gif' alt='' width='2180' height='952'>

可以按上述两种方式，在官网demo中稍加修改调试进行验证。demo地址：https://visactor.io/vtable/demo/edit/edit-cell</br>


## 相关文档

编辑表格demo：https://visactor.io/vtable/demo/edit/edit-cell</br>
编辑表格教程：https://visactor.io/vtable/guide/edit/edit_cell</br>
相关api：</br>
https://visactor.io/vtable/option/ListTable#editor</br>
https://visactor.io/vtable/option/ListTable-columns-text#editor</br>
github：https://github.com/VisActor/VTable</br>



