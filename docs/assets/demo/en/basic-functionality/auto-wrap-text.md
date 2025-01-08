---
category: examples
group: Basic Features
title: Line Wrapping
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/auto-wrap-text.gif
order: 3-1
link: basic_function/auto_wrap_text
option: ListTable#autoWrapText
---

# line wrapping

Auto-wrap is turned on. When the column width changes, the text will automatically calculate the display content according to the width. When using this function, you need to set `heightMode: 'autoHeight'` to display the wrapped text.

## Key Configurations

- 'AutoWrapText: true 'Enable line wrapping

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID'
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
      defaultColWidth: 150
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
