---
category: examples
group: Component
title: 滚动条
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/scrollbar.png
order: 8-3
link: '/guide/interaction_and_event/scroll'
---

# 滚动条

该示例战士了滚动条可配样式。

## 关键配置

- `theme.scrollStyle` 设置滚动条的样式

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

  const columns =[
      {
          "field": "Order ID",
          "caption": "Order ID",
          "width": "auto"
      },
      {
          "field": "Customer ID",
          "caption": "Customer ID",
          "width": "auto"
      },
      {
          "field": "Product Name",
          "caption": "Product Name",
          "width": "auto"
      },
      {
          "field": "Category",
          "caption": "Category",
          "width": "auto"
      },
      {
          "field": "Sub-Category",
          "caption": "Sub-Category",
          "width": "auto"
      },
      {
          "field": "Region",
          "caption": "Region",
          "width": "auto"
      },
      {
          "field": "City",
          "caption": "City",
          "width": "auto"
      },
      {
          "field": "Order Date",
          "caption": "Order Date",
          "width": "auto"
      },
      {
          "field": "Quantity",
          "caption": "Quantity",
          "width": "auto"
      },
      {
          "field": "Sales",
          "caption": "Sales",
          "width": "auto"
      },
      {
          "field": "Profit",
          "caption": "Profit",
          "width": "auto"
      }
  ];

  const option = {
    parentElement: document.getElementById(CONTAINER_ID),
    records:data,
    columns,
    widthMode:'standard',
    frozenColCount:1,
    theme:VTable.themes.ARCO.extends({
      scrollStyle: {
        visible:'always',
        scrollSliderColor:'purple',
        scrollRailColor:'#bac3cc',
        hoverOn:false
      }
    })
  };
  const tableInstance = new VTable.ListTable(option);
  window['tableInstance'] = tableInstance;
      })
```

## 相关教程

[性能优化](link)
