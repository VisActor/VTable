---
title: VTable usage issue: How to set only one column to not be selected for operation</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to set only one column that cannot be selected for operation</br>


## Problem description

How to click a cell in a column of a table without selecting it?</br>


## Solution

VTable provides `disableSelect `and `disableHeaderSelect `configurations in the `column `:</br>
*  DisableSelect: The content of this column is partially disabled</br>
*  disableHeaderSelect: Disable the selection of the header section of the list</br>


## Code example

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
## Related Documents

Related api: https://www.visactor.io/vtable/option/ListTable-columns-text#disableSelect</br>
github：https://github.com/VisActor/VTable</br>



