---
title: 14. VTable使用问题：如何让表格只根据表头的内容宽度自动计算列宽</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何让表格只根据表头的内容宽度自动计算列宽</br>


## 问题描述

在自动宽度模式下，希望一列的宽度只依据表头单元格的内容宽度决定，不受内容单元格影响。</br>


## 解决方案 

VTable提供了`columnWidthComputeMode`配置，用于指定内容宽度计算时参与计算的限定区域：</br>
*  'only-header'：只计算表头内容。</br>
*  'only-body'：只计算 body 单元格内容。</br>
*  'normal'：正常计算，即计算表头和 body 单元格内容。</br>


## 代码示例  

```
const options = {
    //......
    columnWidthComputeMode: 'only-header'
};</br>
```


## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/A6Z6bMT9XoohBzxnvASck8OInBb.gif' alt='' width='758' height='1048'>

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
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  columnWidthComputeMode: 'only-header'
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })</br>
```
## 相关文档

相关api：https://www.visactor.io/vtable/option/ListTable#columnWidthComputeMode</br>
github：https://github.com/VisActor/VTable</br>



