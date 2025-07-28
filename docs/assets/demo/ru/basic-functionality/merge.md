---
category: examples
group: Basic Features
title: Merge Cells
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/merge.png
option: ListTable-columns-text#mergeCell
---

# Merge cells

Automatically merge cells with the same content through configuration

## Key Configurations

*   `mergeCell`  Merge adjacent cells with the same content in the same column

## Code demo

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Category",
        "title": "Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
        style:{
          "textStick":true,
          textAlign:'right'
          // textBaseline:"bottom"
        }
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto",
        sort:true,
        "mergeCell": true,
    },
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
        "width": "auto",
        headerStyle:{
          "textStick":true,
        }
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
  widthMode:'standard',
  hover:{
    highlightMode:'row'
  },
  sortState:{
    field:'Category',
    order:'asc'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    })
```
