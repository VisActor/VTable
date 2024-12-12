---
category: examples
group: Custom
title: cell custom style
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-style.png
order: 7-4
link: custom_define/custom_style
option: ListTable#customCellStyle
---

#Cell custom style

Customize the display style of some cells by defining and assigning styles.

## Key configuration

- `customCellStyle` Custom style definition configuration
- `customCellStyleArrangement` Custom style assignment configuration

## Code Demo

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
      customCellStyle: [
        {
          id: 'custom-1',
          style: {
            bgColor: 'red'
          }
        },
        {
          id: 'custom-2',
          style: {
            color: 'green'
          }
        }
      ],
      customCellStyleArrangement: [
        {
          cellPosition: {
            col: 3,
            row: 4
          },
          customStyleId: 'custom-1'
        },
        {
          cellPosition: {
            range: {
              start: {
                col: 3,
                row: 5
              },
              end: {
                col: 4,
                row: 6
              }
            }
          },
          customStyleId: 'custom-2'
        }
      ]
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
