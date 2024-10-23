---
title: 21. VTable使用问题：如何监听表格区域选中取消事件</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何监听表格区域选中取消事件</br>


## 问题描述

希望可以通过事件，监听选中取消事件（点击表格其他区域或点击表格外）</br>


## 解决方案 

VTable提供了`**SELECTED_CLEAR**`事件，在取消选中操作后（并且当前图表区域中无任何选中区域）触发</br>


## 代码示例  

```
const tableInstance = new VTable.ListTable(option);
tableInstance.on(VTable.ListTable.EVENT_TYPE.SELECTED_CLEAR, () => {
    console.log("selected clear!");
});</br>
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
  columns
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;

tableInstance.on(VTable.ListTable.EVENT_TYPE.SELECTED_CLEAR, () => {
    console.log("selected clear!");
});
    })</br>
```
## 相关文档

相关api：https://www.visactor.io/vtable/api/events#SELECTED_CLEAR</br>
github：https://github.com/VisActor/VTable</br>



