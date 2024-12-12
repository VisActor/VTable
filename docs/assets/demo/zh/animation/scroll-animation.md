---
category: examples
group: Animation
title: 滚动动画
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/scroll-animation.gif
link: animation/scroll_animation
---

# 滚动动画

通过动画滚动到表格指定区域

## 关键配置

- `animationOption` 滚动动画配置
  - `duration` 动画时长，单位 ms
  - `easing` 动画缓动函数，默认为 `linear`，支持 `linear`, `quadIn`, `quadOut`, `quadInOut`, `quadInOut`, `cubicIn`, `cubicOut`, `cubicInOut`, `quartIn`, `quartOut`, `quartInOut`, `quintIn`, `quintOut`, `quintInOut`, `backIn`, `backOut`, `backInOut`, `circIn`, `circOut`, `circInOut`, `bounceOut`, `bounceIn`, `bounceInOut`, `elasticIn`, `elasticOut`, `elasticInOut`, `sineIn`, `sineOut`, `sineInOut`, `expoIn`, `expoOut`, `expoInOut`
- `scrollToCell({col, row}, animationOption)` 滚动到指定单元格
- `scrollToRow(row, animationOption)` 滚动到指定行
- `scrollToCol(col, animationOption)` 滚动到指定列

## 代码演示

```javascript livedemo template=vtable
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

    setTimeout(() => {
      tableInstance.scrollToCell({ col: 4, row: 5 }, { duration: 500, easing: 'quadIn' });
    }, 2000);
  });
```
