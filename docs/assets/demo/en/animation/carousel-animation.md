---
category: examples
group: Animation
title: carousel animation
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/carousel-animation.gif
link: animation/carousel_animation
---

# Carousel Animation

Carousel animation in VTable

## Key configuration

- `CarouselAnimationPlugin` carousel animation plugin
  - `rowCount` scroll row count in a carousel animation
  - `colCount` scroll column count in a carousel animation
  - `animationDuration` The duration of a single carousel animation, in milliseconds
  - `animationDelay` The delay of a single carousel animation, in milliseconds
  - `animationEasing` The easing function of a single carousel animation
  - `replaceScrollAction` Whether to replace the scroll action, if true, the scroll action will be replaced by the carousel animation

## Code demonstration

```javascript livedemo template=vtable
// use this for project
// import * as VTable from '@visactor/vtable';
// import * as VTablePlugins from '@visactor/vtable-plugins';

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
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
      records: data.slice(0, 20),
      columns,
      widthMode: 'standard'
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

    const ca = new VTablePlugins.CarouselAnimationPlugin(tableInstance, {
      rowCount: 2,
      replaceScrollAction: true
    });

    ca.play();
  });
```
