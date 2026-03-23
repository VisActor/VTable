---
category: examples
group: Interaction
title: Scrollbars In Frozen Areas
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/scroll-frozen.gif
link: interaction/scroll-frozen
option: ListTable#scrollFrozenCols
---

# Scrollbars In Frozen Areas

This example shows horizontal scrolling inside frozen areas (both left and right) when the total width of frozen columns exceeds the maximum frozen width.

## Key Options

- `frozenColCount` / `rightFrozenColCount` set left/right frozen columns count
- `maxFrozenWidth` / `maxRightFrozenWidth` set the maximum frozen area width
- `scrollFrozenCols` / `scrollRightFrozenCols` enable horizontal scrolling inside frozen areas
- `theme.scrollStyle.visible` can be used to observe scrollbar visibility behavior across multiple scrollable regions (e.g. `scrolling` / `focus`)

## Code

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
