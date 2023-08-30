---
category: examples
group: Theme
title: Theme - DARK
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/dark.png
order: 6-3
link: '/guide/theme_and_style/theme'
---

# Form Theme - DARK

Dark Theme

## critical configuration

*   `theme` Configure Theme Name or Customize Theme Style
*

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
  records:data,
  columns,
  widthMode:'standard',
  theme:VTable.themes.DARK
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    })
```

## Related Tutorials

[performance optimization](link)
