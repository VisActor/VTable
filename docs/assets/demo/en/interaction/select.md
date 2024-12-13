---
category: examples
group: Interaction
title: Select cell
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/select.png
link: interaction/select
option: ListTable#keyboardOptions
---

# Select cell

Click on a cell to make a single selection, and drag to make a brush selection.

Hold down ctrl or shift to make multiple selections.

Turn on the shortcut key selectAllOnCtrlA configuration to select all.

Clicking on the header cell will select the entire row or column by default. If you only want to select the current cell, you can set `select.headerSelectMode` to `'cell'`, Or if you only want to select cells in the body, you can set `select.headerSelectMode` to `'body'`..

## Key Configurations

- `keyboardOptions: {
    selectAllOnCtrlA: true,
    copySelected: true
}`
  Enable the ctrl + A optional function and shortcut to copy the selected content.

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
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      keyboardOptions: {
        selectAllOnCtrlA: true,
        copySelected: true
      },
      theme: VTable.themes.ARCO.extends({
        selectionStyle: {
          cellBorderLineWidth: 2,
          cellBorderColor: '#9900ff',
          cellBgColor: 'rgba(153,0,255,0.2)'
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
