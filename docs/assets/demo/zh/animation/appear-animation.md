---
category: examples
group: Animation
title: 入场动画
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/appear-animation.gif
option: ListTable#animationAppear
---

# 入场动画

初始化表格时显示入场动画

## 关键配置

- `animationAppear`  入场动画的配置
  - `type` 入场动画的类型，目前支持 `all` 和 `one-by-one`两种
  - `direction` 入场动画的方向，目前支持 `row` 和 `column`两种
  - `duration` 单个动画的时长，单位为毫秒，`one-by-one` 时，为一次动画的时长
  - `delay` 动画的延迟，单位为毫秒；`one-by-one` 时为两次动画直接的时间差，`all` 时为所有动画的延迟

## 代码演示

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
  {
        "field": "Category",
        "title": "Category",
        "width": "auto",
    },
    {
        "field": "Sub-Category",
        "title": "Sub-Category",
        "width": "auto",
    },
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto",
    },
    {
        "field": "Region",
        "title": "Region",
        "width": "auto"
    },
    {
        "field": "City",
        "title": "City",
        "width": "auto"
    },
    {
        "field": "Order Date",
        "title": "Order Date",
        "width": "auto"
    },
    {
        "field": "Quantity",
        "title": "Quantity",
        "width": "auto"
    },
    {
        "field": "Sales",
        "title": "Sales",
        "width": "auto"
    },
    {
        "field": "Profit",
        "title": "Profit",
        "width": "auto"
    }
];

const option = {
  records:data.slice(0,20),
  columns,
  widthMode:'standard',
  animationAppear: {
      duration: 300,
      delay: 100,
      type: 'one-by-one', // all
      direction: 'row' // colunm
    }
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
