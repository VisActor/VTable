---
category: examples
group: Basic Features
title: 适应容器高度
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-adaptive.png
link: basic_function/row_height_column_width
option: ListTable#heightMode
---

# 行高模式-适应容器高度

表格行高适应容器高度

## 关键配置

- `heightMode: 'adaptive'`

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
  .then(res => res.json())
  .then(data => {
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
        width: 250
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
      autoWrapText: true,
      heightMode: 'autoHeight'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
