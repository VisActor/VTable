---
title: 13. VTable使用问题：如何分别设置单元格四周边框样式</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何分别设置单元格四周边框样式</br>


## 问题描述

如何分别设置单元格四周边框样式，实现一个只有上下单元格边界线，没有左右边界线</br>


## 解决方案 

table中的单元格样式，无论在column的style里或者theme里，单元格边框相关配置都支持配置为数组，分别代表上右下左四个方向的边框样式</br>


## 代码示例  

```
const option = {
  columns: [
    {
      // ...
      style: {
        cellBorderLineWidth: [1, 0, 1, 0]
        // ...
      }
    }
  ]
  // ...
}</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/NZaXbTuVOotRSixyDQpcYtXVnCd.gif' alt='' width='1698' height='1082'>



完整示例代码（可以粘贴到 [编辑器](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree) 上尝试一下）：</br>
```
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      theme: {
        headerStyle: {
          borderLineWidth: [1, 0, 1, 0]
        },
        bodyStyle: {
          borderLineWidth: [1, 0, 1, 0]
        }
      }
      // theme: VTable.themes.SIMPLIFY
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });</br>
```
## 相关文档

相关api：https://www.visactor.io/vtable/option/ListTable#theme.bodyStyle.borderColor</br>
github：https://github.com/VisActor/VTable</br>



