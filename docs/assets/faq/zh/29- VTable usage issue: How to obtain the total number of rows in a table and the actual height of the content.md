---
title: 7. VTable使用问题：如何获取表格总行数和内容实际高度</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何获取表格总行数和内容实际高度</br>


## 问题描述

如何通过API，从表格实例中获取当前表格总行数和内容实际高度</br>


## 解决方案 

1. table实例中`colCount`和`rowCount`属性，可以获取当前表格的行列数量</br>
1. table示例提供方法`getAllRowsHeight`和`getAllColsWidth`，可以获取当前表格内容的总列宽和总行高</br>
## 代码示例  

```
const tableInstance = new VTable.ListTable(container, option);

console.log(tableInstance.colCount);
console.log(tableInstance.rowCount);
console.log(tableInstance.getAllRowsHeight());
console.log(tableInstance.getAllColsWidth());</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PNbXbyK3Godocxxr9iOcTysCnBg.gif' alt='' width='1662' height='1044'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BTCkbEinooKakwx3XBqclnh1nSN.gif' alt='' width='246' height='152'>

完整示例代码（可以粘贴到 [编辑器](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree) 上尝试一下）：</br>
```
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto"
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
    },
    {
        "field": "City",
        "title": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "title": "Order Date",
        "width": "auto"
    },
    {
        "field": "Quantity",
        "title": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "title": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "title": "Profit",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard'
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;

console.log(tableInstance.colCount);
console.log(tableInstance.rowCount);
console.log(tableInstance.getAllRowsHeight());
console.log(tableInstance.getAllColsWidth());
    })</br>
```
## 相关文档

相关api：</br>
https://www.visactor.io/vtable/api/Properties#rowCount</br>
https://www.visactor.io/vtable/api/Properties#colCount</br>
https://www.visactor.io/vtable/api/Methods#getAllColsWidth</br>
https://www.visactor.io/vtable/api/Methods#getAllRowsHeight</br>
github：https://github.com/VisActor/VTable</br>



