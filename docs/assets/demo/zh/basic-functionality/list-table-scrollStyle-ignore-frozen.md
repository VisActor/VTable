---
category: examples
group: Basic Features
title: 滚动条
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/auto-wrap-text.gif
link: basic_function/list_table_scrollStyle_ignore_frozen
option: ListTable#theme#scrollStyle
---

# 滚动条忽略冻结列宽度

滚动条忽略冻结列宽度。

## 关键配置

- theme.scrollStyle.ignoreAllFrozen: true 忽略所有冻结列宽度
- theme.scrollStyle.ignoreLeftFrozen: true 忽略左侧冻结列宽度
- theme.scrollStyle.ignoreRightFrozen: true 忽略右侧冻结列宽度

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
        width: 300
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
      defaultColWidth: 350,
      rightFrozenColCount: 2,
      frozenColCount:1,
      theme:VTable.themes.DEFAULT.extends({
        scrollStyle:{
          visible: 'always',
          width: 12,
          barToSide: true,
          scrollRailColor: "rgba(228, 231, 237, .1)",
          ignoreAllFrozen: true,
          // ignoreLeftFrozen: true,
          // ignoreRightFrozen: true,
        },
      })
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
