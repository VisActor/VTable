---
category: examples
group: Basic Features
title: 自动换行
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/auto-wrap-text.gif
order: 3-1
link: basic_function/auto_wrap_text
option: ListTable#autoWrapText
---

# 自动换行

开启了自动换行，当列宽有变化时，文本会根据宽度来自动计算展示内容。在使用此功能时，需要配合设置 `heightMode: 'autoHeight'`，才能将折行文字显示出来。

## 关键配置

- 'autoWrapText:true' 开启自动换行

## 代码演示

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
