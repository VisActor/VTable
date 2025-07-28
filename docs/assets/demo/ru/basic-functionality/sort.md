---
category: examples
group: Basic Features
title: Sort
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/sort.gif
order: 3-2
link: basic_function/sort/list_sort
option: ListTable-columns-text#sort
---

# sort

In this example, the columns \["Order ID", "Customer ID", "Quantity", "Sales", "Profit"] are all sorted, click the sorting button to switch the sorting rules, and the sorting results are cached internally. In the case of a large number, the sorting results can be quickly presented.

## Key Configurations

- `columns[x].sort` Set to true to sort by default rules, or set the function form to specify the sorting rules
  sort: (v1: any, v2: any, order: 'desc'|'asc'|'normal') => {
  if (order === 'desc') {
  return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
  }
  return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
  }

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
        width: 'auto',
        sort: true
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto',
        sort: true
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
        width: 'auto',
        sort: true
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return Number(v1) === Number(v2) ? 0 : Number(v1) > Number(v2) ? -1 : 1;
          }
          return Number(v1) === Number(v2) ? 0 : Number(v1) > Number(v2) ? 1 : -1;
        }
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto',
        sort: true
      }
    ];

    const option = {
      records: data,
      columns,
      sortState: {
        field: 'Sales',
        order: 'asc'
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
