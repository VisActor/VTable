---
category: examples
group: Basic Features
title: 自动换行
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/auto-wrap-text.gif
order: 3-1
link: '/guide/basic_function/auto_wrap_text'
---

# 自动换行

开启了自动换行，当列宽有变化时，文本会根据宽度来自动计算展示内容。在使用此功能时，需要配合开启autoRowHeight，才能将折行文字显示出来。

## 关键配置

- 'autoWrapText:true' 开启自动换行

## 代码演示

```javascript livedemo template=vtable
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Order ID",
        "caption": "Order ID",
    },
    {
        "field": "Customer ID",
        "caption": "Customer ID",
    },
    {
        "field": "Product Name",
        "caption": "Product Name",
    },
    {
        "field": "Category",
        "caption": "Category",
    },
    {
        "field": "Sub-Category",
        "caption": "Sub-Category",
    },
    {
        "field": "Region",
        "caption": "Region",
    },
    {
        "field": "City",
        "caption": "City",
    },
    {
        "field": "Order Date",
        "caption": "Order Date",
    },
    {
        "field": "Quantity",
        "caption": "Quantity",
    },
    {
        "field": "Sales",
        "caption": "Sales",
    },
    {
        "field": "Profit",
        "caption": "Profit",
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  autoWrapText:true,
  heightMode:'autoHeight',
  defaultColWidth:150,
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
