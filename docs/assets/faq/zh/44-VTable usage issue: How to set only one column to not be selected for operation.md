---
title: 22. VTable使用问题：如何何设置只有一列不能选中操作</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何何设置只有一列不能选中操作</br>


## 问题描述

如何在表格中的某一列，点击单元格不会选中</br>


## 解决方案 

VTable在`column`中提供了`disableSelect`和`disableHeaderSelect`配置：</br>
*  disableSelect: 该列内容部分禁用选中</br>
*  disableHeaderSelect: 该列表头部分禁用选中</br>


## 代码示例  

```
const options = {
    columns: [
        {
            field: 'name',
            title: 'name',
            disableSelect: true,
            disableHeaderSelect: true
        },
        // ......
    ],
    //......
};</br>
```


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
        "width": "auto",
        disableSelect: true,
        disableHeaderSelect: true
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

相关api：https://www.visactor.io/vtable/option/ListTable-columns-text#disableSelect</br>
github：https://github.com/VisActor/VTable</br>



