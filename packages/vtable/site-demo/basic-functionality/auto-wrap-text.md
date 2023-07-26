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
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
    },
    {
        "field": "230517143221030",
        "caption": "Customer ID",
    },
    {
        "field": "230517143221032",
        "caption": "Product Name",
    },
    {
        "field": "230517143221023",
        "caption": "Category",
    },
    {
        "field": "230517143221034",
        "caption": "Sub-Category",
    },
    {
        "field": "230517143221037",
        "caption": "Region",
    },
    {
        "field": "230517143221024",
        "caption": "City",
    },
    {
        "field": "230517143221029",
        "caption": "Order Date",
    },
    {
        "field": "230517143221042",
        "caption": "Quantity",
    },
    {
        "field": "230517143221040",
        "caption": "Sales",
    },
    {
        "field": "230517143221041",
        "caption": "Profit",
    }
];

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  columns,
  widthMode:'standard',
  autoWrapText:true,
  autoRowHeight:true,
  defaultColWidth:150,
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
