---
title: 36. VTable表格组件如何自定义高亮部分单元格</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件如何自定义高亮部分单元格？</br>
## 问题描述

使用VTable表格组件，如何自定义高亮部分单元格，并指定高亮的样式？</br>
## 解决方案 

VTable支持自定义单元格样式，可以用来实现自定义高亮功能：</br>
### 注册样式

首先需要注册一个自定义样式</br>
需要定义`id`和`style`两个属性：</br>
*  id: 自定义样式的唯一id</br>
*  style: 自定义单元格样式，与`column`中的`style`配置相同，最终呈现效果是单元格原有样式与自定义样式融合</br>
自定义样式的注册分为两种方式，`option`中配置和使用API配置：</br>
*  option option中的customCellStyle属性接收多个自定义样式对象组合而成的数组：</br>
```
// init option
const option = {
  // ......
  customCellStyle: [
    {
      id: 'custom-1',
      style: {
        bgColor: 'red'
      }
    }
  ]
}</br>
```
*  API 可以通过VTable实例提供的`registerCustomCellStyle`方法注册自定义样式：</br>
```
instance.registerCustomCellStyle(id, style)</br>
```
### 分配样式

使用已注册的自定义样式，需要将自定义样式分配到单元格中，分配需要定义`cellPosition`和`customStyleId`两个属性：</br>
*  cellPosition: 单元格位置信息，支持配置单个单元格与单元格区域</br>
*  单个单元格：`{ row: number, col: number }`</br>
*  单元格区域：`{ range: { start: { row: number, col: number }, end: { row: number, col: number} } }`</br>
*  customStyleId: 自定义样式id，与注册自定义样式时定义的id相同</br>
分配方式有两种，`option`中配置和使用API配置：</br>
*  option option中的`customCellStyleArrangement`属性接收多个自定义分配样式对象组合而成的数组：</br>
```
// init option
const option = {
  // ......
  customCellStyleArrangement: [
    {
      cellPosition: {
        col: 3,
        row: 4
      },
      customStyleId: 'custom-1'
    },
    {
      cellPosition: {
        range: {
          start: {
            col: 5,
            row: 5
          },
          end: {
            col: 7,
            row: 7
          }
        }
      },
      customStyleId: 'custom-2'
    }
  ]
}</br>
```
*  API 可以通过VTable实例提供的`arrangeCustomCellStyle`方法分配自定义样式：</br>
```
instance.arrangeCustomCellStyle(cellPosition, customStyleId)</br>
```
### 更新与删除样式

自定义样式在注册后，可以通过`registerCustomCellStyle`方法，对同一id的自定义样式进行更新，更新后，分配的自定义样式的单元格样式会被更新；如果`newStyle`为`undefined` | `null`，则表示删除该自定义样式，删除后，分配的自定义样式的单元格样式会还原默认样式</br>
```
instance.registerCustomCellStyle(id, newStyle)</br>
```
已分配的自定义样式的单元格区域，可以通过`arrangeCustomCellStyle`方法，对单元格区域进行更新样式分配，更新后，单元格的样式会被更新；如果`customStyleId`为`undefined` | `null`，则表示还原单元格的样式为默认样式</br>
## 代码示例  

demo：https://visactor.io/vtable/demo/custom-render/custom-style</br>
## 相关文档

相关api：https://visactor.io/vtable/option/ListTable#customCellStyle</br>
教程：https://visactor.io/vtable/guide/custom_define/custom_style</br>
github：https://github.com/VisActor/VTable</br>



