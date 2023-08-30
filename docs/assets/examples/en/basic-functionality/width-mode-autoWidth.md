---
category: examples
group: Basic Features
title: Column Width Mode - Adapt to Content
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-autoWidth.png
order: 3-6
link: '/guide/basic_function/row_height_column_width'
---

# Column Width Mode - Adapt to Content

Specifies the width size of all columns by content width.

## critical configuration

*   `widthMode: 'autoWidth'`

## Code demo

```javascript livedemo template=vtable
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "caption": "Order ID",
        "width": 100
    },
    {
        "field": "Customer ID",
        "caption": "Customer ID",
    },
    {
        "field": "Product Name",
        "caption": "Product Name",
    },
    {
        "field": "Category",
        "caption": "Category",
    },
    {
        "field": "Sub-Category",
        "caption": "Sub-Category",
    },
    {
        "field": "Region",
        "caption": "Region",
    },
    {
        "field": "City",
        "caption": "City",
    },
    {
        "field": "Order Date",
        "caption": "Order Date",
    },
    {
        "field": "Quantity",
        "caption": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "caption": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "caption": "Profit",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode: 'autoWidth'
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    })
```

## Related Tutorials

[performance optimization](link)
