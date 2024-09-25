---
title: VTable usage issue: How to listen to table area selection and cancellation events</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to listen to the table area selection cancellation event</br>


## Problem description

Hope to be able to select and cancel events through events (click other areas of the table or click outside the table).</br>


## Solution

VTable provides `**SELECTED_CLEAR **`events that are triggered after an operation is deselected (and there are no selected areas in the current chart area)</br>


## Code example

```
const tableInstance = new VTable.ListTable(option);
tableInstance.on(VTable.ListTable.EVENT_TYPE.SELECTED_CLEAR, () => {
    console.log("selected clear!");
});</br>
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
## Related Documents

Related api: https://www.visactor.io/vtable/api/events#SELECTED_CLEAR</br>
github：https://github.com/VisActor/VTable</br>



