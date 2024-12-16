---
category: examples
group: Interaction
title: Select Highlight Effect
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/select-highlight.png
link: interaction/select
option: ListTable#select
---

# Select the cell row to highlight the effect

Click on the cell, the entire row or column will be highlighted when the cell is selected. If more than one cell is selected, the highlight effect will disappear.

The highlighted style can be configured in the style. Global configuration: `theme.selectionStyle`, or it can be configured separately for the header and body. For specific configuration methods, please refer to the tutorial.

## Key Configurations

- `select: {
  highlightMode: 'cross'
}`

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
      select: {
        highlightMode: 'cross'
      },
      theme: VTable.themes.ARCO.extends({
        selectionStyle: {
          cellBgColor: 'rgba(130, 178, 245, 0.2)',
          cellBorderLineWidth: 2,
          inlineRowBgColor: 'rgb(160,207,245)',
          inlineColumnBgColor: 'rgb(160,207,245)'
        },
        headerStyle: {
          select: {
            inlineRowBgColor: 'rgb(0,207,245)',
            inlineColumnBgColor: 'rgb(0,207,245)'
          }
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
