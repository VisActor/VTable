---
category: examples
group: Component
title: empty tip
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/empty-tip.png
link: components/empty-tip
option: ListTable#emptyTip
---

# Empty Tip

When `emptyTip` is configured, when the table data is empty, an empty data prompt will be displayed. You can configure the prompt text, prompt icon, prompt style, etc.

## Key Configurations

- `emptyTip` Configure empty data prompt. For details, please refer to: https://www.visactor.io/vtable/option/ListTable#emptyTip

## Code demo

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
