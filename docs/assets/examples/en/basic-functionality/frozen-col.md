---
category: examples
group: Basic Features
title: frozen column
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/frozen-col.gif
order: 3-3
link: '/guide/basic_function/frozen_column'
---

# Freeze column

In order to keep these key information columns visible throughout the horizontal scroll, we need to "freeze" these columns.

## critical configuration

*   `allowFrozenColCount`  Optional to freeze the first few columns, the default is 0
*   `frozenColCount`  Initial number of frozen columns, default 0
*   `showFrozenIcon` Whether to display the freeze icon, the default is true

## Code demo

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "caption": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "caption": "Product Name",
        "width": "auto"
    },
    {
        "field": "Category",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "Sub-Category",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "Region",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "caption": "Order Date",
        "width": "auto"
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
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  columns,
  widthMode:'standard',
  allowFrozenColCount: 3,
  frozenColCount: 1,
  showFrozenIcon: true
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## Related Tutorials

[performance optimization](link)
