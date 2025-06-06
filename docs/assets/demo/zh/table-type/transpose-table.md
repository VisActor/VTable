---
category: examples
group: table-type
title: 转置表格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/transpose.png
order: 1-3
link: table_type/List_table/list_table_transpose
option: ListTable#transpose
---

# 转置表格

转置表格

## 关键配置

- `transpose` 配置是否为转置 默认为 false

## 代码演示

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
      transpose: true,
      widthMode: 'standard',
      defaultRowHeight: 50,
      defaultHeaderColWidth: 200
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
