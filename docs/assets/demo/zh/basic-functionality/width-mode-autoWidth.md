---
category: examples
group: Basic Features
title: 列宽适应内容
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-autoWidth.png
order: 3-6
link: basic_function/row_height_column_width
option: ListTable#widthMode
---

# 列宽模式-适应内容

指定所有列的宽度大小按内容宽度。

## 关键配置

- `widthMode: 'autoWidth'`

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
        width: 100
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
      widthMode: 'autoWidth'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
