---
category: examples
group: Basic Features
title: Row Height Mode - Fits Container Width
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-adaptive.png
order: 3-5
link: basic_function/row_height_column_width
option: ListTable#heightMode
---

# Row Height Mode - Fits to Container Height

Table row height fits container height

## Key Configurations

- `heightMode: 'adaptive'`

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
  .then(res => res.json())
  .then(data => {
    data = data.slice(0, 10);
    const columns = [
      {
        field: '230517143221027',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: '230517143221030',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: '230517143221032',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: '230517143221023',
        title: 'Category',
        width: 'auto'
      },
      {
        field: '230517143221034',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: '230517143221037',
        title: 'Region',
        width: 'auto'
      },
      {
        field: '230517143221024',
        title: 'City',
        width: 'auto'
      },
      {
        field: '230517143221029',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: '230517143221042',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: '230517143221040',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: '230517143221041',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      heightMode: 'adaptive'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
