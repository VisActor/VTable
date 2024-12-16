---
category: examples
group: Animation
title: 轮播动画
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/carousel-animation.gif
link: animation/carousel_animation
---

# 轮播动画

表格显示轮播动画

## 关键配置

- `CarouselAnimationPlugin` 轮播动画插件
  - `rowCount` 一次动画滚动的行数
  - `colCount` 一次动画滚动的列数
  - `animationDuration` 一次滚动动画的时间
  - `animationDelay` 动画间隔时间
  - `animationEasing` 动画缓动函数
  - `replaceScrollAction` 是否替换滚动行为，如果为 true ，每次滚动操作会移动对于的行数/列数

## 代码演示

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
