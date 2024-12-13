---
category: examples
group: Component
title: 空数据提示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/empty-tip.png
link: components/empty-tip
option: ListTable#emptyTip
---

# 空数据提示

当配置`emptyTip`时，当表格数据为空时，会展示空数据提示，可配置提示文本、提示图标、提示样式等。

## 关键配置

- `emptyTip` 配置空数据提示。 具体可参考：https://www.visactor.io/vtable/option/ListTable#emptyTip

## 代码演示

```javascript livedemo template=vtable
let tableInstance;

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
    width: '200'
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
  columns,
  widthMode: 'standard',
  tooltip: {
    isShowOverflowTextTooltip: true
  },
  emptyTip: {
    text: 'no data records'
  }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
