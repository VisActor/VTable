---
title: 35. VTable表格组件如何设置文字样式？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件如何设置文字样式？</br>
## 问题描述

使用VTable表格组件，支持哪些文字样式，如何配置？</br>
## 解决方案 

VTable支持的文字样式有：</br>
*  `fontSize`: 文本的字体大小。</br>
*  `fontFamily`: 文本使用的字体。可以指定多个字体，例如`Arial,sans-serif`，浏览器将按照指定顺序查找使用。</br>
*  `fontWeight`: 设置字体粗细。</br>
*  `fontVariant`: 设置字体变体。</br>
*  `fontStyle`: 设置字体样式。</br>
VTable支持设置文字样式的地方有：</br>
*  `column(row/indicator)`中，配置该列（行/指标）对应的样式</br>
*  `style`: 内容单元格对应的样式</br>
*  `headerStyle`:  表头单元格对应的样式</br>
*  `theme`中，配置主题样式</br>
*  `defaultStyle`: 默认样式</br>
*  `bodyStyle`: 表格内容区域样式</br>
*  `headerStyle`: 表头（列表）/列表头（透视表）样式</br>
*  `rowHeaderStyle`: 行表头样式</br>
*  `cornerHeaderStyle`: 角头样式</br>
*  `bottomFrozenStyle`: 底部冻结单元格样式</br>
*  `rightFrozenStyle`: 右侧冻结单元格样式</br>


## 代码示例  

可以粘贴到官网编辑器上进行测试：[https://visactor.io/vtable/demo/table-type/list-table](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table)</br>
```
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto",
        style: {
            fontSize: 14
        },
        headerStyle: {
            fontSize: 16,
            fontFamily: 'Verdana'
        }
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto"
    },
    {
        "field": "Category",
        "title": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "title": "Region",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  theme: VTable.themes.DEFAULT.extends({
    bodyStyle: {
        fontSize: 12
    },
    headerStyle: {
        fontSize: 18
    }
  })
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })</br>
```
## 相关文档

相关api：https://visactor.io/vtable/option/ListTable-columns-text#style.fontSize</br>
github：https://github.com/VisActor/VTable</br>



