---
category: examples
group: Basic Features
title: Ignore frozen column width
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/auto-wrap-text.gif
link: basic_function/list_table_scrollStyle_ignore_frozen
option: ListTable#theme#scrollStyle
---

# Ignore frozen column width

Ignore frozen column width.

## Key configurations

- theme.scrollStyle.ignoreAllFrozen: true Ignore all frozen column width
- theme.scrollStyle.ignoreLeftFrozen: true Ignore left frozen column width
- theme.scrollStyle.ignoreRightFrozen: true Ignore right frozen column width

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 300
      },
      {
        field: 'Customer ID',
        title: 'Customer ID'
      },
      {
        field: 'Product Name',
        title: 'Product Name'
      },
      {
        field: 'Category',
        title: 'Category'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category'
      },
      {
        field: 'Region',
        title: 'Region'
      },
      {
        field: 'City',
        title: 'City'
      },
      {
        field: 'Order Date',
        title: 'Order Date'
      },
      {
        field: 'Quantity',
        title: 'Quantity'
      },
      {
        field: 'Sales',
        title: 'Sales'
      },
      {
        field: 'Profit',
        title: 'Profit'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      autoWrapText: true,
      heightMode: 'autoHeight',
      defaultColWidth: 350,
      rightFrozenColCount: 2,
      frozenColCount:1,
      theme:VTable.themes.DEFAULT.extends({
        scrollStyle:{
          visible: 'always',
          width: 12,
          barToSide: true,
          scrollRailColor: "rgba(228, 231, 237, .1)",
          ignoreAllFrozen: true,
          // ignoreLeftFrozen: true,
          // ignoreRightFrozen: true,
        },
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
