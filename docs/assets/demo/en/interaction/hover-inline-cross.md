---
category: examples
group: Interaction
title: Hover the Line Cross Highlight
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/hover-cross.png
order: 4-3
link: interaction/hover_cell
option: ListTable#hover.highlightMode('cross'%7C'column'%7C'row'%7C'cell')%20=%20'cross'
---

# Hover the line cross highlight

Hover over a cell and highlight the entire row and column of the cell.

## Key Configurations

- `hover` Configure highlighting mode

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
      hover: {
        highlightMode: 'cross'
        // enableSingleHighlight: false,
      },
      theme: VTable.themes.ARCO.extends({
        defaultStyle: {
          hover: {
            cellBgColor: '#9cbef4',
            inlineRowBgColor: '#9cbef4',
            inlineColumnBgColor: '#9cbef4'
          }
        },
        bodyStyle: {
          hover: {
            cellBgColor: '#c3dafd',
            inlineRowBgColor: '#c3dafd',
            inlineColumnBgColor: '#c3dafd'
          }
        }
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
