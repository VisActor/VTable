---
title: VTable usage issue: How to make the table automatically calculate column width based only on the content width of the table header</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to make the table automatically calculate column width based only on the content width of the table header</br>


## Problem description

In automatic width mode, you want the width of a column to be determined only by the content width of the header cell and not affected by the content cell.</br>


## Solution

VTable provides `columnWidthComputeMode `configuration for specifying the bounded areas that are involved in content width calculations:</br>
*  'Only-header ': Only the header content is calculated.</br>
*  'Only-body ': Only calculate the content of the body cell.</br>
*  'Normal ': Calculate normally, that is, calculate the contents of the header and body cells.</br>


## Code example

```
const options = {
    //......
    columnWidthComputeMode: 'only-header'
};</br>
```


## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/LJk6bcmw3oJM5DxjJkHch69GnMd.gif' alt='' width='758' height='1048'>

Full sample code (you can try pasting it into the [editor ](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Fdemo%2Ftable-type%2Flist-table-tree)):</br>
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
## Related Documents

Related api: https://www.visactor.io/vtable/option/ListTable # columnWidthComputeMode</br>
github：https://github.com/VisActor/VTable</br>



