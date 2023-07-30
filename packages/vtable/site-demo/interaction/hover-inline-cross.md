---
category: examples
group: Interaction
title: hover行列十字高亮
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/hover-cross.png
order: 4-3
link: '/guide/interaction_and_event/hover_cell'
---

# hover行列十字高亮

鼠标hover到某个单元格，高亮该单元格所在整行及整列。

## 关键配置

- `hover` 配置高亮模式

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
  hover:{
    highlightMode:'cross'
    // enableSingleHighlight: false,
  },
  theme:VTable.themes.ARCO.extends({
      defaultStyle:{
        hover:{
          cellBgColor: '#9cbef4',
          inlineRowBgColor: '#9cbef4',
          inlineColumnBgColor: '#9cbef4',
        },
      },
      bodyStyle:{
        hover:{
          cellBgColor: '#c3dafd',
          inlineRowBgColor: '#c3dafd',
          inlineColumnBgColor: '#c3dafd',
        },
      }
  })
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
