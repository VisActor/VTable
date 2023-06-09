---
category: examples
group: Basic Features
title: 列宽适应内容
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-autoWidth.png
order: 3-6
---

# 列宽模式-适应内容

指定所有列的宽度大小按内容宽度。

## 关键配置

- `widthMode: 'autoWidth'`

## 代码演示

```javascript livedemo template=vtable
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_list100.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "230517143221027",
        "caption": "Order ID",
        "width": 100
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
  widthMode: 'autoWidth'
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
