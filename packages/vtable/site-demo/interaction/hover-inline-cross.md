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

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": "auto"
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
        "width": "auto"
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
        "width": "auto"
    },
    {
        "field": "230517143221023",
        "caption": "Category",
        "width": "auto"
    },
    {
        "field": "230517143221034",
        "caption": "Sub-Category",
        "width": "auto"
    },
    {
        "field": "230517143221037",
        "caption": "Region",
        "width": "auto"
    },
    {
        "field": "230517143221024",
        "caption": "City",
        "width": "auto"
    },
    {
        "field": "230517143221029",
        "caption": "Order Date",
        "width": "auto"
    },
    {
        "field": "230517143221042",
        "caption": "Quantity",
        "width": "auto"
    },
    {
        "field": "230517143221040",
        "caption": "Sales",
        "width": "auto"
    },
    {
        "field": "230517143221041",
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
