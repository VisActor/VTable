---
title: 30. Usage issues of the editing cell ability of the VTable component: How to configure the editor and whether it can be reused?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

Usage issues of the editing cell ability of the VTable component: How to configure the editor and whether it can be reused?</br>
## Problem Description

In business scenarios, there are many columns in the table. If each column needs to be configured with an editor, it will be more cumbersome. Is there a simple way to define it?</br>
## Solution

You can decide which way to configure the editor according to the specific degree of business reuse:</br>
1. Only configure a global editor and use it for all cells:</br>
```
import { DateInputEditor, InputEditor, ListEditor, TextAreaEditor } from '@visactor/vtable-editors';
const option={
  editor: new InputEditor()
}</br>
```
After configuration, you can click on any cell to edit it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XfCgbCyz5oHOc7xkpmzcTu2unZg.gif' alt='' width='2372' height='874'>

1. If a few columns can share the same editor, you can declare the same `editor` name in the `columns` column configuration for reuse.</br>
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
After configuration, you will find that the cells in this column can all be edited.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XEcnbdSJSo4xxHxAQt5cgW7Rnzc.gif' alt='' width='2180' height='952'>

You can modify and debug the demo on the official website in the above two ways to verify. demo URL:https://visactor.io/vtable/demo/edit/edit-cell</br>


## Related documents

*  Editing form demo: [https://visactor.io/vtable/demo/edit/edit-cell](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fedit%2Fedit-cell)</br>
*  Editing form tutorial: [https://visactor.io/vtable/guide/edit/edit_cell](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fedit%2Fedit_cell)</br>
*  Related API: </br>
https://visactor.io/vtable/option/ListTable#editor</br>
https://visactor.io/vtable/option/ListTable-columns-text#editor</br>
github：https://github.com/VisActor/VTable</br>



