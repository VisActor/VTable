---
category: examples
group: Interaction
title: Hover the Line Cross Highlight
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/hover-cross.png
order: 4-3
link: '/guide/interaction_and_event/hover_cell'
---

# Hover the line cross highlight

Hover over a cell and highlight the entire row and column of the cell.

## critical configuration

*   `hover` Configure highlighting mode

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
  hover:{
    highlightMode:'cross'
    // enableSingleHighlight: false,
  },
  theme:VTable.themes.ARCO.extends({
      defaultStyle:{
        hover:{
          cellBgColor: '#9cbef4',
          inlineRowBgColor: '#9cbef4',
          inlineColumnBgColor: '#9cbef4',
        },
      },
      bodyStyle:{
        hover:{
          cellBgColor: '#c3dafd',
          inlineRowBgColor: '#c3dafd',
          inlineColumnBgColor: '#c3dafd',
        },
      }
  })
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
    })
```

## Related Tutorials

[performance optimization](link)
