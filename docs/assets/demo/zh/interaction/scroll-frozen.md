---
category: examples
group: Interaction
title: 冻结区域滚动条
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/scroll-frozen.gif
link: interaction/scroll-frozen
option: ListTable#scrollFrozenCols
---

# 冻结区域滚动条

该示例展示了当冻结区域的列宽总和超过最大冻结宽度时，开启冻结区域内部横向滚动的效果（左冻结与右冻结）。

## 关键配置

- `frozenColCount` / `rightFrozenColCount` 设置左右冻结列数
- `maxFrozenWidth` / `maxRightFrozenWidth` 设置左右冻结区域最大宽度
- `scrollFrozenCols` / `scrollRightFrozenCols` 开启冻结区域内部横向滚动
- `theme.scrollStyle.visible` 可配合观察滚动条在多滚动区域下的显隐行为（如 `scrolling` / `focus`）

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      { field: 'Order ID', title: 'Order ID', width: 160 },
      { field: 'Customer ID', title: 'Customer ID', width: 160 },
      { field: 'Product Name', title: 'Product Name', width: 220 },
      { field: 'Category', title: 'Category', width: 140 },
      { field: 'Sub-Category', title: 'Sub-Category', width: 160 },
      { field: 'Region', title: 'Region', width: 120 },
      { field: 'City', title: 'City', width: 140 },
      { field: 'Order Date', title: 'Order Date', width: 140 },
      { field: 'Region', title: 'Region', width: 120 },
      { field: 'City', title: 'City', width: 140 },
      { field: 'Order Date', title: 'Order Date', width: 140 },
      { field: 'Quantity', title: 'Quantity', width: 120 },
      { field: 'Sales', title: 'Sales', width: 120 },
      { field: 'Profit', title: 'Profit', width: 120 },
      { field: 'Segment', title: 'Segment', width: 140 },
      { field: 'Ship Mode', title: 'Ship Mode', width: 140 }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      frozenColCount: 4,
      rightFrozenColCount: 4,
      maxFrozenWidth: 320,
      maxRightFrozenWidth: 320,
      scrollFrozenCols: true,
      scrollRightFrozenCols: true,
      overscrollBehavior: 'none'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
