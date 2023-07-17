---
category: examples
group: Basic Features
title: 适应容器宽度
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/width-mode-adaptive.png
order: 3-5
link: '/guide/basic_function/row_height_column_width'
---

# 列宽模式-适应容器宽度

表格列宽适应容器宽度

## 关键配置

- `widthMode: 'adaptive'`

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
  widthMode: 'adaptive'
};
const tableInstance = new VTable.ListTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
