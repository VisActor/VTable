---
title: 7. VTable usage issue: How to obtain the total number of rows in a table and the actual height of the content</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to get the total number of rows in the table and the actual height of the content</br>


## Problem Description

How to obtain the total number of rows in the current table and the actual height of the content from the table instance through the API</br>


## Solution 

1. 1. The `colCount` and `rowCount` attributes in the table instance can obtain the number of rows and columns of the current table.</br>
1. The table example provides methods `getAllRowsHeight` and `getAllColsWidth`, which can obtain the total column width and total row height of the current table content.</br>


## Code example

```
const tableInstance = new VTable.ListTable(container, option);

console.log(tableInstance.colCount);
console.log(tableInstance.rowCount);
console.log(tableInstance.getAllRowsHeight());
console.log(tableInstance.getAllColsWidth());</br>
```
## Results display 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/BkY5bNB5IoJy9fxfzXrcR2CRnud.gif' alt='' width='1662' height='1044'>

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MS4wbCflioPjNBxiGoMcHeGQnng.gif' alt='' width='246' height='152'>

Complete sample code (you can paste it into the [editor](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree) to try it out):</br>
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
## Related documents

Related API：</br>
https://www.visactor.io/vtable/api/Properties#rowCount</br>
https://www.visactor.io/vtable/api/Properties#colCount</br>
https://www.visactor.io/vtable/api/Methods#getAllColsWidth</br>
https://www.visactor.io/vtable/api/Methods#getAllRowsHeight</br>
github：https://github.com/VisActor/VTable</br>



